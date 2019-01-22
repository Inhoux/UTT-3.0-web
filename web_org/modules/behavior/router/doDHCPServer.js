define(function(require, exports, module){		
	function tl(str){
		return require('Translate').getValue(str,['doDhcpServer','common']);
	}	
	exports.display = function(){	
		var Path = require('Path');
		var Translate = require('Translate'); 
		var dicNames = ['doDhcpServer','common']; 
	 	Translate.preLoadDics(dicNames, function(){ 			
			var pathList = 
			{
	  		"prevTitle" : tl('netConfig'),
	  		"links"     : [
	  			{"link" : '#/network_config/DHCP_server', "title" : tl('dhcpServe')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [
				{"id" : "1", "title" : tl('dhcpServeConfig')},
				{"id" : "2", "title" : tl('staticDhcp')},
				{"id" : "3", "title" : tl('dhcpClientList')},
				{"id" : "4", "title" : tl('dhcpAllSet')}
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
			$('a[href="#3"]').attr('refreshTime','0').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayDHCPClientList', function(obj){		
					obj.display($('#3'));
				});
			});
			$('a[href="#4"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayDHCPSetting', function(obj){		
					obj.display($('#4'));
				});
			});			
		    $('a[href="#1"]').trigger('click');
		});
	}
})