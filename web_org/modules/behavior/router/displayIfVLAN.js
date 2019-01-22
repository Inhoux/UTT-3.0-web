define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	function display($container){
		DATA["con"] = $container;
		$container.empty();
		showInputGroup($container);
	}
	function showInputGroup($container){
		var Async = require('P_core/Async');
		var url   = 'common.asp?optType=portVlan';
		// url = ''
		Async.async([url], function(jsStr){
			// jsStr = 'var numPorts = 3;' +
			// 		'var vlanLists = new Array("1 ","1 2 ");' +
			// 		'var vlanGrpNos = new Array("1","3");';
			if(jsStr !== false){
				var data    = processJsStr(jsStr);
				var $inputs = getInputGroupDom(data);
				DATA["inputs"] = $inputs;
				var $btns   = getBtnsDom();
				$container.empty().append($inputs, $btns);
				var Translate  = require('Translate');
				var tranDomArr = [$inputs,$btns];
				var dicArr     = ['common'];
				Translate.translate(tranDomArr, dicArr);				
			}
		}, function(){

		})
	}
	function processJsStr(jsStr){
		var Eval      = require('Eval');
		var variables = ['numPorts', 'vlanLists', 'vlanGrpNos'];
		var result    = Eval.doEval(jsStr, variables),
		    isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data     = result["data"],
				lanCount = data["numPorts"],   // 3
				vlans    = data["vlanGrpNos"], // ["1", "3"]
				lans     = data["vlanLists"];  // ["1", "1 2 "]
			var res = [];
			for(var i = 1; i <= parseInt(lanCount); i++){
				var obj = {
					vlan : i,
					lan : []
				};
				res.push(obj);
			}
			
			res.forEach(function(obj,n){
				if(lans[vlans.indexOf(obj.vlan.toString())]){
					obj.lan = lans[vlans.indexOf(obj.vlan.toString())].split(' ');
					obj.lan.pop();
				}else{
					obj.lan = [];
				}
			});
			
			
			return res;
		}else{
			return [];
		}
	}
	function getInputGroupDom(datas){
		var InputGroup = require('InputGroup');
		var inputList  = [];
		var lanCount   = datas.length;
		
		
		var items  = [];
		for(var i = 1; i <= lanCount; i++){
			var obj = {
				"value" : i.toString(),
				"name"  : 'LAN' + i
			};
			items.push(obj);
		}
		datas.forEach(function(data, index){
			var flag   = 1;
			var lan    = data["lan"];
			var vlan  = data["vlan"];
			var inputData = {
				"prevWord"  : 'VLAN' + vlan,
				"inputData" : {
					"type"         : 'checkbox',
					"name"         : 'vlan',
					"defaultValue" : lan,
					"items"        : items
				}
			};
			inputList.push(inputData);
		})
		var $dom = InputGroup.getDom(inputList);
		/* 调整VLAN 与LAN的间距*/
		$dom.find('tr').find('td:first-child').css('paddingRight','40px');
		
		return $dom;
	}
	function getBtnsDom(){
		var BtnGroup = require('BtnGroup');
		var btnList  = [
			{
				"id"        : 'save',
				"name"      : '{save}',
				"clickFunc" : function($this){
					$this.blur();
					saveVlan();
				} 
			},
			// {
			// 	"id"        : 'reset',
			// 	"name"      : '{reset}',
			// 	"clickFunc" : function($this){
					
			// 	} 
			// }
		];
		var $btnList = BtnGroup.getDom(btnList).addClass('u-btn-group');
		return $btnList;
	}
	function saveVlan(){
		var $inputs = DATA["inputs"];
		var $checkboxs = $inputs.find('input');
		var count = Math.sqrt($checkboxs.length);
		var arr = [];
		var bitArr = [];
		for(var i = 0; i < count; i++){
			bitArr.push([]);
		}
		$checkboxs.each(function(index, el) {
			if($(el).is(':checked')){
				arr.push('1');
			}else{
				arr.push('0');
			}
		});
		arr.forEach(function(item, index){
			var col = Math.ceil((index + 1) / count);
			bitArr[col-1].push(item)
		});
		
		var Funcs = require('P_core/Functions');
		var url='';
		bitArr.forEach(function(bits, index, arr){
			bits.reverse();
			var str = bits.join('');
			str = Funcs.binaryToHexadecimalForVlan(str);
			/******add by w.s****/
			if(str == 'a'){
				str=10;
			}else if(str == 'b'){
				str=11;
			}else if(str == 'c'){
				str=12;	
			}else if(str == 'd'){
				str=13;	
			}else if(str == 'e'){
				str=14;	
			}else if(str == 'f'){
				str=15;	
			}	
			arr[index] = str;	
		});
		
		if(bitArr[0] == '0'){
			var Tips = require('Tips');
			Tips.showWarning('{selectAtLeastOne}');
		}else{
			var flag = {
				count : bitArr.length,
				isErr : false
			};
			bitArr.forEach(function(bitStr, index){
				var url = '';
				if(bitStr == '0'){
					url='/goform/formdelPortVlan';
				}else{
					url='/goform/formPortVlan';
				}	
				postVlan(index + 1, bitStr, url, flag);
			})
		}
	}
	function postVlan(vlanNo, chkstr, urlStr, flag){
		var postStr = 'vlanNo={vlanNo}&chkstr={chkstr}';
		postStr = postStr.replace(/{vlanNo}/, vlanNo).replace(/{chkstr}/, chkstr);
		if(urlStr == '/goform/formdelPortVlan'){
			postStr='delstr='+vlanNo;
		}
		$.ajax({
			url     : urlStr,
			type    : 'POST',
			data    : postStr,
			success : function(jsStr){
				var Eval = require('Eval');
				var result = Eval.doEval(jsStr, ['status']),
					status = result["data"]["status"];
				if(status == '1'){
					flag.count--;
					if(flag.count == 0){
						var Tips = require('Tips');
						Tips.showSuccess('{saveSuccess}');
						display(DATA["con"])
					}
				}else{
					if(!flag.isErr){
						flag.isErr = true;
						var Tips = require('Tips');
						Tips.showWarning('{saveFail}')
					}
				}
			}
		});
	}
	module.exports = {
		display : display
	};
});
