define(function(require, exports, module){
	function processData(data){
		var dataList = data.inputData.items,
			name     = data.inputData.name,
			inputList = [],
			count = data.inputData.count || data.inputData.items.length;
		dataList.forEach(function(item,i){
			if(Number(i) < Number(count)) {
				var checked = false;
				var hide = (item.hide == undefined?false:item.hide);
				var disabled = (item.disabled == undefined?false:item.disabled);
				var dearrs = data.inputData.defaultValue || '';
				if(typeof dearrs == "string"){
					checked = (item.value == dearrs);
				}else{
					if(dearrs.length > 0){
						dearrs.forEach(function(obj){
							if(item.value == obj){
								checked = true;
							}
						});
					}
				}
				var arr = [name, item.value, item.name,item.checkOn,item.checkOff,checked,hide,disabled];
				inputList.push(arr);
			}
		})
		var list = {
			sign 	  :  data.sign || '',
			display :  (data.display == undefined)?true:data.display,
			deValue   : data.inputData.defaultValue || '',
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
			render = require('P_build/common/inputs/checkbox'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});