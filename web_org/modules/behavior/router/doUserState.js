define(function(require, exports, module){
	require('jquery-2.1.1.min.js');
	var Translate = require('Translate');
	exports.display = function(){
	    var dics = ['common', 'doPeopleOrganize'];
	    Translate.preLoadDics(dics, function() {
		var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '用户管理',
	  		"links"     : [
	  			{"link" : '#/user_management/user_state', "title" : '用户状态'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : "用户状态"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
//				Path.changePath($(this).text());
				require.async('./displayUserState', function(obj){		
					obj.display($('#1'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	    });
	}
})
