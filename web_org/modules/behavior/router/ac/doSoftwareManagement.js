define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
    var dicArr     = ['common','doSoftMgnt','doEqMgmt'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}
    function tl(str){
            return require('Translate').getValue(str,['common','tips','error', 'doSysMaintenance']);
    }
    function tall(dom){
		return Translate.translate([dom],['common','doSoftMgnt']);
    }
	function display(){
	    Translate.preLoadDics(dicArr, function(){
			var Path = require('P_plugin/Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" :T("wireless_extension"),
	  		"links"     : [
	  			{"link" : '#/wifi_config/software_manage', "title" :T("software_management")}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('P_plugin/Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" :T("software_management")}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				displayTable($("#1"));
			});
		    $('a[href="#1"]').trigger('click');
		});
	}
	
	/* 获取生成标签页内容 */
	function displayTable($con){
		var Path = require('Path');
		Translate.preLoadDics(dicArr, function(){
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);
		
		
		$.ajax({
			type:"get",
			url: "common.asp?optType=apSoftMgmt",
			success:function(result){
				
				// 数据处理
				processData(result);
				//生成表格
				makeTable($tableCon);
			}
		});
	    });
	}
	
	// 处理数据
	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
			   'typesForFile',	    // 设备型号
			   'firmwareVersion',   //硬件版本
			   'serNum',            //序列号
			   'softwareVersion',    //当前软件版本
			   'lastSoftwareVersion',  //新软件版本
			   'ipStr',
			   'macStr',
			   'state',
			   'swChkSt',
			   'swChkSt_none',
			   'swChkSt_waiting',
			   'swChkSt_error',
			   'swChkSt_failed',
			   'swChkSt_checking',
			   'swChkSt_unchecked',
			   'swChkSt_checked',
			   'swChkSt_downloading',
			   'swChkSt_upgrading',
			   'swChkSt_ok'
		   ]; 
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   
		    var data = result["data"];
		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			DATA["AllData"] = data;
			// 声明字段列表
			var fieldArr =[
				'ID',
				'typesForFile',	    // 设备型号
			    'firmwareVersion',   //硬件版本
			    'serNum',            //序列号
			    'softwareVersion',    //当前软件版本
			    'lastSoftwareVersion',  //新软件版本
			    'ipStr',
			    'macStr',
			    'state',
			    'swChkSt',
			    'upDate'				//更新

			];
			
			var baseData = [];
			
			data.typesForFile.forEach(function(obj,i){
				var softwareVersion = "";
				var status = data.swChkSt[i];
				softwareVersion = data.lastSoftwareVersion[i];
				if (status == "-1" || status == data.swChkSt_none) {
//					softwareVersion = T("detect_waited");
					softwareVersion = "link_detect_waited";
				} else if (status == data.swChkSt_error) {
					softwareVersion = T("detect_failed");
				} else if (status == data.swChkSt_failed) {
					softwareVersion = T("upgrade_failed");
				} else if (status == data.swChkSt_checking) {
					softwareVersion = T("detecting");
				} else if (status == data.swChkSt_unchecked) {
					softwareVersion = T("detect_none");
				} else if (status == data.swChkSt_checked) {
					softwareVersion = data.lastSoftwareVersion[i];
				} else if (status == data.swChkSt_downloading) {
					softwareVersion = T("downloading");
				} else if (status == data.swChkSt_upgrading) {
					softwareVersion = T("soft_delivering");
				} else if (status == data.swChkSt_waiting) {
					softwareVersion = T("upgrade_waiting");
				} else if (status == data.swChkSt_ok) {
					softwareVersion = T("ap_upgrading");
				}
				baseData.push([
					Number(i)+1,
					data.typesForFile[i],
					data.firmwareVersion[i],
					data.serNum[i],
					data.softwareVersion[i],
					softwareVersion,
					data.ipStr[i],
					data.macStr[i],
					data.state[i],
					data.swChkSt[i],
					''
				]);
			});
			
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			
			database.addData(baseData);
	}
	
	
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
		/*
        {
			"id": "checkUpdata",
			"name": T("check_update"),
			"clickFunc" : function($btn){
			 	var pkArr = DATA['tableObj'].getSelectInputKey('data-primaryKey');
				if(pkArr.length < 1) {
					Tips.showInfo(T("select_ap_for_detect"));
				} else {
					var upgrading = 0;
					var data = DATA["AllData"];	
					var apNum = 0;
					var snStr = "sn=";
					var modelStr = "&model="
					var swVerStr = "&swVer=";
					pkArr.forEach(function(keyobj){
						var thisData = database.getSelect({primaryKey : keyobj})[0];
						if (upgrading == 1) {
							return ;
						} else if (thisData.swChkSt == data.swChkSt_downloading || 
									thisData.swChkSt == data.swChkSt_waiting || 
									thisData.swChkSt == data.swChkSt_upgrading || 
									thisData.swChkSt == data.swChkSt_ok) {
							upgrading = 1;
							return ;
						}
						if (apNum > 0) {
							snStr += ",";
							modelStr += ",";
							swVerStr += ",";
						}
						var swVerArr= new Array();
						swVerArr = thisData.softwareVersion.split(" ");
						if (swVerArr.length > 1) {
							swVerStr += swVerArr[1];
						} else {
							swVerStr += thisData.softwareVersion;
						}
						snStr += thisData.serNum;
						modelStr += thisData.typesForFile;
						apNum = apNum + 1;
					});
					var datapara = snStr + modelStr + swVerStr;
					if (upgrading == 1) {
						Tips.showInfo(T("ap_upgrading_opraitonforbid"));
					} else {
						$.ajax({
						url: '/goform/formSwRemoteCheck',
						type: 'POST',
						data: datapara,
						success: function(result) {
			   		 		var doEval = require('Eval');
			    			var codeStr = result,
			    			variableArr = ['status'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
			    			// 判断代码字符串执行是否成功
			    			if (isSuccess) {
				    			Tips.showSuccess(T('oprtSuccess'), 2);
				    			var test = 1;
				    			setTimeout(function(){
				    				display();
				    			},1000);
				    			display();
			    			} else {
								Tips.showError(T('parseStrErr'));
			    			}
						}
		    			});
					}	
				}
        	}
		}, 
		{
			"id": "upData",
			"name": T("auto_update"),
			"clickFunc" : function($btn){
				var pkArr = DATA['tableObj'].getSelectInputKey('data-primaryKey');
				if(pkArr.length < 1) {
					Tips.showInfo(T("select_ap_for_upgrade"));
				} else {
					var needUpgrade = 0;
					var data = DATA["AllData"];	
					var apNum = 0;
					var snStr = "sn=";
					pkArr.forEach(function(keyobj){
						var thisData = database.getSelect({primaryKey : keyobj})[0];
						if (thisData.swChkSt == data.swChkSt_checked) {
							if (apNum > 0) {
								snStr += ",";
							}
							snStr += thisData.serNum;
							apNum = apNum + 1;
							needUpgrade = 1;
						}
					});
					if (needUpgrade == 0) { 
						Tips.showInfo(T("detect_failed_for_apupgrade"));
					} else {
						$.ajax({
						url: '/goform/formUpgradeFirmwareRemote',
						type: 'POST',
						data: snStr,
						success: function(result) {
			   		 		var doEval = require('Eval');
			    			var codeStr = result,
			    			variableArr = ['status'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
			    			// 判断代码字符串执行是否成功
			    			if (isSuccess) {
				    			Tips.showSuccess(T('oprtSuccess'), 2);
				    			display();
			    			} else {
								Tips.showError(T('parseStrErr'));
			    			}
						}
		    			});
		    		}
				}
        	}

		},
		*/
        {
			"id": "upDataLocal",
			"name": T("manual_update"),
			"clickFunc" : function($btn){
				var pkArr = DATA['tableObj'].getSelectInputKey('data-primaryKey');
				if(pkArr.length < 1) {
					Tips.showInfo(T("select_ap_for_upgrade"));
				} else {
					var isSameType = 1;
					var upgrading = 0;
					var apNum = 0;
					var model = "";
					var hwVer = "";
					var snStr = "";
					var macStr = "";
					var passwdStr = "";		
					var data = DATA["AllData"];			
					pkArr.forEach(function(keyobj){
						var thisData = database.getSelect({primaryKey : keyobj})[0];
						if (upgrading == 1) {
							return ;
						} else if (thisData.swChkSt == data.swChkSt_downloading || 
									thisData.swChkSt == data.swChkSt_waiting || 
									thisData.swChkSt == data.swChkSt_upgrading || 
									thisData.swChkSt == data.swChkSt_ok) {
							upgrading = 1;
							return ;
						}
						if (apNum > 0) {
							snStr += ",";
							macStr += ",";
							passwdStr += ",";
							if (model != thisData.typesForFile || hwVer != thisData.firmwareVersion) {
								isSameType = 0;
							}
						} else {
							model = thisData.typesForFile;
							hwVer = thisData.firmwareVersion;
						}

						snStr += thisData.serNum;
						macStr += thisData.macStr;
						passwdStr += "admin";
						apNum = apNum + 1;
					});
					if (upgrading == 1) {
						Tips.showInfo(T("ap_upgrading_opraitonforbid"));
					} else if (isSameType == 1) {
						//Tips.showConfirm('{AP设备即将进行升级，请勿断开网络和电源连接}',function(){
							makeUpgradeLocalModal(model, hwVer, snStr, macStr, passwdStr);
						//}
					} else {
						Tips.showInfo(T("local_upgrade_for_sametype"));
					}
				}
        	}

		}];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};

	//导入弹框
	function makeUpgradeLocalModal(model, hwVer, snStr, macStr, passwdStr) {
		var modaobjs = '';

	    var modalList = {
		"id": "",
		"size":'normal',
		"title": T("manual_upgrade"),
		"btns" : [
		{
		    "name"      : T("upgrade"),
		    'id'	: 'demo_upgrade',
		    "clickFunc" : function($this){
			// $this 代表这个按钮的jQuery对象，一般不会用到
			var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
			/*
			if(/.*[\u4e00-\u9fa5 ]+.*$/.test(thisfilename)) {
			    require('Tips').showWarning('{fileNameCanBeChineseOrSpace}');
			    return false;
			}
			*/
			var dom = $this.parents('.modal').find('#chooseFileHide')[0];
			var files = dom.files[0];

			if (!files) {
				require('Tips').showWarning('{nofileInput}');
				return false;
			}
			var name = files.name;

			if($dom.find('[name="fileSrc"]').val()=='') {
			    require('Tips').showWarning('{nofileInput}');
			    return false;
			}
			var $modal = $this.parents('.modal');
			var formData1 = new FormData($modal.find('#fileform')[0]);
			formData1.append("model", model);
			formData1.append("hwVer", hwVer);
			formData1.append("snStr", snStr);
			formData1.append("macStr", macStr);
			formData1.append("passwdStr", passwdStr);
		     $.ajax({
		          url: 'goform/formUpgradeFirmwareLocal',
		          type: 'POST',
		          data: formData1,
		          async: false,
		          cache: false,
		          contentType: false,
		          processData: false,
		          success: function (returndata) {
		          	eval(returndata);
		          	if(status){
		          		//Tips.showSuccess(T("oprtSuccess"));
                        var thisip = '';
                        var timer = Tips.showTimer(tl('ApUpdatewaiting'),120,function(){
                            window.location = thisip;
                        });
		          		modaobjs.hide();
		          		display();
		          	} else {
		          		Tips.showError(T(errorstr));
		          	}
		          }
		     });
		    }

		},
			{
			"type"      : 'close'
		    }
		]
	    };
	    var inputList = [
	    {
		"prevWord": T("filepath"),
		"inputData": {
		    "type": 'text',
		    "name": 'fileSrc'
		},
		"afterWord": ''
	    }];
	    //获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    modaobjs = modaobj;
	    //获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    //添加到指定位置
	    $modal.find('.modal-body').empty().append($dom);
	    var btnslist = [
		    {
				"name":T("choosefile"),
				"id":'chooseFile',
				"clickFunc":function($this){
				}
		    }
	    ];
	    InputGroup.insertBtn($dom,'fileSrc',btnslist);
	    var $flie = $('<input type="file" id="chooseFileHide" name="filename" style="display:none"/>');
	    $dom.append($flie);
	    $dom.find('#chooseFile').click(function(){
			$flie.click();
	    });
	    $flie.change(function(){
			$dom.find('[name="fileSrc"]').val($(this).val());
	    });
	    $dom.wrap('<form id="fileform"></form>');
	    modaobj.show();
	    var tranDomArr = [$modal];
	    Translate.translate(tranDomArr, dicArr);
	}
		
		// 表格配置数据
		var tableList = {
			"database": database,
			otherFuncAfterRefresh:afterTabel,
			"isSelectAll":true,
			"dicArr" : ['common','doSoftMgnt','doEqMgmt'],
			"titles": {
				"ID"		 	: {
					"key": "ID",
					"type": "text",
				},
				"{equipment_type}"	 	: {
					"key": "typesForFile",
					"type": "text",
				},
				"{hardware_version}"	 	: {
					"key": "firmwareVersion",
					"type": "text",
				},
				
				"MAC"	 	: {
					"key": "macStr",
					"type": "text",
				},
				"{current_soft_version}"	: {
					"key": "softwareVersion",
					"type": "text",
				},
			/*	
                "{new_soft_version}"	: {
					"key": "lastSoftwareVersion",
					"type": "text",
				},
				"{update}"		 	: {
					"type":'links',
					"links": 
					[{
						"id": "upData",
						"name":T("update"),
						"clickFunc" : function($btn){
							var upgrading = 0;
							var data = DATA["AllData"];	
							var apNum = 0;
							var canUpgrage = 1;
							var primaryKey = $btn.attr('data-primaryKey')
							var thisData = database.getSelect({primaryKey : primaryKey})[0];
							if (thisData.swChkSt == data.swChkSt_downloading || 
									thisData.swChkSt == data.swChkSt_waiting || 
									thisData.swChkSt == data.swChkSt_upgrading || 
									thisData.swChkSt == data.swChkSt_ok) {
								upgrading = 1;
							}
							var snStr = "sn=" + thisData.serNum;
							if (thisData.swChkSt != DATA["AllData"].swChkSt_checked) {
								canUpgrage = 0;
							}
							if (upgrading == 1) {
								Tips.showInfo(T("ap_upgrading_opraitonforbid"));
							} else if (canUpgrage) {
								Tips.showConfirm(T("apupdate_waiting"), function(){		
									$.ajax({
									url: '/goform/formUpgradeFirmwareRemote',
									type: 'POST',
									data: snStr,
									success: function(result) {
			   		 					var doEval = require('Eval');
			    						var codeStr = result,
			    						variableArr = ['status'],
										result = doEval.doEval(codeStr, variableArr),
										isSuccess = result["isSuccessful"];
			    						// 判断代码字符串执行是否成功
			    						if (isSuccess) {
				    						Tips.showSuccess(T('oprtSuccess'), 2);
				    						display();
			    						} else {
											Tips.showError(T('parseStrErr'));
			    						}
									}
		    						});
		    					});
		    				} else {
		    					Tips.showInfo(T("detect_failed_for_apupgrade"));
		    				}
	        			}
					}]
				}
			*/
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
	function afterTabel(tbobj){
		tbobj.getDom().find('td[data-column-title="{new_soft_version}"]').each(function(){
			if($(this).children('span').text() == 'link_detect_waited'){
				var $link = $('<a class="u-inputLink" data-local='+T("check_update")+'>'+T("check_update")+'</a>');
				$link.attr('data-primarykey',$(this).parent().find('[data-table-type="select"]').attr('data-primarykey'));
				$(this).empty().append($link);
				$link.click(function(){
					beginCheck($(this).attr('data-primarykey'));
				});
			}
		})
	}
	function beginCheck(keyobj){
		var upgrading = 0;
		var data = DATA["AllData"];	
		var apNum = 0;
		var snStr = "sn=";
		var modelStr = "&model="
		var swVerStr = "&swVer=";
		var thisData = DATA["tableData"].getSelect({primaryKey : keyobj})[0];
		
		if (apNum > 0) {
			snStr += ",";
			modelStr += ",";
			swVerStr += ",";
		}
		var swVerArr= new Array();
		swVerArr = thisData.softwareVersion.split(" ");
		if (swVerArr.length > 1) {
			swVerStr += swVerArr[1];
		} else {
			swVerStr += thisData.softwareVersion;
		}
		snStr += thisData.serNum;
		modelStr += thisData.typesForFile;
		apNum = apNum + 1;
		var datapara = snStr + modelStr + swVerStr;
		if (upgrading == 1) {
			Tips.showInfo(T("ap_upgrading_opraitonforbid"));
		} else {
			$.ajax({
			url: '/goform/formSwRemoteCheck',
			type: 'POST',
			data: datapara,
			success: function(result) {
		 		var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['status'],
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
	    			Tips.showSuccess(T('oprtSuccess'), 2);
	    			var test = 1;
	    			setTimeout(function(){
	    				display();
	    			},1000);
	    			display();
				} else {
					Tips.showError(T('parseStrErr'));
				}
			}
			});
		}
	}
	
	
	module.exports = {
		display: display
	};
	
})
