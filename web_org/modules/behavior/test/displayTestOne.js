define(function(require, exports, module) {
	// 用来存储本页面的一些数据
	var DATA = {};
	/**
	 * 从路由器获取字符串代码，并从中提取数据，
	 * 并把数据转换为二维数组，每一个数组对应一条数据的内容
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @return {array}   二维数组
	 */
	function getData(){
		// 从路由器获得字符串daima
		var jsStr = getJsStr();
		// 将字符串代码进行处理，从中提取数据
		var data  = processJsStr(jsStr);
		return data;
	}
	/**
	 * 从路由器获取字符串代码，注意要使用同步方式
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @return {string}   字符串代码
	 */
	function getJsStr(){
		var jsStr = '';
		// $.ajax({
		// 	url     : 'your url here',
		// 	type    : 'GET',
		// 	async   : false,
		// 	success : function(result){
		// 		jsStr = result;
		// 	}

		// });
		jsStr = 'var ipArr = ["192.168.1.1", "192.168.10.2"]; '
				+'var maskArr = ["255.255.255.255", "255.255.255.255"];'
				+'var isOpenArr = ["on", "off"];';
		return jsStr;
	}
	/**
	 * 从字符串代码中提取数据，并转化为二维数组，每一个数组对应表格的一行数据
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {string}   jsStr 要处理的字符串代码
	 * @return {array}          处理好的二维数组
	 */
	function processJsStr(jsStr){
		// 引入Eval模块
		var Eval        = require('Eval'); 
		// 定义需要从字符串中提取的变量名 
		var variableArr = ['ipArr', 'maskArr', 'isOpenArr'];  
		/*
			执行Eval模块的doEval方法，并获得执行的结果
			得到执行结果中 标志是否执行成功的键 isSuccessful
		 */
		var result      = Eval.doEval(jsStr, variableArr); 
		var isSuccess   = result["isSuccessful"];
		// 先定义返回值
		var returnArr = [];
		/*
			判断字符串代码执行是否成功
		 */
		if(isSuccess){
			var data      = result["data"];
			var ipArr     = data["ipArr"];
			var maskArr   = data["maskArr"];
			var isOpenArr = data["isOpenArr"];
			ipArr.forEach(function(item, index, arr){
				var ip     = ipArr[index];
				var mask   = maskArr[index];
				var isOpen = isOpenArr[index];
				var arr = [ip, mask, isOpen];
				returnArr.push(arr);
			});
		}else{
			console.log('字符串代码执行失败');
		}
		// ************插入测试代码*************
		
		var Func = require('P_core/functions');
		var data = Func.getTestData(103);
		return data;
		// ************ 测试代码  *************
		return returnArr;
	}
	/**
	 * 将从路由器获得数据存入数据表
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   data 从路由器获得的所有数据
	 */
	function storeData(data){
		/*
			要存储表格中的数据
			先从所有的数据中获得表格数据,然后存入数据表

			这个示例代码中只有表格的数据，所以直接赋值了
		 */
		var tableData = data;
		storeTableData(tableData);
	}
	/**
	 * 存储表格的数据
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {二维array}   tableData 表格数据
	 */
	function storeTableData(tableData){
		// 引入数据库模块
		var Database = require('Database');
		// 获得一个数据库引用
		var database = Database.getDatabaseObj();
		// 把这个引用存入全局变量
		DATA['tableDatabase'] = database;
		// 定义字段列表
		var fieldArr = ['ip', 'mask', 'isOpen', 'hanzi'];
		/*
			将数据存入数据表
		 */
		database.addTitle(fieldArr);
		database.addData(tableData);
	}
	/**
	 * 生成表格
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   $container 盛放表格的dom
	 */
	function displayTable($container){
		var TableContainer = require('P_template/common/TableContainer');
		var html           = TableContainer.getHTML({}),
			$tableCon      = $(html);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		console.time('table')
		var $tableDom = getTableDom();
		console.timeEnd('table')
		$tableCon.append($tableDom)
	}
	/**
	 * 获得表格的dom
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @return {[type]}   [description]
	 */
	function getTableDom(){
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id"        : "add",
				"name"      : "新增",
				"clickFunc" : function(){
					addBtnClick();
				}
			}, 
			{
				"id"        : "delete",
				"name"      : "删除",
				"clickFunc" : function(){
					allDeleteBtnClick();
				}
			}, 
			{
				"id"        : "setting",
				"name"      : "全局设置",
				"clickFunc" : function(){
					settingBtnClick();
				}
			}
		];
		// 表格上方操作区域配置数据
		var tableHeadData = {
			"btns"     : btnList
		};
		// 从全局变量中拿到表格数据对应的数据库引用
		var database = DATA["tableDatabase"];
		// 表格配置数据
		var tableList = {
			"database"    : database,  // 表格对应的 数据库引用
			"isSelectAll" : true,      // 表格第一列是否是选择框
			"titles"      : {          // 表格每一列标题和数据库中字段的对应关系
				"{ip}" : {
					"key"  : "ip",
					"type" : "text",
					"sort" : true
				},
				"{mask}" : {
					"key"  : "mask",
					"type" : "text",
					"sort" : true
				},
				"{ispen}" : {
					"key"    : "isOpen",
					"type"   : "text",
					"sort"   : true,
					// "type"   : "checkbox",
					// "values" : {
					// 	"on"  : true,
					// 	"off" : false
					// },
					// "clickFunc" : function($this){
					// 	changeStatusBtnClick($this);
					// }
				},
				"{hanzi}" : {
					"key"    : "hanzi",
					"type"   : "text",
					"sort"   : true
				},
				"操作": {
					"type": "btns",
					"btns": [
						{
							"type"      : "edit",
							"clickFunc" : function($this){
								editBtnClick($this);
							}
						},
						{
							"type"      : "delete",
							"clickFunc" : function($this){
								deleteBtnClick($this);
							}
						},
						{
							"id"        : "tt",
							"name"      : '测试按钮',
							"clickFunc" : function($this){
								alert($this.attr('data-primaryKey'))
							}
						}
					]
				}
			},
			"lang"        : 'zhcn',
			"dicArr"      : ['test']
			//"hideColumns" : [ '{ip}']
		};
		// 表格组件配置数据
		var list = {
			head  : tableHeadData,
			table : tableList
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj(list),
			$table   = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		return $table;
	}
	/**
	 * 编辑按钮点击 触发的事件处理函数
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   $this 被点击的按钮
	 * @return {[type]}         [description]
	 */
	function editBtnClick($this){
		// 拿到要修改的数据的 主键
		var primaryKey     = $this.attr('data-primaryKey');
		var database       = DATA["tableDatabase"];
		// 把这个主键存入全局变量
		DATA["primaryKey"] = primaryKey;
		// 从数据表中提取数据
		var data           = database.getSelect({"primaryKey" : primaryKey})[0];
		var ip             = data.ip;
		var mask           = data.mask;
		var defaultValue   = (data.isOpen == 'on') ? 'on' : 'off';
		var config = {
			"modalID"    : 'modal-edit',
			"modalTitle" : '修改',
			"saveFunc"   : editData,
			"ip"         : ip,
			"mask"       : mask,
			"defaultValue" : defaultValue
		};
		showAddAndEditMoal(config);
	}
	/**
	 * 修改模态框中的提交按钮点击时触发的函数
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @return {[type]}   [description]
	 */
	function editData(){
		// 从全局变量中获得当前修改的数据对应的主键
		var primaryKey = DATA["primaryKey"];
		require.async(['Serialize', 'Tips', 'Eval', 'Dispatcher'], function(Serialzie, Tips, Eval, Dispatcher){
			var $modal = $('#modal-edit');
			var queryStr = Serialzie.getQueryStrs($modal);
			/*
				从输入框中可以获得用户输入的内容
				还要根据数据表中的内容、后台的需要
				来决定向后台发送什么数据
			 */
			$.ajax({
				url      : 'your url here',
				type     : "POST",
				data     : queryStr,
				success  : function(jsStr){
					var variableArr = ['status', 'errorstr'];
					var result      = Eval.doEval(jsStr, variableArr);
					var isSuccess   = result.isSuccessful;
					if(isSuccess){
						Dispatcher.reload(2);
					}else{
						Tips.showError('修改失败', 2);
					}
				}
			})
		});
	}
	/**
	 * 新增按钮 点击 处理函数
	 * @author JeremyZhang
	 * @date   2016-10-17
	 */
	function addBtnClick(){
		var config = {
			"modalID"    : 'modal-add',
			"modalTitle" : '新增',
			"saveFunc"   : addData,
			"ip"         : '',
			"mask"       : '',
			"defaultValue" : 'on'
		};
		showAddAndEditMoal(config);
	}
	/**
	 * 添加一条数据
	 * @author JeremyZhang
	 * @date   2016-10-17
	 */
	function addData(){
		require.async(['Serialize', 'Tips', 'Eval', 'Dispatcher'], function(Serialzie, Tips, Eval, Dispatcher){
			var $modal = $('#modal-add');
			Serialzie = require('Serialize');
			var queryStr = Serialzie.serializeArray($modal);
			console.log(queryStr)
			$.ajax({
				url      : 'your url here',
				type     : "POST",
				data     : queryStr,
				success  : function(jsStr){
					var variableArr = ['status', 'errorstr'];
					var result      = Eval.doEval(jsStr, variableArr);
					var isSuccess   = result.isSuccessful;
					if(isSuccess){
						Dispatcher.reload(2);
					}else{
						Tips.showError('添加失败', 2);
					}
				}
			})
		});
	}
	/**
	 * 表格上方 删除多个 按钮 点击 处理函数
	 * @author JeremyZhang
	 * @date   2016-10-17
	 */
	function allDeleteBtnClick($this){
		var tableObj        = DATA["tableObj"];
		// 获得到了所有选中的输入框所在行数据的主键 组成的数组
		var primaryKeyArr   = tableObj.getSelectInputKey('data-primaryKey');
		/*
			根据所有的主键可以从数据表中提取所有的数据
			根据后台要求发送对应数据就可以了
		 */
	}
	/**
	 * 表格中删除按钮的点击事件
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   $this [description]
	 * @return {[type]}         [description]
	 */
	function deleteBtnClick($this){
		var primaryKey = $this.attr('data-primaryKey');
		var database   = DATA["tableDatabase"];
		// 从数据表中拿到要删除的数据，根据后台需要什么就发送什么
		var data       = database.getSelect({"primaryKey" : primaryKey})[0];
		// 发送数据
		$.ajax({

		});
	}
	/**
	 * 修改和关闭按钮的点击事件
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   $this [description]
	 * @return {[type]}         [description]
	 */
	function changeStatusBtnClick($this){
		var primaryKey = $this.attr('data-primaryKey');
		var database   = DATA["tableDatabase"];
		// 从数据表中拿到要删除的数据，根据后台需要什么就发送什么
		var data       = database.getSelect({"primaryKey" : primaryKey})[0];
		// 发送数据
		$.ajax({

		});
	}
	/**
	 * 全局设置 按钮点击处理函数
	 * @author JeremyZhang
	 * @date   2016-10-17
	 */
	function settingBtnClick(){
		// 异步引入 Dispatcher 模块
		require.async(['Dispatcher'], function(Dispatcher){
			/*
				实现页面跳转
			 */
			var hash = '#/hhhh';
			Dispatcher.changeHash(hash);
		});
	}
	/**
	 * 显示新增或者编辑的模态框
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   config 模态框和输入框组的配置数据
	 */
	function showAddAndEditMoal(config){
		require.async(['Modal', 'InputGroup'], function(Modal, InputGroup){
			var modalData = {
				"id"    : config.modalID,
				"title" : config.modalTitle,
				"size"  : 'large',
				"btns"  : [
					{
						"type"      : 'save',
						"clickFunc" : function($this){
							config.saveFunc();
						} 
					},
					{
						"type"      : 'reset'
					},
					{
						"type"      : 'close'
					}
				]
			};
			var inputList = [
				{
					"prevWord"  : 'IP',
					"inputData" : {
						"type"   : 'text',
						"name"   : 'ip',
						"value"  : config.ip
					}
				},
				{
					"prevWord"  : 'Mask',
					"inputData" : {
						"type"   : 'text',
						"name"   : 'mask',
						"value"  : config.mask
					}
				},
				{
					"prevWord"  : '是否开启',
					"inputData" : {
						"type"         : 'radio',
						"name"         : 'isOpen',
						"defaultValue" : config.defaultValue,
						"items"        : [
							{
								"value"     : 'on',
								"name"      : '开启',
							},
							{
								"value"     : 'off',
								"name"      : '关闭',
							}
						]
					}
				}
			];
			var modalObj      = Modal.getModalObj(modalData);
			var $inputGroupDom = InputGroup.getDom(inputList);
			var list = [
				{
					"type"  : "select",
					"name"  : "aa",
					"items" : [
						{
							"name"  : "UDP",
							"value" : "udp"
						},
						{
							"name"  : "TCP",
							"value" : "tcp"
						}
					],
					"defaultValue" : 'tcp'
				},
				{
					"type" : "word",
					"name" : "内部端口"
				},
				{
					"type"  : "text",
					"name"  : "11",
					"value" : "vvv"
				},
				{
					"type" : "word",
					"name" : "~"
				},
				{
					"type"  : "text",
					"name"  : "22",
					"value" : ""
				},
				{
					"type" : "word",
					"name" : "内部端口"
				},
				{
					"type"  : "text",
					"name"  : "33",
					"value" : "",
					"checkFunc" : function($this){
						alert($this.val());
					}
				},
				{
					"type" : "word",
					"name" : "~"
				},
				{
					"type"  : "text",
					"name"  : "44",
					"value" : ""
				}
			];
			var InputRow = require('P_template/common/InputRow');
			var $inputRow = InputRow.getDom(list);
			function add($fold){
				var $inputRow = $fold.children('.fold-item:last');
				$inputRow.find("input[name='44']").val('dfvqq')
			}
			var Fold = require('P_plugin/Fold');
			var $fold = Fold.getDom($inputRow);

			modalObj.insert($inputGroupDom);
			modalObj.insert($fold);
			modalObj.show();
		});
	}
	/**
	 * 提供给外部的接口，生成此标签页内容
	 * @author JeremyZhang
	 * @date   2016-10-17
	 * @param  {[type]}   $container 这部分标签页放入的dom对象
	 * @return {[type]}              [description]
	 */
	function display($container) {
		// 清空标签页容器
		$container.empty();
		// 从路由器获取数据，并进行处理
		var tableData = getData(); 
		// 将数据存入数据表
		storeData(tableData);
		// 生成表格      
		displayTable($container); 

		// var Translate = require('Translate');
		// Translate.translate([$container], ['common']);
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});