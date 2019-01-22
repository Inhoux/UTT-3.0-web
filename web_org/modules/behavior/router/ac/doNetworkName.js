define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	function tl(str){
    	return require('Translate').getValue(str, ['common','doRouterConfig','doNetName']);
  	}	
	function display() {
		var Path = require('Path');
			// 加载路径导航
			var Translate = require('Translate'); 
		 	var dicNames = ['common', 'doNetName']; 
		 	Translate.preLoadDics(dicNames, function(){ 				
			var pathList = 
			{
	  		"prevTitle" : tl('wirelessExtension'),
	  		"links"     : [
	  			{"link" : '#/wifi_config/network_name', "title" : tl('netName')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('netName')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				displayTable($('#1'));
			});
			/* 初始化后台SzoneAutoUpdata为on*/
			var queryStr='SzoneAutoUpdata=on';
			$.ajax({
				url : '/goform/formSzoneAutoUpGlobalConfig',
				type: 'POST',
				data: queryStr,
				success: function(result){
				}
			});

		    $('a[href="#1"]').trigger('click');
		});
	}
	function displayOnOff(){
		var OnOff = require('P_plugin/OnOff');
	    var $onoff = OnOff.getDom({
	        prevWord:tl('Wireless_extensions')+' :',
	        afterWord:'',
	        id:'checkOpen',
	        defaultType:DATA.feature_AC_En == 'on'?true:false,
	        clickFunc:function($btn,typeAfterClick){
				var ACGlobalEnable = (typeAfterClick == 1?'on':'off');
				var postQueryStr = 'ACGlobalEnable='+ ACGlobalEnable;
				console.log(postQueryStr);
				$.ajax({
				url : 'goform/formFeatureACGloConfig',
				type : 'POST',
				data : postQueryStr,
				success : function(jsStr){
					var Eval = require('Eval');
					var variables = ['status', 'errorstr'];
					var result = Eval.doEval(jsStr, variables),
						isSuccess = result["isSuccessful"];
					if(isSuccess){
						var data = result["data"],
							status = data["status"];
						var Tips = require('Tips');
						if(status == 1){
							Tips.showSuccess('{saveSuccess}');
							displayTable($('#1'));
							if(ACGlobalEnable == 'off'){
								DATA.handleOnOff = true;
							}
							
						}else{
							var errorStr = data["errorstr"];
							Tips.showWarning('{saveFail}' + errorStr);
							
						}
					}
				}
				});
	            //alert(typeAfterClick);
	        }
	    });
	    OnOff.joinTab($onoff);
	}
	// 生成表格
	function displayTable($con){
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);
		$.ajax({
			type:"get",
			url:"common.asp?optType=sZone|lan",
			success:function(result){
				// 数据处理
				processData(result);
				//生成表格
				makeTable($tableCon);
				var tranDomArr = [$con];
				var dicArr     = ['common', 'doNetName'];
				require('Translate').translate(tranDomArr, dicArr);	
				displayOnOff();
				
				/*��ʾ�Ƿ���������չ����*/
				if(DATA.feature_AC_En != 'on' && !DATA.handleOnOff){
					DATA.handleOnOff = true;
					Tips.showConfirm(tl('openWifi'),function(){
						var postQueryStr = 'ACGlobalEnable=on';
						$.ajax({
						url : 'goform/formFeatureACGloConfig',
						type : 'POST',
						data : postQueryStr,
						success : function(jsStr){
							var Eval = require('Eval');
							var variables = ['status', 'errorstr'];
							var result = Eval.doEval(jsStr, variables),
								isSuccess = result["isSuccessful"];
							if(isSuccess){
								var data = result["data"],
									status = data["status"];
								var Tips = require('Tips');
								if(status == 1){
									
									Tips.showSuccess('{saveSuccess}');
									displayTable($('#1'));
								}else{
									var errorStr = data["errorstr"];
									Tips.showWarning('{saveFail}' + errorStr);
									
								}
							}
						}
						});
					},function(){
						
					});
				}
				
				
			}
		});
	}
	
	// 处理数据
	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
		   'wepFormat',
			'wepKeyRadio',
			'wepKey1Type',
			'wepKey2Type',
			'wepKey3Type',
			'wepKey4Type',
			'wpaVersion',
			'wpaEncrp',
			'wpaTime',
			'pskVersion',
			'pskEncry',
			'pskPsswd',
			'pskTime',
		   'addrPoolNames', //地址池名
		   'addrPoolVid', //
		   'encodeType',//电脑or手机
		   'statusSZ',
		   'zoneName', // 网络名称
		   'ssid',		// SSID
/*		   
		   'fre2Arr',
		   'fre5Arr',
		   'cliMaxNumArr',
*/		   
		   'broadcast',//隐藏ssid
		   'isolate',//无线隔离
		   'encrytype', // 安全模式
		   'wepPwd',	//web密钥
		   'radiusPwd',//Radius密码	
		   'sharePwd', //预共享密钥
		   'radiusIP',//Radius服务器IP
		   'radiusPort',//Radius服务器端口
		   'cliMaxNum',
		   'isolate',
		   'vlanId',	//VLAN ID
		   'ipAddr',
		   'netMask',
		   'dhcp',
		   'wepAuthType',	//认证类型
		   'autoIssued',  // 自动下发
		   'limit_type',	// 限速策略
		   'limit_down',	//下载速率
		   'limit_up',		//上传速率
		   'poolVids',	//已创建的vlan(内网配置中显示)
		   'totalrecs',
		   'org_name',
		   'feature_AC_En',
		   'sz_totalrecs',
		   'sz_max_totalrecs',
		   'min_vlanRange',
		   'max_vlanRange',
		   'radiusPsswd'

		   ]; // 变量名称
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   
		    var data = result["data"];
		    DATA.min_vlanRange = data.min_vlanRange;
		    DATA.max_vlanRange = data.max_vlanRange;
		    
		    DATA.feature_AC_En = data.feature_AC_En;
		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			// 声明字段列表
			var fieldArr =['ID','zoneName','ssid',
			/*
			'spjk',
			*/
			'vlanId','dzcname','encrytype',
			'wifipasseord','limit_type','downUpSpeed',
			'autoIssued',
			'encodeType',
			'broadcast',
			'autoSend', //"自动下发"别称，用于编辑
			'isolate', //无线隔离
			'scrtype', //“安全”别称，用于编辑
			'shareType', //“共享”别称，用于编辑
			'upSpeed',	//“上行”别称，用于编辑
			'downSpeed',//“下行”别称，用于编辑
			
			'wepAuthType',//“认证类型”别称，用于编辑
			'wepFormat',//“密钥格式   = 1 16进制、2 共享密钥”  别称，用于编辑
			'wepKeyRadio',//用于编辑
			'wepKey1Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			'wepKey2Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			'wepKey3Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			'wepKey4Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			'wpaVersion',//“WAP版本  = 0自动、1WPA、2WPA2”别称，用于编辑
			'wpaEncrp',//“加密算法   = 0自动、1TKIP、2AES”别称，用于编辑
			'wpaTime',//“密钥更新周期”别称，用于编辑
			'pskVersion',//用于编辑
			'pskEncry',//用于编辑
			'pskPsswd',//“预共享密钥”别称，用于编辑
			'pskTime',//“密钥更新周期”别称，用于编辑
			'wepPwd',//{密钥}1{密钥}2{密钥}3{密钥}4
			'radiusIP',//Radius{服务器}IP
			'radiusPort',//Radius{服务器}端口
			'radiusPsswd',/*Radius密钥*/
/*			
			'cliMaxNumArr',//最大客户端数量
			'fre2Arr',
			'fre5Arr',
*/				
			'ipAddr',
			'poolVids',//已创建的vlan(内网配置中显示)
			'addrPoolNames', //地址池名
		    'addrPoolVid', //
			];
			
			var baseData = [];
			var autoSend=0;
			DATA.ipAddr=data.ipAddr[0];
			DATA.poolVids=data.poolVids;
			DATA.org_name = data.org_name;
			DATA.sz_totalrecs= data.sz_totalrecs;
			DATA.sz_max_totalrecs= data.sz_max_totalrecs;
/***************************vid 与 地址池 页面交互数据***********/
			DATA.vlanId=data.vlanId;
			DATA.addrPoolVid=data.addrPoolVid;
			DATA.addrPoolNames=data.addrPoolNames;
