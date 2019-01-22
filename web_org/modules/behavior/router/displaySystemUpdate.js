define(function(require, exports, module) {
	var DATA={};
	require('jquery');
	var demoi = 0;

	function tl(str){
    	return require('Translate').getValue(str,['common','tips','error', 'doSysMaintenance']);
  	} 

// function ajax(){
// 	var aj=new Object();
//     aj.url = null;
// 	aj.erroInfo="错误信息";
// 	aj.isAutoRefresh=1;
// 	aj.refreshTime=2;
// 	aj.ptr=null;
// 	aj.method='get';
// 	aj.xmlHttp=null;
// 	aj.sendString=null;
// 	aj.start=function() {
// 		var fun=(aj.method=='get'?aj.get:aj.post);
// 		fun();
//         if(aj.isAutoRefresh) aj.ptr=setInterval(fun,aj.refreshTime*1000);
// 	}	
// 	aj.Stop=function()
// 	{
// 		clearInterval(aj.ptr);
// 	}

//     aj.get=function(newUrl) {
// 	if(typeof(newUrl)!="string") newUrl = "";
//         aj.xmlHttp.open('GET',newUrl || aj.url, true);
// 		aj.xmlHttp.onreadystatechange =  aj.xmlHttpStateChange  ;
//         aj.xmlHttp.setRequestHeader("Content-type", "text/xml; charset=utf-8");
//         aj.xmlHttp.send();
//     }
// 	aj.post = function(newUrl, sendString) {
// 	    if(typeof(newUrl)!="string") newUrl = "";
// 	    if(typeof(sendString)!="string") sendString = "";
// 	    aj.xmlHttp.open('POST', newUrl || aj.url,true);
// 		aj.xmlHttp.onreadystatechange =  aj.xmlHttpStateChange ;
// 	    aj.xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 	    aj.xmlHttp.send(sendString||aj.sendString);
// 	}
//    	aj.erroProcessHandle= function() {
// 		return;
//     }
//     aj.processHandle=function(str) {
//     }
// 	aj.creatXmlHttp=function()
// 	{
//         if (window.XMLHttpRequest) {
//             aj.xmlHttp = new XMLHttpRequest();
//             if (aj.xmlHttp.overrideMimeType) {
//                 aj.xmlHttp.overrideMimeType("text/xml");
//             }
//         } else if (window.ActiveXObject) {
//             try {
//                 aj.xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
//             } catch(e) {
//                 try {
//                     aj.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
//                 } catch(e) {}
//             }
//         }
//         if (!aj.xmlHttp) {
//             // alert("JSAlert56");
//             return false;
//         }
// 		aj.xmlHttpStateChange = function() {
//             if (aj.xmlHttp.readyState == 4) {
//                 if (aj.xmlHttp.status == 200) {
//                     aj.processHandle(aj.xmlHttp.responseText);
//                 } else {
//                     aj.erroProcessHandle();
//                 }
//             }
//         }
// 	}
// 	aj.creatXmlHttp();
// 	if(!aj.xmlHttp) return false;	
// 	return aj;
// }	
// function autoUpdate()
// {
//     var ajaxUpdate=ajax();
//     if(ajaxUpdate){
// 	ajaxUpdate.url="/goform/formSoftUpdate?appType=SOFT_UDTYPE",
// 	ajaxUpdate.get(ajaxUpdate.url);
// 	ajaxUpdate.processHandle=function (rsp){
// 	    if(rsp){
// 		eval("var json="+rsp); 
// 		if (json.upStatus != 7) {
// 		    location.href = "Progress.asp";
// 		}
// 	    }
// 	}
//     }
// }
/*********************************************************************************************/
    
    function doProgress() { 
		if (demoi >= 100) { 
		    $.ajax({
				url:"/goform/formAutoUpdateFirmware",
				cache:false,
				success: function(rsp){
				    if (rsp) {
						location.href = rsp;
				    }
				},

				error:function(data){
				}
		    });
		    return; 
		} 
		if (demoi < 100) { 
		    setTimeout(function(){doProgress();}, 1000); 
		    $.ajax({
				url:"/goform/formSoftDownload",
				cache:false,
				async:false,
				dataType:"json",
				success: function(rsp){
					eval(rsp);
				    if(datas){
					if (datas.isError == 1) {
					    console.log('加载提示');
					} else if (datas.isError == 2) {
					    console.log('加载错误提示');
					} else {
					    // setProgress(datas.ratio); 
					    demoi = datas.ratio; 
					    if (demoi == 100) {
							console.log('加载完成提示');
					    }
					}
				    }
				},

				error:function(data){
				
				}
		    });
		} 
	} 
/*********************************************************************************************/


	/*
	 * 获得表单组
	 */
	function getInputDoms(){
  	console.log("######################");
  	console.log(DATA["rn"]);
  	console.log("######################");		
		//获得页面数据
		var data = {};
		data.hardwareVersion =DATA['updata'][0][1];
		data.softwareVersion1=DATA['updata'][0][0];
		//制作表单
		var inputList = [
			{
				"prevWord": tl('hardVer'),
				"disabled"	 : true,
				"inputData": {
					"type"       : 'text',
					"name"       : 'hardwareVersion',
					"value"		 : data.hardwareVersion||'V3.0',
					//"value"		 : hardwareVersion ||'V3.0',
				},
				"afterWord": ''
			},
			{
				"prevWord": tl('solftVer'),
				"disabled"	 : true,
				"inputData": {
					"type"       : 'text',
					"name"       : 'softwareVersion1',
					"value"		 : data.softwareVersion1||tl('solftUpdateTip10'),
				},
				"afterWord": ''
			},
			{
				"prevWord": tl('manualUpdate'),
				"inputData": {
					"type"       : 'text',
					"name"       : 'handOn',
					"value"		 : '',
				},
				"afterWord": ''
			},
			{
				"prevWord": tl('rebootAfterUpdate'),
				"disabled":true,
				"inputData": {
					"type"       : 'checkbox',
					"name"       : 'reBootOnPage',
					"defaultValue": 'on',
					"items"		:[
						{
							"name":'',
							"value":'on'
						}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '',
				"display":false,
				"inputData": {
					"type"       : 'text',
					"name"       : 'reBoot',
					"value"		 : 'on',
				},
				"afterWord": ''
			}
		];
		var IG = require('InputGroup');
		var $idom = IG.getDom(inputList);
		 
		// 修改硬件版本字体样式
		var thisHardVersion = $idom.find('[name="hardwareVersion"]').val();
		$idom.find('[name="hardwareVersion"]').after('<b>'+thisHardVersion+'</b>');
		$idom.find('[name="hardwareVersion"]').remove();
		
		// 添加其他元素
		var str1 = '<input type="file" name="updatesoftware" class="btn-sm btn-primary u-hide" /><button class="btn-sm btn-primary" id="handOnChange">'+tl('selectFile')+'</button><input type="text" name="filename" style="margin-left:10px"/>';
		var str2 = '<button type="button" id="update" class="btn-sm btn-primary" style="margin-left:10px">'+tl('solftUpdateTip12')+'</button>';
		$idom.find('[name="handOn"]').after(str1,str2);
		$idom.find('[name="handOn"]').parent().attr('colspan','2');
		$idom.find('[name="handOn"]').remove();
		$idom.find('[name="filename"]').attr({'placeholder':'（暂未选择文件）','readonly':'true'});
		
		$idom.find('#handOnChange').click(function(){
			$idom.find('[name="updatesoftware"]').click();
			return false;
		});
		$idom.find('[name="updatesoftware"]').change(function(){
			var thisval = $(this).val();

			$idom.find('[name="filename"]').val(thisval.substr(thisval.lastIndexOf('\\')+1));

		});

		var bottomStr = "<span><a class='u-inputLink' id='downlordLast'></a></span><br>"+
						"<span></span><br>"+
						"<span></span>";
		/*var bottomStr = "<span>"+tl('singleClick')+"<a class='u-inputLink' id='downlordLast'>"+tl('solftUpdateTip1')+"</a>"+tl('solftUpdateTip2')+"</span><br>"+
						"<span>"+tl('solftUpdateTip3')+"</span><br>"+
						"<span>"+tl('solftUpdateTip4')+"</span>";*/
		var bottom = "<tr><td colspan='3' style='line-height:29px;padding:30px 10px 10px 10px;'>"+bottomStr+"</td></tr>";
		$idom.find('tbody').append(bottom);
		//判断是否有新版本
		$idom.find('[name="softwareVersion1"]').css('display','none').after('<span>'+$idom.find('[name="softwareVersion1"]').val()+'</span>');
		$idom.find('[name="softwareVersion1"]').parent().css({height:'30px'});
		function makeTheVersionChange(){
			
			var sdst = DATA["updateStatus"];
			console.log('for now is [State '+sdst+']');
			
					if(sdst == 0 || sdst == 1){
						// 检测中
						var after1 = '<span>'+'</span>';
						$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
						
						setTimeout(function(){
							DATA["manualCheck"] = 0;
							DATA["updateStatus"] = '';
							checkTheVersion();
							intervalCheckState();
						},5000); 
					}else if(sdst == 2){
						// 检测失败
						
			/*			var after1 = '<span>'+tl('solftUpdateTip6')+'</span><button type="button" class="btn-sm btn-primary" id="hand_check" style="margin-left:10px" >'+tl('solftUpdateTip7')+'</button>'; */
						$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
						$idom.find('#hand_check').click(function(){
							DATA["manualCheck"]= 1;
							var after1 = '<span>'+'</span>';
							$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
							DATA["updateStatus"] = '';
							checkTheVersion();
							intervalCheckState();
						});
					}else if(sdst == 3){
						var after1 = '<span>'+'</span>';
						$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
						if(DATA["updateStatus"]){
							var after1 = '<span>'+'</span>';
							$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
						}else{
							var after1 = '<span>'+'</span>';
							$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
						}
					}else if(sdst == 4 || sdst == 5 || sdst == 6){
						var stSvBt = DATA["st"] + DATA["sv"]+'-'+DATA["bt"]
						var after1 = '<span style="color:#ED122F">'+tl('solftUpdateTip9')+'</span> <span>'+(stSvBt||tl('solftUpdateTip10'))+'</span> <button type="button" class="btn-sm btn-primary" id="onkeyUp1" style="margin-left:10px">'+tl('solftUpdateTip11')+'</button><button type="button" class="btn-sm btn-primary" id="readme1" style="margin-left:10px">'+tl('imprint')+'</button>';
						$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
						var tips= require("Tips");
						//一键升级
						$idom.find('#onkeyUp1').click(function(){
							
							$.ajax({
								url: '/goform/formSoftUpdate?appType=SOFT_UDTYPE',
								type: 'GET',
								success: function(result) {
									eval(result);
									if(datas.upStatus != 7){
										doProgress();
									}									
								}
							});
						});
						//版本说明
						$idom.find('#readme1').click(function(){
							var mdlst = {
								id:"readme-modal",
								title:tl('imprint'),
								btns:[]
							};
							var modal = require('Modal');
							var modalObj = modal.getModalObj(mdlst);
							var rn = ''
							if(DATA["rn"] != undefined){
								rn = DATA["rn"].replace(new RegExp("\r\n","g"),'</br>');
							}
							var innerStr = '<p>'+rn+'</p><div> <a class="u-inputLink" id="downlordLast2">'+tl('solftUpdateTip1')+'</a></div>'
							modalObj.insert(innerStr);
							modalObj.getDom().find('#downlordLast2').click(function(){
								window.open(DATA.updata[0][2]);
							});
							modalObj.show();
						});
					}else if(sdst == 8){
						var after1 = '<span>'+'升级失败'+'</span>';
						$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
					}else{
						// var after1 = '<span>更新失败</span>';
						var after1 = '<span>'+tl('solftUpdateTip13')+'</span>';
						$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
					}
					// if(true){
					// 	var after2 = '<span style="color:#ED122F">有新版本</span> <span>'+(data.banben1||'未知版本2')+'</span> <button type="button" class="btn-sm btn-primary" id="onkeyUp2" style="margin-left:10px">一键升级</button><button type="button" class="btn-sm btn-primary" id="readme2" style="margin-left:10px">版本说明</button>';
					// 	$idom.find('[name="softwareVersion2"]').parent().next().append(after2);
					// }
					
				}
		// 开始循环监听
		function intervalCheckState(){
			DATA.VersionInterval = setInterval(function(){
				if(DATA["updateStatus"] !== undefined && DATA["updateStatus"] !== ''){
					clearInterval(DATA.VersionInterval);
					makeTheVersionChange();
				}
			},1000);
		}
		var after1 = '<span>'+'</span>';
		$idom.find('[name="softwareVersion1"]').parent().next().empty().append(after1);
		intervalCheckState();
		$idom.find('tbody').append('<tr style="display:none"><td><input type="submit" id="submit"/></td></tr>');	
		
		return $idom;		
	}
	
	
	
	function setClickFunction($dom){
		// $dom.find('#onkeyUp1').click(function(){
		// 	//一键升级
		// 	alert('暂时不测')
		// 	//autoUpdate();
		// });
		$dom.find('#downlordLast').click(function(){
			window.open(DATA.updata[0][2]);
		});
		$dom.find('#update').click(function($this){
			var tp = require('Tips');
			if(!$('[name="filename"]').val()){
				tp.showInfo('请选择要上传的文件');
				return false;
			}		
			
			var thisfilename = $dom.find('[name="filename"]').val();
			/*
			if(/.*[\u4e00-\u9fa5]+.*$/.test(thisfilename)) 
			{ 
				require('Tips').showWarning(tl('fileNameCanBeChinese')); 
				return false; 
			}			
			*/
			
			tp.showConfirm(tl('rebootTips'),function(){
				 var waits = require('Tips').showWaiting('版本文件上传中，请勿给AC断电');
				 var formData = new FormData($( "#iframe1" )[0]);  
			     $.ajax({  
			          url: '/goform/UpdateFirmware' ,  
			          type: 'POST',  
			          data: formData,   
			          cache: false,  
			          contentType: false,  
			          processData: false,  
						success: function(result) {
							waits.remove();
							var Tips = require('Tips');
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
									var thisip = '';
									var timer = Tips.showTimer(tl('cannotOperateUntilUpdateDone'),90,function(){
										window.location = thisip;
									});
									var signstr = false;
									var setin1;
									setTimeout(function(){
										setin1 = setInterval(function(){
											$.ajax({
												url: '/common.asp?optType=lan',
												type: 'get',
												success: function(result) {
													eval(result);
													if(lanIp){
														thisip = lanIp;
														signstr = true;
													}
												}
											});
										},1000);
									},15000)
									var setin2 = setInterval(function(){
										if(signstr){
											clearInterval(setin1);
											clearInterval(setin2);
											timer.stop(true);
										}
									},500);
								} else {
									var errorstr=data.errorstr;
									if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
										Tips.showError('{fileIsNullNeedReselectFile}');
									}else{
										Tips.showWarning(errorstr);
									}									
								}
							} else {
								Tips.showWarning('{parseStrErr}');
							}
						}
			     });  
			});
		});
	}
  function processData(jsStr) {
    // 加载Eval模块
    var doEval = require('Eval');
    var Tips = require('Tips');
    var codeStr = jsStr,
      // 定义需要获得的变量
      variableArr = ['revisions', 'hardwareID', 'ProductLinkID'];
    // 获得js字符串执行后的结果
    var result = doEval.doEval(codeStr, variableArr),
      isSuccess = result["isSuccessful"];
    // 判断代码字符串执行是否成功
    if (isSuccess) {
      // 获得所有的变量
      var data = result["data"];
      // 将返回的JS代码执行所生成的变量进行复制
      //var titleArr = data["titles1"], // 表格头部的标题列表
      var revisions = data["revisions"],
        hardwareID = data["hardwareID"];
        ProductLinkID = data["ProductLinkID"];
      // 返回处理好的数据
      var updateData = [
        [revisions,hardwareID, ProductLinkID],
      ];
      return {
        updateData: updateData,
      };
    } else {
      Tips.showError('{parseStrErr}}');
    }
  }
	function display($container) {


	    $.ajax({
	      url: 'common.asp?optType=update',
	      type: 'GET',
	      success: function(result1) {
	      	DATA["ver"]='';
	      	DATA["ckv"]='';
	      	DATA["ckc"]='';
	      	DATA["st"]='';
	      	DATA["sv"]='';
	      	DATA["bt"]='';
	      	DATA["dl"]='';
	      	DATA["rn"]='';
	      	DATA["appType"]='';
	      	checkTheVersion();
	      	
		    
      		var data = processData(result1);
      		 updateData  = data["updateData"];
       		 // 将后台数据处理为数据表格式的数据	
        	DATA['updata']=updateData;  
        	//获取表单dom
			var $idom = getInputDoms();
			//给按钮绑定事件
			setClickFunction($idom);
			$container.empty().append($idom);
			$idom.wrap('<form id="iframe1"  method="post" action="/goform/UpdateFirmware" enctype="multipart/form-data"></form>');
	      }
	    });		

	}
	
	// 检测版本
	function checkTheVersion(){
		$.ajax({
		      url: '/goform/formSoftCheck?appType=SOFT_UDTYPE&action=MANU',
		      type: 'GET',
		      dataType:'text',
		      success: function(res2) {
			      	var evals = require('Eval');
			      	var result2 = evals.doEval(res2,['datas'])['data']['datas'];
			      	DATA["ver"]=result2.ver;
			      	DATA["ckv"]=result2.ckv;
			      	DATA["ckc"]=result2.ckc;
			      	DATA["st"]=result2.st;
			      	DATA["sv"]=result2.sv;
			      	DATA["bt"]=result2.bt;
			      	DATA["dl"]=result2.dl;
			      	DATA["rn"]=result2.rn;
			      	DATA["appType"]=result2.appType;

			      	DATA["updateStatus"] = result2.updateStatus.toString();/*升级状态*/
			    
			      },
			      error:function(haha){
			      	 console.log(haha);
			      }
			    });
	}
	
	// 提供对外接口
	module.exports = {

		display: display
	};
});
