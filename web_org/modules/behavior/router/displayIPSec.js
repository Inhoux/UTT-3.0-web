define(function(require, exports, module) {
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
	var dicArr     = ['common','doPPTPL2TP','error'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	/***单独获取lan口ip**/
	var datagetlanip;
	getLanIp();
	function getLanIp(){
	    $.ajax({
			url: 'common.asp?optType=getLanIp',
			type: 'GET',
			success: function(result) {
			    datagetlanip = result;
			}
	    });
	}
	/*************/
	function processData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = [
					/*表格数据*/
					 	'ids',
						'allow',
						'connType',
						'peer',
						'remoteAddr',
						'remoteMask',
						'remoteUser',
						'remoteUserType',
						'localBind',
						'localAddr',
						'localMask',
						'localUser',
						'localUserType',
						'preshareKey',
						'transform',
						'protocol',
						'srcPort',
						'destPort',
						'negMode',
						'aggresEncrypt',
						'isakmplifetime',
						'policy',
						'lifetime_sec',
						'lifetime_kbytes',
						'anti_replay',
						'dpdEnable',
						'dpdheartbeat',
						'nattEnable',
						'natt_port',
						'natt_keepalive',
						'sa_conn',
						'packet_out',
						'packet_in',
					/*编辑页数据*/	
					];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [	"ids","Enable","SASta","negMode","peer",
				   "remoteAddr","localBind","localAddr","isakmplifetime","pout",
					"pin","connType","remoteMask","remoteUser","remoteUserType",
					"localMask","localUser","localUserType","preshareKey","transform",
					"protocol","srcPort",
					"destPort","aggresEncrypt","policy","lifetime_sec","lifetime_kbytes",
					"anti_replay","dpdEnable","dpdheartbeat","nattEnable","natt_port",
					"natt_keepalive"], // 表格头部的标题列表
				 idsArr =data["ids"],
				 allowArr =data["allow"],
				 connTypeArr =data["connType"],
				 peerArr =data["peer"],
				 remoteAddrArr =data["remoteAddr"],
				 remoteMaskArr =data["remoteMask"],
				 remoteUserArr =data["remoteUser"],
				 remoteUserTypeArr =data["remoteUserType"],
				 localBindArr =data["localBind"],
				 localAddrArr =data["localAddr"],
				 localMaskArr =data["localMask"],
				 localUserArr =data["localUser"],
				 localUserTypeArr =data["localUserType"],
				 preshareKeyArr =data["preshareKey"],
				 transformArr =data["transform"],
				 protocolArr =data["protocol"],
				 srcPortArr =data["srcPort"],
				 destPortArr =data["destPort"],
				 negModeArr =data["negMode"],
				 aggresEncryptArr =data["aggresEncrypt"],
				 isakmplifetimeArr =data["isakmplifetime"],
				 policyArr =data["policy"],
				 lifetime_secArr =data["lifetime_sec"],
				 lifetime_kbytesArr =data["lifetime_kbytes"],
				 anti_replayArr =data["anti_replay"],
				 dpdEnableArr =data["dpdEnable"],
				 dpdheartbeatArr =data["dpdheartbeat"],
				 nattEnableArr =data["nattEnable"],
				 natt_portArr =data["natt_port"],
				 natt_keepaliveArr =data["natt_keepalive"],
				 sa_connArr =data["sa_conn"],
				 packet_outArr =data["packet_out"],
				 packet_inArr=data["packet_in"];

			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
		
		
			// 通过数组循环，转换vlan数据的结构
			idsArr.forEach(function(item, index, arr) {
				var arr = [];
				//arr.push( idsArr[index]);
//				arr.push( idsArr[index].slice(3));
				arr.push( idsArr[index]);
				arr.push( allowArr[index]);
				arr.push( sa_connArr[index]);
				arr.push( negModeArr[index]);
				arr.push( peerArr[index]);
				arr.push( remoteAddrArr[index]);
				arr.push( localBindArr[index]);
				arr.push( localAddrArr[index]);
				arr.push( isakmplifetimeArr[index]);
				arr.push( packet_outArr[index]);
				arr.push( packet_inArr[index]);


				arr.push( connTypeArr[index]);
				arr.push( remoteMaskArr[index]);
				arr.push( remoteUserArr[index]);
				arr.push( remoteUserTypeArr[index]);
				arr.push( localMaskArr[index]);
				arr.push( localUserArr[index]);
				arr.push( localUserTypeArr[index]);
				arr.push( preshareKeyArr[index]);
				arr.push( transformArr[index]);
				arr.push( protocolArr[index]);
				arr.push( srcPortArr[index]);
				arr.push( destPortArr[index]);
				arr.push( aggresEncryptArr[index]);
  				arr.push( policyArr[index]);
				arr.push( lifetime_secArr[index]);
				arr.push( lifetime_kbytesArr[index]);
				arr.push( anti_replayArr[index]);
				arr.push( dpdEnableArr[index]);
				arr.push( dpdheartbeatArr[index]);
				arr.push( nattEnableArr[index]);
				arr.push( natt_portArr[index]);
				arr.push( natt_keepaliveArr[index]);
				
				
				dataArr.push(arr);
			});
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
			return {
				table: tableData,
			};
		} else {
			console.log('字符串解析失败')
		}
	}

function getTableDom() {

		var btnList = [
			 {
		          "id"   : "add",
		          "name" : "{add}",
		          "clickFunc":function($this){
		          		addBtnClick();
		          }
		      },
		      {
		          "id"   : "delete",
		          "name" : "{delete}",
		          "clickFunc":function($this){

		          		deleteBtnClick();
					}
		       }
		      
		];
		var headData = {
			"btns" : btnList
		};
		var database = DATA["tableData"];
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			"dicArr"     :['common','doPPTPL2TP'],
			"titles": {
				"{tunnelName}"	 : {
					"key" : "ids",
					"type" : 'text'
				},
				"{open}"       : {
								"key": "Enable",
								"type": "checkbox",
								"values": {
									"yes": true,
									"no": false,
								},
								"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								
								changeStatus(data[0], $this);
							}
				},
				"{connectStatus}"     :	{
								"key": "SASta",
								"type": "text",
								"values": {
									"0": '{unconnect}',
									"1": '{IKEArrange}',
									"2": '{IPSecArrange}',
									"3": '{inConnenct}'
									}
								},
				"{arrangeMode}"     :	{
								"key": "negMode",
								"type": "text",
								"values": {
									"Main": '{mainMode}',
									"Aggres": '{aggresMode}'
									}
								},
				"{remoteGw}"   : {
					"key" : 'peer',
					"type" : 'text'
				},
				"{remoteIn}"   : {
					"key" : 'remoteAddr',
					"type" : 'text'
				},
				// "本地绑定"	 : "localBind",
				"{localBind}"	 : 	{
								"key": "localBind",
								"type": "text",
								"values": {
									"0"	: "LAN",
									"1" : 'WAN1',
									"2" : 'WAN2',
									"3" : 'WAN3',
									"4" : 'WAN4',
									"5" : 'WAN5'
									}
								},
				"{localIn}"	   :  {
					"key" : "localAddr",
					"type" : 'text'
				}	,
				"{liveTime}({second})"	   : {
					"key" : "isakmplifetime",
					"type" : 'text'
				},
				/*
				"{outBound}(Byte)" : {
					"key" : "pout",
					"type" : 'text'
				},
				"{inBound}(Byte)" : {
					"key" : "pout",
					"type" : 'text'
				},
				*/
				"{operation}":{
					"key":'',
					"type":"links",
					"links":[
						{
							"id":'',
							"name":'{call}',
							"clickFunc":function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								reqSaClick(data[0], $this);

							}
						},
						{
							"id":'',
							"name":'{hangup}',
							"clickFunc":function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								clearSaClick(data[0],$this);

							}
						}
					]
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
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
								remove(data, $this);
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
function reqSaClick(data, $target) {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');

		var Enable = data["SASta"] ;
		if(Enable=="1")
		{
			Tips.showInfo(T("hasConnected"),2);
		}else{

			// 查询字符串二维数组
			var queryArr = [
				['reqstr', /*"id-"+ */data["ids"]],
			];
			// 调用序列化模块的转换函数，将数组转换为查询字符串
			var queryStr = Serialize.queryArrsToStr(queryArr);
			var waits = Tips.showWaiting(T('reqSaClicking'));
			// 向后台发送请求
			Tips.showSuccess('{tryConnect}', 2);
			$.ajax({
				url: '/goform/IPSec_ReqSA',
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
						waits.remove();
						var data = result["data"],
							status = data['status'];
						// 后台修改成功
						
						if (status) {
							// 显示成功信息
							//Tips.showSuccess("建立连接成功!", 2);
							display($('#1'));

						} else {
							// 显示失败信息
							//Tips.showError('建立连接失败', 2);
							display($('#1'));
						}

					} else {
						Tips.showError('{netErr}!', 2);
					}
				}
			});
		}
	}
