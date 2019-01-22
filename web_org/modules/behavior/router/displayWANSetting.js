define(function(require, exports, module) {
	/*
	 * 全局设置
	 */
	var DATA = {};
	var config = require('P_config/config');
	var Translate  = require('Translate');
		var dicArr     = ['common','doWANConfig','tips'];
		function T(_str){
			return Translate.getValue(_str, dicArr);
		}
	function displayInputs($con) {
		var inputList = [{
				"inputData": {
					"type": 'title',
					"name": '{wanNum}'
				}
			}, {
				"prevWord": '{wanNum}',
				"inputData": {
					"count":DATA["maxwanCount"],
					"defaultValue": DATA["wanCount"], 
					"type": 'select',
					"name": 'PortNumber',
					"items": [{
						"value": '1',
						"name": '1',
					},{
						"value": '2',
						"name": '2',
					},{
						"value": '3',
						"name": '3',
					},{
						"value": '4',
						"name": '4',
					} ]
				},
				"afterWord": ''
			}, {
				"inputData": {
					"type": 'title',
					"name": '{balanceMode}'
				}
			}, {
				"prevWord": '{InLoadBalance}',
					"display": false,
				"inputData": {
					"defaultValue" : DATA['MultiPath']['DualTypes'], 
					"type": 'radio',
					"name": 'DualType',
					"items": [{
						"value": 'balance',
                        "name": '{open}',
					}, {
						"value": 'backup',
						"name": '{close}'
					}, ]
				},
				"afterWord": ''
			}, {
				"prevWord": '{IdentifyBind}',
				"inputData": {
					"defaultValue" : DATA['MultiPath']['IdentifyBindEnables'], 
					"type": 'radio',
					"name": 'IdentifyBindEnable',
					"items": [{
						"value": '1',
						"name": '{open}',
					}, {
						"value": '0',
						"name": '{close}'
					}, ]
				},
				"afterWord": ''
			},  {
				"inputData": {
					"type": 'title',
					"name": '{lineDetection}'
				}
			}
		];
		
		var wans ="<tr><td></td><td colspan='3'><span style='margin-right:37px' data-local='{detectInterval}'></span><span style='margin-right:37px' data-local='{detectTimes}({times})'></span><span style='margin-right:12px' data-local=''>带宽选择</span><span style='margin-right:181px' data-local='bandwidth'></span><span data-local='{detectDest}'></span></td></tr>";
		
		RateArr1 = new Array(T("custom"),"512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M", "1000M");
		RateArrValue1 = new Array("","512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000", "1000000");

		var count = (DATA["wanCount"] == 0?'1':DATA["wanCount"]);
		var data=DATA["MultiPath"];
		for(var i=1;i<=count;i++){

				wans += "<tr>"+
							"<td>"+
								"WAN"+i+'<span class="u-necessary" style="margin-left:5px">*</span>'+
							"</td>"+
							"<td colspan='4'>"+
								"<input name='portname"+i+"' value='WAN"+i+"' style='display:none' />"+
								"<input name='KeepLive"+i+"' value='"+data['KeepLives'][i-1]+"' style='width:100px;margin-right:10px' type='text'/>"+
							// "</td>"+
							// "<td>"+
								"<input name='RetryTimes"+i+"' value='"+data['RetryTimess'][i-1]+"' style='width:100px;margin-right:10px' type='text'/>"+
							// "</td>"+
							// "<td>"+
								"<input name='MaxRatetxt"+i+"'value='"+parseInt(data['Weights'][i-1])+"' data-from='choosenRate' style='width:90px;margin-right:10px' type='text'/><span>kbit/s</span>"+
								"<select name='demoselect"+i+"' style='width:90px;margin-right:10px;margin-left:10px' class='choosenRate' >"+
									getRateOptions(RateArr1 ,RateArrValue1 )+
								"</select>"+
							// "</td>"+
							// "<td>"+
								"<select style='width:160px;margin-right:10px' class='choosenIPOrOther' name='PriAddrType"+i+"'>"+
									"<option value='gateway' data-local='{GwIPAddr}'></option>"+
									"<option value='others' data-local='{otherAddr}'></option>"+
								"</select>"+
								"<input name='DestIP"+i+"'value='"+data['DestIPs'][i-1]+"' style='width:118px;margin-right:10px' type='text' />"+
							"</td>"+
						"</tr>";
		
		}
		wans += "<tr><td></td><td colspan='3' data-local='({range1})({range2})' ></td></tr>";
		function getRateOptions(_r,_d){
			var str = '';
			var lengths = _r.length;
			for(var i = 0;i<lengths;i++){
				str += "<option value='"+_d[i]+"'>"+_r[i]+"</option>";
			}
			return str;
		}

		var InputGroup = require('InputGroup');
		var $dom = InputGroup.getDom(inputList);
		$dom.find('tbody').append(wans);
		var dIP=data.DestIPs;
		for(var i = 1;i<=count;i++){
			$dom.find('[name="KeepLive'+i+'"]').checkdemofunc('checkNum','0','60');
			$dom.find('[name="RetryTimes'+i+'"]').checkdemofunc('checkNum','3','1000');
			$dom.find('[name="MaxRatetxt'+i+'"]').checkdemofunc('checkNum','0','1000000');
			$dom.find('[name="DestIP'+i+'"]').checkfuncs('checkIP');
			if(dIP[i-1]!= '0.0.0.0'){
			  	$dom.find('[name="PriAddrType'+i+'"]').find('[value="others"]').attr("selected",true);
			}
		}
		
		var btnGroupList = [
			{
				"id"        : 'save',
				"name"      : '{save}',
				"clickFunc" : function($this){
					editSubmitClick($('#2'));
				}
			},
			{
				"id"        : 'reset',
				"name"      : '{reset}'
			}
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList);
		$btnGroup.addClass('u-btn-group');
		
		$con.empty().append($dom,$btnGroup);
		var Translate  = require('Translate');
		var tranDomArr = [$con];
		var dicArr     = ['common','doWANConfig'];
		Translate.translate(tranDomArr, dicArr);
		//获取WAN口的初始值，
		var dafval = $dom.find('[name="PortNumber"]').val();
		//绑定交互
		$dom.find('[name="PortNumber"]').change(function(){
				var Tips = require('Tips');
				var Serialize = require('Serialize');
				
				var queryArr = Serialize.getQueryArrs($('#2')),
					queryJson = Serialize.queryArrsToJson(queryArr),
					queryStr = Serialize.queryArrsToStr(queryArr);
				// 如果select的值发生改变触发提示框，避免点击重置就触发
				if($(this).val()!=dafval){
					Tips.showConfirm(T("changeWanNumReoot"),delete_ok,delete_no);
				}
					function delete_no(){
						display($('#2'));
					}
				function delete_ok(){
				$.ajax({
					url: '/goform/WanIfCountConfig',
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
								var thisip = '';
                                Tips.showSuccess('{saveSuccess}', 2);
								Tips.showTimer(T('cannotOperateUntilUpdateDone'),90,function(){
										window.location = thisip;
									});
                               reboot();
								
							} else {
								Tips.showWarning('{saveFail}', 2);
							}
						} else {
							Tips.showWarning('{netErr}', 2);
						}
					}
				});
			}
		});
		
		makeTheTestTargetChange();
		$dom.find('.choosenIPOrOther').change(function(){
			makeTheTestTargetChange();
			
		});
		function reboot(){
			
			$.ajax({
			url: '/goform/formRebootMachine',
			type: 'POST',
			data: 'reboot',
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
						Tips.showSuccess('{rebooting}', 60);
						display($('#2'));
						
					} else {
						Tips.showWarning('{rebootFail}', 2);
					}
				} else {
					Tips.showWarning('{netErr}', 2);
				}
			}
		});
		}
		$dom.find('.choosenRate').change(function(){
			var $t = $(this);
			if($t.val()){
				$t.prevAll('input[data-from="choosenRate"]').val($t.val())
				.trigger('focus').trigger('blur');
			}else{
				if(!$t.prevAll('input[data-from="choosenRate"]').val()){
					$t.prevAll('input[data-from="choosenRate"]').val(0)
					.trigger('focus').trigger('blur');
				}
			}
		});
		$dom.find('[data-from="choosenRate"]').focus(function(){
			$(this).attr('oldval',$(this).val());
		})
		$dom.find('[data-from="choosenRate"]').blur(function(){
			if($(this).val() != $(this).attr('oldval')){
				$(this).nextAll('.choosenRate').val('');
			}
			$(this).removeAttr('oldval');
			
		});
	
		
		/*
		 *添加新需求的交互 
		 *2016-11-25
		 */
		$dom.find('[name="PortNumber"]').change(function(){
			makeTheOneChooseHide();
		});
		makeTheOneChooseHide();

		function makeTheOneChooseHide(){
			// if($dom.find('[name="PortNumber"]').val() == 1){
			if(DATA["wanCount"]=='1'){
				$dom.find('[name="DualType"]').parent().parent().prev().prev().nextAll().addClass('u-hide');
			}
		}
		/*自定义WAN口数量*/
		if(config["defwancount"]=='0'){
			$dom.find('[name="PortNumber"]').parent().parent().prev().addClass('u-hide');
			$dom.find('[name="PortNumber"]').parent().parent().addClass('u-hide');
		}

		
		
		function makeTheTestTargetChange(){
			$dom.find('.choosenIPOrOther').each(function(){
				var $t = $(this);
				var vals = $t.val();
				var $n = $t.next();
				switch(vals){
					case 'others':
						$n.removeClass('u-hide');
						break;
					case 'gateway':
						$n.addClass('u-hide');
						break;
					default:
						break;
				}
			});
			
		}
		
	}
	function editSubmitClick($container) {
		var Tips = require('Tips');
		var Serialize = require('Serialize');
		
		var hideErrArr = [];
		for(var i = 1;i<=4;i++){
			if($container.find('[name="KeepLive'+i+'"]').length > 0){
				hideErrArr.push($container.find('[name="MaxRatetxt'+i+'"]'));
			}
		}
		var errnum = require('InputGroup').checkErr($container);
		hideErrArr.forEach(function(obj){
			var $nextobj = obj.next();
			if($nextobj.hasClass('input-error') || $nextobj.hasClass('input-error-fadeout')){
				$nextobj.remove();
				errnum--;
			}
		})
		if (errnum>0){
			
			return;
		}
		
		var queryArr1 = Serialize.getQueryArrs($container);
		var queryJson = Serialize.queryArrsToJson(queryArr1);
		
		if(queryJson.PriAddrType1 == 'gateway'){
			queryJson.DestIP1 = '0.0.0.0';
		}
		if(queryJson.PriAddrType2 == 'gateway'){
			queryJson.DestIP2 = '0.0.0.0';
		}
		if(queryJson.PriAddrType3 == 'gateway'){
			queryJson.DestIP3 = '0.0.0.0';
		}
		if(queryJson.PriAddrType4 == 'gateway'){
			queryJson.DestIP4 = '0.0.0.0';
		}
		if(queryJson.PriAddrType5 == 'gateway'){
			queryJson.DestIP5 = '0.0.0.0';
		}
		
		var queryArr = Serialize.queryJsonToArr(queryJson);
		
		
		var queryStr = Serialize.queryJsonToStr(queryJson);
		//遍历数据将其分类
		var newarr = queryArr.concat();
		var top3arr = [newarr[0],newarr[1],newarr[2]];

		var dualType=[top3arr[1]];
		var IdentifyBindEnable=[top3arr[2]];

		
		var idStr = 'IdentifyBindEnable='+(queryJson.IdentifyBindEnable ==0?'off':'on');
		$.ajax({
					url: '/goform/formIdentifyBind',
					type: 'POST',
					data: idStr,
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
								//Tips.showSuccess('{modifiedIdentityBindingSuccess}', 2);
								
							} else {
								//Tips.showWarning('{modifiedIdentityBindingFail}', 2);
							}
						} else {
							//Tips.showWarning('{netErr}', 2);
						}
					}
				});
		var dualStr=Serialize.queryArrsToStr(dualType);

		var realsuccess = 0;

		$.ajax({
					url: '/goform/formMultiPathGlobale',
					type: 'POST',
					data: dualStr,
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
								// 显示成功信息
								//Tips.showSuccess('{saveSuccess}', 2);
								realsuccess++;
								if(realsuccess == DATA.nowcount+1){
									Tips.showSuccess('{saveSuccess}', 2);
									$('.nav a[href="#2"]').trigger('click');
								}
							} else {
							//	Tips.showWarning('{saveFail}', 2);
							}
						} else {
							//Tips.showWarning('{netErr}', 2);
						}
					}
				});

		newarr.shift();
		newarr.shift();
		newarr.shift();
		var wansdata = [[],[],[],[],[],[]];
		var count = Number(newarr.length)/6;
		DATA.nowcount = count;
		for(var i = 1;i<=count ; i++){
			for(var j = 0;j<6;j++){
				wansdata[i-1].push([newarr[0][0].substr(0,(newarr[0][0].length-1)),newarr[0][1]]);
				newarr.shift();
			}
		}
		var time=1000;
		var truekey = 0;
		for(var k=0;k<count;k++){
			setTimeout(function(){
					truekey++;
					var strArr=wansdata[truekey-1];	
					var strStr=Serialize.queryArrsToStr(strArr);
					var str="PortName="+truekey;
					var postStr = Serialize.mergeQueryStr([strStr, str]);
					$.ajax({
					url: '/goform/formMultiPathConfig',
					type: 'POST',
					data: postStr,
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
							//	Tips.showSuccess('{saveSuccess}', 2);
								realsuccess++;
								if(realsuccess == DATA.nowcount+1){
									Tips.showSuccess('{saveSuccess}', 2);
									$('.nav a[href="#2"]').trigger('click');
								}
								
							} else {
						        Tips.showWarning(data["errorstr"], 2);
							    return;
                            }
						} else {
							//Tips.showWarning('{netErr}', 2);
						}
					}
				});
			},time*k);
		}
      
		
	}
	function getThedata($con){
		$.ajax({
			url: 'common.asp?optType=WanIfCount',
			type: 'GET',
			success: function(result) {
				var doEval = require('Eval');
				
				var codeStr=result,variableArr = ['wanIfCount','maxwanIfCount'];;
				result=doEval.doEval(codeStr,variableArr);
				 DATA["wanCount"] = result['data']["wanIfCount"];
				 DATA["maxwanCount"]=result['data']["maxwanIfCount"];
				 $.ajax({
					url: 'common.asp?optType=MultiPath',/*线路检测*/
					type: 'GET',
					success: function(result) {
						var doEval = require('Eval');
						var codeStr=result,
						variableArr = [
										'PortNames',
										'ConnTypes',
										'Weights',
										'KeepLives',
										'RetryTimess',
										'DestIPs',
										'ConnCheck',
										'PortNamesw',
										'IdentifyBindEnables',/*身份绑定*/
										'DualTypes'/*负载均衡*/
										];
						result=doEval.doEval(codeStr,variableArr);
						DATA["MultiPath"] = result['data'];
						displayInputs($con);


				}
			});
				 
			}
		});

	}
	function display($container) {
		getThedata($container);
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doWANConfig'];
		Translate.translate(tranDomArr, dicArr);
		
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
})

