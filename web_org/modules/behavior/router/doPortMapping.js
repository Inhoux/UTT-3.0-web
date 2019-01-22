define(function(require, exports, module){
	require('jquery');
	var Translate  = require('Translate');
	var dicArr     = ['common','doPortMapping'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	exports.display = function(){
		var dics = ['doPortMapping']; 
		var Translate = require('Translate'); 
		Translate.preLoadDics(dics, function(){
		
			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : T('netConfig'),
	  		"links"     : [
	  			{"link" : '#/network_config/port_mapping', "title" : T('portMap')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [

				{"id" : "1", "title" : T("staticMap")},
				{"id" : "2", "title" : T("natRule")},
				{"id" : "3", "title" : T("DMZHost")},
				{"id" : "4", "title" : "UPnP"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayStaticMapping', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayNAT', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayDMZ', function(obj){		
					obj.display($('#3'));
				});
			});
			$('a[href="#4"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayUPnP', function(obj){		
					obj.display($('#4'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	});
}
})