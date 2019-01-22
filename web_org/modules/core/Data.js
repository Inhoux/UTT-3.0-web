define(function(require, exports, module){
	require('jquery');
	var Eval     = require('Eval');
	var Database = require('Database');
	/**
	 * 根据url地址，同步从后台获取js代码字符串
	 * @author JeremyZhang
	 * @date   2016-10-24
	 * @param  {[type]}   url [description]
	 * @return {[type]}       [description]
	 */
	function getJsStr(url){
		return 'var lan = [1,2,3]; var mask = [4,5,6]; var name = [7,8,9]; var mode = 0;';
		$.ajax({
			url     : url,
			type    : "GET",
			async   : false,
			success : function(jsStr){
				return jsStr;
			}
		});
	}
	/**
	 * 根据 js代码字符串和变量数组，从字符串中提取数据
	 * 提取失败，返回false
	 * @author JeremyZhang
	 * @date   2016-10-24
	 * @param  {[type]}   jsStr       [description]
	 * @param  {[type]}   variableArr [description]
	 * @return {[type]}               [description]
	 */
	function getDataFromJsStr(jsStr, variableArr){
		var result       = Eval.doEval(jsStr, variableArr);
		var isSuccessful = result["isSuccessful"];
		if(isSuccessful){
			var data = result["data"];
			return data;
		}else{
			return false;
		}
	}
	/**
	 * 根据 url地址 和 变量数组，从路由器提取数据
	 * @author JeremyZhang
	 * @date   2016-10-24
	 * @param  {[type]}   url         [description]
	 * @param  {[type]}   variableArr [description]
	 * @return {[type]}               [description]
	 */
	function getDataFromRouter(url, variableArr){
		var jsStr = getJsStr(url);
		var data  = getDataFromJsStr(jsStr, variableArr);
		return data;
	}
	/**
	 * 根据url地址返回数据，包括原生和处理过的
	 * @author JeremyZhang
	 * @date   2016-10-24
	 * @param  {[type]}   url [description]
	 * @return {[type]}       [description]
	 */
	function getData(url){
		var data = null;
		switch(url){
			case 'test.asp' :
				data = getTestData(url);
				break;
		}
		return data;
	}
	/**
	 * 从 test.asp 这个url获取数据
	 * @author JeremyZhang
	 * @date   2016-10-24
	 * @param  {[type]}   url [description]
	 * @return {[type]}       [description]
	 */
	function getTestData(url){
		// 定义要从 字符串代码 中 提取 的 变量
		var variableArr = ['lan', 'mask', 'name', 'mode'];
		// 从路由器中获取处理好的数据
		var data        = getDataFromRouter(url, variableArr);
		// 判断从路由器返回的数据是否正确
		if(data !== false){
			// 将获取好的数据存入数据表，并返回数据表引用
			var proData     = getTestDB(data); 
			// 将原始数据和处理过的数据一起返回
			return {
				"data"    : data,
				"proData" : proData
			};
		}else{
			return false;
		}
	}
	/**
	 * 将 test 这个接口的数据进行存储
	 * @author JeremyZhang
	 * @date   2016-10-24
	 * @param  {[type]}   data 从路由器中提取出来的数据
	 * @return {[type]}        [description]
	 */
	function getTestDB(data){
		/*
			获取 这个接口 返回的所有变量
		 */
		var lanArr  = data['lan'];
		var maskArr = data["mask"];
		var nameArr = data["name"];
		var mode    = data["mode"];
		/*
			将数组进行转换，变成数据表支持的格式
		 */
		var arr     = [];
		lanArr.forEach(function(item, index){
			var innerArr = [lanArr[index], maskArr[index], nameArr[index]];
			arr.push(innerArr);
		});
		// 定义数据表的字段列表
		var fieldArr = ['lan', 'mask', 'name'];
		/*
			将数据存入数据表
		 */
		var database = Database.getDatabaseObj();
		database.addTitle(fieldArr);
		database.addData(arr);
		/*
			定义一个空对象
			将数据表和单独的mode变量存入这个对象
			返回这个对象
		 */
		var proData = {};
		proData.testDB = database;
		proData.mode   = mode;
		return proData;
	}
	module.exports = {
		getData : getData
	};
});