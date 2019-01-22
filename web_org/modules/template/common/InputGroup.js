define(function(require, exports, module){
	function getHTML(data){
		var render = require('P_build/common/inputGroup'),
			html = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});