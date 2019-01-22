define(function(require, exports, module) {
	require('jquery');
	/**
	 * 本页面使用的字典
	 * @type {Array}
	 */
	var DicArr = ['common', 'doBehaviorManagement'];
	var DATA = {};
	/**
	 * 用户选中的app id
	 * @type {Array}
	 */
	var selectedAppIds = [];
	/**
	 * 生成整个页面
	 * 根据参数决定显示 表格、添加还是修改，默认显示表格
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $container [description]
	 * @param  {[type]}   type       [description]
	 * @return {[type]}              [description]
	 */
	function display($container, type){
		DATA["conDom"] = $container;
		switch(type){
			case 'table' :
				displayRuleTable($container);
				break;
			case 'edit' :
				displayEdit($container);
				break;
			case 'add' : 
				displayAdd($container);
				break;
			default :
				displayRuleTable($container);
				break;
		}
	}
	/**
	 * 显示 规则 表格
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $container [description]
	 * @return {[type]}              [description]
	 */
	function displayRuleTable($container){
		
		displayTable($container);
	}
	/**
	 * 显示 修改规则
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function displayEdit($btn){
		var $container = DATA["conDom"];
		$container.empty();
//		changePath('{edit}', DicArr);
		var data       = getDataByBtn($btn);
		DATA["bitDef"] = data["bit"];
		DATA["bit"]    = data["bit"];
		var $inputList = showInputGroup($container, data);
		addInputEvents($inputList);
	}
	/**
	 * 修改路径导航的尾部标题
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   pathStr [description]
	 * @return {[type]}           [description]
	 */
	function changePath(pathStr, dicArr){
		var Path = require('Path');
//		Path.changePath(pathStr, dicArr);
	}
	function translate(domArr){
		var Translate = require('Translate');
		Translate.translate(domArr, DicArr);
	}
	/**
	 * 显示 添加规则
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @return {[type]}   [description]
	 */
	function displayAdd(){
		var $container = DATA["conDom"];
		/* 原始bit */
		DATA["bitDef"] = '';
		/* 需要保存的bit */
		DATA["bit"] = '';
		$container.empty();
//		changePath('{add}', DicArr);
		var $inputList = showInputGroup($container);
		addInputEvents($inputList);
	}
	/**
	 * 显示 添加/修改 的输入框组
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $container [description]
	 * @param  {[type]}   data       [description]
	 * @return {[type]}              [description]
	 */
	function showInputGroup($container, data){
		
		$('#checkOpen,.u-onoff-span1').hide();
		var isAdd = (data === undefined);
		data = (data === undefined) ? {} : data; 
		var InputGroup = require('InputGroup');
		var timeItems  = [];
		var timePlans  = DATA["times"] || [];
		timePlans.forEach(function(timePlan){
			timeItems.push({
				name : timePlan,
				value : timePlan
			});
		});
		timeItems.push({
			name : T('{allday}'),
			value : '',
		});

		var applyUser = '';
		var orgType = data['behOrgType'];
		if(orgType == 'ip')
		{
		    applyUser = data['behOrgIp'];
		}
		else if(orgType == 'all'){
		    applyUser = T('{allUser}');
		}else if(orgType == 'org'){
		    applyUser = data['behOrgNames'];
		}else{
		    applyUser = T('{allUser}');
		}
		var inputList = [
			{
				"prevWord"  : '{open}',
				"inputData" : {
					"type"   : 'radio',
					"name"   : 'status',
					"defaultValue"  : data["isOpen"] || '1',
					"items"  : [
						{
							"value" : 1,
							"name"  : T('open'),
						},
						{
							"value" : 0,
							"name"  : T('close'),
						}
					]
				}
			},
			{
				"prevWord"  : '{rule}{name}',
				"necessary" : true,
				"inputData" : {
					"type"   : 'text',
					"name"   : 'ruleName',
					"value"  : data["ruleName"] || '',
					"checkDemoFunc" : ['checkInput', 'name', '1', '31', '2']
				}
			},
			{
				"display"   : false,
				"inputData" : {
					"type" : 'text',
					"name" : 'oldName',
					"value" : data["ruleName"] || ''
				}
			},
			{
				"prevWord"  : '{info}',
				"inputData" : {
					"type"  : 'text',
					"name"  : 'comment',
					"value" : data["comment"] || '',
					"checkDemoFunc" : ['checkInput', 'name', '0', '31', '2']
				}
			},
			{
				"prevWord"  : '{users}',
				"inputData" : {
					"type"  : 'text',
					"name"  : 'users',
					"value" : applyUser
				}
			},
			{
				"prevWord"  : '{app}{server}',
				"necessary" : true,
				"inputData" : {
					"type"  : 'text',
					"name"  : 'servers',
					"value" : data["servers"] || ''
				}
			},
			{
				"prevWord"  : '{effecttime}',
				"inputData" : {
					"type"  : 'select',
					"name"  : 'time',
					"defaultValue" : (data["effecttime"] == '{allday}' ? '' : data["effecttime"]),
					"items"  : timeItems
				}
			}
		];
		var $inputGroupDom = InputGroup.getDom(inputList);
		/*
			显示时间计划的按钮
		 */
		addTimePlanDom($inputGroupDom);
		/*
			显示组织架构
		 */
		addOrganizationDom($inputGroupDom, {
			type : data["behOrgType"],
			data : data["behOrgData"],
			ip   : data["behOrgIp"] || '0.0.0.0-0.0.0.0'
		});
		$container.append($inputGroupDom);
		var BtnGroup = require('BtnGroup');
		var btnList = [
			{
				"id"        : 'save',
				"name"      : '{save}',
				"clickFunc" : function($this){
					/*
						保存用户的设置
					 */
					save($inputGroupDom, isAdd);
				} 
			},
			{
				"id"        : 'reset',
				"name"      : '{reset}',
				"clickFunc" : function($this){
					/*
						将bit 置为初始值
					 */
					DATA["bit"] = DATA["bitDef"];
					DATA["editBit"] = DATA["bitDef"];
					changeAppsInInput(DATA["bit"]);
				} 
			},
			{
				"id"        : 'back',
				"name"      : '{back}',
				"clickFunc" : function($this){
					displayRuleTable(DATA["conDom"]);
				} 
			}
		];
		var $btnList = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.append($btnList);
		translate([$inputGroupDom, $btnList]);
		return $inputGroupDom;
	}
	/**
	 * 保存用户操作
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 * @return {[type]}        [description]
	 */
	function save($dom, isAdd){
		var InputGroup = require('InputGroup');
				var len = InputGroup.checkErr($dom);
				if (len > 0) {
					return;
				}
		var Serialize = require('Serialize');
		var queryArr  = Serialize.getQueryArrs($dom);
		var queryJson = Serialize.queryArrsToJson(queryArr);
		var status    = queryJson["status"],
			ruleName  = queryJson["ruleName"],
			oldName   = queryJson["oldName"],
			comment   = queryJson["comment"],
			orgIp     = queryJson["orgIp"],
			orgData   = queryJson["orgData"],
			orgType   = queryJson["orgType"],
			timePlan  = queryJson["time"];
		var bit       = DATA["bit"];
		if(ruleName == ''){
			var Tips = require('Tips');
			Tips.showWarning(T('{rule}{name}{not}{can}{empty}'));
		}else if(bit == ''){
			var Tips = require('Tips');
			Tips.showWarning(T('{app}{server}{not}{can}{as}{empty}'));
		}else if(bit == '0'){
			var Tips = require('Tips');
			Tips.showWarning(T('{app}{server}{not}{can}{as}{empty}'));
		}else{
			/*
				发送数据
			 */
			var postDataJson = {
				type       : isAdd ? 'add' : 'edit',
				ruleName   : ruleName,
				oldName    : oldName,
				comment    : comment,
				bit        : bit,
				orgType    : orgType,
				orgData    : orgData,
				orgIp      : orgIp,
				effecttime : timePlan,
				status     : status
			};
			editRule(postDataJson);
		}
	}
	function editRule(data){
		console.log(data);
		var Serialize = require('Serialize');
		switch(data["orgType"]){
			case 'all':
				data["orgData"] = '';
				break;
			case 'org':
				break;
			case 'ip':
				data["orgData"] = data["orgIp"];
				break;
			default :
				break;
		}
		if(data["effecttime"] == '{allday}'){
			data["effecttime"] = '';
		}
		var postDataJson = {
			optDpiType   : data["type"],
			ruleName     : data["ruleName"],
			oldName      : data["oldName"],
			comment      : data["comment"],
			appForbidBit : data["bit"],
			dpiOrgType   : data["orgType"],
			dpiOrgData   : data["orgData"],
			effecttime   : data["effecttime"],
			status       : data["status"]
		};
		var postQueryStr = Serialize.queryJsonToStr(postDataJson);
		$.ajax({
			url : 'goform/formAddBehaveManage',
			type : 'POST',
			data : postQueryStr,
			success : function(jsStr){
				var Eval = require('Eval');
				var variables = ['status', 'errorstr'];
				var result = Eval.doEval(jsStr, variables),
					isSuccess = result["isSuccessful"];
				if(isSuccess){
					var data = result["data"],
					    status = data["status"];
					var Tips = require('Tips');
					if(status == '1'){
						Tips.showSuccess('{saveSuccess}');
						displayRuleTable(DATA["conDom"]);
					}else{
						var errorStr = data["errorstr"];
						Tips.showWarning('{saveFail}' + errorStr);
						
					}
				}
			}
		});
	}
	/**
	 * 显示 时间计划的按钮
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 */
	function addTimePlanDom($dom){
		var InputGroup = require('InputGroup');
		var btnList = [
			{
				id :'addTimePlan',
				name:'{add}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').addModal($dom.find('[name="time"]'));
				}
			},
			{
				id :'editTimePlan',
				name:'{edit}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').editModal($dom.find('[name="time"]'));
				}
			}
		];
		InputGroup.insertLink($dom,'time',btnList);
	}
	/**
	 * 添加组织架构
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 */
	function addOrganizationDom($dom, data){
		var orgType = data["type"] || 'all';
		var orgData = data["data"] || '';
		var orgIp   = data["ip"] || '';
		$dom.find('[name="users"]').after('<input type="text" class="u-hide" value="'+orgType+'" name="orgType" />');
		$dom.find('[name="users"]').after('<input type="text" class="u-hide" value="'+orgData+'" name="orgData" />');
		$dom.find('[name="users"]').after('<input type="text" class="u-hide" value="'+orgIp+'" name="orgIp" />');
		$dom.find('[name="users"]').click(function(){
			var datass = {
				//保存回调
				saveClick:function(saveData){
					if (saveData.applyTypeStr == "ip"){
						$dom.find('[name="users"]').val(saveData.ipStr);
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						$dom.find('[name="orgData"]').val('');
						$dom.find('[name="orgIp"]').val(saveData.ipStr);
					}
					else if (saveData.applyTypeStr == "org"){
						$dom.find('[name="users"]').val(saveData.showName);
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						$dom.find('[name="orgData"]').val(saveData.checkIdStr);
						$dom.find('[name="orgIp"]').val('');
					}
					else{
						$dom.find('[name="users"]').val(T('{allUser}'));
						$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
						$dom.find('[name="orgData"]').val('');
						$dom.find('[name="orgIp"]').val('');
					}
					saveData.close();
				},
				checkableStr:$dom.find('[name="orgData"]').val(),//被勾选的id字符串
				ipStr:$dom.find('[name="orgIp"]').val(),//开始结束的ip
				applyTypeStr:$dom.find('[name="orgType"]').val()//单选默认值
			};
			require('P_plugin/Organization').display(datass);
		});
	}
	/**
	 * 给添加/修改页面中输入框添加事件处理
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $inputList [description]
	 */
	function addInputEvents($inputList){
		/*
			给应用服务的输入框添加点击事件
		 */
		addAppServerEvent($inputList);
	}
	/**
	 * 给应用服务的输入框添加点击事件
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $inputList [description]
	 */
	function addAppServerEvent($inputList){
		var $input = $inputList.find('input[name="servers"]');
		$input.click(function(){
			showAppServerModal();
		});
	}
	
	/**
	 * 显示 选择应用的 模态框
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @return {[type]}   [description]
	 */
	function showAppServerModal(){
		var modalObj = getAPPModalObj();
		DATA["appModalObj"] = modalObj;
		var $modal   = modalObj.getDom();
		/*
			获得模态框中选择app的 树状图、搜索等dom
		 */
		var $dom = getSelectAppConDom();
		setTimeout(function(){
			/*
				初始化 选择app 整个dom
				包括 app tree、搜索、当前选中的app列表
			 */
			initSelectAppDom($dom);
		},1);
		modalObj.insert($dom);
		translate([modalObj.getDom()]);
		modalObj.show();
		
	}
	/**
	 * 获得 选择应用 模态框的对象
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @return {[type]}   [description]
	 */
	function getAPPModalObj(){
		var Modal = require('Modal');
		var modalSettings = {
			"id"    : 'appServer',
			"title" : '{select}{app}',
			"size"  : 'large',
			"btns"  : [
				{
					"type" : 'save',
					"clickFunc" : function(){
						/*
							重新计算比特位
						 */
						resetBit();
						DATA["bit"] = DATA["bitEdit"];
						changeAppsInInput(DATA["bit"]);
						DATA["appModalObj"].hide();
					}
				},
				{
					"type" : 'reset',
					"clickFunc": function(){
						DATA["appModalObj"].hide();
						$('.modal-backdrop').remove();
						showAppServerModal();
					}
				},
				{
					"type" : 'close'
				}
			]
		};
		var modalObj = Modal.getModalObj(modalSettings);
		return modalObj;
	}
	function changeAppsInInput(bit){
		var apps = getAppsByBit(bit);
		$('#content').find('input[name="servers"]').attr('value', apps)
	}
	function resetBit(){
	    if(selectedAppIds.length){
		    var bitArr = new Array(Math.max.apply(null, selectedAppIds) + 1);
		    for(var i = 1; i < bitArr.length; i++){
		      	if(selectedAppIds.indexOf(i) != '-1'){
		        	bitArr[i-1] = '1';
		      	}else{
		       		bitArr[i-1] = '0';
		      	}
		    }
		    binaryStr = bitArr.join('');
		    var Funcs = require('P_core/Functions');
		    DATA["bitEdit"] = Funcs.binaryToHexadecimal(binaryStr);
		}else{
			DATA["bitEdit"] = '0';
		}
	}
	/**
	 * 获得选择app的包裹容器
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @return {[type]}   [description]
	 */
	function getSelectAppConDom(){
		var html = '<div class="row">'
					+ '<div id="appTrees" class="col-sm-3 col-xs-3 col-md-3 col-lg-3 " style="max-height:450px;overflow:auto"></div>'
					+ '<div class="col-sm-4 col-xs-4 col-md-4 col-lg-4" style="padding:5px">'
					+ '<input type="text" id="search-text-box"><button id="search" type="button" class="btn btn-primary" style="position:relative;top:-2px;margin-left:5px" data-local="{search}">{search}</button><h4 data-local="{search}{result}">{search}{result}</h4>'
					+ '<div id="appSearchRes" style="max-height:385px;overflow:auto"></div>'
					+ '</div>'
					+ '<div id="appSelect" class="col-sm-5 col-xs-5 col-md-5 col-lg-5"  style="padding:5px"><h4 data-local="{selected}{app}" style="margin-top:0px">{selected}{app}</h4><ul style="max-height:411px;overflow:auto"></ul></div>'
					+ '</div>';
		return $(html);
	}
	/**
	 * 初始化 选择app 整个dom
	 * 包括 app tree、搜索、当前选中的app列表
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   $dom 包裹dom
	 * @return {[type]}        [description]
	 */
	function initSelectAppDom($dom){
		/*
			获得app树状图数据
		 */
		getAppData(function(appData){
			if(appData !== false){
				/**
				 * 显示 选择app 整个dom
	 			 * 包括 app tree、搜索、当前选中的app列表 
				 */
				showSelectAppDom($dom, appData);
			}else{
				console.log('error')
			}
		});
	}
	/**
	 * 获取应用数据，并传递给回调函数
	 * 如果没有获取过，从服务器获取
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	function getAppData(callback){
		selectedAppIds = [];
		callback({
			apps   : cloneArr(DATA["apps"]),
			groups : cloneArr(DATA["groups"]),
			bit    : DATA["bit"]
		});
	}
	/**
	 *  显示 选择app 整个dom
	 *  包括 app tree、搜索、当前选中的app列表
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 * @param  {[type]}   data [description]
	 * @return {[type]}        [description]
	 */
	function showSelectAppDom($dom, data){
		var apps   = data["apps"];
		var bit    = DATA["bit"];
		var groups = data["groups"];
		/*
			根据比特位来给app数据添加选中的状态
		 */
		apps       = checkAppByBit(apps, bit);
		groups     = checkGroupByChildren(groups, apps);
		/*
			初始化 app树状图dom 
		 */
		initAppTreeDom($dom, apps, groups);
		/*
			将已经选择应用显示在右侧
		 */
		showSelectedApps(apps);
		/*
			给树状图添加事件
		 */
		initTreeEvent($dom);
	}
	/**
	 * 根据比特位来确定哪些app是选中的
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   apps [description]
	 * @param  {[type]}   bit  [description]
	 * @return {[type]}        [description]
	 */
	function checkAppByBit(apps, bit){
		if(bit === undefined){
			return apps;
		}
		var Funcs = require('Functions');
		var binaryStr = Funcs.hexadecimalToBinary(bit);
		bitArr = binaryStr.split('');
		apps.forEach(function(app){
			var index = app["id"];
			if(bitArr[index - 1] == 1){
				app["checked"] = true;
			}
		});
		return apps;
	}
	function checkGroupByChildren(groups, apps){
		/*
			已经勾选的第一级组节点
		 */
		var checkedGroups = [];
		apps.forEach(function(app){
			if(app.checked){
				/*
					应用直接所属组的id
				 */
				var parentId = app["gId"];
				checkParentNode(parentId, groups, checkedGroups)
			}
		});
		return groups;
	}
	function checkParentNode(parentId, groups, checkedGroups){
		if(parentId != '0' && checkedGroups.indexOf(parentId) < 0){
			checkedGroups.push(parentId);
			var index = getGroupIndexInGroups(parentId, groups);
			groups[index]["checked"] = true;
			var id = groups[index]["pId"];
			checkParentNode(id, groups, checkedGroups);
		}
	}
	function getGroupIndexInGroups(id, groups){
		var index = null;
		var len = groups.length;
		for(var i = 0; i < len; i++){
			if(id == groups[i]['id']){
				index = i;
				break;
			}
		}
		return index;
	}
	/**
	 * 初始化 app树状图 dom 
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @return {[type]}   [description]
	 */
	function initAppTreeDom($dom, apps, groups){
		/*
			将app和group数据转化为树数据
		 */
		var treeData = appDataToTreeData(apps, groups);
		/*
			将树数据转化为ztree节点数据
		 */
		treeDataToZtreeNodes(treeData);
		/*
			显示树状图
		 */
		showAppTreeDom($dom.find('#appTrees'), treeData);
	}
	/**
	 * 把app和group节点数据转化为树
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   appData [description]
	 * @return {[type]}           [description]
	 */
	function appDataToTreeData(apps, groups){
		var rootNodes = getRootNodes(groups);
		initTreeData(rootNodes, apps, groups);
		return rootNodes;
	}
	/**
	 * 根据父节点和所有节点数据，将子节点插入树中
	 * 并递归调用此方法
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   parentNode [description]
	 * @param  {[type]}   apps       [description]
	 * @param  {[type]}   groups     [description]
	 * @return {[type]}              [description]
	 */
	function initTreeData(parentNodes, apps, groups){
		var thisFunc = arguments.callee;
		if(parentNodes.length > 0){
			parentNodes.forEach(function(parentNode){
				/*
					判断是否是组节点
				 */
				if(parentNode["pId"] !== undefined){
					parentNode["children"] = [];
					parentNode.isParent = true;
					var nodeId = parentNode["id"];
					/*
						从分组列表中找子节点
					 */
					groups.forEach(function(group){
						if(group["pId"] == nodeId){
							parentNode["children"].push(group);
						}
					});
					/*
						从app列表中找子节点
					 */
					apps.forEach(function(app){
						if(app["gId"] == nodeId){
							parentNode["children"].push(app);
						}
					});
					/*
						如果当前节点有子节点
						递归本函数
					 */
					if(parentNode["children"].length > 0){
						thisFunc(parentNode["children"], apps, groups)
					}
				}
			});
		}
	}
	/**
	 * 从分组信息中获取根节点组成的数组
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   datas [description]
	 * @return {[type]}         [description]
	 */
	function getRootNodes(datas){
		var rootNodes = [];
		datas.forEach(function(data){
			if(data["pId"] == '0'){
				rootNodes.push(data);
			}
		});
		return rootNodes;
	}
	/**
	 * 将树的数据转化为ztree节点数据
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   nodes [description]
	 * @return {[type]}         [description]
	 */
	function treeDataToZtreeNodes(nodes){
		var thisFunc = arguments.callee;
		if(nodes.length > 0){
			nodes.forEach(function(node){
				node["name"] = node["n"];
				if(node["children"] !== undefined){
					node["groupId"] = node["id"];
					thisFunc(node["children"]);
				}else{
					node["appId"] = node["id"];
					node["appTag"]= 'app';
				}
			});
		}
	}
	/**
	 * 根据树状图容器和节点数据显示树状图
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   $dom  [description]
	 * @param  {[type]}   nodes [description]
	 * @return {[type]}         [description]
	 */
	function showAppTreeDom($dom, nodes){
		require('P_libs/js/jquery.ztree.all.min.js');
		$dom.addClass('ztree');
		var setting = {
			check : {
				enable : true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			callback : {
				onCheck : function(event, tId, node, flag){
					/*
						节点点击前的状态
					 */
					var checkStatus = !node.checked;
					var appId = node["appId"];
					/*
						点击的是app
					 */
					if(appId !== undefined){
						if(checkStatus){
							removeAppFromOPerateArea(appId)
						}else{
							addAppToOperateArea(appId, true);
						}
					}else{
						var ztreeObj = getZtreeObj();
						var nodes = ztreeObj.getNodesByParam('appTag', 'app', node);
						if(nodes.length > 0){
							var func = function(){};
							if(checkStatus){
								func = removeAppFromOPerateArea;
							}else{
								func = addAppToOperateArea;
							}
							nodes.forEach(function(node){
								var appId = node["appId"];
								func(appId);
							});
						}
					}
				}
			}
		};
		$.fn.zTree.init($dom, setting, nodes);
	}
	/**
	 * 显示所有被选择中的app
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   apps [description]
	 * @return {[type]}        [description]
	 */
	function showSelectedApps(apps){
		DATA.allappjqdom = {};// 清空所有应用预留的jq对象
		if(apps.length > 0){
			var treeObj = getZtreeObj();
			var $oldul = DATA["appModalObj"].getDom().find('#appSelect ul');
			var $newul = $oldul.clone(true);
			apps.forEach(function(app){
				/* 原新增方法
				if(app.checked){
					addAppToOperateArea(app["id"], true);
				}
				*/
				
				
				/* 现直接加载之初将所有应用加在右侧 */
//				var node    = treeObj.getNodesByParam("appId", parseInt(app["id"]), null)[0];
				var html = '<li class="utt-inline-block border-green border-4 P-5 P-T-0 P-B-0 M-2">'
						+ '<span >{appName}</span>'
						+ '<span data-app-id="{appId}" class="glyphicon glyphicon-remove-circle u-app-item-remove-circle"></span>'
						+ '</li>';
				html     = html.replace(/{appId}/, app["id"]);
				html     = html.replace(/{appName}/,app["name"]);
				var $html = $(html);
				$newul.append($html);
				
				if(!app.checked){
					$html.addClass('u-hide');
				}else{
					selectedAppIds.push(app["id"])
				}
				/* 将生成的jq对象直接加入json 方便搜索 */
				DATA.allappjqdom[app["id"]] = $html;
			});
			$oldul.after($newul);
			$oldul.remove();
		}
	}
	/**
	 * 为选择app 模态框添加点击事件
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $dom [description]
	 * @return {[type]}        [description]
	 */
	function initTreeEvent($dom){
		$dom.click(function(ev){
			var ev      = ev || window.event,
				target  = ev.target || ev.srcElement,
				$target = $(target);
			if($target.attr('id') == 'search'){
				/*
					添加搜索事件
				 */
				handleSearchEvent($target);
			}else if($target.attr('data-type') == "res-item"){
				/*
					将应用添加到 选中区域
					并改变勾选状态
				 */
				var appId   = $target.attr('data-app-id');
				addAppToOperateArea(appId);
				checkNode(appId, true);
				/*
				$target.css({transition:'all 0.2s ease-in'});
				$target.css({opacity:0});
				setTimeout(function(){
					$target.css({overflow:'hidden',width:'0px',height:'0px',margin:'0 0',padding:'0 0'});
					setTimeout(function(){
						$target.remove();
					},200);
					
				},200);
				*/
				$target.addClass('u-app-pro-search-items-checked');
			}else if($target.hasClass('glyphicon-remove-circle')){
				/*
					将应用从 选中区域移除 
					并改变勾选状态
				 */
				var appId   = $target.attr('data-app-id');
				checkNode(appId, false);
				/*
				$target.parent().css({transition:'all 0.2s ease-in'});
				$target.parent().css({opacity:0});
				setTimeout(function(){
					$target.parent().css({overflow:'hidden',width:'0px',height:'0px',margin:'0 0',padding:'0 0'});
					setTimeout(function(){
						$target.parent().addClass('u-hide');
					},200);
					
				},200);
				*/
				$target.parent().addClass('u-hide');
				DATA["appModalObj"].getDom().find('#appSearchRes').find('li[data-app-id="'+appId+'"]').removeClass('u-app-pro-search-items-checked');
				removeAppId(appId);
				
			}
			
			
		});
		
		$dom.find('#search-text-box').keyup(function(event){
			if(event.keyCode == 13){
				$dom.find('#search').trigger('click');
			}
		});
	}
	/**
	 * 获得ztree 对象
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @return {[type]}   [description]
	 */
	function getZtreeObj(){
		var treeObj = $.fn.zTree.getZTreeObj("appTrees");
		return treeObj;
	}
	/**
	 * 修改节点勾选状态
	 * @author JeremyZhang
	 * @date   2016-11-29
	 * @param  {[type]}   appId [description]
	 * @param  {[type]}   type  [description]
	 * @return {[type]}         [description]
	 */
	function checkNode(appId, type){
		var treeObj  = getZtreeObj();
		var node     = treeObj.getNodesByParam("appId", parseInt(appId), null)[0];
		type         = (type === true) ? true : false;
		node.checked = type;
		treeObj.checkNode(node,type,true);
	}
	/**
	 * 将一个app添加到 选中区域
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   appId [description]
	 * @param  {[type]}   type  [description]
	 */
	function addAppToOperateArea(appId){
		/*
		var treeObj = getZtreeObj();
		var node    = treeObj.getNodesByParam("appId", parseInt(appId), null)[0];
		if(selectedAppIds.indexOf(parseInt(appId)) < 0){
			selectedAppIds.push(parseInt(appId));
			var html = '<li class="utt-inline-block border-green border-4 P-5 P-T-0 P-B-0 M-2">'
					+ '<span >{appName}</span>'
					+ '<span data-app-id="{appId}" class="glyphicon glyphicon-remove-circle u-app-item-remove-circle"></span>'
					+ '</li>';
			html     = html.replace(/{appId}/, appId);
			html     = html.replace(/{appName}/, node["name"]);
			DATA["appModalObj"].getDom().find('#appSelect ul').append(html);
		}
		*/
		if(selectedAppIds.indexOf(parseInt(appId)) < 0){
			selectedAppIds.push(parseInt(appId));
//			DATA["appModalObj"].getDom().find('span[data-app-id="'+appId+'"]').parent().removeClass('u-hide');
			DATA.allappjqdom[appId].removeClass('u-hide');
			DATA["appModalObj"].getDom().find('#appSearchRes').find('li[data-app-id="'+appId+'"]').addClass('u-app-pro-search-items-checked');
		}
		
	}
	function removeAppId(appId){
		for(var i = 0; i < selectedAppIds.length; i++){
			if(selectedAppIds[i] == appId){
				selectedAppIds.splice(i, 1);
			}
		}
	}
	function clearSelectedApps(){
		DATA["appModalObj"].getDom().find('#appSelect ul').empty();
	}
	/**
	 * 将一个app 从选中区域移除
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   appId [description]
	 * @return {[type]}         [description]
	 */
	function removeAppFromOPerateArea(appId){
		removeAppId(appId);
		/* 原删除方法
		var $lis = DATA["appModalObj"].getDom().find('#appSelect ul').children();
		if($lis.length > 0){
			$lis.each(function(){
				if($(this).find('span:last').attr('data-app-id') == appId){
					$(this).remove();
				}
			})
		}
		*/
//		DATA["appModalObj"].getDom().find('span[data-app-id="'+appId+'"]').parent().addClass('u-hide');
		DATA.allappjqdom[appId].addClass('u-hide');
		DATA["appModalObj"].getDom().find('#appSearchRes').find('li[data-app-id="'+appId+'"]').removeClass('u-app-pro-search-items-checked');
	}
	/**
	 * 处理搜索
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function handleSearchEvent($btn){
		var text    = $btn.prev('input').val();
		var treeObj = getZtreeObj();
		var nodes   = treeObj.getNodesByParamFuzzy("name", text, null);
		showSearchResult(nodes, $btn.parent().find('#appSearchRes'));
	}
	/**
	 * 显示搜索app的结果
	 * @author JeremyZhang
	 * @date   2016-12-22
	 * @param  {[type]}   nodes [description]
	 * @param  {[type]}   $dom  [description]
	 * @return {[type]}         [description]
	 */
	function showSearchResult(nodes, $dom){
		if(nodes.length > 0){
			var results = [];
			nodes.forEach(function(node){
				var appId = node["appId"];
				if(appId !== undefined){
					var obj = {
						appId : appId,
						appName : node["name"]
					}
					results.push(obj);
				}
			});
			var item = '<li data-type="res-item"  class="u-app-pro-search-items" data-app-id="{appId}" data-app-name="{appName}">{appName}</li>';
			var $ul  = $('<ul></ul>');
			results.forEach(function(result){
				var i = item.replace(/{appId}/, result["appId"])
							   .replace(/{appName}/g, result["appName"]);
				var $i = $(i);
				if(DATA.allappjqdom[result["appId"]].is(':visible')){
					$i.addClass('u-app-pro-search-items-checked');
				}
				$ul.append($i);
			});
			$dom.empty().append($ul);
		}
	}
	/**
	 * 生成具体的表格
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $tableConDom [description]
	 * @return {[type]}                [description]
	 */
	function displayTable($container){
		/*
			接口的url地址
		 */
		var url = 'common.asp?optType=dpiBehaveMan|timePlan';
		var Async = require('P_core/Async');
		Async.async([url], function(jsStr){
			if(jsStr !== false){
				/*
					处理js字符串并返回数据库引用
				 */
				var database  = getDBFromJsStr(jsStr);
				/*
					将数据库引用存入DATA变量
				 */
				DATA["db"]    = database;
				/*
					获取表格dom
				 */
				var $tableDom = getTableDom(database);
				/*
					将包裹容器清空
					并把表格放入
		 		 */
		//		changePath('');
				/*
					生成表格容器
				 */
				var $tableConDom = getTableConDom();
				
		 		$tableConDom.empty().append($tableDom);
		 		$container.empty().append($tableConDom);
		 			/* 加入右上角小开关*/
		 		displayOnOff();	
			}else{
				console.log('js error');
			}
		});
			/* 右上角小开关*/
	function displayOnOff(){
		var OnOff = require('P_plugin/OnOff');
	    var $onoff = OnOff.getDom({
	        prevWord:T('BehaviorManagement')+' :',
	        afterWord:'',
	        id:'checkOpen',
	        defaultType:DATA["gloen"] == 1?true:false,
	        clickFunc:function($btn,typeAfterClick){
				var BehGloEn = (typeAfterClick == 1?'on':'off');
				var postQueryStr = 'BehGloEn='+ BehGloEn + '&type=beh';
				console.log(postQueryStr);
				$.ajax({
				url : 'goform/formBehAndAppGloSetting',
				type : 'POST',
				data : postQueryStr,
				success : function(jsStr){
					var Eval = require('Eval');
					var variables = ['status', 'errorstr'];
					var result = Eval.doEval(jsStr, variables),
						isSuccess = result["isSuccessful"];
					if(isSuccess){
						var data = result["data"],
							status = data["status"];
						var Tips = require('Tips');
						if(status == 1){
							Tips.showSuccess('{saveSuccess}');
							$('.nav a[href="#1"]').trigger('click');
						}else{
							var errorStr = data["errorstr"];
							Tips.showWarning('{saveFail}' + errorStr);
							
						}
					}
				}
				});
	            //alert(typeAfterClick);
	        }
	    });
	    OnOff.joinTab($onoff);
	}
	}
	function getAppsByBit(bit){
		var apps   = DATA["apps"],
			groups = DATA["groups"];
		var Funcs = require('Functions');
		var binaryArr = ('0' + Funcs.hexadecimalToBinary(bit)).split('');
		var appArr = [];
		for(var index = 1, len = binaryArr.length; index < len; index++){
			if(binaryArr[index] == '1'){
				apps.forEach(function(app){
					if(app.id == index){
						appArr.push(app.n);
					}
				})
			}
		}
//		if(appArr.length > 3){
//			return appArr.slice(0, 3).join(', ') + '...';
//		}else{
			return appArr.join(', ');
//		}
	}
	function getServerUser(rule){
		var orgType = rule["behOrgType"],
			orgNames = rule["orgNames"],
			orgIP   = rule["behOrgIp"];
		var serverUser = '';
		switch(orgType){
			case 'all':
				serverUser = '{allUser}';
				break;
			case 'org':
				serverUser = orgNames;
				break;
			case 'ip':
				serverUser = orgIP;
				break;
			default :
				serverUser = '{allUser}';
		}
		return serverUser;
	}
	/**
	 * 处理js字符串,并存入数据表,并返回数据库引用
	 * @author JeremyZhang
	 * @date   2016-11-23
	 * @param  {[type]}   jsStr [description]
	 * @return {[type]}         [description]
	 */
	function getDBFromJsStr(jsStr){
		var Eval = require('Eval');
		var variables = ['allDatas', 'appData', 'groupData', 'timeRangeNames','gloen'];
		var result    = Eval.doEval(jsStr, variables),
			isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data     = result["data"],
				ruleData = data["allDatas"],
				apps     = data["appData"],
				groups   = data["groupData"],
				gloen    = data["gloen"],
				times    = data["timeRangeNames"];
			DATA["apps"] = apps;
			DATA["groups"] = groups; 
			DATA["gloen"] = gloen;
			DATA["times"] = times;
			var arrData = [];
			ruleData.forEach(function(rule, index){
				arrData.push([
					index + 1,
					rule["id"],
					rule["status"],
					rule["ruleName"],
					rule["comment"],
					rule["behOrgType"],
					getServerUser(rule),
					rule["appForbidBit"],
					getAppsByBit(rule["appForbidBit"]),
					(rule["effecttime"] === '' ? '{allday}' : rule["effecttime"]),
					rule["orgData"],
					rule["behOrgIp"],
					rule["orgNames"]
				]);
			})
			/*
				引入数据库模块
				并创建一个新的数据表
			 */
			var Database = require('Database');
			var database = Database.getDatabaseObj();
			/*
				声明数据表的字段
				将数据存入数据表
			 */
			var fields   = ['id', 'ruleID', 'isOpen', 'ruleName', 'comment', 
						'behOrgType', 'serverUser','bit', 'servers', 'effecttime', 'behOrgData', 'behOrgIp', 'behOrgNames'];
			database.addTitle(fields);
			database.addData(arrData);
			return database;
		}else{
			return false;
		}
	}
	/**
	 * 获得表格dom
	 * @author JeremyZhang
	 * @date   2016-11-23
	 * @param  {[type]}   database [description]
	 * @return {[type]}            [description]
	 */
	function getTableDom(database){
		$('#checkOpen,.u-onoff-span1').hide();
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id"        : "add",
				"name"      : "{add}",
				"clickFunc" : function(){
					displayAdd();
				}
			}, 
			{
				"id"        : "delete",
				"name"      : "{delete}",
				"clickFunc" : function(){
					deleteAllBtnClick();
				}
			}
		];
		// 表格上方操作区域配置数据
		var tableHeadData = {
			"btns"     : btnList
		};
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : true,       // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"ID" : {
					"key"    : 'id',
					"type"   : 'text'
				},
				"{rule}{name}" : {
					"key"    : "ruleName",
					"type"   : "text"
				},
				"{status}" : {
					"key"    : "isOpen",
					"type"   : "checkbox",
					"values" : {
						'1' : true,
						'0' : false
					},
					clickFunc : function($checkbox){
						handleStatusCheckboxClick($checkbox);
					}
				},
				"{users}" : {
					"key" : "serverUser",
					"type" : 'text',
					"maxLength" : 31
				},
				"{app}{server}" : {
					"key" : "servers",
					"type": 'text',
					"maxLength":10
				},
				"{effecttime}" : {
					"key" : "effecttime",
					"type" : "text"
				},
				"{remark}" : {
					"key"    : "comment",
					"type"   : "text"
				},
				"{edit}": {
					"type": "btns",
					"btns": [
						{
							"type"      : "edit",
							"clickFunc" : function($this){
								displayEdit($this);
							}
						},
						{
							"type"      : "delete",
							"clickFunc" : function($this){
								deleteBtnClick($this);
							}
						}
					]
				}
			},
			"dicArr"      : DicArr
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				head  : tableHeadData,
				table : tableSettings
			}),
			tableDom  = tableObj.getDom();
		/*
			将表格对象存入全局变量
		 */
		DATA["tableObj"] = tableObj;
		return tableDom;
	}
	/**
	 * 根据主键从数据表中提取一条数据
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   primaryKey [description]
	 * @return {[type]}              [description]
	 */
	function getDataByPrimaryKey(primaryKey){
		var database   = DATA["db"];
		var data       = database.getSelect({
			primaryKey : primaryKey
		})[0];
		return data;
	}
	/**
	 * 从表格中操作按钮中获得主键，并提取数据
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function getDataByBtn($btn){
		var primaryKey = $btn.attr('data-primaryKey');
		var data       = getDataByPrimaryKey(primaryKey);
		return data;
	}
	/**
	 * 处理表格中开启按钮的点击事件
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   $checkbox [description]
	 * @return {[type]}             [description]
	 */
	function handleStatusCheckboxClick($checkbox){
		var data = getDataByBtn($checkbox);
		changeStatus(data);
	}
	/**
	 * 修改一条规则的状态
	 * @author JeremyZhang
	 * @date   2016-11-28
	 * @param  {[type]}   data [description]
	 * @return {[type]}        [description]
	 */
	function changeStatus(data){
		/*
			修改状态
		 */
		var postDataJson = {
			type : 'edit',
			ruleName   : data["ruleName"],
			oldName    : data["ruleName"],
			comment    : data["comment"],
			bit        : data["bit"],
			orgType    : data["behOrgType"],
			orgData    : data["behOrgData"],
			orgIp      : data["behOrgIp"],
			effecttime : data["effecttime"],
			status     : data["isOpen"] == '1' ? '0' : '1'
		};
		editRule(postDataJson);
	}
	/**
	 * 表格上方删除按钮点击事件
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @return {[type]}   [description]
	 */
	function deleteAllBtnClick(){
		var tableObj        = DATA["tableObj"];
		// 获得到了所有选中的输入框所在行数据的主键 组成的数组
		var primaryKeyArr   = tableObj.getSelectInputKey('data-primaryKey');
		if(primaryKeyArr.length > 0){
			var Tips        = require('Tips');
			Tips.showConfirm(T('{confirm}{delete}?'), function(){
				var ruleNames     = [];
				primaryKeyArr.forEach(function(primaryKey){
					var data    = getDataByPrimaryKey(primaryKey);
					var ruleName  = data["ruleName"];
					ruleNames.push(ruleName);
				});
				deleteRules(ruleNames);
			}, function(){

			}, []);
		}else{
			var Tips = require('Tips');
			Tips.showWarning(T('{unSelectDelTarget}'));
		}

	}
	/**
	 * 每一行数据中的删除按钮点击事件
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @param  {[type]}   $btn [description]
	 * @return {[type]}        [description]
	 */
	function deleteBtnClick($btn){
		var Tips = require('Tips');
		Tips.showConfirm(T('{confirm}{delete}?'), function(){
			var data    = getDataByBtn($btn);
			var ruleName  = data['ruleName'];
			deleteRules([ruleName]);
		},function(){

		}, [])
	}
	/**
	 * 删除规则
	 * 向后台发送数据，并使用 showDeleteRes 函数处理删除的结果
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @param  {[type]}   ruleIDs [description]
	 * @return {[type]}           [description]
	 */
	function deleteRules(ruleNames){
		var queryStr = 'ruleName=' + ruleNames.join(',');
		queryStr = queryStr + '&deltype=beh';
		$.ajax({
			url     : 'goform/formDelBehaveManage',
			type    : 'POST',
			data    : queryStr,
			success : function(jsStr){
				showDeleteRes(jsStr);
			}
		});
	}
	/**
	 * 处理删除是否成功还是失败
	 * @author JeremyZhang
	 * @date   2016-11-25
	 * @param  {[type]}   jsStr [description]
	 * @return {[type]}         [description]
	 */
	function showDeleteRes(jsStr){
		var Eval      = require('Eval');
		var Tips      = require('Tips');
		var variables = ["status",'errorstr'];
		var result    = Eval.doEval(jsStr, variables),
			isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data   = result["data"],
				status = data["status"];
			if(status == '1'){
				Tips.showSuccess('{delSuccess}');
				displayRuleTable(DATA["conDom"]);
			}else{
				var errorStr = data["errorstr"];
				Tips.showWarning('{delFail}' + errorStr);
			}
		}
		
	}
	function cloneArr(arr){
		var Func = require('P_core/Functions');
		return Func.cloneArr(arr);
	}
	/**
	 * 获得表格包裹容器的dom
	 * @date   2016-11-23
	 * @return {[type]}   [description]
	 */
	function getTableConDom(){
		var TableContainer = require('P_template/common/TableContainer');
		var html           = TableContainer.getHTML({}),
			$tableCon      = $(html);
		return $tableCon;
	}
	function T(str){
		var Translate = require('Translate');
		var s = Translate.getValue(str, DicArr);
		return s
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
