define(function(require, exports, module) {
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
        //获得认证配置页面
        var Translate = require('Translate');
        var dicArr = ['common','doUserAuthentication'];

        function T(_str) {
            return Translate.getValue(_str, dicArr);
        }
	function setModalDom(data) {
		
		var bmdlb = [];
		data.bmdlb.forEach(function(obj){
			bmdlb.push({name:obj,value:obj});
		});
		
		var ml = {
			id: 'remoteConfig',
			title: T('RemoteAuth'),
			"btns": [{
				"type": 'save',
				"clickFunc": function($this) {
					var $modal = $this.parents('.modal');
					if(require('InputGroup').checkErr($modal.find('[name="wllxxsj"]').parent())<=0){
						saveBtnRemote();
					}
				}
			}, {
				"type": 'reset'
			}, {
				"type": 'close'
			}]
		};
		var Modal = require('Modal');
		var modalObj = Modal.getModalObj(ml);
		DATA.modalObj = modalObj;
		
		// 白名单列表
		
		
		var il = [
		
		{
			"prevWord": '{SerialNumber}',
			"inputData": {
				"value": df(data.xlh)|| '',
				"type": 'text',
				"name": 'xlh'
			},
			"afterWord": ''
		}, 
		{
			"prevWord": '{ActivationCode}',
			"display" : false,
			"inputData": {
				"value": df(data.jhm)|| '',
				"type": 'text',
				"name": 'jhm'
			},
			"afterWord": ''
		}, 
		{
			"prevWord": '{NoFlowOffTime}',
			"necessary": true,
			"inputData": {
				"value": df(data.wllxxsj)|| '',
				"type": 'text',
				"name": 'wllxxsj',
				"checkDemoFunc":["checkInput","num","5","1440"]
			},
			"afterWord": ''
		}, 
		{
			"inputData": {
				"type": 'title',
				"name": '{DomainNameWhiteList}'
			},
		}, 
		{
			"prevWord": '{DomainName}',
			"inputData": {
				"value": df(data.ymmc)|| '',
				"type": 'text',
				"name": 'ymmc',
				"checkDemoFunc":["checkInput","ip","0","domain"]
			},
			"afterWord": ''
		}, 
		{
			"prevWord": '{WhiteList}',
			"inputData": {
				"defaultValue": '',
				"type": 'select',
				"name": 'bmdlb',
				items: bmdlb
			},
			"afterWord": ''
		},
		{
			"inputData": {
				"value": T('Tip1'),
				"type": 'text',
				"name": 'note1',
			},
		},
		{
			"inputData": {
				"value": T('Tip2'),
				"type": 'text',
				"name": 'note2',
			},
		}];
		var IG = require('InputGroup');
		var $idom = IG.getDom(il);
		Translate.translate([$idom], dicArr);
		// 添加按钮
		var ll1 = [{
			id: 'addWhiteList',
			name: T('add'),
			clickFunc: function($thisDom) {
				
				if(require('InputGroup').checkErr($('[name="ymmc"]').parent()) == 0){
					var nosame = true;
					var newip = $('[name="ymmc"]').val();
					if(newip === null || newip === ''){
						return false;
					}
					$('[name="bmdlb"]>option').each(function(){
						if($(this).val() == newip){
							nosame = false;
						}
					});
					if(nosame){
						$.ajax({
							type:"post",
							url:"goform/websWhiteList",
							data:'addHostFilter='+newip,
							success:function(result){
								eval(result);
								if(status){
									// Tips.showSuccess('添加白名单成功');
									$('[name="bmdlb"]').prepend('<option value="'+newip+'">'+newip+'</option>');
									$('[name="ymmc"]').val('');
								}else{
									Tips.showError(T('AddWhileListFail'));
								}
							}
						});
					}else{
					    Tips.showError(T('Domain_name_already_exists_in_the_white_list'));
					}
				}
			}
		}
		];
		IG.insertBtn($idom, 'ymmc', ll1);


		//删除 清空按钮
		var ll2 = [{
			id: 'deletWhiteList',
			name: T('delete'),
			clickFunc: function($thisDom) {
				var deletval = $idom.find('[name="bmdlb"]>option:selected').eq(0).val();
				if(deletval !=='' && deletval!== undefined){
					$.ajax({
						type:"post",
						url:"goform/formWhiteListDel",
						data:'delstr='+deletval,
						success:function(result){
							eval(result);
							if(status){
								// Tips.showSuccess('删除白名单成功');
								$idom.find('[name="bmdlb"]>option:selected').remove();
							}else{
								Tips.showError(T('DelWhileListFail'));
							}
						}
					});
				}
				
			}
		}, 
		{
			id: 'cleanWhiteList',
			name: T('Empty'),
			clickFunc: function($thisDom) {
				Tips.showConfirm(T('Ensure'),function(){
					$.ajax({
						type:"post",
						url:"goform/formWhiteListDelAll",
						data:'',
						success:function(result){
							eval(result);
							if(status){
								$idom.find('[name="bmdlb"]').empty();
							}else{
								Tips.showError(T('BlankListFailed'));
							}
						}
					});
				});
			}
		}
		];
		IG.insertBtn($idom, 'bmdlb', ll2);
		
		// 修改样式
		$idom.find('#deletWhiteList,#cleanWhiteList').css({top:'29px',position:'relative'});
		
		$idom.find('[name="note1"],[name="note2"]').parent().attr('colspan','2').next().remove();
		
		$idom.find('[name="xlh"],[name="jhm"],[name="note1"],[name="note2"]').each(function(){
			var $t = $(this);
			$t.after('<span>'+$t.val()+'</span>');
			$t.remove();
		});
		
		$idom.find('[name="wllxxsj"]').after('<span style="margin-left:5px">'+'分钟'+'</span>');
		
		$idom.find('[name="ymmc"]').css({width:'334px'});
		
		$idom.find('[name="bmdlb"]').attr({
			number : '6',
			multiple:'multiple'
		}).css({
			width:'334px',
			overflow:'auto'
		});

    if(DATA.data.staleTimeEn && (typeof(DATA.data.wifidog_stale) == 'undefine'))
    {
        DATA.data.wifidog_stale = 1;
    }
		if(!DATA.data.staleTimeEn || !DATA.data.wifidog_stale){
			$idom.find('[name="wllxxsj"]').parent().parent().addClass('u-hide');
		}
		
		var $modal = modalObj.getDom();
		var $modalFooter2 = $('<div class="modal-footer" style="height:120px;position:relative"></div>');
		$modalFooter2.append('<span data-local="{Prompt}" style="position:absolute;top:10px;left:30px">{Prompt}：</span>');
		$modalFooter2.append('<span style="position:absolute;top:40px;left:75px">'+T('Tip3')+'<a href="http://b.greenwifi.com.cn/register.jsp" target="_blank">'+T('Tip4')+'</a></span>');
		$modalFooter2.append('<span style="position:absolute;top:65px;left:75px">'+T('Tip5')+'<a href="http://b.greenwifi.com.cn/login.jsp" target="_blank">'+T('Login')+'</a>'+T('Tip6')+'<a href="http://www.greenwifi.com.cn/help/help.htm" target="_blank">'+T('Tip7')+'</a></span>');
		//$modal.find('.modal-content').append($modalFooter2);
		
		modalObj.insert($idom);
		modalObj.show();
		modalObj.translate(dicArr);
	}
	
	function df(obj){
		return (obj === undefined?false:obj);
	}
	
	/*保存方法*/
	function saveBtnRemote(){
		var Serialize = require('Serialize');
		var olddatas = DATA.oldData;
		olddatas['staleTime'] = $('[name="wllxxsj"]').val();
		olddatas.enabled = (olddatas.lively == 1 ? "on" : "off");
		console.log(olddatas);
		if(olddatas.noAuthType == 'ip')
		{
			olddatas.noAuthData = olddatas.noAuthIp;
		}
		else if(olddatas.noAuthType == 'org'){
				olddatas.noAuthData = olddatas.orgData;
		}else{
				olddatas.noAuthData = '';
		}
		var newData = Serialize.queryJsonToStr(olddatas);
		
		console.log(newData);
		
		$.ajax({
			url : '/goform/formWebAuthGlobalConfig',
			type: 'POST',
            data : newData,
			success : function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['status','errorStr'];
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
					if(isSuccess){
						data = result["data"];
						if(data.status){
							DATA.modalObj.hide();
							Tips.showSuccess('{saveSuccess}');
							$('[href="#1"]').trigger('click');
						}else{
							Tips.showWarning('{saveFail}');
						}
					}else{
						Tips.showError('{parseStrErr}');
					}
			}
		});
	}
	
	function display(oldData){
		//ajax获取数据，获取成功执行生产弹框方法
		var data = {};
		//获取配置信息
		$.ajax({
			url : 'common.asp?optType=remoteAuth',
			type: 'GET',
			success : function(result){
				var doEval = require('Eval');
				var codeStr = result,
				variableArr = ['productIDs','ActCode','DnsLists','staleTimeEn', 'wifidog_stale'];
				result = doEval.doEval(codeStr, variableArr),
				isSuccess = result["isSuccessful"];
				console.log(result);
					if(isSuccess){
						//var DATA['a'] = result;
						data = result["data"];
						DATA.data = data;
						newdata = {
							xlh : data.productIDs,
							jhm : data.ActCode,
							wllxxsj: oldData.staleTime,
							bmdlb : data.DnsLists
						};
						DATA.oldData = oldData;
						console.log(oldData);
						
						setModalDom(newdata);
					}else{
						Tips.showError('{parseStrErr}');
					}
			}
		});

		
	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});
