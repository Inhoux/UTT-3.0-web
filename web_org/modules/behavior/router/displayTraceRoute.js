define(function(require, exports, module) {
	require('jquery');
	var DATA={};
	function tl(str){
    	return require('Translate').getValue(str, ['doNetworkTools']);
  	}	
	var clickFlag='on';//防止重复点击
	function display($container) {
		$container.empty();
		var data = {};
	    //制作表单及按钮
		var $inputs = getInputDom(data);
		//生成页面
		$container.append($inputs);
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doNetworkTools'];
		Translate.translate(tranDomArr, dicArr);	
	}
	/**
	 * 数据处理
	 * @param {Object} result
	 */
	function processData(result){
		var doEval = require('Eval');
	    var codeStr = result,
	        variableArr = ['aaaaa', 'bbbbb','status'];
	    var results = doEval.doEval(codeStr, variableArr);
	    console.log(results);
	    return results;
	}
	
	function getInputDom(data){
		var data = data || {};
		var inputlist = [
			{   
            "prevWord": '{ipDns}',
            necessary: true,
            "inputData": {
                "value" : data.IPyuming || '', 
                "type": 'text',
                "name": 'host',
                "checkFuncs" : ['checkIpDns']
            },
            "afterWord":'{illustrate1}'
	       },
	       {   
            "prevWord": '{minTTL}',
            "inputData": {
                "value" : data.baowenLength || '1', 
                "type": 'text',
                "name": 'minTTL',
                "checkDemoFunc" : ['checkNum','1','255']
            },
            "afterWord":'{illustrate4}'
	       },
	       {   
            "prevWord": '{maxTTL}',
            "inputData": {
                "value" : data.pingCount || '30', 
                "type": 'text',
                "name": 'maxTTL',
                "checkDemoFunc" : ['checkNum','1','255']
            },
            "afterWord":'{illustrate4}'
	       },
	       {   
	       	"prevWord": '{testResult}',
            "inputData": {
                "value" : data.testresult || '', 
                "type": 'textarea',
                "name": 'testresultTraceRoute'
            },
	       }
		];
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
		//修改部分样式
		$inputs.find('[name="testresultTraceRoute"]').css({width:'450px',height:'200px',resize:'none'}).attr('readonly','true').parent().attr('colspan','2').next().remove();
		//按钮部分
		var btnGroupList = [
		    {
		        "id"        : 'TraceRoute',
		        // "name"      : 'TraceRoute',
		        "name"      : tl('start'),
		        "clickFunc" : function($btn){
		        	$btn.blur();
		        	clickFlag = 'on';
		            TraceRouteClick("TraceRoute");
		        }
		    }
		    ,{
		        "id"        : 'stop',
		        // "name"      : 'Stop',
		        "name"      : tl('stop'),
		        "clickFunc" : function($btn){
		        	$btn.blur();
		            TraceRouteClick("stop");
		        }
		    }
		];
		var BtnGroup =  require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		
		
		return [$inputs,$btnGroup];
		
	}
	/**
	 * Ping
	 */
	function TraceRouteClick(flag){
		var tips = require('Tips');
		var InputGroup = require('InputGroup');
		var SRLZ = require('Serialize');
	    // 获得用户输入的数据
	    var queryArrs = SRLZ.getQueryArrs($("#2"));
	    var datajson = SRLZ.queryArrsToJson(queryArrs);
	    console.log(datajson);
		if(flag == 'stop'){	 
			clickFlag = 'off';   
	    	datajson.stop='stop';
	    } 
	    DATA['json'] = datajson;
	    console.log(datajson);
	    var datastr = SRLZ.queryJsonToStr(datajson);
	    var minTTL = datajson.minTTL;
		var maxTTL  = datajson.maxTTL;
		var trCount = maxTTL-maxTTL;
		if(flag!='stop'){
			if(parseInt(maxTTL )< parseInt(minTTL)){
				tips.showWarning('{maxTTLLittleThanminTTL}');
				return;
			}
			var len = InputGroup.checkErr($("#2"));
			if(len > 0)
			{
				tips.showError('{errNoOperate}');
				return;
			}
		}

		//第一遍Ajax
		 $.ajax({
	      url: '/goform/formTraceRoute',
	      type: 'POST',
		  data:datastr,
	      success: function(result) {
	      	//处理数据
			var res = processData(result);
	        var isSuccess = res["isSuccessful"];
	        if (isSuccess) {
	          var data = res["data"];
	          var isSuccessful = data["status"];
	          // 判断修改是否成功
	          if (isSuccessful) {
	          		$('[name="testresultTraceRoute"]').val();
	          		if(clickFlag == 'on'){
	          			setIntervalPing(trCount);
	          		}
					
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
	
	function setIntervalPing(count){
		for(var i = 0;i<10;i++){
			if(clickFlag == 'off'){
				break;
			}
			setTimeout(function(){makePing();},i*1000);
		}
		clickFlag='on';
		function makePing(){
			$.ajax({
		      url: '/goform/formTraceRouteResult',
		      type: 'POST',
			  data: DATA['json'],
		      success: function(result) {
				$('[name="testresultTraceRoute"]').val(result);
				}	
		    });
		}
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