function clearSaClick(data, $target) {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');

		var Enable = data["SASta"] ;
		if(Enable=="0")
		{
			Tips.showInfo(T("hasDisconnected"),2);
		}else{

			// 查询字符串二维数组
			var queryArr = [
				['sa_delstr', /*"id-"+ */data["ids"]],
			];
			// 调用序列化模块的转换函数，将数组转换为查询字符串
			var queryStr = Serialize.queryArrsToStr(queryArr);
			// 向后台发送请求
			var waits = Tips.showWaiting(T('clearSaClicking'));
			$.ajax({
				url: '/goform/IPSec_Clear',
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
						waits.remove();
						var data = result["data"],
							status = data['status'];
						// 后台修改成功
						
						if (status) {
							// 显示成功信息
							Tips.showSuccess("{saveSuccess}");
							display($('#1'));

						} else {
							// 显示失败信息
							//Tips.showError('断开连接失败', 2);
						}

					} else {
						//Tips.showError('网络故障!', 2);
					}
				}
			});
		}
	}
function editSubmitClick($container,config) {
	var data = config.data;
		// 引入serialize模块
		var Tips = require('Tips');
		var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($container),
			queryJson = Serialize.queryArrsToJson(queryArr);
			queryJson.ids=/*'id-'+ */queryJson.ids;
		var	queryStr = Serialize.queryJsonToStr(queryJson);
		 var ids_old = data["ids"];

//		var str = 'ids_old=id-' + ids_old;
		var str = 'ids_old=' + ids_old;
		// 合并url字符串
		queryStr = Serialize.mergeQueryStr([queryStr, str]);
		// queryStr = queryStr.replace("PPTPC_","PC_");
		// queryStr = queryStr.replace("PPTPS_","PS_");
		//获得提示框组件调用方法
	    var InputGroup = require('InputGroup');                                                                                         
	    var tips = require('Tips');
	    var len = InputGroup.checkErr($container);
	    if(len > 0)
	    {   
//	      tips.showError('{errNoSave}');
	      return;
	    }		
	    
//	    console.log(queryJson.remoteAddr);
//	    console.log(queryJson.localAddr);
//	    console.log(data);
//	    console.log(DATA["tableData"].getSelect());
	   if(!remoteLocalIP(data,queryJson)){
	   		tips.showConfirm(T('{IPsecaddrconf}'),function(){
		   			forajax()
	   		},function(){
	   			
	   		});
	   }else{
	   	forajax()
	   }
	   
	   function forajax(){
	   		$.ajax({
					url: '/goform/IPSecIsakmp_Config',
					type: 'POST',
					data: queryStr,
					success: function(result) {
						var doEval = require('Eval');
						var codeStr = result,
							variableArr = ['status', 'errorstr'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
							
						if (isSuccess) {
							var data = result["data"],
								status = data['status'];
							if (status) {
								
								Tips.showSuccess('{saveSuccess}', 2);
								display($('#1'));
								
							} else 
		                    {
								var errorstr=data.errorstr;
								tips.showWarning(errorstr);
							}
						} else {
							Tips.showWarning('{netErr}', 2);
						}
					}
				});
	   }
	   
		
	}

function remoteLocalIP(data,queryJson){
	 var cansave = true;
	    DATA["tableData"].getSelect().forEach(function(obj,i){
	    	if(data.primaryKey !== obj.primaryKey){
	    		if(obj.remoteAddr == queryJson.remoteAddr && obj.localAddr == queryJson.localAddr){
	    			cansave = false;
	    		}
	    	}
	    });
	    return cansave;
}

function addSubmitClick($container) {
		var Tips = require('Tips');
	    var InputGroup = require('InputGroup');
		// 引入serialize模块
		var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($container),
			queryJson = Serialize.queryArrsToJson(queryArr);
			/*IPSec 名称命名规范和C语言一致，所以这里给加个前缀，防止数字开头导致语法错误*/
			queryJson.ids=/*"id-"+*/queryJson.ids;
		var	queryStr = Serialize.queryJsonToStr(queryJson);
		var str = 'Action=add' ;
		// 合并url字符串
		queryStr = Serialize.mergeQueryStr([queryStr, str]);
		
		//获得提示框组件调用方法
                                                                                         
	    var tips = require('Tips');
	    var len = InputGroup.checkErr($container);
	    if(len > 0)
	    {   
//	      tips.showError('{errNoSave}');
	      return;
	    }	
	    
	    if(!remoteLocalIP({},queryJson)){
	    	tips.showConfirm(T("{IPsecaddrconf}"),function(){
	    		forajax();
	    	},function(){
	    		
	    	})
	   }else{
	   		forajax();
	   }
	    
	    function forajax(){
	    	$.ajax({
				url: '/goform/IPSecIsakmp_Config',
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
							display($('#1'));
						} else 
	                    {
							var errorstr=data.errorstr;
							tips.showWarning(errorstr);
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
function remove(data, $target) {
		var ID = data["ids"];
//		var queryStr = 'ids=id-' + ID;
		var queryStr = 'ids=' + ID;
		var Tips = require('Tips');
		Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
		function delete_no(){
				display($('#1'));
		}
		function delete_ok(){
			$.ajax({
				url: '/goform/IPSecList_Del',
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
							var Dispatcher = require('Dispatcher');
							Dispatcher.reload(2);
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

		var Enable = (data["Enable"] == 'yes') ? 'no' : 'yes';

		var Tips = require('Tips');
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');
		// 查询字符串二维数组
		var queryArr = [
			['AllowID', /*"id-"+ */data["ids"]],
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
						
						display($('#1'));

					} else {
						// 显示失败信息
						Tips.showError('{oprtFail}', 2);
					}

				} else {
					Tips.showError('{netErr}', 2);
				}
			}
		});
	}
function editBtnClick( $this){
		var primaryKey = $this.attr('data-primaryKey');
		var database = DATA["tableData"];
		DATA["primaryKey"] = primaryKey;
		var data           = database.getSelect({"primaryKey" : primaryKey})[0];
		

		var config = {
			"tabTitle":'{edit}',
			"saveFunc"  :editSubmitClick,
			"data":data,
			"type":"edit",
			"container": $('#1')
		};
		editAndAddBtnClick(config);
}
function editAndAddBtnClick(config) {
		/*改标签*/
		var Path = require('Path');
		Path.changePath(T('TuneSet'));
		$('[href="#1"]').text(T('TuneSet'));

			var data = config.data || {};
			var type = config.type;
			var $container = config.container;
			var saveFunc = config.saveFunc;
			var wanCount=DATA["wanCount"] || '1'; 
			
			var connType = data["connType"] || '0',
			ids = data["ids"] || '',
			peer = data["peer"] || '',
			remoteAddr = data["remoteAddr"] || '',
			remoteMask = data["remoteMask"] || '',
			remoteUser = data['remoteUser'] || '',
			remoteUserType = data['remoteUserType'] || '',
			localBind = data['localBind'] || '1',
			localAddr =data['localAddr'] || '',
			localMask = data['localMask'] || '',
			localUser = data['localUser'] || '',
			localUserType = data['localUserType'] || '',
			preshareKey = data['preshareKey'] || '',
			lifetime_sec = data['lifetime_sec'] || '3600',
			
			negMode=data['negMode'] || 'Main',
			isakmplifetime=data['isakmplifetime'] || '28800',
			
			anti_replay = data['anti_replay'] || '',
			dpdEnable = data['dpdEnable'] || 'off',
			nattEnable = data['nattEnable'] || 'off',
			dpdheartbeat = data['dpdheartbeat'] || '',
			natt_port = data['natt_port'] || '',
			natt_keepalive = data['natt_keepalive'] || '',
			isOpen = data['allow'] || '',
			transform = data['transform'] == undefined ?'':data['transform'].split(':') ,
			policy=data['policy'] == undefined ?'':data['policy'].split(':') || '';
			if(transform.length>0){
				transform.forEach(function(obj,n){transform[n] = obj.substring(4)});
			}
			if(policy.length>0){
				policy.forEach(function(obj,n){policy[n] = obj.substring(2)});
			}

			/*localBindItem*/
			var localBindItem = [];
			
			DATA['bindName'].forEach(function(obj){
				var itemname = Number(obj);
				if(itemname !== NaN && itemname>0 && itemname<6){
					localBindItem.push({name:'WAN'+itemname, value:itemname});
				}else if(itemname !== NaN && itemname === 0){
					localBindItem.push({name:'LAN', value:itemname});
				}else{
					localBindItem.push({name:obj, value:obj});
				}
			});
		var inputList = [
	
				{
					"prevWord": '{connType}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'connType',
		            "defaultValue":connType,
		            "items" : [
		                {
		                    "value" : '1',
		                    "name"  : '{Gw2Gw}',
		                    
		                },
		                {
		                    "value" : '2',
		                    "name"  : '{domain2Gw}',
		                
		                },
		                 {
		                    "value" : '3',
		                    "name"  : '{otherDomain2Local}',
		                   
		                }
		            	]
		            }
		        },
		        {
					"necessary" :true,
					"prevWord": '{tunnelName}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'ids',
		            "value":ids,
		            "checkDemoFunc" : ['checkInput','name','1','31','5']/*在头部会加上id-*/
		        	}
		        },
		        {
					"inputData" : {
						"type" : "title",
						"name"  : "{remoteSet}"
					}
				},
				{
					"necessary" :true,
					"prevWord": '{GwAddrdomain}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'peer',
		            "value":peer,
		            "checkFuncs":['checkDomainName']
		        	}
		        },
		        {
					"necessary" :true,
					"prevWord": '{remoteLan}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'remoteAddr',
		            "value":remoteAddr,
		            "checkFuncs":['checkIP']
		        	}
		        },

		        {
					"necessary" :true,
					"prevWord": '{remoteLanMask}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'remoteMask',
		            "value":config.type == 'add' ? ('255.255.255.0') : remoteMask,
		            "checkFuncs" : ['re_checkMask']
		        	}
		        }
		        ,
		         {
					// "necessary" :true,
					"prevWord": '{ID}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'remoteUser',
		            "value":remoteUser
		        	}
		        },
		        {
		        "prevWord": '{userType}',
		        "inputData": {
		            "type": 'select',
		            "name": 'remoteUserType',
		            "defaultValue":remoteUserType||'IKE_FQDN',
		            "items" : [
		                {
		                    "value" : 'IKE_FQDN',
		                    "name"  : '{domainName}'
		                    
		                },
		                {
		                    "value" : 'IKE_USERFQDN',
		                    "name"  : '{EmailAddr}'
		                    
		                },
		                {
		                    "value" : 'IKE_IPV4ADDR',
		                    "name"  : '{IPAddr}'
		                    
		                },
		            ]
		        	},
		        "afterWord": ''
		    	}
		    	,
		        {
					"inputData" : {
						"type" : "title",
						"name"  : "{localSet}"
					}
				},
				{
					// "necessary" :true,
					"prevWord": '{localBind}',
					
		        	"inputData": {
		        	//"count": wanCount, 
		            "type": 'select',
		            "name": 'localBind',
		            "defaultValue":localBind,
		            "items" : localBindItem 

		            /*[
		            	{
		                    "value" : '0',
		                    "name"  : 'LAN',   
		                },
		                {
		                    "value" : '1',
		                    "name"  : 'WAN1',   
		                },
		                {
		                    "value" : '2',
		                    "name"  : 'WAN2',
		                },
		                 {
		                    "value" : '3',
		                    "name"  : 'WAN3',
		                }
		                ,
		                 {
		                    "value" : '4',
		                    "name"  : 'WAN4',  
		                }
		                ,
		                 {
		                    "value" : '5',
		                    "name"  : 'WAN5',  
		                }
		            	]*/
		        	}
		        },
		        {
					"necessary" :true,
					"prevWord": '{localInaddr}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'localAddr',
		            /*"value":localAddr,getLanIp()*/
		            "value":config.type == 'add' ? datagetlanip : localAddr,
		            "checkFuncs" : ['checkIP']
		        	}
		        },
		        {
					"necessary" :true,
					"prevWord": '{localInMask}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'localMask',
		            "value":config.type == 'add' ? ('255.255.255.0') : localMask,
		            "checkFuncs" : ['re_checkMask']
		        	}
		        },
		         {
					// "necessary" :true,
					"prevWord": '{ID}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'localUser',
		            "value":localUser
		        	}
		        },
		        {
		        "prevWord": '{userType}',
		        "inputData": {
		            "type": 'select',
		            "name": 'localUserType',
		            "defaultValue":localUserType||'IKE_FQDN',
		            "items" : [
		                {
		                    "value" : 'IKE_FQDN',
		                    "name"  : '{domainName}'
		                },
		                {
		                    "value" : 'IKE_USERFQDN',
		                    "name"  : '{EmailAddr}'
		                },
		                {
		                    "value" : 'IKE_IPV4ADDR',
		                    "name"  : '{IPAddr}'
		                },
		            ]
		        	},
		        "afterWord": ''
		    	}
		    	,
		        {
					"inputData" : {
						"type" : "title",
						"name"  : "{secureOption}"
					}
				},
			  	{
					"necessary" :true,
					"prevWord": '{preshareKey}',
		        	"inputData": {
		            "type": 'password',
		            "name": 'preshareKey',
		            "value":preshareKey,
		            "checkDemoFunc" : ['checkName','0','128'],
		            "eye":true
		        	}
		        },
		        {
					// "necessary" :true,
					"prevWord": '{encryptionAuthAlgorithm}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'transform[0]',
		            "defaultValue":transform[0] ? transform[0]:'300',
		            "items" : [
		                {
		                    "value" : '200',
		                    "name"  : 'esp-3des',   
		                },
		                {
		                    "value" : '100',
		                    "name"  : 'esp-des',
		                },
		                 {
		                    "value" : '110',
		                    "name"  : 'esp-des-md5',
		                }
		                ,
		                 {
		                    "value" : '120',
		                    "name"  : 'esp-des-sha',  
		                }
		                ,
		                 {
		                    "value" : '210',
		                    "name"  : 'esp-3des-md5',  
		                }
		                ,
		                 {
		                    "value" : '220',
		                    "name"  : 'esp-3des-sha',  
		                }
		                ,
		                 {
		                    "value" : '300',
		                    "name"  : 'esp-aes128',  
		                }
		                ,
		                 {
		                    "value" : '400',
		                    "name"  : 'esp-aes192',  
		                }
		                ,
		                 {
		                    "value" : '500',
		                    "name"  : 'esp-aes256',  
		                }
		                ,
		                 {
		                    "value" : '310',
		                    "name"  : 'esp-aes128-md5',  
		                }
		                ,
		                 {
		                    "value" : '320',
		                    "name"  : 'esp-aes129-sha',  
		                }
		                ,
		                 {
		                    "value" : '410',
		                    "name"  : 'esp-aes129-md5',  
		                }
		                ,
		                 {
		                    "value" : '420',
		                    "name"  : 'esp-aes192-md5',  
		                }
		                ,
		                 {
		                    "value" : '510',
		                    "name"  : 'esp-aes256-md5',  
		                }
		                ,
		                 {
		                    "value" : '520',
		                    "name"  : 'esp-aes256-sha',  
		                }
		            	]
		        	}
		        },
		        	{
					"inputData" : {
						"type" : "link",
						"items":[
							{
								"id"	: "highChoosen",
								"name"  : "{advancedOption}",
								
								 "initFunc":function($thisDom){
				                        $thisDom.click(function(){
				                          var $container = $('#1');
				                          highChoosenClick($container);
				                        });
				                    }
							}
						]
						
					}
				},
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'negMode',
			            "value":negMode
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'isakmplifetime',
			            "value":isakmplifetime

		            }
		        },
				 
		         {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'policy[0]',
			            "value":policy[0]||'212'
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'policy[1]',
			            "value":policy[1]||'222'
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'policy[2]',
			            "value":policy[2]||'112'
		            }
		        },
		         {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'policy[3]',
			            "value":policy[3]||'122'
		            }
		        },
		         {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'transform[1]',
			            "value":transform[1]||'000'
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'transform[2]',
			            "value":transform[2]||'000'
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'transform[3]',
			            "value":transform[3]||'000'
		            }
		        },
		        {
		        	"display" :false,
					"inputData": {
		            "type": 'text',
		            "name": 'lifetime_sec',
		            "value": lifetime_sec
		            }
		        },
		         {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'anti_replay',
			            "value":anti_replay
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'dpdEnable',
			            "value":dpdEnable
		            }
		        },
		        {
					"display" :false,
		        	"inputData": {
			            "type": 'text',
			            "name": 'nattEnable',
			            "value":nattEnable
		            }
		        },
		    	{
		    		"display" :false,
				    "inputData": {
				        "type": 'text',
				        "name": 'dpdheartbeat',
				        "value":dpdheartbeat
				    },
				}
				,
		    	{
		    		"display" : false,
				    "inputData": {
				        "type": 'text',
				        "name": 'natt_port',
				        "value":natt_port
				    },
				}
				,
		    	{
		    		"display" :false,
				    "inputData": {
				        "type": 'text',
				        "name": 'natt_keepalive',
				        "value": natt_keepalive
				    },
				}
		 ];
		 
		
	
		displayEditPage(inputList,config);
	}
	/*
	高级选项

	 */
