    define(function(require, exports, module){
	require('jquery');
	var Data = {};
	var DATA = {};
	var $container = $('#content');
	var controlData = {};
	DATA.UserNetworkFlowRankingTableObj = '';
	DATA.AppFlowRankingTableObj = '';
	DATA.VPNStatusTableObj = '';
	/*
		本页面使用的字典
	 */
	var DicArr = ['common', 'doSystemState'];
	function tl(str){
    	return require('Translate').getValue(str, DicArr);
  	}	
	function display(){
		var Translate = require("Translate");
		Translate.preLoadDics(DicArr, function(){
			/*
				模块控制的接口
			 */
			var _url  = 'common.asp?optType=sysInfoCtrl';
			getJsStr(_url, function(jsStr){
				var isSuccess = processModuleControlJsStr(jsStr);
				/*
					如果处理成功
				 */
				if(isSuccess){
					displayPage();
				}else{

				}
			});
		});
	}
	/* 检查是否为当前页面路径 */
	function chkurl(){
		if(window.location.href.indexOf('#')>0){
			return (new RegExp('system_watcher/system_state').test(window.location.href));
		}else{
			return true;
		}
		
		
	}
	
	
	/**
	 * 生成页面
	 * @date   2016-12-20
	 * @return {[type]}   [description]
	 */
	function displayPage(){
		$container.empty();
		/*
			显示路径导航
		 */
		showPath();
		/*
			生成属性管理器
		 */
		initGridControlDom();
		/*
			初始化所有的标签页
		 */
		initGridDom($container);
		/*
			初始化 图表包裹容器的dom
		 */
		initChartConDom();
		/*
			显示 带宽 图表
		 */
		if(controlData["bandWidth"] == '1'){
			showBandWidthChart();
		}
		/*
			显示 用户统计 图表
		 */
		if(controlData["user"] == '1'){
			//showUserStatisticsChart($container.find('#userStatistics'));
		}
		/*
			显示 系统负载 图表
		 */
		if(controlData["systemLoad"] == '1'){
			showSystemLoadChart();
		}
		/*
			显示 报警统计 图表
		 */
		if(controlData["warning"] == '1'){
			//showWarningStatisticsChart();
		}
		/*
			显示 今日应用流量排名 图表
		 */
		if(controlData["appRank"] == '1'){
			showAppFlowRankingChart();
		}
		/*
			显示 今日用户网络流量排名 图表
		 */
		if(controlData["userRank"] == '1'){
			showUserNetworkFlowRankingChart();
		}
		/*
			显示 今日访问站点排名 图表
		 */
		if(controlData["webRank"] == '1'){
			//showWebsiteRankingChart();
		}
		/*
			显示 VPN状态 图表
		 */
		if(controlData["vpn"] == '1'){
			showVPNStatusChart();
		}
	}
	/**
	 * 将模块控制的数据存入全局变量 controlData
	 * @date   2016-12-20
	 * @param  {[type]}   jsStr [description]
	 * @return {[type]}         [description]
	 */
	function processModuleControlJsStr(jsStr){
		var Eval      = require('Eval');
		var variables = ['bandwidth', 'user', 'interface', 'load', 'vpn',
						'alert', 'appTrafficRank', 'userTrafficRank', 'websTrafficRank'];
		var result    = Eval.doEval(jsStr, variables);
		var isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data = result["data"];
			/*
				带宽
			 */
			controlData["bandWidth"] = data["bandwidth"];
			/*
				用户
			 */
			controlData["user"]      = data["user"];
			/*
				vpn
			 */
			controlData["vpn"]       = data["vpn"];
			/*
				系统负载
			 */
			controlData["systemLoad"]= data["load"];
			/*
				警告
			 */
			controlData["warning"]   = data["alert"];
			/*
				app排名
			 */
			controlData["appRank"]   = data["appTrafficRank"];
			/*
				用户排名
			 */
			controlData["userRank"]  = data["userTrafficRank"];
			/*
				站点排名
			 */
			controlData["webRank"]   = data["websTrafficRank"];
			controlData["interface"] = data["interface"];
			return true;
		}else{
			return false;
		}
	}
	/**
	 * 显示路径导航
	 * @date   2016-11-18
	 */
	function showPath(){
		var Path = require('Path');
		// 加载路径导航
		var pathList = {
	  		"prevTitle" : '{system}{watch}',
	  		"links"     : [
	  			{"link" : '#/system_watcher/system_state', "title" : '{system}{status}'}
	  		],
	  		"currentTitle" : ''
		};
		Path.displayPath(pathList, DicArr);
	}
	function initGridControlDom(){
		var Attm = require('P_plugin/Attm');
		var list = [
			{
				title : '',
				children : [
					{
						name : T('{bandwidth}'),
						id   : 'bandWidth',
						check: (controlData["bandWidth"] == '1')
					},
					// {
					// 	name : T('{user}'),
					// 	id   : 'userStatistics',
					// 	check: (controlData["user"] == '1')
					// },
					{
						name : T('{system}{load}'),
						id   : 'systemLoad',
						check: (controlData["systemLoad"] == '1')
					},
					// {
					// 	name : T('{report}'),
					// 	id   : 'warningStatistics',
					// 	check: (controlData["warning"] == '1')
					// },
					{
						name : T('{today}{app}{flow}{rank}'),
						id   : 'todayAppFlowRanking',
						check: (controlData["appRank"] == '1')
					},
					{
						name : T('{today}{user}{network}{flow}{rank}'),
						id   : 'todayUserNetworkFlowRanking',
						check: (controlData["userRank"] == '1')
					},
					// {
					// 	name : T('{today}{visit}{website}{rank}'),
					// 	id   : 'todayWebsiteRanking',
					// 	check: (controlData["webRank"] == '1')
					// },
					{
						name : T('VPN {status}'),
						id   : 'VPNStatus',
						check: (controlData["vpn"] == '1')
					}
				]
			}
		];
		var data = {
			top: 2,
			right : 5,
			list : list,
			checkChange : function(ev, obj){
				moduleControlBtnClick(obj)
			}
		};
		var attmObj = Attm.getAttmObj(data);
		Data["attm"] = attmObj;
		var $dom = attmObj.get$Dom();
		$container.append($dom);
	}
	/**
	 * 处理属性管理器点击事件
	 * @author JeremyZhang
	 * @date   2016-12-20
	 * @param  {[type]}   obj [description]
	 */
	function moduleControlBtnClick(obj){
		/*
			点击的id
		 */
		var id     = obj["id"];
		/*
			修改栅格显示
		 */
		Data["grid"].showable(id);
		/*
			向后台post数据
		 */
		changeGridStatus(id);
		/*
			当前点击的状态
		 */
		var status = !obj["check"];
		if(!status){
			handleRefreshClick({id:id});
		}
	}
	/**
	 * 生成所有标签页的dom，并放入页面容器中
	 * @date   2016-11-18
	 * @param  {$dom}   $container 包裹所有标签页的dom
	 */
	function initGridDom($container){
		var Grid = require('Grid');
		var glist = [
			[
				{
					title : T('{bandwidth}'),
					id    : 'bandWidth',
					hide  : !(controlData["bandWidth"] == '1')
				},
				// {
				// 	title : T('{user}'),
				// 	id    : 'userStatistics',
				// 	hide  : !(controlData["user"] == '1'),
				// }
				{
					title : '',
					id    : 'userStatistics',
					hide  : !(controlData["user"] == '1'),
					/* 暂时不做 隐藏 */
					hide  : true
				}
			],
			[
				{
					title : T('{system}{load}'),
					id    : 'systemLoad',
					hide  : !(controlData["systemLoad"] == '1'),
					height: 322
				}
			],
			// [
			// 	{
			// 		title : T('{report}'),
			// 		id    : 'warningStatistics',
			// 		hide  : !(controlData["warning"] == '1'),
			// 		height: 300
			// 	}
			// ],
			[
				{
					title : T('{today}{app}{flow}{rank}'),
					id    : 'todayAppFlowRanking',
					hide  : !(controlData["appRank"] == '1'),
					linkurl  : '#/system_watcher/traffic_watcher',
					height: 322
				}
			],
			[
				{
					title : T('{today}{user}{network}{flow}{rank}'),
					id    : 'todayUserNetworkFlowRanking',
					hide  : !(controlData["userRank"] == '1'),
					linkurl: '#/user_management/user_state',
					height: 322
				}
			],
			// [
			// 	{
			// 		title : T('{today}{visit}{website}{rank}'),
			// 		id    : 'todayWebsiteRanking',
			// 		hide  : !(controlData["webRank"] == '1'),
			// 		height: 300
			// 	}
			// ],
			[
				{
					title : T('VPN{status}'),
					id    : 'VPNStatus',
					hide  : !(controlData["vpn"] == '1'),
					linkurl: '#/VPN/IPSec',
					height: 322
				}
			]		
		];
		var gdata ={
			list : glist,
			close : function(ev, obj){
				/*
					处理关闭按钮的点击
				 */
				handleCloseClick(obj);
			},
			refresh : function(ev,obj,stop){
				/*
					处理刷新按钮的点击（刷新的标签页名 ， 是否为手动刷新）
				 */
				handleRefreshClick(obj,true);
				stop();
			}
		}
		var gridObj = Grid.getGridObj(gdata);
		Data["grid"] = gridObj;
		var $g = gridObj.get$Dom();
		$container.append($g);
		//点击标签刷新
		$g.find("[href='#bandWidth']").click(function(){
			showBandWidthChart();
		});
		$g.find("[href='#systemLoad']").click(function(){
			showSystemLoadChart(true);
		});
		$g.find("[href='#todayAppFlowRanking']").click(function(){
			showAppFlowRankingChart(true);
		});
		$g.find("[href='#todayUserNetworkFlowRanking']").click(function(){
			showUserNetworkFlowRankingChart(true);
		});
		$g.find("[href='#VPNStatus']").click(function(){
			showVPNStatusChart(true);
		});
	}
	/**
	 * 处理栅格关闭操作
	 * @author JeremyZhang
	 * @date   2016-12-19
	 * @return {[type]}   [description]
	 */
	function handleCloseClick(objs){
		var ids = [];
		objs.forEach(function(obj){
			ids.push(obj.id);
		});
		ids.forEach(function(id){
			/*
				修改属性管理器状态
			 */
			Data["attm"].checkable(id);
			/*
				向后台发送数据
			 */
			changeGridStatus(id);
		});
	}
	function changeGridStatus(id){
		switch(id){
			case 'bandWidth':
				id = 'bandWidth';
				break;
			case 'userStatistics':
				id = 'user';
				break;
			case 'systemLoad':
				id = 'systemLoad';
				break;
			case 'warningStatistics':
				id = 'warning';
				break;
			case 'todayAppFlowRanking':
				id = 'appRank';
				break;
			case 'todayUserNetworkFlowRanking':
				id = 'userRank';
				break;
			case 'todayWebsiteRanking':
				id = 'webRank';
				break;
			case 'VPNStatus':
				id = 'vpn';
				break;
		}
		controlData[id] = controlData[id] == '0' ? '1' : '0';
		var arr = [
			'bandwidth='       + controlData["bandWidth"],
			'user='            + controlData["user"],
			'interface='       + controlData["interface"],
			'load='            + controlData["systemLoad"],
			'alert='           + controlData["warning"],
			'appTrafficRank='  + controlData["appRank"],
			'userTrafficRank=' + controlData["userRank"],
			'websTrafficRank=' + controlData["webRank"],
			'vpn='             + controlData["vpn"]
		];
		var postStr = arr.join('&');
		$.ajax({
			url  : '/goform/formSystemInfoCtrl',
			type : 'POST',
			data : postStr,
			success : function(jsStr){
			//	alert(jsStr)
			}
		});
	}
	/**
	 * 处理刷新操作
	 * @author JeremyZhang
	 * @date   2016-12-19
	 * @return {[type]}   [description]
	 */
	function handleRefreshClick(obj,ishandle){
		var id = obj.id;
		switch(id){
			case 'bandWidth' :
			/*
				显示 带宽 图表
			 */
				showBandWidthChart();
				break;
			case 'userStatistics' :
				showUserStatisticsChart(ishandle);
				break;
			case 'systemLoad' :
			/*
				显示 系统负载 图表
			 */
				showSystemLoadChart(ishandle);
				break;
			case 'warningStatistics' :
				showWarningStatisticsChart(ishandle);
				break;
			case 'todayAppFlowRanking' :
			/*
				显示 今日应用流量排名 图表
			 */
				showAppFlowRankingChart(ishandle);
				break;
			case 'todayUserNetworkFlowRanking' :
			/*
				显示 今日用户网络流量排名 图表
			 */
				showUserNetworkFlowRankingChart(ishandle);
				break;
			case 'todayWebsiteRanking' :
				//showWebsiteRankingChart();
				break;
			case 'VPNStatus' :
			/*
				显示 VPN状态 图表
			 */
				showVPNStatusChart(ishandle);
				break;
		}
	}
	/**
	 * 初始化图表容器的dom
	 * @author JeremyZhang
	 * @date   2016-11-21
	 */
	function initChartConDom(){
		initUserChartConDom();
		initSystemLoadChartConDom();
		initWarningChartConDom();
	}
	function initUserChartConDom(){
		var div = getDivDom('user');
		div.css({
			width  : '800px',
			height : '300px'
		})
		$('#userStatistics').append(div);
	}
	function initSystemLoadChartConDom(){
		var gridDom   = getdom(310);
		gridDom.css({'margin-left': '0px', 'padding-top' : '50px;'})
		var chartCon  = $(gridDom.children('div')[0]);
		var msgCon    = $(gridDom.children('div')[1]);
		var lineCon   = getDivDom('system-load-line', 'line-half-width');
		// lineCon.css({'margin-left' : '20px', 'margin-top' : '5px'});
		var msgDom    = getDivDom('msg');
		chartCon.append(lineCon);
		msgCon.append(msgDom);
		$container.find('#systemLoad').append(gridDom);
	}
	/*
		获得左侧定宽，右侧自适应dom
	 */
	function getdom(width){
		var html = '<div class="wrap">'
					+ '<div class="left"></div>'
					+ '<div class="right"></div>'
					+ '</div>';
		var $dom = $(html);
		$dom.find("div.left").css({
			'float': 'left',
			'width': width + 'px',
			'height': '100%'
		});
		$dom.find("div.right").css({
			'margin-left': width + 'px',
			'height': '100%'
		});
		return $dom;
	}
	function initWarningChartConDom(){
		var chartCon = getDivDom('warning-line', 'line-half-width');
		$container.find('#warningStatistics').append(chartCon);
	}
	function getDivDom(id, classes){
		require('jquery');
		var $div = $('<div></div>');
		if(id){
			$div.attr('id', id);
		}
		if(classes){
			$div.attr('class', classes);
		}
		return $div;
	}
	function getGridDom(numOne, numTwo){
		require('jquery');
		var html = '<div class="row">'
					+ '<div class="col-sm-{numOne} col-xs-{numOne} col-md-{numOne} col-lg-{numOne}"></div>'
					+ '<div class="col-sm-{numTwo} col-xs-{numTwo} col-md-{numTwo} col-lg-{numTwo}"></div>'
					+ '</div>';
		html = html.replace(/{numOne}/g, numOne);
		html = html.replace(/{numTwo}/g, numTwo);
		return $(html);
	}
	/**
	 * 通过ajax从后台获取数据，请求完成或失败后执行回调函数
	 * 如果请求成功将获取的数据传入回调函数
	 * 如果请求出错返回false
	 * @date   2016-11-18
	 * @param  {string}   url      ajax URL地址
	 * @param  {Function} callback 请求成功或者失败后执行的回调函数
	 */
	function getJsStr(url, callback,isref){
		/*
			静态页面 返回空字符串
		 */
	//	callback('');
		require('jquery');
		$.ajax({
		 	url     : url,
		 	type    : 'GET',
		 	success : function(jsStr){
		 		callback(jsStr,isref);
		 	},
		 	error   : function() {
		 		callback(false)
		 	}
		});
	}
	function getPost(url, callback,isRefresh){
		require('jquery');
		$.ajax({
		 	url     : url,
		 	type    : 'GET',
		 	success : function(jsStr){
		 		
		 		callback(jsStr,isRefresh);
		 	},
		 	error   : function() {
		 		callback(false)
		 	}
		});
	}
	/**
	 * 获得表格包裹容器的dom
	 * @author JeremyZhang
	 * @date   2016-11-18
	 * @return {$dom}   [description]
	 */
	function getTableConDom(){
		var TableContainer = require('P_template/common/TableContainer');
		var html           = TableContainer.getHTML({}),
		    $tableCon      = $(html);
		return $tableCon;
	}
	/**
	 * 显示带宽标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showBandWidthChart(){
		var $dom = $container.find('#bandWidth').empty();
		$dom.css({'overflow': 'auto', 'padding-top': '10px'});
		showIframe($dom, './flow/bandwidth.html', '1200px', '350px');
	}
	function showIframe($dom, src, width, height){
		var html = ' <iframe src="{src}" frameborder="0" width="{width}" height="{height}"></iframe>';
		html = html.replace('{src}', src);
		html = html.replace('{width}', width);
		html = html.replace('{height}', height);
		$dom.append(html);
	}
	/**
	 * 显示系统负载标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showSystemLoadChart(ishandle){
		var $dom = $container.find('#systemLoad');
		$dom.css({position:'relative'});
		$dom.children('.wrap').css({height:'100%'})
		/*
			系统负载 get请求接口
		 */
		var _url = 'common.asp?optType=systemInfo_1|systemInfo_2';
		var _interval = 10000;
		getJsStr(_url,innerFunc);
		function innerFunc(result){
			if(!chkurl()){
				return false; 
			}
			/*
				判断请求是否成功
			 */
			if(result !== false){
				var data      = processSystemLoadJsStr(result);
				var chartData = data.chartData;
				var msgData   = data.msgData;
				initSystemLoadChart($dom.find('#system-load-line'), chartData);
				$dom.find('#system-load-line').css({position:'absolute',top:'50%',transform:'translate(0px, -50%)'});
				var msgDom    = getSystemLoadChartMsgDom(msgData);
				msgDom.css('margin-top','50px')
				$dom.find('#msg').empty().css({'border-left': '1px dotted #cccccc',height:'100%'}).append(msgDom);
				translate([$dom]);
				
				if(!ishandle){
					setTimeout(function(){
						getJsStr(_url, innerFunc)
					}, _interval);
				}
				
				
			}else{
				getJsStr(_url, innerFunc)
			}
		}
	}
	/**
	 * 处理从后台返回的用来显示系统负载标签页的数据
	 * @date   2016-11-18
	 * @param  {[type]}   jsStr js代码字符串
	 * @return {[type]}         处理好的数据
	 */
	function processSystemLoadJsStr(jsStr){
		var Eval = require('Eval');
		var variables = ['ProductID', 'productIDs', 'revisions',
					'hardwareID', 'runtimes', 'cpuStat', 'memStat', 'deviceInfos'];
		var result = Eval.doEval(jsStr, variables),
			isSuccess = result["isSuccessful"];
		if(isSuccess){
			var data = result["data"];		
			return {
				chartData : {
					cpu : data["cpuStat"],
					memory : data["memStat"],
					device :   data["deviceInfos"]
				},
				msgData   : {
					productModel    : data["ProductID"], // 产品型号
					runTime         : data["runtimes"], // 运行时间
					softwareVersion : data["revisions"],      // 软件版本
					serialNumber    : data["productIDs"],      // 序列号
					hardwareVersion : data["hardwareID"],          // 硬件版本
					// strategyVersion : 'v20160305'    // 策略库版本
				}
			};
		}else{
			return false;
		}
	}
	function initSystemLoadChart($dom, data){
		require('P_libs/js/chart');
		$dom.empty();
		/* 对负载值进行过滤  防止数据异常 */
		function loadnum(num){
			var newnum = Number(num)?Number(num):1;
			return newnum<1?1:(newnum>100?100:newnum);
		}
		var seriesData = {
  			amount : 100,
  			data   : [
  				{name : 'cpu', value : loadnum(data["cpu"]), color : (data["cpu"]>=50)?'#FF4C0B':'#5e72c8',bgcolor:'#e3e5f1'},
  				{name : tl('memory'), value :loadnum(data["memory"]) , color : (data["memory"]>=50)?'#FF4C0B':'#8c6dbb',bgcolor:'#e7e4ed'}
  				
  			]
		};
		var Config = require('P_config/config');
		/* 原 U盘占用率*/
		
		  if(data["device"]!==undefined && data["device"][0]!==undefined && data["device"][0][4]!==undefined){
		    if(data["device"] ){
			var device = parseInt(data["device"][0][4].slice(0, -1));
			seriesData["data"].push({
				name : tl('diskuse'), value : device , color : (data["memory"]>=50)?'#729BBB':'#729BBB',bgcolor:'#E3EBED'
				});
		    }
		}
		var config = {
  			width  : 310,
  			height : 220,
  			series : seriesData,
  			border : {
      			enable : false
  			}
		};
		new Chart().renderBar($dom[0], config)
	}
	function getSystemLoadChartMsgDom(data){
		var timeArr = data.runTime.split(',');
		var time = timeArr[0] + '{day}' + timeArr[1] + '{hour}' + timeArr[2] + '{minute}';
		var InputGroup = require('InputGroup');
		var inputList = [
			{
				"prevWord"  : '{product}{model}',
				"inputData" : {
					"type"   : 'words',
					"value"  : data.productModel
				}
			},
			{
				"prevWord"  : '{runtime}',
				"inputData" : {
					"type"   : 'words',
					"value"  : T(time)
				}
			},
			{
				"prevWord"  : '{software}{version}',
				"inputData" : {
					"type"   : 'words',
					"value"  : data.softwareVersion
				}
			},
			    /*
			{
				"prevWord"  : '{serialNumber}',
				"inputData" : {
					"type"   : 'words',
					"value"  : data.serialNumber
				}
			},
			*/
			{
				"prevWord"  : '{hardware}{version}',
				"inputData" : {
					"type"   : 'words',
					"value"  : data.hardwareVersion
				}
			},
			// {
			// 	"prevWord"  : '策略库版本',
			// 	"inputData" : {
			// 		"type"   : 'words',
			// 		"value"  : data.strategyVersion
			// 	}
			// }
		];
		var msgDom = InputGroup.getDom(inputList);
		msgDom.css({'margin-top':'0px',position:'absolute',top : '25px'});
		msgDom.children('tbody').children('tr').children('td').css({'padding':'8px 0px','padding-right':'28px',fontSize:'14px',fontFaimly:'微软雅黑'});
		msgDom.children('tbody').children('tr').children('td:first').css({width:'100px'})
		
		return msgDom;
	}
	/**
	 * 显示 报警统计 标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showWarningStatisticsChart(ishandle){
		var $dom = $container.find('#warningStatistics');
		/*
			报警统计 get请求接口
		 */
		var url = '';
		getJsStr(url, function(result){
			/*
				判断请求是否成功
			 */
			if(result !== false){
				var chartData = processWarningStatisticsJsStr(result);
				var chartDom  = getWarningStatisticsChartDom(chartData);
				$dom.find('#warning-line').empty().append(chartDom);
				translate([$dom])
			}
		});
	}
	/**
	 * 处理从后台返回的用来显示 报警统计 标签页的数据
	 * @date   2016-11-18
	 * @param  {[type]}   jsStr js代码字符串
	 * @return {[type]}         处理好的数据
	 */
	function processWarningStatisticsJsStr(jsStr){
		return {};
	}
	/**
	 * 获取 报警统计 标签页中图表的dom
	 * @author JeremyZhang
	 * @date   2016-11-18
	 * @param  {[type]}   chartData 用于显示图表的数据
	 * @return {[type]}             图表的dom
	 */
	function getWarningStatisticsChartDom(chartData){
		// var Chart = require('P_plugin/Chart');
		// var style = {
		// 	'width'  : '100%',
		// 	'height' : '100%',
		// };
		// var labels = [1, 2, 3];
		// var series = [
		// 	[1, 2, 4],
		// 	[5, 1, 3]
		// ] 
		// var lineChartDom = Chart.getLine(style, labels, series);
		// return lineChartDom;
	}
	/**
	 * 显示 今日应用流量流量排名 标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showAppFlowRankingChart(ishandle){
		var $dom = $container.find('#todayAppFlowRanking');
		/*
			今日应用流量流量排名 get请求接口
		 */
		var _url = 'common.asp?optType=DpiNetraffic';
		var _interval = 10000;
		sendGet();
		function sendGet(isref){
			getJsStr(_url, showTable,isref);
		}
		function showTable(jsStr,isref){
			if(!chkurl()){
				return false; 
			}
			/*
				判断请求是否成功
			 */
			if(jsStr !== false){
				var database = processAppFlowRankingJsStr(jsStr);
				if(isref || ishandle){
					DATA.AppFlowRankingTableObj.refresh(database);
				}else{
					DATA.AppFlowRankingTableObj = getAppFlowRankingTableDom(database);
					$dom.empty().append(DATA.AppFlowRankingTableObj.getDom());
				}
				
				
				if(!ishandle){
					setTimeout(function(){
						sendGet(true);
					}, _interval);
				}
			}else{
				//sendGet();
			}
		}
	}
	/**
	 * 处理从后台返回的用来显示 今日应用流量流量排名 标签页的数据
	 * 并存入数据表
	 * @date   2016-11-18
	 * @param  {[type]}   jsStr js代码字符串
	 * @return {[type]}         数据库引用
	 */
	function processAppFlowRankingJsStr(resJson){
		eval('var a = ' + resJson);
		var data = a.dpiFlow;
		var Funcs = require('P_core/Functions');
//		data = Funcs.quickSort(data, compareAppFlow);
		data = sortdata(data, 'dpiDbyte');
		data = data.slice(0, 10);
		var arrData = [];
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
	/**
	 * 应用流量 数据排序比较函数，根据下载比特排序
	 * @author JeremyZhang
	 * @date   2016-12-26
	 * @param  {[type]}   currentData [description]
	 * @param  {[type]}   nextData    [description]
	 * @return {[type]}               [description]
	 */
	function compareAppFlow(currentData, nextData){
		if(currentData["dpiDbyte"] > nextData["dpiDbyte"]){
			return true;
		}else{
			return false;
		}
	}
	function compareUserFlow(currentData, nextData){
		if(currentData["rxBytes"] > nextData["rxBytes"]){
			return true;
		}else{
			return false;
		}
	}
	/**
	 * 获取 今日应用流量流量排名 标签页中图表的dom
	 * @author JeremyZhang
	 * @date   2016-11-18
	 * @param  {[type]}   database 数据库引用
	 * @return {[type]}             图表的dom
	 */
	function getAppFlowRankingTableDom(database){
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : false,      // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"{rank}" : {
					"key"  : "ranking",
					"type" : "text",
					"sort": "number"
				},
				"{app}" : {
					"key"  : "app",
					"type" : "text",
					"sort": "word"
				},
				"{upload}{data}" : {
					"key"    : "uploadData",
					"type"   : "text",
					"sort": "size"
				},
				"{download}{data}" : {
					"key"    : "downloadData",
					"type"   : "text",
					"sort": "size"
				},
				"{upload}{speed}" : {
					"key"    : "uploadSpeed",
					"type"   : "text",
					"sort": "size"
				},
				"{download}{speed}" : {
					"key"    : "downloadSpeed",
					"type"   : "text",
					"sort": "size"
				}
			},
			"dicArr"         : DicArr,
			"hasPagination"  : false
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				table : tableSettings
			});
