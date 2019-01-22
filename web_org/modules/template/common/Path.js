define(function(require, exports, module){
	function processData(data){
		var pathList = [],
			links    = data.links;
		links.forEach(function(item){
			var arr = [item.link, item.title];
			pathList.push(arr);
		});
		var list = {
			path_list : [
				data.prevTitle, pathList, data.currentTitle
			]
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/path'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});
