define(function(require, exports, module) {
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
	var dicArr     = ['common','doPortMapping', 'error'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
function processData(jsStr) {
		//console.log(jsStr)
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
						"IDs",
						"ConfigEnables",
						"IPs",
						"Protocols",
						"PortStr",
						"NatBinds",
						"PortNums"
						];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
			console.dir(result);
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
						"IDs",
						"ConfigEnables",
						"IPs",
						"Protocols",
						"ProtocDisplay",
						"PortStr",
						"NatBinds"
						], // 表格头部的标题列表
				IDsArr  		=data['IDs'],
				ConfigEnablesArr=data['ConfigEnables'],
				IPsArr 			=data['IPs'],
				ProtocolsArr    =data['Protocols'],
				PortStrArr		=data['PortStr'],
				NatBindsArr		=data['NatBinds'],
				PortNumsArr		=data['PortNums'];
				
				
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
		    var ProtocDisplayArr = [];
			
				var result = [];
				PortStrArr.forEach(function(item){
					var arr1 = [];
					var innerArr = item.split(',');
					innerArr.forEach(function(str){
						str = str.replace(/:/g, '~');
						var arr2 = str.split('~');
						arr1.push(arr2);
					});
					result.push(arr1);
				});
				DATA.Port=result;

				var result1 = [];
				ProtocolsArr.forEach(function(item){
					var arr1 = [];
					var innerArr = item.split('-');
					
					result1.push(innerArr);
				});
				DATA.Proto=result1;
				//console.log(DATA);
		

			// 通过数组循环，转换vlan数据的结构
			IDsArr.forEach(function(item, index, arr) {
				var arr = [];
				if ((ProtocolsArr[index].indexOf("1")>=0)&&(ProtocolsArr[index].indexOf("2")>=0)
					||ProtocolsArr[index].indexOf("3")>=0){
					ProtocDisplayArr[index]='3';
				}else if(ProtocolsArr[index].indexOf("1")>=0){
					ProtocDisplayArr[index]='1';
				}else{
					ProtocDisplayArr[index]='2';
				}
				arr.push( IDsArr[index]);
				arr.push( ConfigEnablesArr[index]);
				arr.push( IPsArr[index]);
				arr.push( ProtocolsArr[index]);
				arr.push( ProtocDisplayArr[index]);
				arr.push( PortStrArr[index]);
				arr.push( NatBindsArr[index]);
		
				dataArr.push(arr);
			});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			//console.log(tableData);
		
			return {
				table: tableData,
		
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
		}];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			"dicArr":['common','doPortMapping'],
			otherFuncAfterRefresh:afterFunc,
			"titles": {
				"{rulename}"		 : {
					"key"	:"IDs",
					"type"  :"text"
				},
				"{open}"       : {
								"key": "ConfigEnables",
								"type": "checkbox",
								"values": {
									"1": true,
									"0": false
									},
								
								"clickFunc" : function($this){
									changeStatusBtnClick($this);
								}
				},
				
				"{inIPAddr}"     :{
					"key" : "IPs",
					"type": "text"
				},
				
				"{protocol}"   :{
								"key": "ProtocDisplay",
								"type": "text",
								"values": {
									"1": 'TCP',
									"2": 'UDP',
									"3": 'TCP/UDP'
									}
								},

				"{interfaceMapRe}"   : {
					"key":"PortStr" ,
					"type":"text"
				},
				
				"{NATBind}"	 : 	{
								"key": "NatBinds",
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
								})[0];
								if(checkEnable(data.IDs,"edit"))
									editBtnClick($this);
								}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								
								var data = database.getSelect({
									primaryKey: primaryKey
								})[0];
								// 删除这条数据
								if(checkEnable(data.IDs,"remove")){
									deleteClick($this);
								}
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
		
		function afterFunc(thisTableObj){
			thisTableObj.getDom().find('[type="checkbox"][data-table-type="select"][data-primarykey="0"]').remove();
			thisTableObj.getDom().find('span[data-local="pptp"],span[data-local="l2tp"]').parent().parent().find('[data-column-title="{open}"]').find('input[type="checkbox"]').attr('disabled','disabled');
			thisTableObj.getDom().find('span[data-local="pptp"],span[data-local="l2tp"]').parent().parent().find('input[data-table-type="select"]').remove();
		}
	
		return $table;
	}
