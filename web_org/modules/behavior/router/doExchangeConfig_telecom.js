define(function(require, exports, module){
	function tl(str){
    	return require('Translate').getValue(str, ['common','doExchangeConfig','doPort']);
  	}
	exports.display = function(){
		// 加载路径导航模板模块
		var Path = require('Path');
		var Translate = require('Translate'); 
		var dicNames = ['common', 'doExchangeConfig', 'doPort']; 
		Translate.preLoadDics(dicNames, function(){ 

		// 路径导航配置数据
		var pathList = {
	  		"prevTitle" : tl('netConfig'),
	  		"links"     : [
	  			{"link" : '#/network_config/exchange_config', "title" : ""}
	  		],
	  		"currentTitle" : ''
		};
		Path.displayPath(pathList);
		// 加载标签页模板模块
		var Tabs = require('Tabs');
		// 标签页配置数据
		var tabsList = [
			//{"id" : "1", "title" : tl('portMirror')},
			{"id" : "2", "title" : tl('portVlan')}
		];
		// 生成标签页，并放入页面中
		Tabs.displayTabs(tabsList);
		// 为第一个标签页添加点击事件
		/*$('a[href="#1"]').click(function(event) {
			Path.changePath(tl('portMirror'));
			// 异步加载 LAN口配置标签页的处理模块，并调用display方法
			require.async('./displayIfMirror.js', function(obj){		
				obj.display($('#1'));
			});
		});
		*/
		$('a[href="#2"]').click(function(event) {
			$('#2').empty();
			Path.changePath(tl('portVlan'));
			// 异步加载 LAN口配置标签页的处理模块，并调用display方法
			require.async('./displayIfVLAN', function(obj){		
				obj.display($('#2'));
			});
		});
		// 手动触发第一个标签页的点击事件
	    $('a[href="#2"]').trigger('click');
	    });
	}
});
