define(function(require, exports, module){
	function processData(data){
		var list = {
			table_head : data.thead,
			table_body : data.tbody
 		};
 		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/table'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});