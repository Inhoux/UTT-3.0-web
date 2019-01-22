define(function(require, exports, module) {
	var DATA={};
	function processData(jsStr) {
		console.log(jsStr)
		// 加载Eval模块
		var doEval 		= require('Eval');
		var codeStr 	= jsStr,
			variableArr = [
						"HttpEnables",
						"OutPorts",
						"Profiles"
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
					"defaultValue" : (data.HttpEnables=='1')?'1':'0',
					"type"		   : 'radio',
					"name"		   : 'HttpEnable',
					"items" :[{
						"value"		: '1',
						"name"  	: '{open}'
					},{
						"value"		:'0',
						"name"		:'{close}'
					}]
				}
			}
			,
			
			{

				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{port}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'OutPort',
			        "value"		 : data.OutPorts,
			         "checkDemoFunc" : ['checkNum',1,65535] //自定义含参方法[方法名，参数一，参数二]
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
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common'];
		Translate.translate(tranDomArr, dicArr);
	}
	function saveClicksubmit(){
		
	// 引入serialize模块
	var Serialize = require('Serialize');
	var Tips = require('Tips');
	var $modal = $('#3');
	if(require('InputGroup').checkErr($modal)>0){
	}else{
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
		console.dir(queryArr)
		$.ajax({
				url: '/goform/formRemoteControl',
				type: 'POST',
				data: 'Profile='+DATA['data'].Profiles+'&'+queryStr,//
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
							
							display($('#3'));
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
			url: 'common.asp?optType=remoteControl',
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
		
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});