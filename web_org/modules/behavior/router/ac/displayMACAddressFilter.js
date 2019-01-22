define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');	

	
	var Translate  = require('Translate');
	var dicArr     = ['common','doStaticGroup'];
	function T(_str){
	    return Translate.getValue(_str, dicArr);
	}
	function display($con){
		var Path = require('Path');
		var Translate = require('Translate');
		var dicNames = ['doStaticGroup'];
		Translate.preLoadDics(dicNames, function(){
			displayTable($con);
		});
	}
	
	
	function displayTable($con){
		
			$con.empty();
			var TableContainer = require('P_template/common/TableContainer');
			var conhtml = TableContainer.getHTML({}),
				$tableCon = $(conhtml);
			$con.append($tableCon);
			
			
			$.ajax({
				type:"get",
				url:"common.asp?optType=apMacFilter",
				success:function(result){
					
					// 数据处理
					processData(result);
					
					//生成表格
					makeTable($tableCon);
				}
			});
		
	}
	
	// 处理数据
	function processData(res){
		 	 eval(res)

		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			// 声明字段列表
			var fieldArr =[
				'ID',
				'mac',
			    'serverShow', 
			    'rule'
			];
			DATA.SZones = SZones;
			DATA. max_totalrecs =  max_totalrecs;
			var baseData = [];
			macConfName.forEach(function(obj,i){
				baseData.push([
					Number(i)+1,
					obj,
					getShowServer(i),
					Rules[i]
				]);
			});
			
			function getShowServer(i){
				return eval('SZname'+i);
			}
			
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			
			database.addData(baseData);
	}
	
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id": "addModal",
				"name": '{add}',
				 "clickFunc" : function($btn){
				 		
				 		editModal('add');
	        		}
			},
			{
				"id": "allDelete",
				"name": '{delete}',
				 "clickFunc" : function($btn){
						/* 获取已被勾选的行 */
				 		var keyarr = DATA["tableObj"].getSelectInputKey('data-primaryKey');
				 		if(keyarr.length>0){
				 			require('Tips').showConfirm(T('delconfirm'),function(){
				 				var dataarrs = [];
				 				keyarr.forEach(function(keyobj){
				 					var primaryKey = keyobj;
									var td = database.getSelect({primaryKey : primaryKey})[0];
				 					dataarrs.push(td);
				 				})
								deleteStr(dataarrs)
							});
				 		}else{
				 			require('Tips').showInfo('{unSelectDelTarget}');
				 		}
	        		}
			}
		];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		
		// 表格配置数据
		var tableList = {
			"database": database,
//			otherFuncAfterRefresh:afterTabel,
			"isSelectAll":true,
			"dicArr" : ['common'],
//			"max":DATA. max_totalrecs,
			"titles": {
				"ID"		 : {
					"key": "ID",
					"type": "text",
				},
				"MAC地址组名"		 : {
					"key": "mac",
					"type": "text"
				},
				"服务区"		 : {
					"key": "serverShow",
					"type": "text"
				},
				"规则"		 : {
					"key": "rule",
					"type": "text",
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var data = database.getSelect({primaryKey : primaryKey})[0];
								/* gei获取编辑的数据 */
								$.ajax({
									type:"get",
									url:"common.asp?optType=editApMacFilter&editName="+data.mac,
									success:function(result){
										var doEval = require('Eval');
										var variableArr = [
												'confName',
												'macNum',
												'mode',
												'SZnames',
												'macData'
										];
										var result = doEval.doEval(result, variableArr);
										var isSuccessful = result['isSuccessful'];
										// 判断字符串代码是否执行成功
										if(isSuccessful){
										    // 执行成功
										    var datas = result['data'];
										    
										    editModal("edit",datas);
										    
										}
									}
								});
								
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var datarr = database.getSelect({primaryKey : primaryKey});
								
								
								require('Tips').showConfirm(T('delconfirm'),function(){
									deleteStr(datarr)
								});
							}
						}
					]
				}
				
			}
		};
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
	//新增 编辑
	function editModal(type,data){
		var data = data || {};
		var newdata = data;
		
		var modaobjs = '';
		console.log(data)
	    var modalList = {
		"id": "edmodal",
		"size":'large',
		"title": type=='add'?'{add}':'{edit}'	,
		"btns" : [
		{
		    "type"      : 'save',
		    "clickFunc" : function($this){
		    	if(require('InputGroup').checkErr(DATA.modaobj.getDom())>0){
		    		return ;
		    	}
		    	if(DATA.modaobj.getDom().find('[name="SZonesbox"]:checked').length == 0){
		    		Tips.showWarning('尚未勾选服务区');
		    		return ;
		    	}
		    	var Serialize = require('Serialize');
		    	var dataarr = Serialize.getQueryArrs(DATA.modaobj.getDom());
		    	var datajson = Serialize.queryArrsToJson(dataarr);
		    	
		    	var servicezoneStr = '';
		    	DATA.modaobj.getDom().find('[name="SZonesbox"]:checked').each(function(){
		    		servicezoneStr += $(this).attr('value')+',';
		    	});
		    	servicezoneStr = servicezoneStr.substr(0,servicezoneStr.length-1);
		    	
		    	datajson.servicezone = servicezoneStr;
		    	datajson.Action = (type=='add'?'add':'modify');
		    	console.log(datajson);
		    	var datastr = Serialize.queryJsonToStr(datajson);
		    	$.ajax({
		    		type:"post",
		    		url:"goform/formFitApMacFilter",
		    		data:datastr,
		    		success:function(result){
		    			//处理数据
						var Eval = require('Eval');
						var variables = ['status', 'errorstr'];
						var result = Eval.doEval(result, variables),
						isSuccess = result["isSuccessful"];
						if(isSuccess){
							var data = result["data"],
							status = data["status"];
							var Tips = require('Tips');
							if(status == 1){
								Tips.showSuccess('{saveSuccess}');
								DATA.modaobj.hide();
								$('[href="#1"]').trigger('click');

							}else{
								var errorStr = data["errorstr"];
								Tips.showWarning('{saveFail}' + errorStr);
							}
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
	    
	    var serverItem = [];
	    DATA.SZones.forEach(function(obj,i){
	    	serverItem.push({name:obj,value:obj});
	    })
	    
		if(data.macData){
			var macaddrStr = data.macData.join('\r\n');
		}
		

	    var inputList = [
		     {  
			   		"prevWord"	:'MAC地址组名称',
			   		"necessary":true,
			        "inputData": {
			            "value" : data.confName || '',
			            "type": 'text',
			            "name": 'confName',
			            "checkDemoFunc" : ['checkInput', 'name', '1', '12', '1']
			        },
			        "afterWord": ''
			 },
			  {  
			   		"prevWord"	:'',
			   		"display":false,
			        "inputData": {
			            "value" : data.confName || '',
			            "type": 'text',
			            "name": 'oldConfName',
			        },
			        "afterWord": ''
			 },
		     {  
		   		"prevWord"	: '过滤规则',
		   		
		        "inputData": {
		            "defaultValue" : data.mode || '1',
		            "type": 'radio',
		            "name": 'mode',
		            items:[
		            	{name:'允许（只允许列表中的MAC地址访问本无线网络）',value:'1'}
		            ]
		        },
		        "afterWord": ''
		    },
		    {  
		   		"prevWord"	: '',
		        "inputData": {
		            "defaultValue" : data.mode,
		            "type": 'radio',
		            "name": 'mode',
		            items:[
		            	{name:'禁止（只禁止列表中的MAC地址访问本无线网络）',value:'2'}
		            ]
		        },
		        "afterWord": ''
		    },
		    {  
		   		"prevWord"	: '服务区',
		   		"necessary":true,
		        "inputData": {
		            "defaultValue" : data.SZnames || [],
		            "type": 'checkbox',
		            "name": 'SZonesbox',
		            items:serverItem
		        },
		        "afterWord": ''
		    },
		     {  
		   		"prevWord"	: 'MAC地址列表',
		   		"necessary":true,
		        "inputData": {
		            "value" : macaddrStr || '',
		            "type": 'textarea',
		            "name": 'data',
		            "checkFuncs":['checkMacGroup']
		        },
		        "afterWord": ''
		    }
	    ];
	    // 获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    DATA.modaobj = modaobj;
	    // 获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
		/*修改样式*/
		$dom.find('[name="data"]').css({
			width:'306px',
			height:'100px',
			resize: 'none'
		})


	  	modaobj.insert($dom);
		
		var $modalDom = modaobj.getDom();
	    
		var Translate  = require('Translate');
	    var tranDomArr = [$modalDom];
	    var dicArr     = ['common','doStaticGroup'];
	    Translate.translate(tranDomArr, dicArr);
	  	modaobj.show();
	  	
	}
	
	/* 被引用的接口*/
	function getUsedApArr(){
		var allinfo = [];
		DATA.ApInfo.forEach(function(obj){
			obj.forEach(function(apobj){
				allinfo.push(apobj);
			})
		});
		return allinfo;
	}
	
	
/* 删除接口 */
	function deleteStr(arr){
		if(arr.length>0){
			var delstr = 'delstr=';
			arr.forEach(function(obj){
				delstr += obj.mac+",";
			});
			delstr.substr(0,delstr.length-1);
			$.ajax({
				type:"post",
				url:"goform/formApMacFilterDel",
				data:delstr,
				success:function(result){
					var doEval = require('Eval');
					var variableArr = ['status','errorstr'];
					var result = doEval.doEval(result, variableArr);
					var isSuccessful = result['isSuccessful'];
					// 判断字符串代码是否执行成功
					if(isSuccessful){
					    // 执行成功
					    var data = result['data'];
					    if(data.status){
					    		Tips.showSuccess('{delSuccess}');
					    		displayTable($('#1'));
					    }else{
					    	Tips.showError(data.errorstr);
					    }
					}
				}
			});
			
			
		}
		
	}


	
	
	  
	module.exports = {
		display: display
	};
});
