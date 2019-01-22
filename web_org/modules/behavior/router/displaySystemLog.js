define(function(require, exports, module) {
	require('jquery');
	var DATA = {};

	  function tl(str){
	    return require('Translate').getValue(str,['common','doSyslog']);
	  }
	/**
	 * 解析数据至数组形态
	 */
	function splitDatas(str){
		if(str == undefined || str == ''){
			return false;
		}
		//以默认分割符分割
		var arr1 = str.split('\n');
		if(arr1[arr1.length-1] == ''){
			arr1.pop();
		}
		//以空格分隔每一行数据，并去除无用部分
		var arr2 = [];
		var id_count = 0;
		arr1.forEach(function(obj,i){
			id_count++;
			var larr = obj.split(' ');
			console.log(larr)
//			larr.shift();
//			larr.splice(2,1);
			//解析日期部分
			
//			var month = 1;
			/*
			switch(larr[1]){
				case 'Jan':month = 1;break;
				case 'Feb':month = 2;break;
				case 'Mar':month = 3;break;
				case 'Apr':month = 4;break;
				case 'May':month = 5;break;
				case 'Jun':month = 6;break;
				case 'Jul':month = 7;break;
				case 'Aug':month = 8;break;
				case 'Sep':month = 9;break;
				case 'Oct':month = 10;break;
				case 'Nov':month = 11;break;
				case 'Dec':month = 12;break;
				default:month = 1;break;
			}
			*/
//			dates = month+dates;
//			dates = larr[1]+dates;
			
			//重组数组
			var newlarr = [];
			var dates = (larr[1]||'')+' / '+(larr[3]||'')+" "+(larr[4]||'');
			var loglevel = (larr[0]||'');
			var logtype = (larr[5]||'').substr(0,(larr[5]||'').length-1);
			var loginfo = (larr[6]||'')+' '+(larr[7]||'')+' '+(larr[8]||'')+' '+(larr[9]||'');
			
			newlarr.push(id_count,dates,loglevel,logtype,loginfo);
//			larr.splice(0,5);
//			var innerstr = ''; 
//			larr.forEach(function(inner,j){
//				if(inner != ''){
//					innerstr += (inner+" ");
//				}
//			});
//			innerstr.substr(0,innerstr.length-1);
//			newlarr.push(innerstr);
			arr2.push(newlarr);
		});
		return arr2;
	}

	function display($container) {
		// 清空标签页容器
		$container.empty();
		 var tips = require('Tips');
		  $.ajax({
	       url: '/goform/SysLogMess',
	       type: 'get',
	       success: function(result) {
		        var arrs = splitDatas(result);
		        if(!arrs){
		        	arrs=[];
		        }
				setDatabase(arrs);
				$container.empty().append(makeTable);
	       }
	     });
		//表格数据的静态数据，本地测试使用
//		var str = "---SPLIT_LINE--- daemon.info Jan  1 00:45:07 dnsmasq-dhcp[2926]: DHCPOFFER(eth0) 192.168.10.199 00:22:aa:c8:ce:61 "+ 
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:15 dnsmasq-dhcp[2926]: DHCPDISCOVER(eth0) 00:22:aa:11:00:10 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:15 dnsmasq-dhcp[2926]: DHCPOFFER(eth0) 192.168.10.138 00:22:aa:11:00:10 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:16 dnsmasq-dhcp[2926]: DHCPDISCOVER(eth0) 00:22:aa:c8:ce:61 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:16 dnsmasq-dhcp[2926]: DHCPOFFER(eth0) 192.168.10.199 00:22:aa:c8:ce:61 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:25 dnsmasq-dhcp[2926]: DHCPDISCOVER(eth0) 00:22:aa:11:00:10 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:25 dnsmasq-dhcp[2926]: DHCPOFFER(eth0) 192.168.10.138 00:22:aa:11:00:10 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:26 dnsmasq-dhcp[2926]: DHCPDISCOVER(eth0) 00:22:aa:c8:ce:61 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:26 dnsmasq-dhcp[2926]: DHCPOFFER(eth0) 192.168.10.199 00:22:aa:c8:ce:61 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:38 dnsmasq-dhcp[2926]: DHCPDISCOVER(eth0) 00:22:aa:11:00:10 "+
//				"---SPLIT_LINE--- daemon.info Jan  1 00:45:38 dnsmasq-dhcp[2926]: DHCPOFFER(eth0) 192.168.10.138 00:22:aa:11:00:10";
//		var arrs = splitDatas(str);
//		setDatabase(arrs);
//		$container.append(makeTable);
		

	}
	
	function setDatabase(data){
		// 获取数据库模块，并建立一个数据库
		var Database = require('Database'),
			database = Database.getDatabaseObj(); // 数据库的引用
		// 存入全局变量DATA中，方便其他函数使用
		DATA["database"] = database;
		// 声明字段列表
		var fieldArr = ['id', 'time', 'level', 'type', 'content'];
		// 将数据存入数据表中
		database.addTitle(fieldArr);
		database.addData(data);
	}
	
	function makeTable(){
		// 表格上方按钮配置数据
		var btnList = [
		{
			"id": "export",
			"name": "{export}",
			 "clickFunc" : function($btn){
			 	$btn.blur();
				if($btn.next().attr('name') == 'Device_Config'){
								$btn.next().remove();
				}
				var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
				$btn.after($afterdom);
				$afterdom[0].action ="goform/SysLogMess?Action=dlf";
				$afterdom[0].submit();
			}
		}, 
		{
			"id": "refresh",
			"name": "{refresh}",
			"clickFunc" : function(){
				display($('#1'));
			}
		}, 
		{
			"id": "clean",
			"name": "{DelLog}",
			"clickFunc" : function(){
				require('Tips').showConfirm(tl('SureDelSysLog'),function(){
					$.ajax({
					    url: '/goform/DelHistorySysLog',
					    type: 'POST',
						success : function(result){
							display($('#1'));
						}
					});
				});
			}
		} 
		/*
		
		,{
			"id": "setting",
			"name": tl('allSet'),
			"clickFunc" : function(){
				var tips = require('Tips');
				$.ajax({
			    url: 'common.asp?optType=systemLogSet',
			    type: 'get',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
					variableArr = ['NoticeLogEnable',
									'ArpLogEnable',
									'DhcpLogEnable',
									'PppoeLogEnable',
									'errorstr'
								  ];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							NoticeLogEnable = data['NoticeLogEnable'],
							ArpLogEnable = data['ArpLogEnable'];
							DhcpLogEnable = data['DhcpLogEnable'];
							PppoeLogEnable = data['PppoeLogEnable'];
							errorstr = data['errorstr'];

							DATA["NoticeLogEnable"]=NoticeLogEnable;
							DATA["ArpLogEnable"]=ArpLogEnable;
							DATA["DhcpLogEnable"]=DhcpLogEnable;
							DATA["PppoeLogEnable"]=PppoeLogEnable;
							DATA["errorstr"]=errorstr;
							makeGlobalSettings(data);
					}else{
						tips.showError('{parseStrErr}');
					}
				}
			    });
		
			}
		}
		*/
		];
		var tableHeadData = {
			"btns" : btnList
		};
		var database = DATA["database"];
		// 表格配置数据
		var tableList = {
			"database": database,
			"isSelectAll" : true,
			"dicArr" :['common','doSyslog'],
			"titles": {
				"ID": {
					"key" : "id",
					"type": "text"
				},
				"{time}": {
					"key" : "time",
					"type": "text"
				},
				"{sysLogLevel}": {
					"key" : "level",
					"type": "text"
				},
				"{type}": {
					"key": "type",
					"type": "text"
				},
				"{content}": {
					"key": "content",
					"type": "text"
				}
			}
		};
		// 表格组件配置数据
		var list = {
			head: tableHeadData,
			table: tableList
		};
		// 加载表格组件，获得表格组件对象，获得表格jquery对象
		var Table = require('Table'),
			tableObj = Table.getTableObj(list),
			$table = tableObj.getDom();
		// 将表格组件对象存入全局变量，方便其他函数调用
		DATA["tableObj"] = tableObj;
		return $table;
	}
	
	/***
	 * 制作全局设置弹框
	 */
	function makeGlobalSettings(data){
		var data = data ||{};
		 	dhcpLog='off',
		 	arpLog='off',
		 	pppoeLog='off',
		 	noticeLog='off'
		data.NoticeLogEnable == 1? noticeLog='on': noticeLog='off';
		data.ArpLogEnable == 1? arpLog='on': arpLog='off';
		data.DhcpLogEnable == 1? dhcpLog='on': dhcpLog='off';
		data.PppoeLogEnable == 1? pppoeLog='on': pppoeLog='off';
  		var modalList = {
        "id"   : "modal_Gsetting",
        "title": tl('allSet'),
        "btns" : [
            {
                "type"      : 'save',
                "clickFunc" : function($this){
                    // $this 代表这个按钮的jQuery对象，一般不会用到
                    var $modal = $this.parents('.modal');
                    globalSettingSave($modal);
                }
            },
            {
                "type"      : 'reset',
                clickFunc : function($btn){
                	var $modal = $btn.parents('.modal');
                	setTimeout(function(){
                		$modal.find('[name="DhcpLog"]').prop('checked',(dhcpLog == 'on'?true:false));
	                	$modal.find('[name="NoticeLog"]').prop('checked',(noticeLog == 'on'?true:false));
	                	$modal.find('[name="ArpLog"]').prop('checked',(arpLog == 'on'?true:false));
	                	$modal.find('[name="PppoeLog"]').prop('checked',(pppoeLog == 'on'?true:false));
                	},1);
                	
                }
            },
            {
                "type"      : 'close'
            }
        ]
    };
    // 初始化模态框，并获得模态框类实例
    var Modal = require('Modal');
   	var modalObj = Modal.getModalObj(modalList);
	DATA['modalObj'] = modalObj;
	var inputList = [
			{
				inputData:{
					type:'checkbox',
					name:'allChoose',
					defaultValue:'',
					items:[
						{name:'{SelectA}',value:'on'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'DhcpLog',
					defaultValue:dhcpLog,
					items:[
						{name:'{UseDhcpLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'NoticeLog',
					defaultValue:noticeLog,
					items:[
						{name:'{UseNoticeLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'ArpLog',
					defaultValue:arpLog,
					items:[
						{name:'{UseArpLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			},
			{
				inputData:{
					type:'checkbox',
					name:'PppoeLog',
					defaultValue:pppoeLog,
					items:[
						{name:'{UsePppoeLog}',value:'on',checkOn:'on',checkOff:'off'}
					]
				}
			}
		];
	var IG = require('InputGroup');
	var $inputs = IG.getDom(inputList);
	//绑定交互事件
	var alls = $inputs.find('[name="allChoose"]').parent().parent().nextAll().find('input[type="checkbox"]');
	$inputs.find('[name="allChoose"]').click(function(){
		if($(this).is(':checked')){
			alls.prop('checked',true);
		}else{
			alls.prop('checked',false);
		}
	});
	alls.click(function(){
		$inputs.find('[name="allChoose"]').prop('checked',false);
	});
	//修改部分样式
	$inputs.find('[name="allChoose"]').parent().find('span').css({fontWeight:'bold'});
	
	
	modalObj.insert($inputs);
	modalObj.show();
	var Translate  = require('Translate');
	var tranDomArr = [$inputs,modalObj.getDom()];
	var dicArr     = ['common','doSyslog'];
	Translate.translate(tranDomArr, dicArr);	
	}
	
	function globalSettingSave($modal){
		
		var SRLZ = require('Serialize');
		var strs = SRLZ.getQueryStrs($modal);
		var tips = require('Tips');
		 $.ajax({
	      url: '/goform/SysLogInfoConfig',
	      type: 'POST',
		  data:strs,
	      success: function(result) {
	      	//处理数据
			var res = require('Eval').doEval(result,['status']);
	        var isSuccess = res["isSuccessful"];
	        if (isSuccess) {
	          var data = res["data"];
	          var isSuccessful = data["status"];
	          // 判断修改是否成功
	          if (isSuccessful) {
				tips.showSuccess('{saveSuccess}');
				DATA['modalObj'].hide();
				display($('#1'));
	          } else {
	            var errMsg = result["errorstr"];
	            tips.showWarning('{parseStrErr}');
	          }
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});