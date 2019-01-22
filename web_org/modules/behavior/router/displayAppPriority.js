define(function(require, exports, module) {
	var rateLimit = false;
	require('jquery');
	/**
	 * 本页面使用的字典
	 * @type {Array}
	 */
	var DicArr = ['common', 'doBehaviorManagement','doTrafficManagement'];
	var DATA = {};
	DATA.allappjqdom = {}; // 存放所有应用服务
	function T(_str){
	    return Translate.getValue(_str, DicArr);
	}
	/**
	 * 用户选中的app id
	 * @type {Array}
	 */
	var selectedAppIds = [];
	/**
	 * 生成整个页面
	 * 根据参数决定显示 表格、添加还是修改，默认显示表格
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $container [description]
	 * @param  {[type]}   type       [description]
	 * @return {[type]}              [description]
	 */
	function display($container, type){
		DATA["conDom"] = $container;
		switch(type){
			case 'table' :
				displayRuleTable($container);
				break;
			case 'edit' :
				displayEdit($container);
				break;
			case 'add' : 
				displayAdd($container);
				break;
			default :
				displayRuleTable($container);
				break;
		}
	}
	/**
	 * 显示 规则 表格
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $container [description]
	 * @return {[type]}              [description]
	 */
	function displayRuleTable($container){

		displayTable($container);
	}
	/**
	 * 显示 修改规则
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function displayEdit($btn){
		var $container = DATA["conDom"];
		$container.empty();
//		changePath('{edit}', DicArr);
		var data       = getDataByBtn($btn);
		DATA["editBit"] = data["bit"];
		DATA["bit"]    = data["bit"];
		var $inputList = showInputGroup($container, data);
		addInputEvents($inputList);
	}
	/**
	 * 修改路径导航的尾部标题
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   pathStr [description]
	 * @return {[type]}           [description]
	 */
	function changePath(pathStr, dicArr){
		var Path = require('Path');
//		Path.changePath(pathStr, dicArr);
	}
	function translate(domArr){
		var Translate = require('Translate');
		Translate.translate(domArr, DicArr);
	}
	/**
	 * 显示 添加规则
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @return {[type]}   [description]
	 */
	function displayAdd(){
		var $container = DATA["conDom"];
		DATA["editBit"] = '';
		DATA["bit"] = '';
		$container.empty();
//		changePath('{add}', DicArr);
		var $inputList = showInputGroup($container);
		addInputEvents($inputList);
	}
	/**
	 * 显示 添加/修改 的输入框组
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $container [description]
	 * @param  {[type]}   data       [description]
	 * @return {[type]}              [description]
	 */
	function showInputGroup($container, data){
		$('#checkOpen,.u-onoff-span1').hide();
		
		var isAdd = (data === undefined);
		data = (data === undefined) ? {} : data; 
		var InputGroup = require('InputGroup');
		var timeItems  = [];
		var timePlans  = DATA["times"] || [];

		var txBandDataUp = [];
		var txBandDataDown = [];

		timePlans.forEach(function(timePlan){
			timeItems.push({
				name : timePlan,
				value : timePlan
			});
		});
		timeItems.push({
			name : T('{allday}'),
			value : '',
		});
		
		var applyUser = '';
		var orgType = data['behOrgType'];
		if(orgType == 'ip')
		{
			applyUser = data['behOrgIp'];
		}
		else if(orgType == 'all'){
			applyUser = T('{allUser}');
		}else if(orgType == 'org'){
			applyUser = data['behOrgNames']
		}else{
			applyUser = T('{allUser}');
		}
		txBandDataUp = DATA['txBands'];
		txBandDataDown = DATA['rxBands'];

		var inputList = [
			{
				"prevWord"  : '{open}',
				"inputData" : {
					"type"   : 'radio',
					"name"   : 'status',
					"defaultValue"  : data["isOpen"] || '1',
					"items"  : [
						{
							"value" : 1,
							"name"  : T('open'),
						},
						{
							"value" : 0,
							"name"  : T('close'),
						}
					]
				}
			},
			{
				"prevWord"  : '{rule}{name}',
				"necessary" : true,
				"inputData" : {
					"type"   : 'text',
					"name"   : 'ruleName',
					"value"  : data["ruleName"] || '',
					"checkDemoFunc" : ['checkInput', 'name', '1', '31', '2']
				}
			},
			{
				"display"   : false,
				"inputData" : {
					"type" : 'text',
					"name" : 'oldName',
					"value" : data["ruleName"] || ''
				}
			},
			{
				"prevWord"  : '{comment}',
				"inputData" : {
					"type"  : 'text',
					"name"  : 'comment',
					"value" : data["comment"] || '',
					"checkDemoFunc" : ['checkInput', 'name', '0', '31', '2']
				}
			},
			{
				"necessary": true,
				"prevWord"  : '{Execution_order}',
				"inputData" : {
					"type"  : 'text',
					"name"  : 'order',
					"value" : data["order"] || '',
					"checkDemoFunc":["checkInput","num","1","10000"]
				},
				"afterWord" :'{tips}'
			},
			{
				"prevWord"  : '',
				"display"   : false,
				"inputData" : {
					"type"  : 'text',
					"name"  : 'oldorder',
					"value" : data["order"] || ''
				},
				"afterWord" :'{tips}'
			},
			{
				"necessary": true,
				"prevWord"  : '{priority}',
				"inputData" : {
					"type"  : 'text',
					"name"  : 'priority',
					"value" : data["priority"] || '',
					"checkDemoFunc":["checkInput","num","1","16"]
				},
				"afterWord" :'{tips}'
			},
			{
				"prevWord"  : '{users}',
				"inputData" : {
					"type"  : 'text',
					"name"  : 'users',
					"value" : applyUser
				}
			},
			{
				"prevWord"  : '{app}{server}',
				"necessary" : true,
				"inputData" : {
					"type"  : 'text',
					"name"  : 'servers',
					"value" : data["servers"] || ''
				}
			},
			{
				"prevWord"	: '{uRate}',
				"necessary" : rateLimit?rateLimit:false,
				"inputData" : {
					"type"	: "text",
					"name"	: "uRate",
					"value"	: data["uRate"]
				},
				"afterWord" : 'Kbps',
				"display"   : rateLimit?rateLimit:false
			},
			{	"prevWord" : '{dRate}',
				"necessary" : rateLimit?rateLimit:false,
				"inputData" : {
					"type"	: "text",
					"name"	: "dRate",
					"value"	: data["dRate"]
				},
				"afterWord" :'Kbps',
				"display"   : rateLimit?rateLimit:false
			},
			{
				"prevWord"  : '{effecttime}',
				"inputData" : {
					"type"  : 'select',
					"name"  : 'time',
					"defaultValue" : (data["effecttime"] == '{allday}' ? '' : data["effecttime"]),
					"items"  : timeItems
				}
			},
			{
				inputData:{
					type:'title',
					name:'{WANBroadBand}'
				}
			}
		];


		var wans ="<tr data-for-wanbb='true'><td></td><td colspan='3'><span style='margin-right:100px' >上行带宽</span><span style='margin-right:140px'></span><span style='margin-right:12px' data-local=''>下行带宽</span><span style='margin-right:181px'></span><span></span></td></tr>";
		RateArr1 = new Array(T("custom"),"512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M", "1000M");
		RateArrValue1 = new Array("","512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000", "1000000");

		var count = (DATA["wanCount"] == 0?'1':DATA["wanCount"]);
		//var data=DATA["MultiPath"];
		for(var i=1;i<=count;i++){

				wans += "<tr data-for-wanbb='true'>"+
							"<td>"+
								"WAN"+i+'<span class="u-necessary" style="margin-left:5px">*</span>'+
							"</td>"+
							"<td colspan='4'>"+
								"<input name='txBand"+i+"' value='"+txBandDataUp[i]+"' temTag='1'   data-from='choosenRate' style='width:100px;margin-right:10px' type='text'/><span>Kbit/s  <==</span>"+
								"<select name='demoselect"+i+"' data-tag='1' style='width:90px;margin-right:10px;margin-left:10px' class='choosenRate' >"+
									getRateOptions(RateArr1 ,RateArrValue1 )+
								"</select>"+
								
								"<input name='rxBand"+i+"' value='"+txBandDataDown[i]+"' temTag='2' data-from='choosenRate' style='width:90px;margin-right:10px' type='text'/><span>Kbit/s  <==</span>"+
								"<select name='demoselect"+i+"' data-tag='2' style='width:90px;margin-right:10px;margin-left:10px' class='choosenRate' >"+
									getRateOptions(RateArr1 ,RateArrValue1 )+
								"</select>"+
								
							"</td>"+
						"</tr>";
		
		}
		if (rateLimit) {
			wans += "<tr data-for-wanbb='true'><td>"+T('limitRatio')+"<span class='u-necessary' style='margin-left:5px'>*</span></td><td colspan='4'><input name='limitRatio' style='width:70px;margin-right:10px' type='text' value='"+DATA['limitRatio']+"'/><span>%</span></td></tr>";
		}
		wans += "<tr data-for-wanbb='true'><td></td><td colspan='3' data-local='({range1})({range2})' ></td></tr>";
		function getRateOptions(_r,_d){
			var str = '';
			var lengths = _r.length;
			for(var i = 0;i<lengths;i++){
				str += "<option value='"+_d[i]+"'>"+_r[i]+"</option>";
			}
			return str;
		}

		var $inputGroupDom = InputGroup.getDom(inputList);

		$inputGroupDom.find('[name="uRate"]').parent().next().append('<select name="urate_select"><option value="">自定义</option></select>');
		$inputGroupDom.find('[name="dRate"]').parent().next().append('<select name="drate_select"><option value="">自定义</option></select>');


//上传下载浏览交互
		var RateArr = new Array(T('nolimit'),"64K", "128K", "256K", "512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M");
		var RateArrValue = new Array("0","64", "128", "256", "512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000");
		RateArr.forEach(function(obj,i){
			$inputGroupDom.find('[name="urate_select"],[name="drate_select"]').append('<option value="'+RateArrValue[i]+'">'+obj+'</option>');
		});		

		$inputGroupDom.find('[name="urate_select"]').change(function(){
			var $t = $(this);
			if($t.val() !== ''){
				$inputGroupDom.find('[name="uRate"]').val($t.val());
			}

		});
		$inputGroupDom.find('[name="drate_select"]').change(function(){
			var $t = $(this);
			if($t.val() !== ''){
				$inputGroupDom.find('[name="dRate"]').val($t.val());
			}

		});

		$inputGroupDom.find('[name="uRate"]').keyup(function(){
			var $t = $(this);
			$inputGroupDom.find('[name="urate_select"]').val('');

		});
		$inputGroupDom.find('[name="dRate"]').keyup(function(){
			var $t = $(this);
			$inputGroupDom.find('[name="drate_select"]').val('');

		});
		
		/*
		 	修改表单中间显示宽度
		 * */
		$inputGroupDom.find('tbody>tr>td:eq(1)').css({width:'170px'});
		
		/*
			显示时间计划的按钮
		 */

		addTimePlanDom($inputGroupDom);
		/*显示wan口带宽*/
		$inputGroupDom.find('tbody').append(wans);
		/* WAN口宽带切换 */
		
		$inputGroupDom.find('tr[data-for-wanbb]').addClass('u-hide');
		var wanval = $inputGroupDom.find('[data-local="{WANBroadBand}"]').text();
		var $newlink = $('<a class="u-inputLink" data-local="'+wanval+'">'+wanval+'</a>');
		$inputGroupDom.find('[data-local="{WANBroadBand}"]').parent().empty().append($newlink);
		
		$newlink.click(function(){
			if($inputGroupDom.find('tr[data-for-wanbb]').eq(0).hasClass('u-hide')){
				$inputGroupDom.find('tr[data-for-wanbb]').removeClass('u-hide');
			}else{
				$inputGroupDom.find('tr[data-for-wanbb]').addClass('u-hide');
			}
			
		})
		
		/*
			显示组织架构
		 */
		addOrganizationDom($inputGroupDom, {
			type : data["behOrgType"],
			data : data["behOrgData"],
			ip   : data["behOrgIp"] || '0.0.0.0-0.0.0.0'
		});
		


		//改变带宽select函数
		$inputGroupDom.find('.choosenRate').change(function(){
			var $t = $(this);
			if($t.val()){
				if($t.attr("data-tag")==2){
					$t.prevAll('input[data-from="choosenRate"][temTag="2"]').val($t.val()).trigger('focus').trigger('blur');
				}else{
					$t.prevAll('input[data-from="choosenRate"]').val($t.val()).trigger('focus').trigger('blur');
				}
			}else{
				if($t.attr("data-tag")==2){
					$t.prevAll('input[data-from="choosenRate"][temTag="2"]').val(0).trigger('focus').trigger('blur');
				}else{
					$t.prevAll('input[data-from="choosenRate"]').val(0).trigger('focus').trigger('blur');
				}
			}
		});
		$inputGroupDom.find('[data-from="choosenRate"]').focus(function(){
			$(this).attr('oldval',$(this).val());
		})
		$inputGroupDom.find('[data-from="choosenRate"]').blur(function(){
			if($(this).val() != $(this).attr('oldval')){
				$(this).nextAll('.choosenRate[data-tag="'+$(this).attr('temtag')+'"]').val('');
			}
			$(this).removeAttr('oldval');
			
		});
		
		
		
		//添加输入是否合法函数
		for(var i = 1;i<=count;i++){
			$inputGroupDom.find('[name="txBand'+i+'"]').checkdemofunc('checkNum','0','1000000');		
			$inputGroupDom.find('[name="rxBand'+i+'"]').checkdemofunc('checkNum','0','1000000');
		}


		var BtnGroup = require('BtnGroup');
		var btnList = [
			{
				"id"        : 'save',
				"name"      : '{save}',
				"clickFunc" : function($this){
					/*
						保存用户的设置
					 */
					save($inputGroupDom, isAdd);
				} 
			},
			{
				"id"        : 'reset',
				"name"      : '{reset}',
				"clickFunc" : function($this){
					changeAppsInInput(DATA["editBit"]);
				} 
			},
			{
				"id"        : 'back',
				"name"      : '{back}',
				"clickFunc" : function($this){
					displayRuleTable(DATA["conDom"]);
				} 
			}
		];
		var $btnList = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.empty().append($inputGroupDom,$btnList);
		translate([$inputGroupDom, $btnList]);
		return $inputGroupDom;
	}
	/**
	 * 保存用户操作
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 * @return {[type]}        [description]
	 */
	function save($dom, isAdd){
		var InputGroup = require('InputGroup');
		var len = InputGroup.checkErr($dom);
		if (len > 0) {
			return;
		}
		var database   = DATA["db"];
		var Serialize = require('Serialize');
		var queryArr  = Serialize.getQueryArrs($dom);
		var queryJson = Serialize.queryArrsToJson(queryArr);
		
		var realorder = '';
		if(Number(queryJson.oldorder) < Number(queryJson.order) && queryJson.oldorder !== ''){
			realorder = Number(queryJson.order)+1;
		}else{
			realorder = Number(queryJson.order);
		}
		var thisdata       = database.getSelect({
			order : realorder
		})[0];
		
		var status    = queryJson["status"],
			ruleName  = queryJson["ruleName"],
			oldName   = queryJson["oldName"],
			comment   = queryJson["comment"],
			orgIp     = queryJson["orgIp"],
			orgData   = queryJson["orgData"],
			orgType   = queryJson["orgType"],
			timePlan  = queryJson["time"],
			priority  = queryJson["priority"],
			uRate     = queryJson["uRate"],
			dRate     = queryJson["dRate"],
			order     = queryJson["order"],
			oldorder  = queryJson["oldorder"],
			orderNewName = queryJson["ruleName"];
			orderOldName = (thisdata === undefined?'':thisdata["ruleName"]);
		var bit       = DATA["bit"];
        if(ruleName == ''){
			var Tips = require('Tips');
			Tips.showWarning(T('{rule}{name}{not}{can}{empty}'));
		}else if(bit == ''){
			var Tips = require('Tips');
			Tips.showWarning(T('{app}{server}{not}{can}{as}{empty}'));
		}else if(bit == '0'){
			var Tips = require('Tips');
			Tips.showWarning(T('{app}{server}{not}{can}{as}{empty}'));
        }else{
			/*
				发送数据
			 */
			var postDataJson = {
				type       : isAdd ? 'add' : 'edit',
				ruleName   : ruleName,
				oldName    : oldName,
				comment    : comment,
				bit        : bit,
				orgType    : orgType,
				orgData    : orgData,
				orgIp      : orgIp,
				effecttime : timePlan,
				status     : status,
				priority   : priority,
				uRate 	   : uRate,
				dRate      : dRate,
				order      : order,
				oldorder   : oldorder,
				orderNewName     : orderNewName,
				orderOldName     : orderOldName
			};
			
			var datalength = DATA["db"].table().getSelect().length;
			var Tips = require('Tips');
			if(postDataJson.type == 'add' && postDataJson.order <= datalength){
				Tips.showConfirm(T('Execution_order_Tip'),function(){
					editRule(postDataJson);
				});
			}else if(postDataJson.type == 'edit' && postDataJson.order <= datalength && postDataJson.order != Number(queryJson.oldorder)){
				Tips.showConfirm(T('Execution_order_Tip'),function(){
					editRule(postDataJson);
				});
			}else{
				editRule(postDataJson);
			}
			
			
		}

		var pStr ="";

		DATA.rxBands.forEach(function(item,index,arr){
			pStr += "&txBand"+(index)+"="+queryJson['txBand' + index]+"&rxBand"+(index)+"="+queryJson['rxBand' + index];
		});
		if (DATA["limitRatio"] != queryJson['limitRatio']) {
			pStr += "&limitRatio=" + queryJson['limitRatio'];
		}
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
	function editRule(data){
		var Serialize = require('Serialize');
		switch(data["orgType"]){
			case 'all':
				data["orgData"] = '';
				break;
			case 'org':
				break;
			case 'ip':
				data["orgData"] = data["orgIp"];
				break;
			default :
				break;
		}
		if(data["effecttime"] == '{allday}'){
			data["effecttime"] = '';
		}
		var postDataJson = {
			optDpiType   : data["type"],
			ruleName     : data["ruleName"],
			oldName      : data["oldName"],
			comment      : data["comment"],
			appForbidBit : data["bit"],
			dpiOrgType   : data["orgType"],
			dpiOrgData   : data["orgData"],
			effecttime   : data["effecttime"],
			status       : data["status"],
			priority     : data["priority"],
			uRate        : data["uRate"],
			dRate        : data["dRate"],
			order        : data["order"],
			oldorder	 : data["oldorder"],
			orderNewName : data["orderNewName"],
			orderOldName : data["orderOldName"]
		};
		if(postDataJson.optDpiType == 'edit' && postDataJson.order == postDataJson.oldorder)
		{
			postDataJson.orderNewName = postDataJson.orderOldName;
			
		}
		var postQueryStr = Serialize.queryJsonToStr(postDataJson);
		//console.log(postQueryStr);
		$.ajax({
			url : 'goform/formConfigAppPriority',
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
					if(status == '1'){
						Tips.showSuccess('{saveSuccess}');
						$('.nav a[href="#1"]').trigger('click');
					}else{
						var errorStr = data["errorstr"];
						Tips.showWarning('{saveFail}' + errorStr);
						
					}
				}
			}
		});
	}
	/**
	 * 显示 时间计划的按钮
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 */
	function addTimePlanDom($dom){
		var InputGroup = require('InputGroup');
		var btnList = [
			{
				id :'addTimePlan',
				name:'{add}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').addModal($dom.find('[name="time"]'));
				}
			},
			{
				id :'editTimePlan',
				name:'{edit}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').editModal($dom.find('[name="time"]'));
				}
			}
		];
		InputGroup.insertLink($dom,'time',btnList);
	}
	/**
	 * 添加组织架构
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 */
	function addOrganizationDom($dom, data){
		var orgType = data["type"] || 'all';
		var orgData = data["data"] || '';
		var orgIp   = data["ip"] || '';
		$dom.find('[name="users"]').after('<input type="text" class="u-hide" value="'+orgType+'" name="orgType" />');
		$dom.find('[name="users"]').after('<input type="text" class="u-hide" value="'+orgData+'" name="orgData" />');
		$dom.find('[name="users"]').after('<input type="text" class="u-hide" value="'+orgIp+'" name="orgIp" />');
		$dom.find('[name="users"]').click(function(){
			var datass = {
				//保存回调
				saveClick:function(saveData){
					if (saveData.applyTypeStr == "ip"){
						$dom.find('[name="users"]').val(saveData.ipStr);
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						$dom.find('[name="orgData"]').val('');
						$dom.find('[name="orgIp"]').val(saveData.ipStr);
					}
					else if (saveData.applyTypeStr == "org"){
						$dom.find('[name="users"]').val(saveData.showName);
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						$dom.find('[name="orgData"]').val(saveData.checkIdStr);
						$dom.find('[name="orgIp"]').val('');
					}
					else{
						$dom.find('[name="users"]').val(T('{allUser}'));
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						$dom.find('[name="orgData"]').val('');
						$dom.find('[name="orgIp"]').val('');
					}
					saveData.close();
				},
				checkableStr:$dom.find('[name="orgData"]').val(),//被勾选的id字符串
				ipStr:$dom.find('[name="orgIp"]').val(),//开始结束的ip
				applyTypeStr:$dom.find('[name="orgType"]').val()//单选默认值
			};
			require('P_plugin/Organization').display(datass);
		});
	}
	/**
	 * 给添加/修改页面中输入框添加事件处理
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $inputList [description]
	 */
	function addInputEvents($inputList){
		/*
			给应用服务的输入框添加点击事件
		 */
		addAppServerEvent($inputList);
	}
	/**
	 * 给应用服务的输入框添加点击事件
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $inputList [description]
	 */
	function addAppServerEvent($inputList){
		var $input = $inputList.find('input[name="servers"]');
		$input.click(function(){
			/*
			var tw = require('Tips').showWaiting('应用服务加载中……')
			setTimeout(function(){
				showAppServerModal();
				tw.remove();
			},200);
			*/
			showAppServerModal();
		});
	}
	
	/**
	 * 显示 选择应用的 模态框
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @return {[type]}   [description]
	 */
	function showAppServerModal(){
		var modalObj = getAPPModalObj();
		
		DATA["appModalObj"] = modalObj;
		var $modal   = modalObj.getDom();
		/*
			获得模态框中选择app的 树状图、搜索等dom
		 */
		var $dom = getSelectAppConDom();
		setTimeout(function(){
			initSelectAppDom($dom);
		},1);
		modalObj.insert($dom);
		translate([modalObj.getDom()]);
		modalObj.show();
		/*
			初始化 选择app 整个dom
			包括 app tree、搜索、当前选中的app列表
		 */
		
		
	}
	/**
	 * 获得 选择应用 模态框的对象
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @return {[type]}   [description]
	 */
	function getAPPModalObj(){
		var Modal = require('Modal');
		var modalSettings = {
			"id"    : 'appServer',
			"title" : '{select}{app}',
			"size"  : 'large1',
			"btns"  : [
				{
					"type" : 'save',
					"clickFunc" : function(){
						/*
							重新计算比特位
						 */
						resetBit();
						changeAppsInInput(DATA["bit"]);
						DATA["appModalObj"].hide();
					}
				},
				{
					"type" : 'reset'
				},
				{
					"type" : 'close'
				}
			]
		};
		var modalObj = Modal.getModalObj(modalSettings);
		return modalObj;
	}
	function changeAppsInInput(bit){
		var apps = getAppsByBit(bit);
		$('#content').find('input[name="servers"]').attr('value', apps)
	}
	function resetBit(){
	    if(selectedAppIds.length){
		    var bitArr = new Array(Math.max.apply(null, selectedAppIds) + 1);
		    for(var i = 1; i < bitArr.length; i++){
		      	if(selectedAppIds.indexOf(i) != '-1'){
		        	bitArr[i-1] = '1';
		      	}else{
		       		bitArr[i-1] = '0';
		      	}
		    }
		    binaryStr = bitArr.join('');
		    var Funcs = require('P_core/Functions');
		    DATA["bit"] = Funcs.binaryToHexadecimal(binaryStr);
		}else{
			DATA["bit"] = '0';
		}
	}
	/**
	 * 获得选择app的包裹容器
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @return {[type]}   [description]
	 */
	function getSelectAppConDom(){
		var html = '<div class="row">'
					+ '<div id="appTrees" class="col-sm-3 col-xs-3 col-md-3 col-lg-3 " style="max-height:450px;overflow:auto"></div>'
					+ '<div class="col-sm-4 col-xs-4 col-md-4 col-lg-4" style="padding:5px">'
					+ '<input type="text" id="search-text-box"><button id="search" type="button" class="btn btn-primary" style="position:relative;top:-2px;margin-left:5px" data-local="{search}">{search}</button><h4 data-local="{search}{result}">{search}{result}</h4>'
					+ '<div id="appSearchRes" style="max-height:385px;overflow:auto"></div>'
					+ '</div>'
					+ '<div id="appSelect" class="col-sm-5 col-xs-5 col-md-5 col-lg-5"  style="padding:5px"><h4 data-local="{selected}{app}" style="margin-top:0px">{selected}{app}</h4><ul style="max-height:411px;overflow:auto"></ul></div>'
					+ '</div>';
		return $(html);
	}
	/**
	 * 初始化 选择app 整个dom
	 * 包括 app tree、搜索、当前选中的app列表
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   $dom 包裹dom
	 * @return {[type]}        [description]
	 */
	function initSelectAppDom($dom){
		/*
			获得app树状图数据
		 */
		getAppData(function(appData){
			if(appData !== false){
				/**
				 * 显示 选择app 整个dom
	 			 * 包括 app tree、搜索、当前选中的app列表 
				 */
				showSelectAppDom($dom, appData);
				
			}else{
				console.log('error')
			}
		});
	}
	/**
	 * 获取应用数据，并传递给回调函数
	 * 如果没有获取过，从服务器获取
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	function getAppData(callback){
		selectedAppIds = [];
		callback({
			apps   : cloneArr(DATA["apps"]),
			groups : cloneArr(DATA["groups"]),
			bit    : DATA["bit"]
		});
	}
	/**
	 *  显示 选择app 整个dom
	 *  包括 app tree、搜索、当前选中的app列表
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 * @param  {[type]}   data [description]
	 * @return {[type]}        [description]
	 */
	function showSelectAppDom($dom, data){
		var apps   = data["apps"];
		var bit    = data["bit"];
		var groups = data["groups"];
		/*
			根据比特位来给app数据添加选中的状态
		 */
		apps       = checkAppByBit(apps, bit);
		groups     = checkGroupByChildren(groups, apps);
		
		/*
			初始化 app树状图dom 
		 */
		initAppTreeDom($dom, apps, groups);
		/*
			将已经选择应用显示在右侧
		 */
		
		showSelectedApps(apps);
		/*
			给树状图添加事件
		 */
		initTreeEvent($dom);
		/*
		 	修改弹框样式
		 * */
	}
	/**
	 * 根据比特位来确定哪些app是选中的
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   apps [description]
	 * @param  {[type]}   bit  [description]
	 * @return {[type]}        [description]
	 */
	function checkAppByBit(apps, bit){
		if(bit === undefined){
			return apps;
		}
		var Funcs = require('Functions');
		var binaryStr = Funcs.hexadecimalToBinary(bit);
		bitArr = binaryStr.split('');
		apps.forEach(function(app){
			var index = app["id"];
			if(bitArr[index - 1] == 1){
				app["checked"] = true;
			}
		});
		return apps;
	}
	function checkGroupByChildren(groups, apps){
		/*
			已经勾选的第一级组节点
		 */
		var checkedGroups = [];
		apps.forEach(function(app){
			if(app.checked){
				/*
					应用直接所属组的id
				 */
				var parentId = app["gId"];
				checkParentNode(parentId, groups, checkedGroups)
			}
		});
		return groups;
	}
	function checkParentNode(parentId, groups, checkedGroups){
		if(parentId != '0' && checkedGroups.indexOf(parentId) < 0){
			checkedGroups.push(parentId);
			var index = getGroupIndexInGroups(parentId, groups);
			groups[index]["checked"] = true;
			var id = groups[index]["pId"];
			checkParentNode(id, groups, checkedGroups);
		}
	}
	function getGroupIndexInGroups(id, groups){
		var index = null;
		var len = groups.length;
		for(var i = 0; i < len; i++){
			if(id == groups[i]['id']){
				index = i;
				break;
			}
		}
		return index;
	}
	/**
	 * 初始化 app树状图 dom 
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @return {[type]}   [description]
	 */
	function initAppTreeDom($dom, apps, groups){
		/*
			将app和group数据转化为树数据
		 */
		var treeData = appDataToTreeData(apps, groups);
		/*
			将树数据转化为ztree节点数据
		 */
		treeDataToZtreeNodes(treeData);
		/*
			显示树状图
		 */
		showAppTreeDom($dom.find('#appTrees'), treeData);
	}
	/**
	 * 把app和group节点数据转化为树
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   appData [description]
	 * @return {[type]}           [description]
	 */
	function appDataToTreeData(apps, groups){
		var rootNodes = getRootNodes(groups);
		initTreeData(rootNodes, apps, groups);
		return rootNodes;
	}
	/**
	 * 根据父节点和所有节点数据，将子节点插入树中
	 * 并递归调用此方法
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   parentNode [description]
	 * @param  {[type]}   apps       [description]
	 * @param  {[type]}   groups     [description]
	 * @return {[type]}              [description]
	 */
	function initTreeData(parentNodes, apps, groups){
		var thisFunc = arguments.callee;
		if(parentNodes.length > 0){
			parentNodes.forEach(function(parentNode){
				/*
					判断是否是组节点
				 */
				if(parentNode["pId"] !== undefined){
					parentNode["children"] = [];
					parentNode.isParent = true;
					var nodeId = parentNode["id"];
					/*
						从分组列表中找子节点
					 */
					groups.forEach(function(group){
						if(group["pId"] == nodeId){
							parentNode["children"].push(group);
						}
					});
					/*
						从app列表中找子节点
					 */
					apps.forEach(function(app){
						if(app["gId"] == nodeId){
							parentNode["children"].push(app);
						}
					});
					/*
						如果当前节点有子节点
						递归本函数
					 */
					if(parentNode["children"].length > 0){
						thisFunc(parentNode["children"], apps, groups)
					}
				}
			});
		}
	}
	/**
	 * 从分组信息中获取根节点组成的数组
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   datas [description]
	 * @return {[type]}         [description]
	 */
	function getRootNodes(datas){
		var rootNodes = [];
		datas.forEach(function(data){
			if(data["pId"] == '0'){
				rootNodes.push(data);
			}
		});
		return rootNodes;
	}
	/**
	 * 将树的数据转化为ztree节点数据
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   nodes [description]
	 * @return {[type]}         [description]
	 */
	function treeDataToZtreeNodes(nodes){
		var thisFunc = arguments.callee;
		if(nodes.length > 0){
			nodes.forEach(function(node){
				node["name"] = node["n"];
				if(node["children"] !== undefined){
					node["groupId"] = node["id"];
					thisFunc(node["children"]);
				}else{
					node["appId"] = node["id"];
					node["appTag"]= 'app';
				}
			});
		}
	}
	/**
	 * 根据树状图容器和节点数据显示树状图
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   $dom  [description]
	 * @param  {[type]}   nodes [description]
	 * @return {[type]}         [description]
	 */
	function showAppTreeDom($dom, nodes){
		require('P_libs/js/jquery.ztree.all.min.js');
		$dom.addClass('ztree');
		var setting = {
			check : {
				enable : true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			callback : {
				onCheck : function(event, tId, node, flag){
					/*
						节点点击前的状态
					 */
					var checkStatus = !node.checked;
					var appId = node["appId"];
					/*
						点击的是app
					 */
					if(appId !== undefined){
						if(checkStatus){
							removeAppFromOPerateArea(appId)
						}else{
							addAppToOperateArea(appId, true);
						}
					}else{
						var ztreeObj = getZtreeObj();
						var nodes = ztreeObj.getNodesByParam('appTag', 'app', node);
						if(nodes.length > 0){
							var func = function(){};
							if(checkStatus){
								func = removeAppFromOPerateArea;
							}else{
								func = addAppToOperateArea;
							}
							nodes.forEach(function(node){
								var appId = node["appId"];
								func(appId);
							});
						}
					}
				}
			}
		};
		$.fn.zTree.init($dom, setting, nodes);
	}
	/**
	 * 显示所有app
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   apps [description]
	 * @return {[type]}        [description]
	 */
	function showSelectedApps(apps){
		DATA.allappjqdom = {};// 清空所有应用预留的jq对象
		if(apps.length > 0){
			var treeObj = getZtreeObj();
			var $oldul = DATA["appModalObj"].getDom().find('#appSelect ul');
			var $newul = $oldul.clone(true);
			
			
			apps.forEach(function(app){
				/* 原新增方法
				if(app.checked){
					addAppToOperateArea(app["id"], true);
				}
				*/
				
				
				/* 现直接加载之初将所有应用加在右侧 */
//				var node    = treeObj.getNodesByParam("appId", parseInt(app["id"]), null)[0];
				var html = '<li class="utt-inline-block border-green border-4 P-5 P-T-0 P-B-0 M-2">'
						+ '<span >{appName}</span>'
						+ '<span data-app-id="{appId}" class="glyphicon glyphicon-remove-circle u-app-item-remove-circle"></span>'
						+ '</li>';
				html     = html.replace(/{appId}/, app["id"]);
				html     = html.replace(/{appName}/, app["name"]);
				var $html = $(html);
				$newul.append($html);
				
				if(!app.checked){
					$html.addClass('u-hide');
				}else{
					selectedAppIds.push(app["id"])
				}
				/* 将生成的jq对象直接加入json 方便搜索 */
				DATA.allappjqdom[app["id"]] = $html;
			});
			$oldul.after($newul);
			$oldul.remove();
		}
	}
	/**
	 * 为选择app 模态框添加点击事件
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 * @return {[type]}        [description]
	 */
	function initTreeEvent($dom){
		$dom.click(function(ev){
			var ev      = ev || window.event,
				target  = ev.target || ev.srcElement,
				$target = $(target);
			if($target.attr('id') == 'search'){
				/*
					添加搜索事件
				 */
				handleSearchEvent($target);
			}else if($target.attr('data-type') == "res-item"){
				/*
					将应用添加到 选中区域
					并改变勾选状态
				 */
				var appId   = $target.attr('data-app-id');
				addAppToOperateArea(appId);
				checkNode(appId, true);
				/*
				$target.css({transition:'all 0.2s ease-in'});
				$target.css({opacity:0});
				setTimeout(function(){
					$target.css({overflow:'hidden',width:'0px',height:'0px',margin:'0 0',padding:'0 0'});
					setTimeout(function(){
						$target.remove();
					},200);
					
				},200);
				*/
				$target.addClass('u-app-pro-search-items-checked');
			}else if($target.hasClass('glyphicon-remove-circle')){
				/*
					将应用从 选中区域移除 
					并改变勾选状态
				 */
				var appId   = $target.attr('data-app-id');
				checkNode(appId, false);
				/*
				$target.parent().css({transition:'all 0.2s ease-in'});
				$target.parent().css({opacity:0});
				setTimeout(function(){
					$target.parent().css({overflow:'hidden',width:'0px',height:'0px',margin:'0 0',padding:'0 0'});
					setTimeout(function(){
						$target.parent().addClass('u-hide');
					},200);
					
				},200);
				*/
				$target.parent().addClass('u-hide');
				DATA["appModalObj"].getDom().find('#appSearchRes').find('li[data-app-id="'+appId+'"]').removeClass('u-app-pro-search-items-checked');
				removeAppId(appId);
				
			}
			
			
		});
		
		$dom.find('#search-text-box').keyup(function(event){
			if(event.keyCode == 13){
				$dom.find('#search').trigger('click');
			}
		});
	}
	/**
	 * 获得ztree 对象
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @return {[type]}   [description]
	 */
	function getZtreeObj(){
		var treeObj = $.fn.zTree.getZTreeObj("appTrees");
		return treeObj;
	}
	/**
	 * 修改节点勾选状态
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   appId [description]
	 * @param  {[type]}   type  [description]
	 * @return {[type]}         [description]
	 */
	function checkNode(appId, type){
		var treeObj  = getZtreeObj();
		var node     = treeObj.getNodesByParam("appId", parseInt(appId), null)[0];
		type         = (type === true) ? true : false;
		node.checked = type;
		treeObj.checkNode(node,type,true);
	}
	/**
	 * 将一个app添加到 选中区域
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   appId [description]
	 * @param  {[type]}   type  [description]
	 */
	function addAppToOperateArea(appId){
		/*
		var treeObj = getZtreeObj();
		var node    = treeObj.getNodesByParam("appId", parseInt(appId), null)[0];
		if(selectedAppIds.indexOf(parseInt(appId)) < 0){
			selectedAppIds.push(parseInt(appId));
			var html = '<li class="utt-inline-block border-green border-4 P-5 P-T-0 P-B-0 M-2">'
					+ '<span >{appName}</span>'
					+ '<span data-app-id="{appId}" class="glyphicon glyphicon-remove-circle u-app-item-remove-circle"></span>'
					+ '</li>';
			html     = html.replace(/{appId}/, appId);
			html     = html.replace(/{appName}/, node["name"]);
			DATA["appModalObj"].getDom().find('#appSelect ul').append(html);
		}
		*/
		if(selectedAppIds.indexOf(parseInt(appId)) < 0){
			selectedAppIds.push(parseInt(appId));
//			DATA["appModalObj"].getDom().find('span[data-app-id="'+appId+'"]').parent().removeClass('u-hide');
			DATA.allappjqdom[appId].removeClass('u-hide');
			DATA["appModalObj"].getDom().find('#appSearchRes').find('li[data-app-id="'+appId+'"]').addClass('u-app-pro-search-items-checked');
		}
		
	}
	function removeAppId(appId){
		for(var i = 0; i < selectedAppIds.length; i++){
			if(selectedAppIds[i] == appId){
				selectedAppIds.splice(i, 1);
			}
		}
	}
	/**
	 * 将一个app 从选中区域移除
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   appId [description]
	 * @return {[type]}         [description]
	 */
	function removeAppFromOPerateArea(appId){
		removeAppId(appId);
		/* 原删除方法
		var $lis = DATA["appModalObj"].getDom().find('#appSelect ul').children();
		if($lis.length > 0){
			$lis.each(function(){
				if($(this).find('span:last').attr('data-app-id') == appId){
					$(this).remove();
				}
			})
		}
		*/
//		DATA["appModalObj"].getDom().find('span[data-app-id="'+appId+'"]').parent().addClass('u-hide');
		DATA.allappjqdom[appId].addClass('u-hide');
		DATA["appModalObj"].getDom().find('#appSearchRes').find('li[data-app-id="'+appId+'"]').removeClass('u-app-pro-search-items-checked');
	}
	/**
	 * 处理搜索
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function handleSearchEvent($btn){
		var text    = $btn.prev('input').val();
		var treeObj = getZtreeObj();
		var nodes   = treeObj.getNodesByParamFuzzy("name", text, null);
		showSearchResult(nodes, $btn.parent().find('#appSearchRes'));
	}
	/**
	 * 显示搜索app的结果
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   nodes [description]
	 * @param  {[type]}   $dom  [description]
	 * @return {[type]}         [description]
	 */
	function showSearchResult(nodes, $dom){
		if(nodes.length > 0){
			var results = [];
			nodes.forEach(function(node){
				var appId = node["appId"];
				if(appId !== undefined){
					var obj = {
						appId : appId,
						appName : node["name"]
					}
					results.push(obj);
				}
			});
			var item = '<li data-type="res-item"  class="u-app-pro-search-items" data-app-id="{appId}" data-app-name="{appName}">{appName}</li>';
			var $ul  = $('<ul></ul>');
			results.forEach(function(result){
				var i = item.replace(/{appId}/, result["appId"])
							   .replace(/{appName}/g, result["appName"]);
				var $i = $(i);
				if(DATA.allappjqdom[result["appId"]].is(':visible')){
					$i.addClass('u-app-pro-search-items-checked');
				}
				$ul.append($i);
			});
			$dom.empty().append($ul);
		}
	}
	/**
	 * 生成具体的表格
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $tableConDom [description]
	 * @return {[type]}                [description]
	 */
	function displayTable($container){
		/*
			接口的url地址
		 */
		var url = 'common.asp?optType=dpiAppPriority|timePlan';
		var Async = require('P_core/Async');
		Async.async([url], function(jsStr){
			if(jsStr !== false){
				/*
					处理js字符串并返回数据库引用
				 */
				var database  = getDBFromJsStr(jsStr);
				/*
					将数据库引用存入DATA变量
				 */
				DATA["db"]    = database;
				/*
					获取表格dom
				 */
				var $tableDom = getTableDom(database);
				/*
					将包裹容器清空
					并把表格放入
		 		 */
		 				// 清空标签页容器
				$container.empty();
//				changePath('');
				/*
					生成表格容器
				 */
				var $tableConDom = getTableConDom();
				$container.append($tableConDom);
		 		$tableConDom.empty().append($tableDom);
		 			/* 加入使用场景 */
		 		var $appplace = displayAppPlace().css({float:'right'});
		 		$tableConDom.after($appplace);
		 			/* 加入移动到组件 */
		 		displayMoveTo($tableConDom)
		 		
		 			/* 加入右上角小开关*/
		 		displayOnOff();	
		 		
			}else{
				console.log('js error');
			}
		});
	}
		/* 右上角小开关*/
	function displayOnOff(){
		var OnOff = require('P_plugin/OnOff');
	    var $onoff = OnOff.getDom({
	        prevWord:T('Application_priority')+' :',
	        afterWord:'',
	        id:'checkOpen',
	        defaultType:DATA["gloen"] == 1?true:false,
	        clickFunc:function($btn,typeAfterClick){
				var AppGloEn = (typeAfterClick == 1?'on':'off');
				var postQueryStr = 'AppGloEn='+ AppGloEn + '&type=app' + "&limitRatio=" + DATA["limitRatio"];
				//console.log(postQueryStr);
				$.ajax({
				url : 'goform/formBehAndAppGloSetting',
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
							$('.nav a[href="#1"]').trigger('click');
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
		/* 移动到组件*/
	function displayMoveTo($tableConDom){
		
		var MoveTo = require('P_plugin/MoveTo');
		var newRuleNameArr = [];
		DATA["allDatas"].forEach(function(obj,i){
			newRuleNameArr.push(obj.ruleName);
		})
	    var $moveto = MoveTo.getDom({
	        select : newRuleNameArr,
	        url    : 'goform/formAppPriorityMoveConfig',
	        str1      : 'newname',  
	        str2      : 'oldname', 
	        saveSuccess : function($btn){
                    $('[href="#1"]').trigger('click');          
                }
	    });
	    MoveTo.joinContent($tableConDom,$moveto);
	}
		/**应用场景**/
	function displayAppPlace(){
		var inputlists = [
			{
				prevWord:'{Usage_scenarios}',
				inputData:{
					type:'select',
					name:'appType',
					defaultValue:DATA["appType"] || '',
					items:DATA["appTypeList"] || [{name:'{user_defined}',value:''}]
				}
			}
		];
		var IG = require('InputGroup');
		var $usePlace = IG.getDom(inputlists);
		var btnlist = [{
			id:'changeAppType',
            name : '{ensure}',
            clickFunc :function($thisDom){
                $.ajax({
                	type:"post",
                	url:"/goform/formApplicationScenarios",
                	data:'sceneName='+($usePlace.find('[name="appType"]').val()),
					success:function(result){
						eval(result);
						if(eval('status')){
							var Tips = require('Tips');
							Tips.showSuccess('{SettingSuccess}');
							displayRuleTable($('#1'));
						}
					}
                });
            }
			
		}];
		IG.insertBtn($usePlace,'appType',btnlist);
		// 修改应用场景下拉的宽度
		$usePlace.find('[name="appType"]').css({width:'100px'});
		translate([$usePlace]);
		return $usePlace;
	}
	function getAppsByBit(bit){
		var apps   = DATA["apps"],
			groups = DATA["groups"];
		var Funcs = require('Functions');
		var binaryArr = ('0' + Funcs.hexadecimalToBinary(bit)).split('');
		var appArr = [];
		for(var index = 1, len = binaryArr.length; index < len; index++){
			if(binaryArr[index] == '1'){
				apps.forEach(function(app){
					if(app.id == index){
						appArr.push(app.n);
					}
				})
			}
		}
//		if(appArr.length == 0){
//			return '';
//		}else{
			return appArr.join(', ') /* + '...' */;
//		}
	}
	function getServerUser(rule){
		var orgType = rule["behOrgType"],
			orgNames = rule["orgNames"],
			orgIP   = rule["behOrgIp"];
		var serverUser = '';
		switch(orgType){
			case 'all':
				serverUser = '{allUser}';
				break;
			case 'org':
				serverUser = orgNames;
				break;
			case 'ip':
				serverUser = orgIP;
				break;
			default :
				serverUser = '{allUser}';
		}
		return serverUser;
	}
	/**
	 * 处理js字符串,并存入数据表,并返回数据库引用
	 * @author JeremyZhang
	 * @date   2016-11-23
	 * @param  {[type]}   jsStr [description]
	 * @return {[type]}         [description]
	 */
	function getDBFromJsStr(jsStr){
		var Eval = require('Eval');
		var variables = ['allDatas', 'appData', 'groupData', 'timeRangeNames','appTypeList','appType','gloen','rxBands','txBands','wanIfCount','limitRatio','rateLimit'];
		var result    = Eval.doEval(jsStr, variables),
			isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data     = result["data"],
				ruleData = data["allDatas"],
				apps     = data["appData"],
				groups   = data["groupData"],
				times    = data["timeRangeNames"],
				gloen    = data["gloen"];
			DATA["apps"] = apps;
			DATA["groups"] = groups; 
			DATA["times"] = times;
			DATA["gloen"] = gloen;
			DATA["appTypeList"] = data.appTypeList;
			DATA["appType"] = data.appType;
			DATA["allDatas"] = data.allDatas;

			DATA['txBands']=data['txBands'];
			DATA['rxBands']=data['rxBands'];
			DATA['wanCount']=data['wanIfCount'];
			DATA['limitRatio']=data['limitRatio'];

			rateLimit = data["rateLimit"];

			var arrData = [];
			ruleData.forEach(function(rule, index){
				arrData.push([
					index + 1,
					rule["id"],
					rule["status"],
					rule["ruleName"],
					rule["comment"],
					rule["behOrgType"],
					getServerUser(rule),
					rule["appForbidBit"],
					getAppsByBit(rule["appForbidBit"]),
					(rule["effecttime"] === '' ? '{allday}' : rule["effecttime"]),
					rule["orgData"],
					rule["orgNames"],
					rule["behOrgIp"],
					rule["priority"],				
					rule["uRate"],
					rule["dRate"],
					(Number(index)+1),
					data.rxBands,
					data.txBands
				]);

			})
			/*
				引入数据库模块
				并创建一个新的数据表
			 */
			var Database = require('Database');
			var database = Database.getDatabaseObj();
			/*
				声明数据表的字段
				将数据存入数据表
			 */
			var fields   = ['id', 'ruleID', 'isOpen', 'ruleName', 'comment', 
						'behOrgType', 'serverUser','bit', 'servers', 'effecttime', 'behOrgData', 'behOrgNames', 'behOrgIp','priority', 'uRate','dRate','order','rxBands','txBands'];
			database.addTitle(fields);
			database.addData(arrData);
			return database;
		}else{
			return false;
		}
	}
	function importBtnClick() {
		var modalList = {
		"id": "import_file",
		"size":'normal',
		"title": "{import}",
		"btns" : [
		{
		    "type"      : 'save',
		    "clickFunc" : function($this){
			var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
			
            var dom = $this.parents('.modal').find('[name="filename"]')[0];
            var files = dom.files[0];
            var name = files.name;
           
                	
			// $this 代表这个按钮的jQuery对象，一般不会用到
			if($dom.find('[name="fileSrc"]').val()==''){
				require('Tips').showWarning('{nofileInput}',3);
			}else{
				var formData = new FormData($('#thisform1')[0]);
				$.ajax({
					type:"post",
					url:"/goform/formAppPriorityImport",
					data:formData,
					async: false,  
			        cache: false,  
			        contentType: false,  
			        processData: false, 
				success: function(result) {
				// 执行返回的JS代码
				var Tips = require('Tips');
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
				if (isSuccessful == 1) {
					DATA['daorumodalobj'].hide();
				    Tips.showSuccess('{importSuccess}')
				    $('.nav a[href="#1"]').trigger('click');
				} else {
				    var errorstr=data.errorstr;
				    Tips.showError(errorstr);
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
			"type"      : 'close'
		    }
		]
	    };
	    var inputList = [
	    {
		"prevWord": '{choose_file}',
		"inputData": {
		    "type": 'text',
		    "name": 'fileSrc'
		},
		"afterWord": ''
	    }
	    ];
	    //获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    DATA['daorumodalobj'] = modaobj;
	    //获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    //添加到指定位置
	    $modal.find('.modal-body').empty().append($dom);
	    $('body').append($modal);
	    var btnslist = [
	    {
			"name":'{choose_file}',
			"id":'chooseFile',
			"clickFunc":function($this){

			}					
	    }
	    ];
	    InputGroup.insertBtn($dom,'fileSrc',btnslist);

	    $dom.find('[name="fileSrc"]').after('<input type="file" name="filename" style="display:none" />');
		
		//选择文件模拟点击
		$dom.find('#chooseFile').click(function(){$($dom.find('[name="filename"]').click())});
	   
	   $dom.find('[name="filename"]').change(function(){
			$dom.find('[name="fileSrc"]').val($(this).val().substr($(this).val().lastIndexOf('\\')+1));
	    });

	     $dom.wrap('<form id="thisform1" name="thisform1" enctype ="multipart/form-data"></form>');
	    modaobj.show();		
	    
		var Translate  = require('Translate');
		var tranDomArr = [$modal];
		Translate.translate(tranDomArr, DicArr);	  
	}

	/**
	 * 获得表格dom
	 * @author JeremyZhang
	 * @date   2016-11-23
	 * @param  {[type]}   database [description]
	 * @return {[type]}            [description]
	 */
	function getTableDom(database){
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id"        : "add",
				"name"      : "{add}",
				"clickFunc" : function(){
					displayAdd();
				}
			}, 
			{
				"id"        : "delete",
				"name"      : "{delete}",
				"clickFunc" : function(){
					deleteAllBtnClick();
				}
			},
			{
				"id"        : "import",
				"name"      : "{import}",
				"clickFunc" : function($btn){
					$btn.blur();
					importBtnClick();
				}
			},
			{
				"id"        : "export",
				"name"      : "{export}",
				"clickFunc" : function($btn){
					$btn.blur();
					if($btn.next().attr('name') == 'Device_Config'){
								$btn.next().remove();
					}
					var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
					$btn.after($afterdom);
					$afterdom[0].action ="/goform/formAppPriorityExport";
					$afterdom[0].submit();
				}
			}
		];
		// 表格上方操作区域配置数据
		var tableHeadData = {
			"btns"     : btnList
		};
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : true,       // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"ID" : {
					"key"    : 'id',
					"type"   : 'text'
				},
				"{rule}{name}" : {
					"key"    : "ruleName",
					"type"   : "text"
				},
				"{open}" : {
					"key"    : "isOpen",
					"type"   : "checkbox",
					"values" : {
						'1' : true,
						'0' : false
					},
					clickFunc : function($checkbox){
						handleStatusCheckboxClick($checkbox);
					}
				},
				"{Execution_order}" : {
					"key"    : "order",
					"type"   : "text"
				},
				"{priority}" : {
					"key"    : "priority",
					"type"   : "text",
					"filter" :function(oldstr){
						var newstr = oldstr;
//						switch(oldstr){
//							case '1':
//								newstr = '高';break;
//							case '2':
//								newstr = '中';break;
//							case '3':
//								newstr = '低';break;
//							default:
//								break;
//								
//						}
						return newstr;
					}
					
				},
				"{users}" : {
					"key" : "serverUser",
					"type" : 'text',
					"maxLength":31
				},
				"{app}{server}" : {
					"key" : "servers",
					"type": 'text',
					"maxLength":10
				},
				"{uRate}": {
					"key" : "uRate",
					"type": "text",
					"filter" :function(oldstr){
						var newstr = ""; 
						if (oldstr == "0") {
							newstr = "{nolimit}";
						} else {
							newstr = oldstr+"Kbps";
						}
						return newstr;
					}
				},
				"{dRate}": {
					"key" : "dRate",
					"type": "text",
					"filter" :function(oldstr){
						var newstr = ""; 
						if (oldstr == "0") {
							newstr = "{nolimit}";
						} else {
							newstr = oldstr+"Kbps";
						}
						return newstr;
					}
				},
				"{effecttime}" : {
					"key" : "effecttime",
					"type" : "text"
				},
				"{comment}" : {
					"key"    : "comment",
					"type"   : "text"
				},
				"{edit}": {
					"type": "btns",
					"btns": [
						{
							"type"      : "edit",
							"clickFunc" : function($this){
								displayEdit($this);
							}
						},
						{
							"type"      : "delete",
							"clickFunc" : function($this){
								deleteBtnClick($this);
							}
						}
					]
				}
			},
			"hideColumns" : [],
			"dicArr"      : DicArr
		};
		if (!rateLimit) {
			tableSettings.hideColumns.push("{uRate}");
			tableSettings.hideColumns.push("{dRate}");
		}
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				head  : tableHeadData,
				table : tableSettings
			}),
			tableDom  = tableObj.getDom();
		/*
			将表格对象存入全局变量
		 */
		DATA["tableObj"] = tableObj;
		return tableDom;
	}
	/**
	 * 根据主键从数据表中提取一条数据
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   primaryKey [description]
	 * @return {[type]}              [description]
	 */
	function getDataByPrimaryKey(primaryKey){
		var database   = DATA["db"];
		var data       = database.getSelect({
			primaryKey : primaryKey
		})[0];
		return data;
	}
	/**
	 * 从表格中操作按钮中获得主键，并提取数据
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function getDataByBtn($btn){
		var primaryKey = $btn.attr('data-primaryKey');
		var data       = getDataByPrimaryKey(primaryKey);
		return data;
	}
	/**
	 * 处理表格中开启按钮的点击事件
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $checkbox [description]
	 * @return {[type]}             [description]
	 */
	function handleStatusCheckboxClick($checkbox){
		var data = getDataByBtn($checkbox);
		changeStatus(data);
	}
	/**
	 * 修改一条规则的状态
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   data [description]
	 * @return {[type]}        [description]
	 */
	function changeStatus(data){
		/*
			修改状态
		 */
		var postDataJson = {
			type : 'edit',
			ruleName   : data["ruleName"],
			oldName    : data["ruleName"],
			comment    : data["comment"],
			bit        : data["bit"],
			priority   : data["priority"],
			uRate      : data["uRate"],
			dRate      : data["dRate"],
			orgType    : data["behOrgType"],
			orgData    : data["behOrgData"],
			orgIp      : data["behOrgIp"],
			effecttime : data["effecttime"],
			status     : data["isOpen"] == '1' ? '0' : '1'
		};
		editRule(postDataJson);
	}
	/**
	 * 表格上方删除按钮点击事件
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @return {[type]}   [description]
	 */
	function deleteAllBtnClick(){
		var tableObj        = DATA["tableObj"];
		// 获得到了所有选中的输入框所在行数据的主键 组成的数组
		var primaryKeyArr   = tableObj.getSelectInputKey('data-primaryKey');
		if(primaryKeyArr.length > 0){
			var Tips        = require('Tips');
			Tips.showConfirm(T('{confirm}{delete}?'), function(){
				var ruleNames     = [];
				primaryKeyArr.forEach(function(primaryKey){
					var data    = getDataByPrimaryKey(primaryKey);
					var ruleName  = data["ruleName"];
					ruleNames.push(ruleName);
				});
				deleteRules(ruleNames);
			}, function(){

			}, []);
		}else{
			var Tips = require('Tips');
			Tips.showWarning(T('{unSelectDelTarget}'));
		}

	}
	/**
	 * 每一行数据中的删除按钮点击事件
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function deleteBtnClick($btn){
		var Tips = require('Tips');
		Tips.showConfirm(T('{confirm}{delete}?'), function(){
			var data    = getDataByBtn($btn);
			var ruleName  = data['ruleName'];
			deleteRules([ruleName]);
		},function(){

		}, [])
	}
	/**
	 * 删除规则
	 * 向后台发送数据，并使用 showDeleteRes 函数处理删除的结果
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @param  {[type]}   ruleIDs [description]
	 * @return {[type]}           [description]
	 */
	function deleteRules(ruleNames){
		var queryStr = 'ruleName=' + ruleNames.join(',');
		queryStr = queryStr + '&deltype=app';
		$.ajax({
			url     : 'goform/formDelBehaveManage',
			type    : 'POST',
			data    : queryStr,
			success : function(jsStr){
				showDeleteRes(jsStr);
			}
		});
	}
	/**
	 * 处理删除是否成功还是失败
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @param  {[type]}   jsStr [description]
	 * @return {[type]}         [description]
	 */
	function showDeleteRes(jsStr){
		var Eval      = require('Eval');
		var Tips      = require('Tips');
		var variables = ["status",'errorstr'];
		var result    = Eval.doEval(jsStr, variables),
			isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data   = result["data"],
				status = data["status"];
			if(status == '1'){
				Tips.showSuccess('{delSuccess}');
				displayRuleTable(DATA["conDom"]);
			}else{
				var errorStr = data["errorstr"];
				Tips.showWarning('{delFail}' + errorStr);
			}
		}
		
	}
	function cloneArr(arr){
		var Func = require('P_core/Functions');
		return Func.cloneArr(arr);
	}
	/**
	 * 获得表格包裹容器的dom
	 * @date   2016-11-23
	 * @return {[type]}   [description]
	 */
	function getTableConDom(){
		var TableContainer = require('P_template/common/TableContainer');
		var html           = TableContainer.getHTML({}),
			$tableCon      = $(html);
		return $tableCon;
	}
	function T(str){
		var Translate = require('Translate');
		var s = Translate.getValue(str, DicArr);
		return s
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
