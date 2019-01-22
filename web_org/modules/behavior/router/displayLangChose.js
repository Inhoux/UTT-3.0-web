define(function(require, exports, module){
	var DATA={};
	function initEvent(){
		$('#save').click(function(){
			var tips = require('Tips');
			var Serialize = require('Serialize');
			var queryArrs = Serialize.getQueryArrs($('#5'));
			var lang      = Serialize.getValue(queryArrs, 'langSelection');

			var querystr = Serialize.queryArrsToStr(queryArrs);
			// alert(querystr);
     
			$.ajax({
				url: '/goform/setSysLang',
				type: 'POST',
				data:querystr,
				success: function(result) {
					//处理数据
				var res = require('Eval').doEval(result,['status']);
				var isSuccess = res["isSuccessful"];
					if (isSuccess) {
					  var data = res["data"];
					  var isSuccessful = data["status"];
					  // 判断修改是否成功
						  if (isSuccessful) {
						  		tips.showSuccess('{saveSuccess}');
						  		var Dispatcher = require('Dispatcher');
						  		Dispatcher.reload(2);
						  } else {
						    var errMsg = result["errorstr"];
						    tips.showWarning('{parseStrErr}');
						  }
					} else {
					  tips.showError('{parseStrErr}');
					}
				}
			});
		})	
	}
	function showWidget($container, langArr, lang){
		var InputGroup = require('InputGroup');
//		var arr = [
//			['zhcn', '{zhcn}'],
//			['en', '{enlish}']	
//		];		
		var arr = [];
		langArr.forEach(function(langobj){
			arr.push([langobj,(langobj=='en'?'{enlish}':"{"+langobj+"}")]);
		})
		var modeInputJson = [];
		arr.forEach(function(item, index){
			var obj = {
				"value" : item[0],
				"name"  : item[1]
			};
			modeInputJson.push(obj);
		});		
		var inputList = [
			{
				"prevWord" : '{langSelection}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'langSelection',
					"defaultValue": lang,
					"items" : modeInputJson
				}
			}   		    	    			
		];
		var $inputGroup = InputGroup.getDom(inputList);
		var btnList = [
			{"id" : 'save', "name" : '{save}'},
			// {"id" : 'back', "name" : '{back}'},
		];
		var BtnGroup = require('BtnGroup');
		var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.append($inputGroup, btnHTML);

		var Translate  = require('Translate');
		var tranDomArr = [$inputGroup, btnHTML];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);

		initEvent();
	}
	function display($container) {	
		$container.empty();
		// 加载路径导航模板模块

		var Translate = require('Translate'); 
		var dicNames = ['common','lanConfig']; 
		Translate.preLoadDics(dicNames, function(){
			$.ajax({
				url : 'common.asp?optType=lang',
				type: 'GET',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['langArr',
										 'lang'
									  ];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							langArr = data['langArr'],
							lang = data['lang'];
							DATA["oldLang"]=lang;
						showWidget($('#5'), langArr, lang);
					}else{
						alert('{fail}');
					}
				}
			})
		});	
	};
	module.exports = {
		display: display
	};	
})