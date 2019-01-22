define(function(require, exports, module){
	var DATA ={};
	var Tips = require('Tips');
    // 本模块提供的接口，用于生成页面
    function tl(str){
        return require('Translate').getValue(str,['common']);
    }
    exports.display = function(){
        // 加载路径导航模板模块
        var Path = require('Path');
        var Translate = require('Translate'); 
        var dicNames = ['common']; 
        Translate.preLoadDics(dicNames, function(){ 
            // 路径导航配置数据
            var pathList = {
                "prevTitle" : '系统配置',
                "links"     : [
                    {"link" : '#/system_config/model_change', "title" : '模式切换'}
                ],
                "currentTitle" : ''
            };
            Path.displayPath(pathList);
            // 加载标签页模板模块
            var Tabs = require('Tabs');
            // 标签页配置数据
            var tabsList = [
                {"id" : "1", "title" : '模式切换'}
            ];
            // 生成标签页，并放入页面中
            Tabs.displayTabs(tabsList);
            // 为第一个标签页添加点击事件
            $('a[href="#1"]').click(function(event) {
                //Path.changePath('计划任务');
				displayInput($('#1'));                
                
            });
            // 手动触发第一个标签页的点击事件
            $('a[href="#1"]').trigger('click');
        });    
    }
    
    
    function displayInput($con){
    	$.ajax({
    		
			url: 'common.asp?optType=ChangeModel',
			type: 'GET',
			success: function(result) {
				function processData(jsStr) {
					console.log(jsStr)
					// 加载Eval模块
					var doEval 		= require('Eval');
					var codeStr 	= jsStr,
						variableArr = ['ChangeModel']; // 需要获取哪些变量
					
					var result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];

						console.dir(result);
					if (isSuccess) {
						var data = result["data"];
						return data;
					} else {
						console.log('字符串解析失败')
					}
				}
				DATA['data'] = processData(result);
				console.log(DATA['data']);
				
				showInputs($con)
				
				}
		
    	})

    	
    }
    
    function showInputs($con){
    	var inputlist = [
    		{
				"prevWord": '当前模式:',
				"inputData": {
					"type"       : 'text',
					"name"       : 'modelname',
					"value"		 : DATA['data'].ChangeModel ? '桥模式' : '路由模式',
				},
				"afterWord": ''
			},
			{
				"prevWord": '',
				"inputData": {
					"type"       : 'text',
					"name"       : 'modelchangebtn',
					"value"		 : '',
				},
				"afterWord": ''
			}
    	];
    	var InputGroup = require('InputGroup');
		var $dom = InputGroup.getDom(inputlist);
		/*模式文字*/
		var modal_value = $dom.find('[name="modelname"]').val();
		var $span = $('<span style="font-weight:bold" data-local="'+modal_value+'">'+modal_value+'</span>')
		$dom.find('[name="modelname"]').after($span);
		$dom.find('[name="modelname"]').remove();
		/*切换按钮*/
		var $btn = '';
		if(DATA['data'].ChangeModel){
			$btn = $('<button class="btn btn-primary">切换至：路由模式</button>');
		}else{
			$btn = $('<button class="btn btn-primary">切换至：桥模式</button>');
		}
		$dom.find('[name="modelchangebtn"]').parent().prev().remove();
		$dom.find('[name="modelchangebtn"]').parent().attr('colspan','2').css({
			paddingTop:'20px'
		}).empty().append($btn)
		$btn.click(function(){
		Tips.showConfirm("<span style='font-size:14px'>切换模式会重启路由器，确定要切换模式么？</span>",changeok);
        function changeok(){

            var queryStr = "brctlname=";
			queryStr += DATA['data'].ChangeModel ? '0' : '1';
			$.ajax({
				url: 'goform/Formchangemodel',
				type: 'POST',
				data: queryStr,
				success: function(result) {
					function processData(jsStr) {
						console.log(jsStr)
						// 加载Eval模块
						var doEval 		= require('Eval');
						var codeStr 	= jsStr,
							variableArr = ['status','errorStr']; // 需要获取哪些变量
						
						var result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
						if (isSuccess) {
							var data = result["data"];
							return data;
						} else {
							return false;
						}
					}
					var nowdata = processData(result);
					if(nowdata){
						if(nowdata.status == 1){
							Tips.showSuccess('切换成功');
						}else{
							Tips.showWarning(nowdata.errorStr);
						}
					}else{
						console.log('字符串解析失败')
					}
				}
					
    		})
            }
        
        })
        
		
		$con.empty().append($dom);
    }
    
    
    
});
