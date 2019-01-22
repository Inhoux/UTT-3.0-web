define(function(require, exports, module) {
	require('jquery');
	
	function setTable($container){
		//Ajax取数据……
		
		
		//将数据转化为可识别的格式后存入数据库……
		var tableData =[];
		storeTableData(tableData);
		
		
		//获得表格Dom方法
		var $table = getTableDom();
		//将生成的表格放入页面
		$tableCon.append($table);
		//为head里的按钮添加事件：新增、删除、全局设置
		initHeadEvent();
		//为表格里的小图标按钮添加事件：编辑、删除
		initTableEvent($container);
	
	}

	function storeTableData(tableData){
		//建立数据库
		
	}
	function getTableDom(){
		//制作按钮及表格
		var btnList = [
			{
				"id": "add",
				"name": "新增"
			},
			{
				"id": "delet",
				"name": "删除"
			},
			{
				"id": "setting",
				"name": "全局设置"
			},
		];
		
	}
	function initHeadEvent(){
		//绑定按钮的点击事件
		
	}
	function initTableEvent($container){
		//绑定小图标按钮的事件：编辑、删除
	}







	function display($container) {
		// 清空标签页容器
		$container.empty();
		
		setTable($container);
	}
	
	// 提供对外接口
	module.exports = {
		display: display
	};
});