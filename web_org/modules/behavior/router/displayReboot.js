define(function(require, exports, module){
	require('jquery');
	var Tips=require('Tips');
	function tl(str){
    	return require('Translate').getValue(str,['tips']);
  	} 
	function reboot(){
		var queryStr='';
		$.ajax({
			url: '/goform/formRebootMachine',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					if (status) {
						var thisip = '';
						var timer = Tips.showTimer(tl('cannotOperateUntilUpdateDone'),90,function(){
							window.location = thisip;
						});
						var signstr = false;
						var setin1;
						setTimeout(function(){
							setin1 = setInterval(function(){
								$.ajax({
									url: '/common.asp?optType=lan',
									type: 'get',
									success: function(result) {
										eval(result);
										if(lanIp){
											thisip = lanIp;
											signstr = true;
										}
										
									}
								});
							},1000);
						},12000)
						
						var setin2 = setInterval(function(){
							if(signstr){
								clearInterval(setin1);
								clearInterval(setin2);
								timer.stop(true);
							}
						},500);
						
					} else {
						Tips.showWarning('{rebootFail}');
					}
				} else {
					Tips.showWarning('parseStrErr');
				}
			}
		});

	}
	function display($container) {
		var inputList = [
			{
				"prevWord":'{rebootDevice}',
				"inputData":{
					"type":'text',
					"name":'null'
				}

			}
		];

		var IG = require('InputGroup');
		var $dom = IG.getDom(inputList);

		var littlebtn = [{
            id : 'reboot',
            name : '{reboot}',
            clickFunc :function($thisDom){
            	Tips.showConfirm(tl('rebootTip'),function(){ 
				    reboot();
				 }); 	
            }
        }];
        IG.insertBtn($dom,'null',littlebtn);
        $dom.find('[name="null"]').remove();

        $container.empty().append($dom);
		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doSysMaintenance'];
		Translate.translate(tranDomArr, dicArr);
	}

  module.exports = {
    display: display
  };
})
