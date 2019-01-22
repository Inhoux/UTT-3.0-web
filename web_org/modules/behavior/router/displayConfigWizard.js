define(function(require, exports, module) {
	require('jquery');
	DATA = {};
	DATA['str']=[];
	DATA['url']=[];
	
	DATA.RAISECOM = require('P_config/config').RAISECOM;
	var Tips = require('Tips');
	var dicArr = ['common','doRFT'];
	
	var Translate  = require('Translate');
	function T(_str){
	    return Translate.getValue(_str, dicArr);
	}

	// 入口
	function display($container) {
		// 内页面显示及顺序
		var arr = [1,2,3,4];
		DATA["arr"] = arr;	
		// 默认先显示第一个页面
		DATA['pagekey'] = arr[0];
		
		// 页面配置
		if(DATA.RAISECOM == 1){
			var pagedata = {
					'1':{
						title :'配置向导',
						func  :display1,
						save  :save1,
						ajax  :ajax1
						},
					'2':{
						title :'无线配置',
						func  :display3,
						save  :save3,
						ajax  :ajax3,				
					},
					'3':{
						title :'射频配置',
						func  :display4,
						save  :save4,
						ajax  :ajax4,				
					},
					'4':{
						title :'WAN口配置',
						func  :display2,
						save  :save2,
						ajax  :ajax2,				
					}
		};
		}else{
		var pagedata = {
					'1':{
						title :'{wizard}',
						func  :display1,
						save  :save1,
						ajax  :ajax1
						},
					'2':{
						title :'{accessMode}',
						func  :display2,
						save  :save2,
						ajax  :ajax2,				
					},
					'3':{
						title :'无线扩展',
						func  :display3,
						save  :save3,
						ajax  :ajax3,				
					},
					'4':{
						title :'射频模板',
						func  :display4,
						save  :save4,
						ajax  :ajax4,				
					}
					//'4':{
					//	title :'{accessMode}',
					//	func  :display2,
					//	save  :save2,
					//	ajax  :ajax2,				
					//}
		};}
		DATA["pagedata"] = pagedata;
		DATA["$container"] = $container;
		DATA['pagedata'][DATA['pagekey']].ajax();


	}
	function save1(callback){
		if($('[name="autoPop"]').is(':checked')){
			DATA["str"][0]= "notPopUp=on";
		}else{
			DATA["str"][0] = "notPopUp=off";
		}
		DATA["url"][0]= "formFastConfPop";
		if(callback){
			callback();
		}
		
	}
	function save2(callback){
		
		
		var Serialize = require('Serialize');
		// 将取到的值转换为json
		var queryArr = Serialize.getQueryArrs(DATA["$container"]),
			queryJson = Serialize.queryArrsToJson(queryArr);
			if(queryJson.staticSecDns.length == 0){
				queryJson.staticSecDns = '0.0.0.0';
			}
		var saveFlag=1;
		
		if(queryJson.connectionTypew == "STATIC"){
			if(DATA.RAISECOM == 1)
			{
			    DATA.wt = require('Tips').showTimer('{WaitForSaveConfig}',10,function(){});
			}
			$.ajax({
			url: 'common.asp?optType=WanConfig',
			type: 'GET',
			async: false,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr=result,variableArr = ['IPs'];;
				result=doEval.doEval(codeStr,variableArr);
				DATA["WANIP"]=result.data["IPs"];
				DATA["WANIP"].forEach(function(item, index, arr) {
					if(index !=0 && queryJson.staticIp == DATA['WANIP'][index]){
						Tips.showError("WAN1 "+"{and}"+"WAN "+parseInt(index+1)+"{cannotbesame}");
						saveFlag=0;
					}});}
			});
		}

		if(saveFlag == 0 || require('InputGroup').checkErr(DATA["$container"])>0){

		}else{
			var	queryStr = Serialize.queryJsonToStr(queryJson);
			DATA['str'][1]=queryStr;
			DATA['url'][1]="formConfigFastDirection";
			if(callback){
				callback();
			}
		}

	}
	
	/**
	 * 展示页面
	 * @param 导航数组[1,2] arr
	 * @param 导航数据json  pagedata
	 * @param 父节点                      $con
	 */
	function showPage(arr,pagedata,$con){
		

		//制作头部
		var tophtml = '';
		for(var i in arr){
			var pgtitle = pagedata[arr[i]].title; //标题名称
			var num = i;		//标题数字
			
			
			// tophtml += '<div data-local="'+pagedata[arr[i]].title+'" class="u-wizard-top '+(i==0?'u-wizard-top-first':'')+(arr[i] == DATA['pagekey']?' u-wizard-isopen':'')+'">'+pagedata[arr[i]].title+'</div>';
			if(DATA.RAISECOM == 1){
				tophtml += '<div class="u-wd-top '+(arr[i] == DATA['pagekey']?' u-wd-isopen':'')+'" >'+
								'<div class="u-wd-num">'+(Number(num)+1)+'</div>'+
						   		'<div class="u-wd-titlespan" data-local="'+pgtitle+'">'+pgtitle+'</div>'+
						   '</div>';
				
				if(i != (arr.length-1)){
					tophtml += '<div class="u-wd-toline '+(arr[i] == DATA['pagekey']?' u-wd-to':' u-wd-line')+'" ></div>';
				}
			}else{
				tophtml += '<div class="u-wizard-top '+(arr[i] == DATA['pagekey']?' u-wizard-isopen':'')+'" >'+
					   		'<div class="u-wizard-num">'+(Number(num)+1)+'</div>'+
					   		'<div class="u-wizard-titlespan" data-local="'+pgtitle+'">'+pgtitle+'</div>'+
					   '</div>';
			}
			
			
					   
			
					   
		}
		var $ptop = $('<div class="u-wizard-top-cover"></div>');
		$ptop.append(tophtml);
		
		
		//制作中间
		var $midDom = '';
		if(pagedata[DATA['pagekey']].func){
			$midDom = pagedata[DATA['pagekey']].func();
			
			
		}
		
		
		//制作底部
		var nums = 0;
		for(var i in arr){
			if(DATA['pagekey'] == arr[i]){
				nums = i;
			}
		}
		var btnlist = [];
		if(nums==0){
			//第一个
			btnlist =[
				 {
			        "id"        : 'exit',
			        "name"      : '{quitWizard}',
			        "clickFunc" : function($btn){
			            redirect();
			        }
			    },
			    {
			        "id"        : 'next',
			        "name"      : '{nextStep}',
			        "clickFunc" : function($btn){
			            if(require('InputGroup').checkErr($('#1')) > 0){
							return false;
						}
			            var nowpage = '';
			           	for(var i in arr){
			           		if(arr[i] == DATA['pagekey']){
			           			if(arr[Number(i)+1]){
			           				nowpage = arr[Number(i)+1];
			           			}
			           		}
			           	}
			           	 DATA['pagedata'][DATA['pagekey']].save();
			           	DATA['pagekey'] = nowpage;
			            DATA['pagedata'][DATA['pagekey']].ajax();
			           
			        }
			    }
			];
			
		}else if(nums == (arr.length-1)){
			//最后一个
			btnlist =[
				{
			        "id"        : 'prev',
			        "name"      : '上一页',
			        "clickFunc" : function($btn){
			             	var nowpage = '';
				           	for(var i in arr){
				           		if(arr[i] == DATA['pagekey']){
				           			if(arr[Number(i)-1]){
				           				nowpage = arr[Number(i)-1];
				           			}
				           		}
				           	}

				           	DATA['pagekey'] = nowpage;
			           	 DATA['pagedata'][DATA['pagekey']].ajax();
			        }
			    },
			     {
			        "id"        : 'reset',
			        "name"      : '{reset}',
			        "clickFunc" : function($btn){
			            
			        }
			    },
				 {
			        "id"        : 'exit',
			        "name"      : '{quitWizard}',
			        "clickFunc" : function($btn){
			            redirect(); 
			        }
			    },
			    {
			        "id"        : 'okey',
			        "name"      : '{save}',
			        "clickFunc" : function($btn){
			            console.dir(DATA);
			            if(require('InputGroup').checkErr($('#1')) > 0){
							return false;
						}
			            
			            DATA['pagedata'][DATA['pagekey']].save(callback);
     		  	        DATA.wt = require('Tips').showTimer('{WaitForSaveConfig}',10,function(){}); 
                    
                    }
			    }
			];
			
			
		}else if(num == (arr.length-2)){
			btnlist =[
				{
			        "id"        : 'prev',
			        "name"      : '上一页'/*'{preStep}'*/,
			        "clickFunc" : function($btn){
			           	 var nowpage = '';
				           	for(var i in arr){
				           		if(arr[i] == DATA['pagekey']){
				           			if(arr[Number(i)-1]){
				           				nowpage = arr[Number(i)-1];
				           			}
				           		}
				           	}
				           	DATA['pagekey'] = nowpage;
			            DATA['pagedata'][DATA['pagekey']].ajax();
			        }
			    },
			   {
			        "id"        : 'reset',
			        "name"      : '重填'/*'{reset}'*/,
			        "clickFunc" : function($btn){
			           
			        }
			    },
				 {
			        "id"        : 'exit',
			        "name"      : '退出向导'/*'{quitWizard}'*/,
			        "clickFunc" : function($btn){
			            redirect();
			        }
			    },
			    {
			        "id"        : 'next',
			        "name"      : '下一页'/*'{next}'*/,
			        "clickFunc" : function($btn){
			            if(require('InputGroup').checkErr($('#1')) > 0){
							return false;
						}
			           var nowpage = '';
			           	for(var i in arr){
			           		if(arr[i] == DATA['pagekey']){
			           			if(arr[Number(i)+1]){
			           				nowpage = arr[Number(i)+1];
			           			}
			           		}
			           	}
			           		 DATA['pagedata'][DATA['pagekey']].save();
			           	DATA['pagekey'] = nowpage;
			            DATA['pagedata'][DATA['pagekey']].ajax();
			        }
			    }
			];
		}else{
			//mid
			btnlist =[
				{
			        "id"        : 'prev',
			        "name"      : '上一页'/*'{preStep}'*/,
			        "clickFunc" : function($btn){
			           	 var nowpage = '';
				           	for(var i in arr){
				           		if(arr[i] == DATA['pagekey']){
				           			if(arr[Number(i)-1]){
				           				nowpage = arr[Number(i)-1];
				           			}
				           		}
				           	}
				           	DATA['pagekey'] = nowpage;
			            DATA['pagedata'][DATA['pagekey']].ajax();
			        }
			    },
			   {
			        "id"        : 'reset',
			        "name"      : '重填'/*'{reset}'*/,
			        "clickFunc" : function($btn){
			           
			        }
			    },
				 {
			        "id"        : 'exit',
			        "name"      : '退出向导'/*'{quitWizard}'*/,
			        "clickFunc" : function($btn){
			            redirect();
			        }
			    },
			    {
			        "id"        : 'next',
			        "name"      : '下一页'/*'{next}'*/,
			        "clickFunc" : function($btn){
			            if(require('InputGroup').checkErr($('#1')) > 0){
							return false;
						}
			           var nowpage = '';
			           	for(var i in arr){
			           		if(arr[i] == DATA['pagekey']){
			           			if(arr[Number(i)+1]){
			           				nowpage = arr[Number(i)+1];
			           			}
			           		}
			           	}
			           		 DATA['pagedata'][DATA['pagekey']].save();
			           	DATA['pagekey'] = nowpage;
			            DATA['pagedata'][DATA['pagekey']].ajax();
			        }
			    }
			];
		}
		var Btn = require('BtnGroup');
		var $btnDom = Btn.getDom(btnlist);
		
		
		//最外框
		var $pdiv = $('<div class="u-wizard-pdiv" ></div>');
		
		if(DATA.RAISECOM == 1){
		    if(DATA['pagekey'] == 3){
			$pdiv.css('width','930px')
		    }else{
			$pdiv.css('width','600px')
		    }
		}else{
		    if(DATA['pagekey'] == 4){
			$pdiv.css('width','930px')
		    }else{
			$pdiv.css('width','600px')
		    }
		}
		$pdiv.append($ptop,$midDom,$btnDom);
		$con.empty().append($pdiv);
		var Translate  = require('Translate');
		var tranDomArr = [$pdiv];
		var dicArr     = ['common','error','check'];
		Translate.translate(tranDomArr, dicArr);
	}
	 function callback(){
	 	
    	DATA.str.forEach(function(item,index,arr){
        	postF(DATA.str[index],DATA.url[index]);
        });
        
        	setTimeout(function(){
        		if(DATA['success']){
	        		redirect();
                }
	        },8000)

        
    }
	function redirect(){
		$('#sidebar').find('a[href="#/system_watcher/system_state"]').parent().trigger('click');
		$('#sidebar').find('a[href="#/system_watcher/system_state"]').parent().parent().prev().trigger('click');
	}
	//向导页-展示
	function display1(){
		if(DATA.RAISECOM == 1){
			var midstr1 = '<ul style="width:100%;margin-bottom:10px;list-style:disc">'+
					'<li data-local="{wizard2}"></li>'+
					'<li data-local="{wizard3}"></li>'+
		'</ul>';
		}else{
		var midstr1 = '<ul style="width:100%;margin-bottom:10px;list-style:disc">'+
					'<li data-local="{wizard1}"></li>'+
					'<li data-local="{wizard2}"></li>'+
					'<li data-local="{wizard3}"></li>'+
		'</ul>';}
		if(DATA["notPopUps"] == '1'){
			var midstr2 = '<input type="checkbox" checked name="autoPop"  /><span data-local="{wizard4}"> </span>';
		}else{
			var midstr2 = '<input type="checkbox" name="autoPop"  /><span data-local="{wizard4}"> </span>';
		}
		var $middiv = $('<div class="u-wizard-mid-div"></div>');
		$middiv.append(midstr1,midstr2);
		
		//绑定勾选框点击事件
		$middiv.find('[name="autoPop"]').click(function(){
			var tips = require('Tips');
			
			if($(this).is(':checked')){
				
				postF('notPopUp=on','formFastConfPop');
			}else{
				postF('notPopUp=off','formFastConfPop');
			}
		});
		
		return $middiv;
	}
	function ajax1(){
		$.ajax({
			url: 'common.asp?optType=fastConfigPop',
			type: 'GET',
			success: function(result) {
				var doEval 		= require('Eval');
				var codeStr=result,variableArr = ['notPopUps'];
				result=doEval.doEval(codeStr,variableArr);
				DATA["notPopUps"] = result['data']["notPopUps"];
				showPage(DATA["arr"],DATA["pagedata"],DATA["$container"]);
			}
		});
	}
	function ajax2(){
		$.ajax({
			url: 'common.asp?optType=fastConfigNet',
			type: 'GET',
			success: function(result) {
				function processData(jsStr) {
					console.log(jsStr)
					// 加载Eval模块
					var doEval 		= require('Eval');
					var codeStr 	= jsStr,
						variableArr = [
									"ConnTypes",
									"Masks",
									"IPs",
									"GateWays",
									"MainDnss",
									"SecDnss",
									"UserNames",
									"PassWds"
									];
					
					var result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];

						console.dir(result);
					if (isSuccess) {
						var data = result["data"];
						return data;
					} else {
						console.log('字符串解析失败')
					}
				}
				DATA['data2'] = processData(result);
				console.dir(DATA);
				showPage(DATA["arr"],DATA["pagedata"],DATA["$container"]);
				}
		});
	}
	//接入方式-展示
	function display2(){
		/*获取WAN数据*/
	
		var data=DATA['data2'];
		
		var inputList = [
			{
					"display" : true,  //是否显示：否
				    "inputData": {
				        "type"       : 'text',
				        "name"       : 'signWords',
				        "value"		 : ''
				    }

			},
			{
				"display"	:true,
				"prevWord"	:"{accessMode}",
				"inputData" :{
					"defaultValue" : data.ConnTypes,
					"type"		   : 'select',
					"name"		   : 'connectionTypew',
					"items" :[{
						"value"		: 'STATIC',
						"name"  	: '{staticAccess}',
						"control" 	: 'STATIC'
					},{
						"value"		:'DHCP',
						"name"		:'{domainAccess}',
						"control"	:'DHCP'
					},{
						"value"		:'PPPOE',
						"name"		:'{PPPoEAccess}',
						"control"	:'PPPOE'
					}]
				}
			},
			{
				"sign" 	:'STATIC',
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{ip}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'staticIp',
			        "value"		 : data.IPs,
			        "checkFuncs" : ['checkIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				"sign" 	:'STATIC',
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{netmask}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'staticNetmask',
			        "value"		 : data.Masks,
			        "checkFuncs" : ['re_checkMask'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				"sign" 	:'STATIC',
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{GwAddr}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'staticGateway',
			        "value"		 : data.GateWays,
			        "checkFuncs" : ['checkIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				"sign" 	:'STATIC',
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{mainDNSAddr}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'staticPriDns',
			        "value"		 : data.MainDnss,
			        "checkFuncs" : ['checkMainDns'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				"sign" 	:'STATIC',
				"display" : true,  //是否显示：否
				"necessary": false,  //是否添加红色星标：是
			    "prevWord": '{secDNSAddr}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'staticSecDns',
			        "value"		 : data.SecDnss,
			        "checkFuncs" : ['checkNullIP'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				"sign":'PPPOE',
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{username}',
			    "inputData": {
			        "type"       : 'text',
			        "name"       : 'pppoeUser',
			        "value"		 : data.UserNames,
			        "checkDemoFunc" : ['checkInput', 'name', '1', '31', 'ali'] //自定义含参方法[方法名，参数一，参数二]
			    }

			},
			{
				"sign":"PPPOE",
				"display" : true,  //是否显示：否
				"necessary": true,  //是否添加红色星标：是
			    "prevWord": '{pwd}',
			    "inputData": {
			        "type"       : 'password',
			        "name"       : 'pppoePass',
			        "value"		 : data.PassWds,
			        "checkDemoFunc" : ['checkInput', 'name', '1', '31', 'ali'],
			        "eye" : true
			    }

			},
		];
		var inputLists = inputList;
		var InputGroup = require('InputGroup');
		var $inputs = InputGroup.getDom(inputLists);
		
		/*
		   	添加 WAN1 配置提示文字
		 * */
		$inputs.find('[name="signWords"]').parent().prev().attr('colspan','3').css({paddingBottom:'3px'}).append('<span data-local="">本页面为WAN1口配置，请您根据自身情况进行配置</span>');
		$inputs.find('[name="signWords"]').parent().prev().find('label').remove();
		$inputs.find('[name="signWords"]').parent().next().remove();
		$inputs.find('[name="signWords"]').parent().remove();
		
		/*
			联想输入IP mac 方法
		*/
		var $dom = $inputs;
		var netmask = $dom.find('[name=staticNetmask]');
		var gateway = $dom.find('[name=staticGateway]');
		var pridns  = $dom.find('[name=staticPriDns]')
		$dom.find('[name="staticIp"]').on('input',function(){
			var ip = $(this).val();
        	var index = ip.substr(0,3);
        	var first = ip.indexOf('.');
            var last = ip.lastIndexOf(".");
            var pre  = ip.substring(0,last+1);
        	var mask = netmask;
        	//根据IP填写子网
        	if(ip.indexOf('.')>0){
        		if(index >= 1 && index<=127){
        			mask.val("255.0.0.0");
        		}else if(index >= 128 && index<=191){
        			mask.val("255.255.0.0");
        		}else if(index >= 192 ){
        			mask.val("255.255.255.0");
        		}
        	}else{
        		mask.val("");
        	}
        	if(ip){
        		//根据IP填写网关
	        	gateway.val(pre+'1');
	        	//根据IP填写主DNS服务器
	        	pridns.val(pre+'1');
        	}else{
        		gateway.val('');
        		pridns.val('');
        	}
		});
		
		var $middiv = $('<div class="u-wizard-mid-div"></div>');
		$middiv.append($inputs);

		return $middiv;
		
	}

	function ajax3(){
		$.ajax({
			url: 'common.asp?optType=getServiceZoneConfigSsid',
			type: 'GET',
			success: function(result) {
				function processData(jsStr) {
					console.log(jsStr)
					// 加载Eval模块
					var doEval 		= require('Eval');
					var codeStr 	= jsStr,
						variableArr = [
									"ssid",
									"pskPsswd",
									"encrytype",
									"isolateEn"
									];
					
					var result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];

						console.dir(result);
					if (isSuccess) {
						var data = result["data"];
						return data;
					} else {
						console.log('字符串解析失败')
					}
				}
				DATA['data3'] = processData(result);
				console.dir(DATA);
				
				showPage(DATA["arr"],DATA["pagedata"],DATA["$container"]);
				
				}
		});
	}
	function display3(){
		if(DATA.RAISECOM == 0){
		var inputList = [
			{
				"prevWord"	:'',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'signWords',
			        "value"      : '',
			    },
			    "afterWord": ''
			},
			{
		    	"necessary" :true,
		    	"prevWord"	:'SSID_2.4G',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'ssid',
			        "value"      : DATA['data3'].ssid[0],
			        "checkDemoFunc": ['checkInput', 'name', '1', '31',6] 
			    },
			    "afterWord": ''
			},
			{
		    	"prevWord"	:'预共享密钥',
		    	"necessary" : false,
			    "inputData" : {
			        "type"       : 'password',
			        "name"       : 'pskPsswd',
			        "value"	     : DATA['data3'].encrytype[0] == 3 ? DATA['data3'].pskPsswd[0] : '',
			        "eye"		:true,
			        "checkDemoFunc": ['checkDemoPasswordNULL', 'name', '8', '30', '5']
			    },
			    "afterWord": '出厂默认密码：88888888'
			},
			{
        		"sign":'gj',
				"prevWord"      :'无线客户端隔离',
    			"inputData" : {
        			"type"       : 'radio',
        			"name"       : 'isolateEn',
        			"defaultValue" : DATA['data3'].isolateEn[0] || "0",
        			items:[
                		{name:'开启' ,value:'1'},
                		{name:'关闭' ,value:'0'}
        			]
    			},
    			"afterWord": ''
			},
			{
		    	"necessary" :true,
		    	"prevWord"	:'SSID_5G',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'ssid_5',
			        "value"      : DATA['data3'].ssid[1],
			        "checkDemoFunc": ['checkInput', 'name', '1', '31',6] 
			    },
			    "afterWord": ''
			},
			{
		    	"prevWord"	:'预共享密钥',
		    	"necessary" : false,
			    "inputData" : {
			        "type"       : 'password',
			        "name"       : 'pskPsswd_5',
			        "value"	     : DATA['data3'].encrytype[1] == 3 ? DATA['data3'].pskPsswd[1] : '',
			        "eye"		:true,
			        "checkDemoFunc": ['checkDemoPasswordNULL', 'name', '8', '30', '5']
			    },
			    "afterWord": '出厂默认密码：88888888'
			},
			{
        		"sign":'gj',
				"prevWord"      :'无线客户端隔离',
    			"inputData" : {
        			"type"       : 'radio',
        			"name"       : 'isolateEn_5',
        			"defaultValue" : DATA['data3'].isolateEn[1] || "0",
        			items:[
                		{name:'开启' ,value:'1'},
                		{name:'关闭' ,value:'0'}
        			]
    			},
    			"afterWord": ''
			},

		];
		}else{
		var inputList = [
			{
				"prevWord"	:'',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'signWords',
			        "value"      : '',
			    },
			    "afterWord": ''
			},
			{
		    	"necessary" :true,
		    	"prevWord"	:'2.4G无线名称',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'ssid',
			        "value"      : DATA['data3'].ssid[0],
			        "checkDemoFunc": ['checkInput', 'name', '1', '31',6] 
			    },
			    "afterWord": ''
			},
			{
		    	"prevWord"	:'2.4G无线密码',
		    	"necessary" : false,
			    "inputData" : {
			        "type"       : 'password',
			        "name"       : 'pskPsswd',
			        "value"	     : DATA['data3'].encrytype[0] == 3 ? DATA['data3'].pskPsswd[0] : '',
			        "eye"		:true,
			        "checkDemoFunc": ['checkDemoPasswordNULL', 'name', '8', '30', '5']
			    },
			    "afterWord": ''
			},
			{
        		"sign":'gj',
				"prevWord"      :'无线客户端隔离',
    			"inputData" : {
        			"type"       : 'radio',
        			"name"       : 'isolateEn',
        			"defaultValue" : DATA['data3'].isolateEn[0] || "0",
        			items:[
                		{name:'开启' ,value:'1'},
                		{name:'关闭' ,value:'0'}
        			]
    			},
    			"afterWord": ''
			},
			{
		    	"necessary" :true,
		    	"prevWord"	:'5G无线名称',
			    "inputData" : {
			        "type"       : 'text',
			        "name"       : 'ssid_5',
			        "value"      : DATA['data3'].ssid[1],
			        "checkDemoFunc": ['checkInput', 'name', '1', '31',6] 
			    },
			    "afterWord": ''
			},
			{
		    	"prevWord"	:'5G无线密码',
		    	"necessary" : false,
			    "inputData" : {
			        "type"       : 'password',
			        "name"       : 'pskPsswd_5',
			        "value"	     : DATA['data3'].encrytype[1] == 3 ? DATA['data3'].pskPsswd[1] : '',
			        "eye"		:true,
			        "checkDemoFunc": ['checkDemoPasswordNULL', 'name', '8', '30', '5']
			    },
			    "afterWord": ''
			},
			{
        		"sign":'gj',
				"prevWord"      :'无线客户端隔离',
    			"inputData" : {
        			"type"       : 'radio',
        			"name"       : 'isolateEn_5',
        			"defaultValue" : DATA['data3'].isolateEn[1] || "0",
        			items:[
                		{name:'开启' ,value:'1'},
                		{name:'关闭' ,value:'0'}
        			]
    			},
    			"afterWord": ''
			},

		];
			
		}
		var InputGroup = require('InputGroup');
		var $inputs = InputGroup.getDom(inputList);
		/*
		   	添加 提示文字
		 * */
		 if(DATA.RAISECOM == 1){
			 $inputs.find('[name="signWords"]').parent().prev().attr('colspan','3').css({paddingBottom:'3px'}).append('<span data-local="">请设置无线名称和密码</span>');
			 }else{
			$inputs.find('[name="signWords"]').parent().prev().attr('colspan','3').css({paddingBottom:'3px'}).append('<span data-local="">请设置无线扩展的网络名称和密码</span>');
		 }
		$inputs.find('[name="signWords"]').parent().prev().find('label').remove();
		$inputs.find('[name="signWords"]').parent().next().remove();
		$inputs.find('[name="signWords"]').parent().remove();
		
		var $middiv = $('<div class="u-wizard-mid-div"></div>');
		$middiv.append($inputs);

		return $middiv;
	}
	function save3(callback){
		var Serialize = require('Serialize');
		// 将取到的值转换为json
		var queryArr = Serialize.getQueryArrs(DATA["$container"]),
		queryJson = Serialize.queryArrsToJson(queryArr);
		var jsons = queryJson;

		var g5json = {};

		for(var i in jsons){
		    if(i.indexOf('_5')>0){
			g5json[i.substr(0,i.length-2)] = jsons[i];
			delete jsons[i];
		    }
		}
		jsons.zonename = "default";
		g5json.zonename = "default_5G";
		$.ajax({
			url: 'goform/formServiceZoneConfigSsid',
			type: 'post',
			data:jsons,
			success: function(result) {
				$.ajax({
							url: 'goform/formServiceZoneConfigSsid',
							type: 'post',
							data: g5json,
							success: function(result) {
							    function processData(jsStr) {
								console.log(jsStr)
								    var doEval              = require('Eval');
								var codeStr     = jsStr,
								variableArr = [
								    "status",
								    "errorStr"
								];

								var result = doEval.doEval(codeStr, variableArr),
								isSuccess = result["isSuccessful"];

								console.dir(result);
								if (isSuccess) {

								    var data = result["data"];
								    if(data.status == 1){

								    }else{  
									Tips.showWarning(data.errorStr)
								    }

								} else {
								    console.log('字符串解析失败')
								}
							    }

							}
						    });
				function processData(jsStr) {
					console.log(jsStr)
					// 加载Eval模块
					var doEval 		= require('Eval');
					var codeStr 	= jsStr,
						variableArr = [
									"status",
									"errorStr"
									];
					
					var result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];

						console.dir(result);
					if (isSuccess) {

						var data = result["data"];
						if(data.status == 1){

						}else{
							Tips.showWarning(data.errorStr)
						}
						
					} else {
						console.log('字符串解析失败')
					}
				}
				
				}
		});
	}
	
	function ajax4(){
		
		$.ajax({
			url: 'common.asp?optType=aspOutPutApConfTempList',
			type: 'GET',
			success: function(res) {
				   var doEval = require('Eval');
				   var variableArr = [
					   'tmpname',  // 模板名称
					   'wlFres',   // 2.4G / 5G
					   'wlModes',  // 模式
					   'channels',  // 信道
					   'wlRates',  // 速率
					   'powers' ,// 功率
					   'cliMaxNum'//最大客户端连接数
					   
				   ]; 
				   var result = doEval.doEval(res, variableArr);
				   if (!result.isSuccessful) {
				       Tips.showError('{parseStrErr}');
				       return false;
				    }
				   
				    var data = result["data"];
				    console.log(res);
				    // 存入数据库
				    var Database = require('Database'),
					database = Database.getDatabaseObj(); // 数据库的引用
					// 存入全局变量DATA中，方便其他函数使用
					DATA["tableData"] = database;
					// 声明字段列表
					var fieldArr =[
						'ID',
						'tmpname',
						
						'wlModes',
					   	'channels',
					   	'powers',
					   	
					   	'wlModes5',
					   	'channels5',
					   	'powers5',
						'cliMaxNum5',
						'first5G5'
					];
					
					var baseData = [];
					var lg = data.tmpname.length;
					for(var i = 0;i<lg;i += 2){
						baseData.push([
							Number(i)/2+1,
							data.tmpname[i].substr(0,data.tmpname[i].length-2),
							data.wlModes[i],
							data.channels[i],
							data.powers[i],
							data.wlModes[i+1],
							data.channels[i+1],
							data.powers[i+1]
						]);
						
					}
					// 将数据存入数据表中
					database.addTitle(fieldArr);
					
					database.addData(baseData);
					
					
					if(data.tmpname.length>0){
						var newdata1 = database.getSelect({primaryKey : '0'})[0];
						var temname = newdata1.tmpname;
								$.ajax({
									type:"get",
									url:"common.asp?optType=getOneApConfTempEntry&tempName="+temname,
									success:function(result){
										 var doEval = require('Eval');
										 var variableArr = [
										  'wireless',  // 无线开关 true 
										  'sgi',   // 短间隔 true
										  'preamble', // 短前间隔 true
										  'wmm',  // wmm true
										  'rate',  // 无线速率 0 11 54 150 300 
										  'bw',  // 频道带宽
										  'channel', // 信道
										  'cliMaxNum',
										  'power', // 功率 0自动 1手动 
										  'manPower', // 1低 2中 3高
										  'mode', // 模式
										  'beaconPeriod',// Beacon 间隔
										  
										  'wireless5',  
										  'sgi5',   
										  'preamble5', 
										  'wmm5',  
										  'rate5',  
										  'bw5',  
										  'channel5',
										  'first5G5',
										  'cliMaxNum5',
										  'VHTBW', //  0 20/40  1 是 80M
										  'power5',
										  'manPower5',
										  'mode5',
										  'beaconPeriod5'
										 ]; 
									     var result = doEval.doEval(result, variableArr);
									     if (!result.isSuccessful) {
									         Tips.showError('{parseStrErr}');
									         return false;
									      }
									     
									     var newdata = result["data"];
									     newdata.tempName  = temname;
									    DATA.data4 = newdata;
									    showPage(DATA["arr"],DATA["pagedata"],DATA["$container"]);
									}
								});
					}else{
						DATA.data4 = {};
						showPage(DATA["arr"],DATA["pagedata"],DATA["$container"]);
					}
					
			}
		});

	}
	function display4(){

		var data4 = DATA.data4;
		console.log(data4)
		/* 设置左右两个并排列表 */
		var $divleft = $('<div id="divleft" style="position:relative;display:inline-block;width:350px;height:auto;"></div>');
		var $divright = $('<div id="divright" style="position:absolute;display:inline-block;width:350px;height:auto;left:400px;"></div>');
		
		$divleft.append(getLeftInputGroup(data4));
		$divright.append(getRightInputGroup(data4));
		$divleft.find('tr').children(':first').css('min-width','114px');
		$divright.find('tr').children(':first').css('min-width','114px');
		
		
		var $coverdom = $('<div style="position:relative;display:iblock;width:100%;height:auto;overflow:hidden"></div>');
		$coverdom.append($divleft,$divright);
		/*配置向导的外框*/
		var $middiv = $('<div class="u-wizard-mid-div"></div>');
		$middiv.append($coverdom);
		
		return $middiv;
	}
	/* 
	 	2.4G
	 * */
	function getLeftInputGroup(data){
		var inputList = [
			{
				"prevWord": '{template_name}',
				"disabled":((data.tempName == 'default' || data.tempName == 'default2' || data.tempName == 'default3')?true:false),
				"inputData": {
					"type": 'text',
					"name": 'name',
					"value": data.tempName || '',
					"checkDemoFunc" : ['checkInput', 'name', '1', '9', '2']
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '',
				"display"  : false,
				"inputData": {
					"type": 'text',
					"name": 'oldName',
					"value": data.tempName ||''
				},
				"afterWord": ''
			}, 
			{
				"inputData": {
					"type": 'title',
					"name" : '2.4G' ,
				}
			},
			{
				"prevWord": '{wireless_capability}',
				"inputData": {
					"type": 'radio',
					"name": 'en_wireless',
					defaultValue:data.wireless == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_mode}',
				"inputData": {
					"type": 'select', 
					"name": 'mode',
					defaultValue:data.mode || '3',
					items:[
						{name:'{_11g_only}',value:'1'},
						{name:'{_11n_only}',value:'2'},
						{name:'{_11b_g_n_mix}',value:'3'}
					]
				},
				"afterWord": ''
			}, 
			/*{
				"prevWord": '{地区}',
				"inputData": {
					"type": 'select',
					"name": 'dq2',
					defaultValue:'1',
					items:[
						{name:'{FCC}',value:'1'},
						{name:'{ETSI}',value:'2'},
						{name:'{日本}',value:'3'}
					]
				},
				"afterWord": ''
			}, */
			{
				"prevWord": '{wireless_channel}',
				"inputData": {
					"type": 'select',
					"name": 'channel',
					defaultValue:data.channel || '0',
					items:[
						{name:'{Nochannel}',value:'-1'},
						{name:'{auto}',value:'0'},
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'},
						{name:'6',value:'6'},
						{name:'7',value:'7'},
						{name:'8',value:'8'},
						{name:'9',value:'9'},
						{name:'10',value:'10'},
						{name:'11',value:'11'},
						{name:'12',value:'12'},
						{name:'13',value:'13'},
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{channel_bandwidth}',
				"inputData": {
					"type": 'select',
					"name": 'BW',
					defaultValue:(data.bw === undefined?'3':data.bw),
					items:[
						{name:'20M',value:'0'},
						{name:'40M',value:'3'},
						{name:'20/40M自动',value:'1'},
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{wireless_rate}',
				"inputData": {
					"type": 'select',
					"name": 'rate',
					defaultValue:data.rate || '0',
					items:[
						{name:'{auto}',value:'0'},
						{name:'11M',value:'11'},
						{name:'54M',value:'54'},
						{name:'150M',value:'150'},
						{name:'300M',value:'300'}
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{wireless_transpower}',
				display:false,
				"inputData": {
					"type": 'text',
					"name": 'power',
					"value":'1'
					
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_transpower}',
				"inputData": {
				    "type": 'text',
				    "name": 'manual',
				    "value": data.manPower || '100',
				    "checkDemoFunc":["checkNum","1","100",'int']
				},
				"afterWord": '%(1~100)'
			},
			{
				"prevWord": '{beacon_interval}',
				"inputData": {
					"type": 'text',
					"name": 'BeaconPeriod',
					"value": data.beaconPeriod || '100',
					"checkDemoFunc":["checkNum","20","999",'int']
					
				},
				"afterWord": 'ms'
			},
			{
				"prevWord": '最大客户数量',
				"inputData": {
					"type": 'text',
					"name": 'cliMaxNum',
					"value": data.cliMaxNum || '0',
					"checkDemoFunc":["checkNum","0","32",'int']
				},
				"afterWord": '0:表示不限制'
			},
			{
				"prevWord": '',
				display:false,
				"inputData": {
					"type": 'text',
					"name": 'gjxx',
					value:'',
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'WMM',
				display:false,
				"inputData": {
					"type": 'radio',
					"name": 'wmm',
					defaultValue:data.wmm == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '{short_interval}',
				display:false,
				"inputData": {
					"type": 'radio',
					"name": 'SGI',
					defaultValue:data.sgi == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '{short_number}',
				display:false,
				"inputData": {
					"type": 'radio',
					"name": 'preamble',
					defaultValue:data.preamble == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			}
			/*{
				"sign"    :'gjxx',
				"prevWord": '干扰免疫级别',
				"inputData": {
					"type": 'select',
					"name": 'grmyjb2',
					defaultValue:'1',
					items:[
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '信道切换通告次数',
				"inputData": {
					"type": 'select',
					"name": 'xdqhtgcs2',
					defaultValue:'1',
					items:[
						{name:'0',value:'0'},
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'},
						{name:'6',value:'6'},
						{name:'7',value:'7'},
						{name:'8',value:'8'},
						{name:'9',value:'9'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '后台频谱监测',
				"inputData": {
					"type": 'radio',
					"name": 'htppjc2',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				inputData:{
					type:'title',
					name:'客户端控制'
				}
			},
			{
				"sign"    :'gjxx',
				"prevWord": '频段切换模式',
				"inputData": {
					"type": 'select',
					"name": 'pdqhms',
					defaultValue:'1',
					items:[
						{name:'{优选5G赫兹}',value:'1'},
						{name:'{强制5G赫兹}',value:'2'},
						{name:'{已禁用}',value:'3'},
						{name:'{频段平衡}',value:'4'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '空口公平模式',
				"inputData": {
					"type": 'select',
					"name": 'kkgpms',
					defaultValue:'1',
					items:[
						{name:'{优选接入}',value:'1'},
						{name:'{公平接入}',value:'2'},
						{name:'{默认接入}',value:'3'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '后台频谱监测',
				"inputData": {
					"type": 'radio',
					"name": 'htppph',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'SLB计算间隔',
				"inputData": {
					"type": 'text',
					"name": 'SLBjsjg',
					value:''
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'SLB邻居匹配',
				"inputData": {
					"type": 'text',
					"name": 'SLBljpp',
					value:''
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'SLB阀值',
				"inputData": {
					"type": 'text',
					"name": 'SLBfz',
					value:''
				},
				"afterWord": ''
			}*/
		];
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		
		
		$dom.find('[name="gjxx"]').parent().prev().empty().append('<a class="u-inputLink" id="gjxxa" style="cursor:pointer">'+T('advanced_options')+'</a>');
		$dom.find('[name="gjxx"]').css('visibility','hidden');
		/*
		$dom.find('#gjxxa').click(function(){
			if($(this).hasClass('gjxx-active')){
				$(this).removeClass('gjxx-active');
				$(this).text(T('advanced_options'));
				$('#1').find('[data-control="gjxx"]').addClass('u-hide');
				
			}else{
				$(this).addClass('gjxx-active');
				$(this).text(T('hide_advanced_options'));
				$('#1').find('[data-control="gjxx"]').removeClass('u-hide');
			}
		});
		*/
		/*$dom.find('[name="power"]').css('width','75px');
		$dom.find('[name="power"]').after('<select name="manual" class="u-hide" style="width:75px;margin-left:10px"><option value="3">'+T('high')+'</option><option value="2">'+T('middle')+'</option><option value="1">'+T('low')+'</option></select>');
		$dom.find('[name="manual"]').children('option[value="'+(data.manPower||'1')+'"]').attr('selected','selected');
		$dom.find('[name="power"]').change(function(){
			makewxcsgl2Chaneg();
		});
		makewxcsgl2Chaneg();
		function makewxcsgl2Chaneg(){
			if($dom.find('[name="power"]').val() == '1'){
				$dom.find('[name="manual"]').removeClass('u-hide');
			}else{
				$dom.find('[name="manual"]').addClass('u-hide');
			}
			
		}*/
		
		/* 模式 与无线速率的交互*/
		var $mode = $dom.find('[name="mode"]');
		var $c_0 = $dom.find('[name="rate"]').children('[value="0"]');
		var $c_11 = $dom.find('[name="rate"]').children('[value="11"]');
		var $c_54= $dom.find('[name="rate"]').children('[value="54"]');
		var $c_150 = $dom.find('[name="rate"]').children('[value="150"]');
		var $c_300 = $dom.find('[name="rate"]').children('[value="300"]');
		var g24arr = [$c_0,$c_11,$c_54,$c_150,$c_300];
		var $rate = $dom.find('[name="rate"]');
		
		var $bw_40 = $dom.find('[name="BW"]').children('[value="3"]');
		var $bw_2040 = $dom.find('[name="BW"]').children('[value="1"]');
		var $bw = $dom.find('[name="BW"]');
		
		makeModeChange()
		$mode.change(function(){
			makeModeChange()
		});
		function makeModeChange(){
			var modval = $mode.val();
			if(modval == '1'){
				rmd([$c_0,$c_54]);
				$bw_40.hide();
				$bw_2040.hide();
				$bw.val('0');
			}else if(modval == '2'){
				
				rmd([$c_0,$c_150,$c_300]);
				$bw_40.show();
				$bw_2040.show();
			}else if(modval == '3'){
				rmd([$c_0]);
				$bw_40.show();
				$bw_2040.show();
			}
		}
		
		function rmd(arr){
			var rateval = $rate.val();
			var changeval = false;
			g24arr.forEach(function(arrobj){
				if(arr.indexOf(arrobj)>=0){
					arrobj.removeAttr('disabled');
					
				}else{
					arrobj.attr('disabled','disabled');
					if(rateval == arrobj.val()){
						changeval = true;
					}
				}
				if(changeval){
					$rate.val($rate.children(':not([disabled])').eq(0).val());
				}
			});
			
		}
		
		Translate.translate([$dom], dicArr);
		return $dom;
	}
	/*5G*/
	function getRightInputGroup(data){
		var inputList = [{
			"inputData": {
				"type": 'text',
				"name": 'hides',
				"value": ''
			},
			"afterWord": ''
		}, {
			"inputData": {
				"type": 'title',
				"name" : '5G' ,
			},
		},
		{
				"prevWord": '{wireless_capability}',
				"inputData": {
					"type": 'radio',
					"name": 'en_wireless_5',
					defaultValue:data.wireless5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_mode}',
				"inputData": {
					"type": 'select',
					"name": 'mode_5',
					defaultValue:data.mode5 || '6',
					items:[
						{name:'{_11_a_n_mix_only}',value:'5',control:'mode_no'},
						{name:'{_11_a_only}',value:'4',control:'mode_no'},
						{name:'{_11vht_AC_AN_A}'+' AC/AN/A',value:'6',control:'mode_ok'},
						{name:'{_11vht_AC_AN}'+' AC/AN',value:'7',control:'mode_ok'}
					]
				},
				"afterWord": ''
			}, 
			/*
			{
				"sign"	  : 'mode_ok',
				"prevWord": '{channel_bandwidth_VHT}',
				"inputData": {
					"type": 'select',
					"name": 'VHTBW',
					defaultValue:data.VHTBW || '0',
					items:[
						{name:'20/40',value:'0'},
						{name:'80M',value:'1'},
					]
				},
				"afterWord": ''
			}, 
			*/
			/*{
				"prevWord": '{地区}',
				"inputData": {
					"type": 'select',
					"name": 'dq5',
					defaultValue:'1',
					items:[
						{name:'{FCC}',value:'1'},
						{name:'{ETSI}',value:'2'},
						{name:'{日本}',value:'3'}
					]
				},
				"afterWord": ''
			},*/
			{
				"prevWord": '{wireless_channel}',
				"inputData": {
					"type": 'select',
					"name": 'channel_5',
					defaultValue:data.channel5 || '0',
					items:[
						{name:'{Nochannel}',value:'-1'},
						{name:'{auto}',value:'0'},
						{name:'36',value:'36'},
						{name:'40',value:'40'},
						{name:'44',value:'44'},
						{name:'48',value:'48'},
						{name:'52',value:'52'},
						{name:'56',value:'56'},
						{name:'60',value:'60'},
						{name:'64',value:'64'},
						{name:'149',value:'149'},
						{name:'153',value:'153'},
						{name:'157',value:'157'},
						{name:'161',value:'161'},
						{name:'165',value:'165'},
						
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{channel_bandwidth}',
				"inputData": {
					"type": 'select',
					"name": 'BW_5',
					defaultValue:(data.bw5 == undefined?'2':data.bw5),
					items:[
						{name:'20M',value:'0'},
						{name:'40M',value:'3'},
						{name:'20/40M自动',value:'1'},
						{name:'80M',value:'2'}
					]
				},
				"afterWord": ''
			},  
			/*{
				"prevWord": '{无线速率}',
				"inputData": {
					"type": 'select',
					"name": 'wxsl5',
					defaultValue:'auto',
					items:[
						{name:'{自动}',value:'auto'},
						{name:'11M',value:'11'},
						{name:'54M',value:'54'},
						{name:'150M',value:'150'},
						{name:'300M',value:'300'}
					]
				},
				"afterWord": ''
			},*/
			{
				"prevWord": '{wireless_transpower}',
				display:false,
				"inputData": {
					"type": 'text',
					"name": 'power_5',
					"value":'1'
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_transpower}',
				"inputData": {
				    "type": 'text',
				    "name": 'manual_5',
				    "value": data.manPower5 || '100',
				    "checkDemoFunc":["checkNum","1","100",'int']
				},
				"afterWord": '%(1~100)'
			},
			{
				"prevWord": '{beacon_interval}',
				"inputData": {
					"type": 'text',
					"name": 'BeaconPeriod_5',
					"value":data.beaconPeriod5 || '100',
					"checkDemoFunc":["checkInput","num","20","999"]
				},
				"afterWord": 'ms'
			},
			/*{   "sign"    : 'mode_no',
				"prevWord": '',
				"inputData": {
					"type": 'text',
					"name":'for_mode_no',
					'value':''
				},
				"afterWord": ''
			},*/
			{
				"prevWord": '最大客户数量',
				"inputData": {
					"type": 'text',
					"name": 'cliMaxNum_5',
					"value": data.cliMaxNum5 || '0',
					"checkDemoFunc":["checkNum","0","32",'int']
				},
				"afterWord": '0:表示不限制'
			},
			{
				"prevWord": '5G优先',
				"inputData": {
					"type": 'radio',
					"name": 'first5G_5',
					defaultValue:data.first5G5 || '0',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '',
				display:false,
				"inputData": {
					"type": 'text',
					"name": 'gjxx',
					value:'',
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'WMM',
				display:false,
				"inputData": {
					"type": 'radio',
					"name": 'wmm_5',
					defaultValue:data.wmm5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				display:false,
				"prevWord": '{short_interval}',
				"inputData": {
					"type": 'radio',
					"name": 'SGI_5',
					defaultValue:data.sgi5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				display:false,
				"prevWord": '{short_number}',
				"inputData": {
					"type": 'radio',
					"name": 'preamble_5',
					defaultValue:data.preamble5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			}
			/*{
				"sign"    :'gjxx',
				"prevWord": '干扰免疫级别',
				"inputData": {
					"type": 'select',
					"name": 'grmyjb5',
					defaultValue:'1',
					items:[
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '信道切换通告次数',
				"inputData": {
					"type": 'select',
					"name": 'xdqhtgcs5',
					defaultValue:'1',
					items:[
						{name:'0',value:'0'},
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'},
						{name:'6',value:'6'},
						{name:'7',value:'7'},
						{name:'8',value:'8'},
						{name:'9',value:'9'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '后台频谱监测',
				"inputData": {
					"type": 'radio',
					"name": 'htppjc5',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				inputData:{
					type:'title',
					name:'接入点控制'
				}
			},
			{
				"sign"    :'gjxx',
				"prevWord": '定制有效信道',
				"inputData": {
					"type": 'radio',
					"name": 'dzyxxd',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '最小传输功率',
				"inputData": {
					"type": 'select',
					"name": 'zxcsgl',
					defaultValue:'max',
					items:[
						{name:'3',value:'3'},
						{name:'6',value:'6'},
						{name:'9',value:'9'},
						{name:'12',value:'12'},
						{name:'15',value:'15'},
						{name:'18',value:'18'},
						{name:'21',value:'21'},
						{name:'24',value:'24'},
						{name:'27',value:'27'},
						{name:'30',value:'30'},
						{name:'33',value:'33'},
						{name:'最大值',value:'max'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '最大传输功率',
				"inputData": {
					"type": 'select',
					"name": 'zdcsgl',
					defaultValue:'max',
					items:[
						{name:'3',value:'3'},
						{name:'6',value:'6'},
						{name:'9',value:'9'},
						{name:'12',value:'12'},
						{name:'15',value:'15'},
						{name:'18',value:'18'},
						{name:'21',value:'21'},
						{name:'24',value:'24'},
						{name:'27',value:'27'},
						{name:'30',value:'30'},
						{name:'33',value:'33'},
						{name:'最大值',value:'max'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '客户端侦知',
				"inputData": {
					"type": 'radio',
					"name": 'khdzz',
					defaultValue:'0',
					items:[
						{name:'开启',value:'1'},
						{name:'关闭',value:'0'},
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '扫描',
				"inputData": {
					"type": 'radio',
					"name": 'sm',
					defaultValue:'0',
					items:[
						{name:'开启',value:'1'},
						{name:'关闭',value:'0'},
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '宽信道频段',
				"inputData": {
					"type": 'radio',
					"name": 'kxdpd',
					defaultValue:'0',
					items:[
						{name:'开启',value:'1'},
						{name:'关闭',value:'0'},
					]
				},
				"afterWord": ''
			}*/
		];
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		
		$dom.find('[name="for_mode_no"]').parent().css('height','30px');
		$dom.find('[name="for_mode_no"]').remove();
		
		$dom.find('[name="hides"]').css({'visibility':'hidden'});
		$dom.find('[name="gjxx"]').css({'visibility':'hidden'});
		
		/*$dom.find('[name="power_5"]').css('width','75px');
		$dom.find('[name="power_5"]').after('<select name="manual_5" class="u-hide" style="width:75px;margin-left:10px"><option value="3">'+T('high')+'</option><option value="2">'+T('middle')+'</option><option value="1">'+T('low')+'</option></select>');
		$dom.find('[name="manual_5"]').children('option[value="'+(data.manPower5||'1')+'"]').attr('selected','selected');
		$dom.find('[name="power_5"]').change(function(){
			makewxcsgl2Chaneg();
		});
		makewxcsgl2Chaneg();
		function makewxcsgl2Chaneg(){
			if($dom.find('[name="power_5"]').val() == '1'){
				$dom.find('[name="manual_5"]').removeClass('u-hide');
			}else{
				$dom.find('[name="manual_5"]').addClass('u-hide');
			}
			
		}*/
		
		$dom.find('[name="mode_5"]').change(function(){
			makew80MChaneg();
		});
		makew80MChaneg();
		
		function makew80MChaneg(){
			var $bw5 = $dom.find('[name="BW_5"]');
			var $_0 = $dom.find('[name="BW_5"]').children('[value="0"]');
			var $_3 = $dom.find('[name="BW_5"]').children('[value="3"]');
			var $_1 = $dom.find('[name="BW_5"]').children('[value="1"]');
			var $_2 = $dom.find('[name="BW_5"]').children('[value="2"]');
			if($dom.find('[name="mode_5"]').val() == '5'){
				if($bw5.val() == '2'){
					$bw5.val('1');
				}
				$_0.show();
				$_3.show();
				$_1.show();
				$_2.hide();
				
			}else if($dom.find('[name="mode_5"]').val() == '4'){
				$bw5.val('0');
				$_0.show();
				$_3.hide();
				$_1.hide();
				$_2.hide();
			}
			else{
//				$bw5.val('2');
				$_0.show();
				$_3.show();
				$_1.show();
				$_2.show();
			}
		}
		Translate.translate([$dom], dicArr);
		return $dom;
	}
	
	function save4(callback){
		
		var oldData = DATA.data4;
    	var IG = require('InputGroup');
    	if(IG.checkErr(DATA["$container"])>0){
    		return false;
    	}
        var srlz = require('Serialize');
		var arrs = srlz.getQueryArrs(DATA["$container"]);    
		var jsons = srlz.queryArrsToJson(arrs);
		
		var type = (jsons.oldName == ''?'add':'edit');
		jsons['action'] = (jsons.oldName == ''?'add':'edit');
		
		
		/* 区分2.4G 5G 数据*/
		var g5json = {};
		for(var i in jsons){
			if(i.indexOf('_5')>0){
				g5json[i.substr(0,i.length-2)] = jsons[i];
				delete jsons[i];
			}
		}

		g5json.VHTBW = jsons.VHTBW;
		g5json.name = jsons.name+"_5";
		g5json.oldName = jsons.oldName;
		g5json.action = jsons.action;
		g5json.wlFre = '1';
		g5json.rfAutoSend = '1';
		
		jsons.name = jsons.name+"_4";
		jsons.wlFre = '0';
		
		if(type=='add'){
			jsons.oldName = '';
			g5json.oldName = '';
		}else{
			g5json.oldName = jsons.oldName+'_5';
			jsons.oldName = jsons.oldName+"_4";
		}
		
		var str4 = srlz.queryJsonToStr(jsons);
		var str5 = srlz.queryJsonToStr(g5json);
		
		sendAjax(str4,str5,callback);
	}
	function sendAjax(datestr4,datestr5,callback){
		
		$.ajax({
			type:"post",
			url:"/goform/formConfigApConfTemp",
			data:datestr4,
			success:function(result){
				var doEval = require('Eval');
				var variableArr = ['status','errorstr'];
				var result = doEval.doEval(result, variableArr);
				var isSuccessful = result['isSuccessful'];
				// 判断字符串代码是否执行成功
				if(isSuccessful){
				    // 执行成功
				    var data = result['data'];
				    if(data.status){
				    	$.ajax({
							type:"post",
							url:"/goform/formConfigApConfTemp",
							data:datestr5,
							success:function(result){
								var doEval = require('Eval');
								var variableArr = ['status','errorstr'];
								var result = doEval.doEval(result, variableArr);
								var isSuccessful = result['isSuccessful'];
								// 判断字符串代码是否执行成功
								if(isSuccessful){
								    // 执行成功
								    var data = result['data'];
								    if(data.status){
								    		if(callback){
								    			callback();
								    		}
								    }else{
								    	Tips.showError(data.errorstr);
								    }
								}
							}
						});
				    }else{
				    	Tips.showError(data.errorstr);
				    }
				}
			}
		});
	}
	
	function postF(str,url) {
		console.log(url)
		var Tips = require('Tips');
		$.ajax({
			url: '/goform/'+url,
			type: 'POST',
			data: str,
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
						DATA['success'] = true;
						console.log(result+"~~~~~~~~~~Ajax id ok");
					} else {
						DATA['success'] = false;
						var errorStr = data['errorstr'];
						Tips.showWarning(errorStr, 2);
					}
				} else {
					DATA['success'] = false;
					Tips.showWarning('{netErr}', 2);
				}
			}
		});
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
