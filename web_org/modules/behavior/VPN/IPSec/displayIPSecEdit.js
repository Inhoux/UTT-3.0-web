define(function(require, exports, module) {
	require('jquery');





	function display($container) {
		// 清空标签页容器
		$container.empty();
		alert(GDATA["a"])
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});