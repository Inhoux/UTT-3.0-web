define(function(require, exports, module){
	require('jquery');
	var config = require('P_config/config');
	var DATA = {};
	var Translate  = require('Translate');
	var dicArr     = ['common','doPPTPL2TP'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	exports.display = function(){
		
		var dics = ['doPPTPL2TP']; 
		var Translate = require('Translate'); 
		Translate.preLoadDics(dics, function(){
				var Path = require('Path');
				var title='PPTP';
				var type=3;
				if(config['PPTPClientList']&&config['L2TPList']){
					title='PPTP/L2TP';
					type=3;
				}else if(config['PPTPClientList']){
					title='PPTP';
					type=1;
				}else{
					title='L2TP';
					type=2;
				}
				// 加载路径导航
				var pathList = 
				{
		  		"prevTitle" : T('VPNConfig'),
		  		"links"     : [
		  			{"link" : '#/VPN/PPTP/L2TP', "title" : title}
		  		],
		  		"currentTitle" : ''
				};
					Path.displayPath(pathList);
				// 加载标签页
				var Tabs = require('Tabs');
				var tabsList = [
					{"id" : "1", "title" : T("TuneList")}
					
				];
				var PPTPglobalSet={"id" : "2", "title" : T('PPTPglobalSet')};
				var L2TPglobalSet={"id" : "3", "title" : T('L2TPglobalSet')};
				
				if(config['PPTPClientList']){
					tabsList.push(PPTPglobalSet);
				}
				if(config['L2TPList']){
					tabsList.push(L2TPglobalSet)
				}
				// 生成标签页，并放入页面中
				Tabs.displayTabs(tabsList);
				$('a[href="#1"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayPPTPL2TP.js', function(obj){		
						obj.display($('#1'));
					});
				});
				$('a[href="#2"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayPPTPSetting', function(obj){	

						obj.display($('#2'));
					});
				});
				$('a[href="#3"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayL2TPSetting', function(obj){		
						obj.display($('#3'));
					});
				});
			
		$('a[href="#1"]').trigger('click');
	});
}
})