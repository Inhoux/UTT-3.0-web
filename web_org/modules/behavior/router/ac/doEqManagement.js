define(function(require, exports, module){
	require('jquery');
	function tl(str){
	    return require('Translate').getValue(str, ['common','doEqMgmt']);
	}
	exports.display = function(){
			var Path = require('P_plugin/Path');
			var Translate = require('Translate'); 
		 	var dicNames = ['common', 'doEqMgmt','lanConfig','doRouterConfig','doNetName']; 
		 	Translate.preLoadDics(dicNames, function(){
				// 加载路径导航
				var pathList = 
				{
		  		"prevTitle" : tl('wirelessExtensions'),
		  		"links"     : [
		  			{"link" : '#/wifi_config/equipment_management', "title" : tl('deviceMgmt')}
		  		],
		  		"currentTitle" : ''
				};
					Path.displayPath(pathList);
					var Tabs = require('P_plugin/Tabs');
				// 加载标签页
				var tabsList = [
					{"id" : "1", "title" : tl('deviceMgmt')},
					{"id" : "2", "title" : tl('bakupConfig')},
					{"id" : "3", "title" : '拓扑图'}
				];
				// 生成标签页，并放入页面中
				Tabs.displayTabs(tabsList);
				$('a[href="#1"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayEqManagement', function(obj){		
						obj.display($('#1'));
					});
				});
				$('a[href="#2"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayConfigBackup', function(obj){		
						obj.display($('#2'));
					});
				});
				$('a[href="#3"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayTopology', function(obj){		
						obj.display($('#3'));
					});
				});
			    $('a[href="#1"]').trigger('click');
			});
	}
})
