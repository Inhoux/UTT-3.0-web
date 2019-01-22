/**
 * 栅格显示系统
 * @author	QC
 * @date	2016-9-21
 *
 */
define(function(require, exports, module){
	require('jquery');
	
	function GridClass(datas){
		this.datas = datas;		//原始数据
		this.list = this.datas.list;		//原始数据
		this.muchtabs = '';		//多标签数据
		this.singletabs = '';	//单标签数据
		this.sortSgIdArr = [];	//根据显示与否排序的单标签id数组
		this.$dom = '';			//GridJQ对象
		
		
		this.initDom(this.list);
	}
	/**
	 * 获取栅格对象
	 * 
	 * */
	function getGridObj(datas){
		var gd = new GridClass(datas);
		return gd;
	}
	/**
	 * 获取已初始化的JQ文档对象：
	 * 
	 * */
	GridClass.prototype.get$Dom =function(){
		return this.$dom;
	}
	/**
	 *	初始化：
	 * 
	 * */
	GridClass.prototype.initDom = function(demolist){
		var t = this;
		//将多标签页和单标签页数据按原有顺序分开存放
		t.pick();
		//生产最外层框架$html
		var $gd_all = $('<div class="u-grid"></div>');
		this.$dom = $gd_all;
		$gd_all.append('<div class="gd-much-group"><div class="container"></div></div>');//多标签组
		$gd_all.append('<div class="gd-single-group "></div>');//单标签组
		$gd_all.append('<div class="gd-hide-group"><div class="u-gd-sgset" set="0"></div></div>');//隐藏组
		
		//首先生产多标签组元素
		for(var i in t.muchtabs){
			t.$dom.find('.gd-much-group>.container').append(getMuchinner(t.muchtabs[i]));
		}
		
		//其次生产单标签组
		var sg_left = [];//1,3,5...
		var sg_right = [];//2,4,6...
		for(var i in t.singletabs){
			if(i == 0 || i % 2 ==0){
				sg_left.push(Number(i)+1);
			}else{
				sg_right.push(Number(i)+1);
			}
		}
		var $sg_coverhtml = $('<div class="container"><div class="row"><div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 gd-sg-left"></div><div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 gd-sg-right"></div></div></div>');
		var leftpart ='';
		for(var i in sg_left){
			leftpart += '<div class="container"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 u-gd-sgset" set="'+sg_left[i]+'"></div></div></div>';
		}
		$sg_coverhtml.find('.gd-sg-left').append(leftpart);
		var rightpart ='';
		for(var i in sg_right){
			rightpart += '<div class="container"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 u-gd-sgset" set="'+sg_right[i]+'"></div></div></div>';
		}
		$sg_coverhtml.find('.gd-sg-right').append(rightpart);
		t.$dom.find('.gd-single-group').append($sg_coverhtml);
		
		//生产单标签组的各个内框,将其暂时存放在隐藏div里
		for(var i in t.singletabs){
			t.$dom.find('.gd-hide-group').append(getSingleInner(t.singletabs[i]));
		}
		///////////////
		t.sortshow();
		t.repush();
		setInteraction(t);
		t.refresh();
	}
	/**
	 * 显示排序：
	 * 	对指定的多标签页显示隐藏相关部位，
	 * 	对指定的单标签页根据显示隐藏进行排序
	 * 
	 * */
	GridClass.prototype.sortshow = function(){
		var t = this;
		//对标签页：根据数据里hide与否，将单标签数据id排序，并修改其对应.cover的send属性，
		t.sortSgIdArr = [];
		for(var i in t.singletabs){
			var hidethis = t.singletabs[i].hide || false;
			
			if(hidethis){
				
				t.$dom.find('div.gd-single-cover[cover='+t.singletabs[i].id+']').attr('send',0);
			}else{
				t.sortSgIdArr.push(t.singletabs[i].id);
			}
			
		}
		//修改显示的cover
		for(var i in t.sortSgIdArr){
			t.$dom.find('div.gd-single-cover[cover='+t.sortSgIdArr[i]+']').attr('send',Number(i)+1);
		}
		
		//对多标签页：直接隐藏gnot=id的相关部位
		for(var i in t.muchtabs){
			var nowlength = t.muchtabs[i].length;
			var checklength = 0;
			
			var hideids = '';
			var covers = '';
			//拼接父cover属性
			for(var j in t.muchtabs[i]){
				covers += '#'+t.muchtabs[i][j].id;
			}
			//遍历多标签中每一组 进行隐藏操作
			for(var j in t.muchtabs[i]){
				var _mchide =  t.muchtabs[i][j].hide || false;
				
				if(_mchide){
					//如果hide为true，隐藏标签数++并隐藏相关标签
					checklength++;
					t.$dom.find('[gnot='+t.muchtabs[i][j].id+']').each(function(){
						$(this).addClass('u-hide');
					});
					var _nota = t.$dom.find('.gd-much-cover li.active[gnot="'+t.muchtabs[i][j].id+'"]');
					if(typeof(_nota.attr('gnot'))!="undefined"){
						_nota.siblings().each(function(){
							if(!$(this).hasClass('u-hide') && typeof($(this).attr('gnot'))!="undefined"){
								$(this).addClass('active').siblings('li').removeClass('active');
								t.$dom.find('[gnot='+$(this).attr('gnot')+']').each(function(){
									$(this).removeClass('u-hide');
								});
								$('#'+$(this).attr('gnot')).addClass('in').addClass('active').siblings().each(function(){
									$(this).removeClass('in').removeClass('active');
								});
								return false;
							}
						})
					}
				}else{
					t.$dom.find('[gnot='+t.muchtabs[i][j].id+']').removeClass('u-hide');
				}
			}
			
			//判断多标签页是否为全部隐藏状态
			if(nowlength == checklength){
				//若全部隐藏，则继续隐藏其父cover
				t.$dom.find('.gd-much-cover[cover="'+covers+'"]').addClass('u-hide');
				var _t = t.$dom.find('.gd-much-cover[cover="'+covers+'"] .gd-close-open');
				var tanc = _t.parents('.gd-much-cover,.gd-single-cover').find('.tab-content');
				//自动收起
				if(_t.hasClass('glyphicon-chevron-up')){
					_t.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
					tanc.css({
							overflow: 'hidden',
							height : '0px',
							opacity : 0
						});
					_t.attr('showover','1');
				}
				
			}else{
				//若没有全部隐藏
					//如果cover之前为隐藏状态
				if(t.$dom.find('.gd-much-cover[cover="'+covers+'"]').hasClass('u-hide')){
					t.$dom.find('.gd-much-cover[cover="'+covers+'"] li').each(function(){
						if(!$(this).hasClass('u-hide')){
							$(this).addClass('active').siblings('li').removeClass('active');
								t.$dom.find('[gnot='+$(this).attr('gnot')+']').each(function(){
									$(this).removeClass('u-hide');
								});
								$('#'+$(this).attr('gnot')).addClass('in').addClass('active').siblings().each(function(){
									$(this).removeClass('in').removeClass('active');
								});
							return false;
						}
					});
					t.$dom.find('.gd-much-cover[cover="'+covers+'"]').removeClass('u-hide');
					var _t = t.$dom.find('.gd-much-cover[cover="'+covers+'"] .gd-close-open');
					var tanc = _t.parents('.gd-much-cover,.gd-single-cover').find('.tab-content');
					//自动展开
					if(_t.hasClass('glyphicon-chevron-down')){
						_t.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
						tanc.css({
							height : parseInt(tanc.children('div.active').css('height')),
							opacity : 1
						});
						setTimeout(function(){
							tanc.css({
								overflow: 'visible',
								height : 'auto'
							});
							_t.attr('showover','1');
						},201);
					}
				}
			}
		}
	}
	/**
	 * 重置布局：
	 * 	重置显示标签页的位置，将每个cover节点放到对应send==set的节点里
	 * 
	 * */
	GridClass.prototype.repush = function(){
		var t = this;
		var $sgg = t.$dom.find('div.gd-single-cover');
		$sgg.each(function(){
			var ss = $(this);
			var sends = parseInt(ss.attr('send'));
			var sets = parseInt(ss.parents('div.u-gd-sgset').attr('set'));
			if(sends != sets){
				var clones = ss.clone();
				ss.remove();
				t.$dom.find('div.u-gd-sgset[set='+sends+']').append(clones);
			}
		});
	}
	/**
	 * 刷新数据操作：
	 * 	
	 * */
	GridClass.prototype.refresh = function(){
		var t= this;
		t.pick();
		t.sortshow();
		t.repush();
		t.$dom.find('.gd-much-group .gd-control-btns>a').addClass('u-hide');
		t.$dom.find('.gd-much-group .gd-control-btns>a[gnot="'+t.$dom.find('.gd-much-group .gd-much-cover li.active[gnot]').attr('gnot')+'"]').removeClass('u-hide');
	}
	
	/**
	 * 数据分拣：
	 * 	将多标签和单标签分开装入制定数组
	 * 
	 * 
	 * */
	GridClass.prototype.pick = function(){
		var t = this;
		//将修改后的数据分组并覆盖分组数组
		var muchArr = [];
		var singleArr =[];
		for(var i in t.list){
			if(t.list[i].length>1){
				muchArr.push(t.list[i]);
			}else{
				singleArr.push(t.list[i][0]);
			}
		}
		t.muchtabs = muchArr;
		t.singletabs = singleArr;
	}
	
	/**
	 * 批量修改数据([{name: name , id: id , check: true}])
	 * 
	 * 
	 * */
	GridClass.prototype.modify = function(jsons){
		var t = this;
		for(var i in t.list){
			for(var j in t.list[i]){
				for(var n in jsons){
					var j_id = jsons[n].id || '';
					var j_name = jsons[n].name || '';
					
					var _id = t.list[i][j].id || '';
					var _title = t.list[i][j].title || '';
					
					if(j_name == _title){
						var _show = jsons[n].check || false;
						t.list[i][j].hide = (!_show);
					}
					
				}
			}
		}
		t.refresh();
	}
	
	/**
	 * 修改单个数据
	 * 
	 * 
	 * */
	GridClass.prototype.showable = function(id,check){
		var t = this;
		for(var i in t.list){
			for(var j in t.list[i]){
				var j_id = id;
				
				var _id = t.list[i][j].id || '';
				var _hide = t.list[i][j].hide; 
				if(_id == j_id){
					if(check === undefined){
						t.list[i][j].hide = !(t.list[i][j].hide);
					}else{
						t.list[i][j].hide = !(check);
					}
				}
			}
		}
		t.refresh();
	}
	
	/**
	 * 单标签页的生产
	 * */
	function getSingleInner(nowjson){
		var as = '';
			var hasA = nowjson.linkurl || '';
			if(typeof(hasA)!="undefined" && hasA != null && hasA != ''){
				console.log(hasA)
				as = '<a href="'+nowjson.linkurl+'">[ 更 多 ]</a>';
			}
			var demoHeight = '';
			if(nowjson.height !== undefined && nowjson.height != ''){
				if(Number(nowjson.height)){
					demoHeight = 'height:' + nowjson.height + 'px;overflow:auto;';
				}else{
					demoHeight = 'height:' + nowjson.height + ';overflow:auto;';
				}
			}
			var sg_inner_box = '<div class="gd-single-cover" cover="'+nowjson.id+'" send="0">'+
									'<nav><ul class="nav nav-tabs"><li class="active"><a href="#'+nowjson.id+'" data-toggle="tab">'+nowjson.title+'</a></li>'+
									'<div class="gd-control-btns">'+as+'<span class="glyphicon glyphicon-chevron-up gd-close-open"></span><span class="glyphicon glyphicon-refresh gd-refresh"></span><span class="glyphicon glyphicon-remove gd-remove"></span></div>'+
									'</ul></nav>'+
									'<div class="tab-content" ><div class="tab-pane fade in active" id="'+nowjson.id+'" style="'+demoHeight+'"></div><div>'+
								'</div>';
			return $sg_inner_box = $(sg_inner_box);
	}
	/**
	 * 多标签页的生产：
	 * */
	function getMuchinner(nowarr){
			var covers = '';//初始化cover：''  (#id1#id2#id3...)
			for(var j in nowarr){
				covers += '#'+nowarr[j].id;
			}
			var $muchs = $('<div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="gd-much-cover" cover="'+covers+'"></div></div></div>');
			//制造内标签
			var muchsinner = '<nav><ul class="nav nav-tabs">';
			var firsttab = true;
			for(var j in nowarr){
				var liclass = '';
				if(firsttab){
					firsttab = false;
					liclass = 'class="active"';
				}
				muchsinner += '<li '+liclass+' gnot="'+nowarr[j].id+'" ><a href="#'+nowarr[j].id+'" data-toggle="tab">'+nowarr[j].title+'</a></li>';
			}
			var as = '';
			for(var j in nowarr){
				var hasA = nowarr[j].linkurl || '';
				if(typeof(hasA)=="undefined" || hasA == null || hasA == '')continue;
				
					as += '<a href="'+nowarr[j].linkurl+'" gnot="'+nowarr[j].id+'">[ 更 多 ]</a>';
				
			}
			muchsinner += '<div class="gd-control-btns">'+as+'<span class="glyphicon glyphicon-chevron-up gd-close-open"></span><span class="glyphicon glyphicon-refresh gd-refresh"></span><span class="glyphicon glyphicon-remove gd-remove"></span></div>';
			muchsinner += '</ul></nav><div class="tab-content" >';
			var firstdiv = true;
			for(var j in nowarr){
				var divclass = '';
				if(firstdiv){
					firstdiv = false;
					divclass = "active in";
				}
				var demoHeight = '';
				if(nowarr[j].height !== undefined && nowarr[j].height != ''){
					if(Number(nowarr[j].height)){
						demoHeight = 'height:' + nowarr[j].height + 'px;overflow:auto;';
					}else{
						demoHeight = 'height:' + nowarr[j].height + ';overflow:auto;';
					}
				}
				muchsinner += '<div class="tab-pane fade '+divclass+'" id="'+nowarr[j].id+'" gnot="'+nowarr[j].id+'" style="'+demoHeight+'"></div>';
			}
			muchsinner += '</div>';
			$muchs.find('.gd-much-cover').append(muchsinner);
			return $muchs;
	}
	
	/**
	 *	交互等事件的绑定： 
	 *
	 */
	function setInteraction(gt){
		var g = gt;
		var t = g.$dom;
		
		//多标签页的链接显示
		t.find('.gd-much-group .gd-control-btns>a').addClass('u-hide');
		t.find('.gd-much-group .gd-control-btns>a[gnot="'+t.find('.gd-much-group .gd-much-cover li.active[gnot]').attr('gnot')+'"]').removeClass('u-hide');
		t.on('click','.gd-much-group .gd-much-cover li[gnot]',function(){
			var _t = $(this);
				t.find('.gd-much-group .gd-control-btns>a').addClass('u-hide');
				t.find('.gd-much-group .gd-control-btns>a[gnot="'+_t.attr('gnot')+'"]').removeClass('u-hide');
		});
		
		//展开收起功能
		t.find('.gd-close-open').attr('showover',1);
		t.on('click','.gd-close-open',function(){
			
			var _t = $(this);
			if(_t.attr('showover') == '1'){
				_t.attr('showover','0');
				var tanc = _t.parents('.gd-much-cover,.gd-single-cover').find('.tab-content');
				
				if(_t.hasClass('glyphicon-chevron-up')){
					_t.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
					tanc.css({
						height : parseInt(tanc.children('div.active').css('height')),
						transition: 'all 0.2s ease-out'
					});
					setTimeout(function(){
						tanc.css({
							overflow: 'hidden',
							height : '0px',
							opacity : 0
						});
					},1);
					setTimeout(function(){
						_t.attr('showover','1');
					},201);
				}else{
					_t.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
					tanc.css({
						height : parseInt(tanc.children('div.active').css('height')),
						opacity : 1
					});
					setTimeout(function(){
						tanc.css({
							overflow: 'visible',
							height : 'auto'
						});
						_t.attr('showover','1');
					},201);
				}
			}
			
		});
		
		//关闭事件 并触发回调
		t.on('click','.gd-remove',function(event){
			var e = event || window.event;
			var _t = event.target || event.srcElement;
			var $t = $(_t);
			var $ps = $t.parents('div[cover]'); 
			var closelist = [];					//将要关闭的对象数组
			
			//如果是复合框
			if($ps.hasClass('gd-much-cover')){
				var carr = $ps.attr('cover').split('#');
				carr.shift();
				
				//遍历原数据，找出和关闭点击对应的复合框的那几个对象
				for(var i in g.list){
					//长度不符合跳过
					if(g.list[i].length <= 1 || g.list[i].length != carr.length)continue;
					//id不符合跳过
					var thistr = true; 
					for(var j in g.list[i]){
						if(g.list[i][j].id != carr[j]) {thistr = false;}
					}
					if(thistr){
						//将符合的对象加到即将删除的数组中
						for(var j in g.list[i]){
							g.list[i][j].hide = true;
							closelist.push({title : g.list[i][j].title , id : g.list[i][j].id ,hide : g.list[i][j].hide});
						}
					}
				}
			//如果是单框
			}else if($ps.hasClass('gd-single-cover')){
				
				for(var i in g.list){
					if(g.list[i].length>1)continue;
					if(g.list[i][0].id == $ps.attr('cover')){
						g.list[i][0].hide = true;
						closelist.push({title : g.list[i][0].title , id : g.list[i][0].id ,hide : g.list[i][0].hide});
					}
				}
			}
			//刷新栅格
			g.refresh();
			
			var alllist = g.list.concat();	
			g.datas.close(event,closelist,alllist);
		});
		
			//刷新事件
		t.on('click','.gd-refresh',function(event){
			var e = event || window.event;
			var _t = event.target || event.srcElement;
			var $t = $(_t);
			var $ps = $t.parents('div[cover]');
			var refreshdata = {};
			var $psnow = '';
			//判断是多标签组还是单标签组的刷新按钮，做不同的刷新操作
			if($ps.hasClass('gd-much-cover')){
				$psnow = $ps.find('.tab-content');
				for(var i in g.list){
					if(g.list[i].length<=1)continue;
					for(var j in g.list[i]){
						if(g.list[i][j].id == $ps.find('li.active').attr('gnot'))
						refreshdata = {
							title :g.list[i][j].title,
							id : g.list[i][j].id,
							hide : g.list[i][j].hide,
							linkurl : g.list[i][j].linkurl
						}
					}
				}
				
			}else if($ps.hasClass('gd-single-cover')){
				$psnow = $ps.find('.tab-content');
				for(var i in g.list){
					if(g.list[i].length>1)continue;
					if(g.list[i][0].id == $ps.attr('cover')){
						refreshdata = {
							title :g.list[i][0].title,
							id : g.list[i][0].id,
							hide : g.list[i][0].hide,
							linkurl : g.list[i][0].linkurl
						}
					}
				}
			}
			var $dom = $psnow.children('.refresh-anm-cover') || '';
			if($dom.length==0){
				
				//刷新等待显示的文字
				var animhtml = '<div class="refresh-anm-cover"><div class="refresh-anm-mid">'+
				
								'<div style="left:0px">·</div>'+
								'<div style="left:10px">·</div>'+
								'<div style="left:20px">·</div>'+
								'<div style="left:40px">.</div>'+
								'<div style="left:60px">.</div>'+
								'<div style="left:80px">.</div>'+
								'<div style="left:100px">·</div>'+
								'<div style="left:110px">·</div>'+
								'<div style="left:120px">·</div>'+
								
								'</div></div>';
				var $animhtml = $(animhtml);
				//将动画加入执行数组，数组两端空出各5个位置
				var arr  = new Array($animhtml.find('.refresh-anm-mid').children().length+10);
				for(var i in arr){
					arr[i] = false;
				}
				$animhtml.find('.refresh-anm-mid').children().each(function(){
					arr[$(this).index()+5] = $(this);
				});
				
				var make = [0,1,2,3,4];
				//不同位置执行的动画特效
				var cssarr = [
					{'font-weight':'normal','font-size':'14px','opacity':0.8},
					{'font-weight':'bold','font-size':'18px','opacity':0.9},
					{'font-weight':'bold','font-size':'30px','opacity':1},
					{'font-weight':'bold','font-size':'23px','opacity':0.9},
					{'font-weight':'normal','font-size':'18px','opacity':0.8}
				];
				//开始循环执行动画
				goani();
				var smsm = setInterval(function(){
					goani();
				},(($('.mid').children().length+5+10)*50));
				//将刷新等待动画加入dom
				if($psnow != null && $psnow != ''){
					$psnow.append($animhtml);
					setTimeout(function(){
						$animhtml.css('opacity',1);
					},1);
					
				}
				//这个方法用于停止动画，作为参数传入刷新回调函数
				function removeCoverAnima(){
					$ps.find('.refresh-anm-cover').css({opacity:0});
					setTimeout(function(){
						$ps.find('.refresh-anm-cover').remove();
					},300);
					clearInterval(smsm);
				}
				//返回3个参数：event，刷新的对象json数据，动画停止方法
				g.datas.refresh(event,refreshdata,removeCoverAnima);
			}
			
			//执行对应位置的动画
			function csss($t,n){
				$t.css(cssarr[n]);
			}
			//每执行一次调整对象对应的动画位置
			function rem(){
				for(var i in make){
					if((make[i]+1)>=arr.length){
						make[i] = 0;
					}else{
						make[i] ++;
					}
				}
			}
			//遍历即将执行动画的对象
			function anm(){
				for(var i= 0;i<5;i++){
					if(arr[make[i]]){
						csss(arr[make[i]],i);
					}
				}
			}
			//单次动画执行
			function goani(){
				make = [0,1,2,3,4];
				anm();
				for(var i =0;i< ($animhtml.find('.refresh-anm-mid').children().length+5);i++){
					setTimeout(function(){rem();anm();},50*(i+1));
				}
			}
			
		});
	}


	module.exports = {
		getGridObj : getGridObj
	};
});
