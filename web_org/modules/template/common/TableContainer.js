define(function(require, exports, module){
	function processData(data){
	}
	function getHTML(data){
		//var list = processData(data),
		var	render = require('P_build/common/tableContainer'),
			html = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});