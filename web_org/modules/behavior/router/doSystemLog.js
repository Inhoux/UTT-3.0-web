define(function(require, exports, module){
	function tl(str){
		return require('Translate').getValue(str,['doSyslog','common']);
	}
	exports.display = function(){
		var Path = require('Path');
			// 加载路径导航
			var Translate = require('Translate'); 
		 	var dicNames = ['common', 'doSyslog']; 
		 	Translate.preLoadDics(dicNames, function(){ 			
			var pathList = 
			{
	  		"prevTitle" : tl('sysConfig'),
	  		"links"     : [
	  			{"link" : '#/system_config/system_log', "title" : tl('sysLog')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('sysLog')},
				{"id" : "2", "title" : tl('logServer')},
//				{"id" : "3", "title" : tl('mailMonitor')},
				{"id" : "4", "title" : '日志类型'}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displaySystemLog', function(obj){		
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayLogServers', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayEmailWatcher', function(obj){		
					obj.display($('#3'));
				});
			});
			$('a[href="#4"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displaySystemLogSetting', function(obj){		
					obj.display($('#4'));
				});
			});
		    $('a[href="#1"]').trigger('click');
		    });
	}
})
