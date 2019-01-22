define(function(require, exports, module) {
	var DATA={};
	DATA.settimenum = 5000;
	function settingBtnClick() {
		var Dispatcher = require('Dispatcher');
		var hash = '#/network_config/LAN_config/setting';
		Dispatcher.changeHash(hash);
	}
	function computeMinute(seconds){
		var num = parseInt(seconds);
		var min = Math.floor(num/60) + '分钟';
		return min;
	}
	function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr =['ip','mac','netmask','letfTime','note'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}
	function storeDhcpData(data) {
		data.forEach(function(item, index){
			item.unshift(index + 1);
		});
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["poolServeData"] = database;
		// 声明字段列表
		var fieldArr =['ip','mac','netmask','letfTime','note'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}

	function processData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量		
		variableArr = 
			[	'UserIPs','UserMacs', 
				'UserMasks','UserLeftTimes',
				'FixNotes'
			];			
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			//var titleArr = data["titles1"], // 表格头部的标题列表
			var	UserIPs = data["UserIPs"],
				UserMacs = data["UserMacs"],
				UserMasks = data["UserMasks"],
				UserLeftTimes = data["UserLeftTimes"],
				FixNotes = data["FixNotes"]
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据

			// 通过数组循环，转换vlan数据的结构
			UserIPs.forEach(function(item, index, arr) {
				var arr = [];
				//arr.push(Number(index)+1);
				arr.push(UserIPs[index]);
				arr.push(UserMacs[index]);
				arr.push(UserMasks[index]);
				arr.push(computeMinute(UserLeftTimes[index]));
				//arr.push(FixNotes[index]);
				arr.push('FixNotes');
				dataArr.push(arr);
			});
			// 返回处理好的数据
			var tableData = {
				//title: titleArr,
				data: dataArr
			};
			
			var dhcpData = [
				[UserIPs,UserMacs, UserMasks,UserLeftTimes, FixNotes],
			];
			
			return {
				table: tableData,
				dhcpData: dhcpData,
			};
		} else {
			Tips.showError('{parseStrErr}');
		}
	}

	function getTableDom() {
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id": "add",
				"name": "刷新",
				"clickFunc" : function(){
					forajax('',true,true);
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
			"dicArr":['common', 'doDhcpServer'],
			"titles": {
				//"ID" : "id",	
				"{ip}"		 : {
					"key": "ip",
					"type": "text",
					sort	:'ip'
				},
				"{subNetmask}"		 : {
					"key": "netmask",
					"type": "text",
					sort	:'ip'
				},	
				"{MACAddr}"		 : {
					"key": "mac",
					"type": "text",
					sort	:'mac'
				},								
				"{remainTime}"		 : {
					"key": "letfTime",
					"type": "text",
					sort	:'word'
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
		// 添加刷新下拉框
		var selecthtml = '<select id=""tableRefreshTime style="margin-right:5px;width:67px">'+
//							'<option value="1">1</option>'+
							'<option value="3">3</option>'+
							'<option value="5" selected="selected">5</option>'+
							'<option value="10">10</option>'+
							'<option value="60">60</option>'+
							'<option value="manual">手动</option>'+
						'</select>';
		var $selh = $(selecthtml);
		$selh.change(function(){
			clearTimeout(DATA.timeoutobj)
			var $t = $(this);
			if($t.val() != 'manual'){
				DATA.settimenum = $t.val()*1000;
				setTimeForAjax()
			}
		});
		var $newli = $('<li style="margin-right:5px" class="utt-inline-block"></li>');
		$newli.append('<span>刷新时间：</span>');
		$newli.append($selh);
		$newli.append('<span style="margin-right:5px">秒</span>')
		$table.find('#btns>ul').prepend($newli);
		return $table;
	}
 	function processVlanData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = ['titles1','poolNames'];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = data["titles1"], // 表格头部的标题列表
				poolNames = data["poolNames"];

			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据

			// 通过数组循环，转换vlan数据的结构
			poolNames.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(poolNames[index]);
				dataArr.push(arr);
			});
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
			var vlandata = [
				[poolNames]
			];
			
			return {
				//table: tableData,
				vlandata: vlandata,
			};
		} else {
			Tips.showError('{parseStrErr}');
		}
	}	
	function displayTable($container) {
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		//向后台发送请求，获得表格数据
		forajax($tableCon)
		
	}
	function setTimeForAjax(){
		var newsettime = $('#content li.active>a[data-toggle="tab"]').attr('time-sign');
		DATA.timeoutobj =  setTimeout(function(){
			if(new RegExp('DHCP_server').test(window.location.href) && newsettime ==$('#content li.active>a[data-toggle="tab"]').attr('time-sign')){
				forajax('',true);
			}
		},DATA.settimenum);
	}
	function forajax($tableCon,isfresh,ishandle){
		
		$.ajax({
			url: 'common.asp?optType=dhcpClient',
			type: 'GET',
			success: function(result) {
				// 将后台数据处理为数据表格式的数据
				var data = processData(result),
					tableData = data["table"];
					dhcpData  = data["dhcpData"];
				
				var	tableArr  = tableData["data"];
				storeTableData(tableArr);
				// 将lan数据存入数据表
				storeDhcpData(dhcpData);
				// 获得表格Dom
				if(isfresh){
					DATA["tableObj"].refresh(DATA["tableData"]);
				}else{
					var $table = getTableDom();
					// 将表格放入页面
	
					$tableCon.append($table);
					
				}
				if(!ishandle){
					setTimeForAjax();
				}
				
			},
			error:function(res){
			}
		});
	}
	function display($container) {
		var Translate = require('Translate'); 
		var dicNames = ['common', 'lanConfig', 'doDhcpServer']; 
		Translate.preLoadDics(dicNames, function(){ 
			 $container.empty();
			 displayTable($container);
		});	
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
