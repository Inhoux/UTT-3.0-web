define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
		var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : 'VPN配置',
	  		"links"     : [
	  			{"link" : '#/VPN/IPSec', "title" : 'IPSec'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : "编辑IPSec"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayIPSecEdit', function(obj){		
					obj.display($('#1'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})