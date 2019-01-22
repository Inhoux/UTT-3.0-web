define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
	 var dicArr = ['common','doRFT'];
	function T(_str){
	    return Translate.getValue(_str, dicArr);
	}
	
	function display($con){
		$('[href="#1"]').text(T('rf_template'));
		$con.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		$con.append($tableCon);
		
		
		$.ajax({
			type:"get",
			url:"common.asp?optType=aspOutPutApConfTempList",
			success:function(result){
				
				// 数据处理
				var pro = processData(result);
				if(!pro){
					return false;
				}
				//生成表格
				makeTable($tableCon);
			}
		});
		
	}
	
	// 处理数据
	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
			   'tmpname',  // 模板名称
			   'wlFres',   // 2.4G / 5G
			   'wlModes',  // 模式
			   'channels',  // 信道
			   'wlRates',  // 速率
			   /*'powers' ,*/
			   'manPower',// 功率
			   
		   ]; 
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   
		    var data = result["data"];
		    console.log(res);
		    // 存入数据库
		    var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
			// 存入全局变量DATA中，方便其他函数使用
			DATA["tableData"] = database;
			// 声明字段列表
			var fieldArr =[
				'ID',
				'tmpname',
				
				'wlModes',
			   	'channels',
			   	/*'powers',*/
				'manPower',
			   	
			   	'wlModes5',
			   	'channels5',
			   	/*'powers5',*/
				'manPower5',
			];
			
			var baseData = [];
			var lg = data.tmpname.length;
			for(var i = 0;i<lg;i += 2){
				baseData.push([
					Number(i)/2+1,
					data.tmpname[i].substr(0,data.tmpname[i].length-2),
					data.wlModes[i],
					data.channels[i],
					//data.powers[i],
					data.manPower[i],
					data.wlModes[i+1],
					data.channels[i+1],
					//data.powers[i+1]
					data.manPower[i+1]
				]);
				
			}
			// 将数据存入数据表中
			database.addTitle(fieldArr);
			
			database.addData(baseData);
			return true;
	}
	
	
	// 生成表格
	function makeTable($tableCon){
		// 表格上方按钮配置数据
		var btnList = [
			{
				"id": "addModal",
				"name": "{add}",
				 "clickFunc" : function($btn){
				 		editModal('add',{});
	        		}
			},
			{ 
				"id": "allDelete",
				"name": "{delete}",
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
			"dicArr" : ['common','doRFT'],
			"titles": {
				"ID"		 : {
					"key": "ID",
					"type": "text",
				},
				"{template_name}"		 : {
					"key": "tmpname",
					"type": "text"
				},
				"{mode_24G}"		 : {
					"key": "wlModes",
					"type": "text",
					"values":{
						"1":'{_11g_only}',
						"2":'{_11n_only}',
						"3":'{_11b_g_n_mix}'
					}
				},
				"{channel_24G}"		 : {
					"key": "channels",
					"type": "text",
					"filter":function(str){
						if(str =='0'){
							return '{auto}';
						}else if(str =='-1'){
							return '{Nochannel}';
						}else{
							return str;
						}
					}
				},
				"{transpower_24G}/%" : {
					"key": "manPower",
					"type": "text",
					/*"values":{
						'0':"{auto}",
						'1':'{manual}'
					}*/
				},
				"{mode_5G}"		 : {
					"key": "wlModes5",
					"type": "text",
					"values":{
						"4":'{_11_a_n_mix_only}',
						"5":'{_11_a_only}',
						"6":'{_11vht_AC_AN_A}'+' AC/AN/A',
						"7":'{_11vht_AC_AN}'+' AC/AN'
					}
				},
				"{channel_5G}"		 : {
					"key": "channels5",
					"type": "text",
					"filter":function(str){
						if(str =='0'){
							return '{auto}';
						}else if(str =='-1'){
							return '{Nochannel}';
						}else{
							return str;
						}
					}
				},
				"{transpower_5G}/%": {
					"key": "manPower5",
					"type": "text",
					/*"values":{
						'0':"{auto}",
						'1':'{manual}'
					}*/
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
								var temname = data.tmpname;
								$.ajax({
									type:"get",
									url:"common.asp?optType=getOneApConfTempEntry&tempName="+temname,
									success:function(result){
										 var doEval = require('Eval');
										 var variableArr = [
										  'wireless',  // 无线开关 true 
										  'sgi',   // 短间隔 true
										  'preamble', // 短前间隔 true
										  'wmm',  // wmm true
										  'rate',  // 无线速率 0 11 54 150 300 
										  'bw',  // 频道带宽
										  'channel', // 信道
										  'power', // 功率 0自动 1手动 
										  'manPower', // 1低 2中 3高
										  'mode', // 模式
										  'beaconPeriod',// Beacon 间隔
										  
										  'wireless5',  
										  'sgi5',   
										  'preamble5', 
										  'wmm5',  
										  'rate5',  
										  'bw5',  
										  'channel5',
										  'VHTBW', //  0 20/40  1 是 80M
										  'power5',
										  'manPower5',
										  'mode5',
										  'beaconPeriod5'
										 ]; 
									     var result = doEval.doEval(result, variableArr);
									     if (!result.isSuccessful) {
									         Tips.showError('{parseStrErr}');
									         return false;
									      }
									     
									     var newdata = result["data"];
									     newdata.tempName  = temname;
									     editModal('edit',newdata);
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
	}
	
	//新增 编辑
	function editModal(type,data){
		var data = data || {};
		var type = (type === undefined?'add':type);
		var $con = $('#1');
		$con.empty();
//		$('[href="#1"]').text(type=='add'? '{新增}':'{编辑}');
		
		var $divleft = $('<div id="divleft" style="position:relative;display:inline-block;width:350px;height:auto;"></div>');
		var $divright = $('<div id="divright" style="position:absolute;display:inline-block;width:350px;height:auto;left:400px;"></div>');
		
		$divleft.append(getLeftInputGroup(data));
		$divright.append(getRightInputGroup(data));
		$divleft.find('tr').children(':first').css('min-width','114px');
		$divright.find('tr').children(':first').css('min-width','114px');
		
		
		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		        	
		        	
		        	var IG = require('InputGroup');
		        	if(IG.checkErr($con)>0){
		        		return false;
		        	}
		            var srlz = require('Serialize');
					var arrs = srlz.getQueryArrs($con);    
					var jsons = srlz.queryArrsToJson(arrs);
					
					jsons['action'] = (type=="add"?'add':'edit');
					
					
					/* 区分2.4G 5G 数据*/
					var g5json = {};
					for(var i in jsons){
						if(i.indexOf('_5')>0){
							g5json[i.substr(0,i.length-2)] = jsons[i];
							delete jsons[i];
						}
					}

					g5json.VHTBW = jsons.VHTBW;
					g5json.name = jsons.name+"_5";
					g5json.oldName = jsons.oldName;
					g5json.action = jsons.action;
					g5json.wlFre = '1';
					
					jsons.name = jsons.name+"_4";
					jsons.wlFre = '0';
					
					if(type=='add'){
						jsons.oldName = '';
						g5json.oldName = '';
					}else{
						g5json.oldName = jsons.oldName+'_5';
						jsons.oldName = jsons.oldName+"_4";
					}
					
					var str4 = srlz.queryJsonToStr(jsons);
					var str5 = srlz.queryJsonToStr(g5json);
					
					sendAjax(str4,str5);
					
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
		        	$('[href="#1"]').trigger('click');
		        }
		    }
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
	   $con.empty().append($divleft,$divright,$btnGroup);
	   $con.find('[data-control="gjxx"]').addClass('u-hide');
	   Translate.translate([$btnGroup], dicArr);
	   
	}
	/* 
	 	2.4G
	 * */
	function getLeftInputGroup(data){
		var inputList = [
			{
				"prevWord": '{template_name}',
				"disabled":((data.tempName == 'default' || data.tempName == 'default2' || data.tempName == 'default3')?true:false),
				"inputData": {
					"type": 'text',
					"name": 'name',
					"value": data.tempName || '',
					"checkDemoFunc" : ['checkInput', 'name', '1', '9', '2']
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '',
				"display"  : false,
				"inputData": {
					"type": 'text',
					"name": 'oldName',
					"value": data.tempName ||''
				},
				"afterWord": ''
			}, 
			{
				"inputData": {
					"type": 'title',
					"name" : '2.4G' ,
				}
			},
			{
				"prevWord": '{wireless_capability}',
				"inputData": {
					"type": 'radio',
					"name": 'en_wireless',
					defaultValue:data.wireless == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_mode}',
				"inputData": {
					"type": 'select', 
					"name": 'mode',
					defaultValue:data.mode || '3',
					items:[
						{name:'{_11g_only}',value:'1'},
						{name:'{_11n_only}',value:'2'},
						{name:'{_11b_g_n_mix}',value:'3'}
					]
				},
				"afterWord": ''
			}, 
			/*{
				"prevWord": '{地区}',
				"inputData": {
					"type": 'select',
					"name": 'dq2',
					defaultValue:'1',
					items:[
						{name:'{FCC}',value:'1'},
						{name:'{ETSI}',value:'2'},
						{name:'{日本}',value:'3'}
					]
				},
				"afterWord": ''
			}, */
			{
				"prevWord": '{wireless_channel}',
				"inputData": {
					"type": 'select',
					"name": 'channel',
					defaultValue:data.channel || '0',
					items:[
						{name:'{Nochannel}',value:'-1'},
						{name:'{auto}',value:'0'},
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'},
						{name:'6',value:'6'},
						{name:'7',value:'7'},
						{name:'8',value:'8'},
						{name:'9',value:'9'},
						{name:'10',value:'10'},
						{name:'11',value:'11'},
						{name:'12',value:'12'},
						{name:'13',value:'13'},
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{channel_bandwidth}',
				"inputData": {
					"type": 'select',
					"name": 'BW',
					defaultValue:(data.bw === undefined?'3':data.bw),
					items:[
						{name:'20M',value:'0'},
						{name:'40M',value:'3'},
						{name:'20/40M自动',value:'1'},
						//{name:'40M',value:'40'}
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{wireless_rate}',
				"inputData": {
					"type": 'select',
					"name": 'rate',
					defaultValue:data.rate || '0',
					items:[
						{name:'{auto}',value:'0'},
						{name:'11M',value:'11'},
						{name:'54M',value:'54'},
						{name:'150M',value:'150'},
						{name:'300M',value:'300'}
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{wireless_transpower}',
				display:false,
				"inputData": {
				"type": 'text',
				"name": 'power',
				"value":'1'
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_transpower}',
				"inputData": {
					"type": 'text',
					"name": 'manual',
					"value": data.manPower || '100',
					"checkDemoFunc":["checkNum","1","100",'int']
				},
				"afterWord": '%(1~100)'
			},

			{
				"prevWord": '{beacon_interval}',
				"inputData": {
					"type": 'text',
					"name": 'BeaconPeriod',
					"value": data.beaconPeriod || '100',
					"checkDemoFunc":["checkNum","20","999",'int']
					
				},
				"afterWord": 'ms'
			},
			/*{
				"prevWord": '{最大客户数量}',
				"inputData": {
					"type": 'text',
					"name": 'zdkhsl2',
					value:'128',
				},
				"afterWord": ''
			},*/
			{
				"prevWord": '',
				"inputData": {
					"type": 'text',
					"name": 'gjxx',
					value:'',
				},
				"afterWord": ''
			},
			
			{
				"sign"    :'gjxx',
				"prevWord": 'WMM',
				"inputData": {
					"type": 'radio',
					"name": 'wmm',
					defaultValue:data.wmm == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '{short_interval}',
				"inputData": {
					"type": 'radio',
					"name": 'SGI',
					defaultValue:data.sgi == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '{short_number}',
				"inputData": {
					"type": 'radio',
					"name": 'preamble',
					defaultValue:data.preamble == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			}
			/*{
				"sign"    :'gjxx',
				"prevWord": '干扰免疫级别',
				"inputData": {
					"type": 'select',
					"name": 'grmyjb2',
					defaultValue:'1',
					items:[
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '信道切换通告次数',
				"inputData": {
					"type": 'select',
					"name": 'xdqhtgcs2',
					defaultValue:'1',
					items:[
						{name:'0',value:'0'},
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'},
						{name:'6',value:'6'},
						{name:'7',value:'7'},
						{name:'8',value:'8'},
						{name:'9',value:'9'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '后台频谱监测',
				"inputData": {
					"type": 'radio',
					"name": 'htppjc2',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				inputData:{
					type:'title',
					name:'客户端控制'
				}
			},
			{
				"sign"    :'gjxx',
				"prevWord": '频段切换模式',
				"inputData": {
					"type": 'select',
					"name": 'pdqhms',
					defaultValue:'1',
					items:[
						{name:'{优选5G赫兹}',value:'1'},
						{name:'{强制5G赫兹}',value:'2'},
						{name:'{已禁用}',value:'3'},
						{name:'{频段平衡}',value:'4'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '空口公平模式',
				"inputData": {
					"type": 'select',
					"name": 'kkgpms',
					defaultValue:'1',
					items:[
						{name:'{优选接入}',value:'1'},
						{name:'{公平接入}',value:'2'},
						{name:'{默认接入}',value:'3'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '后台频谱监测',
				"inputData": {
					"type": 'radio',
					"name": 'htppph',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'SLB计算间隔',
				"inputData": {
					"type": 'text',
					"name": 'SLBjsjg',
					value:''
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'SLB邻居匹配',
				"inputData": {
					"type": 'text',
					"name": 'SLBljpp',
					value:''
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'SLB阀值',
				"inputData": {
					"type": 'text',
					"name": 'SLBfz',
					value:''
				},
				"afterWord": ''
			}*/
		];
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		
		$dom.find('[name="gjxx"]').parent().prev().empty().append('<a class="u-inputLink" id="gjxxa" style="cursor:pointer">'+T('advanced_options')+'</a>');
		$dom.find('[name="gjxx"]').css('visibility','hidden');
		
		$dom.find('#gjxxa').click(function(){
			if($(this).hasClass('gjxx-active')){
				$(this).removeClass('gjxx-active');
				$(this).text(T('advanced_options'));
				$('#1').find('[data-control="gjxx"]').addClass('u-hide');
				
			}else{
				$(this).addClass('gjxx-active');
				$(this).text(T('hide_advanced_options'));
				$('#1').find('[data-control="gjxx"]').removeClass('u-hide');
			}
		});
		
		/*$dom.find('[name="power"]').css('width','75px');
		$dom.find('[name="power"]').after('<select name="manual" class="u-hide" style="width:75px;margin-left:10px"><option value="3">'+T('high')+'</option><option value="2">'+T('middle')+'</option><option value="1">'+T('low')+'</option></select>');
		$dom.find('[name="manual"]').children('option[value="'+(data.manPower||'1')+'"]').attr('selected','selected');
		$dom.find('[name="power"]').change(function(){
			makewxcsgl2Chaneg();
		});
		makewxcsgl2Chaneg();
		function makewxcsgl2Chaneg(){
			if($dom.find('[name="power"]').val() == '1'){
				$dom.find('[name="manual"]').removeClass('u-hide');
			}else{
				$dom.find('[name="manual"]').addClass('u-hide');
			}
			
		}*/
		
		/* 模式 与无线速率的交互*/
		var $mode = $dom.find('[name="mode"]');
		var $c_0 = $dom.find('[name="rate"]').children('[value="0"]');
		var $c_11 = $dom.find('[name="rate"]').children('[value="11"]');
		var $c_54= $dom.find('[name="rate"]').children('[value="54"]');
		var $c_150 = $dom.find('[name="rate"]').children('[value="150"]');
		var $c_300 = $dom.find('[name="rate"]').children('[value="300"]');
		var g24arr = [$c_0,$c_11,$c_54,$c_150,$c_300];
		var $rate = $dom.find('[name="rate"]');
		
		var $bw_40 = $dom.find('[name="BW"]').children('[value="3"]');
		var $bw_2040 = $dom.find('[name="BW"]').children('[value="1"]');
		var $bw = $dom.find('[name="BW"]');
		
		makeModeChange()
		$mode.change(function(){
			makeModeChange()
		});
		function makeModeChange(){
			var modval = $mode.val();
			if(modval == '1'){
				rmd([$c_0,$c_54]);
				$bw_40.hide();
				$bw_2040.hide();
				$bw.val('0');
			}else if(modval == '2'){
				rmd([$c_0,$c_150,$c_300]);
				$bw_40.show();
				$bw_2040.show();
			}else if(modval == '3'){
				rmd([$c_0]);
				$bw_40.show();
				$bw_2040.show();
			}
		}
		
		function rmd(arr){
			var rateval = $rate.val();
			var changeval = false;
			g24arr.forEach(function(arrobj){
				if(arr.indexOf(arrobj)>=0){
					arrobj.removeAttr('disabled');
					
				}else{
					arrobj.attr('disabled','disabled');
					if(rateval == arrobj.val()){
						changeval = true;
					}
				}
				if(changeval){
					$rate.val($rate.children(':not([disabled])').eq(0).val());
				}
			});
			
		}
		
		Translate.translate([$dom], dicArr);
		return $dom;
	}
	/*5G*/
	function getRightInputGroup(data){
		var inputList = [{
			"inputData": {
				"type": 'text',
				"name": 'hides',
				"value": ''
			},
			"afterWord": ''
		}, {
			"inputData": {
				"type": 'title',
				"name" : '5G' ,
			},
		},
		{
				"prevWord": '{wireless_capability}',
				"inputData": {
					"type": 'radio',
					"name": 'en_wireless_5',
					defaultValue:data.wireless5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_mode}',
				"inputData": {
					"type": 'select',
					"name": 'mode_5',
					defaultValue:data.mode5 || '6',
					items:[
						{name:'{_11_a_n_mix_only}',value:'5',control:'mode_no'},
						{name:'{_11_a_only}',value:'4',control:'mode_no'},
						{name:'{_11vht_AC_AN_A}'+' AC/AN/A',value:'6',control:'mode_ok'},
						{name:'{_11vht_AC_AN}'+' AC/AN',value:'7',control:'mode_ok'}
					]
				},
				"afterWord": ''
			}, 
			/*
			{
				"sign"	  : 'mode_ok',
				"prevWord": '{channel_bandwidth_VHT}',
				"inputData": {
					"type": 'select',
					"name": 'VHTBW',
					defaultValue:data.VHTBW || '0',
					items:[
						{name:'20/40',value:'0'},
						{name:'80M',value:'1'},
					]
				},
				"afterWord": ''
			}, 
			*/
			/*{
				"prevWord": '{地区}',
				"inputData": {
					"type": 'select',
					"name": 'dq5',
					defaultValue:'1',
					items:[
						{name:'{FCC}',value:'1'},
						{name:'{ETSI}',value:'2'},
						{name:'{日本}',value:'3'}
					]
				},
				"afterWord": ''
			},*/
			{
				"prevWord": '{wireless_channel}',
				"inputData": {
					"type": 'select',
					"name": 'channel_5',
					defaultValue:data.channel5 || '0',
					items:[
						{name:'{Nochannel}',value:'-1'},
						{name:'{auto}',value:'0'},
						{name:'36',value:'36'},
						{name:'40',value:'40'},
						{name:'44',value:'44'},
						{name:'48',value:'48'},
						{name:'52',value:'52'},
						{name:'56',value:'56'},
						{name:'60',value:'60'},
						{name:'64',value:'64'},
						{name:'149',value:'149'},
						{name:'153',value:'153'},
						{name:'157',value:'157'},
						{name:'161',value:'161'},
						{name:'165',value:'165'},
						
					]
				},
				"afterWord": ''
			}, 
			{
				"prevWord": '{channel_bandwidth}',
				"inputData": {
					"type": 'select',
					"name": 'BW_5',
					defaultValue:(data.bw5 == undefined?'2':data.bw5),
					items:[
						{name:'20M',value:'0'},
						{name:'40M',value:'3'},
						{name:'20/40M自动',value:'1'},
						{name:'80M',value:'2'}
					]
				},
				"afterWord": ''
			}, 
			/*{
				"prevWord": '{无线速率}',
				"inputData": {
					"type": 'select',
					"name": 'wxsl5',
					defaultValue:'auto',
					items:[
						{name:'{自动}',value:'auto'},
						{name:'11M',value:'11'},
						{name:'54M',value:'54'},
						{name:'150M',value:'150'},
						{name:'300M',value:'300'}
					]
				},
				"afterWord": ''
			},*/
			{
				"prevWord": '{wireless_transpower}',
				display:false,
				"inputData": {
				"type": 'text',
				"name": 'power_5',
				"value":'1'
				},
				"afterWord": ''
			},
			{
				"prevWord": '{wireless_transpower}',
				"inputData": {
					"type": 'text',
					"name": 'manual_5',
					"value": data.manPower5 || '100',
					"checkDemoFunc":["checkNum","1","100",'int']
				},
				"afterWord": '%(1~100)'
			},

			{
				"prevWord": '{beacon_interval}',
				"inputData": {
					"type": 'text',
					"name": 'BeaconPeriod_5',
					"value":data.beaconPeriod5 || '100',
					"checkDemoFunc":["checkInput","num","20","999"]
				},
				"afterWord": 'ms'
			},
			{   "sign"    : 'mode_no',
				"prevWord": '',
				"inputData": {
					"type": 'text',
					"name":'for_mode_no',
					'value':''
				},
				"afterWord": ''
			},
			/*{
				"prevWord": '{最大客户数量}',
				"inputData": {
					"type": 'text',
					"name": 'zdkhsl5',
					value:'128',
				},
				"afterWord": ''
			},*/
			
            {
			    "sign"    : 'mode_ok',
				"prevWord": '',
				"inputData": {
					"type": 'text',
					"name": 'gjxx',
					value:'',
				},
				"afterWord": ''
			},
			{
				"prevWord": '',
				"inputData": {
					"type": 'text',
					"name": 'gjxx',
					value:'',
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": 'WMM',
				"inputData": {
					"type": 'radio',
					"name": 'wmm_5',
					defaultValue:data.wmm5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '{short_interval}',
				"inputData": {
					"type": 'radio',
					"name": 'SGI_5',
					defaultValue:data.sgi5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '{short_number}',
				"inputData": {
					"type": 'radio',
					"name": 'preamble_5',
					defaultValue:data.preamble5 == false?'0':'1',
					items:[
						{name:'{open}',value:'1'},
						{name:'{close}',value:'0'}
					]
				},
				"afterWord": ''
			}
			/*{
				"sign"    :'gjxx',
				"prevWord": '干扰免疫级别',
				"inputData": {
					"type": 'select',
					"name": 'grmyjb5',
					defaultValue:'1',
					items:[
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '信道切换通告次数',
				"inputData": {
					"type": 'select',
					"name": 'xdqhtgcs5',
					defaultValue:'1',
					items:[
						{name:'0',value:'0'},
						{name:'1',value:'1'},
						{name:'2',value:'2'},
						{name:'3',value:'3'},
						{name:'4',value:'4'},
						{name:'5',value:'5'},
						{name:'6',value:'6'},
						{name:'7',value:'7'},
						{name:'8',value:'8'},
						{name:'9',value:'9'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '后台频谱监测',
				"inputData": {
					"type": 'radio',
					"name": 'htppjc5',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				inputData:{
					type:'title',
					name:'接入点控制'
				}
			},
			{
				"sign"    :'gjxx',
				"prevWord": '定制有效信道',
				"inputData": {
					"type": 'radio',
					"name": 'dzyxxd',
					defaultValue:'0',
					items:[
						{name:'{开启}',value:'1'},
						{name:'{关闭}',value:'0'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '最小传输功率',
				"inputData": {
					"type": 'select',
					"name": 'zxcsgl',
					defaultValue:'max',
					items:[
						{name:'3',value:'3'},
						{name:'6',value:'6'},
						{name:'9',value:'9'},
						{name:'12',value:'12'},
						{name:'15',value:'15'},
						{name:'18',value:'18'},
						{name:'21',value:'21'},
						{name:'24',value:'24'},
						{name:'27',value:'27'},
						{name:'30',value:'30'},
						{name:'33',value:'33'},
						{name:'最大值',value:'max'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '最大传输功率',
				"inputData": {
					"type": 'select',
					"name": 'zdcsgl',
					defaultValue:'max',
					items:[
						{name:'3',value:'3'},
						{name:'6',value:'6'},
						{name:'9',value:'9'},
						{name:'12',value:'12'},
						{name:'15',value:'15'},
						{name:'18',value:'18'},
						{name:'21',value:'21'},
						{name:'24',value:'24'},
						{name:'27',value:'27'},
						{name:'30',value:'30'},
						{name:'33',value:'33'},
						{name:'最大值',value:'max'}
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '客户端侦知',
				"inputData": {
					"type": 'radio',
					"name": 'khdzz',
					defaultValue:'0',
					items:[
						{name:'开启',value:'1'},
						{name:'关闭',value:'0'},
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '扫描',
				"inputData": {
					"type": 'radio',
					"name": 'sm',
					defaultValue:'0',
					items:[
						{name:'开启',value:'1'},
						{name:'关闭',value:'0'},
					]
				},
				"afterWord": ''
			},
			{
				"sign"    :'gjxx',
				"prevWord": '宽信道频段',
				"inputData": {
					"type": 'radio',
					"name": 'kxdpd',
					defaultValue:'0',
					items:[
						{name:'开启',value:'1'},
						{name:'关闭',value:'0'},
					]
				},
				"afterWord": ''
			}*/
		];
		var InputGroup = require('InputGroup'),
		$dom = InputGroup.getDom(inputList);
		
		$dom.find('[name="for_mode_no"]').parent().css('height','30px');
		$dom.find('[name="for_mode_no"]').remove();
		
		$dom.find('[name="hides"]').css({'visibility':'hidden'});
		$dom.find('[name="gjxx"]').css({'visibility':'hidden'});
		
		/*$dom.find('[name="power_5"]').css('width','75px');
		$dom.find('[name="power_5"]').after('<select name="manual_5" class="u-hide" style="width:75px;margin-left:10px"><option value="3">'+T('high')+'</option><option value="2">'+T('middle')+'</option><option value="1">'+T('low')+'</option></select>');
		$dom.find('[name="manual_5"]').children('option[value="'+(data.manPower5||'1')+'"]').attr('selected','selected');
		$dom.find('[name="power_5"]').change(function(){
			makewxcsgl2Chaneg();
		});
		makewxcsgl2Chaneg();
		function makewxcsgl2Chaneg(){
			if($dom.find('[name="power_5"]').val() == '1'){
				$dom.find('[name="manual_5"]').removeClass('u-hide');
			}else{
				$dom.find('[name="manual_5"]').addClass('u-hide');
			}
			
		}
		*/
				
		$dom.find('[name="mode_5"]').change(function(){
			makew80MChaneg();
		});
		makew80MChaneg();
		function makew80MChaneg(){
			var $bw5 = $dom.find('[name="BW_5"]');
			var $_0 = $dom.find('[name="BW_5"]').children('[value="0"]');
			var $_3 = $dom.find('[name="BW_5"]').children('[value="3"]');
			var $_1 = $dom.find('[name="BW_5"]').children('[value="1"]');
			var $_2 = $dom.find('[name="BW_5"]').children('[value="2"]');
			if($dom.find('[name="mode_5"]').val() == '5'){
				if($bw5.val() == '2'){
					$bw5.val('1');
				}
				$_0.show();
				$_3.show();
				$_1.show();
				$_2.hide();
				
			}else if($dom.find('[name="mode_5"]').val() == '4'){
				$bw5.val('0');
				$_0.show();
				$_3.hide();
				$_1.hide();
				$_2.hide();
			}
			else{
//				$bw5.val('2');
				$_0.show();
				$_3.show();
				$_1.show();
				$_2.show();
			}
		}
		
		Translate.translate([$dom], dicArr);
		return $dom;
	}
	
	
	function sendAjax(datestr4,datestr5){
		
		$.ajax({
			type:"post",
			url:"/goform/formConfigApConfTemp",
			data:datestr4,
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
				    	$.ajax({
							type:"post",
							url:"/goform/formConfigApConfTemp",
							data:datestr5,
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
								    		//Tips.showSuccess('{saveSuccess}');
								    		Tips.showConfirm('保存成功'+'</br>' +'请到:“无线扩展->设备管理->批量管理->射频设置”进行下发才能生效'+'</br>'+'是否立即前往？',function(){
								    			$('#sidebar').find('a[href="#/wifi_config/equipment_management"]').parent().trigger('click');
								    			if(!$('#sidebar').find('a[href="#/wifi_config/equipment_management"]').parent().parent().hasClass('realon')){
								    				$('#sidebar').find('a[href="#/wifi_config/equipment_management"]').parent().parent().prev().trigger('click');
								    			}
												
								    		})
								    		//Tips.showInfo('保存成功'+'</br>' +'请到:“无限扩展->设备管理->批量管理->射频设置”进行下发才能生效',10);
								    		$('[href="#1"]').trigger('click');
								    }else{
								    	Tips.showError(data.errorstr);
								    }
								}
							}
						});
				    }else{
				    	Tips.showError(data.errorstr);
				    }
				}
			}
		});
	}
	
	/* 删除接口 */
	function deleteStr(arr){
		if(arr.length>0){
			var delstr = 'delstr=';
			arr.forEach(function(obj){
				delstr += obj.tmpname+'_4,'+obj.tmpname+'_5,';
			});
			delstr.substr(0,delstr.length-1);
			$.ajax({
				type:"post",
				url:"goform/formApConfTempDel",
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
					    		$('[href="#1"]').trigger('click');
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
