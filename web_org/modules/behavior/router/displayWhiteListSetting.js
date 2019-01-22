define(function(require, exports, module){
// QQ保存
// /goform/ConfigExceptQQ
// ALI保存
// /goform/ConfigExceptAli
// 全局设置
// /goform/formExceptQQGlobalConfig
// /goform/formExceptAliGlobalConfig
// 删除QQ
// /goform/formExceptQQDel
// 删除阿里
// /goform/formExceptAliDel
	function tl(str){
		return require('Translate').getValue(str,['common','error','doWhiteList']);
	}
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	module.exports = {
		display: display
	};

	  function processData(jsStr) {
	  	eval(jsStr)
	    // 加载Eval模块
	    var doEval = require('Eval');
	    var Tips = require('Tips');
	    var codeStr = jsStr,
	      // 定义需要获得的变量
	      variableArr = [
	      'exceptQQEnable', //QQ开启
	      'exceptEnterpriseQQEnable',//企业QQ开启 
	      'indexID',
	      'qqNumber',//QQ号 array
	      'remark',//QQ 说明
	 	  'totalrecs',//QQ目前条目数
	      'max_totalrecs',//QQ 最大

	      'exceptAliEnable',//阿里 开启
	      'AliNumber',//阿里账号
	      'remark1',//卡里说明
	      'indexID1',
	      'totalrecs1',//阿里目前数
	      'max_totalrecs1'//阿里最大
	      ];
	    // 获得js字符串执行后的结果
	    var result = doEval.doEval(codeStr, variableArr),
	      isSuccess = result["isSuccessful"];
	    // 判断代码字符串执行是否成功
	    if (isSuccess) {
	      // 获得所有的变量
	      var data = result["data"];

	      return data;
	    } else {

	      Tips.showError('{parseStrErr}',3);
	      return false;
	    }
	  }	
	
	/**
	 * 生成表格
	 */
	function display($con){
		$con.empty();
		
		$.ajax({
			type:"get",
			url:"common.asp?optType=whiteList",
			success:function(result){
				var data = processData(result);
				if(!data){
					return;
				}
				DATA['exceptQQEnable'] = data.exceptQQEnable;
				DATA['exceptEnterpriseQQEnable'] = data.exceptEnterpriseQQEnable;
				DATA['exceptAliEnable'] = data.exceptAliEnable;

				DATA['totalrecs'] = data.totalrecs;
				DATA['max_totalrecs'] = data.max_totalrecs;

				DATA['totalrecs1'] = data.totalrecs1;
				DATA['max_totalrecs1'] = data.max_totalrecs1;
				//将数据生成数据库
				setDatabase(data);
				//生成表单
				globalSetting($con);
			}
		});
	}

	/**
	 * 生成数据库
	 */
	function setDatabase(data){		
	      var arr = [];
	      var idindex = 0;
	      data.qqNumber.forEach(function(obj,i){
	      	idindex = i+1;
	      	var innerarr = [];
	      	innerarr.push(idindex);
	      	innerarr.push('QQ');
	      	innerarr.push(obj);
	      	innerarr.push(data.remark[i]);
			innerarr.push(data.indexID[i]);

	      	arr.push(innerarr);
	      });
	      DATA['idindex'] = idindex;

	       data.AliNumber.forEach(function(obj,i){
	      	idindex++;
	      	var innerarr = [];
	      	innerarr.push(idindex);
	      	innerarr.push('{ALI}');
	      	innerarr.push(obj);
	      	innerarr.push(data.remark1[i]);
	      	innerarr.push(data.indexID1[i]);
	      
	      	arr.push(innerarr);
	      });
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["database"] = database;
		// 声明字段列表
		var fieldArr = ['id','type', 'acount', 'note','indexid'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(arr);
	}
	
	/**
	 * 全局设置
	 */
	function globalSetting($con){
//		$.ajax({
//			type:"post",
//			url:"",
//			success:function(result){
				var globaldata = {
					
				};
				displayGlobalSetting(globaldata,$con);
//			}
//		});
	}
	
	function displayGlobalSetting(globaldata,$con){
		var data = globaldata || {};

		var inputlist = [
		   {  
		   		"prevWord"	:'{QQwhiteList}',
		   		"dicArr" : ['common', 'doWhiteList'],
		        "inputData": {
		            "defaultValue" : DATA['exceptQQEnable'] || 'off',
		            "type": 'radio',
		            "name": 'ExceptQQEnable',
		            "items" : [
		                {
		                    "value" : 'on',
		                    "name"  : '{open}',
		                },
		                {
		                    "value" : 'off',
		                    "name"  : '{close}',
		                },
		            ]
		        },
		        "afterWord": ''
		    },
		    {  
		   		"prevWord"	:'{ALIwhiteList}',
		        "inputData": {
		            "defaultValue" : DATA['exceptAliEnable'] || 'off',
		            "type": 'radio',
		            "name": 'ExceptAliEnable',
		            "items" : [
		                {
		                    "value" : 'on',
		                    "name"  : '{open}',
		                },
		                {
		                    "value" : 'off',
		                    "name"  : '{close}',
		                },
		            ]
		        },
		        "afterWord": ''
		    }
		];
		var InputGroup = require('InputGroup');
		var $input = InputGroup.getDom(inputlist);
		
		var BtnGroup = require('BtnGroup');
		var btnList = [
			{
				"id"        : 'save',
				"name"      : '{save}',
				"clickFunc" : function($this){
					/*
						保存用户的设置
					 */
					var $modal = $input;
                	var SRLZ = require('Serialize');
                	var strs = SRLZ.getQueryStrs($modal);
					 lajax('/goform/formExceptQQGlobalConfig',strs);
					 lajax('/goform/formExceptAliGlobalConfig',strs);
					var listenAjax = 0;
							function lajax(url,str){
								 $.ajax({
						          url: url,
						          type: 'POST',
						          data: str,
						          success: function(result) {
						            var doEval = require('Eval');
						            var codeStr = result,
						              variableArr = ['status'],
						              result = doEval.doEval(codeStr, variableArr),
						              isSuccess = result["isSuccessful"];
						            // 判断代码字符串执行是否成功
						            if (isSuccess) {
						              var data = result["data"],
						                status = data['status'];
						              if (status == '1') {
						                listenAjax = listenAjax+1;
						              } else {
						                Tips.showError('{delFail}');
						              }
						            } else {
						              Tips.showError('{parseStrErr}');
						            }
						          }
						        });
							}
						var lajaxlisten1 = setInterval(function(){
							if(listenAjax >= 2){

								clearInterval(lajaxlisten1);
								Tips.showSuccess('{saveSuccess}');
								 display($con);
							}
						},100);

                	
                }
				
			},
			{
				"id"        : 'reset',
				"name"      : '{reset}'
			}
		];
		var $btnList = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$con.empty().append($input,$btnList);
		
		var Translate  = require('Translate');
		var tranDomArr = [$con];
		var dicArr     = ['common','doWhiteList'];
		Translate.translate(tranDomArr, dicArr);		
	}
	
	
})
