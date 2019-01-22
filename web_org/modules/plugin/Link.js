define(function(require, exports, module){
	function getDom(data){
		var link = getBtnDom(data);
//		var func = data.clickFunc;
//		if(func != undefined){
//			initEvent($link, func);
//		}
		return link;
	}
	function getBtnDom(data){
		var Link = require('P_template/common/element/Link');
		var html   = Link.getHTML(data);
		return html;
	}
	function initEvent($link, func){
		$link.click(function(){
			func($(this));
		});
	}
	module.exports = {
		getDom : getDom
	};
});