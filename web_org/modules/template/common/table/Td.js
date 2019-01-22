define(function(require, exports, module){
	function getHTML(){
		var render = require('P_build/common/table/td'),
			html   = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});