// 默认语言
var lang = 'zhcn';

// 迷你字典
var dic = {
	zhcn :{
		title : '认证成功',
		ysq : '有效期:',
		authSuccess : '认证成功！',
		tip1 : '您可以点击“安全下线”，安全及时的完成下线动作，若此页面被意外关闭了，您也可以访问页面：',
		tip2 : '进行想要的操作。',
		modfpswd : '修改密码',
		sfonline : '安全下线',
		min : '分钟',
		hour : '小时',
		day : '天',
		sec : '秒'
	},
	en  :{
		title : '',
		ysq : '',
		authSuccess : '',
		tip1 : '',
		tip2 : '',
		modfpswd : '',
		sfonline : '',
	    min : '分钟',
		hour : '小时',
		day : '天',
		sec : '秒'
	}
};
// 翻译词条
function translate(){
	document.querySelector('head>title').innerHTML = dic[lang]["title"];
	document.querySelector('#suc_box>p:first-child').innerHTML = dic[lang]["authSuccess"];
	document.querySelector('.suc_info>p>span:first-child').innerHTML = dic[lang]["ysq"];
	document.querySelectorAll('.suc_info>p')[1].innerHTML = dic[lang]["tip1"]+"<a href ='"+location.href+"'>"+location.href+"</a>"+dic[lang]["tip2"];
	document.querySelector('#modify_password').innerHTML = dic[lang]["modfpswd"];
	document.querySelector('#safe_offline').innerHTML = dic[lang]["sfonline"];
}
window.onload=function(){
	translate();
	ajax();	
	function ajax() {
        //先声明一个异步请求对象
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest(); //实例化一个xmlHttp
        //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
        if (xmlHttp != null) {
            xmlHttp.open("GET", "/noAuth/noAuthAspOut.asp?optType=webAuthPage", true);
            xmlHttp.send(null);
            xmlHttp.onreadystatechange = doResult; //设置回调函数
        }
        function doResult() {
            if (xmlHttp.readyState == 4) {//4代表执行完成
                if (xmlHttp.status == 200) {//200代表执行成功
                	var result = xmlHttp.responseText;
	                eval(result);
					if(accountBill == "on"){
						if(billType == "timeBill"){
							stopData = processtime(leftTime);
							
							/* 时间格式化 */ 
							function processtime(second){
								var timestr = '0'+dic[lang]["sec"];
								var second = Number(second);
								if(second || second === 0){
									if(second >=60*60*24){
										// 大于等于1天
										var d_ =  Math.floor(second/(60*60*24))*60*60*24;
										var h_ =  Math.floor((second-d_)/(60*60))*60*60;
										var m_ =  Math.floor((second-d_-h_)/(60))*60;
										var s_ = second-d_-h_-m_;
										timestr = (d_/(60*60*24))+dic[lang]["day"]+(h_/(60*60))+dic[lang]["hour"]+(m_/(60))+dic[lang]["min"]+s_+dic[lang]["sec"];
									}else if(second>=60*60){
										// 大于等于1时
										var h_ =  Math.floor((second)/(60*60))*60*60;
										var m_ =  Math.floor((second-h_)/(60))*60;
										var s_ = second-h_-m_;
										timestr = (h_/(60*60))+dic[lang]["hour"]+(m_/(60))+dic[lang]["min"]+s_+dic[lang]["sec"];
									}else if(second>=60){
										// 大于等于1分
										var m_ =  Math.floor((second)/(60))*60;
										var s_ = second-m_;
										timestr = (m_/(60))+dic[lang]["min"]+s_+dic[lang]["sec"];
									}else{
										//秒
										timestr = second+dic[lang]["sec"];
									}
								}
								return timestr;
							}
							
							//stopData = accountEffectTime + dic[lang][accountEffectTimeUnit];
						}
						else{
							var open_date = new Date((accountOpenDate - 28800)*1000);
							var open_Y = open_date.getFullYear() + '-';
							var open_M = (open_date.getMonth()+1 < 10 ? '0'+(open_date.getMonth()+1) : open_date.getMonth()+1) + '-';
							var open_D = open_date.getDate() + ' ';
							var newOpenDate = open_Y+open_M+open_D;
	
							var Stop_date = new Date((accountStopDate - 28800)*1000);
							var Stop_Y = Stop_date.getFullYear() + '-';
							var Stop_M = (Stop_date.getMonth()+1 < 10 ? '0'+(Stop_date.getMonth()+1) : Stop_date.getMonth()+1) + '-';
							var Stop_D = Stop_date.getDate() + ' ';
							var newStopDate = Stop_Y+Stop_M+Stop_D;
	
							stopData = newOpenDate + "到" +newStopDate;
						}
					}
					else if(accountBill == "off"){
						stopData = "永久";
					}else{
						stopData = "未登录";
					}
					var data = {
						validity : stopData,
					}
					resetwindow(data);
                }
            }

        }
    }
	
	function add0(m){return m<10?'0'+m:m }
	function format(shijianchuo)
	{
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
	}
	function resetwindow(demodata){
		//初始化点击事件
		setFuncs();
		//调整内容
//		document.getElementById("page_title").innerHTML = demodata.pagehead;
//		document.getElementById("bgimg").innerHTML = demodata.img;
//		document.getElementById("title_word").innerHTML = demodata.title;
//		document.getElementById("note_word").innerHTML = demodata.bottom;
		document.getElementById("validity").innerHTML = demodata.validity;
		//初始化布局
		bodyResize();
	}
	
	
}
window.onresize=function(){
	//初始化布局
	bodyResize();
}

//窗口布局调整
function bodyResize(){
	var wh = document.documentElement.clientHeight;
	document.body.style.height = wh+"px";
}
//事件绑定
function setFuncs(){
	document.querySelector('#modify_password').onclick=function(){
		document.querySelector('#modify_password').blur();
		window.location.href="/noAuth/modyfiy_password.html"
	};
	document.querySelector('#safe_offline').onclick=function(){
		document.querySelector('#safe_offline').blur();
		ajax();
		function ajax() {
          //先声明一个异步请求对象
          var xmlHttpReg = null;
          xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
          
          //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
          if (xmlHttpReg != null) {
              xmlHttpReg.open("POST", "/goform/formWebAuthUserSubmit?userCommand=logoff", true);
               xmlHttpReg.send();
              xmlHttpReg.onreadystatechange = doResult; //设置回调函数
          }
          //回调函数
          //设定函数doResult()
          function doResult() {
              if (xmlHttpReg.readyState == 4) {//4代表执行完成
                  if (xmlHttpReg.status == 200) {//200代表执行成功
                  	var result = xmlHttpReg.responseText;
                      	eval(result);
						
						window.location.href="/noAuth/user_auth.html"
					
		          }else{
		          	
		          }
		      }

          }
      	}
	};
}
