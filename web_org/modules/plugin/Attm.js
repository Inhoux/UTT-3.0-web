/**
 * 属性管理组件
 * @author	QC
 * @date	2016-9-20
 *
 */
define(function(require, exports, module){
	function AmClass(datas){
		this.datas = datas;
		this.showType = 2;  //显示列数
		this.$dom = '';		
		
		this.initDom(datas);
	}
	
	AmClass.prototype.initDom = function(demodatas){
			var nowObj = this;
			//默认参数配置
				this.datas = {
					top: 0,
					left:0,
					right:0,
					id : '',			//组件ID
					col : 0,			//显示的列数,默认0：默认单列，单项超出12个，或2项子个数和超过12个时采用双列，1：一列，2：两列
					//confirmBtn : false,	//是否需要确认按钮，默认不需要（若为true,则checkChange为点击确认时的回调函数）暂时没实现
					checkChange : '',	//勾选或取消的回调函数 (checkdata)
					list : []			//数据内容
				}
				
				//改参
				this.datas.top = demodatas.top || this.datas.top;
				this.datas.left = demodatas.left || this.datas.left;
				this.datas.right = demodatas.right || this.datas.right;
				this.datas.id = demodatas.id || this.datas.id;
				this.datas.col = demodatas.col || this.datas.col;
				//this.datas.confirmBtn = demodatas.confirmBtn || this.datas.confirmBtn;
				this.datas.checkChange = demodatas.checkChange || this.datas.checkChange;
				this.datas.list = demodatas.list || this.datas.list;
				
				
				//判断显示方式
				if(this.datas.list.length <= 0) return;
				if(this.datas.col == 0){
					var _ncot = 0;
					for(var _i in this.datas.list){
						var _tc = this.datas.list[_i].children;
						for(var _j in _tc){
							_ncot++;
						}
					}
					if(_ncot>=12)
					{this.showType = 2;}
					else
					{this.showType = 1;}
				}else{
					this.showType = this.datas.col;
				}
				//获取、制作属性框文档
				var coverhtml = '<div class="u-am" id="'+this.datas.id+'">'+
									'<div class="u-am-btn" title=""><a class="u-inputLink">[&nbsp;显示项&nbsp;]</a></div>'+
									'<div class="u-am-body u-hide"></div>'+
								'</div>';
				var $coverhtml = $(coverhtml);
				if(nowObj.datas.left){
					$coverhtml.css({
						top:nowObj.datas.top+'px',
						left:nowObj.datas.left+'px',
						right:'initial'
					});
				}else{
					$coverhtml.css({
						top:nowObj.datas.top+'px',
						right:nowObj.datas.right+'px',
						left:'initial'
					});
				}
				var innerhtml = '';
				var _tdl = this.datas.list;

				for(var _i in _tdl){
					var _thide = _tdl[_i].hide || false;
					if(_thide)continue;
					innerhtml += '<table><tr><th colspan="'+nowObj.showType+'">'+_tdl[_i].title+'</th><tr>';
					var _tc = _tdl[_i].children;
					var childArr = [];
					var csarr = [];
					for(var _j in _tc){
							var _tchide = _tc[_j].hide || false;
							if(_tchide)continue;
							var tcckd = _tc[_j].check || false;
							var tcdis = _tc[_j].disabled || false;
							var tcdisclass = '';
							var tcdiswirte = tcdis?'disabled="true"':' ';
							var tcckdwirte = tcckd?'checked="true"':' ';
							if(tcdis)
							tcdisclass = 'u-am-disable';
							var _cchl = '<td class="'+tcdisclass+'"><input type="checkbox" '+tcckdwirte+' '+tcdiswirte+' id="amcc_'+_i+'_'+_j+'"  aid="'+_tc[_j].id+'"/><label for="amcc_'+_i+'_'+_j+'">'+_tc[_j].name+'</label></td>';
							csarr.push(_cchl);
					}
					
					if(nowObj.showType == 1){
						for(var _m in csarr){
								innerhtml += '<tr>'+csarr[_m]+'</tr>';
						}
					}else if(nowObj.showType == 2){
						
						var _ncct = -1;
						for(var _m in csarr){
							if(_m == _ncct) continue;
							
							_ncct = Number(_m)+1;
							if(_m == (csarr.length-1)){
								innerhtml += '<tr>'+csarr[_m]+'</tr>';
							}else{
								innerhtml += '<tr>'+csarr[_m]+csarr[Number(_m)+1]+'</tr>';
							}
						}
					}
					innerhtml += '</table>';
				}
				$coverhtml.find('.u-am-body').append(innerhtml);
				this.$dom = $coverhtml;
				
				//绑定点击/check等事件
				this.$dom.find('.u-am-btn').click(function(){
					if(nowObj.$dom.find('.u-am-body').hasClass('u-hide')){
						nowObj.$dom.find('.u-am-body').removeClass('u-hide');
					}else{
						nowObj.$dom.find('.u-am-body').addClass('u-hide');
					}
				});
				$(document).on('click',function(event){
					var e = event || window.event;
					var	e = e.target || e.srcElement;
					var t = $(e);
					var _tpare = t.parents('div.u-am') || $('body');
					if(!_tpare.hasClass('u-am')){
						nowObj.$dom.find('.u-am-body').addClass('u-hide');
					}
				});
				this.$dom.on('change','input',function(event){
					var e = event || window.event;
					var	e = e.target || e.srcElement;
					var t = $(e);
					var _dataArr = [];
//					if(!(typeof(t.attr("for"))=="undefined")){
//						t=t.prev();
//					}
					t = t.parent().find('input');
					var changeOne = {
						name : t.next().html(),
						check:t.is(':checked'),
						id:t.attr('aid')
					}
					 nowObj.$dom.find('input').each(function(){
					 	var _t = $(this);
					 	var _jsons = {name : _t.next().text(),check : _t.is(':checked')};
					 	_dataArr.push(_jsons);
					 });
					 nowObj.datas.checkChange(event,changeOne,_dataArr);
				});
				
	}
	/***
	 *批量修改数据 
	 */
	AmClass.prototype.modify = function(list){
		var t = this;
		for(var j in t.datas.list){
			for(var n in t.datas.list[j].children){
				for(var i in list){
					if(t.datas.list[j].children[n].name == list[i].name){
					t.datas.list[j].children[n].check = !list[i].hide;
					}
				}
			}
		}
		t.refresh();
	}
	/***
	 *修改单个数据
	 */
	AmClass.prototype.checkable = function(id,check){
		var t = this;
		if(id !== undefined){
			var $_t = t.$dom.find('input[type="checkbox"][aid="'+id+'"]');
			var flag = false;
			if(check === undefined){
				flag = !($_t.is(':checked'));
			}else{
				flag = check;
			}
			$_t.prop('checked',flag);
		}else{
			return false;
		}
		
		
	}
	/**
	 *刷新 
	 */
	AmClass.prototype.refresh = function(){
		var t = this;
		for(var j in t.datas.list){
			for(var n in t.datas.list[j].children){
				t.$dom.find('.u-am-body label').each(function(){
					if($(this).text()==t.datas.list[j].children[n].name){
						$(this).prev().prop('checked',t.datas.list[j].children[n].check);
					}
				});
			}
		}
	}
	AmClass.prototype.get$Dom = function(){
		return this.$dom;
	}

	AmClass.prototype.getChecked = function(){
		var _dataArr = [];
		this.$dom.find('input').each(function(){
			var _t = $(this);
			var _jsons = {name : _t.next().text(),check : _t.is(':checked')};
			_dataArr.push(_jsons);
		});
		return _dataArr;
	}
	function getAttmObj(datas){
		var Am = new AmClass(datas);
		return Am;
	}
	
	module.exports = {
		getAttmObj : getAttmObj
	};
});
