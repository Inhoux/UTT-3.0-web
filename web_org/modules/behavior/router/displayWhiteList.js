define(function(require, exports, module){
// QQ保存
// /goform/ConfigExceptQQ
// ALI保存
// /goform/ConfigExceptAli
// 全局设置
// /goform/formExceptQQGlobalConfig
// /goform/formExceptAliGlobalConfig
// 删除QQ
// /goform/formExceptQQDel
// 删除阿里
// /goform/formExceptAliDel
	function tl(str){
		return require('Translate').getValue(str,['common','error','doWhiteList']);
	}
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	module.exports = {
		display: display
	};

	  function processData(jsStr) {
	  	eval(jsStr)
	    // 加载Eval模块
	    var doEval = require('Eval');
	    var Tips = require('Tips');
	    var codeStr = jsStr,
	      // 定义需要获得的变量
	      variableArr = [
	      'exceptQQEnable', //QQ开启
	      'exceptEnterpriseQQEnable',//企业QQ开启 
	      'indexID',
	      'qqNumber',//QQ号 array
	      'remark',//QQ 说明
	 	  'totalrecs',//QQ目前条目数
	      'max_totalrecs',//QQ 最大

	      'exceptAliEnable',//阿里 开启
	      'AliNumber',//阿里账号
	      'remark1',//卡里说明
	      'indexID1',
	      'totalrecs1',//阿里目前数
	      'max_totalrecs1'//阿里最大
	      ];
	    // 获得js字符串执行后的结果
	    var result = doEval.doEval(codeStr, variableArr),
	      isSuccess = result["isSuccessful"];
	    // 判断代码字符串执行是否成功
	    if (isSuccess) {
	      // 获得所有的变量
	      var data = result["data"];

	      return data;
	    } else {

	      Tips.showError('{parseStrErr}',3);
	      return false;
	    }
	  }	
	
	/**
	 * 生成表格
	 */
	function display($con){
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);
		
		$.ajax({
			type:"get",
			url:"common.asp?optType=whiteList",
			success:function(result){
				var data = processData(result);
				if(!data){
					return;
				}
				DATA['exceptQQEnable'] = data.exceptQQEnable;
				DATA['exceptEnterpriseQQEnable'] = data.exceptEnterpriseQQEnable;
				DATA['exceptAliEnable'] = data.exceptAliEnable;

				DATA['totalrecs'] = data.totalrecs;
				DATA['max_totalrecs'] = data.max_totalrecs;

				DATA['totalrecs1'] = data.totalrecs1;
				DATA['max_totalrecs1'] = data.max_totalrecs1;
				//将数据生成数据库
				setDatabase(data);
				//生成表格
				setTable($tableCon);
			}
		});
	}
	/**
	  公用的删除接口
	*/
	function deletFunc(deletearr){
		var qqarr = [];
		var aliarr = [];
		deletearr.forEach(function(obj){
			if(obj.type == 'QQ'){
				qqarr.push(obj);
			}else{
				aliarr.push(obj);
			}
		});

		var singlright = 0;
		if(qqarr.length >0){
			singlright++;
			var delstrs = 'delstr=';
			qqarr.forEach(function(obj){
				delstrs += obj.indexid+",";
			})
			delstrs = delstrs.substr(0,(delstrs.length-1));
			lajax('/goform/formExceptQQDel',delstrs);
		}

		if(aliarr.length >0){
			singlright++;
			var delstrs = 'delstr=';
			aliarr.forEach(function(obj){
				delstrs += obj.indexid+",";
			})
			delstrs = delstrs.substr(0,(delstrs.length-1));
			lajax('/goform/formExceptAliDel',delstrs);
		}

		var listenAjax = 0;
		function lajax(url,str){
			 $.ajax({
	          url: url,
	          type: 'POST',
	          data: str,
	          success: function(result) {
	            var doEval = require('Eval');
	            var codeStr = result,
	              variableArr = ['status'],
	              result = doEval.doEval(codeStr, variableArr),
	              isSuccess = result["isSuccessful"];
	            // 判断代码字符串执行是否成功
	            if (isSuccess) {
	              var data = result["data"],
	                status = data['status'];
	              if (status == '1') {
	                listenAjax = listenAjax+1;
	              } else {
	                Tips.showError('{delFail}');
	              }
	            } else {
	              Tips.showError('{parseStrErr}');
	            }
	          }
	        });
		}

		var lajaxlisten = setInterval(function(){
			if(listenAjax >= singlright){

				clearInterval(lajaxlisten);
				 Tips.showSuccess('{delSuccess}');
				$('[href=#1]').trigger('click');
			}
		},100);
	}
// /goform/formQQFilterExport

	/**
	* 多项删除
	**/
	  function deleteBtnClick() {
	    //获得提示框组件调用方法
	    var Tips = require('Tips');
	    var database = DATA["database"] ;
	    var tableObj = DATA["tableObj"];
	    var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
	    var length  = primaryKeyArr.length;
	    // 判断是否有被选中的选择框
	    if (length > 0) {
	    	require('Tips').showConfirm(tl('delconfirm'),function(){
				var  datasarr = [];
					primaryKeyArr.forEach(function(primaryKey) {  
				    var data = database.getSelect({primaryKey : primaryKey});
				    datasarr.push(data[0]);
				});
				deletFunc(datasarr);
	       	});
	  	} else {
	      Tips.showWarning('{unSelectDelTarget}');
	    }
	  }	
	/**
	 * 生成数据库
	 */
	function setDatabase(data){		
	      var arr = [];
	      var idindex = 0;
	      data.qqNumber.forEach(function(obj,i){
	      	idindex = i+1;
	      	var innerarr = [];
	      	innerarr.push(idindex);
	      	innerarr.push('QQ');
	      	innerarr.push(obj);
	      	innerarr.push(data.remark[i]);
			innerarr.push(data.indexID[i]);

	      	arr.push(innerarr);
	      });
	      DATA['idindex'] = idindex;

	       data.AliNumber.forEach(function(obj,i){
	      	idindex++;
	      	var innerarr = [];
	      	innerarr.push(idindex);
	      	innerarr.push('{ALI}');
	      	innerarr.push(obj);
	      	innerarr.push(data.remark1[i]);
	      	innerarr.push(data.indexID1[i]);
	      
	      	arr.push(innerarr);
	      });
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["database"] = database;
		// 声明字段列表
		var fieldArr = ['id','type', 'acount', 'note','indexid'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(arr);
	}
	
	/**
	 * 生成表格
	 */
	function setTable($tableCon){
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
			 	deleteBtnClick();
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
				$afterdom[0].action ="/goform/formQQFilterExport";
				$afterdom[0].submit();
        	}

		}
		/*
		,{
			"id": "globalSetting",
			"name": tl('globalSetting'),
			 "clickFunc" : function($btn){
			 	$btn.blur();
             	globalSetting(); 
        	}

		}
		*/
		];
		var database = DATA["database"];
		var headData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll":true,
			"dicArr" : ['common', 'doWhiteList'],
			"titles": {
				"ID"		 : {
					"key": "id",
					"type": "text",
				},
				"{type}"		 : {
					"key": "type",
					"type": "text",
				},
				"{account}"		 : {
					"key": "acount",
					"type": "text",
				},
				"{remark}"		 : {
					"key": "note",
					"type": "text"
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
								require('Tips').showConfirm(tl('delconfirm'),function(){
									deletFunc(data);
								});
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
	                	var errorNum=require('InputGroup').checkErr($modal);
	                	if(errorNum >0){
	                		return;
	                	}
	                	var SRLZ = require('Serialize');
	                	var quryarrs = SRLZ.getQueryArrs($modal);
	                	var quryjson = SRLZ.queryArrsToJson(quryarrs);
	                	
	                	var newjson = {
	                		Action     : (type == 'add'?'add':'modify'),
	                		indexIDNew : '',
	                		indexIDOld : '',
	                		remark     : quryjson.note
	                	};
	                	var urlstr = '';
	                	if(quryjson.type == 'QQ'){
	                		if(DATA['totalrecs'] != DATA['max_totalrecs']){
	                			urlstr = '/goform/ConfigExceptQQ';
	                			newjson.qqNumber = quryjson.acount;
	                			if(type == 'edit'){
	                				newjson.indexIDNew = quryjson.id;
	                				newjson.indexIDOld = quryjson.id;
	                			}
	                		}else{
	                			Tips.showWarning('{QQreachMaxNum}');
	                			return;
	                		}
	                	}else{
							if(DATA['totalrecs1'] != DATA['max_totalrecs1']){
								urlstr = '/goform/ConfigExceptAli';
								newjson.aliNumber = quryjson.acount2;
	                			if(type == 'edit'){
	                				newjson.indexIDNew = quryjson.id;
	                				newjson.indexIDOld = quryjson.id;
	                			}
	                		}else{
	                			Tips.showWarning('{ALIreachMaxNum}');
	                			return;
	                		}
	                	}
	                	var newstrs = SRLZ.queryJsonToStr(newjson);
	             // QQ保存
				// /goform/ConfigExceptQQ
				// ALI保存
				// /goform/ConfigExceptAli

            			$.ajax({
							type:"post",
							url: urlstr,
							data:newstrs,
							success:function(result){
								 var doEval = require('Eval');
								 var datas = doEval.doEval(result, ['status','errorstr']),
							      isSuccess = datas["isSuccessful"];
							    // 判断代码字符串执行是否成功
							    if (isSuccess) {
							      // 获得所有的变量
							     	if(datas.data.status == 1){
							     		Tips.showSuccess('{saveSuccess}');
										$('[href=#1]').trigger('click');
										DATA['editModalObj'].hide();
							     	}else{
							     		if(datas.data.errorstr=='undefined'||datas.data.errorstr==undefined||datas.data.errorstr==''){
							     			Tips.showError('{saveFail}');
							     		}else{
							     			console.log(datas.data.errorstr);
							     			Tips.showError(datas.data.errorstr);
							     		}
							     	}
							    } else {
							      Tips.showError('{parseStrErr}');
							      return false;
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
		   		"prevWord"	:'{whiteListType}',
		   		
		        "inputData": {
		            "defaultValue" : data.type || 'QQ',
		            "type": 'radio',
		            "name": 'type',
		            "items" : [
		                {
		                    "value" : 'QQ',
		                    "name"  : 'QQ',
		                    "control" :'QQ',
		                    "disabled":(type=='edit'?true:false),
		                },
		                {
		                    "value" : '{ALI}',
		                    "name"  : '{ALI}',
		                    "control" :'ALI',
		                    "disabled":(type=='edit'?true:false),
		                },
		            ]
		        },
		        "afterWord": ''
		    },
		    {
		    	"sign": 'QQ',
		    	"necessary" :true,
		    	"prevWord"	:'{account}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'acount',
			        "value"      : data.acount || '',
			        // "checkDemoFunc" : ['checkNum','1','99999999999']
			        "checkDemoFunc":["checkInput","num","1","4294967295"]
			    },
			    "afterWord": ''
			},		    
		    {
		    	"sign": 'ALI',
		    	"necessary" :true,
		    	"prevWord"	:'{account}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'acount2',
			        "value"      : data.acount || '',
			        // "checkDemoFunc" : ['checkName','5','30','doWhiteList']
			        // "checkDemoFunc": ['checkInput', 'name', '1', '25', '2']
			        // "checkDemoFunc": ['specialWordCheck','5', '25']
			         "checkDemoFunc" : ['checkInput', 'name', '5', '25', 'ali']
			    },
			    "afterWord": ''
			},
			 {
		    	"prevWord"	:'{remark}',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'note',
			        "value"      : data.note || '',
			        // "checkDemoFunc": ['checkInput', 'name', '0', '15', '3'] 
			        "checkDemoFunc": ['checkInput', 'name', '0', '31', '2']
			    },
			    "afterWord": ''
			},
			{
				display:false,
				"inputData" : {
			        "type"       : 'text',
			        "name"       : 'id',
			        "value"      : data.indexid || '',
			    },

			}
		];
		var InputGroup = require('InputGroup');
		var $input = InputGroup.getDom(inputlist);
		
		modalObj.insert($input);
		modalObj.show();

		var Translate  = require('Translate');
		var tranDomArr = [$input, modalObj.getDom()];
		var dicArr     = ['common','doWhiteList'];
		Translate.translate(tranDomArr, dicArr);
		
	}
	
	/**
	 * 全局设置
	 */
	function globalSetting(){
//		$.ajax({
//			type:"post",
//			url:"",
//			success:function(result){
				var globaldata = {
					
				};
				displayGlobalSetting(globaldata);
//			}
//		});
	}
	
	function displayGlobalSetting(globaldata){
		var data = globaldata || {};
		
		var modallist = {
			id:'globalSettings_modal',
			title:tl('globalSetting'),
			size:'normal',
			"btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                	var $modal = DATA['SettingModalObj'].getDom();
	                	var SRLZ = require('Serialize');
	                	var strs = SRLZ.getQueryStrs($modal);
						 lajax('/goform/formExceptQQGlobalConfig',strs);
						 lajax('/goform/formExceptAliGlobalConfig',strs);
						var listenAjax = 0;
								function lajax(url,str){
									 $.ajax({
							          url: url,
							          type: 'POST',
							          data: str,
							          success: function(result) {
							            var doEval = require('Eval');
							            var codeStr = result,
							              variableArr = ['status'],
							              result = doEval.doEval(codeStr, variableArr),
							              isSuccess = result["isSuccessful"];
							            // 判断代码字符串执行是否成功
							            if (isSuccess) {
							              var data = result["data"],
							                status = data['status'];
							              if (status == '1') {
							                listenAjax = listenAjax+1;
							              } else {
							                Tips.showError('{delFail}');
							              }
							            } else {
							              Tips.showError('{parseStrErr}');
							            }
							          }
							        });
								}
							var lajaxlisten1 = setInterval(function(){
								if(listenAjax >= 2){

									clearInterval(lajaxlisten1);
									Tips.showSuccess('{saveSuccess}');
									 DATA['SettingModalObj'].hide();
									$('[href=#1]').trigger('click');
								}
							},100);

	                	
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
		DATA['SettingModalObj'] = modalObj;
		
		var inputlist = [
		   {  
		   		"prevWord"	:'{QQwhiteList}',
		   		"dicArr" : ['common', 'doWhiteList'],
		        "inputData": {
		            "defaultValue" : DATA['exceptQQEnable'] || 'off',
		            "type": 'radio',
		            "name": 'ExceptQQEnable',
		            "items" : [
		                {
		                    "value" : 'on',
		                    "name"  : '{open}',
		                },
		                {
		                    "value" : 'off',
		                    "name"  : '{close}',
		                },
		            ]
		        },
		        "afterWord": ''
		    },
		    {  
		   		"prevWord"	:'{enterPriseWhiteList}',
		        "inputData": {
		            "defaultValue" : DATA['exceptEnterpriseQQEnable'] || 'off',
		            "type": 'radio',
		            "name": 'ExceptEnterpriseQQEnable',
		            "items" : [
		                {
		                    "value" : 'on',
		                    "name"  : '{open}',
		                },
		                {
		                    "value" : 'off',
		                    "name"  : '{close}',
		                },
		            ]
		        },
		        "afterWord": ''
		    },
		    {  
		   		"prevWord"	:'{ALIwhiteList}',
		        "inputData": {
		            "defaultValue" : DATA['exceptAliEnable'] || 'off',
		            "type": 'radio',
		            "name": 'ExceptAliEnable',
		            "items" : [
		                {
		                    "value" : 'on',
		                    "name"  : '{open}',
		                },
		                {
		                    "value" : 'off',
		                    "name"  : '{close}',
		                },
		            ]
		        },
		        "afterWord": ''
		    }
		];
		var InputGroup = require('InputGroup');
		var $input = InputGroup.getDom(inputlist);
		
		modalObj.insert($input);
		modalObj.show();
		var Translate  = require('Translate');
		var tranDomArr = [$input,modalObj.getDom()];
		var dicArr     = ['common','doWhiteList'];
		Translate.translate(tranDomArr, dicArr);		
	}
	
	/**
	 * 导入
	 */
	function setDownlord(){
		var modalList = {
		"id": "downlord_modal",
		"size":'normal',
		"title": "{import}",
		"btns" : [
		{
		    "type"      : 'save',
		    "clickFunc" : function($this){
			var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
			
            var dom = $this.parents('.modal').find('[name="filename"]')[0];
            var files = dom.files[0];
            var name = files.name;
            var lasttname = name.substr(name.lastIndexOf('.')+1);
            if(lasttname != 'csv')
            {
                    require('Tips').showWarning('{importfileerror}');
                        return false;
            }
            
                	
			// $this 代表这个按钮的jQuery对象，一般不会用到
			if($dom.find('[name="fileSrc"]').val()==''){
				require('Tips').showWarning('{nofileInput}',3);
			}else{
			require('Tips').showConfirm(tl('importListWarning'),function(){
				var formData = new FormData($('#thisform1')[0]);
				$.ajax({
					type:"post",
					url:"/goform/formQQFilterImport",
					data:formData,
					async: false,  
			        cache: false,  
			        contentType: false,  
			        processData: false, 
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
				    DATA['daorumodalobj'].hide();
				    Tips.showSuccess('{importSuccess}')
				    display($('#1'));
				} else {
				    var errorstr=data.errorstr;
				    Tips.showError(errorstr);
				    DATA['daorumodalobj'].hide();
				    display($('#1'));
				}
				} else {
				    Tips.showError('{parseStrErr}');
				}
				}
			    });
			});
		    }
		}
		},
		    {
			"type"      : 'close'
		    }
		]
	    };
	    var inputList = [
	    {
		"prevWord": '{chooseFile}',
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
			"name":'{downloadTemplates}',
			"id":'downloadLink'
		    }
		    ]
		},
		"afterWord": ''
	    }
	    ];
	    //获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    DATA['daorumodalobj'] = modaobj;
	    //获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    //添加到指定位置
	    $modal.find('.modal-body').empty().append($dom);
	    $('body').append($modal);
	    var btnslist = [
	    {
			"name":'{chooseFile}',
			"id":'chooseFile',
			"clickFunc":function($this){

			}					
	    }
	    ];
	    InputGroup.insertBtn($dom,'fileSrc',btnslist);

	    $dom.find('[name="fileSrc"]').after('<input type="file" name="filename" style="display:none" />');
		
		//选择文件模拟点击
		$dom.find('#chooseFile').click(function(){$($dom.find('[name="filename"]').click())});
	   
		$dom.find("#downloadLink").click(function(){
			var $btn=$(this);
			if($btn.next().attr('name') == 'Device_Config'){
				$btn.next().remove();
			}
			var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
			$btn.after($afterdom);
			$afterdom[0].action ="/goform/formExportTemplate";
			$afterdom[0].submit(); 
		})

	   
	   $dom.find('[name="filename"]').change(function(){
			$dom.find('[name="fileSrc"]').val($(this).val().substr($(this).val().lastIndexOf('\\')+1));
	    });
	     $dom.wrap('<form id="thisform1" name="thisform1" enctype ="multipart/form-data"></form>');
	    modaobj.show();
	    
	    var $notespan = $('<div></div>')
	    				.css({fontWeight:'bold',wordBreak:'normal',whiteSpace:'normal',padding:'10px',backgroundColor:'#eeeeee',marginTop:'10px'})
        				.append(tl('importNoteWords'));
        modaobj.insert($notespan);			
	    
	    
		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','doWhiteList'];
		Translate.translate(tranDomArr, dicArr);	    
	}
	
	/*
	 * 删除
	 */
	function deleteAjax(){
		
	}
})
