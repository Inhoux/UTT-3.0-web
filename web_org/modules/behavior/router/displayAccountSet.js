define(function(require, exports, module) {
	var DATA = {};
	var Translate  = require('Translate');
	var dicArr     = ['common','doNetworkManagementStrategy'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
function processData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
					/*表格数据*/
					 	"username",
					 	"password",
					 	"authority",
					 	"ftpauth",
					 	"totalrecs"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = ["username",
							"password",
							"authority",
							"ftpauth"
							];


			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据

			// 通过数组循环，转换vlan数据的结构
			data.username.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(data.username[index]);
				arr.push(data.password[index]);
				arr.push(data.authority[index]);
				arr.push(data.ftpauth[index]);
				dataArr.push(arr);
			});

			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};


			return tableData;
		} else {
			console.log('{parseStrErr}')
		}
}

function getTableDom() {
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id": "add",
				"name": "{add}",
				 "clickFunc" : function($btn){
	          		addBtnClick();
	        	}
			},
			{
				"id": "delete",
				"name": "{delete}",
				"clickFunc" : function($btn){
	            	deleteBtnClick();
	        	}
	        }

		];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			otherFuncAfterRefresh:otherFunc,
			"dicArr"      :['common','doNetworkManagementStrategy'],
			"titles": {
				"{username}"		 : {
					"key": "username",
					"type": "text"
				},
				"{authority}"     :	{
					"key": "authority",
					"type": "text",
					"values": {
						"0": '{read}',
						"1": '{write}'
						}
				},
				"{ftpauth}"     :	{
					"key": "ftpauth",
					"type": "text",
					"values": {
						"0": '{not}',
						"1": '{yes}'
						}
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								DATA['primaryKey']=primaryKey;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								editBtnClick(data[0]);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								// 删除这条数据
								remove(data[0], $this);
							}
						}
					]
				}
			}
		};
		// 表格组件配置数据
		var list = {
			head: headData,
			table: tableList
		};
		// 加载表格组件，获得表格组件对象，获得表格jquery对象
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		require('Translate').translate([$table],['common','doNetworkManagementStrategy']);
		return $table;
	}
/**
 * 表格刷新后执行的方法
 */
function otherFunc(tableObj){
	tableObj.getDom().find('td[data-column-title="{username}"]>[data-local="admin"]').parent().prev().find('input').remove();
}
function addSubmitClick(modalID) {
	var Serialize = require('Serialize');
	var database   = DATA["tableData"];
	var Tips = require('Tips');
	var InputGroup=require('InputGroup');
	var $modal = $('#'+modalID);
	if (InputGroup.checkErr($modal)>0){
		//Tips.showError("{checkErr}");
	}else{


		var database = DATA.tableData;
		primaryKey=DATA['primaryKey'];
		var data = database.getSelect({
			primaryKey: primaryKey
		})[0];
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
			var pStr;
		console.dir(data);
		if(modalID=='modal-add'){
			pStr="Action=add&"+queryStr;
		}else{
			pStr="Action=edit&usernameold="+data.username+"&"+queryStr;
		}


		$.ajax({
			url: '/goform/formNetShareUser',
			type: 'POST',
			data: pStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];

				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					if (status) {
						// 显示成功信息
						Tips.showSuccess(T("saveSuccess"), 2);
						DATA.modalObj.hide();
						display($('#3'));

					} else {
						var errorStr = data['errorstr'];
						Tips.showWarning(T("saveFail") + errorStr, 2);
					}
				} else {
					Tips.showWarning(T('netErr'), 2);
				}
			}
		});
	}
}

function remove(data, $target) {
	var delstr = data["username"];
	var queryStr = 'delstr=' + delstr;
	var Tips = require('Tips');
	if(delstr=='admin'){
		Tips.showWarning(T('word_2'));
		return;
	}
	Tips.showConfirm(T('delconfirm'),delete_ok/*,delete_no*/);
//	function delete_no(){
//			display($('#3'));
//		}
	function delete_ok(){
		$.ajax({
			url: '/goform/formNetShareUserDel',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					returnStr = ['status'],
					result = doEval.doEval(codeStr, returnStr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					if (status) {
						Tips.showSuccess('{delSuccess}', 2);
						display($('#3'));
					} else {
						Tips.showError('{delFail}', 2);
					}

				} else {
					Tips.showError('{netErr}', 2);
				}
			}
		});
    }
}


