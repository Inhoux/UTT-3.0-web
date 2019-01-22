define(function(require, exports, module){
	require('jquery');
	var Tips = require('Tips');
	var DATA={}; 
	function tl(str){
    	return require('Translate').getValue(str,['common','doAddressGroup','error']);
  	}
	exports.display = function(){
		var Path = require('Path');
		var Translate = require('Translate'); 
		var dicNames = ['common', 'doAddressGroup']; 
		Translate.preLoadDics(dicNames, function(){ 
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : tl('sysObj'),
	  		"links"     : [
	  			{"link" : '#/system_object/addrGroup', "title" : tl('addrGroup')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('addrGroup')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);

		    var Translate  = require('Translate');
		    var tranDomArr = [$('body')];
		    var dicArr     = ['common','doAddressGroup'];
		    Translate.translate(tranDomArr, dicArr);

			$('a[href="#1"]').click(function(event) {
				// Path.changePath($(this).text());		
				displaytable($('#1'));
				// showModel({});
			});
		    $('a[href="#1"]').trigger('click');
		});
	}
	
	function displaytable($con){
		//获取数据
		var TableContainer = require('P_template/common/TableContainer');
	    var conhtml = TableContainer.getHTML({}),
	      $tableCon = $(conhtml);
	    // 将表格容器放入标签页容器里
	    $con.empty().append($tableCon);
	    //向后台发送请求，获得表格数据
	    $.ajax({
	      url: 'common.asp?optType=addrGroup',
	      type: 'GET',
	      success: function(result) {
	        // 将后台数据处理为数据表格式的数据
	        var tabledata = processData(result);
	        //将处理好的数据放入数据库
	        storeTableData(tabledata);
	        // 获得表格Dom

	        var $table = getTableDom();
	        // 将表格放入页面
	        $tableCon.empty().append($table);

		    var Translate  = require('Translate');
		    var tranDomArr = [$con];
		    var dicArr     = ['common','doAddressGroup'];
		    Translate.translate(tranDomArr, dicArr);
	      }
	    });
	 }
	
  function processData(jsStr) {
    // 加载Eval模块
    var doEval = require('Eval');
    var Tips = require('Tips');
    var codeStr = jsStr,

      // 定义需要获得的变量
      variableArr = ['groupNames', 
      				 'groupContent',
                    'ipEntrynum', 
                    'totalrecs',
                    'groupType',
                    'totalrecs',
                    'max_totalrecs'                   
      ];
    // 获得js字符串执行后的结果
    var result = doEval.doEval(codeStr, variableArr),
      isSuccess = result["isSuccessful"];
    // 判断代码字符串执行是否成功
    if (isSuccess) {
      // 获得所有的变量
      var data = result["data"];
      // 将返回的JS代码执行所生成的变量进行复制
      //var titleArr = data["titles1"], // 表格头部的标题列表
      var groupNames = data["groupNames"],
      groupContent = data["groupContent"],
        ipEntrynum = data["ipEntrynum"],
        groupType = data["groupType"],
        totalrecs=data["totalrecs"],
        max_totalrecs=data["max_totalrecs"];

      //存入全局
      DATA['groupNames'] = groupNames;
      DATA['totalrecs'] = totalrecs;
      DATA['max_totalrecs'] = max_totalrecs;
      // 把数据转换为数据表支持的数据结构
      var dataArr = [];
      // 将要插入数据表中的数据
      groupNames.forEach(function(item, index, arr) {
      	var arr = [];
      	arr.push(Number(index)+1);
        arr.push(groupNames[index]);
        arr.push(groupContent[index]);  
        dataArr.push(arr);
      });
      // 返回处理好的数据
      return dataArr;
    } else {
      Tips.showError('{parseStrErr}}');
    }
  }

	function storeTableData(data){
		 // 获取数据库模块，并建立一个数据库
	    var Database = require('Database'),
	      database = Database.getDatabaseObj(); // 数据库的引用
	    // 存入全局变量DATA中，方便其他函数使用
	    DATA["tableData"] = database;
	    // 声明字段(列名)列表
	    var fieldArr = ['ID','groupNames', 'ipEntrynum','groupContent','groupType','max_totalrecs','totalrecs'];
	    // 将数据存入数据表中
	    database.addTitle(fieldArr);
	    database.addData(data);
	}
	
	function getTableDom() {
	    // 表格上方按钮配置数据
	    var btnList = [
	    {
	      "id": "add",
	      "name": "{add}",
	       "clickFunc" : function($btn){
	               //alert($btn.attr('id'));  // 显示 add
	               if(DATA.totalrecs==DATA.max_totalrecs){
	               		require('Tips').showError(tl('reachMacNum'));
	               }else{
	               		showModel('add');
	               }
	               
	            }
	    },
	    {
	      "id": "delete",
	      "name": "{delete}",
	       "clickFunc" : function($btn){
	              //alert($btn.attr('id'));  // 显示 add
	              deleteBtnClick();
	          }
	
	    }];
	    var database = DATA["tableData"];
	    var headData = {
	      "btns" : btnList
	    };
	    // 表格配置数据
	    //['name', 'type','time', 'context'];
	    var tableList = {
	      "database": database,
	      "isSelectAll":true,
	      "titles": {
	      "ID": {
					"key": "ID",
					"type": "text"
				},
	        "{groupNames}"     : {
	          "key": "groupNames",
	          "type": "text"
	        },
	        // "{groupType}"     : {
	        //   "key": "groupType",
	        //   "type": "text"
	        // },
	        "{ipEntrynum}"    : {
	          "key": "ipEntrynum",
	          "type": "text",
	          "maxLength":34
	        },                    
	        "{edit}": {
	          "type": "btns",
	          "btns" : [
	            {
	              "type" : 'edit',
	              "clickFunc" : function($this){
	                var primaryKey = $this.attr('data-primaryKey');
	           	 	var tableObj = DATA["tableObj"];
	                var data = database.getSelect({primaryKey : primaryKey})[0];
					// 从数据库取一波数据，然后将数据data传入模态框展示
					 showModel('edit',data);
	              }
	            },
	            {
	              "type" : 'delete',
	              "clickFunc" : function($this){           
					var primaryKey = $this.attr('data-primaryKey');
					var database = DATA.tableData;
					var data = database.getSelect({primaryKey : primaryKey});
					require('Tips').showConfirm(tl('delconfirm'),function(){	
						removeData(data[0]);                
					});
	            
	              }
	            }
	          ]
	        }
	        
	      }
	    };
	    // 表格组件配置数据
	    var list = {
	      head: headData,
	      table: tableList
	    };
	    var Table = require('Table'),
	      tableObj = Table.getTableObj(list),
	      $table = tableObj.getDom();
	    // 将表格组件对象存入全局变量，方便其他函数调用
	    DATA["tableObj"] = tableObj;
	    return $table;
  	}

	function removeData(data) {
		var Tips = require('Tips');
		var queryStr = 'delstr=' + data["groupNames"];
		$.ajax({
			url: '/goform/formIpGroupListDel',
			type: 'POST',
			data: queryStr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
					returnStr = ['status','errorstr'],
					result = doEval.doEval(codeStr, returnStr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"],
						status = data['status'];
					if (status) {
						Tips.showSuccess('{delSuccess}');
						displaytable($('#1'));
					} else {
						var errorstr=data.errorstr;
						if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
							Tips.showWarning('{delFail}');
							displaytable($('#1'));
						}else{
                            Tips.showWarning(errorstr);
						    displaytable($('#1'));
						}
					}

				} else {
					Tips.showError('{delFail}');
				}
			}
		});
	}

	/*删除*/
	function deleteBtnClick() {
	    //获得提示框组件调用方法
	    var Tips = require('Tips');
	    // var database = DATA["database"];
	    var database = DATA.tableData;
	    var tableObj = DATA["tableObj"];

	    var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
	    var length  = primaryKeyArr.length;
	    // 判断是否有被选中的选择框
	    if (length > 0) {
	    	require('Tips').showConfirm(tl('delconfirm'),function(){
			      var lanArr = []; 
			      var str = '';
			      //$.each($elems, function(index, element) {
			      primaryKeyArr.forEach(function(primaryKey) {  
			        var data = database.getSelect({primaryKey : primaryKey});
			        var name = data[0]["groupNames"];
			        str += name + ',';
			      });
			      if(str != ''){
			        str = str.substr(0, str.length - 1);
			        str = 'delstr=' + str;
			        $.ajax({
			          url: '/goform/formIpGroupListDel',
			          type: 'POST',
			          data: str,
			          success: function(result) {
			            var doEval = require('Eval');
			            var codeStr = result,
			              variableArr = ['status','errorstr'],
			              result = doEval.doEval(codeStr, variableArr),
			              isSuccess = result["isSuccessful"];
			            // 判断代码字符串执行是否成功
			            if (isSuccess) {
			              var data = result["data"],
			                status = data['status'];
			              if (status) {
			                // 提示成功信息
			                Tips.showSuccess('{delSuccess}');
			                displaytable($('#1'));
			              } else {
								var errorstr=data.errorstr;
								if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
									Tips.showWarning('{delFail}');
									displaytable($('#1'));
								}else{
									Tips.showWarning(errorstr);
						            displaytable($('#1'));
								}
			              }
			            } else {
			              Tips.showError('{parseStrErr}');
			            }
			          }
			        });
			      }
	    	});
	    } else {
	      Tips.showWarning('{unSelectDelTarget}');
	    }
	}  	
	/*
	 *新增及编辑弹框
	 * */
	function showModel(type,data){
		var demodata = data || {};
		var datas = {
			name:demodata.groupNames || '',
			leftGroup :DATA['groupNames'] || [],
			rightG: [],
			rightP: []
		};
		
		if(type == 'edit'){
			var gcont = (demodata.ipEntrynum || '').split(')');
			gcont.forEach(function(obj){
				var firstword = obj.substr(0,1);
				if(firstword == 'P'){
					datas.rightP.push(obj.substr(2));
				}else if(firstword == 'G'){
					datas.rightG.push(obj.substr(2));
				}
			});
		}
		if(type == "edit"){
			var newGroup = [];
			DATA['groupNames'].forEach(function(obj){
				var havesame = false;
				datas.rightG.forEach(function(rg){
					if(rg == obj){
						havesame = true;
					}
				});
				if(obj != datas.name && !havesame){
					newGroup.push(obj);
				}
			});
			datas.leftGroup = newGroup;
		}

		var modallist = {
			id : (type+'_modal'),
			title : (type == 'add'?'{addAddrGroup}':'{editAddrGroup}'),
			btns: [
				{
					type : 'save',
					clickFunc : function($this){
						if(require('InputGroup').checkErr(DATA['modalDom'].find('[name="name"]').parent())>0){
							return;
						}
						
						if(DATA['modalDom'].find('#r_select option').length <=0){
							Tips.showWarning('{groupCannotNull}');
							return;
						}
						var _name = DATA['modalDom'].find('[name="name"]').val();
						var _ipstrs = '';
						DATA['modalDom'].find('#r_select option').each(function(){
							var $t = $(this);
							_ipstrs += $t.val()+';';
						});
						var datastrs = 'groupName='+_name+'&groupNameOld='+(type == 'add'?'':_name)+'&groupType=groupAddr&groupTypeOld='+(type == 'add'?'':'groupAddr')+'&temp1='+_ipstrs+'&Action='+(type == 'add'?'add':'edit');
						 $.ajax({
				          url: '/goform/formIpGroupConfig',
				          type: 'POST',
				          data: datastrs,
				          success: function(result) {
				            var doEval = require('Eval');
				            var codeStr = result,
				              variableArr = ['status','errorstr'],
				              result = doEval.doEval(codeStr, variableArr),
				              isSuccess = result["isSuccessful"];
				            // 判断代码字符串执行是否成功
				            if (isSuccess) {
				              var data = result["data"],
				                status = data['status'];
				              if (status) {
				                // 提示成功信息
				                Tips.showSuccess('{saveSuccess}');
				                DATA['modalObj'].hide();
				                displaytable($('#1'));
				              } else {
									var errorstr=result['data'].errorstr;
									if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
										Tips.showError('{saveFail}');
									}else{
										Tips.showWarning(errorstr);
									}
				              }
				            } else {
				              Tips.showError('{parseStrErr}');
				            }
				          }
				        });
					}
				},
				{
					type : 'reset'
				},
				{
					type : 'close'
				}
			]
		};
		
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(modallist);
		DATA['modalObj'] = modalObj;
		
		var inputlist = [
			{
				prevWord :'{name}',
				necessary:true,
				inputData:{
					type :'text',
					name : 'name',
					value : datas.name || '',
					"checkDemoFunc": ['checkInput', 'name', '1', '31', '3'] 
					// "checkDemoFunc" : ['checkName','1','10'],
				}
			},
			{
				prevWord :'{addrType}',
				inputData:{
					type :'radio',
					name : 'addressType',
					defaultValue:datas.addressType || 'new',
					items:[
						{name:'{newAddr}',value:'new'},
						{name:'{existAddressGroup}',value:'old'}
					]
				}
			}
		];
		
		var IG = require('InputGroup');
		var $input = IG.getDom(inputlist);
		//修改特殊排版
		if(type == "edit"){
			$input.find('[name="name"]').attr('disabled','disabled');
		}
		var $bottomdiv = $('<div style="position:relative;width:100%;height:160px;margin-top:10px"></div>');
		
		var $r_select = $('<select id="r_select" size="7"></select>').css({position:'absolute',width:'210px',top:'0',right:'10px',overflow:'auto'});
		datas.rightG.forEach(function(obj){
			$r_select.append('<option value="'+obj+'">G('+obj+')</option>');
		});
		datas.rightP.forEach(function(obj){
			$r_select.append('<option value="'+obj+'">P('+obj+')</option>');
		});
		var $l_select = $('<select id="l_select" size="7" class=" u-hide"></select>').css({position:'absolute',width:'210px',top:'0px',left:'0px',overflow:'auto'});
		datas.leftGroup.forEach(function(obj){
			$l_select.append('<option value="'+obj+'">'+obj+'</option>');
		});
		var $btn_tor = $('<button type="button" id="btn_tor">==></button>').css({position:'absolute',paddingLeft:'10px',paddingRight:'10px',top:'10px',left:'237px'});
		var $btn_tol = $('<button type="button" id="btn_tol"><==</button>').css({position:'absolute',paddingLeft:'10px',paddingRight:'10px',top:'50px',left:'237px'});		
		var $btn_delet = $('<button type="button" id="btn_delet">'+tl("delete")+'</button>').css({position:'absolute',paddingLeft:'12px',paddingRight:'12px',top:'90px',left:'237px'});		
		var leftlist = [
			{
				prevWord:'{startAddr}',
				inputData:{
					type:'text',
					name:'startAddress',
					value:'',
					checkFuncs:['checkIP']
				}
			},
			{
				prevWord:'{endAddr}',
				inputData:{
					type:'text',
					name:'endAddress',
					value:'',
					"checkDemoFunc" : ['checkInput','ip','1','gt','startAddress']
				}
			}
		];
		var $leftlist = IG.getDom(leftlist).attr({id:'leftlist'}).css({position:'absolute',top:'32px',left:'0px'});
		$bottomdiv.append($r_select,$l_select,$btn_tor,$btn_tol,$btn_delet,$leftlist);
		modalObj.insert($input);
		modalObj.insert($bottomdiv);
		var $modal = modalObj.getDom();
		
		//绑定交互
		//----新地址/已有地址
		makeTheLeftListChange();
		$modal.find('[name="addressType"]').change(function(){
			makeTheLeftListChange();
		});
		function makeTheLeftListChange(){
			if($modal.find('[name="addressType"]:checked').val() == 'new'){
				$modal.find('#leftlist').removeClass('u-hide');
				$modal.find('#l_select').addClass('u-hide');
			}else{
				$modal.find('#leftlist').addClass('u-hide');
				$modal.find('#l_select').removeClass('u-hide');
			}
			console.log($modal.find('[name="addressType"]:checked').val())
		}
		//----右移按钮
		$modal.find('#btn_tor').click(function(){
			if($modal.find('#r_select>option').length>=10){
			    Tips.showWarning('{addrrangeover}'); 
                return ;
			}
			var value = "";
			var texts = "";
			if($modal.find('#l_select').is(':hidden')){
				$modal.find('#leftlist').find('input').blur();
				if(IG.checkErr($modal.find('#leftlist'))==0){
					 var leftfront = $modal.find('[name="startAddress"]').val().substr(0,$modal.find('[name="startAddress"]').val().lastIndexOf('.'));
					 var rightfront = $modal.find('[name="endAddress"]').val().substr(0,$modal.find('[name="endAddress"]').val().lastIndexOf('.'));
					 if(leftfront != rightfront){
					 	Tips.showWarning('请注意，起始和结束ip不在同一个网段！');
					 }else{
					 	value = $modal.find('[name="startAddress"]').val() +"-"+ $modal.find('[name="endAddress"]').val();
					 	texts = "P("+value+")";
					 }
//					value = $modal.find('[name="startAddress"]').val() +"-"+ $modal.find('[name="endAddress"]').val();
//					texts = "P("+value+")";	
					
					//判断是否有相同的地址段
					var $item = $modal.find('#r_select option');
					$item.each(function(i,val){
						if(value == $(this).val()){
							Tips.showInfo('该地址段已存在！');
							value = '';
						}
					});
					
				}
				
			}else{
				var $selected = $modal.find('#l_select').find('option:selected');
				var $selected_clone = $selected.clone();
				$selected.remove();
				$selected_clone.each(function(){
					$(this).text("G("+$(this).text()+")");
				});
				$r_select.append($selected_clone);
			}
			
			
			if(value != '' && texts != ''){
				$modal.find('[name="startAddress"],[name="endAddress"]').val('');
				$modal.find('#r_select').append('<option value="'+value+'">'+texts+'</option>');
			}
		});
		//----左移按钮
		$modal.find('#btn_tol').click(function(){
			var $this_op = $modal.find('#r_select').find('option:selected');
			var firstword = $this_op.text().substr(0,$this_op.text().length-($this_op.text().length-1));
			if(firstword == "G"){
				var this_clone = '<option value="'+$this_op.val()+'">'+$this_op.val()+'</option>';
				$this_op.remove();
				$modal.find('#l_select').append(this_clone);
				$modal.find('[name="addressType"][value="old"]').prop('checked',true);
				makeTheLeftListChange();
			}else{
				var start_this = $this_op.val().split('-')[0];
				var end_this = $this_op.val().split('-')[1];
				$this_op.remove();
				$modal.find('[name="startAddress"]').val(start_this);
				$modal.find('[name="endAddress"]').val(end_this);
				$modal.find('[name="addressType"][value="new"]').prop('checked',true);
				makeTheLeftListChange();
			}
		});
		//----删除按钮
		$modal.find('#btn_delet').click(function(){
			var $this_op = $modal.find('#r_select').find('option:selected');
			var firstword = $this_op.text().substr(0,$this_op.text().length-($this_op.text().length-1));
			if(firstword == "G"){
				var this_clone = '<option value="'+$this_op.val()+'">'+$this_op.val()+'</option>';
				$this_op.remove();
				$modal.find('#l_select').append(this_clone);
				// $modal.find('[name="addressType"][value="old"]').prop('checked',true);
				// makeTheLeftListChange();
			}else{
				$this_op.remove();
			}
		});
		
		DATA['modalDom'] = modalObj.getDom();
		$('body').append(DATA['modalDom']);

	    var Translate  = require('Translate');
	    var tranDomArr = [$('body')];
	    var dicArr     = ['common','doAddressGroup'];
	    Translate.translate(tranDomArr, dicArr);

		modalObj.show();
		
	}
  
})
