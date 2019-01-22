define(function(require, exports, module){
	function getHTML(data){
		var render = require('P_build/common/element/textInput'),
			html   = render(data);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});