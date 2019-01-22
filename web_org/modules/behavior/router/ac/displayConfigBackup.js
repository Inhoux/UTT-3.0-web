define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	function tl(str){
	          return require('Translate').getValue(str, ['common','doConfigbk','doEqMgmt'],'zhcn');
		}
	function tall(dom){
	         require('Translate').translate([dom],['common', 'doConfigbk', 'doEqMgmt']);
		}
	function display($con){
		var Path = require('Path');
		var Translate = require('Translate');
		var dicNames = ['doConfigbk'];
		Translate.preLoadDics(dicNames, function(){
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);
		
		
		$.ajax({
			type:"get",
			url:"common.asp?optType=apUpdateConfig",
			success:function(result){
				
				// 数据处理
				processData(result);
				
				//生成表格
				makeTable($tableCon);
			}
		});
	    });	
	}
	
	// 处理数据
	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
			   'namearray',	// 配置文件名
			   'serialarray', //序列号
			   'types',	// AP类别
			   'uptimearray',  // 更新时间
			   'firmVersion', // 硬件版本
			   'filesizearray', // 大小
			   'softVersion', // 软件版本
			   'statuarray' // AP状态（0为瘦模式）
		   ]; 
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   
		    var data = result["data"];
		    console.log(data);
		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			// 声明字段列表
			var fieldArr =[
				'ID',
				'namearray',	// 配置文件名
			   'serialarray', //序列号
			   'types',	// AP类别
			   'uptimearray',  // 更新时间
			   'firmVersion', // 硬件版本
			   'filesizearray', // 大小
			   'softVersion', // 软件版本
			   'statuarray' // AP状态（0为瘦模式）
			];
			
			var baseData = [];
			data.namearray.forEach(function(obj,i){
				baseData.push([
					Number(i)+1,
					data.namearray[i],
					data.serialarray[i],
					data.types[i],
					data.uptimearray[i],
					data.firmVersion[i],
					data.filesizearray[i],
					data.softVersion[i],
					data.statuarray[i]
				]);
			});
			
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			
			database.addData(baseData);
	}
	
	
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
		{
			"id": "allDelete",
			"name":tl("delete"),
			 "clickFunc" : function($btn){
			 		getTableSelect();
        		}
		},
		{
			"id": "backup",
			"name":tl("backall"),
			 "clickFunc" : function($btn){
			 	var Tips = require('Tips');
			 	Tips.showConfirm(tl("backup_alert1"),function(){
 /* W.xy */	
					var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
					$btn.after($afterdom);
					$afterdom[0].action ="goform/formApConfBackup";
					$afterdom[0].submit();
 /* W.xy */	
			 	});
        	}

		},
		{
			"id": "uploadBackup",
			"name":tl("upload_backup"),
			 "clickFunc" : function($btn){
			 	makeuploadModal();
        	}

		}];
		var database = DATA["tableData"];
		var headData = {
			"btns" : btnList
		};
		
		// 表格配置数据
		var tableList = {
			"database": database,
//			otherFuncAfterRefresh:afterTabel,
			"isSelectAll":true,
			"dicArr" : ['common','doConfigbk','doEqMgmt'],
			"titles": {
				"ID"		 : {
					"key": "ID",
					"type": "text",
				},
				"{config_filename}"		 : {
					"key": "namearray",
					"type": "text"
				},
				/*
				"{serial_num}"		 : {
					"key": "serialarray",
					"type": "text",
				},
				*/
				"{ap_model}"		 : {
					"key": "types",
					"type": "text",
				},
				"{updatetime}"		 : {
					"key": "uptimearray",
					"type": "text",
				},
				"{hardware_version}"		 : {
					"key": "firmVersion",
					"type": "text",
				},
				"{config_size}"		 : {
					"key": "filesizearray",
					"type": "text",
				},
				"{software_version}"		 : {
					"key": "softVersion",
					"type": "text",
				}
//				,
//				"{AP状态}"		 : {
//					"key": "statuarray",
//					"type": "text",
//				}
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
	}
	
	//导入弹框
	function makeuploadModal(){
		var modaobjs = '';

	    var modalList = {
		"id": "",
		"size":'normal',
		"title": tl("import"),
		"btns" : [
		{
		   // "type"      : 'save',
		      "name"      : '上传备份配置',
              'id'        : 'demo_id',
            "clickFunc" : function($this){
			// $this 代表这个按钮的jQuery对象，一般不会用到
			var thisfilename = $this.parents('.modal').find('[name="fileSrc"]').val();
			/*
			if(/.*[\u4e00-\u9fa5 ]+.*$/.test(thisfilename)) {
			    require('Tips').showWarning('{fileNameCanBeChineseOrSpace}');
			    return false;
			}
			*/
			if($dom.find('[name="fileSrc"]').val()=='') {
			    require('Tips').showWarning('{nofileInput}');
			    return false;
			}
			var $modal = $this.parents('.modal');
			var formData1 = new FormData($modal.find('#fileform')[0]);
		     $.ajax({
		          url: '/goform/formUploadConf',
		          type: 'POST',
		          data: formData1,
		          async: false,
		          cache: false,
		          contentType: false,
		          processData: false,
		          success: function (result) {
                    var tips = require('Tips'); 
		            var doEval = require('Eval');
			        var codeStr = result,
		            variableArr = ['status','errorstr'],
		            result = doEval.doEval(codeStr, variableArr),
		            isSuccess = result["isSuccessful"];		
                    
         /*           var tips = require('Tips'); 
                    var variables = ['status', 'errorstr'];
					var result = Eval.doEval(returndata, variables),
                   eval(returndata);  */
                    
                    if(isSuccess){
                        if(result.data.status){
                            tips.showSuccess('{importSuccess}');
                            modaobjs.hide();
                            $('[href="#2"]').trigger('click');
                        }else{
                            var errorStr = result.data.errorstr;
                            tips.showWarning(errorStr);
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
			"prevWord":tl("warn_file_choose"),
			"inputData": {
			    "type": 'text',
			    "name": 'fileSrc'
			},
			"afterWord": ''
	    }
	    ];
	    //获得弹框对象
	    var Modal = require('Modal');
	    var modaobj = Modal.getModalObj(modalList),
	    $modal = modaobj.getDom();
	    modaobjs = modaobj;

	    tall(modaobj.getDom());

	    //获得输入组对象
	    var InputGroup = require('InputGroup'),
	    $dom = InputGroup.getDom(inputList);
	    
	    $dom.find('[name="fileSrc"]').attr('readonly','readyonly');
	    //添加到指定位置
	    $modal.find('.modal-body').empty().append($dom);
	    var btnslist = [
		    {
				"name":tl("choose_file"),
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
	    $dom.find('#chooseFileHide').wrap('<form id="fileform" method= "post" enctype ="multipart/form-data"></form>');

	 
		modaobj.show();

	}
	
	function getTableSelect(){
		var selectdata = DATA["tableObj"].getSelectInputKey('data-primaryKey');
		var Tips = require('Tips');
		if(selectdata.length == 0){
			Tips.showInfo(tl("delete_alert1"));
		}else{
			Tips.showConfirm(tl("delete_alert2"),function(){
				var delstr = 'delstr=';
				for(var i in selectdata){
					var data = DATA["tableData"].getSelect({primaryKey : selectdata[i]})[0];
					delstr += data.namearray+',';
				}
				delstr = delstr.substr(0,delstr.length-1);
				$.ajax({
					type:"post",
					url:"goform/formApUpdateConfFileDel",
					data:delstr,
					success:function(result){
			
					 var tips = require('Tips'); 
		            var doEval = require('Eval');
			        var codeStr = result,
		            variableArr = ['status','errorstr'],
		            result = doEval.doEval(codeStr, variableArr),
		            isSuccess = result["isSuccessful"];		
                    
                     if(isSuccess){
                        if(result.data.status){
                            tips.showSuccess('{ApoperateOK}');
                			$('a[href="#2"]').trigger('click');
                //            modaobjs.hide();
                 //           $('[href="#2"]').trigger('click');
                        }else{
                            var errorStr = result.data.errorstr;
                            tips.showWarning(errorStr);
                        }

                    }
			/*			eval(res);
						if(status){
							Tips.showSuccess('删除成功');
							$('[href="#2"]').trigger('click');
						}else{
							Tips.showError(errStr);
						}  */
					}   
				});
			});
		}
	}
	  
	module.exports = {
		display: display
	};
});
