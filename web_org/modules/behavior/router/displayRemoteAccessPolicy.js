define(function(require, exports, module) {
	var DATA={};
	function processData(jsStr) {
		console.log(jsStr)
		// 加载Eval模块
		var doEval 		= require('Eval');
		var codeStr 	= jsStr,
			variableArr = [
						"passwdErrNum",
						"sessionLife",
						"loginSpan",
						"httpPort",
						"httpsPort",
						"httpsEnable"
						];
		
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		if (isSuccess) {
			var data = result["data"];
			return data;
		} else {
			console.log('字符串解析失败')
		}
	}
	function displayEditPage($container){
		
		var data = DATA['data'];
		
		var inputList = [
			{
				"display"	:true,
				"prevWord"	:"{netManModel}",
				"inputData" :{
					"defaultValue" : data["httpsEnable"],
					"type"		   : 'radio',
					"name"		   : 'httpsEnable',
					"items" :[{
						"value"		: '1',
						"name"  	: 'HTTP',
						"control"	:'HTTP'
					},{
						"value"		:'2',
						"name"		:'HTTPS',
						"control"	:'HTTPS'
					}]
				}
			}
			,
			{
				"sign": "HTTP",
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{lanWebUIloginPort}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'httpPort',
			        "value"		 : data['httpPort'],
			         "checkDemoFunc" : ['checkNum',1,65535] //自定义含参方法[方法名，参数一，参数二]
			    },
			    "afterWord" : '(1-65535)'
			}
			,
			{
				"sign": "HTTPS",
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{lanWebUIloginPort}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'httpsPort',
			        "value"		 : data['httpsPort'],
			         "checkDemoFunc" : ['checkNum',1,65535] //自定义含参方法[方法名，参数一，参数二]
			    },
			    "afterWord" : '(1-65535)'

			}
		   	,
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{webUILife}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'sessionLife',
			        "value"		 : data['sessionLife'],
			         "checkDemoFunc" : ['checkNum',1,1440] //自定义含参方法[方法名，参数一，参数二]
			    },
			    "afterWord" : '({min}，1-1440)'
			},
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{adminMaxLoginErrNum}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'passwdErrNum',
			        "value"		 : data['passwdErrNum'],
			         "checkDemoFunc" : ['checkNum',3,100] //自定义含参方法[方法名，参数一，参数二]
			    },
			    "afterWord" : '(3-100)'

			},
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{adminLoginSpanTime}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'loginSpan',
			        "value"		 : data['loginSpan'],
			        "checkDemoFunc" : ['checkNum',1,65535] //自定义含参方法[方法名，参数一，参数二]
			    },
			    "afterWord" : '({min})'

			}
		];

		var inputLists = inputList;
		var InputGroup = require('InputGroup');
		var $inputs = InputGroup.getDom(inputLists);
		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		          saveClicksubmit();
		        }
		    },
		    {
		        "id"        : 'reset',
		        "name"      : '{reset}'
		    }
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		var Translate  = require('Translate');
		var tranDomArr = [$inputs,$btnGroup];
		var dicArr     = ['common','doNetworkManagementStrategy'];
		Translate.translate(tranDomArr, dicArr);
		$container.empty().append($inputs,$btnGroup);
		
		
	}
function saveClicksubmit(){
	var Serialize = require('Serialize');
	var Tips = require('Tips');
	var $modal = $('#4');
	var InputGroup=require('InputGroup');
	if (InputGroup.checkErr($modal)>0){
		//Tips.showError("{checkErr}");
	}else{
	// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
		console.dir(queryArr)
		$.ajax({
				url: '/goform/formWebServerConfig',
				type: 'POST',
				data: queryStr,
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
							var wt = Tips.showWaiting('{saving}');
							setTimeout(function(){
								wt.remove();
								location.href="http"+(queryJson.httpsEnable=='1'?'':'s')+"://"+ location.hostname+":"+(queryJson.httpsEnable=='1'?queryJson.httpPort:queryJson.httpsPort)+'/noAuth/login.html';
							},5000);
						} else {
							var errorStr = data['errorstr'];
							Tips.showWarning('{saveFail}' + errorStr, 2);
						}
					} else {
						Tips.showWarning('{netErr}', 2);
					}
				}
		});
	
	}	
}
	
	function getdata($container){
		$.ajax({
			url: 'common.asp?optType=webServerConfig',
			type: 'GET',
			success: function(result) {
					DATA['data'] = processData(result);
					console.dir(DATA);
					displayEditPage($container);
				}
		});
	}	
	function display($container) {
		getdata($container);
		// var Translate  = require('Translate');
		// var tranDomArr = [$container];
		// var dicArr     = ['common','doNetworkManagementStrategy'];
		// Translate.translate(tranDomArr, dicArr);
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
