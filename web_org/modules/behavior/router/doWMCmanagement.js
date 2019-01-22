define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	function tl(str){
    	return require('Translate').getValue(str,['common','doConnectControl']);
  	}		
	exports.display = function(){
		var Path = require('Path');
		var Translate = require('Translate'); 
		var dicNames = ['common', 'doConnectControl']; 
		Translate.preLoadDics(dicNames, function(){
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" :'系统配置',
	  		"links"     : [
	  			{"link" : '#/', "title" : '集中管理配置'}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : '集中管理配置'}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);	    		
			$('a[href="#1"]').click(function(event) {
				displayPage($('#1'));
			});
		    $('a[href="#1"]').trigger('click');
		}); 
	}
	
	//展示链接控制页面
	function displayPage($con){
		//获取数据
		$.ajax({
			url: 'common.asp?optType=putCwmpConfig',
			type: 'GET',
			// data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,		
					returnStr = ['cwmpEnable',
								 'cwmpServerIp',
								 'cwmpAcsAuthEnable',
								 'cwmpUsername',
								 'cwmpPassword',
								 'cwmpCpeAuthEnable',
								 'cwmpCpeUsername',
								 'cwmpCpePassword',
								 'cwmpStunEnable',
								 'cwmpStunIp',
								 'cwmpStunAuthEnable',
								 'cwmpStunUsername',
								 'cwmpStunPassword'
								 
								 ],
					result = doEval.doEval(codeStr, returnStr),
					isSuccess = result["isSuccessful"];
					DATA.con=$con;
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					//制作表单
					var $input = getInputDom(data);
					//制作按钮
					var $btn = getBtnDom();
					$con.empty().append($input,$btn);
				    var Translate  = require('Translate');
				    var tranDomArr = [$('body')];
				    var dicArr     = ['common','doConnectControl'];
				    Translate.translate(tranDomArr, dicArr);	
				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});	
	}
	
	//生成输入框组和按钮
	function getInputDom(data){
		var datas = data;
		var inputlist = [
			{
				prevWord :'集中管理(WMC)',
				inputData:{
					type  : 'checkbox',
					name  :'cwmpEnable',
					defaultValue : [data.cwmpEnable || '0'],
					items :[
						{name:'开启集中管理 配置WMC后，可以通过WMC系统集中管理设备。',value:'1',checkOn:'on',checkOff:'off'},
					]
				},
				"afterWord" : ''
			},		
			{
				prevWord :'服务端Url',
				neccessary:'true',
				inputData:{
					type  : 'text',
					name  :'cwmpServerIp',
					value : data.cwmpServerIp || '',
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					//"checkDemoFunc": ['checkNoHttpUrl', 'ip', '0', '2', 'domain']
					"checkDemoFunc" : ['checkUrl','']
				},
			},
			{
				prevWord :'ACS 认证开关',
				inputData:{
					type  : 'checkbox',
					name  :'cwmpAcsAuthEnable',
					defaultValue : [data.cwmpAcsAuthEnable || '0'],
					items :[
						{name:'',value:'1',checkOn:'on',checkOff:'off'},
					]
				},
			},	
			{
				prevWord :'ACS 用户名',
				neccessary:'true',
				inputData:{
					type  : 'text',
					name  :'cwmpUsername',
					value : data.cwmpUsername || '',
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				},
			},
			{
				prevWord :'ACS 密码',
				neccessary:'true',
				inputData:{
					type  : 'password',
					name  :'cwmpPassword',
					value : data.cwmpPassword ||'',
					eye:true,
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				},
			},
			{
				prevWord :'CPE 认证开关',
				inputData:{
					type  : 'checkbox',
					name  :'cwmpCpeAuthEnable',
					defaultValue : [data.cwmpCpeAuthEnable || '0'],
					items :[
						{name:'',value:'1',checkOn:'on',checkOff:'off'},
					]
				},
			},	
			{
				prevWord :'CPE 用户名',
				neccessary:'true',
				inputData:{
					type  : 'text',
					name  :'cwmpCpeUsername',
					value : data.cwmpCpeUsername || '',
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				},
			},
			{
				prevWord :'CPE 密码',
				neccessary:'true',
				inputData:{
					type  : 'password',
					name  :'cwmpCpePassword',
					value : data.cwmpCpePassword || '',
					eye:true,
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				

				},
			},
			{
				prevWord :'STUN 开关',
				inputData:{
					type  : 'checkbox',
					name  :'cwmpStunEnable',
					defaultValue : [data.cwmpStunEnable || '0'],
					items :[
						{name:'',value:'1',checkOn :'on',checkOff:'off'},
					]
				},
			},
			{
				prevWord :'STUN 地址',
				neccessary:'true',
				inputData:{
					type  : 'text',
					name  :'cwmpStunIp',
					value : data.cwmpStunIp  || '',
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					//"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				},
			},
			{
				prevWord :'STUN 认证开关',
				inputData:{
					type  : 'checkbox',
					name  :'cwmpStunAuthEnable',
					defaultValue : [data.cwmpStunAuthEnable || '0'],
					items :[
						{name:'',value:'1',checkOn :'on',checkOff:'off'},
					]
				},
			},	
			{
				prevWord :'STUN 用户名',
				neccessary:'true',
				inputData:{
					type  : 'text',
					name  :'cwmpStunUsername',
					value : data.cwmpStunUsername || '',
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				},
			},
			{
				prevWord :'STUN 密码',
				neccessary:'true',
				inputData:{
					type  : 'password',
					name  :'cwmpStunPassword',
					value : data.cwmpStunPassword || '',
					eye:true,
//					"checkDemoFunc" : ['checkNum','0','30000','notnull'],
					// "checkDemoFunc" : ['checkName','0','31']
					"checkDemoFunc": ['checkInput', 'name', '0', '31', '5']
				},
			}
		];
		
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
		
		$inputs.find('[name="cwmpEnable"]').click(function(){
			makeTheDisable();
		});
		makeTheDisable()
		function makeTheDisable(){
			if(!$inputs.find('[name="cwmpEnable"]').is(':checked')){
				$inputs.find('[name="cwmpServerIp"]').attr('disabled','disabled');
			}else{
				$inputs.find('[name="cwmpServerIp"]').removeAttr('disabled').val(data.cwmpServerIp || '');
			}
		}
		
		
		return $inputs;
	}
	
	function getBtnDom(){
		var btnlist = [
			{
				name :'{save}',
				id   :'save',
				clickFunc : function($this){
					//差错
					$this.blur();
					if(require('InputGroup').checkErr($('#1'))>0){
						var Tips=require("Tips");
//						Tips.showError('{NoSave}');
						return false;
					}else{
						saveFunc();
					}
					
				}
			},
			{
				name :'{reset}',
				id   :'reset',
				clickFunc : function($this){
					displayPage($('#1'));
				}
			}
		];
		
		var BG = require('BtnGroup');
		var btns = BG.getDom(btnlist).addClass('u-btn-group');
		return btns;
	}
	
	/**保存事件*/
	function saveFunc(){
		var Tips = require('Tips');
		var Srlz = require('Serialize');
		var strs = Srlz.getQueryStrs($('#1'));
		var json = Srlz.queryStrsToJson(strs);
		//enable=on&totalCnt=0&tcp=1000&udp=800&icmp=100
		strs=Srlz.queryJsonToStr(json);

		$.ajax({
			url: '/goform/formCwmpConfig',
			type: 'POST',
			data: strs,
			success: function(result) {
					var Eval = require('Eval');
					res = Eval.doEval(result, ['status']),
					isSuccess = res["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = res["data"];
					if(data.status == 1){
						Tips.showSuccess('{saveSuccess}');
						displayPage($('#1'));
					}else{
						Tips.showWarning('{saveFail}');
					}
					

				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}
	///////////////////////////////////////
	//功能：检查是否合法ip地址
	//参数说明:
	//cntrl--控件名
	//tips--提示信息
	//allownull--1允许为空，0不允许为空
	//返回值：true合法，false非法
	//////////////////////////////////////
	function checkURL(cntrl, tips, allownull) {
	    var retips = "";
	    var ip_str = trimstr(cntrl.value);
	    cntrl.value = ip_str;
	    if (ip_str == '') {
	        if (!eval(allownull)) retips = tips + "输入错误";
	        else retips = '';
	    } else if (!verifyDottedURL(ip_str)) retips = tips + "输入错误";
	    if (retips != '') {
	        inputErro(cntrl, retips);
	        return false;
	    } else {
	        inputRight(cntrl);
	        return true;
	    }
	}
	function trimstr(str) {
	    str = str.toString();
	    if (str == "0") return "0";
	    if (str == "") return "";

	    while (str.length > 0 && str.indexOf(' ') == 0) {
	        str = str.substring(1, str.length);
	    }
	    while (str.length > 0 && str.lastIndexOf(' ') == str.length - 1) {
	        str = str.substring(0, str.length - 1);
	    }

	    return str;
	}
	function verifyDottedURL(url_str) {
		var reg3 =/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
		if(!reg3.test(url_str)){
			return false;
		}
	    return true;
	}
	
});
