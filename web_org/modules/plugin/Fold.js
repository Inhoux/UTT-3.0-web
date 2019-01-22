define(function(require, exports, module){
	require('jquery');
	function getConDom(){
		var html = '<ul class="utt-inline-block"><li class="first fold-item"></li><li class="align-center M-T-10"><button class="btn btn-primary" data-event="add"> + </button></li></ul>';
		return $(html);
	}
	function getDom($dom, addFunc, deleteFunc){
		var $conDom = getConDom();
		$conDom.find('li.first').append($dom);
		initEvent($conDom, addFunc, deleteFunc);
		return $conDom;
	}
	function initEvent($dom, befAddFunc, afterAddFunc, deleteFunc){
		$dom.click(function(ev){
			var ev      = ev || event,
				target  = ev.target || ev.srcElement,
				$target = $(target);
			var type = $target.attr('data-event');
			if(type == "add"){
				if(befAddFunc != null){
					var res = befAddFunc($dom);
					if(res){
						var $li = $dom.find('li.first').clone(true).removeClass('first');
						// 清空新增框中的值
						var $btn = getDeleteBtnDom();
						$li.find('div').append($btn);
						$target.parent().before($li);
						if(afterAddFunc != null){
							afterAddFunc($dom);
						}
					}
				}else{
					var $li = $dom.find('li.first').clone(true).removeClass('first');
					var $btn = getDeleteBtnDom();
					$li.find('div').append($btn);
					$target.parent().before($li);
					if(afterAddFunc != undefined){
						afterAddFunc($dom);
					}
				}
			}
			if(type == "delete"){
				if(deleteFunc != undefined){
					deleteFunc($dom);
				}
				var $li = $target.parent().parent();
				$li.remove();
			}
		});
	}
	function getDeleteBtnDom(){
		var DeleteBtn = require('P_template/common/iconBtns/deleteBtn');
		var $btn = $(DeleteBtn.getHTML()); 
		$btn.removeAttr('event-type');
		$btn.attr("data-event", "delete");
		return $btn;
	}
	module.exports = {
		getDom : getDom
	};
});