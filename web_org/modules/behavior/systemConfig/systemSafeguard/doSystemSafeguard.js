define(function(require, exports, module){
	require('../../../libs/js/jquery-2.1.1.min.js');
	exports.display = function(){
		var Path = require('../../../plugin/Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '系统配置',
	  		"links"     : [
	  			{"link" : '#/system_config/system_safeguard', "title" : '系统维护'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('../../../plugin/Tabs');
			var tabsList = [
				{"id" : "1", "title" : "服务管理"},
				{"id" : "2", "title" : "系统升级"},
				{"id" : "3", "title" : "配置管理"},
				{"id" : "4", "title" : "产品授权"},
				{"id" : "5", "title" : "重启设备"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayServerManagement', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displaySystemUpdate', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayConfigManagement', function(obj){		
					obj.display($('#3'));
				});
			});
			$('a[href="#4"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayProductLicensing', function(obj){		
					obj.display($('#4'));
				});
			});
			$('a[href="#5"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayRestartEq', function(obj){		
					obj.display($('#5'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})