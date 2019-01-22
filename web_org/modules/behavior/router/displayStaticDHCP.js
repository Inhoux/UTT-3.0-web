define(function(require, exports, module) {
	// 存储本页面一些变量
	var DATA = {};
	function tl(str){
    	return require('Translate').getValue(str,['common','error','doDhcpServer']);
  	} 

	function addBtnClick() {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		// 模态框配置数据
		var modalList = {
			"id": "modal-add",
			"title": "{add}",
			"btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                    var $modal = $this.parents('.modal');
	                    addSubmitClick($modal);
	                }
	            },
	            {
	                "type"      : 'reset'
	             }
	             ,
	            {
	                "type"      : 'close'
	            }
        	]
		};
		// 获得模态框的html
		var modalobj = Modal.getModalObj(modalList),
		$modal = modalobj.getDom(); // 模态框的jquery对象
		DATA.modalobj=modalobj;
		$('body').append($modal);
		// 模态框中输入框组的配置数据
		//var poolName = data["poolName"];
		var items = [];
		var newArr = DATA["vlanData"][0][0];
		newArr.forEach(function(str){
			var obj = {};
			obj.value = str;
			obj.name  = str;
			items.push(obj);
		});

		var rootid = '0';
	 	var groupItems = [];
	 	var counts = 0;
	 	var allDatas = DATA.allDatas;
	 	searchingGroup(rootid,counts);
	 	function searchingGroup(id,counts){
	 		allDatas.forEach(function(obj,i){
		 		if(obj.objType == 0 && obj.pid == id){
		 			var thisid = obj.id;
		 			var thisname = '';
		 			for(var ic = 0;ic<counts;ic++){
		 				thisname += '-';
		 			}
		 			thisname += obj.name;
		 			groupItems.push({name:thisname,value:thisid});
		 			var newCounts = counts+1;
		 			searchingGroup(thisid,newCounts);
		 		}
		 	});
	 	}
		var inputList = [
			{
		        "prevWord": '{poolName}',
		        "inputData": {
		            "type": 'select',
		            "name": 'pools',
		            "items" : items,
		        },
		        "afterWord": ''
		    },
		    
			
			{
		        "prevWord": '{dhcpGroup}',
		        "necessary": true,
		        "inputData": {
		            "type": 'select',
		            "name": 'pid',
		            "items" : groupItems,
		        },
		        "afterWord": ''
		    },
		    {
			 	"necessary": true,
				"prevWord": '{username}',
				"inputData": {
					"type": 'text',
					"name": 'UserName',
					"checkDemoFunc": ['checkInput', 'name', '1', '31', '5']
				},
				"afterWord": ''
			},
			{
				"necessary": true,
				"prevWord": '{ip}',
				"inputData": {
					"type": 'text',
					"name": 'IP',
					"checkFuncs" : ['checkIP']
					//"checkFunc": 'checkLanIP'
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{mac}',
				"inputData": {
					"type": 'text',
					"name": 'Mac',
					"checkFuncs" : ['checkMac']
					//"checkFunc": 'checkLanIP'
				},
				"afterWord": ''
			}, 
		];
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		// 将输入框组放入模态框中
		$modal.find('.modal-body').empty().append($dom);
		// 显示模态框
		$('body').append($modal);

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common', 'lanConfig', 'doDhcpServer'];
		Translate.translate(tranDomArr, dicArr);

		$modal.modal('show');
	}

	function addSubmitClick($modal) {
		// 加载序列化模块
		var Serialize = require('Serialize');
		// 获得用户输入的数据
		var queryArrs = Serialize.getQueryArrs($modal);
		addStaticDhcp(queryArrs, $modal);
	}

	function addStaticDhcp(queryArrs, $modal) {
		var InputGroup = require('InputGroup');
		var Tips = require('Tips');
		
		var len = InputGroup.checkErr($modal);
		if(len > 0)
		{
//			Tips.showError('{NoSave}');
			return;
		}
		var Serialize = require('Serialize');
		// 将查询字符串数组转化为字符串
		var queryStr = Serialize.queryArrsToStr(queryArrs);
		var queryJson = Serialize.queryStrsToJson(queryStr);
		if(queryJson.pid===undefined){
			Tips.showError('{gotoUserMgmtCreate}');
			return;
		}
		queryJson.Mac = queryJson.Mac.replace(/-/g, "");
		queryJson.Mac = queryJson.Mac.replace(/:/g, "");
		queryStr = Serialize.queryJsonToStr(queryJson);
		
		// 向后台发送数据，进行新增操作
		queryStr = queryStr + '&' + 'Action=add';
		$.ajax({
			url: '/goform/formDhcpListStatic',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				// 执行返回的JS代码
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'];
				var result = doEval.doEval(codeStr, variableArr);
				var isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					var isSuccessful = data["status"];
					// 判断修改是否成功
					if (isSuccessful) {
						// 显示成功信息
						Tips.showSuccess('{saveSuccess}');
						// 刷新页面
						DATA.modalobj.hide();
						display($('#2'));
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showError('{saveFail}');
						}else{
							Tips.showError(errorstr);
						}
					}
				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}

	function deleteBtnClick() {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		// 获得表格中所有被选中的选择框，并获取其数量
		var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey'),
			length = primaryKeyArr.length;
		// 判断是否有被选中的选择框
		if (length > 0) {
			require('Tips').showConfirm(tl('delconfirm'),function(){
				var lanArr = []; 
				var str = '';
				primaryKeyArr.forEach(function(primaryKey) {
					var data = database.getSelect({
						primaryKey: primaryKey
					});
					var name = data[0]["user"];
					str += name + ',';
				});
				if(str != ''){
					str = str.substr(0, str.length - 1);
					str = 'delstr=' + str;
					// require('Tips').showConfirm(tl('delconfirm'),function(){
						$.ajax({
							url: '/goform/formDhcpListStaticDel',
							type: 'POST',
							data: str,
							success: function(result) {
								var doEval = require('Eval');
								var codeStr = result,
									variableArr = ['status', 'errorstr'],
									result = doEval.doEval(codeStr, variableArr),
									isSuccess = result["isSuccessful"];
								// 判断代码字符串执行是否成功
								if (isSuccess) {
									var data = result["data"],
										status = data['status'];
									if (status) {
										// 提示成功信息
										Tips.showSuccess('{delSuccess}');
										display($('#2'));
									} else {
										var errorstr=data.errorstr;
										if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
											Tips.showError('{delFail}');
										}else{
											Tips.showError(errorstr);
										}
									    display($('#2'));
                                    }
								} else {
									Tips.showError('{parseStrErr}');
								}
							}
						});
					// });
				}
			});
		} else {
			Tips.showWarning('{unSelectDelTarget}');
		}
	}

	function settingBtnClick() {
		var Dispatcher = require('Dispatcher');
		var hash = '#/network_config/LAN_config/setting';
		Dispatcher.changeHash(hash);
	}


	function changeStatus(data, $target) {
		var isOpen = (data["kaiqi"] == '0') ? 'on' : 'off';
		//获得提示框组件调用方法
		var Tips = require('Tips');
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');
		// 查询字符串二维数组
		var queryArr = [
			['poolName', data["poolName"]],
			['DhcpEnable', isOpen],
			['poolVid', data["yewuvlan"]],
			['dhcpStart', data["beginIp"]],
			['dhcpEnd', data["endIp"]],
			['dhcpMask', data['netMask']],
			['dhcpPriDns', data['zhuDns']],
			['dhcpSecDns', data['fuDns']],
			['dhcpGateway', data['gateway']],
			['dhcpLease', data['zuTime']],
			['flag', 'xxxxxx'] //xxxxxx为dhcpenable的flag
		];
		// 调用序列化模块的转换函数，将数组转换为查询字符串
		var queryStr = Serialize.queryArrsToStr(queryArr);
		// 向后台发送请求
		$.ajax({
			url: '/goform/formDhcpPoolConfig',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					// 后台修改成功
					if (status) {
						// 显示成功信息
						var successMsg = (isOpen == 'off') ? '{closeSuccess}' : '{openSuccess}';
						Tips.showSuccess(successMsg);
						display($('#2'));
					} else {
							var errorstr=data.errorstr;
							if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
								Tips.showError('{oprtFail}');
							}else{
								Tips.showWarning(errorstr);
							}	
					}

				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}

	function editBtnClick(data, $target) {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": "modal-edit",
			"title": "{edit}",
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){
		                
		                var $modal = $('#modal-edit');
		                editSubmitClick($modal, data);
		            }
		        },
		        {
		            "type"      : 'reset'
		         }
		         ,
		        {
		            "type"      : 'close'
		        }
		    ]
		};
		// 获得模态框的html
		var modalobj = Modal.getModalObj(modalList),
		$modal = modalobj.getDom(); // 模态框的jquery对象
		DATA.modalobj=modalobj;
		$('body').append($modal);
		var user = data["user"],
			 pool = data["pool"],
			 vid = data["vid"],
			 ip = data["ip"],
			 mac = data["mac"],
			 note = data["note"],
			 pid = data["pid"];
		var items = [];
		var newArr = DATA["vlanData"][0][0];
		newArr.forEach(function(str){
			var obj = {};
			obj.value = str;
			obj.name  = str;
			items.push(obj);
		});

		var rootid = '0';
	 	var groupItems = [];
	 	var counts = 0;
	 	var allDatas = DATA.allDatas;
	 	searchingGroup(rootid,counts);
	 	function searchingGroup(id,counts){
	 		allDatas.forEach(function(obj,i){
		 		if(obj.objType == 0 && obj.pid == id){
		 			var thisid = obj.id;
		 			var thisname = '';
		 			for(var ic = 0;ic<counts;ic++){
		 				thisname += '-';
		 			}
		 			thisname += obj.name;
		 			groupItems.push({name:thisname,value:thisid});
		 			var newCounts = counts+1;
		 			searchingGroup(thisid,newCounts);
		 		}
		 	});
	 	}
		var inputList = [
			{
		        "prevWord": '{poolName}',
		        "inputData": {
		            "type": 'select',
		            "name": 'pools',
		            "items" : items,
		            "defaultValue" : pool,
		            // "checkDemoFunc" : ['checkName','1','10']
		        },
		        "afterWord": ''
		    }, 
		    {
		        "prevWord": '{genusGroup}',
		        "inputData": {
		            "type": 'select',
		            "name": 'pid',
		            "items" : groupItems,
		            "defaultValue" : pid,
		        },
		        "afterWord": ''
		    },    
			{
			 	"necessary": true,
				"prevWord": '{dhcpUser}',
				"inputData": {
					"type": 'text',
					"name": 'UserName',
					"value": user,
					"checkDemoFunc": ['checkInput', 'name', '1', '31', '5'] 
				},
				"afterWord": ''
			},
			{
			 	
				"prevWord": '',
				"display": false,
				"inputData": {
					"type": 'text',
					"name": 'dhcpVid',
					"value": vid,
				},
				"afterWord": ''
			},			
			{
				"necessary": true,
				"prevWord": '{dhcpIp}',
				"inputData": {
					"type": 'text',
					"name": 'IP',
					"value": ip,
					// "checkFuncs" : ['checkIP']
					"checkDemoFunc": ['checkInput', 'ip', '1', '1']
				},
				
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{dhcpMac}',
				"inputData": {
					"type": 'text',
					"name": 'Mac',
					"value": mac,
				},
			
				"afterWord": ''
			} 
		];
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		$modal.find('.modal-body').empty().append($dom);

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common', 'lanConfig', 'doDhcpServer'];
		Translate.translate(tranDomArr, dicArr);

		$modal.modal('show');
	}
	function editDhcpPool($modal, data){
		var InputGroup = require('InputGroup');
		var Tips = require('Tips');
		var len = InputGroup.checkErr($modal);
		if(len > 0){
//			Tips.showError('{NoSave}');
			return;
		}	
		// 引入serialize模块
		var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal);
		var	queryJson = Serialize.queryArrsToJson(queryArr);
			queryJson.Mac = queryJson.Mac.replace(/-/g, "");
			queryJson.Mac = queryJson.Mac.replace(/:/g, "");
			queryStr = Serialize.queryJsonToStr(queryJson);
		queryStr = queryStr + '&' + 'Action=modify' +'&'+'UserNameold=' + data["user"];
		$.ajax({
			url: '/goform/formDhcpListStatic',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					if (status) 
					{
						// 显示成功信息
						Tips.showSuccess('{saveSuccess}');
						DATA.modalobj.hide();
						display($('#2'));
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showError('{saveFail}');
						}else{
							Tips.showWarning(errorstr);
						}	
					}
				}
			}
		});
	}

	function editSubmitClick($modal, data) {
		editDhcpPool($modal, data);
	}	

	function removeDhcpPool(data, $target) {
		var poolName = data["user"];
		var queryStr = 'delstr=' + poolName;
		var Tips = require('Tips');
		require('Tips').showConfirm(tl('delconfirm'),function(){
			$.ajax({
				url: '/goform/formDhcpListStaticDel',
				type: 'POST',
				data: queryStr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						returnStr = ['status', 'errorstr'],
						result = doEval.doEval(codeStr, returnStr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"],
							status = data['status'];
						if (status) {
							Tips.showSuccess('{delSuccess}');
							display($('#2'));
						} else {
							var errorstr=data.errorstr;
							if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
								Tips.showError('{delFail}');
							}else{
								Tips.showError(errorstr);
							}
						}

					} else {
						Tips.showError('{parseStrErr}');
					}
				}
			});
		});
	}

	function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		//var fieldArr = ['poolName', 'kaiqi', 'yewuvlan', 'beginIp', 'endIp', 'netMask','gateway', 'zhuDns', 'fuDns', 'zuTime'];
		var fieldArr =['user','pool','vid','ip','mac','note','pid'];
		//var fieldArr = ['mingcheng', 'ip', 'mask', 'vlanid', 'isOpen'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}
	function storeDhcpData(data) {
		data.forEach(function(item, index){
			item.unshift(index + 1);
		});
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		DATA["poolServeData"] = database;
		var fieldArr =['user','pool','vid','ip','mac','note','pid'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}
	function processData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = 
			[	'titles1','pool', 
				'FixIPs', 'FixMacs',
				'FixNotes','FixUserNames',
				'FixVids','poolVids','allDatas','pids' 
			];			
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			//var titleArr = data["titles1"], // 表格头部的标题列表
			var	pool = data["pool"],
				FixIPs = data["FixIPs"],
				FixMacs = data["FixMacs"],
				FixNotes = data["FixNotes"],
				FixUserNames = data["FixUserNames"],
				poolVids = data["poolVids"],
				allDatas = data["allDatas"],
				pids = data["pids"],
				FixVids = data["FixVids"];

			DATA.allDatas = allDatas;
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据

			// 通过数组循环，转换vlan数据的结构
			pool.forEach(function(item, index, arr) {
				var arr = [];
				//arr.push(Number(index)+1);
				arr.push(FixUserNames[index]);
				arr.push(pool[index]);
				arr.push(poolVids[index]);
				//arr.push(FixVids[index]);
				arr.push(FixIPs[index]);
				arr.push(FixMacs[index]);
				arr.push('FixNotes');
				arr.push(pids[index]);
				dataArr.push(arr);
			});
			// 返回处理好的数据
			var tableData = {
				//title: titleArr,
				data: dataArr
			};
			
			var dhcpData = [
				[FixUserNames,FixIPs, FixVids,FixMacs, pool,FixNotes,poolVids],
			];
			
			return {
				table: tableData,
				dhcpData: dhcpData,
			};
		} else {
			Tips.showError('{parseStrErr}');
		}
	}

	function getTableDom() {
		// 表格上方按钮配置数据
		var btnList = [{
			"id": "add",
			"name": "{add}",
			"clickFunc" : function($btn){
            	addBtnClick();
        	}
		}, {
			"id": "delete",
			"name": "{delete}",
			"clickFunc" : function($btn){
            	deleteBtnClick();
        	}
		}, 
/*		    
		    {
			"id": "input",
			"name": "{dhcpImport}",
			"clickFunc" : function($btn){
            	makedownloadModal();
        	}
		}
		*/
		];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			"dicArr" : ['common','lanConfig', 'doDhcpServer'], 
			"titles": {
				//"ID" : "id",	
				"{dhcpUser}"		 : {
					"key": "user",
					"type": "text"
				},
				"{poolName}"		 : {
					"key": "pool",
					"type": "text"
				},	
				// "VID"		 : {
				// 	"key": "vid",
				// 	"type": "text"
				// },								
				"{dhcpIp}"		 : {
					"key": "ip",
					"type": "text"
				},	
				"{dhcpMac}"		 : {
					"key": "mac",
					"type": "text"
				},	
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								editBtnClick(data[0],$this);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								removeDhcpPool(data[0], $this);
							}
						}
					]
				}
			}
		};
		// 表格组件配置数据
		var list = {
			head: headData,
			table: tableList
		};
		// 加载表格组件，获得表格组件对象，获得表格jquery对象
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		return $table;
	}
	function makedownloadModal(){
		var modaobj;
				var modalList = {
						"id": "",
						"size":'normal',
						"title": "{dhcpBulkImport}",
						"btns" : [
							{
								"type"      : 'save',
								"clickFunc" : function($this){
									// $this 代表这个按钮的jQuery对象，一般不会用到
									var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
									if(/.*[\u4e00-\u9fa5]+.*$/.test(thisfilename)) 
									{ 
										require('Tips').showWarning(tl('fileNameCanBeChinese')); 
										return false; 
									}
									var $modal = $this.parents('.modal');
									if($modal.find('[name="filename"]').val() === null){
										require('Tips').showWarning('尚未选择上传的文件');
										return ;
									}
									var Tips = require('Tips');
									var formData = new FormData($modal.find('[name="uploadform"]')[0]);  
								     $.ajax({  
								          url: '/goform/formDhcpListStaticImport' ,  
								          type: 'POST',  
								          data: formData,   
								          cache: false,  
								          contentType: false,  
								          processData: false,  
											success: function(result) {
												
												var doEval = require('Eval');
												var codeStr = result,
													variableArr = ['status', 'errorstr'],
													result = doEval.doEval(codeStr, variableArr),
													isSuccess = result["isSuccessful"];
												// 判断代码字符串执行是否成功
												if (isSuccess) {
													var data = result["data"],
														status = data['status'];
													if (status) {
														// 显示成功信息
														Tips.showSuccess('上传成功')
														modaobj.hide();
														$('[href="#2"]').trigger('click');
														
													} else {
														Tips.showWarning(data.errorstr)				
														
													}
												} else {
													Tips.showWarning('{parseStrErr}');
												}
											}
								     });

								}
							},
							{
								"type"      : 'reset'
							},
							{
								"type"      : 'close'
							}
						]
					};
				var inputList = [
					{
						"prevWord": '{dhcpSelectFile}',
						"inputData": {
							"type": 'text',
							"name": 'fileSrc'
						},
						"afterWord": ''
					},
					{
						"prevWord": '',
						"inputData": {
							"type": 'link',
							"items":[
								{
									"name":'{dhcpDownloadTemplate}',
									"id":'downloadLink'
								}
							]
						},
						"afterWord": ''
					}
				];
				//获得弹框对象
				var Modal = require('Modal');
				modaobj = Modal.getModalObj(modalList),
				$modal = modaobj.getDom();
				//获得输入组对象
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				//添加到指定位置
				$modal.find('.modal-body').empty().append($dom);
				$('body').append($modal);
				var btnslist = [
				{
					"name":'{dhcpSelectFile1}',
					"id":'chooseFile',
					"clickFunc":function($this){
						
					}				
				}
				];
				InputGroup.insertBtn($dom,'fileSrc',btnslist);
				var $flie = $('<form style="display:none" action="/goform/" method="post" name="uploadform" enctype="multipart/form-data"><input name="filename" type="file"></form>');

				$dom.append($flie);


				$dom.find('#chooseFile').click(function(){
					$flie.find('[name="filename"]').click();
				});
				$dom.find('[name="filename"]').change(function(){
					$dom.find('[name="fileSrc"]').val($(this).val());
				});
				
				$dom.find("#downloadLink").click(function(){
					var $btn=$(this);
					if($btn.next().attr('name') == 'Device_Config'){
						$btn.next().remove();
					}
					var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
					$btn.after($afterdom);
					$afterdom[0].action ="/goform/formDhcpListStaticExportTemplate";
					$afterdom[0].submit(); 
				})	
				
				var Translate  = require('Translate');
				var tranDomArr = [$modal];
				var dicArr     = ['common', 'lanConfig', 'doDhcpServer'];
				Translate.translate(tranDomArr, dicArr);

				modaobj.show();
				
			}
 	function processVlanData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = ['titles1','poolNames'];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = data["titles1"], // 表格头部的标题列表
				poolNames = data["poolNames"];

			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据

			// 通过数组循环，转换vlan数据的结构
			poolNames.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(poolNames[index]);
				dataArr.push(arr);
			});
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
			var vlandata = [
				[poolNames]
			];
			
			return {
				//table: tableData,
				vlandata: vlandata,
			};
		} else {
			Tips.showError('{parseStrErr}');
		}
	}	
	function displayTable($container) {
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		//向后台发送请求，获得表格数据
		$.ajax({
			url: 'common.asp?optType=staticDhcp|Organization',
			type: 'GET',
			success: function(result) {
				// 将后台数据处理为数据表格式的数据
				var data = processData(result),
					tableData = data["table"];
					dhcpData  = data["dhcpData"];
				
				var	tableArr  = tableData["data"];
				storeTableData(tableArr);
				// 将lan数据存入数据表
				storeDhcpData(dhcpData);
				// 获得表格Dom
				var $table = getTableDom();
				// 将表格放入页面
				$tableCon.append($table);
				
			}
		});
		$.ajax({
			url: 'common.asp?optType=dhcpServerConfig',
			type: 'GET',
			success: function(result) {
				// 将后台数据处理为数据表格式的数据
				var data = processVlanData(result),
					//tableData = data["table"];
					vlandata  = data["vlandata"];

				DATA["vlanData"] = vlandata;
			}
		});
	}

	function display($container) {	
	var Translate = require('Translate'); 

	 var dicNames = ['common', 'doDhcpServer', 'lanConfig']; 

	 Translate.preLoadDics(dicNames, function(){  			
			// 清空标签页容器
			$container.empty();
			// 获取表格数据并生成表格
			displayTable($container);
		});	
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});



