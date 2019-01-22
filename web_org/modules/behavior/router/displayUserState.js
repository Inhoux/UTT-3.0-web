define(function(require, exports, module) {
	require('jquery');
	var Translate  = require('Translate');
    var dicArr     = ['common','doPeopleOrganize'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	var Tips = require('Tips');
	var DATA = {};
	DATA.settimenum = 5000;
	
	function display($container) {
		// 清空标签页容器
		$container.empty();
		displayTable($container);
	}
	function displayTable($container){
		var $tableConDom = getTableConDom();
		$container.append($tableConDom);
		showTable($tableConDom);
	}
	function getTableConDom(){
		var TableContainer = require('P_template/common/TableContainer');
		var html           = TableContainer.getHTML({});
		return $(html);
	}
	function setTimeForAjax(){
		var newsettime = $('#content li.active>a[data-toggle="tab"]').attr('time-sign');
		DATA.timeoutobj =  setTimeout(function(){
			if(new RegExp('user_state').test(window.location.href) && newsettime ==$('#content li.active>a[data-toggle="tab"]').attr('time-sign') ){
				showTable('',true);
			}
		},DATA.settimenum);
	}
	function showTable($tableConDom,isfresh,ishandle){
		/*
			接口的url地址
		 */
		var _url = 'common.asp?optType=UserStatus|Organization';
		$.ajax({
			url     : _url,
			type    : 'GET',
			data    : '',
			success : function(jsStr){
				//console.dir(jsStr);
				if(jsStr !== false){
					/*
						处理js字符串并返回数据库引用
					 */
					var database  = getDBFromJsStr(jsStr);
					/*
						将数据库引用存入DATA变量
					 */
					DATA["db"]    = database;
					/*
						获取表格dom
					 */
					if(isfresh){
						DATA["tableObj"].refresh(database);
					}else{
						var $tableDom = getTableDom(database);
						/*
							将包裹容器清空
							并把表格放入
				 		 */
				 		$tableConDom.empty().append($tableDom);

					}
					if(!ishandle){
						setTimeForAjax();
					}


				}else{

					console.log('js error');
				}
			}
		});
	}
	function getRateKbps(value) {
		var rate = parseInt(value);
//		var result = rate * 8 / 1024;
		var result = rate / 1024;
		return parseInt(result);
	}
	function getBitToByte(value) {
		var rate = parseInt(value);
		var result = rate / 8;
		return parseInt(result);
	}
	function secondToTime(value) {
		var theTime = parseInt(value);
	    var theTime1 = 0; // 分
    	var theTime2 = 0; // 小时
    	var theTime3 = 0; // 天
    	if(theTime > 60) {
        	theTime1 = parseInt(theTime/60);
        	theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
            	theTime2 = parseInt(theTime1/60);
            	theTime1 = parseInt(theTime1%60);
				if(theTime2 > 24) {
            		theTime3 = parseInt(theTime2/24);
            		theTime2 = parseInt(theTime2%24);
            	}
            }
    	}
        var result = ""+parseInt(theTime1)+"{minute}";
        if(theTime2 > 0) {
        	result = ""+parseInt(theTime2)+"{hour}"+result;
        }
        if(theTime3 > 0) {
        	result = ""+parseInt(theTime3)+"{day}"+result;
        }
   	 	return result;
	}
	function getDBFromJsStr(jsStr){
		var Eval = require('Eval');
		var variableArr = ['allDatas','allOnlineDatas','wireless','vlan'];
		var result = Eval.doEval(jsStr, variableArr);
		var data = result["data"];
		var allDatas = data['allDatas'];
		var allOnlineDatas = data["allOnlineDatas"];
		var wirelessOn = data["wireless"];
		var vlanOn = data["vlan"]
		DATA['hideItem'] = [];
		if (wirelessOn == 0) {
			DATA['hideItem'].push("{signalStrength}");
		}
		if (vlanOn == 0) {
			DATA['hideItem'].push("{vlanID}");
		}
		var arrData = [];
		allOnlineDatas.forEach(function(rule, index){
			arrData.push([
					index+1,
					rule["name"],
					rule["baseGrpName"],
					rule["vlanId"],
					rule["normalIP"],
					rule["normalMac"],
					rule["bindType"],
					rule["signalStrength"], //信号强度
					secondToTime(rule["startTime"]),
					getRateKbps(rule["inbits"]),
					getRateKbps(rule["outbits"]),
					rule["id"],
					rule["pid"],
					getBitToByte(rule["txBytes"]),
					getBitToByte(rule["rxBytes"])
				]);
		});

		//所有组织架构数据存入DATA
		DATA.allDatas = allDatas;
		/*
			引入数据库模块
			并创建一个新的数据表
		 */
		var Database = require('Database');
		var database = Database.getDatabaseObj();
		/*
			声明数据表的字段
			将数据存入数据表
		 */
		var fields = [
				'ID',
				'username',
				'group',
				'vlanID',
				'IP',
				'mac',
				'authType',
				'signalStrength',
				'onlineTime',
				'upSpeed',
				'downSpeed',
				'orgId',
				'orgPid',
				'txBytes',
				'rxBytes'
				];
		database.addTitle(fields);
		database.addData(arrData);
		return database;
	}

	//移动到弹框
	function makeMoveModal(){
		var moveArr = DATA["tableObj"].getSelectInputKey('data-primaryKey');
		if(moveArr.length < 1){
			Tips.showInfo('{warn_move_choose}');
			return ;
		}

		 var modalList = {
			"id": "modal-move",
			"title": "{warn_move}",
			"btns" : [
				{
				    "type"      : 'save',
				    "clickFunc" : function($this){
					// $this 代表这个按钮的jQuery对象，一般不会用到
					var $modal = $this.parents('.modal');
					if($modal.find('[name="groupArr"]>option').length <1){
						Tips.showWarning(T("warn_no_group"));
					}else{
						movesave(moveArr);
					}

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
	    var modaobj = Modal.getModalObj(modalList);
	    DATA.modaobj = modaobj;

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
				"prevWord": '{warn_move_confirm}',
				"inputData": {
				    "type": 'select',
				    "name": 'groupArr',
				    "defaultValue": "",
				    "items": groupItems
				},
				"afterWord": ''
		    }
	    ];

	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
		modaobj.insert($dom);
		Translate.translate([modaobj.getDom()], dicArr);
		modaobj.show();

		function tempajax(){

		}
		function normalajax(){

		}

		// 移动保存
		function movesave(moveArr){
			var tempUserArr = [];
			var normalUserArr = [];
			moveArr.forEach(function(keyobj){
				var thisData = DATA["db"].getSelect({"primaryKey" : keyobj})[0];
				if(thisData.orgPid == 1){
					// 临时用户
					tempUserArr.push(thisData);
				}else{
					// 正常用户
					normalUserArr.push(thisData);
				}
			});
			var moveSuccess = {
				temp:false,
				normal:false,
				success:0,
				postStatus:0
			};

			if(tempUserArr.length >0){
				// 临时用户
				moveSuccess.temp = true;
				var dataStr ='data=';
				tempUserArr.forEach(function(tempObj){
					dataStr += tempObj.IP+' '+tempObj.mac+';';
				});
				dataStr = dataStr.substr(0,dataStr.length-1);
				dataStr += "&pid="+DATA.modaobj.getDom().find('[name="groupArr"]').val();

				$.ajax({
					url     : '/goform/formAddReadArp_mul',
					type    : 'POST',
					data    : dataStr,
					success : function(result){
						eval(result);
						if(status){
							moveSuccess.success++;
						}else{
							DATA.errorStr1 = errMsg;
						}
						moveSuccess.postStatus ++;
					}
				});
			}
			
			DATA.num = 0;
			if(normalUserArr.length >0){
				// 正常用户
				moveSuccess.normal = true;

				var IPOrMacStr = 'IPOrMac=';
				var IPOrMacCount = 0;

				var IPMacStr = 'IPMac=';
				var IPMacCount = 0;

				var PPPoEStr = 'PPPoE=';
				var PPPoECount = 0;

				var WebStr = 'Web=';
				var WebCount = 0;
				normalUserArr.forEach(function(normalObj){
					if(normalObj.authType == 'IP' || normalObj.authType == 'MAC' ){
						IPOrMacStr += normalObj.orgId+',';
						IPOrMacCount++;
					}
					else if(normalObj.authType == 'Web'){
						WebStr += normalObj.orgId+',';
						WebCount++;
					}
					else if(normalObj.authType == 'PPPoE'){
						PPPoEStr += normalObj.orgId+',';
						PPPoECount++;
					}
					else if(normalObj.authType == 'IP/MAC'){
						IPMacStr += normalObj.orgId+',';
						IPMacCount++;
					}

				});
				IPOrMacStr = IPOrMacStr.substring(0,(IPOrMacStr.length-1))+"&";
				IPMacStr = IPMacStr.substring(0,(IPMacStr.length-1))+"&";
				PPPoEStr = PPPoEStr.substring(0,(PPPoEStr.length-1))+"&";
				WebStr = WebStr.substring(0,(WebStr.length-1));
				var dataStr = "pid="+DATA.modaobj.getDom().find('[name="groupArr"]').val() +'&';
				if(IPOrMacCount == 0)
					IPOrMacStr ='';
				if(IPMacCount == 0)
					IPMacStr ='';
				if(PPPoECount == 0)
					PPPoEStr ='';
				if(WebCount == 0)
					WebStr = '';
				if(WebCount == 0){
						dataStr += (IPOrMacStr+IPMacStr+PPPoEStr);
					if(dataStr != ''){
						dataStr = dataStr.substring(0,(dataStr.length-1));
					}
				}else{
					dataStr += (IPOrMacStr+IPMacStr+PPPoEStr+WebStr);
				}

				$.ajax({
					url     : '/goform/formRemoveUser',
					type    : 'post',
					data    : dataStr,
					success : function(result){
						eval(result);
						if(status){
							moveSuccess.success++;
						}else{
							DATA.errorStr2 = errMsg;
						}
						DATA.num = num;
						moveSuccess.postStatus ++;
						
					}
				});
			}

			// 循环监听ajax执行的结果

			var realSuccessInt = setInterval(function(){
				
				var e1 = DATA.errorStr1;
				var e2 = DATA.errorStr2;
				if(moveSuccess.temp && moveSuccess.normal && (moveSuccess.postStatus == 2)){
					if(moveSuccess.success == 2){
						clearInterval(realSuccessInt);
						Tips.showSuccess('{saveSuccess}');
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}else if(e1 != ''){
						clearInterval(realSuccessInt);
						var tmp = e1.replace(/^\{C_LANG_INDEX_TOTAL_BIND\}/, "");
						tmp = tmp.match(/^\d+/);
						tmp = Number(tmp[0]) + Number(DATA.num);
						e1 = e1.replace(/^\{C_LANG_INDEX_TOTAL_BIND\}\d+/, "{C_LANG_INDEX_TOTAL_BIND\}"+tmp);
						Tips.showError(e1);
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}else if(e2 != ''){
						clearInterval(realSuccessInt);
						Tips.showError(e2);
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}

				}else if(moveSuccess.temp && !moveSuccess.normal && (moveSuccess.postStatus == 1)){
					if(moveSuccess.success == 1){
						clearInterval(realSuccessInt);
						Tips.showSuccess('{saveSuccess}');
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}else if(e1 != undefined){
						clearInterval(realSuccessInt);
						Tips.showError(e1);
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}
				}else if(!moveSuccess.temp && moveSuccess.normal && (moveSuccess.postStatus == 1)){
					if(moveSuccess.success == 1){
						clearInterval(realSuccessInt);
						Tips.showSuccess('{saveSuccess}');
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}else if(e2 != undefined){
						clearInterval(realSuccessInt);
						Tips.showError(e2);
						DATA.modaobj.hide();
//						$('.nav a[href="#1"]').trigger('click');
						showTable('',true,true);
					}
				}else{

				}
			},100);



		}


	}
	

	//加入黑名单
	function insertBlacklist(){
		var moveArr = DATA["tableObj"].getSelectInputKey('data-primaryKey');
		if(moveArr.length < 1){
			Tips.showInfo('{warn_addBlack_choose}');
			return ;
		}

		Tips.showConfirm(T('warn_addBlack_confirm'),function(){

			var dataStr = "data=";
			moveArr.forEach(function(keyobj){
				var thisData = DATA["db"].getSelect({"primaryKey" : keyobj})[0];
				dataStr += thisData.mac+ ' ' + ';';
			});
			dataStr = dataStr.substr(0,dataStr.length-1);
			$.ajax({
				url : 'goform/formMacFilterBulkAdd',
				type : 'POST',
				data : dataStr,
				success : function(jsStr){
					var Eval = require('Eval');
					var variables = ['status', 'errMsg'];
					var result = Eval.doEval(jsStr, variables),
						isSuccess = result["isSuccessful"];
					if(isSuccess){
						var data = result["data"],
							status = data["status"];
						var Tips = require('Tips');
						if(status == '1'){
							Tips.showSuccess('{saveSuccess}');
//							$('.nav a[href="#1"]').trigger('click');
							showTable('',true,true);
						}else{
							var errorStr = data["errMsg"];
							Tips.showWarning('{saveFail}' + errorStr);

						}
					}
				}
			});

		});

	}

	function getTableDom(){
		// 表格上方按钮配置数据
		var btnList = [
			{
				id          : "refreshtable",
				name:'刷新',
				clickFunc:function(){
					showTable('',true,true);
				}

			},
			{
				"id"        : "move",
				"name"      : "{moveTo}",
				"clickFunc" : function(){
					makeMoveModal();
				}
			},
			{
				"id"        : "add-to-black-list",
				"name"      : "{addBlacklist}",
				"clickFunc" : function(){
					insertBlacklist();

				}
			}
			/*,
			{
				"id"        : "export",
				"name"      : "导出",
				"clickFunc" : function(){
				}
			}
			*/
		];
		// 表格上方操作区域配置数据
		var tableHeadData = {
			"btns"     : btnList
		};
		/*
			表格配置数据
		 */
		 var database = DATA["db"];
		var tableSettings = {
			"otherFuncAfterRefresh":tableFilterForHangUp,
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : true,       // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"ID" : {
					"key"    : "ID",
					"type"   : "text"
				},
				"{username}" : {
					"key"    : "username",
					"type"   : "text",
					sort	:'word'
				},
				"{baseGrp}" : {
					"key"    : "group",
					"type"   : "text"
				},
				"{vlanID}" : {
					"key"    : "vlanID",
					"type"   : "text",
					sort	:'word'
				},
				"{ip}" : {
					"key"    : "IP",
					"type"   : "text",
					sort	:'ip'
				},
				"{MACAddr}" : {
					"key"    : "mac",
					"type"   : "text",
					sort	:'mac'
				},
				"{authType}" : {
					"key"    : "authType",
					"type"   : "text",
					"values" : {
						"None" : '{no}',
						"IP"  : 'IP' + '{bind}',
						"MAC"  : 'Mac' + '{bind}',
						"IP/MAC"  : 'IP/Mac' + '{bind}',
					},
					sort	:'word'
				},

				"{signalStrength}" : {
					"key"    : "signalStrength",
					"type"   : "text",
					sort	:'word'
				},

				"{onlineTime}" : {
					"key"    : "onlineTime",
					"type"   : "text",
					sort	:'demotime'
				},
				"{upTotal}(Mbyte)" : {
					"key"    : "txBytes",
					"type"   : "text",
					sort	:'number'
				},
				"{downTotal}(Mbyte)" : {
					"key"    : "rxBytes",
					"type"   : "text",
					sort	:'number'
				},
				"{upSpeed}(Kbyte/s)" : {
					"key"    : "upSpeed",
					"type"   : "text",
					sort	:'number'
				},
				"{downSpeed}(Kbyte/s)" : {
					"key"    : "downSpeed",
					"type"   : "text",
					sort	:'number'
				},
				"{edit}": {
					"type": "links",
					"links": [
						{
							"id"      : "calldown",
							"name"    : "{Shield}",
							"clickFunc" : function($this){
								var thisData = database.getSelect({primaryKey:$this.attr('data-primaryKey')})[0];
								var dataStr = 'Action=add&'+'username='+thisData.username+'&filterMac='+thisData.mac;
								Tips.showConfirm(T('warn_addBlack_confirm'),function(){

									$.ajax({
										url : 'goform/ConfigMacFilter',
										type : 'POST',
										data : dataStr,
										success : function(jsStr){
											var Eval = require('Eval');
											var variables = ['status', 'errorstr'];
											var result = Eval.doEval(jsStr, variables),
												isSuccess = result["isSuccessful"];
											if(isSuccess){
												var data = result["data"],
													status = data["status"];
												var Tips = require('Tips');
												if(status == '1'){
													Tips.showSuccess('{Shielding_success}');
//													$('.nav a[href="#1"]').trigger('click');
													showTable('',true,true);
												}else{
													var errorStr = data["errorstr"];
													Tips.showWarning('{saveFail}' + errorStr);

												}
											}
										}
									});

								});

							}
						},
						{
							"id"      : "rechat",
							"name"    : "{Hang}",
							"clickFunc" : function($this){

								var thisData =  DATA["db"].getSelect({primaryKey:$this.attr('data-primaryKey')})[0];

								if(thisData.authType == 'Web'){

									var dataStr = 'hangup='+thisData.username;

									Tips.showConfirm(T('warn_hangup_confirm'),function(){

										$.ajax({
											url : 'goform/formWebAuthHangUp',
											type : 'POST',
											data : dataStr,
											success : function(jsStr){
												var Eval = require('Eval');
												var variables = ['status', 'errorstr'];
												var result = Eval.doEval(jsStr, variables),
													isSuccess = result["isSuccessful"];
												if(isSuccess){
													var data = result["data"],
														status = data["status"];
													var Tips = require('Tips');
													if(status == '1'){
														Tips.showSuccess('{hang_success}');
//														$('.nav a[href="#1"]').trigger('click');
														showTable('',true,true);
													}else{
														var errorStr = data["errorstr"];
														Tips.showWarning('{saveFail}' + errorStr);

													}
												}
											}
										});

									});
								}else if(thisData.authType == 'PPPoE'){
									var dataStr = 'hangip='+thisData.IP;

									Tips.showConfirm(T('warn_hangup_confirm'),function(){

										$.ajax({
											url : 'goform/formPppoeHangUp_Single',
											type : 'POST',
											data : dataStr,
											success : function(jsStr){
												var Eval = require('Eval');
												var variables = ['status', 'errorstr'];
												var result = Eval.doEval(jsStr, variables),
													isSuccess = result["isSuccessful"];
												if(isSuccess){
													var data = result["data"],
														status = data["status"];
													var Tips = require('Tips');
													if(status == '1'){
														Tips.showSuccess('{hang_success}');
//														$('.nav a[href="#1"]').trigger('click');
														showTable('',true,true);
													}else{
														var errorStr = data["errorstr"];
														Tips.showWarning('{saveFail}' + errorStr);

													}
												}
											}
										});

									});
								}
							}
						}
					]
				}
				// 这个图标暂时没有，就没加
			},
			"hideColumns" : DATA['hideItem'] ,
			"lang"        : 'zhcn',
			/*
				写字典
			 */
			"dicArr"      : ['common', 'doPeopleOrganize']
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				head  : tableHeadData,
				table : tableSettings
			}),
			tableDom  = tableObj.getDom();



		/*
		 	遍历去除不需要的挂断
		 * */
			
			
			function tableFilterForHangUp(thisTableObj){
				thisTableObj.getDom().find('[data-local="{Hang}"]').each(function(){
					var $t = $(this);
					var thisData =  DATA["db"].getSelect({primaryKey:$t.attr('data-primaryKey')})[0];
					if(thisData.authType != 'Web' && thisData.authType != 'PPPoE'){
						$t.remove();
					}
				});
			}
		/*
			将表格对象存入全局变量
		 */
		DATA["tableObj"] = tableObj;

		/*
		 	添加刷新下拉框
		 * */
		// 添加刷新下拉框
		var selecthtml = '<select id=""tableRefreshTime style="margin-right:5px;width:67px">'+
//							'<option value="1">1</option>'+
							'<option value="3">3</option>'+
							'<option value="5" selected="selected">5</option>'+
							'<option value="10">10</option>'+
							'<option value="60">60</option>'+
							'<option value="manual">手动</option>'+
						'</select>';
		var $selh = $(selecthtml);
		$selh.change(function(){
			clearTimeout(DATA.timeoutobj);
			var $t = $(this);
			if($t.val() != 'manual'){
				DATA.settimenum = $t.val()*1000;
				setTimeForAjax()
			}else{
				clearTimeout(DATA.timeoutobj);
			}
		});
		var $newli = $('<li style="margin-right:5px" class="utt-inline-block"></li>');
		$newli.append('<span>刷新时间：</span>');
		$newli.append($selh);
		$newli.append('<span style="margin-right:5px">秒</span>')
		tableDom.find('#btns>ul').prepend($newli);

		return tableDom;
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
