define(function(require, exports, module) {
	// 存储本页面一些变量
	var DATA = {};
	// 本模块依赖于 jquery 模块
	require('jquery');

	function addInputGroup($con,isOpen,GlobalDMZIp,WAN1DMZIp,WAN2DMZIp,WAN3DMZIp,WAN4DMZIp,WAN5DMZIp,showCount) {
		// 模态框中输入框组的配置数据
		//var showCount = 2;//显示到第几个
		var wanCount = 5;//有几个wan口
		var displayArr = [];//按顺序是否显示（数组）
		for(var i = 0;i<wanCount;i++){
			if(Number(i)>(Number(showCount)-1)){
				displayArr.push(false);
			}else{
				displayArr.push(true);
			}
		};

		var inputList = [{
			"necessary" : true,
			"prevWord": "{DMZstatus}",
			"inputData": {
				"type": 'radio',
				"name": 'DMZEnable',
				"defaultValue":isOpen ==1?'on':'off',
				"items": [{
					"value": 'on',
					"name": "{open}"
				}, {
					"value": 'off',
					"name": "{close}"

				}, ]
			},
			"afterWord": ''
		}, {
			"display":"false",
			"prevWord": "{globalDMZHost}",
			"inputData": {
				"type": 'text',
				"name": 'GlobalDMZ',
				"value" : GlobalDMZIp,
				"checkFuncs": ['checkNullIP']
			},
			"afterWord": ""
		}, {
			"display":	displayArr[0],
			"prevWord": "{WAN1DMZ}",
			"inputData": {
				"type": 'text',
				"name": 'WAN1DMZ',
				"value" :WAN1DMZIp,
				"checkFuncs": ['checkNullIP']
			},
			"afterWord": ''
		}, {
			"display":	displayArr[1],
			"prevWord": "{WAN2DMZ}",
			"inputData": {
				"type": 'text',
				"name": 'WAN2DMZ',
				"value" :WAN2DMZIp,
				"checkFuncs": ['checkNullIP']
			},
			"afterWord": ''
		}, {
			"display":	displayArr[2],
			"prevWord": "{WAN3DMZ}",
			"inputData": {
				"type": 'text',
				"name": 'WAN3DMZ',
				"value" :WAN3DMZIp,
				"checkFuncs": ['checkNullIP']
			},
			"afterWord": ''
		},{
			"display":	displayArr[3],
			"prevWord": "{WAN4DMZ}",
			"inputData": {
				"type": 'text',
				"name": 'WAN4DMZ',
				"value" :WAN4DMZIp,
				"checkFuncs": ['checkNullIP']
			},
			"afterWord": ''
		},{
			"display":	displayArr[4],
			"prevWord": "{WAN5DMZ}",
			"inputData": {
				"type": 'text',
				"name": 'WAN5DMZ',
				"value" :WAN5DMZIp,
				"checkFuncs": ['checkNullIP']
			},
			"afterWord": ''
		}];
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		$dom.find('[name="GlobalDMZ"]').keyup(function(){
			var t = $(this);
			var vals = t.val();
			$dom.find('[name="WAN1DMZ"],[name="WAN2DMZ"],[name="WAN3DMZ"],[name="WAN4DMZ"],[name="WAN5DMZ"]').val(vals);
		});
		// 将输入框组放入模态框中
		//添加底部保存，重填按钮
		var btnList = [
		{
			"id" : 'save',
			"name" : "{save}",
			"clickFunc":function($this){

				saveClick($con);
			}
		},
		{
			"id" : 'reset',
			"name" : "{reset}",
			"clickFunc":function($this){

			}
		},
		];
		var BtnGroup = require('BtnGroup');
		var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$con.append($dom,btnHTML);
		var Translate = require('Translate');
		Translate.translate([$dom, $(btnHTML)],['common', 'doPortMapping']);
		//绑定按钮
		//initEvent($con);

	}

	function displayDMZSet($container){
		$.ajax({
			url : 'common.asp?optType=DMZ',
			type: 'GET',
			success : function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['GlobalDMZIp', 'DMZEnables','WANcount','WAN1DMZIp','WAN2DMZIp','WAN3DMZIp','WAN4DMZIp','WAN5DMZIp'];
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
				//判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							GlobalDMZIp = data["GlobalDMZIp"],
							showCount = data["WANcount"],
							WAN1DMZIp = data["WAN1DMZIp"],
							WAN2DMZIp = data["WAN2DMZIp"],
							WAN3DMZIp = data["WAN3DMZIp"],
							WAN4DMZIp = data["WAN4DMZIp"],
							WAN5DMZIp = data["WAN5DMZIp"],
							isOpen = data["DMZEnables"];
							console.log(isOpen);
						addInputGroup($('#3'),isOpen,GlobalDMZIp,WAN1DMZIp,WAN2DMZIp,WAN3DMZIp,WAN4DMZIp,WAN5DMZIp,showCount);
					}else{
						alert('失败');
					}
			}
		});
	}


	function saveClick($con){

			var Serialize = require('Serialize');
			var queryArrs = Serialize.getQueryArrs($con);
			var Tips = require('Tips');

			var InputGroup = require('InputGroup');
			var len = InputGroup.checkErr($con);
			if(len > 0){
			    return;
			}

			//console.dir(queryArrs);
/*
			var isOpen = $con.find('input[name="DMZEnable"]:checked').attr('value');
			var	GlobalDMZ = $con.find('input[name="GlobalDMZ"]').val();
			var	WAN1DMZ = $con.find('input[name="WAN1DMZ"]').val();
			var	WAN2DMZ = $con.find('input[name="WAN2DMZ"]').val();
			var	WAN3DMZ = $con.find('input[name="WAN3DMZ"]').val();
			var	WAN4DMZ = $con.find('input[name="WAN4DMZ"]').val();
*/
			var keys = [
				['isOpen','DMZEnable'],
				['GlobalDMZ','GlobalDMZIp'],
				['WAN1DMZ','WAN1DMZIp'],
				['WAN2DMZ','WAN2DMZIp'],
				['WAN3DMZ','WAN3DMZIp'],
				['WAN4DMZ','WAN4DMZIp'],
				['WAN5DMZ','WAN5DMZIp']
			];
			var newArrs =  Serialize.changeKeyInQueryArrs(queryArrs, keys);

			var newJson = Serialize.queryArrsToJson(newArrs);
			if(newJson.DMZEnable == "on")
			{
				if(newJson.GlobalDMZIp == "" && newJson.WAN1DMZIp == "" && newJson.WAN2DMZIp == "" && newJson.WAN3DMZIp == "" && newJson.WAN4DMZIp == "" && newJson.WAN5DMZIp == ""){
					Tips.showWarning('{notAllNull}');

					return;
				}
				if(newJson.GlobalDMZIp == "0.0.0.0" && newJson.WAN1DMZIp == "0.0.0.0" && newJson.WAN2DMZIp == "0.0.0.0" && newJson.WAN3DMZIp == "0.0.0.0" && newJson.WAN4DMZIp == "0.0.0.0" && newJson.WAN5DMZIp == "0.0.0.0"){
					Tips.showWarning('{notAllZero}');

					return;
				}
			}

			var queryStr = Serialize.queryJsonToStr(newJson);


			$.ajax({
				url : '/goform/formDMZIP',
				type: 'POST',
				data: queryStr,
				success: function(result){
					console.log(result);
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status','isSuccessful','errMsg'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];

					// 判断代码字符串执行是否成功

					if(isSuccess){
						var data = result["data"],
							status = data["status"];
						if(status == 1){
							Tips.showSuccess('{saveSuccess}', 2);
						}else{
							Tips.showWarning(data["errMsg"], 2);
						}
					}else {
							Tips.showWarning('{netErr}', 2);
					}
				}
			});


	}





	function display($container) {
		// 清空标签页容器
		$('#checkOn').remove();
		$('.nav .u-onoff-span1').remove();
		$container.empty();
		displayDMZSet($container);

	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
