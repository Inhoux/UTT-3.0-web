define(function(require, exports, module){
	require('../../../libs/js/jquery-2.1.1.min.js');
	exports.display = function(){
		var Path = require('../../../plugin/Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '系统监控',
	  		"links"     : [
	  			{"link" : '#/system_watcher/traffic_watcher', "title" : '流量监控'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				
			var Tabs = require('../../../plugin/Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" : "流量监控"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				require.async('./displayTrafficWatcher', function(obj){		
					obj.display($('#1'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
});