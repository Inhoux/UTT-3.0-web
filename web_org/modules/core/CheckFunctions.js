define(function(require, exports, module){
	var funcs = {
		"checkIP" : checkIP,
        "checkNullIP":checkNullIP,
	    "checkIpRangeGroup":checkIpRangeGroup,
	    "checkMacGroup":checkMacGroup,
		"testDemoCheck":testDemoCheck,
        "checkMac":checkMac,
        "checkNullMac":checkNullMac,
		"re_checkNumber":re_checkNumber,
		"re_checkName":re_checkName,
		"re_checkMask":re_checkMask,
		"re_checkIP":re_checkIP,
 		"checkDomainName":checkDomainName,
        "checkDomainOrIP":checkDomainOrIP,
        "checkIpDns":checkIpDns,
        "checkDate":checkDate,
        "checkSecretKey":checkSecretKey,
        "checkLogServerIP":checkLogServerIP,
        /*以下函数调用时需要带参数*/
        "checkFirstDate":checkFirstDate,
        "checkLastDate":checkLastDate,
        "checkIPStartToEnd":checkIPStartToEnd,
        "checkInput":checkInput,
        "checkName":checkName,
        "checkName_admin":checkName_admin,
        "checkNum":checkNum,
		"checkMainDns":checkMainDns,
        "checkSourceToEndNum":checkSourceToEndNum,
        "checkSecDns":checkSecDns,
        "checkStr":checkStr,
        "checkPass":checkPass,
		"checkNoHttpUrl":checkNoHttpUrl,
		"checkUrl":checkUrl,
        "checkDDNS":checkDDNS,
        "specialWordCheck":specialWordCheck,
        "checkStaticIP":checkStaticIP,
        "checkPassword2":checkPassword2,
        "checkSameSegmentNet":checkSameSegmentNet,
        "checkDemoPassword":checkDemoPassword,
        "checkDemoPasswordNULL":checkDemoPasswordNULL
        
    };    
    /* 检测日志服务器的域名*/
   function checkLogServerIP(text){
   		var result = {
   				isCorrect:true,
    			errorStr:''
   		};
   		var domainres = checkDomainName(text);
   		var IPres = checkIP(text);
   		if(!domainres.isCorrect && !IPres.isCorrect){
   			result.isCorrect = false;
   			result.errorStr = domainres.errorStr;
   		}
   		/*
   		else if(!domainres.isCorrect && IPres.isCorrect){
   			result.isCorrect = false;
   			result.errorStr = domainres.errorStr;
   		}else if(domainres.isCorrect && !IPres.isCorrect){
   			result.isCorrect = false;
   			result.errorStr = IPres.errorStr;
   		}
   		*/
   		return result;
   }
    
    /* 检测是否在同一网段*/
   /*
    function checkSameSegmentNet(text,args){
    	var res = checkIP(text);
    	if(!res.isCorrect){
    		return res;
    	}
    	if(args[0]){
    		var thisIPStr = $('[name="'+args[0]+'"]').val();
    		var ip1prev = thisIPStr.substr(0,thisIPStr.lastIndexOf('.'));
    		var ip2prev = text.substr(0,text.lastIndexOf('.'));
    		if(ip1prev != ip2prev){
    			res = {
    				isCorrect:false,
    				errorStr:'和IP地址不在同一网段'
    			}
    		}
    	}
        return res;
        }
        */
   /* 检测是否在同一网段*/
   function ipToNumber(ip) {
       var num = 0;
       if (ip == "") {
           return num;
       }
       var aNum = ip.split(".");
       if (aNum.length != 4) {
           return num;
       }
       num += parseInt(aNum[0]) << 24;
       num += parseInt(aNum[1]) << 16;
       num += parseInt(aNum[2]) << 8;
       num += parseInt(aNum[3]) << 0;
       num = num >>> 0; //这个很关键，不然可能会出现负数的情况  
       return num;
   }
   function checkSameSegmentNet(text,args){
       var res = checkIP(text);
       if(!res.isCorrect){
           return res;
       }
       if(args[0]){
           var thisIPStr = $('[name="'+args[0]+'"]').val();
           var thisNMStr = $('[name="'+args[1]+'"]').val();
           var ip1prev = text;
           var ipNum = ipToNumber(thisIPStr);
           var nmNum = ipToNumber(thisNMStr);
           var ip1Num = ipToNumber(ip1prev);
           num1 = ipNum&nmNum;
           num2 = ip1Num&nmNum;
           num1 = num1 >>> 0;
           num2 = num2 >>> 0;

           if(num1 != num2){
               res = {
                   isCorrect:false,
    			   errorStr:'和IP地址不在同一网段'
               }
           }
       }
       return res;
   }
    function checkDemoPassword(texts,some){
    	var result = {isCorrect:true,errorStr:''};
    	var retips = "";
    	var ptype = /^[0-9a-fA-F]{0,}$/;
    	var maxlen=0;
    	if($('[name="'+some[0]+'"]').val()==1){
            if($('[name="'+some[1]+'"]').val()=='1'){
            	 maxlen=10;
            }else{
            	 maxlen=5;
            }
        }else if($('[name="'+some[0]+'"]').val()==2){
            if($('[name="'+some[1]+'"]').val()=='1'){
            	 maxlen=26;
            }else{
            	 maxlen=13;
            }
        }else{
        	maxlen=0;
        }
        
        if($('[name="'+some[2]+'"]:checked').val() == some[3] && texts == '' ){
        	result.isCorrect = false;
        	result.errorStr = "该密钥不能为空";
        	return result;
        }
        
        if($('[name="'+some[1]+'"]').val()=='1'){
        	ptype = /^[0-9a-fA-F]{0,}$/;
        	retips = "输入格式不符合16进制";
        }else{
        	ptype = /^[\x00-\xff]{0,}$/;
        	retips = "输入格式不符合ASCII码";
        }
        
        if(texts.length != maxlen){
    		result.isCorrect = false;
        	result.errorStr = "密钥字符长度应为"+maxlen+"位";
        	return result;
    	}else{
    		 if(!ptype.test(texts)){
	        	result.isCorrect = false;
	        	result.errorStr = retips;
	        	return result;
	        }
    	}
        
        return result;
        
    }
    
    function checkDemoPasswordNULL(texts,some){
    	var result = {isCorrect:true,errorStr:''};
    	if(texts != ''){
	    	var retips = "";
	    	var ptype = /^[0-9a-fA-F]{0,}$/;
	    	var maxlen=0;
	    	if($('[name="'+some[0]+'"]').val()==1){
	            if($('[name="'+some[1]+'"]').val()=='1'){
	            	 maxlen=10;
	            }else{
	            	 maxlen=5;
	            }
	        }else if($('[name="'+some[0]+'"]').val()==2){
	            if($('[name="'+some[1]+'"]').val()=='1'){
	            	 maxlen=26;
	            }else{
	            	 maxlen=13;
	            }
	        }else{
	        	maxlen=8;
	        }
	        
	        if($('[name="'+some[2]+'"]:checked').val() == some[3] && texts == '' ){
	        	result.isCorrect = false;
	        	result.errorStr = "该密钥不能为空";
	        	return result;
	        }
	        
	        if($('[name="'+some[1]+'"]').val()=='1'){
	        	ptype = /^[0-9a-fA-F]{0,}$/;
	        	retips = "输入格式不符合16进制";
	        }else{
	        	ptype = /^[\x00-\xff]{0,}$/;
	        	retips = "输入格式不符合ASCII码";
	        }
		if (texts.indexOf(",") != -1 || texts.indexOf(";") != -1 || texts.indexOf("；") != -1 || texts.indexOf("%") != -1 || texts.indexOf("\"") != -1 || texts.indexOf("\'") != -1 || texts.indexOf("\\") != -1 || 　texts.indexOf(" ") != -1 || texts.indexOf("&") != -1 || texts.indexOf("#") != -1 || texts.indexOf(">") != -1){
		    result.isCorrect = false;
	            result.errorStr = "密钥字符不合法";
	            return result;
		}
	        if((texts.length < 8) || (texts.length > 31)){
	    		result.isCorrect = false;
	        	result.errorStr = "密钥字符长度应为8~31位";
	        	return result;
	    	}else{
	    		 if(!ptype.test(texts)){
		        	result.isCorrect = false;
		        	result.errorStr = retips;
		        	return result;
		        }
	    	}
        }else{
	        	result.isCorrect = false;
	        	result.errorStr = "该密钥不能为空";
	        	return result;

	}
        return result;
        
    }
    function checkPassword2(cntrl1, some) {    
        var result = {isCorrect:true,errorStr:''};
        var retips = "";
        var maxlen=0;
        var i=0;

        pas1 = cntrl1;
        if(pas1.length==0){
            result.errorStr=retips;
            result.isCorrect=true;
            return result; 
        }
        if($('[name="'+some[0]+'"]').val()==1){
            maxlen=10;
        }else if($('[name="'+some[0]+'"]').val()==2){
            maxlen=26;
        }
        tips=some[1];
        allownull=some[2];
        /***********************************************/
        var num = trimstr(pas1);
        for (var i = 0; i < pas1.length; i++) 
        {
            onenum = num.substring(i, i + 1);
            if ((onenum < "0" || onenum > "9") && (onenum < "a" || onenum > "f") && (onenum < "A" || onenum > "F")) 
            {
                retips='密钥格式为16进制，您输入的密钥中包含非16进制的字符！';
            }
        }
        /***********************************************/

        if(retips!=""){
            result.errorStr=retips;
            result.isCorrect=false;
            return result;            
        }
        if (pas1.length > maxlen) {
            retips = tips + "长度不能超过" + maxlen + "位";                                                 
        } else if (pas1 == "") {
            if (!eval(allownull)) {
                retips = tips + "不能为空";
            } else retips = "";
        } else if (pas1.indexOf(",") != -1 || pas1.indexOf(";") != -1 || pas1.indexOf("；") != -1 || pas1.indexOf("%") != -1 || pas1.indexOf("\"") != -1 || pas1.indexOf("\'") != -1 || pas1.indexOf("\\") != -1 || 　pas1.indexOf(" ") != -1 || pas1.indexOf("&") != -1) {
            retips = tips + "应为除：, % \' \" \\ & ; ； 等的字符";
        }        
        if (retips != '') {
            result.errorStr=retips;
            result.isCorrect=false;
            return result;
        } else { 
            result.isCorrect=true;
            return result;
        }        
    }
    function WordCheck(charWord, result){
        console.log(charWord)
        var sarr = [":",",","%",'"',"'","\\","&",";","；","<",">","(",")"," "];
        for(var i=0;i<sarr.length;i++){
            if(charWord === sarr[i]){
                result.isCorrect = false;
                result.errorStr = '不应含有:,%"\'\\&;；&lt;&gt;()和空格';
                return false;
            }
        }
        return true;
    }

    function specialWordCheck(text, some){
                var result = {isCorrect:true,errorStr:''};
                if(text === null || text === '' || text.length <1){
                    result.isCorrect = false;
                    result.errorStr = '不能为空';
                    return result;
                }
                if(text.length < some[0] || text.length > some[1]){
                    result.isCorrect = false;
                    result.errorStr = '长度应在'+some[0]+'位'+'到'+some[1]+'位之间';
                    return result;
                }
                for(var i=0;i<text.length;i++){
                    if(!WordCheck(text.charAt(i), result)){
                        return result;
                    }
                }
                return result;
    }
    function checkSecretKey(text){
                var result = {isCorrect:true,errorStr:''};
                if(text === null || text === '' || text.length <1){
                    result.isCorrect = false;
                    result.errorStr = '不能为空';
                    return result;
                }
                if(text.length >= 64){
                    result.isCorrect = false;
                    result.errorStr = '长度应小于64位';
                    return result;
                }
                for(var i=0;i<text.length;i++){
                    if(!WordCheck(text.charAt(i), result)){
                        return result;
                    }
                }
                return result;
    }

    /***
    检测DDNS
    ***/

    function checkDDNS(text,argv){

        var DDNSProviderSelectName = argv[0];
        var DDNSProviderSelectval = $('[name="'+DDNSProviderSelectName+'"]').val();
        var result = {"isCorrect": true, "errorStr": ''};

        if(text === null || text === '' || text.length<1){
            result.isCorrect = false;
            result.errorStr = '主机名不能为空';
            return result;
        }

        if(text.length >31){
            result.isCorrect = false;
            result.errorStr = '主机名长度应为31个字符以内';
            return result;
        }

        var checkresult = innerCheckDDNS(text,DDNSProviderSelectval);
        result.isCorrect = checkresult;

        return result;


        // 移植的检测方法（输入框对象，地址：如www.huashengke.com）

        function innerCheckDDNS(thisValue,wwwstr)
        {
            var name = thisValue;
            var str  = wwwstr;
            if (str == "iplink.com.cn")
            {
                index=name.indexOf(".");
                    hostname1=name.substring(0,index);
                    hostname2=name.substring(index+1,name.length+1);
                if(hostname2 != "iplink.com.cn") {
                    result.errorStr = '主机名要以 .iplink.com.cn 结尾！';
                    return false;
                }
            }
            else if (str == "uttcare.com")
            {
                index=name.indexOf(".");
                hostname1=name.substring(0,1);
                hostname2=name.substring(index+1,name.length+1);
                var obj2 = $('[name="defultcheck"][value="diy"]')[0];
                var reg= /^[A-Za-z]+$/;
                if(obj2.checked){
                    if(hostname2 != "uttcare.com" || reg.test(hostname1) == false)
                    {
                         result.errorStr = '主机名要以字母开头，以 .uttcare.com 结尾';
                        return false;
                    }
                }
            }

            else if(str == "3322.org")
            {
                index=name.indexOf(".");
                    hostname1=name.substring(0,index);
                    hostname2=name.substring(index+1,name.length+1);
                if((hostname2 != "3322.org")&&(hostname2 != "f3322.org")&&(hostname2 != "f3322.net")&&(hostname2 != "eatuo.com")&&(hostname2 != "webok.net")&&(hostname2 != "7766.org")&&(hostname2 != "6600.org")&&(hostname2 != "9966.org")&&(hostname2 != "2288.org")&&(hostname2 != "8800.org")&&(hostname2 != "8866.org")){
                     result.errorStr = '主机名后缀错误';
                    return false;
                }
            }
            return true;
        }
    }
    ///////////////////////////////////////
    ////功能：检查是否合法ip地址
    ////参数说明:
    ////cntrl--控件名
    ////tips--提示信息
    ////allownull--1允许为空，0不允许为空
    ////返回值：true合法，false非法
    ////////////////////////////////////////
    function checkUrl(text,argv) {
	var result = {	
			"isCorrect": true,
			"errorStr": ''
		     };
	result = verifyDottedURL(text);
	if(text ==""){
	    result["isCorrect"] = false;
	    result["errorStr"]='域名填写错误';
	    return result;
	}
	if(result["isCorrect"]== false){
	    result["isCorrect"] = false;
	    result["errorStr"]='域名填写错误';
	}
	return result;

    }

    function verifyDottedURL(url_str) {
	var result = {  
	                "isCorrect": true,
	                "errorStr": ''
		     };
	var reg3 =/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
	if(!reg3.test(url_str)){
	    result["isCorrect"] = false;
	}
	return result;
    }
    function checkNoHttpUrl(text,argv){
		var result = {"isCorrect": true, "errorStr": ''};
		var arr = new Array();
		arr[0] = "ip";
		arr[1] = "0";
		arr[2] = "url";
		result = checkInput(text,arr);
		if(result["isCorrect"] == true && text.length != 0){
			result["isCorrect"] = false;
			result["errorStr"]='域名不需要填http://';
		}else{
			arr[2] = "domain";
			result = checkInput(text,arr);
		}
		return result;
	}
    /*
        text:input data
        arg[]:
            arg[0]:type
            arg[1]:min length
            arg[2]:max length
            arg[3]:regexp or others
        ["func","type","necess","type2"]
    */
    function checkInput(text,argv){
        var arg =  argv.concat();
        var result = {"isCorrect": true, "errorStr": ''};
        var type = arg[0];
        arg.shift();/*移除匹配类型*/
        /*当最小长度为0时允许为空时返回真*/
        if(arg[0] == '0' && text.length == 0 ){
            return result;
        }


        switch(type){
            case '1':
            case 'num':
                result = checkNum(text,arg);
                return result;
            case '2':
            case 'name':
                result = _checkName(text,arg);
                return result;
            case '3' :
            case 'ip':
                result = _checkIP(text,arg);
                return result;
            case '4' :
            case 'mask':
                result = _checkMask(text);
                return result;
            case '5':
            case 'mac':
                result = _checkMac(text);
                return result;
            default:
                break;
        }

        /*
            text:待测文本
                arg[]:
                    arg[0]:min length
                    arg[1]:max length
                    arg[2]:regexp or type of checkName when length==1
        */
        function _checkName(text,arg){
            var result = {"isCorrect": true, "errorStr": ''};
            var reg = /^[_0-9a-zA-Z]{0,60}$/;
            var model=1;
            var cnflag=0;
            var max = arg[1];
            var tmpmax = '';
            if(arg[3] && arg[3] == "eqName"){
            	tmpmax =arg[1]-(mbStringLength2(text)-text.length);/*修正其中中文所占字节数*/
            }else{
            	tmpmax =arg[1]-(mbStringLength(text)-text.length);/*修正其中中文所占字节数*/
            }
           
            
           /*
            if(tmpmax!=arg[1]){
                cnflag = 1;

                arg[1] = tmpmax;
            }
            */

            /*模式1：模式匹配，模式2：正则表达式匹配*/
            if(arg.length==3 && arg[2].length > 1){
                model=2;
            }

            if(model == 1){
               switch (parseInt(arg[2])){
                    case 1:/*字母，下划线，数字*/
                        reg = /^[_0-9a-zA-Z]{0,}$/;
                        break;
                    case 2:/*中文,下划线，字母，数字*/
                        reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{0,}$/;
                        break;
                    case 3:/*密码输入框,不能输入中文标点及<>?{}特殊字符*/
                        reg = /^[^\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|'|"|;|:|,|<|\.|>|\/|&|\?]{0,}$/
                        break;
                    case 4:/*不能输入空格*/
                        reg = /^[^ ]{0,}$/;
                        break;
                    case 5: /*不能输入:<>,%'\"&;|和空格字符*/
                        reg = /^[^ |<|>|,|%|'|&|"|;|\\|:|{|}]{0,}$/;
                        break;
                    case 6: /*不能输入:<>,%'\"&;|  SSID专用*/
                        reg = /^[^<|>|,|%|'|&|"|;|\\|:|{|}]{0,}$/;
                        break;
                    default:
                        break;
                }
            }else if(model == 2){
                reg =RegExp(arg[2]);
            }
            var some =arg;

//			alert(mbStringLength(text)+"===="+some+"======"+(mbStringLength(text)>some[1]))
            if(mbStringLength(text)<some[0] || mbStringLength(text) == 0){
                result["isCorrect"]=false;
                if((some[0] != 0)&&(text=="")){
                   result["errorStr"]='不能为空';
                }else if(some[2] == "ali"){
                    result["errorStr"]="英文、数字、特殊字符不能少于5位，中文不能少于2位";
                }else{
                    result["errorStr"]='不能少于'+some[0]+'个字符';
		}
             }else if(!reg.test(text)){
                result["isCorrect"]=false;
                if(some[2] == 1){
                    result["errorStr"]='只能由0-9,a-z,A-Z和下划线组成!';
                }else if(some[2] == 2) {
                    result["errorStr"]='只能由中文,下划线,字母组成';
                }else if(some[2] == 3 ){
                   result["errorStr"]= '不能输入中文标点和\';:,<.>/\&?{} 等特殊字符';
                }else if(some[2] == 4){
                    result["errorStr"]= '输入不能含有空格';
                }else if(some[2] == 5){
                    result["errorStr"]= '不能输入:<>,%\'\"&\\|;{}和空格字符';
                }else if(some[2] == 6){
                    result["errorStr"]= '不能输入:<>,%\'\"&\\|;{}';
                }else{
                    if(some[2] == 'ali')
                    {
                        reg = /^[^ |<|>|,|%|'|&|"|;|\\|:]{0,}$/;
                        if(!reg.test(text)){
                            result["errorStr"]= '不能输入:<>,%\'\"&\\|;和空格字符';
                        } else {
                            result["isCorrect"]=true;
                        }
                    }
                    else
                    {
                        result["errorStr"]= '输入格式有误';
                    }

                }
            }else if(text=='admin'||text=='l2tp'||text=='pptp'){
                    result["isCorrect"]=false;
                    result["errorStr"]='不能使用系统保留名称!';

            }
            if(arg[3]){
            	if(arg[3] == 'eqName'){
            		if(mbStringLength2(text)>some[1]){
		                result["isCorrect"]=false;
		                result["errorStr"]='不能超过'+max+'个字符';
		                if(cnflag == 1){
		                    result["errorStr"] ='不能超过'+max+'个字符,每个中文占2个字符';
		                }
		            }
            	}
            	
            }else if(mbStringLength(text)>some[1]){
                result["isCorrect"]=false;
                result["errorStr"]='不能超过'+max+'个字符';
                if(cnflag == 1){
                    result["errorStr"] ='不能超过'+max+'个字符,每个中文占3个字符';
                }
            }

            return result;
        }
        /*
        text:待测文本
                arg[]:
                    arg[0]:necessary
                    arg[1]:ip type
                    arg[2]:ip type exp

        */
        function _checkIP(text,arg){

            var result = {"isCorrect": true, "errorStr": ''};
            /* 非必填项：可以填入0.0.0.0。必填项：类型11，可以填入0.0.0.0,必填项：类型12，可以填入0.0.0.0,但是需要比较起始结束地址*/
            if((arg[0] == '0' && text == "0.0.0.0" )|| (arg[0] == '11' && text == "0.0.0.0")){
                return result;
            }else if(text == "0.0.0.0"&& arg[0] != '12'){
                result["isCorrect"]=false;
                result["errorStr"]='不能为0.0.0.0';
                return result;
            }
            if(text.length >31){
                result["isCorrect"]=false;
                result["errorStr"]='不能超过31个字符';
                return result;
            }
            var reg1 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            /*
                DNS规定，域名中的标号都由英文字母和数字组成，每一个标号不超过63个字符，
                也不区分大小写字母。标号中除连字符（-）外不能使用其他的标点符号。
                级别最低的域名写在最左边，而级别最高的域名写在最右边。
                由多个标号组成的完整域名总共不超过255个字符。
            */
            var reg2 =/^(?=^.{3,255}$)[a-zA-Z0-9*][-a-zA-Z0-9*]{0,62}(\.[a-zA-Z0-9*][-a-zA-Z0-9*]{0,62})+$/;
            var reg3 =/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
            var model = 1;
            console.log('------------------------------');
            console.log(arg);
            console.log(arg[1]);
            switch(arg[1]){
                case '1':
                case '11':
                case 'ip':
                    model = 1;
                    break;
                case '2':
                case 'domain':
                    model = 2;
                    break;
                case '3':
                case 'url':
                    model = 3;
                    break;
                case '4':
                case 'gt':
                    model = 4;
                    break;
				case '5':
					model = 5;
					break;
                default:
                    model = 1;
                    break;
            }


            if(text.length == 0 ){
                result["isCorrect"]=false;
                if(model ==1){
                    result["errorStr"]='IP地址不能为空';
                }else if(model == 2){
                    result["errorStr"]='域名不能为空';
                }else{
                    result["errorStr"]='不能为空';
                }
            }else if(model ==1  && !reg1.test(text)){
                result["isCorrect"]=false;
                result["errorStr"]='IP地址格式错误';
            }else if(model == 2 && !reg2.test(text)){
                result["isCorrect"]=false;
                result["errorStr"]='域名格式错误';
            }else if(model == 3 && !reg3.test(text)){
                result["isCorrect"]=false;
                result["errorStr"]='url格式错误';
            }else if(model == 4 ){
               if(!reg1.test(text)){
                    result["isCorrect"]=false;
                    result["errorStr"]='结束IP地址格式错误';
                }else if(!reg1.test(arg[2])){
                    var ipS = $('[name="'+arg[2]+'"]').val();
                    if(!reg1.test(ipS)){
                        result = {"isCorrect" : false,"errorStr"  : '起始IP地址格式错误'};
                    }else if( compareIP(ipS,text)>0){
                        result = {"isCorrect" : false,"errorStr"  : '结束IP不能小于起始IP'};
                    }
                }else if(reg1.test(arg[2])){
                    if( compareIP(ipS,text)>0){
                        result = {"isCorrect" : false,"errorStr"  : '结束IP不能小于起始IP'};
                    }
                }
            }else if(model == 5){
				if(!reg3.test(text) && !reg2.test(text)){
	                result["isCorrect"]=false;
	                result["errorStr"]='跳转url格式错误';
	            }
			}
            return result;
        }
        function _checkMask(text){
            var result = {"isCorrect": true, "errorStr": ''};
            var reg=/^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/;

            if(text.length == 0){
                result["isCorrect"]=false;
                result["errorStr"]='掩码不能为空';
            }else if(!reg.test(text)){
                result["isCorrect"]=false;
                result["errorStr"]='掩码格式错误';
            }
            return result;
        }
        /*
            Mac检测
        */
        function _checkMac(text){
            var result = {"isCorrect": true, "errorStr": ''};
            var reg = /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
            var reg1 = /[A-F\d]{2}[A-F\d]{2}[A-F\d]{2}[A-F\d]{2}[A-F\d]{2}[A-F\d]{2}/;
            if(text.length == 0){
                result["isCorrect"]=false;
                result["errorStr"]='Mac地址不能为空';
            }else if(!reg.test(text) || !reg1.test(text)){
                result["isCorrect"]=false;
                result["errorStr"]='Mac地址格式错误';
            }
            return result;
        }

    }
    /*
        返回字符串的字节长度
        0000 - 007F 0xxxxxxx （1字节）
        0080 - 07FF 110xxxxx 10xxxxxx （2字节）
        0800 - FFFF 1110xxxx 10xxxxxx 10xxxxxx （3字节）
    */
    function mbStringLength(s) {
        var totalLength = 0;
        var i;
        var charCode;
        for (i = 0; i < s.length; i++) {
            charCode = s.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength = totalLength + 1;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            }
        }

    return totalLength;
}
        function mbStringLength2(s) {
        var totalLength = 0;
        var i;
        var charCode;
        for (i = 0; i < s.length; i++) {
            charCode = s.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength = totalLength + 1;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 2;
            }
        }

    return totalLength;
}
	function checkIpRangeGroup(ipStr)
	{
		
	    var result = {
		"isCorrect" : true,
		"errorStr"  : ''
	    };
	    
	    if(ipStr.toString()== '' || ipStr.toString()== null){
	    	result.isCorrect = false;
	    	result.errorStr = '不能为空';
	    	return result;
	    }
	    var ipArr = ipStr.split('\n');
		var newarr = [];
		ipArr.forEach(function(str,i){
			if(str.toString() !== ''){
				newarr.push(str)
			}
		});
		
	    newarr.forEach(function (str, index){
			var ipRangeArr = str.split('-');
			ipRangeArr.forEach(function(str2, index2){
			    if (!checkIP(str2).isCorrect)
			    {
				result.isCorrect = false;
			    }
			});
	    });

	    return result;
	}
	function checkMacGroup(macStr)
	{
	    var result = {
		"isCorrect" : true,
		"errorStr"  : ''
	    };
	     
	    if(macStr.toString()== '' || macStr.toString()== null){
	    	result.isCorrect = false;
	    	result.errorStr = '不能为空';
	    	return result;
	    }
	    var macArr = macStr.split('\n');
		var newarr = [];
		macArr.forEach(function(str,i){
			if(str.toString() !== ''){
				newarr.push(str)
			}
		});
	    newarr.forEach(function (str, index){
		if (!checkMac(str).isCorrect)
		{
		    result.isCorrect = false;
		}
	    });

	    return result;
	}

    function checkFirstDate(text,some){
        var result = {
            "isCorrect" : true,
            "errorStr"  : ''
        };
        var thisDom = '';
         var firstval = text;
        var sometext = '';
        if((typeof some[0]=='string')&&some[0].constructor==String){
        	sometext = $('[name="'+some[0]+'"]').val();
        	thisDom = $('[name="'+some[0]+'"]');
        }else{
        	sometext = some[0].val();
        	thisDom = some[0];
        }
        if(thisDom.is(':disabled')){
        	return result;
        }
        if (text == "") {
            result.errorStr = '日期不能为空';
            return result;
        }
//      var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-])(10|12|0?[13578])([-])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(11|0?[469])([-])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(0?2)([-])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-])(0?2)([-])(29)$)|(^([3579][26]00)([-])(0?2)([-])(29)$)|(^([1][89][0][48])([-])(0?2)([-])(29)$)|(^([2-9][0-9][0][48])([-])(0?2)([-])(29)$)|(^([1][89][2468][048])([-])(0?2)([-])(29)$)|(^([2-9][0-9][2468][048])([-])(0?2)([-])(29)$)|(^([1][89][13579][26])([-])(0?2)([-])(29)$)|(^([2-9][0-9][13579][26])([-])(0?2)([-])(29)$))/ig;
          var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
        if(!reg.test(text)&& RegExp.$2 <= 12 && RegExp.$3 <= 31){
                result.errorStr="日期格式错误";
                result.isCorrect=false;
        }

        if(checkDate(firstval).isCorrect && result.isCorrect){
            var d11 = Number(firstval.split('-')[0]);
            var d12 = Number(firstval.split('-')[1]);
            var d13 = Number(firstval.split('-')[2]);

            var d21 = Number(sometext.split('-')[0]);
            var d22 = Number(sometext.split('-')[1]);
            var d23 = Number(sometext.split('-')[2]);
            if(d11>d21){
                result.errorStr="结束日期不能小于起始日期";
                result.isCorrect=false;
            }else if(d11 ==d21){
                if(d12>d22){
                     result.errorStr="结束日期不能小于起始日期";
                     result.isCorrect=false;
                }else if(d12 ==d22){
                     if(d13>d23){
                        result.errorStr="结束日期不能小于起始日期";
                        result.isCorrect=false;
                    }
                }
            }
        }
		 console.log(text+"~~"+sometext)
        return  result;
    }
    /*用来判断最后一个时间必须大于前面的时间*/
    function checkLastDate(text,some) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : ''
        };
         var thisDom = '';
         var firstval = '';

        if((typeof some[0]=='string')&&some[0].constructor==String){
        	firstval = $('[name="'+some[0]+'"]').val();
        	thisDom = $('[name="'+some[0]+'"]');
        }else{
        	firstval = some[0].val();
        	thisDom = some[0];
        }
        if(thisDom.is(':disabled')){
        	return result;
        }
        if (text == "") {
            result.errorStr = '日期不能为空';
            return result;
        }

//      var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-])(10|12|0?[13578])([-])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(11|0?[469])([-])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(0?2)([-])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-])(0?2)([-])(29)$)|(^([3579][26]00)([-])(0?2)([-])(29)$)|(^([1][89][0][48])([-])(0?2)([-])(29)$)|(^([2-9][0-9][0][48])([-])(0?2)([-])(29)$)|(^([1][89][2468][048])([-])(0?2)([-])(29)$)|(^([2-9][0-9][2468][048])([-])(0?2)([-])(29)$)|(^([1][89][13579][26])([-])(0?2)([-])(29)$)|(^([2-9][0-9][13579][26])([-])(0?2)([-])(29)$))/ig;
        var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
        if(!reg.test(text)&& RegExp.$2 <= 12 && RegExp.$3 <= 31){
                result.errorStr="日期格式错误";
                result.isCorrect=false;
        }

        if(checkDate(firstval).isCorrect && result.isCorrect){
            var d11 = Number(firstval.split('-')[0]);
            var d12 = Number(firstval.split('-')[1]);
            var d13 = Number(firstval.split('-')[2]);

            var d21 = Number(text.split('-')[0]);
            var d22 = Number(text.split('-')[1]);
            var d23 = Number(text.split('-')[2]);
            if(d11>d21){
                result.errorStr="结束日期不能小于起始日期";
                result.isCorrect=false;
            }else if(d11 ==d21){
                if(d12>d22){
                     result.errorStr="结束日期不能小于起始日期";
                     result.isCorrect=false;
                }else if(d12 ==d22){
                     if(d13>d23){
                        result.errorStr="结束日期不能小于起始日期";
                        result.isCorrect=false;
                    }
                }
            }
        }
        console.log(firstval+"~~"+text)

        return  result;
    }
    function checkDate(cntrl) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : ''
        };
        if (cntrl == "") {
            result.errorStr = '日期不能为空';
        }
        var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-])(10|12|0?[13578])([-])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(11|0?[469])([-])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-])(0?2)([-])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-])(0?2)([-])(29)$)|(^([3579][26]00)([-])(0?2)([-])(29)$)|(^([1][89][0][48])([-])(0?2)([-])(29)$)|(^([2-9][0-9][0][48])([-])(0?2)([-])(29)$)|(^([1][89][2468][048])([-])(0?2)([-])(29)$)|(^([2-9][0-9][2468][048])([-])(0?2)([-])(29)$)|(^([1][89][13579][26])([-])(0?2)([-])(29)$)|(^([2-9][0-9][13579][26])([-])(0?2)([-])(29)$))/ig;
        if(!reg.test(cntrl)){
                result.errorStr="日期格式错误";
                result.isCorrect=false;
        }
        return  result;
    }

    function checkIpDns(cntrl){
            var result = {
                "isCorrect" : true,
                "errorStr"  : 'IP/域名错误'
            };
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
        + "|"
        + "([0-9a-z_!~*'()-]+\.)*"
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
        + "[a-z]{2,6})"
        + "(:[0-9]{1,4})?"
        + "((/?)|"
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re=new RegExp(strRegex);
        if (re.test(cntrl)){
            result["isCorrect"] = true;
        }else{
            result["isCorrect"] = false;
            result["errorStr"] = "IP/域名错误";
        }
        return result;
    }
    function checkStr(text,some){
       var result = {
            "isCorrect" : false,
            "errorStr"  : '错误'
            };
       if(text.length>16){
            result = {
                "isCorrect" : false,
                "errorStr"  : '字数太多'
            };
       }else{
            result.isCorrect = true;
       }
       return result;
    }


