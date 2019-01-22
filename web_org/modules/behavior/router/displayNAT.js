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
					 	"RuleIDs",
						"NatTypes",
						"OutIPs",
						"InFromIPs",
						"InEndIPs",
						"Binds"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = ["RuleIDs",
							"NatTypes",
							"OutIPs",
							"InFromIPs",
							"InEndIPs",
							"Binds"], // 表格头部的标题列表
				RuleIDsArr  =data['RuleIDs']||["0"],
				NatTypesArr =data['NatTypes'],
				OutIPsArr   =data['OutIPs'],
				InFromIPsArr=data['InFromIPs'],
				InEndIPsArr =data['InEndIPs'],
				BindsArr    =data['Binds'];

			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
		
		
			// 通过数组循环，转换vlan数据的结构
			RuleIDsArr.forEach(function(item, index, arr) {
				var arr = [];
				arr.push( RuleIDsArr[index]);
				arr.push( NatTypesArr[index]);
				arr.push( OutIPsArr[index]);
				arr.push( InFromIPsArr[index]);
				arr.push( InEndIPsArr[index]);
				arr.push( BindsArr[index]);
		
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
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id": "add",
				"name": T("add"),
				 "clickFunc" : function($btn){
	          		addBtnClick();
	        	}
			},
			{
				"id": "delete",
				"name": T("delete"),
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
			"dicArr"      : ['common', 'doPortMapping'],
			"titles": {
				"{rulename}"		 : {
					"key": "RuleIDs",
					"type": "text"
				},
				"{NATType}"     :	{
								"key": "NatTypes",
								"type": "text",

								"values": {
									"1": 'Easy IP',
									"2": 'One2One',
									"3": 'Passthrough'
									}
				},
				"{IPinFRROM}"   :{
					"key" : "InFromIPs",
					"type": "text"
				},
				"{IPoutTo}"   : {
					"key" : "InEndIPs" ,
					"type": "text"
				},
				"{outStartIP}"   : {
					"key" : "OutIPs",
					"type": "text"
				},
				// "本地绑定"	 : "localBind",
				"{bindInterface}"	 : 	{
								"key": "Binds",
								"type": "text",
								"values": {
									"WAN1" : 'WAN1',
									"WAN2" : 'WAN2',
									"WAN3" : 'WAN3',
									"WAN4" : 'WAN4',
									"WAN5" : 'WAN5'
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
								
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								editBtnClick(data[0], $this);
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
		return $table;
	}
	
function editSubmitClick($modal, data, $target) {
		var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
			
		 var RuleIDolds= data["RuleIDs"];

		var str = 'RuleIDolds=' + RuleIDolds;
		// 合并url字符串
		queryStr = Serialize.mergeQueryStr([queryStr, str]);
		//获得提示框组件调用方法
		var Tips = require('Tips');
		/*专业*/
		$modal.find('input,textarea').each(function(){
			if(!$(this).is(':hidden')){
				$(this).blur();
			}
		});
		var errors = $modal.find('.input-error').length;
		if(errors>0){
			$target.blur();
			return false;
		}

		$.ajax({
			url: '/goform/formNatRule',
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
					if (status) {
						// 显示成功信息
						Tips.showSuccess('{saveSuccess}', 2);
						$modal.modal('hide');
						setTimeout(function(){
							$modal.remove();
						},450);
						display($('#2'));
					} else {
						var errorStr = data['errorstr'];
						Tips.showWarning(errorStr, 2);
					}
				} else {
					Tips.showWarning('{netErr}', 2);
				}
			}
		});
		
	}

function addSubmitClick($modal) {
	
		// 引入serialize模块
		var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
		
		$modal.find('input,textarea').each(function(){
			if(!$(this).is(':hidden')){
				$(this).blur();
			}
		});
		var errors = $modal.find('.input-error').length;
		if(errors>0){
			$target.blur();
			return false;
		}
		var Tips = require('Tips');
		$.ajax({
			url: '/goform/formNatRule',
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
					if (status) {
						// 显示成功信息
						Tips.showSuccess('{saveSuccess}', 2);
						$modal.modal('hide');
						setTimeout(function(){
							$modal.remove();
						},450);
						display($('#2'));
						
					} else {
						var errorStr = data['errorstr'];
						Tips.showWarning(errorStr, 2);
					}
				} else {
					Tips.showWarning('{netErr}', 2);
				}
			}
		});
	}
	/**
	 * 删除一条数据
	 * @author JeremyZhang
	 * @date   2016-09-06
	 * @param  {[type]}   $target [description]
	 * @return {[type]}           [description]
	 */
	function remove(data, $target) {
		var delstr = data["RuleIDs"];
		var queryStr = 'delstr=' + delstr;
		var Tips = require('Tips');
		Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
		function delete_no(){
				display($('#2'));
			}
		function delete_ok(){
			$.ajax({
				url: '/goform/formNatRuleDel',
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
							display($('#2'));
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

function changeStatus(data, $target) {
		var Enable = (data["Enable"] == 'no') ? 'yes' : 'no';
		
		//获得提示框组件调用方法
		var Tips = require('Tips');
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');
		// 查询字符串二维数组
		var queryArr = [
			['AllowID', data["ids"]],
			['Allow', Enable]
			
		];
		// 调用序列化模块的转换函数，将数组转换为查询字符串
		var queryStr = Serialize.queryArrsToStr(queryArr);
		// 向后台发送请求
		$.ajax({
			url: '/goform/formIPSecAllow',
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
						// 显示成功信息
						var successMsg = (Enable == 'no') ? '{closeSuccess}' : '{openSuccess}';
						Tips.showSuccess(successMsg, 2);
						display($('#2'));
					} else {
						// 显示失败信息
						var successMsg = (Enable == 'no') ? '{closeFail}' : '{openFail}';
						Tips.showError(successMsg, 2);
						display($('#2'));
					}

				} else {
					Tips.showError('{netErr}', 2);
				}
			}
		});
	}
function editBtnClick(data, $target) {
		// 加载模态框模板模块
		var modal='';

		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": "edit",
			"title": "{edit}",
			"size":'large',
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){
		                
		               
		                editSubmitClick(modal, data,$this);
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
		$('body').append(modal);

		var RuleIDs   = data["RuleIDs"],
			NatTypes  = data["NatTypes"],
			OutIPs    = data['OutIPs'],
			InFromIPs = data['InFromIPs'],
			InEndIPs  = data['InEndIPs'] ,
			Binds     = data['Binds'],
			wanCount  = DATA['wanCount'];
			
		var inputList = [
			{
				"display"	:false,
				"prevWord"	:"{status}",
				"inputData" :{
					"defaultValue" : 'on',
					"type"		   : 'radio',
					"name"		   : 'Enable',
					"items" :[{
						"value"		: 'on',
						"name"  	: '{open}',
						"isChecked" : true
					},{
						"value"		:'off',
						"name"		:'{close}'
					}]
				}
			},
			{
				
				    "display" : true,  //是否显示：否
				    "necessary": true,  //是否添加红色星标：是
				    "prevWord": '{rulename}',
				    "inputData": {
				        "type"       : 'text',
				        "name"       : 'RuleIDs',
				        "value"		 : RuleIDs,
				        "checkDemoFunc" : ['checkInput', 'name', '1', '31', '5'] //自定义含参方法[方法名，参数一，参数二]
				    },

			},
			{   
			        "display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{bindInterface}',
			        "inputData": {
			            "count": wanCount,     //默认显示的行数
			            "defaultValue" : Binds, //默认值对应的value值
			            "type": 'select',
			            "name": 'Binds',
			            "items" : [
			                {
			                    "value" : 'WAN1',
			                    "name"  : 'WAN1',
			                    // "isChecked" : false
			                },
			                {
			                    "value" : 'WAN2',
			                    "name"  : 'WAN2',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN3',
			                    "name"  : 'WAN3',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN4',
			                    "name"  : 'WAN4',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN5',
			                    "name"  : 'WAN5',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN6',
			                    "name"  : 'WAN6',
			                    // "isChecked" : false
			                },
			            ]
			        }
			},

			{
		        "display" : true,  //是否显示：否
		        "necessary": false,  //是否添加红色星标：是
		        "prevWord": '{NATType}',
		        "inputData": {
		            "defaultValue" : NatTypes, //默认值对应的value值
		            "type": 'radio',
		            "name": 'NatTypes',
		            "items": [{
		                "value": '1',
		                "name": 'Easy IP'
		            },
		            {
		                "value": '2',
		                "name" : 'One2One'
		             }
		            ]
		        },
		        "afterWord" :"{word_1}"
			}
    		,
    		{
			    "display" 	: true,  //是否显示：否
			    "necessary" : true,  //是否添加红色星标：是
			    "prevWord"	: '{IPinFRROM}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'InFromIPs',
			        "value"		 : InFromIPs,
			        "checkFuncs" : ['checkIP']
			        // "checkDemoFunc" : ['funcName',data1,data2] //自定义含参方法[方法名，参数一，参数二]
			    }
			},
			{
			    "display" 	: true,  //是否显示：否
			    "necessary" : true,  //是否添加红色星标：是
			    "prevWord"	: '{IPoutTo}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'InEndIPs',
			        "value"		 : InEndIPs,
			        "checkDemoFunc":['checkIPStartToEnd','InFromIPs']
			     }
			},
			{
			    "display" 	: true,  //是否显示：否
			    "necessary" : true,  //是否添加红色星标：是
			    "prevWord"	: '{outIP}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'OutIPs',
			        "value"		 :  OutIPs,
			        "checkFuncs" : ['checkIP']
			       
			    }
			}			    			
		]
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		//绑定交互事件
		makeTheStrChange();
		$dom.find('[name="NatTypes"]').click(function(){
			makeTheStrChange();
		});
		function makeTheStrChange(){
			var radioval = $dom.find('[name="NatTypes"]:checked').val();
			var afterTd = $dom.find('[name="NatTypes"]:checked').parent().next().find('span');
			var prevTd =  $dom.find('[name="OutIPs"]').parent().prev().find('label');
			switch(radioval){
				case '1':
					afterTd.text(T("word_1")).attr('data-local',T('word_1'));
					prevTd.text(T("outIP")).attr('data-local',T("outIP"));
					break;
				case '2':
					afterTd.text(T("word_2")).attr('data-local',T('word_2'));
					prevTd.text(T("outStartIP")).attr('data-local',T("outStartIP"));
					break;
				default:
					break;
			}
		}
		modal.find('.modal-body').empty().append($dom);
		modal.modal('show');

		var Translate  = require('Translate');
		var tranDomArr = [modal];
		var dicArr     = ['common','doPortMapping'];
		Translate.translate(tranDomArr, dicArr);
	}



