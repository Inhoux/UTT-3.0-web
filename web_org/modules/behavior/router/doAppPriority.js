define(function(require, exports, module){
	require('jquery');
	exports.display = function(){

	    var dics = ['common','doBehaviorManagement','doTrafficManagement','doTimePlan']; 
	    var Translate = require('Translate'); 
	    Translate.preLoadDics(dics, function(){
		var Path = require('Path');
		// 加载路径导航
		var pathList = 
		{
		    "prevTitle" : '流量管理',
		    "links"     : [
		    {"link" : '#/traffic_management/app_priority', "title" : '应用优先'}
		    ],
		    "currentTitle" : ''
		};
		Path.displayPath(pathList);
		// 加载标签页
		var Tabs = require('Tabs');
		var tabsList = [
		{"id" : "1", "title" : "应用优先"}
		];
		// 生成标签页，并放入页面中
		Tabs.displayTabs(tabsList);
		$('a[href="#1"]').click(function(event) {
		    //				Path.changePath($(this).text());
		    require.async('./displayAppPriority', function(obj){		
			obj.display($('#1'));
		    });
		});
		$('a[href="#1"]').trigger('click');
	    });
	}
});
