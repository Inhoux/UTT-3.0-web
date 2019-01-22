define(function(require, exports, module) {
	// 存储本页面一些变量
	var DATA = {};
	DATA['orgTypeSave'] = "";
	DATA['orgDataSave'] = "";
	var testtest="1,2,";
	var Tips=require("Tips");
	function tl(str){
    	return require('Translate').getValue(str, ['common','doRouterConfig']);
  	}	
	/*
	 * 
	 * 添加目的地址弹框
	 * */
	function makeDestinationAdressModal($thisInput,data){
			var data = data || {};
			var modallist = {
				id:'addDestinationAdress_modal',
				title:tl('addDstAddr'),
				size:'normal',
				"btns" : [
		            {
		                "type"      : 'save',
		                "clickFunc" : function($this){

							
		                    // $this 代表这个按钮的jQuery对象，一般不会用到
		                    var $thismodal = DATA['DestinationAdressModalObj'].getDom();

							if(require('InputGroup').checkErr($thismodal)>0){
								return false;
							}

		                    var dsAdressval = '';
		                    var $fmodal = $thisInput.parents('.modal');

		                    var chooseveach =  $thismodal.find('[name="dstIP"]:checked').val();
		                    var $dzzselect = $thismodal.find('[name="dstGroupName"]');
		                   
		                 
		                    if(chooseveach == 'groupSel' && $dzzselect.children(':selected').length != 1){
		                    	require('Tips').showWarning('当前地址组为空');
		                    	return false;
		                    }



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
			})
			
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
			                    "name"  : '{groupAddr}',
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
			    	"prevWord"	:'{groupAddr}',
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
			gn('words').after('<span>('+tl('policyRouterTips1')+'</span>');
			gn('words').remove();
			gn('dstFromIP').after('<span style="margin-left:10px">~</span><input type="text" name="dstEndIP" value="'+data.ip2+'" style="margin-left:10px"/>')
			gn('dstIP').parent().attr({colspan:'2'}).prev().remove();
			gn('dstEndIP').checkdemofunc('checkIPStartToEnd','dstFromIP');
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
			var $modal=modalObj.getDom();
			var Translate  = require('Translate');
			var tranDomArr = [$input, $modal];
			var dicArr     = ['common',,'doRouterConfig'];
			Translate.translate(tranDomArr, dicArr);			
			modalObj.show();
	}
	
	/**
	 * 自定义IP协议弹框.
	 * 
	 * */
	function makeDemoIPModal($thisInput,data){
	
		var data = data || {};
		var modallist = {
			id:'addDemoIP_modal',
			title:tl('addDefIpProtocal'),
			size:'large1',
			"btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                    // $this 代表这个按钮的jQuery对象，一般不会用到
	                    var $modal = $this.parents('.modal');
	                    var thisval = $modal.find('[name="agTextarea"]').val();
	                    var thisarr = thisval.split("\n");
	                    
	                   $thisInput.val(switchProtocols($modal.find('[name="Protocol"]').val()));
	                   $thisInput.next().val($modal.find('[name="Protocol"]').val());

	                   var textareaStr = $modal.find('[name="agTextarea"]').val();
	                   var textareaArr = [];
	                   
					 	textareaArr = textareaStr.split('\n');
					 	
	                   
	                   var formstr = '';
	                   var endtr = '';
	                   textareaArr.forEach(function(obj){
	                   		var objarr = obj.split('-');
	                   		formstr += objarr[0]+',';
	                   		endtr += objarr[1]+',';
	                   });
	                   formstr = formstr.substr(0,formstr.length-1);
	                   endtr = endtr.substr(0,endtr.length-1);
	                   
	                   $thisInput.next().next().val(formstr);
	                   $thisInput.next().next().next().val(endtr);
	                   
	                   DATA['DemoIPModalObj'].hide();
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
		DATA['DemoIPModalObj'] = modalObj;
		
		var inputlist = [
			{
				"display":false,
		        "inputData": {
		            "type": 'title',
		            "name": '{addDstIpAddr}',
		        }
		   },
		   {   
		   		"display":false,
		        "prevWord": '{ipType}',
		        "inputData": {
		            "defaultValue" : 'singl', 
		            "type": 'select',
		            "name": 'IPAdressType',
		            "items" : [
		                {
		                    "value" : 'singl',
		                    "name"  : '{singleIpAddr}',
		                },
		                {
		                    "value" : 'much',
		                    "name"  : '{rangeIp}',
		                },
		            ]
		        },
		        "afterWord": ''
		    },
		    {	
		    	"display":false,
			    "inputData": {
			        "type"       : 'textarea',
			        "name"       : 'IPTextarea',
			        "value"      : '',
			    },
			    "afterWord": ''
			},
			{
		        "inputData": {
		            "type": 'title',
		            "name": tl('addProtocal'),
		        }
		   },
		   {   
		        "inputData": {
		            "defaultValue" : data.p, 
		            "type": 'select',
		            "name": 'Protocol',
		            "items" : [
		                {
		                    "value" : '6',
		                    "name"  : 'TCP',
		                },
		                {
		                    "value" : '17',
		                    "name"  : 'UDP',
		                },
		                {
		                    "value" : '1',
		                    "name"  : 'ICMP',
		                },
		                {
		                    "value" : '51',
		                    "name"  : 'AH',
		                },
		                {
		                    "value" : '0',
		                    "name"  : 'all',
		                }
		            ]
		        },
		        "afterWord": ''
		    },
		    {   
		        "inputData": {
		            "value" : '', 
		            "type": 'text',
		            "name": 'DesFromPort'
		        },
		        "afterWord": ''
		    },
		    {
			    "inputData": {
			        "type"       : 'textarea',
			        "name"       : 'agTextarea',
			        "value"      : data.s,
			    },
			    "afterWord": ''
			},
			{
	
				"display":false,
		        "inputData": {
		            "type": 'title',
		            "name": '{remoteDomainName}',
		        }
		   },
		   {   
		  	 	"display":false,
		        "inputData": {
		            "value" : '', 
		            "type": 'text',
		            "name": 'remoteDomainName'
		        },
		        "afterWord": ''
		    },
		    {
		    	"display":false,
			    "inputData": {
			        "type"       : 'textarea',
			        "name"       : 'rdnTextarea',
			        "value"      : '',
			    },
			    "afterWord": ''
			},
		];
		var InputGroup = require('InputGroup');
		var $input = InputGroup.getDom(inputlist);
		
		/*新增组件  修改排版*/
		
		//添加小按钮
		var addbtn1 = [
			{
				id:'add1',
				name:'{add}',
				clickFunc:function($btn){
					$btn.blur();
					if($input.find('.IPAdressType_behindpart').hasClass('u-hide')){
						gn('firstIP').blur();
						if(gn('firstIP').parent().find('input-error:visible').size() == 0){
							var ipstrs = gn('firstIP').val();
							if(gn('IPTextarea').val() == ''){
								gn('IPTextarea').val(ipstrs);
							}else{
								gn('IPTextarea').val(gn('IPTextarea').val()+"\n"+ipstrs);
							}
						}
					}else{
						gn('firstIP','dstEndIP').blur();
						if(gn('firstIP').parent().find('input-error:visible').size() == 0){
							var ipstrs = gn('firstIP').val()+"-"+gn('dstEndIP').val();
							if(gn('IPTextarea').val() == ''){
								gn('IPTextarea').val(ipstrs);
							}else{
								gn('IPTextarea').val(gn('IPTextarea').val()+"\n"+ipstrs);
							}
						}
					}
				}
				
			}
		];
		var delbtn1 = [
			{
				id:'del1',
				name:'{delete}',
				clickFunc:function($btn){
					$btn.blur();
					gn('IPTextarea').val('');
				}
				
			}
		];
		InputGroup.insertBtn($input,'IPAdressType',addbtn1);
		InputGroup.insertBtn($input,'IPTextarea',delbtn1);
		$input.find('#del1').css({position:'absolute',bottom:'4px',left:'0px'}).parent().css({verticalAlign:'top'}).append('<span class="u-prompt-word">'+tl('policyRouterTips2')+'</span>');
		
		var addbtn2 = [
			{
				id:'add2',
				name:tl('add'),
				clickFunc:function($btn){
					$btn.blur();
//					gn('DesFromPort','DesEndPort').blur();
					if(require('InputGroup').checkErr(gn('DesFromPort').parent()) == 0){
						
						
						var ipstrs = gn('DesFromPort').val()+"-"+gn('DesEndPort').val();
						var ipstrsFlag = true;
						gn('agTextarea').val().split('\n').forEach(function(obj){
							if(ipstrs == obj){
								ipstrsFlag = false;
							}
						});
						if(ipstrsFlag){
							if(gn('agTextarea').val() == ''){
								gn('agTextarea').val(ipstrs);
							}else{
								gn('agTextarea').val(gn('agTextarea').val()+"\n"+ipstrs);
							}
						}
						gn('DesFromPort','DesEndPort').val('');
					}
				}
				
			}
		];
		var delbtn2 = [
			{
				id:'del2',
				name:tl('delete'),
				clickFunc:function($btn){
					$btn.blur();
					gn('agTextarea').val('');
				}
				
			}
		];
		InputGroup.insertBtn($input,'DesFromPort',addbtn2);
		InputGroup.insertBtn($input,'agTextarea',delbtn2);
		$input.find('#del2').css({position:'absolute',bottom:'4px',left:'0px'}).parent().css({verticalAlign:'top'}).append('<span class="u-prompt-word">'+tl('policyRouterTips3')+'</span>');
		
		var addbtn3 = [
			{
				id:'add3',
				name:tl('add'),
				clickFunc:function($btn){
					gn('remoteDomainName').blur();
					if(gn('remoteDomainName').parent().find('input-error:visible').size() == 0){
						var ipstrs = gn('remoteDomainName').val();
						if(gn('rdnTextarea').val() == ''){
							gn('rdnTextarea').val(ipstrs);
						}else{
							gn('rdnTextarea').val(gn('rdnTextarea').val()+"\n"+ipstrs);
						}
					}
				}
				
			}
		];
		var delbtn3 = [
			{
				id:'del3',
				name:'{delete}',
				clickFunc:function($btn){
					$btn.blur();
					gn('rdnTextarea').val('');
				}
				
			}
		];
		InputGroup.insertBtn($input,'remoteDomainName',addbtn3);
		InputGroup.insertBtn($input,'rdnTextarea',delbtn3);
		$input.find('#del3').css({position:'absolute',bottom:'4px',left:'0px'}).parent().css({verticalAlign:'top'}).append('<span class="u-prompt-word">'+tl('policyRouterTips2')+'</span>');
		
		
		//IP地址类型第一行
		gn('IPAdressType').after('<input type="text" name="firstIP" style="margin-left:10px"/><span class="IPAdressType_behindpart u-hide"  style="margin-left:10px">~</span><input type="text" class="IPAdressType_behindpart u-hide" name="dstEndIP" style="margin-left:10px"/>');
		gn('IPAdressType').parent().css({width:'531px'});
		
		//3个textarea的重新布局
		gn('IPTextarea','agTextarea','rdnTextarea').css({resize:'none',height:'80px',width:'600px'}).parent().attr({colspan:'2'}).prev().remove();
		
		//添加协议第一行
		gn('Protocol').parent().attr({colspan:'2'}).prev().remove();
		gn('Protocol').after('<span style="margin-left:23px">'+tl('appServe')+'</span><select name="appService" style="margin-left:10px"><option value="demo">'+tl('def')+'</option><option value="all">'+tl('portRange')+'</option></select>');
		
		gn('DesFromPort').parent().attr({colspan:'2'}).prev().remove();
		gn('DesFromPort').css({marginLeft:'10px'}).before('<span style="margin-left:183px">'+tl('outPort')+'</span>');
		gn('DesFromPort').after('<span style="margin-left:10px">~</span><input type="text" name="DesEndPort" style="margin-left:10px"/>');
		gn('DesFromPort').checkdemofunc("checkNum",'1','65535');	
		gn('DesEndPort').checkdemofunc('checkSourceToEndNum','1','65535',"DesFromPort",$input);
		//远程域名第一行
		gn('remoteDomainName').css({width:'600px'}).parent().attr({colspan:'2'}).prev().remove();
		
		/*绑定交互事件*/

		gn('IPAdressType').change(function(){
			if($(this).val() == 'singl'){
				$input.find('.IPAdressType_behindpart').addClass('u-hide');
			}else{
				$input.find('.IPAdressType_behindpart').removeClass('u-hide');
			}
		});
		
		var tcpBusiness=new Array(21,22,23,25,66,79,80,110,135,139,443,445,1433,1434,1720,1723,1863,3389);
		var tcpBusinessText=new Array("21(ftp)","22(ssh)","23(telnet)","25(smtp)","66(sql*net)","79(finger)","80(web)","110(pop3)","135(epmap)","139(netbios-ssn)","443(https)","445(ms-ds)","1433(ms-sql-s)","1434(ms-sql-m)","1720(h.323)","1723(pptp)","1863(msn login)","3389(ms-ts)");
		
		var udpBusiness=new Array(53,67,68,69,123,137,138,161,162,500,1701);
		var udpBusinessText=new Array("53(dns)","67(bootps)","68(bootpc)","69(tftp)","123(ntp)","137(netbios-ns)","138(netbios-dgm)","161(snmp)","162(snmptrap)","500(isakmp)","1701(l2tp)");

		gn('Protocol').change(function(){
			gn('agTextarea').val('');
			makeTheAgTypeChange();
		});
		makeTheAgTypeChange();
		function makeTheAgTypeChange(){
			var thisval = gn('Protocol').val();
			gn('appService').children().remove();
			gn('DesFromPort','DesEndPort').val('');
			gn('appService','DesFromPort','DesEndPort','agTextarea').removeAttr('disabled');
			gn('appService').append('<option value="-" selected="selected">'+tl('def')+'</option>');
			
			switch(thisval){
				case "6":
					tcpBusiness.forEach(function(obj,i){
						gn('appService').append('<option value="'+obj+'">'+tcpBusinessText[i]+'</option>')
					});
					gn('appService').append('<option value="1-65535">'+tl('allPort')+'</option>');
					break;
				case '17':
					udpBusiness.forEach(function(obj,i){
						gn('appService').append('<option value="'+obj+'">'+udpBusinessText[i]+'</option>')
					});
					gn('appService').append('<option value="1-65535">'+tl('allPort')+'</option>');
					break;
				default:
					gn('appService','DesFromPort','DesEndPort','agTextarea').attr('disabled','disabled');
					gn('agTextarea').val('0-0');
					break;
			}
		}
		
		gn('appService').change(function(){
			if($(this).val() != ''){
				var thisvalarr = $(this).val().split('-');
				if(thisvalarr.length ==1){
					gn('DesFromPort','DesEndPort').val(thisvalarr[0]);
				}else{
					gn('DesFromPort').val(thisvalarr[0]);
					gn('DesEndPort').val(thisvalarr[1]);
				}
				
			}
		})
		
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

		var Translate  = require('Translate');
		var tranDomArr = [$input,modalObj.getDom()];
		var dicArr     = ['common','doRouterConfig'];
		Translate.translate(tranDomArr, dicArr);

		modalObj.show();
	}	
	/**
	返回数字对应的自定义IP协议
	*/
	function switchProtocols(protocols){
				var showprotocols = 'TCP';
				switch(protocols){
					case '6':
					showprotocols = 'TCP';
					break;
					case '17':
					showprotocols = 'UDP';
					break;
					case '1':
					showprotocols = 'ICMP';
					break;
					case '51':
					showprotocols = 'AH';
					break;
					case '0':
					showprotocols = 'all';
					break;
					default:
					break;
				}
				return showprotocols;
			}

	/**
	 * 新增按钮的点击事件处理函数
	 * @author cao.yongxiang
	 * @date   2016-11-15
	 */
	function addBtnClick(type,data) {
		// 加载模态框模板模块

		var Modal = require('Modal');

		// 模态框配置数据
		var modalList = {
			"id": "modal-"+type,
			"title": (type == 'add'? tl("add"):tl('edit')),
            "btns" : [
                {   
                    "type"      : 'save',
                    "clickFunc" : function($this){
                        var $modal = $this.parents('.modal');
                        addSubmitClick($modal,type);
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

		var database = DATA.tableData;
  		var arrWan = [];
  		for(var i = 1;i <= DATA["wanCount"]; i ++)
  		{
  			arrWan.push(["WAN"+i,"WAN"+i]);
  		}

		var modeInputJsonWan = [];
		arrWan.forEach(function(item, index){
            if((Number(index))>Number(DATA["wanCount"])) return false;
			var obj = {
				"value" : item[0],
				"name"	: item[1],
				"isChecked" : 'true'
			};
			modeInputJsonWan.push(obj);
		});
		var arrTime =DATA["timeRangeNames"] || [];
		var modeInputJsonTime = [{"value" : '',"name"	: '{allDay}'}];

		arrTime.forEach(function(item, index){
			var obj = {
				"value" : item,
				"name"	: item
			};
			modeInputJsonTime.push(obj);
		});
		
		//编辑状态下
		
			var routeNames = '';
			var bind = '';
			var Profile = '';
			var Allows = '1';
			var Order = 1;
			var srcIpShow = tl('allUser');
			var orgType = 'all';
			var orgData = '';
			var orgIp = '0.0.0.0-0.0.0.0';
			var dstIPs = 'ipRange';
			var dstipFrom = '0.0.0.0';
			var dstipEnd = '0.0.0.0';
			var dstipGrps = '';
			var protocols = '6';
			var portShow = '';
			var fromport = '';
			var toport = '';
			var timeShow = '';
			// var pr_days = '';
			// var pr_timestarts = '';
			// var pr_timestops = '';
			var groupNames = '';
			var dstIpShow = '0.0.0.0-0.0.0.0';
			var RouteDst = 'TCP';
			var description = '';
			var fp = '';
			var ep = '';
			var defTime='{allDay}' //生效时间默认值
					   	
		if(type == 'edit'&& data !== undefined){
			routeNames = data["routeNames"];
			Allows = data["Allows"] || Allows;
			Profile = data["Profile"] || '';
			dstIPs = data["dstIPs"] || '';
			protocols = (data["protocols"] === undefined?'6':data["protocols"]);
			fromport = data["fromport"] || '1';
			toport = data["toport"] || '65535';
			// pr_days = data["pr_days"] || '';
			// pr_timestarts = data["pr_timestarts"] || '';
			// pr_timestops = data["pr_timestops"] || '';
			srcIpShow = data["srcIpShow"] || '';
			orgType = data["orgType"] || orgType;
			orgIp = data.orgIp || '0.0.0.0-0.0.0.0';
			orgData = data.orgData || '';
			dstIpShow = data.dstIpShow || dstIpShow;
			dstipEnd = data.dstipEnd || dstipEnd;
			dstipFrom = data.dstipFrom || dstipFrom;
			dstipGrps = data.dstipGrps || dstipGrps;
			Order = data.Order || Order;
			RouteDst = switchProtocols(protocols);
			description = (data.description === undefined?description:data.description);
			fp = data.fp || fp;
			ep = data.ep || ep;
			defTime=data.timeShow==undefined?'{allDay}':data.timeShow;
		}
		if(Allows=='no'){
			Allows='0';
		}
		else{
			Allows='1';
		}
		// 获得模态框的html
         var modalobj = Modal.getModalObj(modalList),
             $modal = modalobj.getDom(); // 模态框的jquery对象
         DATA['all_modalobj'] = modalobj;
		$('body').append($modal);
		// 模态框中输入框组的配置数据
		var inputList = [{
			"prevWord": '{status}',
			"inputData": {
				"type": 'radio',
				"name": 'PolicyEnable',
				"defaultValue": Allows,
				"items": [{
					"value": '1',
					"name": '{open}'
				}, {
					"value": '0',
					"name": '{close}'
				}, ]
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{ruleName}',
			"inputData": {
				"type": 'text',
				"name": 'PolicyName',
				value : routeNames ,
                 "checkDemoFunc": ['checkInput', 'name', '1', '31', '3'] 
			},
			"afterWord": ''
		}, {
            "necessary": false,
			"prevWord": '{note}',
			"inputData": {
				"type": 'text',
				"name": 'RouteInfo',
				value:description,
				"checkDemoFunc": ['checkInput', 'name', '0', '31', '3'] 
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{exeSequence}',
			"inputData": {
				"type": 'text',
				"name": 'RouteLevel',
                "value": Order,
                "checkDemoFunc" : ['checkNum','1','10000']
			},
			"afterWord": '{policyRouterTips4}'
		}, {
			"prevWord": '{bind_if}',
			"inputData": {
				"type": 'select',
				"name": 'Profile',
				defaultValue:Profile,
                "items": modeInputJsonWan
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{srcAddr}',
			"inputData": {
				"type": 'text',
				"name": 'sourceIP',
				value:srcIpShow
			},
			"afterWord": ''
		}, 
		{
			"prevWord": '{dstAddr}',
			"inputData": {
				"type": 'text',
				"name": 'dstAddr',
				value:dstIpShow
			},
			"afterWord": ''
		},		
		{
			"prevWord": '{defIpAddr}',
			"inputData": {
				"type": 'text',
				"name": 'RouteDst',
				value:RouteDst
			},
			"afterWord": ''
		}, {
			"prevWord": '{activeTime}',
			"inputData": {
				"type": 'select',
				"name": 'RouteTime',
                "items": modeInputJsonTime,
                "defaultValue":defTime
			},
			"afterWord": ''
		}];
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		//增加新模块
		$dom.find('[name="sourceIP"]').after('<input type="text" class="u-hide"  value="'+orgType+'" name="orgType" />');
		$dom.find('[name="sourceIP"]').after('<input type="text" class="u-hide"  value="'+orgData+'" name="orgData" />');
		$dom.find('[name="sourceIP"]').after('<input type="text" class="u-hide"  value="'+orgIp+'" name="orgIp" />');
		$dom.find('[name="sourceIP"]').attr('readonly','true');
		if(type == 'edit'){
			$dom.find('[name="PolicyName"]').attr('disabled','disabled');
		}
		
		//增加点击事件
		$dom.find('[name="sourceIP"]').click(function(){
				var datass = {
					//保存回调
					saveClick:function(saveData){
						DATA['orgTypeSave'] = saveData.applyTypeStr;
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						if (saveData.applyTypeStr == "ip"){
							DATA['orgDataSave'] = saveData.ipStr;
							$dom.find('[name="orgIp"]').val(saveData.ipStr);
							$dom.find('[name="sourceIP"]').val(saveData.ipStr);
						}
						else if (saveData.applyTypeStr == "org"){
							DATA['orgDataSave'] = saveData.checkIdStr;
							$dom.find('[name="orgData"]').val(saveData.checkIdStr);
							$dom.find('[name="sourceIP"]').val(saveData.showName);
							//$dom.find('[name="sourceIP"]').val(tl('orgStructure'));
						}
						else{
							DATA['orgDataSave'] = "";
							$dom.find('[name="sourceIP"]').val(tl('allUser'));
						}
						saveData.close();
					},
					checkableStr:$dom.find('[name="orgData"]').val(),//被勾选的id字符串
					ipStr:$dom.find('[name="orgIp"]').val(),//开始结束的ip
					applyTypeStr:$dom.find('[name="orgType"]').val()//单选默认值

				};
			require('P_plugin/Organization').display(datass);
		});

		//目的地址
		$dom.find('[name="dstAddr"]').attr('readonly','true').after('<input type="text" style="display:none" name="dstIP"  value="'+dstIPs+'"/><input type="hidden" name="ip1" value="'+dstipFrom+'"/><input type="hidden" name="ip2" value="'+dstipEnd+'"/><input type="hidden" name="grp" value="'+dstipGrps+'"/><input type="hidden" name="choose" value="'+(dstipGrps == ''?'ipRange':'groupSel')+'"/>');
		$dom.find('[name="dstAddr"]').click(function(){
			var $t = $(this);
			$t.blur();
			var datas ={
				ip1:$dom.find('[name="ip1"]').val(),
				ip2:$dom.find('[name="ip2"]').val(),
				grp:$dom.find('[name="grp"]').val(),
				choose:$dom.find('[name="choose"]').val()
			};
			
			makeDestinationAdressModal($t,datas);
			
		});
		//自定义IP
		$dom.find('[name="RouteDst"]').attr('readonly','true').after('<input type="hidden" name="Protocol" value="'+protocols+'"><input type="hidden" name="DesFromPort" value="'+fp+'"><input type="hidden" name="DesEndPort" value="'+ep+'">');
		$dom.find('[name="RouteDst"]').click(function(){
			var $t = $(this);
			$t.blur();
			var showtext = '';
			var eparr = $dom.find('[name="DesEndPort"]').val().split(',');
			var fparr = $dom.find('[name="DesFromPort"]').val().split(',');
			if(eparr.length>0 && $dom.find('[name="DesEndPort"]').val() != ''){
				eparr.forEach(function(pobj,i){
					showtext +=fparr[i]+'-'+ pobj+'\n';
				});
				showtext = showtext.substr(0,(showtext.lastIndexOf('\n')));
			}
			var datas ={
				p:$dom.find('[name="Protocol"]').val(),
				s:showtext,
			};
			makeDemoIPModal($t,datas);
		});

		//添加时间计划小按钮
		var btnList = [
			{
				id :'addTimePlan',
				name:'{add}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').addModal($dom.find('[name="RouteTime"]'));
					// // require('P_plugin/Organization').test();
					// require('P_plugin/Organization').display(datass);
				}
			},
			{
				id :'editTimePlan',
				name:'{edit}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').editModal($dom.find('[name="RouteTime"]'));
				}
			}
		];
		InputGroup.insertLink($dom,'RouteTime',btnList);



		// 将输入框组放入模态框中
		$modal.find('.modal-body').empty().append($dom);

		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		var dicArr     = ['common','doRouterConfig'];
		Translate.translate(tranDomArr, dicArr);		
		// 显示模态框
		//body').append($modal);
		$modal.modal('show');



	}
	/**
	 * 新增模态框中提交按钮点击事件
	 * @author cao.yongxiang
	 * @date   2016-11-15
	 */
	function addSubmitClick($modal,type) {
		var InputGroup = require('InputGroup');
		var len = InputGroup.checkErr($modal);
        if(len > 0)
        {
            return;
        }
		// 加载序列化模块
		var Serialize = require('Serialize');
		// 获得用户输入的数据
		var queryArrs = Serialize.getQueryArrs($modal);
		var queryJson = Serialize.queryArrsToJson(queryArrs);
		// 添加静态路由
		var InputGroup = require('InputGroup');

        var PolicyName = queryJson.PolicyName;

        var PolicyNameold = PolicyName;

         var PolicyEnable = queryJson.PolicyEnable; //Serialize.getValue(queryArrs, 'PolicyEnable')[0];
        var PolicyEnablew = PolicyEnable == "1"?"on":"off";
        var RouteLevel = queryJson.RouteLevel;
        var Profile =queryJson.Profile;//Serialize.getValue(queryArrs, 'Profile')[0];
        var sourceIP = 'org'; //Serialize.getValue(queryArrs, 'sourceIP')[0];
        var FromIP = '';//Serialize.getValue(queryArrs, 'FromIP')[0];
        // var dstEndIP = '';//Serialize.getValue(queryArrs, 'EndIP')[0];
        var EndIP = '';
        var GroupName = '';//Serialize.getValue(queryArrs, 'GroupName')[0];
        var description=queryJson.RouteInfo;
        var dstIP = queryJson.dstIP;//Serialize.getValue(queryArrs, 'dstIP')[0];
        var dstFromIP = (dstIP == 'ipRange'?queryJson.dstAddr.split('-')[0]:'');//Serialize.getValue(queryArrs, 'dstFromIP')[0];
        var dstEndIP = (dstIP == 'ipRange'?queryJson.dstAddr.split('-')[1]:'');//Serialize.getValue(queryArrs, 'dstEndIP')[0];
       	var dstGroupName= (dstIP == 'ipRange'?'':queryJson.dstAddr);//地址组名  Serialize.getValue(queryArrs, 'dstGroupName')[0]; // var dstGroupName = '';
        var Protocol = queryJson.Protocol;//协议前面对应的数字 Serialize.getValue(queryArrs, 'Protocol')[0];
        var CommService = '';
        var DesFromPort = queryJson.DesFromPort;//起始端口号 Serialize.getValue(queryArrs, 'DesFromPort')[0];
        var DesEndPort = queryJson.DesEndPort;//结束端口号 Serialize.getValue(queryArrs, 'DesEndPort')[0];
        var everyday = 'everyday';
        var effecttime = 'All';
        var day = '1111111';//Serialize.getValue(queryArrs, 'day')[0];
        var timestart = 'All';//Serialize.getValue(queryArrs, 'timestart')[0];
        var timestop = '0';//Serialize.getValue(queryArrs, 'timestop')[0];
        var Action = (type == 'add'?"add":"modify");
		var RouteTime=queryJson.RouteTime;
            if (PolicyName != '') {
                var queryArrs = [
                    ['PolicyName', PolicyName],
                    ['PolicyNameold', PolicyNameold],
                    ['description', description],
                    ['PolicyEnable', PolicyEnable],
                    ['PolicyEnablew', PolicyEnablew],
                    ['RouteLevel', RouteLevel],
                    ['Profile', Profile],
                    ['sourceIP', sourceIP],
                    ['FromIP', FromIP],
                    // ['dstEndIP', dstEndIP],
                    ['EndIP', EndIP],
                    ['GroupName', GroupName],
                    ['dstIP', dstIP],
                    ['dstFromIP', dstFromIP],
                    ['dstEndIP', dstEndIP],
                    ['dstGroupName', dstGroupName],
                    ['Protocol', Protocol],
                    ['CommService', CommService],
                    ['DesFromPort', DesFromPort],
                    ['DesEndPort', DesEndPort],
                    ['everyday', everyday],
                    ['effecttime', effecttime],
                    ['day', day],
                    ['timestart', timestart],
                    ['timestop', timestop],
                    ['orgType', DATA.orgTypeSave],
                    ['orgData', DATA.orgDataSave],
                    ['Action', Action],
                    ['RouteTime', RouteTime],
                ];
			queryStr = Serialize.queryArrsToStr(queryArrs);
			var tmpJson = Serialize.queryStrsToJson(queryStr);
			
			// return;
			// if(tmpJson.DesFromPort==""){
			// 	Tips.showWarning('{saveFail}');
			// 	return;
			// }
			// if(tmpJson.DesFromPort=="undefined"){
			// 	Tips.showWarning('{saveFail}');
			// 	return;
			// }
			// if(tmpJson.DesEndPort==""){
			// 	Tips.showWarning('{saveFail}');
			// 	return;
			// }
			// if(tmpJson.DesEndPort=="undefined"){
			// 	Tips.showWarning('{saveFail}');
			// 	return;
			// }
			var datalength = DATA["db"].table().getSelect().length;
			if(tmpJson.Action == 'add' && tmpJson.RouteLevel <= datalength){
				//Tips.showConfirm(tl('Execution_order_Tip'),function(){
					postData(queryStr, PolicyName, queryJson);
				//});
			}else if(tmpJson.Action  == 'edit' && tmpJson.RouteLevel <= datalength && tmpJson.RouteLevel != Number(tmpJson.RouteLevel)){
				//Tips.showConfirm(tl('Execution_order_Tip'),function(){
					postData(queryStr, PolicyName, queryJson);
				//});
			}
			else{
				postData(queryStr, PolicyName, queryJson);
			}
		}else {
                Tips.showWarning('{NoSave}');
            }	

	}
	function postData(queryStr, PolicyName, queryJson){
/*
			var enStr='GlobalEnable=on';
			$.ajax({
				url: '/goform/formPolicyRouteGlobalConfig',
				type: 'POST',
				data: enStr,
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
							console.log('开启成功');
						}
					}	
				}
			});			
*/
			$.ajax({
				url: '/goform/formPolicyRouteConf',
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
							Tips.showSuccess('{saveSuccess}');
							//判断并执行排序操作
							var newName = PolicyName;
							var oldName = '';
							if(DATA["tableData"].getSelect({Order:queryJson.RouteLevel})[0]){
								oldName = DATA["tableData"].getSelect({Order:queryJson.RouteLevel})[0].routeNames;
							}
							if(oldName != ''){
								$.ajax({
									url: '/goform/formPolicyRouteMove_Config',
									type: 'POST',
									data: 'sID='+newName+'&tID='+oldName,
									success: function(result1) {
										var codeStr1 = result1,
											variableArr1 = ['status'],
											result1 = doEval.doEval(codeStr1, variableArr1),
											isSuccess1 = result1["isSuccessful"];
										// 判断代码字符串执行是否成功
										if (isSuccess1) {
											var data1 = result1["data"],
												status1 = data1["status"];
											if (status1) {
												 DATA['all_modalobj'].hide();
												display($('#2'));
											}
										}
									}
								});
							}else{
								 DATA['all_modalobj'].hide();
								display($('#2'));
							}
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
	function deleteBtnClick() {
		//获得提示框组件调用方法
		var database = DATA["tableData"];
		var tableObj = DATA["tableObj"];
		// 获得表格中所有被选中的选择框，并获取其数量
        var	primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
			length = primaryKeyArr.length;
		// 判断是否有被选中的选择框
		if (length > 0) {
			require('Tips').showConfirm(tl('delconfirm'),function(){
				var str = '';
				primaryKeyArr.forEach(function(primaryKey) {
					var data = database.getSelect({
						primaryKey: primaryKey
					});
					var name = data[0]["routeNames"];
					str += name + ',';
				});
				str = str.substr(0, str.length - 1);
				str = "GlobalEnable=" + DATA.prEnable + '&delstr=' + str;
				$.ajax({
					url: '/goform/formPolicyRouteDel',
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
								display($('#2'));
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
			Tips.showWarning('{unSelectDelTarget}');
		}
	}

	function changeStatus(data, $target) {
		var Allows = (data["Allows"] == 'yes') ? 'no' : 'yes';
		//获得提示框组件调用方法
		// 加载查询字符串序列化模块
		var Serialize = require('Serialize');
		// 查询字符串二维数组
        var queryArr = [
        	['GlobalEnable', DATA["prEnable"]],
        	['Allow', Allows],
            ['AllowID', data["routeNames"]],
            ['id', ""],
            ['delstr', ""]
        ];
		// 调用序列化模块的转换函数，将数组转换为查询字符串
		var queryStr = Serialize.queryArrsToStr(queryArr);

		// 向后台发送请求
		$.ajax({
			url: '/goform/formPolicyRouteAllow',
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
					var data2 = result["data"],
						status = data2['status'];
					// 后台修改成功
					if (status) {
						// 显示成功信息
					
						var successMsg = (Allows == 'yes') ? tl('openSuccess') : tl('closeSuccess');
						Tips.showSuccess(successMsg);
						display($('#2'));
					} else {
						var errorstr=data2.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showWarning('{oprtFail}');
						}else{
							Tips.showWarning(errorstr);
						}
						// 显示失败信息
					}
				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}

	function editBtnClick(data) {
		// 加载模态框模板模块
		var Modal = require('Modal');
  		var arr = [['LAN','LAN']];
  		for(var i = 1;i <= DATA["wanCount"]; i ++)
  		{
  			arr.push(["WAN"+i,"WAN"+i]);
  		}
		var modeInputJson = [];
		arr.forEach(function(item, index){
            if((Number(index))>Number(DATA["wanCount"])) return false;
			var obj = {
				"value" : item[0],
				"name"	: item[1],
				"isChecked" : 'true'
			};
			modeInputJson.push(obj);
		});

		var modalList = {
			"id": "modal-edit",
			"title": "{edit}",
			"btns" : [
		        {
		            "type"      : 'save',
		            "clickFunc" : function($this){

		                var $modal = $this.parents('.modal');
		                editSubmitClick($modal, data);
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
			$modal = modalobj.getDom(); // 模态框的jquery对象
		$('body').append($modal);

		var routeNames = data["routeNames"],
			Allows = data["Allows"],
			Profile = data["Profile"],
			dstIPs = data["dstIPs"],
			protocols = data["protocols"],
			fromport = data["fromport"],
			toport = data["toport"],
			pr_days = data["pr_days"],
			pr_timestarts = data["pr_timestarts"],
			pr_timestops = data["pr_timestops"];

		/*var isClosed = (RouteEnable == '1') ? true : false;*/
		var inputList = [{
			"prevWord": '{routeStat}',
			"inputData": {
				"type": 'radio',
				"name": 'Allows',
				"defaultValue": Allows,
				"items": [{
					"value": 'yes',
					"name": '{open}',
				}, {
					"value": 'no',
					"name": '{close}',
				}, ]
			},
			"afterWord": ''
		}, {
            "disabled": true,
            "necessary": true,
			"prevWord": '{routeName}',
			"inputData": {
				"type": 'text',
				"name": 'routeNames',
                "value":routeNames,
                "checkFuncs": ['re_checkName'],
			},
            "afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{rou_destNet}',
			"inputData": {
				"type": 'text',
				"name": 'dstIPs',
				"value": dstIPs,
				"checkFuncs":['re_checkIP'],
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{routeNetMask}',
			"inputData": {
				"type": 'text',
				"name": 'DesMasks',
				"value": DesMasks,
				"checkFuncs":['re_checkMasks'],
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{routeGW}',
			"inputData": {
				"type": 'text',
				"name": 'GateWays',
				"value": GateWays,
                "checkFuncs":['re_checkIP'],
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{routePri}',
			"inputData": {
				"type": 'text',
				"name": 'Metrics',
				"value": Metrics,
                "checkFuncs": ['re_checkNumber'],
			},
			"afterWord": '{policyRouterTips4}'
		}, {
			"prevWord": '{bind_if}',
			"inputData": {
				"type": 'select',
				"name": 'Profile',
				"defaultValue": Profile,
                "items": modeInputJson
			},
			"afterWord": ''
		}, ]

		var InputGroup = require('InputGroup'),
			$dom = InputGroup.getDom(inputList);
		
		/*
		 * 添加点击事件
		 * */
		//目的地址
		$dom.find('[name="dstAddr"]').click(function(){
			var $t = $(this);
			$t.blur();
			makeDestinationAdressModal($t);
			
		});
		//自定义IP
		$dom,find('[name="RouteDst"]').click(function(){
			var $t = $(this);
			$t.blur();
			makeDemoIPModal($t);
		});
		
		$modal.insert($dom);
		$modal.modal('show');
	}

	function editSubmitClick($modal, data) {
		// 引入serialize模块
		var Serialize = require('Serialize');
		var queryArr = Serialize.getQueryArrs($modal),
			queryJson = Serialize.queryArrsToJson(queryArr),
			queryStr = Serialize.queryArrsToStr(queryArr);
		var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if(len > 0)
        {
            Tips.showError('{NoSave}');
            return;
        }
		// 将模态框中的输入转化为url字符串

        var str = 'Actions=modify';
		// 合并url字符串
		queryStr = Serialize.mergeQueryStr([queryStr, str]);
		//获得提示框组件调用方法
		$.ajax({
			url: '/goform/formStaticRoute',
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
						displayTable($('#2'));
					} else {
						Tips.showWarning('{saveFail}');
					}
				} else {
					Tips.showWarning('{parseStrErr}');
				}
			}
		});
	}

	function removeStaticRoute(data, $target) {
		var routeNames = data["routeNames"];
		var queryStr = 'delstr=' + routeNames;
		require('Tips').showConfirm(tl('delconfirm'),function(){
			$.ajax({
				url: '/goform/formPolicyRouteDel',
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
							display($('#2'));
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
		var fieldArr = ['ID',
							'routeNames',
							'bind',
							'Profile',
							'Allows',
							'Order',
							'srcIpShow',
							'orgType',
							'orgData',
							'orgIp',
							'dstIpShow',
							'dstIPs',
							'dstipFrom',
						   	'dstipEnd',
						   	'dstipGrps',
						   	'protocols',
						   	'portShow',
						   	'fromport',
						   	'toport',
						   	'timeShow',
						   	// 'pr_days',
						   	// 'pr_timestarts',
						   	// 'pr_timestops',
						   	'description',//备注
						    'fp',//起始端口
						    'ep',//结束端口
						   //	'groupNames'
						   	];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
		DATA["db"]=database;

	}

	function processData(jsStr) {
		// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = jsStr,
			// 定义需要获得的变量
			variableArr = ['prEnable',
							'routeNames',
							'bind',
							'Profile',
							'Allows',
							'orgType',
							'orgData',
							'orgIp',
							'orgNames',
							'dstIPs',
							'dstipFrom',
						   	'dstipEnd',
						   	'srcipGrps',
						   	'dstipGrps',
						   	'protocols',
						   	'fromport',
						   	'toport',
						   	'pr_days',
						   	'pr_timestarts',
						   	'pr_timestops',
						   	'groupNames',
						   	'timeRangeNames',
					        'description',//备注
						    'fp',//起始端口
						    'ep',//结束端口
						    'activeTime',
						    'prEnable'//全局开关
						   	];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];
		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];

			DATA.routeNames = data.routeNames;
			DATA['prEnable'] = data["prEnable"];
			DATA['groupNames'] = data["groupNames"];
			DATA['timeRangeNames'] = data["timeRangeNames"];
			// DATA['prEnable'] = data["prEnable"];
			
			// 将返回的JS代码执行所生成的变量进行复制
			var titleArr = [
							'ID',
							'routeNames',
							'bind',
							'Profile',
							'Allows',
							'Order',
							'srcIpShow',
							'orgType',
							'orgData',
							'orgIp',
							'dstIpShow',
							'dstIPs',
							'dstipFrom',
						   	'dstipEnd',
						   	'dstipGrps',
						   	'protocols',
						   	'portShow',
						   	'fromport',
						   	'toport',
						   	'timeShow',
						   	// 'pr_days',
						   	// 'pr_timestarts',
						   	// 'pr_timestops',
						   	 'description',//备注
						    'fp',//起始端口
						    'ep',//结束端口
						   	//'groupNames',
						   	//'timeRangeNames',
						   	
				], // 表格头部的标题列表
				routeNameArr = data["routeNames"],
				bindArr = data["bind"],
				ProfileArr = data["Profile"],
				AlloWsArr = data["Allows"],
				orgTypeArr = data["orgType"],
				orgDataArr = data["orgData"],
				orgIpArr = data["orgIp"],
				orgNamesArr = data["orgNames"],
				dstIPsArr = data["dstIPs"],
				dstipFromArr = data["dstipFrom"],
				dstipEndArr = data["dstipEnd"],
				dstipGrpsArr = data["dstipGrps"],
				protocolsArr = data["protocols"],
				fromportArr = data["fromport"]
				toportArr = data["toport"],
				// pr_daysArr = data["pr_days"],
				// pr_timestartsArr = data["pr_timestarts"],
				// pr_timestopsArr = data["pr_timestops"],
				activeTime = data["activeTime"],
				groupNames = data["groupNames"],
				timeRangeNames = data["timeRangeNames"];
				description = data.description;
				fp = data.fp;
				ep = data.ep;
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
			//arr = [];
			//dataArr.push(arr);
			// 通过数组循环，转换数据的结构
			routeNameArr.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(index+1);
				arr.push(routeNameArr[index]);
				arr.push(bindArr[index]);
				arr.push(ProfileArr[index]);
				arr.push(AlloWsArr[index]);
				arr.push(index+1);
				if (orgTypeArr[index] == "org"){
					//arr.push(tl('orgStructure'));
					arr.push(orgNamesArr[index]);
				}else if (orgTypeArr[index] == "ip"){
					arr.push(orgIpArr[index]);

				}else{
					arr.push(tl('allUser'));
				}
				arr.push(orgTypeArr[index]);
				arr.push(orgDataArr[index]);
				arr.push(orgIpArr[index]);
				// if (dstIPsArr[index] == "ipRange"){

				if (dstIPsArr[index] == "groupSel"){

					arr.push(dstipGrpsArr[index]);
				}else{
					arr.push(dstipFromArr[index]+"-"+dstipEndArr[index]);
				}
				arr.push(dstIPsArr[index]);
				arr.push(dstipFromArr[index]);
				arr.push(dstipEndArr[index]);
				arr.push(dstipGrpsArr[index]);
				arr.push(protocolsArr[index]);
				
				var fpepstrs = '';
				var fpepcount = 0;
				fp[index].forEach(function(fpepobj,fpepi){
					if(fpepobj != 0){
						fpepstrs += (fpepobj +"-"+ ep[index][fpepi]+" ");
					}
				});
				arr.push(fpepstrs);

			
				arr.push(fromportArr[index]);
				arr.push(toportArr[index]);
				// arr.push("{allDay}");
				// arr.push(pr_daysArr[index]);
				// arr.push(pr_timestartsArr[index]);
				// arr.push(pr_timestopsArr[index]);
				if(activeTime[index]==''){
					arr.push("{allDay}");
				}else{
					arr.push(activeTime[index]);
				}
				arr.push(description[index]);
				var fpstr = '';
				var epstr = '';
				var fpepsplice = 0;
				fp[index].forEach(function(fpepobj,fpepindex){
					if(fpepobj == 0){
						fpepsplice++;
					}
				});
				fp[index].splice(fp[index].length-fpepsplice,fpepsplice);
				ep[index].splice(ep[index].length-fpepsplice,fpepsplice);

				arr.push(fp[index].join(','));
				arr.push(ep[index].join(','));
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
			console.log(result)
			console.log('字符串解析失败')
		}
	}
	/**
	 * 生成表格的Dom，并返回
	 * @author cao.yongxiang
	 * @date   2016-11-15
	 */
	function getTableDom() {

		// 表格上方按钮配置数据
		var btnList = [{
			"id": "add",
			"name": "{add}",
			"clickFunc" : function($btn){
		   addBtnClick('add');
	    }
		}, {
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
			"isSelectAll" : true,
			"dicArr":['common','doRouterConfig'],
			"titles": {
				"ID": {
					"key": "ID",
					"type": "text"
				},
				"{routeName}": {
					"key": "routeNames",
					"type": "text"
				},
				"{open}": {
					"key": "Allows",
					"type": "checkbox",
					"values": {
						"yes": true,
						"no": false
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
				
				"{exeSequence}": {
					"key" : "Order",
					"type": "text"
				},
				"{srcAddr}": {
					"key" : "srcIpShow",
					"type": "text",
					"maxLength" : 31
				},
				"{dstAddr}": {
					"key" : "dstIpShow",
					"type": "text"
				},
				"{protocal}": {
					"key" : "protocols",
					"type": "text",
					filter:function(oldStr){
						var newStr = "";
						if(oldStr == "6")
							newStr = "TCP";
						else if(oldStr == "17")
							newStr = "UDP";
						else if(oldStr == "1")
							newStr = "ICMP";
						else if(oldStr == "51")
							newStr = "AH";
						else
							newStr = "{allProtocal}";
						return newStr;
					}
				},
				"{dstPort}": {
					"key" : "portShow",
					"type": "text",
					"maxLength" : 10
				},
				"{activeTime}": {
					"key" : "timeShow",
					"type": "text"
				},
				"{bind_if}": {
					"key" : "Profile",
					"type": "text"
				},
				"{note}": {
					"key" : "description",
					"type": "text",
					"filter":function(strs){
						var newstr = strs===undefined?'':strs;
						if(newstr.length >10){
							newstr = newstr.substr(9) + "……";
						}
						return newstr;
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
								
								addBtnClick('edit',data[0]);
//								editBtnClick(data[0], $this);
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
								removeStaticRoute(data[0], $this);
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
		var Table = require('Table');
		var tableObj = Table.getTableObj(list);
		var $table = tableObj.getDom();

		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		return $table;
	}

	function displayOnOff(){
		var OnOff = require('P_plugin/OnOff');
	    var $onoff = OnOff.getDom({
	        prevWord:tl('policyButton')+' :',
	        afterWord:'',
	        id:'checkOpen',
	        defaultType:DATA['prEnable'] == "on"?true:false,
	        clickFunc:function($btn,typeAfterClick){
				var BehGloEn ;
                if ( DATA['prEnable'] == "on")
                {
                    BehGloEn = "off";
                }else
                {
                    BehGloEn = "on";
                }
                var postQueryStr = 'GlobalEnable='+ BehGloEn;
                console.log(postQueryStr);
				$.ajax({
				url : 'goform/formPolicyRouteGlobalConfig',
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
							$('.nav a[href="#2"]').trigger('click');
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

	function displayTable($container) {

		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		// 将表格容器放入标签页容器里
		$container.append($tableCon);
		// 向后台发送请求，获得表格数据
		$.ajax({
		 	url: 'common.asp?optType=timePlan|addrGroup|policyRoute',
		 	type: 'GET',
		 	success: function(result) {
		 		// 将后台数据处理为数据表格式的数据
			var data = processData(result);
            var tableData = data["table"];
			var	titleArr = tableData["title"],
				tableArr  = tableData["data"];
			// DATA["db"]    = data;
		// 将数据存入数据表
		storeTableData(tableArr);
		var $table = getTableDom();
		// 将表格放入页面
		$tableCon.append($table);
		displayOnOff();

		var MoveTo = require('P_plugin/MoveTo');
	    var $moveto = MoveTo.getDom({
	        select : DATA.routeNames,
	        url    : 'goform/formPolicyRouteMove_Config',
	        str1      : 'sID',  
	        str2      : 'tID', 
	        saveSuccess : function($btn){
	                        $('[href="#2"]').trigger('click');          
	                    }
	    });
	    MoveTo.joinContent($('#2'),$moveto);
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
		var Translate = require('Translate'); 
		var dicNames = ['common', 'doRouterConfig', 'doTimePlan']; 
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