function checkEnable(data,action){
		var Tips = require('Tips');
		if(action == "remove"){
			if(data=="admin" || data=="l2tp" || data == "pptp"){
				Tips.showWarning(T("delSysName"));
				return 0;
			}
		}else{
			if(data=="admin"){
				Tips.showWarning(T("plsGoRemoteManPage"));
				return 0;
			}else if(data=="l2tp" || data == "pptp"){
				Tips.showWarning(T("nEditThis"));
				return 0;
			}
		}
		return 1;

	}
function editSubmitClick() {
	var Serialize = require('Serialize');
	var primaryKey = DATA["primaryKey"];
	var database   = DATA["tableData"];
	var $modal = $('#modal-edit');
	$modal.find('input,textarea').blur();
	var data = database.getSelect({"primaryKey" : primaryKey})[0];
	// 将模态框中的输入转化为url字符串
	if(require('InputGroup').checkErr($modal)>0){
		return;
	}
	var queryArr = Serialize.getQueryArrs($modal),
		queryJson = Serialize.queryArrsToJson(queryArr),
		queryStr = Serialize.queryArrsToStr(queryArr);
	var RuleIDolds= data["IDs"];
	queryStr=queryStr.substr(0,queryStr.indexOf('&Protocols'));
	// queryStr=queryStr.replace('','');
	//console.log(queryStr);
	var strTest = Serialize.serializeArray($modal);
	var Proto=[];
	var inS=[];
	var inE=[];
	var outS=[];
	var outE=[];
	var PortNums=0;
	strTest.forEach(function(item){
		var name=item.name;
		if(name=='inS'){
			inS.push(item.value);
		}
		if(name=='inE'){
			inE.push(item.value);
		}
		if(name=='outS'){
			outS.push(item.value);
		}
		if(name=='outE'){
			outE.push(item.value);
		}
		if(name=='Protocols'){
			Proto.push(item.value);
		}
	});
	

	var strPort='';
	inS.forEach(function(item,index,arr){
		strPort+='&Protocols['+index+']='+Proto[index]+'&OutPortS['+index+']='
		+outS[index]+'&OutPortE['+index+']='+outE[index]+'&InnerPortS['+index+']='
		+inS[index]+'&InnerPortE['+index+']='+inE[index];
	});
	//console.log(strPort);
	queryStr=queryStr+'&IDold='+data['IDs']+'&PortNums='+inS.length+strPort;
	//console.log(queryStr);
	//获得提示框组件调用方法
	var Tips = require('Tips');
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
	if(checkPort(inS,inE,outS,outE,Proto))
		{
			//console.log(queryStr);
			// return;
			$.ajax({
			url: '/goform/formNatStaticMap',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
					//console.log(result);
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
							display($('#1'));

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
	
}
function checkPort(inS,inE,outS,outE,Proto){
		// console.log(inS);
		// console.log(inE);
		// console.log(outS);
		// console.log(outE);

		var PostFlag=1;
		inS.forEach(function(item,index){
			var temp=index+1;
			/*非数字检测*/
			if(inS[index] === '' || inE[index] === '' ||outS[index] === '' ||outE[index] === ''){
				Tips.showWarning(T("Num")+temp+"行端口未输入完整");
				PostFlag = 0;
			}else if(!Number(inS[index]) || !Number(inE[index]) || !Number(outS[index]) || !Number(outE[index])){
				Tips.showWarning(T("Num")+temp+T("err1"));
				PostFlag = 0;
			}
			/*数值越界检测*/
			if(inS[index]<0||inS[index]>65535||
			   inE[index]<0||inE[index]>65535||
			   outS[index]<0||outS[index]>65535||
			   outE[index]<0||outE[index]>65535
				){
					Tips.showWarning(T("Num")+temp+T("err5"));
					PostFlag = 0;
			}
		});
		if(PostFlag){
			inS.forEach(function(item,index){
				var temp=index+1;
				/*结束端口不能小于其实端口*/
				if(parseInt(inS[index])>parseInt(inE[index]) || parseInt(outS[index])>parseInt(outE[index])){
					Tips.showWarning(T("Num")+temp+T("err2"));
					PostFlag = 0;
				}else if((parseInt(inE[index])-parseInt(inS[index])) != (parseInt(outE[index])-parseInt(outS[index]))){
					Tips.showWarning(T("Num")+temp+T("err3"));
					PostFlag = 0;
				}
			});
		}
		if(PostFlag){
			for (var index =0;index <inS.length;index++){
				var temp=index+1;
				for(var i=0;i<inS.length;i++){
					if(i == index) continue;
					var tempi=i+1;
					if((inS[i]==inS[index]) && (inE[i]==inE[index])&&(outS[i]==outS[index])&&(outE[i]==outE[index])&&(Proto[i]==Proto[index])){
						Tips.showWarning(T("Num")+tempi+T("err4_2")+temp+T("err4_3"));
						PostFlag = 0;
						break;
					}
				}
			}
		}
		return PostFlag;
	}

function addSubmitClick() {
	// 引入serialize模块
	var Serialize = require('Serialize');
	var database   = DATA["tableData"];
	var $modal = $('#modal-add');
	if(require('InputGroup').checkErr($modal)>0){
		return;
	}
	// 将模态框中的输入转化为url字符串
	var queryArr = Serialize.getQueryArrs($modal),
		queryJson = Serialize.queryArrsToJson(queryArr),
		queryStr = Serialize.queryArrsToStr(queryArr);
	//console.log('addSubmitClick');
	//console.log(queryStr);
	queryStr=queryStr.substr(0,queryStr.indexOf('&Protocols'));
	// queryStr=queryStr.replace('','');
	
	var strTest = Serialize.serializeArray($modal);
	//console.log(strTest);
	var Proto=[];
	var inS=[];
	var inE=[];
	var outS=[];
	var outE=[];
	var PortNums=0;
	strTest.forEach(function(item,index,arr){
		var name=item.name;
		if(name=='inS'){
			inS.push(item.value);
		}
		if(name=='inE'){
			inE.push(item.value);
		}
		if(name=='outS'){
			outS.push(item.value);
		}
		if(name=='outE'){
			outE.push(item.value);
		}
		if(name=='Protocols'){
			Proto.push(item.value);
		}
	});
	
	
	
	var strPort='';
	inS.forEach(function(item,index,arr){
		strPort+='&Protocols['+index+']='+Proto[index]+'&OutPortS['+index+']='
		+outS[index]+'&OutPortE['+index+']='+outE[index]+'&InnerPortS['+index+']='
		+inS[index]+'&InnerPortE['+index+']='+inE[index];
	});
	
	queryStr='Action=add&'+queryStr+'&PortNums='+inS.length+strPort;
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
		if(checkPort(inS,inE,outS,outE,Proto)){
			$.ajax({
			url: '/goform/formNatStaticMap',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
					//console.log(result);
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
						display($('#1'));
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
		
	}
	/**
	 * 删除一条数据
	 * @author JeremyZhang
	 * @date   2016-09-06
	 * @param  {[type]}   $target [description]
	 * @return {[type]}           [description]
	 */
function deleteClick($this) {
		var primaryKey = $this.attr('data-primaryKey');
		console.dir(DATA);
		var database   = DATA["tableData"];
		// 从数据表中拿到要删除的数据，根据后台需要什么就发送什么
		var data = database.getSelect({"primaryKey" : primaryKey})[0];
		var Tips = require('Tips');

		var delstr=data["IDs"];
		var queryStr='delstr='+delstr;
		
		Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
		
		function delete_no(){
				display($('#1'));
		}
		function delete_ok(){
			$.ajax({
				url: '/goform/formNatStaticMapDel',
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
							display($('#1'));
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

function changeStatusBtnClick($this) {
	var primaryKey = $this.attr('data-primaryKey');
	var Serialize = require('Serialize');
	
	var database   = DATA["tableData"];
	var data = database.getSelect({"primaryKey" : primaryKey})[0];
//	console.dir(data);
	var Enable=(data.ConfigEnables==1)?0:1;
	var queryStr='IDs='+data.IDs+'&ConfigEnables='+Enable;
	//console.log(queryStr);
	//获得提示框组件调用方法
	var Tips = require('Tips');
		
		$.ajax({
			url: '/goform/formConfigNatMapEnable',
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
						var successMsg = (Enable == 0) ? T('closeSuccess') : T('openSuccess');
						Tips.showSuccess(successMsg, 2);
						display($('#1'));
					} else {
						// 显示失败信息
						var successMsg = (Enable == 0) ? T('openFail') : T('closeFail');
						Tips.showError(successMsg, 2);
					}

				} else {
					Tips.showError('{netErr}!', 2);
				}
			}
		});
	}


function addBtnClick(){
		var config = {
			"modalID"   	: 'modal-add',
			"modalTitle" 	: '{add}',
			"saveFunc"   	: addSubmitClick,
			"ConfigEnables" : 1,
			"IDs"			: "",
			"Binds"			:"WAN1",
			"IPs"			:"",
			"Protocols"		:"3",
			"inS"			:"",
			"inE"			:"",
			"outS"			:'',
			"outE"			:'',
			"PortCheck" 	:''
			
		};
		showAddAndEditMoal(config);
}
function editBtnClick( $this){
		var primaryKey = $this.attr('data-primaryKey');
		var database = DATA["tableData"];
		DATA["primaryKey"] = primaryKey;
		var data           = database.getSelect({"primaryKey" : primaryKey})[0];
		
		var config = {
			"modalID"   :'modal-edit',
			"modalTitle":'{edit}',
			"saveFunc"  :editSubmitClick,
			"ConfigEnables" :data.ConfigEnables,
			"IDs"		:data.IDs,
			"Binds"		:data.NatBinds,
			"IPs"		:data.IPs,
			"Protocols"	:data["Protocols"].split("-")[0],
			"inS"		:DATA.Port[primaryKey][0][0],
			"inE"		:DATA.Port[primaryKey][0][1],
			"outS"		:DATA.Port[primaryKey][0][2],
			"outE"		:DATA.Port[primaryKey][0][3],
			"PortCheck" :'',
		};
		showAddAndEditMoal(config);
}
	
function showAddAndEditMoal(config) {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": config.modalID,
			"title": config.modalTitle,
			"size":"large1",
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){
		                config.saveFunc();
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
				"display"	:true,
				"prevWord"	:"{status}",
				"inputData" :{
					"defaultValue" : config.ConfigEnables,
					"type"		   : 'radio',
					"name"		   : 'ConfigEnables',
					"items" :[{
						"value"		: '1',
						"name"  	: '{open}',
						// "isChecked" : true
					},{
						"value"		:'0',
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
				        "name"       : 'IDs',
				        "value"		 : config.IDs,
				        "checkDemoFunc" : ['checkInput','name','1','31','2'] 
				    }

			},
			{   
			        "display"  : true,  //是否显示：否
			        "necessary": false,  //是否添加红色星标：是
			        "prevWord" : '{bindInterface}',
			        "inputData": {
			            "count": DATA["wanCount"],     //默认显示的行数
			            "defaultValue" : config.Binds, //默认值对应的value值
			            "type": 'select',
			            "name": 'NatBinds',
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
		        "necessary": true,  //是否添加红色星标：是
		        "prevWord": '{inAddr}',
		        "inputData": {
		            "type": 'text',
		            "name": 'IPs',
		            "value":config.IPs,
		            "checkFuncs" : ['checkStaticIP']
		        },
		        "afterWord":"{word_3}"

		    }
					
		]
		var list = [
				{
					"type"  : "select",
					"name"  : "Protocols",
					"items" : [
						{
							"name"  : "TCP",
							"value" : "1"
						},
						{
							"name"  : "UDP",
							"value" : "2"
						},
						,
						{
							"name"  : "TCP/UDP",
							"value" : "3"
						}
					],
					"defaultValue" : config.Protocols
				},
				{
					"type" : "word",
					"name" : "{inPort}"
				},
				{
					"type"  : "text",
					"name"  : "inS",
					"value" : config.inS
					// ,
					// "checkFunc" :function($this){
					// 	var temp=$this.val();
					// 	if(isNaN(temp)){
					// 		alert("端口必须为数字!");
					// 	}else if(temp<0||temp>65535){
					// 		alert("端口号应为0-65535之间的数字");
					// 	}
						
					// }
				},
				{
					"type" : "word",
					"name" : "~"
				},
				{
					"type"  : "text",
					"name"  : "inE",
					"value" : config.inE
					// ,
					// "checkFunc" : function($this){
					// 	var temp=$this.val();
					// 	if(isNaN(temp)){
					// 		alert("端口必须为数字!");
					// 	}else if(temp<0||temp>65535){
					// 		alert("端口号应为0-65535之间的数字");
					// 	}
						
					// 	var $input = $this.parent().find("input[name='inS']");
					// 	var inStext = $input.val();
					// 	if(temp<inStext){
					// 		alert('结束端口不能小于起始端口');
					// 	}else if((temp-inStext)>500){
					// 		alert("端口数量过大");
					// 	}
						
					// }
				},
				{
					"type" : "word",
					"name" : T("outPort")
				},
				{
					"type"  : "text",
					"name"  : "outS",
					"value" : config.outS
					// ,
					// "checkFunc" : function($this){
					// 	var temp=$this.val();
					// 	if(isNaN(temp)){
					// 		alert("端口必须为数字!");
					// 	}else if(temp<0||temp>65535){
					// 		alert("端口号应为0-65535之间的数字");
					// 	}
					// }
				},
				{
					"type" : "word",
					"name" : "~"
				},
				{
					"type"  : "text",
					"name"  : "outE",
					"value" : config.outE
					// ,
					// "checkFunc" : function($this){
					// 	var temp=$this.val();
					// 	if(isNaN(temp)){
					// 		alert("端口必须为数字!");
					// 	}else if(temp<0||temp>65535){
					// 		alert("端口号应为0-65535之间的数字");
					// 	}
						
					// 	var $input = $this.parent().find("input[name='outS']");
					// 	var inStext = $input.val();
						
					// 	if(temp<inStext){
					// 		alert('结束端口不能小于起始端口');
					// 	}else if((temp-inStext)>500){
					// 		alert("端口数量过大");
					// 	}
					// 	var inN=$this.parent().find("input[name='inE']").val()-$this.parent().find("input[name='inS']").val();
					// 	var ouN=temp-inStext;
						
					// 	if(inN != ouN){
					// 		alert("外部端口数量必须和内部端口数量一致!");
					// 	}
					// }
				}
			];
		var InputRow = require('P_template/common/InputRow');
		var $inputRow = InputRow.getDom(list);
		
		var Fold = require('P_plugin/Fold');
		//console.log(config.modalTitle);
		if(config.modalID=='modal-edit'){
			var $fold = Fold.getDom($inputRow,beforeAdd, add);
			var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);

			modalobj.insert($dom);
			modalobj.insert($fold);
			var database = DATA["tableData"];
			var data = database.getSelect({"primaryKey" : DATA['primaryKey']})[0];
			var ar =DATA.Port[DATA['primaryKey']].concat();
			//console.log(data);
			var pr = data["Protocols"].split("-");
			//console.log(pr);
			pr.shift();
			ar.shift();
			
			function add($fold){
				var $inputRow = $fold.find('li.fold-item:last');
				//alert(ar.length)
				if(ar.length!=0){
					$inputRow.find("select[name='Protocols']>option").removeAttr('selected');
					$inputRow.find("option[value='"+pr[0]+"']").attr("selected",true);
					pr.shift();
					$inputRow.find("input[name='inS']").prop('defaultValue',ar[0][0]);
					$inputRow.find("input[name='inE']").prop('defaultValue',ar[0][1]);
					$inputRow.find("input[name='outS']").prop('defaultValue',ar[0][2]);
					$inputRow.find("input[name='outE']").prop('defaultValue',ar[0][3]);
					ar.shift();
					

				}else{
					$inputRow.find("select[name='Protocols']>option").removeAttr('selected');
					$inputRow.find("select[name='Protocols']>[value='1']").attr('selected',true);
					$inputRow.find("input[name='inS']").prop('defaultValue','').val('');
					$inputRow.find("input[name='inE']").prop('defaultValue','').val('');
					$inputRow.find("input[name='outS']").prop('defaultValue','').val('');
					$inputRow.find("input[name='outE']").prop('defaultValue','').val('');
				}
			}
			var num=ar.length;
			function beforeAdd($fold){
				var $inputRows = $fold.find('.fold-item');
				var count      = $inputRows.length;
				if(count < 10){/*非必要不得修改此值!!!*/
					return true;
				}else{
					return false;
				}
			}
			var $btn = $fold.find('li > button');
			for(var i = 0; i < num; i++){
				$btn.trigger('click');
			}
		}else{
			var $fold = Fold.getDom($inputRow,beforeAddedit,addedit);
			var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
			function addedit($fold){
				var $inputRow = $fold.find('li.fold-item:last');
				$inputRow.find("select[name='Protocols']>option").removeAttr('selected');
				$inputRow.find("select[name='Protocols']>[value='1']").attr('selected',true);
				$inputRow.find("input[name='inS']").prop('defaultValue','').val('');
				$inputRow.find("input[name='inE']").prop('defaultValue','').val('');
				$inputRow.find("input[name='outS']").prop('defaultValue','').val('');
				$inputRow.find("input[name='outE']").prop('defaultValue','').val('');
			}
			function beforeAddedit($fold){
				var $inputRows = $fold.find('.fold-item');
				var count      = $inputRows.length;
				
				if(count < 10){
					return true;
				}else{
					return false;
				}
			}
			modalobj.insert($dom);
			modalobj.insert($fold);
			// 输入框失焦自动填充
			/*
			$inputRow.find('input[name=inS]').blur(function(){
				if($(this).nextAll('input[name=inE]').val()){
					$(this).nextAll('input[name=inE]').val($(this).nextAll('input[name=inE]').val());
				}else{
					$(this).nextAll('input[name=inE]').val($(this).val());
				}
				
			});
			*/
			
			
			
		}
		modalobj.getDom().on('blur','input[name=inS]',function(event){
			if($(this).nextAll('input[name=inE]').val()){
				$(this).nextAll('input[name=inE]').val($(this).nextAll('input[name=inE]').val());
			}else{
				$(this).nextAll('input[name=inE]').val($(this).val());
			}
		})
		
		/*
		$inputRow.find('input[name=outS]').blur(function(){
			if($(this).nextAll('input[name=outE]').val()){
				$(this).nextAll('input[name=outE]').val($(this).nextAll('input[name=outE]').val());
			}else{
				$(this).nextAll('input[name=outE]').val($(this).val())
			}
			
		});
		*/
		modalobj.getDom().on('blur','input[name=outS]',function(event){
			if($(this).nextAll('input[name=outE]').val()){
				$(this).nextAll('input[name=outE]').val($(this).nextAll('input[name=outE]').val());
			}else{
				$(this).nextAll('input[name=outE]').val($(this).val())
			}
		})
		modalobj.show();                      
		
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
		if (length <= 0) {
			Tips.showWarning(T('unSelect'));
			return;
		}
		Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
		function delete_no(){
				display($('#1'));
		}
		function delete_ok(){
			// 判断是否有被选中的选择框
			if (length > 0) {
				var str = '';
				primaryKeyArr.forEach(function(primaryKey) {
					var data = database.getSelect({
						primaryKey: primaryKey
					});
					var name = data[0]["IDs"];
					str += name + ',';
				});
				str = str.substr(0, str.length - 1);
				str = 'delstr=' + str;
				
				$.ajax({
					url: '/goform/formNatStaticMapDel',
					type: 'POST',
					data: str,
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
								// 提示成功信息
								Tips.showSuccess('{delSuccess}', 2);
								display($('#1'));
							} else {
								var errorStr = data['errorstr'];
								Tips.showWarning( T(errorStr), 2);
							}
						} else {
							Tips.showError('{netErr}', 2);
						}
					}
				});
			} else {
			Tips.showInfo('{unSelect}', 2);
			}
		}
	}

	
function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr = [
						"IDs",
						"ConfigEnables",
						"IPs",
						"Protocols",
						"ProtocDisplay",
						"PortStr",
						"NatBinds"
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
			url: 'common.asp?optType=natStatic',
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
