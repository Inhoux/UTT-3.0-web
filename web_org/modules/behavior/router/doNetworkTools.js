define(function(require, exports, module){
	function tl(str){
		return require('Translate').getValue(str,['doNetworkTools','common']);
	}
	exports.display = function(){
		var Path = require('Path');
			// 加载路径导航

			var Translate = require('Translate'); 
		 	var dicNames = ['common', 'doNetworkTools']; 
		 	Translate.preLoadDics(dicNames, function(){ 	
			var pathList = 
			{
	  		"prevTitle" : tl('sysConfig'),
	  		"links"     : [
	  			{"link" : '#/system_config/network_tools', "title" : tl('netTool')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : "Ping"},
				{"id" : "2", "title" : "TraceRoute"},
			//	{"id" : "3", "title" : tl('dataEnvelopmentAnalysis')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayPing', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayTraceRoute', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayDataCheck', function(obj){		
					obj.display($('#3'));
				});
			});
		    $('a[href="#1"]').trigger('click');
		    });
	}
})
