define(function(require, exports, module) {
	require('jquery');
	var DATA={};
	function tl(str){
    	return require('Translate').getValue(str, ['doNetworkTools']);
  	}
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
            "prevWord": '{packetLength}',
            "inputData": {
                "value" : data.baowenLength || '64', 
                "type": 'text',
                "name": 'length',
                "checkDemoFunc" : ['checkNum','40','8000']
            },
            "afterWord":'{illustrate2}'
	       },
	       {   
            "prevWord": '{pingCount}',
            "inputData": {
                "value" : data.pingCount || '5', 
                "type": 'text',
                "name": 'count',
                "checkDemoFunc" : ['checkNum','1','100']
            },
            "afterWord":'{illustrate3}'
	       },
	       {   
	       	"prevWord": '{testResult}',
            "inputData": {
                "value" : data.testresult || '', 
                "type": 'textarea',
                "name": 'testresult'
            },
	       }
		];
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
		//修改部分样式
		$inputs.find('[name="testresult"]').css({width:'450px',height:'200px',resize:'none'}).attr('readonly','true').parent().attr('colspan','2').next().remove();
		//按钮部分
		var btnGroupList = [
		    {
		        "id"        : 'ping',
		        "name"      : tl('start'),
		        "clickFunc" : function($btn){
		        	$btn.blur();
		            pingClick();
		        }
		    }
		    ,{
		        "id"        : 'stop',
		        "name"      : tl('stop'),
		        "clickFunc" : function($btn){
		        	$btn.blur();
		            pingClick("stop");
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
	function pingClick(flag){
		var SRLZ = require('Serialize');
	    // 获得用户输入的数据
	    var queryArrs = SRLZ.getQueryArrs($("#1"));
	    var datajson = SRLZ.queryArrsToJson(queryArrs);
	    if(flag == 'stop'){	   
	    	datajson.stop='stop';
	    }
	    DATA['json'] = datajson;
	    var datastr = SRLZ.queryJsonToStr(datajson);
		
		var pingCount = datajson.pingCount;
		var tips = require('Tips');
		if(flag!='stop'){
			var InputGroup = require('InputGroup');
			var len = InputGroup.checkErr($("#1"));
			if(len > 0)
			{
//				tips.showError('{errNoOperate}');
				return;
			}
		}
		//第一遍Ajax
		 $.ajax({
	      url: '/goform/formDiagnose',
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
	          		$('[name="testresult"]').val();
	          		setTimeout(function(){
	          			setIntervalPing(pingCount);
	          			},200);
					
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

	function setIntervalPing(){
		var count = Number($('[name="count"]').val());
		for(var i = 0;i<count+10;i++){
			setTimeout(function(){makePing();},i*1000);
			
	}
		function makePing(){
			$.ajax({
		      url: '/goform/formDiagnoseResult',
		      type: 'POST',
			  data: DATA['json'],
		      success: function(result) {
				$('[name="testresult"]').val(result);
				}	
		    });
		}
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
