define(function(require, exports, module){
	function getDom(list){
		var $con = $('<div class="input-row"></div>');
		list.forEach(function(item){
			var $dom = getItemDom(item);
			$con.append($dom);
		});
		return $con;
	}
	function getItemDom(data){
		var $dom = $();
		var type = data.type;
		switch(type){
			case 'select' :
				$dom = getSelectDom(data);
				break;
			case 'word' :
				$dom = getSpanDom(data);
				break;
			case 'text' :
				$dom = getInputDom(data);
		}
		return $dom;
	}
	function getSelectDom(data){
		var Select = require('P_template/common/element/Select');
		return $(Select.getHTML(data));
	}
	function getSpanDom(data){
		var Span = require('P_template/common/element/Span');
		return Span.getHTML(data.name);
	}
	function getInputDom(data){
		var TextInput = require('P_template/common/element/TextInput');
		var $input    = $(TextInput.getHTML(data));
		var checkFunc = data.checkFunc;
		if(checkFunc != undefined){
			$input.blur(function(){
				checkFunc($(this));
			});
		}
		return $input;
	}
	module.exports = {
		getDom : getDom
	};
});