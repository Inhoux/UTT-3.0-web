define(function(require, exports, module){
	function getDom(data){
		var btn = getBtnDom(data);
//		var func = data.clickFunc;
//		if(func != undefined){
//			initEvent($btn, func);
//		}
		return btn;
	}
	function getBtnDom(data){
		var Button = require('P_template/common/element/Button');
		var html   = Button.getHTML(data);
		return html;
	}
	function initEvent($btn, func){
		$btn.click(function(){
			func($(this));
		});
	}
	module.exports = {
		getDom : getDom
	};
});