/**
 * 检查是否为数字,some0,最小值,some1最大值
 *
 */
function checkNum(text,some){
   var result = {
        "isCorrect" : false,
        "errorStr"  : ''
        };
        
      
    var num = text;
    if (some[2]=='lanVlan' && text.toString() === "") {
        result.isCorrect= true;
        return result;
    }
    
    if (some[2]=='notnull' && num === ''){
    	result.isCorrect= false;
    	result.errorStr = '不能为空';
    	return result;
    }
    
    /*
    if (some[2]=='vlan' && text.toString() === "") {
        result.errorStr = '不能为空';
        return result;
    }
    */
    if ((!Number(num) && Number(num)!==0) || num.indexOf(' ')>0) {
        result.errorStr = '含有非法数字';
        return result;
    }
   
    if(some[2] == "freshTime" && Number(num)==0) {  
        result.errorStr = '';
        result.isCorrect = true;
        return result;
    }
    if(some[2] && some[2] == 'int'){
    	var regn = /^[0-9]{0,}$/;
    	if(!regn.test(num)){
    		 result.errorStr = '只能输入整数';
        	return result;
    	}
    }
    
    
	if ((Number(num) < some[0] || Number(num) > some[1]))
        result.errorStr =  "应为" + some[0] + "到" + some[1] + "之间的数字";
	else {
	    result.isCorrect = true;
	}
  
    if(Number(num)==5&&some[2] == 'vlan'||Number(num)==5&&some[2]== 'dhcp'){
        result.isCorrect=false;
        result.errorStr='5 被系统占用';
    }


    if(some[2] == 'vlan' && text == ""){
    	result.isCorrect = true;
    	result.errorStr='';
		return result;
    }else if(some[2] == 'dhcp' && text == ""){
        result.isCorrect=false;
        result.errorStr = '不能为空';
    }
	console.log(some[2]);
	if(($('[name="'+some[2]+'"]:checked').val() == 'IP' || $('[name="'+some[2]+'"]:checked').val() == 'IPMac' || $('[name="'+some[2]+'"]:checked').val() == 'autoBind') && Number(num) != 1){
		result.isCorrect=false;
        result.errorStr = '自动绑定或IP绑定或IP/Mac绑定时并发数只能为1';
	}
	if($('[name="'+some[2]+'"]:checked').val() == 'Mac' && Number(num) > 4){
		result.isCorrect=false;
        result.errorStr = 'Mac绑定时，账号最大会话数最大为4';
	}
     return result;

}
/**
 * 检测第三个参数是否小于text
 */
