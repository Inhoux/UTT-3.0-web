define(function(require, exports, module) {
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
	
			
	var dicArr     = ['common','doWANConfig','tips'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	var config = require('P_config/config');
	function getRateKbps(value) {
		var rate = parseInt(value);
		var bit = rate / 8;
		var Func = require('P_core/Functions');
		var result = Func.computeByte(bit) + '/s';
		return result;
	}
	function processData(jsStr) {
		
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
		variableArr = [
						"mac",
						"GateWayMac",
						"BindWanEn",
						"sta_Masks",
						"sta_IPs",
						"sta_GateWays",
						"sta_MainDnss",
						"sta_SecDnss",
						"dhcp_pd",
						"dhcp_sd",
						"pppoe_pd",
						"pppoe_sd",
						"ppp_UserNames",
						"ppp_Passwds",
						"ppp_AuthTypess",
						"ppp_pppoeOPModes",
						"ppp_pppoeDailModes",
						"ppp_pppoeIdleTimes",
						"ppp_MTUs",
						"ISPTypes",
						"ISPTypes1",
						"ISPTypes2",
						"i_flag",
						"GateWayMac_scan",
						"PortNames",
						"ConnTypes",
						"lively",
						"ac_ip_flag",
						"wanMode",
						"maxSpeed",
						/*运行信息*/
						"GateWays",
						"IPs",
						"Masks",
						"ConnStatuss",
						"SpeedDowns",
						"SpeedUps",
						"ConnTimes",
						/*主线路备用线路负载均衡*/
						"DualTypes",/*线路类型*/
						"MAX_LEN",/*WAN口数量*/
						"lineType",
						"backupRoadArr",
						/*smart_qos*/
						"txBands",
						"rxBands",
						/*用户电脑mac*/
						"usermac",
						"MainDns",
						"SecDns"
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
						"WANName",
						"ConnStatuss",
						"IPs",
						"ConnTypes",
						"lineType",
						"Masks",
						"GateWays",
						"mac",
						"sta_MainDnss",
						"sta_SecDnss",
						"dhcp_pd",
						"dhcp_sd",
						"pppoe_pd",
						"pppoe_sd",
						"SpeedUps",
						"SpeedDowns",
						"ConnTimes",
						"GateWayMac",
						"BindWanEn",
						"sta_Masks",
						"sta_IPs",
						"sta_GateWays",
						"ppp_UserNames",
						"ppp_Passwds",
						"ppp_AuthTypess",
						"ppp_pppoeOPModes",
						"ppp_pppoeDailModes",
						"ppp_pppoeIdleTimes",
						"ppp_MTUs",
						"ISPTypes",
						"ISPTypes1",
						"ISPTypes2",
						"i_flag",
						"GateWayMac_scan",
						"PortNames",
						"lively",
						"ac_ip_flag",
						"wanMode",
						"maxSpeed",
						"DualTypes",
						"MAX_LEN",
						"backupRoadArr",
						"ConnStatusDisplay",
						"txBands",
						"rxBands",
						"MainDns",
						"SecDns"
					], 
				WANNameArr            =['WAN1','WAN2','WAN3','WAN4','WAN5','WAN6'];
				macArr                =data["mac"],
				GateWayMacArr         =data["GateWayMac"],
				BindWanEnArr          =data["BindWanEn"],
				sta_MasksArr          =data["sta_Masks"],
				sta_IPsArr            =data["sta_IPs"],
				sta_GateWaysArr       =data["sta_GateWays"],
				sta_MainDnssArr       =data["sta_MainDnss"],
				dhcp_pdArr			  =data["dhcp_pd"] || '0.0.0.0',
				dhcp_sdArr			  =data["dhcp_sd"] || '0.0.0.0',
				pppoe_pdArr			  =data["pppoe_pd"]|| '0.0.0.0',
				pppoe_sdArr			  =data["pppoe_sd"]|| '0.0.0.0',
				sta_SecDnssArr 		  =data["sta_SecDnss"],
				ppp_UserNamesArr      =data["ppp_UserNames"],
				ppp_PasswdsArr 		  =data["ppp_Passwds"],
				ppp_AuthTypessArr 	  =data["ppp_AuthTypess"],
				ppp_pppoeOPModesArr   =data["ppp_pppoeOPModes"],
				ppp_pppoeDailModesArr =data["ppp_pppoeDailModes"],
				ppp_pppoeIdleTimesArr =data["ppp_pppoeIdleTimes"],
				ppp_MTUsArr           =data["ppp_MTUs"],
				ISPTypesArr           =data["ISPTypes"],
				ISPTypes1Arr 		  =data["ISPTypes1"],
				ISPTypes2Arr 		  =data["ISPTypes2"],
				i_flagArr             =data["i_flag"],
				GateWayMac_scanArr    =data["GateWayMac_scan"],
				PortNamesArr          =data["PortNames"],
				ConnTypesArr          =data["ConnTypes"],
				livelyArr             =data["lively"],
				ac_ip_flagArr         =data["ac_ip_flag"],
				wanModeArr            =data["wanMode"],
				maxSpeedArr           =data["maxSpeed"],
				GateWaysArr 		  =data["GateWays"],
				IPsArr 				  =data["IPs"],
				MasksArr 			  =data["Masks"],
				ConnStatussArr 		  =data["ConnStatuss"],
				SpeedDownsArr		  =data["SpeedDowns"],
				SpeedUpsArr 		  =data["SpeedUps"],
				ConnTimesArr 		  =data["ConnTimes"],
				DualTypesArr 		  =data["DualTypes"],
				MAX_LENArr 			  =data["MAX_LEN"],
				lineTypeArr           =data["lineType"],
				backupRoadArr 		  =data["backupRoadArr"],
				txBandsArr 			  =data["txBands"],
				rxBandsArr 			  =data["rxBands"],
				MainDnsArr 			  =data["MainDns"],
				SecDnsArr 			  =data["SecDns"];
				DATA["usermac"]=data["usermac"];
				DATA['txBands']=data['txBands'];
				DATA['rxBands']=data['rxBands'];
				DATA['WANIP'] =data['IPs'];
				txBandsArr.shift();
				rxBandsArr.shift();
				DATA["staticIpArr"]=sta_IPsArr;
				DATA["ConnTypes"]=ConnTypesArr;
				DATA["PortNamesArr"] = PortNamesArr;
				
				
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
		    var ConnStatusDisplayArr=[];
			

			// 通过数组循环，转换vlan数据的结构
			macArr.forEach(function(item, index, arr) {
				var arr = [];
				if(ConnTypesArr[index]==''){
					ConnStatusDisplayArr[index]='';
				}else{
					ConnStatusDisplayArr[index]=ConnStatussArr[index];
				}
				arr.push(WANNameArr[index]);
				arr.push(ConnStatussArr[index]);
				arr.push(IPsArr[index]);
				arr.push(ConnTypesArr[index]);
				arr.push(lineTypeArr[index]);
				arr.push(MasksArr[index]);
				arr.push(GateWaysArr[index]);
				arr.push(macArr[index]);
				/*往表格里填充DNS*/

				// if(ConnTypesArr[index]=='STATIC'|| 1){
				// 	arr.push(sta_MainDnssArr[index]);
				// 	arr.push(sta_SecDnssArr[index]);
				// }else if(ConnTypesArr[index]=='DHCP'){
				// 	if(1){
				// 		arr.push(MainDnsArr[index]);
				// 		arr.push(SecDnsArr[index]);
				// 	}else{
				// 		arr.push(dhcp_pdArr[index]);
				// 		arr.push(dhcp_sdArr[index]);
				// 	}
				// }else if(ConnTypesArr[index]=='PPPOE'){
				// 	arr.push(pppoe_pdArr[index]);
				// 	arr.push(pppoe_sdArr[index]);
				// }else{/*未配置push空*/
				// 	arr.push("0.0.0.0");
				// 	arr.push("0.0.0.0");
				// }
				if(ConnTypesArr[index]=='STATIC'){
					arr.push(sta_MainDnssArr[index]);
					arr.push(sta_SecDnssArr[index]);
				}else{
					arr.push(MainDnsArr[index]);
					arr.push(SecDnsArr[index]);
				}
				
				arr.push(dhcp_pdArr[index]);
				arr.push(dhcp_sdArr[index]);
				arr.push(pppoe_pdArr[index]);
				arr.push(pppoe_sdArr[index]);
				arr.push(getRateKbps(SpeedUpsArr[index]));
				arr.push(getRateKbps(SpeedDownsArr[index]));
				arr.push(ConnTimesArr[index]);
				arr.push(GateWayMacArr[index]);
				arr.push(BindWanEnArr[index]);
				arr.push(sta_MasksArr[index]);
				arr.push(sta_IPsArr[index]);
				arr.push(sta_GateWaysArr[index]);
				arr.push(ppp_UserNamesArr[index]);
				arr.push(ppp_PasswdsArr[index]);
				arr.push(ppp_AuthTypessArr[index]);
				arr.push(ppp_pppoeOPModesArr[index]);
				arr.push(ppp_pppoeDailModesArr[index]);
				arr.push(ppp_pppoeIdleTimesArr[index]);
				arr.push(ppp_MTUsArr[index]);
				arr.push(ISPTypesArr[index]);
				arr.push(ISPTypes1Arr[index]);
				arr.push(ISPTypes2Arr[index]);
				arr.push(i_flagArr[index]);
				arr.push(GateWayMac_scanArr[index]);
				arr.push(PortNamesArr[index]);
				arr.push(livelyArr[index]);
				arr.push(ac_ip_flagArr[index]);
				arr.push(wanModeArr[index]);
				arr.push(maxSpeedArr[index]);
				arr.push(DualTypesArr[index]);
				arr.push(MAX_LENArr[index]);
				arr.push(backupRoadArr[index]);
				arr.push(ConnStatusDisplayArr[index]);
				arr.push(txBandsArr[index]);
				arr.push(rxBandsArr[index]);

				

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
		// 表格上方按钮配置数据
		var btnList = [
			];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		var tableList = {
			"database": database,
			"isSelectAll" : false,
			"dicArr"     :['common','doWANConfig'],
			"titles": {
				"{interface}"		 : {
					"type"  :"links",
					links:[
						{
							id:'',
							name:'WAN',
							clickFunc:function(){

							}
						}
					]
				},
				"{constatus}"       : {
								"key": "ConnStatusDisplay",
								"type": "text",
								"values": {
									"1": "{connected}",
									"0": "{nconnecte}",
									"": "{nconfigured}"/*空代表未配置*/
									}
				},
				"{ip}"       : {
								"key": "IPs",
								"type": "text"
								
				},
				
				"{connType}"     :{
								"display":true,
								"key" : "ConnTypes",
								"type": "text",
								"values":{
									"DHCP"  :"{domainAccess}",
									"STATIC":"{staticAccess}",
									"PPPOE" :"{PPPoEAccess}",
									""		:""
								}
				},
				"{lineType}"     :{
								"display":(DATA["wanCount"]==1)?false:true,
								"key" : "lineType",
								"type": "text",
								"values":{
									"1":"{mainRoad}",
									"0":"{backRoad}"
								}
				},
								
			
				"{netmask}"   :{
								"key": "Masks",
								"type": "text"
								},

				"{GwAddr}"   : {
					"key":"GateWays" ,
					"type":"text"
				},
				
				"{MACAddr}"	 : 	{
								"key": "mac",
								"type": "text"
							},
				"{mainDNSAddr}"	 : 	{
					"key": "sta_MainDnss",
					"type": "text",
					"values":{
						"0.0.0.0":" ",
						" ":" "
					}
				},
				"{secDNSAddr}"	 : 	{
					"key": "sta_SecDnss",
					"type": "text",
					"values":{
						"0.0.0.0":" ",
						" ":" "
					}
				},
				"{SpeedUpsRate}"	 : 	{
					"key": "SpeedUps",
					"type": "text",
					"values":{
						"0":" "
					}
				},
				"{SpeedDownsRate}"	 : 	{
					"key": "SpeedDowns",
					"type": "text",
					"values":{
						"0":" "
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
	                            
	                            DATA.staticIp=data[0].sta_IPs
								displayEditPage($this,$('#1'));
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								if(primaryKey==0){
									Tips.showWarning(T('wan1Cantberemove'));
									return;
								}
								// 删除这条数据
								remove(primaryKey);
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

			
		// 修改WAN名称并绑定点击事件
		$table.find('header').append('<ul class="pull-right" id="otherBtns"></ul>');

		$table.find('a[data-local="WAN"][data-primarykey]').each(function(){
			var $t = $(this);
			$t.blur();
			$t.attr('data-local',$t.attr('data-local')+(Number($t.attr('data-primarykey'))+1));
			$t.text($t.text()+(Number($t.attr('data-primarykey'))+1));
			$t.click(function(){
				$t.parent().parent().find('[data-event="edit"]').trigger('click');
				
			});
			

				
		});
					// 绑定方式链接
			$table.find('td[data-column-title="{constatus}"]>span').each(function(){
					var $newlink = $('<a class="u-inputLink" data-primarykey="'+$(this).parent().prev().children('a').attr('data-primarykey')+'" data-local="'+$(this).attr('data-local')+'">'+$(this).text()+'</a>');
					 $(this).after($newlink);
					 $(this).remove();
					 $newlink.click(function(){
					 	
					 	
						var $t = $(this);
						$table.find('td[data-column-title="{constatus}"]>a').css('font-weight','normal');
						$t.css('font-weight','bold');
						var data = database.getSelect({
							primaryKey: $t.attr('data-primarykey')
						})[0];
						var thisLinkType =data.ConnTypes;
						
					
						$table.find('#otherBtns').empty();
						var btnsarr = ['<span>'+$t.parent().prev().children('a').text()+': </span>'];
						switch(thisLinkType){
							case 'PPPOE':
								btnsarr.push('<button data-primarykey="'+$t.attr('data-primarykey')+'" class="func func-guaduan btn-primary btn-sm">'+T("hangup")+'</button>');
								btnsarr.push('<button data-primarykey="'+$t.attr('data-primarykey')+'" class="func func-bohao btn-primary btn-sm">'+T("dial")+'</button>');
								break;
							case 'STATIC':
								break;
							case 'DHCP':
								btnsarr.push('<button data-primarykey="'+$t.attr('data-primarykey')+'" class="func func-gengxin btn-primary btn-sm">'+T("updata")+'</button>');
								btnsarr.push('<button data-primarykey="'+$t.attr('data-primarykey')+'" class="func func-shifang btn-primary btn-sm">'+T("release")+'</button>');
								break;
							default:
								break;
						}
						btnsarr.push('<button data-primarykey="'+$t.attr('data-primarykey')+'" class="func func-shuaxin btn-primary btn-sm">'+T("refresh")+'</button>');
						
						
						$table.find('#otherBtns').append(btnsarr);
						$table.find('#otherBtns>button').css({'margin-left':'5px'});
						$table.find('.func').click(function(){
							var $this = $(this);
							var wanIndex = parseInt($this.attr('data-primarykey'))+1;
		
							var str='Isp_Name=' +wanIndex;
							if($this.hasClass('func-guaduan') || $this.hasClass('func-shifang')){
								if(data.ConnStatusDisplay != "1")
									Tips.showWarning(T("wanLineClosedPlsSelectOther"));
								else
									postF('/goform/formReleaseConnect',str);
							}else if($this.hasClass('func-bohao') || $this.hasClass('func-gengxin')){
								
								postF('/goform/formReConnect',str);
							}else{
								display($('#1'));
							}
						});
						function postF(purl,pstr){
							$.ajax({
								url: purl,
								type: 'POST',
								data: pstr,
								success: function(result) {
									display($('#1'));
								}
							});
						}
						
					
						
					
					})
			});

		// 默认点击WAN1
		$table.find('[data-local="WAN1"]').parent().next().children('a').trigger('click');
		return $table;
	}

function remove(primaryKey) {
		primaryKey=parseInt(primaryKey)+1;
		
		var queryStr = 'delstr=' + primaryKey;
		var Tips = require('Tips');
		Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
		function delete_no(){
				display($('#1'));
			}
		function delete_ok(){
			var waits = require('Tips').showWaiting(T('WANDeling'));
			$.ajax({
				url: '/goform/formRoadDel',
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
							waits.remove();
							Tips.showSuccess('{delSuccess}', 2);
							display($('#1'));
						} else {
							waits.remove();
							Tips.showError('{delFail}', 2);
						}

					} else {
						waits.remove();
						Tips.showError('{netErr}', 2);
					}
				}
			});
	    }
	}

	
function storeTableData(data) {
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
		// 声明字段列表
		var fieldArr =[
						"WANName",
						"ConnStatuss",
						"IPs",
						"ConnTypes",
						"lineType",
						"Masks",
						"GateWays",
						"mac",
						"sta_MainDnss",
						"sta_SecDnss",
						"dhcp_pd",
						"dhcp_sd",
						"pppoe_pd",
						"pppoe_sd",
						"SpeedUps",
						"SpeedDowns",
						"ConnTimes",
						"GateWayMac",
						"BindWanEn",
						"sta_Masks",
						"sta_IPs",
						"sta_GateWays",
						"ppp_UserNames",
						"ppp_Passwds",
						"ppp_AuthTypess",
						"ppp_pppoeOPModes",
						"ppp_pppoeDailModes",
						"ppp_pppoeIdleTimes",
						"ppp_MTUs",
						"ISPTypes",
						"ISPTypes1",
						"ISPTypes2",
						"i_flag",
						"GateWayMac_scan",
						"PortNames",
						"lively",
						"ac_ip_flag",
						"wanMode",
						"maxSpeed",
						"DualTypes",
						"MAX_LEN",
						"backupRoadArr",
						"ConnStatusDisplay",
						"txBands",
						"rxBands"
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
			url: 'common.asp?optType=WanConfig',
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

	//编辑页面
	function displayEditPage($this,$con,vals){
		// require('Path').changePath(T('edit'));


		var primaryKey = $this.attr('data-primaryKey') ;

		if(vals != undefined){
			var primaryKey = vals;
		}
		DATA['primaryKey']=primaryKey;
		var database = DATA.tableData;
								
		var data = database.getSelect({
			primaryKey: primaryKey
		})[0];
		
		var IG = require('InputGroup');
		var $dom = '';//顶部
		var $dom1 = '';//静态下面部分
		var $dom2 = '';//动态下面部分
		var $dom3 = '';//PPPOE下面部分
		
		
		var inputList = [
			{
				"prevWord": '{interface}',
				"inputData": {
					"count": DATA["wanCount"], 
					"defaultValue": data.WANName, 
					"type": 'select',
					"name": 'PortName',
					"items": [{
						"value": 'WAN1',
						"name": 'WAN1',
					},{
						"value": 'WAN2',
						"name": 'WAN2',
					},{
						"value": 'WAN3',
						"name": 'WAN3',
					},{
						"value": 'WAN4',
						"name": 'WAN4',
					} ,
					{
						"value": 'WAN5',
						"name": 'WAN5',
					},
					{
						"value": 'WAN6',
						"name": 'WAN6',
					}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{connType}',
				"inputData": {
					"defaultValue": data.ConnTypes, 
					"type": 'select',
					"name": 'connectionType',
					"items": [{
						"value": 'STATIC',
						"name": '{staticAccess}',
					},{
						"value": 'DHCP',
						"name": '{domainAccess}',
					},{
						"value": 'PPPOE',
						"name": '{PPPoEAccess}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{ISP}',
				"inputData": {
					"defaultValue" : [data.ISPTypes,data.ISPTypes1,data.ISPTypes2], //默认值对应的value值
					"type": 'checkbox',
					"name": 'ISPType',
					"items" : [
						{"value" : '10000', "name" : '{telecom}',"checkOn":'10000',"checkOff":"0"},
						{"value" : '10086', "name" : '{move}',"checkOn":'10086',"checkOff":"0"},
						{"value" : '10010', "name" : '{unicom}',"checkOn":'10010',"checkOff":"0"}
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{workModel}',
				"inputData": {
					"defaultValue": data.lively, 
					"type": 'select',
					"name": 'enabled',
					"items": [{
						"value": '0',
						"name": '{GWModel}',
					},{
						"value": '1',
						"name": '{NATModel}',
					}]
				},
				"afterWord": ''
			}
		];
		$dom = IG.getDom(inputList);
		$dom.find('[name="ISPType"]').each(function(){
			var $t = $(this);
			if($t.val() == '10086'){
				$t.attr('name','ISPType1');
			}else if($t.val() == '10010'){
				$t.attr('name','ISPType2');
			}
		});
		//添加wan口切换事件
		$dom.find('[name="PortName"]').change(function(){
			var vals = Number($(this).val().substr(3))-1;
			displayEditPage($this,$('#1'),vals);
		});
		
		var InputList1 =[
			{
				"prevWord": '{lineType}',
				"inputData": {
					"defaultValue": data.lineType, 
					"type": 'select',
					"name": 'MainRoad',
					"items": [{
						"value": '1',
						"name": '{mainRoad}',
					},{
						"value": '0',
						"name": '{backRoad}',
					}]
				},
				"afterWord": ''
			},
			{
				"necessary":true,
				"prevWord": '{ip}',
				"inputData": {
					"type": 'text',
					"name": 'staticIp',
					"value":data.IPs,
					"checkFuncs":['checkIP']
				},
				"afterWord": ''
			},
			{
				"necessary":true,
				"prevWord": '{netmask}',
				"inputData": {
					"type": 'text',
					"name": 'staticNetmask',
					"value":data.Masks,
					"checkFuncs":['re_checkMask']
				},
				"afterWord": ''
			},
			{
				"necessary":true,
				"prevWord": '{GwAddr}',
				"inputData": {
					"type": 'text',
					"name": 'staticGateway',
					"value":data.GateWays,
//					"checkFuncs":['checkIP']
					checkDemoFunc:['checkSameSegmentNet','staticIp','staticNetmask']
				},
				"afterWord": ''
			},
			{
				"prevWord": '{SpeedUps}',
				"inputData": {
					"type": 'text',
					"name": 'txBands1',
					"value":data.txBands,
					"checkDemoFunc":["checkNum",'0','1000000']
				},
				"afterWord": 'Kbit/s'
			},
			{
				"prevWord": '{SpeedDowns}',
				"inputData": {
					"type": 'text',
					"name": 'rxBands1',
					"value":data.rxBands,
					"checkDemoFunc":["checkNum",'0','1000000']
				},
				"afterWord": 'Kbit/s'
			},
		
			{
				"prevWord": '{portRate}',
				"inputData": {
					"defaultValue":data.wanMode, 
					"type": 'select',
					"name": 'WanMode',
					"items": [{
						"value": '3',
						"name": '{portAuto}',
					},
					{
						"value": '4',
						"name": '10M{halfDuplex}',
					},
                    {
						"value": '0',
						"name": '10M{fullDuplex}',
					},
					{
						"value": '5',
						"name": '100M{halfDuplex}',
					},					
					{
						"value": '1',
						"name": '100M{fullDuplex}',
					},
					{
						"value": '2',
						"name": '1000M{fullDuplex}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{MACAddr}',
				"inputData": {
					"type": 'text',
					"name": 'MacAddr',
					"value":data.mac,
					"checkFuncs":['checkMac']
				},
				"afterWord": ''
			},
			{
				"necessary":true,
				"prevWord": '{mainDNSAddr}',
				"inputData": {
					"type": 'text',
					"name": 'staticPriDns',
					"value":data.sta_MainDnss,
					"checkFuncs":['checkMainDns']
				},
				"afterWord": ''
			},
			{
				"prevWord": '{secDNSAddr}',
				"inputData": {
					"type": 'text',
					"name": 'staticSecDns',
					"value":data.sta_SecDnss,
					"checkFuncs":['checkNullIP']
				},
				"afterWord": ''
			},
			{
				"prevWord": '{GwBindModel}',
				"inputData": {
					"defaultValue": data.BindWanEn, 
					"type": 'select',
					"name": 'BindWanEn',
					"items": [{
						"value": 'NONE',
						"name": '{unBind}',
					},{
						"value": 'MANUAL',
						"name": '{manualBind}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{GwMacAddr}',
				"inputData": {
					"type": 'text',
					"name": 'GateWayMac',
					"value":data.GateWayMac_scan,
					"checkFuncs":['checkMac']
				},
				"afterWord": ''
			},
		];
		$dom1 = IG.getDom(InputList1);
		$dom1.attr('linkFrom','STATIC');
		var RateArr = new Array(T('unlimit'),"64K", "128K", "256K", "512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M", "1000M");
		var RateArrValue = new Array("0","64", "128", "256", "512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000", "1000000");
		//增加小控件
		$dom1.find('[name="txBands1"],[name="rxBands1"]').each(function(){
			var $t = $(this);
			var selectStr = '<== <select name="'+$t.attr('name')+'Select" >';
			selectStr +='<option value="" data-local="{custom}">自定义</option>';
			for(var i in RateArrValue){
				selectStr += "<option value="+RateArrValue[i]+">"+RateArr[i]+"</option>";
			}
			selectStr += '</select>';


			$t.parent().next().append(selectStr);
			$dom1.find('[name="'+$t.attr('name')+'Select"]').change(function(){
				var $tt = $(this);
				if($tt.val() != ''){
					$t.val($tt.val());
				}else{
					$t.val('');
				}
			});
			$t.focus(function(){
				$(this).attr('oldval',$(this).val());
			});
			$t.blur(function(){
				if($(this).val() != $(this).attr('oldval')){
					$(this).parent().next().find('select').val('');
				}
				$(this).removeAttr('oldval');
				
			});
		});


		$dom1.find('[name="BindWanEn"]').change(function(){
			makeTheGateWayMacChange();
		});
		makeTheGateWayMacChange();
		function makeTheGateWayMacChange(){
			var gatemac = $dom1.find('[name="GateWayMac"]').parent().parent();
			if($dom1.find('[name="BindWanEn"]').val() == 'NONE'){
				gatemac.addClass('u-hide');
			}else{
				gatemac.removeClass('u-hide');
			}
		}
		
		var linkdatas = [
			{
				id : 'copyUserMac',
				name : T('clone'),
				clickFunc :function($thisDom){
					$dom1.find('[name="MacAddr"]').val(DATA['usermac']);
					$thisDom.blur();
				}
			}
		];
		IG.insertBtn($dom1,'MacAddr',linkdatas);
		require('P_core/Functions').autoInputIPMaskGW("staticIp","staticNetmask","staticGateway",$dom1);
		var linkdatas2 = [
			{
				id : 'getGateWayMac',
				name : T('get'),
				clickFunc :function($thisDom){
				var dataget=[];
				var wanIndex=parseInt(primaryKey)+1;
				var staticGateway=$dom1.find('[name="staticGateway"]').val();
				var queryStr='staticGateway='+staticGateway+'&wanIndex='+wanIndex;
				
				var $thissg = $dom1.find('[name="staticGateway"]').parent();

				if(IG.checkErr($thissg) > 0){
					Tips.showWarning('{plsInputRightGwAddr}');
					return;
				}
				//var timer = Tips.showTimer("{gettinggwMac,plsWait}",10,function(){});
				$.ajax({
						url: '/goform/formWanGwConfig',
						type: 'POST',
						data: queryStr,
						success: function(result) {
							$.ajax({
							url: 'common.asp?optType=WanConfig',
							type: 'GET',
							success: function(result) {
								//timer.stop(false);
								dataget = processData(result);
								if(dataget.table.data[primaryKey][33].length<1){
									Tips.showError('{getGwFalseplsCheckBind}');
								}
								$dom1.find('[name="GateWayMac"]').val(dataget.table.data[primaryKey][33]);
							}
						});
					}
				});
					
					
					
					$thisDom.blur();
				}
			}
		];
		IG.insertBtn($dom1,'GateWayMac',linkdatas2);
		//调整部分布局
		$dom1.find('[name="operator1"]:first').parent().attr('colspan','2').next().remove();
		
		var InputList2 =[
			{
				"prevWord": '{lineType}',
				"inputData": {
					"defaultValue": data.lineType, 
					"type": 'select',
					"name": 'MainRoad',
					"items": [{
						"value": '1',
						"name": '{mainRoad}',
					},{
						"value": '0',
						"name": '{backRoad}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{SpeedUps}',
				"inputData": {
					"type": 'text',
					"name": 'txBands2',
					"value":data.txBands,
					"checkDemoFunc":["checkNum",'0','1000000']
				},
				"afterWord": 'Kbit/s'
			},
			{
				"prevWord": '{SpeedDowns}',
				"inputData": {
					"type": 'text',
					"name": 'rxBands2',
					"value":data.rxBands,
					"checkDemoFunc":["checkNum",'0','1000000']
				},
				"afterWord": 'Kbit/s'
			},
			{
				"prevWord": '{portRate}',
				"inputData": {
					"defaultValue": data.wanMode, 
					"type": 'select',
					"name": 'WanMode',
					"items": [{
						"value": '3',
						"name": '{portAuto}',
					},
                    {
						"value": '4',
						"name": '10M{halfDuplex}',
					},{
						"value": '0',
						"name": '10M{fullDuplex}',
					},{
						"value": '5',
						"name": '100M{halfDuplex}',
					},{
						"value": '1',
						"name": '100M{fullDuplex}',
					},{
						"value": '2',
						"name": '1000M{fullDuplex}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{MACAddr}',
				"inputData": {
					"type": 'text',
					"name": 'MacAddr',
					"value":data.mac,
					"checkFuncs":['checkMac']
				},
				"afterWord": ''
			},
			{
				"necessary":false,
				"prevWord": '{mainDNSAddr}',
				"inputData": {
					"type": 'text',
					"name": 'dhcp_pd',
					"value":data.dhcp_pd,
					"checkFuncs":['checkNullIP']
				},
				"afterWord": ''
			},
			{
				"prevWord": '{secDNSAddr}',
				"inputData": {
					"type": 'text',
					"name": 'dhcp_sd',
					"value":data.dhcp_sd,
					"checkFuncs":['checkNullIP']
				},
				"afterWord": ''
			}
		];
		$dom2 = IG.getDom(InputList2);
		$dom2.attr('linkFrom','DHCP');
				//增加小控件
			var RateArr = new Array(T('unlimit'),"64K", "128K", "256K", "512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M", "1000M");
		var RateArrValue = new Array("0","64", "128", "256", "512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000", "1000000");
		//增加小控件
		$dom2.find('[name="txBands2"],[name="rxBands2"]').each(function(){
			var $t = $(this);
			var selectStr = '<== <select name="'+$t.attr('name')+'Select" >';
			selectStr +='<option value="" data-local="{custom}">自定义</option>';
			for(var i in RateArrValue){
				selectStr += "<option value="+RateArrValue[i]+">"+RateArr[i]+"</option>";
			}
			selectStr += '</select>';


			$t.parent().next().append(selectStr);
			$dom2.find('[name="'+$t.attr('name')+'Select"]').change(function(){
				var $tt = $(this);
				if($tt.val() != ''){
					$t.val($tt.val());
				}else{
					$t.val('');
				}
			});
			$t.focus(function(){
				$(this).attr('oldval',$(this).val());
			});
			$t.blur(function(){
				if($(this).val() != $(this).attr('oldval')){
					$(this).parent().next().find('select').val('');
				}
				$(this).removeAttr('oldval');
				
			});
		});

		
			var linkdatas2 = [
			{
				id : 'copyUserMac',
				name : T('clone'),
				clickFunc :function($thisDom){
					$dom2.find('[name="MacAddr"]').val(DATA['usermac']);
					$thisDom.blur();
				}
			}
		];
		IG.insertBtn($dom2,'MacAddr',linkdatas2);
		//调整部分布局
		$dom2.find('[name="operator2"]:first').parent().attr('colspan','2').next().remove();
		
		
		var InputList3 =[/*PPOE输入框*/
			{
				"prevWord": '{lineType}',
				"inputData": {
					"defaultValue": data.lineType, 
					"type": 'select',
					"name": 'MainRoad',
					"items": [{
						"value": '1',
						"name": '{mainRoad}',
					},{
						"value": '0',
						"name": '{backRoad}',
					}]
				},
				"afterWord": ''
			},
			{
				"necessary":true,
				"prevWord": '{loginName}',
				"inputData": {
					"type": 'text',
					"name": 'pppoeUser',
					"value":data.ppp_UserNames,
					"checkDemoFunc":['checkInput', 'name', '1', '31', 'ali']
				}
			},
			{
				"necessary":true,
				"prevWord": '{loginPwd}',
				"inputData": {
					"type": 'password',
					"name": 'pppoePass',
					"value":data.ppp_Passwds,
					"checkDemoFunc":['checkInput', 'name', '1', '31', 'ali'],
					"eye" : true
				}
			},
			{
				"prevWord": '{chekType}',
				"inputData": {
					"defaultValue": data.ppp_AuthTypess, 
					"type": 'select',
					"name": 'pppoeAuthType',
					"items": [{
						"value": 'NONE',
						"name": 'NONE',
					},{
						"value": 'PAP',
						"name": 'PAP',
					},{
						"value": 'CHAP',
						"name": 'CHAP',
					},{
						"value": 'EITHER',
						"name": 'EITHER',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{dialType}',
				"inputData": {
					"defaultValue": data.ppp_pppoeOPModes, 
					"type": 'select',
					"name": 'pppoeOPMode',
					"items": [{
						"value": 'KEEPALIVE',
						"name": '{KEEPALIVE}',
					},{
						"value": 'DEMAND',
						"name": '{DEMAND}',
					},{
						"value": 'MANUAL',
						"name": '{MANUAL}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{dialModel}',
				"inputData": {
					"defaultValue": data.ppp_pppoeDailModes, 
					"type": 'select',
					"name": 'pppoeDailMode',
					"items": [{
						"value": 'NORMAL',
						"name": '{normalModel}',
					},{
						"value": 'SP1',
						"name": '{SPMode}1',
					},{
						"value": 'SP2',
						"name": '{SPMode}2',
					},{
						"value": 'SP3',
						"name": '{SPMode}3',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{SpeedUps}',
				"defaultValue":"",
				"inputData": {
					"type": 'text',
					"name": 'txBands3',
					"value":data.txBands,
					"checkDemoFunc":["checkNum",'0','1000000']
				},
				"afterWord": 'Kbit/s'
			},
			{
				"prevWord": '{SpeedDowns}',
				"inputData": {
					"type": 'text',
					"name": 'rxBands3',
					"value":data.rxBands,
					"checkDemoFunc":["checkNum",'0','1000000']
				},
				"afterWord": 'Kbit/s'
			},
			{
				"necessary":true,
				"prevWord": '{freeTime}',
				"inputData": {
					"type": 'text',
					"name": 'pppoeIdleTime',
					"value":data.ppp_pppoeIdleTimes,
					"checkDemoFunc":["checkNum",'0','9999','notnull']
				},
				"afterWord": '{second}'
			},
			{
				"necessary":true,
				"prevWord": '{MTUVar}',
				"inputData": {
					"type": 'text',
					"name": 'MTU',
					"value":(data.ppp_MTUs == 0)?1480:data.ppp_MTUs,
					"checkDemoFunc":["checkNum",'1','1492']
				},
				"afterWord": "{valueRange}:(1-1492)"
			},
			{
				"prevWord": '{portRate}',
				"inputData": {
					"defaultValue": data.wanMode, 
					"type": 'select',
					"name": 'WanMode',
					"items": [{
						"value": '3',
						"name": '{portAuto}',
					},{
						"value": '4',
						"name": '10M{halfDuplex}',
					},{
						"value": '0',
						"name": '10M{fullDuplex}',
					},{
						"value": '5',
						"name": '100M{halfDuplex}',
					},{
						"value": '1',
						"name": '100M{fullDuplex}',
					},{
						"value": '2',
						"name": '1000M{fullDuplex}',
					}]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{MACAddr}',
				"inputData": {
					"type": 'text',
					"name": 'MacAddr',
					"value":data.mac,
					"checkFuncs":['checkMac']
				},
				"afterWord": ''
			},
			{
				"necessary":false,
				"prevWord": '{mainDNSAddr}',
				"inputData": {
					"type": 'text',
					"name": 'pppoe_pd',
					"value":data.pppoe_pd,
					"checkFuncs":['checkNullIP']
				},
				"afterWord": ''
			},
			{
				"prevWord": '{secDNSAddr}',
				"inputData": {
					"type": 'text',
					"name": 'pppoe_sd',
					"value":data.pppoe_sd,
					"checkFuncs":['checkNullIP']
				},
				"afterWord": ''
			}
		];
		$dom3 = IG.getDom(InputList3);
		$dom3.attr('linkFrom','PPPOE');
		//增加小控件
		var RateArr = new Array(T('unlimit'),"64K", "128K", "256K", "512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M", "1000M");
		var RateArrValue = new Array("0","64", "128", "256", "512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000", "1000000");
		//增加小控件
		$dom3.find('[name="txBands3"],[name="rxBands3"]').each(function(){
			var $t = $(this);
			var selectStr = '<== <select name="'+$t.attr('name')+'Select" >';
			selectStr +='<option value="" data-local="{custom}">自定义</option>';
			for(var i in RateArrValue){
				selectStr += "<option value="+RateArrValue[i]+">"+RateArr[i]+"</option>";
			}
			selectStr += '</select>';
			

			$t.parent().next().append($(selectStr));

			$dom3.find('[name="'+$t.attr('name')+'Select"]').change(function(){
				var $tt = $(this);
				if($tt.val() != ''){
					$t.val($tt.val());
				}else{
					$t.val('');
				}
			});
			$t.focus(function(){
				$(this).attr('oldval',$(this).val());
			});
			$t.blur(function(){
				if($(this).val() != $(this).attr('oldval')){
					$(this).parent().next().find('select').val('');
				}
				$(this).removeAttr('oldval');
				
			});
		});

		
			var linkdatas3 = [
			{
				id : 'copyUserMac',
				name : T('clone'),
				clickFunc :function($thisDom){
					$dom3.find('[name="MacAddr"]').val(DATA['usermac']);
					$thisDom.blur();
				}
			}
		];
		IG.insertBtn($dom3,'MacAddr',linkdatas3);
		//调整部分布局
		$dom3.find('[name="ISPType3"]:first').parent().attr('colspan','2').next().remove();
		// 修改部分样式
		
		$dom.children('tbody').children('tr').children('td').eq(0).css('width','104px');
		$dom1.children('tbody').children('tr').children('td').eq(0).css('width','104px');
		$dom2.children('tbody').children('tr').children('td').eq(0).css('width','104px');
		$dom3.children('tbody').children('tr').children('td').eq(0).css('width','104px');
		
		//将输入框组加入页面
		$con.empty().append($dom,$dom1,$dom2,$dom3);
		
		
		//初始化方法
		makeTheDomChange();
		$con.find('[name="connectionType"]').change(function(){
			makeTheDomChange();
		});
		
		function makeTheDomChange(){
			var $tt = $con.find('[name="connectionType"]');
			$con.find('[linkFrom]').addClass('u-hide');
			$con.find('[linkFrom="'+$tt.val()+'"]').removeClass('u-hide');
		}
		
		//按钮组
		var btnGroupList = [
			{
				"id"        : 'save',
				"name"		:'{save}',
				"clickFunc" : function($btn){
					var primaryKey = $btn.attr('data-primarykey');
					
                	var data       = DATA["tableData"].getSelect({                                                                               
                        primaryKey : primaryKey
                	})[0];
                	
					editSubmitClick($('#1'), data);
				}
			},
			{
				"id"        : 'reset',
				"name" 		 : '{reset}',
				"clickFunc" : function($btn){
					
				}
			},
			{
				"id"        : 'back',
				"name"		:'{back}',
				"clickFunc" : function($btn){
					// $btn 是模块自动传入的，一般不会用到
					display($('#1'));
				}
			}
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		
		//将按钮加入页面
		$con.append($btnGroup);
		var Translate  = require('Translate');
		var tranDomArr = [$con];
		var dicArr     = ['common','doWANConfig'];
		Translate.translate(tranDomArr, dicArr);
		
	}
function editSubmitClick($container, lData) {
	var InputGroup=require('InputGroup');
	var Serialize = require('Serialize');
		if(require('InputGroup').checkErr($container)>0){
			
		}else{
	// 将模态框中的输入转化为url字符串
		var selcon = [];
		$container.find('.input-group').each(function(){
			var $t = $(this);
			if(!$t.hasClass('u-hide')){
				selcon.push($t);
			}
		});
		var alldatas = [];
		selcon.forEach(function($obj){
			alldatas = alldatas.concat(Serialize.getQueryArrs($obj));
		});
		
		var queryJson = Serialize.queryArrsToJson(alldatas);
		
		if(queryJson.staticSecDns != undefined && queryJson.staticSecDns.length == 0){
			queryJson.staticSecDns = '0.0.0.0';
		}
		queryJson.MacAddr=queryJson.MacAddr.replace(/-/g,"");
		var	queryStr = Serialize.queryJsonToStr(queryJson);
		var newqre = queryStr;
		var n = 0;
		var nrestr = queryStr.replace("ISPType3",'ISPType1');
			nrestr = nrestr.replace("ISPType3",'ISPType2');
		 	nrestr = nrestr.replace("ISPType3",'ISPType');
		
		// 合并url字符串
		queryStr = Serialize.mergeQueryStr([nrestr, '']);
		//获得提示框组件调用方法
		var wanIndex=parseInt(queryJson.PortName.substr(3,4));
		
		var saveFlag=1;
		DATA['WANIP'].forEach(function(item, index, arr) {
			if(wanIndex == (index+1)){
			}
			else if(queryJson.staticIp == DATA['WANIP'][index]){
				Tips.showError("WAN"+wanIndex+"{and}"+"WAN"+parseInt(index+1)+"{cannotbesame}");
				saveFlag=0;
			}
			
		});
            
            var tmpJson = Serialize.queryStrsToJson(queryStr);
            var ipRepeatFlag=false;
            for(var i=0;i<DATA["staticIpArr"].length;i++){
 				if(DATA["staticIpArr"][i]==tmpJson.staticIp && DATA["ConnTypes"][i] == "STATIC" && tmpJson.PortName != "WAN"+DATA["PortNamesArr"][i]){
 					ipRepeatFlag=true;
 				}
				if(DATA["WANIP"][i]==tmpJson.staticIp && DATA["ConnTypes"][i] != "STATIC" && tmpJson.PortName != "WAN"+DATA["PortNamesArr"][i]){
 					ipRepeatFlag=true;
 				}
			}
            
           	if(ipRepeatFlag==true){
           		require('Tips').showError("{WANAddrCanBeSame}");
           		return;
           	}
           	var waits = require('Tips').showWaiting(T('WANSaving'));
			$.ajax({
				url: '/goform/formOneMultiPathConfig',
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
							
							
						} else {
							Tips.showWarning('{saveFail}', 2);
						}
					} else {
						Tips.showWarning('{netErr}', 2);
					}
				}
			});
			queryStr=queryStr.replace("WAN","");
			queryStr=queryStr.replace("staticIp","staticIp");
			
			$.ajax({
				url: '/goform/formWanIfConfig',
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
							var errorstr=data['errorstr'];
						if (status) {
							waits.remove();
                            // 显示成功信息
							Tips.showSuccess('{saveSuccess}', 2);
							display($('#1'));
							
						} else {
							waits.remove();
							Tips.showWarning('{saveFail}'+errorstr, 2);
						}
					} else {
						waits.remove();
						Tips.showWarning('{netErr}', 2);
					}
				}
			});
			
			primaryKey=DATA['primaryKey'];
			
			var pStr;
			var tStr,rStr;
			DATA.txBands.forEach(function(item,index,arr){
				if(index==primaryKey){
					tStr=queryJson.txBands1||queryJson.txBands2||queryJson.txBands3;
					rStr=queryJson.rxBands1||queryJson.rxBands2||queryJson.rxBands3;
					pStr+="&txBand"+(index+1)+"="+tStr+"&rxBand"+(index+1)+"="+rStr;
				}else{
					pStr+="&txBand"+(index+1)+"="+DATA['txBands'][index]+"&rxBand"+(index+1)+"="+DATA['rxBands'][index];
				}
			});
			
			$.ajax({
				url: '/goform/formConfigSmartQos',
				type: 'POST',
				data: pStr,
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
							
							
						} else {
							Tips.showWarning('{saveFail}', 2);
						}
					} else {
						Tips.showWarning('{netErr}', 2);
					}
				}
			});
		}
}



	function display($container) {
		// 清空标签页容器
			$container.empty();
			displayTable($container);
			var Translate  = require('Translate');
			var tranDomArr = [$container];
			var dicArr     = ['common','doWANConfig'];
			Translate.translate(tranDomArr, dicArr);
		
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
