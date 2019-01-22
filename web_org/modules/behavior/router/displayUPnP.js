define(function(require, exports, module) {
	var DATA = {};
	var Translate  = require('Translate');
	var dicArr     = ['common','doPortMapping'];
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
					 	"upnpIntIp",
						"upnpRemoteIp",
						"upnpIntPort",
						"upnpExtPort",
						"upnpProt",
						"description",
						"upnpEnables"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
					/*表格数据*/
					 	"upnpIntIp",
						"upnpIntPort",
						"upnpProt",
						"upnpRemoteIp",
						"upnpExtPort",
						"description",
						], // 表格头部的标题列表
				upnpIntIpArr  	 =data['upnpIntIp'],
				upnpRemoteIpArr  =data['upnpRemoteIp'],
				upnpIntPortArr   =data['upnpIntPort'],
				upnpExtPortArr   =data['upnpExtPort'],
				upnpProtArr 	 =data['upnpProt'],
				descriptionArr   =data['description'];
				DATA['upnpEnables']	 =data['upnpEnables'];

			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
		
		
			// 通过数组循环，转换vlan数据的结构
			upnpIntIpArr.forEach(function(item, index, arr) {
				var arr = [];
				arr.push( upnpIntIpArr[index]);
				arr.push( upnpIntPortArr[index]);
				arr.push( upnpProtArr[index]);
				arr.push( upnpRemoteIpArr[index]);
				arr.push( upnpExtPortArr[index]);
				arr.push( descriptionArr[index]);
		
				dataArr.push(arr);
			});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
			return {
				table: tableData
		
			};
		} else {
			console.log('字符串解析失败')
		}
}

function getTableDom() {
		
		var btnList = [
			{
				id:'refreshTable',
				name:'刷新',
				clickFunc:function(){
					$('[href="#4"]').trigger('click');
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
			"isSelectAll" : false,
			"dicArr":['common','doPortMapping'],
			"titles": {
				"{inAddr}"		 : {
					"key": "upnpIntIp",
					"type": "text"
				},			
				"{inPort}"   :{
					"key" : "upnpIntPort",
					"type": "text"
				},
				"{protocol}"   : {
					"key" : "upnpProt" ,
					"type": "text"
				},
				"{matchAddr}"   : {
					"key" : "upnpRemoteIp",
					"type": "text"
				},
				
				"{outPort}"	 : 	{
								"key": "upnpExtPort",
								"type": "text"
				},
				"{info}"	 : 	{
								"key": "description",
								"type": "text"
				},
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
		var OnOff = require('OnOff');
    	var $onoff = OnOff.getDom({
        prevWord:'UPnP :',
        afterWord:'',
        id:'checkOn',
        defaultType:DATA['upnpEnables']=='1'?true:false,
        clickFunc:function($btn,typeAfterClick){
            openBtnClick();
        }
    	});
    	$('#checkOn').remove();
    	$('.nav .u-onoff-span1').remove();
    	OnOff.joinTab($onoff);
		return $table;
	}



function openBtnClick(data, $target) {
		var Enable = (DATA["upnpEnables"] == '1') ? '0' : '1';
		
		var Tips = require('Tips');
		
		var Serialize = require('Serialize');
		// 查询字符串二维数组
		var queryArr = [
			['upnpEnblew', Enable],
			['upnpEnbleOld', DATA["upnpEnables"]]
			
		];
		// 调用序列化模块的转换函数，将数组转换为查询字符串
		var queryStr = Serialize.queryArrsToStr(queryArr);
		// 向后台发送请求
		$.ajax({
			url: '/goform/formConfigUpnp',
			type: 'POST',
			data: queryStr,
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
					// 后台修改成功
					
					if (status) {
						Tips.showSuccess(T('saveSuccess'), 2);
						display($('#4'));
					} else {
						Tips.showError(T('saveFail'), 2);
						display($('#4'));
					}

				} else {
					Tips.showError('{netErr}', 2);
				}
			}
		});
	}






	function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr = [
					/*表格数据*/
					 	"upnpIntIp",
						"upnpIntPort",
						"upnpProt",
						"upnpRemoteIp",
						"upnpExtPort",
						"description",
						];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}

function displayTable($container) {
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		//向后台发送请求，获得表格数据
		$.ajax({
			url: 'common.asp?optType=natUPnP',
			type: 'GET',
			success: function(result) {
				var data = processData(result),
					tableData = data["table"];
					
				var	titleArr  = tableData["title"],
					tableArr  = tableData["data"];


				// 将数据存入数据表
				storeTableData(tableArr);
				
				// 获得表格Dom
				var $table = getTableDom();
				// 将表格放入页面
				// initHeadEvent();
				// 添加表格内的按钮事件
		
				// initTableEvent($container);
				$tableCon.append($table);
				
				// 为按钮添加事件
				// showData();

			}
		});
		$.ajax({
			url: 'common.asp?optType=WanIfCount',
			type: 'GET',
			success: function(result) {
				var doEval = require('Eval');
				
				var codeStr=result,variableArr = ['wanIfCount'];;
				result=doEval.doEval(codeStr,variableArr);
				
				 DATA["wanCount"] = result['data']["wanIfCount"];
			var num=DATA["wanCount"];
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
