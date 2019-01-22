define(function(require, exports, module){
	var _timer = null;
	var _modalObj = null;
	module.exports = {
		checkUser  : checkUser,
		login      : login,
		lockBtn    : lockBtn,
		unLockBtn  : unLockBtn
	};
	function checkUser(){
		var interval = getInterval();
		startTimer(interval);
	}
	function getInterval(){
		var CookieUtil = require('P_core/CookieUtil');
		var interval = CookieUtil.get('overtime') || 15;
		return interval * 1000;
	}
	function startTimer(interval){
		clearTimer();
		_timer = setTimeout(function(){
			redirectLogin();
			/*
				超时后跳转到登录页，不需要弹出登录框
				暂时注释
			 */
			// showLogin();
		}, interval - 5000);
	}
	function clearTimer(){
		if(_timer !== null){
			clearTimeout(_timer);
			_timer = null;
		}
	}
	function showLogin(){
		var modalObj = getModalObj();
		var $input   = getInputGroupDom();
		modalObj.insert($input);
		modalObj.show();
		modalObj.translate(['common']);
	}
	function getModalObj(){
		var modalObj = null;
		var Modal = require('Modal');
		var modalData = {
			"id"    : 'login',
			"title" : '{please}{login}',
			"size"  : 'small',
			"btns"  : [
				{
					"id"      : 'login',
					"name"    : '{login}',
					"clickFunc" : function($this){
						var $modal    = modalObj.getDom();
						var username  = $modal.find('input[name="username"]').val(),
							password  = $modal.find('input[name="password"]').val();
						login(username, password, $this);
					} 
				},
				{
					"type"      : 'reset'
				}
			]
		};
		modalObj = Modal.getModalObj(modalData, false);
		_modalObj = modalObj;
		return modalObj;
	}
	function getInputGroupDom(){
		var InputGroup = require('InputGroup');
		var inputList = [
			{
				"prevWord"  : '{username}',
				"inputData" : {
					"type"   : 'text',
					"name"   : 'username',
					"value"  : ''
				}
			},
			{
				"prevWord"  : '{pwd}',
				"inputData" : {
					"type"   : 'password',
					"name"   : 'password',
					"value"  : ''
				}
			}
		];
		return InputGroup.getDom(inputList);
	}
	function lockBtn($btn){
		$btn.attr('disabled', '');
	}
	function unLockBtn($btn){
		$btn.removeAttr('disabled');
	}
	/**
	 * 对用户名和密码进行检测
	 * 会清除空格
	 * @date   2016-11-16
	 * @return {[type]}   [description]
	 */
	function checkInput(username, password){
		username      = trim(username);
		password      = trim(password);
		if(username !== '' && password !== ''){
			return {
				isLegaled : true,
				username  : username,
				password  : password
			};
		}else{
			return {
				isLegaled : false,
				username  : username,
				password  : password
			};
		}
	}
	function trim(str){
		return str.replace(/\s/g, '');
	}
	function login(username, password, $btn){
		var result    = checkInput(username, password),
			isLegaled = result["isLegaled"],
			username  = result["username"],
			password  = result["password"];
		/*
			判断用户名、密码是否填写
		 */
		if(isLegaled){
			sendLoginReq(username, password, $btn)
		}else{
			if(username == ''){
				showInputUsernameTip();
			}else if(password == ''){
				showInputPwdTip();
			}
		}
	}
	function sendLoginReq(username, password, $btn){
		var _url  = '/action/login';
		var _data = 'username=' + username + '&password=' + password;
		$.ajax({
			url     : _url,
			type    : "POST",
			data    : _data,
			success : function(resJsStr){
				var result = processLoginJsStr(resJsStr);
				if(result !== false){
					var leftPwdNums = result["leftPwdNums"],
						time        = result["time"];
					if(leftPwdNums == '0'){
						/*
							登录成功
						 */
						if(time == '0'){
							if(/login/.test(window.location)){
								redirectHome();
							}else{
								_modalObj.hide();
							}
							checkUser();
						}else{
							lockBtn($btn);
							setTimeout(function(){
								unLockBtn($btn);
							}, time * 1000)
							showNotAllowLoginTip(time);
						}
					}else{
						showLeftLoginTimesTip(leftPwdNums)
					}
				}
			}
		});
	}
	function processLoginJsStr(jsStr){
		var Eval        = require('Eval');
		var variableArr = ['leftPwdNums', 'time'];
		var result      = Eval.doEval(jsStr, variableArr);
		var isSuccess   = result.isSuccessful;
		if(isSuccess){
			var data        = result['data'];
			return {
				leftPwdNums : data['leftPwdNums'],
				time        : data['time']
			};
		}else{
			return false;
		}
	}
	function showInputUsernameTip(){
		var Tips = require('Tips');
		Tips.showWarning('{please}{input}{username}', 1);
	}
	function showInputPwdTip(){
		var Tips = require('Tips');
		Tips.showWarning('{please}{input}{pwd}', 1);
	}
	function showNotAllowLoginTip(interval){
		var Tips = require('Tips');
		var tipStr = '{please}' + interval + '{second}{after}{login}'
		Tips.showWarning(tipStr, interval);
	}
	function showLeftLoginTimesTip(leftTimes){
		var Tips = require('Tips');
		var tipStr = '{input}{error},{you}{have}' + leftTimes + '{times}{login}{chance}'
		Tips.showWarning(tipStr, 1)
	}
	/**
	 * 跳转到登录页
	 * @date   2017-02-15
	 * @return {[type]}   [description]
	 */
	function redirectLogin(){
		top.location = '/noAuth/login.html';
	}
	/**
	 * 跳转到首页
	 * @date   2017-02-15
	 * @return {[type]}   [description]
	 */
	function redirectHome(){
		top.location = './index.html';
	}
});