/***************************************************************/
			data.zoneName.forEach(function(obj,i){
				baseData.push([
					Number(i)+1,
					data.zoneName[i],
					data.ssid[i],
/*					
					function(){
						var freStr='';
						var freStr2='';
						var freStr5='';
						if(data.fre2Arr[i]==1){
							freStr2='2.4G';
						}
						if(data.fre5Arr[i]==1){
							freStr5='5G';
						}		
						if(data.fre2Arr[i]!=1&&data.fre5Arr[i]==1){
							freStr='5G';
						}else if(data.fre2Arr[i]==1&&data.fre5Arr[i]!=1){
							freStr='2.4G';
						}else{
							freStr=freStr2+'、'+freStr5;
						}
						return freStr;
					}(),
*/
					function(){
						var vlanidStr;
						if(data.vlanId[i]==0){
							vlanidStr='';
						}else{
							vlanidStr=data.vlanId[i];
						}
						return vlanidStr;
					}(),					
					
					function(){//地址池名称
						var poolStr="{noPoolAddr}";
						var tmpVlanIdStr='';
						data.addrPoolVid.forEach(function(str,index){ 
							var tmpId='';
							if(data.vlanId[i]==''){
								// data.vlanId[i]=0;
								tmpId=0;
							}else{
								tmpId=data.vlanId[i];
							}
							if(data.addrPoolVid[index]==tmpId){	
								poolStr=data.addrPoolNames[index];
							}
						});
						return poolStr;
					}(),
					data.encrytype[i],					
					function(){				//无线密码
						var encryPwdStr='';
						if(data.encrytype[i]==0){
							encryPwdStr='{noneEncry}';
						}else if(data.encrytype[i]==1){
							console.log(data.wepPwd[i]);
							console.log(data.wepKeyRadio[i]);
							encryPwdStr=data.wepPwd[i][data.wepKeyRadio[i]];
						}else if(data.encrytype[i]==2){
							encryPwdStr=data.radiusPwd[i];
						}else if(data.encrytype[i]==3){
							encryPwdStr=data.sharePwd[i];
						}
						return encryPwdStr;
					}(),
					
					function(){
						var shareStr='';

						if(data.limit_type[i]==1){
							shareStr='{shareSpeed}';
						}else if(data.limit_type[i]==2){
							shareStr='{exclusiveSpeed}';
						}else{
							shareStr='{shareSpeed}';
						}
						return shareStr;
					}(),	
					function(){
						var speedStr='';
						speedStr = data.limit_down[i]+'/'+data.limit_up[i];
						return speedStr;
					}(),	
					/*
					function(){
						var shareStr='';
						if(data.autoIssued[i]==1){
							shareStr='{sendOpen}';
							autoSend=1;
						}else if(data.autoIssued[i]==0){
							shareStr='{sendClose}';
							autoSend=0;
						}else{
							shareStr='{sendClose}';
						}
						return shareStr;
					}()	
					*/
					data.autoIssued[i]
					,
					data.encodeType[i],	
					data.broadcast[i],	
					autoSend,	
					data.isolate[i],
					data.encrytype[i],
					data.limit_type[i],
					data.limit_up[i],
					data.limit_down[i],
					data.wepAuthType[i],
					data.wepFormat[i],
					data.wepKeyRadio[i],
					data.wepKey1Type[i],
					data.wepKey2Type[i],
					data.wepKey3Type[i],
					data.wepKey4Type[i],
					data.wpaVersion[i],
					data.wpaEncrp[i],
					data.wpaTime[i],
					data.pskVersion[i],
					data.pskEncry[i],
					data.pskPsswd[i],
					data.pskTime[i],
					data.wepPwd[i],
					data.radiusIP[i],
					data.radiusPort[i],
					data.radiusPsswd[i],
					/*
					data.cliMaxNumArr[i],

					data.fre2Arr[i],
					data.fre5Arr[i],
					*/
					data.poolVids[i],/*已创建的vlan(内网配置中显示)*/
					data.ipAddr[i],
					data.addrPoolNames[i],/*地址池名*/
					data.addrPoolVid[i],
			// 'wepAuthType',//“认证类型”别称，用于编辑
			// 'wepFormat',//“密钥格式   = 1 16进制、2 共享密钥”  别称，用于编辑
			// 'wepKeyRadio',//用于编辑
			// 'wepKey1Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			// 'wepKey2Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			// 'wepKey3Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			// 'wepKey4Type',//“密钥类型1  =  0禁用、1 64位、2 128位”别称，用于编辑
			// 'wpaVersion',//“WAP版本  = 0自动、1WPA、2WPA2”别称，用于编辑
			// 'wpaEncrp',//“加密算法   = 0自动、1TKIP、2AES”别称，用于编辑
			// 'wpaTime',//“密钥更新周期”别称，用于编辑
			// 'pskVersion',//用于编辑
			// 'pskEncry',//用于编辑
			// 'pskPsswd',//“预共享密钥”别称，用于编辑
			// 'pskTime',//“密钥更新周期”别称，用于编辑					
				]);
			});
			
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			
			database.addData(baseData);
	}
	function deleteBtnClick(delstr) {
		//获得提示框组件调用方法
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		// 获得表格中所有被选中的选择框，并获取其数量
        var	primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
			length = primaryKeyArr.length;
		// 判断是否有被选中的选择框或者点击表格中删除按钮
		if (length > 0||delstr!="") {
			var str = '';
			require('Tips').showConfirm(tl('delconfirm'),function(){
//				/*delstr为空，说明点击的是右上角“删除按钮”，此时需要考虑是否选中多条*/
//				if(length==1){
//					if(data[0].zoneName=='default'){
//						Tips.showWarning("{canNotDelDefault}");
//						return;
//					}
//				}
				if (delstr==""){
					primaryKeyArr.forEach(function(primaryKey) {
						var data = database.getSelect({
							primaryKey: primaryKey
						});
						var name = data[0]["zoneName"];
						if(name!='default'){
							str += name + ',';
						}
					});
					str = str.substr(0, str.length - 1);
					str = 'delstr=' + str;
				}else{
					str = delstr;
				}
				$.ajax({
					url: '/goform/formServiceZoneListDel',
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
		} else {
			Tips.showInfo('{unSelectDelTarget}');
		}
	}	
	
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
		{
			"id": "add",
			"name": tl("add"),
			 "clickFunc" : function($btn){
			if(DATA.sz_totalrecs ==  DATA.sz_max_totalrecs){
			    require('Tips').showError(tl('{reachMacNum}'));
			    return ;	
			}
			var data={};
			makeEditModal('add',data);
					
        		}
		},
		{
			"id": "delete",
			"name": "{delete}",
			 "clickFunc" : function($btn){
			 	$btn.blur();
			 	deleteBtnClick("");
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
			"otherFuncAfterRefresh":afterFunc,
			"dicArr" : ['common'],
			"titles": {
				"ID"		 : {
					"key": "ID",
					"type": "text",
				},
				"{netName}"		 : {
					"key": "zoneName",
					"type": "text",
				},
				"SSID"		 : {
					"key": "ssid",
					"type": "text",
				},
/*
				"{spjkIf}"		 : {
					"key": "spjk",
					"type": "text",
				},
*/				
				"{portName}"		 : {
					"key": "vlanId",
					"type": "text",
					"filter":function(str){
						if(str != ''){
						return	DATA.org_name[DATA.poolVids.indexOf(str)];
						}else{
							return '';
						}
					}
				},
				"{addrPoolName}" : {
					"key": "dzcname",
					"type": "text",
				},
				"{safeMode}"		 : {
					"key": "encrytype",
					"type": "text",
					"filter":function(str){
						var encryStr=str;
						if(str==0){
							encryStr='{noneEncry}';
						}else if(str==1){
							encryStr='WEP';
						}else if(str==2){
							encryStr='WPA/WPA2';
						}else if(str==3){
							encryStr='WPA-PSK/WPA2-PSK';
						}
						return encryStr;
					}
				},
				"{wirelessPd}"		 : {
					"key": "wifipasseord",
					"type": "text",
				},
				"{limitType}"		 : {
					"key": "limit_type",
					"type": "text",
				},
				"{downUpSpeed}"		 : {
					"key": "downUpSpeed",
					"type": "text",
				},				
				"{autoSend}"		 : {
					"key": "autoIssued",
					"type": "checkbox",
					"values":{
						'0':false,
						'1':true
					},
					clickFunc:function($tbtn){
						var checkabled = $tbtn.is(':checked');
						var primaryKey = $tbtn.attr('data-primaryKey')
						var tableObj = DATA["tableObj"];
						var data = database.getSelect({primaryKey : primaryKey})[0];
						data.autoIssued = (checkabled?'1':'0');
						makeEditModal('edit',data,true);
						
					}
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var tableObj = DATA["tableObj"];
								console.log(tableObj);
								var data = database.getSelect({primaryKey : primaryKey})[0];
								makeEditModal('edit',data);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var tableObj = DATA["tableObj"];
								var data = database.getSelect({primaryKey : primaryKey})[0];
									delstr='delstr='+data.zoneName;
								deleteBtnClick(delstr);
							}
						}
					]
				}
			}
		};
		var list = {
			head: headData,
			table: tableList
		};
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
			
			
		function afterFunc(nowTObj){
			/* 表格中的密码显示 */
			var $n = nowTObj.getDom();
			$n.find('tr>td[data-column-title="{wirelessPd}"]').each(function(){
				var $t = $(this);
				
				if($t.children('span:not([data-local="{noneEncry}"])').length >0 ){
					var $c = $t.children('span').eq(0);
					var ttext = $c.text();
					var $cover = $('<div style="display:inline-block" class="net_pswd_cover"></div>');
					var $pswd = $('<span style="font-weight:bold" class="netsher_table_paswd" data-local="'+ttext+'" data-pswd="'+ttext+'"  data-hidepswd="······">······<span>');
					var $eye = $('<span class="netsher_table_eyes glyphicon glyphicon-eye-open"></span>');
					$cover.append($pswd,$eye);
					$c.after($cover);
					$c.remove();
				}
			});
			/* 除默认选项外不允许其他自动下发*/
			$n.find('tr>td[data-column-title="{autoSend}"]').each(function(){
				var $t = $(this);
				var netname = $t.parent().find('[data-column-title="{netName}"]').text();
				if(netname != 'default' && netname != 'default_5G' ){
					$t.empty();
				}
			});
		}
		/* 绑定表格全局小眼睛 */
		
		$table.on('click','.netsher_table_eyes',function(event){
			var ev = event || window.event;
			var tar = ev.target || ev.srcElement;
			var $t = $(tar);
			
			if($t.hasClass('glyphicon-eye-open')){
				$t.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
				var $p = $t.prevAll('.netsher_table_paswd');
				$p.html($p.attr('data-pswd')).css('font-weight','normal');
			}else{
				$t.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
				var $p = $t.prevAll('.netsher_table_paswd');
				$p.html($p.attr('data-hidepswd')).css('font-weight','bold');
			}
		})
	
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		$tableCon.append($table);
	}
	
	// 处理编辑的ajax请求
	function processEditData(data,initEdit){
		$.ajax({
			type:"get",
			url:"common.asp?optType=editsZone&edit_Name="+data.zoneName,
			async:true,
			success:function(res){
				var doEval = require('Eval');
				   var variableArr = [
				   'zoneName',
				   'vlanType',  
				   'ssid',		 
				   'encodeType',
				   'enBroadcast', 
				   'fre2',
				   'fre5',
				   'broadcastEn',
				   'cliMaxNum',
				   'isolateEn',
				   'vlanId',
				   'dhcpPool',
				   'client',
				   'encryType',
				   'wepAuthType',
				   'wepFormat',
				   'wepKeyRadio',   
				   'wepKey1Text',	 
				   'wepKey1Type',
				   'wepKey2Text',
				   'wepKey2Type',
				   'wepKey3Text',
				   'wepKey3Type',
				   'wepKey4Text',
				   'wepKey4Type',
				   'wpaVersion',
				   'wpaEncrp',
				   'radiusIP',
				   'radiusPort',
				   'radiusPsswd',
				   'wpaTime',
				   'pskVersion',
				   'pskEncry',
				   'pskPsswd',
				   'pskTime',
				   'ipAddr',
				   'dhcpServer',
				   'pool',
				   'apvlan',
				   'limit_type',
				   'limit_down',
				   'limit_up',
				   'poolNames',
				   'share_select',
				   'poolVid',
				   'beginIp',
				   'endIp',
				   'gateWays',
				   'netMasks',
				   'txBand',
				   'rxBand',
				   'errorstr'
				   ]; // 变量名称
				   var result = doEval.doEval(res, variableArr);
				   if (!result.isSuccessful) {
				       Tips.showError('{parseStrErr}');
				       return false;
				    }
				   
				    var data = result["data"];
				    initEdit(data);
			}
		});
	}
	
	// 生成编辑和新增弹框
	function makeEditModal(type,data,checkSave){
		/******************/
		console.log(DATA.vlanId);
		console.log(DATA.addrPoolVid);
		console.log(DATA.addrPoolNames);
		/******************/
		var zoneName = '', // 网络名称
			ssid = '', // SSID
			encodeType = '', // 电脑/手机优先   = 1手机、0电脑
			fre2 = '1', // 射频接口  = 1开启、0关闭
			fre5 = '1',
			vlanType = '0', // 自动下发   = 1开启、0关闭
			broadcastEn = '1', // SSID隐藏  = 0开启、1关闭
			cliMaxNum = '1',// 最多客户端数量限
			isolateEn = '0', // 无线客户端隔离  = 1开启、0关闭
			vlanId = '',// VLAN ID
			dhcpPool = '',// 地址池名称
			encryType = '0',// 加密方式   = 0无、1WEP、2WPA/WPA2、3 WPA-PSK/
			wepAuthType = '0',// 认证类型 = 0自动、1开放系统、2共享密钥
			wepFormat = '1', // 密钥格式   = 1 16进制、2 ASCII码
			wepKeyRadio = '0',// 密钥选择
			wepKey1Text = '', // 密钥文本1
			wepKey2Text = '', // 密钥文本2
			wepKey3Text = '', // 密钥文本3
			wepKey4Text = '', // 密钥文本4
			wepKey1Type = '0', // 密钥类型1  =  0禁用、1 64位、2 128位
			wepKey2Type = '0', // 密钥类型2
			wepKey3Type = '0', // 密钥类型3
			wepKey4Type = '0', // 密钥类型4
			wpaVersion = '0',// WAP版本  = 0自动、1WPA、2WPA2
			wpaEncrp = '0', // 加密算法   = 0自动、1TKIP、2AES
			radiusIP = '0.0.0.0', // Radius服务器IP
			radiusPort = '1812',//  Radius服务器端口
			radiusPsswd = '',// Radius密码
			wpaTime = '0', // 密钥更新周期
			pskPsswd = '', // 预共享密钥
			pskTime = '0',// 密钥更新周期
			share_select = '2', // 限速策略   = 2独享、1共享
			txBand = '0',// 上行宽带
			rxBand = '0';// 下行宽带
			
			/*
			var lanid={
				    "value" : 0,                                                                                  
                    "name"  : '',
			}
			modeInputJson.push(lanid);
            DATA.poolVids.forEach(function(item, index){
                var obj = { 
                    "value" : DATA.poolVids[index],                                                                                  
                    "name"  : DATA.poolVids[index],
                };  
                modeInputJson.push(obj);
            }); 	
            */
           var modeInputJson = []; 
//         if(!(DATA.vlanId.indexOf('0')>=0) || data.vlanId == ''){
           	modeInputJson = [{value:'',name:'{default}'}]; 
//         }
             var canuse = {};
             DATA.poolVids.forEach(function(obj,i){
//           	canuse[obj] = DATA.addrPoolNames[i];
					if(!(DATA.vlanId.indexOf(obj)>=0) || data.vlanId == obj){
						var objnow = { 
		                    "value" : obj,                                                                                  
		                    "name"  : (obj == '0'?'':DATA.org_name[i])
		                };  
		                modeInputJson.push(objnow);
					}
             		
             });
//           console.log(canuse)
             
             
             
            
		if(type == 'edit'){
			fre2=0;
			fre5=0;
			zoneName = data.zoneName||''; // 网络名称
			ssid = data.ssid||''; // SSID
			encodeType = data.encodeType||''; // 电脑/手机优先   = 1手机、0电脑
			fre2=data.fre2Arr;
			fre5=data.fre5Arr;
			vlanType = data.autoIssued||'0'; // 自动下发   = 1开启、0关闭j

			if(data.broadcast==true){// SSID隐藏  = 1 关闭、0 开启
				broadcastEn=1;
			}else{
				broadcastEn=0;
			}
			cliMaxNum = data.cliMaxNumArr||'0';// 最多客户端数量限
			isolateEn = data.isolate||'0'; // 无线客户端隔离  = 1开启、0关闭
			if(data.vlanId==''){
				vlanId = 0;
			}else{
				vlanId = data.vlanId||'';// VLAN ID
			}
			dhcpPool = data.dzcname||'';// 地址池名称
			encryType = data.scrtype||'0';// 加密方式   = 0无、1WEP、2WPA/WPA2、3 WPA-PSK/

			wepAuthType = data.wepAuthType||'0';// 认证类型
			console.log(data.wepKeyRadio);
			console.log(data);
			wepKeyRadio = data.wepKeyRadio || '0';// 密钥类型 0、1、2、3
			wepFormat = data.wepFormat||'1'; // 密钥格式   = 1 16进制、2 共享密钥
			wepKey1Text = data.wepPwd[0]||''; // 密钥文本1
			wepKey2Text = data.wepPwd[1]||''; // 密钥文本2
			wepKey3Text = data.wepPwd[2]||''; // 密钥文本3
			wepKey4Text = data.wepPwd[3]||''; // 密钥文本4
			wepKey1Type = data.wepKey1Type||'0'; // 密钥类型1  =  0禁用、1 64位、2 128位
			wepKey2Type = data.wepKey2Type||'0'; // 密钥类型2
			wepKey3Type = data.wepKey3Type||'0'; // 密钥类型3
			wepKey4Type = data.wepKey4Type||'0'; // 密钥类型4
//			alert(encryType)
//			alert(data.wpaEncrp)
//			alert(data.pskEncry)
			if(encryType == 2){  //WEP模式
				wpaVersion = data.wpaVersion||'0';// WAP版本  = 0自动、1WPA、2WPA2
				wpaEncrp = data.wpaEncrp||'0'; // 加密算法   = 0自动、1TKIP、2AES				
			}
			if(encryType == 3){//WPA-PSK模式
				wpaVersion = data.pskVersion||'0';
				wpaEncrp = data.pskEncry||'0';
			}
			radiusIP = data.radiusIP||'0.0.0.0'; // Radius服务器IP
			radiusPort = data.radiusPort||'1812';//  Radius服务器端口
			radiusPsswd = data.radiusPsswd||'';// Radius密码
			wpaTime = data.wpaTime||''; // 密钥更新周期
			// pskPsswd = data.pskPsswd||'12345678'; // 预共享密钥
			pskPsswd = data.pskPsswd||''; // 预共享密钥
			pskTime = data.pskTime||'0';// 密钥更新周期
			share_select = data.shareType||'1'; // 限速策略   = 2独享、1共享
			txBand = data.upSpeed||'0';// 上行宽带
			rxBand = data.downSpeed||'0';// 下行宽带
		}
		
		var modallist = {
			id:'tab_modal',
			title:type=='add'?tl("add"):tl('edit'),
			size:'large',
			"btns" : [
				 {
	                "id"      : 'prev_tab',
	                "name"		: '{prePg}',
	                "clickFunc" : function($this){
	                	DATA.tabModalObj.getDom().find('nav>ul.nav>li.active').prev().children('a').trigger('click');
	                }
	            },
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                	editModalSave(type);
	                }
	            },
	            {
	                "type"      : 'reset',
	                clickFunc : function(){
	                }
	            },
	            {
	                "id"      : 'next_tab',
	                "name"		: '{nextPg}',
	                "clickFunc" : function($this){
	                	if(require('InputGroup').checkErr(DATA.tabModalObj.getDom().find(DATA.tabModalObj.getDom().find('nav>ul.nav>li.active').children('a').attr('href'))) == 0){
	                		DATA.tabModalObj.getDom().find('nav>ul.nav>li.active').next().children('a').trigger('click');
	                	}
	                	
	                }
	            },
	            {
	                "type"      : 'close'
	            }
	        ]
		};
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(modallist);
		DATA.tabModalObj = modalObj;
		/* 绑定特有的重填方法 */
		var $newreset = modalObj.getDom().find('#reset').clone(false).attr('id','newreset');
		modalObj.getDom().find('#reset').after($newreset);
		modalObj.getDom().find('#reset').remove();
		$newreset.click(function(){
			var $active = $(modalObj.getDom().find('nav>ul.nav>li.active>a').attr('href')).wrap('<form></form>');
			$active.parent()[0].reset();
			$active.unwrap();
			setTimeout(function(){
				$active.find('[type="radio"]:checked,select').each(function(){
					var $ti = $(this);
//					if($ti.is(':visible')){
						var thisTagName = $ti[0].tagName;
						if(thisTagName == 'INPUT'){
							$ti.trigger('click');
						}else if(thisTagName == 'SELECT'){
							$ti.trigger('change');
						}
//					}
				});
				//取消所有报错气泡
				$active.find('.input-error').remove();
			},1)
		});
		
		
		var Tabs = require('Tabs');
		var tabsList = [
			{"id" : "e1", "title" : tl('wirelessSet')},
/*			
			{"id" : "e2", "title" : tl('vlanSetVLAN')},
*/
			{"id" : "e3", "title" : tl('safeSet')},
			{"id" : "e4", "title" : tl('bandwidthSet')}
		];
		var $tabsDom = Tabs.get$Dom(tabsList);
		modalObj.insert($tabsDom);
		var $tabmod = modalObj.getDom();
		$tabmod.find('a[href="#e1"]').click(function(event) {
			if(!$tabmod.find('#gjxx').hasClass('gjxx_close')){
				$tabmod.find('#gjxx').trigger('click');
			}
			showbtns(1);
		});
		$tabmod.find('a[href="#e2"]').click(function(event) {
			showbtns(2);
		});
		$tabmod.find('a[href="#e3"]').click(function(event) {
			showbtns(2);
		});
		$tabmod.find('a[href="#e4"]').click(function(event) {
			showbtns(3);
		});
		
		function showbtns(btnsType){
			var $pb = $tabmod.find('#prev_tab').parent();
			var $nb = $tabmod.find('#next_tab').parent();
			var $save = $tabmod.find('#save').parent();
			if(btnsType == '1'){
				// 起始tab
				$pb.addClass('u-hide');
				$nb.removeClass('u-hide');
				$save.addClass('u-hide');
			}else if(btnsType == '2'){
				// 中间tab
				$pb.removeClass('u-hide');
				$nb.removeClass('u-hide');
				$save.addClass('u-hide');
			}else if(btnsType == '3'){
				// 结束tab
				$pb.removeClass('u-hide');
				$nb.addClass('u-hide');
				$save.removeClass('u-hide');
			}
		}
		
		
		
		
		 displaye1($tabmod.find('#e1'));
