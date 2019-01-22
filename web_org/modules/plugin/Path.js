define(function(require, exports, module){
	require('jquery');
	var Path = require('P_template/common/Path');
	var $path = $('#path');
	function displayPath(data, dicArr){
		var html = Path.getHTML(data);
		$path.empty().append(html);
		if($path.find('ol>li').eq(2).text() == ''){
			$path.find('ol>li').eq(2).addClass('u-hide');
		}
		if(dicArr !== undefined){
			translate(dicArr);
		}
	}
	function changePath(pathStr, dicArr){
		var $active = $path.find('ol>li').eq(2);
		$active.attr('data-local', pathStr).html(pathStr);
		$active.removeClass('u-hide');
		if(dicArr !== undefined){
			translate(dicArr);
		}
	}
	function translate(dicArr){
		var Translate = require('Translate');
		Translate.translate([$path], dicArr);
	}
	module.exports = {
		displayPath : displayPath,
		changePath  : changePath
	};
});