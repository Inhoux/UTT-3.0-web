define(function(require, exports, module){
	require('jquery');
	var DATA={};
	function tl(str){
    	return require('Translate').getValue(str,['common','doAttackProtection']);
  	}
	exports.display = function(){
		var Path = require('Path'); 
		var Translate = require('Translate'); 
		var dicNames = ['common', 'doAttackProtection']; 
		Translate.preLoadDics(dicNames, function(){ 
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : tl('fwb_wall'),
	  		"links"     : [
	  			{"link" : '#/firewall/attack_proection', "title" : tl('fwb_attPro')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('fwb_attPro')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
		   
			$('a[href="#1"]').click(function(event) {
				//Path.changePath($(this).text());
				displayInputs($('#1'));

			});
		    $('a[href="#1"]').trigger('click');
		});    
	}
	function processData(jsStr) {
	    // 加载Eval模块
	    var doEval = require('Eval');
	    var Tips = require('Tips');
	    var codeStr = jsStr,	
	      // 定义需要获得的变量
	      variableArr = ['DDOSEnables', 
	                    'IPCheatw', 
	                    'UDPFloodw',
	                    'max_udp_rxpps',
	                    'ICMPFloodw',
	                    'max_icmp_rxpps',      
	                    'SYNFloodw',   
	                    'ArpBroadcastEnables',
	                    'max_syn_rxpps',
	                    'portScanfEnablew',
	                    'scanfCnt',
	                    'WormEnables',
	                    'PingDisables',
	                    'max_syn_rxpps',
	                    'errorstr',
	                    'lanArpBroadcastInterval',
	                    'status'
	      ];
	    // 获得js字符串执行后的结果
	    var result = doEval.doEval(codeStr, variableArr);
	    // 判断代码字符串执行是否成功
	    return result;
	}	
	/**
	 * 页面显示
	 */
	function displayInputs($container){
		$container.empty();
		// 清空标签页容器
		var tips = require('Tips');
		 $.ajax({
	      url: 'common.asp?optType=attackDefense',
	      type: 'GET',
	      success: function(result) {
	      	//处理数据
			 var res = processData(result);
	        var isSuccess = res["isSuccessful"];
	        if (isSuccess) {
	          var data = res["data"];
	      		DATA["dt"]=data;
				//制作表单及按钮
				var $inputs = getInputDom(data);
				//生成页面
				$container.empty().append($inputs);

				var Translate  = require('Translate');
				var tranDomArr = [$container];
				var dicArr     = ['common','doAttackProtection'];
				Translate.translate(tranDomArr, dicArr);
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });

	}
	
	function getInputDom(data){
		var data = DATA.dt || {};
		var inputlist = [
			{
				inputData:{
					type:'title',
					name:'{fwb_inner}',
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'DDOSEnable',
					"defaultValue" : data.DDOSEnables,
					items:[{name:'{fwb_ddos}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'IPCheat',
					"defaultValue" : data.IPCheatw,
					items:[{name:'{fwb_IPCheat}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'UDPFlood',
					"defaultValue" : data.UDPFloodw,
					items:[{name:'{fwb_udpFlood}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'ICMPFlood',
					"defaultValue" : data.ICMPFloodw,
					items:[{name:'{fwb_icmpFlood}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'SYNFlood',
					"defaultValue" : data.SYNFloodw,
					items:[{name:'{fwb_synFlood}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'ArpBroadcastEnable',
					"defaultValue" : data.ArpBroadcastEnables,
					items:[{name:'{fwb_arp}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'portScanfEnable',
					"defaultValue" : data.portScanfEnablew,
					items:[{name:'{fwb_portScan}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			{
				inputData:{
					type:'title',
					name:'{fwb_outer}',
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'PingDisable',
					"defaultValue" : data.PingDisables,
					items:[{name:'{fwb_ping}',value:'on',checkOn:'on',checkOff:'off'}]
				}
			},
			
		];
		
		var IG = require('InputGroup');
		var $input = IG.getDom(inputlist);
		//增加其他组件
		_at('UDPFlood',''+tl('fwb_thresh')+'<input type="text" value="'+(data.max_udp_rxpps==0 ? '500':data.max_udp_rxpps)+'" name="max_udp_rxpps">'+tl('fwb_perSec')+'');
		_at('ICMPFlood',''+tl('fwb_thresh')+'<input type="text" value="'+(data.max_icmp_rxpps==0 ? '500':data.max_icmp_rxpps)+'" name="max_icmp_rxpps">'+tl('fwb_perSec')+'');
		_at('SYNFlood',''+tl('fwb_thresh')+'<input type="text" value="'+(data.max_syn_rxpps==0 ? '500':data.max_syn_rxpps)+'" name="max_syn_rxpps">'+tl('fwb_perSec')+'');
		_at('ArpBroadcastEnable',''+tl('fwb_arpValue')+'<input type="text" value="'+(data.lanArpBroadcastInterval==0 ? '100':data.lanArpBroadcastInterval)+'" name="ArpBroadcastIntervalVal">'+tl('fwb_msec')+'');
		_at('portScanfEnable',''+tl('fwb_thresh')+'<input type="text" value="'+(data.scanfCnt==0 ? '100':data.scanfCnt)+'" name="scanfCnt">'+tl('fwb_msec')+'');
		function _at(name,str){
			$input.find('[name="'+name+'"]').parent().next().append(str);
			$input.find('[name="'+name+'"]').parent().next().find('input').css({width:'80px',margin:'auto 8px'});
		}
		$input.find('[name="max_udp_rxpps"]').checkdemofunc('checkNum',10,99999);
		$input.find('[name="max_icmp_rxpps"]').checkdemofunc('checkNum',10,99999);
		$input.find('[name="max_syn_rxpps"]').checkdemofunc('checkNum',10,99999);

		$input.find('[name="ArpBroadcastIntervalVal"]').checkdemofunc('checkNum',100,5000);
		$input.find('[name="scanfCnt"]').checkdemofunc('checkNum',100,2000);
		
		//按钮部分
		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		        	$btn.blur();
		           saveFunc();
		        }
		    }
		];
		var BtnGroup =  require('BtnGroup');
		var $btn = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		return [$input,$btn];
	}
	/**
	 * 保存
	 */
	function saveFunc(){
		if(require('InputGroup').checkErr($("#1")) > 0){
			return ;
		}
		var SRLZ = require('Serialize');

	    // 获得用户输入的数据
	    var queryArrs = SRLZ.getQueryArrs($("#1"));   
	    var datajson = SRLZ.queryArrsToJson(queryArrs);
	    var datastr = SRLZ.queryJsonToStr(datajson);
		var tips = require('Tips');		
		 $.ajax({
	      url: '/goform/formFwBase',
	      type: 'POST',
		  data:datastr,
	      success: function(result) {
	      	//处理数据
			 var res = processData(result);
	        var isSuccess = res["isSuccessful"];
	        console.log(isSuccess);
	        if (isSuccess) {
	          var data = res["data"];
	          var status = data["status"];
	          // 判断修改是否成功
	          if (status == 1) {
					displayInputs($('#1'));
					tips.showSuccess('{saveSuccess}', 2.5);
	          } else {
	            var errMsg = result["errorstr"];
	            tips.showWarning('{saveFail}', 2);
	          }
	        } else {
	          tips.showWarning('parseStrErr', 2);
	        }
	      }
	    });
	}
})