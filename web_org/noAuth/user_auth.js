//var pagehead = "欢迎光临拿次买餐厅";
//var title = "输入用户密码已完成上网认证：";
//var bottom = "请致电：098-10923487108，访问官方网址： www.aklhdal123.com.cn";
//var img = "../images/Hydrangeas.jpg";

//var img = "";

// 默认语言
var lang = 'zhcn';

// 迷你字典
var dic = {
	zhcn :{
		username : '用户名',
		password : '密码',
		login	 : '登录',
		reset    : '重填',
		err_msg1 : '字典里的错误提示一',
		C_LANG_INDEX_SUCCESS_IDENTITY : '认证成功！',
		C_LANG_INDEX_MAX_ACC_SESSION : '已达到账号最大会话数',
		C_LANG_INDEX_MAX_SYS_SESSION  : '已达到系统最大会话数',
		C_LANG_INDEX_APPLY_SES_ERR : '申请Web认证会话失败',
		C_LANG_INDEX_WEBAUTH_ACC_EXPIRED :   '账号过期',
		C_LANG_INDEX_WEBAUTH_NO_TIME  :  '没有剩余时间',
		C_LANG_INDEX_AUTHENTICATION_FAILURE : '认证失败！',
		webAuthPageDefault : 'web认证页面'
	},
	en  :{
		username : 'Username',
		password : 'Password',
		login	 : 'Login',
		reset    : 'Reset',
		err_msg1 : 'Err_msg1'
	}
};


 function delCookie(name,path)
 {
         var exp = new Date();
         exp.setTime(exp.getTime() - 1);
         var cval=getCookie(name);
         if(cval!=null)
                 document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path="+path;
 }

 function GetQueryString(name)
 {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return null;
 }

 function getCookie(name) {
     var cookieName = encodeURIComponent(name) + "=",
         cookieStart = document.cookie.indexOf(cookieName),
         cookieValue = null,
         cookieEnd;
     if (cookieStart > -1) {
         cookieEnd = document.cookie.indexOf(";", cookieStart);
         if (cookieEnd == -1) {
             cookieEnd = document.cookie.length;
         }
         var ba = document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
         cookieValue = decodeURIComponent(ba);
     }
     return cookieValue;
 }

window.onload=function() {
	
    // 多国语言
    var l_username = document.getElementById("l_username");
    var l_password = document.getElementById("l_password");
    var login_btn = document.getElementById("login_btn");
    var resetbtn = document.getElementById("reset");
    var bgimg = document.getElementById('bgimg');
	var login_btn = document.getElementById("login_btn");
    l_username.innerHTML = dic[lang]['username'];
    l_password.innerHTML = dic[lang]['password'];
    login_btn.innerHTML  = dic[lang]['login'];
    resetbtn.innerHTML   = dic[lang]['reset'];
    ajax();
    function ajax() {
        //先声明一个异步请求对象
        var xmlHttpReg = null;
          
        xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
          
        //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
        if (xmlHttpReg != null) {
            xmlHttpReg.open("GET", "/noAuth/noAuthAspOut.asp?optType=webAuthPage", true);
            xmlHttpReg.send(null);
            xmlHttpReg.onreadystatechange = doResult; //设置回调函数
        }
        //回调函数
        //设定函数doResult()
        function doResult() {
            if (xmlHttpReg.readyState == 4) {//4代表执行完成
                if (xmlHttpReg.status == 200) {//200代表执行成功
                  	var result = xmlHttpReg.responseText;
                  	eval(result);
		            var pictureDir = "";
		            if (activePic == 1) {
		                if (chooseimg == 1) {
		                    var pictureDir = picturedir;
		                } else {
		                    var pictureDir = pictureUrl;
		                }
		            }
		            var data = {
		                pagehead: webAuthSuccessName,
		                title: tipstitle,
		                tip:tipsinfo, //提示
		                bottom: hidcontact,
		                img: pictureDir
		            }
		            resetwindow(data);
                }
            }

        }
    }
    function resetwindow(demodata) {
        //初始化点击事件
        setFuncs()
            //调整内容
        var page_title=document.getElementById("page_title");
        var title_word=document.getElementById("title_word");
        var tipwords  =document.getElementById("tipwords");
        var note_word =document.getElementById("note_word");
     	page_title.innerHTML=dic[lang][demodata.pagehead]?dic[lang][demodata.pagehead]:demodata.pagehead;
        //判断是否上传有图片
        var bgimg = document.getElementById('bgimg');
        if(demodata.img){
        	
        	bgimg.src = demodata.img;
        	document.documentElement.style.background = "linear-gradient(to right,#fff,#fff )";
        	document.documentElement.style.backgroundColor="rgb(255,255,255)";
        }else{
        	delete bgimg;
        }
        
        title_word.innerHTML=demodata.title;
        tipwords.innerHTML  =demodata.tip;
		demodata.bottom=demodata.bottom.replace(/\r\n/g,'<br>');
        demodata.bottom=demodata.bottom.replace(/\n/g,'<br>');
        note_word.innerHTML   =demodata.bottom;
		var ww = parseInt(window.innerWidth) || parseInt(document.documentElement.clientWidth); //窗宽
    	var wh = parseInt(window.innerHeight) || parseInt(document.documentElement.clientHeight); //窗高
	    var iw = bgimg.width; //原图宽
	    var ih = bgimg.height; //原图高
	    //规定图片最大宽高
	    if (iw > ww) {
	        bgimg.style.maxWidth  = ww +"px";
	    }
	    if( ih > wh) {
	        bgimg.style.maxHeight= wh +"px";
	    }
	    bgimg.onload = function(){
        	//图片布局
	   		imgResize();
        }
        //初始化布局
        bodyResize();
    };
    
};

