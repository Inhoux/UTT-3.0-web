define(function(require, exports, module) {
	require('jquery');
	var DATA = {};

	  function tl(str){
	    return require('Translate').getValue(str,['common','doSyslog']);
	  }
	
	function display($container) {
		$container.empty();
		$.ajax({
		    url: 'common.asp?optType=systemLogSet',
		    type: 'get',
			success : function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['NoticeLogEnable',
								'ArpLogEnable',
								'DhcpLogEnable',
								'PppoeLogEnable',
								'errorstr'
							  ];
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if(isSuccess){
					var data = result["data"],
						NoticeLogEnable = data['NoticeLogEnable'],
						ArpLogEnable = data['ArpLogEnable'];
						DhcpLogEnable = data['DhcpLogEnable'];
						PppoeLogEnable = data['PppoeLogEnable'];
						errorstr = data['errorstr'];

						DATA["NoticeLogEnable"]=NoticeLogEnable;
						DATA["ArpLogEnable"]=ArpLogEnable;
						DATA["DhcpLogEnable"]=DhcpLogEnable;
						DATA["PppoeLogEnable"]=PppoeLogEnable;
						DATA["errorstr"]=errorstr;
						makeGlobalSettings(data,$container);
				}else{
					tips.showError('{parseStrErr}');
				}
			}
		});

	}
	
	function makeGlobalSettings(data,$container){
		var data = data ||{};
		 	dhcpLog='off',
		 	arpLog='off',
		 	pppoeLog='off',
		 	noticeLog='off'
		data.NoticeLogEnable == 1? noticeLog='on': noticeLog='off';
		data.ArpLogEnable == 1? arpLog='on': arpLog='off';
		data.DhcpLogEnable == 1? dhcpLog='on': dhcpLog='off';
		data.PppoeLogEnable == 1? pppoeLog='on': pppoeLog='off';
		
		var inputList = [
			{
				inputData:{
					type:'checkbox',
					name:'allChoose',
					defaultValue:'',
					items:[
						{name:'{SelectA}',value:'on'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'DhcpLog',
					defaultValue:dhcpLog,
					items:[
						{name:'{UseDhcpLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'NoticeLog',
					defaultValue:noticeLog,
					items:[
						{name:'{UseNoticeLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'ArpLog',
					defaultValue:arpLog,
					items:[
						{name:'{UseArpLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'PppoeLog',
					defaultValue:pppoeLog,
					items:[
						{name:'{UsePppoeLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			}
		];
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputList);
		//绑定交互事件
		var alls = $inputs.find('[name="allChoose"]').parent().parent().nextAll().find('input[type="checkbox"]');
		$inputs.find('[name="allChoose"]').click(function(){
			if($(this).is(':checked')){
				alls.prop('checked',true);
			}else{
				alls.prop('checked',false);
			}
		});
		alls.click(function(){
			$inputs.find('[name="allChoose"]').prop('checked',false);
		});
		//修改部分样式
		$inputs.find('[name="allChoose"]').parent().find('span').css({fontWeight:'bold'});
		
		var BtnGroup = require('BtnGroup');
		var btnList = [
			{
				"id"        : 'save',
				"name"      : '{save}',
				"clickFunc" : function($this){
					/*
						保存用户的设置
					 */
					
					globalSettingSave($container);
                	
                }
				
			},
			{
				"id"        : 'reset',
				"name"      : '{reset}'
			}
		];
		var $btnList = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.empty().append($inputs,$btnList);
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doSyslog'];
		Translate.translate(tranDomArr, dicArr);
	}
	
	function globalSettingSave($con){
		
		var SRLZ = require('Serialize');
		var strs = SRLZ.getQueryStrs($con);
		var tips = require('Tips');
		 $.ajax({
	      url: '/goform/SysLogInfoConfig',
	      type: 'POST',
		  data:strs,
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
				display($con);
	          } else {
	            var errMsg = result["errorstr"];
	            tips.showWarning('{parseStrErr}');
	          }
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });
	}
	module.exports = {
		display: display
	};
});