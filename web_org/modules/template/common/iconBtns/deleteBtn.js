define(function(require, exports, module){
	function getHTML(){
		var render = require('P_build/common/iconBtns/deleteBtn'),
			html   = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});