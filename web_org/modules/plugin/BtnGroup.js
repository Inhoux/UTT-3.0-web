define(function(require, exports, module){
	require('jquery');
	function getDom(btnGroupList){
		var $btnGroup = getBtnGroupDom(btnGroupList);
		initEvent($btnGroup, btnGroupList);
		return $btnGroup;
	}
	function getBtnGroupDom(btnGroupList){
		var BtnGroup = require('P_template/common/BtnGroup');
		var html     = BtnGroup.getHTML(btnGroupList);
		return $(html);
	}
	function initEvent($btnGroup, btnGroupList){
		btnGroupList.forEach(function(btnData){
			var clickFunc = btnData.clickFunc;
			// 其实应该判断是否是函数
			if(clickFunc != undefined){
				var id = btnData.id;
				$btnGroup.find('#' + id).click(function(){
					clickFunc($(this));
				});
			}
		});
	}
	module.exports = {
		getDom : getDom
	};
});