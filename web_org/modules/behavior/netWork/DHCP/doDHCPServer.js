define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '网络配置',
	  		"links"     : [
	  			{"link" : '#/network_config/DHCP_server', "title" : 'DHCP服务'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" : "DHCP服务配置"},
				{"id" : "2", "title" : "静态DHCP"},
				{"id" : "3", "title" : "DHCP客户端列表"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayDHCPServerConfig', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayStaticDHCP', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayDHCPClientList', function(obj){		
					obj.display($('#3'));
				});
			});
		    $('a[href="#1"]').trigger('click');
	}
})