define(function(require, exports, module){
	module.exports = {
		rewriteAjax : rewriteAjax
	};
	/**
	 * 重写jquery ajax 方法
	 * 添加 501、504的处理
	 * @date   2017-01-17
	 * @return {[type]}   [description]
	 */
	function rewriteAjax(){
		require('jquery');
		var _ajax = $.ajax;
		var _func = function(){};
		$.ajax = function(opts){
			var beforeSiderSign = window.location.href;
			var beforeNavSign = getClickNavSign();
			if((opts.url.indexOf('goform/')>0 ||opts.url.indexOf('.asp')>0 ) && (opts.type == 'get' || opts.type == 'GET')){
				if(opts.url.indexOf('?')>0){
//					opts.url += '&fresh='+(new Date().getTime());
					opts.cache= false;
				}else{
//					opts.url += '?fresh='+(new Date().getTime());
					opts.cache= false;
				}
				
			}
			var fn = {
				complete : function(xhr, text){
					var status  = xhr.status,
						resText = xhr.responseText;
					redirect(resText);
					switch(status){
						case 200:
							var successSiderSign = window.location.href;
							var successNavSign = getClickNavSign();
							if(beforeSiderSign == successSiderSign && beforeNavSign == successNavSign){
								(opts.success || _func)(resText, text, xhr);
							};
							break;
						case 501:
							showPermissionDenied();
							break;
						case 504:
							showPermissionDenied();
							break;
						default :
							break;
					}
				},
				success : function(){}
			};
			var newOpts = $.extend({}, opts, fn);
			_ajax(newOpts);
		}
	}
	/*
		如果包含 ajaxMustEvalFlag=1 , 进行eval、跳转
	 */
	function redirect(resText){
		if(resText.substr(0,64).indexOf('ajaxMustEvalFlag=1') > -1){
			eval(resText);
		}
	}
	// 获取当前path路径栏
	function getClickNavSign(){
		var $beforeNav = $('#path>ol.breadcrumb>li.active'); 
		var beforeNavSign = '0';
		if($beforeNav.length){
			beforeNavSign = $('#path>ol.breadcrumb>li.active').attr('data-local') || 'nohas'; 
		}
		return beforeNavSign;
	}
	/**
	 * 显示权限不足
	 * @author JeremyZhang
	 * @date   2017-01-17
	 * @return {[type]}   [description]
	 */
	function showPermissionDenied(){
		var Tips = require('Tips');
		var tipStr = '{permisiondenied}!{you}{cannot}{execute}{this}{operation}';
		Tips.showWarning(tipStr);
	}
})
