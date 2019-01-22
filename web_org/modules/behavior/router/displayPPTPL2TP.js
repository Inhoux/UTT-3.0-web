define(function(require, exports, module) {
	var DATA = {};
	DATA['backData']={};
	
	var Translate  = require('Translate');
	var dicArr     = ['common','doPPTPL2TP'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	var configPage = require('P_config/config');
function processDataPPTPCLIENT(jsStr) {
		
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
						"PPTPClientEnables",
						"setNames",
						"userNames",
						"serverGwIps",
						"serverLanIps",
						"serverLanNetMasks",
						"statuss",
						"usetimes",
						"outboundss",
						"inboundss",
						"EncryptionModes",
						"AuthTypes",
						"passwds",
						"PPTPClientNATEnables",
						"MTU"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
						"serverType",
						"Enables",
						"TunNames",
						"userType",
						"userNames",
						"GatewayIp",
						"lanIps",
						"lanNetMasks",
						"statuss",
						"usetimes",
						"outboundss",
						"inboundss",
						"EncryptionModes",
						"AuthTypes",
						"passwds"
						], // 表格头部的标题列表
				PPTPClientEnablesArr=data['PPTPClientEnables'] 	|| ' ',
				setNamesArr 		=data['setNames'] 			|| ' ',
				userNamesArr 		=data['userNames'] 			|| ' ',
				serverGwIpsArr 		=data['serverGwIps'] 		|| ' ',
				serverLanIpsArr 	=data['serverLanIps'] 		|| ' ',
				serverLanNetMasksArr=data['serverLanNetMasks']	|| ' ',
				statussArr 			=data['statuss']			|| ' ',
				usetimesArr 		=data['usetimes']			|| ' ',
				outboundssArr 		=data['outboundss']			|| ' ',
				inboundssArr 		=data['inboundss']			|| ' ',
				EncryptionModesArr 	=data['EncryptionModes']	|| ' ',
				AuthTypesArr 		=data['AuthTypes']			|| ' ',
				passwdsArr			=data['passwds']			|| ' ';

				DATA["PPTPClientNATEnables"]=data['PPTPClientNATEnables']||' ';
				DATA["MTU"]=data['MTU'];
				var dataArr = [];
				PPTPClientEnablesArr.forEach(function(item, index, arr) {
					var arr = [];
					arr.push('PPTP1');
					arr.push(PPTPClientEnablesArr[index]);
					arr.push(setNamesArr[index]);
					arr.push('-');/*user_type*/
					arr.push(userNamesArr[index]);
					arr.push(serverGwIpsArr[index]);
					arr.push(serverLanIpsArr[index]);
					arr.push(serverLanNetMasksArr[index]);
					arr.push(statussArr[index]);
					arr.push(getTimeStrBySecond(usetimesArr[index]));
					//arr.push(usetimesArr[index]);
					arr.push(outboundssArr[index]);
					arr.push(inboundssArr[index]);
					arr.push(EncryptionModesArr[index]);
					arr.push(AuthTypesArr[index]);
					arr.push(passwdsArr[index]);
					
					dataArr.push(arr);
			});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
		
			return {
				table: tableData
			};
		} else {
			console.log('字符串解析失败')
		}
}
function processDataPPTPServer(jsStr) {
		
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
						"srvAcc_enables",
						"srv_instNames",
						"srv_peerTypes",
						"srv_userNames",
						"srv_remoteGwIps",
						"srv_remoteLanIps",
						"srv_remoteNetmasks",
						"srv_statuss",
						"srv_useTimes",
						"srv_inboundss",
						"srv_outboundss",
						"EncryptionModes",
						"AuthTypes",
						"passwds",
						"LanMac",
						"bindIps",
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
			
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
						"Enables",
						"setNames",
						"userNames",
						"serverGwIps",
						"serverLanIps",
						"serverLanNetMasks",
						"statuss",
						"usetimes",
						"outtimes",
						"outboundss",
						"inboundss"

						], // 表格头部的标题列表
				srvAcc_enablesArr 		=data['srvAcc_enables'] 	|| ' ',
				srv_instNamesArr 		=data['srv_instNames'] 		|| ' ',
				srv_peerTypesArr 		=data['srv_peerTypes'] 		|| ' ',
				srv_userNamesArr 		=data['srv_userNames'] 		|| ' ',
				srv_remoteGwIpsArr 		=data['srv_remoteGwIps'] 	|| ' ',
				srv_remoteLanIpsArr 	=data['srv_remoteLanIps'] 	|| ' ',
				srv_remoteNetmasksArr 	=data['srv_remoteNetmasks'] || ' ',
				srv_statussArr 			=data['srv_statuss'] 	 	|| ' ',
				srv_useTimesArr 		=data['srv_useTimes'] 		|| ' ',
				srv_outboundssArr 		=data['srv_outboundss'] 	|| ' ',
				srv_inboundssArr 		=data['srv_inboundss'] 		|| ' ',
				EncryptionModesArr 	 	=data['EncryptionModes']	|| ' ',
				AuthTypesArr 		 	=data['AuthTypes']			|| ' ',
				passwdsArr 				=data['passwds'] 			|| ' ';
				DATA["PPTPLanMac"]=data['LanMac'];
				DATA["bindIps"]=data["bindIps"];
				var dataArr = [];
				srvAcc_enablesArr.forEach(function(item, index, arr) {
						var arr = [];

						arr.push('PPTP2');
						arr.push(srvAcc_enablesArr[index]);
						arr.push(srv_instNamesArr[index]);
						arr.push(srv_peerTypesArr[index]);
						arr.push(srv_userNamesArr[index]);
						arr.push('-');
						//arr.push(srv_remoteGwIpsArr[index]);
						arr.push(srv_remoteLanIpsArr[index]);
						arr.push(srv_remoteNetmasksArr[index]);
						arr.push(srv_statussArr[index]);
						arr.push(getTimeStrBySecond(srv_useTimesArr[index]));
						//arr.push(srv_useTimesArr[index]);
						arr.push(srv_outboundssArr[index]);
						arr.push(srv_inboundssArr[index]);
						arr.push(EncryptionModesArr[index]);
						arr.push(AuthTypesArr[index]);
						arr.push(passwdsArr[index]);

						dataArr.push(arr);
			});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
		
			return {
				table: tableData
			};
		} else {
			console.log('字符串解析失败')
		}
}
function processDataL2TPCLIENT(jsStr) {
	
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
						"L2TPClientEnables",
						"cli_setNames",
						"cli_userNames",
						"cli_serverGwIps",
						"cli_serverLanIps",
						"cli_serverLanNetMasks",
						"cli_statuss",
						"cli_usetimes",
						"cli_outboundss",
						"cli_inboundss",
						"EncryptionModes",/*此项为空,因为这个东西没有密码验证方式*/
						"AuthTypes",
						"passwds"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
			
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
						"serverType",
						"Enables",
						"TunNames",
						"userType",
						"userNames",
						"GatewayIp",
						"lanIps",
						"lanNetMasks",
						"statuss",
						"usetimes",
						"outboundss",
						"inboundss"
						], // 表格头部的标题列表

				L2TPClientEnablesArr 	=data['L2TPClientEnables']		|| ' ',
				cli_setNamesArr 		=data['cli_setNames']			|| ' ',
				cli_userNamesArr 		=data['cli_userNames']			|| ' ',
				cli_serverGwIpsArr 		=data['cli_serverGwIps']		|| ' ',
				cli_serverLanIpsArr 	=data['cli_serverLanIps']		|| ' ',
				cli_serverLanNetMasksArr=data['cli_serverLanNetMasks']	|| ' ',
				cli_statussArr 			=data['cli_statuss']			|| ' ',
				cli_usetimesArr 		=data['cli_usetimes']			|| ' ',
				cli_outboundssArr 		=data['cli_outboundss']			|| ' ',
				cli_inboundssArr 		=data['cli_inboundss']			|| ' ',
				EncryptionModesArr 	 	=data['EncryptionModes']		|| ' ',
				AuthTypesArr 		 	=data['AuthTypes']				|| ' ',
				passwdsArr 				=data['passwds'] 				|| ' ';

				var dataArr = [];
				L2TPClientEnablesArr.forEach(function(item, index, arr) {
						var arr = [];
						arr.push('L2TP1');
						arr.push(L2TPClientEnablesArr[index]);
						arr.push(cli_setNamesArr[index]);
						arr.push('-');
						arr.push(cli_userNamesArr[index]);
						arr.push(cli_serverGwIpsArr[index]);
						arr.push(cli_serverLanIpsArr[index]);
						arr.push(cli_serverLanNetMasksArr[index]);
						arr.push(cli_statussArr[index]);
						arr.push(getTimeStrBySecond(cli_usetimesArr[index]));
						//arr.push(cli_usetimesArr[index]);
						arr.push(cli_outboundssArr[index]);
						arr.push(cli_inboundssArr[index]);
						arr.push(EncryptionModesArr[index]);
						arr.push(AuthTypesArr[index]);
						arr.push(passwdsArr[index]);

						
						dataArr.push(arr);
				});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
		
			return {
				table: tableData
			};
		} else {
			console.log('字符串解析失败')
		}
}
function processDataL2TPServer(jsStr) {
		
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
						"enables",
						"instNames",
						"peerTypes",
						"userNames",
						"remoteLanIps",
						"remoteNetmasks",
						"statuss",
						"useTimes",
						"inboundss",
						"outboundss",
						"EncryptionModes",/*此项为空,因为这个东西没有密码验证方式*/
						"AuthTypes",
						"passwds"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
			
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
						"serverType",
						"Enables",
						"TunNames",
						"userType",
						"userNames",
						"GatewayIp",
						"lanIps",
						"lanNetMasks",
						"statuss",
						"usetimes",
						"outboundss",
						"inboundss"
						], // 表格头部的标题列表
				
				enablesArr 			=data['enables']			|| '0',
				instNamesArr		=data['instNames']			|| ' ',
				peerTypesArr		=data['peerTypes']			|| ' ',
				userNamesArr		=data['userNames']			|| ' ',
				remoteLanIpsArr 	=data['remoteLanIps'] 		|| ' ',
				remoteNetmasksArr 	=data['remoteNetmasks'] 	|| ' ',
				statussArr 			=data['statuss'] 			|| ' ',
				useTimesArr 		=data['useTimes']			|| ' ',
				inboundssArr 		=data['inboundss'] 			|| ' ',
				outboundssArr 		=data['outboundss']			|| ' ',
				EncryptionModesArr 	=data['EncryptionModes']	|| ' ',
				AuthTypesArr 		=data['AuthTypes']			|| ' ',
				passwdsArr 			=data['passwds'] 			|| ' ';

				var dataArr = [];
				instNamesArr.forEach(function(item, index, arr) {
					var arr = [];
					arr.push('L2TP2');
					arr.push(enablesArr[index]);
					arr.push(instNamesArr[index]);
					arr.push(peerTypesArr[index]);
					arr.push(userNamesArr[index]);
					arr.push('--');/*gateWays*/
					arr.push(remoteLanIpsArr[index]);
					arr.push(remoteNetmasksArr[index]);
					arr.push(statussArr[index]);

					arr.push(getTimeStrBySecond(useTimesArr[index]));
					arr.push(inboundssArr[index]);
					arr.push(outboundssArr[index]);
					arr.push(EncryptionModesArr[index]);
					arr.push(AuthTypesArr[index]);
					arr.push(passwdsArr[index]);

				
					dataArr.push(arr);
				});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
		
			return {
				table: tableData
			};
		} else {
			console.log('字符串解析失败')
		}
}
function getTimeStrBySecond(time){
	if(isNaN(time)){
		return time;
	}
	var time = parseInt(time);
	console.log(time);
	var timeDay=parseInt(time/(60*60*24));
	console.log("day:"+timeDay);
	var timeHour=parseInt((time-timeDay*24)/(60*60));
	console.log(timeHour);
	var timeMin=parseInt((time-timeDay*24*60*60-timeHour*60*60)/60);
	console.log(timeMin);
	var timeSec=parseInt(time-timeDay*24*60*60-timeHour*3600-timeMin*60);
	console.log("sec:"+timeSec);
	var timeStr='';
	if(timeDay >0)
		timeStr=timeDay+'{day}';
	if(timeHour > 0)
		timeStr=timeStr+timeHour+'{hour}';
	if(timeMin>0)
		timeStr=timeStr+timeMin+'{minute}';
	timeStr=timeStr+timeSec+'{second}';
	return timeStr;
}
function getTableDom() {
		var Tips = require('Tips');
		// 表格上方按钮配置数据
		console.dir(DATA);
		var btnList = [
			{
				"id": "add",
				"name": "{add}",
				 "clickFunc" : function($btn){
	            	addBtnClick();
	        	}
			},
			{
				"id": "delete",
				"name": "{delete}",
				"clickFunc" : function($btn){
	            	deleteBtnClick();
	        	}
		}];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			otherFuncAfterRefresh:afterTabel,
			"dicArr"     : ['common','doPPTPL2TP'],
			"titles": {
				"{tunnelName}"		 : {
					"key"	:"TunNames",
					"type"  :"text"
				},
				"{enable}"       : {
								"key": "Enables",
								"type": "checkbox",
								"values": {
									"1": true,
									"0": false,
									"on":true,
									"off":false
									},
								
								"clickFunc" : function($this){
									var primaryKey = $this.attr('data-primaryKey');
									var database = DATA.tableData;
									var data = database.getSelect({
										primaryKey: primaryKey
									})[0];
										
										if(data.serverType=='PPTP1'){
											var url='/goform/formPPTPCliAccAllow';
											var str='AllowID='+data.userNames+'&Allow='+(((data.Enables=='on')||(data.Enables=='1'))?'0':'1');
											callUp(str,url);
										}else if(data.serverType=='PPTP2'){
											var url='/goform/formPPTPSrvAccAllow';
											var str='AllowID='+data.userNames+'&Allow='+(((data.Enables=='on')||(data.Enables=='1'))?'0':'1');
											callUp(str,url);
										}else if(data.serverType=='L2TP1'){
											var url='/goform/formL2TPCliAccAllow';
											var str='AllowID='+data.userNames+'&Allow='+(((data.Enables=='on')||(data.Enables=='1'))?'0':'1');
											callUp(str,url);
											
										}else if(data.serverType=='L2TP2'){
											var url='/goform/formL2TPSrvAccAllow';
											var str='AllowID='+data.TunNames+'&Allow='+(((data.Enables=='on')||(data.Enables=='1'))?'0':'1');
											callUp(str,url);
											
										}
								}
				},
				
				"{connectStatus}"     :{
					"key" : "statuss",
					"type": "text",
					"values":{
						"0": "{offline}",
						"" : "{tryConnect}",
						"-1":"{offline}",
						"1": "{online}",
					}
				},
				
				"{protoType}"   :{
								"key": "serverType",
								"type": "text",
								"values": {
									"PPTP1": 'PPTP',
									"PPTP2": 'PPTP',
									"L2TP1": 'L2TP',
									"L2TP2": 'L2TP'
									}
								},

				"{workModel}"   : {
								"key": "serverType",
								"type": "text",
								"values": {
									"PPTP1": '{clientIn}',
									"PPTP2": '{serverOut}',
									"L2TP1": '{clientIn}',
									"L2TP2": '{serverOut}'
									}
				},
				
				"{userType}"	 : 	{
								"key": "userType",
								"type": "text",
								"values": {
									"lantolan" : '{lantolan}',
									"mobile" : '{mobileUser}',
									"-" : '-'
									
									}
				},
				"{remoteGwIP}"   :{
								"key": "GatewayIp",
								"type": "text",
				},
				"{remoteInIp}"   :{
								"key": "lanIps",
								"type": "text",
								"values": {
									"0.0.0.0":"-"
									}
				},
				"{seesionTime}"   :{
								"key": "usetimes",
								"type": "text",
				},
				"{outBound}(Byte)"   :{
								"key": "outboundss",
								"type": "text",
				},
				"{inBound}(Byte)"   :{
								"key": "inboundss",
								"type": "text",
				},
				
				"{operation}":{
					"key":'',
					"type":"links",
					"links":[
						{
							"id":'',
							"name":'{call}',
							"clickFunc":function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								})[0];
								
								if(data.serverType=='PPTP2'||data.serverType=='L2TP2'){
									Tips.showWarning(T("plsSelectClient"),2);
								}else{
									if(data.serverType=='PPTP1'){
										var url='/goform/formDia';
										var str='dialstr='+data.TunNames;
										callUp(str,url);
									}else{
										var url='/goform/formL2tpDial';
										var str='dialstr='+data.TunNames;
										callUp(str,url);
									}
									
								}

							}
						},
						{
							"id":'',
							"name":'{hangup}',
							"clickFunc":function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								})[0];
								
								if(data.serverType=='PPTP1'){
										var url='/goform/formhang';
										var str='hangstr='+data.TunNames;
										callUp(str,url);
									}else if(data.serverType=='PPTP2'){
										var url='/goform/formhang';
										var str='hangstrsrv='+data.userNames;
										callUp(str,url);
									}else if(data.serverType=='L2TP1'){
										var url='/goform/formL2tpHang';
										var str='hangstr='+data.TunNames;
										callUp(str,url);
									}else if(data.serverType=='L2TP2'){
										var url='/goform/formL2tpHang';
										var str='hangstrsrv='+data.userNames;
										callUp(str,url);
									}

							}
						}
					]
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								editBtnClick($this);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
							deleteClick($this);
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
		
		function afterTabel(nowTabdeObj){
			
			nowTabdeObj.getDom().find('input[type=checkbox][data-table-type="select"]').each(function(){
				var $t = $(this);
				var pk =$t.attr('data-primarykey');
				var thisdata = DATA["tableData"].getSelect({primaryKey : pk})[0];
				if(thisdata.TunNames == 'pptp'||thisdata.TunNames == 'l2tp'){
					$t.remove();
				}
			});
		}
		
		
		return $table;
	}
	function callUp(str,url) {
		var Tips = require('Tips');
		$.ajax({
			url: url,
			type: 'POST',
			data: str,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
					console.log(result);
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					if (status) {
						// 显示成功信息
						Tips.showSuccess('{oprtSuccess}', 2);
						display($('#1'));
					} else {
						var errorStr = data['errorstr'];
						//Tips.showWarning('拨号失败……' + errorStr, 2);
					}
				} else {
					Tips.showWarning('{netErr}', 2);
				}
			}
		});
	}


