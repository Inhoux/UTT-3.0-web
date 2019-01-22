define(function(require, exports, module) {
	var DATA = {};
	function tl(str){
		return require('Translate').getValue(str,['common','lanConfig']);
	}
	var Tips = require('Tips');
	/**
	 * 循环读取系统是否保存完毕 
	 * oldip ： 编辑前的默认ip
	 * newip ：编辑后的ip
	 */
	function interval(oldip,newip){
		/* 提示用户等待配置保存 */
		var timer = Tips.showTimer('{WaitForSaveConfig}',20,function(){
			/**
			 *  判断是否为远程访问
			 */
			var befo = 'http';
			if(location.href.substr(0,5) == 'https'){
				befo = 'https';
			}
			if(location.href.indexOf(oldip)>=0){
				if(newip){
					location.href = befo+"://"+ newip+"/noAuth/login.html";
				}else{
					location.href = befo+"://"+ location.host+"/noAuth/login.html";
				}
				
			}else{
				/* 远程 */
				location.href = befo+"://"+ location.host+"/noAuth/login.html";
			}
		});
		var signstr = false;
		var setin1;
		setTimeout(function(){
			setin1 = setInterval(function(){
				$.ajax({
					url: '/noAuth/noAuthAspOut.asp?optType=lang',
					type: 'get',
					success: function(result) {
						eval(result);
						if(status){
//							thisip = lanIp;
							signstr = true;
						}
						
					}
				});
			},1000);
		},5000)
		
		var setin2 = setInterval(function(){
			if(signstr){
				clearInterval(setin1);
				clearInterval(setin2);
				timer.stop(true);
			}
		},500);
		
		
		
		
	}
	
	function addBtnClick() {
		// 加载模态框模板模块
		var Modal = require('Modal');
		var BtnGroup = require('BtnGroup');
		var modalList = {
			"id": "modal-add",
			"title": '{add}',
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
		// 获得模态框的html
		var modalobj = Modal.getModalObj(modalList),
		//var modalHTML = Modal.getHTML(modalList),
		$modal = modalobj.getDom(); // 模态框的jquery对象
		DATA["modalobj"]=modalobj;
		$('body').append($modal);
		// 模态框中输入框组的配置数据
		var vlanDis=false;
        var vlanvalid = false;
        if(DATA["vlan"] == 1){
			vlanDis=true;
		}
        if(DATA["lanipfull"] == 1)
        {
            vlanvalid = true;
        }
		var inputList = [
		 {
		 	"necessary": true,
			"prevWord": '{name}',
			"inputData": {
				"type": 'text',
				"name": 'lanIpName',
				 "checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
				// "checkDemoFunc" : ['checkName','1','10','lanConfig']
			},
			"afterWord": ''
		},
		{
			"necessary": true,
			"prevWord": '{ip}',
			"inputData": {
				"type": 'text',
				"name": 'lanIp',
				//"checkFunc": 'checkLanIP',
				"checkFuncs" : ['checkIP']
				//"errorStr": 'IP地址错误'
			},
			"afterWord": ''
		},
		{
			"necessary": true,
			"prevWord": '{netmask}',
			"inputData": {
				"type": 'text',
				"name": 'lanNetmask',
				"value": '255.255.255.0',
				"checkFuncs" : ['re_checkMask']
			},
			"afterWord": ''
		},
		{
				"prevWord": '{profVlan}',
//				"disabled": disabled,
				"inputData": {
					"type": 'text',
					"name": 'dhcpVid',
					"value": '',
					// "checkDemoFunc" : ['checkNum','1','4094','vlan']
					"checkDemoFunc" : ['checkNum',(DATA.min_vlanRange !==undefined?DATA.min_vlanRange:'1'),(DATA.max_vlanRange !==undefined?DATA.max_vlanRange:'4094'),'lanVlan']
				},
				"afterWord": ''
			}
		];
		
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		// 添加跳转到dhcp页面链接
			var $div = $('<div style="font-weight: bold;margin-top:5px; word-break: normal; white-space: normal; padding: 10px; background-color: rgb(238, 238, 238);width:100%"></div>')
			
			var $span1 = $("<span data-local='{newVLANIDWithoutDHCP1}'>{newVLANIDWithoutDHCP1}</span>");
			var $linkToOrg = $('<a data-local="{linkToDHCP}" class="u-inputLink">{linkToDHCP}</a>');
			var $span2 = $("<span data-local='{newVLANIDWithoutDHCP2}'>{newVLANIDWithoutDHCP2}</span>");
			$div.append($span1,$linkToOrg,$span2);
			$linkToOrg.click(function(){
				Tips.showConfirm(
					tl('noSaveAndGoRightnow')
					,function(){
						modalObj.hide();
						DATA.tabModalObj.hide();
						$('#sidebar').find('a[href="#/network_config/DHCP_server"]').parent().trigger('click');
//						$('#sidebar').find('a[href="#/network_config/DHCP_server"]').parent().parent().prev().trigger('click');
					},function(){
						
					})
				
			}).css({
				'margin-right':'0px'
			});
			
		// 将输入框组放入模态框中
		$modal.find('.modal-body').empty().append($dom,$div);
		// 显示模态框
		$('body').append($modal);
		$modal.modal('show');

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);
	}

	function addSubmitClick($modal) {
		// 加载序列化模块
		var Serialize = require('Serialize');
		// 获得用户输入的数据
		var queryArrs = Serialize.getQueryArrs($modal);
		// 获得用户输入的vlan
		var lanVid = Serialize.getValue(queryArrs, 'dhcpVid');
		console.log(lanVid);
		// 判断是否输入vlan
		if (lanVid == '') {
			// 添加lan
			addLAN(queryArrs, $modal);
		} else {
			// 添加vlan
			addVLAN(queryArrs, $modal);
		}
	}

	function addVLAN(queryArrs, $modal) {
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
		//console.log(keyArr);
		// 替换从页面获取的查询数组的键
		Serialize.changeKeyInQueryArrs(queryArrs, keyArr);
		// 将查询字符串数组转化为字符串
		var queryStr = Serialize.queryArrsToStr(queryArrs);
		var queryJson = Serialize.queryArrsToJson(queryArrs);
		var id = queryJson.dhcpVid;

		//获得提示框组件调用方法
		var Tips = require('Tips');
		//poolName = hkafjk;
		//poolName = 'VIF' + id;

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);


		queryStr = queryStr + '&' +'poolName' + '='+ 'VIF' +id + '&'+'DhcpEnable=on';
		console.log(queryStr);
		// 向后台发送数据，进行新增操作
		$.ajax({
			url: '/goform/formVlanConfig',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				//console.log(result);
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
						tips.showSuccess('{saveSuccess}', 2.5);
						// 刷新页面
						// var Dispatcher = require('Dispatcher');
						// Dispatcher.reload(0.5);
						DATA.modalobj.hide();
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
			// console.log(queryStr);
			// return;
			queryStr=queryStr+'&lanMac='+DATA.lanMac;
			queryStr=queryStr+'&LanMode='+DATA.mode;
			$.ajax({
				url: '/goform/ConfigLANConfig',
				type: 'POST',
				data: queryStr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status','errorstr'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"],
							status = data["status"];
						if (status) {
							// 显示成功信息
							interval(DATA["LAN1IP"],lanIp)
							DATA.modalobj.hide();
							display($('#1'));
						} else {
							var errorStr=data.errorstr;
							tips.showWarning(errorStr);
						}

					} else {
						tips.showWarning('{parseStrErr}');
					}
				}
			});
		} else {
			tips.showWarning('{lanConfigReachMaxNum}', 2.5);
		}
	}

	function deleteBtnClick() {
		//获得提示框组件调用方法
		var Tips = require('Tips');
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];

		var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
		var length  = primaryKeyArr.length;
		//return;

		// 获得表格中所有被选中的选择框，并获取其数量
		/*
		var $elems = tableObj.getSelectInputs(),
			length = $elems.length;
		console.log(length);
		*/
		// 判断是否有被选中的选择框
		if (length > 0) {
			require('Tips').showConfirm(tl('delconfirm'),function(){
				var lanArr = [];
				var str = '';
				var delFlag=true;
				//$.each($elems, function(index, element) {
				primaryKeyArr.forEach(function(primaryKey) {
					var data = database.getSelect({primaryKey : primaryKey});
					var name = data[0]["mingcheng"];
					if(name=='default'){
						delFlag=false;
					}
					var orgName = data[0]["org_name"];
					//var lanIp = data[0]["ip"];
					var vlanid = data[0]["vlanid"];
					if(vlanid == "")
					{
						lanArr.push(name);
					}else{
						str += orgName + ',';
					}
				});
				if(delFlag==false){
					require('Tips').showWarning('{canNotDelDefault}');
					return;
				}
				// 有lan被勾选
				if(lanArr.length > 0){
						var database1 = DATA.lanData;
						var lanData = database1.getSelect();
						var nameOne   = lanData[0]['mingcheng'],
							nameTwo   = lanData[1]["mingcheng"],
							nameThree = lanData[2]["mingcheng"],
							nameFour  = lanData[3]["mingcheng"];
							ipOne	  =	lanData[0]["ip"],
							ipTwo     = lanData[1]["ip"],
							ipThree   = lanData[2]["ip"],
							ipFour    = lanData[3]["ip"],
							maskOne   = lanData[0]["mask"];
							maskTwo   = lanData[1]["mask"];
							maskThree = lanData[2]["mask"];
							maskFour  = lanData[3]["mask"];
						lanArr.forEach(function(item){
							 console.log(database1.getSelect({mingcheng : item})[0].lanName);
							var count = database1.getSelect({mingcheng : item})[0].lanName;
							//console.log(count)
							switch(count){
								// case  '1' :
								// 	ipOne = '0.0.0.0';
								// 	break;
								case  2 :
									ipTwo = '0.0.0.0';
									break;
								case  3 :
									ipThree = '0.0.0.0';
									break;
								case  4 :
									ipFour = '0.0.0.0';
									break;
							}
						});
					    var queryArrs = [
							['lanIp', ipOne],
							['lanNetmask', maskOne],
							['lanIpName', nameOne],
							['lanIp2', ipTwo],
							['lanNetmask2', maskTwo],
							['lanIp2Name', nameTwo],
							['lanIp3', ipThree],
							['lanNetmask3', maskThree],
							['lanIp3Name', nameThree],
							['lanIp4', ipFour],
							['lanNetmask4', maskFour],
							['lanIp4Name', nameFour]
						];
						var Serialize = require('Serialize');
						var queryStr = Serialize.queryArrsToStr(queryArrs);
						queryStr=queryStr+'&lanMac='+DATA.lanMac;
						queryStr=queryStr+'&LanMode='+DATA.mode;
						$.ajax({
							url: '/goform/ConfigLANConfig',
							type: 'POST',
							data: queryStr,
							success: function(result) {
								var doEval = require('Eval');
								var codeStr = result,
									variableArr = ['status','errorstr'],
									result = doEval.doEval(codeStr, variableArr),
									isSuccess = result["isSuccessful"];
								// 判断代码字符串执行是否成功
								if (isSuccess) {
									var data = result["data"],
										status = data["status"];
									if (status) {
										// 显示成功信息
										Tips.showSuccess('{delSuccess}');
										interval(ipOne,'')
										DATA.modalobj.hide();
//										display($('#1'));
									} else {
										var errorstr = data.errorstr;
										Tips.showWarning(errorstr);
									}

								} else {
									Tips.showWarning('{parseStrErr}');
								}
							}
						});
					}
					if(str != ''){
						str = str.substr(0, str.length - 1);
						str = 'delstr=' + str;
						$.ajax({
							url: '/goform/formVlanConfigDel',
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
										// 提示成功信息
										Tips.showSuccess('{delSuccess}');
										display($('#1'));
									} else {
											var errorstr=data.errorstr;
											if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
												Tips.showError('{delFail}');
											}else{
												Tips.showError(errorstr);
											}
									}
								} else {
									Tips.showError('{parseStrErr}');
								}
							}
						});
					}
				});

		} else {
			Tips.showWarning('{unSelectDelTarget}');
		}
	}

	function settingBtnClick() {
		var Dispatcher = require('Dispatcher');
		var hash = '#/network_config/LAN_config/setting';
		Dispatcher.changeHash(hash);
	}

	function changeStatus(data, $target) {
		var isOpen = (data["isOpen"] == 'on') ? 'off' : 'on';
		//获得提示框组件调用方法
		var Tips = require('Tips');
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');
		// 查询字符串二维数组
		var queryArr = [
			['oldName', data["mingcheng"]],
			['DhcpEnable', isOpen],
			['poolName', data["mingcheng"]],
			['dhcpStart', data["ip"]],
			['dhcpMask', data['mask']],
			['dhcpVid', data['vlanid']]
		];
		// 调用序列化模块的转换函数，将数组转换为查询字符串
		var queryStr = Serialize.queryArrsToStr(queryArr);
		// 向后台发送请求
		$.ajax({
			url: '/goform/formVlanConfig',
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
						var successMsg = (isOpen == 'on') ? '{closeSuccess}' : '{openSuccess}';
						Tips.showSuccess(successMsg, 2);
						DATA.modalobj.hide();
						display($('#1'));
					} else {
						// 显示失败信息
						Tips.showError('{oprtFail}', 2);
					}

				} else {
					Tips.showError('{oprtFail}', 2);
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
			DATA["modalobj"]=modalobj;
		$('body').append($modal);
		var IPName = data["mingcheng"],
			ip = data["ip"],
			mask = data["mask"],
			vlanID = data["vlanid"],
			org_name = data["org_name"];
			isOpen = data["isOpen"];
		var isClosed = (isOpen == 'on') ? false : true;
		var disabled = false;
		var lanDisabled=false;
		if(vlanID == ""){
			disabled=true;
		}
		if(IPName=="default"){
			lanDisabled=true;
		}
		var inputList = [
/*
		{
			"prevWord": '状态',
			"inputData": {
				"type": 'radio',
				"name": 'DhcpEnable',
				"items": [{
					"value": 'on',
					"name": '开启',
					"isChecked": true
				}, {
					"value": 'off',
					"name": '关闭',
					"isChecked": isClosed
				}, ]
			},
			"afterWord": ''
		},
*/
		 {
		 	"necessary": true,
			"prevWord": '{name}',
			"disabled": lanDisabled,
			"inputData": {
				"type": 'text',
				"name": 'poolName',
				"value": IPName,
				// "checkDemoFunc" : ['checkName','2','10']
				"checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
			},
			"afterWord": ''
		},{
		 	"display":false,
		 	"prevWord": '{name}',
			"inputData": {
				"type": 'text',
				"name": 'org_name',
				"value": org_name
			},
			"afterWord": ''
		},
		 {
			"necessary": true,
			"prevWord": '{ip}',
			"inputData": {
				"type": 'text',
				"name": 'dhcpStart',
				"value": ip,
				"checkFuncs": ['checkIP'],
				//"errorStr": 'IP地址错误'
			},
			"afterWord": ''
		}, {
			"necessary": true,
			"prevWord": '{netmask}',
			"inputData": {
				"type": 'text',
				"name": 'dhcpMask',
				"value": mask,
				"checkFuncs": ['re_checkMask'],
			},
			"afterWord": ''
		},
		{
				"prevWord": '{profVlan}',
				"disabled": disabled,
				"inputData": {
					"type": 'text',
					"name": 'dhcpVid',
					"value": vlanID,
					// "checkDemoFunc" : ['checkNum','1','4094','vlan']
					"checkDemoFunc" : ['checkNum',(DATA.min_vlanRange !==undefined?DATA.min_vlanRange:'1'),(DATA.max_vlanRange !==undefined?DATA.max_vlanRange:'4094'),'lanVlan']
				},
				"afterWord": ''
		},
		{
			"prevWord": '',
			"inputData": {
				"type": 'text',
				"name": 'pzDHCP'
			},
			"afterWord": ''
		},
		{
				"prevWord": '',
				"display" : false,	
				"inputData": {
					"type": 'text',
					"name": 'olddhcpVid',
					"value": vlanID,
				},
				"afterWord": ''
		}
		];
		
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		var $linkToOrg = $('<a data-local="{linkToDHCP}" class="u-inputLink">{linkToDHCP}</a>');
//			$linkToOrg.hover(function(){
//				$(this).css('opacity','1');
//			},function(){
//				$(this).css('opacity','0.5');
//			})
		$linkToOrg.click(function(){
			modalobj.hide();
			$('#sidebar').find('a[href="#/network_config/DHCP_server"]').parent().trigger('click');
//			$('#sidebar').find('a[href="#/network_config/DHCP_server"]').parent().parent().prev().trigger('click');
		});
		$dom.find('[name="pzDHCP"]').before($linkToOrg);
		$dom.find('[name="pzDHCP"]').remove();
		// $modal.find('.modal-body').empty().append($dom);
		modalobj.insert($dom);
		modalobj.show();
		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','lanConfig'];
		Translate.translate(tranDomArr, dicArr);
	}
	function editLAN($modal, data, $target){
		var oldip = data.ip;
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
			maskTwo = mask;
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
		queryStr=queryStr+'&lanMac='+DATA.lanMac;
		queryStr=queryStr+'&LanMode='+DATA.mode;
		$.ajax({
			url : '/goform/ConfigLANConfig',
			type : 'POST',
			data : queryStr,
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
						// 提示成功信息
						interval(oldip,ipOne)
						
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
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}
	function editVLAN($modal, data, $target){
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
			console.log(queryJson);
		var IPName = data["mingcheng"];
		// 'poolName=' + IPName + '&'+
		var bak_name = queryJson.poolName;
		var hehe = queryJson.org_name;
		queryJson.org_name = bak_name;
		queryJson.poolName = hehe;
		queryJson.real_vid= queryJson.olddhcpVid;
		var str1 = Serialize.queryJsonToStr(queryJson);
		// 合并url字符串
		//var str ='oldName=' + IPName +'&' + 'org_name=' + bak_name;
		var str ='oldName=' + hehe
		//queryStr = Serialize.mergeQueryStr([queryStr, str]);
		queryStr = Serialize.mergeQueryStr([str1, str]);
		queryStr = queryStr + '&DhcpEnable=on';
		console.log(queryStr);
		$.ajax({
			url: '/goform/formVlanConfig',
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
						DATA.modalobj.hide();
						display($('#1'));
					} else {
						//Tips.showError('{errorstr}');
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showWarning('{saveFail}');
						}else{
							Tips.showWarning(errorstr);
						}
					}
				} else {
					Tips.showWarning('parseStrErr', 2);
				}
			}
		});
	}

	function editSubmitClick($modal, data, $target) {

		// 获取vlanID
		var lanVid = data["vlanid"];
		if(lanVid != ''){
			editVLAN($modal, data, $target);
		}else{
			
			editLAN($modal, data, $target);
		}
	}
	function removeLAN(data) {
		var Tips = require('Tips');

		var delIpName = data["mingcheng"];
		var vlanid = data["vlanid"];
		var lanName = data["mingcheng"];

		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		var $this = $(this),
			primaryKey = $this.attr('data-primaryKey');
		var data1 = database.getSelect({primaryKey : primaryKey});

		if(vlanid == "")
		{
			var database1 = DATA.lanData;
			var lanData = database1.getSelect({mingcheng : lanName});
			// 第几个lan修改
			var lanCount = lanData[0]['lanName'];
			var lanAllData = database1.getSelect();
			var lanOne = lanAllData[0],
				lanTwo = lanAllData[1],
				lanThree = lanAllData[2],
				lanFour = lanAllData[3];

			var nameOne = lanOne['mingcheng'],
				nameTwo = lanTwo["mingcheng"],
				nameThree = lanThree["mingcheng"],
				nameFour = lanFour["mingcheng"];
				ipOne	=	lanOne["ip"],
				ipTwo   =   lanTwo["ip"],
				ipThree   = lanThree["ip"],
				ipFour   = lanFour["ip"],
				maskOne = lanOne["mask"];
				maskTwo = lanTwo["mask"];
				maskThree = lanThree["mask"];
				maskFour = lanFour["mask"];
			if(delIpName == nameOne){
				ipOne 	= '0.0.0.0';
				//alert('lanip = '+ipOne);
			}else if(delIpName == nameTwo){
				ipTwo   = '0.0.0.0';
				//alert('lanip2 = '+ipTwo);
			}else if(delIpName == nameThree){
				ipThree = '0.0.0.0';
				//alert('lanip3 = ' +ipThree);
			}else if(delIpName == nameFour){
				ipFour = '0.0.0.0';
				//alert('lanip4 = '+ipFour);
			}
			var Serialize = require('Serialize');
			var queryArrs = [
				['lanIp', ipOne],
				['lanNetmask', maskOne],
				['lanIpName', nameOne],
				['lanIp2', ipTwo],
				['lanNetmask2', maskTwo],
				['lanIp2Name', nameTwo],
				['lanIp3', ipThree],
				['lanNetmask3', maskThree],
				['lanIp3Name', nameThree],
				['lanIp4', ipFour],
				['lanNetmask4', maskFour],
				['lanIp4Name', nameFour]
			];
			var queryStr = Serialize.queryArrsToStr(queryArrs);
			queryStr=queryStr+'&lanMac='+DATA.lanMac;
			queryStr=queryStr+'&LanMode='+DATA.mode;
			var wts1 = Tips.showWaiting('删除中…');
			$.ajax({
				url: '/goform/ConfigLANConfig',
				type: 'POST',
				data: queryStr,
				success: function(result) {
					wts1.remove();
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
							Tips.showSuccess('{delSuccess}');
							interval(ipOne,'')
							if(DATA.modalobj!=undefined){
								DATA.modalobj.hide();
							}
							
							display($('#1'));
						} else {
							Tips.showWarning('{delFail}');
						}

					} else {
						Tips.showWarning('{parseStrErr}');
					}
				}
			});
			return;
		}
	}

	function removeVLAN(data) {
		//var IPName = data["mingcheng"];
		var IPName = data["org_name"];
		var queryStr = 'delstr=' + IPName ;
		var Tips = require('Tips');
		$.ajax({
			url: '/goform/formVlanConfigDel',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					returnStr = ['status', 'errorstr'],
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
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showError('{delFail}');
						}else{
							Tips.showError(errorstr);
						}
					}

				} else {
					Tips.showError('{delFail}', 2);
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
		var fieldArr = ['mingcheng', 'org_name','ip', 'mask', 'vlanid', 'isOpen'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
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

	function processData(jsStr) {
		var doEval = require('Eval');
		var Tips = require('Tips');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = ['lanIpName', 'lanIp', 'lanNetmask',
				'lanIp2Name', 'lanIp2', 'lanNetmask2',
				'lanIp3Name', 'lanIp3', 'lanNetmask3',
				'lanIp4Name', 'lanIp4', 'lanNetmask4',
				'titles1', 'poolNames', 'poolSts', 'poolVids',
				'beginIp', 'netMask', 'lanMac', 'lanMode','org_name',
				'vlan','lanipfull','min_vlanRange','max_vlanRange'/*,'exchangeConfig'*/
			];
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		if (isSuccess) {
			var data = result["data"];
			var titleArr = data["titles1"],
				nameArr = data["poolNames"]||[],
				ipArr = data["beginIp"]||[],
				netMaskArr = data["netMask"]||[],
				VlanldArr = data["poolVids"]||[],
				statusArr = data["poolSts"]||[],
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
				lanNM4s = data["lanNetmask4"],
				lanMac = data["lanMac"],
				lanMode = data["lanMode"];
				org_name = data["org_name"]||[];
				vlan = data["vlan"];
				lanipfull = data["lanipfull"];
                DATA.lanMac=lanMac;
                DATA.min_vlanRange=data.min_vlanRange;
                DATA.max_vlanRange=data.max_vlanRange;
//              DATA.exchangeConfig=require('P_config/config').exchangeConfig;
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
			/*
				根据四个lan口的ip是否为0.0.0.0，决定是否显示
			 */
			if (lanIps != '0.0.0.0') {
				var arr = [];
				arr.push(lanIpName);
				arr.push('LAN');
				arr.push(lanIps);
				arr.push(lanNMs);
				arr.push('');
			//	arr.push('on');
				dataArr.push(arr);
			}
			if (lanIp2s != '0.0.0.0') {
				var arr = [];
				arr.push(lanIp2Name);
				arr.push('LAN');
				arr.push(lanIp2s);
				arr.push(lanNM2s);
				arr.push('');
			//	arr.push('on');
				dataArr.push(arr);
			}
			if (lanIp3s != '0.0.0.0') {
				var arr = [];
				arr.push(lanIp3Name);
				arr.push('LAN');
				arr.push(lanIp3s);
				arr.push(lanNM3s);
				arr.push('');
			//	arr.push('on');
				dataArr.push(arr);
			}
			if (lanIp4s != '0.0.0.0') {
				var arr = [];
				arr.push(lanIp4Name);
				arr.push('LAN');
				arr.push(lanIp4s);
				arr.push(lanNM4s);
				arr.push('');
			//	arr.push('on');
				dataArr.push(arr);
			}
			// 通过数组循环，转换vlan数据的结构
			//nameArr.forEach(function(item, index, arr) {
			console.log(nameArr);
//			if(data.exchangeConfig == 1){
				nameArr.forEach(function(item, index, arr) {
					var arr = [];
					//arr.push(nameArr[index]);
					arr.push(org_name[index]);
					arr.push(nameArr[index]);
					arr.push(ipArr[index]);
					arr.push(netMaskArr[index]);
					arr.push(VlanldArr[index]);
					dataArr.push(arr);
				});
				
				/*将lan1 IP 存入DATA */
				DATA["LAN1IP"] = ipArr[0];
//			}
			
			
			
			// 返回处理好的数据
			var tableData = {
				title: titleArr,
				data: dataArr
			};
			DATA.firstIP = lanIps;
			var LanData = [
				[lanIpName, lanIps, lanNMs, '', 'on'],
				[lanIp2Name, lanIp2s, lanNM2s, '', 'on'],
				[lanIp3Name, lanIp3s, lanNM3s, '', 'on'],
				[lanIp4Name, lanIp4s, lanNM4s, '', 'on']
			];
			return {
				table: tableData,
				lan: LanData,
				mac: lanMac,
				mode: lanMode,
				vlan:vlan,
                lanipfull:lanipfull
            };
		} else {
			Tips.showError('{parseStrErr}',3);
		}
	}

	function getTableDom() {
		var vlanDis=0;
		if(DATA["vlan"] != 1){
			vlanDis=['vlanID'];
		}

		// 表格上方按钮配置数据
		var btnList = [
		{
			"id": "add",
			"name": "{add}",
			 "clickFunc" : function($btn){
           		 // alert($btn.attr('id'));  // 显示 add
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
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll":true,
			otherFuncAfterRefresh:otherFunc,
			"dicArr" : ['common', 'lanConfig'],
			"titles": {
				"{name}"		 : {
					"key": "mingcheng",
					"type": "text",
				},
				"{ip}"		 : {
					"key": "ip",
					"type": "text"
				},
				"{netmask}"		 : {
					"key": "mask",
					"type": "text"
				},
				"VLAN ID"		 : {
					"key": "vlanid",
					"type": "text"
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({primaryKey : primaryKey});
								editBtnClick(data[0], $this);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey')
								var tableObj = DATA["tableObj"];
								var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
								var data = database.getSelect({primaryKey : primaryKey});
								var id = data[0]["vlanid"];
								console.log(data[0]);
								require('Tips').showConfirm(tl('delconfirm'),function(){
									if(id == ""){
										if(data[0].mingcheng == 'default'){
												require('Tips').showWarning('{canNotDelDefault}');
												return;
										}else{
											removeLAN(data[0]);
										}
									}
									else{
										removeVLAN(data[0]);
									}

								});
							}
						}
					]
				}
			},
			"hideColumns" :[]
		};
		
//		if(DATA.exchangeConfig == 0){
//			tableList.hideColumns.push('VLAN ID');
//		}

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
		function otherFunc(nowTableObj){
			nowTableObj.getDom().find('td[data-column-title="{name}"]>span[data-local="default"]').parent().prev().children('input').remove();
		}


		return $table;
	}

	function displayTable($container) {
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		$.ajax({
			url: 'common.asp?optType=lan',
			type: 'GET',
			success: function(result) {
				var data = processData(result);
					tableData = data["table"],
					lanData  = data["lan"],
					mac      = data["mac"],
					mode     = data["mode"];
					vlan     = data["vlan"];
				    lanipfull = data["lanipfull"];
                var	titleArr = tableData["title"],
					tableArr  = tableData["data"];
                console.log(data);

				storeTableData(tableArr);

				storeLANData(lanData);
				DATA["mac"] = mac;
				DATA["mode"] = mode;
				DATA["vlan"] = vlan;
				DATA["lanipfull"] = lanipfull;
                var $table = getTableDom();
				$tableCon.append($table);
			}
		});
	}

	function display($container) {


		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','lanConfig'];
		// Translate.translate(tranDomArr, dicArr);
 Translate.preLoadDics(dicArr, function(){
 		// 清空标签页容器
		$container.empty();
		// 获取表格数据并生成表格
		displayTable($container);
 });

	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
