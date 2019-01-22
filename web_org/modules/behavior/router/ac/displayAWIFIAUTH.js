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
			url:"common.asp?optType=aspaWiFi_Auth",
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
                'AWIFI',
                'aWiFi_name',
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
        var data = newdata || {};
        var inputlist = [
        {
            "prevWord" :'aWiFi认证开关',
            "inputData":{
                "type"  : 'radio',
                "name"  :'Enable',
                "defaultValue" : newdata.Enable+"",
                "items" :[
                {name:'开启',value:'1'},
                {name:'关闭',value:'0'},
                ]
            }
        },{
            "prevWord" :'安全审计开关',
            "inputData":{
                "type"  : 'radio',
                //"type"  : 'select',
                "name"  :'Awifi_plug',
                "defaultValue" : newdata.AWIFI+"",
                "items" :[
                {name:'开启宽广审计插件',value:'1'},
                {name:'开启携网审计插件',value:'2'}
                ]

            }
        },{
            "prevWord" :'aWiFi名称',
            "inputData":{
                "value" : data.aWiFi_name || '',
                "type": 'text',
                "name": 'Awifi_name1',
                "defaultValue" : newdata.aWiFi_name,
                "checkDemoFunc" : ['checkInput', 'name', '0', '26',6]
            }
        }
        ];
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);

        makeTheawifiChange();
        $inputs.find('[name="Enable"]').change(function() {
        makeTheawifiChange();
        });

        function makeTheawifiChange() {
            var awifichoose = $inputs.find('[name="Enable"]:checked').val();
            if (awifichoose == '1') {
                $inputs.find('[name="Awifi_plug"]').removeAttr('disabled');

            } else {
                $inputs.find('[name="Awifi_plug"]').attr('disabled', 'disabled');
            }
        }
			
		var btnlist = [
			{
				name :'{save}',
				id   :'save',
				clickFunc : function($this){
					saveFunc();					
				}
			},
		];
		
		var BG = require('BtnGroup');
		var btns = BG.getDom(btnlist).addClass('u-btn-group');
        	$inputs.find('[name="Awifi_name1"]').hide().parent().prev()
        		.attr('colspan',2)
        		.append("<td><lable>aWiFi名称</lable><span></span></td><td style=\"left: 34px;\"><lable>aWiFi-</lable><input type=\"text\" name=\"Awifi_name\" value=\""+data.aWiFi_name+"\" style=\"width: 124px;\"/></td>")
        		.next()
        		.next()
        		.remove();
	        $inputs.find('[name="Awifi_name1"]').parent().prev().children('label').remove();
	         $inputs.find('[name="Awifi_name1"]').parent().remove();
		$con.empty().append($inputs,btns);
		var Translate  = require('Translate');
    	var dicArr     = ['common'];
    	Translate.translate([$con],dicArr);
	}
	
	/**保存事件*/
	function saveFunc(){
		var Tips = require('Tips');
		var Srlz = require('Serialize');
		var strs = Srlz.getQueryStrs($('#1'));
		var json = Srlz.queryStrsToJson(strs);
        strs=Srlz.queryJsonToStr(json);
        if (json.Enable == 1 )
        {
            if(! (json.Awifi_plug == 1 || json.Awifi_plug == 2))
            {
                Tips.showError('请选择安全审计开关'); 
                return;
            }
        }
        var ssid_name = json.Awifi_name;
        reg = /^[^<|>|,|%|'|&|"|;|\\|:|{|}]{0,}$/;
        if(!reg.test(ssid_name)){
            Tips.showWarning('不能输入:<>,%\'\"&\\|;{}');
            return;
        }
		$.ajax({
			url: '/goform/formaWiFi_Auth',
			type: 'POST',
			data: strs,
			success: function(result) {
					var Eval = require('Eval');
					res = Eval.doEval(result, ['status','errorstr']),
					isSuccess = res["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = res["data"];
					if(data.status == 1){
						Tips.showSuccess('{saveSuccess}');
						$('[href="#1"]').trigger('click');
					}else{
                        if(data.errorstr)
                        { 
						    Tips.showWarning(data.errorstr);
                        }else{
                            Tips.showWarning('{saveFail}');   
                        }
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
