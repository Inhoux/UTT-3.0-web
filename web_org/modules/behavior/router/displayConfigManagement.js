define(function(require, exports, module) {
	function tl(str){
    	return require('Translate').getValue(str,['common','tips','error','doSysMaintenance']);
  	}
	var Tips=require('Tips');
	function getInputDom(){
		var inputlist = [
			{
				inputData:{
					type:'title',
					name:'{outputConfig}'
				}
			},
			{
				inputData:{
					type:'text',
					name:'output',
				}
			},
			{
				inputData:{
					type:'title',
					name:'{inputConfig}'
				}
			},
			{
				"prevWord": '{beOriginalBeforeInput}',
				"inputData": {
					"type": 'checkbox',
					"name": 'chkset',
					"defaultValue":'on',
					"items" : [
						{"value" : 'on', "name" : ''}
					]
				},
				"afterWord": ''
			},
			{
				prevWord:'{selectConfigFile}',
				inputData:{
					type:'text',
					name:'chooseFile',
				}
			},
			{
				inputData:{
					type:'title',
					name:'{recoveryEquipmentFactory}'
				}
			},
			{
				inputData:{
					type:'text',
					name:'restore',
				}
			},
			{
				inputData:{
					type:'text',
					name:'words',
				}
			},
		];

		var IG = require('InputGroup');
		var $dom = IG.getDom(inputlist);

		//添加小按钮等
		$dom.find('[name="output"]').parent().prev().append($('<button type="button" class="btn-sm btn-primary" data-local="{output}" id="output">{output}</button>'));
		$dom.find('[name="output"]').remove();

		$dom.find('[name="restore"]').parent().prev().append($('<button type="button" class="btn-sm btn-primary" data-local="{restoreFactorySettings}" id="restore">{restoreFactorySettings}</button>'));
		$dom.find('[name="restore"]').remove();

		$dom.find('[name="chooseFile"]').before($('<button type="button" class="btn-sm btn-primary" data-local="{selectFile}" id="chooseFile" style="margin-right:10px">{selectFile}</button>'))
		$dom.find('[name="chooseFile"]').parent().next().append($('<button type="button" class="btn-sm btn-primary" data-local="{input}" id="innerput">{input}</button>'));
		$dom.find('[name="chooseFile"]').after('<input type="file" style="display:none" name="filename" id="importConfig"/>');
		$dom.find('[name="chooseFile"]').attr('readonly','readonly');
		$dom.find('[name="chooseFile"]').attr('placeholder','( 暂未选择文件 )');
		//选择文件模拟点击
		$dom.find('#chooseFile').click(function(){$dom.find('#importConfig').click();});
		$dom.find('#importConfig').change(function(){
			var  t = $(this);
			var ival = t.val();
			$dom.find('[name="chooseFile"]').val(ival.substr(ival.lastIndexOf('\\')+1))
		});
		$dom.find('[name="words"]').parent().parent().before('<tr><td> </td></tr>');
		$dom.find('[name="words"]').parent().prev().append(tl('recoveryTip1')+'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tl('recoveryTip2'));
		$dom.find('[name="words"]').parent().prev().attr('colspan','3').next().remove().next().remove();
		$dom.find('[name="words"]').remove();
		$dom.find('tr:last-child').children().first().css({
			'padding':'10px',
			'paddingTop':'20px',
			'background-color':'rgb(238, 238, 238)',
			'line-height':'25px'
		});
		return $dom;
	}
	function restore(){
		var tips=require('Tips');
		
		var queryStr='';
		$.ajax({
			url: '/goform/formResetSettings',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = ['status', 'errorstr'];
				var result = doEval.doEval(codeStr, variableArr);
				var isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					var isSuccessful = data["status"];
					// 判断修改是否成功
					if (isSuccessful) {
						// 显示成功信息
//						tips.showSuccess('{ResetSuccess}');
						// 刷新页面
						setTimeout(function(){
							tips.showConfirm(tl('rebootTipAfterReset'),function(){ 
							    reboot();
							 },function(){
							 	display($('#4'));
							 	tips.showSuccess('{ResetSuccess}');
							 });
						},300)
						
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							tips.showWarning('{resetFail}');
						}else{
							tips.showWarning(errorstr);
						}
					}
				} else {
					tips.showError('{parseStrErr}');
				}
			}
		});
	}
	function initInputFuncs($dom){
		var tips=require('Tips');
		$dom.find('#output').click(function(){
			if($dom.next().attr('name') == 'Device_Config'){
							$dom.next().remove();
						}
			var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
			$dom.after($afterdom);
			$afterdom[0].action ="/goform/formExportSettings";
			$afterdom[0].submit();

			$(this).blur();
		});

		$dom.find('#innerput').click(function(){
			var thisfilename = $dom.find('[name="chooseFile"]').val();
	/*		if(/.*[\u4e00-\u9fa5]+.*$/.test(thisfilename))
			{
				require('Tips').showWarning(tl('fileNameCanBeChinese'));
				return false;
			} */
			if($dom.find('[name="chooseFile"]').val()===''|| $dom.find('#importConfig').val()===''){
				require('Tips').showWarning('{unInputFile}');
			}else{
			require('Tips').showConfirm(tl('inputFileTip'),function(){
				var formData = new FormData($('#uploadSettings')[0]);
				$.ajax({
					type:"post",
					url:"/goform/formUploadSettings",
					data:formData,
					async: false,
			        cache: false,
			        contentType: false,
			        processData: false,
			        success:function (result){
			        	eval(result);
			        	if(status && status ==1){
//			        		tips.showSuccess('{importSuccess}');
			        		$('[href="#4"]').trigger('click');
			        		tips.showConfirm(tl('importSuccessDeviceReboot'),function(){
			        			reboot();
			        		},function(){
			        			
			        		});
			        	}else{
			        		var newErrStr=(errorstr||'');
				        	if(newErrStr == ''){
								tips.showWarning('{inputConfigFileFail}');
							}else{
								tips.showWarning(errorstr);
							}
			        	}
			        },
			        complate:function(){
			        }
				});
			});
			}
		});
		$dom.find('#restore').click(function(){
			tips.showConfirm(tl('confirmRestore'),function(){
				restore();
			});
		});
	}
	/* 重启接口 */
	function reboot(){
		var queryStr='';
		var Tips = require('Tips');
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
		//获得输入组对象
		var $inputs = getInputDom();

		$container.empty().append($inputs);

		var Translate  = require('Translate');
		var tranDomArr = [$inputs];
		var dicArr     = ['common','doSysMaintenance'];
		Translate.translate(tranDomArr, dicArr);

		$inputs.wrap('<form  action="/goform/formUploadSettings" method="post" name="uploadSettings" id="uploadSettings" enctype="multipart/form-data"></form>');
		//绑定事件
		initInputFuncs($inputs);

	}


	// 提供对外接口
	module.exports = {
		display: display
	};
});