//	     displaye2($tabmod.find('#e2'));
	     displaye3($tabmod.find('#e3'));
	     displaye4($tabmod.find('#e4'));
	     $tabmod.find(' a[href="#e1"]').trigger('click');
	   	 $tabmod.find('.modal-body').css({'min-height':'217px'})
	   	if(!checkSave){
			modalObj.show();
		}else{
			editModalSave(type,checkSave);
		}
	   	/*
	   	 	获得初始化的数据
	   	 * */
	   	var netName = '',
	   	    ssid	= '';
		/* 无线设置 */
		function displaye1($tabcon){
			var inputlist = [
				 {
			    	"necessary" :true,
			    	"prevWord"	:'{netName}',
			    	"disabled"	:type=='edit'? true:false,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'zoneName',
				        "value"      : zoneName,
				        "checkDemoFunc" : ['checkName','1','12']
				    },
				    "afterWord": ''
				},
				{
			    	"necessary" :true,
			    	"prevWord"	:'SSID',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'ssid',
				        "value"      : ssid,
				        "checkDemoFunc": ['checkInput', 'name', '1', '32',6] 
				    },
				    "afterWord": ''
				},
/*				
				{
			    	"prevWord"	:'{spjkIf}',
				    "inputData" : {
				        "type"       : 'checkbox',
				        "name"       : 'spjk',
				        "defaultValue" : [(fre2==1?'fre2':'0'),(fre5==1?'fre5':'0')],
				        items:[
				        	{name:'2.4G' ,value:'fre2',checkOn:'1',checkOff:'0'},
				        	{name:'5G' ,value:'fre5',checkOn:'1',checkOff:'0'}
				        ]
				    },
				    "afterWord": ''
				},
*/				{
					"necessary" :false,
			    	"prevWord"	:'{portName}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'vlanId',
				        "defaultValue" : vlanId,
				        'items':modeInputJson
				    },
				    "afterWord": ''
				},
				{
			    	"prevWord"	:'{autoSend}',
			    	"display"	:!(zoneName != 'default' && zoneName != 'default_5G'),
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'vlanType',
				        "defaultValue" : vlanType,
				        items:[
				        	{name:'{open}' ,value:'1'},
				        	{name:'{close}' ,value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
				
				/*
				{
					
					"necessary" :false,
			    	"prevWord"	:'{addrPoolName}',
			    	"disabled" :'true',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'dhcpPool',
				        "value" : dhcpPool,
				    },
				    "afterWord": ''
				},
				*/
				{
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'gjxx',
				        "value"      : ''
				    },
				},
				{	
					"sign":'gj',
			    	"prevWord"	:'SSID广播',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'broadcastEn',
				        "defaultValue" : broadcastEn.toString(),
				        items:[
				        	{name:'{open}' ,value:'1'},
				        	{name:'{close}' ,value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
/*				
				{	
					"sign":'gj',
			    	"prevWord"	:'{maxCliNumLimit}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'cliMaxNum',
				        "value"      : cliMaxNum,
				        "checkDemoFunc" : ['checkNum','0','36'] 
				    },
				    "afterWord": ''
				},
*/				
				{	
					"sign":'gj',
			    	"prevWord"	:'{wirelessIsolation}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'isolateEn',
				        "defaultValue" : isolateEn,
				        items:[
				        	{name:'{open}' ,value:'1'},
				        	{name:'{close}' ,value:'0'}
				        ]
				    },
				    "afterWord": ''
				},
				// {	
				// 	"sign":'gj',
			 //    	"prevWord"	:'{有线客户端隔离}',
				//     "inputData" : {
				//         "type"       : 'radio',
				//         "name"       : 'yxkhdgl',
				//         "defaultValue" : 'on',
				//         items:[
				//         	{name:'{开启}' ,value:'1'},
				//         	{name:'{关闭}' ,value:'0'}
				//         ]
				//     },
				//     "afterWord": ''
				// },
				// {	
				// 	"sign":'gj',
			 //    	"prevWord"	:'{多SSID隔离}',
				//     "inputData" : {
				//         "type"       : 'radio',
				//         "name"       : 'dSSIDgl',
				//         "defaultValue" : 'on',
				//         items:[
				//         	{name:'{开启}' ,value:'1'},
				//         	{name:'{关闭}' ,value:'0'}
				//         ]
				//     },
				//     "afterWord": ''
				// }
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			/* 电脑/手机优先 */
			$input.find('[name="ssid"]').after('<select name="encodeType" style="margin-left:10px"><option value="1" data-local="{phoneFirst}"'+(encodeType=='1'?'selected="selected"':'')+'>{phoneFirst}</option><option value="0" data-local="{computerFirst}" '+(encodeType=='0'?'selected="selected"':'')+'>{computerFirst}</option></select>');
			
			/* 自动下发 切换 */
			makeTheVlanTypeChange()
			$input.find('[name="vlanType"]').click(function(){
				makeTheVlanTypeChange()
			})
			function makeTheVlanTypeChange(){
				if($input.find('[name="vlanType"]:checked').val() == '1'){
					$input.find('[name="vlanId"]').attr('disabled','disabled');
				}else{
					$input.find('[name="vlanId"]').removeAttr('disabled');
				}
			}
			
			/*vlan切换*/
			/*
			makeTheVlanIdChange()
			$input.find('[name="vlanId"]').change(function(){
				makeTheVlanIdChange()
			})
			function makeTheVlanIdChange(){
				$input.find('[name="dhcpPool"]').val(canuse[$input.find('[name="vlanId"]').val()]);
			}
			*/
			/* 新增按钮 */
			var linkdatas1 = [
				{
					id : 'tab2-add1',
					name : tl("add"),
					clickFunc :function($thisDom){
						addVLANTab($input.find('[name="vlanId"]'));
					}
				}
			];
		
			InputGroup.insertLink($input,'vlanId',linkdatas1);
			
			
			/*
			var linkdatas2 = [
				{
					id : 'tab2-add2',
					name : tl("add"),
					clickFunc :function($thisDom){
						addDZCTab($input.find('[name="dhcpPool"]'),$input.find('[name="vlanId"]'));
					}
				}
			];
		
			InputGroup.insertLink($input,'dhcpPool',linkdatas2);
			*/
			$input.find('[name="vlanId"]').after($input.find('#tab2-add1').css('margin-left','10px'));
			/*
			$input.find('[name="dhcpPool"]').after($input.find('#tab2-add2').css('margin-left','10px'));
			*/
			/* 高级选项切换*/
			//$input.find('[name="gjxx"]').parent().prev().attr('colspan','2').empty().append('<a id="gjxx" class="gjxx_close"  data-local="{advancedOptions}">{advancedOptions}<a/>'); 
			$input.find('[name="gjxx"]').parent().prev().attr('colspan','2').empty().append('<a id="gjxx" class="gjxx_close" ><a/>'); 
			$input.find('[name="gjxx"]').parent().remove();
			//$input.find('tr[data-control="gj"]').addClass('u-hide');
			$input.find('#gjxx').css('cursor','pointer').click(function(){
				var $t = $(this);
				if($t.hasClass('gjxx_close')){
					$t.removeClass('gjxx_close');
					$t.text(tl('hideAdvancedOptions'));
					$input.find('tr[data-control="gj"]').removeClass('u-hide');
				}else{
					$t.addClass('gjxx_close');
					$t.text(tl('advancedOptions'));
					$input.find('tr[data-control="gj"]').removeClass('u-hide');
					//$input.find('tr[data-control="gj"]').addClass('u-hide');
				}
			})
			$tabcon.empty().append($input);
			
			
			$input.find('tr').each(function(){
				$(this).children('td').eq(0).css('width','101px')
			})
			
			/*添加提示*/
			$input.find('#tab2-add1').after('<span class="u-prompt-word"  style="color:red !important">(&nbsp;为该无线SSID指定端口的VLAN ID&nbsp;)</span>')
			
			
			var tranDomArr = [$input,$tabmod];
			var dicArr     = ['common', 'doNetName'];
			require('Translate').translate(tranDomArr, dicArr);	

		}
		
		/* VLAN设置 */
		function displaye2($tabcon){
			
			var inputlist = [
				{
					"necessary" :false,
			    	"prevWord"	:'VLAN ID',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'vlanId',
				        "defaultValue" : vlanId,
				        'items':modeInputJson
				    },
				    "afterWord": ''
				},
				{
					"necessary" :false,
			    	"prevWord"	:'{addrPoolName}',
			    	"disabled" :'true',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'dhcpPool',
				        "value" : dhcpPool,
				    },
				    "afterWord": ''
				},
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			
			/* 新增按钮 */
			var linkdatas1 = [
				{
					id : 'tab2-add1',
					name : tl("add"),
					clickFunc :function($thisDom){
						addVLANTab($input.find('[name="vlanId"]'));
					}
				}
			];
		
			InputGroup.insertLink($input,'vlanId',linkdatas1);
			
			var linkdatas2 = [
				{
					id : 'tab2-add2',
					name : tl("add"),
					clickFunc :function($thisDom){
						addDZCTab($input.find('[name="dhcpPool"]'),$input.find('[name="vlanId"]'));
					}
				}
			];
		
			InputGroup.insertLink($input,'dhcpPool',linkdatas2);
			
			
			
			$tabcon.empty().append($input);
			var tranDomArr = [$input];
			var dicArr     = ['common', 'doNetName'];
			require('Translate').translate(tranDomArr, dicArr);				
		}
		
		/* 安全设置 */
		function displaye3($tabcon){
			
			var inputlist = [
				{
			    	"prevWord"	:'{screType}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'encryType',
				        "defaultValue" : encryType,
				        items:[
				        	{name:'{noneEncry}' ,value:'0',control:'0'},
				        	{name:'WEP' ,value:'1',control:'1'},
				        	{name:'WPA/WPA2' ,value:'2',control:'2'},
				        	{name:'WPA-PSK/WPA2-PSK' ,value:'3',control:'3'},
				        ]
				    },
				    "afterWord": ''
				},
				/* WEP */
				{	sign:'1',
			    	"prevWord"	:'{authType}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'wepAuthType',
				        "defaultValue" : wepAuthType,
				        items:[
					        {name:'{autoAuth}' ,value:'0'},
					        {name:'{openSystem}' ,value:'1'},
				        	{name:'{shareKey}' ,value:'2'}
				        ]
				    },
				    "afterWord": ''
				},
				{	sign:'1',
			    	"prevWord"	:'{keyType}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'wepFormat',
				        "defaultValue" : wepFormat,
				        items:[
					        {name:'{hexType}' ,value:'1'},
					        {name:'{asciiType}' ,value:'2'},
				        ]
				    },
				    "afterWord": ''
				},
				
				{
					sign:'1',
			    	"prevWord"	:'',
				    "inputData" : {
				        "type"       : 'words',
				        "name"       : '',
				        "value" : '{authTip}'
				    },
				    "afterWord": ''
				},
				{
					sign:'1',
			    	"prevWord"	:'{keyChoose}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'wepmiyue',
				        value: ''
				    },
				    "afterWord": ''
				},
				{
					sign:'1',
			    	"prevWord"	:'{key}1',
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'wepKey1Text',
				        "value"      : wepKey1Text,
				        "eye"		: true,
				        "checkDemoFunc" : ['checkDemoPassword','wepKey1Type',"wepFormat", "wepKeyRadio",0] 
				    },
				    "afterWord": ''
				},
				{
					sign:'1',
			    	"prevWord"	:'{key}2',
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'wepKey2Text',
				        "value"      : wepKey2Text,
				        "eye"		: true,
				        "checkDemoFunc" : ['checkDemoPassword','wepKey2Type',"wepFormat", "wepKeyRadio",1] 
				    },
				    "afterWord": ''
				},
				{
					sign:'1',
			    	"prevWord"	:'{key}3',
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'wepKey3Text',
				        "value"      : wepKey3Text,
				        "eye"		: true,
				        "checkDemoFunc" : ['checkDemoPassword','wepKey3Type',"wepFormat", "wepKeyRadio",2] 
				    },
				    "afterWord": ''
				},
				{
					sign:'1',
			    	"prevWord"	:'{key}4',
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'wepKey4Text',
				        "value"      : wepKey4Text,
				        "eye"		: true,
				        "checkDemoFunc" : ['checkDemoPassword','wepKey4Type',"wepFormat",  "wepKeyRadio",3] 
				    },
				    "afterWord": ''
				},
				 /* WPA/WPA2 */
				{	sign:'2,3',
			    	"prevWord"	:'WPA{version}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'wpaVersion',
				        "defaultValue" : wpaVersion,
				        items:[
				        	{name:'WPA/WPA2混合' ,value:'0'},
				        	{name:'WPA' ,value:'1'},
				        	{name:'WPA2' ,value:'2'}
				        ]
				    },
				    "afterWord": ''
				},
				{	sign:'2,3',
			    	"prevWord"	:'{screEncrp}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'wpaEncrp',
				        "defaultValue" : wpaEncrp,
				        items:[
				        	{name:'{autoAuth}' ,value:'0'},
				        	{name:'TKIP' ,value:'1'},
				        	{name:'AES' ,value:'2'}
				        ]
				    },
				    "afterWord": ''
				},
				{
					sign:'2',
			    	"prevWord"	:'Radius{server}IP',
			    	"necessary" : true,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'radiusIP',
				        "value"		 : radiusIP,
				        "checkFuncs" : ['checkIP']
				    },
				    "afterWord": ''
				},
				{
					sign:'2',
			    	"prevWord"	:'Radius{serverPort}',
			    	"necessary" : true,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'radiusPort',
				        "value": radiusPort,
				        "checkDemoFunc" : ['checkNum','1','65535'] 

				    },
				    "afterWord": '{serverPortTip}'
				},
				{
					sign:'2',
			    	"prevWord"	:'Radius{scret}',
			    	"necessary" : true,
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'radiusPsswd',
				        "value": radiusPsswd,
				        "eye"	:true,
				        "checkDemoFunc": ['checkDemoPasswordNULL', 'name', '8', '30', '5']
				    },
				    "afterWord": '{scretTip}'
				},
				{
					sign:'2',
			    	"prevWord"	:'{keyFreshTime}',
			    	"necessary" : true,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'wpaTime',
				        "value"		 : wpaTime,
				        "checkDemoFunc" : ['checkInput','num', '60','86400', 'freshTime'] 
				    },
				    "afterWord"		 : '{keyFreshTimeTip}'
				},
				/*
				{
					sign:'2',
			    	"prevWord"	:'{自动下发}',
				    "inputData" : {
				        "type"       : 'checkbox',
				        "name"       : 'vlanType',
				        defaultValue: [(vlanType=='1'?'on':'')],
				        items:[
				        	{name:'',value:'on',checkOn:'1',checkOff:'0'},
				        ]
				    },
				    "afterWord": ''
				},
				*/
				
				
				/* WPA-PSK/WPA2-PSK */
				
				/*
				{	sign:'3',
			    	"prevWord"	:'WPA{版本}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'wpaVersion',
				        "defaultValue" : wpaVersion,
				        items:[
				        	{name:'WPA' ,value:'WPA'}
				        ]
				    },
				    "afterWord": ''
				},
				{	sign:'3',
			    	"prevWord"	:'{加密算法}',
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'jmsf2',
				        "defaultValue" : 'AES',
				        items:[
				        	{name:'AES' ,value:'AES'}
				        ]
				    },
				    "afterWord": ''
				},
				*/
				{
					sign:'3',
			    	"prevWord"	:'{preShareKey}',
			    	"necessary" : true,
				    "inputData" : {
				        "type"       : 'password',
				        "name"       : 'pskPsswd',
				        "value"		 : pskPsswd,
				        "eye"		:true,
				        "checkDemoFunc": ['checkDemoPasswordNULL', 'name', '8', '30', '5']
				    },
				    "afterWord": '（取值范围：8-30个字符，出厂默认密码：88888888）'
				},
				{
					sign:'3',
			    	"prevWord"	:'{keyFreshTime}',
			    	"necessary" : true,
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'pskTime',
				        "value"		 : pskTime,
				        "checkDemoFunc" : ['checkInput','num','60','86400', 'freshTime'] 
				    },
				    "afterWord": '{keyFreshTimeTip}'
				},
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			
			// 使顶格td长度固定
			$input.find('tr').children(':first').width('138px');
			
			// 密钥titile
			$input.find('[name="wepmiyue"]').after('<span style="margin-left:24px"  data-local="{webKey}">{webKey}</span><span style="margin-left:115px" data-local="{passwdType}">{passwdType}</span>');
			$input.find('[name="wepmiyue"]').parent().attr('colspan',2).next().remove();
			$input.find('[name="wepmiyue"]').remove();
			
			// 密钥1234
			$input.find('[name="wepKey1Text"]').before('<input type="radio" name="wepKeyRadio" value="0" style="margin-right:10px" '+(wepKeyRadio=='0'?'checked="true"':'')+'/>');
			$input.find('[name="wepKey2Text"]').before('<input type="radio" name="wepKeyRadio" value="1" style="margin-right:10px" '+(wepKeyRadio=='1'?'checked="true"':'')+'/>');
			$input.find('[name="wepKey3Text"]').before('<input type="radio" name="wepKeyRadio" value="2" style="margin-right:10px" '+(wepKeyRadio=='2'?'checked="true"':'')+'/>');
			$input.find('[name="wepKey4Text"]').before('<input type="radio" name="wepKeyRadio" value="3" style="margin-right:10px" '+(wepKeyRadio=='3'?'checked="true"':'')+'/>');
			
			
			$input.find('[name="wepKey1Text"],[name="wepKey2Text"],[name="wepKey3Text"],[name="wepKey4Text"]').parent().attr('colspan',2);
			$input.find('[name="wepKey1Text"]').after('<select class="edittab_mytype" name="wepKey1Type" style="margin-left:10px;width:80px" >'+
													'<option value="0" data-local="{disable}" '+(wepKey1Type=='0'?'selected="selected"':'')+'>{disable}</option>'+
													'<option value="1" data-local="64{bit}" '+(wepKey1Type=='1'?'selected="selected"':'')+'>64{bit}</option>'+
													'<option value="2" data-local="128{bit}" '+(wepKey1Type=='2'?'selected="selected"':'')+'>128{bit}</option>'+
												'</select>');
			$input.find('[name="wepKey2Text"]').after('<select class="edittab_mytype" name="wepKey2Type" style="margin-left:10px;width:80px" >'+
													'<option value="0" data-local="{disable}" '+(wepKey2Type=='0'?'selected="selected"':'')+'>{disable}</option>'+
													'<option value="1" data-local="64{bit}" '+(wepKey2Type=='1'?'selected="selected"':'')+'>64{bit}</option>'+
													'<option value="2" data-local="128{bit}" '+(wepKey2Type=='2'?'selected="selected"':'')+'>128{bit}</option>'+
												'</select>');
			$input.find('[name="wepKey3Text"]').after('<select class="edittab_mytype" name="wepKey3Type" style="margin-left:10px;width:80px" >'+
													'<option value="0" data-local="{disable}" '+(wepKey3Type=='0'?'selected="selected"':'')+'>{disable}</option>'+
													'<option value="1" data-local="64{bit}" '+(wepKey3Type=='1'?'selected="selected"':'')+'>64{bit}</option>'+
													'<option value="2" data-local="128{bit}" '+(wepKey3Type=='2'?'selected="selected"':'')+'>128{bit}</option>'+
												'</select>');
			$input.find('[name="wepKey4Text"]').after('<select class="edittab_mytype" name="wepKey4Type" style="margin-left:10px;width:80px" >'+
													'<option value="0" data-local="{disable}" '+(wepKey4Type=='0'?'selected="selected"':'')+'>{disable}</option>'+
													'<option value="1" data-local="64{bit}" '+(wepKey4Type=='1'?'selected="selected"':'')+'>64{bit}</option>'+
													'<option value="2" data-local="128{bit}" '+(wepKey4Type=='2'?'selected="selected"':'')+'>128{bit}</option>'+
												'</select>');
			$input.find('[name="wepKey1Text"],[name="wepKey2Text"],[name="wepKey3Text"],[name="wepKey4Text"]').parent().next().remove();
			/* 修改部分样式*/
			$input.find('[data-control="1"]').addClass('democonrrr');
			$input.find('.democonrrr .u-password-eye').css({'left':'164px','z-index':'100'});
			/* 绑定部分事件  */
			$input.find('select.edittab_mytype').change(function(){
				makeEdittabMytypeChange(this);
			});
			
			setTimeout(function(){
				$input.find('select.edittab_mytype').trigger('change');
				makeWepKeyRadioChange()
			},500);
			
			
			function makeEdittabMytypeChange(thisDom){
				var $t = $(thisDom);
				var $chooseDom = $t.prevAll('input[type="radio"]');
				var $inputDom = $t.prevAll('input[type="text"],input[type="password"]');
				if($t.val() != '0'){
					$chooseDom.removeAttr('disabled');
					$inputDom.removeAttr('disabled');
					$inputDom.blur();
				}else{
					$chooseDom.attr('disabled','disabled');
					$inputDom.attr('disabled','disabled');
					$inputDom.val('').blur();
				}
			}
			
			$input.find('[name="wepKeyRadio"]').click(function(){
				makeWepKeyRadioChange();
				})
			function makeWepKeyRadioChange(){
				InputGroup.checkErr($input.find('[name="wepKey1Text"],[name="wepKey2Text"],[name="wepKey3Text"],[name="wepKey4Text"]').parent())
			}
			
			
			$input.find('[name="wepFormat"]').change(function(){
				InputGroup.checkErr($input.find('[name="wepKey1Text"],[name="wepKey2Text"],[name="wepKey3Text"],[name="wepKey4Text"]').parent())
			});
			
			
			
			$tabcon.empty().append($input);
			$tabcon.append('<style>.democonrrr .input-error{left:276px !important;}</style>')
			var tranDomArr = [$input];
			var dicArr     = ['common', 'doNetName'];
			require('Translate').translate(tranDomArr, dicArr);			
		}
		
		/* 带宽设置 */
		function displaye4($tabcon){
			
			var inputlist = [
				{	
			    	"prevWord"	:'{limitType}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'share_select',
				        "defaultValue" : share_select,
				        items:[
				        	{name:'{shareLimitSpeed}' ,value:'1'},
				        	{name:'{exclusiveLimitSpeed}' ,value:'2'}
				        ]
				    },
				    "afterWord": ''
				},
				{	
			    	"prevWord"	:'{upSpeed}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'txBand',
				        "value"      : txBand,
				        "checkDemoFunc" : ['checkNum','0','100000'] 
				    },
				},
				{	
			    	"prevWord"	:'{downSpeed}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'rxBand',
				        "value"      : rxBand,
				        "checkDemoFunc" : ['checkNum','0','100000'] 
				    },
				}
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			
			/* 添加上下行后缀辅助选择框 */
			$input.find('[name="txBand"],[name="rxBand"]').parent().attr('colspan','2').next().remove();
			$input.find('[name="txBand"],[name="rxBand"]').after(' kbit/s <==');
			
			var selectarr = ["{noLimitSpeed}","{custom}","64K", "128K", "256K", "512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M"];
			var sevalue =   ["0","auto","64", "128", "256", "512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000"];
			
			var selehtml = '<select>'+
								(function(){
									var options = '';
									selectarr.forEach(function(selobj,ins){
										options += '<option data-local="'+selobj+'" value="'+sevalue[ins]+'">'+selobj+'</option>';
									});
									return options;
								}())+
							'</select>';
							
			var $sxselect = $(selehtml).change(function(){
				var $s = $(this);
				if($s.val().toString() !== 'auto'){
					$input.find('[name="txBand"]').val($s.val());
				}
			});
			$input.find('[name="txBand"]').parent().append($sxselect,tl('speedTip'));
			$input.find('[name="txBand"]').keyup(function(){
				$sxselect.val('auto');
			})
			
			var $xxselect = $(selehtml).change(function(){
				var $s = $(this);
				if($s.val().toString() !== 'auto'){
					$input.find('[name="rxBand"]').val($s.val());
				}
			});
			$input.find('[name="rxBand"]').parent().append($xxselect,tl('speedTip'));
			$input.find('[name="rxBand"]').keyup(function(){
				$xxselect.val('auto');
			})
			$tabcon.empty().append($input);
			var tranDomArr = [$input];
			var dicArr     = ['common', 'doNetName'];
			require('Translate').translate(tranDomArr, dicArr);		
		}
		
		/* 新增/编辑弹框保存方法 */
		function editModalSave(type,checkSave){
			var Tips = require('Tips');
			
			/*
			if(require('InputGroup').checkErr(DATA.tabModalObj.getDom(),true)>0){
				// Tips.showWarning('{NoSave}');
				return false;
			}
			
			*/
			
			if(checkSave){
    			saveE();
    			return false;
    		}
			
			/* 阶梯 输入检测  */
			var IG = require('InputGroup');
			var $mamodal = DATA.tabModalObj.getDom();
			/*
			$mamodal.find('[href="#e1"]').trigger('click');
			setTimeout(function(){
    			if(IG.checkErr($mamodal.find('#e1'))==0){
        			$mamodal.find('[href="#e3"]').trigger('click');
        			setTimeout(function(){
        				if(IG.checkErr($mamodal.find('#e3'))==0){
            				$mamodal.find('[href="#e4"]').trigger('click');
            				setTimeout(function(){
            					if(IG.checkErr($mamodal.find('#e4'))==0){
		                			saveE();
		                		}
            				},1);
                		}
        			},1);
        		}
    		},1);
    		
    		*/
    		/* 阶梯检测保存方法 */
    		var earr = ['#e1','#e3','#e4'];
    		if(IG.checkErr($mamodal,true)>0){
    			for(var i = 0;i<earr.length;i++){
    				if(IG.checkErr($mamodal.find(earr[i]),true)>0){
    					$mamodal.find('[href="'+earr[i]+'"]').trigger('click');
    					return false;
    				}
    			}
    		}
    		saveE();
    		
			function saveE(){
				var SRLZ = require('Serialize');
				var strs = SRLZ.getQueryStrs(DATA.tabModalObj.getDom());
				var jsons = SRLZ.queryStrsToJson(strs);
				jsons.fre2 = DATA.tabModalObj.getDom().find('[name="spjk"][value="fre2"]').is(':checked')?'1':'0';
				jsons.fre5 = DATA.tabModalObj.getDom().find('[name="spjk"][value="fre5"]').is(':checked')?'1':'0';
				jsons.Action = type;
				
				/*根据加密方式 修改传往后台的变量*/
				if(jsons.encryType == '3'){
					jsons.pskVersion = jsons.wpaVersion;
					jsons.pskEncry = jsons.wpaEncrp;
				}
				
				console.log(jsons);
				var newstrs = SRLZ.queryJsonToStr(jsons);
				newstrs = newstrs+'&ipAddr='+DATA.ipAddr;
				if(jsons.Action=='edit'){
					newstrs = newstrs+'&oldName='+jsons.zoneName;
				}
				$.ajax({
					url:'goform/formServiceZoneConfig',
					type:'post',
					data:newstrs,
					success:function(result){
							var doEval = require('Eval');
							var codeStr = result,
								variableArr = ['status', 'errorstr'],
								result = doEval.doEval(codeStr, variableArr),
								isSuccess = result["isSuccessful"];
							// 判断代码字符串执行是否成功
							if (isSuccess) {
								var data = result["data"],
									status = data['status'];
									errorstr = data['errorstr'];
								if (status) {
									// 显示成功信息
									Tips.showSuccess('{saveSuccess}');
									DATA.tabModalObj.hide();
									displayTable($('#1'));
								} else {
									if(errorstr!=""){
										Tips.showWarning(errorstr);
									}else{
										Tips.showError('{saveFail}');
									}
								}
							} else {
								Tips.showWarning('{parseStrErr}');
							}					
					}
				});	
			}
		}
		
		
		/* VLAN ID 新增弹框 */
		function addVLANTab($VLANIDselect){
			var modallist = {
				id:'addVLAN_modal',
				title:tl("add")+'VLAN',
				size:'normal',
				"btns" : [
		            {
		                "type"      : 'save',
		                "clickFunc" : function($this){
		                	if(require('InputGroup').checkErr(DATA.tabVLANModalObj.getDom())<=0){
		                		var Serialize = require('Serialize');
		                		var quryarrs = Serialize.getQueryArrs(DATA.tabVLANModalObj.getDom());
	                			var tdata = Serialize.queryArrsToJson(quryarrs);
		                		// 查询字符串的替换数组
								var keyArr = [
									//['lanIpName', 'poolName'],
									['lanIpName', 'org_name'],
									['lanIp', 'dhcpStart'],
									['lanNetmask', 'dhcpMask'],
									['lanVid', 'dhcpVid']
								];
		                		// 替换从页面获取的查询数组的键
								Serialize.changeKeyInQueryArrs(quryarrs, keyArr);
		                		// 将查询字符串数组转化为字符串
								var queryStr = Serialize.queryArrsToStr(quryarrs);
								var queryJson = Serialize.queryArrsToJson(quryarrs);
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
												Tips.showSuccess('{saveSuccess}');
												// 保存成功
												$VLANIDselect.append('<option value="'+tdata.lanVid+'" selected="selected" data-local="'+tdata.lanIpName+'">'+tdata.lanIpName+'</option>');
												DATA.tabVLANModalObj.hide();
											} else {
												var errMsg = data["errorstr"];
												Tips.showWarning(errMsg);
											}
										} else {
											Tips.showError('{parseStrErr}');
										}
									}
								});
		                	}
		                }
		            },
		            {
		                "type"      : 'reset',
		            },
		            {
		                "type"      : 'close'
		            }
		        ]
			};
			var Modal = require('Modal');
			var modalObj = Modal.getModalObj(modallist);
			DATA.tabVLANModalObj = modalObj;
			
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
				"prevWord": 'VLAN ID',
				"necessary": true,
				"inputData": {
					"type": 'text',
					"name": 'lanVid',
					// "checkDemoFunc" : ['checkNum','2','4094']
					"checkDemoFunc" : ['checkNum',(DATA.min_vlanRange !==undefined?DATA.min_vlanRange:'1'),(DATA.max_vlanRange !==undefined?DATA.max_vlanRange:'4094'),'dhcp']
				},
				"afterWord": ''
			}];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputList);

			// 添加跳转到dhcp页面链接
			var $div = $('<div style="font-weight: bold;margin-top:5px; word-break: normal; white-space: normal; padding: 10px; background-color: rgb(238, 238, 238);width:100%"></div>')
			
			var $span1 = $("<span data-local='{newVLANIDWithoutDHCP1}'>{newVLANIDWithoutDHCP1}</span>");
			var $linkToOrg = $('<a data-local="{linkToDHCP}" class="u-inputLink">{linkToDHCP}</a>');
			var $span2 = $("<span data-local='{newVLANIDWithoutDHCP2}'>{newVLANIDWithoutDHCP2}</span>");
			$div.append($span1,$linkToOrg,$span2);
