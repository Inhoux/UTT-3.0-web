define(function(require, exports, module){
	function processData(data){
		var paginationList = [];
		data.forEach(function(item){
			var arr = [item.link, item.title];
			paginationList.push(arr);
		});
		var list = {
			pagination_list : paginationList
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/pagination'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});
