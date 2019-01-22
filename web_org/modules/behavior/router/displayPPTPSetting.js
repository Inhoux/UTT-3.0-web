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
						"EncryptionModes",
						"maxPoolCnt",
						"mtu"
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
		console.log('hah');
		console.dir(data);
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
				"display"	:true,
				"prevWord"	:"{tunEncrypt}",
				"inputData" :{
					"defaultValue" : data.EncryptionModes,
					"type"		   : 'radio',
					"name"		   : 'EncryptionMode',
					"items" :[{
						"value"		: 'MPPE',
						"name"  	: '{open}'
					},{
						"value"		:'None',
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
				"necessary": false,  //是否添加红色星标：是
			    "prevWord": '{secDNS}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'secDns',
			        "value"		 : data.secDns,
			        "checkFuncs" : ['checkNullIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
		    {
		      "display" : true,  //是否显示：否
		        "necessary": true,  //是否添加红色星标：是
		        "prevWord": 'MTU',
		        "inputData": {
		            "type": 'text',
		            "name": 'MTU',
		            "value":data.mtu,
		            "checkDemoFunc" : ['checkNum','1','1492']  
		        },
		        "afterWord":"{varRange}(1-1492）"

		    }
		   
		];
		var inputLists = inputList;
		var InputGroup = require('InputGroup');
		var $inputs = InputGroup.getDom(inputLists);

		//添加交互
		$inputs.find('[name="EncryptionMode"]').click(function(){
			makeTheEncryptionModeChange();
		});
		makeTheEncryptionModeChange();
		function makeTheEncryptionModeChange(){
			var thisval = $inputs.find('[name="EncryptionMode"]:checked').val();
			if(thisval == 'MPPE'){
				$inputs.find('[name="authType"]').val('MS-CHAPV2').attr('disabled','disabled');
			}else{
				$inputs.find('[name="authType"]').removeAttr('disabled');
			}
		}

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
		
	var Serialize = require('Serialize');
	var Tips = require('Tips');
	var $modal = $('#2');
	
	if (require('InputGroup').checkErr($modal)>0){
			return;
		}
	// 将模态框中的输入转化为url字符串
	var queryArr = Serialize.getQueryArrs($modal),
		queryJson = Serialize.queryArrsToJson(queryArr),
		queryStr = Serialize.queryArrsToStr(queryArr);
	console.dir(queryArr)
	$.ajax({
			url: '/goform/pptpSrvGlobalConfig',
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
			url: 'common.asp?optType=PPTPSetting',
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