function highChoosenClick($container){
    	var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($container),
			queryJson = Serialize.queryArrsToJson(queryArr);
		
		var modalList = {
    		"id" : "highChoosen",
    		"title": "{advancedOption}",
    		"size" : "normal",
    		"btns" : [
		        {
		            "type"      : 'save',
		            "name"      : '{save}',
		            "clickFunc" : function($this){
		            	var newmodals = $this.parents('.modal');
		               	highChoosenSubmitClick(newmodals,$container);
		            }
		        },
		        {
		            "type"      : 'reset' ,
		            "name"      : '{reset}',
		         }
		         ,
		        {
		            "type"      : 'close',
		            "name"		: '{close}'
		        }
		    ]
    	};
    	var Modal = require('Modal');
		var modalobj = Modal.getModalObj(modalList),
		$newModal = modalobj.getDom(); // 模态框的jquery对象
		$('body').append($newModal);
		$newModal.modal('show');

	var inputList = [
			{	
					
					"inputData" : {
						"type" : "title",
						"name"  : "{firstStage}"
					}
				},
		        {
					// "necessary" :true,
					"prevWord": '{arrangeMode}',
					
		        	"inputData": {
		            "type": 'select',
		            "name": 'negMode',
		            "defaultValue":queryJson.negMode,
		            "items" : [
		                {
		                    "value" : 'Main',
		                    "name"  : '{mainMode}',
		                    
		                },
		                {
		                    "value" : 'Aggres',
		                    "name"  : '{aggresMode}',
		                
		                }
		            	]
		            }
		        },
		        {
					"necessary" :true,
					
					"prevWord": '{liveTime}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'isakmplifetime',
		            "value": queryJson.isakmplifetime,
			        "checkDemoFunc":["checkNum","600","86400"]
		        	},
		        	"afterWord":'{min}'
		        },
		        {
					// "necessary" :true,
					 
					"prevWord": '{encryptionAuthAlgorithm1}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'policy[0]',
		            "defaultValue":queryJson['policy[0]'],
		            "items" : [
		                {
		                    "value" : '212',
		                    "name"  : '3des-md5-group2',   
		                },
		                {
		                    "value" : '213',
		                    "name"  : '3des-md5-group5',
		                },
		                 {
		                    "value" : '222',
		                    "name"  : '3des-sha-group2',
		                }
		                ,
		                 {
		                    "value" : '223',
		                    "name"  : '3des-sha-group5',  
		                }
		                ,
		                 {
		                    "value" : '112',
		                    "name"  : 'des-md5-group2',  
		                }
		                ,
		                 {
		                    "value" : '113',
		                    "name"  : 'des-md5-group5',  
		                }
		                ,
		                 {
		                    "value" : '122',
		                    "name"  : 'des-sha-group2',  
		                }
		                ,
		                 {
		                    "value" : '123',
		                    "name"  : 'des-sha-group5',  
		                }
		                
		            	]
		        	}
		        },
		         {
					// "necessary" :true,
					
					"prevWord": '{encryptionAuthAlgorithm2}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'policy[1]',
		             "defaultValue":queryJson['policy[1]'],
		            "items" : [
		                {
		                    "value" : '212',
		                    "name"  : '3des-md5-group2',   
		                },
		                {
		                    "value" : '213',
		                    "name"  : '3des-md5-group5',
		                },
		                 {
		                    "value" : '222',
		                    "name"  : '3des-sha-group2',
		                }
		                ,
		                 {
		                    "value" : '223',
		                    "name"  : '3des-sha-group5',  
		                }
		                ,
		                 {
		                    "value" : '112',
		                    "name"  : 'des-md5-group2',  
		                }
		                ,
		                 {
		                    "value" : '113',
		                    "name"  : 'des-md5-group5',  
		                }
		                ,
		                 {
		                    "value" : '122',
		                    "name"  : 'des-sha-group2',  
		                }
		                ,
		                 {
		                    "value" : '123',
		                    "name"  : 'des-sha-group5',  
		                }
		                
		            	]
		        	}
		        },
		         {
					// "necessary" :true,
					
					"prevWord": '{encryptionAuthAlgorithm3}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'policy[2]',
		             "defaultValue":queryJson['policy[2]'],
		            "items" : [
		                {
		                    "value" : '212',
		                    "name"  : '3des-md5-group2',   
		                },
		                {
		                    "value" : '213',
		                    "name"  : '3des-md5-group5',
		                },
		                 {
		                    "value" : '222',
		                    "name"  : '3des-sha-group2',
		                }
		                ,
		                 {
		                    "value" : '223',
		                    "name"  : '3des-sha-group5',  
		                }
		                ,
		                 {
		                    "value" : '112',
		                    "name"  : 'des-md5-group2',  
		                }
		                ,
		                 {
		                    "value" : '113',
		                    "name"  : 'des-md5-group5',  
		                }
		                ,
		                 {
		                    "value" : '122',
		                    "name"  : 'des-sha-group2',  
		                }
		                ,
		                 {
		                    "value" : '123',
		                    "name"  : 'des-sha-group5',  
		                }
		                
		            	]
		        	}
		        },
		         {
		         	
					// "necessary" :true,
					"prevWord": '{encryptionAuthAlgorithm4}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'policy[3]',
		             "defaultValue":queryJson['policy[3]'],
		            "items" : [
		                {
		                    "value" : '212',
		                    "name"  : '3des-md5-group2',   
		                },
		                {
		                    "value" : '213',
		                    "name"  : '3des-md5-group5',
		                },
		                 {
		                    "value" : '222',
		                    "name"  : '3des-sha-group2',
		                }
		                ,
		                 {
		                    "value" : '223',
		                    "name"  : '3des-sha-group5',  
		                }
		                ,
		                 {
		                    "value" : '112',
		                    "name"  : 'des-md5-group2',  
		                }
		                ,
		                 {
		                    "value" : '113',
		                    "name"  : 'des-md5-group5',  
		                }
		                ,
		                 {
		                    "value" : '122',
		                    "name"  : 'des-sha-group2',  
		                }
		                ,
		                 {
		                    "value" : '123',
		                    "name"  : 'des-sha-group5',  
		                }
		                
		            	]
		        	}
		        },
		        {
		        	
					"inputData" : {
						"type" : "title",
						"name"  : "{secStage}"
					}
				},
				{
					
					// "necessary" :true,
					"prevWord": '{encryptionAuthAlgorithm2}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'transform[1]',
		             "defaultValue":queryJson['transform[1]'],
		            "items" : [
		                {
		                    "value" : '000',
		                    "name"  : '------------------',   
		                },
		                {
		                    "value" : '200',
		                    "name"  : 'esp-3des',   
		                },
		                {
		                    "value" : '100',
		                    "name"  : 'esp-des',
		                },
		                 {
		                    "value" : '110',
		                    "name"  : 'esp-des-md5',
		                }
		                ,
		                 {
		                    "value" : '120',
		                    "name"  : 'esp-des-sha',  
		                }
		                ,
		                 {
		                    "value" : '210',
		                    "name"  : 'esp-3des-md5',  
		                }
		                ,
		                 {
		                    "value" : '220',
		                    "name"  : 'esp-3des-sha',  
		                }
		                ,
		                 {
		                    "value" : '300',
		                    "name"  : 'esp-aes128',  
		                }
		                ,
		                 {
		                    "value" : '400',
		                    "name"  : 'esp-aes192',  
		                }
		                ,
		                 {
		                    "value" : '500',
		                    "name"  : 'esp-aes256',  
		                }
		                ,
		                 {
		                    "value" : '310',
		                    "name"  : 'esp-aes128-md5',  
		                }
		                ,
		                 {
		                    "value" : '320',
		                    "name"  : 'esp-aes129-sha',  
		                }
		                ,
		                 {
		                    "value" : '410',
		                    "name"  : 'esp-aes129-md5',  
		                }
		                ,
		                 {
		                    "value" : '420',
		                    "name"  : 'esp-aes192-md5',  
		                }
		                ,
		                 {
		                    "value" : '510',
		                    "name"  : 'esp-aes256-md5',  
		                }
		                ,
		                 {
		                    "value" : '520',
		                    "name"  : 'esp-aes256-sha',  
		                }
		            	]
		        	}
		        },
		        {
		        	
					// "necessary" :true,
					"prevWord": '{encryptionAuthAlgorithm3}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'transform[2]',
		             "defaultValue":queryJson['transform[2]'],
		            "items" : [
		            	{
		                    "value" : '000',
		                    "name"  : '------------------',   
		                },
		                {
		                    "value" : '200',
		                    "name"  : 'esp-3des',   
		                },
		                {
		                    "value" : '100',
		                    "name"  : 'esp-des',
		                },
		                 {
		                    "value" : '110',
		                    "name"  : 'esp-des-md5',
		                }
		                ,
		                 {
		                    "value" : '120',
		                    "name"  : 'esp-des-sha',  
		                }
		                ,
		                 {
		                    "value" : '210',
		                    "name"  : 'esp-3des-md5',  
		                }
		                ,
		                 {
		                    "value" : '220',
		                    "name"  : 'esp-3des-sha',  
		                }
		                ,
		                 {
		                    "value" : '300',
		                    "name"  : 'esp-aes128',  
		                }
		                ,
		                 {
		                    "value" : '400',
		                    "name"  : 'esp-aes192',  
		                }
		                ,
		                 {
		                    "value" : '500',
		                    "name"  : 'esp-aes256',  
		                }
		                ,
		                 {
		                    "value" : '310',
		                    "name"  : 'esp-aes128-md5',  
		                }
		                ,
		                 {
		                    "value" : '320',
		                    "name"  : 'esp-aes129-sha',  
		                }
		                ,
		                 {
		                    "value" : '410',
		                    "name"  : 'esp-aes129-md5',  
		                }
		                ,
		                 {
		                    "value" : '420',
		                    "name"  : 'esp-aes192-md5',  
		                }
		                ,
		                 {
		                    "value" : '510',
		                    "name"  : 'esp-aes256-md5',  
		                }
		                ,
		                 {
		                    "value" : '520',
		                    "name"  : 'esp-aes256-sha',  
		                }
		            	]
		        	}
		        },
		        {
		        	
					// "necessary" :true,
					"prevWord": '{encryptionAuthAlgorithm4}',
		        	"inputData": {
		            "type": 'select',
		            "name": 'transform[3]',
		             "defaultValue":queryJson['transform[3]'],
		            "items" : [
		            	{
		                    "value" : '000',
		                    "name"  : '------------------',   
		                },
		                {
		                    "value" : '200',
		                    "name"  : 'esp-3des',   
		                },
		                {
		                    "value" : '100',
		                    "name"  : 'esp-des',
		                },
		                 {
		                    "value" : '110',
		                    "name"  : 'esp-des-md5',
		                }
		                ,
		                 {
		                    "value" : '120',
		                    "name"  : 'esp-des-sha',  
		                }
		                ,
		                 {
		                    "value" : '210',
		                    "name"  : 'esp-3des-md5',  
		                }
		                ,
		                 {
		                    "value" : '220',
		                    "name"  : 'esp-3des-sha',  
		                }
		                ,
		                 {
		                    "value" : '300',
		                    "name"  : 'esp-aes128',  
		                }
		                ,
		                 {
		                    "value" : '400',
		                    "name"  : 'esp-aes192',  
		                }
		                ,
		                 {
		                    "value" : '500',
		                    "name"  : 'esp-aes256',  
		                }
		                ,
		                 {
		                    "value" : '310',
		                    "name"  : 'esp-aes128-md5',  
		                }
		                ,
		                 {
		                    "value" : '320',
		                    "name"  : 'esp-aes129-sha',  
		                }
		                ,
		                 {
		                    "value" : '410',
		                    "name"  : 'esp-aes129-md5',  
		                }
		                ,
		                 {
		                    "value" : '420',
		                    "name"  : 'esp-aes192-md5',  
		                }
		                ,
		                 {
		                    "value" : '510',
		                    "name"  : 'esp-aes256-md5',  
		                }
		                ,
		                 {
		                    "value" : '520',
		                    "name"  : 'esp-aes256-sha',  
		                }
		            	]
		        	}
		        },
		        {
					"necessary" :true,
					
					"prevWord": '{liveTime}',
		        	"inputData": {
		            "type": 'text',
		            "name": 'lifetime_sec',
		            "value": queryJson.lifetime_sec,
		            "checkDemoFunc":["checkNum","600","172800"]
		        	},
		        	"afterWord":'{min}'
		        },
		          {
		          	
					"inputData" : {
						"type" : "title",
						"name"  : "{other}"
					}
				}
				,
				 {
				 	
			        "prevWord": '{antiReplay}',
			        "inputData": {
			            "type": 'checkbox',
			            "name": 'anti_replay',
			            "defaultValue":queryJson.anti_replay,
			            "items" : [
			                   {"value" : 'on', "name" : '',"checkOn":'on',"checkOff":'off'}
			                   ]
			        },
			        "afterWord": ''
		    	}
		    	,
				 {
				 	
			        "prevWord": 'DPD',
			        "inputData": {
			            "type": 'checkbox',
			            "name": 'dpdEnable',
			             "defaultValue":queryJson.dpdEnable,
			            "items" : [
			                   {"value" : 'on', "name" : '',"checkOn":'on',"checkOff":'off'}
			                   ]
			        },
			        "afterWord": ''
		    	}
		    	,

				{
					
			        "prevWord": '{NATTraversal}',
			        "inputData": {
			            "type": 'checkbox',
			            "name": 'nattEnable',
			             "defaultValue":queryJson.nattEnable,
			            "items" : [
			                   {"value" : 'on', "name" : '',"checkOn":'on',"checkOff":'off'}
			                   ]
			        },
			        "afterWord": ''
		    	}
		    	,
		    	{
		    		
				    "prevWord": '{heartBeatsec}',
				    "disabled":true,
				    "inputData": {
				        "type": 'text',
				        "name": 'dpdheartbeat',
				        "value":queryJson.dpdheartbeat,
				        "checkFunc": ['checkNum','0','65535']
				    },
				    "afterWord": ''
				}
				,
		    	{
		    		
				    "prevWord": '{port}',
				     "disabled":true,
				    "inputData": {
				        "type": 'text',
				        "name": 'natt_port',
				        "value":queryJson.natt_port
				        // "checkFunc": 'checkHello',
				        // "errorStr": '名称错误'
				    },
				    "afterWord": ''
				}
				,
		    	{
		    		
				    "prevWord": '{keepLive}',
				     "disabled":true,
				    "inputData": {
				        "type": 'text',
				        "name": 'natt_keepalive',
				        "value": queryJson.natt_keepalive
				        // "checkFunc": 'checkHello',
				        // "errorStr": '名称错误'
				    },
				    "afterWord": ''
				}
		];
		
		

		var InputGroup = require('InputGroup');
		var $input = InputGroup.getDom(inputList);
		var _dp = $input.find('[name="dpdheartbeat"]');
		var _np = $input.find('[name="natt_port"]');
		var _nk = $input.find('[name="natt_keepalive"]');

			makeTheHighInitChange2();
		$input.find('[name="dpdEnable"],[name="nattEnable"]').change(function(){
			makeTheHighInitChange1();
		});
		

		function makeTheHighInitChange1(){
			if($input.find('[name="dpdEnable"]').is(':checked')){
				_dp.val('20').removeAttr('disabled');
			}else{
				_dp.val('').attr('disabled','disabled');
			}

			if($input.find('[name="nattEnable"]').is(':checked')){
				_np.val('4500').removeAttr('disabled');
				_nk.val('20').removeAttr('disabled');
				
			}else{
				_np.val('').attr('disabled','disabled');
				_nk.val('').attr('disabled','disabled');
			}
		}
		function makeTheHighInitChange2(){
			if($input.find('[name="dpdEnable"]').is(':checked')){
				_dp.removeAttr('disabled');
			}else{
				_dp.val('').attr('disabled','disabled');
			}

			if($input.find('[name="nattEnable"]').is(':checked')){
				_np.removeAttr('disabled');
				_nk.removeAttr('disabled');
				
			}else{
				_np.val('').attr('disabled','disabled');
				_nk.val('').attr('disabled','disabled');
			}
		}

		$newModal.find('.modal-body').empty().append($input);
		$newModal.modal('show');
		var Translate  = require('Translate');
		var tranDomArr = [$newModal];
		var dicArr     = ['common','doPPTPL2TP'];
		Translate.translate(tranDomArr, dicArr);

    }
    /*
    高级弹框保存
     */
    function highChoosenSubmitClick(newmodals,$container){
    	var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs(newmodals),
			queryJson = Serialize.queryArrsToJson(queryArr);
			queryArr.forEach(function(obj){
			    $container.find('[name="'+obj[0]+'"]').val(obj[1]);
			});
			var InputGroup = require('InputGroup');
			var tips = require('Tips');
			var len = InputGroup.checkErr(newmodals);
			if(len > 0)
			{
			    return;
			}else{
			    newmodals.modal('hide');
			    setTimeout(function(){
				newmodals.remove();
			    },450);
			}
    }
	/**
	 * 为表格中的开启、删除、编辑按钮添加点击事件
	 * @author JeremyZhang
	 * @date   2016-09-08
	 * @param  {[type]}   $container [description]
	 * @return {[type]}              [description]
	 */
	
	function addBtnClick() {
		var config = {
			"tabTitle":'{add}',
			"saveFunc"  :addSubmitClick,
			"type":"add",
			"container": $('#1')
		};

		 editAndAddBtnClick(config);

	
		
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
				var name = /*"id-"+ */data[0]["ids"];
				str += name + ',';
			});
			str = str.substr(0, str.length - 1);
			str = 'ids=' + str;
			Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
			function delete_no(){
				display($('#1'));
			}
			function delete_ok(){
				$.ajax({
					url: '/goform/IPSecList_Del',
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
								display($('#1'));
							} else {
								Tips.showError('{delFail}', 2);
								display($('#1'));
							}
						} else {
							Tips.showError('{netErr}', 2);
						}
					}
				});
			}
		} else {
			Tips.showWarning(T('pleaseSelectDelName'), 2);
		}
	}
	/*暂时不用*/
	function deleteAllBtnClick() {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		Tips.showConfirm(T('delconfirm'),clicktrue);
		function clicktrue(){
			$.ajax({
				url: '/goform/IPSecList_DelAll',
				type: 'POST',
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
							Tips.showSuccess('{saveSuccess}');
							
						} else {
							Tips.showError('失败', 2);
						}
					} else {
						Tips.showError('字符串失败', 2);
					}
				}
			});
		}
			
		
	}
	/**
	 * 为表格上方按钮添加交互事件
	 * @author JeremyZhang
	 * @date   2016-08-31
	 */

	function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr = [	"ids","Enable","SASta","negMode","peer",
				   "remoteAddr","localBind","localAddr","isakmplifetime","pout",
					"pin","connType","remoteMask","remoteUser","remoteUserType",
					"localMask","localUser","localUserType","preshareKey","transform",
					"protocol","srcPort",
					"destPort","aggresEncrypt","policy","lifetime_sec","lifetime_kbytes",
					"anti_replay","dpdEnable","dpdheartbeat","nattEnable","natt_port",
					"natt_keepalive"];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}
	/*
	输入框组信息制作
	 */
	function inputsPageList(editdatas){
		var datas = editdatas || {};
		var inputList={

		};
	}
	/*
	编辑,新增页制作方法
	 */
	function displayEditPage(inputList,config){
		// $('#highChoosen').click();
		// $('#save').click();
		var type = config.type;
		var $container = config.container;
		var saveFunc = config.saveFunc;
		var inputLists = inputList;
		var InputGroup = require('InputGroup');
		var $inputs = InputGroup.getDom(inputLists);

		var vals = $inputs.find('[name="connType"]').val();
		var peer = $inputs.find('[name="peer"]');
		var remoteUser = $inputs.find('[name="remoteUser"]').parent().parent();
		var remoteUserType = $inputs.find('[name="remoteUserType"]').parent().parent();
		var localUser = $inputs.find('[name="localUser"]').parent().parent();
		var localUserType = $inputs.find('[name="localUserType"]').parent().parent();

		makeTheInitChange();
		$inputs.find('[name="connType"]').change(function(){
			vals = $(this).val();
			makeTheInitChange();
			makeThenegModeChange();
		});
		function makeThenegModeChange(){//改变高级选项中的协商模式
			switch(vals){
				case '1' :			
					$inputs.find('[name="negMode"]').val('Main');		
					break;
				case '2' :
					$inputs.find('[name="negMode"]').val('Aggres');		
					break;
				case '3' :
					$inputs.find('[name="negMode"]').val('Aggres');
					break;
				default:
					break;
			}
		}

		function makeTheInitChange(){
			switch(vals){
				case '1' :
				peer.removeAttr('disabled');
					remoteUser.hide();
					remoteUserType.hide();
					localUser.hide();
					localUserType.hide();
					break;
				case '2' :
					peer.removeAttr('disabled');
					remoteUser.show();
					remoteUserType.show();
					localUser.show();
					localUserType.show();
					break;
				case '3' :
					peer.attr('disabled','disabled');
					$inputs.find('[name="peer"]').val('0.0.0.0');
					remoteUser.show();
					remoteUserType.show();
					localUser.show();
					localUserType.show();
					break;
				default:
					break;
			}
		}

		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		            // $btn 是模块自动传入的，一般不会用到
		             /*改标签*/
					var Path = require('Path');
					Path.changePath(T('TuneList'));
					$('[href="#1"]').text(T('TuneList'));

		            saveFunc($container,config);
		        }
		    },
		    {
		        "id"        : 'reset',
		        "name"      : '{reset}'
		    },
		    {
		        "id"        : 'cancel',
		        "name"      : '{back}',
		        "clickFunc" : function($btn){
		            // $btn 是模块自动传入的，一般不会用到
		            /*改标签*/
					var Path = require('Path');
					Path.changePath(T('TuneList'));
					$('[href="#1"]').text(T('TuneList'));
		           display($container);
		            
		        }
		    }
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		$container.empty().append($inputs,$btnGroup);
		
		var Translate  = require('Translate');
		var tranDomArr = [$('#content')];
		var dicArr     = ['common','doPPTPL2TP'];
		Translate.translate(tranDomArr, dicArr);
	}

