define(function(require, exports, module){
	function tl(str){
		return require('Translate').getValue(str,['common','doClockMgmt']);
	}	
	function submit(queryStr){
		var tips=require('Tips')
		$.ajax({
			url : '/goform/NTP',
			type: 'POST',
			data: queryStr,
			success: function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['status'],
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
				if(isSuccess){
					var data = result["data"],
						status = data["status"];
					if(status){
						tips.showSuccess('{saveSuccess}');
						display($('#1'));
					}else{
						tips.showError('{saveFail}');
					}
				}
			}
		});
	}

	function initEvent(){
		$('#save').click(function(){
			var modify=0;
			var Serialize = require('Serialize');
			var queryArrs = Serialize.getQueryArrs($('#1'));
			var queryStr = Serialize.queryArrsToStr(queryArrs);
			var tmpJson = Serialize.queryStrsToJson(queryStr);
			if(tmpJson.SntpEnable=='off'){
				modify=1;
			}
			var SysDateTime1 = tmpJson.ymd + ' ' +tmpJson.hour+':'+ tmpJson.min+':'+tmpJson.second;
			queryStr = queryStr+ '&' + 'SysDateTime1='+'\"'+SysDateTime1 +'\"';
			/******************************************************************/
			//判断是否有错误的提示框，如果有错误的提示框，则不进行post操作
			/******************************************************************/
			var tips = require('Tips');
			var InputGroup = require('InputGroup');
			var len = InputGroup.checkErr($('#1'));
			if(len > 0)
			{
	//			tips.showError('{NoSave}');
				//alert('有错误，无法保存!');
				return;
			}
			/******************************************************************/
			/******************************************************************/	
			if(modify==1){
				require('Tips').showConfirm(tl('modifyConfirm'),function(){
					submit(queryStr);
				});				
			}else{
				submit(queryStr);
			}
		})	
	}
	function showWidget($container, sysDateTimes, dst_switch, Timezones, sntp_enables, server1s, server2s, server3s){
		var InputGroup = require('InputGroup');
		//alert(Timezones);
		var arr = [
			['-39600', tl('Place_11')],
			['-36000', tl('Place_10')],
			['-32400', tl('Place_9')],
			['-28800', tl('Place_8')],
			['-25200', tl('Place_7')],
			['-21600', tl('Place_6')],
			['-18000', tl('Place_5')],
			['-14400', tl('Place_4')],
			['-12600', tl('Place_35')],
			['-10800', tl('Place_3')],
			['-7200', tl('Place_2')],
			['-3600', tl('Place_1')],
			['0', tl('Place0')],	
			['3600', tl('Place1')],
			['7200', tl('Place2')],
			['10800', tl('Place3')],
			['12600', tl('Place35')],
			['14400', tl('Place4')],
			['16200', tl('Place45')],
			['18000', tl('Place5')],
			['19800', tl('Place55')],
			['21600', tl('Place6')],
			['23400', tl('Place65')],
			['25200', tl('Place7')],
			['28800', tl('Place8')],
			['32400', tl('Place9')],	
			['34200', tl('Place95')],
			['36000', tl('Place10')],
			['39600', tl('Place11')],
			['43200', tl('Place12')],
		];		
		var modeInputJson = [];
		arr.forEach(function(item, index){
			var obj = {
				"value" : item[0],
				"name"  : item[1]
			};
			modeInputJson.push(obj);
		});
		var inputList = [
			{
				"prevWord" : '{SysNowTime}',
				"inputData" : {
					"type" : 'text',
					"name" : 'systemTime',
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{SelZone}',
				"inputData" : {
					"type" : 'select',
					"name" : 'time_zone',
					"defaultValue":Timezones,
					"items" : modeInputJson
				},
				"afterword" : ''
			},		
			{
				"prevWord" : '{timeSetType}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'SntpEnable',
					"defaultValue": sntp_enables,
					"items" : [
						{
							"value" : 'off',
							"name" : '{ManuallySetTime}',
							"control" :'manual'
							//"isChecked" : kaiqi,
						},
						{
							"value" : 'on',
							"name" : '{Timed}',
							//"isChecked" : guanbi,
						}
					]
				}
			},
		    {
		        "sign": 'manual',
		        "prevWord": '',
		        "inputData": {
		          "type"       : 'date',
		          "name"       : 'ymd',
		          "value":'',
		        },
		        "afterWord": ''
		    },  	
		    {		        
		    	"necessary": true,
		        "prevWord": '{Server1IP}',
		        "inputData": {
		          "type"       : 'text',
		          "name"       : 'NTPServerIP',
		          "value":server1s,
		          "checkDemoFunc": ['checkInput', 'ip', '1', '1']
		        },
		        "afterWord": ''
		    }, 	
		    {		
		    	"necessary": true,  
		        "prevWord": '{Server2IP}',
		        "inputData": {
		          "type"       : 'text',
		          "name"       : 'server2',
		          "value":server2s,
		          "checkDemoFunc": ['checkInput', 'ip', '1', '1']
		        },
		        "afterWord": ''
		    }, 
		    {
		        "prevWord": '{Server3IP}',
		        "inputData": {
		          "type"       : 'text',
		          "name"       : 'server3',
		          "value":server3s,
		          "checkDemoFunc": ['checkInput', 'ip', '0', '1']
		        },
		        "afterWord": ''
		    }, 		    		    	    			
		];
		var $inputGroup = InputGroup.getDom(inputList);

		$inputGroup.find('[name="systemTime"]').after(tl('SCDate')+'<span id="dates" style="margin-right:15px;"></span>'+tl('SCTime')+'<span id="times"></span>')
		$inputGroup.find('[name="systemTime"]').remove();

		var sysDate=new Date(UTCtoLocal(eval(sysDateTimes),28800) * 1000);  
		Year= sysDate.getFullYear();
		if(Year < 2011)Year = 2011;
		Month= sysDate.getMonth();
		Day= sysDate.getDate();
		if (10 > sysDate.getHours())
			Hour="0"+sysDate.getHours();
		else
			Hour=""+sysDate.getHours();
		if (10 > sysDate.getMinutes())
			Minute="0"+sysDate.getMinutes();
		else
			Minute=""+sysDate.getMinutes();
		if (10 > sysDate.getSeconds())
			Second="0"+sysDate.getSeconds();
		else
			Second=""+sysDate.getSeconds();
		/*路由器内部0表示1月*/
		Month1=Month+1;

		/*系统当前时间设置*/
		var setdates = Year+'-'+(Month1.toString()[1]?Month1.toString():"0"+Month1.toString())+'-'+(Day.toString()[1]?Day.toString():"0"+Day.toString());
		$inputGroup.find('#dates').text(' '+setdates);
		$inputGroup.find('#times').text(' '+Hour+':'+Minute+':'+Second);

		$inputGroup.find('[name="time_zone"]').css('width','396px');

		$inputGroup.find('[name="ymd"]').css('margin-right','10px').before(tl('SCDate')+' ');
		$inputGroup.find('[name="ymd"]').after(tl('SCTime')+' '+'<input type="text" name="hour" style="width:50px" class="l-timetool"><span> : </span><input type="text" name="min" style="width:50px" class="l-timetool"><span> : </span><input type="text" name="second" style="width:50px" class="l-timetool">');
		$inputGroup.find('[name="hour"],[name="min"],[name="second"]').keyup(function(){
			if($(this).val().length>=2){
				$(this).blur();
				if($(this).next().next().hasClass('l-timetool')){
					$(this).next().next().focus();
				}
			}
		});
		$inputGroup.find('[name="hour"]').keyup(function(){
			var vals = $(this).val();
			if(Number(vals)>23){
				$(this).val('23');
			}else if(Number(vals)<0){
				$(this).val('00');
			}
		});
		$inputGroup.find('[name="min"],[name="second"]').keyup(function(){
			var vals = $(this).val();
			if(Number(vals)>59){
				$(this).val('59');
			}else if(Number(vals)<0){
				$(this).val('00');
			}
		});
		$inputGroup.find('[name="hour"],[name="min"],[name="second"]').blur(function(){
			var vals = $(this).val();
			if(Number(vals)>=0 && Number(vals)<10){
				$(this).val('0'+Math.round(Number(vals)));
			}
			if(isNaN(vals)){
				$(this).val('00');
			}
		});
		/*0022493更改后刷新页面恢复成改时间问题*/
		Month=Month+1;
		/*************************************/
		$inputGroup.find('[name="ymd"]').attr("readonly","readonly");

		$inputGroup.find('[name="hour"]').val(Hour);
		$inputGroup.find('[name="min"]').val(Minute);
		$inputGroup.find('[name="second"]').val(Second);
		$inputGroup.find('[name="ymd"]').val(Year+"-"+(Month.toString()[1]?Month.toString():"0"+Month.toString())+"-"+(Day.toString()[1]?Day.toString():"0"+Day.toString()));
		
		makeTheSntpEnableChange();
		$inputGroup.find('[name="SntpEnable"]').click(function(){
			makeTheSntpEnableChange();
		});
		function makeTheSntpEnableChange(){
			var vals = $inputGroup.find('[name="SntpEnable"]:checked').val();
			var domssss = $inputGroup.find('[name="NTPServerIP"],[name="server2"],[name="server3"]');
			if(vals == 'off'){
				domssss.attr('disabled','disabled');
			}else if(vals == 'on'){
				domssss.removeAttr('disabled');
			}
		}

		var btnList = [
			{"id" : 'save', "name" : '{save}'},
			{"id" : 'reset', "name" : '{reset}',clickFunc:function($btn){
				$('[href="#1"]').trigger('click');
			}}
		];
		var BtnGroup = require('BtnGroup');
		var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.empty().append($inputGroup, btnHTML);

		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doClockMgmt'];
		Translate.translate(tranDomArr, dicArr);

		initEvent();
	}
	function UTCtoLocal(time, timezone) {
	    date = new Date();
	    //return time + timezone + date.getTimezoneOffset()* 60;
	    return time + date.getTimezoneOffset()* 60;
	}	
	function display($container){
		var Translate = require('Translate'); 
	 	var dicNames = ['common', 'doClockMgmt']; 
	 	Translate.preLoadDics(dicNames, function(){ 	
			$container.empty();
		// 加载路径导航模板模块
			$.ajax({
				// url : 'common.asp?optType=lanSet',
				url : 'common.asp?optType=clockManage',
				type: 'GET',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['sysDateTimes',
										 'dst_switch',
										 'Timezones', 
										 'sntp_enables',
										 'server1s',
										 'server2s',
										 'server3s'
										 ];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					console.log(isSuccess);
					if(isSuccess){
						var data = result["data"],
							sysDateTimes = data['sysDateTimes'],
							dst_switch = data['dst_switch'],
							Timezones = data['Timezones'],
							sntp_enables = data['sntp_enables'],
							server1s = data['server1s'],
							server2s = data['server2s'],
							server3s = data["server3s"];
						showWidget($container, sysDateTimes, dst_switch, Timezones, sntp_enables, server1s, server2s, server3s)
					}else{
						alert('{error}');
					}
				}
			});
		});	
	};
	module.exports = {
		display: display
	};
})
