define(function(require, exports, module){
	function processData(data){
		var list = [];
		data.forEach(function(item){
			var arr = [item.id, item.title];
			list.push(arr);
		});
		var returnList = {
			tabs_list : list
		};
		return returnList;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/tabs'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});