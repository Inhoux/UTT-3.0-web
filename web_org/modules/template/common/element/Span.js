define(function(require, exports, module){
	function getHTML(text){
		var render = require('P_build/common/element/span'),
			html   = render({"text" : text});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});