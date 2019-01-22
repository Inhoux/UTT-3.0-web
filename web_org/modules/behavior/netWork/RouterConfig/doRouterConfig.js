define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '网络配置',
	  		"links"     : [
	  			{"link" : '#/network_config/router_config', "title" : '路由配置'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" : "静态路由"},
				{"id" : "2", "title" : "策略路由"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayStaticRouter', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayStrategyRouter', function(obj){		
					obj.display($('#2'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})