function checkSourceToEndNum(text,some){
   var result = checkNum(text,some);
   if(result.isCorrect){
		var val1 = Number(text);
		var var2 = Number($('[name="'+some[2]+'"]').val());
		if(some[3]){
			var2 = Number(some[3].find('[name="'+some[2]+'"]').val());
		}
        if(val1<var2){
           result.errorStr="目的端口不能小于起始端口";
           result.isCorrect=false;
           return result;
        }
   }
    return result;
}
/**
 *检查域名是否合法
 *
 */
function checkDomainName(text) {
	 var result = {
        "isCorrect" : true,
        "errorStr"  : '..'
        };
   if(text.length==0){
   	    return	result = {
        	"isCorrect" : false,
        	"errorStr"  : '不能为空'
        };
   }
   var rx = /^([a-z\-\d+]+\.){1,}[a-z\-\d]/i;
   if(!rx.test(text)){
   	return	result = {
        	"isCorrect" : false,
        	"errorStr"  : '域名有误'
        };
   }
   return result;

}
	function getFunc(funcName){
		var func = funcs[funcName];
		return func;
	}
    function toNumber(str, start, end) {
        str=str.toString();
        if(!end) end = str.length;
        if(!start) start = 0;
        var tempVal = 0;
        var mySign = 1;
        for (i = start; i < end; i++) {
            c = str.charAt(i);
            if (c < '0' || c > '9') {
                if (i != start && (c != '-' || c != '+')) //?
                return - 1;
                if (c == '-') mySign = -1;
            } else tempVal = tempVal * 10 + (c - '0');
        }
        tempVal *= mySign;
        return tempVal;
    }
    /**
    * 检查两个IP的大小,中间函数
    * @param  {string} ip_str1
    * @param  {string} ip_str2
    * @return {num} 0:相等  1:1小于2 -1:2大于1
    */
    function compareIP(ip_str1, ip_str2) {
        var index = 0;
        var n = 0;
        var ip1 = new Array(4);
        while (index < ip_str1.lastIndexOf(".")) {
            k = index;
            index = ip_str1.indexOf(".", index);
            ip1[n] = toNumber(ip_str1, k, index);
            n++;
            index++;
        }
        ip1[n] = toNumber(ip_str1, index, ip_str1.length);

        index = 0;
        n = 0;
        ip2 = new Array(4);
        while (index < ip_str2.lastIndexOf(".")) {
            k = index;
            index = ip_str2.indexOf(".", index);
            ip2[n] = toNumber(ip_str2, k, index);
            n++;
            index++;
        }
        ip2[n] = toNumber(ip_str2, index, ip_str2.length);

        if (ip1[0] < ip2[0]) return - 1;
        else if (ip1[0] > ip2[0]) return 1;
        else {
            if (ip1[1] < ip2[1]) return - 1;
            else if (ip1[1] > ip2[1]) return 1;
            else {
                if (ip1[2] < ip2[2]) return - 1;
                else if (ip1[2] > ip2[2]) return 1;
                else {
                    if (ip1[3] < ip2[3]) return - 1;
                    else if (ip1[3] > ip2[3]) return 1;
                    else return 0;
                }
            }
        }

    }
    function checkPass(text,some){
        var result = {
        "isCorrect" : true,
        "errorStr"  : '..'
        };
        if($('[name="'+some[0]+'"]').val()!=text){
            result.isCorrect=false;
            result.errorStr='密码不一致';
          }
        return result
    }
    /**
     * 检查起始IP是否小于结束IP
     * @param  {string} text 结束IP
     * @param  {StringArr} some[0] 起始IP
     * @return
     */
    function checkIPStartToEnd(text,some){
        var result = {
        "isCorrect" : true,
        "errorStr"  : '..'
        };
         result=checkIP(text);
        if(!result['isCorrect']){
            return result;
        }
        // if(compareIP($('[name="'+some[0]+'"]').val(),text)==0){
        //         result = {
        //             "isCorrect" : false,
        //             "errorStr"  : '结束IP不能和起始IP一样'
        //         };
        // }else
        if(compareIP($('[name="'+some[0]+'"]').val(),text)>0){
                result = {
                    "isCorrect" : false,
                    "errorStr"  : '结束IP不能小于起始IP'
                };
            }
        // else if(compareIP($('[name="'+some[0]+'"]').val(),text)>0){
        //      result = {
        //          "isCorrect" : false,
        //          "errorStr"  : '结束IP不能大于起始IP'
        //      };
        //  }
        return result;
    }
    /**
     * 检测IP,可以为空
     */
    function checkNullIP(ip){
        var result = {
            "isCorrect" : true,
            "errorStr"  : 'cuole'
        };
        if(ip.length==0 || ip == '0.0.0.0')
            return  result;
        return checkIP(ip);
    }
	/**
	 * 检测IP地址
	 * @author JeremyZhang
	 * @date   2016-10-10
	 * @param  {string}   ip IP地址
	 * @return {[type]}      [description]
	 */

	function checkIP(ip){
		var result = {
			"isCorrect" : false,
			"errorStr"  : 'cuole'
		};
        if(ip.length == 0){
            result["errorStr"] = '不能为空';
            return result;
        }
        /*
		var reg  = /^([0-9]{1,3}\.{1}){3}[0-9]{1,3}$/;// 检测ip格式的正则
		if(!reg.test(ip)){
			result["errorStr"] = '格式错误';
			return result;
		}
		var arr = ip.split('.');
		var tag = arr.every(function(item){
			return parseInt(item) < 255;
		});
		if(tag){
			result["isCorrect"] = true;
			return result;
		}else{
			result["errorStr"] = '超过255';
			return result;
		}
        */
        if (!verifyDottedIP(ip)) {
            result["isCorrect"] = false;
            result["errorStr"] = '格式错误';
        } else {
            result["isCorrect"] = true;

        }
        return result;
	}

    function checkStaticIP(ip){
		var result = {
			"isCorrect" : false,
			"errorStr"  : 'cuole'
		};
        if(ip.length == 0){
            result["errorStr"] = '不能为空';
            return result;
        }
        /*
		var reg  = /^([0-9]{1,3}\.{1}){3}[0-9]{1,3}$/;// 检测ip格式的正则
		if(!reg.test(ip) || ip == '0.0.0.0'){
			result["errorStr"] = '格式错误';
			return result;
		}
		var arr = ip.split('.');
		var tag = arr.every(function(item){
			return parseInt(item) < 255;
		});
		if(tag){
			result["isCorrect"] = true;
			return result;
		}else{
			result["errorStr"] = '超过255';
			return result;
		}
        */ 
        if (!verifyDottedIP(ip)) {
            result["isCorrect"] = false;
            result["errorStr"] = '格式错误';
        } else {
            result["isCorrect"] = true;

        }
        return result;
	}


	function checkMainDns(ip){
        var result = {
            "isCorrect" : false,
            "errorStr"  : 'cuole'
        };
	if(ip == "0.0.0.0")
	{
	    result["errorStr"] = "主DNS不能为0.0.0.0";
            return result;
	}
        if(ip.length == 0){
            result["errorStr"] = "主DNS不能为空";
            return result;
        }
        /*
        var reg  = /^([0-9]{1,3}\.{1}){3}[0-9]{1,3}$/;// 检测ip格式的正则
        if(!reg.test(ip)){
            result["errorStr"] = '格式错误';
            return result;
        }
        var arr = ip.split('.');
        var tag = arr.every(function(item){
            return parseInt(item) < 255;
        });
        if(tag){
            result["isCorrect"] = true;
            return result;
        }else{
            result["errorStr"] = '超过255';
            return result;
        }
        */
        if (!verifyDottedIP(ip)) {
            result["isCorrect"] = false;
            result["errorStr"] = '格式错误';
        } else {
            result["isCorrect"] = true;

        }
        return result;
    }

    function checkSecDns(ip){
        var result = {
            "isCorrect" : false,
            "errorStr"  : 'cuole'
        };
        if(ip.length == 0){
            result["isCorrect"] = true;
            return result;
        }
        var reg  = /^([0-9]{1,3}\.{1}){3}[0-9]{1,3}$/;// 检测ip格式的正则
        if(!reg.test(ip)){
            result["errorStr"] = '格式错误';
            return result;
        }
        var arr = ip.split('.');
        var tag = arr.every(function(item){
            return parseInt(item) < 255;
        });
        if(tag){
            result["isCorrect"] = true;
            return result;
        }else{
            result["errorStr"] = '超过255';
            return result;
        }
    }
	function testDemoCheck(text,some){
		var result = {
			"isCorrect" : true,
			"errorStr"  : 'cuolelele'
		};
		if(text != some[0] && text != some[1]){
			result["isCorrect"] = false;
		}
		return result;
	}
	/**
	 * @author lai
	 * @data   2016-10-19
	 * @param  {String} text 输入框中待检测的文本
	 * @param  {Arr} some 	 some[0]=minlength
	 *                       some[1]=maxlength
     *                       some[2]=sysName
	 * @return {[type]}      [description]
	 */
	function checkName(text,some){
		var result = {
			"isCorrect" : true,
			"errorStr"  : ''
		};
        var maxlength=some[1];
        some[1]=some[1]-(mbStringLength(text)-text.length);/*修正字符串长度*/
        if(some[2]=='3322'){
            var index=text.indexOf(".");
            hostname1=text.substring(0,index);
            hostname2=text.substring(index+1,text.length+1);
            if((hostname2 != "3322.org")&&(hostname2 != "f3322.org")&&(hostname2 != "f3322.net")&&(hostname2 != "eatuo.com")&&(hostname2 != "webok.net")&&(hostname2 != "7766.org")&&(hostname2 != "6600.org")&&(hostname2 != "9966.org")&&(hostname2 != "2288.org")&&(hostname2 != "8800.org")&&(hostname2 != "8866.org"))
            {
                result.errorStr="主机名后缀错误";
                result["isCorrect"]=false;
                 return result;
            }else{
                result["isCorrect"]=true;
            }
        }
		var reg = /^[_0-9a-zA-Z]{0,60}$/
		if(text.length==0){
			result["isCorrect"]=false;
			result["errorStr"]='不能为空';
		}else if(text.length<some[0]){
			result["isCorrect"]=false;
			result["errorStr"]='不能少于'+some[0]+'个字符';
		}else if(text.length>some[1]){
			result["isCorrect"]=false;
			result["errorStr"]='不能超过'+maxlength+'个字符';
		}else if(!reg.test(text) && some[2]!='3322'&&some[2]!='fnut'){
			result["isCorrect"]=false;
			result["errorStr"]='只能由0-9,a-z,A-Z和下划线组成!';
		}else if(text=='admin'||text=='l2tp'||text=='pptp'){
            if(some.length !=3){
                result["isCorrect"]=false;
                result["errorStr"]='不能使用系统保留名称!';
            }
		}
        if(some[2]=='lanConfig'&&text=='default'){
            result["isCorrect"]=false;
            result["errorStr"]='不能使用系统保留名称!';
        }
		return result;
	}
	/**
	 * @author lai
	 * @data   2016-10-19
	 * @param  {String} text 输入框中待检测的文本
	 * @param  {Arr} some 	 some[0]=minlength
	 *                       some[1]=maxlength
     *                       some[2]=sysName
	 * @return {[type]}      [description]
	 */
	function checkName_admin(text,some){
		var result = {
			"isCorrect" : true,
			"errorStr"  : ''
		};
        var maxlength=some[1];
        some[1]=some[1]-(mbStringLength(text)-text.length);/*修正字符串长度*/
        if(some[2]=='3322'){
            var index=text.indexOf(".");
            hostname1=text.substring(0,index);
            hostname2=text.substring(index+1,text.length+1);
            if((hostname2 != "3322.org")&&(hostname2 != "f3322.org")&&(hostname2 != "f3322.net")&&(hostname2 != "eatuo.com")&&(hostname2 != "webok.net")&&(hostname2 != "7766.org")&&(hostname2 != "6600.org")&&(hostname2 != "9966.org")&&(hostname2 != "2288.org")&&(hostname2 != "8800.org")&&(hostname2 != "8866.org"))
            {
                result.errorStr="主机名后缀错误";
                result["isCorrect"]=false;
                 return result;
            }else{
                result["isCorrect"]=true;
            }
        }
		var reg = /^[_0-9a-zA-Z]{0,60}$/
		if(text.length==0){
			result["isCorrect"]=false;
			result["errorStr"]='不能为空';
		}else if(text.length<some[0]){
			result["isCorrect"]=false;
			result["errorStr"]='不能少于'+some[0]+'个字符';
		}else if(text.length>some[1]){
			result["isCorrect"]=false;
			result["errorStr"]='不能超过'+maxlength+'个字符';
		}else if(!reg.test(text) && some[2]!='3322'&&some[2]!='fnut'){
			result["isCorrect"]=false;
			result["errorStr"]='只能由0-9,a-z,A-Z和下划线组成!';
		}else if(text=='l2tp'||text=='pptp'){
            if(some.length !=3){
                result["isCorrect"]=false;
                result["errorStr"]='不能使用系统保留名称!';
            }
		}
        if(some[2]=='lanConfig'&&text=='default'){
            result["isCorrect"]=false;
            result["errorStr"]='不能使用系统保留名称!';
        }
		return result;
	}

    function checkDomainOrIP(text,some){
        var result = {
            "isCorrect" : true,
            "errorStr"  : '错了'
        };
        result =checkIP(text,some);
        if(result.isCorrect){
            return result;
        }else
            return checkDomainName(text,some);
    }
