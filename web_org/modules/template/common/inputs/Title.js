define(function(require, exports, module){
	function processData(data){
		var list = {
			sign 	  :  data.sign || '',
			display :  (data.display == undefined)?true:data.display,
			titleName  : data.inputData.name
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/inputs/title'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});