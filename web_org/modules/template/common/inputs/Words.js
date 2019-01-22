define(function(require, exports, module){
	function processData(data){
		var list ={
			prevWord : data.prevWord,
			sign 	: data.sign || '',
			display : (data.display == undefined)?true:data.display,
			text    : data.inputData.value
		}
		return list;  
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/inputs/words'),
			$html = $(render(list));
		return $html;
	}
	module.exports = {
		getHTML : getHTML
	};
});