function addSubmitClick(needBack) {

	// 引入serialize模块
	var Serialize = require('Serialize');
	var database   = DATA["tableData"];
	var Tips = require('Tips');
	var $modal = $('#modal-add');
	var editFlag=0;
	
	if($modal.length==0){
		editFlag=1;
		$modal=$('#modal-edit');
	}
	if(require('InputGroup').checkErr($modal)>0){
		/*有输入错误不进行任何操作,直待修正*/
		
	}else{
	// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
		
		if( queryJson.protoType=='PPTP'){
			if(queryJson.workMode=='1'){
				POSTPPTPServer();
			}
			else{
				POSTPPTPClient();
			}
				
		}else{
			if(queryJson.workMode=='1'){
				POSTL2TPServer();
			}
			else{
				POSTL2TPClient();
			}
		}
		function POSTPPTPServer(){
			var pStr=queryStr;
			
			pStr=pStr.replace("TunNames", "instName");
			pStr=pStr.replace("userType", "userType");
			pStr=pStr.replace("userNames", "userName");
			pStr=pStr.replace("password", "passwd");
			pStr=pStr.replace("staticIPs", "bindIp");
			pStr=pStr.replace("remoteInIp", "remoteLanIp");
			pStr=pStr.replace("remoteInIPMask", "remoteLanNetmask");
		post(pStr,'/goform/pptpSrvAccountConfig')
		}
		function POSTPPTPClient(){
			var pStr=queryStr;
			pStr=pStr.replace("natEnables", "PPTPClientNATEnable");
			pStr=pStr.replace("TunNames", "setName");
			pStr=pStr.replace("userNames", "userName");
			pStr=pStr.replace("password", "passwd");
			pStr=pStr.replace("PPTP2AuthType", "AuthType");
			pStr=pStr.replace("EncryptionModes", "EncryptionMode");
			pStr=pStr.replace("remoteInIp", "serverLanIp");
			pStr=pStr.replace("remoteInIPMask", "serverLanNetMask");
			pStr=pStr.replace("TunNamesIP", "serverIp");
			pStr="PPTPClientEnable=on&"+pStr;
			post(pStr,'/goform/formPptpClientConfig')
		}
		
		function POSTL2TPClient(){
			var pStr=queryStr;
			pStr=pStr.replace("TunNames", "setName");
			pStr=pStr.replace("userType", "userType");
			pStr=pStr.replace("userNames", "userName");
			pStr=pStr.replace("password", "passwd");
			pStr=pStr.replace("TunNamesIP", "serverIp");
			pStr=pStr.replace("L2TPAuthTypes", "AuthType");
			pStr=pStr.replace("remoteInIp", "serverLanIp");
			pStr=pStr.replace("remoteInIPMask", "serverLanNetMask");
			
			pStr="L2TPClientEnable=on&"+pStr;
			
		post(pStr,'/goform/l2tpCliAccountConfig ')
		}
		function POSTL2TPServer(){
			var pStr=queryStr;
			pStr=pStr.replace("TunNames", "instName");
			pStr=pStr.replace("userType", "userType");
			pStr=pStr.replace("userNames", "userName");
			pStr=pStr.replace("password", "passwd");
			pStr=pStr.replace("remoteInIp", "remoteLanIp");
			pStr=pStr.replace("remoteInIPMask", "remoteLanNetmask");
		post(pStr,'/goform/l2tpSrvAccountConfig')
		}
		
		function post(str,purl){
			var Action='Action=add&';
			if(editFlag==1){
				
				deleteClick('hehe',DATA['primaryKey']);/*编辑前删除旧数据*/
			}
			
			if(needBack == 1){
				
				DATA['backData'].url=purl;
				DATA['backData'].str=str;
				DATA['backData'].needBackFlag=1;
				editFlag = 0;
				needBack=0;
			}else{
				if(DATA['cantEdit'] !=undefined && DATA['cantEdit'] == 1){
					var Action = 'Action=edit&';
					DATA['cantEdit']=undefined;
				}
				$.ajax({
				url: purl,
				type: 'POST',
				data: Action+str,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status', 'errorstr'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
						
						var data = result["data"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var status = data['status'];
						if (status) {
							Tips.showSuccess('{saveSuccess}');
							$modal.modal('hide');
							setTimeout(function(){
								$modal.remove();
							},450);
							DATA['backData'].needBackFlag = 0;
							display($('#1'));
						} else {
							var errorStr = data['errorstr'];
							
							if(DATA['backData'].needBackFlag == 1){
								
								DATA['backData'].needBackFlag = 0;
								post(DATA['backData'].str,DATA['backData'].url);
								
							}else{
								Tips.showWarning('{saveFail}' + errorStr, 2);
							}
							
							
						}
					} else {
						Tips.showWarning('{netErr}', 2);
					}
				}
			});
			}
			
		}
	}	
}
/**
 * 删除一条数据
 * @author JeremyZhang
 * @date   2016-09-06
 * @param  {[type]}   $target [description]
 * @return {[type]}           [description]
 */
