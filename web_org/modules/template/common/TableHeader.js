define(function(require, exports, module){
	function getDom(){
		var render = require('P_build/common/tableHeader'),
			html   = render({});
		return $(html);
	}
	module.exports = {
		getDom : getDom
	};
});