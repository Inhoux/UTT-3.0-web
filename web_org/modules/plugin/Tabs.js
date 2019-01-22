define(function(require, exports, module){
	var Tabs = require('P_template/common/Tabs');
	function displayTabs(data,parentDom, dicArr){
		var $dom = parentDom || $('#content');
		var $html = $(Tabs.getHTML(data));
		$dom.empty().append($html);
		$html.find('[href][data-toggle="tab"]').click(function(){
			$(this).attr('time-sign',new Date().getTime());
		});
		if(dicArr !== undefined){
			require.async('Translate', function(Translate){
				Translate.translate([$dom], dicArr);
			});
		}
	}
	 function get$Dom(data){
	 	var html = Tabs.getHTML(data);
	 	return $(html);
	 }
	module.exports = {
		displayTabs : displayTabs,
		get$Dom : get$Dom
	};
});