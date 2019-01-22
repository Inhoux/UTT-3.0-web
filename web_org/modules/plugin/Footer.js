define(function(require, exports, module){
	require('jquery');
	/**
	 * 生成网站底部
	 * @author JeremyZhang
	 * @date   2016-10-11
	 */
	function displayFooter(){
		// 定义网站默认位置
		var $dom   = $('#footer');
		// 引入模板模块
		var Footer = require('P_template/common/Footer');
		var html   = Footer.getHTML();
		$dom.append(html);
	}
	module.exports = {
		displayFooter : displayFooter
	};
});