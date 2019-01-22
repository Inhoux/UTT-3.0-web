define(function(require, exports, module){
	function processData(data){
		var list = [];
		data.forEach(function(item){
			var listgroup = [],
				linkList = [],
				links    = item.links;
			links.forEach(function(item_2){
				var arr = [item_2.link, item_2.title];
				linkList.push(arr);
			});
			listgroup = [item.pos, item.title, linkList];
			list.push(listgroup);
		});
		var returnList = {
			"list" : list
		}
		return returnList;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/sidebar'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});
