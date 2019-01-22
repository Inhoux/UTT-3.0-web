/**
 * 序列化用户输入内容模块
 * @author JeremyZhang
 * @date   2016-09-05           
 */
define(function(require, exports, module){
	function serializeArray($dom){
		var queryJsonArr = [];
		var queryArrs = getQueryArrs($dom);
		queryArrs.forEach(function(queryArr){
			var queryJson = {
				"name"  : queryArr[0],
				"value" : queryArr[1]
			};
			queryJsonArr.push(queryJson);
		});
		return queryJsonArr;
	}
	/**
	 * 获得所有的input select textarea jQuery对象
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $dom [description]
	 */
	function getElems($dom){
		var $inputElems      = $dom.find('input'),
			$selectElems     = $dom.find('select'),
			$textareaElems   = $dom.find('textarea'),
			$elems           = $inputElems.add($selectElems).add($textareaElems);
		return  $elems;
	}
	/**
	 * 获得所有的input select textarea 的name、value数组
	 * @author JeremyZhang
	 * @date   2016-09-05
	 */
	function getQueryArrs($dom){
		// 获得所有的input select textarea
		var $elems = getElems($dom);
		var queryArrs = [];
		$.each($elems, function(index, element){
			var queryArr = getQueryArr($(element));
			if(queryArr.length){
				queryArrs.push(queryArr);
			}
		});
		return queryArrs;
	}
	/**
	 * 获得所有的input select textarea 的查询字符串
	 * @author JeremyZhang
	 * @date   2016-09-05
	 */
	function getQueryStrs($dom){
		// 获得数组
		var queryArrs = getQueryArrs($dom);
		var queryStr = queryArrsToStr(queryArrs);
		return queryStr;
	}
	function changeKeyInQueryArrs(queryArrs, keyArr){
		queryArrs.forEach(function(item, index, arr){
			changeKeyInQueryArr(item, keyArr);
		});
		return queryArrs;
	}
	/**
	 * 将二维数组转化为json
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryArrs [description]
	 * @return {[type]}             [description]
	 */
	function queryArrsToJson(queryArrs){
		var queryObj = {};
		queryArrs.forEach(function(arr){
			queryObj[arr[0]] = arr[1];
		});
		return queryObj;
	}
	/**
	 * 将查询字符串转化为json
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryStr [description]
	 * @return {[type]}            [description]
	 */
	function queryStrsToJson(queryStr){
		var queryArrs = queryStrsToArr(queryStr);
		var queryJson = queryArrsToJson(queryArrs);
		return queryJson;
	}
	function changeKeyInQueryArr(queryArr, keyArr){
		keyArr.forEach(function(item, index){
			if(queryArr[0] == item[0]){
				queryArr[0] = item[1];
			}
		});
	}
	// function changeKeyInQueryStr(queryStr, keyArr){
	// 	var queryArrs = queryStrsToArr(queryStr);
	// 	console.log('1111111', queryArrs)
	// 	queryArrs = changeKeyInQueryArr(queryArrs, keyArr);
	// 	console.log('222', queryArrs)
	// 	var queryStr = queryArrsToStr(queryArrs);
	// 	return queryStr;
	// }
	
	/**
	 * 将查询字符串转化为二维数组
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryStrs [description]
	 * @return {[type]}             [description]
	 */
	function queryStrsToArr(queryStrs){
		var queryStrArr = splitQueryStrs(queryStrs);
		var queryArrs = [];
		queryStrArr.forEach(function(item, index, arr){
			var queryArr = queryStrToArr(item);
			queryArrs.push(queryArr);
		});
		return queryArrs;
	}
	/**
	 * 将只包含一个键的一个查询字符串转化为数组
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryStr [description]
	 * @return {[type]}            [description]
	 */
	function queryStrToArr(queryStr){
		var queryArr = queryStr.split('=');
		return queryArr;
	}
	/**
	 * 将[[name, value], [name, value]] 转换为 url字符串
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   queryArr [description]
	 * @return {[type]}            [description]
	 */
	function queryArrsToStr(queryArrs){
		var queryStrArr = [];
		queryArrs.forEach(function(item, index, arr){
			var queryStr = queryArrToStr(item);
			queryStrArr.push(queryStr);
		});
		var queryStr = mergeQueryStr(queryStrArr);
		return queryStr;
	}
	/**
	 * 将json转化为二维数组
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryJson [description]
	 * @return {[type]}             [description]
	 */
	function queryJsonToArr(queryJson){
		var queryArr = [];
		for(var key in queryJson){
			var arr = [key, queryJson[key]];
			queryArr.push(arr);
		}
		return queryArr;
	}
	/**
	 * 将json转换为字符串
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryJson [description]
	 * @return {[type]}             [description]
	 */
	function queryJsonToStr(queryJson){
		var queryArr = queryJsonToArr(queryJson);
		var queryStr = queryArrsToStr(queryArr);
		return queryStr;
	}
	/**
	 * 将[name, value] 转换为 url字符串
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   queryArr [description]
	 * @return {[type]}            [description]
	 */
	function queryArrToStr(queryArr){
		var queryStr = queryArr[0] + '=' + queryArr[1];
		return queryStr;
	}
	/**
	 * 获得一个input、select、textarea的name、value数组
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $elem [description]
	 * @return array    [name, value]
	 */
	function getQueryArr($elem){
		var inputType = getInputType($elem);
		var queryArr = [];
		switch(inputType){
			case 'hidden' :
				queryArr = getHiddenQueryArr($elem);
				break;
			case 'text' : 
				queryArr = getTextQueryArr($elem);
				break;
			case 'password' :
				queryArr = getTextQueryArr($elem);
				break;
			case 'checkbox' :
				queryArr = getCheckboxQueryArr($elem);
				break;
			case 'radio' :
				queryArr = getRadioQueryArr($elem);
				break;
			case 'select' :
				queryArr = getSelectQueryArr($elem);
				break;
			case 'textarea' :
				queryArr = getTextQueryArr($elem);
				break;
			default :
				queryArr = '';
				break;
		}
		return queryArr;
	}
	/**
	 * 获得元素的input 类型
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $input [description]
	 * @return {[type]}          [description]
	 */
	function getInputType($elem){
		var inputType = '',
		    tagName = $elem.get(0).tagName.toLowerCase();
		switch(tagName){
			case 'input' :
				inputType = $elem.attr('type');
				break;
			case 'select' :
				inputType = 'select';
				break;
			case 'textarea' :
				inputType = 'textarea';
				break;
		}
		if(inputType !== undefined){
			return inputType;
		}
	}
	function getHiddenQueryArr($input){
		var name       = $input.attr('name'),
			value      = $input.attr('value'),
			queryArr   = [name, value];
		return queryArr;
	}
	/**
	 * 获得text textarea password 的name、value
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $input [description]
	 * @return {[type]}          [name, value]
	 */
	function getTextQueryArr($input){
		var name       = $input.attr('name'),
			value      = $input.val(),
			queryArr   = [name, value];
		return queryArr;
	}
	/**
	 * 获得复选框的name、value
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $input [description]
	 * @return {[type]}          [name, value]
	 */
	function getCheckboxQueryArr($input){
		var queryArr = [];
		if($input.is(':checked')){
			var name       = $input.attr('name'),
				value      = $input.attr('checkonstr');
			queryArr       = [name, value];
		}else{
			var name       = $input.attr('name'),
				value      = $input.attr('checkoffstr');
			queryArr       = [name, value];
		}
		return queryArr;
	}
	/**
	 * 获得单选框的name、value
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $input [description]
	 * @return {[type]}          [name, value]
	 */
	function getRadioQueryArr($input){
		var queryArr = [];
		if($input.is(':checked')){
			var name       = $input.attr('name'),
				value      = $input.attr('value');
			queryArr       = [name, value];
		}
		return queryArr;
	}
	/**
	 * 获得下拉选择框的name、value
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   $input [description]
	 * @return {[type]}          [name, value]
	 */
	function getSelectQueryArr($input){
		var name     = $input.attr('name'),
			queryArr = [],
			$options = $input.find('option');
		if($options.length){
			$.each($options, function(index, element){
				var $this = $(this);
				if($this.is(':selected')){
					var value = $this.attr('value');
					queryArr   = [name, value];
				}
			});
		}
		return queryArr;
	}
	/**
	 * 将字符串数组合并为一个字符串
	 * @author JeremyZhang
	 * @date   2016-09-05
	 * @param  {[type]}   queryStrArr [description]
	 * @return {[type]}               [description]
	 */
	function mergeQueryStr(queryStrArr){
		var queryStrs = queryStrArr.join('&');
		return queryStrs;
	}
	/**
	 * 根据&字符将查询字符串拆分为数组
	 * @author JeremyZhang
	 * @date   2016-09-28
	 * @param  {[type]}   queryStrs [description]
	 * @return {[type]}             [description]
	 */
	function splitQueryStrs(queryStrs){
		return queryStrs.split('&');
	}
	// 
	function getValue(queryArrs, key){
		var valueArrs = [];
		queryArrs.forEach(function(item, index, arr){
			if(key == item[0]){
				valueArrs.push(item[1]);
			}
		});
		return valueArrs;
	}
	// function getQueryStr(key, value){
	// 	return key + '=' +value;
	// }
	module.exports = {
		getQueryArrs  : getQueryArrs, 
		getQueryStrs  : getQueryStrs,
		changeKeyInQueryArrs : changeKeyInQueryArrs,
		queryArrsToStr : queryArrsToStr,
		queryArrsToJson : queryArrsToJson,
		queryStrsToArr : queryStrsToArr,
		queryStrsToJson :queryStrsToJson,
		queryJsonToArr : queryJsonToArr,
		queryJsonToStr : queryJsonToStr,
		getValue : getValue,
		mergeQueryStr : mergeQueryStr,
		serializeArray : serializeArray
	};
});