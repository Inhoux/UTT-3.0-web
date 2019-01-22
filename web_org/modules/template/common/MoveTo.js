define(function(require, exports, module){
	function processData(data){
		var list = '';
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/moveTo'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});
