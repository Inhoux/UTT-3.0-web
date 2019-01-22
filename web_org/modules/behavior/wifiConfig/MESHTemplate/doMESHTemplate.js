define(function(require, exports, module){
	require('../../../libs/js/jquery-2.1.1.min.js');
	exports.display = function(){
			var Path = require('../../../plugin/Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '无线配置',
	  		"links"     : [
	  			{"link" : '#/wifi_config/MESH_template', "title" : 'MESH模板'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('../../../plugin/Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" : "MESH模板"},
				{"id" : "2", "title" : "MESH白名单"},
				{"id" : "3", "title" : "无线虚连接信息"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayMESHTemplate', function(obj){		
					obj.display($('#1'));
				});
			});$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayMESHWhiteList', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayWifiConnectionInfo', function(obj){		
					obj.display($('#1'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})