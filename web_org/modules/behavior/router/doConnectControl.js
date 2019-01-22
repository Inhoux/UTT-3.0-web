define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	function tl(str){
    	return require('Translate').getValue(str,['common','doConnectControl']);
  	}		
	exports.display = function(){
		var Path = require('Path');
		var Translate = require('Translate'); 
		var dicNames = ['common', 'doConnectControl']; 
		Translate.preLoadDics(dicNames, function(){
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : tl('fireWall'),
	  		"links"     : [
	  			{"link" : '#/firewall/connect_control', "title" : tl('connectControl')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('connectControl')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);	    		
			$('a[href="#1"]').click(function(event) {
				displayPage($('#1'));
			});
		    $('a[href="#1"]').trigger('click');
		}); 
	}
	
	//展示链接控制页面
	function displayPage($con){
		//获取数据
		$.ajax({
			url: 'common.asp?optType=connectLimit',
			type: 'GET',
			// data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,		
					returnStr = ['connLimitSw',
								 'totalLimit',
								 'tcpLimit',
								 'udpLimit',
								 'icmpLimit',
								 'maxSess',
								 'errorstr'
								 ],
					result = doEval.doEval(codeStr, returnStr),
					isSuccess = result["isSuccessful"];
					DATA.con=$con;
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					//制作表单
					var $input = getInputDom(data);
					//制作按钮
					var $btn = getBtnDom();
					$con.empty().append($input,$btn);
				    var Translate  = require('Translate');
				    var tranDomArr = [$('body')];
				    var dicArr     = ['common','doConnectControl'];
				    Translate.translate(tranDomArr, dicArr);	
				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});	
	}
	
	//生成输入框组和按钮
	function getInputDom(data){
		var datas = data;
		var inputlist = [
			{
				prevWord :'{connectStat}',
				inputData:{
					type  : 'radio',
					name  :'enable',
					defaultValue : datas.connLimitSw || '',
					items :[
						{name:'{open}',value:'on'},
						{name:'{close}',value:'off'}
					]
				}
			},		
			{
				prevWord :'{connectTotalNum}',
				necessary:true,
				inputData:{
					type  : 'text',
					name  :'totalCnt',
					value : datas.totalLimit || '0',
					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
				},
				"afterWord": '({connectTotalNumTip})'
			},
			{
				prevWord :'{connectTcpNum}',
				necessary:true,
				inputData:{
					type  : 'text',
					name  :'tcp',
					value : datas.tcpLimit || '0',
					"checkDemoFunc" : ['checkNum','0','30000','notnull']
				}
			},
			{
				prevWord :'{connectUDPNum}',
				necessary:true,
				inputData:{
					type  : 'text',
					name  :'udp',
					value : datas.udpLimit || '0',
					"checkDemoFunc" : ['checkNum','0','30000','notnull']
				}
			},
			{
				prevWord :'{connectICMPNum}',
				necessary:true,
				inputData:{
					type  : 'text',
					name  :'icmp',
					value : datas.icmpLimit || '0',
					"checkDemoFunc" : ['checkNum','0','30000','notnull']
				}
			}
		];
		
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
		
		$inputs.find('[name="enable"]').click(function(){
			makeTheDisable();
		});
		makeTheDisable()
		function makeTheDisable(){
			if($inputs.find('[name="enable"]:checked').val() == 'off'){
				$inputs.find('[name="enable"]').parent().parent().nextAll().find('input').attr('disabled','disabled');
			}else{
				$inputs.find('[name="enable"]').parent().parent().nextAll().find('input').removeAttr('disabled');
			}
		}
		
		
		return $inputs;
	}
	
	function getBtnDom(){
		var btnlist = [
			{
				name :'{save}',
				id   :'save',
				clickFunc : function($this){
					//差错
					$this.blur();
					if(require('InputGroup').checkErr($('#1'))>0){
						var Tips=require("Tips");
//						Tips.showError('{NoSave}');
						return false;
					}else{
						saveFunc();
					}
					
				}
			},
			{
				name :'{reset}',
				id   :'reset',
				clickFunc : function($this){
					displayPage($('#1'));
				}
			}
		];
		
		var BG = require('BtnGroup');
		var btns = BG.getDom(btnlist).addClass('u-btn-group');
		return btns;
	}
	
	/**保存事件*/
	function saveFunc(){
		var Tips = require('Tips');
		var Srlz = require('Serialize');
		var strs = Srlz.getQueryStrs($('#1'));
		var json = Srlz.queryStrsToJson(strs);
		//enable=on&totalCnt=0&tcp=1000&udp=800&icmp=100

		if(json.enable=='on')
		{
			if(json.totalCnt!=='0' || json.totalCnt!== 0){
				Number(json.tcp)+Number(json.udp)+Number(json.icmp);
				if(json.totalCnt<Number(json.tcp)||json.totalCnt<Number(json.udp)||json.totalCnt<Number(json.icmp)){
					Tips.showError('{totalCntLessThanAdd}');
					return;
				}
			}
		}
		strs=Srlz.queryJsonToStr(json);

		$.ajax({
			url: '/goform/formConnLimit',
			type: 'POST',
			data: strs,
			success: function(result) {
					var Eval = require('Eval');
					res = Eval.doEval(result, ['status']),
					isSuccess = res["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = res["data"];
					if(data.status == 1){
						Tips.showSuccess('{saveSuccess}');
						displayPage($('#1'));
					}else{
						Tips.showWarning('{saveFail}');
					}
					

				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}
	
});
