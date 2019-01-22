define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
		var dics = ['doPPTPL2TP']; 
		var Translate = require('Translate'); 
		Translate.preLoadDics(dics, function(){ 
			var dicArr     = ['common','doPPTPL2TP'];
			function T(_str){
				return Translate.getValue(_str, dicArr);
			}
			var Path = require('Path');
			// 加载路径导航
			var pathList = {
		  		"prevTitle" : T('VPNConfig'),
		  		"links"     : [
		  			{"link" : '#/VPN/IPSec', "title" : 'IPSec'}
		  		],
		  		"currentTitle" : ''
			};
			Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" :T("TuneList")}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayIPSec', function(obj){		
					obj.display($('#1'));
				});
			});
		    $('a[href="#1"]').trigger('click');
		});
	}
})