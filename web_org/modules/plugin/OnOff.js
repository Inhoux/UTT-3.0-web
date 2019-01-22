define(function(require, exports, module){
	
	function getDom(data){
		var newData = {
			prevWord: ud(data.prevWord)?data.prevWord:'',
			afterWord: ud(data.afterWord)?data.afterWord:'',
			defaultType:ud(data.defaultType)?data.defaultType:false,
			id: ud(data.id)?data.id:'onoff',
			clickFunc: ud(data.clickFunc)?data.clickFunc:function(){},
		};
		var $onoff = $('<img class="u-onoff-img" src="static/img/off.png" id="'+newData.id+'" checktype="0" style="position:relative;cursor:pointer;width:auto;height:auto;"/>');
		if(newData.defaultType){
			$onoff.attr({
				src			: 'static/img/on.png',
				checktype   : '1'
			});
		}
		$onoff.click(function(){
			var $t = $(this);
			if($t.attr('checktype') == '1'){
				$t.attr({
					src			: 'static/img/off.png',
					checktype   : '0'
				});
			}else{
				$t.attr({
					src			: 'static/img/on.png',
					checktype   : '1'
				});
			}
			newData.clickFunc($t,$t.attr('checktype'));
		});
		var $divone = $('<div></div>');
		if(newData.prevWord !== ''){
			$divone.append('<span  class="u-onoff-span1"  style="margin-left:5px;margin-right:5px">'+newData.prevWord+'</span>');
		}
		$divone.append($onoff);
		if(newData.afterWord !== ''){
			$divone.append('<span  class="u-onoff-span2"   style="margin-left:5px;margin-right:5px">'+newData.afterWord+'</span>');
		}
//		$divone.children().css({'margin-top':'0.4%'});
		return $divone.children();
	}
	
	function ud(obj){
		return (obj === undefined?false:true);
	}
	
	function joinTab($onoff){
		$onoff.css('float','right');
		
		var newonoff = [];
		$onoff.each(function(){
			var $t = $(this);
			if($t.hasClass('u-onoff-img')){
				$t.css({marginRight:'10px'})
			}
			newonoff.unshift($t);
		});
		if($('#content>nav>ul.nav>.u-onoff-img').length >0){
			$('#content>nav>ul.nav').find('.u-onoff-img,.u-onoff-span1,.u-onoff-span2').remove();
		}
		$('#content>nav>ul.nav').append(newonoff);
	}
	module.exports = {
		getDom : getDom,
		joinTab :joinTab
	};
});