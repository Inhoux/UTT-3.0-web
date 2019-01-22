define(function(require, exports, module){
	//根据最新浏览器可视范围大小，设置和改变左右板块的最小高度、高度，保持两边高度同步
	function resetPage(){
		$(document).ready(function(){
			var onceHeight = $('#sidebar').height();
			$('#sidebar').css({minHeight:onceHeight+'px'});
			$('.u-l-right.main-right').css({minHeight:onceHeight+'px',height:'100%'});
			var changeHeight = $('.u-l-right.main-right').height();
			$('#sidebar').css({height:changeHeight+'px'});
			$('#content').css({height:(changeHeight-40)+'px'});
		});
		$(window).resize(function(){
			resizeLeftAndRight();
		});
		$("body").bind('DOMNodeInserted', function(e) { 
			resizeLeftAndRight();
		});
		function resizeLeftAndRight(){
			var changeHeight = $('.u-l-right.main-right').height();
			$('#sidebar').css({height:changeHeight+'px'});
			$('#content').css({height:(changeHeight-40)+'px'});
		}
	}
	module.exports = {
		resetPage : resetPage
	};
});