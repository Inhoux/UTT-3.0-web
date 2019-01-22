define(function(require, exports, module){
	var DATA={};
	function tl(str){
    	return require('Translate').getValue(str,['common', 'lanConfig']);
  	} 
	function initEvent(){
		$('#save').click(function(){
			$(this).blur();
			var Serialize = require('Serialize');
			var queryArrs = Serialize.getQueryArrs($('#2'));
			var keys = [
				['isOpen', 'hotelEnable']
			];
			queryArrs = Serialize.changeKeyInQueryArrs(queryArrs, keys);
			var queryStr = Serialize.queryArrsToStr(queryArrs);
			/******************************************************************/
			//判断是否有错误的提示框，如果有错误的提示框，则不进行post操作
			/******************************************************************/
			var tips = require('Tips');
			var InputGroup = require('InputGroup');
			var len = InputGroup.checkErr($('#2'));
			if(len > 0)
			{
	//			tips.showError('{NoSave}');
				return;
			}

			/******************************************************************/
			/******************************************************************/	
			var insertFlag = true;	
			var oldQueryStr='mac='+DATA["mac"]+'&'+'mode='+DATA["mode"]+'&'+'hotelEnable='+DATA["isOpen"];
			var oldJson=Serialize.queryStrsToJson(oldQueryStr);
			var newJson=Serialize.queryStrsToJson(queryStr);

			newJson.mac=newJson.mac.replace(/\:/g,''); 
			newJson.mac=newJson.mac.replace(/-/g,'');

			if(oldJson.hotelEnable!='undefined'){
				if(oldJson.mac==newJson.mac&&oldJson.mode==newJson.mode&&oldJson.hotelEnable==newJson.hotelEnable){
					tips.showSuccess('{saveSuccess}');
					display($('#2'));
					return;
				}
			}else{
				if(oldJson.mac==newJson.mac&&oldJson.mode==newJson.mode){
					tips.showSuccess('{saveSuccess}');
					display($('#2'));
					return;
				}
			}
			if(DATA["hotelPnp"] == 1){
				$.ajax({
					url : '/goform/formHotel',
					type: 'POST',
					data: queryStr,
					success: function(result){
						var doEval = require('Eval');
						var codeStr = result,
						variableArr = ['status'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
						if(isSuccess){
							var data = result["data"],
								status = data["status"];
							if(status){
								tips.showSuccess('{saveSuccess}');
								;
							}else{
								tips.showError('{saveFail}');
							 	insertFlag = false;
							}
						}
					}
				});
			}
			var serialize = require('Serialize');
			$.ajax({
				url : 'common.asp?optType=lanSet',
				type: 'GET',
				success: function(result){
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['lanIpName', 'lanIp', 'lanNetmask',
						 			   'lanIp2Name', 'lanIp2', 'lanNetmask2',
						 			   'lanIp3Name', 'lanIp3', 'lanNetmask3',
						 			   'lanIp4Name', 'lanIp4', 'lanNetmask4',
						 			   'lanMac', 'lanMode'];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					
					if(isSuccess){
						var data = result["data"];
						// 将返回的JS代码执行所生成的变量进行复制
						var lanIpName = data["lanIpName"];
					 	var lanIp    = data["lanIp"];
					 	var lanNetmask    = data["lanNetmask"];
					 	var lanIp2Name = data["lanIp2Name"];
					 	var lanIp2    = data["lanIp2"];
					 	var lanNetmask2    = data["lanNetmask2"];
					 	var lanIp3Name = data["lanIp3Name"];
					 	var lanIp3    = data["lanIp3"];
					 	var lanNetmask3    = data["lanNetmask3"];
					 	var lanIp4Name = data["lanIp4Name"];
					 	var lanIp4    = data["lanIp4"];
					 	var lanNetmask4 = data["lanNetmask4"];
					 	//var lanMac  = data["lanMac"];
					 	var lanMode = data["lanMode"];
					 	DATA.mode=lanMode;
						var queryArrs = serialize.getQueryArrs($('#2'));
						var queryJson = serialize.queryArrsToJson(queryArrs);
						var lanMac1 = queryJson["mac"];
						lanMac1=lanMac1.replace(/\:/g,''); 
						lanMac1=lanMac1.replace(/-/g,'');
						var LanMode1 = queryJson["mode"];
					 	console.log(lanIpName);
					 	console.log(lanIp);
						var str = '';
			    		var lanIpQuery = serialize.queryArrsToStr([
			    			['lanIp', lanIp],
			    			['lanNetmask', lanNetmask],
			    			['lanIpName', lanIpName],
			    			['lanIp2', lanIp2],
			    			['lanNetmask2', lanNetmask2],
			    			['lanIp2Name', lanIp2Name],
			    			['lanIp3', lanIp3],
			    			['lanNetmask3', lanNetmask3],
			    			['lanIp3Name', lanIp3Name],
			    			['lanIp4', lanIp4],
			    			['lanNetmask4', lanNetmask4],
			    			['lanIp4Name', lanIp4Name],
			    			['lanMac', lanMac1],
			    			['LanMode', LanMode1]
			    			]);
			    			
				    		if(insertFlag == false){
				    			tips.showError('{plugAndPlayFail}');
				    			return;
				    		}	
				    		var tmpStrJson=serialize.queryStrsToJson(lanIpQuery);
				    		if(DATA["mac"]==tmpStrJson.mac){
				    			
				    			tips.showSuccess('{saveSuccess}');
				    			return;
				    		}
				    		lanIpQuery=lanIpQuery+'&lanSet=true';
				    		
				    		$.ajax({
				    			url : '/goform/ConfigLANConfig',
				    			type : 'POST',
				    			data : lanIpQuery,
				    			success: function(result){
				    				var doEval = require('Eval');
									var codeStr = result,
										variableArr = ['status', 'errorstr'],
										result = doEval.doEval(codeStr, variableArr),
										isSuccess = result["isSuccessful"];
									// 判断代码字符串执行是否成功
									if(isSuccess){
										var data = result["data"],
											status = data["status"];
										if(status == 1){
											tips.showSuccess('{saveSuccess}');
											display($('#2'));
											// setTimeout(function(){
											// 	location.href="http://"+ location.hostname+"/noAuth/login.html#/network_config/LAN_config"
											// },1000);
										}else{
											tips.showError('{saveFail}');
										}
									}else{
										tips.showError('{parseStrErr}');
									}
				    			}
				    		});
					}else{

					}
				}
			});
			
		})	
	}
	function show($container, mac, isOpen){
		var InputGroup = require('InputGroup');
		var arr = [
			['3', tl('Auto')],
			['4', tl('HD10M')],
			['0', tl('FD10M')],
			['5', tl('HD100M')],
			['1', tl('FD100M')],
			['2', tl('FD1000M')]	
		];
		var modeInputJson = [];
		arr.forEach(function(item, index){
			var obj = {
				"value" : item[0],
				"name"  : item[1],
			};
			modeInputJson.push(obj);
		});

		var hotelDis=false;
		if(DATA["hotelPnp"] == 1){
			hotelDis=true;
		}
		var inputList = [
			{
				"prevWord": '{mac}',
				"inputData": {
					"type": 'text',
					"name": 'mac',
					"value": mac,
					"checkFuncs" : ['checkMac']
				},
				"afterWord": ''
			},
			{
				"prevWord" : '{ifMode}',
				"inputData" : {
					"type" : 'select',
					"name" : 'mode',
					"defaultValue":DATA.mode,
					"items" : modeInputJson
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{jichajiyong}',
				"display" : hotelDis,
				"inputData" : {
					"type" : 'radio',
					"name" : 'isOpen',
					"defaultValue": isOpen,
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			}
		];
		var $inputGroup = InputGroup.getDom(inputList);
		var btnList = [
			{"id" : 'save', "name" : '{save}'}
		];
		var BtnGroup = require('BtnGroup');
		var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.empty().append($inputGroup, btnHTML);	

		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);

		initEvent();
	}
	function display($container) {
		// 加载路径导航模板模块
		var dics = ['common', 'lanConfig'];  
		var Translate = require('Translate'); 
		Translate.preLoadDics(dics, function(){ 
			/*********************************/
			$.ajax({
				url : 'common.asp?optType=lanSet',
				type: 'GET',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['lanMac', 'lanModes','lanMode', 'hotelPnpEn','hotelPnp'];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							mac = data['lanMac'],
							mode = data["lanMode"],
							isOpen = data["hotelPnpEn"],
							hotelPnp = data["hotelPnp"];

							DATA["mac"]=mac;
							DATA["mode"]=mode;
							DATA["isOpen"]=isOpen,
							DATA["hotelPnp"]=hotelPnp;

						show($('#2'), mac, isOpen)
					}else{
						tips.showError('{parseStrErr}');
					}
				}
			});
			/*********************************/
			});
	};
	module.exports = {
		display: display
	};
})
