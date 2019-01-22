define(function(require, exports, module) {
	require('jquery');
	var DATA={};
	function display($container) {
		$container.empty();
		// 清空标签页容器
		var tips = require('Tips');
		 $.ajax({
	      url: 'common.asp?optType=logServer',
	      type: 'GET',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
					variableArr = ['SyslogEn',
									'ServerIp',
									'SyslogPort',
									'SyslogType',
									'SyslogInterval',
									'errorstr'
								  ];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							SyslogEn = data['SyslogEn'],
							ServerIp = data['ServerIp'];
							SyslogPort = data['SyslogPort'];
							SyslogType = data['SyslogType'];
							SyslogInterval = data['SyslogInterval'];
							errorstr = data['errorstr'];
							DATA["SyslogEn"]=SyslogEn;
							DATA["ServerIp"]=ServerIp;
							DATA["SyslogPort"]=SyslogPort;
							DATA["SyslogType"]=SyslogType;
							DATA["SyslogInterval"]=SyslogInterval;
							DATA["errorstr"]=errorstr;
							var $inputs = getInputDom(DATA);
							//生成页面
							console.log($inputs);
							$container.append($inputs);	

							var Translate  = require('Translate');
							var tranDomArr = $inputs;
							var dicArr     = ['common','doSyslog'];
							Translate.translate(tranDomArr, dicArr);

					}else{
						tips.showError('{parseStrErr}');
					}
				}

	    });		
	}
	/**
	 * 数据处理
	 * @param {Object} result
	 */
	function processData(result){
		var doEval = require('Eval');
	    var codeStr = result,
	        variableArr = ['aaaaa', 'bbbbb'];
	    var results = doEval.doEval(codeStr, variableArr);
	    return results;
	}
	
	function getInputDom(data){
		var data = data || {};
		var logPort='';

		if(data.SyslogPort==0||data.SyslogPort=='0'||data.SyslogPort===''||data.SyslogPort==='undefined'){
			logPort=514;
		}else{
			logPort=data.SyslogPort;
		}
		var inputlist = [
			{   
            "prevWord": '{Syslog_en}',
            "inputData": {
                "defaultValue" : data.SyslogEn || 'off', 
                "type": 'radio',
                "name": 'SyslogEnable',
                items:[
                	{name:'{open}',value:'on'},
                	{name:'{close}',value:'off'}
                ]
            }
	       },
	       {   
            "prevWord": '{Syslog_ServerIp}',
            necessary:true,
            "inputData": {
                "value" : data.ServerIp || '', 
                "type": 'text',
                "name": 'ServerIp',
                "checkFuncs" : ['checkLogServerIP']
            }
	       },{   
            "prevWord": '{Syslog_ServerPort}',
            necessary:true,
            "inputData": {
                // "value" : (data.SyslogPort == ''||data.SyslogPort === undefined )?'514':data.SyslogPort, 
                "value":logPort,
                "type": 'text',
                "name": 'ServerPort',
                "checkDemoFunc" : ['checkNum','1','65535']
            }
	       },{   
            "prevWord": '{Syslog_MesType}',
            "inputData": {
                "defaultValue" : data.SyslogType || '0', 
                "type": 'select',
                "name": 'SyslogType',
                "items" :[
                	{name:'Loacl0',value:'Loacl0'},
                	{name:'Loacl1',value:'Loacl1'},
                	{name:'Loacl2',value:'Loacl2'},
                	{name:'Loacl3',value:'Loacl3'},
                	{name:'Loacl4',value:'Loacl4'},
                	{name:'Loacl5',value:'Loacl5'},
                	{name:'Loacl6',value:'Loacl6'},
                	{name:'Loacl7',value:'Loacl7'}
                ]
            }
	       },
			{   
            "prevWord": '{Syslog_InterVal}',
            "inputData": {
                "defaultValue" : data.SyslogInterval || '0', 
                "type": 'select',
                "name": 'SyslogInterval',
                "items" :[
                	{name:'0',value:'0'},
                	{name:'10',value:'10'},
                	{name:'20',value:'20'},
                	{name:'30',value:'30'},
                	{name:'40',value:'40'},
                	{name:'50',value:'50'},
                	{name:'60',value:'60'},
                	{name:'70',value:'70'},
                	{name:'80',value:'80'},
                	{name:'90',value:'90'},
                	{name:'100',value:'100'},
                	{name:'110',value:'110'},
                	{name:'120',value:'120'},
                	{name:'130',value:'130'},
                	{name:'140',value:'140'},
                	{name:'150',value:'150'},
                	{name:'160',value:'160'},
                	{name:'170',value:'170'},
                	{name:'180',value:'180'},
                	{name:'190',value:'190'},
                	{name:'200',value:'200'},
                	{name:'210',value:'210'},
                	{name:'220',value:'220'},
                	{name:'230',value:'230'},
                	{name:'240',value:'240'},
                	{name:'250',value:'250'},
                	{name:'260',value:'260'},
                	{name:'270',value:'270'},	
                	{name:'280',value:'280'},
                	{name:'290',value:'290'},
                	{name:'300',value:'300'}
                ]
            }
	       },	       
		];
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
		
		//按钮部分
		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		           saveFunc();
		        }
		    },
		    {
		        "id"        : 'reset',
		        "name"      : '{reset}'
		    }
		];
		var BtnGroup =  require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		return [$inputs,$btnGroup];
	}
	/**
	 * 保存
	 */
	function saveFunc(){
		var SRLZ = require('Serialize');
	    // 获得用户输入的数据
	    var queryArrs = SRLZ.getQueryArrs($("#2"));
	    var datajson = SRLZ.queryArrsToJson(queryArrs);
	    var datastr = SRLZ.queryJsonToStr(datajson);
		console.log(datastr)
		var InputGroup = require('InputGroup');
		var len = InputGroup.checkErr($("#2"));
		if(len > 0){
//			require('Tips').showError('{errNoSave}');
			return;
		}	
	
		var tips = require('Tips');
		$.ajax({
	      url: '/goform/formSyslogConf',
	      type: 'POST',
		  data:datastr,
	      success: function(result) {
	      	//处理数据
			var res = require('Eval').doEval(result,['status']);
	        var isSuccess = res["isSuccessful"];
	        if (isSuccess) {
	          var data = res["data"];
	          var isSuccessful = data["status"];
	          // 判断修改是否成功
	          if (isSuccessful) {
	          		tips.showSuccess('{saveSuccess}');
					display($('#2'));
	          } else {
	            var errMsg = result["errorstr"];
	            tips.showWarning(errMsg);
	          }
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });
	}
	
	// 提供对外接口
	module.exports = {
		display: display
	};
});