//	function checkMac(cntrl) {
    function checkMac(text,some) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : '错了'
        };
	    var num = text.toUpperCase();
	    num = trimstr(num);
	    if (text.length == "") {
            result["isCorrect"]=false;
            result["errorStr"]='不能为空';
	    }
	    else
	    {
        	var length = num.length;
        	for (var i = 0; i < length; i++)
        	{
           		onenum = num.substring(i, i + 1);
            	twonum = num.substring(i + 1, i + 2);
            	if ((onenum < "0" || onenum > "9") && (onenum < "a" || onenum > "f") && (onenum < "A" || onenum > "F"))
            	{
                	if (onenum == "-" || onenum == ":")
                	{
                    	if (twonum == "-" || twonum == ":")
                    	{
	                        length = 0;
	                        break;
                    	} else
                    	{
                        	num = num.substring(0, i) + num.substring(i + 1, length);
                        	length--;
                    	}
                		} else {
                    		length = 0;
                    		break;
                		}
           	 		}
        		}
        		if (length != 12) {
                    result["isCorrect"]=false;
                    result["errorStr"]='Mac地址非法';
        		} else {
            		if (num == "000000000000" || num == "FFFFFFFFFFFF") {
                        result["isCorrect"]=false;
                        result["errorStr"]='Mac地址非法';
            	}
       	 	}
    	}
    	return result;
	}
    function checkNullMac(text,some) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : '错了'
        };
        if(text.length==0)
            return result;
        return checkMac(text,some);
    }
	    //功能：检查是否合法数字并返回提示信息
    function re_checkNumber(cntrl) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : 'IP错误'
        };
        var retips = "";
        var num = trimstr(cntrl);
        if (cntrl == "")
        {
            result["isCorrect"] = false;
            result["errorStr"] = "不能为空"
        }
        else if (!isInt(num))
        {
            result["isCorrect"] = false;
            result["errorStr"] = "不能输入数字以外的其他字符"
        }
        else if (eval(num) < 0 || eval(num) > 7) return false;
        return result;
    }
	    //功能：检查是否合法用户名并返回提示信息
    function re_checkName(cntrl) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : '名称错误'
        };
        var retips = "";
        var name = cntrl;
        if (name != "" && name != null) {
            if (name == 0) {
                result["isCorrect"] = false;
                result["errorStr"] = "不能为0";
            }
        }
        else
        {
            result["isCorrect"] = false;
            result["errorStr"] = "不能为空";
        }

        if (name.indexOf(";") != -1 || name.indexOf(",") != -1 || name.indexOf("%") != -1 || name.indexOf("\"") != -1 || name.indexOf("&") != -1 || name.indexOf(" ") != -1 || name.indexOf("\'") != -1 || name.indexOf("\\") != -1 || name.indexOf("<") != -1 || name.indexOf(">") != -1) {
            result["isCorrect"] = false;
             result["errorStr"] = '存在特殊字符';
        }
       //
       return result;
    }
	    //功能：检查是否合法 子网掩码并返回提示信息 (必填选项，不能为空）
    function re_checkMask(cntrl) {
        var result = {
            "isCorrect" : true,
            "errorStr"  : '掩码'
        };
        var retips = "";
        ip_str = trimstr(cntrl);
        if (ip_str != "") {
            if (!validateMask(ip_str) || cntrl == "255.255.255.255") {
                result["isCorrect"] = false;
                result["errorStr"] = "掩码输入错误";
            }
        } else {
            result["isCorrect"] = false;
            result["errorStr"] = "掩码不能为空";
        }
        return result;
    }
	    //功能：检查是否合法ip地址或子网掩码并返回提示信息 (必填选项，不能为空）
    function re_checkIP(cntrl){
        var result = {
            "isCorrect" : true,
            "errorStr"  : 'IP错误'
        };
        var retips = "";
        var ip_str = trimstr(cntrl);
        if (ip_str != "") {
            if (!verifyDottedIP(ip_str)) {
                result["isCorrect"] = false;
            } else {

            }
        }
        else
        {
            result["isCorrect"] = false;
            result["errorStr"] = "IP地址不能为空";
        }
        return result;
    }
	function trimstr(str) {
        return str.replace(/\s/g, "");
    }
	    /**
     * 函数功能：验证子网掩码的合法性
     * 函数作者：236F(fuwei236#gmail.com)
     * 传入参数：MaskStr:点分十进制的子网掩码(如：255.255.255.192)
     * 调用函数：_checkIput_fomartIP(ip)
     * 返回值：  true:  MaskStr为合法子网掩码
     false: MaskStr为非法子网掩码
     **/
    function validateMask(MaskStr) {
        /* 有效性校验 */
        var IPPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
            if (!IPPattern.test(MaskStr)) return false;

        /* 检查域值 */
        var IPArray = MaskStr.split(".");
        var ip1 = parseInt(IPArray[0]);
        var ip2 = parseInt(IPArray[1]);
        var ip3 = parseInt(IPArray[2]);
        var ip4 = parseInt(IPArray[3]);
        if (ip1 < 0 || ip1 > 255
                /* 每个域值范围0-255 */
                || ip2 < 0 || ip2 > 255 || ip3 < 0 || ip3 > 255 || ip4 < 0 || ip4 > 255) {
            return false;
        }
        /* 检查二进制值是否合法 */
        //拼接二进制字符串
        var ip_binary = _checkIput_fomartIP(ip1) + _checkIput_fomartIP(ip2) + _checkIput_fomartIP(ip3) + _checkIput_fomartIP(ip4);

        if ( - 1 != ip_binary.indexOf("01")) return false;
        return true;
    }
	/**
     * 函数功能：返回传入参数对应的8位二进制值
     * 传入参数：ip:点分十进制的值(0~255),int类型的值，
     * 主调函数：validateMask
     * 调用函数：无
     * 返回值:   ip对应的二进制值(如：传入255，返回11111111;传入1,返回00000001)
     **/
    function _checkIput_fomartIP(ip) {
        return (ip + 256).toString(2).substring(1); //格式化输出(补零)
    }
	function isInt(theInt) {
        theInt = trimstr(theInt);
        if ((theInt.length > 1 && theInt.substring(0, 1) == "0") || !isNum(theInt)) return false;
        else return true;
    }
	/********************
      判断str是否为数字
     ********************/
    function isNum(str) {
        str=str.toString();
        if (str.length == 0 || str == null) return false;

        for (i = 0; i < str.length; i++) {
            if (48 > str.charCodeAt(i) || 57 < str.charCodeAt(i)) {
                return false;
            }
        }

        return true;
    }
	function verifyDottedIP(ip_str) {
        if (ip_str == '0.0.0.0') return true;
        var val = 0;
        var i = index = 0;
        while (index < ip_str.lastIndexOf(".")) {
            k = index;
            index = ip_str.indexOf(".", index);
            val = toNumber(ip_str, k, index);
            if (k == 0) if ((val == 0) || (val == 127) || (val >= 224)) {
                return false;
            }
            if (!isInt(ip_str.substring(k, index))) break;
            if (val < 0 || val > 255) break;
            i++;
            index++;
        }
        if (i != 3) return false;
        else {
            if (index == ip_str.length) return false;
            else {
                val = toNumber(ip_str, index, ip_str.length);
                if ((val < 0 || val > 255) || !isInt(ip_str.substring(index, ip_str.length))) return false;
            }
        }

        return true;
    }
	function toNumber(str, start, end) {
        str=str.toString();
        if(!end) end = str.length;
        if(!start) start = 0;
        var tempVal = 0;
        var mySign = 1;
        for (i = start; i < end; i++) {
            c = str.charAt(i);
            if (c < '0' || c > '9') {
                if (i != start && (c != '-' || c != '+')) //?
                    return - 1;
                if (c == '-') mySign = -1;
            } else tempVal = tempVal * 10 + (c - '0');
        }
        tempVal *= mySign;
        return tempVal;

    }

	module.exports = {
		getFunc : getFunc
	};
});
