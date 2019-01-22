define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
		/*
			添加iframe的暂时处理
		 */
		$('#iframe').hide();
		$('#content').show();

		var $container = $('#content');
		$container.empty();
		/*
			显示路径导航
		 */
		showPath();
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
		showBandWidthChart($container.find('#bandWidth'));
		/*
			点击用户统计标签页时 显示 用户统计 图表
		 */
		// $container.find('a[href="#userStatistics"]').click(function(e){
		// 	$('a[href="#userStatistics"]').tab('show')
		// 	showUserStatisticsChart($container.find('#userStatistics'));
		// });
		showUserStatisticsChart($container.find('#user'));
		/*
			显示 系统负载 图表
		 */
		showSystemLoadChart($container.find('#systemLoad'));
		/*
			显示 报警统计 图表
		 */
		showWarningStatisticsChart($container.find('#warningStatistics'));
		/*
			显示 今日应用流量排名 图表
		 */
		showAppFlowRankingChart($container.find('#todayAppFlowRanking'));
		/*
			显示 今日用户网络流量排名 图表
		 */
		showUserNetworkFlowRankingChart($container.find('#todayUserNetworkFlowRanking'))
		/*
			显示 今日访问站点排名 图表
		 */
		showWebsiteRankingChart($container.find('#todayWebsiteRanking'))
		/*
			显示 VPN状态 图表
		 */
		showVPNStatusChart($container.find('#VPNStatus'));
		/**
		 * 显示路径导航
		 * @date   2016-11-18
		 */
		function showPath(){
			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : '系统监控',
	  		"links"     : [
	  			{"link" : '#/system_watcher/system_state', "title" : '系统状态'}
	  		],
	  		"currentTitle" : ''
			};
			Path.displayPath(pathList);
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
						title : '带宽',
						id    : 'bandWidth',
						hide : false
					},
					{
						title : '用户',
						id    : 'userStatistics',
						hide  : false,
						linkurl : ''
					}
				],
				[
					{
						title : '系统负载',
						id    : 'systemLoad',
						hide : false,
						linkurl : ''
					}
				],
				[
					{
						title : '报警',
						id : 'warningStatistics',
						hide : false,
						linkurl : 'asdasdasdasd'
					}
				],
				[
					{
						title : '今日应用流量排名',
						id : 'todayAppFlowRanking',
						hide : false,
						linkurl : 'asdasdasdasd'
					}
				],
				[
					{
						title : '今日用户网络流量排名',
						id : 'todayUserNetworkFlowRanking',
						hide : false,
						linkurl : 'asdasdasdasd'
					}
				],
				[
					{
						title : '今日访问站点排名',
						id : 'todayWebsiteRanking',
						hide : false,
						linkurl : 'asdasdasdasd'
					}
				],
				[
					{
						title : 'VPN状态',
						id : 'VPNStatus',
						hide : false,
						linkurl : 'asdasdasdasd'
					}
				]		
			];
			var gdata ={
				list : glist,
				close : function(ev,closeArr,allArr){
					console.log(closeArr);
					console.log(allArr)
				},
				refresh : function(ev,refreshJson,stop){
					stop();
				}
			}
			var gridObj = Grid.getGridObj(gdata);
			var $g = gridObj.get$Dom();
			$container.append($g);
		}
		/**
		 * 初始化图表容器的dom
		 * @author JeremyZhang
		 * @date   2016-11-21
		 */
		function initChartConDom(){
			initBandWidthChartConDom();
			initUserChartConDom();
			initSystemLoadChartConDom();
			initWarningChartConDom();
		}
		/**
		 * 初始化 带宽 标签页中 图表的容器
		 * @author JeremyZhang
		 * @date   2016-11-21
		 */
		function initBandWidthChartConDom(){
			var gridDom   = getGridDom(8, 4);
			var chartCon  = $(gridDom.children('div')[0]);
			var msgCon    = $(gridDom.children('div')[1]);
			var msgDom    = getDivDom('msg');
			msgCon.append(msgDom);
			var lineCon   = getDivDom('band-width-line', 'line-full-width');
			var pieCon    = getDivDom('', 'row');
			pieCon.css({
				marginLeft : '30px'
			})
			var wanOneCon = getDivDom('wanOne', 'pie-quarter-width col-sm-3 col-xs-3 col-md-3 col-lg-3');
			var wanTwoCon = getDivDom('wanTwo', 'pie-quarter-width col-sm-3 col-xs-3 col-md-3 col-lg-3');
			var wanThreeCon = getDivDom('wanThree', 'pie-quarter-width col-sm-3 col-xs-3 col-md-3 col-lg-3');
			var wanFourCon = getDivDom('wanFour', 'pie-quarter-width col-sm-3 col-xs-3 col-md-3 col-lg-3');
			pieCon.append(wanOneCon, wanTwoCon, wanThreeCon, wanFourCon);
			chartCon.append(lineCon, pieCon);
			$container.find('#bandWidth').append(gridDom);
		}
		function initUserChartConDom(){
			var div = getDivDom('user');
			div.css({
				width : '800px',
				height : '300px'
			})
			$('#userStatistics').append(div);
		}
		function initSystemLoadChartConDom(){
			var gridDom   = getGridDom(8, 4);
			var chartCon  = $(gridDom.children('div')[0]);
			var msgCon    = $(gridDom.children('div')[1]);
			var lineCon   = getDivDom('system-load-line', 'line-half-width');
			var msgDom    = getDivDom('msg');
			chartCon.append(lineCon);
			msgCon.append(msgDom);
			$container.find('#systemLoad').append(gridDom);
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
		function getJsStr(url, callback){
			/*
				静态页面 返回空字符串
			 */
			callback('');
			// require('jquery');
			// $.ajax({
			// 	url     : url,
			// 	type    : 'GET',
			// 	success : function(jsStr){
			// 		callback(jsStr);
			// 	},
			// 	error   : function() {
			// 		callback(false)
			// 	}
			// });
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
		function showBandWidthChart($dom){
			/*
				带宽数据 get请求接口
			 */
			var url = '';
			getJsStr(url, function(result){
				/*
					判断请求是否成功
				 */
				if(result !== false){
					var data      = processBandWidthJsStr(result);
					var lineData  = data.lineData;
					var pieDatas  = data.pieDatas;
					var msgData   = data.msgData;
					var lineDom   = getBandWidthLineDom(lineData);
					$dom.find('#band-width-line').empty().append(lineDom);
					var pieDoms   = getBandwidthPieDoms(pieDatas);
					$dom.find('#wanOne').empty().append(pieDoms[0]);
					$dom.find('#wanTwo').empty().append(pieDoms[1]);
					$dom.find('#wanThree').empty().append(pieDoms[2]);
					$dom.find('#wanFour').empty().append(pieDoms[3]);
					var msgDom = getBandWidthChartMsgDom(msgData);
					$dom.find('#msg').empty().append(msgDom)
				}
			});
		}
		/**
		 * 处理从后台返回的用来显示带宽标签页的数据
		 * @date   2016-11-18
		 * @param  {[type]}   jsStr js代码字符串
		 * @return {[type]}         处理好的数据
		 */
		function processBandWidthJsStr(jsStr){
			return {
				lineData : '',
				pieDatas : ['', '', '', ''],
				msgData  : {
					port          : 'wan1',
					connectStatus : '已连接',
					connectTime   : '2天3时5分2秒',
					connectType   : '静态接入',
					IPAddress     : '200.200.202.157',
					maskAddress   : '255.255.255.0',
					macAddress    : '04121321531',
					dnsServer     : '200.200.200.125',
					dnsServerReserved : '200.200.123.123'
				}
			}
		}
		/**
		 * 获取带宽标签页中图表的dom
		 * @author JeremyZhang
		 * @date   2016-11-18
		 * @param  {[type]}   chartData 用于显示图表的数据
		 * @return {[type]}             图表的dom
		 */
		function getBandWidthLineDom(chartData){
			var Chart = require('P_plugin/Chart');
			var style = {
				'width'  : '100%',
				'height' : '100%',
			};
			var labels = [1, 2, 3];
			var series = [
				[10, 20, 30],
				[45, 78, 32]
			] 
			var lineChartDom = Chart.getLine(style, labels, series);
			return lineChartDom;
		}
		function getBandWidthChartMsgDom(data){
			var InputGroup = require('InputGroup');
			var inputList = [
				{
					"prevWord"  : '接口',
					"inputData" : {
						"type"         : 'select',
						"name"         : 'port',
						"defaultValue" : data.port,
						"items"        : [
							{
								"value"     : 'wan1',
								"name"      : 'WAN1口',
							},
							{
								"value"     : 'wan2',
								"name"      : 'WAN2口',
							},
							{
								"value"     : 'wan3',
								"name"      : 'WAN3口',
							},
							{
								"value"     : 'wan4',
								"name"      : 'WAN4口',
							},
							{
								"value"     : 'lan',
								"name"      : 'lan口',
							}
						]
					}
				},
				{
					"prevWord"  : '连接状态',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.connectStatus
					}
				},
				{
					"prevWord"  : '连接时间',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.connectTime
					}
				},
				{
					"prevWord"  : '连接类型',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.connectType
					}
				},
				{
					"prevWord"  : 'IP地址',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.IPAddress
					}
				},
				{
					"prevWord"  : '子网掩码',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.maskAddress
					}
				},
				{
					"prevWord"  : 'mac地址',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.macAddress
					}
				},
				{
					"prevWord"  : '主DNS服务器',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.dnsServer
					}
				},
				{
					"prevWord"  : '备DNS服务器',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.dnsServerReserved
					}
				},
			];
			var msgDom = InputGroup.getDom(inputList);
			return msgDom;
		}
		function getBandwidthPieDoms(data){
			data = ['WAN1', 'WAN2', 'WAN3', 'WAN4'];
			var doms = [];
			var Chart = require('P_plugin/Chart');
			data.forEach(function(item){
				var style = {
					'width'  : '70px',
					'height' : '70px',
				};
				var labels = [1, 2];
				var series = [
					10, 20
				];
				var pieChartDom = Chart.getPie(style, labels, series, true);
				var pieMsgDom = getPieMsgDom(item, series);

				doms.push($(pieChartDom).addClass('utt-inline-block').add(pieMsgDom));
			});
			return doms;
		}
		function getPieMsgDom(title, series){
			var html = '<div class="utt-inline-block P-L-10">'
						+ '<h4 style="margin : 0;">{title}</h4>'
						+ '<div style="border-radius : 3px; margin-top : 2px; background : red; color : white">上传: {upload}bits/s</div>'
						+ '<div style="border-radius : 3px; margin-top : 2px; background : red; color : white">下载: {download}bits/s</div>'
						+ '</div>';
			html = html.replace('{title}', title);
			html = html.replace('{upload}', series[0]);
			html = html.replace('{download}', series[1]);
			return $(html)
		}
		/**
		 * 显示用户统计标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showUserStatisticsChart($dom){
			/*
				用户统计 get请求接口
			 */
			var url = '';
			getJsStr(url, function(result){
				/*
					判断请求是否成功
				 */
				if(result !== false){
			
					var chartData = processUserStatisticsJsStr(result);
					var chartDom  = getUserStatisticsChartDom(chartData);
					setTimeout(function(){
						$dom.empty().append(chartDom);
					}, 1000)
				}
			});
		}
		/**
		 * 处理从后台返回的用来显示用户统计标签页的数据
		 * @date   2016-11-18
		 * @param  {[type]}   jsStr js代码字符串
		 * @return {[type]}         处理好的数据
		 */
		function processUserStatisticsJsStr(jsStr){
			return {};
		}
		/**
		 * 获取用户统计标签页中图表的dom
		 * @author JeremyZhang
		 * @date   2016-11-18
		 * @param  {[type]}   chartData 用于显示图表的数据
		 * @return {[type]}             图表的dom
		 */
		function getUserStatisticsChartDom(chartData){
			var Chart = require('P_plugin/Chart');
			var style = {
				'width'  : '800px',
				'height' : '200px',
			};
			var labels = [1, 2, 7];
			var series = [
				[10, 20, 30],
				[45, 78, 32]
			] 
			var lineChartDom = Chart.getLine(style, labels, series);
			return lineChartDom;
		}
		/**
		 * 显示系统负载标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showSystemLoadChart($dom){
			/*
				系统负载 get请求接口
			 */
			var url = '';
			getJsStr(url, function(result){
				/*
					判断请求是否成功
				 */
				if(result !== false){
					var data      = processSystemLoadJsStr(result);
					var chartData = data.chartData;
					var msgData   = data.msgData;
					var chartDom  = getSystemLoadChartDom(chartData);
					$dom.find('#system-load-line').empty().append(chartDom);
					var msgDom    = getSystemLoadChartMsgDom(msgData);
					$dom.find('#msg').empty().append(msgDom);
				}
			});
		}
		/**
		 * 处理从后台返回的用来显示系统负载标签页的数据
		 * @date   2016-11-18
		 * @param  {[type]}   jsStr js代码字符串
		 * @return {[type]}         处理好的数据
		 */
		function processSystemLoadJsStr(jsStr){
			return {
				chartData : '',
				msgData   : {
					productModel    : 'HiPER 6530G',
					runTime         : '2天3时5分2秒',
					softwareVersion : 'v1.7.9',
					serialNumber    : '132456',
					hardwareVersion : 'v3',
					strategyVersion : 'v20160305' 
				}
			};
		}
		/**
		 * 获取系统负载标签页中图表的dom
		 * @author JeremyZhang
		 * @date   2016-11-18
		 * @param  {[type]}   chartData 用于显示图表的数据
		 * @return {[type]}             图表的dom
		 */
		function getSystemLoadChartDom(chartData){
			var Chart = require('P_plugin/Chart');
			var style = {
				'width'  : '100%',
				'height' : '100%',
			};
			var labels = [1, 2, 3];
			var series = [
				[1, 2, 4],
				[5, 1, 3]
			] 
			var lineChartDom = Chart.getLine(style, labels, series);
			return lineChartDom;
		}
		function getSystemLoadChartMsgDom(data){
			var InputGroup = require('InputGroup');
			var inputList = [
				{
					"prevWord"  : '产品型号',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.productModel
					}
				},
				{
					"prevWord"  : '运行时长',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.runTime
					}
				},
				{
					"prevWord"  : '软件版本',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.softwareVersion
					}
				},
				{
					"prevWord"  : '序列号',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.serialNumber
					}
				},
				{
					"prevWord"  : '硬件版本',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.hardwareVersion
					}
				},
				{
					"prevWord"  : '策略库版本',
					"inputData" : {
						"type"   : 'words',
						"value"  : data.strategyVersion
					}
				}
			];
			var msgDom = InputGroup.getDom(inputList);
			return msgDom;
		}
		/**
		 * 显示 报警统计 标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showWarningStatisticsChart($dom){
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
			var Chart = require('P_plugin/Chart');
			var style = {
				'width'  : '100%',
				'height' : '100%',
			};
			var labels = [1, 2, 3];
			var series = [
				[1, 2, 4],
				[5, 1, 3]
			] 
			var lineChartDom = Chart.getLine(style, labels, series);
			return lineChartDom;
		}
		/**
		 * 显示 今日应用流量流量排名 标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showAppFlowRankingChart($dom){
			/*
				今日应用流量流量排名 get请求接口
			 */
			var url = '';
			getJsStr(url, function(result){
				/*
					判断请求是否成功
				 */
				if(result !== false){
					var table     = processAppFlowRankingJsStr(result);
					var chartDom  = getAppFlowRankingTableDom(table);
					$dom.empty().append(chartDom);
				}
			});
		}
		/**
		 * 处理从后台返回的用来显示 今日应用流量流量排名 标签页的数据
		 * 并存入数据表
		 * @date   2016-11-18
		 * @param  {[type]}   jsStr js代码字符串
		 * @return {[type]}         数据库引用
		 */
		function processAppFlowRankingJsStr(jsStr){
			/*
				字符串处理后获得的数组变量
			 */
			var rankings       = [1, 2, 3];     
			var apps           = ['HTTP', 'SSL', 'QQ'];
			var uploadSpeeds   = ['658 | 100%', '0b | 0%', '0b | 0%'];
			var downloadSpeeds = ['583b | 100%', '0b | 0%', '0b | 0%'];
			var uploadData     = ['29.32 M | 100%', '0b | 0%', '0b | 0%'];
			var downloadData   = ['29.32 M | 100%', '0b | 0%', '0b | 0%'];
			/*
				将上述的数组转换后存入 data 数组
			 */
			var data           = [];
			apps.forEach(function(app, index){
				var arr = [
					rankings[index],
					apps[index],
					uploadSpeeds[index],
					downloadSpeeds[index],
					uploadData[index],
					downloadData[index]
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
			var fields   = ['ranking', 'app', 'uploadSpeed', 'downloadSpeed', 'uploadData', 'downloadData'];
			database.addTitle(fields);
			database.addData(data);
			return database;
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
					"排名" : {
						"key"  : "ranking",
						"type" : "text"
					},
					"应用" : {
						"key"  : "app",
						"type" : "text"
					},
					"上传速度" : {
						"key"    : "uploadSpeed",
						"type"   : "text"
					},
					"下载速度" : {
						"key"    : "downloadSpeed",
						"type"   : "text"
					},
					"上传数据" : {
						"key"    : "uploadData",
						"type"   : "text"
					},
					"下载数据" : {
						"key"    : "downloadData",
						"type"   : "text"
					},
				},
				// "lang"        : 'zhcn',
				// "dicArr"      : ['test']
			};
			/*
				加载表格组件，获得表格组件对象，获得表格jquery对象
			 */
			var Table    = require('Table'),
				tableObj = Table.getTableObj({
					table : tableSettings
				}),
				tableDom = tableObj.getDom();
			return tableDom;
		}
		/**
		 * 显示 今日用户网络流量排名 标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showUserNetworkFlowRankingChart($dom){
			/*
				今日用户网络流量排名 get请求接口
			 */
			var url = '';
			getJsStr(url, function(result){
				/*
					判断请求是否成功
				 */
				if(result !== false){
					var database = processUserNetworkFlowRankingJsStr(result);
					var tableDom = getUserNetworkFlowRankingTableDom(database);
					$dom.empty().append(tableDom);
				}
			});
		}
		/**
		 * 处理从后台返回的用来显示 今日用户网络流量排名 标签页的数据
		 * @date   2016-11-18
		 * @param  {[type]}   jsStr js代码字符串
		 * @return {[type]}         处理好的数据
		 */
		function processUserNetworkFlowRankingJsStr(jsStr){
			/*
				字符串处理后获得的数组变量
			 */
			var rankings       = [1, 2, 3];   
			var users          = ['李明', '张三', '李四'];  
			var IPs            = ['192.168.1.1', '192.168.2.1', '192.168.10.1'];
			var macAddress     = ['255.255.255.0', '255.255.255.1', '255.255.255.9'];
			var uploadData     = ['29.32 M | 100%', '0b | 0%', '0b | 0%'];
			var downloadData   = ['29.32 M | 100%', '0b | 0%', '0b | 0%'];
			/*
				将上述的数组转换后存入 data 数组
			 */
			var data           = [];
			users.forEach(function(item, index){
				var arr = [
					rankings[index],
					users[index],
					IPs[index],
					macAddress[index],
					uploadData[index],
					downloadData[index]
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
			var fields   = ['ranking', 'user', 'IPAddress', 'macAddress', 'uploadData', 'downloadData'];
			database.addTitle(fields);
			database.addData(data);
			return database;
		}
		/**
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
					"排名" : {
						"key"  : "ranking",
						"type" : "text"
					},
					"用户" : {
						"key"  : "user",
						"type" : "text"
					},
					"IP地址" : {
						"key"    : "IPAddress",
						"type"   : "text"
					},
					"MAC地址" : {
						"key"    : "macAddress",
						"type"   : "text"
					},
					"上传数据" : {
						"key"    : "uploadData",
						"type"   : "text"
					},
					"下载数据" : {
						"key"    : "downloadData",
						"type"   : "text"
					},
				},
				// "lang"        : 'zhcn',
				// "dicArr"      : ['test']
			};
			/*
				加载表格组件，获得表格组件对象，获得表格jquery对象
			 */
			var Table    = require('Table'),
				tableObj = Table.getTableObj({
					table : tableSettings
				}),
				tableDom  = tableObj.getDom();
			return tableDom;
		}
		/**
		 * 显示 今日访问站点排名 标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showWebsiteRankingChart($dom){
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
				"titles"      : {           // 表格每一列标题和数据库中字段的对应关系
					"排名" : {
						"key"  : "ranking",
						"type" : "text"
					},
					"域名" : {
						"key"  : "realmName",
						"type" : "text"
					},
					"分类" : {
						"key"    : "classification",
						"type"   : "text"
					},
					"请求数" : {
						"key"    : "requestAmount",
						"type"   : "text"
					}
				},
				// "lang"        : 'zhcn',
				// "dicArr"      : ['test']
			};
			/*
				加载表格组件，获得表格组件对象，获得表格jquery对象
			 */
			var Table    = require('Table'),
				tableObj = Table.getTableObj({
					table : tableSettings
				}),
				tableDom  = tableObj.getDom();
			return tableDom;
		}
		/**
		 * 显示 VPN状态 标签页的图表
		 * 需要指定包裹图表的dom
		 * @date   2016-11-18
		 * @param  {[type]}   $dom 带宽标签页的dom
		 */
		function showVPNStatusChart($dom){
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
				var database = processVPNStatusJsStr(IPSecJsStr, PCJsStr, PSJsStr, LCJsStr, LSJsStr);
				var tableDom = getVPNStatusTableDom(database);
				$dom.empty().append(tableDom);
			}, function(){
				console.log('all failed');
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
			var fields   = ['VPN', 'tunnelName', 'sessionStatus', 'outFlow', 'inFlow'];
			database.addTitle(fields);
			database.addData(data);
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
						"type" : "text"
					},
					"隧道名称" : {
						"key"    : "tunnelName",
						"type"   : "text"
					},
					"会话状态" : {
						"key"    : "sessionStatus",
						"type"   : "text",
						"values" : {
							'0'  : "离线",
							'1'  : "在线",
							'ff' : "离线",
							'on' : "在线"
						}
					},
					"出流量" : {
						"key"    : "outFlow",
						"type"   : "text"
					},
					"入流量" : {
						"key"    : "inFlow",
						"type"   : "text"
					},
				},
				// "lang"        : 'zhcn',
				// "dicArr"      : ['test']
			};
			/*
				加载表格组件，获得表格组件对象，获得表格jquery对象
			 */
			var Table    = require('Table'),
				tableObj = Table.getTableObj({
					table : tableSettings
				}),
				tableDom  = tableObj.getDom();
			return tableDom;
		}
	}
});
