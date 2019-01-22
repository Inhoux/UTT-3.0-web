<html>
<head>
<title>PPPoE修改密码</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="pragma" content="no-cache">
<script src="/libs/js/jquery-2.1.1.min.js"></script>
<link rel="stylesheet" href="./login.css">
<style type="text/css">
body {
    <!--font-family: "Microsoft YaHei","微软雅黑","Helvetica Neue", Helvetica, STHeiTi,"黑体","宋体",sans-serif;
    font-size: 14px;
	color:#FFF;
	-->
}
.rows input {
		border: 1px solid rgba(240,240,240,0.3) !important;
		border-radius: 3px !important;
}
</style>
<script language="javascript">

thisDic = {}; // 存放获取的字典
function define(){
        if(arguments[0]){
                thisDic = arguments[0];
        }
}


<%getSysLang();%>
<%aspGetPppoeSelfHelpData();%>




// 构造define方法 获取翻译内容
window.onload = function(){
        console.log("当前页面对应字典："+lang); // 语言已在html中的script加载
        // 创建script标签用来获取对应字典
        var srcEle = document.createElement('script'); 
        srcEle.setAttribute('src', '../lang/'+lang+'/login.js'); 
        document.getElementsByTagName('body')[0].appendChild(srcEle);
        srcEle.onload = function(){
        	showText();
        }
}

function T(key){
	console.log(thisDic[key])
        return thisDic[key];
}
function showText(){//翻译错误返回信息
        if(optResult){
        	optResult=optResult.replace("{","");
        	optResult=optResult.replace("}","");
        	console.log(optResult);
        	optResult=T(optResult);
        	errFont.innerText=optResult;
        }
}



</script>
</head>

<body style="background-color: #1E77D2;">
	<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"  bgcolor="#1E77D2">
		<tr>
			<td height="551">
				<form name="pppoeSelfHelp" method="post" action="/goform/formPppoeSelfHelpConfig">
					<table width="50%" class="rows" id="rows" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#1E77D2" style="border:solid 1px #CCCCCC">
						<tr>
							<td colspan="3" height="40" valign="middle" align="center" >
								<table width="400" height="40" cellpadding="0" border="0" cellspacing="0" id="fontTb" bgcolor="">
									<tr>
										<td align="center" valign="bottom"><font size="+1" id="errFont" color="#F44336"><strong></strong></font>
										</td>
									</tr>
								</table>
							</td>
						</tr>
                        <tr>
                        	<td colspan="3" valign="middle" align="center">PPPoE修改密码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                        	<td colspan="3"><br></td>
                        </tr>
						<tr>
							<td width="33%" height="30" align="right" valign="middle"><font color="#FFFFFF">用户名</font></td>
							<td width="3%"></td>
							<td width="64%"><input name="userName" id="userName" type="text" value="" style="width:200px; height:23px" maxgth="31" onBlur="checkName(this,31,'用户名',0)">
                            	<span id="userError" style="color:#F00; font-size:12px;"></span></td>
						</tr>
						<tr>
							<td height="30" valign="middle" align="right"><font color="#FFFFFF">旧密码</font></td>
							<td></td>
							<td><input name="oldPasswd" id="oldPasswd" type="password" value="" style="width:200px; height:23px" maxgth="31" onBlur="checkName(this,31,'旧密码',0)">
                            	<span id="oldPasswdError" style="color:#F00; font-size:12px;">
                            </td>
						</tr>
						<tr>
							<td height="30" valign="middle" align="right"><font color="#FFFFFF">新密码</font></td>
							<td></td>
							<td><input name="newPasswd" id="newPasswd" type="password" value="" style="width:200px; height:23px" maxgth="31">
                            	<span id="newPasswdError" style="color:#F00; font-size:12px;">
                            </td>
						</tr>
						<tr>
							<td height="30" valign="middle" align="right"><font color="#FFFFFF">确认密码</font></td>
							<td></td>
							<td><input name="verifyPasswd" id="verifyPasswd" type="password" value="" style="width:200px; height:23px" maxgth="31">
                            	<span id="verifyPasswdError" style="color:#F00; font-size:12px;">
                            </td>
						</tr>

						<tr>
							<td height="30" valign="middle">&nbsp;</td>
							<td></td>
							<td><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" name="configSubmit" onClick="save()">提交</button><input type="hidden" name="userCommand" id="userCommand" value="userAuth"></td>
						</tr>

						<tr>
							<td height="30" colspan="3">&nbsp;</td>
						</tr>
					</table>
                    <table id="tags" width="50%" height="50px" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#1E77D2" style="border:solid 1px #CCCCCC">
                    	<tr>
                        	<td align="center" id="usermake">您所在的用户组没有权限访问此页面</td>
                        </tr>
                    </table>
				</form>
				<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="tishiTable"  bgcolor="#1E77D2">
					<tr>
						<td height="40" valign="middle" colspan="3" align="center"><strong><font color="#FFFFFF" size="-1" id="tishi"></font></strong></td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
<script language="javascript">

