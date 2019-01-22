/*
var loginData = {
	lang: 'zhcn',
	dics: {
		zhcn: {
			username: '用户名',
			password: '密码',
			reset: '重 置',
			login: '登 录',
			msg: '版权所有@深圳市简芯科技有限公司 保留一切权利',
			please: '请',
			input: '输入',
			second: '秒',
			after: '后',
			error: '错误',
			you: '你',
			have: '还有',
			times: '次',
			chance: '机会',
			netmanaasystem:'网络管理系统'
		},
		en: {
			username: 'Username',
			password: 'Password',
			reset: 'reset',
			login: 'login',
			msg: 'utt'
		}
	}
}
getLangConf(afterLoad);
function getLangConf(callback){
	var _url = '/noAuth/noAuthAspOut.asp?optType=lang';
	$.ajax({
		url: _url,
		type: 'GET',
		success: function(response){
			try{
			   eval(response);
			    loginData.lang = lang;
			    callback();
			}catch(e){
			    callback();
			}
		}
	})
};

*/

// 构造define方法 获取翻译内容
thisDic = {}; // 存放获取的字典
//
function define(){
	if(arguments[0]){
		thisDic = arguments[0];
	}
}

//window.onload = function(){
	console.log("当前页面对应字典："+lang); // 语言已在html中的script加载
	// 创建script标签用来获取对应字典
	var srcEle = document.createElement('script'); 
	srcEle.setAttribute('src', '../lang/'+lang+'/login.js'); 
	document.getElementsByTagName('body')[0].appendChild(srcEle);
	srcEle.onload = function(){
		afterLoad();
	}
//}
// 字典加载完毕后
function afterLoad(){
	
	showText();
	initEvent();
	showCookiewCanUse();
}

/*检测是否允许使用cookie*/
function showCookiewCanUse(){
	if(!(document.cookie || navigator.cookieEnabled))
	{
		alert('您的浏览器已关闭Cookie，这将会影响到页面功能的使用，请手动开启Cookie后刷新页面重试！');
	}else{
		console.log('document.cookie:'+document.cookie)
		console.log('navigator.cookieEnabled:'+navigator.cookieEnabled)
	}
}
/*
	显示文字
 */
function showText(){
	$('input[name="username"]').attr('placeholder',T('username'));
	$('input[name="pwd"]').attr('placeholder',T('password'));
	$('button[type="reset"]').text(T('reset'));
	$('#login_btn').text(T('login'));
	$('#company-msg').text("");
	$('#logospan').text(T('netmanaasystem'));
}
function initEvent(){
	var $form = $("form");
	var $submit = $form.find('#login_btn');
	var $inputs = $form.find('input');
	unLockBtn($submit);
	$submit.click(function(e){
		var $btn = $(this);
		var username  = $form.find('input[name="username"]').val(),
			password  = $form.find('input[name="pwd"]').val();
		login(username, password, $btn);
	});
	$inputs.keydown(function(event) {
		if(event.keyCode == 13){
			$submit.trigger('click');
			return false;
		}
	});
}
function lockBtn($btn){
	$btn.attr('disabled', '');
}
function unLockBtn($btn){
	$btn.removeAttr('disabled');
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
						redirectHome();
					}else{
						lockBtn($btn);
						setTimeout(function(){
							unLockBtn($btn);
						}, time * 1000)
						showNotAllowLoginTip(time);
					}
				}else{
					showLeftLoginTimesTip(leftPwdNums);
				}
			}
		}
	});
}
function processLoginJsStr(jsStr){
	try {
		eval(jsStr);
		return {
			leftPwdNums : leftPwdNums,
			time        : time
		};
	}catch (err) {
		return false;
	}
}
function redirectHome(){
	top.location = '/index.html';
}
function T(key){
	return thisDic[key] || key;
//	return loginData.dics[loginData.lang][key] || key;
}
function showInputUsernameTip(){
	var str = T('please') + T('input') + T('username');
	showWarning(str, 3);
}
function showInputPwdTip(){
	var str = T('please') + T('input') + T('password');
	showWarning(str, 3);
}
function showNotAllowLoginTip(interval){
	
	var end = setInterval(function(){
		if(interval < 1){
			clearInterval(end);
		}
		var tipStr = T('please') + interval + T('second') + T('after') + T('login_null');
		showWarning(tipStr, interval);
		interval--;
	},1000)
}
function showLeftLoginTimesTip(leftTimes){
	var tipStr = T('input') + T('error') + ',' + T('you') + T('have') + leftTimes
				+ T('times') + T('login') + T('chance');
	showWarning(tipStr, 3)
}
function showWarning(str, interval){
	var $el = $('#warning-msg');
	$el.text(str).removeClass('hide');
	setTimeout(function(){
		$el.addClass('hide');
	}, interval * 1000);
}






