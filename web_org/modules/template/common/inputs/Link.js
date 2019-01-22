define(function(require, exports, module){
	function processData(data){
		var list ={
			sign 	  :  data.sign || '',
			display :  (data.display == undefined)?true:data.display,
			linkList : data.inputData.items
		}
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/inputs/link'),
			$html = $(render(list));
			list.linkList.forEach(function(obj){
				if(obj.initFunc)
				obj.initFunc($html.find('a#'+obj.id));
			});
		return $html;
	}
	module.exports = {
		getHTML : getHTML
	};
});