function addBtnClick() {
		// 加载模态框模板模块
		
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": "modal-add",
			"title": "{add}",
			"size":'large',
			"btns" : [
            {
                "type"      : 'save',
                "clickFunc" : function($this){
                    var $modal = $('#modal-add');
                    addSubmitClick($modal);
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
		// // 获得模态框的html
		var modalobj = Modal.getModalObj(modalList),
			$modal = modalobj.getDom(); // 模态框的jquery对象
		$('body').append($modal);
	
		var inputList = [
			{
				"display"	:false,
				"prevWord"	:"{status}",
				"inputData" :{
					"defaultValue" : 'on',
					"type"		   : 'radio',
					"name"		   : 'Enable',
					"items" :[{
						"value"		: 'on',
						"name"  	: '{open}',
						"isChecked" : true
					},{
						"value"		:'off',
						"name"		:'{close}'
					}]
				}
			},
			{
				
				    "display" : true,  //是否显示：否
				    "necessary": true,  //是否添加红色星标：是
				    "prevWord": '{rulename}',
				    "inputData": {
				        "type"       : 'text',
				        "name"       : 'RuleIDs',
				        "value"		 : "",
				        "checkDemoFunc" : ['checkInput', 'name', '1', '31', '5'] //自定义含参方法[方法名，参数一，参数二]
				    },

			},
			{   
			        "display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{bindInterface}',
			        "inputData": {
			            "count": DATA["wanCount"],     //默认显示的行数
			            "defaultValue" : 'WAN1', //默认值对应的value值
			            "type": 'select',
			            "name": 'Binds',
			            "items" : [
			                {
			                    "value" : 'WAN1',
			                    "name"  : 'WAN1',
			                    // "isChecked" : false
			                },
			                {
			                    "value" : 'WAN2',
			                    "name"  : 'WAN2',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN3',
			                    "name"  : 'WAN3',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN4',
			                    "name"  : 'WAN4',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN5',
			                    "name"  : 'WAN5',
			                    // "isChecked" : false
			                },
			                 {
			                    "value" : 'WAN6',
			                    "name"  : 'WAN6',
			                    // "isChecked" : false
			                },
			            ]
			        }
			},

			{
		        "display" : true,  //是否显示：否
		        "necessary": false,  //是否添加红色星标：是
		        "prevWord": '{NATType}',
		        "inputData": {
		            "defaultValue" : '1', //默认值对应的value值
		            "type": 'radio',
		            "name": 'NatTypes',
		            "items": [{
		                "value": '1',
		                "name": 'Easy IP',
		                "isChecked": true
		            },
		            {
		                "value": '2',
		                "name" : 'One2One'
		            }]
		        },
		        "afterWord" :"word_1"
    		}
    		,
    		{
			    "display" 	: true,  //是否显示：否
			    "necessary" : true,  //是否添加红色星标：是
			    "prevWord"	: '{IPinFRROM}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'InFromIPs',
			        "value"		 : '0.0.0.0',
			        "checkFuncs" : ['checkIP']
			    }
			},
			{
			    "display" 	: true,  //是否显示：否
			    "necessary" : true,  //是否添加红色星标：是
			    "prevWord"	: '{IPoutTo}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'InEndIPs',
			        "value"		 : '0.0.0.0',
			        "checkDemoFunc":['checkIPStartToEnd','InFromIPs']
	
			    }
			},
			{
			    "display" 	: true,  //是否显示：否
			    "necessary" : true,  //是否添加红色星标：是
			    "prevWord"	: '{outIP}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'OutIPs',
			        "value"		 : '0.0.0.0',
			        "checkFuncs" : ['checkIP']
			    }
			}			    

					
			];
		
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		//绑定交互事件
		makeTheStrChange();
		$dom.find('[name="NatTypes"]').click(function(){
			makeTheStrChange();
		});
		function makeTheStrChange(){
			var radioval = $dom.find('[name="NatTypes"]:checked').val();
			var afterTd = $dom.find('[name="NatTypes"]:checked').parent().next().find('span');
			var prevTd =  $dom.find('[name="OutIPs"]').parent().prev().find('label');
			switch(radioval){
				case '1':
					afterTd.text(T("word_1")).attr('data-local',T('word_1'));
					prevTd.text(T("outIP")).attr('data-local',T("outIP"));
					break;
				case '2':
					afterTd.text(T("word_2")).attr('data-local',T('word_2'));
					prevTd.text(T("outStartIP")).attr('data-local',T("outStartIP"));
					break;
				default:
					break;
			}
		}


		$modal.find('.modal-body').empty().append($dom);
		
		$modal.modal('show');
		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','doPortMapping'];
		Translate.translate(tranDomArr, dicArr);
	
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
				var name = data[0]["RuleIDs"];
				str += name + ',';
			});
			str = str.substr(0, str.length - 1);
			str = 'delstr=' + str;
			Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
			function delete_no(){
				display($('#2'));
			}
			function delete_ok(){
				$.ajax({
					url: '/goform/formNatRuleDel',
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
								Tips.showSuccess('{delSuccess}', 3);
								display($('#2'));
							} else {
								var errorStr = data['errorstr'];
							Tips.showWarning('{delFail}' + errorStr, 3);
							display($('#2'));
							}
						} else {
							Tips.showError('{netErr}', 3);
						}
					}
				});
		  	}
		} else {
			Tips.showWarning('{upleSelectDelName}', 3);
		}
	
}


	function storeTableData(data) {
		
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr = ["RuleIDs",
						"NatTypes",
						"OutIPs",
						"InFromIPs",
						"InEndIPs",
						"Binds",
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
			url: 'common.asp?optType=natRule',
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
				
				$tableCon.append($table);
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
		$('#checkOn').remove();
		$('.nav .u-onoff-span1').remove();
		$container.empty();
		displayTable($container);
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
