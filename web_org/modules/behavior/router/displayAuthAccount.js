define(function(require, exports, module) {
	require('jquery');

	var Translate  = require('Translate');
	var dicArr     = ['common','doPeopleOrganize'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	var Tips = require('Tips');

	var DATA = {};
	//获取数据
	var allDatas = [];
	function getAccountconf($container){
		//获取配置信息

		$.ajax({
			url : 'common.asp?optType=AuthCount',
			type: 'GET',
			success : function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['allDatas','smaxconv'];
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
//				console.log(result);
					if(isSuccess){
						//var DATA['a'] = result;
						var data = result["data"];
						allDatas = data["allDatas"];
						DATA.smaxconv = data["smaxconv"];
						showAccountconf($container);
					}else{
						Tips.showWarning('{netErr}', 2);
					}
			}
		});

	}


	function showAccountconf($container) {
		//配置信息
		var treeplusSetting = {
				showType	: 0,	//暂时只有两种状态：0:可编辑（组织成员）	,1:可勾选（行为管理中选择指定用户时）
				authType	:['ppoe，web'],
				tableSetting:{	//表参数配置
								pnameArr : [['ID','idIndex'],
											['{username}','name'],
											['{baseGrp}','parentGroupName'],
											['{open}','isOpen'],
											['{authType}','authType'],
											['{bindType}','bindType'],
											['{ip}','normalIP'],
											['{MACAddr}','normalMac'],
											['{crgType}','billType'],
											['{accDataStart}','accountOpenDate'],
											['{accDataEnd}','accountStopDate']],

								addClick :  function(){
									addUserModal({optType:'add'});
								},
								//小编辑
								editClick : function(_node){
									if(_node.objType == 1){
										_node.optType = 'edit';
										editUserModal(_node);
									}
								},
								//全局删除
								allRemoveClick : function(nodeList){
//                                  console.log("全局删除");

									tableRemoveClick(nodeList);
								},
								//小删除
								removeClick : function(nodeList){
									tableRemoveClick(nodeList);

								},
								//导入
								downloadClick : function(){
									makedownloadModal();
								},
								//导出
								outputClick : function(){

								},
							}
			};
			DATA["data"] = treeplusSetting;

			var $tableDom = getTable(allDatas,treeplusSetting);
			Translate.translate([$tableDom], dicArr);
			var TableContainer = require('P_template/common/TableContainer');
			var conhtml = TableContainer.getHTML({}),
				$tableCon = $(conhtml);
			$tableCon.append($tableDom);
			$container.empty().append($tableCon);



	}
	/**
	 * 开始生成表格
	 * @param {Object} list
	 * @param {Object} data
	 */
	function getTable(list,data){
		//数据过滤及完善（自动遍历生成父组名）
		var newlist = nodeListFilter(list);
		DATA["list"] = newlist;
		//生成数据库
		var database = saveInBase(newlist,data);
		DATA["base"] = database;
		//生成表格
		var $tableDom = getTableDom(newlist,data,database);

		return $tableDom;
	}


	/**
	 * 数据过滤
	 * @param {Object} list
	 */
	function nodeListFilter(list){
		//自动遍历父组名: parentGroupName
		list.forEach(function(obj,i){
			if(obj.objType == 1){
				list.forEach(function(obj2,i2){
					if(obj2.id == obj.pid){
						obj.parentGroupName = obj2.name;
					}
				});
				
			}
		});
		//给组添加级数
		var level = 0;
		list.forEach(function(obj,i){
			level = 0;
			if(obj.objType == 0){
				intervalLevel(obj);
				obj.level = level;
			}
		});
		function intervalLevel(obj){
			list.forEach(function(obj1,i1){
				if(obj1.id == obj.pid){
					level++;
					intervalLevel(obj1);
				}
			});
		}

		//给数据排序
//		var groupArr = [];
//		var userArr = [];
//		var rootArr = [];
//		list.forEach(function(obj){
//			if(obj.objType == 0 && obj.level != 0){
//				groupArr.push(obj);
//			}else if(obj.objType == 1){
//				userArr.push(obj);
//			}else if(obj.level == 0){
//				rootArr.push(obj);
//			}
//		});

		var newarr = [];
		list.forEach(function(obj){
			if(obj.level == 0){
				newarr.push(obj);
				intervalChild(obj)
			}
		});
		function intervalChild(obj){
			list.forEach(function(obj1){
					if(obj1.pid == obj.id && obj1.objType == 0){
						newarr.push(obj1);
						intervalChild(obj1)
					}
				});
			list.forEach(function(obj1){
					if(obj1.pid == obj.id && obj1.objType == 1){
						newarr.push(obj1);
					}
				});
		}


		var newarr1 = [];
		/*将不是PPPOE和WEB认证的用户过滤掉*/
		newarr.forEach(function(obj,i){
			if((obj.authType == 'PPPoE' || obj.authType == 'Web') ||  obj.objType == 0 ){
				newarr1.push(obj);
			}
		})

		return newarr1;
	}

	/**
	 * 生产数据库
	 * @param {Object} list
	 * @param {Object} data
	 */
	function saveInBase(list,data){
		var showCol = data.tableSetting.pnameArr;//获得显示列
		var _newList = [];
		var idIndex = 0;
		list.forEach(function(obj){
			if(obj.objType == 1){
				idIndex++;
				obj.idIndex = idIndex;
				_newList.push(obj);
			}
		});
		var nowList = _newList;
		//解析数据为表格可用数据
		var newTableArr = [];
		var baseCol = showCol.concat();
		baseCol.push(['','id']);
		baseCol.push(['','objType']);
		nowList.forEach(function(obj, i) {
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

		return database;
	}


	/**
	 * 获得表格
	 * @param {Object} newlist
	 * @param {Object} data
	 * @param {Object} database
	 */
	function getTableDom(newlist,data,database){
//		var nowObj = this;
//		var btnList =[];
			// 表格上方按钮配置数据
		var nowList = newlist;
			var btnList = [{
				"id": "addUser",
				"name": '{add}',
				"clickFunc" : function($this){
					data.tableSetting.addClick();
				}
			}, {
				"id": "deleteAll",
				"name": "{delete}",
				"clickFunc" : function($this){
					var deletNodesArr = [];
					var checkSelect = DATA["tableobj"].getSelectInputKey('data-primaryKey');


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

					data.tableSetting.allRemoveClick(deletNodesArr);
				}
			}];


		var tableHeadData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			otherFuncAfterRefresh:afterrefresh,
			"titles": {},
			"dicArr": ['common','doPeopleOrganize']
		};
		var showCol = data.tableSetting.pnameArr;
		showCol.forEach(function(obj){
			if(obj[1] == 'isOpen'){
				tableList["titles"][obj[0]] = {
					"key":  obj[1],
					"type": "checkbox",
					"values":{
						"on":true,
						"off":false
					},
					"clickFunc":function($this){
                        var thisNode = {};
                        var pkey = $this.attr('data-primaryKey');
                        var primaryKey = pkey;
                        var bobj = database.getSelect({
                            primaryKey: primaryKey
                        });
                        nowList.forEach(function(_node){
                            if(bobj["0"].id == _node.id){
                                thisNode = _node;
                            }
                        });
//                      console.log(thisNode);
                        savePPPoEStatus(thisNode);
					}
				};
			}else if(obj[1] == 'billType'){
					tableList["titles"][obj[0]] = {
						"key":  obj[1],
						"type": "text",
						"values":{
							"timeBill":'{crgTime}',
							"dateBill":'{crgData}'
						}
					};
			}else if(obj[1] =='bindType'){
				tableList["titles"][obj[0]] = {
					"key":  obj[1],
					"type": "text",
					"values" : {
									"no"  : '{noBind}',
									"autoBind" : '{autoBind}',
									"IP"  : 'IP' + '{bind}',
									"MAC"  : 'Mac' + '{bind}',
									"IP/MAC"  : 'IP/Mac' + '{bind}',
								}
				};
			}else if(obj[1] == 'accountOpenDate'){
					tableList["titles"][obj[0]] = {
						"key": obj[1],
						"type": "text",
						"filter" : function(valueStr){
							if(valueStr === 0 || valueStr === "" || valueStr === undefined){
								return '';
							}
							var open_date = new Date((valueStr - 28800)*1000);
							var open_Y = open_date.getFullYear() + '-';
							var open_M = (open_date.getMonth()+1 < 10 ? '0'+(open_date.getMonth()+1) : open_date.getMonth()+1) + '-';
							var open_D = (open_date.getDate() < 10 ? '0' + open_date.getDate() :open_date.getDate());
							var newOpenDate = open_Y+open_M+open_D;
//							console.log('newOpenDate='+newOpenDate);
							return newOpenDate;
						}

					};
			}else if(obj[1] == 'accountStopDate'){
					tableList["titles"][obj[0]] = {
						"key": obj[1],
						"type": "text",
						"filter" : function(valueStr){
							if(valueStr === 0 || valueStr === "" || valueStr === undefined){
								return '';
							}
							var Stop_date = new Date((valueStr-28800)*1000);
							var Stop_Y = Stop_date.getFullYear() + '-';
							var Stop_M = (Stop_date.getMonth()+1 < 10 ? '0'+(Stop_date.getMonth()+1) : Stop_date.getMonth()+1) + '-';
							var Stop_D = (Stop_date.getDate() < 10 ? '0' + Stop_date.getDate(): + Stop_date.getDate());
							var newStopDate = Stop_Y+Stop_M+Stop_D;
							return newStopDate;
						}

					};
			}else{
				tableList["titles"][obj[0]] = {
					"key":  obj[1],
					"type": "text"
				};
			}


		});
		tableList["titles"][T('edit')]= {
					"type": "btns",
					"btns": [
						{
							"type" : "edit",
							"clickFunc" : function($this){
								var thisNode = {};
								var pkey = $this.attr('data-primaryKey');
								var primaryKey = pkey;
								var bobj = database.getSelect({
									primaryKey: primaryKey
								});
								nowList.forEach(function(_node){
									if(bobj["0"].id == _node.id){
										thisNode = _node;
									}
								});
								data.tableSetting.editClick(thisNode);
							}
						},
						{
							"type" : "delete",
							"clickFunc" : function($this){
								var deletNodesArr = [];
								var pkey = $this.attr('data-primaryKey');
								var primaryKey = pkey;
								var bobj = database.getSelect({
									primaryKey: primaryKey
								});
//                              console.log("删除前读取数据");
//                              console.log(bobj);
//                              console.log(nowList);
								nowList.forEach(function(_node){
//                                  console.log("循环内");
//                                  console.log(_node);
									if(bobj["0"].id == _node.id){
										deletNodesArr.push(_node);
									}
								});
//                              console.log("进入小删除");
								data.tableSetting.removeClick(deletNodesArr);
							}
						}
					]
			};
		// 表格组件配置数据
		var tableAllList = {
			head: tableHeadData,
			table: tableList
		};
		// 加载表格组件，获得表格组件对象，获得表格jquery对象
		var Table = require('Table'),
			tableObj = Table.getTableObj(tableAllList);
		DATA["tableobj"] = tableObj;
		var $table = tableObj.getDom();

		function afterrefresh(tableObjNow){
			//对表格的开启一栏进行过滤（web认证用户无开启关闭按钮）
			tableObjNow.getDom().find('td[data-column-title="{open}"]').each(function(){
				var $t = $(this);
				var thisPK = $t.children('input[type="checkbox"]').attr('data-primarykey');
				var resultData = database.getSelect({primaryKey : thisPK})[0];
				if(resultData.authType == 'Web'){
					$t.children('input[type="checkbox"]').remove();
				}
			});
		}
		


		//制作表格底部的按钮
				var BtnGroup = require('BtnGroup');
				var btnGroupList = [
					{
						"id"        : 'download',
						"name"      : '{import}',
						"clickFunc" : function($btn){
							data.tableSetting.downloadClick();
						}
					},{
						"id"        : 'output',
						"name"      : '{export}',
						"clickFunc" : function($btn){
							data.tableSetting.outputClick();
						}
					}
				];
				var $btnGroup = BtnGroup.getDom(btnGroupList).css({'text-align':'right',paddingRight:'8px'});

		var $div = $('<div></div>');
		$div.append($table);
		Translate.translate([$table], dicArr);
		return $div;
	}

		//新增用户弹框
			function addUserModal(thisNode){
				var modalList = {
					"id": "modal-addUser",
					"title": "{adduser}",
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
					"title": "{edituser}",
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
				DATA.modalObj = modaobj;
				var nodeJson = {};
				//查看是否为编辑状态
				if(thisNode !== undefined){
					nodeJson = thisNode;
					DATA.userModalType = 'edit';
				}else{
					DATA.userModalType = 'add';
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
//				    /*PPPoE Web切换时 按时长计费的影响*/
//
//				$modal.find('[name="authType"]').change(function(){
//					makeTheAuthType()
//				});
//				makeTheAuthType();
//				function makeTheAuthType(){
//					var thisval = $modal.find('[name="authType"]:checked').val();
//					if(thisval == 'PPPoE'){
//						$modal.find('[name="billType"]>[value="timeBill"]').attr('disabled','disabled');
//						$modal.find('[name="billType"]>[value="dateBill"]').trigger('change');
//					}else{
//						$modal.find('[name="billType"]>[value="timeBill"]').removeAttr('disabled');
//					}
//				}
					/*Web认证时没有authUserLinkType*/
				$modal.find('[name="authType"]').change(function(){
					makeTheAuthTypeAuthUserLinkType();
				});
				makeTheAuthTypeAuthUserLinkType();
				function makeTheAuthTypeAuthUserLinkType(){
					var thisval = $modal.find('[name="authType"]:checked').val();
					if(thisval == 'PPPoE'){
						$modal.find('[name="authUserLinkType"]').parent().parent().hide();
					}else{
						$modal.find('[name="authUserLinkType"]').parent().parent().show();
					}
				}

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
				Translate.translate([$modal], dicArr);
				modaobj.show();
				//修改认证方式为默认认证用户


			}


			/*
			 * 顶层变形框
			 */
			function getipg1($m,nj){
				//遍历原数据并生产父组的下拉内容数组
				var _list = DATA["list"].concat();//获取原数据
				var itemsArr = [];				//新建一个空的存放下拉数据的数组
				//遍历树数据，获取组并添加级数对应的空格
				_list.forEach(function(obj){
					if(obj.objType == 0 && obj.level != 0){
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
					"prevWord": '{username}',
					"inputData": {
						"type": 'text',
						"name": 'name',
						"value": nj.name || '',
						"checkDemoFunc": ['checkInput', 'name', '1', '31', '2']
					},
					"afterWord": ''
				},{
					"necessary" : true,
					"prevWord": '{baseGrp}',
					"inputData": {
						"type": 'select',
						"name": 'parentName',
						"defaultValue" :nj.pid || '',
						"items":itemsArr
					},
					"afterWord": ''
				},{
					display:false,
					"prevWord": '{userType}',
					"inputData": {
						"type": 'radio',
						"name": 'userType',
						"defaultValue": nj.userType || 'authUser',
						"items":[
							{
								"value": 'normalUser',
								"name": '{normalUser}'
							},
							{
								"value": 'authUser',
								"name": '{authUser}'
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
				var $div = $('<div radioFromName="userType" radioFromValue="normalUser" class="u-hide" style="display:none !important"></div>');

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
								"name": 'IP'+'{bind}'
							},
							{
								"value": 'Mac',
								"name": 'Mac'+'{bind}'
							},{
								"value": 'IPMac',
								"name": 'IP/Mac'+'{bind}'
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
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:55</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:56</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a>';
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
				var $div = $('<div radioFromName="userType" radioFromValue="authUser" style="display:block !important"></div>');


				//获得认证用户开始部分
				var inputList = [{
					display   : (DATA.userModalType == 'edit'?false:true),
					"prevWord": '{authType}',
					"inputData": {
						"type": 'select',
						"name": 'authType',
						"defaultValue":nj.authType||'IP',
						"items":[{name:'PPPoE认证',value:'PPPoE'},{name:'Web认证',value:'Web'}]
					},
					"afterWord": ''
				},
				{
					"prevWord": '{authAcc}',
					"necessary": true,
					"inputData": {
						"type": 'text',
						"name": 'authAccount',
						"value": nj.authAccount|| '',
						"checkDemoFunc": ['checkInput', 'name', '1', '31', '1']
					},
					"afterWord": ''
				},{
					"prevWord": '{authPwd}',
					"necessary": true,
					"inputData": {
						"type": 'password',
						"name": 'authPassword',
						"value":nj.authPassword|| '',
						"checkDemoFunc": ['checkInput', 'name', '1', '31', '3'],
						"eye"      : true
					},
					"afterWord": ''
				},{
					"prevWord": '{sessionMax}',
					"necessary": true,
					"inputData": {
						"type": 'text',
						"name": 'concurrency',
						"value":nj.concurrency || '1',
						"checkDemoFunc": ['checkInput', 'num', '1', DATA.smaxconv, 'authUserLinkType']
					},
					"afterWord": ''
				},{
					"prevWord": '{bindType}',
					"inputData": {
						"type": 'radio',
						"name": 'authUserLinkType',
						"defaultValue": nj.authUserLinkType || 'no',
						"items": [
							{
								"value": 'no',
								"name": '{no}{bind}'
							},
							{
								"value": 'autoBind',
								"name": '{autoBind}'
							},
							{
								"value": 'IP',
								"name": 'IP'+'{bind}'
							},
							{
								"value": 'Mac',
								"name": 'MAC'+'{bind}'
							},
							{
								"value": 'IPMac',
								"name": 'IP/MAC'+'{bind}'
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
				$dom.find('[name="authUserLinkType"]').eq(0).parent().parent().attr({radioFromName:'authType',radioFromValue:'PPPoE'});
				$div.append($dom);

				//无绑定
				$dom = $('<div style="height:0px !important;border:none !important;margin:0px 0px;padding:0px 0px"></div>');
				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'no'}).addClass('u-hide');
				$div.append($dom);

				//自动绑定
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'autoBind',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'auto'}).addClass('u-hide');
				$div.append($dom);

				//IP
				var inputList = [{
					"prevWord": 'IP',
					"necessary" : true,
					"inputData": {
						"type"       : 'text',
						"name"       : 'authIP',
						"value"		 : nj.normalIP || '',
						"checkFuncs" : ['checkIP']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);

				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'IP'}).addClass('u-hide');
				// var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>196.196.201.201</span><br><span class="u-prompt-word" data-local>196.196.201.201-200.200.201.222</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a>';
				// $dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);

				$div.append($dom);

				//Mac
				var inputList = [{
					"prevWord": '',
					"inputData": {
						"type"       : 'textarea',
						"name"       : 'authMac',
						"value"		 : nj.normalMac || '',
						"checkFuncs" : ['checkMacGroup']
					},
					"afterWord": ''
				}];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);

				$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'Mac'}).addClass('u-hide');
				var spans = '<span class="u-prompt-word" data-local="">一行一个对象，格式范例:</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:55</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:56</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a>';
				$dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);

				$div.append($dom);


					   	//IPMac
					    var inputList = [{
						"prevWord": 'IP',
						"necessary":true,
						"inputData": {
						    "type"       : 'text',
						    "name"       : 'authIPMac_IP',
						    "value"		 : nj.authIPMac_IP || '',
						    "checkFuncs" : ['checkIP']
						},
						"afterWord": ''
					    },{
						"prevWord": 'Mac',
						"necessary":true,
						"inputData": {
						    "type"       : 'text',
						    "name"       : 'authIPMac_Mac',
						    "value"		 : nj.authIPMac_Mac || '',
						    "checkFuncs" : ['checkMac']
						},
						"afterWord": ''
					    }];
					    var InputGroup = require('InputGroup'),
					    $dom = InputGroup.getDom(inputList);
					   	$dom.attr({radioFromName:'authUserLinkType',radioFromValue:'IPMac'}).addClass('u-hide');
					    $div.append($dom);

				if(nj.authUserLinkType){
					$div.find('[radioFromName = "authUserLinkType"]').addClass('u-hide');
					$div.find('[radioFromValue = "'+nj.authUserLinkType+'"]').removeClass('u-hide');
				}

				//是否开启计费部分
				var inputList = [
					{
					"prevWord": '{authCrg}',
					"inputData": {
						"type": 'radio',
						"name": 'accountBill',
						"defaultValue": nj.accountBill || 'off',
						"items": [
							{
								"value": 'on',
								"name": '{open}'
							},
							{
								"value": 'off',
								"name": '{close}'
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
					"prevWord": '{crgType}',
					"inputData": {
						"type"       : 'select',
						"name"       : 'billType',
						"defaultValue" : nj.billType || 'dateBill',
						"items" :[
							{
								"name":'{crgData}',
								"value":'dateBill'
							},
							{
								"name":'{crgTime}',
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
				var open_date = new Date((nj.accountOpenDate - 28800)*1000);
				var open_Y = open_date.getFullYear() + '-';
				var open_M = (open_date.getMonth()+1 < 10 ? '0'+(open_date.getMonth()+1) : open_date.getMonth()+1) + '-';
				var open_D = (open_date.getDate()<10?'0'+open_date.getDate(): open_date.getDate());
				var newOpenDate = open_Y+open_M+open_D;

				var Stop_date = new Date((nj.accountStopDate - 28800)*1000);
				var Stop_Y = Stop_date.getFullYear() + '-';
				var Stop_M = (Stop_date.getMonth()+1 < 10 ? '0'+(Stop_date.getMonth()+1) : Stop_date.getMonth()+1) + '-';
				var Stop_D = (Stop_date.getDate()<10? '0'+Stop_date.getDate():Stop_date.getDate());
				var newStopDate = Stop_Y+Stop_M+Stop_D;


				var thisday = new Date();
				var datenow = '';
				var this_year = thisday.getFullYear().toString();
				var this_mo = (thisday.getMonth()+1).toString();
				var this_day = thisday.getDate().toString();
				datenow = this_year+"-"+(this_mo[1]?this_mo:'0'+this_mo)+"-"+(this_day[1]?this_day:'0'+this_day);
				var inputList = [{
					"prevWord": '{accDataStart}',
					"inputData": {
						"type"       : 'date',
						"name"       : 'accountOpenDate',
						"value"	     : nj.accountOpenDate?newOpenDate:datenow,
						 "checkDemoFunc": ['checkFirstDate',"accountStopDate"]
					},
					"afterWord": ''
				},
				{
					"prevWord": '{accDataEnd}',
					"inputData": {
						"type"       : 'date',
						"name"       : 'accountStopDate',
						"value"	     :  nj.accountStopDate?newStopDate:datenow,
						"checkDemoFunc": ['checkLastDate',"accountOpenDate"]
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
					"prevWord": '{accTime}',
					"inputData": {
						"type"       : 'text',
						"name"       : 'accountEffectTime',
						"value"		 : nj.accountEffectTime || '',
						"checkDemoFunc":["checkInput","num","0","10000000"]
					},
					"afterWord": '{min}'
				}
				];
				var InputGroup = require('InputGroup'),
				$dom = InputGroup.getDom(inputList);
				var _select = "<select style='margin-left:10px;width:78px;' class='u-hide' name='accountEffectTimeUnit'><option value='min' data-local='{min}'>{min}</option></select>";
				$dom.find('input[name="accountEffectTime"]').after($(_select));
				$dom.attr({radioFromName:'billType',radioFromValue:'timeBill'}).addClass('u-hide');
				$domopenbill.append($dom);

				if(nj.billType){
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

				//冻结部分
				var inputList = [
					{
					"prevWord": '{accStatu}',
					"inputData": {
						"type": 'radio',
						"name": 'isOpen',
						"defaultValue": nj.isOpen || 'on',
						"items": [
							{
								"value": 'on',
								"name": '{normal}'
							},
							{
								"value": 'off',
								"name": '{freeze}'
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
				//PPPoE关闭时长计费
				makePPPoEDateBillchange();
				$div.find('[name="authType"]').change(function(){
					makePPPoEDateBillchange();
				});
				function makePPPoEDateBillchange(){
					 var selectval = $div.find('[name="authType"]').val();
					 if(selectval == 'PPPoE'){
					 	$div.find('[name="billType"]').val('dateBill');
					 	$div.find('[name="billType"]').trigger('change');
					 	$div.find('[name="billType"]>[value="timeBill"]').addClass('u-hide');
					 }else{
					 	$div.find('[name="billType"]>[value="timeBill"]').removeClass('u-hide');
					 }
				}
				//
				if(nj.authType){
					$div.find('[radioFromName = "authType"]').addClass('u-hide');
					$div.find('[radioFromValue = "'+nj.authType+'"]').removeClass('u-hide');
				}


				return $div;
			}

		//用户的保存
		function saveUser($modal,thisNode){
			if(require('InputGroup').checkErr($modal) > 0)
			{
				return;
			}
			if($modal.find('[name="parentName"]>option').length <1 )
			{
				var Tips = require('Tips');
				Tips.showWarning('尚未添加组，请到用户管理——>组织架构配置组');
				return;
			}
			// 引入serialize模块
			var Serialize = require('Serialize');
			// 将模态框中的输入转化为
			var queryArr = Serialize.getQueryArrs($modal);
			var queryJson = Serialize.queryArrsToJson(queryArr);
            /*保存之前的name*/
            oldauthAccount = thisNode.name;
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
						thisNode.accountOpenDate =  new Date(thisNode.accountOpenDate.replace(RegExp('/','gm'),'-')+" 00:00:00").getTime()/1000 +28800;
						thisNode.accountStopDate = new Date(thisNode.accountStopDate.replace(RegExp('/','gm'),'-')+" 23:59:59").getTime()/1000 + 28800;
					}else if(thisNode.billType == 'timeBill'){
						thisNode.accountEffectTime = queryJson.accountEffectTime;//账号有效时长
						thisNode.accountEffectTimeUnit = queryJson.accountEffectTimeUnit;//账号有效时长：单位
					}
				}
			}
			thisNode.isOpen = queryJson.isOpen;//用户状态

			//转化格式
			var nodeStr = Serialize.queryJsonToStr(thisNode);
            pppoenameold = 'pppoenameold='+oldauthAccount;
            nodeStr = Serialize.mergeQueryStr([nodeStr, pppoenameold]);

			if(thisNode.authType == "PPPoE"){
	            if(thisNode.authUserLinkType == "IPMac"){
	                thisNode.authIP = queryJson.authIPMac_IP;
	                thisNode.authMac = queryJson.authIPMac_Mac;
            	}
        	}
			var nodeStr = Serialize.queryJsonToStr(thisNode);

			var Tips = require('Tips');
//			console.log(nodeStr);
			//$modal.modal('hide');
//			setTimeout(function(){
//				$modal.remove();
//			},450);
			//修改发送地址
			var _url = '';


			if(thisNode.userType == 'normalUser'){
				if(thisNode.normalUserLinkType == 'IP' || thisNode.normalUserLinkType == 'Mac'){
					_url = 'formEditEntry';
				}else if(thisNode.normalUserLinkType == 'IPMac'){
					_url = '2';
				}
			}else if(thisNode.userType == 'authUser'){
				if(thisNode.authType == 'PPPoE'){
					_url = 'formPppoeUserEdit';
				}else if(thisNode.authType == 'Web'){
					_url = 'formWebAuthConfig';
				}
			}
			$.ajax({
					url: "/goform/"+_url,
					type: 'POST',
					data: nodeStr,
					success: function(result) {
                        console.log(result);
						var doEval = require('Eval');
						var codeStr = result,
							variableArr = ['allDatas','isSuccessful','status','errMsg','errorstr'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
						// 判断代码字符串执行是否成功
						if (isSuccess) {
							var data = result["data"],
								status = data['status'];
							if (status) {
								// 显示成功信息
								Tips.showSuccess(T('saveSuccess'));
								DATA.modalObj.hide();
								$('[href="#2"]').trigger('click');

							} else {
								if(typeof(data["errMsg"]) == 'undefined'){
									Tips.showWarning(data["errorstr"], 2);
								} else {
									Tips.showWarning(data["errMsg"], 2);
								}
							}
						} else {
							Tips.showWarning(T('parseStrErr'), 2);
						}
					}
				});

		}

		//PPPOE的开启与关闭
		function savePPPoEStatus(thisNode){
			var Serialize = require('Serialize');
            /*保存之前的name*/
            oldauthAccount = thisNode.name;
			//转化格式
			thisNode.isOpen = (thisNode.isOpen == 'on') ? 'off' : 'on';//用户状态
			thisNode.PppoeStatus = 'true';
			var nodeStr = Serialize.queryJsonToStr(thisNode);
            var pppoenameold = 'pppoenameold='+oldauthAccount;
            nodeStr = Serialize.mergeQueryStr([nodeStr, pppoenameold]);
			var Tips = require('Tips');
			// 修改发送地址
			var _url = '';


			if(thisNode.userType == 'normalUser'){
				if(thisNode.normalUserLinkType == 'IP' || thisNode.normalUserLinkType == 'Mac'){
					_url = 'formEditEntry';
				}else if(thisNode.normalUserLinkType == 'IPMac'){
					_url = '2';
				}
			}else if(thisNode.userType == 'authUser'){
				if(thisNode.authType == 'PPPoE'){
					_url = 'formPPPoEAccAllow';
				}else if(thisNode.authType == 'Web'){
					_url = '';
				}
			}
			$.ajax({
					url: "/goform/"+_url,
					type: 'POST',
					data: nodeStr,
					success: function(result) {
//                      console.log(result);
						var doEval = require('Eval');
						var codeStr = result,
							variableArr = ['allDatas','isSuccessful','status','errMsg'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
						// 判断代码字符串执行是否成功
						if (isSuccess) {
							var data = result["data"],
								status = data['status'];
							if (status) {
								// 显示成功信息
								if(thisNode.isOpen == 'on'){
									Tips.showSuccess(T('openSuccess'));
								} else {
									Tips.showSuccess(T('closeSuccess'));
								}
								display($('#2'));
								//alert("test2");

							} else {
								if(thisNode.isOpen == 'on'){
									Tips.showWarning(T('openFail'));
								} else {
									Tips.showWarning(T('closeFail'));
								}
							}
						} else {
							Tips.showWarning(T('parseStrErr'), 2);
						}
					}
				});

		}

					//表格部分的删除按钮
			function tableRemoveClick(nodeList){
				var Tips = require('Tips');
				var nameStr = '';

				if(nodeList.length==1){
/*					nameStr = T('confirm')+T('delete')+(nodeList[0].objType==1?T('user'):T('group'))+' : <span style="font-weight:bold">'+nodeList[0].name+'</span> ?';  */
                    nameStr = T('delconfirm');
				}else if(nodeList.length>1){
					nameStr = T('delconfirm');
				}else{
					Tips.showWarning(T('warn_del_choose'),3);
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

					var IPOrMacStr = 'IPOrMac=';
					var IPOrMacCount = 0;

					var IPMacStr = 'IPMac=';
					var IPMacCount = 0;

					var PPPoEStr = 'PPPoE=';
					var PPPoECount = 0;

					var WebStr = 'Web=';
					var WebCount = 0;
					removeNodeArr.forEach(function(obj,i){
						if(obj.objType==1){
							if(obj.userType == 'normalUser'){
								if(obj.normalUserLinkType == 'IP' ||obj.normalUserLinkType == 'Mac'){
									IPOrMacStr+=(obj.id+',');
									IPOrMacCount++;
								}else if(obj.normalUserLinkType == 'IPMac'){
									IPMacStr+=(obj.name+',');
									IPMacCount++;
								}
							}else if(obj.userType == 'authUser'){
								if(obj.authType == 'PPPoE'){
									PPPoEStr +=(obj.instName+',');
									PPPoECount++;
								}else if(obj.authType == 'Web'){
									WebStr +=(obj.instName+',');
									WebCount++;
								}
							}

						}else if(obj.objType==0){
							Gcount++;
							remGroupStr+=(obj.id+',');
						}
					});
					remGroupStr = remGroupStr.substring(0,(remGroupStr.length-1))+"&";
					IPOrMacStr = IPOrMacStr.substring(0,(IPOrMacStr.length-1))+"&";
					IPMacStr = IPMacStr.substring(0,(IPMacStr.length-1))+"&";
					PPPoEStr = PPPoEStr.substring(0,(PPPoEStr.length-1))+"&";
					WebStr = WebStr.substring(0,(WebStr.length-1));

					var removeStr = '';

					if(Gcount == 0)
						remGroupStr ='';
					if(IPOrMacCount == 0)
						IPOrMacStr ='';
					if(IPMacCount == 0)
						IPMacStr ='';
					if(PPPoECount == 0)
						PPPoEStr ='';

					if(WebCount == 0){

						removeStr = remGroupStr+IPOrMacStr+IPMacStr+PPPoEStr;
						if(removeStr != ''){
							removeStr = removeStr.substring(0,(removeStr.length-1));
						}
					}else{
						removeStr = remGroupStr+IPOrMacStr+IPMacStr+PPPoEStr+WebStr;
					}

//					console.log(remoeStr)
					$.ajax({
					url: '/goform/formDelOrganization',
					type: 'POST',
					data: removeStr,
					success: function(result) {
						var doEval = require('Eval');
						var codeStr = result,
							variableArr = ['allDatas','isSuccessful','status','errMsg'],
							result = doEval.doEval(codeStr, variableArr),
							isSuccess = result["isSuccessful"];
						// 判断代码字符串执行是否成功
						if (isSuccess) {
							var data = result["data"],
								status = data['status'];
							if (status) {
								// 显示成功信息
								Tips.showSuccess(T('delSuccess'), 2);
								display($('#2'));

							} else {
								Tips.showWarning(data["errMsg"], 2);
							}
						} else {
							Tips.showWarning(T('delFail'), 2);
						}
					}
				});
				}else{
					Tips.showWarning(T('pleSelectDelUser'),3);
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


	function display($container) {
		//alert("hahah");
		getAccountconf($container);
	}

	// 提供对外接口
	module.exports = {
		display: display
	};
});
