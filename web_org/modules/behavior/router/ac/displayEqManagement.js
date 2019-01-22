define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	DATA.settimenum = 5000;
	DATA.iptv = require('P_config/config').iptv;
	var clientDATA={};
	var Tips = require('Tips');
	function tl(str){
	    return require('Translate').getValue(str, ['common', 'error', 'doEqMgmt']);
	}
	function tall(dom){
		require('Translate').translate([dom],['common', 'error', 'doEqMgmt']);
	}
	function setTimeForAjax(){
		var newsettime = $('#content li.active>a[data-toggle="tab"]').attr('time-sign');
		DATA.timeoutobj =  setTimeout(function(){
			if(new RegExp('equipment_management').test(window.location.href) && newsettime ==$('#content li.active>a[data-toggle="tab"]').attr('time-sign') ){
				showTable('',true);
			}
		},DATA.settimenum);
	}
	var queryStr='SzoneAutoUpdata=on';
	$.ajax({
		url : '/goform/formSzoneAutoUpGlobalConfig',
		type: 'POST',
		data: queryStr,
		success: function(result){
		}
		});

    function checkresult(result){
				if(result){
				eval(result);
				if(errorArr != undefined){
					var isCorrect = true;
					var errstr = "";
					errorArr.forEach(function(obj,index){
						if(obj.toString()){
							errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+obj+" ");
							isCorrect = false;
							}
					})
						if(isCorrect){
							return false;
						}else{
							return errstr;
						}
	
					}
				}
	}	
