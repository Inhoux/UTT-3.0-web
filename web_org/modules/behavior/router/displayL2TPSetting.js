define(function(require, exports, module) {
	var DATA={};
	function processData(jsStr) {
		console.log(jsStr)
		// 加载Eval模块
		var doEval 		= require('Eval');
		var codeStr 	= jsStr,
			variableArr = [
						"enables",
						"authTypes",
						"poolIpStarts",
						"poolIpCnts",
						"localIps",
						"priDns",
						"secDns",
						"maxPoolCnt"
						];
		
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];

			console.dir(result);
		if (isSuccess) {
			var data = result["data"];
			return data;
		} else {
			console.log('字符串解析失败')
		}
	}
	function displayEditPage($container){
	
		var data=DATA['data'];
		
		var inputList = [
			{
				"display"	:true,
				"prevWord"	:"{status}",
				"inputData" :{
					"defaultValue" : data.enables=='0'?'DISABLE':'ENABLE',
					"type"		   : 'radio',
					"name"		   : 'enable',
					"items" :[{
						"value"		: 'ENABLE',
						"name"  	: '{open}'
					},{
						"value"		:'DISABLE',
						"name"		:'{close}'
					}]
				}
			},
			{   
					"display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{AuthType}',
			        "inputData": {
			            "defaultValue" : data.authTypes, //默认值对应的value值
			            "type": 'select',
			            "name": 'authType',
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
			                  },
			            ]
			        }
			},
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{poolStart}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'poolStart',
			        "value"		 : data.poolIpStarts,
			        "checkFuncs" : ['checkIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{poolCount}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'poolCount',
			        "value"		 : data.poolIpCnts,
			        "checkDemoFunc" : ['checkNum','1',data.maxPoolCnt] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{serverIP}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'localIp',
			        "value"		 : data.localIps,
			        "checkFuncs" : ['checkIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{mainDNS}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'priDns',
			        "value"		 : data.priDns,
			         "checkFuncs" : ['checkMainDns'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{

				"display" : true,  //是否显示：否
				"necessary": false,  
			    "prevWord": '{secDNS}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'secDns',
			        "value"		 : data.secDns,
			        "checkFuncs" : ['checkNullIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

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
		$container.empty().append($inputs,$btnGroup);

	}
	function saveClicksubmit(){
		
	// 引入serialize模块
	var Serialize = require('Serialize');
	var Tips = require('Tips');
	var $modal = $('#3');
	if (require('InputGroup').checkErr($modal)>0){
			return;
		}
	// 将模态框中的输入转化为url字符串
	var queryArr = Serialize.getQueryArrs($modal),
		queryJson = Serialize.queryArrsToJson(queryArr),
		queryStr = Serialize.queryArrsToStr(queryArr);
	console.dir(queryArr)
	$.ajax({
			url: '/goform/l2tpSrvGlobalConfig',
			type: 'POST',
			data: 'Action=add&'+queryStr,
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
						Tips.showSuccess('{saveSuccess}', 2);
						
						$('a[href="#1"]').trigger('click');
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
	
	function getdata($container){
		$.ajax({
			url: 'common.asp?optType=L2TPSetting',
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
