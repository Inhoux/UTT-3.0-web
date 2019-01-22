(function(){
	/**
	 * 获取当前浏览器版本
	 */
	function getBrowserInfo() {
		var agent = navigator.userAgent.toLowerCase();
	
		var regStr_ie = /msie [\d.]+;/gi;
		var regStr_ff = /firefox\/[\d.]+/gi
		var regStr_chrome = /chrome\/[\d.]+/gi;
		var regStr_saf = /safari\/[\d.]+/gi;
		//IE
		if(agent.indexOf("msie") >= 0) {
			return [agent.match(regStr_ie),'IE',agent];
		}
		//firefox
		if(agent.indexOf("firefox") >= 0) {
			return [agent.match(regStr_ff),'FF',agent];
		}
		//Chrome
		if(agent.indexOf("chrome") >= 0) {
			return [agent.match(regStr_chrome),'Chrome',agent];
		}
		//Safari
		if(agent.indexOf("safari") >= 0 && agent.indexOf("chrome") < 0) {
			return [agent.match(regStr_saf),'Safari',agent];
		}
		//IE11
		if(agent.indexOf("windows nt 10.0") >= 0 && agent.indexOf("rv:11.0") >= 0){
			return ['msie 11.0','IE',agent];
		}
		return [agent,'other',agent];
	}
	/**
	 * 获取当前操作系统
	 */
	function detectOS() {
	    var sUserAgent = navigator.userAgent;
	    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
	    if (isMac) return "Mac";
	    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
	    if (isUnix) return "Unix";
	    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
	    if (isLinux) return "Linux";
	    if (isWin) {
	        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
	        if (isWin2K) return "Win2000";
	        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
	        if (isWinXP) return "WinXP";
	        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
	        if (isWin2003) return "Win2003";
	        var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
	        if (isWinVista) return "WinVista";
	        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
	        if (isWin7) return "Win7";
	    }
	    return "other";
	}
	
	/*
	 	设置项目的浏览器兼容表
	 * */
	
	var bvData = {
			Win7	 : {
				'IE'		: '10.0',
				'FF'		: '41.0',
				'Chrome'	: '45.0'
			},
			WinXP	     : {
				'IE'		: '0',
				'FF'		: '41.0',
				'Chrome'	: '45.0'
			},
			Mac		: {
				'IE'		: '0',
				'FF'		: '41.0',
				'Chrome'	: '45.0'
			},
			other	:{
				'IE'		: '10.0',
				'FF'		: '41.0',
				'Chrome'	: '45.0'
			}
	};
	
	/*
	 	判断并提示浏览器版本
	 * */
	var browser = getBrowserInfo();
	var verinfo = (browser[0] + "").replace(/[^0-9.]/ig, ""); // 当前浏览器版本
	verinfo = verinfo.substr(0,(verinfo.indexOf('.')+2));
	var vernum = '0'; // 浏览器版本标准
	var nowOS = detectOS();
	if(nowOS == 'Win7' || nowOS == 'WinXP' || nowOS=='Mac'){
		vernum = bvData[nowOS][browser[1]];
	}else{
		vernum = bvData['other'][browser[1]];
	}
	if(vernum === '0'|| vernum === undefined ||  Number(verinfo)<Number(vernum) /*|| document.cookie == ''*/){
		console.log('------以下为不可访问的原因---------------------');
		console.log('规定'+browser[1]+'适用的版本：'+vernum);
		console.log('当前正在访问的版本：'+ Number(verinfo));
		console.log('是否启用cookie信息：'+ document.cookie);
		console.log('----------------------------------------');
		coverPage();
	}else{
		continueToLoad();
	}
	console.log("当前浏览器信息："+browser[2]);
	console.log("内核："+browser[1]);
	console.log("版本："+verinfo);
	console.log("操作系统："+nowOS);
	
	
	function coverPage(){
		var divEle = document.createElement('div'); 
		divEle.setAttribute('class', 'browser-version-cover'); 
		divEle.style.position = 'fixed';
		divEle.style.width = '100%';
		divEle.style.height = '100%';
		divEle.style.backgroundColor = '#ffffff';
		divEle.style.fontSize = '15px';
		divEle.style.fontFamily = '"microsoft yahei","微软雅黑","黑体"';
		document.getElementsByTagName('body')[0].appendChild(divEle);
		divEle.innerHTML = '<div style="position:relative;width:630px;height:auto;margin:5% auto;border-radius:10px;border:2px solid #dddddd;padding:20px">'+
		                     '<p><b style="color:#ff0000">提示：</b>您当前正在使用不兼容的浏览器或版本。继续访问有可能导致页面显示异常。</p>'+
		                     '<p>请选择以下任意一种方案解决该问题：<p>'+
		                     '<ul>'+
		                     	'<li style="margin-top:10px">使用 <a href="http://www.google.cn/chrome/browser/desktop/index.html">谷歌</a> 浏览器或以Chrome 45.0以上版本为内核的其他浏览器。</li>'+
		                     	'<li style="margin-top:10px">Win7及以上操作系统可以使用 <a href="http://firefox.com.cn/download/">FireFox</a> （火狐）41.0以上版本，或 <a href="http://windows.microsoft.com/zh-CN/internet-explorer/downloads/ie-11">IE</a> 10以上版本。</li>'+
		                     '</ul>'+
		                     '<button style="margin-left:10px;position:relative;top:2px;curser:pointer" id="show-error" type="button">显示版本信息</button>'+
		                     '<hr id="er1" style="border-color:#dddddd;display:none">'+
		                     '<p  id="er2" style="display:none">当前版本信息：<p>'+
		                     '<ul id="er3" style="display:none">'+
		                     	'<li style="margin-top:10px">'+'规定'+browser[1]+'适用的版本：'+vernum+'</li>'+
		                     	'<li style="margin-top:10px">'+'当前正在访问的版本：'+ verinfo+'</li>'+
		                     '</ul>'+
		                     '<hr style="border-color:#dddddd">'+
		                     '<span style="margin-left:2em">我已了解浏览器兼容性 </span><button style="margin-left:10px;position:relative;top:2px;curser:pointer" id="continue-load" type="button">继续访问</button>'+
						'</div>';
		document.getElementById('continue-load').onclick = function(){
			divEle.parentNode.removeChild(divEle);
			continueToLoad();
		}
		document.getElementById('show-error').onclick = function(){
			document.getElementById('er1').style.display = 'block';
			document.getElementById('er2').style.display = 'block';
			document.getElementById('er3').style.display = 'block';
		}
	}
	
})();
function continueToLoad(){
	var jqjs = loadScript('/libs/js/jquery-2.1.1.min.js');
	jqjs.onload = function(){
		var langjs = loadScript('/noAuth/noAuthAspOut.asp?optType=lang');
		langjs.onload = function(){
			loadScript('./login.js');
		}
	}
	
}

function loadScript(src){
	var srcEle = document.createElement('script'); 
	srcEle.setAttribute('src', src); 
	document.getElementsByTagName('body')[0].appendChild(srcEle);
	return srcEle;
}
