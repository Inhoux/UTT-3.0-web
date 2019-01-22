define(function(require, exports, module){
	function getHTML(){
		// 引入模板模块
		var render = require('P_build/common/footer');
		var html   = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});