//goform/aspTaskScheduler 计划任务
//goform/aspChangeWled 睡眠模式
	function display($con){
		var Path = require('Path');
		var Translate = require('Translate');
		var dicNames = ['doEqMgmt'];
		Translate.preLoadDics(dicNames, function(){
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);		
		
		showTable($tableCon,false,false,true);
		
		
	    });
	}
	
	/* 获取数据 展示表格 */
	function showTable($tableConDom,isfresh,ishandle,isFirstTime){
		$.ajax({
			type:"get",
			url:"common.asp?optType=sZone|apListConfig|schdtask|aspOutPutApConfTempList",
			success:function(result){
				
				// 数据处理
				processData(result);
				
				//生成表格
				if(isfresh){
					DATA["tableObj"].refresh(DATA["tableData"]);
				}else{
					makeTable($tableConDom);
					$tableConDom.empty().append(DATA["tableObj"].getDom());
				}
				if(!ishandle){
					setTimeForAjax();
				}
				if(isFirstTime){
					clearTimeout(DATA.timeoutobj);
				}
				
				/*提示是否开启无线扩展开关*/
		if(DATA.feature_AC_En != 'on' && !isfresh){
			Tips.showConfirm(tl('openWifi'),function(){
				var postQueryStr = 'ACGlobalEnable=on';
				$.ajax({
				url : 'goform/formFeatureACGloConfig',
				type : 'POST',
				data : postQueryStr,
				success : function(jsStr){
					var Eval = require('Eval');
					var variables = ['status', 'errorstr'];
					var result = Eval.doEval(jsStr, variables),
						isSuccess = result["isSuccessful"];
					if(isSuccess){
						var data = result["data"],
							status = data["status"];
						var Tips = require('Tips');
						if(status == 1){
							
							Tips.showSuccess('{saveSuccess}');
							display($('#1'))
						}else{
							var errorStr = data["errorstr"];
							Tips.showWarning('{saveFail}' + errorStr);
							
						}
					}
				}
				});
			},function(){
				
			});
		}
				
			}
		});
	}
	
	
	// function sendCliNum(cliNumStr){
	// 	console.log(cliNumStr);
	// 	cliNumStr="szUserNums=default:2&macStr=FC2FEFE86697&ipStr=192.168.1.106&passStr=admin&szName=default&managedEn=1&ap_mode=1&deviceName=&sysIp=192.168.1.106&subMask=0.0.0.0&gateWay=0.0.0.0&userName=admin&pw1=&dhcp_en=1&roaming_en=&roaming_th=-88&roaming_en5G=&roaming_th5G=-88&modifyPw=&channel5G=0&channel=0&config=";
	// 	function st(){    
	// 		$.ajax({
	// 			url:'common.asp?optType=saveApBasicCfg',
	// 			type:'get',
	// 			data:cliNumStr,
	// 			success:function(result){
	// 				console.log(result);
	// 					var doEval = require('Eval');
	// 					var codeStr = result,
	// 						variableArr = ['status', 'errorstr'],
	// 						result = doEval.doEval(codeStr, variableArr),
	// 						isSuccess = result["isSuccessful"];
	// 					// 判断代码字符串执行是否成功
	// 					if (isSuccess) {
	// 						var data = result["data"],
	// 							status = data['status'];
	// 							errorstr = data['errorstr'];
	// 						if (status) {
	// 							// 显示成功信息
	// 							Tips.showSuccess('{saveSuccess}');
	// 							// makeTable($('#1'));
	// 						} else {
	// 							Tips.showWarning(errorstr);
	// 						}
	// 					} else {
	// 						Tips.showWarning('{parseStrErr}');
	// 					}					
	// 			}
	// 		});				
	// 	} 
	// 	setTimeout(st, 5000);	
	// }	
	function sendFunc(type, data, msz, szNum){
		var newstrs='';
		var urlStr='';
		if(msz==""){ 
			var szName=data.zoneName||'';
			var ipStr=DATA.apIpStr||'';
			var passStr=DATA.apPassStr||'';
			var macStr = DATA.apMacStr||'';
			console.log(ipStr);
			console.log(macStr);
			// newstrs='szName='+szName+'&ipStr='+ipStr+'&passStr='+passStr+'&SZNameArray='+szName+'&macStr='+macStr;
			newstrs='szName='+szName+'&ipStr='+ipStr+'&passStr='+passStr+'&SZNameArray='+szName+macStr;
		}else{/*多个服务区下发*/
			newstrs=msz+'&ipStr='+DATA.mszIp;
		}		
		if(DATA.isGroupOpt=0){/*单个ap下发服务区*/
			urlStr='common.asp?optType=sendSZ';
		}else{/*批量ap下发服务区*/
			urlStr='common.asp?optType=mApSendSZ';
		}
		console.log(newstrs);
		$.ajax({
			url:urlStr,
			type:'GET',
			data:newstrs,
			success:function(result){
				console.log(result);
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status', 'errorstr'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"],
							status = data['status'];
							errorstr = data['errorstr'];
						// if (status) {
						if(errorstr == ""){
//							DATA.tabModalObj.hide();
							Tips.showTimer('{WaitForSaveSend}',15,function(){
								/*发送成功*/
			                	 Tips.showSuccess('{sendDataSuccess}');
//								showTable('',true,true);
							});
						} else {
							Tips.showWarning(errorstr);
						}
					} else {
						Tips.showWarning('{parseStrErr}');
					}					
			}
		});	
	}	
	// function ClientNumData(res){
	// 	var doEval = require('Eval');
	// 	   var  variableArr = [
	// 			'macStr',
	// 			'passStr',
	// 			'szName',
	// 			'managedEn',
	// 			'urcpError',
	// 			'ipStr',
	// 			'dhcp_en',
	// 			'workingMode',
	// 			'deviceName',
	// 			'ipAddr',
	// 			'netMask',
	// 			'gateWay',
	// 			'userName',
	// 			'channel',
	// 			'channel5G',
	// 			'flag_5G',
	// 			'roaming_en',
	// 			'roaming_th',
	// 			'roaming_en5G',
	// 			'roaming_th5G',
	// 			'configuration',
	// 			'szName',
	// 			'userNum',
	// 			'maxUserNum',			
	// 	   ]; // 变量名称	
	// 	   var result = doEval.doEval(res, variableArr);
	// 	   if (!result.isSuccessful) {
	// 	       Tips.showError('{parseStrErr}');
	// 	       return false;
	// 	    }	
	// 	    var data = result["data"];
	// 	    // console.log(data);
	// 		// 声明字段列表
	// 		clientDATA.macStr=data.macStr;
	// 		clientDATA.passStr=data.passStr;	
	// 		clientDATA.szName=data.szName;
	// 		clientDATA.managedEn=data.managedEn;
	// 		clientDATA.ipStr=data.ipStr;
	// 		clientDATA.dhcp_en=data.dhcp_en;
	// 		clientDATA.workingMode=data.workingMode;
	// 		clientDATA.deviceName=data.deviceName;
	// 		clientDATA.ipAddr=data.ipAddr;

	// 		clientDATA.ipAddr=data.ipAddr;
	// 		clientDATA.netMask=data.netMask;
	// 		clientDATA.gateWay=data.gateWay;
	// 		clientDATA.userName=data.userName;
	// 		clientDATA.channel=data.channel;

	// 		clientDATA.channel5G=data.channel5G;
	// 		clientDATA.flag_5G=data.flag_5G;
	// 		clientDATA.roaming_en=data.roaming_en;
	// 		clientDATA.roaming_th=data.roaming_th;
	// 		clientDATA.roaming_en5G=data.roaming_en5G;
	// 		clientDATA.roaming_th5G=data.roaming_th5G;
	// 		clientDATA.configuration=data.configuration;
	// 		clientDATA.szName=data.szName;
	// 		clientDATA.userNum=data.userNum;
	// 		clientDATA.maxUserNum=data.maxUserNum;
	// 		var tmpStr='szUserNums=';
	// 		var str = '';

	// 		DATA.zoneName.forEach(function(obj,i){
	// 			if(data.szName[i] == DATA.zoneName[i]){
	// 				tmpStr += DATA.zoneName[i]+':'+DATA.cliMaxNumArr[i]+",";
	// 			}
	// 		});

	// 		tmpStr = tmpStr.substr(0,tmpStr.length-1);	
	// 		console.log(tmpStr);		
	// 		str='macStr='+clientDATA.macStr+
	// 		 	'&passStr='+clientDATA.passStr+
	// 		 	// '&szName='+clientDATA.szName+
	// 		 	'&managedEn='+clientDATA.managedEn+
	// 		 	'&ipStr='+clientDATA.ipStr+
	// 		 	'&dhcp_en='+clientDATA.dhcp_en+
	// 		 	'&ap_mode='+clientDATA.workingMode+
	// 		 	'&deviceName='+clientDATA.deviceName+
	// 		 	'&sysIp='+clientDATA.ipAddr+
	// 		 	'&subMask='+clientDATA.netMask+
	// 		 	'&gateWay='+clientDATA.gateWay+
	// 		 	'&userName='+clientDATA.userName+
	// 		 	'&channel5G='+clientDATA.channel5G+
	// 		 	'&flag_5G='+clientDATA.flag_5G+
	// 		 	'&roaming_en='+clientDATA.roaming_en+
	// 		 	'&roaming_th='+clientDATA.roaming_th+
	// 		 	'&roaming_en5G='+clientDATA.roaming_en5G+
	// 		 	'&roaming_th5G='+clientDATA.roaming_th5G+
	// 		 	'&configuration='+clientDATA.configuration+
	// 		 	'&szName='+clientDATA.szName+
	// 		 	'&userNum='+clientDATA.userNum+
	// 		 	'&maxUserNum='+clientDATA.maxUserNum+'&'+tmpStr+
	// 			'&config=noLocal';
	// 		 	console.log(str);	 	
	// 		 	return str;
	// }
	// function processClientNumData(macStr, ipStr, szNameStr, data, send){
	// 	var retClientData='';
	// 	// var urlStr = "common.asp?optType=getApBasicCfg&macStr="+macStr+"&passStr=admin&ipStr="+ipStr+"&szName="+szNameStr;
	// 	// console.log(urlStr);
	// 	var urlStr = "common.asp?optType=getApBasicCfg&macStr=FC2FEFE86697&passStr=admin&ipStr=192.168.1.106&szName=default"
	// 	$.ajax({
	// 		type:"get",
	// 		url:urlStr, 
	// 		success:function(result){			
	// 			// 数据处理
	// 			retClientData=ClientNumData(result);
	// 			function st(){   
	// 				sendCliNum(retClientData);
	// 			} 
	// 			setTimeout(st, 8000);
	// 		}
	// 	});
	// }
	// 处理数据
	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
			   'namearray',	// 设备名称
			   'aptypes', //型号
			   'serialno',	//序列号
			   'apStatus',  // 设备状态
			   'tmpSerialno', // 临时序列号
			   'iparray', //ip地址
			   'macarray', //mac地址
			   'vidarray', // VID
			   'fitOrFat', // 胖瘦
			   'channel', // 2.4G信道
			   'channel_5g',  // 5G信道
			   'clienCt',	//客户端数
			   'downloads', // 下载速率
			   'uploads', // 上传速率
			   'ssid',   //2.4 ssid
			   'ssid_5g',   //5 ssid
			   'zones',   //服务区
			   'permission',   //已授权
			   'managed_enable',   //可管理
			   'wlMode',   //2.4 模式
			   'wlMode_5g',   //5 ssid
			   'dhcp_en',   //是否为DHCP
			   'mfNames',   //mac地址过滤名称
			   'chanWidth',   //2.4频宽
			   'chanWidth_5g',   //5频宽
			   'apNames',//ap计划任务名称
				'tmpname', //射频模板名称
				'types',
				'feature_AC_En'
		   ]; // 变量名称
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   
		    var data = result["data"];
		    DATA.feature_AC_En = data.feature_AC_En;
		    // console.log(data);
		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			// 声明字段列表
			var fieldArr =[
				'ID',
				'namearray',
				'iparray',  /*ip地址列*/
				'aptypes',
				'serialno',
				'iparray',
				'wxzt',
				'apStatus',
				'channel',
				'wlMode',
				'chanWidth',
				'channel_5g',
				'wlMode_5g',
				'chanWidth_5g',
				'clienCt',
				'ssid',
				'apNames',
				'macarray',
				'namesarray',
//				'tmpname',/*射频模板名称*/
				'fitOrFat'/*2 瘦      1 胖*/
			];
			
			var baseData = [];
			DATA.tmpname=data.tmpname;
			DATA.serialNo=data.serialno;
            data.namearray.forEach(function(obj,i){
				baseData.push([
					Number(i)+1,
					(data.namearray[i].toString()?data.namearray[i]:data.macarray[i]),
					data.iparray[i],
					data.aptypes[i],
					data.serialno[i],
					data.iparray[i],
					'0',
					data.apStatus[i],
					(data.ssid[i]==''?'':data.channel[i]),
					(data.ssid[i]==''?'':data.wlMode[i]),
					(data.ssid[i]==''?'':data.chanWidth[i]),
					(data.ssid_5g[i]==''?'':data.channel_5g[i]),
					(data.ssid_5g[i]==''?'':data.wlMode_5g[i]),
					(data.ssid_5g[i]==''?'':data.chanWidth_5g[i]),
					data.clienCt[i],
					(data.ssid[i]+(data.ssid_5g[i]==''?'':"/"+data.ssid_5g[i])),
					data.apNames[i],
					data.macarray[i],
					data.namearray[i],
					data.fitOrFat[i]
				]);
			});
			
			DATA.taskPlan=data.apNames;
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			if(DATA.feature_AC_En != 'on'){
				baseData = [];
			}
			database.addData(baseData);
	}
	
	
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
		{
			id          : "refreshtable",
			name:tl("refresh"),
			clickFunc:function(){
				showTable('',true,true);
			}

		},
		{
			"id": "clearOutlineAP",
			"name": tl("del_offlineAP"),
			 "clickFunc" : function($btn){
			 		clearOutlineAP();
        		}
		},
		{
			"id": "BatchManagement",
			"name": tl("batch_manage"),
			 "clickFunc" : function($btn){
			    var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey'); 
			    var length  = primaryKeyArr.length;			
			    var iparray='';
			    var macStr='';
			    var macTmpStr='';
			    var passStr='';
			    var ipStr='';
			    var ipStr_bak='';
				var str='';
				var isGroupOpt=0;
				var serialnumberarr = [];
				var sendszPasswd='';
				if(length>1){
					isGroupOpt=1;
				}
				var mszIp=''; /*下发多个服务需要的ip*/
				var ipArrtmp=[];
				var macArrtmp=[];
				
				var have5G = 1; /* 是否有5G*/
				var haveOutAp = false; /*是否有离线AP*/
				var haveFatAp = false; /*是否有胖AP*/
				
				DATA.usemacstrarr = [];
				DATA.usepassstrarr = [];
				DATA.usegroptarr = [];
				DATA.usetmpSerialnoarr = [];
				
				if (length > 0) {
				    primaryKeyArr.forEach(function(primaryKey) {  
						var data = database.getSelect({primaryKey : primaryKey});
						iparray = data[0]["iparray"];  
						macTmpStr = data[0]["macarray"];
						
						if(data[0].channel_5g == ''){
							have5G = 0;
						}
						if(data[0].apStatus != '1'){
							haveOutAp = true;
						}
						if(data[0].fitOrFat == '1'){
							haveFatAp = true;
						}
						ipStr = iparray+',';
						ipStr_bak += iparray+',';
						macStr += macTmpStr + ',';
						//passStr += 'admin'+'|';
						passStr += ' '+'|';
						sendszPasswd+= 'admin'+',';
						mszIp+= iparray + ',';
						ipArrtmp.push(iparray);
						macArrtmp.push(macArrtmp);
						serialnumberarr.push(data[0].serialno);
						
						/*mac str*/
						DATA.usemacstrarr.push(macTmpStr);
						DATA.usepassstrarr.push(' ');
						DATA.usegroptarr.push(0);
						DATA.usetmpSerialnoarr.push('');
				  	});
				  	if(haveOutAp){
				  		Tips.showInfo('{BatchManagementWithoutOutLineAP}');
				  		return false;
				  	}
				  	if(haveFatAp){
				  		Tips.showInfo('{HasFatAp}');
				  		return false;
				  	}
				  	ipStr = ipStr.substr(0, ipStr.length - 1);
					ipStr = 'ipStr=' + ipStr;
				  	ipStr_bak = ipStr_bak.substr(0, ipStr_bak.length - 1);
					ipStr_bak = 'ipStr_bak=' + ipStr_bak;
				  	macStr = macStr.substr(0, macStr.length - 1);
					macStr = '&macStr=' + macStr;
					mszIp = mszIp.substr(0, mszIp.length - 1);
					sendszPasswd = sendszPasswd.substr(0, sendszPasswd.length - 1);
					sendszPasswd = '&passStr=' + sendszPasswd;
					DATA.sendSzStr=ipStr+macStr+sendszPasswd;
					DATA.sendSzStr_bak=ipStr_bak+macStr+sendszPasswd;
					DATA.mszIp=mszIp;
					
				}else{
					Tips.showInfo('{noApSelect}');		
					return;				
				}	
				// if(ipStr!=''){
				// 	ipStr = ipStr.substr(0, ipStr.length - 1);  
				// }							 	
				// if(macStr!=''){
				// 	macStr = macStr.substr(0, macStr.length - 1);  
				// }
				if(passStr!=''){
					passStr = passStr.substr(0, passStr.length - 1);  
				}		
				console.log(macStr);	
				console.log(passStr);
				console.log(ipStr);
				DATA.apIpStr=ipStr;
				console.log('----------------');
				console.log(DATA.apIpStr);
				console.log('----------------');
				DATA.apMacStr=macStr;
				DATA.apPassStr=passStr;
				DATA.isGroupOpt=isGroupOpt;
				DATA.ipArrtmp=ipArrtmp;
				DATA.macArrtmp=macArrtmp;
				DATA.serialnumberarr = serialnumberarr;
				
				
				
				
				if(length == 1){
					var wwt2 =Tips.showWaiting('{dataReading}');
					$.ajax({
						type:"get",
						url: 'common.asp?optType=getApBasicCfg&macStr='+macStr.substr(8),
						success:function(result){
							eval(result);
							wwt2.remove();
							makeEditModal(macStr, passStr, isGroupOpt,flag_5G);
							
						}
					});
				}else{
					makeEditModal(macStr, passStr, isGroupOpt,have5G);
				}
				
			 	
        	}
		}];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		
		// 表格配置数据
		var tableList = {
			"database": database,
			 otherFuncAfterRefresh:textClickEvent,
			"isSelectAll":true,
			"dicArr" : ['common','doEqMgmt','doRFT'],
			"titles": {
				"ID"		 : {
					"key": "ID",
					"type": "text",
				},
			    "{name_mac}"	  : {
					"key": "namearray",
					"type": "text",
					"sort": 'word',
					"filter":function(str){
						var newstr = str;
						if(str ===undefined || !str.toString()){
							newstr = tl('undefined');
						}
						return newstr;
					}
				},
				"{aptype}"		 : {
					"key": "aptypes",
					"type": "text",
					"sort": 'word',
				},	
				/*
				"{rf_template}"		 : {
					"key": "tmpname",
					"type": "text",
					"sort":'word',
					"maxLength":10
				},
				*/
				/*
				"{serial_num}"		 : {
					"key": "serialno",
					"type": "text",
					"sort": 'word',
				},
				*/
				"{apIpAddr}"		 : {
					"key": "iparray",
					"type": "text",
					"sort": 'ip',
				},				
				
				/*
				"{无线开启}"		 : {
					"key": "wxzt",
					"type": "checkbox",
					"values"  : {
									"1"  : true,
									"0" : false
								},
					"clickFunc" : function($this){
						alert($this.attr('data-primaryKey'))
					}
				},
				*/
				"{status_ap}"		 : {
					"key": "apStatus",
					"type": "text",
					"sort":'word',
					"values":{
						'1':tl("online"),
						'0':tl("offline")
					}
				},
				"{channel_24G}"		 : {
					"key": "channel",
					"type": "text",
					"sort": 'word'
				},
				"{model_24G}"		 : {
					"key": "wlMode",
					"type": "text",
				},
				"{bandwidth_24G}"		 : {
					"key": "chanWidth",
					"type": "text",
					"filter":function(str){
						var newstr = str;
						if(str =='0'){
							newstr = '20M';
						}else if(str == '1'){
							newstr = '20M/40M';
						}else if(str == '3'){
							newstr = '40M';
						}else{
							newstr = '';
						}
						
						return newstr;
					}
				},
				"{channel_5G}"		 : {
					"key": "channel_5g",
					"type": "text",
					"sort": 'word'
				},
				"{model_5G}"		 : {
					"key": "wlMode_5g",
					"type": "text",
				},
				"{bandwidth_5G}"		 : {
					"key": "chanWidth_5g",
					"type": "text",
					"filter":function(str){
						var newstr = str;
						if(str =='0'){
							newstr = '20M';
						}else if(str == '1'){
							newstr = '20M/40M';
						}else if(str == '2'){
							newstr = '80M';
						}else if(str == '3'){
						        newstr = '40M';
						}else{
							newstr = '';
						}
						
						return newstr;
					}
				},
				"{user_ap}"		 : {
					"key": "clienCt",
					"type": "text",
					"sort": 'word'
				},
				"SSID"		 : {
					"key": "ssid",
					"type": "text",
					"maxLength":10
				},
				
				"{apOperation}": {
					"type": "links",
					"links" : [
						{	
							name:"{reboot}",
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var data = database.getSelect({primaryKey : primaryKey})[0];
								DATA.singleReboot='yes';
								DATA.singleMac=data.macarray;
								Tips.showConfirm(tl('rebootConfirm'),function(){
									getSingleAjax(data);	
								});							
							}
						},
						{	
							name:"{apMangement}",
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var data = database.getSelect({primaryKey : primaryKey})[0];
								DATA.singleReboot="no";
								getSingleAjax(data);
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
		
		
//		textClickEvent(tableObj)
		// 添加编辑文本部分
		
		function isOut($td){
			var keys = $td.parent().find('[data-table-type="select"]').attr('data-primarykey');
			var data = database.getSelect({primaryKey : keys});
			var tstuts = '0';
			if(data){
				var tstuts = data[0].apStatus;
			}
			return (tstuts == '1'?true:false);
			
		}
		function isFat($td){
			var keys = $td.parent().find('[data-table-type="select"]').attr('data-primarykey');
			var data = database.getSelect({primaryKey : keys});
			var tstuts = '0';
			if(data){
				console.log(data[0])
				var tstuts = data[0].fitOrFat;
			}
			return (tstuts == '2'?true:false);
			
		}
		
		function textClickEvent(NowTableObj){
			
			
			/* 去除离线设备的操作按钮
			 */
			NowTableObj.getDom().find('td[data-column-title="{apOperation}"]').each(function(){
				var $t = $(this);
				if(!isOut($t)){
					$t.empty();
				}
			});
			/* 改变离线设备的字体颜色*/
			NowTableObj.getDom().find('td[data-column-title="{status_ap}"]').each(function(){
				var $t = $(this);
				if(!isOut($t)){
					$t.find('span[data-local]').css('color','red');
				}
			});
			
			
			// 名称/MAC编辑
			
			NowTableObj.getDom().find('td[data-column-title="{name_mac}"]').each(function(){
				var $t = $(this);
				if($t.children('span').length>0 && isOut($t) &&isFat($t)){
					var thisText = $t.children('span').text();
					var dpkey = $t.prev().prev().find('input').attr('data-primarykey');
					
					var linkhtml = '<a style="font-size:12px" class="u-inputLink link-forEdit" data-local="'+thisText+'" data-primarykey ="'+dpkey+'">'+thisText+'</a>';
					var $lh = $(linkhtml);
					
					var $inputhtml = $('<input type="text" style="height:20px" data-primarykey ="'+dpkey+'"/>');
					var $btnhtml = $('<button type="button" data-primarykey ="'+dpkey+'" class="btn btn-primary btn-forEditSave" style="position:absolute;top:-3px;left:50px">'+tl('save')+'</button>');
					var $divhtml = $('<div class="for-textEdit u-hide" style="display:inline-block;width:auto;height:auto;position:relative"></div>');
					$divhtml.append($inputhtml,$btnhtml);
//					$inputhtml.checkdemofunc('checkInput','name',0,11);
					
					
					$t.empty();
					$t.append($lh,$divhtml);
				}
			});
			
			
			
			// 信道下拉框编辑
			NowTableObj.getDom().find('td[data-column-title="{channel_24G}"]').each(function(){
				var $t = $(this);
				if($t.children('span').length>0&& isOut($t)&&isFat($t)){
					var thisText = $t.children('span').text();
					var dpkey = $t.prev().prevAll('[data-column-title="{name_mac}"]').find('a').attr('data-primarykey');
					var linkhtml = '<a style="font-size:12px"  class="u-inputLink link-forSelect" data-local="'+thisText+'" data-primarykey="'+dpkey+'">'+thisText+'</a>';
					var $lh = $(linkhtml);
					var $selecthtml = $('<select style="height:20px" data-primarykey="'+dpkey+'">'+
											'<option value="1">1</option>'+
											'<option value="2">2</option>'+
											'<option value="3">3</option>'+
											'<option value="4">4</option>'+
											'<option value="5">5</option>'+
											'<option value="6">6</option>'+
											'<option value="7">7</option>'+
											'<option value="8">8</option>'+
											'<option value="9">9</option>'+
											'<option value="10">10</option>'+
											'<option value="11">11</option>'+
											'<option value="12">12</option>'+
											'<option value="13">13</option>'+
											'<option value="auto">'+tl('auto')+'</option>'+
										'</select>'
										);
					var $btnhtml = $('<button data-primarykey="'+dpkey+'" type="button" class="btn btn-primary btn-forSelectSave" style="position:absolute;top:-3px;left:50px">'+tl('save')+'</button>');
					var $divhtml = $('<div class="for-SelectEdit u-hide" style="display:inline-block;width:auto;height:auto;position:relative"></div>');
					$divhtml.append($selecthtml,$btnhtml);
					$t.children('span').remove();
					$t.append($lh,$divhtml);
				}
				
			});
			
			// 信道下拉框编辑
			NowTableObj.getDom().find('td[data-column-title="{channel_5G}"]').each(function(){
				var $t = $(this);
				if($t.children('span').length>0&& isOut($t)&&isFat($t)){
					var thisText = $t.children('span').text();
					var dpkey = $t.prev().prevAll('[data-column-title="{name_mac}"]').find('a').attr('data-primarykey');
					var linkhtml = '<a  style="font-size:12px" class="u-inputLink link-forSelect" data-local="'+thisText+'" data-primarykey="'+dpkey+'">'+thisText+'</a>';
					var $lh = $(linkhtml);
					var $selecthtml = $('<select style="height:20px" data-primarykey="'+dpkey+'">'+
											'<option value="36">36</option>'+
											'<option value="40">40</option>'+
											'<option value="44">44</option>'+
											'<option value="48">48</option>'+
											'<option value="52">52</option>'+
											'<option value="56">56</option>'+
											'<option value="60">60</option>'+
											'<option value="64">64</option>'+
											'<option value="149">149</option>'+
											'<option value="153">153</option>'+
											'<option value="157">157</option>'+
											'<option value="161">161</option>'+
											'<option value="165">165</option>'+
											'<option value="auto">'+tl('auto')+'</option>'+
										'</select>'
										);
					var $btnhtml = $('<button data-primarykey="'+dpkey+'" type="button" class="btn btn-primary btn-forSelectSave" style="position:absolute;top:-3px;left:50px">'+tl('save')+'</button>');
					var $divhtml = $('<div class="for-SelectEdit u-hide" style="display:inline-block;width:auto;height:auto;position:relative"></div>');
					$divhtml.append($selecthtml,$btnhtml);
					$t.children('span').remove();
					$t.append($lh,$divhtml);
				}
				
			});
			
			/*
			 查看用户详情
			 * */
			
			NowTableObj.getDom().find('td[data-column-title="{user_ap}"]').each(function(){
				var $t = $(this);
				if($t.children('span').length>0 && $t.children('.link-forUser').length == 0){
					var thisText = $t.children('span').text();
					var dpkey = $t.parent().find('[data-table-type="select"]').attr('data-primarykey');
					
					var linkhtml = '<a style="font-size:12px" class="u-inputLink link-forUser" data-local="'+thisText+'" data-primarykey ="'+dpkey+'">'+thisText+'</a>';
					var $lh = $(linkhtml);
					
					$t.empty();
					$t.append($lh);
				}
			});
			
			
			/*
			 去除模式
			 * */
			/*
			NowTableObj.getDom().find('td[data-column-title="{model_24G}"],td[data-column-title="{model_5G}"]').each(function(){
				var $t = $(this);
				if($t.prev().children('a').text() == '' && $t.prev().children('a').length == 1){
					$t.empty();
				}
			});
			*/
			/*
			 去除频宽
			 * */
			/*
			NowTableObj.getDom().find('td[data-column-title="{bandwidth_24G}"],td[data-column-title="{bandwidth_5G}"]').each(function(){
				var $t = $(this);
				if( $t.prev().prev().children('a').text() == ''&& $t.prev().prev().children('a').length == 1){
					$t.empty();
				}
			});
			*/
			/*
			 去除单台管理
			 * */
			/*
			NowTableObj.getDom().find('td[data-column-title="{apOperation}"]').each(function(){
				var $t = $(this);
				if(!isFat($t)){
					$t.find('[data-local="{apMangement}"]').remove();
				}
			});
			*/
		}
		
		$(document).click(function(event){
				$('.link-forEdit').removeClass('u-hide');
				$('.for-textEdit').addClass('u-hide');
				$('.link-forSelect').removeClass('u-hide');
				$('.for-SelectEdit').addClass('u-hide');
				var targ = (event || window.event).target || (event || window.event).srcElement;
				if($(targ).hasClass('for-textEdit')){
					hdieOther($(targ).parent());
				}else if($(targ).parent().hasClass('for-textEdit') && !$(targ).hasClass('btn-forEditSave')){
					hdieOther($(targ).parent().parent());
				}else if($(targ).hasClass('link-forEdit')){
					hdieOther($(targ).parent());
				}else if($(targ).hasClass('for-SelectEdit')){
					hdieOther($(targ).parent());
				}else if($(targ).parent().hasClass('for-SelectEdit') && !$(targ).hasClass('btn-forSelectSave')){
					hdieOther($(targ).parent().parent());
				}else if($(targ).hasClass('link-forSelect')){
					hdieOther($(targ).parent());
				}
				
				
				function hdieOther($td){
					$td.find('.link-forEdit').addClass('u-hide');
					$td.find('.for-textEdit').removeClass('u-hide');
					$td.find('.link-forSelect').addClass('u-hide');
					$td.find('.for-SelectEdit').removeClass('u-hide');
				}
			})
		// 全局绑定修改名称事件
		$table.on('click','td[data-column-title="{name_mac}"]>a.link-forEdit,td[data-column-title="{name_mac}"]>div.for-textEdit>button.btn-forEditSave',function(event){
				var e = event || window.event;
				var tag = e.target || e.srcElement;
				var $t = $(tag);
				var primaryKey = $t.attr('data-primaryKey')
				var data = DATA["tableData"].getSelect({primaryKey : primaryKey})[0];
				if($t.hasClass('link-forEdit')){
					var $l = $(this);
					var thisWidth = 80;
					$l.addClass('u-hide');
					$l.next('.for-textEdit').removeClass('u-hide');
					$l.next('.for-textEdit').children('input').css('width',(thisWidth+15)+'px').val(data.namesarray);
					$l.next('.for-textEdit').children('button').css('left',(thisWidth+17)+'px');
				}else if($t.hasClass('btn-forEditSave')){
					var $b = $(this);
					var checkInputFunc = require('P_core/CheckFunctions').getFunc('checkInput');
					
					var nowtext = $b.parent().children('input').val();
					var checkres = checkInputFunc(nowtext,['name','0','11','5','eqName']);
					
					if(checkres.isCorrect){
						
						//发送ajax
						getSingleAjax(data,{'deviceName':nowtext})
						
//						$b.parent().prev().removeClass('u-hide').text(nowtext);
//						$b.parent().addClass('u-hide');
					}else{
						Tips.showInfo(checkres.errorStr)
					}
				}
				
			});
		// 全局绑定修改信道
		$table.on('click','td[data-column-title="{channel_24G}"]>a.link-forSelect,td[data-column-title="{channel_5G}"]>a.link-forSelect,td[data-column-title="{channel_24G}"]>div.for-SelectEdit>button.btn-forSelectSave,td[data-column-title="{channel_5G}"]>div.for-SelectEdit>button.btn-forSelectSave',function(event){
				var e = event || window.event;
				var tag = e.target || e.srcElement;
				var $t = $(tag);
				var primaryKey = $t.attr('data-primaryKey')
				var data = database.getSelect({primaryKey : primaryKey})[0];
				var type = $t.parent().parent().attr('data-column-title');
				if($t.hasClass('link-forSelect')){
					var $l = $(this);
					var thisWidth = $l.width();
					$l.addClass('u-hide');
					$l.next('.for-SelectEdit').removeClass('u-hide');
					$l.next('.for-SelectEdit').children('select').css({'width':(63)+'px',paddingLeft:'0px'}).children('[value="'+(Number($l.text())?$l.text():'auto')+'"]').prop('selected','selected');
					$l.next('.for-SelectEdit').children('select').trigger('focus');
					$l.next('.for-SelectEdit').children('button').css('left',(65)+'px');
				}else if($t.hasClass('btn-forSelectSave')){
					var $b = $(this);
					if(require('InputGroup').checkErr($b.parent())==0){
						var nowtext = $b.parent().children('select').val();
						if(type == '{channel_24G}'){
							getSingleAjax(data,{'channel':nowtext})
						}else{
							getSingleAjax(data,{'channel5G':nowtext})
						}
						
						
//						$b.parent().prev().removeClass('u-hide').text(nowtext);
//						$b.parent().addClass('u-hide');
					}
				}
				
			});
		// 全局查看用户
		$table.on('click','td[data-column-title="{user_ap}"]>a.link-forUser',function(event){
				var e = event || window.event;
				var tag = e.target || e.srcElement;
				var $t = $(tag);
				var primaryKey = $t.attr('data-primaryKey')
				var data = DATA["tableData"].getSelect({primaryKey : primaryKey})[0];
				
				showUserModal(data.macarray);
				
			});
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
							'<option value="manual">'+tl('manual')+'</option>'+
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
		$table.find('#btns>ul').prepend($newli);
		$selh.children('[value="manual"]').attr('selected','selected');
		
//		$tableCon.append($table);
	}
	
	// 表格刷新后调用的事件
	function afterTabel(tbobj){
		tbobj.getDom().find('input[type="checkbox"][data-table-type="select"]').each(function(){
			var $t = $(this);
			var primaryKey = $t.attr('data-primaryKey')
			var data = DATA["tableData"].getSelect({primaryKey : primaryKey})[0];
			if(data.apStatus == 1){
				$t.remove();
			}
		});
	}
	
	/* 射频设置保存 */
	function saveRF(selectval){
		var wttaj = Tips.showWaiting('{WaitForSaveSend}');
		var ul = DATA.usemacstrarr.length;
		DATA.overajax = '';
		DATA.overajax = [];
		DATA.usemacstrarr.forEach(function(oax,xx){
			DATA.overajax[xx] = {
//				'g4':0,
				'g5':0,
				'estr':''
			}
		});
		/*
		Tips.showTimer('{WaitForSaveSend}',20,function(){
        	Tips.showSuccess('{sendDataSuccess}');
			showTable('',true,true);
		});
		
		*/
		DATA.usemacstrarr.forEach(function(useobj,usi){
			signlAjax(usi,selectval);
		})
		
		var xxi = setInterval(function(){
			var nnum = 1;
			var stnumstr = '';
			var estrarr = [];
			DATA.overajax.forEach(function(lxxa){
				nnum = nnum*lxxa.g5;
				stnumstr += ''+lxxa.g5;
				estrarr.push(lxxa.estr);
			})
			if(nnum!= 0){
				wttaj.remove();
				clearInterval(xxi);
				var newerstr = '';
				var dexline = 1;
				estrarr.forEach(function(estarss){
					if(estarss != ''){
						newerstr += dexline+' :'+estarss;
						dexline++;
					}
				})
				if(stnumstr.indexOf('1')<0){
					/*全部失败*/
					Tips.showWarning(newerstr);
				}else if(stnumstr.indexOf('2')<0){
					/*全部成功*/
					Tips.showTimer('{WaitForSaveSend}',20,function(){
			        	Tips.showSuccess('{sendDataSuccess}');
//						showTable('',true,true);
					});
				}else{
					Tips.showTimer('{WaitForSaveSend}',20,function(){
						Tips.showWarning(newerstr);
//			        	Tips.showSuccess('{sendDataSuccess}');
//						showTable('',true,true);
					});
				}
			}
		},100);
		
	}
	
	
	function signlAjax(usi,selectval){
		
				
			var datastr4 = 'remoteSrcTemp='+selectval+'_4';
			var datastr5 = 'remoteSrcTemp='+selectval+'_5';
			var str= 'macStr='+DATA.usemacstrarr[usi]+'&passStr='+DATA.usepassstrarr[usi]+'&isGroupOpt='+DATA.usegroptarr[usi]+'&serialNo='+DATA.usetmpSerialnoarr[usi];
			$.ajax({
				type:"post",
				url:"common.asp?optType=sendRF&"+str,
				data:datastr4,
				success:function(result){
					var doEval = require('Eval');
				    var codeStr = result,
			            variableArr = ['status','errorstr'],
			            result = doEval.doEval(codeStr, variableArr);
	                var data = result["data"];
//	                DATA.overajax[usi].g4 = 1;
	                if(data.errorstr==""){
	                	$.ajax({
							type:"post",
							url:"common.asp?optType=sendRF&"+str,
							data:datastr5,
							success:function(result){
								var doEval = require('Eval');
							    var codeStr = result,
						            variableArr = ['status','errorstr'],
						            result = doEval.doEval(codeStr, variableArr);
				                var data = result["data"];
				                if(data.errorstr==""){
				                	 DATA.overajax[usi].g5 = 1;
				                	
				                	
				                }else{
				                	DATA.overajax[usi].g5 = 2;
	                				DATA.overajax[usi].estr = data.errorstr;
				                	/*发送失败*/
//				                	Tips.showError(data.errorstr);
				                }
							}
						});
	                }else{
	                	DATA.overajax[usi].g5 = 2;
	                	DATA.overajax[usi].estr = data.errorstr;
//	                	Tips.showError(data.errorstr);
	                }
				}
			});
		
	}
	
	
	/* 系统设置保存 */
	function saveSysSetting(macStr, passStr, isGroupOpt){
		var Serialize = require('Serialize');
		var $tabmod = DATA.tabmod;
		var queryArr = Serialize.getQueryArrs($tabmod.find('#e3'));
			queryJson = Serialize.queryArrsToJson(queryArr);
			queryStr = Serialize.queryJsonToStr(queryJson); 
		console.log(queryStr);
	    var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($tabmod);
        if(len > 0){
            return;
        }
        var database = DATA["tableData"];
	    var tableObj = DATA["tableObj"];
	    console.log(database);    
	    var str= DATA.apMacStr +'&'+queryStr +'&passStr='+passStr+'&isGroupOpt='+isGroupOpt;
	    var wtsleep = Tips.showWaiting('{WaitForSaveSend}');
	    //if(DATA.iptv == 1){
	    if(false){
		str1 = DATA.apMacStr + '&' + queryStr + '&passStr=' + passStr + '&isGroupOpt=' + isGroupOpt;
		
		$.ajax({
	//		url: 'common.asp?optType=apSysSettingTask',
			url:'/goform/formIptv',
			type: 'POST',
			data: str1, 
			success: function(result) {
			    var doEval = require('Eval');
			    var codeStr = result,
			    variableArr = ['status','errorArr'],
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];		

			    if (isSuccess) {
				var data = result["data"],
				    status = data['status'];
				errorArr = data['errorArr'];
				if (errorArr==undefined || errorArr.length == 0) {
				    //	                            Tips.showSuccess('{sendDataSuccess}');
				    saveSysSettingSleep(str,wtsleep,[]);
				    //	                            display($('#1'));
				} else {
				    var errstr = "";
				    errorArr.forEach(function(obj,index){
					if(obj.toString()){
					    errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+obj+" ");
					}
				    });
				    if(errstr){
					//								wtsleep.remove();
					//								Tips.showWarning(errstr);
				    }else{
					//								 saveSysSettingSleep(str,wtsleep);
				    }
				    saveSysSettingSleep(str,wtsleep,errorArr);

				}    
			    } else {       
				Tips.showError('{parseStrErr}');
			    }
			}
		});   
	    }
		$.ajax({
	//		url: 'common.asp?optType=apSysSettingTask',
			url:'/goform/aspTaskScheduler',
			type: 'POST',
			data: str, 
			success: function(result) {
			    var doEval = require('Eval');
			    var codeStr = result,
		            variableArr = ['status','errorArr'],
		            result = doEval.doEval(codeStr, variableArr),
		            isSuccess = result["isSuccessful"];		

		            if (isSuccess) {
	                    var data = result["data"],
	                            status = data['status'];
	                            errorArr = data['errorArr'];
	                    if (errorArr==undefined || errorArr.length == 0) {
//	                            Tips.showSuccess('{sendDataSuccess}');
	                            saveSysSettingSleep(str,wtsleep,[]);
                                saveSysSettingLowRate(str,wtsleep);
//	                            display($('#1'));
	                    } else {
	                    	var errstr = "";
							errorArr.forEach(function(obj,index){
								if(obj.toString()){
									errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+obj+" ");
								}
							});
							if(errstr){
//								wtsleep.remove();
//								Tips.showWarning(errstr);
							}else{
//								 saveSysSettingSleep(str,wtsleep);
							}
							saveSysSettingSleep(str,wtsleep,errorArr);
                            saveSysSettingLowRate(str,wtsleep,errorArr);
	                    }    
	                } else {       
	                    Tips.showError('{parseStrErr}');
	                }
	            }
	    });   
		function saveSysSettingSleep(str,wtsleep,oldArr){
			$.ajax({
		//		url: 'common.asp?optType=apSysSettingSleepMode',
				url:'/goform/aspChangeWled',
				type: 'POST',
				data: str, 
				success: function(result) {
				    var doEval = require('Eval');
				    var codeStr = result,
			            variableArr = ['status','errorArr'],
			            result = doEval.doEval(codeStr, variableArr),
			            isSuccess = result["isSuccessful"];		

			            if (isSuccess) {
		                    var data = result["data"],
	                            status = data['status'];
	                            errorArr = data['errorArr'];
	                            console.log(data);
		                    if (errorArr==undefined) {
		                    		wtsleep.remove();
//		                            DATA.tabModalObj.hide();
									Tips.showTimer('{WaitForSaveSend}',10,function(){
										/*发送成功*/
					                	 Tips.showSuccess('{sendDataSuccess}');
		//	                            display($('#1'));	
//										showTable('',true,true);
									});
				                	
		                    } else {
                                wtsleep.remove();
		                           var errstr = "";
									errorArr.forEach(function(obj,index){
										if(obj.toString() && oldArr[index].toString()){
											errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+obj+" ");
										}else if(obj.toString() && !oldArr[index]){
											errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+obj+" ");
										}else if(!obj.toString() && oldArr[index]){
											errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+oldArr[index]+" ");
										}
									});
									if(errstr){
										Tips.showWarning(errstr);
									}else{
										Tips.showSuccess('{sendDataSuccess}');
										/*发送成功*/
//					                	 Tips.showSuccess('{sendDataSuccess}');
		//	                            display($('#1'));	
//										showTable('',true,true);

		                           }    
		                    }    
		                } else {       
		                    Tips.showError('{parseStrErr}');
		                }
		            }
		    });			
		}

        function saveSysSettingLowRate(str,wtsleep,oldArr){
            $.ajax({
                url:'/goform/aspChangeLowRate',
                type: 'POST',
                data: str, 
                success: function(result) {
                    var doEval = require('Eval');
                    var codeStr = result,
                    variableArr = ['status','errorArr'],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                    console.log(result);
                  /*  if (isSuccess) {
                        var data = result["data"],
                        status = data['status'];
                        errorArr = data['errorArr'];
                        if (errorArr==undefined|| errorArr.length == 0) { 
                            wtsleep.remove();
                        } else {
                            wtsleep.remove();
                            var errstr = "";
                            errorArr.forEach(function(obj,index){
                                if(obj.toString() && oldArr[index].toString()){
                                    errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+
                                             obj+" ");
                                }else if(obj.toString() && !oldArr[index].toString()){
                                    errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+
                                             obj+" ");
                                }else if(!obj.toString() && oldArr[index].toString()){
                                    errstr+=("IP:"+DATA.ipArrtmp[index]+"Mac:"+DATA.macArrtmp[index]+" "+
                                             oldArr[index]+" ");
                                }    
                            });  
                            alert(errstr);
                            if(errstr){
                                Tips.showError(errstr);
                            }else{
                            }
                        }
                    }else{
                        Tips.showError('{parseStrErr}');
                    }*/
                }
            });
        }

	}
	
	/*
	 	单台管理 ajax获取
	 * */
	
	function getSingleAjax(data,forsave){
		var thismac = data.macarray;
		DATA.thismac= data.macarray;
		isFat_ = data.fitOrFat == '1'?true:false;
		var wt1 = {};
		if(forsave){
			wt1 = Tips.showWaiting('{dataSaving}');
		}else{
			wt1 = Tips.showWaiting('{dataReading}');
		}
		
		$.ajax({
			url: 'common.asp?optType=getApBasicCfg&macStr='+thismac,
			type: 'GET',
			success: function(result) {
				if(forsave){
					
				}else{
					wt1.remove();
				}
				
			    var doEval = require('Eval');
			    var codeStr = result,
		            variableArr = [
		            				'errorStr',
		            				'workingMode', /*工作模式*/
		            				'deviceName',/*谁备名*/
		            				'dhcp_en',/*启用的dhcp客户端*/
		            				'ipAddr',/*IP地址*/
		            				'netMask',/*子网掩码*/
		            				'gateWay',/*网关*/
		            				'userName',/*用户名*/
		            				'szName',/*网络名称  arr*/
		            				'userNum',/*客户端数 arr*/
		            				'roaming_en',/*启用漫游阈值*/
		            				'roaming_th',/*漫游阈值*/
		            				'elinkc',
		            				'iptvMode',
		            				'iptv_vlan',
		            				'iptv_port',
		            				'iptv_vlan_box',
		            				/*'AcElinkc',*/
		            				'days',/*星期*/
		            				'WlanTimeEns',/*是否开启*/
		            				'weekdayTimeStarts',/*工作日开始时间*/
		            				'weekdayTimeStops',/*工作日结束时间*/
		            				'weekendTimeStarts',/*周末开始时间*/
		            				'weekendTimeStops',/*周末结束时间*/
		            				'channel',/*信道*/
		            				'roaming_en5G',/*启用漫游阈值5*/
		            				'roaming_th5G',/*漫游阈值5*/
		            				'channel5G',/*信道5*/
		            				'urcpError',
		            				'passStr',
		            				'flag_5G'/*该设备是否支持5G*/
		            				],
		            result = doEval.doEval(codeStr, variableArr),
		            isSuccess = result["isSuccessful"];		

		            if (isSuccess) {
	                    var data = result["data"];
	                    if(DATA.singleReboot=="yes"){
		                    data.passStr=data.passStr==undefined?'':data.passStr;
							var all_restart = 'macStr='+DATA.singleMac + "&passStr=" + data.passStr + "&isGroupOpt=0";
							$.ajax({
								type:"get",
								url:"common.asp?optType=ap_batchrestart&"+all_restart,
								success:function(result){
									var tips = require('Tips');
									var checkvar = checkresult(result);
									if(!checkvar)
									{
										tips.showSuccess(tl("ApoperateOK"));
										showTable('',true,true);
									}else
									{
										tips.showWarning(checkvar);
									}
								}
							});
							DATA.singleReboot=="no";
							return;		                    	
	                    }
         
	                    if(data.urcpError !="" && data.urcpError!='{Appassworderror}'){
	                    	Tips.showError(data.urcpError);
	                    }else{
	                    	makeManagModal(data,forsave,wt1,isFat_);
	                    }
	                } else {       
	                    Tips.showError('{parseStrErr}');
	                }
	            }
	    }); 
	}
	/* 单台管理保存方法 */
	function saveManag($mamodal,forsave,wt1){
		if(DATA.iptv == 1){
		    /*向下面传值的被监控端口处理*/
		    var trr3 = $mamodal.find('[name="iptv_port_show"]').eq(0).parent().parent();
		    var tmpSrcPort = 0;
		    //for (i = 1; i <= DATA["maxLanPort"]; i++) {
		    for (i = 1; i <= 4; i++) {
			if (trr3.find('input[value="'+i+'"]').is(':checked')) {
			    tmpSrcPort |= (1 << (i - 1));
			}
		    }
		    $mamodal.find('[name="iptv_port"]').val(tmpSrcPort);
		}
		var SRLZ = require('Serialize');
		var tarr = SRLZ.getQueryArrs($mamodal);
		var tjson = SRLZ.queryArrsToJson(tarr);

		 var szUserNums = '';
		if(tjson.selectSZ0  ){
			szUserNums += tjson.szName0+':'+tjson.selectSZ0;
		}
		if(tjson.selectSZ1  ){
			szUserNums += ','+tjson.szName1+':'+tjson.selectSZ1;
		}
		if(tjson.selectSZ2  ){
			szUserNums += ','+tjson.szName2+':'+tjson.selectSZ2;
		}
		if(tjson.selectSZ3 ){
			szUserNums += ','+tjson.szName3+':'+tjson.selectSZ3;
		}
		tjson.szUserNums = szUserNums;
		if(forsave !== undefined){
			if(forsave.deviceName !== undefined){
				tjson.deviceName = forsave.deviceName;
			}
			if(forsave.channel !== undefined){
				tjson.channel = forsave.channel;
			}
			if(forsave.channel5G !== undefined){
				tjson.channel5G = forsave.channel5G;
			}
		}
		 console.log(tjson);

		tjson.day = '';
		var $date = $('[name="date"]').each(function(){
			var $t = $(this);
			tjson.day += ($t.is(':checked')? "1": "0");
		});

	
	    tjson.weekdaytimestart = tjson.weekdayfromhour+":"+tjson.weekdayfromminute;
		tjson.weekdaytimestop = tjson.weekdayendhour+":"+tjson.weekdayendminute;
		tjson.weekendtimestart = tjson.weekendfromhour+":"+tjson.weekendfromminute;
		tjson.weekendtimestop = tjson.weekendendhour+":"+tjson.weekendendminute;

		console.log(tjson);


		var newstrs = SRLZ.queryJsonToStr(tjson);

		newstrs = newstrs.replace(/\+/g,"%2B");  
		// return;
		var wt2 = '';
		if(!forsave){
			wt2 = Tips.showWaiting('{dataSaving}');
		}
		$.ajax({
			url: 'common.asp?optType=saveApBasicCfg',
			type: 'post',
			data:'macStr='+DATA.thismac+'&'+newstrs,
			success: function(result) {
				
				if(wt2 !== ''){
					wt2.remove();
				}
			    var doEval = require('Eval');
			    var codeStr = result,
		            variableArr = [
		            				'errorstr'
		            				],
		            result = doEval.doEval(codeStr, variableArr),
		            isSuccess = result["isSuccessful"];		

		            if (isSuccess) {
	                    var data = result["data"];
	                    console.log(data);
	                    if(data.errorstr !=""){
	                    	Tips.showError(data.errorstr);
	                    }else{
	                    	if(forsave){
	                    		
	                    		setTimeout(function(){
	                    			wt1.remove();
	                    			Tips.showSuccess('{sendDataSuccess}');
			                    	DATA.tabManagModalObj.hide();
		//	                    	$('[href="#1"]').trigger('click');
			                    	showTable('',true,true);
	                    		},1000);
	                    	}else{
	                    		Tips.showSuccess('{sendDataSuccess}');
		                    	DATA.tabManagModalObj.hide();
	//	                    	$('[href="#1"]').trigger('click');
		                    	showTable('',true,true);
	                    	}
	                    	
	                    }
	                } else {       
	                    Tips.showError('{parseStrErr}');
	                }
	            }
	    }); 							
	}
	/* 生成设置弹框 */
	function makeManagModal(data,forsave,wt1,isFat_){
		var isfat = isFat_;
		var allDisabled=false;
		if(!data.userNum){
			data.userNum=[];
		}
		/*
		if(data.workingMode==0){
			allDisabled=true;
		}else{
			allDisabled=false;
		}
		*/
		var modallist = {
			id:'tab_modal_manag',
			title:'{apMangement}',
			size:'normal',
			"btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
						/*
	                	var tabid = DATA.tabManagModalObj.getDom().find('.nav.nav-tabs>li.active').children('a').eq(0).attr('href');
	                	// #m1 #m2 #m3 
	                	if(tabid=='#m1'){
	                		
	                	}else if(tabid=='#m2'){
	                		
	                	}else if(tabid=='#m3'){
	                	}
                             
                        */
                        if(allDisabled==true){
                        	require('Tips').showWarning("{cantMgmt}");
                        	DATA.tabManagModalObj.hide();
//                      	display($('#1'));
                        	showTable('',true,true);
                        	return;
                        }
                        var IG = require('InputGroup');
                        var $mamodal = DATA.tabManagModalObj.getDom();
                        
                        
                        /*
	                	$mamodal.find('[href="#m1"]').trigger('click');
                		setTimeout(function(){
                			if(IG.checkErr($mamodal.find('#m1'))==0){
	                			$mamodal.find('[href="#m2"]').trigger('click');
	                			setTimeout(function(){
	                				if(IG.checkErr($mamodal.find('#m2'))==0){
		                				$mamodal.find('[href="#m3"]').trigger('click');
				                		if(IG.checkErr($mamodal.find('#m3'))==0){
				                			saveManag($mamodal);
				                		}
			                		}
	                			},200);
	                		}
                		},200);
	                	*/
	                	/* 阶梯检测保存方法 */
					var earr;
					if(DATA.iptv == 1){
					  earr = ['#m1','#m2','#m4','#m5', '#m6'];
					}else{
					  earr = ['#m1','#m2','#m4','#m5'];
					}
			    		if(IG.checkErr($mamodal,true)>0){
			    			for(var i = 0;i<earr.length;i++){
			    				if(IG.checkErr($mamodal.find(earr[i]),true)>0){
			    					$mamodal.find('[href="'+earr[i]+'"]').trigger('click');
			    					return false;
			    				}
			    			}
			    		}
			    		saveManag($mamodal);
	                	
	                	
	                }
	            },
	            {
	                "type"      : 'reset',
	                clickFunc : function($this){
	                }
	            },
	            {
	                "type"      : 'close'
	            }
	        ]
		};
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(modallist);
		DATA.tabManagModalObj = modalObj;
		/* 绑定特有的重填方法 */
		var $newreset = modalObj.getDom().find('#reset').clone(false).attr('id','newreset');
		modalObj.getDom().find('#reset').after($newreset);
		modalObj.getDom().find('#reset').remove();
		$newreset.click(function(){
			var $active = $(modalObj.getDom().find('nav>ul.nav>li.active>a').attr('href')).wrap('<form></form>');
			$active.parent()[0].reset();
			$active.unwrap();
			setTimeout(function(){
				$active.find('[type="radio"]:checked,[type="checkbox"],select').each(function(){
					var $ti = $(this);
					if($ti.is(':visible')){
						var thisTagName = $ti[0].tagName;
						if(thisTagName == 'INPUT'){
							if($ti.attr('type') == 'checkbox'){
								$ti.trigger('click');
								$ti.trigger('click');
							}else{
								$ti.trigger('click');
							}
							
						}else if(thisTagName == 'SELECT'){
							$ti.trigger('change');
						}
					}
				});
				//取消所有报错气泡
				$active.find('.input-error').remove();
			},1)
		});
		var Tabs = require('Tabs');
		var tabsList = [
			{"id" : "m1", "title" : '{basicSetting}'},
//			{"id" : "m2", "title" : '{roamingSetting}'},
//			{"id" : "m4", "title" : '管理Elinkc'},
//			{"id" : "m5", "title" : '无线定时'},
			/*
			{"id" : "m3", "title" : '{fre5G}'}
			*/
		];
		if(!isfat){
			tabsList.push({"id" : "m2", "title" : '{roamingSetting}'});
			//tabsList.push({"id" : "m4", "title" : '管理Elinkc'});
			tabsList.push({"id" : "m5", "title" : '无线定时'});
			if(DATA.iptv == 1){
			    tabsList.push({"id" : "m6", "title" : 'IPTV'});
			}
		}
		var $tabsDom = Tabs.get$Dom(tabsList);
		modalObj.insert($tabsDom);
		var $tabmod = modalObj.getDom();

		DATA.tabmod=$tabmod;
		
		tall(modalObj.getDom());
		
		
		
		 displaym1($tabmod.find('#m1'),isfat);
	    
	     if(!isfat){
	     	 displaym2($tabmod.find('#m2'));
		     //displaym4($tabmod.find('#m4'));
		    displaym5($tabmod.find('#m5'));
		    if(DATA.iptv == 1){
			displaym6($tabmod.find('#m6'));
		    }
	     }
	     /*
	     displaym3($tabmod.find('#m3'));
	     */
	     if(forsave !== undefined){
			saveManag(modalObj.getDom(),forsave,wt1);
		}else{
			modalObj.show();
		}
	     $tabmod.find(' a[href="#m1"]').trigger('click');

		function displaym1($tabcon,isfat){
			var inputlist = [
				 {
			    	"prevWord"	:'{apWorkMode}',
			    	"display"   :true,
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'ap_mode',
				        "defaultValue": data.workingMode,
				        items:[
				        	{name:'{fitAp}',value:'1'},
				        	{name:'{fatAp}',value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
				{
					"prevWord"	:'{apDeviceName}',
					"display"   :false,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'deviceName',
				        "value"      : data.deviceName || '',
				        // "checkDemoFunc":['checkInput','name','0','23']
				    },
				    "afterWord": ''
				},
				{
			    	"prevWord"	:'{apEnDhcp}',
			    	"display"   :false,
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'dhcp_en',
				        "defaultValue" : data.dhcp_en ||"0",
				        items:[
				        	{name:'{open}' ,value:'1',control:'openDHCP'},
				        	{name:'{close}' ,value:'0',control:'noDHCP'}
				        ]
				    },
				    "afterWord": ''
				},
				{
					"sign"		: 'noDHCP',
					"display"   :false,
					"prevWord"	:'{apIpAddr}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'sysIp',
				        "value"      : data.ipAddr ||''
				    },
				    "afterWord": ''
				},
				{
					"sign"		: 'noDHCP',
					"display"   :false,
					"prevWord"	:'{apSubNet}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'subMask',
				        "value"      : data.netMask || ''
				    },
				    "afterWord": ''
				},
				{
					"sign"		: 'noDHCP',
					"display"   :false,
					"prevWord"	:'{apGateWay}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'gateWay',
				        "value"      : data.gateWay || ''
				    },
				    "afterWord": ''
				},
				
				{
					"prevWord"	:'{apUserName}',
					"disabled"	: true,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'userName',
				        "value"      : data.userName || ''
				    },
				    "afterWord": ''
				},
				{
			    	"prevWord"	:'{modifyPwd}',
			    	"disabled"	: allDisabled,
			    	display: !isfat,
				    "inputData" : {
				        "type"       : 'checkbox',
				        "name"       : 'modifyPw',
				        "defaultValue" : 'off',
				        items:[
				        	{name:'' ,value:'on' ,checkOn:'1',checkOff:'0'},
				        ]
				    },
				    "afterWord": ''
				},
				{
					"sign"		: 'openPSWD',
					"disabled"	: allDisabled,
					display: !isfat,
					"prevWord"	:'{pwd}',
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'pw1',
				        "eye"		:true,
				        "value"      : '',
				        "checkDemoFunc" : ['checkName','1','11','noSysName']
				    },
				    "afterWord": ''
				},
				{
					"sign"		: 'openPSWD',
					"disabled"	: allDisabled,
					display: !isfat,
					"prevWord"	:'{pwdConfirm}',
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'pw2',
				        "eye"		:true,
				        "value"      : '',
				        "checkDemoFunc" : ['checkPass','pw1'] 
				    },
				    "afterWord": ''
				},
				{	
					display     : false,
					"prevWord"	:'{cliNumLimit}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"		 : 'ffq',
				        "value"      : ''
				    },
				    "afterWord": '{cliNum}'
				},
				{
					display     : false,
					"prevWord"	:'',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'szName0',
				        "value"      : data.szName[0] || ''
				    },
				    "afterWord": ''
				},
				{
					display     : false,
					"prevWord"	:'',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'szName1',
				        "value"      : data.szName[1] || ''
				    },
				    "afterWord": ''
				},
				{
					display     : false,
					"prevWord"	:'',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'szName2',
				        "value"      : data.szName[2] || ''
				    },
				    "afterWord": ''
				},
				{
					display     : false,
					"prevWord"	:'',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'szName3',
				        "value"      : data.szName[3] || ''
				    },
				    "afterWord": ''
				}
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			
			/* 密码部分样式切换 */
			
			var showpas = $input.find('[data-control="openPSWD"]');
			showpas.addClass('u-hide');
			$input.find('[name="modifyPw"]').click(function(){
				if($(this).is(':checked')){
					showpas.removeClass('u-hide');
				}else{
					showpas.addClass('u-hide');
				}
			});
			
			
			tall($input);
			$tabcon.empty().append($input);
			
			var showcount = 0;
			$input.find('[name="szName0"],[name="szName1"],[name="szName2"],[name="szName3"]').each(function(){
				var tindex = $(this).attr('name').substr(6,1);
				if(data.szName[tindex] === undefined){
					$(this).parent().parent().remove();
				}else{
					showcount++;
					var $select = $('<select style="width:80px" name="selectSZ'+tindex+'" value="'+(data.userNum[tindex]?data.userNum[tindex]:'0')+'">'+
										'<option value="0">0</option>'+
										'<option value="1">1</option>'+
										'<option value="2">2</option>'+
										'<option value="3">3</option>'+
										'<option value="4">4</option>'+
										'<option value="5">5</option>'+
										'<option value="6">6</option>'+
										'<option value="7">7</option>'+
										'<option value="8">8</option>'+
										'<option value="9">9</option>'+
										'<option value="10">10</option>'+
										'<option value="11">11</option>'+
										'<option value="12">12</option>'+
										'<option value="13">13</option>'+
										'<option value="14">14</option>'+
										'<option value="15">15</option>'+
										'<option value="16">16</option>'+
										'<option value="17">17</option>'+
										'<option value="18">18</option>'+
										'<option value="19">19</option>'+
										'<option value="21">21</option>'+
										'<option value="22">22</option>'+
										'<option value="23">23</option>'+
										'<option value="24">24</option>'+
										'<option value="25">25</option>'+
										'<option value="26">26</option>'+
										'<option value="27">27</option>'+
										'<option value="28">28</option>'+
										'<option value="29">29</option>'+		
										'<option value="30">30</option>'+
										'<option value="31">31</option>'+																												
									'</select>');
					$(this).parent().next().append($select);
				}
			});
			if(showcount==0){
				$input.find('[name="ffq"]').parent().parent().remove();
			}else{
				$input.find('[name="ffq"]').after('<span>'+tl('networkName')+'</span>')
				$input.find('[name="ffq"]').remove();
				// var $notespan = $('<div></div>')
		  //   				.css({fontWeight:'bold',wordBreak:'normal',whiteSpace:'normal',padding:'10px',backgroundColor:'#eeeeee',marginTop:'10px'})
	   //      				.append(tl('cliNumTip'));
	   //     		 $tabcon.append($notespan);	
			}
			
			
			
			
			
			
			
			}
		
			function displaym2($tabcon){
				var inputlist = [
					{
				    	"prevWord"	:'{roamingEn24G}',
				    	"disabled"	: allDisabled,
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'roaming_en',
					        "defaultValue" : data.roaming_en || '0',
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
						"prevWord"	:'{_24GRoaming}',
						"disabled"	: allDisabled,
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'roaming_th',
					        "value"      : data.roaming_th ||'',
					         "checkDemoFunc":['checkInput','num','-100','-70']
					    },
					    "afterWord": '{roamingTip}'
					},
					{
				    	"prevWord"	:{},
				    	"display"  :false,
					    "inputData" : {
					        "type"       : 'select',
					        "name"       : 'channel',
					        "defaultValue": data.channel || '0',
					        items:[
					        	{name:'{auto}',value:'0'},
					        	{name:'1',value:'1'},
					        	{name:'2',value:'2'},
					        	{name:'3',value:'3'},
					        	{name:'4',value:'4'},
					        	{name:'5',value:'5'},
					        	{name:'6',value:'6'},
					        	{name:'7',value:'7'},
					        	{name:'8',value:'8'},
					        	{name:'9',value:'9'},
					        	{name:'10',value:'10'},
					        	{name:'11',value:'11'},
					        	{name:'12',value:'12'},
					        	{name:'13',value:'13'}
					        ]
					    },
					    "afterWord": ''
					},
					{
						"display"	:(data.flag_5G=='1'?true:false),
				    	"prevWord"	:'{roamingEn5G}',
				    	"disabled"	: allDisabled,
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'roaming_en5G',
					        "defaultValue" : data.roaming_en5G || '0',
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
						"display"	:(data.flag_5G=='1'?true:false),
						"prevWord"	:'{_5GRoaming}',
						"disabled"	: allDisabled,
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'roaming_th5G',
					        "value"      : data.roaming_th5G ||'',
					         "checkDemoFunc":['checkInput','num','-100','-70']
					    },
					    "afterWord": '{roamingTip}'
					},
					{
				    	"prevWord"	:{},
				    	"display"  :false,
					    "inputData" : {
					        "type"       : 'select',
					        "name"       : 'channel5G',
					        "defaultValue": data.channel5G || '0',
					        items:[
					        	{name:'{auto}',value:'0'},
					        	{name:'36',value:'36'},
					        	{name:'40',value:'40'},
					        	{name:'44',value:'44'},
					        	{name:'48',value:'48'},
					        	{name:'52',value:'52'},
					        	{name:'56',value:'56'},
					        	{name:'60',value:'60'},
					        	{name:'64',value:'64'},
					        	{name:'149',value:'149'},
					        	{name:'149',value:'149'},
					        	{name:'153',value:'153'},
					        	{name:'157',value:'157'},
					        	{name:'161',value:'161'},
					        	{name:'165',value:'165'}
					        ]
					    },
					    "afterWord": ''
					}					
				];
				var InputGroup = require('InputGroup');
				var $input = InputGroup.getDom(inputlist);
				/* 开启关闭漫游阀值的操作*/
				g24change();
				$input.find('[name="roaming_en"]').click(function(){
					g24change();
				});
				g5change();
				$input.find('[name="roaming_en5G"]').click(function(){
					g5change();
				});
				
				function g24change(){
					var vals = $input.find('[name="roaming_en"]:checked').val();
					if(vals == '0'){
						$input.find('[name="roaming_th"]').attr('disabled','disabled')
					}else{
						$input.find('[name="roaming_th"]').removeAttr('disabled')
					}
					
				}
				function g5change(){
					var vals = $input.find('[name="roaming_en5G"]:checked').val();
					if(vals == '0'){
						$input.find('[name="roaming_th5G"]').attr('disabled','disabled')
					}else{
						$input.find('[name="roaming_th5G"]').removeAttr('disabled')
					}
				}
				
				
				tall($input);
				$tabcon.empty().append($input);
			}
		
			
			function displaym3($tabcon){
				var inputlist = [
					{
				    	"prevWord"	:'{roamingEn}',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'roaming_en5G',
					        "defaultValue" : data.roaming_en5G || '0',
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
						"prevWord"	:'{roaming}',
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'roaming_th5G',
					        "value"      : data.roaming_th5G ||''
					    },
					    "afterWord": '{roamingTip}'
					},
					{
				    	"prevWord"	:{},
					    "inputData" : {
					        "type"       : 'select',
					        "name"       : 'channel5G',
					        "defaultValue": data.channel5G || '0',
					        items:[
					        	{name:'{auto}',value:'0'},
					        	{name:'149',value:'149'},
					        	{name:'153',value:'153'},
					        	{name:'157',value:'157'},
					        	{name:'161',value:'161'},
					        	{name:'165',value:'165'}
					        ]
					    },
					    "afterWord": ''
					}
				];
				var InputGroup = require('InputGroup');
				var $input = InputGroup.getDom(inputlist);
				tall($input);
				$tabcon.empty().append($input);
			}
			function displaym4($tabcon){
				var inputlist = [
				    /*
					{
				    	"prevWord"	:'AC启用Elinkc',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'AcElinkc',
					        "defaultValue" : data.AcElinkc+"" ,
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},*/
					{
				    	"prevWord"	:'AP启用Elinkc',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'elinkc',
					        "defaultValue" : data.elinkc+"" ,
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					}
				];
				var InputGroup = require('InputGroup');
				var $input = InputGroup.getDom(inputlist);
				tall($input);
				$tabcon.empty().append($input);
			}

			function displaym6($tabcon){

				var sourceDis = true;
				var srcPortCtl = false;
                /*保存被检测口的勾选项*/
			    var tmpSrcPort= new Array();
			    /*处理被监控端口的赋值数据*/
			    for (i = 1; i <= 4; i++) {
			      if ((data.iptv_port & (1 << (i - 1))) != 0) {
			    	 	tmpSrcPort.push(i);
			        }
			    }
                var iptv_port = tmpSrcPort;
				var inputlist = [
				    /*
					{
				    	"prevWord"	:'AC启用Elinkc',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'AcElinkc',
					        "defaultValue" : data.AcElinkc+"" ,
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},*/
					{
				    	"prevWord"	:'开启IPTV',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'iptvMode',
					        "defaultValue" : data.iptvMode || "0" ,
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
				    	"prevWord"	:'VLAN',
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'iptv_vlan',
					        "value" : data.iptv_vlan || '45',
					         "checkDemoFunc":['checkInput','num','10','4094']
					    },
					    "afterWord": '10~4094'
					},
                    {
				"prevWord" : 'IPTV端口',
				"display" : sourceDis,
				"disabled":srcPortCtl,
				"inputData" : {
					"type" : 'checkbox',
					"name" : 'iptv_port_show',
					"defaultValue": iptv_port ,
					"count": 4,
					"items" : [
						{
							"value" : '1',
							"name" : 'LAN1',
						},
						{
							"value" : '2',
							"name" : 'LAN2',
						},
						{
							"value" : '3',
							"name" : 'LAN3',
						},
						{
							"value" : '4',
							"name" : 'LAN4',
						},
						{
							"value" : '5',
							"name" : 'LAN5',
						},
						{
							"value" : '6',
							"name" : 'LAN6',
						}																				
					    ]
					},
					"afterword" : ''
					},
					{
				    	"prevWord"	:'VLAN终端',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'iptv_vlan_box',
					        "defaultValue" : data.iptv_vlan_box || "0" ,
					        items:[
					        	{name:'是' ,value:'1'},
					        	{name:'否' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
					    "display" : false,
					    "inputData" : {
					    "type" : "text",
					    "name" : 'iptv_port',
					    "defaultValue":''
					},
					
			},

                
				];
				var InputGroup = require('InputGroup');
				var $input = InputGroup.getDom(inputlist);
				tall($input);
				$tabcon.empty().append($input);
			}
			
			function displaym5($tabcon){

				

				var inputlist = [
					{
				    	"prevWord"	:'开启无线定时',
					    "inputData" : {
					        "type"       : 'radio',
					        "name"       : 'WrlessEnable',
					        "defaultValue" : data.WlanTimeEns || '0',
					        items:[
					        	{name:'{open}' ,value:'1'},
					        	{name:'{close}' ,value:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
				    	"prevWord"	:'工作日',
					    "inputData" : {
					        "type"       : 'checkbox',
					        "name"       : 'date',
					        "defaultValue" : [] ,
					        items:[
					        	{name:'星期一' ,value:'1',checkOn:'1',checkOff:'0'},
					        	{name:'星期二' ,value:'2',checkOn:'1',checkOff:'0'},
					        	{name:'星期三' ,value:'3',checkOn:'1',checkOff:'0'},
					        	{name:'星期四' ,value:'4',checkOn:'1',checkOff:'0'},
					        	{name:'星期五' ,value:'5',checkOn:'1',checkOff:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
				    	"prevWord"	:'',
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'gzr_time',
					        value :''
					    },
					    "afterWord": ''
					},
					{
				    	"prevWord"	:'双休日',
					    "inputData" : {
					        "type"       : 'checkbox',
					        "name"       : 'date',
					        "defaultValue" : [] ,
					        items:[
					        	{name:'星期六' ,value:'6',checkOn:'1',checkOff:'0'},
					        	{name:'星期日' ,value:'7',checkOn:'1',checkOff:'0'}
					        ]
					    },
					    "afterWord": ''
					},
					{
				    	"prevWord"	:'',
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'ssr_time',
					        value :''
					    },
					    "afterWord": ''
					},
				];
				
				var InputGroup = require('InputGroup');
				var $input = InputGroup.getDom(inputlist);
				tall($input);
				/*  添加时间选择下拉框*/
				var sel_h = '<select style="width:60px">'+
					(function(){
						var _s = '';
						for(var i = 0;i<24;i++){
							var ss = (String(i).length==1?'0'+String(i):String(i));
							_s += '<option value="'+ss+'">'+ss+'</option>';
						}
						return _s;
					}())+
					'</select>';
				var sel_m = '<select style="width:60px">'+
					(function(){
						var _s = '';
						for(var i = 0;i<60;i++){
							var ss = (String(i).length==1?'0'+String(i):String(i));
							_s += '<option value="'+ss+'">'+ss+'</option>';
						}
						return _s;
					}())+
					'</select>';
				
				var gzr = $input.find('[name="gzr_time"]').parent();
				gzr.empty().append($(sel_h).attr('name','weekdayfromhour'),' : ',$(sel_m).attr('name','weekdayfromminute'),' 到 ',$(sel_h).attr('name','weekdayendhour'),' : ',$(sel_m).attr('name','weekdayendminute'));
				
				var ssr = $input.find('[name="ssr_time"]').parent();
				ssr.empty().append($(sel_h).attr('name','weekendfromhour'),' : ',$(sel_m).attr('name','weekendfromminute'),' 到 ',$(sel_h).attr('name','weekendendhour'),' : ',$(sel_m).attr('name','weekendendminute'));
				
				$tabcon.empty().append($input);

			
				for (i = 0; i < data.days.length; i++) {
					if (data.days.charAt(i) == "1"){
						i=i+1;
						$input.find("[name = date][value="+i+"]" ).prop("checked","true");
						i=i-1;	
					}
			    } 
				
			    
			    var index1 = data.weekdayTimeStarts .indexOf(":");
			    var index2 = data.weekdayTimeStops .indexOf(":");

			    $input.find("[name = weekdayfromhour]" ).val( data.weekdayTimeStarts.substring(0, index1) || '00');
			    $input.find("[name = weekdayfromminute]" ).val( data.weekdayTimeStarts.substring(index1 + 1) || "00");
			    $input.find("[name = weekdayendhour]" ).val( data.weekdayTimeStops.substring(0, index2) || "00");
			    $input.find("[name = weekdayendminute]" ).val( data.weekdayTimeStops.substring(index2 + 1) || "00");

			    index1 = data.weekendTimeStarts.indexOf(":");
			    index2 = data.weekendTimeStops.indexOf(":");

			    $input.find("[name = weekendfromhour]" ).val( data.weekendTimeStarts.substring(0, index1) || "00");
			    $input.find("[name = weekendfromminute]" ).val( data.weekendTimeStarts.substring( index1+ 1) || "00");
			    $input.find("[name = weekendendhour]" ).val( data.weekendTimeStops.substring(0, index2)|| "00");
			    $input.find("[name = weekendendminute]" ).val( data.weekendTimeStops.substring( index2 + 1)|| "00");


		
				
				
				
			}
		}
		
		
		
		
	
	
	// 生成编辑和新增弹框
	function makeEditModal(macStr, passStr, isGroupOpt,flag_5Gdemo){
		var modallist = {
			id:'tab_modal',
			title:tl('batch_manage'),
			size:'large',
			"btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){

	                	var tabid = DATA.tabModalObj.getDom().find('.nav.nav-tabs>li.active').children('a').eq(0).attr('href');
	                	// #e1 #e2 #e3 #e4
	                	if(tabid=='#e1'){
	                		/*保存射频设置*/
	                		var spmbval = DATA.tabModalObj.getDom().find('[name="spmb"]').val();
	                		if(spmbval){
	                			saveRF(spmbval);
	                		}
	                		
	                		
	                	}else if(tabid=='#e3'){
	                		/*保存系统设置*/
	                		saveSysSetting(macStr, passStr, isGroupOpt);
	                	}
                                                   			             	
	                }
	            },
	            {
	                "type"      : 'reset',
	                clickFunc : function(){
	                	
	                }
	            },
	            {
	                "type"      : 'close'
	            }
	        ]
		};
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(modallist);
		DATA.tabModalObj = modalObj;
		var Tabs = require('Tabs');
		var tabsList = [
			{"id" : "e1", "title" : tl('RF_setting')},
			{"id" : "e2", "title" : tl('eqNetName')},
			{"id" : "e3", "title" : tl('sysSettiing')},
			{"id" : "e4", "title" : tl('configReboot')},
			{"id" : "e5", "title" : 'MAC地址过滤'}
		];
		var $tabsDom = Tabs.get$Dom(tabsList);
		modalObj.insert($tabsDom);
		var $tabmod = modalObj.getDom();

		DATA.tabmod=$tabmod;

		$tabmod.find('a[href="#e1"]').click(function(event) {
			showbtns(1);
		});
		$tabmod.find('a[href="#e2"]').click(function(event) {
			showbtns(2);
		});
		$tabmod.find('a[href="#e3"]').click(function(event) {
			showbtns(1);
		});
		$tabmod.find('a[href="#e4"]').click(function(event) {
			showbtns(2);
		});
		$tabmod.find('a[href="#e5"]').click(function(event) {
			showbtns(2);
		});
		function showbtns(btnsType){
			var $save = $tabmod.find('#save');
			var $res = $tabmod.find('#reset');
			var $back = $tabmod.find('#modal-hide');
			
			var $modfoot = $tabmod.find('.modal-footer');
			
			if(btnsType == '1'){
				$save.removeClass('u-hide');
				$res.removeClass('u-hide');
				$back.removeClass('u-hide');
				$modfoot.removeClass('u-hide');
			}else if(btnsType == '2'){
				$save.addClass('u-hide');
				$res.addClass('u-hide');
				$back.addClass('u-hide');
				$modfoot.addClass('u-hide');
			}
		}
		
		tall(modalObj.getDom());
		modalObj.show();
		 displaye1($tabmod.find('#e1'));
	     displaye2($tabmod.find('#e2'));
	     displaye3($tabmod.find('#e3'));
	     displaye4($tabmod.find('#e4'));
	     displaye5($tabmod.find('#e5'));
	     $tabmod.find(' a[href="#e1"]').trigger('click');

	   
	   	/*
	   	 	获得初始化的数据
	   	 * */
	   	    
	   	
	   	
		/* 无线设置 */
		function displaye1($tabcon){
//			var $dv1 = $('<div style="position:relative;display:inline-block;width:49%"></div>');
//			var $dv2 = $('<div style="position:relative;display:inline-block;width:49%"></div>');
//			$tabcon.append($dv1,$dv2);
			console.log(DATA.tmpname);
			var spmbItems = [];
			var al = DATA.tmpname.length;
			
			for(var n = 0; n<al ;n += 2){
				var subs = DATA.tmpname[n].substr(0,DATA.tmpname[n].length-2);
				spmbItems.push({name:subs,value:subs});
			}
			
			
			var inputlist = [
				 {
			    	"prevWord"	:tl('RF_template'),
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'spmb',
				        "defaultValue": '',
				        items:spmbItems
				    },
				    "afterWord": ''
				},
				/*
				{
			    	"prevWord"	:'2.4G{Roam_threshold}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'myfz2',
				        "defaultValue" : '',
				        items:[
				        	{name:'{open}' ,value:'1'},
				        	{name:'{close}' ,value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
				{
					"prevWord"	:'{Correlation_threshold}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'glfz2',
				        "value"      : ''
				    },
				    "afterWord": 'dBm'
				},
				{
					"prevWord"	:'{Roam_threshold}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'myfz2',
				        "value"      : ''
				    },
				     "afterWord": 'dBm'
				}
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			tall($input);
			$dv1.empty().append($input);
			
			var inputlist = [
				 {
				    "inputData" : {
				        "type"       : 'words',
				        "name"       : '',
				    },
				},
				{
			    	"prevWord"	:'5G{Roam_threshold}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'myfz5',
				        "defaultValue" : '',
				        items:[
				        	{name:'{open}' ,value:'1'},
				        	{name:'{close}' ,value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
				{
					"prevWord"	:'{Roam_threshold}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'glfz5',
				        "value"      : ''
				    },
				     "afterWord": 'dBm'
				},
				{
					"prevWord"	:'{Roam_threshold}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'myfz5',
				        "value"      : ''
				    },
				     "afterWord": 'dBm'
				}
				*/
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			tall($input);
			$tabcon.append($input);
		}
		/* VLAN设置 */
		function displaye2($tabcon){
			function processData2(res){
				   var doEval = require('Eval');
				   var variableArr = [
				   'wepFormat',
					'wepKeyRadio',
					'wepKey1Type',
					'wepKey2Type',
					'wepKey3Type',
					'wepKey4Type',
					'wpaVersion',
					'wpaEncrp',
					'wpaTime',
					'pskVersion',
					'pskEncry',
					'pskPsswd',
					'pskTime',
				   'addrPoolNames', //地址池名
				   'addrPoolVid', //
				   'encodeType',//电脑or手机
				   'statusSZ',
				   'zoneName', // 网络名称
				   'ssid',		// SSID
				   'fre2Arr',
				   'fre5Arr',
				   'cliMaxNumArr',
				   'broadcast',//隐藏ssid
				   'isolate',//无线隔离
				   'encrytype', // 安全模式
				   'wepPwd',	//web密钥
				   'radiusPwd',//Radius密码	
				   'sharePwd', //预共享密钥
				   'radiusIP',//Radius服务器IP
				   'radiusPort',//Radius服务器端口
				   'cliMaxNum',
				   'isolate',
				   'vlanId',	//VLAN ID
				   'ipAddr',
				   'netMask',
				   'dhcp',
				   'wepAuthType',	//认证类型
				   'autoIssued',  // 自动下发
				   'limit_type',	// 限速策略
				   'limit_down',	//下载速率
				   'limit_up',		//上传速率
				   'poolVids',	//已创建的vlan(内网配置中显示)
				   'totalrecs'	

				   ]; // 变量名称
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
					DATA["tabTableData"] = database;
					// 声明字段列表
					var fieldArr =['ID','zoneName','ssid',
					/*
					'spjk',
					*/
					'vlanId','dzcname','encrytype',
					'wifipasseord','limit_type','downUpSpeed',
					'autoIssued',
					'encodeType',
					'broadcast',
					'autoSend', //"自动下发"别称，用于编辑
					'isolate', //无线隔离
					'scrtype', //“安全”别称，用于编辑
					'shareType', //“共享”别称，用于编辑
					'upSpeed',	//“上行”别称，用于编辑
					'downSpeed',//“下行”别称，用于编辑
					
					'wepAuthType',//“认证类型”别称，用于编辑
					'wepFormat',//“密钥格式   = 1 16进制、2 共享密钥”  别称，用于编辑
					'wepKeyRadio',//用于编辑
					'wepKey1Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
					'wepKey2Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
					'wepKey3Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
					'wepKey4Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
					'wpaVersion',//“WAP版本  = 0自动、1WPA、2WPA2”别称，用于编辑
					'wpaEncrp',//“加密算法   = 0自动、1TKIP、2AES”别称，用于编辑
					'wpaTime',//“密钥更新周期”别称，用于编辑
					'pskVersion',//用于编辑
					'pskEncry',//用于编辑
					'pskPsswd',//“预共享密钥”别称，用于编辑
					'pskTime',//“密钥更新周期”别称，用于编辑
					'wepPwd',//{密钥}1{密钥}2{密钥}3{密钥}4
					'radiusIP',//Radius{服务器}IP
					'radiusPort',//Radius{服务器}端口
					'cliMaxNumArr',//最大客户端数量
					'fre2Arr',
					'fre5Arr',
					'ipAddr',
					'poolVids',//已创建的vlan(内网配置中显示)
					];
					
					var baseData = [];
					var autoSend=0;
					DATA.ipAddr=data.ipAddr[0];
					DATA.poolVids=data.poolVids;
					DATA.addrPoolNames=data.addrPoolNames;
					DATA.zoneName=data.zoneName;
					DATA.cliMaxNumArr=data.cliMaxNumArr;
					data.zoneName.forEach(function(obj,i){
						console.log(data)
						baseData.push([
							Number(i)+1,
							data.zoneName[i],
							data.ssid[i],
							/*
							function(){
								var freStr='';
								var freStr2='';
								var freStr5='';
								if(data.fre2Arr[i]==1){
									freStr2='2.4G';
								}
								if(data.fre5Arr[i]==1){
									freStr5='5G';
								}		
								if(data.fre2Arr[i]!=1&&data.fre5Arr[i]==1){
									freStr='5G';
								}else if(data.fre2Arr[i]==1&&data.fre5Arr[i]!=1){
									freStr='2.4G';
								}else{
									freStr=freStr2+'、'+freStr5;
								}
								return freStr;
							}(),
							*/
							function(){
								var vlanidStr;
								if(data.vlanId[i]==0){
									vlanidStr='';
								}else{
									vlanidStr=data.vlanId[i];
								}
								return vlanidStr;
							}(),					
							
							function(){//地址池名称
								var poolStr="{noPoolAddr}";
								var tmpVlanIdStr='';
								data.addrPoolVid.forEach(function(str,index){ 
									var tmpId='';
									if(data.vlanId[i]==''){
										// data.vlanId[i]=0;
										tmpId=0;
									}else{
										tmpId=data.vlanId[i];
									}
									if(data.addrPoolVid[index]==tmpId){	
										poolStr=data.addrPoolNames[index];
									}
								});
								return poolStr;
							}(),
							
							function(){				//安全模式
								var encryStr='';
								if(data.encrytype[i]==0){
									encryStr='{noneEncry}';
								}else if(data.encrytype[i]==1){
									encryStr='WEP';

								}else if(data.encrytype[i]==2){
									encryStr='WPA / WPA2';
								}else if(data.encrytype[i]==2){
									encryStr='WPA-PSK / WPA2-PSK';
								}
								return encryStr;
							}(),					
							function(){				//无线密码
								var webFlag=0;  //如果为true则找到密钥,此时表格应用省略号
								var encryPwdStr='';
								if(data.encrytype[i]==0){
									encryPwdStr='{noneEncry}';
								}else if(data.encrytype[i]==1){
									for(var j=0; j<4; j++){
										if(data.wepPwd[i][j]!=0){
											if(webFlag<=1){
												encryPwdStr=data.wepPwd[i][j];
												webFlag=webFlag+1;
											}else{
												encryPwdStr=data.wepPwd[i][j]+'...';
											}
										}
									}
									
								}else if(data.encrytype[i]==2){
									encryPwdStr=data.radiusPwd[i];
								}else if(data.encrytype[i]==2){
									encryPwdStr=data.sharePwd[i];
								}
								return encryPwdStr;
							}(),
							
							function(){
								var shareStr='';

								if(data.limit_type[i]==1){
									shareStr='{shareSpeed}';
								}else if(data.limit_type[i]==2){
									shareStr='{exclusiveSpeed}';
								}else{
									shareStr='{shareSpeed}';
								}
								return shareStr;
							}(),	
							function(){
								var speedStr='';
								speedStr = data.limit_down[i]+'/'+data.limit_up[i];
								return speedStr;
							}(),					
							function(){
								var shareStr='';
								if(data.autoIssued[i]==1){
									shareStr='{sendOpen}';
									autoSend=1;
								}else if(data.autoIssued[i]==0){
									shareStr='{sendClose}';
									autoSend=0;
								}else{
									shareStr='{sendClose}';
								}
								return shareStr;
							}()	,
							data.encodeType[i],	
							data.broadcast[i],	
							autoSend,	
							data.isolate[i],
							data.encrytype[i],
							data.limit_type[i],
							data.limit_up[i],
							data.limit_down[i],
							data.wepAuthType[i],
							data.wepFormat[i],
							data.wepKeyRadio[i],
							data.wepKey1Type[i],
							data.wepKey2Type[i],
							data.wepKey3Type[i],
							data.wepKey4Type[i],
							data.wpaVersion[i],
							data.wpaEncrp[i],
							data.wpaTime[i],
							data.pskVersion[i],
							data.pskEncry[i],
							data.pskPsswd[i],
							data.pskTime[i],
							data.wepPwd[i],
							data.radiusIP[i],
							data.radiusPort[i],
							/*
							data.cliMaxNumArr[i],
							data.fre2Arr[i],
							data.fre5Arr[i],
							*/
							data.poolVids[i]				
						]);
					});
					
					// 将数据存入数据表中
					database.addTitle(fieldArr);
					
					database.addData(baseData);
			}	

			function makeTable2($tableCon){
				var btnList = [
				{
					"id": "sendToApM",
					"name": tl("sendToAp"),
					 "clickFunc" : function($btn){
					 	$btn.blur();
					 	
					 	var database = DATA["tabTableData"];
						var tableObj = DATA["tabTableObj"];
	
						// 获得表格中所有被选中的选择框，并获取其数量
				        var	primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
						var length = primaryKeyArr.length;
						/*	
						if(length <= 0){
							Tips.showInfo(tl('sendAPnotSelect'));
							return;
						}else 
						*/
						var szNum=0;
						if(length <1){
							Tips.showInfo(tl('atLeastSelectOneSZ'));
							return;
						}else if(length >4){
							Tips.showInfo(tl('allowSelectFour'));
							return;
						}else{
							if(length!=1){
								szNum=length;
							}

							/* 获取2.4G 5G的复选框勾选值 */
							var G24 = DATA.tabModalObj.getDom().find('#2Gchecked').is(':checked');
							var G5 = DATA.tabModalObj.getDom().find('#5Gchecked').is(':checked');
							
							if(!G24 && !G5){
								Tips.showInfo(tl('notSelectFreq'));
								return;
							}

							require('Tips').showConfirm(tl('joinConfirm'),function(){
								var szName='';
								var szStr='';	
								thisDataBo = true;
								primaryKeyArr.forEach(function(primaryKey) {
										var data = database.getSelect({
											primaryKey: primaryKey
										});
										/*
										if(data[0].fre2Arr == 1 && data[0].fre5Arr == 1){
											thisDataBo = false;
										}
										*/
										console.log(data[0]);
									var name = data[0]["zoneName"];
										szName = name;
										szStr += name + ',';
								});
								/*
								if(!thisDataBo){
									Tips.showInfo(tl('notAllowFreDiff'));
									return ;
								}
								*/
								szStr = szStr.substr(0, szStr.length - 1);			
								var msz='szName='+szName+'&SZNameArray='+szStr+'&'+DATA.sendSzStr;
								if(G24){
									msz = msz+"&fre2=on";
								}else{
									msz = msz+"&fre2=off";
								}
								if(G5){
									msz = msz+"&fre5=on";
								}else{
									msz = msz+"&fre5=off";
								}								
								sendFunc('send',data, msz, szNum);
							});
						}	
		        	}

				}];				
				var database = DATA["tabTableData"];
				var headData = {
					"btns" :  btnList
				};
				
				// 表格配置数据
				var tableList = {
					"database": database,
					"isSelectAll":true,
					"dicArr" : ['common', 'doEqMgmt' , 'doNetName'],
					"titles": {
						"ID"		 : {
							"key": "ID",
							"type": "text",
						},
						"{eqNetName}"		 : {
							"key": "zoneName",
							"type": "text",
						},
						"SSID"		 : {
							"key": "ssid",
							"type": "text",
						},
						/*
						"{radioFrequencyIf}"		 : {
							"key": "spjk",
							"type": "text",
						},
						*/
						"VLAN ID"		 : {
							"key": "vlanId",
							"type": "text",
						},
						"{addrPoolNm}" : {
							"key": "dzcname",
							"type": "text",
						},
						/*
						"{operation}": {
							"type": "links",
							"links" : [
								{
									"name" : '{sendToAp}',
									"clickFunc" : function($this){
										$this.blur();
										var primaryKey = $this.attr('data-primaryKey')
										var tableObj = DATA["tableObj"];
										var data = database.getSelect({primaryKey : primaryKey})[0];
										require('Tips').showConfirm(tl('joinConfirm'),function(){
											send_no_use_Func('send', data, "", 'retClientData');
										});	
									}
								}
							]
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
					
				/* 添加 2.4 5G 复选框*/
				$table.find('#btns>ul>').prepend('<li class="utt-inline-block" style="margin-right:10px"> <input type="checkbox" id="2Gchecked" checked="true" /> 2.4G</li><li class="utt-inline-block" style="margin-right:10px"> <input type="checkbox" id="5Gchecked" /> 5G</li>');
				if(flag_5Gdemo !== undefined && flag_5Gdemo == 0){
					$table.find('#5Gchecked').parent().remove();
				}
				
				// 将表格组件对象存入全局变量，方便其他函数调用
//				DATA["tableObj"] = tableObj;
				DATA["tabTableObj"] = tableObj;
				DATA.tabModalObj.getDom().find('#e2').append($table);
			}		
			$.ajax({
				type:"get",
				url:"common.asp?optType=sZone|lan",
				success:function(result){
					// 数据处理
					processData2(result);

					//生成表格
					makeTable2($('#1'));
					// var tranDomArr = [$con];
					// var dicArr     = ['common', 'doNetName'];
					// require('Translate').translate(tranDomArr, dicArr);	
				}
			});
		}
		
		/* 安全设置 */
		function displaye3($tabcon){
			var inputlist = [
				{
			    	"prevWord"	:'{taskName}',
			    	'disabled': true,
			    	'display':false,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'username',
				        "value" : 'admin'
				    },
				    "afterWord": ''
				},
				{
			    	"prevWord"	:'{taskPasswd}',
			    	necessary:true,
				    "inputData" : {
				        "type"       : 'passStr',
				        "name"       : 'passStr',
				        "value" : 'admin',
				        eye:true
				    },
				    "afterWord": ''
				},
				{	sign:'1',
			    	"prevWord"	:'{taskPlan}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'TaskS',
				        "defaultValue" : '0',
				        items:[
				        	{name:'{taskOpen}' ,value:'1'},
				        	{name:'{taskClose}' ,value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
				{	sign:'1',
			    	"prevWord"	:'{taskSleepMode}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'sleepMode',
				        "defaultValue" : 'off',
				        items:[
				        	{name:'{taskOpen}' ,value:'on'},
				        	{name:'{taskClose}' ,value:'off'}
				        ]
				    },
				    "afterWord": ''
                },
                {
                    sign:'1',
                    "prevWord"      :'开启低速率剔除',
                    "inputData" : {
                        "type"      : 'radio',
                        "name"      : 'DeleteLowRateEn',
                        "defaultValue" : 'off',
                        items:[
                            {name:'{taskOpen}' ,value:'on'},
                            {name:'{taskClose}' ,value:'off'}
                        ]
                    },
                    "afterWord": ''
                },
        {
            sign:'1',
            "prevWord"      :'限制最低速率',
            "inputData" : {
                "type"       : 'text',
                "name"       : 'DeleteLowRate',
                "disabled"   : 'true',
                "defauleValue" : null,
                "checkDemoFunc":['checkInput','num','0','1000','int']
            },
            "afterWord": 'M'
        }
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			var taskPlanArr=[];
			taskPlanArr=DATA.taskPlan;
			var otherOptions  = '';
			taskPlanArr.forEach(function(obj,i){
				otherOptions +='<option value="'+(Number(i)+1)+'" >'+obj+'</option>';
			})

			// 添加计划任务开启时的下拉列表
			var planhtml = '<div id="for-task-change">'+
								'<select name="TaskSValue" id="TaskSValue">'+
									'<option value="0">'+tl('noTaskPlan')+'</option>'+
									otherOptions+
								'</select>'+
								'<a class="u-inputLink" style="margin-left:10px" id="addTaskPlan">'+ tl('add') +'</a>'+
							'</div>';
			
			var $taskselect = $(planhtml);
			
            $input.find('[name="TaskS"]').parent().next().append($taskselect);
            $input.find('[name="DeleteLowRateEn"]').click(function(){
                LowRateChange()
            });  

            function LowRateChange(){
                        var vals = $input.find('[name="DeleteLowRateEn"]:checked').val();
                            if ( vals == 'off' ) {
                                    $input.find('[name="DeleteLowRate"]').attr('disabled','disabled');
                                }else{
                                    $input.find('[name="DeleteLowRate"]').removeAttr('disabled');
                                    }    
                        }    
                                         // 绑定事件计划开启事件
			$input.find('[name="TaskS"]').click(function(){
				makeTheTaskPlanChange();
			});
			makeTheTaskPlanChange();
			function makeTheTaskPlanChange(){
				var palval = $input.find('[name="TaskS"]:checked').val();
				if(palval == '1'){
					$input.find('#for-task-change').removeClass('u-hide');
				}else{
					$input.find('#for-task-change').addClass('u-hide');
				}
			}
			
			// 计划任务新增点击事件
			$input.find('#addTaskPlan').click(function(){
				makeModal($input.find('#TaskSValue'));
			});
			tall($input);
			$tabcon.append($input);

		}
		function displaye4($tabcon){
			var inputlist = [
					{
					    "inputData" : {
					        "type"       : 'text',
					        "name"       : 'btns'
					    },
					}
				];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			$input.css({'margin-top':'30px','margin-left':'250px'});
			var $nownode = $input.find('[name="btns"]').parent().prev();
			$nownode.empty().append('<button class="btn btn-primary" id="restart">'+tl('reboot')+'</button>');
			$nownode.append('<button style="margin-left:10px" class="btn btn-primary" id="factory-reset">'+tl('backFactory')+'</button>');
			$input.find('[name="btns"]').remove();
			$tabcon.css('height','90px');
		/* W.xy */
            function allreset()
            {
                var all_reset = DATA.apMacStr + "&passStr=" + DATA.apPassStr + "&isGroupOpt=" + DATA.isGroupOpt + "&serialNo=" + DATA.serialnumberarr;
                $.ajax({
                    type:"get",
                    url:"common.asp?optType=ap_batchreset&"+all_reset,
                    success:function(result){
                        var tips = require('Tips');
                        var checkvar = checkresult(result);
                        if(!checkvar)
                        {
                            tips.showSuccess(tl("ApoperateOK"));
                        }else
                        {
                            tips.showWarning(checkvar);
                        }
                    }
                });

            }
            $input.find('#factory-reset').click(function(){
            	Tips.showConfirm(tl('Apensurereset'),function(){
            		allreset();
            	});
                
            });
            
		function allrestart()
		{
			var all_restart = DATA.apMacStr + "&passStr=" + DATA.apPassStr + "&isGroupOpt=" + DATA.isGroupOpt;
			$.ajax({
				type:"get",
				url:"common.asp?optType=ap_batchrestart&"+all_restart,
				success:function(result){
						var tips = require('Tips');
						var checkvar = checkresult(result);
						if(!checkvar)
						{
							tips.showSuccess(tl("ApoperateOK"));
//							tips.showTimer('{}',60)
						}else
						{
							tips.showWarning(checkvar);
						}
				}
			});
	
		}
			$input.find('#restart').click(function(){
				Tips.showConfirm(tl('Apensurereboot'),function(){
					allrestart();
				})
					
			});
			$tabcon.append($input);
		}
				/* mac过滤 */
		function displaye5($tabcon){
			function processData5(res){
			 	 eval(res)
	
			    // 存入数据库
			    var Database = require('Database'),
				database = Database.getDatabaseObj(); // 数据库的引用
				// 存入全局变量DATA中，方便其他函数使用
				DATA["tableData5"] = database;
				// 声明字段列表
				var fieldArr =[
					'ID',
					'mac',
				    'serverShow', 
				    'rule'
				];
				DATA.SZones5 = SZones;
				DATA. max_totalrecs5 =  max_totalrecs;
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

			function makeTable5(){
				// 表格上方按钮配置数据
				var btnList = [
					{
						"id": "sendMacFilter",
						"name": '{sendToApM}',
						 "clickFunc" : function($btn){
								/* 获取已被勾选的行 */
						 		var keyarr = DATA["tableObj5"].getSelectInputKey('data-primaryKey');
						 		if(keyarr.length>=0){
						 			require('Tips').showConfirm(tl('joinConfirm'),function(){
						 				var dataarrs = [];
						 				keyarr.forEach(function(keyobj){
						 					var primaryKey = keyobj;
											var td = DATA["tableData5"].getSelect({primaryKey : primaryKey})[0];
						 					dataarrs.push(td);
						 				})
										if(dataarrs.length>=0){
										
										
										var macgroup = '';
										dataarrs.forEach(function(obj){
											macgroup += obj.mac+",";
										});
										macgroup = macgroup.substr(0,macgroup.length-1);
										var ipStr=DATA.apIpStr||'';
										var passStr=DATA.apPassStr||'';
										var macStr = DATA.apMacStr||'';
										
										var sendStr = 'mfNameArray='+macgroup+"&"+DATA.sendSzStr_bak;
										$.ajax({
											type:"post",
											url:"goform/formApBatchMacFilter",
											//url:"goform/aspApBatchMacFilter",
											data:sendStr,
											success:function(result){
												var doEval = require('Eval');
												var variableArr = ['status','errorstr'];
												var result = doEval.doEval(result, variableArr);
												var isSuccessful = result['isSuccessful'];
												// 判断字符串代码是否执行成功
												if(isSuccessful){
												    // 执行成功
												    var data = result['data'];
												    if(data.status|| data.errorstr==''){
												    	Tips.showTimer('{WaitForSaveSend}',15,function(){
															/*发送成功*/
										                	 Tips.showSuccess('{sendDataSuccess}');
														});
												    }else{
												    	Tips.showError(data.errorstr);
												    }
												}
											}
										});
										
										
									}
									});
						 		}else{
						 			require('Tips').showInfo('{unSelectDelTarget}');
						 		}
			        		}
					}
				];
				var database = DATA["tableData5"];
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
						"{MACAddr}{group}{name}"		 : {
							"key": "mac",
							"type": "text"
						},
						"{networkName}"		 : {
							"key": "serverShow",
							"type": "text"
						},
						"{rule}"		 : {
							"key": "rule",
							"type": "text",
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
				DATA["tableObj5"] = tableObj;
			
				DATA.tabModalObj.getDom().find('#e5').append($table);
			}		
			$.ajax({
				type:"get",
				url:"common.asp?optType=apMacFilter",
				success:function(result){
					// 数据处理
					processData5(result);

					//生成表格
					makeTable5();
					tall(DATA["tableObj5"].getDom());
					// var tranDomArr = [$con];
					// var dicArr     = ['common', 'doNetName'];
					// require('Translate').translate(tranDomArr, dicArr);	
				}
			});
		}
		
	}
	
	
	
	function makeModal($select){
	    var data ={};
	    var modalList = {
	      "id"   : 'taskplan-modal',
	      "title": '{add}',
	      "btns" : [
	        {
	          "type"      : 'save',
	          "clickFunc" : function($this){
	            var $modal =$this.parents('.modal');
	            addSubmitClick($modal,'add',data,$select);
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
	    var modal = require('Modal');
	    var modalObj = modal.getModalObj(modalList);
	    DATA.modalobjTime=modalObj;  
	    var inputList = [
	      {
	        "necessary": true,  //是否添加红色星标：是
	        "prevWord": '{taskName}',
	        "inputData": {
	          "type"       : 'text',
	          "name"       : 'ID',
	          "value"    : data.ID || '',
	          "checkDemoFunc": ['checkInput', 'name', '1', '31', '5'] 
	          // "checkDemoFunc" : ['checkName','1','10']
	        },
	        "afterWord": ''
	      },
	      { 
	        "prevWord": '{taskItv}',
	        "inputData": {
	          "type": 'select',
	          "name": 'selDateType',
	         "defaultValue":data.selDateType || '01',
	          // "defaultValue":jiange || '01',
	          "items" : [
	            {
	              "value" : '01',
	              "name"  : '{weekly}',
	            },
	            {
	              "value" : '02',
	              "name"  : '{everyDay}',
	            },
	            {
	              "value" : '03',
	              "name"  : '{everyHour}',
	            },
	            {
	              "value" : '04',
	              "name"  : '{perMinute}',
	            }
	          ]
	        },
	        "afterWord": ''
	      },
	      { 
	        "prevWord": '{runTime}',
	        "inputData": {
	          "type": 'select',
	          "name": 'selDay',
	          "defaultValue":data.selDay || '01',
	          "items" : [
	            {
	              "value" : '01',
	              "name"  : '{monday}',
	            },
	            {
	              "value" : '02',
	              "name"  : '{tuesday}',
	            },
	            {
	              "value" : '03',
	              "name"  : '{wednesday}',
	            },
	            {
	              "value" : '04',
	              "name"  : '{thursday}',
	            },
	            {
	              "value" : '05',
	              "name"  : '{friday}',
	            },
	            {
	              "value" : '06',
	              "name"  : '{saturday}',
	            },
	            {
	              "value" : '00',
	              "name"  : '{sunday}',
	            }
	          ]
	        },
	        "afterWord": ''
	      },
	      { 
	        "prevWord": '{conOfTask}',
	        "inputData": {
	          "type": 'select',
	          "name": 'selContent',
	          "defaultValue":data.selContent || 'rebootS',
	          "items" : [
	            {
	              "value" : 'rebootS',
	              "name"  : '{deviceReboot}',
	            }
	          ]
	        },
	        "afterWord": ''
	      }
	    ];
	    var IG = require('InputGroup');
	    var $inputs = IG.getDom(inputList);
	    var afterStr = '<input class="worktime-box" name="txtHour1" value="'+(data.txtHour1||'')+'" type="text"/><span>:</span><input class="worktime-box" name="txtMin1"  value="'+(data.txtMin1||'')+'" type="text"/><span>:</span><input class="worktime-box" name="txtSec1" type="text" disabled="disabled" value="00"/>';
	    $inputs.find('[name="selDay"]').css({marginRight:'10px'}).after(afterStr);
	    $inputs.find('.worktime-box').css({width:'50px',marginLeft:'10px',marginRight:'10px'});
	    $inputs.find('[name="txtHour1"]').css({marginLeft:'0px'});
	
	    
	    
	
	    $inputs.find('[name="txtHour1"],[name="txtMin1"],[name="txtSec1"]').keyup(function(){
	      if($(this).val().length>=2){
	        $(this).blur();
	        if($(this).next().next().hasClass('worktime-box')){
	          $(this).next().next().focus();
	        }
	      }
	    });
	    $inputs.find('[name="txtHour1"]').keyup(function(){
	      var vals = $(this).val();
	      if(Number(vals)>23){
	        $(this).val('23');
	      }else if(Number(vals)<0){
	        $(this).val('00');
	      }
	    });
	    $inputs.find('[name="txtMin1"],[name="txtSec1"]').keyup(function(){
	      var vals = $(this).val();
	      if(Number(vals)>59){
	        $(this).val('59');
	      }else if(Number(vals)<0){
	        $(this).val('00');
	      }
	    });
	    $inputs.find('[name="txtHour1"],[name="txtMin1"],[name="txtSec1"]').blur(function(){
	
	      var vals = $(this).val();
	      if(Number(vals)>=0 && Number(vals)<10){
	        $(this).val('0'+Math.round(Number(vals)));
	      }
	      if(isNaN(vals)){
	        $(this).val('00');
	      }
	    });
	    $inputs.click(function(event){
	      var e = event || window.event;
	      var targ = e.target || e.srcElement;
	      var $t = $(targ);
	      if($t.attr('name') == 'txtHour1'){
	          $inputs.find('[[name="txtMin1"],[name="txtSec1"]').trigger('blur');
	      }else if($t.attr('name') == 'txtMin1'){
	          $inputs.find('[name="txtHour1"],[name="txtSec1"]').trigger('blur');
	      }else if($t.attr('name') == 'txtSec1'){
	          $inputs.find('[name="txtHour1"],[name="txtMin1"]').trigger('blur');
	      }else{
	         $inputs.find('[name="txtHour1"],[name="txtMin1"],[name="txtSec1"]').trigger('blur');
	      }
	     
	    })
	    $inputs.find('[name="txtHour1"]').checkdemofunc('checkNum','00','23');
	    $inputs.find('[name="txtMin1"]').checkdemofunc('checkNum','00','59');
	    makeTheAfterInputChange();
	    $inputs.find('[name="selDateType"]').change(function(){
	      makeTheAfterInputChange();
	    });
	    function makeTheAfterInputChange(){
	      var a1 = $inputs.find('[name="selDay"]'),
	        a2 = $inputs.find('[name="txtHour1"]'),
	        a3 = $inputs.find('[name="txtMin1"]'),
	        all = $inputs.find('[name="selDay"]').parent().parent();
	      a1.addClass('u-hide');
	      a2.addClass('u-hide').removeAttr('disabled');
	      a3.addClass('u-hide');
	      all.addClass('u-hide');
	      
	      var taskin = $inputs.find('[name="selDateType"]').val();
	
	      switch(taskin){
	        case '01':
	          all.removeClass('u-hide');
	          a1.removeClass('u-hide').val(data.selDay || '01');
	          a2.removeClass('u-hide').val(data.txtHour1 || '00');
	          a3.removeClass('u-hide').val(data.txtMin1 || '00');
	          break;
	        case '02':
	          all.removeClass('u-hide');
	          a2.removeClass('u-hide').val(data.txtHour1 || '00');
	          a3.removeClass('u-hide').val(data.txtMin1 || '00');
	          break;
	        case '03':
	          all.removeClass('u-hide');
	          a2.removeClass('u-hide').val('').attr('disabled','true');
	          a3.removeClass('u-hide').val(data.txtMin1 || '00');
	          break;
	        default:
	          break;
	      }
	    }
	    modalObj.insert($inputs);
	     var $modalDom = modalObj.getDom();
	     var Translate  = require('Translate');
	    var tranDomArr = [$modalDom,$inputs];
	    var dicArr     = ['common','lanConfig'];
	    
	    Translate.translate(tranDomArr, dicArr);
	   
//	    $('body').append($modalDom);
	
	   
//		tall($modalDom);
	    modalObj.show();
	  }  
	  
    function addSubmitClick($modal, type,data,$select) {
	    // 加载序列化模块
	    var Serialize = require('Serialize');
	    // 获得用户输入的数据
	    var queryArrs = Serialize.getQueryArrs($modal);
	    addTask(queryArrs, $modal, type,data,$select);
	  }
	  /**
	   * 添加VLAN
	   * @author JeremyZhang
	   * @date   2016-09-05
	   * @param  {[type]}   queryArrs [description]
	   * @param  {[type]}   $modal    [description]
	   */
    function addTask(queryArrs, $modal,type,data,$select) {
	    var InputGroup = require('InputGroup');
	    var tips = require('Tips');
	    var len = InputGroup.checkErr($modal);
	    if(len > 0)
	    {
	      return;
	    }
	    var Serialize = require('Serialize');
	    var queryJson = Serialize.queryArrsToJson(queryArrs);
	    //判断是否为改变格式
	    if(queryJson.selDateType != '01'){
	        queryJson.txtHour2 =queryJson.txtHour1 || '00';
	        queryJson.txtMin2 =queryJson.txtMin1 || '00';
	        queryJson.txtSec2 =queryJson.txtSec1 || '00'; 
	        queryJson.txtHour1 ='00';
	        queryJson.txtMin1 ='00';
	        queryJson.txtSec1 ='00';
	
	        if(queryJson.selDateType == '03'){
	            queryJson.txtHour2 == '##';
	        }else if(queryJson.selDateType == '04'){
	                queryJson.txtHour2 ='##';
	                queryJson.txtMin2 ='##';
	                queryJson.txtSec2 ='##'; 
	        }
	    }else{
	        queryJson.txtHour2 ='00';
	        queryJson.txtMin2 ='00';
	        queryJson.txtSec2 ='00';
	    }
	    queryJson.IDold  =data.ID || '';
	    var queryStr = Serialize.queryJsonToStr(queryJson);
	    //获得提示框组件调用方法
	    var Tips = require('Tips');
	    queryStr = queryStr + '&' +'Action=' + type;
	    $.ajax({
	      url: '/goform/formTaskEdit_ap',
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
	            tips.showSuccess('{saveSuccess}');
	            // 刷新页面
	            DATA.modalobjTime.hide();
	            console.log($select[0])
	            $select.append('<option value="'+$select.children().length+'">'+queryJson.ID+'</option>')
	            DATA.taskPlan.push(queryJson.ID);
				$select.val($select.children().length-1);
//	            display($('#1'));
	            
	            
	          } else {
	            var errorstr=data.errorstr;
	            if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
	              tips.showWarning('{saveFail}');
	            }else{
	              tips.showWarning(errorstr);
	            }
	          }
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });
	  }
	  
	// 清除离线AP
	function clearOutlineAP(){
		var selectdata = DATA["tableObj"].getSelectInputKey('data-primaryKey');
		var Tips = require('Tips');
		if(selectdata.length == 0){
			Tips.showInfo(tl('offlineAPnotSelect'));
		}else{
			
			
			var haveOnlineAp = false;
			var delstr = 'delstr=';
			var firstStr = delstr;
			for(var i in selectdata){
				var data = DATA["tableData"].getSelect({primaryKey : selectdata[i]})[0];
				if (data.apStatus == 0) {
					if (delstr != firstStr) {
						delstr += ",";
					}
					delstr += data.macarray;
				}
				if(data.apStatus == '1'){
					haveOnlineAp = true;
				}
			}
			if(haveOnlineAp){
				Tips.showInfo(tl("delonline_ap_forbid"));
				return;
			}
			
			$.ajax({
				type:"post",
				url:"/goform/formApManageDel",
				data:delstr,
				success: function(result) {
					eval(result);
					if (status == 1) {
						Tips.showSuccess(tl("del_success"));
//						display($('#1'));
						showTable('',true,true);
					} else {
						Tips.showError(tl("del_failed"));
					}
				}
			});
			
		}
		
		

		
		
	}
	  
	/*用户数据弹框*/
	function showUserModal(mac){
		$.ajax({
			url:'common.asp?optType=aspOutPutWlanCltList&mac='+mac,
			type:'GET',
			success:function(result){
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = [
						'macarrays', 
						'linkedaps', // 接入AP 
						'linkedSSIDs', // 接入SSID
						'wlanFre', // 频段
						'signals', //  信号
						'rates', // 速率
						'bindwidths', // 频宽
						'downloads', // 下载
						'downRate', // 下载速率
						'uploads', // 上传
						'upRate', // 上传速率
						'time' // 在线时长
					],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					var Database = require('Database'),
					database = Database.getDatabaseObj(); // 数据库的引用
					// 存入全局变量DATA中，方便其他函数使用
					DATA["userData"] = database;
					// 声明字段列表
					var fieldArr =[
						'ID',
						'macarrays',
						'linkedaps',  /*ip地址列*/
						'linkedSSIDs',
						'wlanFre',
						'signals',
						'rates',
						'bindwidths',
						'downloads',
						'downRate',
						'uploads',
						'upRate',
						'time'
					];
					
					var baseData = [];
					if(data.macarrays){
						 data.macarrays.forEach(function(obj,i){
							baseData.push([
								Number(i)+1,
								data.macarrays[i],
								data.linkedaps[i],
								data.linkedSSIDs[i],
								data.wlanFre[i],
								data.signals[i],
								data.rates[i],
								data.bindwidths[i],
								data.downloads[i],
								data.downRate[i],
								data.uploads[i],
								data.upRate[i],
								data.time[i]
							]);
						});
					}
					
					// 将数据存入数据表中
					database.addTitle(fieldArr);
					
					database.addData(baseData);
					
					makeUserModal(database);
				} else {
					Tips.showWarning('{parseStrErr}');
				}					
			}
		});	
		
		function makeUserModal(database){
			var modallist = {
				id:'userInfo_modal',
				title:'用户',
				size:'large1',
				"btns" : [
					/*
		            {
		                "type"      : 'save',
		                "clickFunc" : function($this){
		                }
		            },
		            {
		                "type"      : 'reset',
		                clickFunc : function($this){
		                }
		            },
		            */
		            {
		                "type"      : 'close'
		            }
		        ]
			};
			var Modal = require('Modal');
			var modalObj = Modal.getModalObj(modallist);
			var TableContainer = require('P_template/common/TableContainer');
			var conhtml = TableContainer.getHTML({}),
				$tableCon = $(conhtml);
			modalObj.insert($tableCon);	
			
			
			var headData = {
				"btns" : []
			};
			
			// 表格配置数据
			var tableList = {
				"database": database,
//				 otherFuncAfterRefresh:textClickEvent,
				"isSelectAll":false,
				"dicArr" : ['common','doEqMgmt','doRFT'],
				"titles": {
					"ID"		 : {
						"key": "ID",
						"type": "text",
					},
				    "MAC地址"	  : {
						"key": "macarrays",
						"type": "text",
						"sort": 'mac'
					},
					 "接入AP"	  : {
						"key": "linkedaps",
						"type": "text",
						"sort": 'word'
					},
					 "接入SSID"	  : {
						"key": "linkedSSIDs",
						"type": "text",
						"sort": 'word'
					},
					 "频段"	  : {
						"key": "wlanFre",
						"type": "text",
						"sort": 'word'
					},
					 "信号"	  : {
						"key": "signals",
						"type": "text",
						"sort": 'word'
					},
					 "速率"	  : {
						"key": "rates",
						"type": "text",
						"sort": 'word'
					},
					 "频宽"	  : {
						"key": "bindwidths",
						"type": "text",
						"sort": 'word'
					},
					 "下载数据"	  : {
						"key": "downloads",
						"type": "text",
						"sort": 'data'
					},
					 "下载速率（bit/s）"	  : {
						"key": "downRate",
						"type": "text",
						"sort": 'data'
					},
					 "上传数据"	  : {
						"key": "uploads",
						"type": "text",
						"sort": 'data'
					},
					 "上传速率（bit/s）"	  : {
						"key": "upRate",
						"type": "text",
						"sort": 'data'
					},
					 "在线时长"	  : {
						"key": "time",
						"type": "text",
						"sort": 'time'
					},
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
			
			$tableCon.append($table);
			var tranDomArr = [modalObj.getDom()];
			var dicArr     = ['common'];
			require('Translate').translate(tranDomArr, dicArr);	
			modalObj.show();
		}
		
		
	}
	  
	  
	module.exports = {
		display: display
	};
});
