// 默认语言
var lang = 'zhcn';

// 迷你字典
var dic = {
	zhcn :{
		page_title : '修改密码',
		modfpaswd : '修改密码:',
		username : '用户名',
		oldpswd : '旧密码',
		newpswd : '新密码',
		confirmpswd : '确认密码',
		submit : '提交',
		tips1 : '提示：今天您还可以进行',
		tips2 : '次修改密码的操作',
		C_LANG_INDEX_YOU_HAVE_NO_LEGAL_POWER : '您没有权限！',
		C_LANG_INDEX_INPUT_DATA_ERROR  : '输入的用户名或密码错误',
		C_LANG_INDEX_SUCCESSFUL_OPERATION : '操作成功',
		C_LANG_INDEX_OLD_PASSWD_CIN_ERR :'旧密码填写错误！',
		C_LANG_INDEX_YOU_MODIFY_5_TIMES_MORE : '您修改超过5次',
		C_LANG_INDEX_THIS_ACCOUNT_NOT_CONNECT : '此账号未连接',
		C_LANG_INDEX_NO_LEGAL_POWER_FOR_OPERATION : '您没有权限进行此操作！',
		C_LANG_INDEX_YOUR_ARGS_WAS_WRONG : '提交的参数有误！',
		C_LANG_INDEX_PASSWD_NEW_PASSWD_DIFF : '新密码与确认密码不同',
		C_LANG_INDEX_NOT_ALLOWED : '您所在的用户组没有权限访问此页面'
	},
	en  :{
		page_title : '',
		modfpaswd : '',
		username : '',
		oldpswd : '',
		newpswd : '',
		confirmpswd : '',
		submit : '',
		tips1 : '',
		tips2 : '',
		C_LANG_INDEX_YOU_HAVE_NO_LEGAL_POWER : '您没有权限！',
		C_LANG_INDEX_INPUT_DATA_ERROR  : '输入的用户名或密码错误',
		C_LANG_INDEX_SUCCESSFUL_OPERATION : '操作成功',
		C_LANG_INDEX_OLD_PASSWD_CIN_ERR : '旧密码填写错误！',
		C_LANG_INDEX_YOU_MODIFY_5_TIMES_MORE : '您修改超过5次',
		C_LANG_INDEX_THIS_ACCOUNT_NOT_CONNECT : '此账号未连接',
		C_LANG_INDEX_NO_LEGAL_POWER_FOR_OPERATION : '您没有权限进行此操作！',
		C_LANG_INDEX_YOUR_ARGS_WAS_WRONG : '提交的参数有误！',
		C_LANG_INDEX_PASSWD_NEW_PASSWD_DIFF : '新密码与确认密码不同',
		C_LANG_INDEX_NOT_ALLOWED : '您所在的用户组没有权限访问此页面'
	}
};
// 翻译词条
//console.log(document.querySelectorAll('tr')[1].getElementsByTagName("span"))
function translate(){
	var tr = document.querySelectorAll('tr');
	document.querySelector('head>title').innerHTML = dic[lang][page_title];
	document.querySelector('#title_word').innerHTML = dic[lang][modfpaswd];
	tr[0].getElementsByTagName("span").innerHTML = dic[lang][username];
	tr[1].getElementsByTagName("span").innerHTML = dic[lang][oldpswd];
	tr[2].getElementsByTagName("span").innerHTML = dic[lang][newpswd];
	tr[3].getElementsByTagName("span").innerHTML = dic[lang][confirmpswd];
	document.querySelector('#login_btn').innerHTML = dic[lang][submit];
	document.querySelector('#modify_times').innerHTML = dic[lang][tips1]+'<span id="userOptCnt">0</span>'+dic[lang][tips2];
}
window.onload = function(){
	ajax();
	function ajax() {
        //先声明一个异步请求对象
        var xmlHttpReg = null;
        xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
        //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
        if (xmlHttpReg != null) {
            xmlHttpReg.open("GET", "/noAuth/noAuthAspOut.asp?optType=webAuthMessage", true);
            xmlHttpReg.send(null);
            xmlHttpReg.onreadystatechange = doResult; //设置回调函数
        }
        function doResult() {
            if (xmlHttpReg.readyState == 4) {//4代表执行完成
                if (xmlHttpReg.status == 200) {//200代表执行成功
                	var result = xmlHttpReg.responseText;
                  	eval(result);
					var pictureDir = "";
	
					 if (!isWebAuthIp) {
					 	var loginnode = document.getElementById('login_box');
					 	loginnode.parentNode.removeChild(loginnode);
					 	
					 	var noticenode = '<p style="width:600px;height:50px;text-align:center;margin:100px auto;color:#fff;border:1px solid #fff;padding:auto 100px;padding-top:20px;font-size:20px">'+dic[lang]['C_LANG_INDEX_NOT_ALLOWED']+'</p>';
					 	document.body.innerHTML = noticenode;
					 	return ;
					 }
//					 if(userOptCnt == 0){
//					 	alert("没有机会修改密码了");
//					 }
					var data = {
						userOptCnt : userOptCnt,
						optResult : optResult,
					}
					resetwindow(data);
	            }
            }

        }
    };
	function resetwindow(demodata){
		// 初始化点击事件
		setFuncs(demodata)
		// 初始化布局
		bodyResize();
	};
}

window.onresize = function(){
	//初始化布局
	bodyResize();
}

function bodyResize(){
//	var wh = document.documentElement.clientHeight;
	document.getElementsByTagName('body')[0].style.height = document.getElementsByTagName('html')[0].style.height;
}
//绑定事件
function setFuncs(demodata){
	document.getElementById("userOptCnt").innerHTML = demodata.userOptCnt;
//	document.getElementById("optResult").innerHTML = demodata.optResult;

	var userName = document.querySelector("input[name='userName']");
	var oldPasswd = document.querySelector("input[name='oldPasswd']");
	var newPasswd = document.querySelector("input[name='newPasswd']");
	var verifyPasswd = document.querySelector("input[name='verifyPasswd']");
	document.getElementById("login_btn").onclick = function(){
		this.blur();
		ajax();
		function ajax() {
	        //先声明一个异步请求对象
	        var xmlHttpReg = null;
	        xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
	        //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
	        if (xmlHttpReg != null) {
	            xmlHttpReg.open("POST", "/goform/formWebAuthSelfHelpConfig?userName="+userName.value+"&oldPasswd="+oldPasswd.value+"&newPasswd="+newPasswd.value+"&verifyPasswd="+verifyPasswd.value, true);
	            xmlHttpReg.send();
	            xmlHttpReg.onreadystatechange = doResult; //设置回调函数
	        }
	        function doResult() {
	            if (xmlHttpReg.readyState == 4) {//4代表执行完成
	                if (xmlHttpReg.status == 200) {//200代表执行成功
	                	var result = xmlHttpReg.responseText;
	                  	eval(result);
						if(status == 1)
						{
							document.getElementById("optResult").innerHTML = dic[lang][optResult];
						}
						else
						{
							document.getElementById("optResult").innerHTML = dic[lang][optResult];
						}
						if(userOptCnt <= max){
							dic[lang][optResult]
							document.getElementById("userOptCnt").innerHTML = userOptCnt;
						}
			        }
				}
	        }
	    };
		
	}
}
