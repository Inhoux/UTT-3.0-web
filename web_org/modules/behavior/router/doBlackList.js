define(function(require, exports, module){
	// require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	function tl(str){
    	return require('Translate').getValue(str,['common','error','doBlackList']);
  	} 	
	exports.display = function(){ 
			var Translate = require('Translate'); 
			var dicNames = ['common', 'doBlackList']; 
			Translate.preLoadDics(dicNames, function(){ 

			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : tl('userMgmt'),
	  		"links"     : [
	  			{"link" : '#/user_management/black_list', "title" : tl('blackList')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('blackList')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				//Path.changePath($(this).text());
				displayTable();
			});
		    $('a[href="#1"]').trigger('click');
		});
	}
	
	/**
	 * 制作表格
	 */
	function displayTable(){
		$('#1').empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$('#1').append($tableCon);
		
		$.ajax({
			type:"get",
			url:"common.asp?optType=blackList",
			success:function(result){
				// 加载Eval模块， 不需要考虑路径问题
				var doEval = require('Eval');
				var codeStr = result;
				var variableArr = ['usernames', 'filterMacs', 'addTime' ,'remark' ,'totalrecs' ,'max_totalrecs'];
				var result = doEval.doEval(codeStr, variableArr);
				var isSuccessful = result['isSuccessful'];
				// 判断字符串代码是否执行成功
				if(isSuccessful){
				    // 执行成功
				    var data = result['data'];
				    
				    DATA['totalrecs'] = data.totalrecs;
				    DATA['max_totalrecs'] = data.max_totalrecs;
				    
				   	//将数据生成数据库
					setDatabase(data);
					//生成表格
					setTable($tableCon);
				}else{
				
				}
				
				
			}
		});
	}
	
	
	/**
	 * 生成数据库
	 */
	function setDatabase(data){
		var tablearr = [];
		data.usernames.forEach(function(obj,i){
			var newarr = [];
			newarr.push(Number(i)+1);
			newarr.push(obj);
			newarr.push(data.filterMacs[i]);
			newarr.push(data.addTime[i]);
			newarr.push(data.remark[i]);
			tablearr.push(newarr);
		});
		
		
		
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["database"] = database;
		// 声明字段列表
		var fieldArr = ['id','username','mac' ,'time','note'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(tablearr);
	}
	
	/**
	 * 生成表格
	 */
	function setTable($tableCon){
		var Tips=require("Tips");
		// 表格上方按钮配置数据
		var btnList = [
		{
			"id": "add",
			"name": "{add}",
			 "clickFunc" : function($btn){
			 		$btn.blur();
					setAddEditModal('add');
        		}
		},
		{
			"id": "delete",
			"name": "{delete}",
			 "clickFunc" : function($btn){
			 	$btn.blur();
			 	var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
			 	if(primaryKeyArr.length > 0 ){
			 		var deleuserarr = [];
			 		primaryKeyArr.forEach(function(obj){
				 		var tableObj = DATA["tableObj"];
						var data = database.getSelect({primaryKey : obj});
						deleuserarr.push(data[0]);
				 	});
	             	deleteUser(deleuserarr);  
			 	}else{
			 		Tips.showWarning('{unSelectDelTarget}');
			 	}
			 	
        	}

		},{
			"id": "import",
			"name": "{import}",
			 "clickFunc" : function($btn){
			 	$btn.blur();
             	setDownlord();
        	}

		},{
			"id": "export",
			"name": "{export}",
			 "clickFunc" : function($btn){
			 	$btn.blur(); 
				if($btn.next().attr('name') == 'Device_Config'){
								$btn.next().remove();
							}
				var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
				$btn.after($afterdom);
				$afterdom[0].action ="/goform/formConfigBlackListExport";
				$afterdom[0].submit();             	
        	}

		}];
		var database = DATA["database"];
		var headData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll":true,
			"dicArr":['common', 'doBlackList'],
			"titles": {
				"ID"		 : {
					"key": "id",
					"type": "text",
				},
				"{userName}"		 : {
					"key": "username",
					"type": "text",
				},
				"{macAddr}"		 : {
					"key": "mac",
					"type": "text"
				},
				"{addTime}"		 : {
					"key": "time",
					"type": "text"
				},
				"{remark}"		 : {
					"key": "note",
					"type": "text",
					"filter":function(strs){
						var newstr = strs;
						if(newstr.length >50){
							newstr = newstr.substr(0,9)+"……";
						}
						
						return newstr;
					}
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var tableObj = DATA["tableObj"];
								var data = database.getSelect({primaryKey : primaryKey});
								setAddEditModal('edit',data[0]);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var tableObj = DATA["tableObj"];
								var data = database.getSelect({primaryKey : primaryKey});
								deleteUser(data);  
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
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		
		$tableCon.append($table);
	}
	
	/**
	 * 导入
	 */
	function setDownlord() {
		var modalList = {
			"id": "downlord_modal",
			"size": 'normal',
			"title": "{bulkImport}",
			"btns": [{
				"type": 'save',
				"clickFunc": function($this) {
					var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
										// $this 代表这个按钮的jQuery对象，一般不会用到
                    var dom = $this.parents('.modal').find('[name="filename"]')[0];
                    var files = dom.files[0];
                    var name = files.name;
                    var lasttname = name.substr(name.lastIndexOf('.')+1);
                    if(lasttname != 'csv')
                    {
                        require('Tips').showWarning('{importfileerror}');
                        return false;
                    }
                    var tp = require('Tips');
					/*
					if(/.*[\u4e00-\u9fa5]+.*$/.test(thisfilename)) 
						{ 
						require('Tips').showWarning(tl('fileNameCanBeChinese')); 
						return false; 
						}
						*/
					// $this 代表这个按钮的jQuery对象，一般不会用到
					var tp = require('Tips');
					tp.showConfirm(tl('confirmImport'),function(){
						 var formData1 = new FormData($( "#iframe1" )[0]);  

					     $.ajax({  
					          url: '/goform/formConfigBlackListImport' ,  
					          type: 'POST',  
					          data: formData1,   
					          async: false,
					          cache: false,  
					          contentType: false,  
					          processData: false,  
					          success: function (returndata) {  
									// 加载Eval模块， 不需要考虑路径问题
									var doEval = require('Eval');
									var variableArr = ['status','errorstr'];
									var result = doEval.doEval(returndata, variableArr);
									var isSuccessful = result['isSuccessful'];
									// 判断字符串代码是否执行成功
									if(isSuccessful){
										if(result['data'].status == 1){
											Tips.showSuccess('{importSuccess}');
											DATA.modaobj.hide();
											displayTable();
										}else{
											var errorstr=result['data'].errorstr;
											if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
												Tips.showWarning('{importFail}');
											DATA.modaobj.hide();
											}else{
												Tips.showWarning(errorstr);
											DATA.modaobj.hide();
											    displayTable();
                                            }
										}
									}else{
										Tips.showWarning('{tryRefresh}');
									}
					          }
					     });  
					});
				}
			}, {
				"type": 'close'
			}]
		};
		var inputList = [{
			"prevWord": '{pleaseSelectFile}',
			"inputData": {
				"type": 'text',
				"name": 'fileSrc'
			},
			"afterWord": ''
		}, {
			"prevWord": '',
			"inputData": {
				"type": 'link',
				"items": [{
					"name": '{downloadTemplate}',
					"id": 'downloadLink'
				}]
			},
			"afterWord": ''
		}];
		//获得弹框对象
		var Modal = require('Modal');
		var modaobj = Modal.getModalObj(modalList),
			$modal = modaobj.getDom();
		DATA.modaobj = modaobj;
		//获得输入组对象
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		//添加到指定位置
		$modal.find('.modal-body').empty().append($dom);
		
		var btnslist = [{
			"name": '{selectFile}',
			"id": 'chooseFile',
			"clickFunc": function($this) {

			}
		}];
		InputGroup.insertBtn($dom, 'fileSrc', btnslist);
		var $flie = $('<input type="file" name="filename" id="chooseFileHide" style="display:none"/>');
		$dom.append($flie);
		$dom.find('#chooseFile').click(function() {
			$flie.click();
		});
		$flie.change(function() {
			$dom.find('[name="fileSrc"]').val($(this).val());
		});
		$dom.wrap('<form id="iframe1"  method="post" action="/goform/formConfigBlackListImport" enctype="multipart/form-data"></form>');
		
		$dom.find("#downloadLink").click(function(){
			var $btn=$(this);
			if($btn.next().attr('name') == 'Device_Config'){
				$btn.next().remove();
			}
			var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
			$btn.after($afterdom);
			$afterdom[0].action ="/goform/formConfigBlackListExportTemplate";
			$afterdom[0].submit(); 
		})

	    var $notespan = $('<div></div>')
	    				.css({fontWeight:'bold',wordBreak:'normal',whiteSpace:'normal',padding:'10px',backgroundColor:'#eeeeee',marginTop:'10px'})
        				.append(tl('importNoteWords'));
        modaobj.insert($notespan);	

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','doBlackList'];
		Translate.translate(tranDomArr, dicArr);

		modaobj.show();
	}	
	
	/**
	 * 新增/编辑 弹框
	 */
	function setAddEditModal(type,data){
		var data = data || {};
		var type = type || 'add';
		var modallist = {
			id:type+'_modal',
			title:(type == 'add'?tl('add'):tl('edit')),
			size:'normal',
			"btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                	var $modal = DATA['editModalObj'].getDom();
	                	var IG = require('InputGroup');
	                	if(IG.checkErr($modal) > 0){
	                		return false;
	                	}
	                	var SRLZ = require('Serialize');
	                	var strs = SRLZ.getQueryStrs($modal);
	                	var jsons = SRLZ.queryStrsToJson(strs);
	                	jsons.Action = type;
	                	var myDate=new Date();
	                	
	                	jsons.addTime = myDate.getFullYear()+"-"+myDate.getMonth()+"-"+myDate.getDate()+" "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
	                	var tmpMac=jsons.filterMac;
	                	tmpMac = tmpMac.replace(/\:/g,'');
	                	tmpMac = tmpMac.replace(/-/g,'');
	                	jsons.filterMac=tmpMac;

	                	jsons.oldName=data.username;
	                	jsons.oldMac=data.mac;
	                	strs=SRLZ.queryJsonToStr(jsons);
						$.ajax({
							type:"post",
							url:"/goform/ConfigMacFilter",
							data:strs,
							success:function(result){
								// 加载Eval模块， 不需要考虑路径问题
								var doEval = require('Eval');
								var codeStr = result;
								var variableArr = ['status','errorstr'];
								var result = doEval.doEval(codeStr, variableArr);
								var isSuccessful = result['isSuccessful'];
								// 判断字符串代码是否执行成功
								if(isSuccessful){
									if(result['data'].status == 1){
										Tips.showSuccess('{saveSuccess}');
										displayTable();
										DATA['editModalObj'].hide();
									}else{
										var errorstr=result['data'].errorstr;
										if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
											Tips.showWarning('{saveFail}');
										}else{
											Tips.showWarning(errorstr);
										}
									}
								}else{
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
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(modallist);
		DATA['editModalObj'] = modalObj;
		
		var inputlist = [
		     {
		    	"necessary" :true,
		    	"prevWord"	:'{userName}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'username',
			        "value"      : data.username || '',
			        // "checkDemoFunc" : ['checkName','1','10']
			        "checkDemoFunc":['checkInput','name','1','31','2']
			    },
			    "afterWord": ''
			},			
			 {
		    	"necessary" :true,
		    	"prevWord"	:'{macAddr}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'filterMac',
			        "value"      : data.mac || '',
			        "checkFuncs" : ['checkMac']
			    },
			    "afterWord": ''
			},
			 {
		    	"prevWord"	:'{remark}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'remark',
			        "value"      : data.note || '',
			        "checkDemoFunc" : ['checkInput','name','0','31',"5"]
			    },
			    "afterWord": ''
			},
			{
				"display"	:false,
		    	"prevWord"	:'{remark}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'addTime',
			        "value"      : data.time || '',
			    },
			    "afterWord": ''
			}
		];
		var InputGroup = require('InputGroup');
		var $input = InputGroup.getDom(inputlist);
		modalObj.insert($input);
		var Translate  = require('Translate');
		var tranDomArr = [$input,modalObj.getDom()];
		var dicArr     = ['common','doBlackList'];
		Translate.translate(tranDomArr, dicArr);
		modalObj.show();
		
	}
	
	/**
	 * 删除方法
	 * @param {Object} dataarr
	 */
	function deleteUser(dataarr){
		var datastr = 'delstr=';
		dataarr.forEach(function(obj){
			datastr += obj.username+",";
		});
		datastr = datastr.substr(0,(datastr.length-1));
		require('Tips').showConfirm(tl('delconfirm'),function(){		
			$.ajax({
				type:"post",
				url:"goform/ConfigMacFilterDel",
				data:datastr,
				success:function(result){
					// 加载Eval模块， 不需要考虑路径问题
					var doEval = require('Eval');
					var codeStr = result;
					var variableArr = ['status'];
					var result = doEval.doEval(codeStr, variableArr);
					var isSuccessful = result['isSuccessful'];
					// 判断字符串代码是否执行成功
					if(isSuccessful){
						if(result['data'].status == 1){
							Tips.showSuccess('{delSuccess}');
							displayTable();
							// DATA['editModalObj'].hide();
						}else{
							Tips.showError('{delFail}');
						}
					}else{
						Tips.showError('{parseStrErr}');
					}
				}
			});
		});	
	}
});
