define(function(require, exports, module){
	function tl(str){
		return require('Translate').getValue(str,['common', 'doNetworkManagementStrategy']);
	}
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	module.exports = {
		display: display
	};
	  function processData(jsStr) {
	    // 加载Eval模块
	    var doEval = require('Eval');
	    var codeStr = jsStr,
	      // 定义需要获得的变量
	      variableArr = [
	      'deviceInfos',
	      'enableDevice',
	      'need_passwd'
	      ];
	    // 获得js字符串执行后的结果
	    var result = doEval.doEval(codeStr, variableArr),
	      isSuccess = result["isSuccessful"];
	    // 判断代码字符串执行是否成功
	    if (isSuccess) {
	      // 获得所有的变量
	      var data = result["data"];

	      return data;
	    } else {

	      Tips.showError('{parseStrErr}',3);
	      return false;
	    }
	  }

	/**
	 * 生成表格
	 */
	function display($con){
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);

		$.ajax({
			type:"get",
			url:"common.asp?optType=netShareManage",
			success:function(result){
				var data = processData(result);
				if(!data){
					return;
				}
				DATA.enableDevice = data.enableDevice;
				DATA.need_passwd = data.need_passwd;
				//将数据生成数据库
				setDatabase(data);
				//生成表格
				setTable($tableCon);
			}
		});
	}

	/**
	 * 生成数据库
	 */
	function setDatabase(data){
	      var arr = [];
	      data.deviceInfos.forEach(function(obj,i){
	      	var innerarr = [];
	      	innerarr.push(obj[0]);
	      	innerarr.push(obj[1]);
	      	innerarr.push(obj[2]);
	      	innerarr.push(obj[3]);
			innerarr.push(obj[4]);
			innerarr.push(obj[5]);
	      	arr.push(innerarr);
	      });

		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["database"] = database;
		// 声明字段列表
		var fieldArr = ['j','all', 'used', 'left','use','open'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(arr);
	}

	/**
	 * 生成表格
	 */
	function setTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
		{
			"id": "scan",
			"name": "{scan}",
			 "clickFunc" : function($btn){
			 		$btn.blur();
					display($('#1'));
			 }
		},
		{
			"id": "delete",
			"name": "{popDevice}",
			 "clickFunc" : function($btn){
			 	$btn.blur();
			 	$.ajax({
		          url: '/goform/formStoragePop',
		          type: 'POST',
		          data: '',
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
		              if (status == '1') {
		                Tips.showSuccess('{popSuccess}')
		                $('[href="#1"]').trigger('click');
		              } else {
		                Tips.showError('{popFail}');
		              }
		            } else {
		              Tips.showError('{parseStrErr}');
		            }
		          }
		        });


        	}

		}
		];
		var database = DATA["database"];
		var headData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll":false,
			"otherFuncAfterRefresh":otherFunc,
			"dicArr" : ['common'],
			"titles": {
				"{volume1}"		 : {
					"key": "j",
					"type": "text",
				},
				"{totalCapacity}"		 : {
					"key": "all",
					"type": "text",
				},
				"{Used}"		 : {
					"key": "used",
					"type": "text",
				},
				"{Remaining}"		 : {
					"key": "left",
					"type": "text"
				},
				"{usageAmount}"		 : {
					"key": "use",
					"type": "text"
				},
				"{shareControl}": {
					"key": "open",
					"type": "checkbox",
                    "values"  : {
                        "on"  : true,
                        "off" : false
                    },
                    "clickFunc" : function($this){
                    	var changeStr = "smbNo="+$this.attr('data-primarykey')+"&smbEn="+($this.is(':checked')?'on':'off');
                    	$.ajax({
				          url: '/goform/formSingleStatusChange',
				          type: 'POST',
				          data: changeStr,
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
				              if (status == '1') {
				                Tips.showSuccess('{editSuccess}');
				                $('[href="#1"]').trigger('click');
				              } else {
				                Tips.showError('{editFail}');
				              }
				            } else {
				              Tips.showError('{parseStrErr}');
				            }
				          }
				        });

                    }
				}
			}
		};

		// 表格组件配置数据
		var list = {
			head: headData,
			table: tableList
		};
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		$tableCon.append($table);

		/* 两个启用按钮 */
		$table.find('#btns>ul').prepend('<li class="utt-inline-block"><span>启用密码访问:</span> <input type="checkbox" id="open_pswd" '+(DATA.need_passwd=='off'?'':'checked="true"')+' style="margin-right:15px;position:relative;top:2px"/> </li>');
		$table.find('#btns>ul').prepend('<li class="utt-inline-block"><span>启用存储设备:</span> <input type="checkbox" id="open_ccsb" '+(DATA.enableDevice=='off'?'':'checked="true"')+' style="margin-right:15px;position:relative;top:2px"/> </li>');

		$table.find('#open_pswd,#open_ccsb').click(function(){
			var postStr = 'enableDevice='+($table.find('#open_ccsb').is(':checked')?'on':'off')+
						  '&need_passwd='+($table.find('#open_pswd').is(':checked')?'on':'off');
			$.ajax({
	          url: '/goform/formNetShareManage',
	          type: 'POST',
	          data: postStr,
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
	              if (status == '1') {
	                Tips.showSuccess('{editSuccess}');
	                $('[href="#1"]').trigger('click');
	              } else {
	                Tips.showError('{editFail}');
	              }
	            } else {
	              Tips.showError('{parseStrErr}');
	            }
	          }
	        });

		})

		function otherFunc(tbobj){
		}
		require('Translate').translate([$tableCon],['common','doNetworkManagementStrategy']);

	}


})