window.onresize = function() {
    //初始化布局
    bodyResize();
    //图片布局
    imgResize();
};

//窗口布局调整
function bodyResize() {
//  var wh = window.innerHeight;
    document.getElementsByTagName('body')[0].style.height = document.getElementsByTagName('html')[0].style.height;
}
//图片布局调整
function imgResize() {
    var ww = parseInt(window.innerWidth) || parseInt(document.documentElement.clientWidth); //窗宽
    var wh = parseInt(window.innerHeight) || parseInt(document.documentElement.clientHeight); //窗高
    var lp = parseInt(document.getElementById("login_box").offsetLeft); //左余
    var iw = bgimg.offsetWidth; //图宽
    var ih = parseInt(bgimg.offsetHeight); //图高
    if (iw <= lp) {
    	bgimg.style.width = iw + "px";
    	bgimg.style.marginLeft = ((lp - iw) / 2) + "px";
    } else {
        bgimg.style.width = iw + "px";
        bgimg.style.marginLeft = ((ww - iw) / 2) + "px";
    }
    if (ih < wh) {
    	bgimg.style.marginTop = ((wh - ih) / 2) + "px";
    } else {
        bgimg.style.marginTop = "0px";
        document.body.style.overflow = "hidden";
    }
}

//表单事件绑定
function setFuncs() {
	
    //登录按钮
    login_btn.onclick = function(){
    	var user = document.querySelector("input[name='userName']");
		var pwd  = document.querySelector("input[name='userPasswd']");
    	login_btn.blur();
        ajax();
        function ajax() {
	          //先声明一个异步请求对象
	          var xmlHttpReg = null;
	            xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
	        
	          //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
	          if (xmlHttpReg != null) {
	              xmlHttpReg.open("POST", "/goform/formWebAuthUserSubmit?userName="+user.value+"&userPasswd="+pwd.value, true);
	              xmlHttpReg.send();
	              xmlHttpReg.onreadystatechange = doResult; //设置回调函数
	          }
	          //回调函数
	          //设定函数doResult()
	          function doResult() {
	                if (xmlHttpReg.readyState == 4) {//4代表执行完成
	                    if(xmlHttpReg.status == 200) {//200代表执行成功
		                  	var result = xmlHttpReg.responseText;
		                    eval(result);
			                if (status == 1) {
			                    window.location.href = "/noAuth/auth_success.html"
				            }else{
				                showErr(errorstr);
				            }
				        }else{
				        	showErr('错误提示2');
				        }
	                  
	                }
	          }
      	}
    }
        
    //重填
    var resetbtn = document.getElementById("reset");
    resetbtn.onclick=function(){
    	resetbtn.blur();
    	login_form.reset();
    }
}
var error_str = document.getElementById("error_str");
// 显示错误信息
function showErr(errstr){
	
	if(errstr !== undefined){
		error_str.innerHTML=dic[lang][errstr];
	}
}
// 清除错误信息
function clearErr(){
	error_str.innerHTML = '';
}
function isIE(){
	bgimg.onload=function(){
		var ww = parseInt(document.body.clientWidth);
		var wh = parseInt(document.body.clientHeight);   //窗高
		var iw = bgimg.offsetWidth;    //图宽
		var ih = bgimg.offsetHeight;
		var browser=navigator.appName 
		var b_version=navigator.appVersion 
		var version=b_version.split(";"); 
		var trim_Version=version[1].replace(/[ ]/g,""); 
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"){ 
			ieStyle()
		}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){ 
			ieStyle()
		}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){ 
			ieStyle()
		}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){ 
			ieStyle()
		}
		function ieStyle(){
			bgimg.style.left = ((ww - iw) / 2) + "px";
			bgimg.style.top = ( (wh - ih) / 2) + "px";
			document.body.style.overflowX = 'hidden';
			document.body.style.overflowY = 'hidden';
		}
	}
	
	
}
isIE()
