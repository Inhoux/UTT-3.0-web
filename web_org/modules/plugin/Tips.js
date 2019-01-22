/**
 * 页面提示信息小框
 * @author	QC
 * @date	2016-9-8
 *
 */
define(function(require, exports, module){
	require('jquery');
	
	/*存储页面已经显示的词条*/
	var showTipsWordJsonr = {};
	
	
	function showInfo(){
		var tdata = dealData(arguments);
		tdata[2] = "info";
		setTipAnimate(tdata);
	}
	function showSuccess(infoStr,time){
		var tdata = dealData(arguments);
		tdata[2] = "success";
		setTipAnimate(tdata);
	}
	function showWarning(infoStr,time){
		var tdata = dealData(arguments);
		tdata[2] = "warn";
		setTipAnimate(tdata);
	}
	function showError(infoStr,time){
		var tdata = dealData(arguments);
		tdata[2] = "error";
		setTipAnimate(tdata);
	}
	/*根据传值修改参数数组*/
	function dealData(argu){
		var arr = Array.prototype.slice.call(argu);
				var d = [];
				d[0] = String(arr[0]);
				if(arr.length == 3){
					d[1] = Number(arr[1]);
					d[3] =  arr[2];
				}else if(arr.length == 2){
					if(Number(arr[1])){
						d[1] = Number(arr[1]);
						d[3] = ['common','error','check'];
						
					}else{
						d[3] =  arr[1];
						d[1] = 3;
					}
				}else if(arr.length == 1){
					d[0] = String(arr[0]);
					d[1] = 3;
					d[3] = ['common','error','check'];
				}
				return d;
	}

		//tip提示框
	function setTipAnimate(tipData){
		if(tipData !== undefined && tipData[0] !== undefined){
			if(showTipsWordJsonr[tipData[0]]){
				return ;
			}else{
				var $bodyTips = $('[tip-sign]');
				$bodyTips.each(function(){
					var $t = $(this);
					showTipsWordJsonr[$t.children('p').attr('data-local')] = false;
					$t.addClass('tips-show-out');
					setTimeout(function(){
						$t.remove();
					},399);
				});
			}
		}
		
		var infoStr = tipData[0],
			time = (tipData[1] < 3?3:tipData[1])* 1000,
			type = tipData[2];
		var infoHTML = '<div class="pageTip-'+type+'" tip-sign="'+type+'"><p data-local="'+infoStr+'">'+infoStr+'</p></div>';
		var $info = $(infoHTML);
		showTipsWordJsonr[infoStr] = true;
		require('Translate').translate([$info],['tips','common','check','error']);

		$('body').append($info);
			//动画部分
		var timer1 = setTimeout(function(){
			$info.addClass('tips-show-in');
		},1);
		var timer1 = setTimeout(function(){
			$info.addClass('tips-show-out');
			showTipsWordJsonr[infoStr] = false;
		},time-401);
		var timer2 = setTimeout(function(){
			$info.remove();
		}, time);
	}
		//确认框 (提示信息，点击确认的回调函数，点击取消的回调函数)
	function showConfirm (infoStr,ok_function,no_function,dictionary){
		var infoStr = String(infoStr);
		var cfmbox = '<div class="u-cfm-cover">'+
						'<div class="u-cfm-bg" id="u-cfm-bg"></div>'+
						'<div class="u-cfm-box">'+
							infoStr+
							'<span id="u-cfm-nox">×</span>'+
							'<button id="u-cfm-ok" class="btn btn-danger" data-local="{confirm}">{confirm}</button>'+
							'<button id="u-cfm-no" class="btn btn-primary" data-local="{cancel}">{cancel}</button>'+
						'</div>'+
					 '</div>';
		var $cfm = $(cfmbox);
		require('Translate').translate([$cfm], ['tips','common','check','error']);
		$('body').append($cfm);
		//动画部分
		var timer1 = setTimeout(function(){
			$cfm.addClass('cfm-show-in');
		},1);
		
		$cfm.find('#u-cfm-ok').click(function(){
			if(ok_function && typeof ok_function == "function"){
				ok_function();
			}
			cfm_close($cfm);
		});
		$cfm.find('#u-cfm-no,#u-cfm-nox').click(function(){
			if(no_function && typeof no_function == "function"){
				no_function();
			}
			cfm_close($cfm);
		});
		
		//点击背景提示处于抉择状态		
		var focusboxshadow = true;
		$cfm.find('#u-cfm-bg').click(function(){
			if(focusboxshadow){
				focusboxshadow = false;
				var t = $(this).next();
				t.addClass('cfm-animate');
				setTimeout(function(){
					t.removeClass('cfm-animate');
					focusboxshadow = true;
				},1001);
			}
		})
		//抉择框的关闭
		function cfm_close($cfm){
				$cfm.removeClass('cfm-show-in');
			var timer2 = setTimeout(function(){
				$cfm.remove();
			}, 201);
		}
	}
	
	/**
	 * 倒计时框
	 */
	function showTimer(){
		var agarr = Array.prototype.slice.call(arguments);
		var Timer ={
				timerStr : '',  //提示文字
				timerSec : '',  //倒计时时间
				timerFunc:function(){},  //倒计时结束时的回调函数
				stop:function(){}
		}
		if(agarr.length == 3){
			Timer.timerStr = String(agarr[0]);
			Timer.timerSec = Math.round(parseInt(agarr[1]));
			Timer.timerFunc = agarr[2];
		}else if(agarr.length == 2){
			Timer.timerStr = String(agarr[0]);
			Timer.timerSec = Math.round(parseInt(agarr[1]));
		}

		var timerdiv = '<div class="u-tim-cover">'+
						'<div class="u-tim-bg""></div>'+
						'<div class="u-tim-box">'+
							'<div class="u-tim-str"  data-local="'+Timer.timerStr+'">'+Timer.timerStr+'</div>'+
							'<div class="u-tim-sec"><div  class="u-tim-nn"><span data-local="{}">剩余时间为</span><span id="time">'+Timer.timerSec+'</span><span data-local="{}">秒</span></div></div>'+
						'</div>'+
					 '</div>';
		var $tdiv = $(timerdiv);	
		
		require('Translate').translate([$tdiv], ['tips','common','error','check']);
		var timespan = $tdiv.find('#time');

		var thisitv = setInterval(function(){
			if(Number(timespan.text()) <=0){
				clearInterval(thisitv);
				Timer.timerFunc();
				$tdiv.addClass('tim-show-out');
				setTimeout(function(){
					$tdiv.remove();
				},201);
			}else{
				timespan.text(Number(timespan.text())-1);
			}
		},1000);
		require('Translate').translate([$tdiv], ['tips','common','error','check']);
		$('body').append($tdiv);
		
		//动画部分
		var timer1 = setTimeout(function(){
			$tdiv.addClass('tim-show-in');
		},1);
		//提前停止倒计时
		Timer.stop = function(takeFuncFlag){
			var timeflag = (takeFuncFlag === undefined?false:takeFuncFlag);
			if(timeflag){
				Timer.timerFunc();
			}
			clearInterval(thisitv);
			$tdiv.addClass('tim-show-out');
			setTimeout(function(){
				$tdiv.remove();
			},201);
		}
		return Timer;
		
	}
	
	/*
	 	等待中 弹出框
	 * */
	function showWaiting(str){
		var waitObj = {
			msg : str === undefined?'数据处理中':str,
			remove : function(){}
		}
		
		var waitdiv = '<div class="u-tim-cover">'+
						'<div class="u-tim-bg""></div>'+
						'<div class="u-tim-box">'+
							'<div class="u-tim-str"  data-local="'+waitObj.msg+'">'+waitObj.msg+'</div>'+
						'</div>'+
					 '</div>';
		var $tdiv = $(waitdiv);	
		
		$('body').append($tdiv);
		
		require('Translate').translate([$tdiv], ['tips','common','error','check']);
				
		//动画部分
		var timer1 = setTimeout(function(){
			$tdiv.addClass('tim-show-in');
		},1);
		//提前停止倒计时
		waitObj.remove = function(){
			$tdiv.addClass('tim-show-out');
			setTimeout(function(){
				$tdiv.remove();
			},201);
		}
		return waitObj;
	}
	
	/**
	 * 展示修改密码框
	 */
	
	function showModifyPassword(thisData){
		var Translate  = require('Translate');
		var dicArr     = ['common','doNetworkManagementStrategy'];
		function T(_str){
			return Translate.getValue(_str, dicArr);
		}
		
		
		var config = {
			content  : /*'{SuggestModifyPassword}'*/'检测到您的登录密码为默认密码，强烈建议您修改密码！',
			btnSure  : /*'{sureToModify}'*/'立即修改',
			sureFunc : function($this){	
				forAjax($this);
			},
			cancelFunc : function($this){
				forAjax($this,true);
			}
		}
		
		function forAjax($this,nomidify){
			
			var pStr="";
			var urlstr = "";
			if(nomidify){
				urlstr = '/goform/cancel';
				pStr="promptflag=1";
			}else{
				urlstr = '/goform/formUser';
				var $thismodal = $this.parents('.u-cfm-cover');
	        	if(require('InputGroup').checkErr($thismodal)>0){
	        		return false;
	        	}
	        	var Serialize = require('Serialize');
	        	var queryArr = Serialize.getQueryArrs($thismodal);
	        	var queryJson = Serialize.queryArrsToJson(queryArr);
	        	pStr="Action=edit"+
        	         "&username="+thisData.username+
        	         "&usernameold="+thisData.username+
        	         "&passwd1="+queryJson.passwd1+
        	         "&passwd2="+queryJson.passwd2+
        	         "&role="+thisData.role+
        	         "&prompt="+thisData.prompt;
			}
//      	
//      	var pStr="Action=edit"+
//      	         "&username="+thisData.username+
//      	         "&usernameold="+thisData.username+
//      	         "&passwd1="+queryJson.passwd1+
//      	         "&passwd2="+queryJson.passwd2+
//      	         "&role="+thisData.role+
//      	         "&prompt="+thisData.prompt;
        	
        	$.ajax({
				url: urlstr,
				type: 'POST',
				data: pStr,
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
							
							if(!nomidify){
								showSuccess(T("saveSuccess"), 2);
								setTimeout(function(){
									window.location.reload();
								},1000);
							}
							
						} else {
							var errorStr = data['errorstr'];
							showWarning(T("saveFail") + errorStr, 2);
						}
					} else {
						showWarning(T('netErr'), 2);
					}
				}
			});
        
		}
		
		
		var infoStr = String(infoStr);
		var cfmbox = '<div class="u-cfm-cover">'+
						'<div class="u-cfm-bg" id="u-cfm-bg"></div>'+
						'<div class="u-cfm-box" style="width:500px;text-indent:0px;text-align:left">'+
							'<span data-local="'+config.content+'" style="position:absolute;top:40px;left:75px">'+config.content+'</span>'+
							'<span id="u-cfm-nox">×</span>'+
							'<button id="u-cfm-demo" class="btn btn-demo" style="right:85px" data-local="'+config.btnSure+'">'+config.btnSure+'</button>'+
							'<button id="u-cfm-demono" class="btn btn-primary" style="right:30px" data-local="{cancel}">{cancel}</button>'+
						'</div>'+
					 '</div>';
		var $cfm = $(cfmbox);
		var inputList = [
			{
			    "display" : true,  //是否显示：否
			    "necessary": true,  //是否添加红色星标：是
			    "prevWord": '{pwd}',
			    "inputData": {
			        "type"       : 'password',
			        "name"       : 'passwd1',
			        "value"		 : '',
			       	"checkDemoFunc" : ['checkName','1','31','noSysName'] 
			    },

			},
			{
			
			    "display" : true,  //是否显示：否
			    "necessary": true,  //是否添加红色星标：是
			    "prevWord": '{confirmpwd}',
			    "inputData": {
			        "type"       : 'password',
			        "name"       : 'passwd2',
			        "value"		 : '',
			       	"checkDemoFunc" : ['checkPass','passwd1'] 
			    },

			}
		];
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList).css({marginTop:'40px',marginLeft:'100px'});
		$cfm.find('.u-cfm-box').append($dom);
		var Translate = require('Translate');
		Translate.preLoadDics(['tips','common','check','error'], function(){
			Translate.translate([$cfm], ['tips','common','check','error']);
		});
		$('body').append($cfm);
		//动画部分
		var timer1 = setTimeout(function(){
			$cfm.addClass('cfm-show-in');
		},1);
		
		$('#u-cfm-demo').click(function(){
			var canclose = config.sureFunc($(this));
			if(canclose){
				cfm_close($cfm);
			}
			
		});
		$('#u-cfm-demono,#u-cfm-nox').click(function(){
			config.cancelFunc($(this));
			cfm_close($cfm);
		});
		
		//点击背景提示处于抉择状态		
		var focusboxshadow = true;
		$('#u-cfm-bg').click(function(){
			if(focusboxshadow){
				focusboxshadow = false;
				var t = $(this).next();
				t.addClass('cfm-animate');
				setTimeout(function(){
					t.removeClass('cfm-animate');
					focusboxshadow = true;
				},1001);
			}
		})
		//抉择框的关闭
		function cfm_close($cfm){
				$cfm.removeClass('cfm-show-in');
			var timer2 = setTimeout(function(){
				$cfm.remove();
			}, 201);
		}
	}
	
	/**
	 * 展示Licensing弹窗
	 */
	function showProductLicensing(){
		$.ajax({
	      url: 'common.asp?optType=license',
	      type: 'GET',
	      success: function(result) {
	      		processData(result);
	      		
		   	function getInputs(data){
			   		
				var inputlist = [
					{
						"prevWord": '您的产品License有效期为',
						"inputData": {
							"type"       : 'text',
							"name"       : 'yxq',
						}
					},
					{
						"prevWord": '当前产品授权登记信息',
						"inputData": {
							"type"       : 'text',
							"name"       : 'djxx',
						}
					},
					{
						"prevWord": '产品型号',
						"inputData": {
							"type"       : 'text',
							"name"       : 'cpxx',
						}
					},
					{
						"prevWord": '序列号',
						"inputData": {
							"type"       : 'text',
							"name"       : 'xlh',
						}
					},
					{
						"prevWord": '授权登记客户信息',
						"inputData": {
							"type"       : 'text',
							"name"       : 'khxx',
						}
					},
					{
						"prevWord": '授权登记IP地址',
						"inputData": {
							"type"       : 'text',
							"name"       : 'ipdz',
						}
					},
					{
						"prevWord": '授权登记MAC地址',
						"inputData": {
							"type"       : 'text',
							"name"       : 'macdz',
						}
					},
					{
						"prevWord": '导入License',
						"inputData": {
							"type"       : 'text',
							"name"       : 'drl',
						}
					},
					{
						"prevWord": '请选择License文件',
						"inputData": {
							"type"       : 'text',
							"name"       : 'chooseFile',
						}
					},
					{
						"prevWord": '使用提示',
						"inputData": {
							"type"       : 'text',
							"name"       : 'ssts',
						}
					},
					{
						"prevWord": '',
						"inputData": {
							"type"       : 'text',
							"name"       : 'texts',
						}
					}
				];
				var IG = require('InputGroup');
				var $dom = IG.getDom(inputlist);
				
				// 增加小组件
				// 判断显示有效期
				var $alltime  = $('<span style="color:#0A76E0;font-weight:bold"></span>');
				var $outofdate = $('<span style="color:#0A76E0;font-weight:bold"></span>');
				var $timeleft = $('<span style="font-weight:bold"></span>');
				var $timelefthour = $('<span style="color:#0A76E0;font-weight:bold"></span>');
					if(data.isForver == 1) {
						$alltime.text('永久')
					} else {
						if(data.isOutDate == 1 || data.remaintime<=0) {
							$alltime.text(data.impowertime +'月 ');
							$outofdate.text('已过期 ');
							$timeleft.text('请重新导入License文件 否则无法访问其他页面 ');
						} else {
							$alltime.text(data.impowertime +'月 ');
							$outofdate.text('未过期 ');
							$timeleft.text('剩余时间：  ');
							$timelefthour.text(Math.ceil(data.remaintime/24)+'天 ');
						}
					}
		
					
				v('yxq').parent().prev().attr('colspan','3').append($alltime,$outofdate,$timeleft,$timelefthour).children().css('font-weight','bold');
				v('yxq').parent().next().remove();
				v('yxq').parent().remove();
				
				v('djxx').parent().prev().attr('colspan','3').children().css({fontWeight:'bold'});
				v('djxx').parent().next().remove();
				v('djxx').parent().remove();
				var model = data.ProductID;
				v('cpxx').after(model).parent().prev().css({paddingLeft:'50px'});
				//v('cpxx').after('网安™ 5830G').parent().prev().css({paddingLeft:'50px'});
				v('cpxx').remove();
				var sn = data.productIDs;//序列号
				v('xlh').after(sn).parent().prev().css({paddingLeft:'50px'});
				v('xlh').remove();
				
				var userinformation = data.userinfo;//用户信息
				if(data.includeuser == 1){
					v('khxx').after(userinformation).parent().prev().css({paddingLeft:'50px'});
					v('khxx').remove();
				}else{
					v('khxx').parent().parent().remove();
				}
				
				var ipaddr = data.ip;//ip
				if(data.includeip == 1){
					v('ipdz').after(ipaddr).parent().prev().css({paddingLeft:'50px'});
					v('ipdz').remove();
				}else{
					v('ipdz').parent().parent().remove();
				}
				
				
				var macaddr =data.mac;//mac
				if(data.includemac == 1){
					v('macdz').after(macaddr).parent().prev().css({paddingLeft:'50px'});
					v('macdz').remove();
				}else{
					v('macdz').parent().parent().remove();
				}
				
				
				v('drl').parent().prev().attr('colspan','3').children().css({fontWeight:'bold'});
				v('drl').parent().next().remove();
				v('drl').parent().remove();
				
				v('chooseFile').before('<button class="btn-sm btn-primary" data-local="选择文件" type="button" id="chooseFile" style="margin-right:10px">选择文件</button>').parent().prev().css({paddingLeft:'50px'});
		
				$dom.find('#chooseFile').after('<input type="file" id="updatesoftware" name="updatesoftware" class="btn-sm btn-primary u-hide" />');
				$dom.find('#chooseFile').after('<input type="text" name="filename" id="filename" value="license" class="u-hide" />');
				
				//选择文件模拟点击
				$dom.find('#chooseFile').click(function(){
					$dom.find('#updatesoftware').click();
				});
				var $innerinputfile = $dom.find('#updatesoftware');
				$innerinputfile.change(function(){
					var  t = $(this);
					var ival = t.val();
					$dom.find('[name="chooseFile"]').val(ival.substr(ival.lastIndexOf('\\')+1))
					// $dom.find('[name="filename"]').val(ival.substr(ival.lastIndexOf('\\')+1))
				});
		
		
				v('ssts').parent().prev().attr('colspan','3').children().css({fontWeight:'bold'});
				v('ssts').parent().next().remove();
				v('ssts').parent().remove();
				
				v('texts').parent().prev().attr('colspan','3').css({'max-width':'100px','white-space':' normal','padding-left':'55px'}).append('<p>初始的License许可文件，自设备首次运行之日起提供累计720小时（30天）的完整权限，超出有效期后您在登录设备时仅能访问电子授权页面，请及时从提供您设备的经销商处获取正式的License许可文件。</p>');
				v('texts').parent().next().remove();
				v('texts').parent().remove();
				
				var btns = [
					{
						id : 'innerput',
						name : '导入',
						clickFunc :function($thisDom){
							if($dom.find('#updatesoftware').val()==''){
								showWarning('尚未选择导入的文件',3);
							}else{
								showConfirm('注意：如果配置文件不正确，将导致现有配置被清空,建议先保存现有配置。您确定要继续吗？',function(){
									 var waits = showWaiting('文件上传中');
									 var fdom = $thisDom.parents('#u-cfm-box').find('#iframe1')[0];
									 var formData = new FormData(fdom);  
								     $.ajax({
								          url: '/goform/UpdateLicenseFile' ,  
								          type: 'POST',  
								          data: formData,   
								          cache: false,  
								          contentType: false,  
								          processData: false,  
											success: function(result) {
												waits.remove();
												var doEval = require('Eval');
												var codeStr = result,
													variableArr = ['status', 'errorstr'],
													result = doEval.doEval(codeStr, variableArr);
												// 判断代码字符串执行是否成功
												var data = result["data"],
													status = data['status'];
												if (status) {
													window.location.reload();
												} else {
													var errorstr=data.errorstr;
													if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
														showError('{fileIsNullNeedReselectFile}');
													}else{
														showWarning(errorstr);
													}									
												}
											}
								     });  
								})
							
							}
						}
					}
				];
				IG.insertBtn($dom,'chooseFile',btns);
				return $dom;
				
				function v(name){
					return $dom.find('[name="'+name+'"]');
				}
			
		   	}
			function processData(jsStr) {
			    // 加载Eval模块
			    var doEval = require('Eval');
			    var codeStr = jsStr,
			      // 定义需要获得的变量
			    variableArr = [
			    	'impowertime', 
			    	'productIDs', 
			    	'ProductID',
			    	'userinfo',
			    	'ip',
			    	'mac',
			    	'remaintime',
			    	'isForver',
			    	'isOutDate',
			    	'includeuser',
			    	'includeip',
			    	'includemac' 
			    	];
			    // 获得js字符串执行后的结果
			    var result = doEval.doEval(codeStr, variableArr),
			      isSuccess = result["isSuccessful"];
			    // 判断代码字符串执行是否成功
			    if (isSuccess) {
			      // 获得所有的变量
			      var data = result["data"];
			      // 将返回的JS代码执行所生成的变量进行复制
			      //var titleArr = data["titles1"], // 表格头部的标题列表
			      var licenseData = {
				        impowertime : data["impowertime"], // 总月数
				        ProductID   : data["ProductID"],  
				        productIDs  : data["productIDs"], 
				        userinfo    : data["userinfo"], 
				        ip          : data["ip"], 
				        mac         : data["mac"],
				        remaintime  : data["remaintime"], // 剩余小时
				        isForver    : data["isForver"], // 永久?
				        isOutDate   : data["isOutDate"], // 是否过期
				        includeuser : data["includeuser"], // 是否显示客户信息
				        includeip   : data["includeip"], // 是否显示ip
				        includemac  : data["includemac"] // 是否显示mac
			        };
			      if((licenseData.isOutDate != 1 && licenseData.impowertime != 0 ) || (licenseData.isForver == 1)){
			      	return ;
			      }
			      
			        var cfmbox = '<div class="u-cfm-cover">'+
									'<div class="u-cfm-bg" id="u-cfm-bg"></div>'+
									'<div class="u-cfm-box" id="u-cfm-box" style="width:700px;min-height:150px">'+
									'</div>'+
								 '</div>';
					var $cfm = $(cfmbox);
					
					$('body').append($cfm);
					//动画部分
					var timer1 = setTimeout(function(){
						$cfm.addClass('cfm-show-in');
					},1);
			      	var $inputs = getInputs(licenseData); 
					$cfm.find('#u-cfm-box').append('<form id="iframe1"  method="post"  action="/goform/UpdateLicenseFile" enctype="multipart/form-data"></form>');
					$cfm.find('#iframe1').append($inputs);
			    } else {
			      showError('{parseStrErr}}');
			    }
			}
			}
	    });	
	}
	
	module.exports = {
		showInfo    : showInfo ,
		showSuccess : showSuccess ,
		showWarning : showWarning ,
		showError   : showError ,
		showConfirm : showConfirm ,
		showTimer	: showTimer ,
		showWaiting : showWaiting ,
		showModifyPassword : showModifyPassword ,
		showProductLicensing : showProductLicensing
	};
});