//			tableDom = $(tableObj.getDom()[0]);
//		tableDom.find('th[data-column-title="{download}{data}"]').find('[data-event-type="desc"]').trigger('click');
		return tableObj;
	}
	/**
	 * 显示 今日用户网络流量排名 标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showUserNetworkFlowRankingChart(ishandle){
		var $dom = $container.find('#todayUserNetworkFlowRanking');
		/*
			今日用户网络流量排名 get请求接口
		 */
		var _url = 'common.asp?optType=UserStatus';
		var _interval = 10000;
		getPost(_url, innerFunc);
		function innerFunc(jsStr,isref){
			if(!chkurl()){
				return false; 
			}
			if(jsStr !== false){
			    var database = processUserNetworkFlowRankingJsStr(jsStr);
			    if(isref || ishandle){
			    	DATA.UserNetworkFlowRankingTableObj.refresh(database);
			    }else{
			    	DATA.UserNetworkFlowRankingTableObj = getUserNetworkFlowRankingTableDom(database);
			    	$dom.empty().append(DATA.UserNetworkFlowRankingTableObj.getDom());
			    }
				
				
				if(!ishandle){
					setTimeout(function(){
						getPost(_url, innerFunc,true);
					}, _interval);
				}
			}else{
				//getPost(_url, innerFunc);
			}
		}
	}
	/**
	 * 处理从后台返回的用来显示 今日用户网络流量排名 标签页的数据
	 * @date   2016-11-18
	 * @param  {[type]}   jsStr js代码字符串
	 * @return {[type]}         处理好的数据
	 */
	function processUserNetworkFlowRankingJsStr(jsStr){
		var Eval = require('Eval');
		var variables = ['allOnlineDatas'];
		var result = Eval.doEval(jsStr, variables),
			isSuccess = result["isSuccessful"];
		if(isSuccess){
			/*
				字符串处理后获得的数组变量
			 */   
			var datas = result.data.allOnlineDatas;
			var Funcs = require('P_core/Functions');
			datas = sortdata(datas, 'rxBytes');
			datas = datas.slice(0, 10);
			/*
				将上述的数组转换后存入 data 数组
			 */
			var data           = [];
			datas.forEach(function(item){
				var arr = [
					item["name"],
					item["normalIP"],
					item["normalMac"],
					Funcs.computeByte(parseInt(item["inbits"])) + '/s',
					Funcs.computeByte(parseInt(item["outbits"])) + '/s',
					Funcs.computeByte(parseInt(item["txBytes"])*1024*1024/8),
					Funcs.computeByte(parseInt(item["rxBytes"])*1024*1024/8)
				];
				data.push(arr);
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
			var fields   = ['user', 'IPAddress', 'macAddress', 'uploadData', 'downloadData','txBytes','rxBytes'];
			database.addTitle(fields);
			database.addData(data);
			return database;
		}else{
			return false;
		}
	}
	/**
	 *     
	 * 获取 今日用户网络流量排名 标签页中图表的dom
	 * @author JeremyZhang
	 * @date   2016-11-18
	 * @param  {[type]}   database  数据库引用
	 * @return {[type]}             图表的dom
	 */
	function getUserNetworkFlowRankingTableDom(database){
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : false,      // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"{user}" : {
					"key"  : "user",
					"type" : "text",
					"sort"   : 'word'
				},
				"{ip}" : {
					"key"    : "IPAddress",
					"type"   : "text",
					"sort"   : 'ip'
				},
				"{MACAddr}" : {
					"key"    : "macAddress",
					"type"   : "text",
					"sort"   : 'mac'
				},
				"{upTotal}" : {
					"key"    : "txBytes",
					"type"   : "text",
					"sort"   : "size"
				},
				"{downTotal}" : {
					"key"    : "rxBytes",
					"type"   : "text",
					"sort"   : "size"
				},
				"{upload}{speed}" : {
					"key"    : "uploadData",
					"type"   : "text",
					"sort"   : "size"
				},
				"{download}{speed}" : {
					"key"    : "downloadData",
					"type"   : "text",
					"sort"   : "size"
				},
			},
			"dicArr"      : DicArr,
			hasPagination : false
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				table : tableSettings
			});
