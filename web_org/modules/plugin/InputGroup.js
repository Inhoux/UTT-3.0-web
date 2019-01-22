define(function(require, exports, module) {
	require('jquery');
	/**
	 * 获得输入框组的dom对象
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {array}   list  输入框组配置数据
	 * @return {$dom}          输入框组的jQuery对象
	 */
	function getDom(list) {
		/*
			获得输入框组的外层包裹容器
		 */
		var InputGroup = require('P_template/common/InputGroup'),
			html = InputGroup.getHTML(),
			$container = $(html),
			$tbody = $container.find('tbody');
		/*
			循环生成每一个输入框
			并依次放入容器
		 */
		list.forEach(function(item) {
			var $dom = getInputDom(item);
			if($dom !== undefined && $dom !== null) {
				$tbody.append($dom);
			}
		});

		//初始化control的控制,获得首次初始化后的表单
		var $container = getInitControlChange($container, list);
		//根据control关系的层级数，执行多次初始化事件(限定最多10级)
		setTimeout(function(){
			for(var i = 0;i<10;i++){
				initControl($container, list);
			}
		},1);

		
		

		return $container;
	}
	/**
	 * 获得一个输入框的jQuery对象
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 一个输入框的配置数据
	 * @return {$dom}       一个输入框的jQuery对象 
	 */
	function getInputDom(list) {
		var type = list.inputData.type;
		if(type !== undefined) {
			type = type.toString().toLowerCase();
			var $dom = null;
			switch(type) {
				case 'text':
					$dom = getTextDom(list);
					break;
				case 'textarea':
					$dom = getTextareaDom(list);
					break;
				case 'select':
					$dom = getSelectDom(list);
					break;
				case 'checkbox':
					$dom = getCheckboxDom(list);
					break;
				case 'radio':
					$dom = getRadioDom(list);
					break;
				case 'title':
					$dom = getTitleDom(list);
					break;
				case 'link':
					$dom = getLinkDom(list);
					break;
				case 'link':
					$dom = getLinkDom(list);
					break;
				case 'password':
					$dom = getPasswordDom(list);
					break;
				case 'date':
					$dom = getDateDom(list);
					break;
				case 'words':
					$dom = getWordsDom(list);
					break;
				default:
					break;
			}
			return $dom;
		} else {
			return false;
		}
	}
	/**
	 * 获得text类型的输入框，并添加检测事件
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getTextDom(list) {
		var Text = require('P_template/common/inputs/Text'),
			html = Text.getHTML(list),
			$dom = $(html);
		addInitCheck($dom, list);
		return $dom;
	}
	/**
	 * 获得textarea类型的输入框，并添加检测事件
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getTextareaDom(list) {
		var Textarea = require('P_template/common/inputs/Textarea'),
			html = Textarea.getHTML(list),
			$dom = $(html);
		addInitCheck($dom, list);
		return $dom;
	}
	/**
	 * 获得select类型的输入框
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getSelectDom(list) {
		var Select = require('P_template/common/inputs/Select'),
			html = Select.getHTML(list),
			$dom = $(html);

		addInitControl($dom, list, 'select');
		return $dom;
	}
	/**
	 * 获得checkbox类型的输入框
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getCheckboxDom(list) {
		var Checkbox = require('P_template/common/inputs/Checkbox'),
			html = Checkbox.getHTML(list),
			$dom = $(html);
		return $dom;
	}
	/**
	 * 获得radio类型的输入框
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getRadioDom(list) {
		var Radio = require('P_template/common/inputs/Radio'),
			html = Radio.getHTML(list),
			$dom = $(html);
		addInitControl($dom, list, 'radio');
		return $dom;
	}
	/**
	 * 获得一条标题
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getTitleDom(list) {
		var Title = require('P_template/common/inputs/Title'),
			html = Title.getHTML(list),
			$dom = $(html);
		return $dom;
	}

	/**
	 * 获得一条超链接
	 * @author QC
	 * @date   2016-09-29
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getLinkDom(list) {
		var Link = require('P_template/common/inputs/Link'),
			html = Link.getHTML(list),
			$dom = $(html);
		return $dom;
	}
	function getWordsDom(list){
		var Words = require('P_template/common/inputs/Words');
		var html  = Words.getHTML(list);
		return $(html)
	}
	/**
	 * 获得一个密码框
	 * @author QC
	 * @date   2016-10-19
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getPasswordDom(list) {
		var Password = require('P_template/common/inputs/Password'),
			html = Password.getHTML(list),
			$dom = $(html);
			addInitCheck($dom, list);
		return $dom;
	}
	/**
	 * 获得一个时间选择器
	 * @author QC
	 * @date   2016-10-19
	 * @param  {json}   list 配置数据
	 * @return {$dom}        
	 */
	function getDateDom(list) {
		var Date = require('P_template/common/inputs/Text');
		require('datepick');
		var html = Date.getHTML(list),
			$dom = $(html);
		addInitCheck($dom, list);
		$dom.find('input').click(function(event) {
			laydate();
		});

		return $dom;
	}

	/**
	 * 层级控制control单次初始化初始化
	 * @author QC
	 * @date   2016-11-2
	 */
	function initControl($container, list) {
	
			var radiojson = {};
			var selectjson = {};

			$container.find('[data-control]').each(function() {
				var $t = $(this);
				var allcon = $t.attr('data-control').split(',');
				allcon.forEach(function(strs) {
					if(strs != '') {
						radiojson[strs] = [];
						selectjson[strs] = [];
					}
				});
			});

			list.forEach(function(obj) {
				if(obj.inputData.items) {
					if(obj.inputData.type == 'radio') {
						obj.inputData.items.forEach(function(itemobj) {
							if(itemobj.control && itemobj.control != '') {
								var nowstrarr = itemobj.control.split(',');
								nowstrarr.forEach(function(strs) {
									if(radiojson[strs] != undefined){
										radiojson[strs].push('input[type="radio"][name="' + obj.inputData.name + '"][value="' + itemobj.value + '"]');
									}
								});
							}
						});
					} else if(obj.inputData.type == 'select') {
						obj.inputData.items.forEach(function(itemobj) {
							if(itemobj.control && itemobj.control != '') {
								var nowstrarr = itemobj.control.split(',');
								nowstrarr.forEach(function(strs) {
									if(selectjson[strs] != undefined){
										selectjson[strs].push(['select[name="' + obj.inputData.name + '"]', itemobj.value]);
									}
								});
							}
						});
					}

				}
			});

			var changejson = {};

			for(var i in radiojson) {
				changejson[i] = false;
			}
			for(var i in selectjson) {
				changejson[i] = false;
			}

			for(var i in radiojson) {
				radiojson[i].forEach(function(obj) {
//					console.log($(obj).val() + "~~~~~" + $(obj).is(':visible'));
					if(!$(obj).parent().parent().hasClass('u-hide')/*is(':visible')*/ && $(obj).is(':checked')) {
						changejson[i] = true;
					}
				});

			}
			for(var i in selectjson) {
				selectjson[i].forEach(function(obj) {
//					console.log($(obj[0]).attr('name') + "~~~~~" + $(obj[0]).is(':visible') + "~~~~"+$(obj[0]).val()+"~~~~~~" + obj[1]);
					if(!$(obj[0]).parent().parent().hasClass('u-hide')/*is(':visible')*/ && $(obj[0]).val() == obj[1]) {
						changejson[i] = true;
					}
				});
			}

			for(var trcontrol in changejson) {
				if(changejson[trcontrol]) {
					$container.find('[data-control]').each(function() {
						var $this = $(this);
						var arrnow = $this.attr('data-control').split(',');
						arrnow.forEach(function(strs) {
							if(strs == trcontrol) {
								$this.removeClass('u-hide');
							}
						});
					});
				}
			}
	}

	/**
	 * 获得初次control改变后的输入组对象
	 * @author QC
	 * @date   2016-11-1
	 * @param {Object} $container
	 * @param {Object} list
	 */
	function getInitControlChange($container, list) {
		var radiojson = {};
		var selectjson = {};

		$container.find('[data-control]').each(function() {
			var $t = $(this);
			var allcon = $t.attr('data-control').split(',');
			allcon.forEach(function(strs) {
				if(strs != '') {
					radiojson[strs] = [];
					selectjson[strs] = [];
				}
			});
		});
		list.forEach(function(obj) {
			if(obj.inputData.items) {
				if(obj.inputData.type == 'radio') {
					obj.inputData.items.forEach(function(itemobj) {
						if(itemobj.control && itemobj.control != '') {
							var nowstrarr = itemobj.control.split(',');
							nowstrarr.forEach(function(strs) {
								if(radiojson[strs] != undefined){
									radiojson[strs].push('input[type="radio"][name="' + obj.inputData.name + '"][value="' + itemobj.value + '"]');
								}
							});
						}
					});
				} else if(obj.inputData.type == 'select') {
					obj.inputData.items.forEach(function(itemobj) {
						if(itemobj.control && itemobj.control != '') {
							var nowstrarr = itemobj.control.split(',');
							nowstrarr.forEach(function(strs) {
								if(selectjson[strs] != undefined){
									selectjson[strs].push(['select[name="' + obj.inputData.name + '"]', itemobj.value]);
								}
							});
						}
					});
				}
			}
		});

		$container.find('tr[data-control]').each(function() {
			var $t = $(this);
			var realshow = true;
			var signarr = $t.attr('data-control').split(',');
			signarr.forEach(function(signstr) {
				if(radiojson[signstr]) {
					radiojson[signstr].forEach(function($str) {
						if(!$($str).is(':checked')) {
							realshow = false;
						}
					});
				}
				if(selectjson[signstr]) {
					selectjson[signstr].forEach(function(littlearr) {
						if($(littlearr[0]).val() != littlearr[1]) {
							realshow = false;
						}
					});
				}
			});
			if(!realshow) {
				$(this).addClass('u-hide');
			}
		});

		//清除空control
		$container.find('[data-control],[data-control-src]').each(function(){
			var $e = $(this);
			if($e.attr('data-control')!= undefined && $e.attr('data-control') == ''){
				$e.removeAttr('data-control');
			}
			if($e.attr('data-control-src')!= undefined && $e.attr('data-control-src') == ''){
				$e.removeAttr('data-control-src');
			}
		});
		
		return $container;
	}

	/**
	 * 为单选及下拉框添加显示控制事件
	 * @author QC
	 * @date   2016-11-1
	 */
	function addInitControl($dom, list, type) {

		if(type == 'select') {
			$dom.find('select').change(function() {
				var nowval = $(this).val();
				var arrs = getControlArr(nowval, list);
				makeTheControlEffective(arrs[0], arrs[1]);
			});
		} else if(type == 'radio') {
			$dom.find('input[type="radio"]').click(function() {
				var nowval = $dom.find('input[type="radio"]:checked').val();
				var arrs = getControlArr(nowval, list);
				makeTheControlEffective(arrs[0], arrs[1]);
			});
		}

	}
	/**
	 * 解析control属性 
	 * @author QC
	 * @date   2016-11-1
	 * @param {str} nowval
	 * @param {josn} list
	 */
	function getControlArr(nowval, list) {
		var other = [];
		var now = [];
		var otherstr = '';
		list.inputData.items.forEach(function(obj) {
			var controlstr = (obj.control == undefined ? '' : obj.control);
			if(obj.value == nowval) {
				now = controlstr.split(',');
			} else {
				otherstr += (controlstr + ",");
			}
		});
		other = otherstr.split(',');
		return [now, other];
	}

	/**
	 * 让control所对应的模块显示或隐藏
	 * @author QC
	 * @date   2016-11-1
	 * @param {arr} nowarr
	 * @param {arr} otherarr
	 * @param {jqury} $dom
	 */
	function makeTheControlEffective(nowarr, otherarr) {
		$('[data-control]').each(function() {
			var $t = $(this);
			var thisControl = $t.attr('data-control').split(',');
			var sameval = false;
			thisControl.forEach(function(str) {
				otherarr.forEach(function(stro) {
					if(str == stro) {
						sameval = true;
					}
				});
			});
			if(sameval) {
				$t.addClass('u-hide');
				if($t.find('[data-control-src]').length>0){
					$t.find('[data-control-src]').each(function(){
						var $c = $(this);
						var hidearr = $c.attr('data-control-src').split(',');
						makeTheControlEffective([], hidearr);
					});
				}
				
			}
		});
		
		$('[data-control]').each(function() {
			var $t = $(this);
			var thisControl = $t.attr('data-control').split(',');
			var sameval = false;
			thisControl.forEach(function(str) {
				nowarr.forEach(function(stro) {
					if(str == stro) {
						sameval = true;
					}
				});
			});
			if(sameval) {
				$t.removeClass('u-hide');
				if($t.find('[data-control-src]').length>0){
					var _nowarrs = [];
					var _otherarrs = [];
					var _otherstr = '';
					$t.find('[data-control-src]').each(function(){
						var $c = $(this);
						if($c[0].tagName == 'OPTION'){
							if($c.val() == $c.parent().val()){
								_nowarrs = $c.attr('data-control-src').split(',');
							}else{
								_otherstr +=  ($c.attr('data-control-src')+",");
							}
						}else if($c[0].tagName == 'INPUT'){
							if($c.is(':checked')){
								_nowarrs = $c.attr('data-control-src').split(',');
							}else{
								_otherstr +=  ($c.attr('data-control-src')+",");
							}
						}
						
						
					});
					_otherarrs = _otherstr.split(',');
					makeTheControlEffective(_nowarrs, _otherarrs);
				}
			}
		});
	}

	/**
	 * 为输入框添加检测事件
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {$dom}   $dom 一个输入框的jQuery对象
	 * @param  {json}   list 输入框的配置数据
	 */
	function addInitCheck($dom, list) {
		var data = list.inputData,
			checkFuncs = data.checkFuncs,
			checkDemoFunc = data.checkDemoFunc;
		var $input = $dom.find('input,textarea');
		// 检测函数数组
		var funcArr = [];
		//自定义函数方法及参数数组
		var demoFunc = function() {};
		var demoDataObj = [];
		if(checkFuncs != undefined) {
			checkFuncs.forEach(function(func) {
				var checkFunc = function() {};
				if(typeof func == 'string') {
					var CheckFunctioins = require('../core/CheckFunctions');
					checkFunc = CheckFunctioins.getFunc(func);
				} else {
					checkFunc = func;
				}
				funcArr.push(checkFunc);
			});
		} else if(checkDemoFunc != undefined && checkDemoFunc.length > 1) {

			var CheckFunctioins = require('../core/CheckFunctions');
			var funcname = checkDemoFunc[0];
			checkDemoFunc.shift();
			demoFunc = CheckFunctioins.getFunc(funcname);
			demoDataObj = checkDemoFunc;
		}

		if(demoDataObj.length > 0) {
			initDemoCheck($input, demoFunc, demoDataObj);
		}

		if(funcArr.length > 0) {
			initCheck($input, funcArr);
		}
	}
	/**
	 * 为输入框注册检测事件
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {$dom}   $dom     一个输入框的jQuery对象
	 * @param  {string}   funcName 函数名
	 */
	function initCheck($input, funcArr) {
		$input.focus(function(event) {
			removeErrorStr($(this));
		});
		$input.blur(function() {
			removeErrorStr($(this));
			var text = $(this).val();
			
//			if($(this)[0].tagName == 'TEXTAREA'){
//				text = $(this).text();
//			}
			var isCorrect = true;
			var errorStr = '';
			funcArr.forEach(function(func) {
				var result = func(text);
				isCorrect = result["isCorrect"];
				if(!isCorrect) {
					isCorrect = false;
					errorStr += result["errorStr"];
				}
			});
			if(isCorrect) {
				// showSuccess($input);
			} else {
				if(errorStr == '') {
					errorStr = '输入错误';
				}
				showErrorStr($input, errorStr);
			}
		});
	}

	function initDemoCheck($input, func, demoDatas) {
		$input.focus(function(event) {
			removeErrorStr($(this));
		});
		$input.blur(function() {
			removeErrorStr($(this));
			var text = $(this).val();
			var isCorrect = true;
			var errorStr = '';
			var newDatas = demoDatas.concat();
			var result = func(text, newDatas);
			isCorrect = result["isCorrect"];
			if(!isCorrect) {
				isCorrect = false;
				errorStr += result["errorStr"];
			}

			if(isCorrect) {
				// showSuccess($input);
			} else {
				if(errorStr == '') {
					errorStr = '输入错误';
				}
				showErrorStr($input, errorStr);
			}
		});
	}
	/**
	 * 在一个输入框后显示文字
	 * @author QC
	 * @date   2016-10-24
	 * @param  {$dom}   $dom     输入框的jQuery对象
	 * @param  {string}   errorStr 显示的文字
	 */
	function showErrorStr($dom, errorStr) {
		removeErrorStr($dom);
		var html = '<span class="input-error">'
					+ '<span class="glyphicon glyphicon-exclamation-sign"></span>'
					+ '<span data-local="{errorStr}">&nbsp {errorStr}</span>'
					+ '</span>';
		html = html.replace(/{errorStr}/g, errorStr);
		var $h = $(html);
		var left = parseInt($dom.css('margin-left')),
			top = parseInt($dom.css('margin-top')),
			width = parseInt($dom.css('width')),
			height = parseInt($dom.css('heihgt'));
		$h.css({
			transition: "left 0.3s ease-out,opacity 0.2s",
			left: (left + width - 20) + "px",
			top: (top + 2) + "px"
		});
		var Translate = require('Translate');
		var dicArr    = ['common'];
		Translate.translate([$h], dicArr);
		$dom.after($h);
		setTimeout(function() {
			$h.css({
				left: (left + width - 5) + "px"
			});
		}, 1);

	}
	/**
	 * 清除一个输入框后的文字
	 * @author JeremyZhang
	 * @date   2016-09-29
	 * @param  {$dom}   $dom     输入框的jQuery对象
	 */
	function removeErrorStr($dom) {
		var nowdom = $dom.nextAll('.input-error');
		nowdom.addClass('input-error-fadeout');
		nowdom.css({
			left: (parseInt(nowdom.css('left')) + 15) + "px"
		});
		setTimeout(function() {
			nowdom.remove();
		}, 201);
	}

	/**
	 * 在指定行后添加一些超链接文字
	 * @author QC
	 * @date   2016-10-09
	 * @param  {$dom}     $dom   输入框组的jQuery对象
	 * @param  {string}   name   插入行的name
	 * @param  {array}linkdatas  插入的链接对象数组
	 */
	function insertLink($dom, name, linkdatas) {
		var _arrdm = [];
		//找到name对应的那一行tr
		$dom.find('[name="' + name + '"]').parents('tr').each(function() {
			_arrdm.push($(this));
		});
		//取最先找到的准确tr
		var _tr = _arrdm[0];
		//找到最后的一个td位置，用来放置超链接文字
		var _lasttd = _tr.children(':last');
		//解析超链接数据
		linkdatas.forEach(function(obj, i) {
			var $_dom = $('<a class="u-inputLink" id="' + obj.id + '" data-local="'+ obj.name +'">' + obj.name + '</a>');
			_lasttd.append($_dom);
			if(obj.initFunc) {
				obj.initFunc($_dom);
			}
			if(obj.clickFunc) {
				$_dom.click(function() {
					obj.clickFunc($_dom);
				});
			}
		});
	}

	/**
	 * 在指定行后添加一些按钮
	 * @author QC
	 * @date   2016-10-09
	 * @param  {$dom}     $dom   输入框组的jQuery对象
	 * @param  {string}   name	    插入行的name
	 * @param  {array}    btndatas  插入的按钮对象数组
	 */
	function insertBtn($dom, name, btndatas) {
		var _arrdm = [];
		//找到name对应的那一行tr
		$dom.find('[name="' + name + '"]').parents('tr').each(function() {
			_arrdm.push($(this));
		});
		//取最先找到的准确tr
		var _tr = _arrdm[0];
		//找到最后的一个td位置，用来放置按钮
		var _lasttd = _tr.children(':last');
		//解析超按钮数据,组装并添加按钮
		btndatas.forEach(function(obj, i) {
			var $_dom = $('<button type="button" class="btn-sm btn-primary u-inputBtn" id="' + obj.id + '"  data-local="'+ obj.name +'">' + obj.name + '</button>');
			_lasttd.append($_dom);
			if(obj.initFunc) {
				obj.initFunc($_dom);
			}
			if(obj.clickFunc) {
				$_dom.click(function() {
					obj.clickFunc($_dom);
				});
			}
		});
	}
	/*批量检错
	 
	 * $dom  检错对象
	 * checkHide true/false 是否检测隐藏状态下输入框
	 * checkHCTr true/false 是否检测交互操作所隐藏的无用输入框
	 * */
	function checkErr($dom,checkHide,checkHCTr) {
//		$dom.find('.input-error').addClass('input-error-fadeout');
		$dom.find('[type="text"],[type="password"],textarea').blur();
		var $inputErr = $dom.find('.input-error');
		var erarr = [];
		$inputErr.each(function(){
			var $t = $(this);
			
			if(checkHide){
				/* 允许检测处于隐藏状态下的输入框 */
				
				if(checkHCTr){
					/* 允许检测交互操作所隐藏的无用输入框 */
					if(!$t.hasClass('input-error-fadeout')){
						erarr.push($t);
					}
				}else{
					/* 不检测交互操作所隐藏的输入框 */
					var errtr = $t.parents('tr');
					if(!(errtr.length>0 && errtr.eq(0).attr('data-control') !== undefined && errtr.eq(0).hasClass('u-hide'))){
						if(!$t.hasClass('input-error-fadeout')){
							erarr.push($t);
						}
					}
				}
				
			}else{
				if(!$t.is(':hidden') && !$t.hasClass('input-error-fadeout')){
					erarr.push($t);
				}
			}
			
		});
		
		return erarr.length;
	}
	module.exports = {
		getDom: getDom,
		checkErr: checkErr,
		insertLink: insertLink,
		insertBtn: insertBtn,
		initControl: initControl
	}
});
