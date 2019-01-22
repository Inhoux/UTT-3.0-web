define(function(require, exports, module) {
    require('jquery');
	var DATA = {};
    //获得认证配置页面
    var Translate = require('Translate');
    var dicArr = ['common', 'doPeopleOrganize'];

    function T(_str) {
        return Translate.getValue(_str, dicArr);
    }

    function getWebAuthconf($container) {
        //获取配置信息
        $.ajax({
            url: 'common.asp?optType=webAuth',
            type: 'GET',
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = [
                        /*需要获取的数据*/
                        /*web认证*/
                        'lively', 'authtype', 'tipstitle',
                        'tipsinfo', 'hidcontact', 'pictureUrl',
                        'activePic', 'webAuthSuccessName', 'webAuthSuccessNote',
                        'en_picture', 'chooseimg', 'staleTime', 'selfenabled',
                        /*PPPOE数据*/
                        'lanPPPoETypew',
                        'pppoeStart',
                        'ipcount',
                        'pppoePriDns',
                        'pppoeSecDns',
                        'vailtype',
                        'smaxconv',
                        'selfHelpEnable',
                        'PPPoEOnly',
                        'addrGroupName',
                        'exceptIpGroup',
                        'PppoeNoticeEnable',
                        'PPPoENoticePageName',
                        'remainDays',
                        /*免认证*/
                        'noAuthEn',
                        'noAuthType',
                        'orgData',
                        'noAuthIp'
                    ];
                result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                //判断代码字符串执行是否成功
                if (isSuccess) {
                    var data = result["data"];

                    var temp = data.hidcontact;
            		temp = temp.replace(/%/g, "%25");
            		temp = temp.replace(/\&/g, "%26");
            		data.hidcontact = temp.replace(/\+/g, "%2B");

					DATA.thisdata = data;
                    if (data.chooseimg == 0) {
                        data.chooseimg = 'importpictureurl';
                    } else {
                        data.chooseimg = 'uploadImg';
                    }
                    data.authPage = data.webAuthSuccessName;
                    var $inputDom = mainPage(data);
                    $container.empty().append($inputDom);
                } else {
                    alert('失败');
                }
            }
        });

    }



    function mainPage(data) {
        data.authType = data.authtype;
        if (data.lively == 1) {
            if (data.authType == 'localAuth') {
                var webauth = 1;
                var remauth = 0;
            } else {
                var webauth = 0;
                var remauth = 1;
            }
        }
        var Tips = require('Tips');
        var inputList = [{
            "inputData": {
            "type": 'title',
            "name": '{pppAuth}'
                     }
         }, {
            "prevWord": '{pppAuth}',
            "inputData": {
                "type": 'radio',
                "name": 'PPPoEAuth',
                "defaultValue": data.lanPPPoETypew == 1 ? 'on' : 'off',
                "items": [{
                    "value": 'on',
                    "name": '{open}'
                }, {
                    "value": 'off',
                    "name": '{close}'
                }]
            }
        }, {
            "inputData": {
            "type": 'title',
            "name": '{webAuth}'
                     }
         }, {
            "prevWord": '{localAuth}',
            "inputData": {
                "type": 'radio',
                "name": 'WebAuth',
                "defaultValue": webauth == 1 ? 'on' : 'off',
                "items": [{
                    "value": 'on',
                    "name": '{open}'
                }, {
                    "value": 'off',
                    "name": '{close}'
                }]
            }
        }, {
            "prevWord": '{remoteAuth}',
            "display" : false,
            "inputData": {
                "type": 'radio',
                "name": 'remoteAuth',
                "defaultValue": remauth == 1 ? 'on' : 'off',
                "items": [{
                    "value": 'on',
                    "name": '{open}'
                }, {
                    "value": 'off',
                    "name": '{close}'
                }]
            }
        }, {
            "prevWord": '{noAuth}',
            "inputData": {
                "type": 'radio',
                "name": 'noAuth',
                "defaultValue": data.noAuthEn,
                "items": [{
                    "value": 'on',
                    "name": '{open}'
                }, {
                    "value": 'off',
                    "name": '{close}'
                }]
            }
        }];
        var IG = require('InputGroup');
        var $dom = IG.getDom(inputList);

        var btn1 = [{
            "id": 'PPPoEConfig',
            "name": '{config}',
            "clickFunc": function($this) {
                require.async('./showModalPPPoE', function(obj) {
                    var refreshpz = function() {
                        display();
                    }
                    obj.display(refreshpz);
                });
            }
        }];
        var btn2 = [{
            "id": 'WebConfig',
            "name": '{config}',
            "clickFunc": function($this) {
                require.async('./showModalWeb', function(obj) {
                    obj.display(DATA.thisdata);
                });
            }
        }];
        var btn3 = [{
            "id": 'remoteConfig',
            "name": '{config}',
            "clickFunc": function($this) {
				require.async('./showModalRemote', function(obj) {
                    obj.display(DATA.thisdata);
                });
            }
        }];
        var btn4 = [{
            "id": 'noConfig',
            "name": '{config}',
            "clickFunc": function($this) {
                var datass = {
                    //保存回调
                    saveClick: function(saveData) {
                        //alert(saveData.checkIdStr);
                        //alert(saveData.ipStr);
                        //alert(saveData.applyTypeStr);
                        var noAuthPostData;
                        var noAuthPostType = saveData.applyTypeStr;
                        var canSave = 1;
                        if (noAuthPostType == 'org') {
                            noAuthPostData = saveData.checkIdStr;
                            if (noAuthPostData == '')
                                canSave = 0;
                        } else if (noAuthPostType == 'ip') {
                            noAuthPostData = saveData.ipStr;
                            if (noAuthPostData == '')
                                canSave = 0;
                        } else if (noAuthPostType == 'all') {
                            noAuthPostType = '';
                        } else {
                            canSave = 0;
                        }

                        if (canSave == 1) {
                            var Serialize = require('Serialize');
                            data.enabled = (data.lively == 1 ? "on" : "off");
                            data.noAuthType = noAuthPostType;
                            data.noAuthData = noAuthPostData;
                            var noAuthPost = Serialize.queryJsonToStr(data);
                            $.ajax({
                                url: "/goform/formWebAuthGlobalConfig",
                                type: 'POST',
                                data: noAuthPost,
                                success: function(result) {
                                    var doEval = require('Eval');
                                    var codeStr = result,
                                        variableArr = ['status', 'errMsg'],
                                        result = doEval.doEval(codeStr, variableArr),
                                        isSuccess = result["isSuccessful"];
                                    // 判断代码字符串执行是否成功
                                    if (isSuccess) {

                                        var data = result["data"],
                                            status = data['status'];
                                        if (status) {
                                            Tips.showSuccess('操作成功！', 2);
                                            saveData.close();
                                            display($('#1'));
                                        } else {
                                            Tips.showWarning(data["errMsg"], 2);
                                        }

                                    } else {
                                        Tips.showWarning('字符串解析错误…', 2);
                                    }
                                }
                            });


                            saveData.close();
                        } else {
                            Tips.showWarning('数据不能为空', 2);
                        }
                    },
                    checkableStr: data.orgData, //被勾选的id字符串
                    ipStr: data.noAuthIp, //开始结束的ip
                    applyTypeStr: data.noAuthType //单选默认值

                };

                require('P_plugin/Organization').display(datass);

            }
        }];

        var btnlist = {
            PPPoEAuth: btn1,
            WebAuth: btn2,
            remoteAuth: btn3,
            noAuth: btn4
        }

        for (var i in btnlist) {
            IG.insertBtn($dom, i, btnlist[i]);
        }

        //四个认证方式的点击事件
        $dom.find('input[type="radio"]').change(function() {
            var $t = $(this);
            if (!$t.is(':checked')) {
                return false;
            }
            var Tips = require('Tips');
            var vals = $t.val();
            var names = $t.attr('name');
            var Serialize = require('Serialize');
            var urls = '';

            var key = '';

            switch (names) {
                case 'PPPoEAuth':
                    urls += "forPppoeServGlobale";
                    data.lanPPPoETypew = vals;
                    key = Serialize.queryJsonToStr(data);
                    break;
                case 'WebAuth':
                    data.enabled = vals;
                    data.authType = "localAuth";
                    data.ajaxType = "authEn";

					if(data.noAuthType == 'ip')
					{
						data.noAuthData = data.noAuthIp;
					}
					else if(data.noAuthType == 'org'){
						data.noAuthData = data.orgData;
					}else{
						data.noAuthData = '';
					}
                    key = Serialize.queryJsonToStr(data);
                    urls += "formWebAuthGlobalConfig";
                    break;
                case 'remoteAuth':
                    data.enabled = vals;
                    data.authType = "remoteAuth";
                    data.ajaxType = "authEn";
					if(data.noAuthType == 'ip')
					{
						data.noAuthData = data.noAuthIp;
					}
					else if(data.noAuthType == 'org'){
						data.noAuthData = data.orgData;
					}else{
						data.noAuthData = '';
					}
                    key = Serialize.queryJsonToStr(data);
                    urls += "formWebAuthGlobalConfig";
                    break;
                case 'noAuth':
                    data.noAuthEn = vals;
                    data.enabled = (data.lively == 1 ? "on" : "off");
					if(data.noAuthType == 'ip')
					{
						data.noAuthData = data.noAuthIp;
					}
					else if(data.noAuthType == 'org'){
						data.noAuthData = data.orgData;
					}else{
						data.noAuthData = '';
					}
                    key = Serialize.queryJsonToStr(data);
                    urls += "formWebAuthGlobalConfig";
                    break;
                default:
                    break;
            }
            $.ajax({
                url: "/goform/" + urls,
                type: 'POST',
                data: key,
                success: function(result) {
                    var doEval = require('Eval');
                    var codeStr = result,
                        variableArr = ['status', 'errMsg', 'errorstr'],
                        result = doEval.doEval(codeStr, variableArr),
                        isSuccess = result["isSuccessful"];
                    // 判断代码字符串执行是否成功
                    if (isSuccess) {

                        var data = result["data"],
                            status = data['status'];
                        if (status) {
                            Tips.showSuccess(T('saveSuccess'), 2);
                            display($('#1'));
                        } else {
                            if (undefined == data["errorstr"]) {
                                var errorstr = data["errMsg"];
                            } else {
                                var errorstr = data["errorstr"];
                            }
                            Tips.showWarning(errorstr, 2);
                            display($('#1'));
                        }

                    } else {
                        Tips.showWarning(T('parseStrErr'), 2);
                    }

                }
            });


        });

        Translate.translate([$dom], dicArr);
        return $dom;

    }



    function display($container) {
        getWebAuthconf($container);
    }
    // 提供对外接口
    module.exports = {
        display: display
    };
});
