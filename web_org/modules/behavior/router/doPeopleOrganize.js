define(function(require, exports, module){
    require('jquery');
	var DATA = {};
    var Translate  = require('Translate');
    var dicArr     = ['common','doPeopleOrganize'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}

    exports.display = function(){
	var dics = ['doPeopleOrganize'];
	Translate.preLoadDics(dics, doPeopleOrganizeDisplay);
    }

    function doPeopleOrganizeDisplay(){

	// 加载路径导航
	var Path = require('Path');
	var pathList =
	{
	    "prevTitle" : T('userManagement'),
	    "links"     : [
	    {"link" : '#/user_management/organize_member', "title" : T('organization')}
	    ],
	    "currentTitle" : ''
	};
	Path.displayPath(pathList);


	//获取数据
	var allDatas = [];
		$.ajax({
			url : 'common.asp?optType=Organization',
			type: 'GET',
			async: false,
			success : function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['allDatas','smaxconv','maxDepth'];
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
				//console.log(result);
					if(isSuccess){
						var data = result["data"];
						allDatas = data["allDatas"];
						DATA.maxDepth = data.maxDepth;
                        DATA.smaxconv = data["smaxconv"];
					}else{
						alert(T('parseStrErr'));
					}
			}
		});

	    //配置数据阶段加载提示组件
	    var Tips = require('Tips');
	//treeplus配置参数
	var treeplusSetting = {
		    showType	: 0,	//暂时只有两种状态：0:可编辑（组织成员）	,1:可勾选（行为管理中选择指定用户时）
		    authType	:['ppoe，web'],
		    treeSetting	:{	//树参数配置
				treeId : 'newTree', 	//树的id	:String，默认为空
				rootId : '-1',			//简单格式下的root的父id
				lastGroupId : '1',		//临时用户的id
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
				removeClick : function(tid,tnod){	// 删除组回调
				    removeGroupUser([tnod]);
				},
				deepLevel:(DATA.maxDepth === undefined?5:DATA.maxDepth)   /*深度*/
		    },
		    tableSetting:{
		    	// 表参数配置
				pnameArr : [['ID','idIndex'],
				['{username}','name'],
				['{baseGrp}','parentGroupName'],
				['{authType}','authType'],
				    ['{authAcc}','authAccount'],
				    ['{status}','isOpen'],
					['{ip}','normalIP'],
					['{MACAddr}','normalMac'],
					    ['{bindType}','bindType'],
					    ['{abstract}','abstract'],
						['{info}','note']],	// 显示的名称及对应的属性名[['用户名','name'],['IP掩码','IPSec']……]
					// 新增
				addClick :  function(focusNode){
					var focusNodeId = (focusNode.pid ==treeplusSetting.treeSetting.rootId?'':focusNode.id);
				    addUserModal({optType:'add'},focusNodeId);
				},
					// 小编辑
				editClick : function(_node){
				    if(_node.objType == 1){
					_node.optType = 'edit';
					editUserModal(_node);
				    }else if(_node.objType == 0){
					editModal(_node);
				    }
		
				},
				    // 全局删除
				allRemoveClick : function(nodeList){
		
				    tableRemoveClick(nodeList);
				},
				    // 小删除
				removeClick : function(nodeList){
				    tableRemoveClick(nodeList);
		
				},
				    // 移动到
				moveUserClick : function(nodeList){
				    makeMoveUserModal(nodeList);
				},
				    // 导入
				downloadClick : function(){
				    makedownloadModal();
				},
					//导出
				outloadClick  : function($btn){
					var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
					$btn.after($afterdom);
					$afterdom[0].action ="/goform/formExportOrgMem";
					$afterdom[0].submit();
				},
					//状态复选框点击 (1、复选框$对象,2、primary-key,3、对应的组织架构对象JSON,4、现在的勾选状态“true/false”)
				isOpenClick :function($btn,prmyKey,thisData,isChecked){
					savePPPoEStatus(thisData);
				},
				    //扫描
				allScanClick : function(allDatas){
					makeScanModal(allDatas);
				}
		    }
	};
	// 将树和表添加到组织架构
	var Zp = require('P_template/common/ZtreePlus');
	var Zpobj = Zp.getTreePlusObj(treeplusSetting,allDatas);
	var ztreeplus$dom = Zpobj.get$Dom();
	$('#content').empty().append(ztreeplus$dom);


	/*
	 * 事件绑定
	 */


	// 树的点击事件
	function clickTree(_node){
	    Zpobj.changeFocus(_node);	// 根据传回的参数改变表格和小数据库的内容
	    Zpobj.refreshTable();	// 刷 新表格
	    changeNodeChangeBtns(_node,$('#content')); // 点击树切换按钮显示
	}
	
	/* 点击不同树对象按钮的切换 */
	function changeNodeChangeBtns(_node,$con){
		 /* 点击临时用户及其组时，切换按钮的显示  */
	   var $c = $con,
	       $adduser = $c.find('#addUser').parent(),
	       $del = $c.find('#deleteAll').parent(),
	       $move = $c.find('#moveUserTo').parent(),
	       $down = $c.find('#download').parent(),
	       $out = $c.find('#outload').parent(),
	       $scan = $c.find('#allScan').parent();
	   if(_node.id === treeplusSetting.treeSetting.lastGroupId){
	   		/*临时用户或临时组时  （移动到、扫描）*/
	   		$adduser.remove();
	   		$del.remove();
	   		$down.remove();
	   		$out.remove();
			
	   		
	   		
	   }else if(_node.id === '0'){
	  	 	/*root组时  （移动到、扫描）*/
	   		$del.remove();
	   		$move.remove();
	  	 	
	   }else{
	   }
	}
	

	//PPPOE的开启与关闭
	function savePPPoEStatus(thisNode){
		var Serialize = require('Serialize');
        /*保存之前的name*/
        oldauthAccount = thisNode.name;
		//转化格式
		//（在传进来之前在Ztreeplus已经对对象的isOpen属性进行了改变）
		//thisNode.isOpen = (thisNode.isOpen == 'on') ? 'off' : 'on';//用户状态
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
							//display($('#2'));
							//alert("test2");
							//刷新树


							Zpobj.reordOpenType();
							Zpobj.modifyList(data["allDatas"]);
							Zpobj.refreshTree();

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

	//新增组弹框调用入口
	function addModal(_node){
	    var childNode = {
		pid:_node.id,
		optType:'add'
	    };
	    //弹框配置
	    var modalList = {
		"id": "modal-addGroup",
		"title": _node.name+" {add}{childgroup}",
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
		"prevWord": '{group}{name}',
		"inputData": {
		    "type": 'text',
		    "name": 'name',
		    "value": null,
		    "checkDemoFunc":["checkInput","name","1","31", "5"]
		},
		"afterWord": ''
	    },{
		"prevWord": '{info}',
		"inputData": {
		    "type": 'text',
		    "name": 'note',
		    "value": null,
            "checkDemoFunc":["checkInput","name","0","31", "2"]
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
		"title": _node.name+" {edit}",
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
		"prevWord": '{group}{name}',
		"inputData": {
		    "type": 'text',
		    "name": 'name',
		    "value": _node.name,
		    "checkDemoFunc":["checkInput","name","1","31", "5"]
		},
		"afterWord": ''
	    }];
	    //根据类型做出修改
	    if(_node.editType == 1){
		inputList.push({
		    "prevWord": '{info}',
		    "inputData": {
			"type": 'text',
			"name": 'note',
			"value": _node.note,
            "checkDemoFunc":["checkInput","name","0","31", "2"]
		    },
		    "afterWord": ''
		});
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
	    DATA['modalForNow'] = modaobj;
	    //获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(i);
	    //添加到指定位置
	    $modal.find('.modal-body').empty().append($dom);
	    $('body').append($modal);
	    modaobj.show();

	   	var tranDomArr = [$modal];
	    Translate.translate(tranDomArr, dicArr);

	}
	//表格部分的删除按钮
	function tableRemoveClick(nodeList){
	    var Tips = require('Tips');
	    var nameStr = '';

	    if(nodeList.length==1){
	/*	nameStr = T('confirm')+T('delete')+(nodeList[0].objType==1?T('user'):T('group'))+' : <span style="font-weight:bold">'+nodeList[0].name+'</span> ？';*/
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
	//
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

		//console.log(removeStr)
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
				} else {
				    Tips.showError(data["errMsg"]);
				}
				//刷新树
				Zpobj.reordOpenType();
				Zpobj.modifyList(data["allDatas"]);
				Zpobj.refreshTree();
			    } else {
				Tips.showError(T('parseStrErr'));
			    }
			}
		    });
	    }else{
		Tips.showError(T('warn_del_choose'));
	    }

	}

	//导入弹框
	function makedownloadModal(){
		var modaobjs = '';

	    var modalList = {
		"id": "",
		"size":'normal',
		"title": "{import}",
		"btns" : [
		{
		    "type"      : 'save',
		    "clickFunc" : function($this){
			// $this 代表这个按钮的jQuery对象，一般不会用到
			var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
			/*
			if(/.*[\u4e00-\u9fa5 ]+.*$/.test(thisfilename)) {
			    require('Tips').showWarning('{fileNameCanBeChineseOrSpace}');
			    return false;
			}
			*/
			var dom = $this.parents('.modal').find('#chooseFileHide')[0];
			var files = dom.files[0];
			var name = files.name;
			var lasttname = name.substr(name.lastIndexOf('.')+1);
			if(lasttname != 'csv')
			{
				require('Tips').showWarning('{importfileerror}');
				return false;
			}
			if($dom.find('[name="fileSrc"]').val()=='') {
			    require('Tips').showWarning('{nofileInput}');
			    return false;
			}
			var $modal = $this.parents('.modal');
			var formData1 = new FormData($modal.find('#fileform')[0]);
		     $.ajax({
		          url: 'goform/formUploadOrgMember',
		          type: 'POST',
		          data: formData1,
		          async: false,
		          cache: false,
		          contentType: false,
		          processData: false,
		          success: function (returndata) {
		          	eval(returndata);
		          	if(status == 1){
		          		Tips.showSuccess('{importSuccess}');
		          		modaobjs.hide();
						Zpobj.reordOpenType();
						Zpobj.modifyList(allDatas);
						Zpobj.refreshTree();
		          	}else{
				    if(error_flag == 1){
		          		Tips.showError(errMsg);
				    }
				    else if(error_flag == 2){
					Tips.showError(error_line + '{line_data_error}'+errMsg);
				    }
	          		modaobjs.hide();
					Zpobj.reordOpenType();
					Zpobj.modifyList(allDatas);
					Zpobj.refreshTree();
		          	}

		          }
		     });
		    }
		},
			{
			"type"      : 'close'
		    }
		]
	    };
	    var inputList = [
	    {
		"prevWord": '{warn_file_choose}',
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
			"name":'{download_model}',
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
	    modaobjs = modaobj;
	    //获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    //添加到指定位置
	    $modal.find('.modal-body').empty().append($dom);
	    var btnslist = [
		    {
				"name":'{warn_file_choose}',
				"id":'chooseFile',
				"clickFunc":function($this){
				}
		    }
	    ];
	    InputGroup.insertBtn($dom,'fileSrc',btnslist);
	    var $flie = $('<input type="file" id="chooseFileHide" name="filename" style="display:none"/>');
	    $dom.append($flie);
	    $dom.find('#chooseFile').click(function(){
			$flie.click();
	    });
	    $flie.change(function(){
			$dom.find('[name="fileSrc"]').val($(this).val());
	    });
	    $dom.wrap('<form id="fileform"></form>');

	    $dom.find("#downloadLink").click(function(){
			var $btn=$(this);
			if($btn.next().attr('name') == 'Device_Config'){
				$btn.next().remove();
			}
			var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
			$btn.after($afterdom);
			$afterdom[0].action ="/goform/formExportOrgTemplate";
			$afterdom[0].submit();
		})
		modaobj.show();
		var $notespan = $('<div></div>')
	    				.css({fontWeight:'bold',wordBreak:'normal',whiteSpace:'normal',padding:'10px',backgroundColor:'#eeeeee',marginTop:'10px'})
        				.append(T('importNoteWords'));
        modaobj.insert($notespan);	
		
	   	var tranDomArr = [$modal];
	    Translate.translate(tranDomArr, dicArr);


	}
	//移动用户到弹框
	function makeMoveUserModal(nodeList){
	    var Tips = require('Tips');
	    if(nodeList.length>0){
		var modalList = {
		    "id": "",
		    "size":'normal',
		    "title": "{warn_move}",
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
		    "prevWord": '{warn_move_confirm}',
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
		Tips.showInfo('{warn_move_choose}');
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
		Tips.showInfo(T('warn_move1'),3);
	    }else{
		//将改变组的用户拼接成字符串

		var IPOrMacStr = 'IPOrMac=';
		var IPOrMacCount = 0;

		var IPMacStr = 'IPMac=';
		var IPMacCount = 0;

		var PPPoEStr = 'PPPoE=';
		var PPPoECount = 0;

		var WebStr = 'Web=';
		var WebCount = 0;

		_node.forEach(function(obj){
		    if(obj.userType == 'normalUser'){
				if(obj.normalUserLinkType == 'IP' ||obj.normalUserLinkType == 'Mac'){
				    IPOrMacStr+=(obj.id+',');
				    IPOrMacCount++;
				}else if(obj.normalUserLinkType == 'IPMac'){
				    IPMacStr+=(obj.id+',');
				    IPMacCount++;
				}
		    }else if(obj.userType == 'authUser'){
				if(obj.authType == 'PPPoE'){
				    PPPoEStr +=(obj.id+',');
				    PPPoECount++;
				}else if(obj.authType == 'Web'){
				    WebStr +=(obj.id+',');
				    WebCount++;
				}
		    }
		});
		IPOrMacStr = IPOrMacStr.substring(0,(IPOrMacStr.length-1))+"&";
		IPMacStr = IPMacStr.substring(0,(IPMacStr.length-1))+"&";
		PPPoEStr = PPPoEStr.substring(0,(PPPoEStr.length-1))+"&";
		WebStr = WebStr.substring(0,(WebStr.length-1));

		var dataStr = 'pid='+queryJson.moveUserTo+'&';

		if(IPOrMacCount == 0)
		    IPOrMacStr ='';
		if(IPMacCount == 0)
		    IPMacStr ='';
		if(PPPoECount == 0)
		    PPPoEStr ='';
		if(WebCount == 0)
		    WebStr = '';

		if(WebCount == 0){
		    dataStr += (IPOrMacStr+IPMacStr+PPPoEStr);
		    if(dataStr != ''){
			dataStr = dataStr.substring(0,(dataStr.length-1));
		    }
		}else{
		    dataStr += (IPOrMacStr+IPMacStr+PPPoEStr+WebStr);
		}
		var dataurl = '/goform/formRemoveUser';
		/* 临时用户的移动 */
		if(_node[0].pid == treeplusSetting.treeSetting.lastGroupId){
			dataStr += "&data=";
			_node.forEach(function(tempObj){
				console.log(tempObj);
				dataStr += tempObj.normalIP+' '+tempObj.normalMac+';';
			});
			dataStr = dataStr.substr(0,dataStr.length-1);
			dataurl = '/goform/formAddReadArp_mul';
		}
		
		
		console.log(dataStr);
		$.ajax({
		    type:'post',
		    url:dataurl,
		    data:dataStr,
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
				Tips.showSuccess('{saveSuccess}');
				DATA['modalForNow'].hide();
				//刷新树
				Zpobj.reordOpenType();
				Zpobj.modifyList(data["allDatas"]);
				Zpobj.refreshTree();

			    } else {
				Tips.showError(T(data["errMsg"]));
			    }
			} else {
			    Tips.showError(T('parseStrErr'));
			}
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
	    var Tips = require('Tips');

        if(require('InputGroup').checkErr($modal) > 0)
        {
            return;
        }

	    //根据表格内容修改部分属性
	    if(queryJson.name)
		_node.name = queryJson.name;
		_node.note = queryJson.note;
	    //				console.log(_node);
	    //alert(_node);
	    //转化格式
	    _node.name = _node.name.replace(/\+/g, "%2B");
	    var nodeStr = Serialize.queryJsonToStr(_node);
	    //向后台发送数据
	    $.ajax({
		url: '/goform/formEditGroup',
		type: 'POST',
		data: nodeStr,
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
			    Tips.showSuccess(T('saveSuccess'), 2);
			    DATA['modalForNow'].hide();
			    //刷新树
			    Zpobj.reordOpenType();
			    Zpobj.modifyList(data["allDatas"]);
			    Zpobj.refreshTree();

			} else {
			    Tips.showError(data["errMsg"]);
			}
		    } else {
			Tips.showError(T('parseStrErr'));
		    }
		}
	    });
	}

	//新增用户弹框
	function addUserModal(thisNode,focusNodeId){
	    var modalList = {
		"id": "modal-addUser",
		"title": "{add}{user}",
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

	    showUserModal(modalList,focusNodeId);
	}

	//编辑用户弹框
	function editUserModal(thisNode){
	    var modalList = {
		"id": "modal-editUser",
		"title": "{edit}{user}",
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

	    showUserModal(modalList,'',thisNode);
	}

	function showUserModal(modalList,focusNodeId,thisNode){
	    //获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    DATA['modalForNow'] = modaobj;

	    var nodeJson = {pid:focusNodeId};
	    DATA.addUserModalType = 'add';
	    //查看是否为编辑状态
	    if(thisNode !== undefined){
		nodeJson = thisNode;
		DATA.addUserModalType = 'edit';
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

	    });

	    //展示弹框
	    $('body').append($modal);
	    modaobj.show();

	   	var tranDomArr = [$modal];
	    Translate.translate(tranDomArr, dicArr);

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
	    if (itemsArr.length == 0) {
	    	itemsArr.push({'value':'0','name': '{no}'});
	    }
	    var type = DATA.addUserModalType;
	    var inputList = [
	    {
		"necessary" : true,
		"prevWord": '{username}',
		"inputData": {
		    "type": 'text',
		    "name": 'name',
		    "value": nj.name || '',
		    "checkDemoFunc":["checkInput","name","1","31", "5"]
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
		"prevWord": '{userType}',
		"disabled": (type == 'edit'?true:false),
		"inputData": {
		    "type": 'radio',
		    "name": 'userType',
		    "defaultValue": nj.userType || 'normalUser',
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
	    var $div = $('<div radioFromName="userType" radioFromValue="normalUser" class=""></div>');
 		var type = DATA.addUserModalType;
	    //获得个普通用户部分的输入组对象
	    var inputList = [{
		"prevWord": '{bindType}',
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
			"name": 'MAC'+'{bind}'
		    },{
			"value": 'IPMac',
			"name": 'IP/MAC'+'{bind}'
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
	    if(type == 'edit'){
	    	if($dom.find('[name="normalUserLinkType"]:checked').val() == 'IPMac'){
	    		$dom.find('[name="normalUserLinkType"][value="IP"],[name="normalUserLinkType"][value="Mac"]').attr('disabled','disabled');
	    	}else{
	    		$dom.find('[name="normalUserLinkType"][value="IPMac"]').attr('disabled','disabled');
	    	}
	    }

	    $div.append($dom);

	    //IP
	    var inputList = [{
		"prevWord": '',
		"inputData": {
		    "type"       : 'textarea',
		    "name"       : 'normalIP',
		    "value"      : nj.normalIP || '',
		    "checkFuncs" : ['checkIpRangeGroup']
		},
		"afterWord": ''
	    }];
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    //修改textarea的默认值
	    //				$dom.find('[name="normalIP"]').val('aaa\nadfasdf');


	    $dom.attr({radioFromName:'normalUserLinkType',radioFromValue:'IP'});
	    var spans = '<span class="u-prompt-word" data-local="">'+T('bindInfo')+'</span><br><span class="u-prompt-word" data-local>196.196.201.201</span><br><span class="u-prompt-word" data-local>196.196.201.201-200.200.201.222</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">清空列表</a>';
	    $dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);

	    $div.append($dom);

	    //Mac
	    var inputList = [{
		"prevWord": '',
		"inputData": {
		    "type"       : 'textarea',
		    "name"       : 'normalMac',
		    "value"		 : nj.normalMac || '',
		    "checkFuncs" : ['checkMacGroup']
		},
		"afterWord": ''
	    }];
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);

	    $dom.attr({radioFromName:'normalUserLinkType',radioFromValue:'Mac'}).addClass('u-hide');
	    var spans = '<span class="u-prompt-word" data-local="">'+T('bindInfo')+'</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:55</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:56</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">'+T('clear_table')+'</a>';
	    $dom.find('td:last-child').css({verticalAlign: "top"}).append(spans);

	    $div.append($dom);


	    //IPMac
	    var inputList = [{
		"prevWord": 'IP',
		"necessary":true,
		"inputData": {
		    "type"       : 'text',
		    "name"       : 'normalIPMac_IP',
		    "value"		 : nj.normalIPMac_IP || '',
		    "checkFuncs" : ['checkIP']
		},
		"afterWord": ''
	    },{
		"prevWord": 'Mac',
		"necessary":true,
		"inputData": {
		    "type"       : 'text',
		    "name"       : 'normalIPMac_Mac',
		    "value"		 : nj.normalIPMac_Mac || '',
		    "checkFuncs" : ['checkMac']
		},
		"afterWord": ''
	    }];
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    $dom.attr({radioFromName:'normalUserLinkType',radioFromValue:'IPMac'}).addClass('u-hide');
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
		 var type = DATA.addUserModalType;
	    //获得认证用户开始部分
	    var inputList = [{
		"prevWord": '{authType}',
		"disabled": (type == 'edit'?true:false),
		"inputData": {
		    "type": 'select',
		    "name": 'authType',
		    "defaultValue":nj.authType||'IP',
		    "items":Zpobj.authTypeArr
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
		    "eye" : true,
		    "value":nj.authPassword|| '',
            "checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
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
		"necessary": true,
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
	    var spans = '<span class="u-prompt-word" data-local="">'+T('bindInfo')+'</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:55</span><br><span class="u-prompt-word" data-local>00:11:22:33:44:56</span><a class="u-inputLink clear-textarea" style="position:absolute;bottom:0px;left:0px;">'+T('clear_table')+'</a>';
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

	    //alert(nj.billType);
	    var inputList = [{
		"prevWord": '{crgType}',
		"inputData": {
		    "type"       : 'select',
		    "name"       : 'billType',
		    "defaultValue" : nj.billType || 'dateBill',
		    "items" :[
		    {
			"name": '{crgData}',
			"value":'dateBill'
		    },
		    {
			"name": '{crgTime}',
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

		var Stop_date = new Date((nj.accountStopDate-28800)*1000);
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
		    "value"	 :  nj.accountOpenDate?newOpenDate:datenow,
		    "checkDemoFunc": ['checkFirstDate','accountStopDate']
		},
		"afterWord": ''
	    },
	    {
		"prevWord": '{accDataEnd}',
		"inputData": {
		    "type"       : 'date',
		    "name"       : 'accountStopDate',
		    "value"	 : nj.accountStopDate?newStopDate:datenow,
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
		var _select = "<select style='margin-left:10px;width:78px;'  class='u-hide' name='accountEffectTimeUnit'><option value='min' data-local=T('min')>"+T('min')+"</option></select>";
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

	    //是否开启计费部分
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
			"name": T('normal')
		    },
		    {
			"value": 'off',
			"name": T('freeze')
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
	    //一部分新增的修改
	    $div.find('[radiofromname="authUserLinkType"]').wrap('<div radiofromname="authType" radioFromValue="PPPoE"></div>')
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

        if(require('InputGroup').checkErr($modal) > 0)
        {
            return;
        }

		var OldNode = {};
		for(var i in thisNode){
			OldNode[i] = thisNode[i];
		}
		
      /*保存之前的name*/
      oldName = thisNode.name;
      oldauthAccount = thisNode.authAccount;
	    //根据表格内容修改部分属性
	    thisNode.name = queryJson.name;    //用户名
	    thisNode.pid = queryJson.parentName;    //父id
	    thisNode.userType = queryJson.userType;     //用户类型
	    if (!thisNode.pid || thisNode.pid <= 0)
	    {
		Tips.showError("{gotoUserMgmtCreate}");
		return ;
	    }
	    if(thisNode.userType == 'normalUser'){
		thisNode.normalUserLinkType = queryJson.normalUserLinkType;   //绑定方法
		if(thisNode.normalUserLinkType == 'IP'){
		    thisNode.normalIP = clearNullLine(queryJson.normalIP);
		    
		    
		    
		}else if(thisNode.normalUserLinkType == 'Mac'){
		    thisNode.normalMac = clearNullLine(queryJson.normalMac);
		}else if(thisNode.normalUserLinkType == 'IPMac'){
		    thisNode.IP = queryJson.normalIPMac_IP;
		    thisNode.Mac = queryJson.normalIPMac_Mac;
		    thisNode.Action = thisNode.optType;
		    thisNode.UserName = queryJson.name;
		    thisNode.UserNameold = oldName;
		}
	    }else if(thisNode.userType == 'authUser'){
		thisNode.authType = queryJson.authType;   //认证方式
		thisNode.authAccount = queryJson.authAccount;    //认证账号
		thisNode.authPassword = queryJson.authPassword;   //认证密码
		thisNode.concurrency = queryJson.concurrency;    //并发数
		thisNode.authUserLinkType = queryJson.authUserLinkType;   //绑定方式
		if(thisNode.authUserLinkType == 'no'){
		    thisNode.authNo = queryJson.authNo;
		}else if(thisNode.authUserLinkType == 'IP'){
		    thisNode.authIP = queryJson.authIP;
		}else if(thisNode.authUserLinkType == 'Mac'){
		    thisNode.authMac = clearNullLine(queryJson.authMac);
		}else if(thisNode.authUserLinkType == 'IPMac'){
		    thisNode.authIPMac = queryJson.authIPMac;
		}
		thisNode.accountBill = queryJson.accountBill;   //账号计费
		if(thisNode.accountBill =='on'){
		    thisNode.billType = queryJson.billType;   //计费方式
		    if(thisNode.billType == 'dateBill'){
			thisNode.accountOpenDate = queryJson.accountOpenDate;   //账号开通日期
			thisNode.accountStopDate = queryJson.accountStopDate;   //账号停用日期
			thisNode.accountOpenDate =  new Date(thisNode.accountOpenDate.replace(RegExp('/','gm'),'-')+" 00:00:00").getTime()/1000 +28800;
			thisNode.accountStopDate = new Date(thisNode.accountStopDate.replace(RegExp('/','gm'),'-')+" 23:59:59").getTime()/1000+28800;
		    }else if(thisNode.billType == 'timeBill'){
			thisNode.accountEffectTime = queryJson.accountEffectTime;   //账号有效时长
			thisNode.accountEffectTimeUnit = queryJson.accountEffectTimeUnit;   //账号有效时长：单位
		    }
		}
	    }
	    thisNode.isOpen = queryJson.isOpen;   //用户状态

	    //转化格式
        thisNode.name = thisNode.name.replace(/\+/g, "%2B");
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
	    //console.log(nodeStr);

	    //修改发送地址
	    var _url = '';

	    if(thisNode.userType == 'normalUser'){
		if(thisNode.normalUserLinkType == 'IP' || thisNode.normalUserLinkType == 'Mac'){
		    _url = 'formEditEntry';
		}else if(thisNode.normalUserLinkType == 'IPMac'){
		    if(thisNode.Action == 'add'){
			_url = 'formAddReadArp';
		    }
		    else{
			_url = 'formArpBindConfig';
		    }
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
			    var doEval = require('Eval');
			    var codeStr = result,
			    variableArr = ['allDatas','isSuccessful','status','errMsg','errorstr'],
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
			    // 判断代码字符串执行是否成功
			    if (isSuccess) {
					var data = result["data"],
					    status = data['status'];
					if (status == '1') {
					    // 显示成功信息
					    Tips.showSuccess(T('saveSuccess'), 2);
					    DATA['modalForNow'].hide();
					    //刷新树
					    Zpobj.reordOpenType();
					    Zpobj.modifyList(data["allDatas"]);
					    Zpobj.refreshTree();
		
					} else {
						if(typeof(data["errMsg"]) == 'undefined'){
							Tips.showWarning(data["errorstr"]);
						} else {
							Tips.showWarning(data["errMsg"]);
						}
						for(var i in OldNode){
							thisNode[i] = OldNode[i];
						}
					}
			    } else {
					Tips.showWarning(T('parseStrErr'));
					for(var i in OldNode){
						thisNode[i] = OldNode[i];
					}
			    }
			}
	    });

	}

	// 去除数据里的空行
	function clearNullLine(texts){
		var arr = texts.split('\n');
		var newarr = [];
		arr.forEach(function(str,i){
			if(str.toString() !== ''){
				newarr.push(str)
			}
		});
		return newarr.join('\n');
	}

		// 扫描Mac弹框制作(扫描Mac类型,点击的超链接对象)
		function makeScanModal(allDatas){
		    var modalList = {
			"id": "modal-scan",
			"size":'large',
			"title": T('scan'),
			"btns":[]
		    };

		    var Modal = require('Modal');
		    var modaobj = Modal.getModalObj(modalList);
			DATA.scanModal = modaobj;
			// 扫描栏
			var $top_elms = $("<div id='topelms'></div>");
			var $top_span = $("<span data-local=''>"+T('scan_ip')+"：</span>");
//			var $top_select = $("<select id='segment'><option value=''>"+T('no')+"</option></select>");
			var $top_select = $("<input type='text' id='segment' value='' />");
			var $top_btn = $("<button data-local='' class='btn btn-primary' style='margin-left:5px;position:relative;top:-2px'>"+T('scan')+"</button>");
			$top_elms.append($top_span,$top_select,$top_btn);
			$top_elms.css({position:'absolute',right:'11px',top:'24px'});
			modaobj.insert($top_elms);
			// 表格外框
			var TableContainer = require('P_template/common/TableContainer');
			var conhtml = TableContainer.getHTML({}),
				$tableCon = $(conhtml).css({minHeight:'200px'});
			modaobj.insert($tableCon);

			// 绑定栏
			var $btm_elms = $("<div id='bottomelms'></div>");
			var $btm_span = $("<span data-local=''>"+T('band_to')+" : </span>");
			var $btm_select = $("<select id='scan_to_group'></select>");
			var $btm_btn = $("<button data-local='' class='btn btn-primary' style='margin-left:5px;position:relative;top:-2px'>"+T('confirm')+"</button>");
			$btm_elms.append($btm_span,$btm_select,$btm_btn);
			$btm_elms.css({float:'right',position:'relative',top:'17px'});
			modaobj.insert($btm_elms);

			/* 调整样式 */

			modaobj.getDom().find('.modal-footer').remove();
			modaobj.getDom().find('.modal-body').css({
				padding		 : '19px 10px',
				paddingBottom: '60px'
			}).find('.table-container').css({
				paddingRight: '0px'
			});

			/* 绑定检测方法 */
			$top_select.checkfuncs('checkIP');

			/* 获取内容 */
			$.ajax({
				url:'common.asp?optType=arp_bind',
				type:'get',
				success:function(result){
					eval(result);
					console.log(result)
					if(i_old_ip){
//						DATA.ioldip = i_old_ip;   //扫描ip [0]
						DATA.totalrecs = totalrecs;  // 已绑定的数量
						DATA.maxtotalrecs = maxtotalrecs; // 最大绑定数
						//生成网段
						var segmentItems = [];
						$top_select.prop('defaultValue',i_old_ip[0]);
					}
				}
			});


			//生成表格
			// makeScanMidTable($tableCon,modaobj);

			//生成组
			var rootid = '0';
		 	var groupItems = [];//组对象数组
		 	var counts = 0;
		 	searchingGroup(rootid,counts);
		 	function searchingGroup(id,counts){
		 		allDatas.forEach(function(obj,i){
			 		if(obj.objType == 0 && obj.pid == id){
			 			var thisid = obj.id;
			 			var thisname = '';
			 			for(var ic = 0;ic<counts;ic++){
			 				thisname += '-';
			 			}
			 			thisname += obj.name;
			 			groupItems.push(/*{name:thisname,value:thisid}*/'<option value="'+thisid+'">'+thisname+'</option>');
			 			var newCounts = counts+1;
			 			searchingGroup(thisid,newCounts);
			 		}
			 	});
		 	};
		 	if(groupItems.length <1){
		 		groupItems = '<option value="">'+T('no_group')+'</option>';
		 		$btm_select.attr('disabled','disabled');
		 	}
		 	$btm_select.append(groupItems);


			var tranDomArr = [modaobj.getDom()];
		   	var dicArr = ['common'];
		    Translate.translate(tranDomArr, dicArr);

		    modaobj.show();

		    //事件绑定
		    var Tips = require('Tips');
		    	// 扫描
		    $top_btn.click(function(){
		    	if(require('InputGroup').checkErr($top_select.parent()) > 0){

		    	}else{
		    		// 获取ip段
			    	var segment = $top_select.val();
			    	makeScanMidTable($tableCon,modaobj,segment,allDatas);
		    	}

		    });
		    	// 绑定到组确认
			$btm_btn.click(function(){
				if($btm_select.val() !== ''){
					var pkArr = DATA['scanTableObj'].getSelectInputKey('data-primaryKey');
					if(pkArr.length<1){
		    			Tips.showInfo('{Select_the_object_you_bind}');
		    		}else{
		    			var objDataArr = [];
		    			pkArr.forEach(function(keyobj){
		    				var thisData = DATA['scanDatabase'].getSelect({primaryKey : keyobj})[0];
		    				objDataArr.push(thisData);
		    			});
		    			console.log(objDataArr);
						var dataStr = 'data=';
						objDataArr.forEach(function(obj){
							dataStr += obj.ip+" " + obj.mac + ";";
						});
						dataStr = dataStr.substr(0,dataStr.length-1);
						dataStr += "&pid="+$btm_select.val();
						console.log(dataStr);
						$.ajax({
							url     : '/goform/formAddReadArp_mul',
							type    : 'POST',
							data    : dataStr,
							success : function(result){
								eval(result);
								console.log(result);
								if(status){
									Tips.showSuccess('{saveSuccess}');
									Zpobj.reordOpenType();
								    Zpobj.modifyList(allDatas);
								    Zpobj.refreshTree();
									DATA.scanModal.hide();
								}else{
									Tips.showWarning('{saveFail}' + errMsg);
								}

							}
						});



		    		}
				}
		    });


		}

		//生成扫描表格
		/**
		 *
		 * @param 表格外框 $tableCon
		 * @param 表格对象 modaobj
		 */
		function makeScanMidTable($tableCon,modaobj,segment,allDatas){
			var scantip = require('Tips').showTimer(T('scanning')+'...',20);
			//获取网段
			if(segment){
				$.ajax({
					type:"post",
					url:"goform/formReadArp",
					data:'ipAddr='+segment,
					success:function(result){
						console.log(result);
						var Eval = require('Eval');
						var variables = ['scanNet','status'];
						var res = Eval.doEval(result,variables);
						if(res.isSuccessful){
							var datas = res.data;
							var scanNet = datas.scanNet;
							console.log(scanNet);
							$.ajax({
								type:"get",
								url:"common.asp?optType=arp_bind&scanNet="+scanNet,
								success:function(result){
									var Eval = require('Eval');
									var variables = ['Datas'];
									var res = Eval.doEval(result,variables);
									console.log(res);
									if(res.isSuccessful){
										var datas = res.data;
										var Datas = datas.Datas;
										// 获取数据并存入临时数据库
										var Database = require('Database');
										var database = Database.getDatabaseObj();
										var titleArr = ['id','ip', 'mac','pid','isband'];
										var dataArr = [];
										Datas.forEach(function(obj,i){
											var littleArr = [];
											littleArr.push(Number(i)+1);
											littleArr.push(obj.ip);
											littleArr.push(obj.mac);
											littleArr.push(obj.pid);
											littleArr.push(obj.isband);
											dataArr.push(littleArr);
										});
										database.addTitle(titleArr);
										database.addData(dataArr);
										DATA['scanDatabase'] = database;
										//表格生成
										var Table = require('Table');
										var tableList = {
												"database": database,
												"isSelectAll" : true,
												"dicArr" : ['common'],
												"titles": {
													"ID": {
														"key" : "id",
														"type": "text"
													},
													"{typeIp}": {
														"key" : "ip",
														"type": "text",
													},
													"{MACAddr}": {
														"key" : "mac",
														"type": "text"
													},
													"{baseGrp}": {
														"key" : "pid",
														"type": "text",
														"filter":function(str){
															for(var ind in allDatas){
																if((allDatas[ind].id == str && str != '0') || allDatas[ind].id == '1'){
																	return allDatas[ind].name;
																}
															}
															var tempname = '';
															for(var ind in allDatas){
																if(allDatas[ind].id == '1'){
																	tempname =  allDatas[ind].name;
																	return tempname;
																}
															}
															return tempname;
														}
													},
													"{already_bind}": {
														"key" : "isband",
														"type": "text",
														"values":{
															'true':'{already_bind}',
															'false':'{no_bind}'
														}
													}
												}
											};
											var list = {
												head: {btns:[]},
												table: tableList
											};
											var tableObj = Table.getTableObj(list);
											DATA['scanTableObj'] = tableObj;
											var $table = tableObj.getDom();
											Translate.translate([$table], dicArr);
											// 去除已绑定对象的复选框
											$table.find('input[data-table-type="select"]').each(function(){
												var $t= $(this);
												var thisData = DATA['scanDatabase'].getSelect({primaryKey : $t.attr('data-primaryKey')})[0];
												console.log(thisData.isband)
												if(thisData.isband == 'true'){
													$t.remove();
												}
											});
											
											$tableCon.empty().append($table);
											scantip.stop(true);
											$table.find('#pagination').css({
												textAlign	 : 'center'
											});
									}else{
										console.log('{parseStrErr}');
									}
								}
							});
						}else{
							console.log('{parseStrErr}');
						}
					}
				});
			}
		}

    }
});
