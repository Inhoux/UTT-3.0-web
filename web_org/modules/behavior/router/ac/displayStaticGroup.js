define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');	

	
	var Translate  = require('Translate');
	var dicArr     = ['common','doStaticGroup'];
	function T(_str){
	    return Translate.getValue(_str, dicArr);
	}
	function display($con){
		var Path = require('Path');
		var Translate = require('Translate');
		var dicNames = ['doStaticGroup'];
		Translate.preLoadDics(dicNames, function(){
			displayTable($con);
		});
	}
	
	
	function displayTable($con){
		
			$con.empty();
			var TableContainer = require('P_template/common/TableContainer');
			var conhtml = TableContainer.getHTML({}),
				$tableCon = $(conhtml);
			$con.append($tableCon);
			
			
			$.ajax({
				type:"get",
				url:"common.asp?optType=apLoadBalance",
				success:function(result){
					
					// 数据处理
					processData(result);
					
					//生成表格
					makeTable($tableCon);
				}
			});
		
	}
	
	// 处理数据
	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
			   'APNames',	// 组名
			   'state', // 状态（1开启,0关闭）
			   'ApCounts',	// AP数量
			   'uttLoadBalanceEn',
			   'ApInfo'
		   ]; 
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   
		    var data = result["data"];
			DATA.uttLoadBalanceEn = data.uttLoadBalanceEn;
			DATA.ApInfo = data.ApInfo;
		    console.log(res);
		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			// 声明字段列表
			var fieldArr =[
				'ID',
				'APNames',
			   'state', 
			   'ApCounts'
			];
			
			var baseData = [];
			data.APNames.forEach(function(obj,i){
				baseData.push([
					Number(i)+1,
					data.APNames[i],
					data.state[i],
					data.ApCounts[i]
				]);
			});
			
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			
			database.addData(baseData);
	}
	
	function displayOnOff(){
		var OnOff = require('P_plugin/OnOff');
	    var $onoff = OnOff.getDom({
	        prevWord:T('load_balancing_name')+' :',
	        afterWord:'',
	        id:'checkOpen',
	        defaultType:DATA.uttLoadBalanceEn == 'on'?true:false,
	        clickFunc:function($btn,typeAfterClick){
				var GlobalEnable = (typeAfterClick == 1?'on':'off');
				var postQueryStr = 'GlobalEnable='+ GlobalEnable;
				console.log(postQueryStr);
				$.ajax({
				url : 'goform/formApLbGlobalConfig',
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
//							$('.nav a[href="#1"]').trigger('click');
							displayTable($('#1'));
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
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id": "addModal",
				"name": '{add}',
				 "clickFunc" : function($btn){
				 		var dataarr  = DATA["tableData"].getSelect();
				 		if(dataarr.length >1){
				 			Tips.showError('{reachMacNum}');
				 			return false;
				 		}
				 		editModal('add');
	        		}
			},
			{
				"id": "allDelete",
				"name": '{delete}',
				 "clickFunc" : function($btn){
						/* 获取已被勾选的行 */
				 		var keyarr = DATA["tableObj"].getSelectInputKey('data-primaryKey');
				 		if(keyarr.length>0){
				 			require('Tips').showConfirm(T('delconfirm'),function(){
				 				var dataarrs = [];
				 				keyarr.forEach(function(keyobj){
				 					var primaryKey = keyobj;
									var td = database.getSelect({primaryKey : primaryKey})[0];
				 					dataarrs.push(td);
				 				})
								deleteStr(dataarrs)
							});
				 		}else{
				 			require('Tips').showInfo('{unSelectDelTarget}');
				 		}
	        		}
			}
		];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		
		// 表格配置数据
		var tableList = {
			"database": database,
//			otherFuncAfterRefresh:afterTabel,
			"isSelectAll":true,
			"dicArr" : ['common','doStaticGroup'],
			"titles": {
				"ID"		 : {
					"key": "ID",
					"type": "text",
				},
				"{group}{name}"		 : {
					"key": "APNames",
					"type": "text"
				},
				"{status}"		 : {
					"key": "state",
					"type": "text",
					"filter":function(str){
						if(str == '1'){
							return '{com_startUse}';
						}else{
							return '{com_forbidden}';
						}
					}
				},
				"{dev_num}"		 : {
					"key": "ApCounts",
					"type": "text",
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var data = database.getSelect({primaryKey : primaryKey})[0];
								/* gei获取编辑的数据 */
								$.ajax({
									type:"get",
									url:"common.asp?optType=apLoadBalanceEdit&editName="+data.APNames,
									success:function(result){
										var doEval = require('Eval');
										var variableArr = [
												'enables',
												'loadBalanceNames',
												'loadThresValues',
												'loadBalanceList'
										];
										var result = doEval.doEval(result, variableArr);
										var isSuccessful = result['isSuccessful'];
										// 判断字符串代码是否执行成功
										if(isSuccessful){
										    // 执行成功
										    var datas = result['data'];
										    data.enables = datas.enables;
										    data.loadBalanceNames = datas.loadBalanceNames;
										    data.loadThresValues = datas.loadThresValues;
										    data.loadBalanceList = datas.loadBalanceList;
										    
										    editModal("edit",data);
										    
										}
									}
								});
								
								
								
							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								$this.blur();
								var primaryKey = $this.attr('data-primaryKey')
								var datarr = database.getSelect({primaryKey : primaryKey});
								
								
								require('Tips').showConfirm(T('delconfirm'),function(){
									deleteStr(datarr)
								});
							}
						}
					]
				}
				
			}
		};
		var list = {
			head: headData,
			table: tableList
		};
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		$tableCon.append($table);
		displayOnOff();
	}
	//新增 编辑
	function editModal(type,data){
		var data = data || {};
		var newdata = data;
		
		var modaobjs = '';
		console.log(data)
	    var modalList = {
		"id": "edmodal",
		"size":'large',
		"title": type=='add'?'{add}':'{edit}'	,
		"btns" : [
		{
		    "type"      : 'save',
		    "clickFunc" : function($this){
		    	if(require('InputGroup').checkErr(DATA.modaobj.getDom())>0){
		    		return ;
		    	}
		    	if(DATA.modaobj.getDom().find('#right_AP').children().length <2 || DATA.modaobj.getDom().find('#right_AP').children().length>10){
		    		Tips.showWarning('{Select_at_least_two_AP}');
		    		return ;
		    	}
		    	
		    	
		    	var state = (modaobjs.getDom().find("[name=state]:checked").val() == '1'?'on':'off');
		    	var group = modaobjs.getDom().find("[name=loadBalanceNames]").val();
		    	var temp = modaobjs.getDom().find("#right_AP option");
		    	var loadBalanceNameOld = modaobjs.getDom().find("[name='loadBalanceNameOld']").val();
		    	var temp1='';
		    	temp.each(function(i,item){
		    		temp1+=item.value+'  ;';
		    	})
		    	if(type == 'add'){
		    		var sendStr = "Action="+type+"&enabledLoadBal="+state+"&loadBalanceName="+group+"&temp1="+temp1;
		    	}else if(type == 'edit'){
		    		var sendStr = "Action="+type+"&enabledLoadBal="+state+"&loadBalanceName="+group+"&loadBalanceNameOld="+loadBalanceNameOld+"&temp1="+temp1;
		    	}
		    	console.log(sendStr)
		    	$.ajax({
		    		type:"post",
		    		url:"goform/formApLbConfig",
		    		async:true,
		    		data:sendStr,
		    		success:function(result){
		    			//处理数据
						var Eval = require('Eval');
						var variables = ['status', 'errorstr'];
						var result = Eval.doEval(result, variables),
						isSuccess = result["isSuccessful"];
						if(isSuccess){
							var data = result["data"],
							status = data["status"];
							var Tips = require('Tips');
							if(status == 1){
								Tips.showSuccess('{saveSuccess}');
								DATA.modaobj.hide();
//								$('[href="#1"]').trigger('click');
								displayTable($('#1'));

							}else{
								var errorStr = data["errorstr"];
								Tips.showWarning('{saveFail}' + errorStr);
							}
						}
						
					}
		    	});
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
		   		"prevWord"	:'{load_balancing_status}',
		   		
		        "inputData": {
		            "defaultValue" : (data.state === undefined?'1':data.state),
		            "type": 'radio',
		            "name": 'state',
		            "items" : [
		                {
		                    "value" : '1',
		                    "name"  : '{com_startUse}',
		                },
		                {
		                    "value" : '0',
						"name"  : '{com_forbidden}',
		                },
		            ]
		        },
		        "afterWord": ''
		    },
	     {  
		   		"prevWord"	: '{load_balancing_gname}',
		   		
		        "inputData": {
		            "value" : data.APNames || '',
		            "type": 'text',
		            "name": 'loadBalanceNames',
					"checkDemoFunc" : ['checkInput', 'name', '1', '23', '2']
		        },
		        "afterWord": ''
		    },
		    {  
		   		"prevWord"	: '',
		   		"display"	:false,
		        "inputData": {
		            "value" : data.APNames || '',
		            "type": 'text',
		            "name": 'loadBalanceNameOld'
		        },
		        "afterWord": ''
		    }
	    ];
	    // 获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    modaobjs = modaobj;
	    DATA.modaobj = modaobj;
	    // 获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);

	  	modaobj.insert($dom);
		
		var $modalDom = modaobj.getDom();
	    $('body').append($modalDom);
		var Translate  = require('Translate');
	    var tranDomArr = [$modalDom];
	    var dicArr     = ['common','doStaticGroup'];
	    Translate.translate(tranDomArr, dicArr);
	  	
		$.ajax({
			type:"get",
			url:"common.asp?optType=apListConfig",
			success:function(result){

				// 数据处理
				var doEval = require('Eval');
				var res = result,
					variableArr = ['serialno','macarray','namearray','apStatus'],
					result = doEval.doEval(res, variableArr);
				if (!result.isSuccessful) {
				   Tips.showError('{parseStrErr}');
				   return false;
				}
				var data = result["data"],
					serialno = data['serialno'],
					macarray = data['macarray'],
					namearray = data['namearray'],
					apStatus = data['apStatus'];
				var	loadBalanceList = [serialno,macarray];
					console.log(loadBalanceList);		
						
				// 设备方框
				var $div = $('<div id="apcover" style="position:relative;height:215px;"></div>');
				var $span_l = $('<span data-local="" style="position:absolute;top:10px;left:0px">'+T("optional_AP_device")+'</span>');
				var $span_r = $('<span data-local="" style="position:absolute;top:10px;left:380px">'+T('load_balancing_member')+'</span>');
				var $left = $('<select id="left_AP"  style="position:absolute;top:35px;left:0px;width:280px;overflow:auto;display:block" multiple="multiple" size="10"></select>');
				var $right = $('<select id="right_AP" style="position:absolute;top:35px;left:380px;width:280px;overflow:auto;display:block" multiple="multiple" size="10"></select>');
				var $btn_l = $('<button type="button" class="btn btn-primary" style="position:absolute;top:80px;left:302px" id="toleft"><==</button>');
				var $btn_r = $('<button type="button" class="btn btn-primary" style="position:absolute;top:130px;left:302px" id="toright">==></button>');
				$div.append($left,$span_l,$span_r,$right,$btn_l,$btn_r);
				modaobj.insert($div);	  	          
				modaobj.show();
			
				if(loadBalanceList[0].length>0){
					for(var i =0;i<loadBalanceList[0].length;i++){
						var $op = $('<option thismac="'+loadBalanceList[1][i]+'" value="'+loadBalanceList[0][i]+" "+loadBalanceList[1][i]+' '+namearray[i]+'">'+loadBalanceList[0][i]+' '+loadBalanceList[1][i]+' '+namearray[i]+'</option>');
							if(apStatus[i] == '0'){
								$op.css('color',"red");
							}
							$left.append($op);	
					}
					/* 将已选设备删除并加入右侧 */
					console.log(newdata);
					var lds = newdata.loadBalanceList;
					for(var k in lds){
						var firstkey = k.split(' ')[0];
						var havet = false;
						modaobj.getDom().find('#left_AP').children().each(function(){
							var $t = $(this);
							if($t.val().indexOf(firstkey)>=0){
								ltr($t);
								havet = true;
							}
						});
						
						if(!havet){
							modaobj.getDom().find('#right_AP').append('<option value="'+k+'">'+k+'</option>');
						}
					}
					
				}
					
				// 双击左边的选项添加到右边
				$("#left_AP").on("dblclick",'option',function(){
					ltr($(this));
				});
				// 双击右边的选项添加到左边
				$("#right_AP").on("dblclick",'option',function(){
					rtl($(this));
				});
				$("#toright").click(function(){
					var sel = $("#left_AP>option:selected");
					sel.each(function(){
						if($(this).text()!=''){
							ltr($(this));
						}
					})
					
				})
				$("#toleft").click(function(){
					var sel = $("#right_AP").find("option:selected");
					sel.each(function(){
						if($(this).text()!=''){
							rtl($(this));
						}
					})
					
				})
				function ltr(opt){
					$("#right_AP").append(opt);
				};
				function rtl(opt){
					$("#left_AP").append(opt);
				}
				
				/* 去除已被引用的AP*/
				var nowall = getUsedApArr();
				$("#left_AP").children('option').each(function(){
					var $t = $(this);
					var nowmac = $t.attr('thismac');
					nowall.forEach(function(nowobj){
						console.log(nowobj+"***"+nowmac)
						if(nowobj.toLowerCase().indexOf(nowmac.toLowerCase())>=0){
							$t.remove();
						}
					})
				});
			}   			
		});
	}
	
	/* 被引用的接口*/
	function getUsedApArr(){
		var allinfo = [];
		DATA.ApInfo.forEach(function(obj){
			obj.forEach(function(apobj){
				allinfo.push(apobj);
			})
		});
		return allinfo;
	}
	
	
/* 删除接口 */
	function deleteStr(arr){
		if(arr.length>0){
			var delstr = 'delstr=';
			arr.forEach(function(obj){
				delstr += obj.APNames+",";
			});
			delstr.substr(0,delstr.length-1);
			$.ajax({
				type:"post",
				url:"goform/formApLbListDel",
				data:delstr,
				success:function(result){
					var doEval = require('Eval');
					var variableArr = ['status','errorstr'];
					var result = doEval.doEval(result, variableArr);
					var isSuccessful = result['isSuccessful'];
					// 判断字符串代码是否执行成功
					if(isSuccessful){
					    // 执行成功
					    var data = result['data'];
					    if(data.status){
					    		Tips.showSuccess('{delSuccess}');
					    		displayTable($('#1'));
					    }else{
					    	Tips.showError(data.errorstr);
					    }
					}
				}
			});
			
			
		}
		
	}


	
	
	  
	module.exports = {
		display: display
	};
});
