/**
 * 路由模块
 * @author JeremyZhang
 * @date   2016-08-24           
 */
define(function(require, exports, module){
	require('P_libs/js/director.min.js');
	/**
	 * 修复路由中无法刷新的问题
	 * @author JeremyZhang
	 * @date   2016-08-24
	 */
	function addRefresh(){
		/*
		    当点击的链接和当前URL地址相同时，进行重载页面处理
			director.js的问题
		 */
		$(window).click(function(e){
			var ev = window.event || e,
					target = ev.target || ev.srcElement;
			if(String(target.nodeName).toLowerCase() == 'a'){
				var href = target.getAttribute('href');
				if(window.location.hash == href){
			//		window.location.reload();
				}else if(href == '#' || href == undefined){
					return false;
				}
			}
		});
	}
	/**
	 * 为页面添加默认的处理函数
	 * @author JeremyZhang
	 * @date   2016-08-24
	 * @param  {[type]}   func [description]
	 */
	function addDefaultHash(func){
		// 当url地址中没有#时，添加默认路由处理
		if(typeof addEventListener){
			window.addEventListener('load', load);
			window.addEventListener('hashchange', load);
		}else{
			window.attachEvent('onload', load);
			window.attachEvent('onhashchange', load);
		}
		load();
		function load(){
			var url     = location.href,
		   	 	pattern = /#/;
			if(!pattern.test(url)){
		  		func();
			}
		}
	}
	/**
	 * 无法解析hash时的处理函数
	 * @author JeremyZhang
	 * @date   2016-08-24
	 */
	function notFound(){
		console.log('not a currect url');
		location.href="http://"+ location.hostname+"/index.html";
		window.location.reload();
	}
	function startRouter(routes){
		var options = {
			notfound : notFound
		};
		// 配置路由
		var router = Router(routes).configure(options);
		// 启动路由
		router.init();
		
	}
	function getConfig(){
		var urlConfig = require('P_config/urlConfig');
		var config    = urlConfig.getRouterConfig();
		return config;
	}
	function start(){
		var routeConf = getConfig(),
			routes    = routeConf.routes,
			defFunc   = routeConf.defaultFunc;
		addRefresh();
		addDefaultHash(defFunc)
		startRouter(routes);
	}
	module.exports = {
		start : start
	};
})
