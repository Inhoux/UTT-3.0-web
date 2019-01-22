define(function(require, exports, module){
	require('jquery');
	var Tips=require('Tips');
	var DATA = {};
	var Translate  = require('Translate');
	var dicArr     = ['common','doVisitControl'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	exports.display = function(){
		var dics = ['doVisitControl','doTimePlan']; 
		Translate.preLoadDics(dics, function(){ 
			var Path = require('Path');
				// 加载路径导航
				var pathList = 
				{
		  		"prevTitle" : T('fireWall'),
		  		"links"     : [
		  			{"link" : '#/firewall/visit_control', "title" : T('visitControl')}
		  		],
		  		"currentTitle" : ''
				};
					Path.displayPath(pathList);
				// 加载标签页
				var Tabs = require('Tabs');
				var tabsList = [
					{"id" : "1", "title" : T('visitControl')}
				];
				// 生成标签页，并放入页面中
				Tabs.displayTabs(tabsList);
				$('a[href="#1"]').click(function(event) {
					displayTable($('#1'));
				});
			    $('a[href="#1"]').trigger('click');
		});
	}
	/**
	*  开启 表格内点击事件
	*/
	function tableOpenClick(pkey,checkval){
		var newname = DATA["tableData"].getSelect({primaryKey : pkey})[0].PolicyNames;

		$.ajax({
			url: '/goform/formFireWallAllow',
			type: 'POST',
			data: 'AllowID='+newname+"&Allow="+checkval,
			success: function(result) {

				displayTable($('#1'));
			}
		});
	}

	/**
	 *全局开关
	 */
	function GlobalEnable(flag){
		var str;
		str='GlobalEnable='+flag;
	$.ajax({
			url: '/goform/formFireWallGlobalConfig',
			type: 'POST',
			data: str,
			success: function(result) {
				eval(result);
				if(status){
					Tips.showSuccess(T('visitContorlis')+(flag == 'on'?T('open'):T('close')));
				}else{
					Tips.showError((flag == 'on'?'open':'close')+"fail");
				}
				
				$('[href="#1"]').trigger('click');
			}
		});
	}

	/**
	 *添加目的地址
	 * @param  {[type]} $thisInput [description]
	 * @param  {[type]} data       [description]
	 * @return {[type]}            [description]
	 */
	function makeDestinationAdressModal($thisInput,data){
			var data = data || {};
			var modallist = {
				id:'addDestinationAdress_modal',
				title:T('addDetAddr'),
				size:'normal',
				"btns" : [
		            {
		                "type"      : 'save',
		                "clickFunc" : function($this){
		                	var $modals = $this.parents('.modal');
		                    // $this 代表这个按钮的jQuery对象，一般不会用到
		                    var $thismodal = DATA['DestinationAdressModalObj'].getDom();
		                    if(require('InputGroup').checkErr($thismodal)>0){
								return;
							}
		                     if($modals.find('[name="dstIP"]:checked').val() == 'groupSel' && $modals.find('[name="dstGroupName"]>option').length<1){
		                    	Tips.showWarning(T('addrNotSet'));
		                    	return;
		                    }
		                    var dsAdressval = '';
		                    var $fmodal = $("#1");
		                    if($thismodal.find('[name="dstIP"]:checked').val() == 'ipRange'){
		                    	dsAdressval = $thismodal.find('[name="dstFromIP"]').val()+"-"+$thismodal.find('[name="dstEndIP"]').val();
		                    	$fmodal.find('[name="ip1"]').val($thismodal.find('[name="dstFromIP"]').val());
		                    	$fmodal.find('[name="ip2"]').val($thismodal.find('[name="dstEndIP"]').val());
		                    	$fmodal.find('[name="grp"]').val('');
		                    	$fmodal.find('[name="choose"]').val('ipRange');
		                    }else{
		                    	dsAdressval = $thismodal.find('[name="dstGroupName"]').val();
		                    	$fmodal.find('[name="ip1"]').val('0.0.0.0');
		                    	$fmodal.find('[name="ip2"]').val('0.0.0.0');
		                    	$fmodal.find('[name="grp"]').val($thismodal.find('[name="dstGroupName"]').val());
		                    	$fmodal.find('[name="choose"]').val('groupSel');
		                    }
		                     $thisInput.next().val($thismodal.find('[name="dstIP"]:checked').val());
		                  
		                    $thisInput.val(dsAdressval);
		                    DATA['DestinationAdressModalObj'].hide();
		                }
		            },
		            {
		                "type"      : 'reset'
		            },
		            {
		                "type"      : 'close'
		            }
		        ]
			};
			var Modal = require('Modal');
			var modalObj = Modal.getModalObj(modallist);
			DATA['DestinationAdressModalObj'] = modalObj;
			var dzzarr = [];
			var groupNames = DATA["groupNames"] || [];
			groupNames.forEach(function(obj){
				dzzarr.push({name:obj,value:obj});
			});
			
			var inputlist = [
			   {  
			        "inputData": {
			            "defaultValue" : data.choose,
			            "type": 'radio',
			            "name": 'dstIP',
			            "items" : [
			                {
			                    "value" : 'ipRange',
			                    "name"  : '{ip}',
			                    "control":'ip'
			                },
			                {
			                    "value" : 'groupSel',
			                    "name"  : '{addrGrp}',
			                     "control":'dzz'
			                },
			            ]
			        },
			        "afterWord": ''
			    },
			    {
			    	sign		:'ip',
			    	"prevWord"	:'{ip}',
				    "inputData": {
				        "type"       : 'text',
				        "name"       : 'dstFromIP',
				        "value"      : data.ip1,
				        "checkDemoFunc":["checkInput","ip","11"]
				    },
				    "afterWord": ''
				},
				 {
			    	sign		:'ip',
				    "inputData": {
				        "type"       : 'text',
				        "name"       : 'words',
				        "value"      : '',
				    },
				    "afterWord": ''
				},
				{
			    	sign		:'dzz',
			    	"prevWord"	:'{addrGrp}',
				    "inputData": {
				    	"defaultValue" : data.grp,
				        "type"       : 'select',
				        "name"       : 'dstGroupName',
				        items:dzzarr
				    },
				    "afterWord": ''
				}
				
			];
			var InputGroup = require('InputGroup');
			var $input = InputGroup.getDom(inputlist);
			gn('words').after('<span>'+T('word_1')+'</span>');
			gn('words').remove();
			gn('dstFromIP').after('<span style="margin-left:10px">~</span><input type="text" name="dstEndIP" value="'+data.ip2+'" style="margin-left:10px"/>')
			gn('dstIP').parent().attr({colspan:'2'}).prev().remove();
			// gn('dstEndIP').checkdemofunc("checkInput","ip","11","gt","dstFromIP");
			gn('dstEndIP').checkdemofunc("checkInput","ip","12","gt","dstFromIP");
			/** 获得name="……" 的jq对象 **/
			function gn(){
				var argarr = Array.prototype.slice.call(arguments);
				if(argarr.length > 0){
					var str = '';
					argarr.forEach(function(obj){
						str += '[name="'+obj+'"],';
					});
					str = str.substr(0,str.length-1);
					return $input.find(str);
				}else{
					return null;
				}
				
			}
			
			modalObj.insert($input);
			var tranDomArr = [$input,modalObj.getDom()];
			Translate.translate(tranDomArr, dicArr);
			modalObj.show();
	}
	/**
	 * 生成表格
	 */
	function displayTable($con){
		$con.empty();
		$.ajax({
			type:"GET",
			// url:"common.ha",
			url:"common.asp?optType=fireWallAccess|timePlan|addrGroup",
			success:function(result){
				
				var data = processData(result);
				var	tableData = data["table"];
				
				storeTableData(tableData);
				
				// 获得表格Dom
				var $table = getTableDom();
				$con.empty();
				$('[href="#1"]').text(T('visitControl'));
				var TableContainer = require('P_template/common/TableContainer');
				var conhtml = TableContainer.getHTML({}),
					$tableCon = $(conhtml);
				$con.append($tableCon);
				// 将表格放入页面
				$tableCon.append($table);
				
				/*添加移动到*/
				var MoveTo = require('P_plugin/MoveTo');
			    var $moveto = MoveTo.getDom({
			        select : DATA.PolicyNames,
			        url    : '/goform/Move_Config',
			        str1      : 'sID',  
			        str2      : 'tID', 
			        saveSuccess : function($btn){
			                        $('[href="#1"]').trigger('click');          
			                    }
			    });
			    MoveTo.joinContent($('#1'),$moveto);
				
			}
		});
	}
	function storeTableData(data) {
		
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["tableData"] = database;
	
		database.addTitle(data.title);
		database.addData(data.data);
	}

	/**
	 * 处理数据存入数据库
	 */
	function processData(jsStr){
		var doEval=require('Eval');
		var variableArr =[
			'PolicyNames',
			'PolicyEnables',
			'id',/*本机ID*/
			'applyuserType',/*组织架构类型*/
			'applyuserData',/*数据*/
			'orgData',
			'orgNames',
			'timeGrpName',
			'groupNames',
			'Statuss',
			'FilterTypes',
			'FilterKeys',
			'SouFromPorts',
			'SouEndPorts',
			'DesFromPorts',
			'DesEndPorts',
			'note',
			'FromIPs',
			'EndIPs',
			'destIpGrpNames',/*已选择地址组*/
			'destFromIPs',
			'destEndIPs',
			'destIPs',/*目的地址*/
			'timeRangeNames', /*时间组名称列表*/
			'Protocols',/*协议*/
			'GlobalEnable'
			];
			
		var result = doEval.doEval(jsStr, variableArr ),
			isSuccess = result["isSuccessful"];
			
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr =[
				'id',			
				'PolicyNames',	/*策略名*/
				'PolicyEnables',/*是否开启*/
				'index'	,		/*执行顺序*/
				'applyuser',	/*适用用户*/
				'orgType',
				'timeGrpName',	/*使用时间*/
				'Statuss',		/*动作*/
				'FilterTypes', /*过滤类型*/
				'FilterKeys',	/*过滤关键字*/
				'SouPorts',		/*源端口*/
				'DesPorts',		/*目的端口*/
				'note'	,		/*备注*/
				'destIPs', 		/*目的IP*/
				'applyuserData', /*组织架构数据*/
				'Protocols',		/*TCP/UDP/.....*/
				'destIpGrpNames'	/*已选择的地址组*/
			];
			console.log(data);
			DATA.PolicyNames = data.PolicyNames;
			
			var PolicyNamesArr = data['PolicyNames'] ||'',
				PolicyEnablesArr = data['PolicyEnables'],
				idArr = data['id'],
				applyuserTypeArr = data['applyuserType'],
				applyuserDataArr = data['orgData'],
				orgNamesArr = data['orgNames'],
				timeGrpNameArr = data['timeGrpName'],
				StatussArr = data['Statuss'],
				FilterTypesArr = data['FilterTypes'],
				FilterKeysArr = data['FilterKeys'],
				SouFromPortsArr = data['SouFromPorts'],
				SouEndPortsArr = data['SouEndPorts'],
				DesFromPortsArr = data['DesFromPorts'],
				DesEndPortsArr = data['DesEndPorts'],
				noteArr = data['note'],
				FromIPsArr = data['FromIPs'],
				EndIPsArr = data['EndIPs'],
				destFromIPsArr = data['destFromIPs'],
				destEndIPsArr = data['destEndIPs'],
				destIPsArr = data['destIPs'],
				destIpGrpNamesArr=data['destIpGrpNames'],
				applyuserData = data.orgData,
				Protocols = data.Protocols,
				destIpGrpNames = data.destIpGrpNames;
			var dataArr = []; 
		    DATA["groupNames"]=data["groupNames"];/*地址组*/
		    DATA['timeRangeNames'] = data['timeRangeNames'];
		   	DATA['GlobalEnable'] = data['GlobalEnable'];
		   	DATA["MaxIndex"] = PolicyNamesArr.length;
			if(PolicyNamesArr.length){
				PolicyNamesArr.forEach(function(item, index, arr) {
					var arr = [];
					arr.push(Number(index)+1);
					arr.push(PolicyNamesArr[index]);
					arr.push(PolicyEnablesArr[index]);
					arr.push(Number(index)+1);
					if(applyuserTypeArr[index] == 'ip'){
						arr.push(applyuserDataArr[index]);
					}else if (applyuserTypeArr[index] == 'org'){
						arr.push(orgNamesArr[index]);
					}else {
						arr.push("{allUser}");
					}
					arr.push(applyuserTypeArr[index]);
					arr.push(timeGrpNameArr[index]);
					arr.push(StatussArr[index]);
					arr.push(FilterTypesArr[index]);
					if(FilterTypesArr[index] == '1'){
						arr.push("");
						arr.push(SouFromPortsArr[index]+"-"+SouEndPortsArr[index]);
						arr.push(DesFromPortsArr[index]+"-"+DesEndPortsArr[index]);
					}else{
						arr.push(FilterKeysArr[index]);
						arr.push("");
						arr.push("");
					}
						
					arr.push(noteArr[index]);
					if(FilterTypesArr[index] == '1'){
						if(destIPsArr[index]=='0'){
							arr.push(destFromIPsArr[index]+"-"+destEndIPsArr[index]);
						}else{
							arr.push(destIpGrpNamesArr[index]);
						}
					}else{
						arr.push("");
					}

					arr.push(applyuserData[index]);
					arr.push((Protocols[index]===undefined?'':Protocols[index]));
					arr.push(destIpGrpNames[index]);

					dataArr.push(arr);
				});
			}
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
	
	/**
	 * 生成表格
	 */
	function getTableDom(){
		// 表格上方按钮配置数据

		var btnList = [
		/*
		{
			"id": "set",
			"name": DATA['GlobalEnable']=='on'?'{close}':'{open}',
			 "clickFunc" : function($btn){
			 		$btn.blur();
			 		var flag=DATA['GlobalEnable']=='on'?'off':'on';
					GlobalEnable(flag);
        		}
		},*/
		{
			"id": "add",
			"name": "{add}",
			 "clickFunc" : function($btn){
			 		$btn.blur();
					displayEditPage('add');
        		}
		},
		{
			"id": "delete",
			"name": "{delete}",
			 "clickFunc" : function($btn){
			 	$btn.blur();
             	var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey'); 
             	deleteBtnClick(primaryKeyArr);
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
			"dicArr"     : ['common', 'doVisitControl'],
			"titles": {
				"ID"	: {
					"key": "id",
					"type": "text",
				},
				"{PolicyName}"	: {
					"key": "PolicyNames",
					"type": "text",
				},
				"{open}" : {
                    "key"     : "PolicyEnables",
                    "type"    : "checkbox",
                    "values"  : {
                        "1"  : true,
                        "0" : false
                    },
                    "clickFunc" : function($this){
                    	var checkval = ($this.is(':checked')?'1':'0');
                        tableOpenClick($this.attr('data-primaryKey'),checkval);
                        Tips.showSuccess("{saveSuccess}");
                    }
                },
				"{excIndex}"		 : {
					"key": "index",
					"type": "text"
				},
				"{suitUser}"		 : {
					"key": "applyuser",
					"type": "text",
					"maxLength":31
				},			
				"{effecTime}"		 : {
					"key": "timeGrpName",
					"type": "text",
					"values":{
						"":"{allDay}"
					}
				},	
				"{action}"		 : {
					"key": "Statuss",
					"type": "text",
					"values": {
								"1": "{allow}",
								"0": "{forbid}",
							   }
				},	
				"{filterType}"		 : {
					"key": "FilterTypes",
					"type": "text",
					"filter":function(oldstr){
						var newstr = oldstr;
						switch(oldstr){
							case '1':
								newstr = 'IP'+T('filter');
								break;
							case '2':
								newstr = 'URL'+T('filter');
								break;
							case '3':
								newstr = T('keyword')+T('filter');
								break;
							case '4':
								newstr = 'DNS'+T('filter');
								break;
							default:
								break;
						}
					    return newstr;
					}
				},	
				"{filterWord}"		 : {
					"key": "FilterKeys",
					"type": "text"
				},
				"{Protocol}"		 : {
					"key": "Protocols",
					"type": "text",
					"values": {
								"1": "ICMP",
								"2": "TCP",
								"3": "UDP",
								"4": "AH",
								"5": "all",
							   }
				},
				"{sport}"		 : {
					"key": "SouPorts",
					"type": "text"
				},	
				"{eport}"		 : {
					"key": "DesPorts",
					"type": "text"
				},	
				"{destAddr}"		 : {
					"key": "destIPs",
					"type": "text"
				},	
				"{info}"		 : {
					"key": "note",
					"type": "text"
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
								var data = database.getSelect({primaryKey : primaryKey});
								DATA["editIndex"] = data[0]["index"];
								displayEditPage('edit',data[0]);
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								deleteBtnClick([primaryKey]);
							}
						}
					]
				}
			},
			//"hideColumns" : ['vlanID']
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


		
		var OnOff = require('OnOff');
    	var $onoff = OnOff.getDom({
        prevWord:T('visitControl')+' :',
        afterWord:'',
        id:'checkTraffic',
        defaultType:(DATA['GlobalEnable']=='on'?true:false),
        clickFunc:function($btn,typeAfterClick){
            var flag = DATA['GlobalEnable']=='on'?'off':'on';
				GlobalEnable(flag);
        }
    	});
    	$('#checkTraffic,.u-onoff-span1').remove();
    	OnOff.joinTab($onoff);
		return $table;
	}


	/**
	*   删除方法
	*/
	function deleteBtnClick(primaryKeyArr) {
		//获得提示框组件调用方法
		
		var Tips = require('Tips');
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		// 获得表格中所有被选中的选择框，并获取其数量
		
		var	length = primaryKeyArr.length;
			
		// 判断是否有被选中的选择框
		if (length > 0) {
			var str = '';
			primaryKeyArr.forEach(function(primaryKey) {
				var data = database.getSelect({
					primaryKey: primaryKey
				});
				var name = data[0]["PolicyNames"];
				str += name + ',';
			});
			str = str.substr(0, str.length - 1);
			str = 'delstr=' + str;
			Tips.showConfirm(T("delconfirm"),delete_ok,delete_no);
			function delete_no(){
				displayTable($('#1'));
			}
			function delete_ok(){
				$.ajax({
					url: '/goform/formFireWallDel',
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
								displayTable($('#1'));
							} else {
								var errorStr = data['errorstr'];
							Tips.showWarning('{delFail}' + errorStr, 3);
							displayTable($('#1'));
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
	/**
	 * 生成编辑部分
	 */
	function displayEditPage(type,datas){
		/***
		 * 进入编辑页面时隐藏开启关闭按钮
		***/
		$('#checkTraffic,.u-onoff-span1').hide();
		
		var data = datas || {};
		var tabname = (type == 'edit'?T('edit'):T('add'));
		$('[href="#1"]').text(tabname);
		

		var dstipFrom = '0.0.0.0',//目的地址——起始地址
			dstipEnd = '0.0.0.0',//		——结束地址
			dstipGrps = '',//地质组名
			sourceIP = T('allUser'),
			orgType = 'all',
			orgData = '',
			orgIp = '0.0.0.0-0.0.0.0',
			groupNames = DATA['groupNames'],
			destIpGrpNames = '',
			destFromIPs = '0.0.0.0',
			destEndIPs = '0.0.0.0',
			destIPs = '0', /*目的地址*/
			destShow = '0.0.0.0-0.0.0.0',
			// destShow = '0.0.0.0-0.0.0.0',
			// ip1 = '0.0.0.0-0.0.0.0',
			// ip2 = '0.0.0.0-0.0.0.0',
			// grp = '',
			// choose = 'ipRange',
			glnr_url = '',/*url过滤*/
			glnr_keyword = '',/*关键字过滤*/
			glnr_dns = '',/*dns过滤*/
			SouPortArr = [],
			DesFromPort = [];
			if(type == 'edit'){
				if(data.destIpGrpNames == '' || data.destIpGrpNames === undefined){
					destFromIPs = (data.destIPs.split('-')[0]?data.destIPs.split('-')[0]:'0.0.0.0');
					destEndIPs = (data.destIPs.split('-')[1]?data.destIPs.split('-')[1]:'0.0.0.0');
				}else{
					destIpGrpNames = data.destIPs;
				}
				destIPs =  (data.destIPs?data.destIPs:'0.0.0.0-0.0.0.0');
				destShow = destIPs;
			}
		

		orgType = data.orgType || 'all';
		if(orgType == 'ip'){
			sourceIP = data.applyuserData;
			orgData = '';
			orgIp = data.applyuserData;
		}else if(orgType == 'org'){
			sourceIP = data.applyuser;
			orgData = data.applyuserData;
			orgIp = '';
		}

		if(data.FilterTypes == 2){
			glnr_url = data.FilterKeys;
		}else if(data.FilterTypes == 3){
			glnr_keyword = data.FilterKeys;
		}else if(data.FilterTypes == 4){
			glnr_dns = data.FilterKeys;
		}else if(data.FilterTypes == 1){

		}


		

		var dstAddr = [];
		groupNames.forEach(function(obj,i){
			dstAddr.push({name:obj,value:obj});
		});
		


		
		var timeGrpNameItem = [{name:'{allDay}',value:''}];
		DATA['timeRangeNames'].forEach(function(obj){
			timeGrpNameItem.push({name:obj,value:obj});
		});

		var tcpBusiness=new Array(21,22,23,25,66,79,80,110,135,139,443,445,1433,1434,1720,1723,1863,3389);
		var tcpBusinessText=new Array("21(ftp)","22(ssh)","23(telnet)","25(smtp)","66(sql*net)","79(finger)","80(web)","110(pop3)","135(epmap)","139(netbios-ssn)","443(https)","445(ms-ds)","1433(ms-sql-s)","1434(ms-sql-m)","1720(h.323)","1723(pptp)","1863(msn login)","3389(ms-ts)");
		
		var udpBusiness=new Array(53,67,68,69,123,137,138,161,162,500,1701);
		var udpBusinessText=new Array("53(dns)","67(bootps)","68(bootpc)","69(tftp)","123(ntp)","137(netbios-ns)","138(netbios-dgm)","161(snmp)","162(snmptrap)","500(isakmp)","1701(l2tp)");



		var inputlist = [
			{
			 	"prevWord": '{status}',
				"inputData": {
					"type": 'radio',
					"name": 'PolicyEnables',
					defaultValue: data.PolicyEnables ||'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				}
			},
			{
				"necessary":true,
			 	"prevWord": '{ruleName}',
				"inputData": {
					"type": 'text',
					"name": 'PolicyNames',
					"value": data.PolicyNames || '',
					"checkDemoFunc":["checkInput","name","1","31","5"]
				}
			},
			{
			 	"prevWord": '{info}',
				"inputData": {
					"type": 'text',
					"name": 'note',
					"value": data.note || '',
					"checkDemoFunc":["checkInput","name","0","31","2"]
				},
			},
			{
				"necessary":true,
			 	"prevWord": '{excIndex}',
				"inputData": {
					"type": 'text',
					"name": 'index',
					"value": data.index || DATA["MaxIndex"]+1,
					"checkDemoFunc":["checkNum",'1','10000']
				},
				afterWord:'(1,2,3...)'
			},
			{
				"display":false,
			 	"prevWord": '原执行顺序',
				"inputData": {
					"type": 'text',
					"name": 'oldindex',
					"value": data.index || ""
				},
				afterWord:'(1,2,3...)'
			},
			{
				"necessary":true,
			 	"prevWord": '{suitUser}',
				"inputData": {
					"type": 'text',
					"name": 'sourceIP',
					"value": sourceIP 
				},
			},
			{
			 	"prevWord": '{effecTime}',
				"inputData": {
					"type": 'select',
					"name": 'timeGrpName',
					defaultValue: data.timeGrpName ||'',
					items:timeGrpNameItem,
				}
			},
			{
			 	"prevWord": '{action}',
				"inputData": {
					"type": 'radio',
					"name": 'Status',
					defaultValue: data.Statuss ||'0',
					items:[
						{name:'{allow}',value:'1'},
						{name:'{forbid}',value:'0'}
					]
				}
			},
			{
			 	"prevWord": '{filterType}',
				"inputData": {
					"type": 'select',
					"name": 'FilterTypes',
					defaultValue: data.FilterTypes ||'allow',
					items:[
						{name:'IP'+'{filter}',value:'1',control:'IP'},
						{name:'URL'+'{filter}',value:'2',control:'URL'},
						{name:'{keyword}'+'{filter}',value:'3',control:'keyword'},
						{name:'DNS'+'{filter}',value:'4',control:'DNS'}
					]
				}
			},
			
			{
				sign:'IP',
				"necessary":true,
			 	"prevWord": '{proto}',
				"inputData": {
					"type": 'select',
					"name": 'Protocol',
					defaultValue: data.Protocols || 'all',
					items:[
						{name:'TCP',value:'2',control:'TCP'},
						{name:'UDP',value:'3',control:'UDP'},
						{name:'ICMP',value:'1',control:'ICMP'},
						{name:'AH',value:'4',control:'AH'},
						{name:'all',value:'5',control:'all'}
					]
				},
			},
			{
				sign:'TCP,UDP',
				"necessary":true,
			 	"prevWord": '{normaPorto}',
				"inputData": {
					"type": 'select',
					"name": 'cyfw',
					items:[
						{name:'{custom}',value:'-'}
					]
				},
			},
			{
				sign:'TCP,UDP',
				"necessary":true,
			 	"prevWord": '{sport}',
				"inputData": {
					"type": 'text',
					"name": 'SouFromPort',
					"value": '',
					"checkDemoFunc":["checkNum",'1','65535']
				},
			},
			{
				sign:'TCP,UDP',
				"necessary":true,
			 	"prevWord": '{eport}',
				"inputData": {
					"type": 'text',
					"name": 'DesFromPort',
					"value": '',
					"checkDemoFunc":["checkNum",'1','65535']
				},
			},
			{
				sign:'IP',
				necessary:true,
			 	"prevWord": '{destAddr}',
				"inputData": {
					"type": 'text',
					"name": 'dstAddr',
					"value": destShow
				},
			},




			{
				sign:'URL',
				"necessary":true,
			 	"prevWord": '{filterWord}',
				"inputData": {
					"type": 'text',
					"name": 'glnr_url',
					"value": glnr_url,
					"checkDemoFunc":["checkInput","name","1","31","4"]
				},
                                afterWord:'{filterUrlTips}',
			},
			{
				sign:'keyword',
				"necessary":true,
			 	"prevWord": '{filterWord}',
				"inputData": {
					"type": 'text',
					"name": 'glnr_keyword',
					"value": glnr_keyword,
					"checkDemoFunc":["checkInput","name","1","31","4"]
				},
			},
			{
				sign:'DNS',
				"necessary":true,
			 	"prevWord": '{filterWord}',
				"inputData": {
					"type": 'text',
					"name": 'glnr_dns',
					"value": glnr_dns,
					"checkDemoFunc":["checkInput","ip","1","2"]
				},
			},
		];
		
		var IG = require('InputGroup');
		var $input = IG.getDom(inputlist);


		
	
		/** 获得name="……" 的jq对象 **/
		function gn(){
			var argarr = Array.prototype.slice.call(arguments);
			if(argarr.length > 0){
				var str = '';
				argarr.forEach(function(obj){
					str += '[name="'+obj+'"],';
				});
				str = str.substr(0,str.length-1);
				return $input.find(str);
			}else{
				return null;
			}
			
		}
		$input.find('[name="sourceIP"]').after('<input type="text" class="u-hide"  value="'+orgType+'" name="orgType" />');
		$input.find('[name="sourceIP"]').after('<input type="text"  class="u-hide" value="'+orgData+'" name="orgData" />');
		$input.find('[name="sourceIP"]').after('<input type="text"  class="u-hide" value="'+orgIp+'" name="orgIp" />');
		//适用用户
		$input.find('[name="sourceIP"]').click(function(){
			var orgdatas = {
				saveClick:function(saveData){
					gn('orgType').val(saveData.applyTypeStr);
					if (saveData.applyTypeStr == "ip"){
						gn('sourceIP').val(saveData.ipStr);
						gn('orgIp').val(saveData.ipStr);
					}
					else if (saveData.applyTypeStr == "org"){
						gn('sourceIP').val(saveData.showName);
						gn('orgData').val(saveData.checkIdStr);
					}
					else{
						gn('sourceIP').val(T('allUser'));
					}	
					saveData.close();
				}, 
				checkableStr:gn('orgData').val(),//被勾选的id字符串
				ipStr:gn('orgIp').val(),//开始结束的ip
				applyTypeStr:gn('orgType').val()//单选默认值
			};
			require('P_plugin/Organization').display(orgdatas);
		});
		
		//生效时间
		var btnlist1 = [
			{
				id:'add_time',
				name:'{add}',
				clickFunc:function($btn){
					//给小链接绑定时间计划的新增功能
           			require('P_plugin/TimePlan').addModal($input.find('[name="timeGrpName"]'));
				}
			},
			{
				id:'modify_time',
				name:'{edit}',
				clickFunc:function($btn){
					//给小链接绑定时间计划的新增功能
           			require('P_plugin/TimePlan').editModal($input.find('[name="timeGrpName"]'));
				}
			},
		];
		IG.insertLink($input,'timeGrpName',btnlist1);
		

		
		//修改布局 新增元素
		$input.find('[name="SouFromPort"],[name="DesFromPort"]').each(function(){
			var $t = $(this);
			$t.parent().next().append('<span>~</span><input type="text" value="" style="margin-left:10px;" name="'+($t.attr('name').substr(0,3)+'EndPort')+'"/>');
		});
		$input.find('[name="dstAddr"]').attr('readonly','true');
		//获得该输入框对象
		var $SouEndPort = $input.find('[name="SouEndPort"]');
		var $DesEndPort = $input.find('[name="DesEndPort"]');
		
		$SouEndPort.checkdemofunc('checkSourceToEndNum','1','65535',"SouFromPort");
		$DesEndPort.checkdemofunc('checkSourceToEndNum','1','65535',"DesFromPort");	

		//绑定交互
		gn('cyfw').change(function(){
			var cyfwval = $(this).val().split('-');
			gn('DesFromPort').val(cyfwval[0]);
			gn('DesEndPort').val((cyfwval[1] == undefined?cyfwval[0]:cyfwval[1]));
		});



		//目的地址
		$input.find('[name="dstAddr"]').after(
			'<input type="text" style="display:none" name="dstIP" value="'+(destIpGrpNames == ''?'ipRange':'groupSel')+'"/>'+
			'<input type="hidden" name="ip1" value="'+destFromIPs+'"/>'+
			'<input type="hidden" name="ip2" value="'+destEndIPs+'"/>'+
			'<input type="hidden" name="grp" value="'+destIpGrpNames+'"/>'+
			'<input type="hidden" name="choose" value="'+(destIpGrpNames == ''?'ipRange':'groupSel')+'"/>');
		$input.find('[name="dstAddr"]').click(function(){
			var $t = $(this);
			$t.blur();
			var datas ={
				ip1:$input.find('[name="ip1"]').val(),
				ip2:$input.find('[name="ip2"]').val(),
				grp:$input.find('[name="grp"]').val(),
				choose:$input.find('[name="choose"]').val()
			};
			
			makeDestinationAdressModal($t,datas);
			
		});

		//TCP~all的不同选择
		gn('Protocol').change(function(){
			makeTheAgTypeChange();
		});
		makeTheAgTypeChange();
		function makeTheAgTypeChange(){
			var thisval = gn('Protocol').val();
			gn('cyfw').children().remove();
			gn('cyfw').append('<option value="-" selected="selected">'+T('custom')+'</option>');
			gn('DesFromPort','DesEndPort').each(function(){
				
				$(this).val($(this)[0].defaultValue);
			})
			gn('SouFromPort').val('1');
			gn('SouEndPort').val('65535');
			gn('cyfw','DesFromPort','DesEndPort','SouFromPort','SouEndPort').removeAttr('disabled');
			
			switch(thisval){
				case "2":
					tcpBusiness.forEach(function(obj,i){
						gn('cyfw').append('<option value="'+obj+'">'+tcpBusinessText[i]+'</option>')
					});
					gn('cyfw').append('<option value="1-65535">'+T('all')+'</option>');
					break;
				case '3':
					udpBusiness.forEach(function(obj,i){
						gn('cyfw').append('<option value="'+obj+'">'+udpBusinessText[i]+'</option>')
					});
					gn('cyfw').append('<option value="1-65535">'+T('all')+'</option>');
					break;
				default:
					gn('cyfw','DesFromPort','DesEndPort','SouFromPort','SouEndPort').attr('disabled','disabled');
					gn('DesFromPort','DesEndPort','SouFromPort','SouEndPort').val(0);
					break;
			}
			
			/*清除报错小标签*/
			$input.find('[name="SouFromPort"],[name="SouEndPort"],[name="DesFromPort"],[name="DesEndPort"]').each(function(){
				var nowdom = $(this).nextAll('.input-error');
				nowdom.addClass('input-error-fadeout');
				nowdom.css({
					left: (parseInt(nowdom.css('left')) + 15) + "px"
				});
				setTimeout(function() {
					nowdom.remove();
				}, 201);
			});
			
		}

		//初始化目的/源端口
		if(type == 'edit'){
			gn('DesFromPort','DesEndPort','SouFromPort','SouEndPort').each(function(){
				var $t = $(this);
				var tname = $t.attr('name');
				var tindex = (tname.substr(3,4) == 'From'?'0':'1');
				$t[0].defaultValue=data[tname.substr(0,3)+'Ports'].split('-')[tindex];
				$t.val(data[tname.substr(0,3)+'Ports'].split('-')[tindex]);
			});
		}

		//过滤关键字
		makeTheKeyWordChange();
		gn('FilterTypes').change(function(){
			makeTheKeyWordChange();
		})
		function makeTheKeyWordChange(){
			gn('Status').attr('disabled','disabled');
			if(gn('FilterTypes').val() == '3'){
				$input.find('[name="Status"][value="0"]').prop('checked','true');
			}else{
				gn('Status').removeAttr('disabled');
			}
		}
		
		//生成按钮组
		var btnlists= [
			{
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		            // $btn 是模块自动传入的，一般不会用到
		           savebtnClcikFunc(type,data);
		        }
		    },
		    {
		        "id"        : 'reset',
		        "name"      : '{reset}',
		        "clickFunc" : function($btn){
		            setTimeout(function(){
		            	gn('DesFromPort','DesEndPort','SouFromPort','SouEndPort').each(function(){
							var $t = $(this);
							var tname = $t.attr('name');
							var tindex = (tname.substr(3,4) == 'From'?'0':'1');
							$t.val(data[tname.substr(0,3)+'Ports'].split('-')[tindex]);
						});
		            },50)
		            
		        }
		    },
		    {
		        "id"        : 'back',
		        "name"      : '{back}',
		        "clickFunc" : function($btn){
		            displayTable($('#1'));
		        }
		    },
		    
		];
		var BG = require('BtnGroup');
		var $btn = BG.getDom(btnlists).addClass('u-btn-group');
		var tranDomArr = [$input,$btn];
			Translate.translate(tranDomArr, dicArr);
		$('#1').empty().append($input,$btn);
	}

	/* 保存点击*/
	function  savebtnClcikFunc(type,oldData){
		if(require('InputGroup').checkErr($('#1'))>0){
			return;
		}
		var Serialize = require('Serialize');
		// 获得用户输入的数据
		var queryArr = Serialize.getQueryArrs($('#1'));
		var queryJson = Serialize.queryArrsToJson(queryArr);
		
		
		
		if(type == 'add' && queryJson.index <= DATA.PolicyNames.length){
			Tips.showConfirm(T('Execution_order_Tip'),function(){
				 realSave();
			});
		}
		else if(type == 'edit' && queryJson.oldindex != queryJson.index && queryJson.index <= DATA.PolicyNames.length){
			Tips.showConfirm(T('Execution_order_Tip'),function(){
				 realSave();
			});
		}else{
			realSave();
		}
		
		
		function realSave(){
			queryJson.Action =( type == 'add'?'add':'modify');
			queryJson.PolicyNameOld = (type == 'add'?queryJson.PolicyNames:oldData.PolicyNames);
	
			queryJson.applyuserType = queryJson.orgType;
			if(queryJson.applyuserType == 'org'){
				queryJson.applyuserData = queryJson.orgData;
			}else if(queryJson.applyuserType == 'ip'){
				queryJson.applyuserData = queryJson.orgIp;
			}else{
				queryJson.applyuserData = '';
			}
	
			queryJson.destIP = queryJson.dstIP;
			queryJson.destAddr =queryJson.grp;
	
			queryJson.FilterKey ='';
			if(queryJson.FilterTypes == '2'){
				queryJson.FilterKey =queryJson.glnr_url;
			}else if(queryJson.FilterTypes == '3'){
				queryJson.FilterKey =queryJson.glnr_keyword;
			}else if(queryJson.FilterTypes == '4'){
				queryJson.FilterKey =queryJson.glnr_dns;
			}
	
//			var queryStr = Serialize.queryJsonToStr(queryJson);
			// queryStr=queryStr.replace("glnr_keyword","FilterKey");
		
		
		
		
		
			var newstrs = Serialize.queryJsonToStr(queryJson);

			var newname = queryJson.PolicyNames;
			var oldname = '';
			var olddataarr = DATA['tableData'].getSelect({index:queryJson.index});
			if(olddataarr.length >0){
					oldname = olddataarr[0].PolicyNames;
				}
			if(type == 'edit' && queryJson.oldindex <= queryJson.index){
				var highToLowDataArr = DATA['tableData'].getSelect({index:(Number(queryJson.index)+1)});
				if(highToLowDataArr.length > 0){
					oldname = highToLowDataArr[0].PolicyNames;
				}else{
					oldname = '';
				}
			}
			var newstr2 = "oldname="+oldname+"&newname="+newname;
			var reqstr = newstrs+'&'+newstr2;
				
				
				console.log(queryJson);
				console.log(newstr2);
				console.log(reqstr);
			$.ajax({
				url: '/goform/formFireWall',
				type: 'POST',
				data: reqstr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status', 'errorstr'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
						
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"];
						var status = data['status'];
						var errorstr=data['errorstr'];
						if (status) {
							Tips.showSuccess('{saveSuccess}', 2);
							displayTable($('#1'));
						} else {
							Tips.showWarning(errorstr, 2);
						}
					} else {
						Tips.showWarning('{netErr}', 2);
					}
				}
			});
		}

		
	}
});
