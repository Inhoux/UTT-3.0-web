define(function(require, exports, module){
	module.exports = {
		show : show
	};
	/**
	 * 页面入口
	 * @author JeremyZhang
	 * @date   2017-01-11
	 * @return {[type]}   [description]
	 */
	function show(){
		initLangConf();
		preLoadDics(function(){
			/*checkUser();*/
			rewrite();
			showPage();
		});
	}
	/**
	 * 预加载字典，完成后执行回调函数
	 * @author JeremyZhang
	 * @date   2017-01-20
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	function preLoadDics(callback){
		var Translate = require('Translate');
		var dicNames  = ['common', 'error', 'tips'];
		Translate.preLoadDics(dicNames, function(){
			callback();
		});
	}
	/**
	 * 对语言进行初始化配置
	 * @author JeremyZhang
	 * @date   2017-01-20
	 * @return {[type]}   [description]
	 */
	function initLangConf(){
		var LangConf = require('P_config/langConfig');
		LangConf.setLang();
	}
	/**
	 * 检查用户是否登录
	 * @author JeremyZhang
	 * @date   2017-01-20
	 * @return {[type]}   [description]
	 */
	/*
	function checkUser(){
		var Login = require('P_modules/entry/Login');
		Login.checkUser();
	}
	*/
	/**
	 * 重写jquery ajax
	 * @author JeremyZhang
	 * @date   2017-01-17
	 * @return {[type]}   [description]
	 */
	function rewrite(){
		var Rewrite = require('P_core/Rewrite');
		Rewrite.rewriteAjax();
	}
	/**
	 * 显示页面框架
	 * @author JeremyZhang
	 * @date   2017-01-10
	 * @return {[type]}   [description]
	 */
	function showPage(){
		/*
			引入网站头部模块， 生成头部
		 */
		var Header = require('P_plugin/Header');
		Header.displayHeader();
		/*
			引入侧边栏模块， 生成侧边栏
		 */
		var Sidebar = require('P_plugin/sidebar');
		Sidebar.displaySidebar();
		/*
			引入网站底部模块， 生成网站底部
		 */
		var Footer = require('P_plugin/Footer');
		Footer.displayFooter();
		/*
			引入路由模块，并启动路由
		 */
		var Router = require('P_core/Router');
		Router.start();
		/*
			页面布局调整
		 */
		var PageAdjust = require('P_plugin/PageAdjust');
		PageAdjust.resetPage();
	} 
});
