define(function(require, exports, module){
	function getHTML(data){
		var btnData = {
			id    : data.id,
			title : data.name
		};
		var render = require('P_build/common/element/button'),
			html   = render(btnData);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});