function showEditAndAddModal(config) {
		// 加载模态框模板模块
		var modal='';

		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id"   : config.modalID,
			"title": config.modalTitle,
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){

		                config.saveFunc(config.modalID);
		            }
		        },
		        {
		            "type"      : 'reset'
		         }
		         ,
		        {
		            "type"      : 'close'
		        }
		    ]
		};
		// 获得模态框的html
		var modalobj = Modal.getModalObj(modalList),
		modal = modalobj.getDom(); // 模态框的jquery对象
		DATA.modalObj = modalobj;
		$('body').append(modal);


		var inputList = [
			{

				    "display" : true,  //是否显示：否
				    "necessary": true,  //是否添加红色星标：是
				    "prevWord": '{username}',
				    "inputData": {
				        "type"       : 'text',
				        "name"       : 'username',
				        "value"		 : config.username,
				       	"checkDemoFunc" : ['checkName','1','31']
				    },

			},
			{

				    "display" : true,  //是否显示：否
				    "necessary": true,  //是否添加红色星标：是
				    "prevWord": '{pwd}',
				    "inputData": {
				        "type"       : 'password',
				        "name"       : 'passwd1',
				        "value"		 : config.password,
//				        "eye" : true,
				       	"checkDemoFunc" : ['checkName','1','31','noSysName']
				    },

			},
			{

				    "display" : true,  //是否显示：否
				    "necessary": true,  //是否添加红色星标：是
				    "prevWord": '{confirmpwd}',
				    "inputData": {
				        "type"       : 'password',
				        "name"       : 'passwd2',
				        "value"		 : config.password,
				       	"checkDemoFunc" : ['checkPass','passwd1']
				    },

			},
			{
			        "display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{authority}',
			        "inputData": {
			            "defaultValue" : config.authority, //默认值对应的value值
			            "type": 'select',
			            "name": 'authority',
			            "items" : [
			                {
			                    "value" : '0',
			                    "name"  : '{read}'
			                },
			                {
			                    "value" : '1',
			                    "name"  : '{readwrite}'
			                }
			            ]
			        }
			},
			{
			        "display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{ftpAccess}',
			        "inputData": {
			            "defaultValue" : config.ftpauth, //默认值对应的value值
			            "type": 'select',
			            "name": 'ftpauth',
			            "items" : [
			                {
			                    "value" : '1',
			                    "name"  : '{yes}'
			                },
			                {
			                    "value" : '0',
			                    "name"  : '{not}'
			                }
			            ]
			        }
			}



		]


		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		//判断是否为admin
		if($dom.find('[name="username"]').val() == 'admin'){
			$dom.find('[name="username"]').attr('disabled','disabled').unbind('blur');
			$dom.find('[name="authority"]').attr('disabled','disabled');
			$dom.find('[name="ftpauth"]').attr('disabled','disabled');
		}

		DATA['dom']=$dom;
		modal.find('.modal-body').empty().append($dom);
		modal.modal('show');
		var Translate  = require('Translate');
		var tranDomArr = [modal];
		var dicArr     = ['common','doNetworkManagementStrategy'];
		Translate.translate(tranDomArr, dicArr);
	}

function editBtnClick(data){

	var config={
		"modalID"   	:'modal-edit',
		"modalTitle"	:'{edit}',
		"saveFunc"  	:addSubmitClick,
		"username"		:data.username,
		"password"		:data.password,
		"authority"		:data.authority,
		"ftpauth"		:data.ftpauth
	}
	showEditAndAddModal(config);
}
function addBtnClick() {

	if(DATA['length']>=DATA['maxNum']){
		require('Tips').showWarning(T("word_1"));
		display($('#3'));
		return;
	}
	var config={
		"modalID"   	:'modal-add',
		"modalTitle"	:'{add}',
		"saveFunc"  	:addSubmitClick,
		"username"		:'',
		"password"		:'',
		"authority"		:'0',
		"ftpauth"		:'1'
	}
	showEditAndAddModal(config);
}
function deleteBtnClick() {
		//获得提示框组件调用方法

		var Tips = require('Tips');
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		// 获得表格中所有被选中的选择框，并获取其数量
		var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey'),
			length = primaryKeyArr.length;

		// 判断是否有被选中的选择框
		if (length > 0) {
			var str = '';
			primaryKeyArr.forEach(function(primaryKey) {
				var data = database.getSelect({
					primaryKey: primaryKey
				});
				var name = data[0]["UserNames"];

				if(name!='admin')/*管理员配置不能被删除*/
					str += name + ',';
			});
			str = str.substr(0, str.length - 1);
			if(str.length==0){
				Tips.showWarning(T('word_2'));
				display($('#3'));
				return;
			}
			str = 'delstr=' + str;
			Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
			function delete_no(){
				display($('#3'));
			}
			function delete_ok(){
				$.ajax({
					url: '/goform/formUserDel',
					type: 'POST',
					data: str,
					success: function(result) {
						var doEval = require('Eval');
						var codeStr = result,
							variableArr = ['status'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
						// 判断代码字符串执行是否成功
						if (isSuccess) {
							var data = result["data"],
								status = data['status'];
							if (status) {
								// 提示成功信息
								Tips.showSuccess('{delSuccess}', 2);
								display($('#3'));
							} else {
								var errorStr = data['errorstr'];
							Tips.showWarning('{delFail}' + errorStr, 2);
							display($('#3'));
							}
						} else {
							Tips.showError('{netErr}!', 2);
						}
					}
				});
		  	}
		} else {
			Tips.showWarning('{upleSelectDelName}', 2);
		}

}


function storeTableData(data) {

	// 获取数据库模块，并建立一个数据库
	var Database = require('Database'),
		database = Database.getDatabaseObj(); // 数据库的引用
	// 存入全局变量DATA中，方便其他函数使用
	DATA["tableData"] = database;
	// 声明字段列表

	// 将数据存入数据表中
	database.addTitle(data.title);
	database.addData(data.data);
}

function displayTable($container) {

		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);

		//向后台发送请求，获得表格数据
		$.ajax({
			url: 'common.asp?optType=NetShareUserList',
			type: 'GET',
			success: function(result) {

				var data = processData(result);


				// 将数据存入数据表
				storeTableData(data);
				// 获得表格Dom
				var $table = getTableDom();
				// 将表格放入页面

				$tableCon.append($table);
			}
		});

	}
	function display($container) {

		// 清空标签页容器
		$container.empty();
		displayTable($container);

	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
