define(function(require, exports, module){
	require('jquery');

	exports.display = function(){
		
			// 加载路径导航
			var Path = require('Path');
			var pathList = 
			{
	  		"prevTitle" : '用户管理',
	  		"links"     : [
	  			{"link" : '#/user_management/people_organize', "title" : '组织人员'}
	  		],
	  		"currentTitle" : ''
			};
			Path.displayPath(pathList);
			
		
			//获取数据
			var allDatas = [
//				{id:'1x1',	pid:'3333xxxx',	objType:'1',name : '用户',		editType:'no',	addType: 'no',	hideBtn:1,		note:'（该内容为的备注）',	authType:'PPPoE', },
				{id:'3333xxxx',	pid:'-1',	objType:'0',name : '临时用户',	editType: 2,	addType: 'no',	hideBtn:13,		note:'（该内容为的备注）' },
				{id:'11',	pid:'1',	objType:'0',	name : '研发部',		editType: 1,	addType: 1,		hideBtn:'no',	note:'（该内容为的备注）' },
				{id:'122',	pid:'12',	objType:'1',	name : '清',			editType: 'no',	addType: 'no',		hideBtn:1,		note:'（该内容为的备注）',	authType:'PPPoE', userType:'normalUser',normalUserLinkType: 'IPMac',normalIPMac :'哈哈哈\n阿斯顿'},
				{id:'1',	pid:'-1',	objType:'0',	name : 'Root',		editType: 0,	addType: 0,		hideBtn:3,		note:'（该内容为总部的备注)' },
				{id:'12',	pid:'1',	objType:'0',	name : '市场部',		editType: 1,	addType: 1,		hideBtn:'no',	note:'（该内容为的备注）' },
				{id:'121',	pid:'12',	objType:'0',	name : '设计部',		editType: 1,	addType: 1,		hideBtn:'no',	note:'（该内容为的备注）' },
				{id:'112',	pid:'11',	objType:'1',	name : '王',			editType: 'no',	addType: 'no',		hideBtn:1,		note:'（该内容为的备注）', 	authType:'PPPoE',},
				{id:'113',	pid:'11',	objType:'1',	name : '王王',		editType: 'no',	addType: 'no',		hideBtn:1,		note:'（该内容为的备注）', 	authType:'PPPoE',  testCol:'测试！测试！'},
				{id:'123',	pid:'12',	objType:'1',	name : '轻轻',		editType: 'no',	addType: 'no',		hideBtn:1,		note:'（该内容为的备注）', 	authType:'Web',userType:'authUser',authUserLinkType: 'Mac',authMac :'吼吼\n吼吼吼',accountBill : 'on',billType:'timeBill' },
				{id:'111',	pid:'11',	objType:'0',	name : '3.0项目部',	editType: 1,	addType: 1,		hideBtn:'no',	note:'（该内容为的备注）' }
				
			];
			
			//配置数据阶段加载提示组件
			var Tips = require('Tips');
			//treeplus配置参数
			var treeplusSetting = {
				showType	: 0,	//暂时只有两种状态：0:可编辑（组织成员）	,1:可勾选（行为管理中选择指定用户时）
				authType	:['ppoe，web'],
				treeSetting	:{	//树参数配置
								treeId : 'newTree', 	//树的id	:String，默认为空
								rootId : '-1',			//简单格式下的root的父id
								lastGroupId : '3333xxxx',		//临时用户的id
								showUser : false,		//树中是否显示用户
								treeClick : function(ev,tid,tnod){	//树的点击回调事件:Function(event,treeId,treeNode)，默认为空
									clickTree(tnod);
								},
								addClick : function(ev,tid,tnod){	//新增组回调
									addModal(tnod);
								},
								editClick : function(ev,tid,tnod){	//编辑组回调	
									editModal(tnod);
								},
								removeClick : function(tid,tnod){	//删除组回调
									removeGroupUser([tnod]);
								}
							},
				tableSetting:{	//表参数配置
								pnameArr : [['id','idIndex'],['用户名','name'],['所属组','parentGroupName'],['测试哦！','testCol'],['认证方式','authType'],['摘要','abstract'],['备注','note']],	//显示的名称及对应的属性名[['用户名','name'],['IP掩码','IPSec']……]
								addClick :  function(){
									addUserModal({optType:'add'});
								},
								//小编辑
								editClick : function(_node){
									if(_node.objType == 1){
										_node.optType = 'edit';
										editUserModal(_node);
									}else if(_node.objType == 0){
										editModal(_node);
									}
									
								},
								//全局删除
								allRemoveClick : function(nodeList){
									
									tableRemoveClick(nodeList);
								},
								//小删除
								removeClick : function(nodeList){
									tableRemoveClick(nodeList);
									
								},
								//移动到
								moveUserClick : function(nodeList){
									makeMoveUserModal(nodeList);
								},
								//导入
								downloadClick : function(){
									makedownloadModal();
								},
								//扫描
								allScanClick : function(){
									
								},
							}
			};
			//将树和表添加到组织架构
			var Zp = require('P_template/common/ZtreePlus');
			var Zpobj = Zp.getTreePlusObj(treeplusSetting,allDatas);
			var ztreeplus$dom = Zpobj.get$Dom();
			$('#content').empty().append(ztreeplus$dom);
			
			
		/*
		 * 事件绑定
		 */
			//树的点击事件
			function clickTree(_node){
				Zpobj.changeFocus(_node);	//根据传回的参数改变表格和小数据库的内容
				Zpobj.refreshTable();	//刷新表格
			}
		
			//新增组弹框调用入口
			function addModal(_node){
				var childNode = {
					pid:_node.id,
					optType:'add'
				};
				//弹框配置
				var modalList = {
					"id": "modal-addGroup",
					"title": _node.name+"下新增子组",
					"btns" : [
						{
							"type"      : 'save',
							"clickFunc" : function($this){
								// $this 代表这个按钮的jQuery对象，一般不会用到
								var $modal = $this.parents('.modal');
								saveGroup($modal,childNode);
							}
						},
						{
							"type"      : 'reset'
						},
						{
							"type"      : 'close'
						}
					]
				};
				//输入组数据
				var inputList = [{
					"necessary" : true,
					"prevWord": '组名称',
					"inputData": {
						"type": 'text',
						"name": 'name',
						"value": null,
						"checkFunc" : "checkGroupName"
					},
					"afterWord": ''
				},{
					"prevWord": '备注',
					"inputData": {
						"type": 'text',
						"name": 'note',
						"value": null
					},
					"afterWord": ''
				}];
				//根据类型做出修改
				if(_node.addType == 0){
					
				}
				//制作并展示弹框
				showModal(childNode,modalList,inputList);
				
			}
			//编辑类弹框调用入口
			function editModal(_node){
				var modalList = {
					"id": "modal-editGroup",
					"size":'normal',
					"title": _node.name+"编辑",
					"btns" : [
						{
							"type"      : 'save',
							"clickFunc" : function($this){
								// $this 代表这个按钮的jQuery对象，一般不会用到
								var $modal = $this.parents('.modal');
								saveGroup($modal,_node);
							}
						},
						{
							"type"      : 'reset'
						},
						{
							"type"      : 'close'
						}
					]
				};
				//输入组数据
				var inputList = [{
					"necessary" : true,
					"prevWord": '组名称',
					"inputData": {
						"type": 'text',
						"name": 'name',
						"value": _node.name,
						"checkFunc" : "checkGroupName"
					},
					"afterWord": ''
				}];
				//根据类型做出修改
				if(_node.editType == 1){
					inputList.push({
						"prevWord": '备注',
						"inputData": {
							"type": 'text',
							"name": 'note',
							"value": _node.note
						},
						"afterWord": ''
					});
				}else if(_node.editType == 0){
					inputList.push({
						"prevWord": '非IP/MAC绑定用户不允许上网：',
						"inputData": {
							"type": 'radio',
							"name": 'notIPMAC',
							"defaultValue":_node.notIPMAC ||'off',
							"items": [{
								"value": 'on',
								"name": '开启',
							}, {
								"value": 'off',
								"name": '关闭'
							} ]
						},
						"afterWord": ''
					});
				}else if(_node.editType == 2){
					
				}
				_node.optType = 'edit';
				//制作并展示弹框
				showModal(_node,modalList,inputList);
			}
			
			//生产弹框
			function showModal(n,m,i){
				//获得弹框对象
				var Modal = require('Modal');
				var modaobj = Modal.getModalObj(m),
				$modal = modaobj.getDom();
				//获得输入组对象
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(i);
				//添加到指定位置
				$modal.find('.modal-body').empty().append($dom);
				$('body').append($modal);
				modaobj.show();

			}
			//表格部分的删除按钮
			function tableRemoveClick(nodeList){
				var Tips = require('Tips');
				var nameStr = '';
				
				if(nodeList.length==1){
					nameStr = '真的要删除'+(nodeList[0].objType==1?'用户':'组')+' : <span style="font-weight:bold">'+nodeList[0].name+'</span> 吗？';
				}else if(nodeList.length>1){
					nameStr = '真的要删除已勾选的组或用户吗？';
				}else{
					Tips.showInfo('请选择要删除的组或用户',3);
				}
				if(nameStr != ''){
					Tips.showConfirm(nameStr,function(){
						removeGroupUser(nodeList);
					});
				}
				
				
			}
			//删除字符串拼接发送方法
			function removeGroupUser(removeNodeArr){
				var Tips = require('Tips');
				if(removeNodeArr.length>0){
					var remGroupStr = 'groupDelId=';
					var Gcount = 0;
					var remUserStr = 'userDelId=';
					var Ucount = 0;
					removeNodeArr.forEach(function(obj,i){
						if(obj.objType==1){
							remUserStr+=(obj.id+',');
							Ucount++;
						}else if(obj.objType==0){
							Gcount++;
							remGroupStr+=(obj.id+',');
						}
					});
					remGroupStr = remGroupStr.substring(0,(remGroupStr.length-1));
					remUserStr = remUserStr.substring(0,(remUserStr.length-1));
					if(Gcount == 0)
						remGroupStr ='';
					if(Ucount == 0)
						remUserStr ='';
					if(Gcount !=0 && Ucount != 0)
						remGroupStr += '&'
					var removeStr = remGroupStr+remUserStr;
					console.log(removeStr)
//					$.ajax({
//					url: '/goform/所有删除的统一地址',
//					type: 'POST',
//					data: removeStr,
//					success: function(result) {
//						var doEval = require('Eval');
//						var codeStr = result,
//							variableArr = ['allData','isSuccessful','status'],
//							result = doEval.doEval(codeStr, variableArr),
//							isSuccess = result["isSuccessful"];
//						// 判断代码字符串执行是否成功
//						if (isSuccess) {
//							var data = result["data"],
//								status = data['status'];
//							if (status) {
//								// 显示成功信息
//								if(_node.id){
//									Tips.showSuccess('修改成功！', 2);
//								}else{
//									Tips.showSuccess('新增组成功！', 2);
//								}
//								//刷新树
//								Zpobj.modify(data.["allData"]);
//								Zpobj.refreshTree();
//								
//							} else {
//								Tips.showWarning('操作失败……', 2);
//							}
//						} else {
//							Tips.showWarning('字符串解析错误……', 2);
//						}
//					}
//				});
				}else{
					Tips.showWarning('请选择想要删除的组或用户',3);
				}
				
			}
			//导入弹框
			function makedownloadModal(){
				var modalList = {
						"id": "",
						"size":'normal',
						"title": "批量导入",
						"btns" : [
							{
								"type"      : 'save',
								"clickFunc" : function($this){
									// $this 代表这个按钮的jQuery对象，一般不会用到
									var $modal = $this.parents('.modal');
								}
							},
							{
								"type"      : 'reset'
							},
							{
								"type"      : 'close'
							}
						]
					};
				var inputList = [
					{
						"prevWord": '请选择文件',
						"inputData": {
							"type": 'text',
							"name": 'fileSrc'
						},
						"afterWord": ''
					},
					{
						"prevWord": '',
						"inputData": {
							"type": 'link',
							"items":[
								{
									"name":'下载模板',
									"id":'downloadLink'
								}
							]
						},
						"afterWord": ''
					}
				];
				//获得弹框对象
				var Modal = require('Modal');
				var modaobj = Modal.getModalObj(modalList),
				$modal = modaobj.getDom();
				//获得输入组对象
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				//添加到指定位置
				$modal.find('.modal-body').empty().append($dom);
				$('body').append($modal);
				var btnslist = [
				{
					"name":'选择文件',
					"id":'chooseFile',
					"clickFunc":function($this){
						
					}				
				}
				];
				InputGroup.insertBtn($dom,'fileSrc',btnslist);
				var $flie = $('<input type="file" id="chooseFileHide" style="display:none"/>');
				$dom.append($flie);
				$dom.find('#chooseFile').click(function(){
					$flie.click();
				});
				$flie.change(function(){
					$dom.find('[name="fileSrc"]').val($(this).val());
				});
				modaobj.show();
				
			}
			//移动用户到弹框
			function makeMoveUserModal(nodeList){
				var Tips = require('Tips');
				if(nodeList.length>0){
					var modalList = {
						"id": "",
						"size":'normal',
						"title": "移动用户到指定组",
						"btns" : [
							{
								"type"      : 'save',
								"clickFunc" : function($this){
									// $this 代表这个按钮的jQuery对象，一般不会用到
									var $modal = $this.parents('.modal');
									saveMoveUser($modal,nodeList);
								}
							},
							{
								"type"      : 'reset'
							},
							{
								"type"      : 'close'
							}
						]
					};
				var items = [];
				var _tree =$.fn.zTree.getZTreeObj(Zpobj.data.treeSetting.treeId);
				var nowNode = _tree.transformToArray(_tree.getNodes());
				//遍历树数据，获取组并添加级数对应的空格
				nowNode.forEach(function(obj){
					if(obj.objType == 0 && obj.pid != Zpobj.data.treeSetting.rootId ){
						var spaceword = '';
						for(var i=0;i<(Number(obj.level)-1);i++){
							spaceword +='--';
						}
						items.push({'value':obj.id,'name': spaceword+obj.name});
					}
				});
				var inputList = [
					{
						"prevWord": '请确认将所选用户移动到分组',
						"inputData": {
							"type": 'select',
							"name": 'moveUserTo',
							"defaultValue":nodeList[0].pid||'',
							"items": items
						},
						"afterWord": ''
					}
				];
				showModal('',modalList,inputList);
				}else{
					Tips.showInfo('请选择想移动的用户',3);
				}
				
				
			}
			//移动到 保存方法
			function saveMoveUser($modal,_node){
				var Tips = require('Tips');
				
				
				// 引入serialize模块
				var Serialize = require('Serialize');
				// 将模态框中的输入转化为url字符串
				var queryArr = Serialize.getQueryArrs($modal);
				var queryJson = Serialize.queryArrsToJson(queryArr);
				//如果组未改变，则不执行以下操作
				if(queryJson.moveUserTo == _node[0].pid){
					Tips.showInfo('当前所属组未改变！请选择其他组',3);
				}else{
					//将改变组的用户拼接成字符串
					var urlStr = 'pid='+queryJson.moveUserTo+'&id=';
					
					_node.forEach(function(obj){
						urlStr +=obj.id +',';
					});
					var urlStr = urlStr.substring(0,urlStr.length-1);
					
					$.ajax({
						type:"post",
						url:"",
						data:urlStr,
						success:function(result){
							
						}
					});
				}
				
				
				
			}
			//编辑组、新增组的保存方法
			function saveGroup($modal,_node){
				// 引入serialize模块
				var Serialize = require('Serialize');
				// 将模态框中的输入转化为url字符串
				var queryArr = Serialize.getQueryArrs($modal);
				var queryJson = Serialize.queryArrsToJson(queryArr);
				//根据表格内容修改部分属性
				if(queryJson.name)
				_node.name = queryJson.name;
				if(queryJson.note)
				_node.note = queryJson.note;
				if(queryJson.notIPMAC)
				_node.notIPMAC = queryJson.notIPMAC;
//				console.log(_node);
				//转化格式
				var nodeStr = Serialize.queryJsonToStr(_node);
				//向后台发送数据
				var Tips = require('Tips');
//				$.ajax({
//					url: '/goform/formEditGroup',
//					type: 'POST',
//					data: nodeStr,
//					success: function(result) {
//						var doEval = require('Eval');
//						var codeStr = result,
//							variableArr = ['allData'],
//							result = doEval.doEval(codeStr, variableArr),
//							isSuccess = result["isSuccessful"];
//						// 判断代码字符串执行是否成功
//						if (isSuccess) {
//							var data = result["data"],
//								status = data['status'];
//							if (status) {
//								// 显示成功信息
//								if(_node.id){
//									Tips.showSuccess('修改成功！', 2);
//								}else{
//									Tips.showSuccess('新增组成功！', 2);
//								}
//								//刷新树
								Zpobj.reordOpenType();
								Zpobj.modifyList(Zpobj.list);
								Zpobj.refreshTree();
//								
//							} else {
//								Tips.showWarning('操作失败……', 2);
//							}
//						} else {
//							Tips.showWarning('字符串解析错误……', 2);
//						}
//					}
//				});
			}
			
			//新增用户弹框
			function addUserModal(thisNode){
				var modalList = {
					"id": "modal-addUser",
					"title": "新增用户",
					"size" : "large",
					"btns" : [
						{
							"type"      : 'save',
							"clickFunc" : function($this){
								// $this 代表这个按钮的jQuery对象，一般不会用到
								var $modal = $this.parents('.modal');
								$modal.find('input,textarea').each(function(){
									if(!$(this).is(':hidden')){
										$(this).blur();
									}
								});
								saveUser($modal,thisNode);
							}
						},
						{
							"type"      : 'reset'
						},
						{
							"type"      : 'close'
						}
					]
				};
				
				showUserModal(modalList);
			}
			
			//编辑用户弹框
			function editUserModal(thisNode){
				var modalList = {
					"id": "modal-editUser",
					"title": "编辑用户",
					"size" : "large",
					"btns" : [
						{
							"type"      : 'save',
							"clickFunc" : function($this){
								// $this 代表这个按钮的jQuery对象，一般不会用到
								var $modal = $this.parents('.modal');
								saveUser($modal,thisNode);
							}
						},
						{
							"type"      : 'reset'
						},
						{
							"type"      : 'close'
						}
					]
				};
				
				showUserModal(modalList,thisNode);
			}
			
			function showUserModal(modalList,thisNode){
				//获得弹框对象
				var Modal = require('Modal');
				var modaobj = Modal.getModalObj(modalList),
				$modal = modaobj.getDom();
				
				var nodeJson = {};
				//查看是否为编辑状态
				if(thisNode){
					nodeJson = thisNode;
				}
				//根据需求，获得不同层级的变形框
				var dom1 = getipg1($modal,nodeJson);
				
				var dom21 = getipg21($modal,nodeJson);//————普通用户
				var dom22 = getipg22($modal,nodeJson);//————认证用户
				
				
				
				$modal.find('.modal-body').append(dom1,dom21,dom22);
				if(nodeJson.userType){
					$modal.find('[radioFromName = "userType"]').addClass('u-hide');
					$modal.find('[radioFromValue = "'+nodeJson.userType+'"]').removeClass('u-hide');
				}
				
				//初始化样式
				$modal.find('textarea').attr({cols:43,rows:4}).css({marginLeft:"0px",resize:"none"});
				$modal.find('td:first-child:not([colspan])').width(100);
				
				//绑定部分功能
					//清空
				$modal.find('a.clear-textarea').click(function(){
					var t = $(this);
					t.parent().prev().find('textarea').val('');
				});
					//扫描Mac超链接点击
				$modal.find('a.scanMac').click(function(){
					var t = $(this);
					var scanType = '';
					if($modal.find('[name = "userType"]:checked').val() == 'normalUser'){
						if($modal.find('[name = "normalUserLinkType"]:checked').val() == 'Mac'){
							 scanType = 'Mac';
						}else if($modal.find('[name = "normalUserLinkType"]:checked').val() == 'IPMac'){
							 scanType = 'IPMac';
						}
					}else if($modal.find('[name = "userType"]:checked').val() == 'authUser'){
						if($modal.find('[name = "authUserLinkType"]:checked').val() == 'Mac'){
							scanType = 'Mac';
						}else if($modal.find('[name = "authUserLinkType"]:checked').val() == 'IPMac'){
							scanType = 'IPMac';
						}
					}
					makeScanModal(scanType,t);
					
				});
				
				//展示弹框
				$('body').append($modal);
				modaobj.show();
			}
			
			
			/*
			 * 顶层变形框
			 */
			function getipg1($m,nj){
				//遍历原数据并生产父组的下拉内容数组
				var _list = Zpobj.list.concat();//获取原数据
				var itemsArr = [];				//新建一个空的存放下拉数据的数组
				var _tree =$.fn.zTree.getZTreeObj(Zpobj.data.treeSetting.treeId);
				var nowNode = _tree.transformToArray(_tree.getNodes());
				//遍历树数据，获取组并添加级数对应的空格
				nowNode.forEach(function(obj){
					if(obj.objType == 0 && obj.pid != Zpobj.data.treeSetting.rootId){
						var spaceword = '';
						for(var i=0;i<(Number(obj.level)-1);i++){
							spaceword +='--';
						}
						itemsArr.push({'value':obj.id,'name': spaceword+obj.name});
					}
				});
				var inputList = [
				{
					"necessary" : true,
					"prevWord": '用户名',
					"inputData": {
						"type": 'text',
						"name": 'name',
						"value": nj.name || '',
						"checkFuncs" : ["checkIP"]
					},
					"afterWord": ''
				},{
					"necessary" : true,
					"prevWord": '所属组',
					"inputData": {
						"type": 'select',
						"name": 'parentName',
						"defaultValue" :nj.pid || '',
						"items":itemsArr
					},
					"afterWord": ''
				},{
					"prevWord": '用户类型',
					"inputData": {
						"type": 'radio',
						"name": 'userType',
						"defaultValue": nj.userType || 'normalUser',
						"items":[
							{
								"value": 'normalUser',
								"name": '普通用户'
							},
							{
								"value": 'authUser',
								"name": '认证用户'
							}
						]
					},
					"afterWord": ''
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.find('[name="userType"]').each(function(){
					var t = $(this);
					t.click(function(){
						$m.find('[radioFromName = "'+t.attr('name')+'"]').addClass('u-hide');
						$m.find('[radioFromValue = "'+t.val()+'"]').removeClass('u-hide');
					});
				});
				
				
				return $dom;
				
			}
			/*
			 * 普通用户展示模块
			 */
			function getipg21($m,nj){
				var $div = $('<div radioFromName="userType" radioFromValue="normalUser" class=""></div>');
				
				//获得个普通用户部分的输入组对象
				var inputList = [{
					"prevWord": '绑定方法',
					"inputData": {
						"type": 'radio',
						"name": 'normalUserLinkType',
						"defaultValue":nj.normalUserLinkType || 'IP',
						"items":[
							{
								"value": 'IP',
								"name": 'IP绑定'
							},
							{
								"value": 'Mac',
								"name": 'Mac绑定'
							},{
								"value": 'IPMac',
								"name": 'IP/Mac绑定'
							}
						]
					},
					"afterWord": ''
				}];
				
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.find('[name="normalUserLinkType"]').each(function(){
					var t = $(this);
					t.click(function(){
						$m.find('[radioFromName = "'+t.attr('name')+'"]').addClass('u-hide');
						$m.find('[radioFromName = "'+t.attr('name')+'"][radioFromValue = "'+t.val()+'"]').removeClass('u-hide');
					});
				});
				
				$div.append($dom);
				
				//IP
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'normalIP',
						"value"      : nj.normalIP || '',
						"checkFuncs" : ["checkIP"]
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				//修改textarea的默认值
//				$dom.find('[name="normalIP"]').val('aaa\nadfasdf');
				
				
				$dom.attr({radioFromName:'normalUserLinkType',radioFromValue:'IP'});
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>196.196.201.201</span><br><span class="u-prompt-word" data-local>196.196.201.201-200.200.201.222</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);
				
				$div.append($dom);
				
				//Mac
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'normalMac',
						"value"		 : nj.normalMac || '',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				
				$dom.attr({radioFromName:'normalUserLinkType',radioFromValue:'Mac'}).addClass('u-hide');
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:55</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:56</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a><a class="u-inputLink scanMac" style="position:absolute;bottom:0px;left:64px;">扫描Mac地址</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);
				
				$div.append($dom);
				
				
				//IPMac
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'normalIPMac',
						"value"		 : nj.normalIPMac || '',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.attr({radioFromName:'normalUserLinkType',radioFromValue:'IPMac'}).addClass('u-hide');
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>196.196.201.2(00:11:22:33:44:55)</span><br><span class="u-prompt-word" data-local>196.196.201.2(00:11:22:33:44:56)</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a><a class="u-inputLink scanMac" style="position:absolute;bottom:0px;left:64px;">扫描Mac地址</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);
				$div.append($dom);
				
				if(nj.normalUserLinkType){
					$div.find('[radioFromName = "normalUserLinkType"]').addClass('u-hide');
					$div.find('[radioFromValue = "'+nj.normalUserLinkType+'"]').removeClass('u-hide');
				}
				
				
				return $div;
			}
			
			//获得认证用户展开模块
			function getipg22($m,nj){
				var $div = $('<div radioFromName="userType" radioFromValue="authUser" class="u-hide"></div>');
				
				//获得认证用户开始部分
				var inputList = [{
					"prevWord": '认证方式',
					"inputData": {
						"type": 'select',
						"name": 'authType',
						"defaultValue":nj.authType||'IP',
						"items":Zpobj.authTypeArr
					},
					"afterWord": ''
				},
				{
					"prevWord": '认证账号',
					"necessary": true,
					"inputData": {
						"type": 'text',
						"name": 'authAccount',
						"value": nj.authAccount|| '',
						"checkFuncs" : ["checkIP"]
					},
					"afterWord": ''
				},{
					"prevWord": '认证密码',
					"necessary": true,
					"inputData": {
						"type": 'password',
						"name": 'authPassword',
						"value":nj.authPassword|| ''
					},
					"afterWord": ''
				},{
					"prevWord": '并发数',
					"inputData": {
						"type": 'text',
						"name": 'concurrency',
						"value":nj.concurrency || ''
					},
					"afterWord": ''
				},{
					"prevWord": '绑定方式',
					"inputData": {
						"type": 'radio',
						"name": 'authUserLinkType',
						"defaultValue": nj.authUserLinkType || 'no',
						"items": [
							{
								"value": 'no',
								"name": '无绑定'
							},
//							{
//								"value": 'authAuto',
//								"name": '自动绑定'
//							},
							{
								"value": 'IP',
								"name": 'IP绑定'
							},
							{
								"value": 'Mac',
								"name": 'Mac绑定'
							},
							{
								"value": 'IPMac',
								"name": 'IP/Mac绑定'
							}
							
						]
					},
					"afterWord": ''
				}];
				
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.find('[name="authUserLinkType"]').each(function(){
					var t = $(this);
					t.click(function(){
						$m.find('[radioFromName = "'+t.attr('name')+'"]').addClass('u-hide');
						$m.find('[radioFromName = "'+t.attr('name')+'"][radioFromValue = "'+t.val()+'"]').removeClass('u-hide');
					});
				});
				$dom.find('[name="authType"]').each(function(){
					var t = $(this);
					t.click(function(){
						$m.find('[radioFromName = "'+t.attr('name')+'"]').addClass('u-hide');
						$m.find('[radioFromName = "'+t.attr('name')+'"][radioFromValue = "'+t.val()+'"]').removeClass('u-hide');
					});
				});
				
				$div.append($dom);
				
				//无绑定
				$dom = $('<div style="height:0px !important;border:none !important;margin:0px 0px;padding:0px 0px"></div>');
				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'no'}).addClass('u-hide');
				$div.append($dom);
				
//				//自动绑定
//				var inputList = [{
//					"prevWord": '',
//					"inputData": {
//						"type"       : 'textarea',
//						"name"       : 'authAuto',
//						"checkFuncs" : ['checkIP']
//					},
//					"afterWord": ''
//				}];
//				var InputGroup = require('InputGroup'),
//				$dom = InputGroup.getDom(inputList);
//				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'auto'}).addClass('u-hide');
//				$div.append($dom);
				
				//IP
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'authIP',
						"value"		 : nj.authIP || '',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				
				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'IP'}).addClass('u-hide');
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>196.196.201.201</span><br><span class="u-prompt-word" data-local>196.196.201.201-200.200.201.222</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);
				
				$div.append($dom);
				
				//Mac
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'authMac',
						"value"		 : nj.authMac || '',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				
				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'Mac'}).addClass('u-hide');
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:55</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:56</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a><a class="u-inputLink scanMac" style="position:absolute;bottom:0px;left:64px;">扫描Mac地址</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);
				
				$div.append($dom);
				
				
				//IPMac
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'authIPMac',
						"value"		 : nj.authIPMac || '',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'IPMac'}).addClass('u-hide');
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>196.196.201.2(00:11:22:33:44:55)</span><br><span class="u-prompt-word" data-local>196.196.201.2(00:11:22:33:44:56)</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a><a class="u-inputLink scanMac" style="position:absolute;bottom:0px;left:64px;">扫描Mac地址</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);
				$div.append($dom);
				
				if(nj.authUserLinkType){
					$div.find('[radioFromName = "authUserLinkType"]').addClass('u-hide');
					$div.find('[radioFromValue = "'+nj.authUserLinkType+'"]').removeClass('u-hide');
				}
				
				//是否开启计费部分
				var inputList = [
					{
					"prevWord": '账号计费',
					"inputData": {
						"type": 'radio',
						"name": 'accountBill',
						"defaultValue": nj.accountBill || 'off',
						"items": [
							{
								"value": 'on',
								"name": '开启'
							},
							{
								"value": 'off',
								"name": '关闭'
							}
						]
					},
					"afterWord": ''
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.find('[name="accountBill"]').each(function(){
					var t = $(this);
					t.click(function(){
						$m.find('[radioFromName = "'+t.attr('name')+'"]').addClass('u-hide');
						$m.find('[radioFromName = "'+t.attr('name')+'"][radioFromValue = "'+t.val()+'"]').removeClass('u-hide');
					});
				});
				
				$div.append($dom);
				
				//开启部分
				var $domopenbill = $('<div></div>');
				$domopenbill.attr({radioFromName:'accountBill',radioFromValue:'on'}).addClass('u-hide');
				$div.append($domopenbill);
				
				var inputList = [{
					"prevWord": '计费方式',
					"inputData": {
						"type"       : 'select',
						"name"       : 'billType',
						"defaultValue" : nj.billType || '',
						"items" :[
							{
								"name":'按日期计费',
								"value":'dateBill'
							},
							{
								"name":'按时长计费',
								"value":'timeBill'
							}
						]
					},
					"afterWord": ''
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.find('select[name="billType"]').change(function(){
					var t = $(this);
					$m.find('[radioFromName = "'+t.attr('name')+'"]').addClass('u-hide');
					$m.find('[radioFromName = "'+t.attr('name')+'"][radioFromValue = "'+t.val()+'"]').removeClass('u-hide');
				});
				
				$domopenbill.append($dom);
				
				//日期计费部分
				var inputList = [{
					"prevWord": '账号开通日期',
					"inputData": {
						"type"       : 'date',
						"name"       : 'accountOpenDate',
						"value"		 : nj.accountOpenDate || ''
					},
					"afterWord": ''
				},
				{
					"prevWord": '账号停用日期',
					"inputData": {
						"type"       : 'date',
						"name"       : 'accountStopDate',
						"value"		 : nj.accountStopDate || ''
					},
					"afterWord": ''
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.attr({radioFromName:'billType',radioFromValue:'dateBill'});
				$domopenbill.append($dom);
				
				//时长计费部分
				var inputList = [{
					"prevWord": '账号有效时长',
					"inputData": {
						"type"       : 'text',
						"name"       : 'accountEffectTime',
						"value"		 : nj.accountEffectTime || ''
					},
					"afterWord": ''
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				var _select = "<select style='margin-left:10px;width:78px;' name='accountEffectTimeUnit'><option value='min' data-local='分钟'>分钟</option><option value='hour' data-local='小时'>小时</option><option value='day' data-local='天'>天</option></select>";
				$dom.find('input[name="accountEffectTime"]').after($(_select));
				$dom.attr({radioFromName:'billType',radioFromValue:'timeBill'}).addClass('u-hide');
				$domopenbill.append($dom);
				
				if(nj.accountBill){
					$domopenbill.find('[radioFromName = "billType"]').addClass('u-hide');
					$domopenbill.find('[radioFromValue = "'+nj.billType+'"]').removeClass('u-hide');
				}
				
				//关闭部分
				$dom = $('<div style="height:0px !important;border:none !important;margin:0px 0px;padding:0px 0px"></div>');
				$dom.attr({radioFromName:'accountBill',radioFromValue:'off'}).addClass('u-hide');
				$div.append($dom);
				
				if(nj.accountBill){
					$div.find('[radioFromName = "accountBill"]').addClass('u-hide');
					$div.find('[radioFromValue = "'+nj.accountBill+'"]').removeClass('u-hide');
				}
				
				//是否开启计费部分
				var inputList = [
					{
					"prevWord": '用户状态',
					"inputData": {
						"type": 'radio',
						"name": 'userState',
						"defaultValue": nj.userState || 'on',
						"items": [
							{
								"value": 'on',
								"name": '正常'
							},
							{
								"value": 'off',
								"name": '冻结'
							}
						]
					},
					"afterWord": ''
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.attr({radioFromName:'authType',radioFromValue:'PPPoE'});
				$div.append($dom);
				//Web认证隐藏部分
				$dom = $('<div style="height:0px !important;border:none !important;margin:0px 0px;padding:0px 0px"></div>');
				$dom.attr({radioFromName:'authType',radioFromValue:'Web'}).addClass('u-hide');
				$div.append($dom);
				//
				if(nj.authType){
					$div.find('[radioFromName = "authType"]').addClass('u-hide');
					$div.find('[radioFromValue = "'+nj.authType+'"]').removeClass('u-hide');
				}
				
				
				return $div;
			}
			
		//用户的保存
		function saveUser($modal,thisNode){
			// 引入serialize模块
			var Serialize = require('Serialize');
			// 将模态框中的输入转化为
			var queryArr = Serialize.getQueryArrs($modal);
			var queryJson = Serialize.queryArrsToJson(queryArr);
			//根据表格内容修改部分属性
			thisNode.name = queryJson.name; //用户名
			thisNode.pid = queryJson.parentName;//父id
			thisNode.userType = queryJson.userType;//用户类型
			if(thisNode.userType == 'normalUser'){
				thisNode.normalUserLinkType = queryJson.normalUserLinkType;//绑定方法
				if(thisNode.normalUserLinkType == 'IP'){
					thisNode.normalIP = queryJson.normalIP;
				}else if(thisNode.normalUserLinkType == 'Mac'){
					thisNode.normalMac = queryJson.normalMac;
				}else if(thisNode.normalUserLinkType == 'IPMac'){
					thisNode.normalIPMac = queryJson.normalIPMac;
				}
			}else if(thisNode.userType == 'authUser'){
				thisNode.authType = queryJson.authType;//认证方式
				thisNode.authAccount = queryJson.authAccount;//认证账号
				thisNode.authPassword = queryJson.authPassword;//认证密码
				thisNode.concurrency = queryJson.concurrency;//并发数
				thisNode.authUserLinkType = queryJson.authUserLinkType;//绑定方式
				if(thisNode.authUserLinkType == 'no'){
					thisNode.authNo = queryJson.authNo;
				}else if(thisNode.authUserLinkType == 'IP'){
					thisNode.authIP = queryJson.authIP;
				}else if(thisNode.authUserLinkType == 'Mac'){
					thisNode.authMac = queryJson.authMac;
				}else if(thisNode.authUserLinkType == 'IPMac'){
					thisNode.authIPMac = queryJson.authIPMac;
				}
				thisNode.accountBill = queryJson.accountBill;//账号计费
				if(thisNode.accountBill =='on'){
					thisNode.billType = queryJson.billType;//计费方式
					if(thisNode.billType == 'dateBill'){
						thisNode.accountOpenDate = queryJson.accountOpenDate;//账号开通日期
						thisNode.accountStopDate = queryJson.accountStopDate;//账号停用日期
					}else if(thisNode.billType == 'timeBill'){
						thisNode.accountEffectTime = queryJson.accountEffectTime;//账号有效时长
						thisNode.accountEffectTimeUnit = queryJson.accountEffectTimeUnit;//账号有效时长：单位
					}
				}
			}
			thisNode.userState = queryJson.userState;//用户状态
			
			//转化格式
//			var nodeStr = Serialize.queryJsonToStr(thisNode);	
//			$modal.modal('hide');
//			setTimeout(function(){
//				$modal.remove();
//			},450);
			//修改发送地址
			var _url = ''; 
			
			
			if(thisNode.userType == 'normalUser'){
				if(thisNode.normalUserLinkType == 'IP' || thisNode.normalUserLinkType == 'Mac'){
					_url = '1';
				}else if(thisNode.normalUserLinkType == 'IPMac'){
					_url = '2';
				}
			}else if(thisNode.userType == 'authUser'){
				if(thisNode.authType == 'PPPoE'){
					_url = '3';
				}else if(thisNode.authType == 'Web'){
					_url = '4';
				}
			}
//			alert(_url)
//			$.ajax({
//				type:"post",
//				url:_url,
//				data: nodeStr,
//				success: function(result) {
//				
//			});
			
		}
		
		//扫描Mac弹框制作(扫描Mac类型,点击的超链接对象)
		function makeScanModal(scanType,$alink){
			var modalList = {
					"id": "modal-editUser",
					"title": $alink.text() || '扫描',
					"btns" : [
						{
							"type"      : 'save',
							"clickFunc" : function($this){
								// $this 代表这个按钮的jQuery对象，一般不会用到
								var $modal = $this.parents('.modal');
								alert(scanType)
							}
						},
						{
							"type"      : 'close'
						}
					]
				};
			
			var Modal = require('Modal');
			var modaobj = Modal.getModalObj(modalList);
			var	$modal = modaobj.getDom();
			
			modaobj.show();
			
			
			
		}
	}
});