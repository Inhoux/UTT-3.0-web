define(function(require, exports, module){
	function getHTML(){
		var	render = require('P_build/common/sortBtns'),
			html = render({});
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});