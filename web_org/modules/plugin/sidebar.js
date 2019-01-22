/**
 * 导航栏
 * @author	QC
 * @date	2016-9-1
 *
 */
define(function(require, exports, module){
	require('jquery');
	var $container = $('#sidebar');
	//得到每个二级标题组ul的展开高度
	function getTheHeightOfSon(){
		$('.u-dropdown .u-dropdown-menu').each(function(){
			var t = $(this);
			//获得a2其子完全展开时的高度,赋给其属性：openH
			t.attr({openH:t.addClass('active').css('height')});
			t.removeClass('active');
			//添加动画属性
			t.css({transition:'height 0.3s cubic-bezier(0.65, 0.05, 0.36, 1) 0s'});
		});
	}
	// 给导航栏添加点击事件
	function setTitleClick(){
		// 主标题
		$(document).on('click','.u-dropdown h4',function(event){
			
			if(!$('#sidebar').hasClass('sidesmall')){
				var t = $(this);
				var next = t.next();
				var at1 = t.parent().parent().parent().find('h4');
				var at2 = t.parent().parent().parent().find('.u-dropdown-menu');
				// 点 开收起or展开
				if(next.hasClass('u-act2')){
					//at2.removeClass('u-act2');
					next.removeClass('u-act2');
				}else{
					at2.removeClass('u-act2');
					next.addClass('u-act2');
				}
				makeTheTitleChange(); // 部署好类名后，执行相应动画
			}
		});
		// 小标题
		$(document).on('click','.u-dropdown .u-dropdown-menu > li',function(event){
			var t = $(this);
			var ev = event || window.event;
			var tar = ev.target || ev.srcElement;
			var eve = $(tar);
			var at1 = $('.u-dropdown h4');
			var at3 = $('.u-dropdown .u-dropdown-menu > li');
			var nowhref = eve.find('a').attr('href');
			if(eve.attr('href')){
				nowhref = eve.attr('href');
			}
			if(window.location.href.indexOf(nowhref)>=0 ){
				if(nowhref != "#/config_wizard/config_wizard"){
					
					window.location.reload();
				}
				
			}
			at3.removeClass('u-act3');
			at3.removeClass('u-3');
			t.addClass('u-act3');
			t.addClass('u-3');
			at1.removeClass('u-act1')
			t.parent().parent().find('h4').addClass('u-act1');
			var tn = String(eve[0].tagName);
			if(tn!='A'&&tn!='a'){
				eve.find('a')[0].click();
			}
			//修改帮助文档的目标地址
			var urlstr = "help.html";
			if(t){
				var urls = t.find('a').attr('href');
				if(t.attr('href')){
					urls = t.attr('href')
				}
				urls = urls.substr(urls.lastIndexOf('#'));
				urlstr += urls;
			}
			$('#header_help_link').attr('href',urlstr);
			skiphideli = true;
		})
		// 收起后的主标题点击
		$(document).on('click','.u-dropdown h4',function(event){
			var t = $(this);
			var next = t.next();
			if($('#sidebar').hasClass('sidesmall')){
				
				if(next.css('display')!="block"){
					$('.u-dropdown .u-dropdown-menu').hide();
					next.show();
					$('.u-dropdown h4').removeClass('u-largeH4');
					t.addClass('u-largeH4');
				}else{
					$('.u-dropdown .u-dropdown-menu').hide();
					$('.u-dropdown h4').removeClass('u-largeH4');
				}
			}
		});
		// 点击其他元素隐藏当前框
		skiphideli = false; //内部点击不会影响左侧导航栏的收起
		$(document).on('click',function(event){
			
			var ev = event||window.event;
			var target = ev.target || ev.srcElement;
			var eve = $(target);
			if($('#sidebar').hasClass('sidesmall')){
				var e1 = eve[0].tagName;
				var e2 = eve.parent()[0].tagName;
				var e3 = eve.parent().hasClass('u-dropdown-menu') || eve.parent().parent().hasClass('u-dropdown-menu') || 'no';
					if(e1!='h4'&&e1!='H4'&&e2!='h4'&&e2!='H4'&&e3=='no'){
							if(skiphideli == false){
								$('.u-dropdown .u-dropdown-menu').hide();
								$('.u-dropdown h4').removeClass('u-largeH4');
							}else{
								skiphideli = false;
							}
					}
			}
		});
	}
	//导航栏根据u-act2类名开始变换ul
	function makeTheTitleChange(){
		$('.u-dropdown .u-dropdown-menu').each(function(){
			var t = $(this);
			if(!t.hasClass('u-act2')&&t.hasClass('realon')){
				t.css({height:'0px'});
				t.removeClass('realon');
			}else if(t.hasClass('u-act2')){
				t.css({height:t.attr('openH')});
				t.addClass('realon');
			}
		})
	}
	// 添加点击水纹特效
	function setWaterPointerClick(){
		// 导航栏小标题
		$(document).on('mouseup', '.u-dropdown .u-dropdown-menu > li',function (event) {
		    var t =$(this);
		    var e = event || window.event;
		    px = e.pageX;
		    py = e.pageY;
		    var left = px - t.offset().left;
		    var top = py - t.offset().top;
		    t.append('<div class="u-dot" style="top:' + top + 'px;left:' + left + 'px;"></div>');
		    setTimeout(function (){
		        t.find('.u-dot:first-of-type').remove();
		    }, 1601);
		});
	}
	// 添加 缩回导航栏小按钮
	function setRetractBtn(){
		$('#retract').click(function(){
			var t = $(this);
			var sd = $('#sidebar');
			var allul = sd.find('ul.u-dropdown-menu');
			var r = $('.main-right');
			
			if(sd.hasClass('sidesmall')){
				t.find('i').attr('class','icon-chevron-left');
				sd.removeClass('sidesmall');
				allul.show()
					 .each(function(){
						var nt = $(this);
						nt.css({height:'0px'});
				})
				allul.css({transition: 'height 0.3s cubic-bezier(0.65, 0.05, 0.36, 1)'});
				sd.find('.u-act3').parent().prev().click();
				r.css({marginLeft:'170px'})
			}else{
				t.find('i').attr('class','icon-chevron-right');
				sd.addClass('sidesmall');
				allul.css({transition: 'height 0s'});
				allul.hide()
					 .each(function(){
						var nt = $(this)
						nt.css({height:nt.attr('openH')})
						  .removeClass('realon')
						  .removeClass('u-act2');
				r.css({marginLeft:'40px'})
				})
			}
		});
		// 点击灰色处同样点击展开按钮
		$(document).on('click','#sidebar.sidesmall',function(event){
			var eve = event || window.event;
			var targets = event.target || event.srcElement;
			var ts = $(targets);
			var t = $('#retract');
			var sd = $('#sidebar');
			var allul = sd.find('ul.u-dropdown-menu');
			var r = $('.main-right');
			if(String(ts.attr('id'))=='sidebar'){
				t.removeClass('u-retractforhover');
				t.find('i').attr('class','icon-chevron-left');
				sd.removeClass('sidesmall');
				allul.show()
					 .each(function(){
						var nt = $(this);
						nt.css({height:'0px'});
				});
				allul.css({transition: 'height 0.3s cubic-bezier(0.65, 0.05, 0.36, 1)'});
				sd.find('.u-act3').parent().prev().click();
				r.css({marginLeft:'170px'});
			}
		});
		// hover灰色处，收缩按钮同时触发变色效果
		$(document).on('mouseover','#sidebar.sidesmall',function(event){
			var eve = event || window.event;
			var targets = event.target || event.srcElement;
			var ts = $(targets);
			if(String(ts.attr('id'))=='sidebar'){
				$('#retract').addClass('u-retractforhover');
			}
			
		});
		$(document).on('mouseout','#sidebar.sidesmall',function(event){
			var eve = event || window.event;
			var targets = event.target || event.srcElement;
			var ts = $(targets);
			if(String(ts.attr('id'))=='sidebar'){
				$('#retract').removeClass('u-retractforhover');
			}
		});
	}
	/*调整配置向导的操作*/
	function resetConfig(){
		var $sider_a_pzxd = $('#sidebar a[href="#/config_wizard/config_wizard"]');
		$sider_a_pzxd.parent().parent().addClass('u-hide');
		$sider_a_pzxd.parent().parent().prev().click(function(){
			$sider_a_pzxd.parent().trigger('click');
//			var wh = window.location.href;
//			if(wh.indexOf('#')>=0){
//				window.location.href = wh.split('#')[0]+"#/config_wizard/config_wizard";
//			}
			
		});
		
		
	}
	function setSiderbar(){
		/*初始化子列表高度*/
		getTheHeightOfSon();
		
		/*绑定标题的点击事件*/
		setTitleClick();
		
		/*变幻导航栏方法*/
		makeTheTitleChange();
		
		/*展开 缩回小按钮的绑定事件*/
		setRetractBtn();
		
		/*配置向导*/
		resetConfig();
		
	}
	function getDom(){
		var urlConfig  = require('P_config/urlConfig');
		var list       = urlConfig.getSidebarConfig(); 
		if(list){
			var Sidebar    = require('P_template/common/Sidebar');
			var $dom       = $(Sidebar.getHTML(list));
			return $dom;
		}else{
			return false;
		}
		
		
	}
	function translate(){
		var Translate  = require('Translate');
		Translate.translate([$container], ['common']);
	}
	function displaySidebar(){
		var $dom = getDom();
		console.log($dom);
		if($dom){
			$container.append($dom);
			translate();
			setSiderbar();
			openDefaultSider();
		}else{
			setTimeout(function(){
				displaySidebar();
			},300);
		}
		
	}
	
	/*
	 	根据地址栏打开对应的导航栏状态
	 	( 传参为 “ #/behavior_management/behavior_management ” )
	 * */

	function defaultOpenStatus(lasturl){
		if(lasturl !== '' || lasturl !== undefined){
			var t = $('#sidebar').find('a[href="'+lasturl+'"]').parent();
			var at1 = $('.u-dropdown h4');
			var at3 = $('.u-dropdown .u-dropdown-menu > li');
			at3.removeClass('u-act3');
			at3.removeClass('u-3');
			t.addClass('u-act3');
			t.addClass('u-3');
			at1.removeClass('u-act1')
			t.parent().parent().find('h4').addClass('u-act1').next().addClass('u-act2');;
			makeTheTitleChange();
		}
	}
	function openDefaultSider(){
		var nowurl = window.location.href;
		if(nowurl.indexOf('#')>0){
			var uaft = nowurl.substr(nowurl.indexOf('#'));
			if(uaft != '#'){
				defaultOpenStatus(uaft);
			}
		}
		
	}
	
	
	module.exports = {
		displaySidebar : displaySidebar
	};
});