function deleteClick($this,key) {
		if(key != undefined){
			var primaryKey=key;	
		}else{
			var primaryKey = $this.attr('data-primaryKey');
		}
		
		var database   = DATA["tableData"];
		// 从数据表中拿到要删除的数据，根据后台需要什么就发送什么
		var data = database.getSelect({"primaryKey" : primaryKey})[0];
		var Tips = require('Tips');
		var url,delstr,queryStr;
		if(data.serverType.indexOf('PPTP')>=0){
			url="/goform/pptpListDel";
			delstr=data["TunNames"];
			if(data.serverType=='PPTP1'){
				queryStr='delstr='+delstr;
			}else{
				queryStr='delstrsrv='+delstr;
			}
		}else{
			url="/goform/l2tpSrvListDel ";
			delstr=data["TunNames"];
			if(data.serverType=='L2TP1'){
				queryStr='delstrCli='+delstr;
			}else{
				queryStr='delstr='+delstr;
			}
		}
		 
		
		if(delstr==' '){
			Tips.showError("{delstop}",2);
			
		}else{
			if(key != undefined){
				delete_ok();
			}else{
				Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
			}
			
		}
		function delete_no(){
				display($('#1'));
		}
		function delete_ok(){
			$.ajax({
				url: url,
				type: 'POST',
				data: queryStr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						returnStr = ['status','errorstr'],
						result = doEval.doEval(codeStr, returnStr),
						isSuccess = result["isSuccessful"];
						var data = result["data"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var status = data['status'];
						if (status) {
							if(key == undefined){
								Tips.showSuccess('{delSuccess}', 2);
								display($('#1'));
							}
							
						} else {
							if(key == undefined){
								var errorStr = data['errorstr'];
								Tips.showError('{delFail}'+errorStr, 2);
							}
							
						}

					} else {
						if(key == undefined){
							Tips.showError('{fail}', 2);
						}
						
					}
				}
			});
		}
}




