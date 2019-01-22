define(function(require, exports, module){
	require('jquery');

    var Translate  = require('Translate');
    var dicArr     = ['common','doPeopleOrganize'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	
	var DATA = {};
	
	function display(data){
		var dics = ['doPeopleOrganize'];
		Translate.preLoadDics(dics, function(){
			var otherData = getDatas(data); //获得数据及配置信息
			showModal(otherData);	    //制作弹框
		});
	}
	/**
	 * 获取数据
	 * 1、配置信息
	 * 2、后台数据
	 */
	function getDatas(demoData){
		
			//获取数据
			var allDatas = [];
			$.ajax({
				url : 'common.asp?optType=Organization',
				type: 'GET',
				async: false,
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
					variableArr = ['allDatas'];
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
					//console.log(result);
						if(isSuccess){
							var data = result["data"];
							allDatas = data["allDatas"];
						}else{
							alert(T('parseStrErr'));
						}
				}
			});
			
			//已被勾选的id
			var checkableStr = demoData.checkableStr || "";
			var checkableArr = demoData.checkableStr == ""?[]:checkableStr.split(',');
			
			//起始结束ip
			var starip = '';
			var endip = '';
			if(demoData.ipStr.length>0){
				starip = demoData.ipStr.split('-')[0];
				endip = demoData.ipStr.split('-')[1];
			}
			  
			
			//treeplus配置参数
			var treeplusSetting = {
				showType	: 1,	//暂时只有两种状态：0:可编辑（组织成员）	,1:可勾选（行为管理中选择指定用户时）
				treeSetting	:{	//树参数配置
								treeId : 'newTree', 	//树的id	:String，默认为空
								rootId : '-1',			//简单格式下的root的父id
								lastGroupId : '1',		//临时用户的id
								showUser : true,		//树中是否显示用户
								treeClick : function(ev,tid,tnod){	//树的点击回调事件:Function(event,treeId,treeNode)，默认为空
//									alert(tnod.name)
									DATA['Zobj'].changeFocus(tnod);	//根据传回的参数改变表格和小数据库的内容
								    DATA['Zobj'].refreshTable();	//刷新表格
								},
								checkClick : function(ev,tid,tnod){	//树的勾选事件
									
									DATA['Zobj'].changeCheck();
									DATA['Zobj'].changeFocus(tnod);	//根据传回的参数改变表格和小数据库的内容
									DATA['Zobj'].refreshTable();
									
								},
								checkableArr : checkableArr || []			//已被勾选的id数组
							},
				tableSetting:{	//表参数配置
								pnameArr : [['ID','idIndex'],
											['{username}','name'],
											['{baseGrp}','parentGroupName'],
											['{authType}','authType'],
		    								['{authAcc}','authAccount'],
		    								/* ['{status}','state'], */
											['{ip}','normalIP'],
											['{MACAddr}','normalMac'],
			    							['{bindType}','bindType'],
			    							['{abstract}','abstract'],
											['{info}','note']],	//显示的名称及对应的属性名[['用户名','name'],['IP掩码','IPSec']……]
								
							}
			};
			
		//配置信息
		var data = {
			list      : allDatas,
			setting   : treeplusSetting,
//			checkableArr : checkableArr,
			saveClick : demoData.saveClick,
			starip:starip,
			endip:endip,
			applyTypeStr:demoData.applyTypeStr

		};
		return data;
	}

	function checkMostNode(node) {
		var rtNode = node.getParentNode();
		if (rtNode) {
			if (rtNode.checked && !rtNode.getCheckStatus().half) {
				return false;

			}
			else {
				return checkMostNode(rtNode);
			}
		}
		return true;
	}
	
	function showModal(data){
		//制作弹框
		var modallist = {
			id	 :'modal-applyUser',
			title:'{orgRefer}',
			"size" : "large1" ,//normal、large :普通宽度、加大宽度
	        "btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                    // $this 代表这个按钮的jQuery对象，一般不会用到
	                    var $modal = $this.parents('.modal');

	                    /* 检查错误 */
	                	if (require('InputGroup').checkErr($modal) > 0)
	                    	return;
          
	                    var showName = '';
	                    
	                    //获取ip字符串
	                    var ipStrs = $modal.find('[name="starip"]').val()+"-"+$modal.find('[name="endip"]').val();
	                    //获取单选列的点击情况
	                    var applyTypeStr = $modal.find('[name="applyType"]:checked').val();
	                    var checkIdStr = '';
	                    //alert(applyTypeStr);
	                    if (applyTypeStr == 'org'){
	                    	var newCheckNodes = [];
	                    	var firstShowName = 1;
	                    	var objName = '';
	                    	//获得已被勾选的对象数组
	                    	var saveCheckNodes=  $.fn.zTree.getZTreeObj(data.setting.treeSetting.treeId).getCheckedNodes(true);
	                    	//去除半勾选状态的对象
	                    	saveCheckNodes.forEach(function(obj){
	                    		if(!obj.getCheckStatus().half && obj.pid != 1){
	                    			if (checkMostNode(obj)){
	                    				newCheckNodes.push(obj);
	                    				if (firstShowName == 1) {
	                    					firstShowName = 0;
	                    				}
	                    				else {
	                    					showName = showName + ',';
	                    				}
	                    				if (obj.objType == 0) {
	                    					objName = obj.name.substring(1,obj.name.length-1); 
	                    				} else{
	                    					objName = obj.name;
	                    				}
	                    				//alert(objName);
	                    				showName = showName + objName;
	                    			}
	                    		}
	                    	});
	                    	//组成id字符串
	                    	
	                    	newCheckNodes.forEach(function(obj){
	                    		checkIdStr += (obj.id+",");
	                    	});

	                    	if (checkIdStr == '')
	                    	{
	                    		require('Tips').showWarning('数据不能为空');
	                    		return ;
	                    	}
	                    	//alert(checkIdStr);
	                    }

	                    //返回数据
	                    var saveData = {
	                    	checkIdStr:checkIdStr.substr(0,checkIdStr.length-1),
	                    	ipStr:ipStrs,
	                    	applyTypeStr:applyTypeStr,
	                    	showName:showName,
	                    	close:function(){
	                    		DATA['modalObj'].hide();
	                    	}
	                    };
	                   	data.saveClick(saveData);
	                }
	            },
	            {
	                "type"      : 'reset',
	                clickFunc:function($this){
	                	setTimeout(function(){
	                		if(DATA['modalObj'].getDom().find('[name="applyType"]:checked').val() != 'org'){
	                			var treedom = $.fn.zTree.getZTreeObj(data.setting.treeSetting.treeId);
	                			treedom.checkAllNodes(false);
	                		}else{
	                			DATA['Zobj'].nodeListFilter();
	                			DATA['Zobj'].reordOpenType();
	                			DATA['Zobj'].refreshTree(true);
	                			DATA['Zobj'].refreshTable();
	                		}
	                		
	                	},100)
	                
	                	
	                }
	            },
	            {
	                "type"      : 'close'
	            }
	        ]
		};
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(modallist);
		DATA['modalObj']=modalObj;
		function make(){
			
		}
		//制作内部
		var inputlist = [
			{
			    "inputData": {
			        "type"         : 'radio',
			        "name"         : 'applyType',
			        "defaultValue" : data.applyTypeStr||'all', 
		            "type"         : 'radio',
		            "items": [{
		                "value": 'all',
		                "name": '{typeAll}'
		            }, {
		                "value": 'org',
		                "name": '{typeOrg}'
		            }, {
		                "value": 'ip',
		                "name": '{typeIp}'
		            }]
		        }
			}
		];
		
		var InputGroup = require('InputGroup');
		var $dom = InputGroup.getDom(inputlist);
		
		// 组织架构部分
		var Zp = require('P_template/common/ZtreePlus');
		var Zpobj = Zp.getTreePlusObj(data.setting,data.list);
		DATA['Zobj'] = Zpobj;
		var ztreeplus$dom = Zpobj.get$Dom();
		ztreeplus$dom.attr('democontrol','org');
		// 添加跳转到组织架构页面的链接
		var $linkToOrg = $('<a data-local="{linkToOrg}" class="u-inputLink" style="opacity:0.5;float:right">{linkToOrg}</a>');
		$linkToOrg.hover(function(){
			$(this).css('opacity','1');
		},function(){
			$(this).css('opacity','0.5');
		})
		$linkToOrg.click(function(){
			modalObj.hide();
			$('#sidebar').find('a[href="#/user_management/organize_member"]').parent().trigger('click');
			$('#sidebar').find('a[href="#/user_management/organize_member"]').parent().parent().prev().trigger('click');
		});
		ztreeplus$dom.find('.u-treeSet .nav.nav-tabs').append($linkToOrg);
		
		
		// IP部分
		var iptr = '<div democontrol="ip" style="position:relative">'+T('typeIp')+'： <input type="text" name="starip" value="'+data.starip+'"/> ~ <input type="text" name="endip" value="'+data.endip+'"/> ('+T('warn_ip')+')</div>'
		
		
		
		
		// 获取插入表单的弹框
		modalObj.insert($dom);
		modalObj.insert(ztreeplus$dom);
		modalObj.insert(iptr);
		
		var $modal = modalObj.getDom();

		$modal.find('[name = "starip"]').checkdemofunc("checkInput","ip","1");

		$modal.find('[name = "endip"]').checkdemofunc("checkInput","ip","1","gt","starip");
		
		$modal.find('.modal-footer').css({clear:'both'});
		$modal.find('.modal-body').css({paddingLeft:'25px',paddingTop:'5px',minHeight:'150px'});
		$modal.find('[name = "applyType"]').parent().css({paddingBottom:'18px'});
		
		$modal.find('[name = "applyType"]').click(function(){
			makeTheControlChange();
		});
		makeTheControlChange();
		function makeTheControlChange(){
			var $t = $modal.find('[name = "applyType"]:checked');
			$modal.find('[democontrol]').addClass('u-hide');
			$modal.find('[democontrol="'+$t.val()+'"]').removeClass('u-hide');
			setTimeout(function(){
				Zpobj.resizeDouble();
			},100)
		}

	   	var tranDomArr = [$modal];
	    Translate.translate(tranDomArr, dicArr);

		modalObj.show();
		
		
		
	}
	
	module.exports = {
		display : display
	};
});
