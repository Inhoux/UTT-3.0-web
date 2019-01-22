define(function(require, exports, module) {
	var DATA={};
	require('jquery');






	function display($con){

		// 获取页面输入框
		var $inputDom = getPage();
		$con.empty().append($inputDom);

		//请求第一个ajax,并修改数据

		getData($inputDom);

	}

	/**
	 * 获取初始，并修改页面
	 * @param {jqdom} $dom 输入组对象
	 */
	function getData($dom){
		$.ajax({
				url:"common.asp?optType=aspOutApplicationVersion",
				type:'get',
				success: function(rsp){
					var Eval = require('Eval');
					var result = Eval.doEval(rsp, ['appDiscernVersion','appPriorityVersion','upstate','appDiscernInfo','appPriorityInfo'])
					var data = result.data;

			    	var dvinfo = data.appDiscernInfo||'';
			    	var pvinfo = data.appPriorityInfo||'';
					$dom.find('[name="strategyName"]').text(data.appDiscernVersion); // 显示版本号
					$dom.find('[name="priorityName"]').text(data.appPriorityVersion);// 显示应用版本号
					$dom.find('#showState').empty().append(getShowStateDom(data.upstate,$dom,dvinfo,pvinfo)); // 显示底部
				},
				error:function(data){
				}
		    });
	}

	/**
	 * 根据状态值获取当前显示的按钮及信息
	 * @param {Object} upstate
	 */
	function getShowStateDom(upstate,$dom,dv,pv){
		var statedom = [];
		var sn = upstate.toString();

		var $versionInfo = $('<button class="btn btn-primary" id="vinfo"  style="margin-left:10px">版本信息</button>');
		var $onkeyUpdate = $('<button class="btn btn-primary" id="onkeyup"  style="margin-left:10px">一键更新</button>');

		// 版本说明点击事件
		$versionInfo.click(function(){
			var mdlst = {
				id:"readme",
				title:'版本说明',
				btns:[]
			};
			var modal = require('Modal');
			var modalObj = modal.getModalObj(mdlst);
			var rn1 = '<p>';
			var rn2 = '<p>';
			if(dv){
				rn1 = dv.replace(new RegExp("\r\n","g"),'</br>');
				rn1 = '<h4>应用策略库版本说明：</h4><p>' + rn1;
			}
			if(pv){
				rn2 = pv.replace(new RegExp("\r\n","g"),'</br>');
				rn2 = '<h4>应用优先模板版本说明：</h4><p>' + rn2;
			}
			var innerStr = rn1+'</p>'+rn2+'</p>';
			modalObj.insert(innerStr);
			modalObj.show();
		});
		// 一键升级点击事件
		$onkeyUpdate.click(function(){
			var waits = require('Tips').showWaiting('更新中……');
			$.ajax({
				url:"goform/formApplicationAutoUpdate",
				type:'post',
				data:'',
				success: function(rsp){
					eval(rsp);
					if(upstate.toString()){
						if(upstate == 6){
							$dom.find('#showState').empty().append('<span>更新成功</span>');
							$('a[href="#3"]').trigger('click');
						}else if(upstate == 7){
							$dom.find('#showState').empty().append('<span>更新失败</span>');
							$dom.find('#showState').append($versionInfo);
							$dom.find('#showState').append($onkeyUpdate);
						}else{
							$dom.find('#showState').empty().append('<span>更新状态错误</span>');
							$dom.find('#showState').append($versionInfo);
							$dom.find('#showState').append($onkeyUpdate);
						}
						waits.remove();
					}
				},
				error:function(data){
					$dom.find('#showState').empty().append('<span>更新状态错误</span>');
				}
		    });
		});

		// 根据状态跟新显示
		if(sn == '0'){
			statedom.push($('<span></span>'));
			getData($dom);
		}else if(sn == '1'){
			statedom.push($('<span>检测中……</span>'));
			getData($dom);
		}else if(sn == '2'){
			statedom.push($('<span>检测失败</span>'));
			var $recheck = $('<button class="btn btn-primary" id="recheck" style="margin-left:10px">重新检测</button>');
			$recheck.click(function(){
				getData($dom);
			});
			statedom.push($recheck);
		}else if(sn == '3'){
			statedom.push($('<span>未检测到更新版本</span>'));
		}else if(sn == '4'){
			statedom.push($('<span>检测到新版本</span>'));
			statedom.push($versionInfo);
			statedom.push($onkeyUpdate);

		}else if(sn == '5'){
			statedom.push($('<span>更新中……</span>'));
			getData($dom);
		}else if(sn == '6'){
			statedom.push($('<span>更新成功</span>'));
		}else if(sn == '7'){
			statedom.push($('<span>更新失败</span>'));
			statedom.push($versionInfo);
			statedom.push($onkeyUpdate);
		}

		return statedom;
	}

	/**
	 * 生成页面输入框组
	 */
	function getPage(){
		// 生成页面
		var inpulist = [
			{
				"prevWord": '应用策略库版本',
				"disabled"	 : true,
				"inputData": {
					"type"       : 'text',
					"name"       : 'strategyName',
					"value"		 : '',
				},
				"afterWord": ''
			},
			{
				"prevWord": '应用优先模板版本',
				"disabled"	 : true,
				"inputData": {
					"type"       : 'text',
					"name"       : 'priorityName',
					"value"		 : '',
				},
				"afterWord": ''
			},
			{
				"prevWord": '版本状态',
				"inputData": {
					"type"       : 'text',
					"name"       : 'state',
					"value"		 : '',
				},
				"afterWord": ''
			}
		];
		var IG = require('InputGroup');
		var $inputdom = IG.getDom(inpulist);
		
		$inputdom.find('td').css('padding-top','10px');
		
		// 修改检测版本字体
		var $sn = $inputdom.find('[name="strategyName"]');
		$sn.after('<b name="strategyName">'+$sn.val()+'</b>');
		$sn.remove();
		
		var $pn = $inputdom.find('[name="priorityName"]');
		$pn.after('<b name="priorityName">'+$pn.val()+'</b>');
		$pn.remove();
		
		// 检测状态栏
		var $prevpdom = $inputdom.find('[name="state"]').parent();
		$prevpdom.next().remove();
		$prevpdom.attr({'colspan':2,'id':'showState'});
		$prevpdom.empty().append('<span>检测中……</span>');

		return $inputdom;
	}



	// 提供对外接口
	module.exports = {
		display: display
	};
});
