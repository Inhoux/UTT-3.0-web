define(function(require, exports, module){
	var DATA={};
	function initEvent(){
		tips=require('Tips');
		$('#save').click(function(){
			var Serialize = require('Serialize');
			var queryArrs = Serialize.getQueryArrs($('#4'));
			var queryStr = Serialize.queryArrsToStr(queryArrs);
			$.ajax({
				url : '/goform/formDnsAgency',
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
							display($("#4"));
						}else{
							tips.showError('{saveFail}');
						}
					}
				}
			});		
			if(DATA["dnsmsq"] == 1){
				$.ajax({
					url : '/goform/formDhcpAutoBindConfig',
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
								tips.showSuccess('{saveSuccess}', 2.5);
								;
							}else{
								tips.showError('{saveFail}',3);
							}
						}
					}
				});	
			}	
	
		})	
	}
	function showframe($container, DhcpNewAutobind, DhcpDelAutobind,dnspEnbls,dnsmsq){
		var InputGroup = require('InputGroup');
		console.log(DhcpNewAutobind);
		console.log(DhcpDelAutobind);
		console.log(dnspEnbls);
		var zdbd = 'off';
		var zdsc = 'off';
		var dnsdl = 'off';
		if(DhcpNewAutobind == '1')
			zdbd='on';
		if(DhcpDelAutobind == '1')
			zdsc='on';		
		if(dnspEnbls == 'Enable')
			dnsdl='on';		
		var bdDis=false;
		if(dnsmsq == 1){
			bdDis=true;
		}
		var inputList = [
			{
				"prevWord" : '{dhcpAutoBind}',
				"display" : bdDis,
				"inputData" : {
					"type" : 'radio',
					"name" : 'chkDhcpNewAutobind',
					"defaultValue": zdbd,
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
							//"isChecked" : kaiqi,
						},
						{
							"value" : 'off',
							"name" : '{close}',
							//"isChecked" : guanbi,
						}
					]
				},
				"afterword" : ''
			},	
			{
				"display" : bdDis,
				"prevWord" : '{dhcpAutoDel}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'chkDhcpDelAutobind',
					"defaultValue": zdsc,
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
							//"isChecked" : kaiqi,
						},
						{
							"value" : 'off',
							"name" : '{close}',
							//"isChecked" : guanbi,
						}
					]
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{dnsProxy}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'dnspEnblw',
					"defaultValue": dnsdl,
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
			{"id" : 'save', "name" : '{save}'},
			// {"id" : 'reset', "name" : '重填'},
			// {"id" : 'back', "name" : '返回'},
		];
		var BtnGroup = require('BtnGroup');
		var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.empty().append($inputGroup, btnHTML);

		var Translate  = require('Translate');
		var tranDomArr = [$inputGroup, btnHTML];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);

		initEvent();
	}
	// exports.display = function(){
	function display($container) {	
		var Translate = require('Translate'); 
		var dicNames = ['common', 'lanConfig', 'doDhcpServer']; 
		Translate.preLoadDics(dicNames, function(){ 
			$.ajax({
				url : 'common.asp?optType=dhcpSet',
				type: 'GET',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['dnspEnbls','DhcpNewAutobind', 'DhcpDelAutobind', 'dnsmsq'];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							DhcpNewAutobind = data['DhcpNewAutobind'],
							DhcpDelAutobind = data['DhcpDelAutobind'],
							dnsmsq = data['dnsmsq'],
							dnspEnbls = data['dnspEnbls'];
						DATA["dnsmsq"] = dnsmsq;	
						showframe($('#4'), DhcpNewAutobind, DhcpDelAutobind,dnspEnbls,dnsmsq)
					}else{
						require('Tips').showWarning('{parseStrErr}');
					}
				}
			})
		});	
	};
	module.exports = {
		display: display
	};
})