function addBtnClick(){
		var config = {
			"modalID"   	:'modal-add',
			"modalTitle"	:'{add}',
			"saveFunc"  	:addSubmitClick,
			"workMode" 		:'1',
			"protoType"		:'PPTP',
			"natEnables"	:'off',
			"EncryptionModes":'0',
			"TunNames"		:'',
			"passwd"		:'',
			"userType"		:'lantolan',
			
			"userNames"		:'',
			"AuthTypes"		:'EITHER',
			"GatewayIp" 	:'',
			"lanIps" 		:'',
			"lanNetMasks" 	:'',
			"MTU" 			:'1440',
			"LanMac" 		:'',
		};
		showAddAndEditMoal(config);
}
function editBtnClick( $this,demoData){

		var demoDatas = demoData || {type:'normal'};
		var primaryKey = $this.attr('data-primaryKey');
		var database = DATA["tableData"];
		DATA["primaryKey"] = primaryKey;
		var data           = database.getSelect({"primaryKey" : primaryKey})[0];
		var index=0;
		var AllDATA={};
		DATA['oldSetName']=data.TunNames;
		if(data.serverType=='PPTP1'){
			AllDATA['data']=DATA['PPTPCLIENT'].data;
		}else if(data.serverType=='PPTP2'){
			AllDATA['data']=DATA['PPTPSERVER'].data;
		}else if(data.serverType=='L2TP1'){
			AllDATA['data']=DATA['L2TPCLIENT'].data;
		}else{
			AllDATA['data']=DATA['L2TPSERVER'].data;
		}
		
		for(var i in AllDATA['data']){
			for(var j in AllDATA['data'][i]){
				if(AllDATA['data'][i][j]==data.TunNames){
					index = i;
					break;
				}
			}
		 
	  	}
	 
		var config = {
			"modalID"   	:'modal-edit',
			"modalTitle"	:'{edit}',
			"saveFunc"  	:addSubmitClick,
			"workMode" 		:(data.serverType.indexOf(1)>=0)?'2':'1',
			"protoType"		:(data.serverType.indexOf('PPTP')>=0)?'PPTP':'L2TP',
			"natEnables"	:DATA["PPTPClientNATEnables"][index],
			"EncryptionModes":data.EncryptionModes,
			"TunNames"		:data.TunNames,
			"passwd"		:data.passwd,
			"userType"		:data.userType,
			"userNames"		:data.userNames,
			"AuthTypes"		:data.AuthTypes,
			"GatewayIp" 	:data.GatewayIp,
			"lanIps" 		:data.lanIps,
			"lanNetMasks" 	:data.lanNetMasks,
			"MTU" 			:DATA['MTU'][index],
			"LanMac" 		:DATA["PPTPLanMac"][index],
			"bindIps"		:(DATA["bindIps"] == undefined)?'':DATA["bindIps"][index]
		};
		showAddAndEditMoal(config,demoDatas);
		//addSubmitClick(1);/*备份一份数据,保存不成功再将编辑的数据保存回去*/
}
	
