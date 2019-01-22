define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
    var dicArr     = ['common'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}
    function tall(dom){
		return Translate.translate([dom],['common','doSoftMgnt']);
    }
	/* 获取数据 展示表格 */
	function display($con){
		$.ajax({
			type:"get",
			url:"common.asp?optType=aspCloudAC",
			success:function(result){
				// 数据处理
				var data = processData(result);
				showPage($con,data);

			}
		});
	}
	

	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
               'Enable',

		   ]; // 变量名称
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   var data = result.data;
		   return data;			
	}
	
	function showPage($con,newdata){
		var inputlist = [
			{
				prevWord :'云AC管理开关',
                inputData:{
                    type  : 'radio',
                    name  :'Enable',
                    defaultValue : newdata.Enable+"",
                        items :[
                        	{name:'开启',value:'1'},
                        	{name:'关闭',value:'0'},
                        ]
                        /*"安全审计开关"      : {
                            "key": "wlModes5",
                            "type": "text",
                            "values":{
                                "0":'关闭',
                                "1":'开启宽广审计插件',
                                "2":'开启携网审计插件'
                            }
                        },*/
                }
			}
			
		];
		
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
			
		var btnlist = [
			{
				name :'{save}',
				id   :'save',
				clickFunc : function($this){
					saveFunc();					
				}
			},
		//	{
		//		name :'{reset}',
	//			id   :'reset',
	//			clickFunc : function($this){
//					$('[href="#1"]').trigger('click');
	//			}
	//		}
		];
		
		var BG = require('BtnGroup');
		var btns = BG.getDom(btnlist).addClass('u-btn-group');
		
		$con.empty().append($inputs,btns);
		var Translate  = require('Translate');
    	var dicArr     = ['common'];
    	Translate.translate([$con],dicArr);
	}
	
	/**保存事件*/
	function saveFunc(){
		var Tips = require('Tips');
		var Srlz = require('Serialize');
		var strs = Srlz.getQueryStrs($('#3'));
		var json = Srlz.queryStrsToJson(strs);
		strs=Srlz.queryJsonToStr(json);

		$.ajax({
			url: '/goform/formCloudAC',
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
						$('[href="#3"]').trigger('click');
					}else{
						Tips.showWarning('{saveFail}');
					}
				} else {
					Tips.showError('{parseStrErr}');
				}
			}
		});
	}
	
	module.exports = {
		display: display
	};
	
})
