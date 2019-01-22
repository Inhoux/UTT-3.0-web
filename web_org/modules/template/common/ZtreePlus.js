define(function(require, exports, module){

    var Translate  = require('Translate');
    var dicArr     = ['common','doPeopleOrganize'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}

	//treeplus类
	function treePlusClass(data,list){
		this.data = '';	//配置参数
		this.list = [];	//总数据
		this.base = '';	//总数据库
		this.nowList = [];//当前节点对应显示的数据
		this.nowBase = '';//当前节点对应的数据库
		this.nowTable = '';//当前显示的表格对象
		this.authTypeArr = [{name:'{pppAuth}',value:'PPPoE'},{name:'{webAuth}',value:'Web'}];//拥有的认证方式数组
		this.openType = {};	//当前页面的树展开状态
		this.focusNode = {};//最新点击的树节点
		
		

		this.$dom = '';	//树+的JQ对象

		this.initDom(data,list);
	}
	treePlusClass.prototype.get$Dom = function(){
		return this.$dom;
	}

	//初始化组织架构
	treePlusClass.prototype.initDom=function(demoData,list){
		var nowObj = this;
		this.list = list;
		this.data = {
				showType : String(demoData.showType) || '1',	//（暂时只有两种显示状态：0:可编辑（组织成员）	,1:可勾选（行为管理中选择指定用户时）
				treeSetting:{	//树参数配置
								treeId : demoData.treeSetting.treeId || '', 			//树的id	:String，默认为空
								rootId : String(demoData.treeSetting.rootId) || '-1',	//简单格式下的root的父id
								lastGroupId : String(demoData.treeSetting.lastGroupId) || '1x',	//临时用户的id
								showUser : (demoData.treeSetting.showUser != undefined)?demoData.treeSetting.showUser:true,	//是否显示用户						//是否显示用户
								showCheckboxs : demoData.showType==1?true:false,		//是否显示复选框？
								showButtonGroup : demoData.showType==0?true:false, 		//是否显示增删改按钮组？
								isCheckType : (demoData.showType==1),					//根据组织架构的类型变换选择模式，还是编辑模式
								checkableArr:demoData.treeSetting.checkableArr || '',		//勾选数组
								treeClick : demoData.treeSetting.treeClick || '',		//点击回调
								addClick : demoData.treeSetting.addClick || '',			//新增回调
								editClick:demoData.treeSetting.editClick || '',			//编辑回调
								removeClick :demoData.treeSetting.removeClick || '',		//删除回调
								checkClick :demoData.treeSetting.checkClick || '',		//删除回调
								deepLevel : demoData.treeSetting.deepLevel || '5',		// 组织架构允许的最大深度

				},
				tableSetting:{	//表参数配置
								pnameArr : demoData.tableSetting.pnameArr || [],	// 显示的名称及对应的属性名[['用户名','name'],['IP掩码','IPSec']……]
//								showCol : demoData.tableSetting.showCol || [],		// 表格里即将显示的列对应的属性名称
//								showNodes : demoData.tableSetting.showNodes || []	// 即将显示的行对象对应的标识符（暂定为id）
								addClick : demoData.tableSetting.addClick || '',	// 新增点击
								editClick : demoData.tableSetting.editClick || '',	// 编辑小按钮点击
								allRemoveClick : demoData.tableSetting.allRemoveClick || '', // 全局删除点击
								removeClick : demoData.tableSetting.removeClick || '',	// 删除小按钮点击
								isOpenClick  : demoData.tableSetting.isOpenClick || '',	// 状态栏复选框小按钮点击
								moveUserClick : demoData.tableSetting.moveUserClick || '',	// 移动按钮点击
								downloadClick : demoData.tableSetting.downloadClick || '',  // 导入点击
								outloadClick : demoData.tableSetting.outloadClick || '',	// 导出点击
								allScanClick : demoData.tableSetting.allScanClick || ''		// 扫描点击
							}
		};
		this.data.treeSetting.showCheckboxs = (this.data.showType=='1');	//是否显示复选框？:Boolean，默认为:false
		this.data.treeSetting.showButtonGroup = (this.data.showType=='0');	//是否显示增删改按钮组？:Boolean，默认为:false
		///数据过滤
		this.nodeListFilter();
		//获得树和表的JQdom
		var $treeDom = getTreeDom(nowObj.data.treeSetting,nowObj.list);
		var $tableDom = getTableDom(nowObj.data.tableSetting,nowObj.list);
		//生成treeplus的JQdom
		this.$dom = get$Dom($treeDom,$tableDom);

		var tranDomArr = [this.$dom];
	    Translate.translate(tranDomArr, dicArr);


			//获得树部分的标签及内容
			function getTreeDom(tdata,alldata){
				var tdata = nowObj.data;
				var tree = require('Ztree'),
				treeobj = tree.getTreeObj(tdata,alldata),
				tree$dom = treeobj.get$Dom();

				var tabslist = [
					{id:'1',title:'{typeOrg}'}
				];
				var tabs = require('Tabs'),
				$dom = tabs.get$Dom(tabslist);
				$dom.find('#1').append(tree$dom);

				return $dom;
			}

			//获得表格部分的标签及内容
			function getTableDom(tdata,alldata){
				var tabslist = [
					{id:'2',title:'{memberSetting}'}

				];
				//if(this.data.showType == 0){
				if(nowObj.data.showType == 0){
					tabslist.push({id:'3',title:'{globalSetting}'});
				}
				var tabs = require('Tabs'),
				$dom = tabs.get$Dom(tabslist);

//				if(nowObj.data.showType == 0){
					//默认先展示点击了root后的表格
					var _nowid = [];
					nowObj.list.forEach(function(obj){
						if(obj.pid==nowObj.data.treeSetting.rootId)
						_nowid.push(obj);
					});
					//调用数据修改方法，跟新nowList为当前节点对应的数据，并将其存入当前对象数据库nowBase
					nowObj.changeFocus(_nowid[0]);
//				}else if(nowObj.data.showType == 1){
//					nowObj.changeCheck();
//				}

				//得到表格部分
				var tabledom = nowObj.getTable();
				$dom.find('#2').empty().append(tabledom);
				//得到全局设置部分

				nowObj.getAllsettnig();
				$dom.find('[href="#3"]').click(function(){
					nowObj.getAllsettnig();
				});
				return $dom;

			}
	}
		//得到treeplus对象
	function get$Dom(leftdom,rightdom){
		var data = {};
		var list = '',
			render = require('P_build/common/ztreeplus'),
			html = render(list),
			$html = $(html),
			left = leftdom || '',
			right = rightdom || '';

		$html.find('.u-treeSet').append(leftdom);
		$html.find('.u-plusSet').append(rightdom);
		//绑定关闭展开事件
			if($html.find('.u-treeSet ul.ztree').html() != ''||$html.find('.u-treeSet ul.ztree').html() != null){
//				var width = $html.find('.u-treeSet').width()+5;
				var width = 225;
				$html.find('.u-tableSet').css('margin-left',width+'px');
				$html.find('.u-treeSet').css('width',(width-5)+'px');
			}
			$html.find('.u-tree-closeline').click(function(){
				var t =  $(this);
				var tp = t.parents('.u-treeplus');
				if(tp.hasClass('u-treeplus-treehidetype')){
					tp.removeClass('u-treeplus-treehidetype');

				}else{
					tp.addClass('u-treeplus-treehidetype');
				}
			});
			$(window).resize(function(){
				resizeDoubleFunc($html);
			});
			
			setTimeout(function(){
				resizeDoubleFunc($html);
			},250);


		return $html;
	}

	//根据传回来的id修改当前显示的表格内容
	treePlusClass.prototype.changeFocus = function(node) {
		var nowObj = this;
		this.focusNode = node;
		var showCol = this.data.tableSetting.pnameArr;
		var nowid = node.id;
		var nowType = node.objType;
		var _newList = [];
		var idIndex = 0;
		if(nowType == 1){
			nowObj.list.forEach(function(obj){
				if(obj.id == nowid){
					idIndex++;
					obj.idIndex = idIndex;
					_newList.push(obj);
				}
			});
		}else if(nowType == 0){
			nowObj.list.forEach(function(obj){
				if(obj.pid == nowid){
					idIndex++;
					obj.idIndex = idIndex;
					_newList.push(obj);
				}
			});
		}else{
			console.error('参数类型错误~！');
		}


		nowObj.nowList = _newList;
		//解析数据为表格可用数据
		var newTableArr = [];
		var baseCol = showCol.concat();
		baseCol.push(['','id']);
		baseCol.push(['','objType']);
		baseCol.push(['','pid']);
		baseCol.push(['','checked']);
		nowObj.nowList.forEach(function(obj, i) {
			var littleArr = [];
			baseCol.forEach(function(ar, i) {
				//过滤状态一栏，web认证没有，pppoe有
				if(ar[1] == 'isOpen'){
					littleArr.push(obj[ar[1]] || 'off');
				}else{
					littleArr.push(obj[ar[1]] || '');
				}

			});
			newTableArr.push(littleArr);
		});
		//存储表格数据
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用

		// 声明字段列表
		var fieldArr = [];
		baseCol.forEach(function(obj){
			fieldArr.push(obj[1]);
		});
		database.addTitle(fieldArr);
		database.addData(newTableArr);
		// 存入plus对象
		nowObj.nowBase = database;
	}
		//获取并改变当前选中的用户条目
		treePlusClass.prototype.changeCheck = function() {
		var nowObj = this;
		var showCol = this.data.tableSetting.pnameArr;

		var treeObj = $.fn.zTree.getZTreeObj(nowObj.data.treeSetting.treeId);
		var nodes = treeObj.getCheckedNodes(true); // 被勾选的树对象数组
		var idIndex = 0;
		var newNodes = []; // 呈现在表格里的数组
		
		for(var i in nowObj.list){
			var thisChecked = false;
			nodes.forEach(function(obj){
				if(nowObj.list[i].id == obj.id){
					thisChecked = true;
//					if(!nowObj.list[i].checked){
//						nowObj.list[i].checked = true;
//					}
				}
			});
			nowObj.list[i].checked = thisChecked;
			
		}
		/*
		nodes.forEach(function(obj){
			//勾选后过滤掉  组 及临时用户的数据
			if(obj.objType == 1 && obj.pid != nowObj.data.treeSetting.lastGroupId){
				idIndex++;
				obj.idIndex = idIndex;
				newNodes.push(obj);
			// 如果临时组被勾选，则显示所有临时用户
			}else if(obj.objType == 0 && obj.id == nowObj.data.treeSetting.lastGroupId){
				nowObj.list.forEach(function(listObj,listIndex){
					if(listObj.objType == 1 && listObj.pid == nowObj.data.treeSetting.lastGroupId){
						idIndex++;
						listObj.idIndex = idIndex;
						newNodes.push(listObj);
					}
				});
			}
		});

		//解析数据为表格可用数据
		var newTableArr = [];
		var baseCol = showCol.concat();
		baseCol.push(['','id']);
		baseCol.push(['','objType']);
		newNodes.forEach(function(obj, i) {
			var littleArr = [];
			baseCol.forEach(function(ar, i) {
				littleArr.push(obj[ar[1]] || '');
			});
			newTableArr.push(littleArr);
		});
		//存储表格数据
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用

		// 声明字段列表
		var fieldArr = [];
		baseCol.forEach(function(obj){
			fieldArr.push(obj[1]);
		});
		database.addTitle(fieldArr);
		database.addData(newTableArr);
		// 存入plus对象
		nowObj.nowBase = database;
		*/
	}

	//刷新 生产数据库和表格
	treePlusClass.prototype.resizeDouble = function() {
		var $html = this.$dom;
		resizeDoubleFunc($html);
	}
	//重置两边的高
	function resizeDoubleFunc($html){
		/*
		$html.find('.u-tableSet').css('height','auto');
		$html.find('.u-treeSet').css('height','auto');
		$html.find('.u-treeSet .ztree').css('height','auto');
		var _rh = $html.find('.u-plusSet').height();
		var _lh = $html.find('.u-treeSet').height();
		if(_lh>_rh){
			$html.find('.u-tableSet').css('height',_lh+'px');
			$html.find('.u-treeSet').css('height',_lh+'px');
			$html.find('.u-treeSet .ztree').css('height',(_lh-48)+'px');
		}else if(_lh<_rh){
			$html.find('.u-tableSet').css('height',_rh+'px');
			$html.find('.u-treeSet').css('height',_rh+'px');
			$html.find('.u-treeSet .ztree').css('height',(_rh-48)+'px');
		}
		*/
		
		/* 记录滚动高度 */
		var nowscroll = $html.find('#1>ul').scrollTop();
		
		/* 修改两侧高度 */
		$html.find('#1>ul').css('height','auto');
		$html.find('#2>.table-container>div').css('height','auto');
		$html.find('.u-treeSet .ztree').css('height','auto');
		var _lh = $html.find('#1>ul').height();
		var _rh = $html.find('#2>.table-container>div').height();
		$html.find('#1>ul').css('height',_rh+'px');
		
		/* 保持滚动高度 */
		$html.find('#1>ul').scrollTop(nowscroll);
//		$html.find('#2>.table-container>div').css('height',_lh+'px');
//		$html.find('.u-treeSet .ztree').css('height',(_rh-48)+'px');
	}

	//刷新 生产数据库和表格
	treePlusClass.prototype.refreshTable = function() {
		var nowObj = this;
		var $nowtable = nowObj.getTable();
		nowObj.$dom.find('#2').empty().append($nowtable);
		nowObj.$dom.find('[href="#2"]').trigger('click');
		nowObj.refreshAllSetting();

		resizeDoubleFunc(nowObj.$dom);
	}
	//刷新全局设置
	treePlusClass.prototype.refreshAllSetting = function() {
		this.getAllsettnig();

	}
	//修改大数据
	treePlusClass.prototype.modifyList = function(list) {
		this.list = list;
		this.nodeListFilter();
	}
	//刷新树
	treePlusClass.prototype.refreshTree = function(isSelect) {
		var nowObj = this;
		//获取刷新前的展开方式json并修改当前数据
		this.list.forEach(function(obj){
			if(nowObj.openType[obj.id] != undefined){
				obj.open = nowObj.openType[obj.id];
			}
		});
		//获得树和表的JQdom
		
		nowObj.getAllsettnig();
		
		var $treeDom = getTreeDom(nowObj.data.treeSetting,nowObj.list);
		nowObj.$dom.find('#1.tab-pane').empty().append($treeDom);
		
		if(!isSelect){
			// 如果是反选状态 不进行表格的刷新
			var $tableDom = getTableDom(nowObj.data.tableSetting,nowObj.list);
			nowObj.$dom.find('#2').empty().append($tableDom);
		}
		
		if(!isSelect){
			// 如果是反选状态 不进行点击操作
			nowObj.$dom.find('[href="#2"]').trigger('click');
		}
		resizeDoubleFunc(nowObj.$dom);
			//获得树部分的标签及内容
			function getTreeDom(tdata,alldata){
				var tdata = nowObj.data;
				var tree = require('Ztree'),
				treeobj = tree.getTreeObj(tdata,alldata),
				tree$dom = treeobj.get$Dom();
				return tree$dom;
			}

			//获得表格部分的标签及内容
			function getTableDom(tdata,alldata){
				var _nowid = '';
				nowObj.list.forEach(function(obj){
					if(obj.pid == nowObj.data.treeSetting.rootId){
						_nowid = obj;
						return;
					}
				});
				//默认展示之前展示的组信息表，如果组被删除或id被修改，则默认显示root
				nowObj.list.forEach(function(obj){
					if(obj.id == nowObj.focusNode.id){
						_nowid = obj;
					}
				});

				//调用数据修改方法，跟新nowList为当前节点对应的数据，并将其存入当前对象数据库nowBase
				nowObj.changeFocus(_nowid);
				return nowObj.getTable();

			}
	}
	//记录展开状态
	treePlusClass.prototype.reordOpenType = function(){
		var nowObj = this;
		var _tree =$.fn.zTree.getZTreeObj(nowObj.data.treeSetting.treeId);
		var nowNode = _tree.transformToArray(_tree.getNodes());
		nowObj.openType = {};
		nowNode.forEach(function(obj){
			if(obj.objType == 0){
				nowObj.openType[obj.id] = obj.open;
			}

		});
	}
	//生产全局设置部分
	treePlusClass.prototype.getAllsettnig = function() {
		if(this.data.showType == 0){
			var Tips = require('Tips');
			var nowObj = this;
			$.ajax({
				type:"get",
				url:"common.asp?optType=OrgGloSetting",
				success:function(result){
					var doEval = require('Eval');
					var variableArr = ['arpAllowOtherEn', 'macAllowOtherEn'];
					var result = doEval.doEval(result, variableArr);
					var isSuccessful = result['isSuccessful'];
					// 判断字符串代码是否执行成功
					if(isSuccessful){
					    // 执行成功
					    var data = result['data'];
					   	var only_IPMAC = data.arpAllowOtherEn || 'off';
						var only_MAC =  data.macAllowOtherEn ||'off';

						var inputlist =[
							{
						        "prevWord": T('content_arpOnly'),
						        "inputData": {
						            "defaultValue" : only_IPMAC, //默认值对应的value值
						            "type": 'radio',
						            "name": 'AllowOtherEnable',
						            "items": [{
						                "value": 'on',
						                "name": T('open'),
						            }, {
						                "value": 'off',
						                "name": T('close')
						            }]
						        },
						        "afterWord": ''
						    },
						    {
						        "prevWord": T('content_macOnly'),
						        "inputData": {
						            "defaultValue" : only_MAC, //默认值对应的value值
						            "type": 'radio',
						            "name": 'forbidMac',
						            "items": [{
						                "value": 'on',
						                "name": T('open'),
						            }, {
						                "value": 'off',
						                "name": T('close')
						            }]
						        },
						        "afterWord": ''
						    }
						];
						var IG = require('InputGroup');
						var $inputs = IG.getDom(inputlist);
						//绑定交互事件
						var imon = $inputs.find('[name="AllowOtherEnable"][value="on"]');
						var imoff = $inputs.find('[name="AllowOtherEnable"][value="off"]');
						var mon = $inputs.find('[name="forbidMac"][value="on"]');
						var moff = $inputs.find('[name="forbidMac"][value="off"]');
						imon.click(function(){
							moff.click();
						});
						mon.click(function(){
							imoff.click();
						});


						var btnGroupList = [
						    {
						        "id"        : 'saveAllSetting',
						        "name"      : T('save'),
						        "clickFunc" : function($btn){
						            // $btn 是模块自动传入的，一般不会用到
						            var Serialize = require('Serialize');
						            var strs = Serialize.getQueryStrs($inputs);
									//console.log(strs);
						            $.ajax({
										url : 'goform/orgGloSetting',
										type : 'POST',
										data : strs,
										success:function(result){
											var doEval = require('Eval');
											var variableArr = ['status','errMsg'];
											var result = doEval.doEval(result, variableArr);
											var isSuccessful = result['isSuccessful'];
											// 判断字符串代码是否执行成功
											if(isSuccessful){
											    // 执行成功
											    var status = result['data']['status'];
											    if(status){
											    	Tips.showSuccess('{saveSuccess}');
											    	nowObj.refreshAllSetting();
											    }else{
													Tips.showError('{saveFail}' +result['data']['errMsg']);
												}
											 }
										}
									})
						        }
						    },
						    {
						        "id"        : 'reset',
						        "name"      : T('reset')
						    }/*
						    {
							"id"        : 'back',
							"name"      : T('back'),
							clickFunc:function(){
							    $('[href="#2"]').trigger('click');
							}
						    }*/
						];
						var BtnGroup = require('BtnGroup');
						var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');

						nowObj.$dom.find('#3').empty().append($inputs,$btnGroup);
					}else{

					}
				}
			});

		}
	}
	// 生产数据库和表格
	treePlusClass.prototype.getTable = function() {
		var nowObj = this;
		var btnList =[];
		// 获得表格
		if(nowObj.data.showType == 0){
			// 表格上方按钮配置数据
			var btnList = [{
				"id": "addUser",
				"name": "{adduser}",
				"clickFunc" : function($this){
					nowObj.data.tableSetting.addClick(nowObj.focusNode);
				}
			}, {
				"id": "deleteAll",
				"name": "{delete}",
				"clickFunc" : function($this){
					var deletNodesArr = [];
					var checkSelect = nowObj.nowTable.getSelectInputKey('data-primaryKey');
					var database = nowObj.nowBase;
					var nowList = nowObj.nowList;

					checkSelect.forEach(function(obj){
						var primaryKey = obj;
						var bobj = database.getSelect({
							primaryKey: primaryKey
						});
						nowList.forEach(function(_node){
							if(bobj["0"].id == _node.id){
								deletNodesArr.push(_node);
							}
						});
					});

					nowObj.data.tableSetting.allRemoveClick(deletNodesArr);
				}
			}];
		}else if(nowObj.data.showType == 1){

		}

		var tableHeadData = {
			"btns" : btnList
		};
		var database = nowObj.nowBase;
		// 表格配置数据
		var tableList = {
			"otherFuncAfterRefresh":someInitFunc,
			"database": database,
			"hideColumns":(nowObj.data.showType == 0?[]:['isOpen']),
			"isSelectAll" : true/* (nowObj.data.showType == 0) */,
			"titles": {},
			"dicArr": ['common','doPeopleOrganize']
		};
		var showCol = this.data.tableSetting.pnameArr;
		showCol.forEach(function(obj){
			//状态
			if(obj[1] =='isOpen'){
				tableList["titles"][obj[0]] = {
					"key":  obj[1],
					"type": "checkbox",
					"values"  : {
									"on"  : true,
									"off" : false
								},
								"clickFunc" : function($this){
									var pkey = $this.attr('data-primarykey');
									var nowData = nowObj.nowBase.getSelect({'primaryKey':pkey})[0];
									if(nowData){
										nowObj.list.forEach(function(thisListObj){
											if(thisListObj.id ===  nowData.id ){
												nowData = thisListObj;
											}
										});
									}
									nowData.isOpen = $this.is(':checked')?'on':'off';
									nowObj.data.tableSetting.isOpenClick($this,pkey,nowData,nowData.isOpen);
								}
				};
			}else if(obj[1] =='bindType'){
				tableList["titles"][obj[0]] = {
					"key":  obj[1],
					"type": "text",
					"values" : {
									"no"  : '{no}{bind}',
									"autoBind" : '{autoBind}',
									"IP"  : 'IP' + '{bind}',
									"MAC"  : 'MAC' + '{bind}',
									"IP/MAC"  : 'IP/MAC' + '{bind}',
								}
				};
			}else{
				tableList["titles"][obj[0]] = {
					"key":  obj[1],
					"type": "text"
				};
			}

		});
		if(nowObj.data.showType == 0){


		tableList["titles"]["{edit}"]= {
					"type": "btns",
					"btns": [
						{
							"type" : "edit",
							"clickFunc" : function($this){
								var thisNode = {};
								var pkey = $this.attr('data-primaryKey');
								var database = nowObj.nowBase;
								var nowList = nowObj.nowList;

								var primaryKey = pkey;
								var bobj = database.getSelect({
									primaryKey: primaryKey
								});
								nowList.forEach(function(_node){
									if(bobj["0"].id == _node.id){
										thisNode = _node;
									}
								});
								nowObj.data.tableSetting.editClick(thisNode);
							}
						},
						{
							"type" : "delete",
							"clickFunc" : function($this){
								var deletNodesArr = [];
								var pkey = $this.attr('data-primaryKey');
								var database = nowObj.nowBase;
								var nowList = nowObj.nowList;

								var primaryKey = pkey;
								var bobj = database.getSelect({
									primaryKey: primaryKey
								});
								nowList.forEach(function(_node){
									if(bobj["0"].id == _node.id){
										deletNodesArr.push(_node);
									}
								});
								nowObj.data.tableSetting.removeClick(deletNodesArr);
							}
						}
					]
				}

		}
		// 表格组件配置数据
		var tableAllList = {
			head: tableHeadData,
			table: tableList
		};
		// 加载表格组件，获得表格组件对象，获得表格jquery对象
		var Table = require('Table'),
			tableObj = Table.getTableObj(tableAllList);
		nowObj.nowTable = tableObj;
		var $table = tableObj.getDom();
		
		// 如果为组信息，则移除复选框 || 如果为临时用户，移除复选框、编辑、删除
		/*  */
		function someInitFunc(thisObj){
			
			var $table = thisObj.getDom();
			
			$table.find('input[data-table-type="select"]').each(function(){
				var t = $(this);
				var kp = t.attr('data-primaryKey');
				var database = nowObj.nowBase;
				var bobj = database.getSelect({
					primaryKey: kp
				});
				if(nowObj.data.showType == 0){
					// 如果是组
					if(bobj["0"].objType == 0 ){
						t.remove();
					}
				}
				
				// 如果是临时用户 且 在组建勾选中 则隐藏
				if(bobj["0"].pid == nowObj.data.treeSetting.lastGroupId && nowObj.data.showType == '1'){
					t.remove();
				}
			});
			$table.find('span[data-event="edit"],span[event-type="delete"]').each(function(){
				var t = $(this);
				var kp = t.attr('data-primaryKey');
				var database = nowObj.nowBase;
				var bobj = database.getSelect({
					primaryKey: kp
				});
				if(bobj["0"].pid == nowObj.data.treeSetting.lastGroupId){
					t.remove();
				}
			});
			// 移除 非PPPoE用户对象 的状态栏复选框
			$table.find('td[data-column-title="{status}"]>input[type="checkbox"]').each(function(){
				var t = $(this);
				var kp = t.attr('data-primaryKey');
				var database = nowObj.nowBase;
				var bobj = database.getSelect({
					primaryKey: kp
				});
				if(bobj["0"].objType != 1 || bobj["0"].authType != 'PPPoE'){
					t.remove();
				}
			});
			
			
			if(nowObj.data.showType == 1){
				/* 已被勾选的对象在表格中对应的复选框同样被勾选 */
				if(nowObj.nowList.length>0){
					thisObj.getDom().find('input[data-table-type="select"][data-primarykey]').each(function(){
						var $t = $(this);
						var pk = $t.attr('data-primarykey');
						var tdata = nowObj.nowBase.getSelect({primaryKey:pk})[0];
						if(tdata && tdata.checked == true){
							$t.prop('checked',true);
						}else{
							$t.prop('checked',false);
						}
					});
				}
			}
		}
		

		// 制作表格底部的按钮
				var BtnGroup = require('BtnGroup');
				var btnGroupList = [
					{
						"id"        : 'moveUserTo',
						"name"      : '{moveTo}',
						"clickFunc" : function($btn){
							var moveNodesArr = [];
							var checkSelect = nowObj.nowTable.getSelectInputKey('data-primaryKey');
							var database = nowObj.nowBase;
							var nowList = nowObj.nowList;

							checkSelect.forEach(function(obj){
								var primaryKey = obj;
								var bobj = database.getSelect({
									primaryKey: primaryKey
								});
								nowList.forEach(function(_node){
									if(bobj["0"].id == _node.id){
										moveNodesArr.push(_node);
									}
								});
							});
							nowObj.data.tableSetting.moveUserClick(moveNodesArr);
						}
					},
					{
						"id"        : 'download',
						"name"      : '{import}',
						"clickFunc" : function($btn){


							nowObj.data.tableSetting.downloadClick();

						}
					},{
						"id"        : 'outload',
						"name"      : '{export}',
						"clickFunc" : function($btn){
							nowObj.data.tableSetting.outloadClick($btn);

						}
					},{
						"id"        : 'allScan',
						"name"      : '{scan}',
						"clickFunc" : function($btn){
							
							nowObj.data.tableSetting.allScanClick(nowObj.list);
						}
					}
				];
				var $btnGroup = BtnGroup.getDom(btnGroupList).css({'text-align':'right',marginTop:'5px'});

		if(nowObj.data.showType == 1){
			$btnGroup = '';
		}
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$div = $(conhtml);
		$div.append($table,$btnGroup);
		Translate.translate([$div], dicArr);
		
//		if(nowObj.data.showType == 0){
			
		// 组织用户中 清除搜索按钮功能，改写
		var $newSearch = $table.find('.u-searchbox>i.icon-search').clone(false).attr('search-clone','true');
		$table.find('.u-searchbox>i.icon-search').attr('search-old','true').addClass('u-hide').after($newSearch);
		$newSearch.click(function(){
			if(this && $(this).prevAll('input').length == 1 && $(this).prevAll('input').val().toString() !== ''){
				var searchWord = $(this).prevAll('input').val();
				nowObj.search(searchWord);
			}else{
				nowObj.changeFocus(nowObj.focusNode);
				nowObj.refreshTable();
			}
		});
//		}
		
		
		
		
		if(nowObj.data.showType == 1){
			/* 表格中的勾选框被勾选时 和树中的勾选框同步 */
			$table.on('change','input[data-table-type="select"][data-primarykey]',function(event){
				var ev = event || window.event;
				var targ = ev.target || ev.srcElement;
				var $t = $(targ);
				nowObj.tableSelectedEvent([$t]);
			});
		}
		if(nowObj.data.showType == 1){
			/* 表格中全选复选框被勾选时，触发对应的所有复选框的反选事件 */ 
			$table.on('change','th[data-table-type="select"]>input',function(event){
				var $changeSelects = $table.find('input[data-table-type="select"][data-primarykey]');
				var selectArr = [];
				if($changeSelects.length >0){
					$changeSelects.each(function(){
						selectArr.push($(this));
					});
				}
				if(selectArr.length>0){
					nowObj.tableSelectedEvent(selectArr);
				}
				
			});
		}
		
		return $div;
	}
	
	// 表格反选操作
	treePlusClass.prototype.tableSelectedEvent = function(selectBoxDomArr){
		var nowObj = this;
		var changeObjArr = []; // 当前勾选状态被改变的对象
		selectBoxDomArr.forEach(function(tobj){
			var $t = tobj;
			var pk = $t.attr('data-primarykey');
			var tdata = nowObj.nowBase.getSelect({primaryKey:pk})[0];
			for(var i in nowObj.list){
				if(nowObj.list[i].id == tdata.id){
					changeObjArr.push(nowObj.list[i]);
					nowObj.list[i].checked = $t[0].checked;
					break;
				}
			}
		});
		
		nowObj.reordOpenType();
		changeObjArr.forEach(function(obj){
			var $this = obj;
			if($this.objType == 0 && $this.id != nowObj.data.treeSetting.lastGroupId){
				if($this.checked){
					changechildrenCheck($this);
				}else{
					changeparentCheck($this);
					changechildrenCheck($this);
				}
				
			}else if($this.objType == 1){
				if(!$this.checked){
					changeparentCheck($this);
				}
			}
			
		})
		
		// 将孙子节点变为指定状态
		function changechildrenCheck(thisData){
			/* 组的被勾选与不被勾选 都会影响子节点 */
			nowObj.list.forEach(function(obj){
				if (obj.pid == thisData.id){
					obj.checked = thisData.checked;
					if(obj.objType == 0){
						changechildrenCheck(obj);
					}
				}
			});
		}
		// 将父及以上节点变为不被勾选状态
		function changeparentCheck(thisData){
			nowObj.list.forEach(function(obj){
				if (obj.id == thisData.pid){
					obj.checked = thisData.checked;
					if(obj.id != nowObj.data.treeSetting.rootId){
						changeparentCheck(obj);
					}
				}
			});
		}
		
		
	    nowObj.refreshTree(true);
	}
	
	// 独特的搜索方法
	treePlusClass.prototype.search = function(searchWord){
		var nowObj = this;
		
		var nowNode = nowObj.focusNode; // 当前节点
		var allData = nowObj.list; // 所有数据
		// 遍历获得当前节点下所有子孙节点
		var newAllChildrenData = [];
		var allChildrenGroupData = [];
		var allChildrenUserData = [];
		if(nowNode.objType == 1){
			newAllChildrenData.push(nowNode);
		}else if(nowNode.objType == 0){
			findChildNode(nowNode.id);
			newAllChildrenData = allChildrenGroupData.concat(allChildrenUserData);
		}
		var idIndex = 0;
		for(var i in newAllChildrenData){
			newAllChildrenData[i].idIndex = Number(i)+1;
		}
		
		
		function findChildNode(id){
			allData.forEach(function(obj){
				if(obj.pid.toString() === id.toString()){
					if(obj.objType == 0){
						allChildrenGroupData.push(obj);
						findChildNode(obj.id)
					}else if(obj.objType == 1){
						allChildrenUserData.push(obj);
					}
				}
			});
		}
		nowObj.nowList = newAllChildrenData;
		// 生成最新的数据库
		var newTableArr = [];
		var showCol = nowObj.data.tableSetting.pnameArr;
		var baseCol = showCol.concat();
		baseCol.push(['','id']);
		baseCol.push(['','objType']);
		baseCol.push(['','pid']);
		baseCol.push(['','checked']);
		nowObj.nowList.forEach(function(obj, i) {
			var littleArr = [];
			baseCol.forEach(function(ar, i) {
				if(ar[1] == 'isOpen'){
					littleArr.push(obj[ar[1]] || 'off');
				}else if(ar[1] == 'checked'){
					littleArr.push(obj[ar[1]] || false);
				}else{
					littleArr.push(obj[ar[1]] || '');
				}
				

			});
			newTableArr.push(littleArr);
		});
		//存储表格数据
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用

		// 声明字段列表
		var fieldArr = [];
		baseCol.forEach(function(obj){
			fieldArr.push(obj[1]);
		});
		database.addTitle(fieldArr);
		database.addData(newTableArr);
		// 存入plus对象
		nowObj.nowBase = database;
		
		// 刷新表格
//		var $nowtable = nowObj.getTable();

		nowObj.refreshTable();

//		$nowtable.find('#page-count-control .u-searchbox>input').val(searchWord);
//		nowObj.$dom.find('#2').empty().append($nowtable);
//		nowObj.$dom.find('[href="#2"]').trigger('click');
		nowObj.$dom.find('#page-count-control .u-searchbox>input').val(searchWord);
		nowObj.$dom.find('#page-count-control .u-searchbox>i[search-old]').trigger('click');

		resizeDoubleFunc(nowObj.$dom);
		
		
	}

	// 数据过滤
	treePlusClass.prototype.nodeListFilter = function(){
		var nowObj = this;
		var oldList = this.list;
		// 拷贝数组
		var list = oldList.concat();
		// 按排序来的组id数组
		var pidarr = [];

		var lastJsonId = ''; // 最后的组（一般为临时用户）
		list.forEach(function(obj, i) {
			if(Number(obj.objType) == 0) {
				if(obj.id == nowObj.data.treeSetting.lastGroupId) {
					lastJsonId = obj.id;
				} else {
					pidarr.push(obj.id);
				}
			}
		});
		pidarr.push(lastJsonId);


		//制作摘要属性（遍历获得其子组与子用户）
		list.forEach(function(obj, i) {
			var nowid = obj.id;
			var childUserNum = 0;
			var childGroupNum = 0;
			list.forEach(function(obj0, i0) {
				if(nowid==obj0.pid){
					if(obj0.objType == 0){
						childGroupNum ++;
						cycleGetUser(obj0.id);
					}else if(obj0.objType == 1){
						childUserNum ++;
					}
				}
			});
			function cycleGetUser(nowid){
				list.forEach(function(obj0, i0) {
					if(nowid==obj0.pid){
						if(obj0.objType == 0){
							cycleGetUser(obj0.id);
						}else if(obj0.objType == 1){
							childUserNum ++;
						}
					}
				});
			}

			if(obj.objType == 0){
				obj.abstract = '{childgroup}: '+childGroupNum+' ; {user}: '+childUserNum;
			}else if(obj.objType == 1){
				obj.abstract = '';
			}
		});
		//制作父组名称属性
		list.forEach(function(obj,i){
			var pname = '';
			list.forEach(function(obj0, i0){
				if(obj.pid == obj0.id)
					pname = obj0.name;

			});
			obj.parentGroupName =pname;
		});
		//默认展开root
		list.forEach(function(obj, i) {
			if(obj.pid == nowObj.data.treeSetting.rootId && obj.id != nowObj.data.treeSetting.lastGroupId){
				obj.open = true;
			}
		});
		//即将重排的对象数组
		var newList = [];
		//先将组对象按排好的顺序加入数组

		pidarr.forEach(function(id, n) {
			list.forEach(function(obj, i) {
				if(id == obj.id) {
					newList.push(obj);
				}
			});
		});

		//移除已加入的组对象
		pidarr.forEach(function(id, n) {
			list.forEach(function(obj, i) {
				if(id == obj.id) {
					list.splice(i, 1);
				}
			});
		});
		//将剩余用户对象加入数组
		list.forEach(function(obj, i) {
			newList.push(obj);
		});

		//如果为勾选状态：
		var newJson = {};
		if(nowObj.data.showType == 1){
			//将check勾选加入对象组
			newList.forEach(function(obj){
				obj.checked = false;
				nowObj.data.treeSetting.checkableArr.forEach(function(obj1){
					if(obj.id == obj1){
						obj.checked = true;
					}

				});
				/* 组名增加[]区分 */
				if(obj.objType == 0){
						if(obj.name.substr(0,1) != '[' || obj.name.substr(obj.name.length-1,1) != ']'){
							obj.name = "["+obj.name+"]";
						}
						

				}
			});

			/* 父组被勾选，则自动勾选该用户或组 */
			newList.forEach(function(obj){
				newJson[obj.id] = obj;
			});
			newList.forEach(function(obj){
				if (getPidUserChecked(obj.id) == true){
					obj.checked = true;
				}
			});


			/*
			// 勾选状态下将临时用户过滤掉
			var newOtherArr = [];
			newList.forEach(function(obj){
				if(obj.pid != nowObj.data.treeSetting.lastGroupId){
					newOtherArr.push(obj);
				}
			});
			newList = newOtherArr;
			*/
		}
		function getPidUserChecked(id){
			if (newJson[id].checked != true) {
				if (id != 0 && id != 1) {
					if (getPidUserChecked(newJson[id].pid) == true)
					{
						return true;
					}
				}
			}
			else {
				return true;
			}
			return false;
		}
		nowObj.list = newList;
	}


	function getTreePlusObj(plusData,dataList){
		var obj = new treePlusClass(plusData,dataList);
		return obj;
	}
	module.exports = {
		getTreePlusObj : getTreePlusObj
	};
});
