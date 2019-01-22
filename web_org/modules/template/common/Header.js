define(function(require, exports, module){
	
	/* 宏控变量 */
	var RAISECOM = require('P_config/config').RAISECOM;
	
	var Tips=require('Tips');
	function getHTML(data){
		var render = require('P_build/common/header'),
			html = render({});
		var $html = $(html);
		/**
		 * 绑定切换事件 
		 */
		$html.find('#u_header_language').change(function(){
			var langSelection = 'langSelection='+$(this).val();
			$.ajax({
				type:"post",
				url:"goform/setSysLang",
				data:langSelection,
				success:function(result){
					var datas = require('Eval').doEval(result,['status']);
					var isSuccessful = datas['isSuccessful'];
					if(isSuccessful){
						if(datas.data.status == 1){
							location.reload(true);   
						}else{
							console.error('status!=1');
						}
					}else{
						console.error(datas.msg);
					}
				}
			});
		});
		/**
		 * 请求默认 语言与种类 
		 */
		$.ajax({
			type:"get",
			url:"common.asp?optType=lang",
			async:false,
			success:function(result){
				var datas = require('Eval').doEval(result,['lang','langArr','status']);
				var isSuccessful = datas['isSuccessful'];
				if(isSuccessful){
					if(datas.data.status ==1){
						var innerHtml = '';
						
						datas.data.langArr.forEach(function(obj){
							var showName = '';
							switch(obj){
								case 'zhcn':
									showName = '中文';
									break;
								case 'en':
									showName = 'English';
									break;
								default:
									break;
							}
							if(showName != ''){
								innerHtml += '<option value="'+obj+'" '+(datas.data.lang == obj?'selected="selected"':'')+'>'+showName+'</option>';
							}
						});
						$html.find('#u_header_language').empty().append(innerHtml);
					}else{
						console.error('status != 1');
					}
				}else{
					console.error(datas.msg);
				}
			}
		});
		/*
		  	绑定帮助按钮
		 * */
		$html.find('#header_help_link').click(function(){
			var urlstr = "help.html";
			var urls = window.location.href;
			if(urls.lastIndexOf('#')>0){
				urls = urls.substr(urls.lastIndexOf('#'));
			}else{
				urls = '#/config_wizard/config_wizard';
			}
			
			urlstr += urls;
			$(this).attr('href',urlstr);
			var activeTab = $('#content>nav>ul>li.active').find('a').attr('href');
			activeTab = activeTab.substr(1,activeTab.length-1);
			document.cookie=("activeTab="+activeTab);
		})
		
		/**
		 * 绑定重启事件
		 */
		
		$html.find('#header_reboot_link').click(function(){
			Tips.showConfirm(tl('rebootTip'),function(){ 
			    reboot();
			});
		});
		
		
		if(RAISECOM == 1){
			/* 特殊处理   去除部分组件*/
			
			$html.find('#u_header_language').parent().remove();
			$html.find('#header_help_link').parent().remove();
			$html.find('#header_reboot_link').parent().remove();
			
			$html.find('div,span').remove();
			
			$html.find('#logout').addClass('u-inputLink').text('注销').css('font-size','14px');	
		}
		
		
		
		return $html;
	}
	
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
	module.exports = {
		getHTML : getHTML
	};
});
