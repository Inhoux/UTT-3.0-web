define(function(require, exports, module){
	function processData(data){
		return data;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/panel'),
			html = render(list);
			var $h = $(html);
			$h.on('click','a.panel-title',function(){
				
				var t = $(this);
				if(!$(t.attr('href')).hasClass('collapsing')){
					t.parents('.panel.panel-default').siblings().find('.u-panel-open-close').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
					if(t.find('.u-panel-open-close').hasClass('glyphicon-chevron-down')){
						t.find('.u-panel-open-close').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
					}else if(t.find('.u-panel-open-close').hasClass('glyphicon-chevron-up')){
						t.find('.u-panel-open-close').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
					}
				}
			});
		return $h;
	}
	module.exports = {
		getHTML : getHTML
	};
});