//			$linkToOrg.hover(function(){
//				$(this).css('opacity','1');
//			},function(){
//				$(this).css('opacity','0.5');
//			})
			$linkToOrg.click(function(){
				Tips.showConfirm(
					tl('noSaveAndGoRightnow')
					,function(){
						modalObj.hide();
						DATA.tabModalObj.hide();
						$('#sidebar').find('a[href="#/network_config/DHCP_server"]').parent().trigger('click');
						$('#sidebar').find('a[href="#/network_config/DHCP_server"]').parent().parent().prev().trigger('click');
					},function(){
						
					})
				
			}).css({
				'margin-right':'0px'
			});
			
			
			modalObj.insert($input);
			modalObj.insert($div);
			var $tabmod = modalObj.getDom();
			var tranDomArr = [$input,$tabmod];
			var dicArr     = ['common' ,'lanConfig','doRouterConfig','doNetName'];
			require('Translate').translate(tranDomArr, dicArr);
			modalObj.show();
		}
		
		/* 地址池 新增弹框 */
		function addDZCTab($DZCselect,$VLANselect){
			var modallist = {
				id:'addDZC_modal',
				title:'{addPoolAddr}',
				size:'normal',
				"btns" : [
		            {
		                "type"      : 'save',
		                "clickFunc" : function($this){
		                	if(require('InputGroup').checkErr(DATA.tabDZCModalObj.getDom())<=0){
		                		var srlz = require('Serialize');
		                		var quryarrs = srlz.getQueryArrs(DATA.tabDZCModalObj.getDom());
	                			var data = srlz.queryArrsToJson(quryarrs);
		                		
		                		$DZCselect.append('<option value="'+data.name+'" selected="selected">'+data.name+'</option>');
		                		DATA.tabDZCModalObj.hide();
		                	}
		                }
		            },
		            {
		                "type"      : 'reset',
		            },
		            {
		                "type"      : 'close'
		            }
		        ]
			};
			var Modal = require('Modal');
			var modalObj = Modal.getModalObj(modallist);
			DATA.tabDZCModalObj = modalObj;
			
			var valnIDItems = [];
			var vlanDefaultValue = '';
			$VLANselect.children().each(function(){
				var $cd = $(this);
				valnIDItems.push({name:$cd.text(),value:$cd.attr('value')});
				if($cd.is(':selected')){
					vlanDefaultValue = $cd.attr('value');
				}
			});
			
			
			var inputlist = [
				{
					necessary   : true,
			    	"prevWord"	:'{poolName}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'name',
				        "value" : ''
				    },
				    "afterWord": ''
				},
				{
			    	"prevWord"	:'{poolStatus}',
				    "inputData" : {
				        "type"       : 'radio',
				        "name"       : 'state',
				        "defaultValue" : 'on',
				        items:[
				        	{name:'{open}' ,value:'on'},
				        	{name:'{close}' ,value:'off'}
				        ]
				    },
				    "afterWord": ''
				},
				{
			    	"prevWord"	:'VLAN ID',
			    	disabled    : true,
				    "inputData" : {
				        "type"       : 'select',
				        "name"       : 'VALNID',
				        "defaultValue" :vlanDefaultValue,
				         items: valnIDItems
				    },
				    "afterWord": ''
				},
				
				{
					necessary   : true,
			    	"prevWord"	:'{beginIp}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'startIP',
				        "value" : ''
				    },
				    "afterWord": ''
				},
				{
					necessary   : true,
			    	"prevWord"	:'{endIp}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'endIP',
				        "value" : ''
				    },
				    "afterWord": ''
				},
				{
					necessary   : true,
			    	"prevWord"	:'{netmask}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'mask',
				        "value" : ''
				    },
				    "afterWord": ''
				},
				{
					necessary   : true,
			    	"prevWord"	:'{GwAddr}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'gatewayAddress',
				        "value" : ''
				    },
				    "afterWord": ''
				},
				{
					necessary   : true,
			    	"prevWord"	:'{leaseTime}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'rentTime',
				        "value" : ''
				    },
				    "afterWord": '{seconds}'
				},
				{
					necessary   : true,
			    	"prevWord"	:'{firstDNS}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'mainDNS',
				        "value" : ''
				    },
				    "afterWord": ''
				},
				{
					necessary   : true,
			    	"prevWord"	:'{secDns}',
				    "inputData" : {
				        "type"       : 'text',
				        "name"       : 'spareDNS',
				        "value" : ''
				    },
				    "afterWord": ''
				}
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			modalObj.insert($input);
			var $tabmod = modalObj.getDom();
			var tranDomArr = [$input,$tabmod];
			var dicArr     = ['common', 'doNetName'];
			require('Translate').translate(tranDomArr, dicArr);
			modalObj.show();
		}
		
	}
	
	
	
	module.exports = {
		display: display
	};
});
