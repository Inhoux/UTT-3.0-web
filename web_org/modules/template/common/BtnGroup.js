define(function(require, exports, module){
	function processData(data){
		var btnList = [];
		data.forEach(function(item){
			var arr = [item.id, item.name];
			btnList.push(arr);
		});
		var list = {
			btn_list : btnList
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/btnGroup'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});