function displayTable($container) {
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		//向后台发送请求，获得表格数据
		$.ajax({
			url: 'common.asp?optType=IPSec',
			type: 'GET',
			success: function(result) {
				var data = processData(result),
					tableData = data["table"];
				
				var	titleArr  = tableData["title"],
					tableArr  = tableData["data"];
			// 将vlan数据存入数据表
			storeTableData(tableArr);
			
			var $table = getTableDom();
			// 将表格放入页面
			$tableCon.append($table);
			
			}
		});
		$.ajax({
			url: 'common.asp?optType=WanIfCount|PPTPCLIENT|PPTPSERVER',
			type: 'GET',
			success: function(result) {
				var doEval = require('Eval');
				
				var codeStr=result,variableArr = ['wanIfCount','PC_setNames','srv_instNames'];
				result=doEval.doEval(codeStr,variableArr);

				DATA["wanCount"] = result['data']["wanIfCount"];
				DATA['bindName'] = [];
				 for(var i=1;i<=DATA["wanCount"];i++){
				 	DATA['bindName'].push(i);
				 }
				 	DATA['bindName'].push(0);
				 for(var i=0;i<result.data['PC_setNames'].length;i++){
				 	DATA['bindName'].push('PPTPC_'+result.data['PC_setNames'][i]);
				 }
				 for(var i=0;i<result.data['srv_instNames'].length;i++){
				 	DATA['bindName'].push('PPTPS_'+result.data['srv_instNames'][i]);
				 }
				
			}
		});
	}




	function display($container) {
		// 清空标签页容器
		$container.empty();
		displayTable($container);
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doPPTPL2TP'];
		Translate.translate(tranDomArr, dicArr);
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
