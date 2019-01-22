define(function(require, exports, module){
	require('jquery-2.1.1.min.js');
	exports.display = function(){
		var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '用户管理',
	  		"links"     : [
	  			{"link" : '#/user_management/user_authentication', "title" : '用户认证'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : "认证配置"},
				{"id" : "2", "title" : "认证账号"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayAuthConfig', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayAuthAccount', function(obj){		
					obj.display($('#2'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})
