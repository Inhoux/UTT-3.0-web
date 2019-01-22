define(function(require, exports, module){
	function processData(data){
		var dataList = data.inputData.items,
			name     = data.inputData.name,
			inputList = [],
			count = data.inputData.count || data.inputData.items.length;
		
			
		dataList.forEach(function(item,i){
			if(Number(i) < Number(count)) {
				var hide = (item.hide == undefined?false:item.hide);
				var disabled = (item.disabled == undefined?false:item.disabled);
				var arr = [item.value, item.name,(item.control == undefined?'':item.control),hide,disabled];
				inputList.push(arr);
			}
			
		});
		var list = {
			sign 	  :  data.sign || '',
			display :  (data.display === undefined)?true:data.display,
			deValue   : (data.inputData.defaultValue === undefined)?'':data.inputData.defaultValue,
			necessary : data.necessary || false,
			disabled  : data.disabled || false,
			prevWord  : data.prevWord,
			name      : name,
			inputList : inputList,
			afterWord : data.afterWord
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/inputs/select'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});