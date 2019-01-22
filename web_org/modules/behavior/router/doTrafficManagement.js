define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');

	var Translate  = require('Translate');
	var dicArr     = ['common','doTrafficManagement','doTimePlan','doBehaviorManagement'];
	function T(_str){
	    return Translate.getValue(_str, dicArr);
	}
	exports.display = function(){

	    var Translate = require('Translate');
	    Translate.preLoadDics(dicArr, function(){
		var Path = require('Path');
			// 加载路径导航
			var pathList =
			{
	  		"prevTitle" : T('TrafficManagement'),
	  		"links"     : [
	  			{"link" : '#/traffic_management/traffic_management', "title" : T('TrafficManagement')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : T('TrafficManagement')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
//				Path.changePath($(this).text());
				displayTable();
			});
		    $('a[href="#1"]').trigger('click');
	    });
	}

	/**
	 * 表格入口
	 */
	function displayTable(){
		$('[href="#1"]').text(T('TrafficManagement'));
		




		// 向后台发送请求，获得表格数据
		$.ajax({
		 	url: 'common.asp?optType=traffic_management|timePlan',
		 	type: 'GET',
		 	success: function(result) {
		 		// 将后台数据处理为数据表格式的数据
				processData(result);

				// 获得表格Dom
				var $table = getTableDom();

				var $con = $('#1');
				$('#1').empty();
		
				var TableContainer = require('P_template/common/TableContainer');
				var conhtml = TableContainer.getHTML({}),
					$tableCon = $(conhtml);
				// 将表格容器放入标签页容器里
				$con.append($tableCon);
				// 将表格放入页面
				$tableCon.append($table);
				/*移动到*/
				var MoveTo = require('P_plugin/MoveTo');
				var $moveto = MoveTo.getDom({
					select : DATA.GroupNames,
					url    : 'goform/formGroupConfigMoveConfig',
					str1      : 'newname',
					str2      : 'oldname',
					saveSuccess : function($btn){
									$('[href="#1"]').trigger('click');
								}
				});
				MoveTo.joinContent($('#1'),$moveto);

				Translate.translate([$table],dicArr);
			}
		});
	}

	/**
	 * 处理数据到数据库
	 * @param {Object} result
	 */
	function processData(result){
				// 加载Eval模块
		var doEval = require('Eval');
		var codeStr = result,
			// 定义需要获得的变量
			variableArr = [ 'GroupNames',
							'Allows',
							'orgType',
							'orgData',
							'orgNames',
							'orgIp',
							'yyfw',
							'lkcl',
							'policy',
							'uRate',
							'dRate',
							'effecttimes',
							//'binding_interfaces',
						   	'notes',
						   	'timeRangeNames',
						   	'rxBands',
						   	'txBands',
							'wanIfCount'
						   	];
		// 获得js字符串执行后的结果
		var result = doEval.doEval(codeStr, variableArr),
			isSuccess = result["isSuccessful"];



		// 判断代码字符串执行是否成功
		if (isSuccess) {
			// 获得所有的变量
			var data = result["data"];
			//console.log(data);
			DATA.GroupNames=data.GroupNames;
			DATA['timeRangeNames'] = data.timeRangeNames;
			var titleArr = ['ID',
							'GroupNames',
							'Allows',
							'order',
							'orgShow',
							'orgType',
							'orgData',
							'orgIp',
							'yyfw',
							'lkcl',
							'policy',//限速策略，1 == 独享，2 == 共享
							'uRate',//上传速率
							'dRate',//下载速率
							'effecttimes',//生效时间
							//'binding_interfaces', //绑定接口
						   	'notes',	//备注,
						   	'rxBands', // 上传
						   	'txBands' // 下载
						   	];
			DATA['txBands']=data['txBands'];
			DATA['rxBands']=data['rxBands'];
			DATA['wanCount']=data['wanIfCount'];
			// 把数据转换为数据表支持的数据结构
			var dataArr = []; // 将要插入数据表中的数据
			// 通过数组循环，转换数据的结构
			data.GroupNames.forEach(function(item, index, arr) {
				var arr = [];
				arr.push(index+1);
				arr.push(data.GroupNames[index]);
				arr.push(data.Allows[index]);
				arr.push(index+1);
				if (data.orgType[index] == "org"){
					arr.push(data.orgNames[index]);

				}else if (data.orgType[index] == "ip"){
					arr.push(data.orgIp[index]);

				}else{
					arr.push(T('alluser'));
				}
				arr.push(data.orgType[index]);
				arr.push(data.orgData[index]);
				arr.push(data.orgIp[index]);
				arr.push('');
				arr.push(data.lkcl[index]);
				arr.push(data.policy[index]);
				arr.push(data.uRate[index]);
				arr.push(data.dRate[index]);
				arr.push(data.effecttimes[index]);
				//arr.push(data.binding_interfaces[index]);
				arr.push(data.notes[index]);
				arr.push(data.rxBands);
				arr.push(data.txBands);

				dataArr.push(arr);
			});

			// 获取数据库模块，并建立一个数据库
			var Database = require('Database'),
				database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			database.addTitle(titleArr);
			database.addData(dataArr);
		} else {
			console.log('字符串解析失败')
		}
	}

	/**
	 * 生成表格的Dom，并返回
	 * @author cao.yongxiang
	 * @date   2016-11-15
	 */
	function getTableDom() {

		// 表格上方按钮配置数据
		var btnList = [{
			"id": "add",
			"name": "{add}",
			"clickFunc" : function($btn){

				displayEditPage('add');
			}
		}, {
			"id": "delete",
			"name": "{delete}",
			"clickFunc" : function($btn){
				var database = DATA.tableData;
				var keyArr = DATA["tableObj"].getSelectInputKey('data-primaryKey');
				var delarr = [];
				keyArr.forEach(function(obj){
					var data = database.getSelect({
						primaryKey: obj
					});
					delarr.push(data[0]);
				});
				if(delarr.length <1){
				    Tips.showWarning('{pleSelectDelRule}');
				}else{
					Tips.showConfirm(T('{confirm}{delete}?'), function(){
						deletFunc(delarr);
					}, function(){

					}, []);
				}
			}

		}];

		var database = DATA["tableData"];

		var headData = {
			"btns" : btnList
		};
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			"titles": {
				"ID": {
					"key": "ID",
					"type": "text"
				},
				"{rulename}": {
					"key": "GroupNames",
					"type": "text"
				},
				"{open}": {
					"key": "Allows",
					"type": "checkbox",
					"values": {
						"1": true,
						"0": false
					},
                    "clickFunc" : function($this){
                        var primaryKey = $this.attr('data-primaryKey');
                        var database = DATA.tableData;
                        var data = database.getSelect({
                            primaryKey: primaryKey
                        });
                      changeStatus(data[0], $this);
                    }
				},

				"{Execution_order}": {
					"key" : "order",
					"type": "text"
				},
				"{applyUser}": {
					"key" : "orgShow",
					"type": "text",
					"maxLength":31
				},
				/*
				"{Application_service}": {
					"key" : "yyfw",
					"type": "text"
				},*/
				"{flowControlStrategy}": {
					"key" : "lkcl",
					"type": "text",
					filter:function(oldstr){
						var newstr = oldstr;
						if(oldstr == 0){
							newstr = '{Application_restrictions}';
						}else{
							newstr = '{Application_security}';
						}
						return newstr;
					}
				},
				"{limit_strategy}": {
					"key" : "policy",
					"type": "text",
					"filter":function(strs){
						var newstr = strs;
						if(strs == 1){
							newstr = '{exclusive}';
						}else{
							newstr = '{shared}';
						}
						return newstr;
					}
				},
				"{uRate}": {
					"key" : "uRate",
					"type": "text"
				},
				"{dRate}": {
					"key" : "dRate",
					"type": "text"
				},
				"{effecttimes}": {
					"key" : "effecttimes",
					"type": "text",
					filter:function(str){
						return (str === ''?T('allday'):str);
					}
				},
				//"绑定接口": {
				//	"key" : "binding_interfaces",
				//	"type": "text"
				//},
				"{note}": {
					"key" : "notes",
					"type": "text",
					"filter":function(oldstr){
						var newstr = oldstr;
						if(oldstr.length>6){
							newstr = oldstr.substr(0,5)+"……";
						}
						return newstr;
					}
				},
				"{edit}": {
					"type": "btns",
					"btns" : [
						{
							"type" : 'edit',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;

								var data = database.getSelect({
									primaryKey: primaryKey
								});
								displayEditPage('edit',data[0]);

							}
						},
						{
							"type" : 'delete',
							"clickFunc" : function($this){
								var primaryKey = $this.attr('data-primaryKey');
								var database = DATA.tableData;
								var data = database.getSelect({
									primaryKey: primaryKey
								});
								// 删除这条数据
								Tips.showConfirm(T('{confirm}{delete}?'), function(){
									deletFunc(data);
								},function(){

								}, []);

							}
						}
					]
				}
			},
			//"lang"        : 'zhcn’,
			"dicArr"      : dicArr
		};
			// 表格组件配置数据
		var list = {
			head: headData,
			table: tableList
		};

		// 加载表格组件，获得表格组件对象，获得表格jquery对象
		var Table = require('Table');
		var tableObj = Table.getTableObj(list);
		var $table = tableObj.getDom();


		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		return $table;
	};


	/*开启关闭勾选框*/
	function changeStatus(data, $this){
		var Serialize = require('Serialize');
		var datastr = Serialize.queryJsonToStr(data);
		var thisName = data.GroupNames;
		var thisOpen = ($this.is(':checked')?'1':'0');
		var querystr = 'ruleName='+thisName+"&status="+thisOpen;
		//console.log(querystr);
		$.ajax({
			url: '/goform/formConfigGroupConfig_Checkbox',
			type: 'POST',
			data: querystr,
			success: function(result) {
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['status','errorstr'],
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
				if (isSuccess) {
						var data = result["data"],
							status = data["status"];
						if (status) {
							// 显示成功信息
							Tips.showSuccess(T('saveSuccess'));
						} else {
							var errorStr = data["errorstr"];
							Tips.showWarning(T('saveFail') + errorStr);
						}

					} else {
						Tips.showWarning(T('parseStrErr'));
					}
				displayTable($('#1'));
			}
		});
	}




	/**
	 * 编辑页面制作
	 * @author QC
	 * @date   2016-12-21
	 */
	function displayEditPage(thistype,demodata) {
		$('#checkOpen,.u-onoff-span1').hide();
		
		var data = demodata || {};
		var type = (thistype === undefined?'add':thistype);
		var $con = $('#1');
		$('#1').empty();
		$('[href="#1"]').text(type=='add'? T('add'):T('edit'));



		//默认值

			var Allows = 1;
			var GroupNames = '';
			var notes = '';
			var order = '';
			var orgShow = T('alluser');
			var orgType = 'all';
			var orgData = '';
			var orgIp = '0.0.0.0-0.0.0.0.0';
			var yyfw = '';
			var lkcl = '0';
			var policy = '1';
			var uRate = '';
			var dRate = '';
			var effecttimes = '';
			var binding_interfaces = '';
			var txBandDataUp = [];
			var txBandDataDown = [];

			var effecttimesArr = [{name:T('allday'),value:''}];
			DATA['timeRangeNames'].forEach(function(obj){
				effecttimesArr.push({name:obj,value:obj});
			});
			//console.log(effecttimesArr);


		//若为编辑，修改初始化默认值
		if(type == 'edit'&& data !== undefined){
			Allows = data.Allows;
			GroupNames = data.GroupNames;
			notes = data.notes;
			order = data.order;
			orgShow = data.orgShow;
			orgType = data.orgType;
			orgData = data.orgData;
			orgIp = (data.orgIp === undefined ? '0.0.0.0-0.0.0.0':data.orgIp);
			yyfw = data.yyfw;
			lkcl = data.lkcl;
			policy = data.policy;
			uRate = data.uRate;
			dRate = data.dRate;
			effecttimes = data.effecttimes;
			txBandDataUp = data.txBands;
			txBandDataDown = data.rxBands;
			/*binding_interfaces = [];
			if(data.binding_interfaces.length > 0){
				for(var i in data.binding_interfaces){
					binding_interfaces.push(data.binding_interfaces[i]);
				}
			}*/

			//console.log(data);
		}else if(type == 'add'&& data !== undefined){
			txBandDataUp = DATA['txBands'];
			txBandDataDown = DATA['rxBands'];
		}
		else {
			lkcl = '0';
		}


		// 模态框中输入框组的配置数据
		var inputList = [{
			"prevWord": '{status}',
			"inputData": {
				"type": 'radio',
				"name": 'Allows',
				"defaultValue": Allows,
				"items": [{
					"value": '1',
					"name": '{open}'
				}, {
					"value": '0',
					"name": '{close}'
				}, ]
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{rulename}',
			"inputData": {
				"type": 'text',
				"name": 'GroupNames',
				"value" : GroupNames ,
				"checkDemoFunc":["checkInput","name","1","31",'2']
			},
			"afterWord": ''
		},{
            "display": false,
			"prevWord": '',
			"inputData": {
				"type": 'text',
				"name": 'GroupNameold',
				"value" : GroupNames ,
				"checkDemoFunc":["checkInput","name","1","31",'2']
			},
			"afterWord": ''
		}, {
			"prevWord": '{note}',
			"inputData": {
				"type": 'text',
				"name": 'notes',
				"value":notes,
				"checkDemoFunc":["checkInput","name","0","31",'2']
			},
			"afterWord": ''
		}, {
            "necessary": true,
			"prevWord": '{Execution_order}',
			"inputData": {
				"type": 'text',
				"name": 'order',
				"value": order,
				"checkDemoFunc":["checkInput","num","1","10000"]
			},
			"afterWord": '{tips}'
		}, {
            "display": false,
			"prevWord": '原来的执行顺序',
			"inputData": {
				"type": 'text',
				"name": 'oldorder',
				"value": order
			},
			"afterWord": '{tips}'
		}, {
			"necessary": true,
			"prevWord": '{applyUser}',
			"inputData": {
				"type": 'text',
				"name": 'orgShow',
				"value":orgShow,
			},
			"afterWord": ''
		}, {
			"display": false,
			"prevWord": '{Application_service}',
			"inputData": {
				"type": 'text',
				"name": 'yyfw',
				"value":yyfw
			},
			"afterWord": ''
		},
		{
			"prevWord": '{flowControlStrategy}',
			"inputData": {
				"type": 'radio',
				"name": 'lkcl',
				defaultValue:lkcl,
				items:[
					{name:'{Application_restrictions}',value:'0'},
					{name:'{Application_security}',value:'1'}
				]
			},
			"afterWord": ''
		},
		{
			"prevWord": '{limit_strategy}',
			"inputData": {
				"type": 'radio',
				"name": 'policy',
				defaultValue:policy,
				items:[
					{name:'{EnjoySpeedLimit}',value:'1'},
					{name:'{SharedSpeedLimit}',value:'2'}
				]
			},
			"afterWord": ''
		}, {
			"prevWord": '{uRate}',
			"inputData": {
				"type": 'text',
				"name": 'uRate',
                "value": uRate.substr(0,uRate.indexOf(' kbit/s')),
			    "checkDemoFunc":["checkNum",'0','100000']
            },
			"afterWord": 'Kbit/s <=='
		},{
			"prevWord": '{dRate}',
			"inputData": {
				"type": 'text',
				"name": 'dRate',
                "value": dRate.substr(0,dRate.indexOf(' kbit/s')),
			    "checkDemoFunc":["checkNum",'0','100000']
            },
			"afterWord": 'Kbit/s <=='
		},{
			"prevWord": '{effecttimes}',
			"inputData": {
				"type": 'select',
				"name": 'effecttime',
				defaultValue:effecttimes,
                "items":effecttimesArr
			},
			"afterWord": ''
		},
		{
			inputData:{
				type:'title',
				name:'{WANBroadBand}'
			}
		},


		/*{
			"prevWord": '绑定接口',
			"inputData": {
				"type": 'checkbox',
				"name": 'binding_interfaces',
				"count": (DATA.wanCount !== undefined?DATA.wanCount:4),
				defaultValue:binding_interfaces,
                "items":[
                	{name:'WAN1',value:'1'},
                	{name:'WAN2',value:'2'},
                	{name:'WAN3',value:'3'},
                	{name:'WAN4',value:'4'},
                ]
			},
			"afterWord": ''
		}*/
		];

		var wans ="<tr data-for-wanbb='true'><td></td><td colspan='3'><span style='margin-right:100px' >上行带宽</span><span style='margin-right:140px'></span><span style='margin-right:12px' data-local=''>下行带宽</span><span style='margin-right:181px'></span><span></span></td></tr>";
		RateArr1 = new Array("自定义","512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M", "1000M");
		RateArrValue1 = new Array("","512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000", "1000000");

		var count = (DATA["wanCount"] == 0?'1':DATA["wanCount"]);
		//var data=DATA["MultiPath"];

		for(var i=1;i<=count;i++){

				wans += "<tr data-for-wanbb='true'>"+
							"<td>"+
								"WAN"+i+'<span class="u-necessary" style="margin-left:5px">*</span>'+
							"</td>"+
							"<td colspan='4'>"+
								"<input name='txBand"+i+"' value='"+txBandDataUp[i]+"' temTag='1'   data-from='choosenRate' style='width:100px;margin-right:10px' type='text'/><span>Kbit/s  <==</span>"+
								"<select name='demoselect"+i+"' data-tag='1' style='width:90px;margin-right:10px;margin-left:10px' class='choosenRate' >"+
									getRateOptions(RateArr1 ,RateArrValue1 )+
								"</select>"+

								"<input name='rxBand"+i+"' value='"+txBandDataDown[i]+"' temTag='2' data-from='choosenRate' style='width:90px;margin-right:10px' type='text'/><span>Kbit/s  <==</span>"+
								"<select name='demoselect"+i+"' data-tag='2' style='width:90px;margin-right:10px;margin-left:10px' class='choosenRate' >"+
									getRateOptions(RateArr1 ,RateArrValue1 )+
								"</select>"+

							"</td>"+
						"</tr>";

		}
		wans += "<tr data-for-wanbb='true'><td></td><td colspan='3' data-local='({range1})({range2})' ></td></tr>";
		function getRateOptions(_r,_d){
			var str = '';
			var lengths = _r.length;
			for(var i = 0;i<lengths;i++){
				str += "<option value='"+_d[i]+"'>"+_r[i]+"</option>";
			}
			return str;
		}
		// 获得输入框组的html
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		
		/* 
		 	修改表单中部的显示样式
		 * */
		$dom.find('tbody>tr>td:eq(1)').css({width:'170px'});
		$dom.find('[name="lkcl"][value="1"],[name="policy"][value="2"]').next().css('margin-right','0px');
	
		$dom.find('tbody').append(wans);
		
		/* WAN口宽带切换 */
		
		$dom.find('tr[data-for-wanbb]').addClass('u-hide');
		var wanval = $dom.find('[data-local="{WANBroadBand}"]').text();
		var $newlink = $('<a class="u-inputLink" data-local="'+wanval+'">'+wanval+'</a>');
		$dom.find('[data-local="{WANBroadBand}"]').parent().empty().append($newlink);
		
		$newlink.click(function(){
			if($dom.find('tr[data-for-wanbb]').eq(0).hasClass('u-hide')){
				$dom.find('tr[data-for-wanbb]').removeClass('u-hide');
			}else{
				$dom.find('tr[data-for-wanbb]').addClass('u-hide');
			}
			
		})
		
		// 增加新模块
		$dom.find('[name="orgShow"]').after('<input type="text" class="u-hide" value="'+orgType+'" name="orgType" />');
		$dom.find('[name="orgShow"]').after('<input type="text"  class="u-hide" value="'+orgData+'" name="orgData" />');
		$dom.find('[name="orgShow"]').after('<input type="text"  class="u-hide" value="'+orgIp+'" name="orgIp" />');

		$dom.find('[name="uRate"]').parent().next().append('<select name="urate_select"><option value="">自定义</option></select>');
		$dom.find('[name="dRate"]').parent().next().append('<select name="drate_select"><option value="">自定义</option></select>');



		/* 增加交互事件 */
		// 改变带宽select函数
		$dom.find('.choosenRate').change(function(){
			var $t = $(this);
			if($t.val()){
				if($t.attr("data-tag")==2){
					$t.prevAll('input[data-from="choosenRate"]'&&'input[temTag="2"]').val($t.val()).trigger('focus').trigger('blur');
				}else{
					$t.prevAll('input[data-from="choosenRate"]').val($t.val()).trigger('focus').trigger('blur');
				}
			}else{
				if($t.attr("data-tag")==2){
					$t.prevAll('input[data-from="choosenRate"]'&&'input[temTag="2"]').val(0).trigger('focus').trigger('blur');
				}else{
					$t.prevAll('input[data-from="choosenRate"]').val(0).trigger('focus').trigger('blur');
				}
			}
		});
		$dom.find('[data-from="choosenRate"]').focus(function(){
			$(this).attr('oldval',$(this).val());
		})
		$dom.find('[data-from="choosenRate"]').blur(function(){
			if($(this).val() != $(this).attr('oldval')){
				$(this).nextAll('.choosenRate[data-tag="'+$(this).attr('temtag')+'"]').val('');
			}
			$(this).removeAttr('oldval');
			
		});
		//添加输入是否合法函数
		for(var i = 1;i<=count;i++){
			$dom.find('[name="txBand'+i+'"]').checkdemofunc('checkNum','0','1000000');
			$dom.find('[name="rxBand'+i+'"]').checkdemofunc('checkNum','0','1000000');
		}

		//适用用户
		$dom.find('[name="orgShow"]').click(function(){
				var datass = {
					//保存回调
					saveClick:function(saveData){
						if (saveData.applyTypeStr == "ip"){
							$dom.find('[name="orgShow"]').val(saveData.ipStr);
							$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
							$dom.find('[name="orgData"]').val('');
							$dom.find('[name="orgIp"]').val(saveData.ipStr);
						}
						else if (saveData.applyTypeStr == "org"){
							$dom.find('[name="orgShow"]').val(saveData.showName);
							$dom.find('[name="orgType"]').val(saveData.applyTypeStr);
							$dom.find('[name="orgData"]').val(saveData.checkIdStr);
							$dom.find('[name="orgIp"]').val('');
						}
						else{
							$dom.find('[name="orgShow"]').val(T('alluser'));
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

		//上传下载浏览交互
		var RateArr = new Array("不限制","64K", "128K", "256K", "512K", "1M", "1.5M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "12M", "13M", "14M", "15M", "16M", "17M", "18M", "19M", "20M", "25M", "30M", "35M", "40M", "45M", "50M", "90M", "100M");
		var RateArrValue = new Array("0","64", "128", "256", "512", "1000", "1500", "2000", "3000", "4000", "5000", "6000", "7000", "8000", "9000", "10000", "11000", "12000", "13000", "14000", "15000", "16000", "17000", "18000", "19000", "20000", "25000", "30000", "35000", "40000", "45000", "50000", "90000", "100000");
		RateArr.forEach(function(obj,i){
			$dom.find('[name="urate_select"],[name="drate_select"]').append('<option value="'+RateArrValue[i]+'">'+obj+'</option>');
		});


		$dom.find('[name="urate_select"]').change(function(){
			var $t = $(this);
			if($t.val() !== ''){
				$dom.find('[name="uRate"]').val($t.val());
			}

		});
		$dom.find('[name="drate_select"]').change(function(){
			var $t = $(this);
			if($t.val() !== ''){
				$dom.find('[name="dRate"]').val($t.val());
			}

		});

		$dom.find('[name="uRate"]').keyup(function(){
			var $t = $(this);
			$dom.find('[name="urate_select"]').val('');

		});
		$dom.find('[name="dRate"]').keyup(function(){
			var $t = $(this);
			$dom.find('[name="drate_select"]').val('');

		});
		//添加时间计划小按钮
		var btnList = [
			{
				id :'addTimePlan',
				name:'{add}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').addModal($dom.find('[name="effecttime"]'));
				}
			},
			{
				id :'editTimePlan',
				name:'{edit}',
				clickFunc:function($btn){
					require('P_plugin/TimePlan').editModal($dom.find('[name="effecttime"]'));
				}
			}
		];
		InputGroup.insertLink($dom,'effecttime',btnList);


		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		            // $btn 是模块自动传入的，一般不会用到
		            savefunc(type,$con);
		        }
		    },
		    {
		        "id"        : 'reset',
		        "name"      : '{reset}',
		        "clickFunc" : function($btn){

		        }
		    },
		    {
		        "id"        : 'back',
		        "name"      : '{back}',
		        clickFunc:function($btn){
		        	displayTable();
		        }
		    }
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');

		$('#1').append($dom,$btnGroup);
		Translate.translate([$dom,$btnGroup],dicArr);

	}

	/**
	 * 保存方法
	 * @param {Object} type
	 * @param {Object} $con
	 */
	function savefunc(type,$con){
	    var InputGroup = require('InputGroup');
	    var len = InputGroup.checkErr($con);
	    if (len > 0) {
		return;
	    }


		var SRLZ = require('Serialize');
		var strs = SRLZ.getQueryStrs($con);
		var jsons = SRLZ.queryStrsToJson(strs);

		if(type == 'add' && jsons.order <= DATA.GroupNames.length){
			Tips.showConfirm(T('Execution_order_Tip'),function(){
				 realSaveFunc();
			});
		}
		else if(type == 'edit' && jsons.oldorder != jsons.order && jsons.order <= DATA.GroupNames.length){
			Tips.showConfirm(T('Execution_order_Tip'),function(){
				 realSaveFunc();
			});
		}else{
			realSaveFunc();
		}

		function realSaveFunc(){
			jsons.action = type;
				jsons.status = jsons.Allows;
				jsons.GroupName = jsons.GroupNames;
				jsons.execute_order = jsons.order;
				jsons.applyTypeStr = jsons.orgType;
				if(jsons.applyTypeStr == 'org'){
					jsons.data = jsons.orgData;
				}else if(jsons.applyTypeStr == 'ip'){
					jsons.data = jsons.orgIp;
				}
				//console.log(jsons);

				var newstrs = SRLZ.queryJsonToStr(jsons);

				var newname = jsons.GroupName;
				var oldname = '';
				var olddataarr = DATA['tableData'].getSelect({order:jsons.order});
				if(olddataarr.length >0){
						oldname = olddataarr[0].GroupNames;
					}
				if(type == 'edit' && jsons.oldorder <= jsons.order){
					var highToLowDataArr = DATA['tableData'].getSelect({order:(Number(jsons.order)+1)});
					if(highToLowDataArr.length > 0){
						oldname = highToLowDataArr[0].GroupNames;
					}else{
						oldname = '';
					}
				}
				var newstr2 = "oldname="+oldname+"&newname="+newname;
				var reqstr = newstrs+'&'+newstr2;
				//console.log(reqstr);

					$.ajax({
						url: 'goform/formGroupConfig',
						type: 'POST',
						data: reqstr,
						success: function(result) {
							var doEval = require('Eval');
							var codeStr = result,
								variableArr = ['status','errorstr'],
								result = doEval.doEval(codeStr, variableArr),
								isSuccess = result["isSuccessful"];
							// 判断代码字符串执行是否成功
							if (isSuccess) {
								var data = result["data"],
									status = data["status"];
								if (status) {
									// 显示成功信息
									Tips.showSuccess(T('saveSuccess'));
									displayTable();
								} else {
									var errorStr = data["errorstr"];
									Tips.showWarning(T('saveFail') + errorStr);
								}

							} else {
								Tips.showWarning(T('parseStrErr'));
							}
						}
					});

				var pStr ="";

				DATA.rxBands.forEach(function(item,index,arr){
					pStr += "&txBand"+(index)+"="+jsons['txBand' + index]+"&rxBand"+(index)+"="+jsons['rxBand' + index];
				});

			$.ajax({
				url: '/goform/formConfigSmartQos',
				type: 'POST',
				data: pStr,
				success: function(result) {
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status', 'errorstr'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					if (isSuccess) {
						var data = result["data"],
							status = data['status'];
						if (status) {


						} else {
							Tips.showWarning('{saveFail}', 2);
						}
					} else {
						Tips.showWarning('{netErr}', 2);
					}
				}
			});

		}
	}


	/**
	*  删除方法
	*/
	function deletFunc(dataArr){
		var delestr = 'delstr=';
		dataArr.forEach(function(obj){
			delestr += obj.GroupNames+",";
		});
		delestr = delestr.substr(0,delestr.length-1);
		//console.log(delestr);
		$.ajax({
			url: 'goform/formGroupConfigDel',
			type: 'POST',
			data: delestr,
			success: function(result) {

				var doEval = require('Eval');
					var codeStr = result,
						variableArr = ['status','errorstr'],
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if (isSuccess) {
						var data = result["data"],
							status = data["status"];
						if (status) {
							// 显示成功信息
							Tips.showSuccess(T('delSuccess'));
							displayTable();
						} else {
							var errorStr = data["errorstr"];
							Tips.showWarning(T('delFail') + errorStr);
						}

					} else {
						Tips.showWarning(T('parseStrErr'));
					}
			}
		});

	}

});
