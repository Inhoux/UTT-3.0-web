define(function(require, exports, module){
	var DATA={};
	function initEvent($container){
		$('#save').click(function(){
			var tips = require('Tips');
			var Serialize = require('Serialize');
			// var queryArrs = Serialize.getQueryArrs($('#1'));
			/*向下面传值的被监控端口处理*/
			var trr3 = $container.find('[name="sourcePort"]').eq(0).parent().parent();
			var tmpSrcPort = 0;
			for (i = 1; i <= DATA["maxLanPort"]; i++) {
				if (trr3.find('input[value="'+i+'"]').is(':checked')) {
					tmpSrcPort |= (1 << (i - 1));
				}
			}
			$container.find('[name="hidSourPort"]').val(tmpSrcPort);

			var queryArrs = Serialize.getQueryArrs($container);
			var queryStr = Serialize.queryArrsToStr(queryArrs);	
			console.log(queryStr);
			var urlStr='';						
			if(DATA["PortMirror6530"] == 1){
				urlStr = '/goform/ConfigMirrorGlobal';
			}else{
				urlStr = '/goform/ConfigPortMirror';
			}
			$.ajax({
				url : urlStr,
				type: 'POST',
				data: queryStr,
				success: function(result){
					var doEval = require('Eval');
					var codeStr = result,
					variableArr = ['status'],
					result = doEval.doEval(codeStr, variableArr),
					isSuccess = result["isSuccessful"];
					if(isSuccess){
						var data = result["data"],
							status = data["status"];
						if(status){
							tips.showSuccess('{saveSuccess}', 2.5);
							var Dispatcher = require('Dispatcher');
							// Dispatcher.reload(2);							
						}else{
							tips.showError('{saveFail}',3);
						}
					}
				}
			});		
		})	
	}
	function showWidget($container, monitorPort, sourcePort, maxLanPort){
		var InputGroup = require('InputGroup');
			/*显示控制*/
		var  monitorDis=false;
			 sourceDis=false;
			 /*被监测口的type控制*/
			 checkBoxType='checkbox';
			 /*保存被检测口的勾选项*/
			 var tmpSrcPort= new Array();
			 /*控制是否为disabled*/
			 monitorCtl=false;
			 srcPortCtl=true;
			 /*处理被监控端口的赋值数据*/
			 for (i = 1; i <= maxLanPort; i++) {
			     if ((sourcePort & (1 << (i - 1))) != 0) {
				 	tmpSrcPort.push(i);
			     }
			 }
		/*
		 * 6530G		显示enable
		 * 8367M 		显示enable 检测口 被监测口
		 * PortMirror 	显示enable
		 * 840E			一对多
		 */
		if(DATA["PortMirror6530"] == 1){
			monitorDis=true;/*控制监控口是否显示*/
			sourceDis=true; /*控制被监控口是否显示*/
			monitorCtl=true;/*控制监控口是否可操作*/	
			monitorPort='1';/*选中LAN1*/
			srcPortCtl=true;/*控制被监控口是否可操作*/
			maxLanPort=4;/*6530G写死*/
			tmpSrcPort=['2','3','4'];/*选中LAN1、LAN2、LAN3、LAN4*/
			sourcePort=tmpSrcPort; 
			checkBoxType='checkbox'; 	
		}
		if(DATA["PortMirror8367M"] == 1){
			/*******一对一******/
			monitorDis=true;
			sourceDis=true;
			checkBoxType='radio';
			monitorCtl=false;/*控制监控口是否可操作*/	
			srcPortCtl=false;/*控制被监控口是否可操作*/
		}
		if(DATA["PortMirror"] == 1){
			monitorDis=false;
			sourceDis=false;
		}
		if(DATA["PortMirror840E"] == 1){
			/*******一对多******/
			monitorDis=true;
			sourceDis=true;
			checkBoxType='checkbox';
		}
		if(DATA["PortMirror762x"] == 1){
			/*******lan1做为监控口,被监控口全选,且都不可操作******/
			monitorDis=true;/*控制监控口是否显示*/
			sourceDis=true; /*控制被监控口是否显示*/
			monitorCtl=false;/*控制监控口是否可操作*/	
			//monitorPort='1';/*选中LAN1*/
			srcPortCtl=false;/*控制被监控口是否可操作*/
			//tmpSrcPort=['2','3','4'];/*选中LAN1、LAN2、LAN3、LAN4*/
			sourcePort=tmpSrcPort; 
			checkBoxType='checkbox'; 
		}
		if(maxLanPort == undefined){
			maxLanPort='1';
		}
		var isOpen = DATA["MirrorEnable"];
		if(isOpen != 'on'){
			isOpen='off';
		}
		var inputList = [
			{
				"prevWord" : '{status}',
				"inputData" : {
					"type" : 'radio',
					"name" : 'MirrorEnable',
					"defaultValue": isOpen,
					"items" : [
						{
							"value" : 'on',
							"name" : '{open}',
						},
						{
							"value" : 'off',
							"name" : '{close}',
						}
					]
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{monitorPort}',
				"display" : monitorDis,
				"disabled":monitorCtl,
				"inputData" : {
					"type" : 'radio',
					"name" : 'monitorPort',
					"defaultValue": monitorPort,
					"count": maxLanPort, 
					"items" : [
						{
							"value" : '1',
							"name" : 'LAN1',
						},
						{
							"value" : '2',
							"name" : 'LAN2',
						},
						{
							"value" : '3',
							"name" : 'LAN3',
						},
						{
							"value" : '4',
							"name" : 'LAN4',
						},	
						{
							"value" : '5',
							"name" : 'LAN5',
						},
						{
							"value" : '6',
							"name" : 'LAN6',
						}																												
					]
				},
				"afterword" : ''
			},
			{
				"prevWord" : '{sourcePort}',
				"display" : sourceDis,
				"disabled":srcPortCtl,
				"inputData" : {
					"type" : checkBoxType,
					"name" : 'sourcePort',
					
					"defaultValue": sourcePort ,
					"count": maxLanPort,
					"items" : [
						{
							"value" : '1',
							"name" : 'LAN1',
						},
						{
							"value" : '2',
							"name" : 'LAN2',
						},
						{
							"value" : '3',
							"name" : 'LAN3',
						},
						{
							"value" : '4',
							"name" : 'LAN4',
						},
						{
							"value" : '5',
							"name" : 'LAN5',
						},
						{
							"value" : '6',
							"name" : 'LAN6',
						}																				
					]
				},
				"afterword" : ''
			},
			{
				"display" : false,
				"inputData" : {
					"type" : "text",
					"name" : 'hidSourPort',
					"defaultValue":''
				}

			},

		];
		var $inputGroup = InputGroup.getDom(inputList);
		//互斥事件
			var trr2 = $inputGroup.find('[name="monitorPort"]').eq(0).parent().parent();
			var trr3 = $inputGroup.find('[name="sourcePort"]').eq(0).parent().parent();
			if(DATA["PortMirror762x"] == 1){
				/*******一对多******/
			    $inputGroup.find('[name="monitorPort"]').click(function(event){
					run1(event)
			    });
			    $inputGroup.find('[name="sourcePort"]').click(function(event){
					run2much(event)
			    });
			    run1();
			    run2much();
			}else if((DATA["PortMirror8367M"] == 1) || (DATA["PortMirror"] == 1)){
			/*******一对一******/
			    $inputGroup.find('[name="monitorPort"]').click(function(event){
					run1(event)
			    });
			    $inputGroup.find('[name="sourcePort"]').click(function(event){
					run2(event)
			    });
			    run1();
			    run2();
		}
		
			function run1(ev){
				if(ev !== undefined){
					var eve = ev || window.event;
					var targ = eve.target || eve.srcElement;
					var $this = $(targ);
					if($this.is(':checked')){
						trr2.find('input:not([disabled])').each(function(){
							trr3.find('input[value="'+$(this).val()+'"]').removeAttr('disabled');
						})
						
						trr3.find('input[value="'+$this.val()+'"]').attr('disabled','disabled');
					}
//					trr3.find('input').removeAttr('disabled');
					
				}else{
					var vals = trr2.find('input:checked').val();
					trr3.find('input[value="'+vals+'"]').attr('disabled','disabled');
				}
			}
			function run2(ev){
				if(ev !== undefined){
					var eve = ev || window.event;
					var targ = eve.target || eve.srcElement;
					var $this = $(targ);
					/*
					if($this.is(':checked')){
						trr2.find('input[value="'+$this.val()+'"]').attr('disabled','disabled');
					}else{
						trr2.find('input[value="'+$this.val()+'"]').removeAttr('disabled');
					}
					*/
					if($this.is(':checked')){
						trr3.find('input:not([disabled])').each(function(){
							trr2.find('input[value="'+$(this).val()+'"]').removeAttr('disabled');
						})
						
						trr2.find('input[value="'+$this.val()+'"]').attr('disabled','disabled');
					}
				}else{
					trr3.find('input:checked').each(function(){
						var vals = $(this).val();
						trr2.find('input[value="'+vals+'"]').attr('disabled','disabled');
					});
					
				}
			}
			function run2much(ev){
				if(ev !== undefined){
					var eve = ev || window.event;
					var targ = eve.target || eve.srcElement;
					var $this = $(targ);
					if($this.is(':checked')){
						trr2.find('input[value="'+$this.val()+'"]').attr('disabled','disabled');
					}else{
						trr2.find('input[value="'+$this.val()+'"]').removeAttr('disabled');
					}
				}else{
					trr3.find('input:checked').each(function(){
						var vals = $(this).val();
						trr2.find('input[value="'+vals+'"]').attr('disabled','disabled');
					});
					
				}
			}
			
		var btnList = [
			{"id" : 'save', "name" : '{save}'}
		];
		var BtnGroup = require('BtnGroup');
		var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
		$container.empty().append($inputGroup, btnHTML);	

		var Translate  = require('Translate');
		var tranDomArr = [$container];
		var dicArr     = ['common','doPort'];
		Translate.translate(tranDomArr, dicArr);

		initEvent($container);
	}
	exports.display = function($container){
			var Translate = require('Translate'); 
			var dicNames = ['common', 'doPort']; 
			Translate.preLoadDics(dicNames, function(){ 

			$container.empty();
			// 加载路径导航模板模块
			$.ajax({
				url : 'common.asp?optType=portMirror',
				type: 'GET',
				success : function(result){
					var doEval = require('Eval');
					var codeStr = result,
						variableArr = [ 'PortMirror6530', 
										'PortMirror8367M',
										'PortMirror',
										'PortMirror840E',
										'PortMirror762x',
										'monitorPort',
										'sourcePort',
										'maxLanPort',
										'MirrorEnable',
										'errorstr'];
						result = doEval.doEval(codeStr, variableArr),
						isSuccess = result["isSuccessful"];
					// 判断代码字符串执行是否成功
					if(isSuccess){
						var data = result["data"],
							PortMirror6530 = data['PortMirror6530'],
							PortMirror8367M = data["PortMirror8367M"],
							PortMirror = data["PortMirror"],
							PortMirror840E = data["PortMirror840E"],
							PortMirror762x = data["PortMirror762x"],
							monitorPort = data["monitorPort"],
							sourcePort = data["sourcePort"],
							maxLanPort = data["maxLanPort"],
							MirrorEnable = data["MirrorEnable"],
							errorstr = data["errorstr"];

							DATA["PortMirror6530"]=PortMirror6530;
							DATA["PortMirror8367M"]=PortMirror8367M;
							DATA["PortMirror"]=PortMirror;
							DATA["PortMirror840E"]=PortMirror840E;
							DATA["PortMirror762x"]=PortMirror762x;

							DATA["monitorPort"]=monitorPort;
							DATA["sourcePort"]=sourcePort;
							DATA["maxLanPort"]=maxLanPort;
							DATA["MirrorEnable"]=MirrorEnable;
							DATA["errorstr"]=errorstr;


						showWidget($('#1'), monitorPort, sourcePort, maxLanPort)
					}else{
						alert('{false}');
					}
				}
			});
		});
	};
})
