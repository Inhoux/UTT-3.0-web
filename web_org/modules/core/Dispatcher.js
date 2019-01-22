/**
 * URL相关操作模块
 * @author JeremyZhang
 * @date   2016-08-26
 */
define(function(require, exports, module){
	function changeHash(hash){
		var hash = hash.toString() || '';
		window.location.hash = hash;
	}
	function reload(time){
		time = time * 1000;
		var timer = setTimeout(function(){
			window.location.reload();
		}, time);
		delete timer;
	}
	function getValueFromQuery(key){
		var queryStr  = getQueryStr();
		var queryJson = getQueryJson(queryStr);
		var value     = queryJson[key];
		return value;
	}
	function getQueryJson(queryStr){
		var queryArr  = queryStr.split('&');
		var queryJson = {};
		if(queryArr.length > 0){
			queryArr.forEach(function(query){
				var arr = query.split('=');
				queryJson[arr[0]] = arr[1];
			});
		}
		return queryJson;
	}
	function getQueryStr(){
		var queryStr = '';
		var hash     = window.location.hash;
		var index    = hash.indexOf('?');
		if(index > -1){
			queryStr = hash.substr(index + 1);
		}
		return queryStr;
	}
	module.exports = {
		changeHash        : changeHash,
		reload            : reload,
		getValueFromQuery :  getValueFromQuery
	};
});