define(function(require, exports, module) {
	require('jquery');
	var DATA={};
	var Tips = require('Tips');
	function getInputs(data){
//		console.log(DATA.licenseData[0][0]);
//		console.log(DATA.licenseData[0][1]);
//		console.log(DATA.licenseData[0][2]);
//		console.log(DATA.licenseData[0][3]);
//		console.log(DATA.licenseData[0][4]);
//		console.log(DATA.licenseData[0][5]);
		var inputlist = [
			{
				"prevWord": '您的产品License有效期为',
				"inputData": {
					"type"       : 'text',
					"name"       : 'yxq',
				}
			},
			{
				"prevWord": '当前产品授权登记信息',
				"inputData": {
					"type"       : 'text',
					"name"       : 'djxx',
				}
			},
			{
				"prevWord": '产品型号',
				"inputData": {
					"type"       : 'text',
					"name"       : 'cpxx',
				}
			},
			{
				"prevWord": '序列号',
				"inputData": {
					"type"       : 'text',
					"name"       : 'xlh',
				}
			},
			{
				"prevWord": '授权登记客户信息',
				"inputData": {
					"type"       : 'text',
					"name"       : 'khxx',
				}
			},
			{
				"prevWord": '授权登记IP地址',
				"inputData": {
					"type"       : 'text',
					"name"       : 'ipdz',
				}
			},
			{
				"prevWord": '授权登记MAC地址',
				"inputData": {
					"type"       : 'text',
					"name"       : 'macdz',
				}
			},
			{
				"prevWord": '导入License',
				"inputData": {
					"type"       : 'text',
					"name"       : 'drl',
				}
			},
			{
				"prevWord": '请选择License文件',
				"inputData": {
					"type"       : 'text',
					"name"       : 'chooseFile',
				}
			},
			{
				"prevWord": '使用提示',
				"inputData": {
					"type"       : 'text',
					"name"       : 'ssts',
				}
			},
			{
				"prevWord": '',
				"inputData": {
					"type"       : 'text',
					"name"       : 'texts',
				}
			}
		];
		var IG = require('InputGroup');
		var $dom = IG.getDom(inputlist);
		
		// 增加小组件
		
		// 判断显示有效期
		var $alltime  = $('<span style="color:#0A76E0;font-weight:bold"></span>');
		var $outofdate = $('<span style="color:#0A76E0;font-weight:bold"></span>');
		var $timeleft = $('<span style="font-weight:bold"></span>');
		var $timelefthour = $('<span style="color:#0A76E0;font-weight:bold"></span>');
			if(data.isForver == 1) {
				$alltime.text('永久')
			} else {
				if(data.isOutDate == 1 || data.remaintime<=0) {
					$alltime.text(data.impowertime +'月 ');
					$outofdate.text('已过期 ');
					$timeleft.text('请重新导入License文件 否则无法访问其他页面 ');
				} else {
					$alltime.text(data.impowertime +'月 ');
					$outofdate.text('未过期 ');
					$timeleft.text('剩余时间：  ');
					$timelefthour.text(Math.ceil(data.remaintime/24)+'天 ');
				}
			}

			
		v('yxq').parent().prev().attr('colspan','3').append($alltime,$outofdate,$timeleft,$timelefthour).children().css('font-weight','bold');
		v('yxq').parent().next().remove();
		v('yxq').parent().remove();
		
		v('djxx').parent().prev().attr('colspan','3').children().css({fontWeight:'bold'});
		v('djxx').parent().next().remove();
		v('djxx').parent().remove();
		var model = data.ProductID;
		v('cpxx').after(model).parent().prev().css({paddingLeft:'50px'});
		//v('cpxx').after('网安™ 5830G').parent().prev().css({paddingLeft:'50px'});
		v('cpxx').remove();
		var sn = data.productIDs;//序列号
		v('xlh').after(sn).parent().prev().css({paddingLeft:'50px'});
		v('xlh').remove();
		
		var userinformation = data.userinfo;//用户信息
		if(data.includeuser == 1){
			v('khxx').after(userinformation).parent().prev().css({paddingLeft:'50px'});
			v('khxx').remove();
		}else{
			v('khxx').parent().parent().remove();
		}
		
		var ipaddr = data.ip;//ip
		if(data.includeip == 1){
			v('ipdz').after(ipaddr).parent().prev().css({paddingLeft:'50px'});
			v('ipdz').remove();
		}else{
			v('ipdz').parent().parent().remove();
		}
		
		
		var macaddr =data.mac;//mac
		if(data.includemac == 1){
			v('macdz').after(macaddr).parent().prev().css({paddingLeft:'50px'});
			v('macdz').remove();
		}else{
			v('macdz').parent().parent().remove();
		}
		
		
		v('drl').parent().prev().attr('colspan','3').children().css({fontWeight:'bold'});
		v('drl').parent().next().remove();
		v('drl').parent().remove();
		
		v('chooseFile').before('<button class="btn-sm btn-primary" data-local="选择文件" type="button" id="chooseFile" style="margin-right:10px">选择文件</button>').parent().prev().css({paddingLeft:'50px'});

		$dom.find('#chooseFile').after('<input type="file" id="filename" name="filename" class="btn-sm btn-primary u-hide" />');
		// $dom.find('#chooseFile').after('<input type="text" name="filenames" id="filename" value="license" class="u-hide" />');
				
		//选择文件模拟点击
		$dom.find('#chooseFile').click(function(){
			$dom.find('#filename').click();
		});
		var $innerinputfile = $dom.find('#filename');
		$innerinputfile.change(function(){
			var  t = $(this);
			var ival = t.val();
			$dom.find('[name="chooseFile"]').val(ival.substr(ival.lastIndexOf('\\')+1))
			// $dom.find('[name="filename"]').val(ival.substr(ival.lastIndexOf('\\')+1))
		});


		v('ssts').parent().prev().attr('colspan','3').children().css({fontWeight:'bold'});
		v('ssts').parent().next().remove();
		v('ssts').parent().remove();
		
		v('texts').parent().prev().attr('colspan','5').append('<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;初始的License许可文件，自设备首次运行之日起提供累计720小时（30天）<br>的完整权限，超出有效期后您在登录设备时仅能访问电子授权页面，请及时从提<br>供您设备的经销商处获取正式的License许可文件。</span>');
		v('texts').parent().next().remove();
		v('texts').parent().remove();
		
		var btns = [
			{
				id : 'innerput',
				name : '导入',
				clickFunc :function($thisDom){
							if($dom.find('#filename').val()==''){
								Tips.showWarning('尚未选择导入的文件',3);
							}else{
//								Tips.showConfirm('注意：如果配置文件不正确，将导致现有配置被清空,建议先保存现有配置。您确定要继续吗？',function(){
									 var waits = Tips.showWaiting('文件上传中');
									 var fdom = $('#iframe5')[0];
									 var formData = new FormData(fdom);  
								     $.ajax({
								          url: '/goform/UpdateLicenseFile',  
								          type: 'POST',  
								          data: formData,   
								          cache: false,  
								          contentType: false,  
								          processData: false,  
											success: function(result) {
												waits.remove();
												var doEval = require('Eval');
												var codeStr = result,
													variableArr = ['status', 'errorstr'],
													result = doEval.doEval(codeStr, variableArr);
												// 判断代码字符串执行是否成功
												var data = result["data"],
													status = data['status'];
												if (status) {
													//window.location.reload();
													Tips.showSuccess("{C_LANG_INDEX_LICENSE_LOAD_SUCCESS}");
													display($('#5'));
												} else {
													var errorstr=data.errorstr;
													if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
														Tips.showError('{fileIsNullNeedReselectFile}');
													}else{
														Tips.showWarning(errorstr);
													}									
												}
											}
								     });  
//								})
							
							}
						}
			}
		];
		IG.insertBtn($dom,'chooseFile',btns);
		
		return $dom;
		
		function v(name){
			return $dom.find('[name="'+name+'"]');
		}
	}
	function processData(jsStr) {
	    // 加载Eval模块
	    var doEval = require('Eval');
	    var Tips = require('Tips');
	    var codeStr = jsStr,
	      // 定义需要获得的变量
	    variableArr = [
	    	'impowertime', 
	    	'productIDs', 
	    	'ProductID',
	    	'userinfo',
	    	'ip',
	    	'mac',
	    	'remaintime',
	    	'isForver',
	    	'isOutDate',
	    	'includeuser',
	    	'includeip',
	    	'includemac'
	    	];
	    // 获得js字符串执行后的结果
	    var result = doEval.doEval(codeStr, variableArr),
	      isSuccess = result["isSuccessful"];
	    // 判断代码字符串执行是否成功
	    if (isSuccess) {
	      // 获得所有的变量
	      var data = result["data"];
	      // 将返回的JS代码执行所生成的变量进行复制
	      // 返回处理好的数据
	      var licenseData = {
		        impowertime : data["impowertime"], // 总月数
		        ProductID   : data["ProductID"],  
		        productIDs  : data["productIDs"], 
		        userinfo    : data["userinfo"], 
		        ip          : data["ip"], 
		        mac         : data["mac"],
		        remaintime  : data["remaintime"], // 剩余小时
		        isForver    : data["isForver"], // 永久?
		        isOutDate   : data["isOutDate"], // 是否过期
		        includeuser : data["includeuser"], // 是否显示客户信息
		        includeip   : data["includeip"], // 是否显示ip
		        includemac  : data["includemac"] // 是否显示mac
	        };
	      
	      	console.log(licenseData);
	      return licenseData;
	    } else {
	      Tips.showError('{parseStrErr}}',3);
	    }
	}

	function display($container) {
	    $.ajax({
	      url: 'common.asp?optType=license',
	      type: 'GET',
	      success: function(result) {
	      		var data = processData(result);
	        // 将后台数据处理为数据表格式的数据
				//获得表单组
				var $inputs = getInputs(data); 
				$container.empty().append('<form id="iframe5"  method="post"  action="/goform/UpdateLicenseFile" enctype="multipart/form-data"></form>');
				$container.find('#iframe5').append($inputs);
	        	//获取表单dom
				// var $idom = getInputDoms();
				// //给按钮绑定事件
				// setClickFunction($idom);
				// $container.empty().append($idom);
				// $idom.wrap('<form  method="post" action="/goform/UpdateFirmware" enctype="multipart/form-data"></form>');
	      }
	    });			
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});