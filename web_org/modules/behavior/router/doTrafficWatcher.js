define(function(require, exports, module){
	require('jquery');
	module.exports = {
		display : display
	}
	/*
		页面使用的字典
	 */
	var DICS = ['common', 'doSystemState'];
	function T(_str){
		return Translate.getValue(_str, DICS);
	}
	/*
		图表数据
	 */
	var DATA = {};
	DATA.settimenum = 5000;
	var Translate = require('Translate');
	function preLoadDics(callback){
		Translate.preLoadDics(DICS, callback);
	}
	function display(){
		// 加载路径导航模板模块
        var Path = require('Path');

        var Translate = require('Translate'); 
        var dicNames = ['common', 'lanConfig']; 
        Translate.preLoadDics(dicNames, function(){ 

	        // 路径导航配置数据
	        var pathList = {
	            "prevTitle" : '系统监控',
	            "links"     : [
	                {"link" : '#/system_watcher/traffic_watcher', "title" : '流量监控'}
	            ],
	            "currentTitle" : ''
	        };
	        Path.displayPath(pathList);
	        // 加载标签页模板模块
	        var Tabs = require('Tabs');
	        // 标签页配置数据
	        var tabsList = [
	            {"id" : "1", "title" : '流量监控'}
	        ];
	        // 生成标签页，并放入页面中
	        Tabs.displayTabs(tabsList);
	        // 为第一个标签页添加点击事件
	        $('a[href="#1"]').click(function(event) {
	            preLoadDics(showPage);
	        });
	        // 手动触发第一个标签页的点击事件
	        $('a[href="#1"]').trigger('click');
        });
		
	}
	function showPage(){
//		showPath();
		/* 初始化布局 */
		initGrid();
		refreshData(false);
		GetDpiNetrafficSwitch();
//		setTimeForAjax();
	}
	function setTimeForAjax(){
		var newsettime = $('#content li.active>a[data-toggle="tab"]').attr('time-sign');
		DATA.timeoutobj =  setTimeout(function(){
			if(newsettime == $('#content li.active>a[data-toggle="tab"]').attr('time-sign')){
				refreshData(true);
			}
		},DATA.settimenum);
	}
	function showPath(){
		var Path = require('Path');
		// 加载路径导航
		var pathList = {
	  		"prevTitle" : '{flow}{watch}',
	  		"links"     : [
	  			{"link" : '#/system_watcher/traffic_watcher', "title" : '{flow}{status}'}
	  		],
	  		"currentTitle" : ''
		};
		Path.displayPath(pathList, DICS);
	}
	function initGrid(){
		var $container = $('#1');
		$container.empty();
		var TableContainer = require('P_template/common/TableContainer');
		var conhtml = TableContainer.getHTML({}),
			$tableCon = $(conhtml);
		var html = '<div id="table"></div>';
		$tableCon.append(html);
		$container.append($tableCon);
	}
	function showChart(isRefresh){
		showTable(isRefresh);
		// showFlowLineChart();
		// showFlowPieChart();
	}
	
		/* 右上角小开关*/
function displayOnOff(){
	var OnOff = require('P_plugin/OnOff');
	var $onoff = OnOff.getDom({
		prevWord:T('trafficWatch')+' :',
		afterWord:'',
		id:'checkOpen',
		defaultType:DATA["traen"] == 1?true:false,
		clickFunc:function($btn,typeAfterClick){
			var AppGloEn = (typeAfterClick == 1?'on':'off');
			var postQueryStr = 'TraGloEn='+ AppGloEn + '&type=tra';
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
//						$('.nav a[href="#1"]').trigger('click');
						setTimeout(function(){
							refreshData(true,true);
						},1000);
						refreshData(true,true);
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
	
	function refreshData(isRefresh,isHand){
		var _func = arguments.callee;
		var _url = 'common.asp?optType=DpiNetraffic';
		if(!checkUrl()){
			
		}else{
			$.ajax({
				url     : _url,
				type    : 'GET',
				success : function(data){
					storeData(data);
	//				callback();
					showChart(isRefresh);
					if(!isHand){
						setTimeForAjax();
					}
					
				},
				error   : function(){
	//				_func(true);
					setTimeForAjax()
				}
			})
		}
		
	}
	function GetDpiNetrafficSwitch(){
		var _url = 'common.asp?optType=DpiNetrafficSwitch';
		if(!checkUrl()){

		}else{
			$.ajax({
				url     : _url,
				type    : 'GET',
				success : function(result){
					eval(result);
					DATA.traen = traen;
					console.log(result);
					console.log(DATA);
					displayOnOff();
				},
				error   : function(){
				}
			})
		}

	}
	function checkUrl(){
		return /traffic_watcher/.test(window.location);
	}
	function storeData(data){
		eval('var a = ' + data);
		DATA.data = a.dpiFlow;
	}
	function showTable(isRefresh){
		var dbObj = getDatabaseObj();
		// 判断当前是否为刷新状态
		if(isRefresh){
			DATA.tableObj.refresh(dbObj);
		}else{
			var $table = getTableDom(dbObj);
			$('#table').empty().append($table);
		}
		
		
	}
	function getDatabaseObj(){
		var data = DATA.data;
		data = sortData(data);
		var arrData = [];
		var Funcs = require('P_core/Functions');
		data.forEach(function(appData, index){
			arrData.push([
				index + 1,
				appData["dpiGrpName"],
				Funcs.computeByte(parseInt(appData["dpiUspeed"])) + '/s',
				Funcs.computeByte(parseInt(appData["dpiDspeed"])) + '/s',
				Funcs.computeByte(parseInt(appData["dpiUbyte"])),
				Funcs.computeByte(parseInt(appData["dpiDbyte"]))
			]);
		});
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
		var fields   = ['ranking', 'app', 'uploadSpeed', 'downloadSpeed', 'uploadData', 'downloadData'];
		database.addTitle(fields);
		database.addData(arrData);
		return database;
	}
	function sortData(data){
		/*
		var Funcs = require('P_core/Functions');
		data = Funcs.quickSort(data, compareAppFlow);
		return data;
		*/
		var newData = data.concat().sort(function(a,b){
			return Number(b['dpiDbyte'])-Number(a['dpiDbyte']);
		});
		return newData.concat();
	}
	function compareAppFlow(currentData, nextData){
		if(currentData["dpiDbyte"] > nextData["dpiDbyte"]){
			return true;
		}else{
			return false;
		}
	}
	function getTableDom(dbObj){
		var headData = {
			btns : [
				{
					"id": 'fresh',
					"name": '刷新',
					"clickFunc" : function($btn)
					{
						refreshData(true,true);
					}
				},
				{
					"id": 'export',
					"name": '{export}',
					"clickFunc" : function($btn)
					{
					    $btn.blur();
					    if($btn.next().attr('name') == 'User_Status_Export'){
						$btn.next().remove();
					    }
					    var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="User_Status_Export" enctype="multipart/form-data"><input name="importConfig" type="file"></form>');
					    $btn.after($afterdom);
					    $afterdom[0].action ="/goform/formUserStatusExport";
					    $afterdom[0].submit();
					}
				}
			]
		};
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : dbObj,   // 表格对应的 数据库引用
			"isSelectAll" : false,      // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"{rank}" : {
					"key"  : "ranking",
					"type" : "text"
				},
				"{app}" : {
					"key"  : "app",
					"type" : "text"
//					"sort"   : 'word'
				},
				"{upload}{data}" : {
					"key"    : "uploadData",
					"type"   : "text",
					"sort"   : 'size'
				},
				"{download}{data}" : {
					"key"    : "downloadData",
					"type"   : "text",
					"sort"   : 'size'
				},
				"{upload}{speed}" : {
					"key"    : "uploadSpeed",
					"type"   : "text",
					"sort"   : 'size'
				},
				"{download}{speed}" : {
					"key"    : "downloadSpeed",
					"type"   : "text",
					"sort"   : 'size'
				}
			},
			"dicArr"         : DICS,
			"hasPagination"  : true
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				head: headData,
				table : tableSettings
			}),
			tableDom = tableObj.getDom();
		DATA.tableObj = tableObj;
		
		// 添加刷新下拉框
		var selecthtml = '<select id=""tableRefreshTime style="margin-right:5px;width:67px">'+
//							'<option value="1" >1</option>'+
							'<option value="3">3</option>'+
							'<option value="5" selected="selected">5</option>'+
							'<option value="10">10</option>'+
							'<option value="60">60</option>'+
							'<option value="manual">手动</option>'+
						'</select>';
		var $selh = $(selecthtml);
		$selh.change(function(){
			clearTimeout(DATA.timeoutobj)
			var $t = $(this);
			if($t.val() != 'manual'){
				DATA.settimenum = $t.val()*1000;
				setTimeForAjax()
			}
		});
		var $newli = $('<li style="margin-right:5px" class="utt-inline-block"></li>');
		$newli.append('<span>刷新时间：</span>');
		$newli.append($selh);
		$newli.append('<span style="margin-right:5px">秒</span>')
		tableDom.find('#btns>ul').prepend($newli);
		
		return tableDom;
	}
});
