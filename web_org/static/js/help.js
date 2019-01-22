/**
 * 帮助文档
 * QC
 */
seajs.use('./modules/config/seajsConfig', function(seajsConfig){
		
		//重置布局
		windowresize()
		$(window).resize(function(){
			windowresize()
		});
		function windowresize(){
			var heights =  $(window).height();
			$('body').css('height',heights+"px");
		}
		/*
		 读取cookie
		 * **/
		function get_cookie(Name) {
		   var search = Name + "="//查询检索的值
		   var returnvalue = "";//返回值
		   if (document.cookie.length > 0) {
		     sd = document.cookie.indexOf(search);
		     if (sd!= -1) {
		        sd += search.length;
		        end = document.cookie.indexOf(";", sd);
		        if (end == -1)
		         end = document.cookie.length;
		         //unescape() 函数可对通过 escape() 编码的字符串进行解码。
		        returnvalue=unescape(document.cookie.substring(sd, end))
		      }
		   } 
		   return returnvalue;
		}
		
		
		//获得配置内容
		var siderlist    = {};	//导航栏
		var helplist = {};	//帮助
		
		
		seajs.use('./static/js/action', function(urlConfig){
			var defaultLang = 'zhcn';
			var currentLang ='';
			$.ajax({
				url : 'common.asp?optType=lang',
				type: 'GET',
				success : function(result){
					eval(result);
					if(lang == '' || lang == undefined || lang == 'undefined'){
						currentLang = defaultLang;
					}else{
						currentLang = lang;
					}
				}
			});
			seajs.use('./modules/config/urls', function(urljs){
				if(currentLang == 'zhcn'){
					seajs.use('./lang/zhcn/helpConfig', function(helpConfig){
						makeHoleDom(urljs,helpConfig);
					});
				}else if(currentLang == 'en'){
					seajs.use('./lang/en/helpConfig', function(helpConfig){
						makeHoleDom(urljs,helpConfig);
					});
				}else{
					seajs.use('./lang/zhcn/helpConfig', function(helpConfig){
						makeHoleDom(urljs,helpConfig);
					});
				}
			});
		});
		
		function makeHoleDom(urljs,helpConfig){
			var menus = urljs.menus;
			var urls = urljs.urls;
			var newArr = [];
			for(var mkey in menus){
				
				var mobj = {title : menus[mkey].title,links:[]};
				for(var ukey in urls){
//								console.dir(urls[ukey].menu+"~~~"+mkey)
					if(urls[ukey].menu == mkey){
						mobj.links.push({title:urls[ukey].title,link:(menus[mkey].link+urls[ukey].link)})
					}
				}
				newArr.push(mobj);
			}
			siderlist = newArr;
			
			helplist = helpConfig.help;
			
			/* 数据过滤  将未存在帮助文档的标题栏删除 */
			siderlist.forEach(function(psObj){
				var existNum = 0;
				psObj.links.forEach(function(sObj,sIndex){
					var exist = false;
					var thisslinks = sObj.link.toString();
					thisslinks = thisslinks.substr(thisslinks.lastIndexOf('/')+1);
					for(var h in helplist){
						if(helplist[h].pLink && helplist[h].pLink == thisslinks){
							exist = true;
							existNum++;
						}
					}
					sObj.exist = exist;
				})
				psObj.exist = existNum;
			})
			
		//初始化
		$(document).ready(function(){
			//生成导航栏
			var leftDomStr = getSiderDom(siderlist);
			$('#help_left_part').append(leftDomStr);
			//绑定点击事件
			setClick();
			//根据刷新时的url改变当前对应文档
			var hrefurls = window.location.href;
			var hrefurls = hrefurls.substr(hrefurls.lastIndexOf('/')+1);
			if(hrefurls != '' && hrefurls != 'help.html'){
				var refreshActiveTab = 0;
				if(hrefurls.lastIndexOf('#') >= 0){
					refreshActiveTab = hrefurls.substring(hrefurls.lastIndexOf('#'),hrefurls.length+1);
					hrefurls = hrefurls.substring(0,hrefurls.lastIndexOf('#'));
				}
				$("#"+hrefurls).parent().addClass('help-a-onclick');
				var rightDomStr = getHelpDom(helplist,hrefurls);
				$('#help_right_part').empty().append(rightDomStr);
				$('#help_right').click();
				if(refreshActiveTab){
					$('#help_right').animate({scrollTop:$(refreshActiveTab).offset().top},200);
				}
			}else if(hrefurls == 'help.html'){
				var rightDomStr = getHelpDom(helplist,hrefurls);
				$('#help_right_part').empty().append(rightDomStr);
			}
			//有锚点传入
			if(get_cookie('activeTab')){
				var thisAnchor = get_cookie('activeTab');
				var thisAnchorId = ("#"+thisAnchor);
				if($(thisAnchorId)[0] && $(thisAnchorId).offset()){
					$('#help_right').animate({scrollTop:$(thisAnchorId).offset().top},200);
				}
				
			}
			
			//添加右下角小组件
			$('#help_scrollTop').click(function(){$('#help_right_part').animate({scrollTop:0},200);});
			//调整部分布局
			changePart();
			
		});
		//左侧链接点击事件
		
		function setClick(){
			//导航栏绑定
			$('ul li a').click(function(){
				document.cookie=("activeTab=0");
				$('#help_left_part').find('a').removeClass('help-a-onclick');
				$(this).addClass('help-a-onclick');
				var urls = $(this).attr('href');
				var urls = urls.substr(urls.lastIndexOf('/')+1);
				if(urls != ''){
					var rightDomStr = getHelpDom(helplist,urls);
					$('#help_right_part').empty().append(rightDomStr);
					$('#help_right').animate({scrollTop:0},200);
				}
				//调整部分布局
				changePart();
			});
			
			//右侧文档点击
			$('#help_right').click(function(){
				var hrefurls = window.location.href;
				var hrefurls = hrefurls.substr(hrefurls.lastIndexOf('/')+1);
				if(hrefurls != '' && hrefurls != 'help.html'){
					var $title = prevfind($('#'+hrefurls));
					$('#help_left').animate({scrollTop:$title.position().top},200);
				}
			});
		}
		
		function prevfind(obj){
			
			var pre = obj.parent().parent().prev();
			if(pre.children()[0].tagName == 'H3'){
				return $(pre.children()[0]);
			}else{
				return prevfind($(pre.find('a').children().eq(1)));
			}
		}
		}
		
	/**
	 * 右侧文档生成
	 * by QC
	 * @param {Object} helpList
	 * @param {Object} hrefurls
	 */
	function getHelpDom(helpList,hrefurls){
		var thisList = {};//文档json
		var thisHelpArr = [];
		helpList.forEach(function(obj){
			if(obj.pLink == hrefurls){
				thisHelpArr.push(obj);
			}
		});
		if(thisHelpArr.length != 0){
			
			thisList = thisHelpArr;
		}else{
			if(hrefurls == 'help.html'){
				thisList = [{pLink:'',link:{id:'1',tl:'欢迎阅读帮助文档'},content:[{s	:'点击左侧链接开始阅读吧！'}]}];
			}else{
				thisList = [{pLink:'',link:{id:'1',tl:'<span style="color:#878787">（暂无该页面对应文档）</span>'},content:[]}];
				
			}
		}
		var tableinner = '';
		//拼接文档
		thisList.forEach(function(thisTab){
			tableinner += '<h1 id="'+thisTab.link.id+'">'+thisTab.link.tl+'</h1><hr>';
			tableinner += '<table class="u-help-table"><tbody>';
			var cons = thisTab.content;
			cons.forEach(function(con){
				for(var i in con){
					switch(i){
						case 't1'://大标题
							tableinner += '<tr><td colspan="2"><h2>'+con[i]+'</h2></td></tr>';
							break;
						case 't2'://二标题
							tableinner += '<tr><td colspan="2"><h3>'+con[i]+'</h3></td></tr>';
							break;
						case 't3'://三标题
							tableinner += '<tr><td colspan="2"><h4>'+con[i]+'</h4></td></tr>';
							break;
						case 'p'://普通内容
							if($.isArray(con[i])){
								if($.isArray(con[i][0])){	//表格部分
									tableinner += '<tr><td colspan="2"><table class="help-smtable"><tbody>';
									con[i].forEach(function(obj,j){
										tableinner += '<tr>';
										obj.forEach(function(obj1,j1){
											tableinner += '<td>'+obj1+'</td>';
										});
										tableinner += '</tr>';
									});
									tableinner +='</tbody></table></td></tr>';
								}else if(typeof(con[i][0])=="string"){ 	//红字释义语句
									tableinner += '<tr><td class="help-front-td"><span class="help-front-span">'+con[i][0]+'</span></td><td><span>'+con[i][1]+'</span></td></tr>';
								}
							}else if(typeof(con[i])=="string"){	//长篇文字
								tableinner += '<tr><td colspan="2"><p>'+con[i]+'</p></td></tr>';
							}
							break;
						case 's'://短文字
							tableinner += '<tr><td colspan="2"><span>'+con[i]+'</span></td></tr>';
							break;
						case 'ss'://提示文字
							tableinner += '<tr><td colspan="2"><span class="help-notespan">'+con[i]+'</span></td></tr>';
							break;
					}
				}
			});
			tableinner += '</tbody></table>';
		});
		
		
		
		return tableinner;
	}
		
	/**
	 * 左侧导航栏生成
	 * by QC
	 * @param {Object} siderlist
	 */
	function getSiderDom(siderlist){
		var siderStr = '<ul class="help_sider">';
		siderlist.forEach(function(obj){
			if(obj.exist >0){
				siderStr += '<li><h3>'+obj.title+'</h3></li>';
				obj.links.forEach(function(links){
					if(links.exist){
						siderStr += '<li><a href="'+links['link']+'"><span class="help-frontpoint"></span><span id="'+(links['link'].substr(links['link'].lastIndexOf('/')+1))+'">'+links.title+'</span></a></li>';
					}
				});
			}
		});
		siderStr += '</ul>';
		return siderStr;
	}
	
	/**
	 * 调整部分布局
	 * QC
	 */
	function changePart(){
		var maxlength = 0;
		$('.help-front-td').each(function(){
			var $thistd = $(this);
			var thislength = $thistd.find('.help-front-span').width();
			maxlength = maxlength>=thislength?maxlength:thislength;
		});
		$('.help-front-td').css('width',(maxlength+20)+"px");
	}
	
	
	
}); 



