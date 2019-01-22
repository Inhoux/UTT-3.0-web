define(function(require, exports, module){
	function processData(data){
		var list = {};
		list.name = data.name;
		list.deValue = data.defaultValue;
		list.items = [];
		data.items.forEach(function(item){
			var arr = [item.value, item.name];
			list.items.push(arr);
		});
		return list;
	}
	function getHTML(data){
		var list = processData(data);
		var render = require('P_build/common/element/select'),
			html   = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});