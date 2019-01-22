define(function(require, exports, module) {
	// 存储本页面一些变量
	var DATA = {};
	// 本模块依赖于 jquery 模块
	require('../../../../libs/js/jquery-2.1.1.min.js');
	
	
	
	
	function display($container) {
		// 清空标签页容器
		$container.empty();


	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});