// 默认语言
var lang = 'zhcn';

// 迷你字典
var dic = {
	zhcn :{
		notetip      : '消息通告',
		bottomWords1 : '距离页面跳转还有',
		bottomWords2 : '秒'
	},
	en  :{
		notetip      : '……',
		bottomWords1 : '……',
		bottomWords2 : '……'
	}
};

// 翻译词条
function translate(){
	document.title = dic[lang][notetip];
	document.getElementById('note_bottom').innerHTML = dic[lang][bottomWords1]+' <span id="note_timeout">0</span>'+dic[lang][bottomWords2];
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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

function delCookie(name, path) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1000);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=" + path;
}


window.onload = function(){
	var test = GetQueryString("type");
    if (test != "preview" && test != "PPPoE" && test != "Notice" && test != "DomainFilter") {
//      alert("page error");
        return;
    }
	var previewPageName = getCookie("previewPageName");
    var strArr = 'type=' + test + "&previewPageName=" + previewPageName;
	ajax();
    function ajax() {
      	//先声明一个异步请求对象
      	var xmlHttpReg = null;
        xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
        //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
        if (xmlHttpReg != null) {
            xmlHttpReg.open("POST", "/goform/getNoticePageInfo?"+strArr, true);
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
		            var data = '';
		            if (status == 1) {
		                data = {
		                    title: NoticePageTitle,
		                    urladress: SkipUrl,
		                    note_content: NoticeBody,
		                    timeout: SkipTime,
		                    NoticeSkipUrlType: NoticeSkipUrlType
		                }
		            } else {
		                data = {
		                    title: "未知页面",
		                    urladress: "",
		                    note_content: "",
		                    timeout: 0,
		                    NoticeSkipUrlType: 0
		                }
		            }
//		            alert(result)
		            resetwindow(data);
            	}
      		}
  		}
    }
    function resetwindow(demodata) {
        GetQueryString(name);
        // 初始化点击事件
        setFuncs(demodata);
        // 初始化布局
        bodyResize();
    }
	
}

window.onresize = function(){
	// 初始化布局
    bodyResize();
}

// 窗口布局调整
function bodyResize() {
	var wh = window.innerHeight || document.documentElement.clientHeight;
	document.body.style.height = wh + "px";
}
// 遍历转换空格==>&nbsp;
function exchangeNbsp(str) {
    var newstr = '';
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) === ' ') {
            newstr += '&nbsp;';
        } else {
            newstr += str.charAt(i);
        }
    }
    return newstr;
}

// 绑定事件
function setFuncs(demodata) {
//	alert(demodata);
    var title = exchangeNbsp(demodata.title);
    document.getElementById("note_title").innerHTML = title;
    var harr = exchangeNbsp(demodata.note_content).split('\n');
//   console.log(harr)
    if (harr.length > 0) {
        var innerh = '<table class="note_table"><tbody>';
        
        for(i in harr){
        	innerh += "<tr><td class='notep1_td'><div></div></td><td>" + harr[i] + "</td></tr>";
        }
        innerh += "</tbody></table>";
        document.getElementById("note_info").innerHTML = '';
        document.getElementById("note_info").innerHTML = innerh;
    } else {
    	document.getElementById("note_info").innerHTML = '';
        document.getElementById("note_info").appendChild('（无页面信息提示，请联系管理员）');
    }

    if (demodata.NoticeSkipUrlType == 1) {
        var secons = Math.round(parseInt(demodata.timeout));
        setTimeout(function() {
            location.href = demodata.urladress;
        }, (secons * 1000 + 1000));

        var backtime = secons;
        document.getElementById("note_timeout").innerHTML = backtime;
        backtime--;
        setInterval(function() {
            if (backtime >= 0) {
            	document.getElementById("note_timeout").innerHTML = backtime;
                backtime--;
            }
        }, 1000);
    } else {
    	 document.getElementById("note_timeout").style.display = 'none';
    }

}
