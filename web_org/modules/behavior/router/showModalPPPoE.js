define(function(require, exports, module) {
    require('jquery');
    var DATA = {};
    var Translate = require('Translate');
    var dicArr = ['common', 'doUserAuthentication'];

    function T(_str) {
        return Translate.getValue(_str, dicArr);
    }

    function setModalDom(data) {

        var ml = {
            id: 'pppoeConfig',
            title: T('ppg_pppoeAuth'),
            "btns": [{
                "type": 'save',
                "clickFunc": function($this) {
                    var $modal = $('#pppoeConfig');
                    addSubmitClick($modal);
                }
            }, {
                "type": 'reset'
            }, {
                "type": 'close'
            }]
        };
        var Modal = require('Modal');
        var modalObj = Modal.getModalObj(ml);

        var modeInputJson = [];
        var obj = {
            "value": "",
            "name": "{no}",
            "isChecked": 'true'
        };
        modeInputJson.push(obj);
        data.addrGroupName.forEach(function(item, index) {

            var obj = {
                "value": item,
                "name": item,
                "isChecked": 'true'
            };
            modeInputJson.push(obj);
        });
        console.log(modeInputJson);
        var modePageJson = [];

        data.NoticePageName.forEach(function(item, index) {
            if(data.NoticePageType[index].indexOf("PPPoEPage") == -1){
                return;
            }
            var obj = {
                "value": item,
                "name": T(item)?T(item):item,
                "isChecked": 'true'
            };
            modePageJson.push(obj);
        });
        var il = [{
                "prevWord": '{ppg_pppoeSet}',
                "inputData": {
                    "type": 'radio',
                    "name": 'PPPoEOnly',
                    "defaultValue": data.PPPoEOnly || '0',
                    "items": [{
                        name: '{com_startUse}',
                        "value": '1'
                    }, {
                        name: '{com_forbidden}',
                        "value": '0'
                    }]
                },
                "afterWord": ''
            }, {
                "prevWord": '{ppg_except}',
                "inputData": {
                    "type": 'select',
                    "name": 'exceptIpGroup',
                    "defaultValue": data.exceptIpGroup,
                    "items": modeInputJson
                },
                "afterWord": ''
            }, {
                "necessary": true,
                "prevWord": '{com_startIP}',
                "inputData": {
                    "type": 'text',
                    "name": 'pppoeStart',
                    "value": data.pppoeStart || '',
                    "checkDemoFunc": ['checkInput','ip','1', '1'],
                },
                "afterWord": ''
            }, {
                "display":data.showIpcount=="yes" ? true:false,
                "necessary": true,
                "prevWord": '{ppp_ipcounts}',
                "inputData": {
                    "type": 'text',
                    "name": 'ipcount',
                    "value": data.ipcount || '',
                    "checkDemoFunc": ['checkNum', '1', '65535']
                },
                "afterWord": ''
            }, {
                "necessary": true,
                "prevWord": '{mainDNSAddr}',
                "inputData": {
                    "type": 'text',
                    "name": 'pppoePriDns',
                    "value": data.pppoePriDns || '',
                    "checkFuncs": ['checkMainDns'],
                },
                "afterWord": ''
            }, {
                "prevWord": '{secDNSAddr}',
                "inputData": {
                    "type": 'text',
                    "name": 'pppoeSecDns',
                    "value": data.pppoeSecDns || '',
                    "checkFuncs": ['checkSecDns'],
                },
                "afterWord": ''
            }, {
                "prevWord": '{com_checkPasswd}',
                "inputData": {
                    "defaultValue": data.vailtype || 'auto',
                    "type": 'select',
                    "name": 'vailtype',
                    "items": [{
                            "value": 'EITHER',
                            "name": 'Auto',
                        }, {
                            "value": 'PAP',
                            "name": 'PAP',
                        }, {
                            "value": 'CHAP',
                            "name": 'CHAP',
                        }

                    ]
                },
                "afterWord": ''
            }, {
                "necessary": true,
                "prevWord": '{ppg_session}',
                "inputData": {
                    "type": 'text',
                    "name": 'smaxconv',
                    "value": data.smaxconv || '',
                    "checkDemoFunc": ['checkNum', '1', data.maxconv]
                },
                "afterWord": ''
            }, {
                "prevWord": '{ppg_pwdMod}',
                "inputData": {
                    "type": 'checkbox',
                    "name": 'selfHelpEnable',
                    "defaultValue": data.selfHelpEnable || 'on',
                    "items": [{
                        "value": 'on',
                        'checkOn': 'on',
                        'checkOff': 'off'
                    }]
                },
                "afterWord": ''
            }, {
                "prevWord": '{NoticeIDTimeout}',
                "inputData": {
                    "type": 'radio',
                    "name": 'PppoeNoticeEnable',
                    "defaultValue": data.PppoeNoticeEnable || '0',
                    "items": [{
                        name: '{open}',
                        "value": '1',
                        control: 'ok'
                    }, {
                        name: '{close}',
                        "value": '0',
                        control: 'no'
                    }]
                },
                "afterWord": ''
            }, {
                "sign": 'ok',
                "necessary": true,
                "prevWord": '{NoticeDayTimeout}',
                "inputData": {
                    "type": 'text',
                    "name": 'remainDays',
                    "value": data.remainDays || '',
                    "checkDemoFunc": ['checkNum', '0', '65535']
                },
                "afterWord": '{day}'
            }, {
                "sign": 'ok',
                "disabled":true,
                "prevWord": '{NoticePage}',
                "inputData": {
                    "type": 'text',
                    "name": 'PPPoENoticePageName',
                    "value": data.PPPoENoticePageName || 'no'
                },
                "afterWord": ''
            }

        ];
        var IG = require('InputGroup');
        var $idom = IG.getDom(il);
        var ll = [{
            id: 'edipage',
            name: '{edit}',
            clickFunc: function($btn) {
                var SRLZ = require('Serialize');
                var strArr = SRLZ.getQueryArrs($btn),
                    queryJson = SRLZ.queryArrsToJson(strArr);
                if(queryJson.PPPoENoticePageName == T(DATA.PPPoENoticePageName)){
                    queryJson.PPPoENoticePageName = DATA.PPPoENoticePageName;
                }

                var $demo = $('<input type="hidden" value="DefaultPppoeNoticePage" />');
                require('P_plugin/NotePage').editModal($demo);
            }
        }];
        IG.insertLink($idom, 'PPPoENoticePageName', ll);
        Translate.translate([$idom, modalObj.getDom()], dicArr);

        //绑定交互
        makeThePPPoEOnlyChange();
        $idom.find('[name="PPPoEOnly"]').change(function() {
            makeThePPPoEOnlyChange();
        });

        function makeThePPPoEOnlyChange() {
            var ppchoose = $idom.find('[name="PPPoEOnly"]:checked').val();
            if (ppchoose == '1') {
                $idom.find('[name="exceptIpGroup"]').removeAttr('disabled');

            } else {
                $idom.find('[name="exceptIpGroup"]').attr('disabled', 'disabled');
            }
        }
        modalObj.insert($idom);
        modalObj.show();

    }
    /*
     * - 通告页面 -- 二级弹框
     */
    //修改
    function pppoeEditClick($modal) {
        //获取数据
        var newdata = {};
        var SRLZ = require('Serialize');

        var strArr = SRLZ.getQueryArrs($modal),
            queryJson = SRLZ.queryArrsToJson(strArr);

        DATA.data.NoticePageName.forEach(function(item, index) {
            if (item == queryJson.PPPoENoticePageName) {
                DATA.data.index = index;
            }
        });

        DATA.data.Action = "modify";
        newdata = DATA.data;

        //编辑的配置
        var config = {
            title: '{editNoticePage}',
            id: 'pppoeCallEditModal',
            data: newdata
        };
        //执行制作认证页小弹框方法
        makeCallModal(config);

    }
    //新增
    function pppoeAddClick() {
        //新增的配置
        var config = {
            title: '{addNoticePage}',
            id: 'pppoeCallAddModal'
        };
        DATA.data.Action = "add";
        //执行制作认证页小弹框方法
        makeCallModal(config);
    }

    function addSubmitClick($modal) {
        var Tips = require('Tips');
        var Serialize = require('Serialize');
        var queryArr = Serialize.getQueryArrs($modal),
            queryJson = Serialize.queryArrsToJson(queryArr),
            queryStr = Serialize.queryArrsToStr(queryArr);
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
       //     Tips.showError('{saveFail}', 3);
            //tips.showError('不能添加静态路由！',3);
            return;
        }
        $modal.find('input,textarea').each(function() {
            if (!$(this).is(':hidden')) {
                $(this).blur();
            }
        });

        if(queryJson.PPPoENoticePageName == T(DATA.PPPoENoticePageName)){
            queryJson.PPPoENoticePageName = DATA.PPPoENoticePageName;
        }

        queryStr = Serialize.queryJsonToStr(queryJson);

        var PPPoEVal = "lanPPPoETypew=" + $('#1').find('[name="PPPoEAuth"]:checked').val();
        queryStr = Serialize.mergeQueryStr([queryStr, PPPoEVal]);



        var errors = $modal.find('input-error').length;
        if (errors > 0) {
            $target.blur();
            return false;
        }
        $.ajax({
            url: '/goform/forPppoeServGlobale',
            type: 'POST',
            data: queryStr,
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['status', 'errorstr'],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                if (isSuccess) {
                    var data = result["data"],
                        status = data['status'];
                    if (status) {
                        Tips.showSuccess('{saveSuccess}', 2);
                        $modal.modal('hide');
                        setTimeout(function() {
                            $modal.remove();
                        }, 450);
                        $('[href="#1"]').trigger('click');
                    } else {
                        var errorStr = data['errorstr'];
                        Tips.showWarning('{saveFail}' + errorStr, 2);
                    }
                } else {
                    Tips.showWarning('{parseStrErr}', 2);
                }
            }
        });

    }


    function makeCallModal(config) {
        var modallist = {
            id: config.id || '',
            title: config.title || '',
            btns: [{
                type: 'save',
                clickFunc: function($this) {
                    var $modal = $this.parents('.modal');
                    saveNoticePageConfig($modal);
                }
            }, {
                'id': 'preview',
                'name': '{preview}',
                'clickFunc': function($btn) {
                    alert('预览');
                }
            }, {
                "type": 'reset'
            }, {
                "type": 'close'
            }]

        };
        var Modal = require('Modal');
        var modalObj = Modal.getModalObj(modallist);

        var data = config.data || {};
        var index = data.index;
        if (typeof(index) != "undefined") {
            NoticePageName = data.NoticePageName[index];
            NoticePageNote = data.NoticePageNote[index];
            NoticePageTitle = data.NoticePageTitle[index];
            SkipUrl = data.SkipUrl[index];
            SkipTime = data.SkipTime[index];
            NoticeBody = data.NoticeBody[index];
        } else {
            NoticePageName = "";
            NoticePageNote = "";
            NoticePageTitle = "";
            SkipUrl = "";
            SkipTime = "";
            NoticeBody = "";
        }
        var inputlist = [{
                "necessary": true,
                "prevWord": '{pageName}',
                "inputData": {
                    "type": 'text',
                    "name": 'NoticePageName',
                    "value": NoticePageName || '',
                    "checkFuncs": ['re_checkName'],
                },
                "afterWord": ''
            }, {
                "prevWord": '{Note}',
                "inputData": {
                    "type": 'text',
                    "name": 'NoticePageNote',
                    "value": NoticePageNote || '',
                },
                "afterWord": ''
            }, {
                "prevWord": '{NoticeTitle}',
                "inputData": {
                    "type": 'text',
                    "name": 'NoticePageTitle',
                    "value": NoticePageTitle || '',
                },
                "afterWord": ''
            }, {
                "prevWord": '{jumpUrl}',
                "inputData": {
                    "type": 'text',
                    "name": 'SkipUrl',
                    "value": SkipUrl || '',
                },
                "afterWord": ''
            }, {
                "prevWord": '{jumpTime}',
                "inputData": {
                    "type": 'text',
                    "name": 'SkipTime',
                    "value": SkipTime || '',
                    "checkDemoFunc": ['checkNum', '0', '128', 'NoticePage']
                },
                "afterWord": 's  {nullNotJump}'
            }, {
                "prevWord": '{jumpBody}',
                "inputData": {
                    "type": 'textarea',
                    "name": 'NoticeBody',
                    "value": NoticeBody || '',
                },
            }

        ];
        var IG = require('InputGroup');
        var $dom = IG.getDom(inputlist);
        //调整布局
        $dom.find('textarea').css({
            width: '309px',
            height: '44px',
            resize: 'none'
        }).parent().attr('colspan', '2');
        modalObj.insert($dom);
        modalObj.show();


    }

    function saveNoticePageConfig($modal) {
        var Tips = require('Tips');
        var SRLZ = require('Serialize');
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            Tips.showError('{saveFail}', 3);
            //tips.showError('不能添加静态路由！',3);
            return;
        }

        var strArr = SRLZ.getQueryArrs($modal),
            queryJson = SRLZ.queryArrsToJson(strArr);

        queryJson.Action = DATA.data.Action;

        if (queryJson.SkipTime == "") {
            queryJson.SkipTime = 65535;
        }

        var strArr = SRLZ.queryJsonToStr(queryJson);

        $.ajax({
            url: "/goform/saveNoticePageConfig",
            type: 'POST',
            data: strArr,
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['status', 'errorstr'],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                // 判断代码字符串执行是否成功
                if (isSuccess) {

                    var data = result["data"],
                        status = data['status'];
                    if (status) {
                        Tips.showSuccess('{saveSuccess}', 2);
                        saveData.close();
                        display($('#1'));
                    } else {
                        Tips.showWarning(data["saveFail"], 2);
                    }
                } else {
                    Tips.showWarning('{parseStrErr}', 2);
                }
            }
        });
    }


    function display() {
        //ajax获取数据，获取成功执行生产弹框方法
        var data = {};
        $.ajax({
            url: 'common.asp?optType=PppoeGlobal',
            type: 'GET',
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = [
                        /*需要获取的数据*/
                        'pppoeStart',
                        'showIpcount',
                        'ipcount',
                        'pppoePriDns',
                        'pppoeSecDns',
                        'vailtype',
                        'smaxconv',
                        'maxconv',
                        'selfHelpEnable',
                        'PPPoEOnly',
                        'addrGroupName',
                        'exceptIpGroup',
                        'PppoeNoticeEnable',
                        'PPPoENoticePageName',
                        'remainDays',

                        /*通告*/
                        'NoticePageName',
                        'NoticePageNote',
                        'NoticePageTitle',
                        'SkipUrl',
                        'SkipTime',
                        'NoticeBody',
                        'NoticePageType',
                    ];
                result = doEval.doEval(codeStr, variableArr);
                var isSuccess = result["isSuccessful"];
                if (isSuccess) {
                    var data = result["data"];
                    var NoticePageSet = '';
                    data.NoticePageName.forEach(function(item, index) {
                        if(data.NoticePageType[index].indexOf("PPPoEPage") == -1){
                            return;
                        }
                        DATA.PPPoENoticePageName = item;
                        NoticePageSet = T(item)?T(item):item;
                    });
                    if(data.PPPoENoticePageName == ""){
                        data.PPPoENoticePageName = NoticePageSet;
                    } else {
                        DATA.PPPoENoticePageName = data.PPPoENoticePageName;
                        data.PPPoENoticePageName = T(data.PPPoENoticePageName)?T(data.PPPoENoticePageName):data.PPPoENoticePageName;
                    }
                    console.log(data);
                    DATA.data = data;
                    setModalDom(data);
                } else {
                    alert('失败');
                }
            }
        });
    }
    // 提供对外接口
    module.exports = {
        display: display
    };
});