//			tableDom  = $(tableObj.getDom()[0]);
//		tableDom.find('th[data-column-title="{download}{data}"]').find('[data-event-type="desc"]').trigger('click');
		return tableObj;
	}
	/**
	 * 显示 今日访问站点排名 标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showWebsiteRankingChart(){
		var $dom = $container.find('#todayWebsiteRanking');
		/*
			今日访问站点排名 get请求接口
		 */
		var url = '';
		getJsStr(url, function(result){
			/*
				判断请求是否成功
			 */
			if(result !== false){
				var database = processWebsiteRankingJsStr(result);
				var tableDom = getWebsiteRankingTableDom(database);
				$dom.empty().append(tableDom);
			}
		});
	}
	/**
	 * 处理从后台返回的用来显示 今日访问站点排名 标签页的数据
	 * @date   2016-11-18
	 * @param  {[type]}   jsStr js代码字符串
	 * @return {[type]}         数据库引用
	 */
	function processWebsiteRankingJsStr(jsStr){
		/*
			字符串处理后获得的数组变量
		 */
		var rankings        = [1, 2];   
		var realmNames      = ['www.utt.com.cn', 'www.baidu.com'];  
		var classifications = ['http', 'https'];
		var requestAmounts  = [22, 8];
		/*
			将上述的数组转换后存入 data 数组
		 */
		var data           = [];
		realmNames.forEach(function(item, index){
			var arr = [
				rankings[index],
				realmNames[index],
				classifications[index],
				requestAmounts[index]
			];
			data.push(arr);
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
		var fields   = ['ranking', 'realmName', 'classification', 'requestAmount'];
		database.addTitle(fields);
		database.addData(data);
		return database;
	}
	/**
	 * 获取 今日访问站点排名 标签页中图表的dom
	 * @author JeremyZhang
	 * @date   2016-11-18
	 * @param  {[type]}   database  数据库yinyong
	 * @return {[type]}             图表的dom
	 */
	function getWebsiteRankingTableDom(database){
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : false,      // 表格第一列是否是选择框
			"hasPagination" : false,
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"{rank}" : {
					"key"  : "ranking",
					"type" : "text"
				},
				"{domainName}" : {
					"key"  : "realmName",
					"type" : "text"
				},
				"{type}" : {
					"key"    : "classification",
					"type"   : "text"
				},
				"{request}{count}" : {
					"key"    : "requestAmount",
					"type"   : "text",
//					"sort": true 
				}
			}
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				table : tableSettings
			}),
			tableDom  = $(tableObj.getDom()[0]);
		
		tableDom.find('th[data-column-title="{request}{count}"]').find('[data-event-type="desc"]').trigger('click');
		return tableDom;
	}
	/**
	 * 显示 VPN状态 标签页的图表
	 * 需要指定包裹图表的dom
	 * @date   2016-11-18
	 * @param  {[type]}   $dom 带宽标签页的dom
	 */
	function showVPNStatusChart(ishandle,isref){
		var $dom = $container.find('#VPNStatus');
		/*
			VPN状态 get请求接口
		 */
		var IPSecUrl      = 'common.asp?optType=IPSec',
			PPTPCLIENTUrl = 'common.asp?optType=PPTPCLIENT',
			PPTPSERVERUrl = 'common.asp?optType=PPTPSERVER',
			L2TPCLIENTUrl = 'common.asp?optType=L2TPCLIENT',
			L2TPSERVERUrl = 'common.asp?optType=L2TPSERVER';
		var urls = [IPSecUrl, PPTPCLIENTUrl, PPTPSERVERUrl, L2TPCLIENTUrl, L2TPSERVERUrl];
		var Async = require('P_core/Async');
		Async.async(urls, function(IPSecJsStr, PCJsStr, PSJsStr, LCJsStr, LSJsStr){
			if(!chkurl()){
				return false; 
			}else{
				var database = processVPNStatusJsStr(IPSecJsStr, PCJsStr, PSJsStr, LCJsStr, LSJsStr);
				if(ishandle || isref){
					DATA.VPNStatusTableObj.refresh(database);
				}else{
					DATA.VPNStatusTableObj = getVPNStatusTableDom(database);
					$dom.empty().append(DATA.VPNStatusTableObj.getDom());
				}
				
				if(!ishandle){
					setTimeout(function(){
							showVPNStatusChart(false,true);
					}, 10000);
				}
			}
			
		}, function(){
//			console.log('all failed');
		});
	}
	/**
	 * 处理从后台返回的用来显示 VPN状态 标签页的数据
	 * @date   2016-11-18
	 * @param  {[type]}   jsStr js代码字符串
	 * @return {[type]}         数据库引用
	 */
	function processVPNStatusJsStr(IPSecJsStr, PCJsStr, PSJsStr, LCJsStr, LSJsStr){
		var Eval     = require('Eval');
		var IPSecArr = Eval.processJsStr(IPSecJsStr, [
				'ids', 
				'sa_conn', 
				'packet_out', 
				'packet_in'
			],[
				'IPSec'
			]
		);
		var PCArr    = Eval.processJsStr(PCJsStr, [
				'setNames',
				'statuss',
				'outboundss',
				'inboundss'
			],[
				'PPTPCLIENT'
			]
		);
		var PsArr   = Eval.processJsStr(PSJsStr, [
				'srv_instNames',
				'srv_statuss',
				'srv_outboundss',
				'srv_inboundss'
			],[
				'PPTPSERVER'
			]
		);
		var LCArr   = Eval.processJsStr(LCJsStr,[
				'cli_setNames',
				'cli_statuss',
				'cli_outboundss',
				'cli_inboundss'
			],[
				'L2TPCLIENT'
			]
		);
		var LSArr   = Eval.processJsStr(LSJsStr, [
				'instNames',
				'statuss',
				'outboundss',
				'inboundss'
			],[
				'L2TPSERVER'
			]
		);
		var VPNStatusArr = [].concat(IPSecArr, PCArr, PsArr, LCArr, LSArr);
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
		var fields   = ['tunnelName', 'sessionStatus', 'outFlow', 'inFlow', 'VPN'];
		var Funcs = require('P_core/Functions');
		VPNStatusArr.forEach(function(arr){
			/*暂时未实现功能所以显示--*/
			if(arr[2] == '-'){
				arr[2] = 0;
			}
			arr[2] = Funcs.computeByte(parseInt(arr[2]));
			if(arr[3] == '-'){
				arr[3] = 0;
			}
			arr[3] = Funcs.computeByte(parseInt(arr[3]));
			if(arr[4] == 'IPSec'){
				arr[2] =  '--';
				arr[3] =  '--';
			}

		});
		database.addTitle(fields);
		database.addData(VPNStatusArr);
		return database;
	}
	/**
	 * 获取 VPN状态 标签页中图表的dom
	 * @author JeremyZhang
	 * @date   2016-11-18
	 * @param  {[type]}   database  数据库yinyong
	 * @return {[type]}             图表的dom
	 */
	function getVPNStatusTableDom(database){
		/*
			表格配置数据
		 */
		var tableSettings = {
			"database"    : database,   // 表格对应的 数据库引用
			"isSelectAll" : false,      // 表格第一列是否是选择框
			"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
				"VPN" : {
					"key"  : "VPN",
					"type" : "text",
					"sort" : 'word',
				},
				"{tunnelName}" : {
					"key"    : "tunnelName",
					"type"   : "text",
					"sort" : 'word',
					"filter"　　:　function(str){
						var prevWords = str.substr(0,3);
						if(prevWords == "id-"){
							return str.substr(3,str.length);
						}else{
							return str;
						}
					}
				},
				"{connectStatus}" : {
					"key"    : "sessionStatus",
					"type"   : "text",
					"sort" : 'word',
					filter:function(str){
						var newstr = str.toString();
						showstr = newstr;
						if(newstr === '1' || newstr === '2' || newstr === '3' || newstr === 'on'){
							showstr = T("{connected}");
						}else if(newstr === '0' || newstr === 'ff'){
							showstr = T("{nconnecte}");
						}else{
							showstr = T("{nconnecte}");
						}
						return showstr;
					}
				},
				"{out}{flow}" : {
					"key"    : "outFlow",
					"type"   : "text",
					sort	: 'size'
				},
				"{in}{flow}" : {
					"key"    : "inFlow",
					"type"   : "text",
					sort	: 'size'
				},
			},
			"dicArr"      : DicArr,
			"hasPagination" : false
		};
		/*
			加载表格组件，获得表格组件对象，获得表格jquery对象
		 */
		var Table    = require('Table'),
			tableObj = Table.getTableObj({
				table : tableSettings
			});
		return tableObj;
	}
	function translate(domArr){
		var dicArr = DicArr;
		var Translate = require('Translate');
		Translate.translate(domArr, dicArr);
	}
	function T(str){
		var Translate = require('Translate');
		return Translate.getValue(str, DicArr)
	}
	
	function sortdata(datas,colname){
		var newData = datas.concat().sort(function(a,b){
			return Number(b[colname])-Number(a[colname]);
		});
		return newData.concat();
	}
	
	module.exports = {
		display : display
	};
});