/* 如果登录的用户ip地址不在PPPoE地址池内，不允许用户访问此页面 */
if (!isPPPoEIp) {
	document.getElementById("rows").style.display="none";
	document.getElementById("tishiTable").style.display="none"
	setTimeout(function(){
		window.location.replace("about:blank");
	},4000);
	
}else{
	document.getElementById("tishiTable").display="";
	document.getElementById("tags").style.display="none";
	}
///////////////////////////////////////
//功能：检查是否合法用户名
//参数说明:
//cntrl--控件名
//max--允许的最大长度
//tips--提示信息
//allownull--1允许为空，0不允许为空
//返回值：true合法，false非法
//////////////////////////////////////
function checkName(cntrl,max,tips,allownull)
{
	name=cntrl.value;
	
	document.getElementById("userError").innerText=" "; 
	document.getElementById("oldPasswdError").innerText=" "; 
	document.getElementById("newPasswdError").innerText=" "; 
	document.getElementById("verifyPasswdError").innerText=" ";
	
	if(name=="")
	{
		if(!eval(allownull))
		{
		  if(cntrl == document.getElementById("userName")){
		  	document.getElementById("userError").innerText="*"+tips+"不能为空"; 
		  }else{
			  document.getElementById("oldPasswdError").innerText="*"+tips+"不能为空"; 
			  }
		  return false;
		}
		else
			return true;
	}
	else if (name.gth > max)
	{
		 if(cntrl == document.getElementById("userName")){
		  	document.getElementById("userError").innerText="*"+tips+"长度不能超过"+max+"位"; 
		  }else{
			  document.getElementById("oldPasswdError").innerText="*"+tips+"长度不能超过"+max+"位"; 
		  }
		
		cntrl.focus();
		return false;
	}
	else if (name.indexOf("%")!=-1 || name.indexOf("\"")!=-1 || name.indexOf(":")!=-1  || name.indexOf(" ")!=-1 || name.indexOf("\'")!=-1 || name.indexOf("\\")!=-1)
	{
		 if(cntrl == document.getElementById("userName")){
		  	document.getElementById("userError").innerText="*"+tips+"应为除：% \' \\ \" 和空格之外的字符"; 
		  }else{
			  document.getElementById("oldPasswdError").innerText="*"+tips+"应为除：% \' \\ \" 和空格之外的字符"; 
		  }
		return false;
	}
	else
	{
		return true;
	}
}

///////////////////////////////////////
//功能：检查是否合法密码
//参数说明:
//cntrl1、cntrl2--控件名
//max--允许的最大长度
//allownull--1允许为空，0不允许为空
//返回值：true合法，false非法
//////////////////////////////////////
function checkPassword(cntrl1,cntrl2,max,allownull)
{
	pas1 = cntrl1.value;
	pas2 = cntrl2.value;
	

	
	if (pas1.gth > max)
	{
		document.getElementById("newPasswdError").innerText="*"+tips+"新密码长度不能超过"+maxlen+"位"; 
		cntrl1.focus();  
		return false;
	}
	else if(pas1 == "")
	{
		
		if(!eval(allownull))
		{
		  document.getElementById("newPasswdError").innerText="*"+"新密码不能为空"; 
		  cntrl1.focus();
		  return false;
		}
		else if (pas2!="")
		{
		  document.getElementById("verifyPasswdError").innerText="*"+"两次输入的密码不一致";
		  cntrl1.focus();
		  return false;
		}
		else{
			
			return true;
		}
	}
	else if(pas1 != pas2)
	{
		document.getElementById("verifyPasswdError").innerText="*"+"新密码和确认密码不一致";
		cntrl1.focus();
		return false;
	}
	else if (pas1.indexOf("%")!=-1 || pas1.indexOf("\"")!=-1 || pas1.indexOf("\'")!=-1 || pas1.indexOf("\\")!=-1 ||　pas1.indexOf(" ")!=-1)
	{
		document.getElementById("newPasswdError").innerText="*"+"新密码应为除% \' \\ \" 以及空格之外的字符"; 
		return false;
	}
	else
	{
		
		return true;
	}
}

/* 检测参数函数 */
function checkData() {
	var tbl = pppoeSelfHelp;
	if (userOptCnt <= 0) {
		document.getElementById("rows").style.display="none";
		usermake.innerText="今日您无法再进行修改密码的操作，请明日修改";
		document.getElementById("tags").style.display="";
		return false;
	}
	/* 检查用户名 */
	if (!checkName(tbl.userName, 31, "用户名", 0)) {
		return false;
	}
	
	/* 检查旧密码 */
	if (!checkName(tbl.oldPasswd, 31, "旧密码", 0)) {
		return false;
	}
	
	/* 检查新密码和确认密码 */
	if (!checkPassword(tbl.newPasswd, tbl.verifyPasswd, 31, 0)) {
	    return false;
	}
	
	return true;
}

/* 保存函数 */
function save()
{
	var tbl = pppoeSelfHelp;
	if (checkData()) {
		tbl.submit();
	}
	return;
}

function init()
{
	if (userOptCnt == 0) {
		tishi.color = "#FF0000";
		tishi.innerText = "提示：今天您已经无法再进行修改密码的操作，请明日再修改！";
	} else {
		tishi.innerText = "提示：今天您还可以进行" + userOptCnt + "次修改密码的操作！";
	}
	
}
init();

</script>
</body>
</html>
