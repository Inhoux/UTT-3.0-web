define(function(require, exports, module){
	function getHTML(){
		var render = require('P_build/common/iconBtns/editBtn'),
			html   = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});