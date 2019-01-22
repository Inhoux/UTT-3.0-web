define(function(require, exports, module){
	function getDom(data){
		var $headConDom = getHeadConDom();
		var btnList     = data.btns;
		var $btnList    = getBtnListDom(btnList);
		$headConDom.find('#btns').append($btnList);
		return $headConDom;
	}
	function getHeadConDom(){
		var Head  = require('P_template/common/TableHeader'),
			html = Head.getDom({});
		return $(html);
	}
	function getBtnListDom(btnList){
		var BtnGroup  = require('BtnGroup'),
			$btnGroup = BtnGroup.getDom(btnList);
		return $btnGroup;
	}
	module.exports = {
		getDom : getDom
	};
});