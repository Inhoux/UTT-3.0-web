define(function(require, exports, module) {
	require('jquery');
	// 存储本页面一些变量
	var DATA = {};
	function tl(str){
    	return require('Translate').getValue(str, ['common','doDhcpServer']);
  	} 

	function storeLANData(data) {
		//console.dir(data);
		data.forEach(function(item, index){
			item.unshift(index + 1);
		});
		//console.dir(data);
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["lanData"] = database;
		// 声明字段列表
		var fieldArr = ['lanName', 'mingcheng', 'ip', 'mask', 'vlanid', 'isOpen'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}	 
	function processlanData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = ['lanIpName', 'lanIp', 'lanNetmask',
				'lanIp2Name', 'lanIp2', 'lanNetmask2',
				'lanIp3Name', 'lanIp3', 'lanNetmask3',
				'lanIp4Name', 'lanIp4', 'lanNetmask4',
				'titles1', 'poolNames', 'poolSts', 'poolVids',
				'beginIp', 'netMask', 'lanMac', 'lanMode'
			];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = data["titles1"], // 表格头部的标题列表
				nameArr = data["poolNames"],
				ipArr = data["beginIp"],
				netMaskArr = data["netMask"],
				VlanldArr = data["poolVids"],
				statusArr = data["poolSts"],
				lanIpName = data["lanIpName"],
				lanIps = data["lanIp"],
				lanNMs = data["lanNetmask"],
				lanIp2Name = data["lanIp2Name"],
				lanIp2s = data["lanIp2"],
				lanNM2s = data["lanNetmask2"],
				lanIp3Name = data["lanIp3Name"],
				lanIp3s = data["lanIp3"],
				lanNM3s = data["lanNetmask3"],
				lanIp4Name = data["lanIp4Name"],
				lanIp4s = data["lanIp4"],
				lanNM4s = data["lanNetmask"],
				lanMac = data["lanMac"],
				lanMode = data["lanMode"];
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
			/*
				根据四个lan口的ip是否为0.0.0.0，决定是否显示
			 */
			if (lanIps != '0.0.0.0') {
				var arr = [];
				arr.push(lanIpName);
				arr.push(lanIps);
				arr.push(lanNMs);
				arr.push('默认');
			//	arr.push('on');
				dataArr.push(arr);
			}
			if (lanIp2s != '0.0.0.0') {
				var arr = [];
				arr.push(lanIp2Name);
				arr.push(lanIp2s);
				arr.push(lanNM2s);
				arr.push('默认');
			//	arr.push('on');
				dataArr.push(arr);
			}
			if (lanIp3s != '0.0.0.0') {
				var arr = [];
				arr.push(lanIp3Name);
				arr.push(lanIp3s);
				arr.push(lanNM3s);
				arr.push('默认');
			//	arr.push('on');
				dataArr.push(arr);
			}
			if (lanIp4s != '0.0.0.0') {
				var arr = [];
				arr.push(lanIp4Name);
				arr.push(lanIp4s);
				arr.push(lanNM4s);
				arr.push('默认');
			//	arr.push('on');
				dataArr.push(arr);
			}

			// 通过数组循环，转换vlan数据的结构
			nameArr.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(nameArr[index]);
				arr.push(ipArr[index]);
				arr.push(netMaskArr[index]);
				arr.push(VlanldArr[index]);
				dataArr.push(arr);
			});
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			var LanData = [
				[lanIpName, lanIps, lanNMs, '默认', 'on'],
				[lanIp2Name, lanIp2s, lanNM2s, '默认', 'on'],
				[lanIp3Name, lanIp3s, lanNM3s, '默认', 'on'],
				[lanIp4Name, lanIp4s, lanNM4s, '默认', 'on']
			];
			return {
				table: tableData,
				lan: LanData,
				mac: lanMac,
				mode: lanMode
			};
		} else {
			Tips.showError('{parseStrErr}',3);
		}
	}	 
	function addVLAN(queryArrs, $modal,thisType) {
		var InputGroup = require('InputGroup');
		var tips = require('Tips');
		var len = InputGroup.checkErr($modal);
		if(len > 0)
		{
//			tips.showError('{NoSave}');
			return;
		}
		var Serialize = require('Serialize');
		// 查询字符串的替换数组
		var keyArr = [
			//['lanIpName', 'poolName'],
			['lanIpName', 'org_name'],
			['lanIp', 'dhcpStart'],
			['lanNetmask', 'dhcpMask'],
			['lanVid', 'dhcpVid']
		];
		// 替换从页面获取的查询数组的键
		Serialize.changeKeyInQueryArrs(queryArrs, keyArr);
		// 将查询字符串数组转化为字符串
		var queryStr = Serialize.queryArrsToStr(queryArrs);
		var queryJson = Serialize.queryArrsToJson(queryArrs);
		var id = queryJson.dhcpVid;

		//获得提示框组件调用方法
		var Tips = require('Tips');
		queryStr = queryStr + '&' +'poolName' + '='+ 'VIF' +id+'&'+'DhcpEnable=on';
		// 向后台发送数据，进行新增操作
		$.ajax({
			url: '/goform/formVlanConfig',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				// 执行返回的JS代码
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'];
				var result = doEval.doEval(codeStr, variableArr);
				var isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					var isSuccessful = data["status"];
					// 判断修改是否成功
					if (isSuccessful) {
						// 显示成功信息
						tips.showSuccess('{saveSuccess}');
						// 保存成功
						$.ajax({
							url: 'common.asp?optType=dhcpServerConfig',
							type: 'GET',
							success:function(result1){
								console.log(result1);
								eval(result1);
								if(org_name && originVif && poolVids){
									DATA["VLANIDList"] = [];
									/*
									var cl = vlanIp.length - org_name.length;
									for(var vi = 0;vi<cl;vi++){
										org_name.unshift('');
										vlanConfig.unshift('');
									}
									*/
									originVif.forEach(function(item, index, arr) {
										
										var thisobj = {
											name : org_name[index],
											ip   : vlanIp[index],
											msk  : vlanNetMask[index],
											vid  : vlanConfig[index],
											pname:originVif[index]
										};
										DATA["VLANIDList"].push(thisobj);
										console.log(thisobj);
									});
									var str = '';
									DATA["VLANIDList"].forEach(function(obj,i){
										var vidnotsame = true;
										DATA.poolVids.forEach(function(obj1,i1){
											if(obj.pname == DATA.poolVids[i1]){
												vidnotsame = false;
											}
										})
										if(vidnotsame){
											if(thisType == 'add' && obj.pname == ('VIF'+id)){
												str += '<option value="'+obj.pname+'" selected="selected">'+obj.name+'</option>';
											}else{
												str += '<option value="'+obj.pname+'">'+obj.name+'</option>';
											}
										}
									});
									DATA.modalobj.getDom().find('[name="poolVid"]').empty().append(str);
									if(thisType == 'add'){
										DATA.modalobj.getDom().find('[name="poolVid"]').trigger('change');
									}
									DATA.modalobj1.hide();
								}
							}
						});
					} else {
						var errMsg = result["errorstr"];
						tips.showWarning('{saveFail}');
					}
				} else {
					tips.showError('{parseStrErr}');
				}
			}
		});
	}
	function addLAN(queryArrs, $modal) {
		var InputGroup = require('InputGroup');
		var tips = require('Tips');
		var len = InputGroup.checkErr($modal);
		if(len > 0)
		{
//			tips.showError('{NoSave}');
			return;
		}
		// 获得四条LAN口数据
		var database     = DATA["lanData"];
		var lanOneData   = database.getSelect({lanName : 1});
		var lanTwoData   = database.getSelect({lanName : 2});
		var lanThreeData = database.getSelect({lanName : 3});
		var lanFourData  = database.getSelect({lanName : 4});
		// 获得mac mode
		var lanMac       = DATA["mac"]; 
		var lanMode      = DATA["mode"];

		var lanIpName    = lanOneData[0]["mingcheng"];
		var lanIp        = lanOneData[0]["ip"];
		var lanNetmask   = lanOneData[0]["mask"];

		var lanIp2Name   = lanTwoData[0]["mingcheng"];
		var lanIp2       = lanTwoData[0]["ip"];
		var lanNetmask2  = lanTwoData[0]["mask"];

		var lanIp3Name   = lanThreeData[0]["mingcheng"];
		var lanIp3       = lanThreeData[0]["ip"];
		var lanNetmask3  = lanThreeData[0]["mask"];

		var lanIp4Name   = lanFourData[0]["mingcheng"];
		var lanIp4       = lanFourData[0]["ip"];
		var lanNetmask4  = lanFourData[0]["mask"];

		// 从用户输入中读取数据
		var Serialize = require('Serialize');
		var lanVid = Serialize.getValue(queryArrs, 'lanVid');
		var Ip = Serialize.getValue(queryArrs, 'lanIp');
		var IpName = Serialize.getValue(queryArrs, 'lanIpName');
		var Netmask = Serialize.getValue(queryArrs, 'lanNetmask');
		// 新增的lan的名称
		var lanName = '';
		var ip0 = '0.0.0.0';
		if (lanIp2 == ip0) {
			lanIp2 = Ip;
			lanIp2Name = IpName;
			lanNetmask2 = Netmask;
			lanName = '2';
		} else if (lanIp3 == ip0) {
			lanIp3 = Ip;
			lanIp3Name = IpName;
			lanNetmask3 = Netmask;
			lanName = '3';
		} else if (lanIp4 == ip0) {
			lanIp4 = Ip;
			lanIp4Name = IpName;
			lanNetmask4 = Netmask;
			lanName = '4';
		}
		//获得提示框组件调用方法
		var Tips = require('Tips');
		// 可以添加lan
		if (lanName != '') {
			var queryArrs = [
				['lanIp', lanIp],
				['lanNetmask', lanNetmask],
				['lanIpName', lanIpName],
				['lanIp2', lanIp2],
				['lanNetmask2', lanNetmask2],
				['lanIp2Name', lanIp2Name],
				['lanIp3', lanIp3],
				['lanNetmask3', lanNetmask3],
				['lanIp3Name', lanIp3Name],
				['lanIp4', lanIp4],
				['lanNetmask4', lanNetmask4],
				['lanIp4Name', lanIp4Name],
				['lanMac', lanMac],
				['lanMode', lanMode]
			];
			var queryStr = Serialize.queryArrsToStr(queryArrs);
			$.ajax({
				url: '/goform/ConfigLANConfig',
				type: 'POST',
				data: queryStr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"],
							status = data["status"];
						if (status) {
							// 显示成功信息
							tips.showSuccess('{saveSuccess}');
							DATA.modalobj.hide();
							display($('#1'));
						} else {
							tips.showWarning('{saveFail}');
						}

					} else {
						tips.showWarning('{parseStrErr}');
					}
				}
			});
		} else {
			tips.showWarning('{saveFail}');
		}
	}	 
	function addSubmitClick1($modal,thisType) {
		// 加载序列化模块
		var Serialize = require('Serialize');
		// 获得用户输入的数据
		var queryArrs = Serialize.getQueryArrs($modal);
		// 获得用户输入的vlan
		var lanVid = Serialize.getValue(queryArrs, 'lanVid');
		// 判断是否输入vlan
		if (lanVid == '') {
			// 添加lan
			addLAN(queryArrs, $modal,thisType);
		} else {
			// 添加vlan
			addVLAN(queryArrs, $modal,thisType);
		}
	}	 
	function addYewuVlan(type) {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": "modal-add-vlan",
			"title": "{add}",
			"btns" : [
            {
                "type"      : 'save',
                "clickFunc" : function($this){
                    var $modal = $('#modal-add-vlan');
                    addSubmitClick1($modal,type);
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
		//var modalHTML = Modal.getHTML(modalList),
		$modal = modalobj.getDom(); // 模态框的jquery对象
		DATA.modalobj1=modalobj;

		// $('body').append($modal);
		modalobj.show();
		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		//var dicArr     = ['common', 'lanVlan'];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);

		// 模态框中输入框组的配置数据
		var inputList = [	
		 {
		 	"necessary": true,
			"prevWord": '{name}',
			"inputData": {
				"type": 'text',
				"name": 'lanIpName',
				"checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
			},
			"afterWord": ''
		}, {
			"necessary": true,
			"prevWord": '{ip}',
			"inputData": {
				"type": 'text',
				"name": 'lanIp',
				"checkFuncs" : ['checkIP']
				//"errorStr": 'IP地址错误'
			},
			"afterWord": ''
		}, {
			"necessary": true,
			"prevWord": '{netmask}',
			"inputData": {
				"type": 'text',
				"name": 'lanNetmask',
				'value': '255.255.255.0',
				"checkFuncs" : ['re_checkMask']
				//"errorStr": '子网掩码错误'
			},
			"afterWord": ''
		}, {
			"prevWord": '{profVlan}',
			"necessary": true,
			"inputData": {
				"type": 'text',
				"name": 'lanVid',
				// "checkDemoFunc" : ['checkNum','2','4094']
				"checkDemoFunc" : ['checkNum',(DATA.min_vlanRange !==undefined?DATA.min_vlanRange:'1'),(DATA.max_vlanRange !==undefined?DATA.max_vlanRange:'4094'),'dhcp']
			},
			"afterWord": ''
		}, ];
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		// 将输入框组放入模态框中
		$modal.find('.modal-body').empty().append($dom);
		// 显示模态框
		$('body').append($modal);

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);

		$modal.modal('show');
	}	 
	function addBtnClick() {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		// 模态框配置数据
		var modalList = {
			"id": "modal-add",
			"title": "{add}",
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
		var modalobj = Modal.getModalObj(modalList),
		$modal = modalobj.getDom(); // 模态框的jquery对象
		DATA["modalobj"]=modalobj;
		$('body').append($modal);
		var obj = {};
		var items = [];
		var newArr = DATA["vlanData"][0][2];
		var valArr = DATA["vlanData"][0][0];
		DATA["VLANIDList"].forEach(function(str,index){
			var obj = {};
			var flag=true;
			DATA.poolVids.forEach(function(str1,index1){
				if(valArr[index]==DATA.poolVids[index1]){
					flag=false;
				}
			});
			if(flag == true){
				obj.value = valArr[index];
				obj.name  = newArr[index];
				items.push(obj);	
			}
		});
		var inputList = [
			{
			 	"necessary": true,
				"prevWord": '{poolName}',
				"inputData": {
					"type": 'text',
					"name": 'poolName',
					"checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
				},
				"afterWord": ''
			},		
			{
				"prevWord" : '{poolStatus}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'DhcpEnable',
					"defaultValue": 'on',
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			}, 
		 	{
		        "prevWord": '{interface}{name}',
		        "inputData": {
		            "type": 'select',
		            "name": 'poolVid',
		            "items" : items,
		        },
		        "afterWord": ''
		    },
			{
				"necessary": true,
				"prevWord": '{beginIp}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpStart',
					"checkDemoFunc" : ['checkInput','ip','1']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{endIp}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpEnd',
					"checkDemoFunc" : ['checkInput','ip','1','gt','dhcpStart']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{netmask}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpMask',
					"checkFuncs" : ['re_checkMask']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{GwAddr}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpGateway',
					"checkFuncs" : ['checkIP']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{leaseTime}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpLease',
					"value":"120",
					"checkDemoFunc" : ['checkNum','1','14400']
				},
				"afterWord": '{seconds}'
			}, 
			{
				"necessary": true,
				"prevWord": '{firstDNS}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpPriDns',
					"checkFuncs" : ['checkIP']
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{secDns}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpSecDns',
					"checkDemoFunc": ['checkInput', 'ip', '0', '1']
				},
				"afterWord": ''
			}, 
			{
				"prevWord": 'Option43',
				"inputData": {
					"type": 'select',
					"name": 'option43Type',
					"defaultValue":data.dhcpOption43Types || '0',
					"items" : [ 
					{   
						"value" : '0',
						"name"  : tl('noUse'),
						"control" :'0'
					},  
					{   
						"value" : '1',
						"name"  : tl('hexFixedLength'),
						"control" :'1'
					},  
					{   
						"value" : '2',
						"name"  : tl('hexRandomLength'),
						"control" :'2'
					},  					
						{   
						"value" : '3',
						"name"  : tl('custom'),
						"control" :'3'
						}
					]
				},
				"afterWord": ''
			},
			{
				"sign": '1,2,3',
				"prevWord": tl('ACAddr'),
				"inputData": {
					"type"       : 'text',
					"name"       : 'option43Addr',
					"value":data.dhcpOption43Addrs || '',
					"checkDemoFunc" : ['checkInput','ip','0']
				},
				"afterWord": ''                                                                                                             
			},  
			// {
			// 	"sign": '1,2,3',
			// 	"disabled":true,
			// 	"prevWord": tl('tlvPreview'),
			// 	"inputData": {
			// 		"type"       : 'text',
			// 		"name"       : 'tlv',
			// 		"value":data.dhcpOption43TLV || ''
			// 	},
			// 	"afterWord": ''                                                                                                             
			// }, 			   					
		];
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);

		/* 绑定VALN ID切换时 自动输入 */
		$dom.find('[name="poolVid"]').change(function(){
			autoFill();
		});
		autoFill();
		
		function autoFill(){
			console.log(DATA["VLANIDList"])
			var thisval = $dom.find('[name="poolVid"]').val();
			DATA["VLANIDList"].forEach(function(vobj){
				if(vobj.pname == thisval ){
					$dom.find('[name="dhcpStart"]').val(vobj.ip.substr(0,vobj.ip.lastIndexOf('.'))+'.100'); // 起始ip
					$dom.find('[name="dhcpEnd"]').val(vobj.ip.substr(0,vobj.ip.lastIndexOf('.'))+'.200');	// 结束ip
					$dom.find('[name="dhcpMask"]').val(vobj.msk);	// 子网掩码
					$dom.find('[name="dhcpGateway"]').val(vobj.ip); //  网关地址
					$dom.find('[name="dhcpPriDns"]').val(vobj.ip); // 主DNS服务
				}else{
					return false;
				}
			})
			
			
		}
		
		
	    // 绑定时间
	    $dom.find('[name="option43Type"]').change(function(){
	    	if($(this).val() == '3'){
				require('Tips').showInfo(tl('customInfo'));
	    	}
	    });
		var littles = [{
			id:'littleAdd',
			name :'{add}',
			initFunc : function($this){
				$this.click(function(){
						addYewuVlan('add');
				});
			}
		}];



		InputGroup.insertLink($dom,'poolVid',littles);
		// 将输入框组放入模态框中
		$modal.find('.modal-body').empty().append($dom);
		// 显示模态框

		$('body').append($modal);

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);

		$modal.modal('show');		
	}

	function addSubmitClick($modal) {
		// 加载序列化模块
		var Serialize = require('Serialize');
		// 获得用户输入的数据
		var queryArrs = Serialize.getQueryArrs($modal);
		addDhcp(queryArrs, $modal);
	}

	function addDhcp(queryArrs, $modal) {
		var Serialize = require('Serialize');
		var InputGroup = require('InputGroup');
		var Tips = require('Tips');
		var len = InputGroup.checkErr($modal);
		if(len > 0)
		{
//			Tips.showError('{NoSave}');
			return;
		}
		// 将查询字符串数组转化为字符串
		var jsonStr = Serialize.queryArrsToJson(queryArrs);
		if(jsonStr.poolVid==''||jsonStr.poolVid=='undefined'||jsonStr.poolVid==undefined){
			Tips.showError('{vidIsNull}');
			return;
		}
		var queryStr = Serialize.queryJsonToStr(jsonStr);
		$.ajax({
			url: '/goform/formDhcpPoolConfig',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				// 执行返回的JS代码
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'];
				var result = doEval.doEval(codeStr, variableArr);
				var isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					var isSuccessful = data["status"];
					if (isSuccessful) {
						Tips.showSuccess('{saveSuccess}');
						DATA.modalobj.hide();
						display($('#1'));
					} else {
						var errorstr = data.errorstr;
						Tips.showWarning(errorstr);
					}
				} else {
					tips.showError('{parseStrErr}');
				}
			}
		});
	}

	function deleteBtnClick() {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
		var length  = primaryKeyArr.length;
		// 判断是否有被选中的选择框
		if (length > 0) {
			var lanArr = []; 
			var str = '';
			primaryKeyArr.forEach(function(primaryKey) {	
				var data = database.getSelect({primaryKey : primaryKey});
				var name = data[0]["poolName"];
				str += name + ',';
			});
			if(str != ''){
				str = str.substr(0, str.length - 1);
				str = 'delstr=' + str;
				require('Tips').showConfirm(tl('delconfirm'),function(){
					$.ajax({
						url: '/goform/formDhcpPoolDel',
						type: 'POST',
						data: str,
						success: function(result) {
							var doEval = require('Eval');
							var codeStr = result,
								variableArr = ['status','errorstr'],
								result = doEval.doEval(codeStr, variableArr),
								isSuccess = result["isSuccessful"];
							// 判断代码字符串执行是否成功
							if (isSuccess) {
								var data = result["data"],
									status = data['status'];
								if (status) {
									Tips.showSuccess('{delSuccess}');
									display($('#1'));
								} else {
									var errorstr=data.errorstr;
									if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
										Tips.showWarning('{delFail}');
									}else{
										Tips.showWarning(errorstr);
									}
								}
							} else {
								Tips.showError('{parseStrErr}');
							}
						}
					});
				});
			}
		} else {
			Tips.showWarning('{unSelectDelTarget}');
		}
	}

	function settingBtnClick() {
		var Modal = require('Modal');
		var modalList = {
			"id": "modal-setting",
			"title": "{globalSet}"
		};
		var modalHTML = Modal.getHTML(modalList),
			$modal = $(modalHTML);

		var obj = {};
		var items = [];
		obj.value = '';
		obj.name  = '';
		items.push(obj);
		var newArr = DATA["vlanData"][0][0];
		newArr.forEach(function(str){
			var obj = {};
			obj.value = str;
			obj.name  = str;
			items.push(obj);
		});
		var inputList = [
			{
				"prevWord" : '{dhcpServer}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'DhcpEnable',
					"defaultValue": 'on',
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{dhcpAutoBind}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'DhcpEnable',
					"defaultValue": 'on',
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{dhcpAutoDel}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'DhcpEnable',
					"defaultValue": 'on',
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{dnsProxy}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'DhcpEnable',
					"defaultValue": 'on',
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			}			
		];
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		// 将输入框组放入模态框中
		$modal.find('.modal-body').empty().append($dom);
		// 显示模态框
		$('body').append($modal);
		$modal.modal('show');

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common',,'doDhcpServer'];
		Translate.translate(tranDomArr, dicArr);	
		$modal.modal('show');
		// 为模态框的提交按钮添加事件
		$modal.find('button#submit').click(function(event) {
			addSubmitClick($modal);
		});
	}

	function changeStatus(primaryKey) {
		var database = DATA["tableData"];
		var data = database.getSelect({primaryKey : primaryKey});
		var isOpen = (data[0]["kaiqi"] == 'off') ? 'on' : 'off';
		//获得提示框组件调用方法
		var Tips = require('Tips');
		var Serialize = require('Serialize');
		console.log('----------------------')
		console.log(data[0]['dhcpOption43Types']);

		var optionType;
		if(data[0]['dhcpOption43Types']==tl('noUse')){
			optionType=0;
		}
		if(data[0]['dhcpOption43Types']==tl('hexFixedLength')){
			optionType=1;
		}	
		if(data[0]['dhcpOption43Types']==tl('hexRandomLength')){
			optionType=2;
		}
		if(data[0]['dhcpOption43Types']==tl('custom')){
			optionType=3;
		}else{
			optionType=0;
		}	
				
		console.log(data[0]['dhcpOption43Addrs']);
		var queryArr = [
			['poolName', data[0]["poolName"]],
			['DhcpEnable', isOpen],
			['poolVid', data[0]["poolVid"]],
			['dhcpStart', data[0]["beginIp"]],
			['dhcpEnd', data[0]["endIp"]],
			['dhcpMask', data[0]['netMask']],
			['dhcpPriDns', data[0]['zhuDns']],
			['dhcpSecDns', data[0]['fuDns']],
			['dhcpGateway', data[0]['gateway']],
			['dhcpLease', data[0]['zuTime']],
			['oldName', data[0]['poolName']],
			['option43Type', optionType],
			['option43Addr', data[0]['dhcpOption43Addrs']]
		];
		// 调用序列化模块的转换函数，将数组转换为查询字符串
		var queryStr = Serialize.queryArrsToStr(queryArr);

		console.log(queryStr)
		
		// 向后台发送请求
		$.ajax({
			url: '/goform/formDhcpPoolConfig',
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
						var successMsg = (isOpen == 'off') ? tl('closeSuccess') : tl('openSuccess');
						Tips.showSuccess(successMsg);
						display($('#1'));
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showWarning('{oprtFail}');
						}else{
							Tips.showWarning(errorstr);
							display($('#1'));
						}	
					}
				} else {
					Tips.showError('{oprtFail}');
				}
			}
		});
	}

	function editBtnClick(data, $target) {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": "modal-edit",
			"title": "{edit}",
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){
		                
		                var $modal = $('#modal-edit');
		                editSubmitClick($modal, data, $target);
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
		var modalobj = Modal.getModalObj(modalList),
			$modal = modalobj.getDom(); // 模态框的jquery对象
		$('body').append($modal);
		DATA.modalobj=modalobj;
		var poolName = data["poolName"],
			 kaiqi = data["kaiqi"],
			 yewuvlan = data["yewuvlan"],
			 beginIp = data["beginIp"],
			 endIp = data["endIp"],
			 netMask = data["netMask"],
			 gateway = data["gateway"],
			 zhuDns = data["zhuDns"],
			 fuDns = data["fuDns"],
			 zuTime = data["zuTime"];
			 zuTime=zuTime.substring(0, zuTime.length-2);
			var obj = {};
			var items = [];
			obj.value = '';
			obj.name  = '';
			items.push(obj);
			var newArrValue = DATA["vlanData"][0][0];
			var newArrName = DATA.org_name;	
			var yewuvlanValue=data.yewuvlan;
			

			// newArrValue.forEach(function(str, index){
			// 	var obj = {};
			// 	if(yewuvlan ==  newArrName[index]){
			// 		yewuvlanValue= str;
			// 	}
			// 	obj.value = str;
			// 	obj.name  = newArrName[index];
			// 	items.push(obj);
			// });
			var enable = 'off';
			if (kaiqi == 'on')
				enable = 'on';
			var defaultDisabled=false;
			if(poolName=='default'){
				defaultDisabled=true;
			}
			// alert(data.dhcpOption43Types);
			if(data.dhcpOption43Types==tl('hexFixedLength')){
				data.dhcpOption43Types=1;
				data.dhcpOption43Addrs1=data.dhcpOption43Addrs;
				data.dhcpOption43Addrs2='';
				data.dhcpOption43Addrs3='';
				// data.dhcpOption43TLV1=data.dhcpOption43TLV;
				// data.dhcpOption43TLV2='';
				// data.dhcpOption43TLV3='';

			}
			else if(data.dhcpOption43Types==tl('hexRandomLength')){
				data.dhcpOption43Types=2;
				data.dhcpOption43Addrs1='';
				data.dhcpOption43Addrs2=data.dhcpOption43Addrs;
				data.dhcpOption43Addrs3='';
				// data.dhcpOption43TLV1='';
				// data.dhcpOption43TLV2=data.dhcpOption43TLV;
				// data.dhcpOption43TLV3='';
			}
			else if(data.dhcpOption43Types==tl('custom')){
				data.dhcpOption43Types=3
				data.dhcpOption43Addrs1='';
				data.dhcpOption43Addrs2='';
				data.dhcpOption43Addrs3=data.dhcpOption43Addrs;
				// data.dhcpOption43TLV1='';
				// data.dhcpOption43TLV2='';
				// data.dhcpOption43TLV3=data.dhcpOption43TLV;
			}	
		var inputList = [
			{
			 	"necessary": true,
			 	"disabled": defaultDisabled,
				"prevWord": '{poolName}',
				"inputData": {
					"type": 'text',
					"name": 'poolName',
					"value": poolName,
					// "checkDemoFunc" : ['checkName','1','10']
					"checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
				},
				"afterWord": ''
			},	
			{
				"prevWord" : '{poolStat}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'DhcpEnable',
					"defaultValue": enable,
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			}, 
		 	{
		        "prevWord": '{interface}{name}',
		        "disabled":true,
		        "inputData": {
		            "type": 'text',
		            "name": 'poolVidvf',
		            "value" : yewuvlanValue
		        },
		        "afterWord": ''
		    },		  
		 	{
		        "prevWord": '{interface}{name}',
		        "display":false,
		        "inputData": {
		            "type": 'text',
		            "name": 'poolVid',
		            "value" : data.poolVid
		        },
		        "afterWord": ''
		    },	      
			{
				"necessary": true,
				"prevWord": '{startIp}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpStart',
					"value": beginIp,
					 "checkFuncs" : ['checkIP']

				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{endIp}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpEnd',
					"value":endIp,
					"checkDemoFunc" : ['checkInput','ip','1','gt','dhcpStart']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{subNetmask}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpMask',
					"value":netMask,
					"checkFuncs" : ['re_checkMask']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{gateway}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpGateway',
					"value":gateway,
					"checkFuncs" : ['checkIP']
				},
				"afterWord": ''
			}, 
			{
				"necessary": true,
				"prevWord": '{leaseTime}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpLease',
					"value":zuTime,
					"checkDemoFunc" : ['checkNum','2','14400']
				},
				"afterWord": '{dhcpMinute}'
			}, 
			{
				"necessary": true,
				"prevWord": '{firstDNS}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpPriDns',
					"value":zhuDns,
					"checkFuncs" : ['checkIP']
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{secDns}',
				"inputData": {
					"type": 'text',
					"name": 'dhcpSecDns',
					"value":fuDns,
					//"checkFuncs" : ['checkIP']
					"checkDemoFunc": ['checkInput', 'ip', '0', '1']
				},
				"afterWord": ''
			}, 
			{
				"prevWord": 'Option43',
				"inputData": {
					"type": 'select',
					"name": 'option43Type',
					"defaultValue":data.dhcpOption43Types || '0',
					"items" : [ 
					{   
						"value" : '0',
						"name"  : tl('noUse'),
						"control" :'0'
					},  
					{   
						"value" : '1',
						"name"  : tl('hexFixedLength'),
						"control" :'1'
					},  
					{   
						"value" : '2',
						"name"  : tl('hexRandomLength'),
						"control" :'2'
					},  					
						{   
						"value" : '3',
						"name"  : tl('custom'),
						"control" :'3'
						}
					]
				},
				"afterWord": ''
			},			
			{
				"sign": '1',
				"prevWord": '{ACAddr}',
				"inputData": {
					"type"       : 'text',
					"name"       : 'option43Addr1',
					"value":data.dhcpOption43Addrs1 || '',
					"checkDemoFunc" : ['checkInput','ip','0']
				},
				"afterWord": ''                                                                                                             
			},  
			{
				"sign": '2',
				"prevWord": '{ACAddr}',
				"inputData": {
					"type"       : 'text',
					"name"       : 'option43Addr2',
					"value":data.dhcpOption43Addrs2 || '',
					"checkDemoFunc" : ['checkInput','ip','0']
				},
				"afterWord": ''                                                                                                             
			},
			{
				"sign": '3',
				"prevWord": '{ACAddr}',
				"inputData": {
					"type"       : 'text',
					"name"       : 'option43Addr3',
					"value":data.dhcpOption43Addrs3 || '',
					"checkDemoFunc" : ['checkInput','ip','0']
				},
				"afterWord": ''                                                                                                             
			},
			{
				"sign": '1',
				"disabled":true,
				"prevWord": '{tlvPreview}',
				"inputData": {
					"type"       : 'text',
					"name"       : 'tlv1',
					"value":data.dhcpOption43TLV1 || ''
				},
				"afterWord": ''                                                                                                             
			},
			{
				"sign": '2',
				"disabled":true,
				"prevWord": '{tlvPreview}',
				"inputData": {
					"type"       : 'text',
					"name"       : 'tlv2',
					"value":data.dhcpOption43TLV2 || ''
				},
				"afterWord": ''                                                                                                             
			},	
			{
				"sign": '3',
				"disabled":true,
				"prevWord": '{tlvPreview}',
				"inputData": {
					"type"       : 'text',
					"name"       : 'tlv3',
					"value":data.dhcpOption43TLV3 || ''
				},
				"afterWord": ''                                                                                                             
			},					
		];
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		var littles = [{
			id:'littleAdd',
			name :'{add}',
			initFunc : function($this){
				$this.click(function(){
						addYewuVlan();
				});
			}
		}];
	    $dom.find('[name="option43Type"]').change(function(){
	    	if($(this).val() == '3'){
				require('Tips').showInfo(tl('customInfo'));
	    	}
	    });		
		InputGroup.insertLink($dom,'poolVidvf',littles);
		$modal.find('.modal-body').empty().append($dom);

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common',,'doDhcpServer'];
		Translate.translate(tranDomArr, dicArr);	
		$modal.modal('show');
	}
	function editLAN($modal, data, $target){
		var InputGroup = require('InputGroup');
		var Tips = require('Tips');
		var len = InputGroup.checkErr($modal);
		if(len > 0){
//			Tips.showError('{NoSave}');
			return;
		}	
		// 用户输入的内容
		var Serialize = require('Serialize');
		var queryArrs = Serialize.getQueryArrs($modal);
		var queryJson = Serialize.queryArrsToJson(queryArrs);
		// 用户输入的内容
		var name = queryJson["poolName"],
			ip   = queryJson["dhcpStart"],
			mask = queryJson["dhcpMask"];
		// 修改的lan的名称
		var lanName = data["mingcheng"];
		var database = DATA.lanData;
		var lanData = database.getSelect({mingcheng : lanName});
		// 第几个lan修改
		var lanCount = lanData[0]['lanName'];
		var lanAllData = database.getSelect();
		var lanOne = lanAllData[0],
			lanTwo = lanAllData[1],
			lanThree = lanAllData[2],
			lanFour = lanAllData[3];
		var nameOne = lanOne['mingcheng'],
			ipOne   = lanOne["ip"],
			maskOne = lanOne["mask"],
			nameTwo = lanTwo["mingcheng"],
			ipTwo   = lanTwo["ip"],
			maskTwo = lanTwo["mask"],
			nameThree = lanThree["mingcheng"],
			ipThree = lanThree["ip"],
			maskThree = lanThree["mask"],
			nameFour = lanFour["mingcheng"],
			ipFour = lanFour["ip"],
			maskFour = lanFour["mask"];
		if(lanCount == '1'){
			nameOne = name;
			ipOne   = ip;
			maskOne = mask;
		}
		if(lanCount == '2'){
			nameTwo = name;
			ipTwo   = ip;
			maskThree = mask;
		}
		if(lanCount == '3'){
			nameThree = name;
			ipThree   = ip;
			maskThree = mask;
		}
		if(lanCount == '4'){
			nameFour = name;
			ipFour  = ip;
			maskFour = mask;
		}
		var queryArr = [
			['lanIpName', nameOne],
			['lanIp', ipOne],
			['lanNetmask', maskOne],

			['lanIp2Name', nameTwo],
			['lanIp2', ipTwo],
			['lanNetmask2', maskTwo],

			['lanIp3Name', nameThree],
			['lanIp3', ipThree],
			['lanNetmask3', maskThree],

			['lanIp4Name', nameFour],
			['lanIp4', ipFour],
			['lanNetmask4', maskFour],
		];
		var queryStr = Serialize.queryArrsToStr(queryArr);
		$.ajax({
			url : '/goform/ConfigLANConfig',
			type : 'POST',
			data : queryStr,
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
						Tips.showSuccess('{saveSuccess}');
						display($('#1'));
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							tips.showWarning('{saveFail}');
						}else{
							tips.showWarning(errorstr);
						}
					}
				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}
	function editDhcpPool($modal, data, $target){
		var InputGroup = require('InputGroup');
		var Tips = require('Tips');
		var len = InputGroup.checkErr($modal);
		if(len > 0){
//			Tips.showError('{NoSave}');
			return;
		}	
		// 引入serialize模块
		var Serialize = require('Serialize');
		// 将模态框中的输入转化为url字符串
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
		var poolName = data["poolName"];
		if(queryJson.option43Type=='0'){
			queryJson.option43Addr='';
		}else if(queryJson.option43Type=='1'){
			queryJson.option43Addr=queryJson.option43Addr1;
		}
		else if(queryJson.option43Type=='2'){
			queryJson.option43Addr=queryJson.option43Addr2;
		}
		else if(queryJson.option43Type=='3'){
			queryJson.option43Addr=queryJson.option43Addr3;
		}		
		console.log(queryJson);
		queryStr = Serialize.queryJsonToStr(queryJson);
		var str = 'oldName=' + poolName;
		// 合并url字符串
		queryStr = Serialize.mergeQueryStr([queryStr, str]);
		console.log(queryStr);
		// return;
		$.ajax({
			url: '/goform/formDhcpPoolConfig',
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
						Tips.showSuccess('{saveSuccess}');
						DATA.modalobj.hide();
						display($('#1'));
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showWarning('{saveFail}');
						}else{
							Tips.showWarning(errorstr);
						}
					}
				} else {
					Tips.showWarning('{parseStrErr}');
				}
			}
		});
	}

	function editSubmitClick($modal, data, $target) {
		editDhcpPool($modal, data, $target);
	}	

	function removeDhcpPool(data) {
		var Tips = require('Tips');
		var poolName = data["poolName"];
		var queryStr = 'delstr=' + poolName;
		require('Tips').showConfirm(tl('delconfirm'),function(){
			$.ajax({
				url: '/goform/formDhcpPoolDel',
				type: 'POST',
				data: queryStr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						returnStr = ['status','errorstr'],
						result = doEval.doEval(codeStr, returnStr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"],
							status = data['status'];
						if (status) {
							Tips.showSuccess('{delSuccess}');
							display($('#1'));
						} else {
							var errorstr=data.errorstr;
							if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
								Tips.showWarning('{delFail}');
							}else{
								Tips.showWarning(errorstr);
							}
						}
					} else {
						Tips.showError('{parseStrErr}');
					}
				}
			});
		});	
	}
	
	function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr = ['id','poolName', 
						'kaiqi', 'yewuvlan', 
						'beginIp', 'endIp', 
						'netMask','gateway', 
						'zhuDns', 'fuDns', 
						'zuTime',
						'dhcpOption43Types',
						'dhcpOption43Addrs',
						'dhcpOption43TLV',
						'poolVid',
						];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}

	function storeVlanData(data) {
		DATA["vlanData"] = data;
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
		var fieldArr = ['id','poolName', 
						'kaiqi', 'yewuvlan', 
						'beginIp', 'endIp', 
						'netMask','gateway', 
						'zhuDns', 'fuDns', 
						'zuTime',
						'dhcpOption43Types',
						'dhcpOption43Addrs',
						'dhcpOption43TLV'
						];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}

	 function processVlanData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = ['titles1','poolNames','poolVids','org_name','beginIp','netMask','min_vlanRange','max_vlanRange'];
		// 获得js字符串执行后的结果                                                       
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = data["titles1"]||[], // 表格头部的标题列表
				poolVids = data["poolVids"]||[],
				org_name = data["org_name"]||[],
				poolNames = data["poolNames"]||[],
				beginIps  = data["beginIp"]||[],
				netMasks = data["netMask"]||[];

			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据

			// 通过数组循环，转换vlan数据的结构
			DATA["VLANIDList"] = [];
			poolNames.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(poolNames[index]);
				arr.push(org_name[index]);
				arr.push(poolVids[index]);
				dataArr.push(arr);
				
				DATA.min_vlanRange=data.min_vlanRange;
				DATA.max_vlanRange=data.max_vlanRange;
				DATA["VLANIDList"].push({
					name : org_name[index],
					ip   : beginIps[index],
					msk  : netMasks[index],
//					vid  : poolVids[index],
					pname:poolNames[index]
				});
			});
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
			var vlandata = [
				[poolNames,poolVids,org_name,beginIps,netMasks]
			];
			
			
			return {
				table: tableData,
				vlandata: vlandata,
			};
		} else {
			Tips.showError('{parseStrErr}');
		}
	}
	function processData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = 
			[	'titles1',
				'poolNames', 'poolSts', 
				'poolVids','endIp',
				'used', 'beginIp', 
				'netMask', 'gateway', 
				'lease', 'vlanConfig',
				'primaryDns', 'backupDns', 
				'edit_Names', 'vlanNetMask',
				'vlanIp', 
				'dhcpOption43Types',
				'dhcpOption43Addrs', 
				'dhcpOption43TLV',
				'poolVorg_name',
				'org_name','originVif',
			];			
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			
			
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = data["titles1"], // 表格头部的标题列表
				poolNames = data["poolNames"],
				poolSts = data["poolSts"],
				poolVids = data["poolVids"],
				originVif = data["originVif"],
				endIp = data["endIp"],
				used = data["used"],
				beginIp = data["beginIp"],
				netMask = data["netMask"],
				gateway = data["gateway"],
				lease = data["lease"],
				vlanConfig = data["vlanConfig"],
				primaryDns = data["primaryDns"],
				backupDns = data["backupDns"],
				edit_Names = data["edit_Names"],
				vlanNetMask = data["vlanNetMask"],
				vlanIp = data["vlanIp"],
				dhcpOption43Types = data["dhcpOption43Types"],
				dhcpOption43Addrs = data["dhcpOption43Addrs"],
				dhcpOption43TLV = data["dhcpOption43TLV"],
				poolVorg_name = data["poolVorg_name"],
				org_name = data["org_name"];
				DATA.org_name=org_name;
				DATA.poolVorg_name=poolVorg_name;
				DATA.poolVids=poolVids;
				
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
			var leaseTimeTmp=tl('dhcpMinute');
			poolNames.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(Number(index)+1);
				arr.push(poolNames[index]);
				arr.push((poolSts[index]==1)?"on":"off");
				if(index == 0){
					arr.push('');
				}else{
//					arr.push(poolVids[index].replace('VIF',''));
					//arr.push(org_name[index]);
					arr.push(poolVorg_name[index]);
				}
				arr.push(beginIp[index]);
				arr.push(endIp[index]);
				arr.push(netMask[index]);
				arr.push(gateway[index]);
				arr.push(primaryDns[index]);
				arr.push((backupDns[index]=='255.255.255.255')?"0.0.0.0":backupDns[index]);
				arr.push(lease[index] + tl('dhcpMinute'));
				if(dhcpOption43Types[index]=='0'){
					arr.push(tl('noUse'));
				}else if(dhcpOption43Types[index]=='1'){
					arr.push(tl('hexFixedLength'));
				}else if(dhcpOption43Types[index]=='2'){
					arr.push(tl('hexRandomLength'));
				}else if(dhcpOption43Types[index]=='3'){
					arr.push(tl('custom'));
				}else{
					arr.push(tl('noUse'));
				}
				if(dhcpOption43Addrs[index]==""){
					arr.push('0.0.0.0');
				}else{
					arr.push(dhcpOption43Addrs[index]);
				}
				arr.push(dhcpOption43TLV[index]);	
				arr.push(poolVids[index]);
				dataArr.push(arr);
			});
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			
			var dhcpData = [
				[poolNames, poolSts, poolVids, beginIp, endIp,netMask,gateway,primaryDns,backupDns,lease, 
				dhcpOption43Types, dhcpOption43Addrs, dhcpOption43TLV],
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
		var btnList = [{
			"id": "add",
			"name": "{add}",
			"clickFunc" : function($btn){
            	// alert($btn.attr('id'));  // 显示 add
            	addBtnClick();
        	}

		}, {
			"id": "delete",
			"name": "{delete}",
			"clickFunc" : function($btn){
            //alert($btn.attr('id'));  // 显示 add
            	deleteBtnClick();
        	}
		}
		/*
		, 
		{
			"id": "setting",
			"name": "全局设置"
		}
		*/
		];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		console.dir(database);
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll":true,
			"dicArr":['common', 'lanConfig','doDhcpServer'],
			otherFuncAfterRefresh:afterRefresh,
			"titles": {
				"ID": {
					"key": "id",
					"type": "text"
				},
				"{poolName}": {
					"key": "poolName",
					"type": "text"
				},
				"{open}" : {
                    "key"     : "kaiqi",
                    "type"    : "checkbox",
                    "values"  : {
                        "on"  : true,
                        "off" : false
                    },
                    "clickFunc" : function($this){
                    	//alert($this.attr('data-primaryKey'))
                    	changeStatus($this.attr('data-primaryKey'));
                    }
                },				
				"{interface}{name}": {
					"key": "yewuvlan",
					"type": "text"
				},		
				"{beginIp}": {
					"key": "beginIp",
					"type": "text"
				},

				"{endIp}": {
					"key": "endIp",
					"type": "text"
				},
				"{netmask}": {
					"key": "netMask",
					"type": "text"
				},
				"{GwAddr}": {
					"key": "gateway",
					"type": "text"
				},

				"{firstDNS}": {
					"key": "zhuDns",
					"type": "text"
				},
				"{secDns}": {
					"key": "fuDns",
					"type": "text"
				},
				"{leaseTime}": {
					"key": "zuTime",
					"type": "text"
				},
				"Option43": {
					"key": "dhcpOption43Types",
					"type": "text"
				},
				"{ACAddr}": {
					"key": "dhcpOption43Addrs",
					"type": "text"
				},	
				// "TLV": {
				// 	"key": "dhcpOption43TLV",
				// 	"type": "text"
				// },							
                "{edit}": {
                    "type" : "btns",
                    "btns" : [
                        {
                            "type"      : "edit",
                            "clickFunc" : function($this){
                                //alert($this.attr('data-primaryKey'))
                                var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});

	   //  $dom.find('[name="option43Type"]').change(function(){
	   //  	if($(this).val() == '3'){
				// require('Tips').showInfo(tl('customInfo'));
	   //  	}
	   //  });
	   							if(data[0].dhcpOption43Types==tl('custom')){
	   								require('Tips').showInfo(tl('customInfo'));
	   							}		
	   							console.log(data[0])		
								editBtnClick(data[0], $this);
                            }
                        },
                        {
                            "type"      : "delete",
                            "clickFunc" : function($this){
                                //alert($this.attr('data-primaryKey'))
								var primaryKey = $this.attr('data-primaryKey')
								var tableObj = DATA["tableObj"];
								var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
								var data = database.getSelect({primaryKey : primaryKey});
								removeDhcpPool(data[0]);

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
		
		function afterRefresh(thisTabledObj){
			thisTabledObj.getDom().find('td[data-column-title="{poolName}"]>[data-local="default"]').parent().prev().prev().children('input').remove();
		}
		
		
		return $table;
	}

	function displayTable($container) {
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		//向后台发送请求，获得表格数据
		$.ajax({
			url: 'common.asp?optType=dhcpServerConfig',
			type: 'GET',
			success: function(result) {
				// 将后台数据处理为数据表格式的数据
				var data = processData(result),
					tableData = data["table"];
					dhcpData  = data["dhcpData"];
				var	titleArr = tableData["title"],
					tableArr  = tableData["data"];
				storeTableData(tableArr);
				// 将lan数据存入数据表
				storeDhcpData(dhcpData);
				// 获得表格Dom
				var $table = getTableDom();
				// 将表格放入页面
				$tableCon.append($table);
			}
		});
		$.ajax({
			url: 'common.asp?optType=lan',
			type: 'GET',
			success: function(result) {
				// 将后台数据处理为数据表格式的数据
				var data = processVlanData(result),
					//tableData = data["table"];
					vlandata  = data["vlandata"];
				storeVlanData(vlandata);
			}
		});
		$.ajax({
			//url: 'lanConfig.asp',
			url: 'common.asp?optType=lan|dhcpServerConfig',
			type: 'GET',
			success: function(result) {
				// 将后台数据处理为数据表格式的数据
				var data = processlanData(result);
					tableData = data["table"],
					lanData  = data["lan"],
					mac      = data["mac"],
					mode     = data["mode"];
				var	titleArr = tableData["title"],
					tableArr  = tableData["data"];
				storeLANData(lanData);
				DATA["mac"] = mac;
				DATA["mode"] = mode;
			}
		});		
	}

	function display($container) {
	var Translate = require('Translate'); 
	 var dicNames = ['common', 'lanConfig']; 
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
