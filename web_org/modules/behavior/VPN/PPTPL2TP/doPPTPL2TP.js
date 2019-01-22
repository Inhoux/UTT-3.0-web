define(function(require, exports, module){
	require('../../../libs/js/jquery-2.1.1.min.js');
	exports.display = function(){
		var Path = require('../../../plugin/Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '流量管理',
	  		"links"     : [
	  			{"link" : '#/VPN/PPTP_L2TP', "title" : 'PPTP/L2TP'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('../../../plugin/Tabs');
			var tabsList = [
				{"id" : "1", "title" : "隧道列表"},
				{"id" : "2", "title" : "PPTP全局配置"},
				{"id" : "3", "title" : "L2TP全局配置"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayTunnelList', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayPPTPSetting', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayL2TPSetting', function(obj){		
					obj.display($('#3'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})