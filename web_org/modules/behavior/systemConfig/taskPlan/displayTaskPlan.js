define(function(require, exports, module) {
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