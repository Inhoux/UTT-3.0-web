define(function(require, exports, module){
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
    var dicArr     = ['common','doSoftMgnt','doEqMgmt'];
    function T(_str){
		return Translate.getValue(_str, dicArr);
	}
    function tall(dom){
		return Translate.translate([dom],['common','doSoftMgnt']);
    }
    var queryStr='SzoneAutoUpdata=on';
	$.ajax({
		url : '/goform/formSzoneAutoUpGlobalConfig',
		type: 'POST',
		data: queryStr,
		success: function(result){
		}
		});

	
	/* 获取数据 展示表格 */
	function display($con){
		$.ajax({
			type:"get",
			url:"common.asp?optType=apListConfig|schdtask|aspOutPutApConfTempList",
			success:function(result){
				
				// 数据处理
				var data = processData(result);
				
				
				showPage($con,data);

			}
		});
	}
	

	function processData(res){
		   var doEval = require('Eval');
		   var variableArr = [
			   'namearray',	// 设备名称
			   'aptypes', //型号
			   'serialno',	//序列号
			   'apStatus',  // 设备状态
			   'tmpSerialno', // 临时序列号
			   'iparray', //ip地址
			   'macarray', //mac地址
			   'vidarray', // VID
			   'fitOrFat', // 胖瘦
			   'channel', // 2.4G信道
			   'channel_5g',  // 5G信道
			   'clienCt',	//客户端数
			   'downloads', // 下载速率
			   'uploads', // 上传速率
			   'ssid',   //2.4 ssid
			   'ssid_5g',   //5 ssid
			   'zones',   //服务区
			   'permission',   //已授权
			   'managed_enable',   //可管理
			   'wlMode',   //2.4 模式
			   'wlMode_5g',   //5 ssid
			   'dhcp_en',   //是否为DHCP
			   'mfNames',   //mac地址过滤名称
			   'chanWidth',   //2.4频宽
			   'chanWidth_5g',   //5频宽
			   'apNames',//ap计划任务名称
				'tmpname', //射频模板名称
				'types'
		   ]; // 变量名称
		   var result = doEval.doEval(res, variableArr);
		   if (!result.isSuccessful) {
		       Tips.showError('{parseStrErr}');
		       return false;
		    }
		   var data = result.data;
		   var apsdata = {
				apcount : data.macarray.length,
				mac:data.macarray,
				iparr	:data.iparray,
				ssidarr : data.ssid,
				ssidarr_5 : data.ssid_5g,
				channelarr : data.channel,
				channelarr_5 : data.channel_5g,
				serial		:data.serialno,
				apstatus	:data.apStatus,
				clienCt     :data.clienCt
			}
		   
		   return apsdata;
			
	}
	
	function showPage($con,newdata){
		/*
		var apsdata = {
			apcount : 8,
			iparr	:['192.168.1.5','192.168.1.5','192.168.1.5','192.168.1.5','192.168.1.5','192.168.1.5','192.168.1.5','192.168.1.5'],
			ssidarr : ['12345678901234567890123456789022','啊吃啊吃啊吃啊吃啊吃啊吃肉602D2','UTT-HIPER-5G_499602D2','UTT-HIPER-5G_499602D2++','UTT-HIPER-5G_499602D2++','UTT-HIPER-5G_499602D2++','UTT-HIPER-5G_499602D2++','UTT-HIPER-5G_499602D2++'],
			ssidarr_5 : ['98679879as','','','llllllll','llllllll','llllllll','llllllll','llllllll'],
			channelarr : ['auto(5)','auto(6)','6','8','8','8','8','8'],
			channelarr_5 : ['auto(153)','auto','auto','auto(153)','auto(153)','auto(153)','auto(153)','auto(153)'],
			serial		:['1234567890','1268457890','3664567890','9884567890','9884567890','9884567890','9884567890','9884567890'],
			apstatus	:['1','1','0','0','1','1','1','0']
		}
		*/
		var apsdata = newdata;
		DATA.count = apsdata.apcount;
		DATA.width = (apsdata.apcount == 0?230:apsdata.apcount*230);
		
		
		
		/* 自适应外框*/
		var $div = $('<div id="ap_page_cover_all"></div>');
		$div.css({
			'position':'relative',
			'width'   :'100%',
			'overflow':'auto'
		});
		$con.empty().append($div);
		
		/* 自适应内框*/
		var $div1 = $('<div id="ap_page_cover"></div>');
		$div1.css({
			'position':'relative',
			'width'   :DATA.width+'px',
			'min-height':'530px',
			'margin'  :'0px auto',
			'background-color':'#ffffff'
		});
		
		$div.append($div1);
		/* 内框背景绘制*/
		var $bgcan = $('<canvas width="'+DATA.width+'px'+'" height="530px" id="ap_bgcanvas"></canvas>');
		$div1.append($bgcan)
		
		/*获得AC表达框*/
		var $ac = getACDom();
		$div1.append($ac);
		/*获得AP数量及信息 生成AP表达框*/
		
		
		
//		var apcount = 4;
//		var iparr = ['192.168.1.5','192.168.1.5','192.168.1.5','192.168.1.5'];
//		var ssidarr = ['ASDASD','34242','哈善良的的','alsdkj++'];
//		var ssidarr_5 = ['98679879as','','','llllllll'];
//		var channelarr = ['auto(5)','auto(6)','6','8'];
//		var channelarr_5 = ['auto(153)','auto','auto','auto(153)'];
		
		var aparr = getAPsDom(apsdata);
		$div1.append(aparr);
		
		drawCanvas($bgcan);
		
		/* 绑定触摸事件 */
		$('.ap_signle_cover_div').mouseenter(function(){
			$('.ap_signle_cover_div').css({
				'opacity':'0.2',
				'z-index':'1'	
			});
			var $t = $(this);
			$t.css({
				'opacity':'1',
				'z-index':'2'	
			});
			$t.find('.ap_inner_table_cover').css({
				'overflow':'visible',
//				'box-shadow':'0 0 0px transparent inset',
			})
		}).mouseleave(function(){
			$('.ap_signle_cover_div').css({
				'opacity':'1',
				'z-index':'1'	
			});
			var $t = $(this);
			
			$t.find('.ap_inner_table_cover').css({
				'overflow':'hidden',
//				'box-shadow':'0 0 0px transparent inset',
			})
		})
	}
	
	function getACDom(){
		/*
		var $ac = $('<div></div>');
		$ac.css({
//			'opacity':'0.2',
			'position': 'absolute',
			'width'		:'120px',
			'height'	:'120px',
			'top'		:'50px',
			'left'		:(DATA.width-120)/2 +'px',
			'background-color':'#78AFF2',
			'border-radius':'50%',
			'box-shadow':'0px 0px 6px rgba(0,0,0,0.6)',
			'text-align'	:'center',
			'line-height'	:'119px'
		});
		
		var $span = $('<span>AC</span>');
		$span.css({
			'font-size':'48px',
			'font-weight':'bold',
			'color'		:'#ffffff',
		})
		*/
		
		var $div = $('<div></div>').css({
				position:'absolute',
				top:'50px',
				left:(DATA.width-180)/2 +'px',
				width : '180px',
				perspective:'253',
				'-webkit-perspective' : '253'
			})
			
			var $div1 = $('<div></div>').css({
				position:'relative',
				left:'0px',
				margin:'0 auto',
				width : '92%',
				height : '42px',
				border:'1px solid #69B33A',
				transform: 'rotateX(63deg)',
				'-webkit-transform':' rotateX(63deg)'
			})
			var $div2 = $('<div></div>').css({
				position:'relative',
				top:'-13px',
				width : '100%',
				height : '40px',
				color:'#555555',
				fontWeight:'bold',
				fontSize:'21px',
				textAlign:'center',
				letterSpacing:'2px',
				lineHeight:'40px',
				border:'1px solid #69B33A',
				backgroundColor:'#ffffff'
			}).text('无线控制器');
			
			$div.append($div1,$div2)
			
		return $div;
	}
	
	function getAPsDom(apsdata){
		var aparr = [];
		for(var i = 0;i<apsdata.apcount;i++){
			aparr.push(getAPDom(
				i+1,
				apsdata.iparr[i],
				apsdata.ssidarr[i],
				apsdata.ssidarr_5[i],
				apsdata.channelarr[i],
				apsdata.channelarr_5[i],
				apsdata.serial[i],
				apsdata.apstatus[i],
				apsdata.clienCt[i],
				apsdata.mac[i]
			));
		}
		
		if(aparr.length>0){
			var leftx = (DATA.width-180*DATA.count)/(DATA.count+1);
			aparr.forEach(function(aobj,ai){
				var j = Number(ai);
				var x = Number(leftx);
				aobj.css({
					top:'220px',
					left:((j+1)*x+180*j)+'px'
				});
			})
			
		}
		


/*
		if(apsdata.apcount == 4){
			aparr[0].css({
				top:'250px',
				left:'10px'
			});
			aparr[1].css({
				top:'250px',
				left:'215px'
			});
			aparr[2].css({
				top:'250px',
				left:'420px'
			});
			aparr[3].css({
				top:'250px',
				left:'630px'
			});
		}else if(apsdata.apcount == 3){
			aparr[0].css({
				top:'250px',
				left:'45px'
			});
			aparr[1].css({
				top:'250px',
				left:'300px'
			});
			aparr[2].css({
				top:'250px',
				left:'565px'
			});
		}else if(apsdata.apcount == 2){
			aparr[0].css({
				top:'250px',
				left:'100px'
			});
			aparr[1].css({
				top:'250px',
				left:'490px'
			});

		}else if(apsdata.apcount == 1){
			aparr[0].css({
				top:'250px',
				left:'300px'
			});
		}
		
		if(aparr.length == 0){
			var $noap = $('<span>（暂无AP）</span>');
			$noap.css({
				'position':'absolute',
				'font-size':'30px',
				'color'	   :'#dfdfdf',
				'font-weight':'bold',
				'top'	:'253px',
				'left'	:'308px'
			})
			aparr.push($noap);
		}
		*/
		
		return aparr;
	}
	
	
	
	function getAPDom(index,ip,ssid,ssid5,cnl,cnl5,serial,apstatus,clienCt,mac){
		var $ap = $('<div class="ap_signle_cover_div"></div>');
		$ap.css({
//			'opacity':'0.2',
			'transition':'all 0.3s',
			'color'	:'#000000',
			'position': 'absolute',
			'width'		:'180px',
			'min-height'	:'220px',
			'border-radius':'0px',
//			'box-shadow':'0px 0px 6px rgba(0,0,0,0.3)',
			'font-size':'13px',
//			'font-weight':'bold',
			'border-bottom-right-radius':'6px',
			'border-bottom-left-radius':'6px',
			'background-color':(apstatus == '1'?'#D7E7CA':'#e2e2e2')
		});
		
		var cnum24 = clienCt.split('/')[0];
		var num5 = clienCt.split('/')[1];
		
		var table = '<table>'+
						'<tbody>'+
							'<tr><td style="width:20px;padding:0 0"> IP地址</td><td> ：'+ip+'</td></tr>'+
							(ssid == ''?'':('<tr><td style="width:20px;padding:3px 0">SSID(2.4G)</td><td> ：'+ssid+'</td></tr>'))+
							(ssid == ''?'':('<tr><td style="width:20px;padding:3px 0">信道(2.4G)</td><td> ：'+cnl+'</td></tr>'))+
							(ssid == ''?'':('<tr><td style="width:20px;padding:3px 0">用户(2.4G)</td><td> ：'+cnum24+'</td></tr>'))+
							(ssid5 == ''?'':('<tr><td style="width:20px;padding:3px 0">SSID(5G)</td><td> ：'+ssid5+'</td></tr>'))+
							(ssid5 == ''?'':('<tr><td style="width:20px;padding:3px 0">信道(5G)</td><td> ：'+cnl5+'</td></tr>'))+
							(ssid5 == ''?'':('<tr><td style="width:20px;padding:3px 0">用户(5G)</td><td> ：'+num5+'</td></tr>'))+
							'<tr><td style="width:20px;padding:0 0" colspan="2" > <a class="u-inputLink link-forUser" data-mac="'+mac+'">查看在线用户</a></td></tr>'+
						'</tbody>'+
					'</table>';
		var $table = $(table);
		$table.find('.link-forUser').click(function(){
			showUserModal($(this))
		});
		/*
		if(ssid !='' &&ssid5 !=''  ){
			$table.css({
				'position':'absolute',
				'left'	:'24px',
				'top'	:'39px'
			});
		}else if((ssid !='' && ssid5 == '') || (ssid5 !='' && ssid == '')){
			$table.css({
				'position':'absolute',
				'left'	:'24px',
				'top'	:'55px'
			});
		}else{
			$table.css({
				'position':'absolute',
				'left'	:'24px',
				'top'	:'55px'
			});
		}
		*/
		$table.css({
			'position':'absolute',
			'left'	:'10px',
			'top'	:'28px'
		});
		var $tablecover = $('<div class="ap_inner_table_cover"></div>');
		$tablecover.css({
			position:'relative',
			width:'100%',
			height:'225px',
			'border-radius':'0px',
			'overflow':'hidden',
//			'box-shadow':'0px 0px 18px '+(apstatus == '1'?'#F9EE9A':'#e2e2e2')+' inset'
		})
		$tablecover.append($table);
		var $index = $('<div>AP-'+serial+' '+'<span '+(apstatus == '1'?' style="color:#36B71F">在线':' style="color:#FF0000">离线')+'</span></div>');
		$index.css({
			'position': 'absolute',
			'width':'180px',
			'height':'38px',
//			'border-radius':'6px',
//			'box-shadow':'0px 0px 6px rgba(0,0,0,0.3)',
			'border-bottom':'1px solid #ffffff',
			'border-top-right-radius':'6px',
			'border-top-left-radius':'6px',
			'font-size':'16px',
			'color':'#333333',
			'font-weight':'bold',
			'top':'-25px',
			'left':'0px',
			'line-height':'42px',
			'text-align':'center',
			'background-color':(apstatus == '1'?'#D7E7CA':'#e2e2e2')
		});
		
		$ap.append($index);
		
		
		$ap.append($tablecover);
		
		return $ap;
	}
	
	function drawCanvas($can){
		var c=$can[0];
		var ctx=c.getContext("2d");
		ctx.strokeStyle="#000000";
		ctx.lineWidth=0.3;
		var leftx = (DATA.width-180*DATA.count)/(DATA.count+1);
		for(var i=0;i<DATA.count;i++){
			var x = (i+1)*leftx+180*i+90;
			ctx.moveTo(x,195);
			ctx.lineTo(DATA.width/2,120);
			ctx.stroke();
		}
		/*
		if(count == 4){
			ctx.moveTo(100,240);
			ctx.lineTo(390,120);
			ctx.stroke();
			ctx.moveTo(300,240);
			ctx.lineTo(390,120);
			ctx.stroke();
			ctx.moveTo(500,240);
			ctx.lineTo(390,120);
			ctx.stroke();
			ctx.moveTo(700,240);
			ctx.lineTo(390,120);
			ctx.stroke();
		}else if(count == 3){
			ctx.moveTo(130,240);
			ctx.lineTo(390,120);
			ctx.stroke();
			ctx.moveTo(390,240);
			ctx.lineTo(390,120);
			ctx.stroke();
			ctx.moveTo(670,240);
			ctx.lineTo(390,120);
			ctx.stroke();
		}else if(count == 2){
			ctx.moveTo(200,240);
			ctx.lineTo(390,120);
			ctx.stroke();
			ctx.moveTo(590,240);
			ctx.lineTo(390,120);
			ctx.stroke();
		}else if(count == 1){
			ctx.moveTo(390,240);
			ctx.lineTo(390,120);
			ctx.stroke();
		}else{
			
		}
		*/
	}
		/*用户数据弹框*/
	function showUserModal($this){
		var mac = $this.attr('data-mac');
		$.ajax({
			url:'common.asp?optType=aspOutPutWlanCltList&mac='+mac,
			type:'GET',
			success:function(result){
				var doEval = require('Eval');
				var codeStr = result,
					variableArr = [
						'macarrays', 
						'linkedaps', // 接入AP 
						'linkedSSIDs', // 接入SSID
						'wlanFre', // 频段
						'signals', //  信号
						'rates', // 速率
						'bindwidths', // 频宽
						'downloads', // 下载
						'downRate', // 下载速率
						'uploads', // 上传
						'upRate', // 上传速率
						'time' // 在线时长
					],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
				// 判断代码字符串执行是否成功
				if (isSuccess) {
					var data = result["data"];
					var Database = require('Database'),
					database = Database.getDatabaseObj(); // 数据库的引用
					// 存入全局变量DATA中，方便其他函数使用
					DATA["userData"] = database;
					// 声明字段列表
					var fieldArr =[
						'ID',
						'macarrays',
						'linkedaps',  /*ip地址列*/
						'linkedSSIDs',
						'wlanFre',
						'signals',
						'rates',
						'bindwidths',
						'downloads',
						'downRate',
						'uploads',
						'upRate',
						'time'
					];
					
					var baseData = [];
					if(data.macarrays){
						 data.macarrays.forEach(function(obj,i){
							baseData.push([
								Number(i)+1,
								data.macarrays[i],
								data.linkedaps[i],
								data.linkedSSIDs[i],
								data.wlanFre[i],
								data.signals[i],
								data.rates[i],
								data.bindwidths[i],
								data.downloads[i],
								data.downRate[i],
								data.uploads[i],
								data.upRate[i],
								data.time[i]
							]);
						});
					}
					
					// 将数据存入数据表中
					database.addTitle(fieldArr);
					
					database.addData(baseData);
					
					makeUserModal(database);
				} else {
					Tips.showWarning('{parseStrErr}');
				}					
			}
		});	
		
		function makeUserModal(database){
			var modallist = {
				id:'userInfo_modal',
				title:'用户',
				size:'large1',
				"btns" : [
					/*
		            {
		                "type"      : 'save',
		                "clickFunc" : function($this){
		                }
		            },
		            {
		                "type"      : 'reset',
		                clickFunc : function($this){
		                }
		            },
		            */
		            {
		                "type"      : 'close'
		            }
		        ]
			};
			var Modal = require('Modal');
			var modalObj = Modal.getModalObj(modallist);
			var TableContainer = require('P_template/common/TableContainer');
			var conhtml = TableContainer.getHTML({}),
				$tableCon = $(conhtml);
			modalObj.insert($tableCon);	
			
			
			var headData = {
				"btns" : []
			};
			
			// 表格配置数据
			var tableList = {
				"database": database,
//				 otherFuncAfterRefresh:textClickEvent,
				"isSelectAll":false,
				"dicArr" : ['common','doEqMgmt','doRFT'],
				"titles": {
					"ID"		 : {
						"key": "ID",
						"type": "text",
					},
				    "MAC地址"	  : {
						"key": "macarrays",
						"type": "text",
						"sort": 'mac'
					},
					 "接入AP"	  : {
						"key": "linkedaps",
						"type": "text",
						"sort": 'word'
					},
					 "接入SSID"	  : {
						"key": "linkedSSIDs",
						"type": "text",
						"sort": 'word'
					},
					 "频段"	  : {
						"key": "wlanFre",
						"type": "text",
						"sort": 'word'
					},
					 "信号"	  : {
						"key": "signals",
						"type": "text",
						"sort": 'word'
					},
					 "速率"	  : {
						"key": "rates",
						"type": "text",
						"sort": 'word'
					},
					 "频宽"	  : {
						"key": "bindwidths",
						"type": "text",
						"sort": 'word'
					},
					 "下载数据"	  : {
						"key": "downloads",
						"type": "text",
						"sort": 'data'
					},
					 "下载速率（bit/s）"	  : {
						"key": "downRate",
						"type": "text",
						"sort": 'data'
					},
					 "上传数据"	  : {
						"key": "uploads",
						"type": "text",
						"sort": 'data'
					},
					 "上传速率（bit/s）"	  : {
						"key": "upRate",
						"type": "text",
						"sort": 'data'
					},
					 "在线时长"	  : {
						"key": "time",
						"type": "text",
						"sort": 'time'
					},
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
			
			$tableCon.append($table);
			var tranDomArr = [modalObj.getDom()];
			var dicArr     = ['common'];
			require('Translate').translate(tranDomArr, dicArr);	
			modalObj.show();
		}
		
		
	}
	
	
	module.exports = {
		display: display
	};
	
})
