define(function(require, exports, module){
	function processData(data){
		var inputData = data.inputData,
			inputList = [inputData.name, inputData.value, inputData.class, inputData.placeHolder];
		var list = {
			sign 	  :  data.sign || '',
			display :  (data.display == undefined)?true:data.display,
			necessary : data.necessary || false,
			disabled  : data.disabled || false,
			prevWord  : data.prevWord,
			inputList : inputList,
			afterWord : data.afterWord
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/inputs/textarea'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});