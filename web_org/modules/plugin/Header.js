define(function(require, exports, module){
	function displayHeader(){
		var $container = $('#header');
		var Header = require('P_template/common/Header');
		var html = Header.getHTML({});
		$container.append(html);
		initFunc($container);
	}
	function initFunc($con){
		$con.find('#logout').click(function(){
			$.ajax({
				url  : '/action/logout',
				type : 'POST',
				data : ''
			});
//			window.location.href = "/noAuth/login.html";
		})
	}
	module.exports = {
		displayHeader : displayHeader
	};
});
