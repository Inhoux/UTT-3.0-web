define(function(require, exports, module){
	function processData(data){
		var ds = data.size || 'normal';
		var size = '';
		if(ds == 'normal'){
			size = '';
		}else if(ds == 'large'){
			size = 'width:750px';
		}else if(ds == 'large1'){
			size = 'width:890px';
		}
		var list = {
			"modalList" : {
				"id"    : data.id,
				"title" : data.title,
				"size"  : size
			}
		};
		return list;
	}
	function getHTML(data){
		// 每次调用模态框方法时，清除所有隐藏的modal
		
		$('body').find('.modal').each(function(){
			var $t = $(this);
			if(!$t.hasClass('in')){
				$t.remove();
			}
		});

		
		var list = processData(data),
			render = require('P_build/common/modal'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});