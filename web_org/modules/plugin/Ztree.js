/**
 * 树状图组件
 * @author	QC
 * @date	2016-9-18
 *
 */
define(function(require, exports, module){
	require('jquery');
	require('P_libs/js/jquery.ztree.all.min.js');

    var Translate  = require('Translate');
    var dicArr     = ['common','doPeopleOrganize'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	
				/*树状图类（参数json，数据内容数组）*/
				function TreeClass(datas, nodes){
					this.datas = datas;		//参数
					this.settings = '';		//配置
					this.nodes = nodes; 	//数据内容
					this.$dom = null;		//数的JQ文档对象
					this.treeDom = '';		//树组件对象
					
					this.initDom(datas, nodes);//当新建对象时执行初始化对象
				}
				
				//初始化树方法
				TreeClass.prototype.initDom = function(demoDatas, nodes){
					
					//指向当前对象
					var nowObj = this;
					//此为默认参数
					this.datas = {
//						treeName : '树状图',		//树的名称
						simpleData : true,		//是否为简单格式（可以指定父类）
						rootId : '',			//当为简单格式下的父rootId
						treeId : 'treeDemo', 			//树的id
						lastGroupId : '',		//排在最后的组的id（一般为临时用户组）
						showUser : true,		//是否显示用户
						showCheckboxs : false,	 //是否显示复选框？
						showButtonGroup : false,  //是否显示增删改按钮组？
						treeClick : '',			//树的点击回调事件
						addClick:'',			//新增图标点击回调
						editClick : '',			//编辑图标点击回调
						removeClick : '',		//删除图标点击回调
						checkClick : '',		//勾选与否回调
						rootLogo : './static/img/tree_root.png',		//根目录图标
						lastGroupLogo : './static/img/tree_lsuser.png',	 //临时用户图标
						deepLevel : 5,   //深度
						
					}
					var demoData = demoDatas.treeSetting;
						
					//根据demoData传参修改默认参数
//					this.datas.treeName = demoData.treeName || this.datas.treeName;
					this.datas.simpleData = demoData.simpleData || this.datas.simpleData;
					this.datas.rootId = demoData.rootId || this.datas.rootId;
					this.datas.treeId = demoData.treeId || this.datas.treeId;
					this.datas.lastGroupId = demoData.lastGroupId || this.datas.lastGroupId;
					this.datas.showUser = (demoData.showUser != undefined)? demoData.showUser : this.datas.showUser;
					this.datas.showCheckboxs = demoData.showCheckboxs || this.datas.showCheckboxs;
					this.datas.showButtonGroup = demoData.showButtonGroup || this.datas.showButtonGroup;
					this.datas.treeClick = demoData.treeClick || this.datas.treeClick;
					this.datas.addClick = demoData.addClick || this.datas.addClick;
					this.datas.editClick = demoData.editClick || this.datas.editClick;
					this.datas.removeClick = demoData.removeClick || this.datas.removeClick;
					this.datas.checkClick = demoData.checkClick || this.datas.checkClick;
					this.datas.isCheckType = demoData.isCheckType || false;
					this.datas.rootLogo = demoData.rootLogo || this.datas.rootLogo;
					this.datas.lastGroupLogo = demoData.lastGroupLogo || this.datas.lastGroupLogo;
					this.datas.deepLevel = (demoData.deepLevel != undefined)? demoData.deepLevel:this.datas.deepLevel;
					//根据demoData传参修改默认配置
					this.settings = {
							check: {
								enable: this.datas.showCheckboxs,
								chkboxType: { "Y": "s", "N": "s" },
								nocheckInherit: true
							},
							data: {
									simpleData :{
										enable : this.datas.simpleData,
										idKey: "id",
										pIdKey: "pid",
										rootPId: this.datas.rootId
									}
								
							},
							edit: {
								enable:true,
								showRenameBtn:false,
								showRemoveBtn: showRemoveBtn,
								removeTitle: T('delete'),
								drag : {
									isMove:false,
									isCopy:false
								}
							},
							view : {
								addHoverDom: addHoverDom,
								removeHoverDom: removeHoverDom,
								showIcon : showIcon,
							},
							callback : {
								onClick : onClickTree,
								beforeRemove : askForRealRemove,
								onCheck: checkClick
							}
						};
						
					// 创建tree节点
					var $treeUl = $(document.createElement('ul'));
					$treeUl.attr({ id : this.datas.treeId || null , class : 'ztree'});
					// 数据过滤
					this.nodeListFilter();
					// 向节点注入ztree图
					this.treeDom = $.fn.zTree.init($treeUl,this.settings,this.nodes);
					this.$dom = $treeUl;
					
					if(!nowObj.datas.isCheckType){
						// 设置Root尾随的按钮常亮
						var rootNode = this.treeDom.getNodeByTId(this.datas.treeId+'_1');
						var rootjqdom = this.$dom.find("#" + rootNode.tId + "_span");
						var rootAddStrs = "<span class='button add' id='addBtn_" + rootNode.tId
										 + "' title="+T('add')+T('childgroup')+" onfocus='this.blur();'></span>"
										 + "<span class='button editDemo' id='editDemoBtn_" + rootNode.tId
										 + "' title=" + T('edit') + " onfocus='this.blur();'></span>";
						rootjqdom.after(rootAddStrs);
						var nowObj = this;
						this.$dom.find("#addBtn_"+rootNode.tId).bind("click", function(event){
							nowObj.datas.addClick(event,nowObj.datas.treeId,rootNode);
							return false;
						});
						this.$dom.find("#editDemoBtn_"+rootNode.tId).bind("click", function(event){
							nowObj.datas.editClick(event,nowObj.datas.treeId,rootNode);
							return false;
						});
					}
					
					
					
					// 设置除根结点外其余节点均不显示图标
					function showIcon(treeId, treeNode){
						return treeNode.pid == nowObj.datas.rootId;
					}
					
					//自定义按钮设置（增加、编辑）
					function addHoverDom(treeId, treeNode) {
							
							var sObj = $("#" + treeNode.tId + "_span");
							var addStr ='';
							var _tn = treeNode.hideBtn || treeNode.showBtn || 0;
							//是否显示增加

						//如果超过级数则不显示增加
						if (treeNode.level < nowObj.datas.deepLevel-1)
						{
							if(nowObj.datas.showButtonGroup?(String(_tn).indexOf('1')<0):(!(String(_tn).indexOf('1')<0))){
								if (!(treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0)) {
									//如果为选择模式则不显示按钮
									if(nowObj.datas.isCheckType){
										return;
									}
									
									
									//只有组对象可以显示增加按钮
									if(treeNode.objType == 0 && treeNode.id.toString() !== '0'){
										addStr += "<span class='button add' id='addBtn_" + treeNode.tId
												 + "' title="+T('add')+T('childgroup')+" onfocus='this.blur();'></span>";
									}
									
								}else{return;}
							}
						}
							//是否显示编辑
							if(nowObj.datas.showButtonGroup?(String(_tn).indexOf('2')<0):(!(String(_tn).indexOf('2')<0))){
								if (!(treeNode.editNameFlag || $("#editDemoBtn_"+treeNode.tId).length>0)){
									//如果为选择模式则不显示按钮
									if(nowObj.datas.isCheckType){
										return;
									}
									//只有组对象可以显示编辑按钮
									if(treeNode.objType == 0 && treeNode.id.toString() !== '0'){
										addStr += "<span class='button editDemo' id='editDemoBtn_" + treeNode.tId
										+ "' title=" + T('edit') + " onfocus='this.blur();'></span>";
									}
									
								}else{return}
							}
							
							sObj.after(addStr);
							
							//按钮事件绑定
							var btn = $("#addBtn_"+treeNode.tId);
							var btn1 = $("#editDemoBtn_"+treeNode.tId);
							
							if (btn1) btn1.bind("click", function(event){
								var modalType = treeNode.modalType;
								nowObj.datas.editClick(event,treeId,treeNode);
								return false;
							});
							
							if (btn) btn.bind("click", function(event){
								var addType = treeNode.addType;
								nowObj.datas.addClick(event,treeId,treeNode);
								return false;
							});
					};
						
					function removeHoverDom(treeId, treeNode) {
							if($("#addBtn_"+treeNode.tId).length>0 && treeNode.id.toString() !== '0') $("#addBtn_"+treeNode.tId).unbind().remove();
							if($("#editDemoBtn_"+treeNode.tId).length >0 && treeNode.id.toString() !== '0') $("#editDemoBtn_"+treeNode.tId).unbind().remove();
					};
						
						
						
					//是否显示删除按钮
					function showRemoveBtn(treeId, treeNode) {
							//如果为选择模式则不显示按钮
									if(nowObj.datas.isCheckType){
										return false;
									}
									if(treeNode.objType == 1){
										return false;
									}
							var _tn = treeNode.hideBtn || treeNode.showBtn || 0;
							return nowObj.datas.showButtonGroup?(String(_tn).indexOf('3')<0):(!(String(_tn).indexOf('3')<0));
					}
						
					//向外提供的点击事件回调接口（event，treeId，treeNode）
					function onClickTree(event, treeId, treeNode){
								var onClickDemo = nowObj.datas.treeClick;
								onClickDemo(event, treeId, treeNode);
					}
					//删除确认事件
					function askForRealRemove(treeId, treeNode){
							var tips = require('Tips');
	/*						var strInfo = T('confirm')+T('delete')+((treeNode.objType==1)?T('user'):T('group'))+' : <span style="font-weight:bold">'+treeNode.name+'</span> ？';  */
                            var strInfo = T('delconfirm');
							tips.showConfirm(strInfo,function(){
								nowObj.datas.removeClick(treeId, treeNode);
							},function(){return false;});
							
							return false;
					}
					//勾选回调
					function checkClick(event, treeId, treeNode){
						var checkClick = nowObj.datas.checkClick;
						checkClick(event, treeId, treeNode);
					}
				}
				
				
				
				/*数据过滤*/
					TreeClass.prototype.nodeListFilter = function(){
						var nowObj = this;
						//判断是否显示用户(两种情况下，树形里均不显示临时用户)
						var newNodes = [];
						if(this.datas.showUser){
							this.nodes.forEach(function(obj){
								if(obj.pid !== nowObj.datas.lastGroupId)
									{newNodes.push(obj);}
							});
							this.nodes = newNodes;
						}else{
							this.nodes.forEach(function(obj){
								if(obj.objType == 0)
									{newNodes.push(obj);}
							});
							this.nodes = newNodes;
						}
						
						//给root和临时用户添加图标
						this.nodes.forEach(function(obj){
							if(obj.pid == nowObj.datas.rootId){
								if(obj.id == nowObj.datas.lastGroupId ){
									obj.icon = nowObj.datas.lastGroupLogo;
								}else{
									obj.icon = nowObj.datas.rootLogo;
								}
								obj.iconSkin = "u-treeIcon";
							}
						});
					}
				
				
				/*获取数的JQ对象*/
				TreeClass.prototype.get$Dom = function (){
					return this.$dom;
				}
				
				/*查找所有被勾选的节点*/
				TreeClass.prototype.getCheckedNodes = function (filterParent,checkedOrNot){
					//默认参数为true,true （过滤去除父节点,已勾选的）
					var _filpa = filterParent || true;
					var _check = checkedOrNot || true;
					var _carr = this.treeDom.transformToArray(this.treeDom.getCheckedNodes(_check));
					
					if(!_filpa){
						return _carr;
					}
					var new_carr = [];
					for( i in _carr){
						if(!(_carr[i].isParent))
						new_carr.push(_carr[i]);
					}
					return new_carr;
				}
				
				/*获取树的类实例对象*/
				function getTreeObj (datas, nodes){
					var treeDemos = new TreeClass(datas, nodes);
					//treeDemos.initDom(datas, nodes);
					return treeDemos;
				}

	
	module.exports = {
		getTreeObj : getTreeObj
	};
});
