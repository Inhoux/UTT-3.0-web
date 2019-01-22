define(function(require, exports, module) {
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	var Translate  = require('Translate');
	var dicArr     = ['common','doNetworkManagementStrategy'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	function display($container) {
		$container.empty();
		// 清空标签页容器
		var tips = require('Tips');
		 $.ajax({
	      url:'common.asp?optType=lanAccessCtrl|Organization|',
	      type: 'GET',
	      success: function(result) {
	      	//处理数据
			var res = processData(result);
	        var isSuccess = res["isSuccessful"];
	        if (isSuccess) {
	          var data = res["data"];
	          DATA['data']=data;
	          console.log(data);
				//制作表单及按钮
				var $inputs = getInputDom(data);
				//生成页面
				$container.append($inputs);
				var Translate  = require('Translate');
				var tranDomArr = [$container];
				var dicArr     = ['common','doNetworkManagementStrategy'];
				Translate.translate(tranDomArr, dicArr);
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });
	}
	/**
	 * 数据处理
	 * @param {Object} result
	 */
	function processData(result){
		var doEval = require('Eval');
	    var codeStr = result,
	        variableArr = ['lanAccessEnable', 'lanAccessType','lanAccessData','orgData','orgNames','status','ip','id','allDatas'];
	    var results = doEval.doEval(codeStr, variableArr);	    
	    DATA.curHostIp=results.data.ip;
	    DATA.orgAllDatas=results.data.allDatas;
	    DATA.curHostId=results.data.id;
	    return results;
	}
	
	//页面表单
	function getInputDom(data){
		var data = data || {};
		DATA['datas'] = {
			checkIdStr  :data.orgData || '',//已被勾选的id字符串
			ipStr		:data.lanAccessData || '',//ip段
			applyTypeStr:data.lanAccessType || 'all',//全部、组织、IP勾选的哪一个(all org ip)
			showName	: ''
		};
		var inputlist = [
			{   
            "prevWord": '{lanAccessCtrl}',
            "inputData": {
                "defaultValue" : data.lanAccessEnable || 'off', 
                "type": 'radio',
                "name": 'innerAccessControl',
                items:[
                	{name:'{open}',value:'on'},
                	{name:'{close}',value:'off'}
                ]
            },
	       },
	       {   
            "prevWord": '{choiceUser}',
            "inputData": {
                "value" : makeTheChooseChange(data) || '', 
                "type": 'text',
                "name": 'choosePeople',
                "maxLength":2
            }
	       }
		];
		var IG = require('InputGroup');
		var $inputs = IG.getDom(inputlist);
		

		var $choose = $inputs.find('[name="choosePeople"]');
		
		DATA.oldorgData = data.orgData;
		DATA.oldlanAccessData = data.lanAccessData;
		DATA.oldlanAccessType = data.lanAccessType;
		
		$choose.click(function(){
				var orgdatas = {
					saveClick:function(savedatas){
						data.lanAccessType = savedatas.applyTypeStr;
						DATA['datas']=savedatas;
						if (savedatas.applyTypeStr == "ip"){
							$choose.val(savedatas.ipStr);
							data.lanAccessData = savedatas.ipStr;
						}
						else if (savedatas.applyTypeStr == "org"){
							$choose.val(savedatas.showName);
							data.orgData = savedatas.checkIdStr;
						}else{
							$choose.val('全部用户');
						}
						savedatas.close();
					},
					checkableStr:DATA['datas'].checkIdStr || '',//被勾选的id字符串
					ipStr:DATA['datas'].ipStr || '',//开始结束的ip
					applyTypeStr:DATA['datas'].applyTypeStr || 'all'//单选默认值					
				};
				require('P_plugin/Organization').display(orgdatas);
			}
		);
		
		//添加自定义输入部分
		
		function makeTheChooseChange(data){
			var strs = '';
			if(data.lanAccessType == 'all'){
				strs = T('allUser');
			}else if(data.lanAccessType == 'org'){
				strs = data.orgNames;
			}else if(data.lanAccessType == 'ip'){
				strs = data.lanAccessData;
			}
			return strs;
		}
		
		//按钮部分
		var btnGroupList = [
		    {
		        "id"        : 'save',
		        "name"      : '{save}',
		        "clickFunc" : function($btn){
		        $btn.blur();
		           saveFunc();
		        }
		    },
		    {
		        "id"        : 'reset',
		        "name"      : '{reset}',
		        "clickFunc" : function(){
		        	DATA['datas'].checkIdStr = DATA.oldorgData;
		        	DATA['datas'].ipStr = DATA.oldlanAccessData;
		        	DATA['datas'].applyTypeStr = DATA.oldlanAccessType;
		        	
		        }
		    }
		];
		var BtnGroup =  require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');
		
		
		return [$inputs,$btnGroup];
		
	}
	/**
	 * 判断userIP是否在IPduan中,是返回true,不是返回false
	 */
	function ifIPInIPAddress(userIP,IPduan){
		var ipsArr = IPduan.split('-');
		
		if(compareIP(ipsArr[0],userIP)<=0 && compareIP(userIP,ipsArr[1])<=0)
			return true;
		else
			return false;
	}
	/**
	 * 如果IP1 小于IP2 返回 -1,否则返回1,相等返回0
	 * @param  {[type]} ip_str1 [description]
	 * @param  {[type]} ip_str2 [description]
	 * @return {[type]}         [description]
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
	 * 页面的保存
	 */
	function saveFunc(){
		if($('[name="innerAccessControl"]:checked').val() == 'off'){
			saveThisData();
		}else{
				if(DATA['datas'].applyTypeStr == 'org'){
				var checkIdArr = [];
				var idStr = DATA['datas'].checkIdStr || '';
				var orgIdArr = idStr.split(',');
				for(var i in orgIdArr){
					 for(var j in DATA.orgAllDatas){
					 	if(orgIdArr[i] == DATA.orgAllDatas[j].id){
					 		checkIdArr.push(DATA.orgAllDatas[j]);
					 	}
					 }
				}
				var newCheckArr = [];
				var isTempUser = 0;
				checkIdArr.forEach(function(obj){
					if (obj.id == 1) {
						isTempUser = 1;
					}
					if(obj.objType == 1){
						newCheckArr.push(obj);
					}else{
						findChids(obj.id);
					}
				});
				function findChids(thisId){
					DATA.orgAllDatas.forEach(function(obj){
						if(obj.pid == thisId){
							if(obj.objType == 1){
								newCheckArr.push(obj);
							}else{
								findChids(obj.id);
							}
						}
					});
				}
				var withYourIP = false;
				if (DATA.curHostId != undefined) {
					if (DATA.curHostId == 0) {
			    		if (isTempUser == 1) {
			    			withYourIP = true;
			    		}
			    	} else {
			    		for(var i in newCheckArr){
			    			if(newCheckArr[i].id == DATA.curHostId){
			    				withYourIP = true;
			    				break;
				   			}
			   			}
			   		}
			   	}
			    if(!withYourIP){
			    	require('Tips').showConfirm('您的IP不在可访问范围内，保存后您将断开连接，确认保存吗？',function(){
			    		saveThisData();
			    	});
			    }else{
			    	saveThisData();
			    }
			    
			}else if(DATA['datas'].applyTypeStr == 'ip'){
				var nowIP1Arr = DATA['datas'].ipStr.split('-')[0].split('.');
				var nowIP2Arr = DATA['datas'].ipStr.split('-')[1].split('.');
				var myIPArr = DATA.curHostIp.split('.');
				var withYourIP = true;
				for(var n in myIPArr){
					if(parseInt(myIPArr[n]) < parseInt(nowIP1Arr[n]) || parseInt(myIPArr[n]) > parseInt(nowIP2Arr[n])){
						withYourIP = false;
					}
				}
				
				if(!withYourIP){
					require('Tips').showConfirm('您的IP不在可访问范围内，保存后您将断开连接，确认保存吗？',function(){
			    		saveThisData();
			    	});
				}else{
			    	saveThisData();
			    }
				
				
			}else{
				saveThisData();
			}
		}
		
		
		function saveThisData() {
			var SRLZ = require('Serialize');
			// 获得用户输入的数据
			var queryArrs = SRLZ.getQueryArrs($("#2"));
			var datajson = SRLZ.queryArrsToJson(queryArrs);

			var datastr = SRLZ.queryJsonToStr(datajson);
			var data = DATA['datas'];
			var SRLZ = require('Serialize');
			// 获得用户输入的数据
			var newdata = {
				lanAccessEnable: datajson.innerAccessControl, //开启关闭
				lanAccessType: data.applyTypeStr //全部、组织、ip
			};

			if(newdata.lanAccessType == 'all') {
				newdata.lanAccessData = ''; //配置好的数据
			} else if(newdata.lanAccessType == 'org') {
				newdata.lanAccessData = data.checkIdStr || '';
			} else if(newdata.lanAccessType == 'ip') {
				newdata.lanAccessData = data.ipStr || '';
			}

			saveOrgDatas();

			function saveOrgDatas() {
				var dataStrs = SRLZ.queryJsonToStr(newdata);
				var tips = require('Tips');
				$.ajax({
					url: '/goform/formLanAccessCtrl',
					type: 'POST',
					data: dataStrs,
					success: function(result) {
						//处理数据
						var res = processData(result);
						var isSuccess = res["isSuccessful"];
						if(isSuccess) {
							var data = res["data"];
							var isSuccessful = data["status"];
							// 判断修改是否成功
							if(isSuccessful) {
								tips.showSuccess('{saveSuccess}');
								display($('#2'));

							} else {
								var errMsg = result["errorstr"];
								tips.showWarning('{saveFail}');
							}
						} else {
							tips.showError('{parseStrErr}');
						}
					}
				});
			}
		}
		
		
	   
	}
	
	// 提供对外接口
	module.exports = {
		display: display
	};
});