function showAddAndEditMoal(config,demoData) {
		var demoDatas = demoData || {type:'normal'};
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": config.modalID,
			"title": config.modalTitle,
			"size":"large",
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){
		                config.saveFunc();
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
		// // 获得模态框的html
		var modalobj = Modal.getModalObj(modalList),
			$modal = modalobj.getDom(); // 模态框的jquery对象
		$('body').append($modal);
	
		var inputList = [
			{
				"display"	:true,
				"prevWord"	:"{workMode}",
				"inputData" :{
					"defaultValue" : config.workMode ||'1',
					"type"		   : 'radio',
					"name"		   : 'workMode',
					"items" :[{
						"value"		: '1',
						"name"  	: '{serverOut}',
						"control"	:'S1'
					},{
						"value"		:'2',
						"name"		:'{clientIn}',
						"control"	:'C1'
					}]
				}
			},
				{
				"display"	:true,
				"prevWord"	:"{protoType}",
				"inputData" :{
					"defaultValue" : config.protoType ||'PPTP',
					"type"		   : 'radio',
					"name"		   : 'protoType',
					"items" :[{
						"value"		: 'PPTP',
						"name"  	: 'PPTP',
						"control"	: 'PPTP2'
					},{
						"value"		:'L2TP',
						"name"		:'L2TP',
						"control"	:'L2TP2'
					}]
				}
			},

			{
				"sign"      :"C1,PPTP2", 
				"display"	:true,
				"prevWord"	:"{natMode}",
				"inputData" :{
					"defaultValue" : config.natEnables,
					"type"		   : 'radio',
					"name"		   : 'natEnables',
					"items" :[{
						"value"		: 'on',
						"name"  	: '{enable}',
					},{
						"value"		:'off',
						"name"		:'{close}'
					}]
				}
			},
			{
				"sign"      :"C1,PPTP2", 
				"display"	:true,
				"prevWord"	:"{tunEncrypt}",
				"inputData" :{
					"defaultValue" : (config.EncryptionModes == 'MPPE'?'MPPE':'None'),
					"type"		   : 'radio',
					"name"		   : 'EncryptionModes',
					"items" :[{
						"value"		: 'MPPE',
						"name"  	: '{enable}',
					},{
						"value"		:'None',
						"name"		:'{close}'
					}]
				}
			},
		
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{tunnelName}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'TunNames',
			        "value"		 : config.TunNames,
			        "checkDemoFunc" : ['checkInput','name','1','31','5'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{   
					"sign"      :"S1,PPTP2,L2TP2", 
					"display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{userType}',
			        "inputData": {
			            "defaultValue" : config.userType, //默认值对应的value值
			            "type": 'select',
			            "name": 'userType',
			            "items" : [
			                {
			                    "value" : 'mobile',
			                    "name"  : '{mobileUser}',
			                    "control":'mobile'
			                },
			                {
			                    "value" : 'lantolan',
			                    "name"  : '{lantolan}',
			                     "control":'lantolan'
			                }
			            ]
			        }
			},
			{
				"sign"      :"C1,PPTP2,L2TP2", 
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{tunSrvAddr}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'TunNamesIP',
			        "value"		 : config.GatewayIp,
			        "checkDemoFunc" : ['checkInput','ip','1','2'] 
			    }

			},
			{
				// "sign"      :"C1",  
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{username}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'userNames',
			        "value"		 : config.userNames,
			        "checkDemoFunc" : ['checkInput','name','1','31','5'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				// "sign"      :"", 
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{pwd}',
			    "inputData": {
			        "type"       : 'password',
			        "name"       : 'password',
			        "value"		 : config.passwd,
			        "checkDemoFunc" : ['checkName','1','31'] ,
			       	"eye" : true
			    }

			},
			{   
					"sign"      :"C1,PPTP2", 
					"display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{AuthType}',
			        "inputData": {
			            "defaultValue" : config.AuthTypes, //默认值对应的value值
			            "type": 'select',
			            "name": 'PPTP2AuthType',
			            "items" : [
			                {
			                    "value" : 'THRIN',
			                    "name"  : 'ANY',
			                    // "isChecked" : false
			                },
			                {
			                    "value" : 'PAP',
			                    "name"  : 'PAP',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'MS-CHAPV2',
			                    "name"  : 'MS-CHAPV2',
			                  },
			                 {
			                    "value" : 'CHAP',
			                    "name"  : 'CHAP',
			                 }
			            ]
			        }
			},
			{   
					"sign"      :"C1,L2TP2", 
					"display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{AuthType}',
			        "inputData": {
			            "defaultValue" : config.AuthTypes, //默认值对应的value值
			            "type": 'select',
			            "name": 'L2TPAuthTypes',
			            "items" : [
			                {
			                    "value" : 'NONE',
			                    "name"  : 'NONE',
			                    // "isChecked" : false
			                },
			                {
			                    "value" : 'PAP',
			                    "name"  : 'PAP',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'CHAP',
			                    "name"  : 'CHAP',
			                 },
			                 {
			                    "value" : 'EITHER',
			                    "name"  : 'EITHER',
			                  }
			            ]
			        }
			},

			{
				"sign"      :"lantolan",  
		        "display" : true,  //是否显示：否
		        "necessary": true,  //是否添加红色星标：是
		        "prevWord": '{remoteLan}',
		        "inputData": {
		            "type": 'text',
		            "name": 'remoteInIp',
		            "value":config.lanIps,
		            "checkFuncs" : ['checkIP']
		        },
		        "afterWord":""

		    }
		    ,
			{
				"sign"      :"lantolan",  
		        "display" : true,  //是否显示：否
		        "necessary": true,  //是否添加红色星标：是
		        "prevWord": '{remoteLanMask}',
		        "inputData": {
		            "type": 'text',
		            "name": 'remoteInIPMask',
		            "value":config.lanNetMasks,
		            "checkFuncs" : ['re_checkMask']
		        },
		        "afterWord":""

		    },
		    {
		    	"sign"      :"C1,PPTP2",  
		        "display" : true,  //是否显示：否
		        "necessary": true,  //是否添加红色星标：是
		        "prevWord": 'MTU',
		        "inputData": {
		            "type": 'text',
		            "name": 'MTU',
		            "value":config.MTU,
		            "checkDemoFunc":['checkNum','1','1492']
		        },
		        "afterWord":"{valueRange}:(1-1492)"

		    }
		    ,

			{
				"sign"      :"PPTP2,S1", 
		        "display" : true,  //是否显示：否
		        "necessary": false,  //是否添加红色星标：是
		        "prevWord": '{staticIP}',
		        "inputData": {
		            "type": 'text',
		            "name": 'staticIPs',
		            "value":config.bindIps == '0.0.0.0'?'':config.bindIps,
		            "checkFuncs" : ['checkNullIP']
		        },
		        "afterWord":""

		    },
		    {
				"sign"      :"mobile", 
		        "display" : true,  //是否显示：否
		        "necessary": false,  //是否添加红色星标：是
		        "prevWord": '{devMac}',
		        "inputData": {
		            "type": 'text',
		            "name": 'LanMac',
		            "value":(config.LanMac == 0 ?'':config.LanMac),
		            "checkFuncs":['checkNullMac']
		            
		        },
		        "afterWord":""

		    }

					
		];

		var InputGroup=require("InputGroup"),
		$dom= InputGroup.getDom(inputList);

		makeTheLanMacChange();
		$dom.find('[name="protoType"]').click(function(){
			makeTheLanMacChange();
		});
		function makeTheLanMacChange(){
			var thisptval = $dom.find('[name="protoType"]:checked').val();
			if(thisptval == 'L2TP'){
				$dom.find('[name="LanMac"]').parent().parent().hide();
			}else{
				$dom.find('[name="LanMac"]').parent().parent().show();
			}
		}
		makeThePPTP2AuthTypeChange();
		$dom.find('[name="EncryptionModes"]').click(function(){
			makeThePPTP2AuthTypeChange();
		});
		function makeThePPTP2AuthTypeChange(){
			var _em = $dom.find('[name="EncryptionModes"]:checked').val();
			var $_pp2 = $dom.find('[name="PPTP2AuthType"]');
			if(_em == '1'){
				$_pp2.attr('disabled','disabled').find('[value="MS-CHAPV2"]').attr('selected','selected');
			}else{
				$_pp2.removeAttr('disabled');
			}
		}

		$dom.find('[name="workMode"],[name="protoType"]').click(function(){
			makeTheC1B1PPTP2L2T2Change();
			makeTheUserTypeChange();
		});
		setTimeout(function(){
			makeTheC1B1PPTP2L2T2Change();
			makeTheUserTypeChange();
		},1);
		
		function makeTheUserTypeChange(){
			if(!$dom.find('[name="userType"]').parent().parent().hasClass('u-hide')){
				var vals = $dom.find('[name="userType"]').val();
				var contr = $dom.find('[name="userType"] option[value="'+vals+'"]').attr('data-control-src');
				$dom.find('[data-control="'+contr+'"]').removeClass('u-hide');
			
			}else{
				$dom.find('[data-control="lantolan"]').removeClass('u-hide');
			}
		}
		function makeTheC1B1PPTP2L2T2Change(){
			var controlStr1 = $dom.find('[name="workMode"]:checked').attr('data-control-src');
			var controlStr2 = $dom.find('[name="protoType"]:checked').attr('data-control-src');

			var newstr = [controlStr1,controlStr2];
			$dom.find('tr[data-control]').each(function(){
				var $t = $(this);
				$t.addClass('u-hide');
				var nowstr = $t.attr('data-control').split(',');
				var counts = 0;
				newstr.forEach(function(obj1){
					nowstr.forEach(function(obj2){
						if(obj1 == obj2){
							counts++;
						}
					});
				});
				if(counts == newstr.length){
					$t.removeClass('u-hide');
				}
				
			});
		}

		modalobj.insert($dom);
		if(config.modalID=="modal-edit"){
			console.log("hahah=====");
			console.log(DATA['isUsedByOthers']);
			if(DATA['isUsedByOthers'] != undefined){
				
				DATA['isUsedByOthers'].forEach(function(item, index, arr){
					if(RegExp(config.TunNames).test(DATA['isUsedByOthers'][index])){
						
						var isUsedByOthers = DATA['isUsedByOthers'][index].split('_');/*servertyp_tunname_usetype*/
						/*
							1:L2TPS
							2:L2TPC
							3:PPTPS
							4:PPTPC
						*/
						if(isUsedByOthers[2] >0 ){
							if(config.protoType == 'PPTP'){
								if((config.workMode == '1' && isUsedByOthers[0] == 3)||(config.workMode == '2' && isUsedByOthers[0] == 4))
									disabledByUsed();
							}else if(config.protoType == 'L2TP'){
								if((config.workMode == '1' && isUsedByOthers[0] == 1)||(config.workMode == '2' && isUsedByOthers[0] == 2))
									disabledByUsed();
							}
							DATA['cantEdit']=1;
						}
					}
				});
			}
			
			
		}
		function disabledByUsed(){
			$('[name="TunNames"]').attr("disabled",true);
			$('[name="workMode"]').attr("disabled",true);
			$('[name="protoType"]').attr("disabled",true);
			//$('[name="TunNames"]').attr("disabled",true);
		}
		if(demoDatas.type == 'check'){
			$modal.find('#save').click();
		}else{
			modalobj.show();
		}
		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','doPPTPL2TP'];
		Translate.translate(tranDomArr, dicArr);
	
	}
function deleteBtnClick() {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		// 获得表格中所有被选中的选择框，并获取其数量
		var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey'),
			length = primaryKeyArr.length;
		if(length == 0)
			Tips.showWarning(T('pleaseSelectDelName'), 2);
		else
			Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
		function delete_no(){
				display($('#1'));
		}
		var delstr,pptp1,pptp2,l2tp1,l2tp2;
			
		function delete_ok(){
			// 判断是否有被选中的选择框
			if (length > 0) {
				primaryKeyArr.forEach(function(primaryKey) {
					var data = database.getSelect({
						primaryKey: primaryKey
					})[0];
					delstr= data["TunNames"];
						if(data.serverType.indexOf('PPTP')>=0){
							
							if(data.serverType=='PPTP1'){
								pptp1=delstr+','+pptp1;
							}else{
								pptp2=delstr+','+pptp2;
							}
						}else{
							if(data.serverType=='L2TP1'){
								l2tp1=delstr+','+l2tp1;
							}else{
								l2tp2=delstr+','+l2tp2;
							}
						}
				});
				var pptpstr='delstr='+pptp1+'&delstrsrv='+pptp2;
				var l2tpstr='delstrCli='+l2tp1+'&delstr='+l2tp2;
				delete_PPTP(pptpstr);
				delete_L2TP(l2tpstr);
				
				function delete_PPTP(str){
					$.ajax({
						url: '/goform/pptpListDel',
						type: 'POST',
						data: str,
						success: function(result) {
							var doEval = require('Eval');
							var codeStr = result,
								variableArr = ['status','errorstr'],
								result = doEval.doEval(codeStr, variableArr),
								isSuccess = result["isSuccessful"];
								var data = result["data"];
							if (isSuccess) {
								
								var	status = data['status'];
								if (status) {
									// 提示成功信息
									Tips.showSuccess('{delSuccess}', 2);
									// display($('#1'));
								} else {
									var errorStr = data['errorstr'];
									Tips.showError('{delFail}' + errorStr, 2);
								}
							} else {
								Tips.showError('{netErr}', 2);
							}
							}
						});
				}
				function delete_L2TP(str){
						$.ajax({
							url: '/goform/l2tpSrvListDel',
							type: 'POST',
							data: str,
							success: function(result) {
								var doEval = require('Eval');
								var codeStr = result,
									variableArr = ['status','errorstr'],
									result = doEval.doEval(codeStr, variableArr),
									isSuccess = result["isSuccessful"];
									var data = result["data"];
								
								if (isSuccess) {
									
									var	status = data['status'];
									if (status) {
										// 提示成功信息
										//Tips.showSuccess('{删除L2TP成功}', 2);
										display($('#1'));
									} else {
										var errorStr = data['errorstr'];
										Tips.showError('{delFail}'+errorStr, 2);
									}
								} else {
									//Tips.showError('网络故障', 2);
								}
							}
						});
				}
			} else {
			Tips.showWarning(T('pleaseSelectDelName'), 2);
			}
		}
	}

	
function storeTableData(data) {
		
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr =  [
						"serverType",
						"Enables",
						"TunNames",
						"userType",
						"userNames",
						"GatewayIp",
						"lanIps",
						"lanNetMasks",
						"statuss",
						"usetimes",
						"outboundss",
						"inboundss",
						"EncryptionModes",
						"AuthTypes",
						"passwd"
						];
		// 将数据存入数据表中
		
		database.addTitle(fieldArr);
		
		database.addData(data);
		
	}

function displayTable($container) {
		$.ajaxSetup({async: false});
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
		$tableCon = $(conhtml);
		var newArr = {
			data  : []
		};
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		$.ajax({
			url: 'common.asp?optType=getDepend',
			type: 'GET',
			success: function(result) {
				var doEval = require('Eval');
				
				var codeStr=result,variableArr = ['isUsedByOthers'];
				result=doEval.doEval(codeStr,variableArr);
				DATA["isUsedByOthers"] = result['data']["isUsedByOthers"];
			}
		});
		//向后台发送请求，获得表格数据
		if(configPage['PPTPClientList']=='1'){
			$.ajax({
				url: 'common.asp?optType=PPTPCLIENT',
				type: 'GET',
				success: function(result) {
					var data = processDataPPTPCLIENT(result),
						tableData = data["table"];
						
						DATA['PPTPCLIENT']=tableData;
				}
			});
			$.ajax({
				url: 'common.asp?optType=PPTPSERVER',
				type: 'GET',
				success: function(result) {
					var data = processDataPPTPServer(result),
						tableData = data["table"];
						
						DATA['PPTPSERVER']=tableData;
				}
			});
			getArr(DATA['PPTPCLIENT']);
			getArr(DATA['PPTPSERVER']);
		}
		if(configPage['L2TPList']=='1'){
			$.ajax({
				url: 'common.asp?optType=L2TPCLIENT',
				type: 'GET',
				success: function(result) {
					var data = processDataL2TPCLIENT(result),
						tableData = data["table"];
						
						DATA['L2TPCLIENT']=tableData;
				}
			});
			$.ajax({
				url: 'common.asp?optType=L2TPSERVER',
				type: 'GET',
				success: function(result) {
					var data = processDataL2TPServer(result),
						tableData = data["table"];
						
						DATA['L2TPSERVER']=tableData;
				}
			});
			getArr(DATA['L2TPCLIENT']);
			getArr(DATA['L2TPSERVER']);
		}
			
			
			function getArr(arr){
				arr.data.forEach(function(obj){
					newArr.data.push(obj);
				});
			}
			console.dir(newArr);


			// 将数据存入数据表
			storeTableData(newArr.data);
			
			// 获得表格Dom
			var $table = getTableDom();
			// 将表格放入页面
			$tableCon.append($table);
	}




	function display($container) {
		// 清空标签页容器
		$container.empty();
		displayTable($container);
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doPPTPL2TP'];
		Translate.translate(tranDomArr, dicArr);
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
