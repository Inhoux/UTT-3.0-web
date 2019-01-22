define(function(require, exports, module) {
	require('jquery');
	var DATA = {};
	function display($container){
		// 清空标签页容器
		$container.empty();
		/*
			生成表格容器
		 */
		var $tableConDom = getTableConDom();
		$container.append($tableConDom);
		displayTable($tableConDom);
	}
	function getJsStr(url, callback){
		$.ajax({
			url     : url,
			type    : 'GET',
			success : function(result){
				callback(result);
			},
			error   : function(){
				callback(false)
			}
		});
	}
	function displayTable($tableConDom){
		/*
			接口的url地址
		 */
		var url = '';
		getJsStr(url, function(jsStr){
			if(jsStr !== false){
				/*
					处理js字符串并返回数据库引用
				 */
				var database  = getDBFromJsStr(jsStr);
				/*
					将数据库引用存入DATA变量
				 */
				DATA["db"]    = database;
				/*
					获取表格dom
				 */
				var $tableDom = getTableDom(database);
				/*
					将包裹容器清空
					并把表格放入
		 		 */
		 		$tableConDom.empty().append($tableDom);
			}else{
				console.log('js error');
			}
		});
	}
	/**
	 * 处理js字符串,并存入数据表,并返回数据库引用
	 * @author JeremyZhang
	 * @date   2016-11-23
	 * @param  {[type]}   jsStr [description]
	 * @return {[type]}         [description]
	 */
	function getDBFromJsStr(jsStr){
		var Eval      = require('Eval');
		var variables = [];
		var result    = Eval.doEval(jsStr, variables);
		var isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data  = result["data"];
			/*
				处理数据.....
			 */
		}else{
			console.log('jsStr process failed');
		}
	}
	/**
	 * 获得表格dom
	 * @author JeremyZhang
	 * @date   2016-11-23
	 * @param  {[type]}   database [description]
	 * @return {[type]}            [description]
	 */
	function getTableDom(database){
		
	}
	/**
	 * 获得表格包裹容器的dom
	 * @date   2016-11-23
	 * @return {[type]}   [description]
	 */
	function getTableConDom(){
		var TableContainer = require('P_template/common/TableContainer');
		var html           = TableContainer.getHTML({}),
			$tableCon      = $(html);
		return $tableCon;
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});