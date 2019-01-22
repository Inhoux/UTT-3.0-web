define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
		var Path = require('Path');
		/*
			生成路径导航
		 */
		var pathList = {
  			"prevTitle" : '行为管理',
  			"links"     : [
  				{"link" : '#/behavior_management/behavior_management', "title" : '行为管理'}
  			],
  			"currentTitle" : ''
		};
		Path.displayPath(pathList);
		/*
			生成标签页
		 */
		var Tabs = require('Tabs');
		var tabsList = [
			{"id" : "1", "title" : "行为管理"}
		];
		// 生成标签页，并放入页面中
		Tabs.displayTabs(tabsList);
		$('a[href="#1"]').click(function(event) {
			require.async('./displayBehaviorManagement', function(obj){		
				obj.display($('#1'));
			});
		});
	    $('a[href="#1"]').trigger('click');
	}
})