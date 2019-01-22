define(function(require, exports, module){
	require('../../../libs/js/jquery-2.1.1.min.js');
	exports.display = function(){
		var Path = require('../../../plugin/Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '系统配置',
	  		"links"     : [
	  			{"link" : '#/system_config/network_management_strategy', "title" : '网络策略'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('../../../plugin/Tabs');
			var tabsList = [
				{"id" : "1", "title" : "系统管理员"},
				{"id" : "2", "title" : "内网访问控制"},
				{"id" : "3", "title" : "远程管理"},
				{"id" : "4", "title" : "网管访问策略"},
				{"id" : "5", "title" : "语言选择"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displaySystemAdmin', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayInsetNetworkVisitControl', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayRemoteManagement', function(obj){		
					obj.display($('#3'));
				});
			});
			$('a[href="#4"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayNetworkManagementVisitControl', function(obj){		
					obj.display($('#4'));
				});
			});
			$('a[href="#5"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayLanguage', function(obj){		
					obj.display($('#5'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})