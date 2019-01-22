define(function(require, exports, module){
	function processData(data){
		var inputData = data.inputData,
			inputList = [inputData.name, inputData.value, inputData.class, inputData.placeHolder,inputData.eye];
		
		var list = {
			sign 	  :  data.sign || '',
			display   : (data.display == undefined)?true:data.display,
			necessary : data.necessary || false,
			disabled  : data.disabled || false,
			prevWord  : data.prevWord,
			inputList : inputList,
			afterWord : data.afterWord
		};
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/inputs/password'),
			html = render(list);
		var $html = $(html);
		//绑定明文密码
		var $pswd = $html.find('input[type="password"]');
		$html.find('.u-password-eye').click(function(){
			var $t = $(this);
			if($t.hasClass('glyphicon-eye-close')){
				$t.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
				$pswd.attr('type','password');
			}else{
				$t.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
				$pswd.attr('type','text');
			}
		});
		return $html;
	}
	module.exports = {
		getHTML : getHTML
	};
});