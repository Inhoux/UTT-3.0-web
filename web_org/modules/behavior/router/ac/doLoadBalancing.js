define(function(require, exports, module){
	require('jquery');
	var Translate = require('Translate');
	var dics = ['common', 'doStaticGroup'];
	function T(v){
		return Translate.getValue(v,dics);
	}
	exports.display = function(){
		Translate.preLoadDics(dics, function() {
			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" :  T('Wireless_extensions'),
	  		"links"     : [
	  			{"link" : '#/wifi_config/load_balancing', "title" : T('loadBalancing')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" : T('loadBalancing')}
//				{"id" : "2", "title" : "动态负载均衡组"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
//				Path.changePath($(this).text());
				require.async('./displayStaticGroup', function(obj){		
					obj.display($('#1'));
				});
			});
//			$('a[href="#2"]').click(function(event) {
//				Path.changePath($(this).text());
//				require.async('./displayDynamicGroup', function(obj){		
//					obj.display($('#1'));
//				});
//			});
		    $('a[href="#1"]').trigger('click');
		   })
	}
})