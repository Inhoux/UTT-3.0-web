define(function(require, exports, module){
	function getSeajsConf(){
		var Config    = require('./config');
		var P_local   = Config.rootPath;         // 根目录
		var P_libs    = P_local + '/libs';       // libs目录
		var P_modules = P_local + '/modules';    // modules目录
		var P_static  = P_local + '/static';     // static目录 
		var paths = {
			/*
				设置目录
			 */
			'P_local'    : P_local,         // 根目录
			'P_libs'     : P_libs,          // libs目录
			'P_modules'  : P_modules,       // modules目录
			'P_static'   : P_static,        // static目录
			/*
				设置模块目录的下一级目录
			*/
			'P_behavior' : P_modules + '/behavior',       // 业务模块目录
			'P_core'     : P_modules + '/core',           // 核心模块目录
			'P_plugin'   : P_modules + '/plugin',         // 自定义插件目录
			'P_config'   : P_modules + '/config',         // 配置数据目录
			'P_template' : P_modules + '/template',       // 模板模块目录
			'P_router'   : P_modules + '/behavior/router', // 页面代码目录
			/*
				设置TMOD模板目录
			 */
			'P_build'    : P_local   + '/tpl',     // TMOD模板目录
			'tpl' : P_local + '/tpl'
		};
		var alias = {
			/*
				外部资源别名
			 */
			'jquery'       : 'P_libs/js/jquery-2.1.1.min.js',  // jquery别名
			'bootstrap_js' : 'P_libs/js/bootstrap.min.js',     // bootstrap js别名
			'datepick' 	   : 'P_libs/js/JTimer_1.3.js',     			//日期选择器
			/* 类型判断库 */
			'judge'        : 'P_libs/js/judge.min.js',   
			/*
				TMOD模板公用函数
			 */
			'template'     : 'P_build/template',
			/*
				设置核心模块目录下的模块别名
			 */
			'CheckFuncs'   : 'P_core/CheckFunctions',          // 输入框检测函数模块
			'Database'     : 'P_core/Database',                // 数据缓存模块别名
			'Dispatcher'   : 'P_core/Dispatcher',              // 网页url操作模块别名
			'Eval'         : 'P_core/Eval',					   // Eval模块别名
			'Serialize'    : 'P_core/Serialize',               // 查询字符串序列化模块别名
			'Translate'    : 'P_core/Translate',			   // 翻译模块别名
			'Functions'    : 'P_core/Functions',               // 常用函数库
			/*
				设置自定义插件目录下的模块别名
			 */
			'Grid'         : 'P_plugin/Grid',                  // 栅格窗显示系统
			'TableHeader'  : 'P_plugin/TableHeader',           // 表格上方模块别名
			'Ztree'        : 'P_plugin/Ztree',                 // 树模块	 
			'OnOff'        : 'P_plugin/OnOff',                 // 小按钮模块	 
			/*
				设置常用的别名
			 */
			'BtnGroup'     : 'P_plugin/BtnGroup',              // 按钮组模块别名
			'InputGroup'   : 'P_plugin/InputGroup',            // 输入框组模块别名
			'Modal'        : 'P_plugin/Modal',                 // 模态框模块别名
			'Path'         : 'P_plugin/Path',                  // 路径导航模块别名
			'Table'        : 'P_plugin/table',                 // 表格模块别名
			'Tabs'         : 'P_plugin/Tabs',                  // 标签页模块别名
			'Tips'         : 'P_plugin/Tips',                  // 提示模块别名	   
		};
		return {
			alias : alias,
			paths : paths
		};
	}
	/**
	 * 初始化seajs路径和别名
	 * @author JeremyZhang
	 * @date   2016-10-15
	 * @return {[type]}   [description]
	 */
	
	function initSeajs(){
		var seajsConf = getSeajsConf();
		var randomStr = Math.floor(Math.random() * 100000);
		seajs.config({
			//	设置路径
			paths : seajsConf.paths,
			//	设置别名
			alias : seajsConf.alias,
			/*map:   [[/^(.*\.(?:css|js))$/i, '$1?v=' + randomStr]],  */
			debug : true
		});
	}
	module.exports = {
		initSeajsConfig : initSeajs
	};
});
