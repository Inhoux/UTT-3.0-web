define(function(require, exports, module){
	require('jquery');
	var Tips = require('Tips');
	
	function getDom(data){
		var newdata = {
			prevWord  : ud('prevWord','{rules}'),      /*开始的字*/
			midWord   : ud('midWord','{moveto}'),    /*中间的字*/
			afterWord : ud('afterWord','{before}'),   /*结束的字*/
			btnname   : ud('btnname','{ensure}'),     /*按钮名称*/
			select    : ud('select',[]),  /*下拉框里的值*/
			beforeSaveFunc  : ud('beforeSaveFunc',function($btn,value1,value2){}),  /*点击确认按钮之前*/
			saveSuccess  : ud('saveSuccess',function($btn){}),   /*成功后执行的方法*/
			saveError  : ud('saveError',function($btn){}),     /*失败后执行的方法*/
			url       : ud('url',''),   /*发送的地址*/
			str1	  : ud('str1',''),  /*第一的变量名*/
			str2      : ud('str2',''),  /*第二的变量名*/
			successStr: ud('successStr','移动成功'),  /*成功时提示的信息*/
			defeatStr : ud('defeatStr','移动失败')   /*失败时提示的信息*/
		};
		
		function ud(str,defaultstr){
			return (data[str] === undefined?defaultstr:data[str]);
		}
		
		var $movedom = getMoveToDom(newdata);
		return $movedom;
	}
	
	function getMoveToDom(data){
		var $dom = $('<div style="position:relative;width:auto;height:auto"></div>');
		
		
		
		var item = '' ;
		
		if(data.select && data.select.length>0){
			item += '<select>' ;
			data.select.forEach(function(obj,i){
				item += '<option value="'+obj+'">'+obj+'</option>';
			});
		}else{
			item += '<select disabled="disabled">' ;
			item += '<option value="（无）">（无）</option>';
		}
		
		item += '</select>';
		var $item1 = $(item).attr('id','u_moveto_1');
		var $item2 = $(item).attr('id','u_moveto_2');
		
		/*组装移动小部件*/
		$dom.append('<span data-local="'+data.prevWord+'">'+data.prevWord+'</span>');
		$dom.append($item1);
		$dom.append('<span data-local="'+data.midWord+'">'+data.midWord+'</span>');
		$dom.append($item2);
		$dom.append('<span data-local="'+data.afterWord+'">'+data.afterWord+'</span>');
		$dom.append('<button class="btn-primary btn" type="button" id="u_movetosave" data-local="'+data.btnname+'">'+data.btnname+'</button>');
		
		/*修改部分样式*/
		$dom.children().css({
			marginRight : '10px'
		});
		
		/*绑定确定按钮的点击事件*/
		$dom.find('#u_movetosave').click(function(){
			var $t = $(this);
			$t.blur();
			var value1 = $dom.find('#u_moveto_1').val();
			var value2 = $dom.find('#u_moveto_2').val();
			var click_stop =  data.beforeSaveFunc($t,value1,value2);
			console.log(data);
			if(click_stop === undefined || click_stop == true){
				if(data.url !== ''){
					if(value1 != value2 && data.str1 !== '' && data.str2 !== ''){
						var postdata = data.str1 + "=" + value1 + "&" + data.str2 +"=" + value2;
						$.ajax({
							type:"post",
							url:data.url,
							data:postdata,
							success:function(result){
								try{
									eval(result);
								}catch(e){
									Tips.showError('字符串解析错误');
									data.saveError($t);
									console.error(e);
								}
								if(status){
									Tips.showSuccess(data.successStr);
									data.saveSuccess($t);
								}else{
									Tips.showError(data.defeatStr);
									data.saveError($t);
								}
							}
						});
					}
				}
			}
			
			
		});
		
		/*添加翻译*/
		var Translate = require('Translate');
		var tranDomArr = [$dom];
		var dicArr = ['common'];
		Translate.translate(tranDomArr, dicArr);
		
		
		return $dom;
		
	}
	function joinContent($content,$moveto){
		$moveto.css({'float':'left','margin-top':'1em'});
		$content.append($moveto);
	}
	module.exports = {
		getDom : getDom,
		joinContent :joinContent
	};
});
