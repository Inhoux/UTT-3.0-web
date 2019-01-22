define(function(require, exports, module){
	function getHTML(data){
		var linkData = {
			id    : data.id,
			title : data.name
		};
		var render = require('P_build/common/element/link'),
			html   = render(linkData);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});