/**
 * 通告页面配置组件（修改、新增）
 * by QC
 *
 */
define(function(require, exports, module) {
    require('jquery');

    var Translate = require('Translate');
    var dicArr = ['common', 'doUserAuthentication'];

    function T(_str) {
        return Translate.getValue(_str, dicArr);
    }

    var DATA = {};

    /**
     * 新增时间计划
     */
    function addModal($select, PageType) {
        DATA.NoticePageType = PageType;
        var dics = ['doUserAuthentication'];
        Translate.preLoadDics(dics, function() {
            makeModal('add', $select);
        });
    }

    /**
     * 编辑时间计划
     */
    function editModal($select, pageName) {
        var dics = ['doUserAuthentication'];
        Translate.preLoadDics(dics, function() {
            if ($select.val() !== '' && pageName !== '') {
                makeModal('edit', $select, pageName);
            }
        });
    }

    /**
     * 弹框制作入口
     */
    function makeModal(type, $select, name) {
        var Tips = require('Tips');
        var thisName = '';
        if (name === undefined) {
            thisName = $select.val();
        } else {
            thisName = name;
        }
        DATA['select'] = $select;

        var modalObj = showModal($select, type);
        $.ajax({
            url: 'common.asp?optType=PppoeGlobal',
            type: 'GET',
            success: function(result) {
                // 将后台数据处理为数据表格式的数据
                processData(result);
                //匹配数据 生成输入组
                var $input = '';
                if (type == 'edit') {
                    var thisdata = DATA['database'].getSelect({
                        NoticePageName: thisName
                    });
                    $input = getInputDom(thisdata, type);
                } else {
                    $input = getInputDom({}, type);
                }
                modalObj.insert($input);
                modalObj.show();
                var Translate = require('Translate');
                Translate.translate([modalObj.getDom()], dicArr);
            }
        });

    }

    /**
     * 生成弹框
     */
    function showModal($select, type) {
        var modalList = {
            "id": (type == 'add' ? 'notepageAdd_Modal' : 'notepageEdit_Modal'),
            "title": (type == 'add' ? T('addNoticePage') : T('editNoticePage')),
            "size": "large", //normal、large :普通宽度、加大宽度
            "btns": [{
                "type": 'save',
                "clickFunc": function($this) {
                    // $this 代表这个按钮的jQuery对象，一般不会用到
                    var $modal = $this.parents('.modal');
                    addNotePage($modal, $select, type);
                }
            }, {
                'id': 'preview',
                'name': '{preview}',
                'clickFunc': function($btn) {
					var $modal = $btn.parents('.modal');
					
					require('Tips').showConfirm(T('previewSave'),function(){
					
						var sc = require('P_core/CookieUtil');
						var SRLZ = require('Serialize');
	
						var strArr = SRLZ.getQueryArrs($modal),
						queryJson = SRLZ.queryArrsToJson(strArr);
						
						if(queryJson.NoticePageName == T('DefaultElectroReportPage')){
							queryJson.NoticePageName = 'DefaultElectroReportPage';
						}else if(queryJson.NoticePageName == T('DefaultPppoeNoticePage')){
							queryJson.NoticePageName = 'DefaultPppoeNoticePage';
						}else if(queryJson.NoticePageName == T('DefaultDomainFilterPage')){
							queryJson.NoticePageName = 'DefaultDomainFilterPage';
						}
	
						sc.set('previewPageName', queryJson.NoticePageName);
	
						var jumpUrl = "/noAuth/info_page.html?type=preview";
						
						/*
						if(DATA.NoticePageType.indexOf("DomainPage") >= 0){
							jumpUrl += "DomainFilter";
						} else if(DATA.NoticePageType.indexOf("ElectroReport") >= 0){
							jumpUrl += "Notice";
						} else if(DATA.NoticePageType.indexOf("PPPoEPage") >= 0){
							jumpUrl += "PPPoE";
						} else {
							return;
						}
						*/
						window.open(jumpUrl);
					});
                }
            }, {
                "type": 'reset'
            }, {
                "type": 'close'
            }]
        };

        // 初始化模态框，并获得模态框类实例
        var Modal = require('Modal');
        var modalObj = Modal.getModalObj(modalList);
        DATA['modalObj'] = modalObj;
        return modalObj;

    }

    /**
     * 数据处理
     */
    function processData(restr) {
        // 加载Eval模块
        var doEval = require('Eval');
        var Tips = require('Tips');
        var codeStr = restr,

            // 定义需要获得的变量
            variableArr = [
                'NoticePageName',
                'NoticePageNote',
                'NoticePageTitle',
                'SkipUrl',
                'NoticeSkipUrlType',
                'SkipTime',
                'NoticeBody',
                'NoticePageType'
            ];

        // 获得js字符串执行后的结果
        var result = doEval.doEval(codeStr, variableArr),
            isSuccess = result["isSuccessful"];
        // 判断代码字符串执行是否成功
        if (isSuccess) {
            // 获得所有的变量
            var data = result["data"];
            // 存入数据库
            var dataArr = []; // 将要插入数据表中的数据
            data.NoticePageName.forEach(function(obj, i) {
                var innerArr = [];

                innerArr.push(obj);
                innerArr.push(data.NoticePageNote[i]);
                innerArr.push(data.NoticePageTitle[i]);
                innerArr.push(data.SkipUrl[i]);
                innerArr.push(data.NoticeSkipUrlType[i]);
                innerArr.push(data.SkipTime[i]);
                innerArr.push(data.NoticeBody[i]);
                innerArr.push(data.NoticePageType[i]);
                dataArr.push(innerArr);
            });
            //生成数据库
            var DB = require('Database');
            var database = DB.getDatabaseObj();
            database.addTitle(['NoticePageName', 'NoticePageNote', 'NoticePageTitle', 'SkipUrl', 'NoticeSkipUrlType', 'SkipTime', 'NoticeBody', 'NoticePageType']);
            database.addData(dataArr);
            DATA['database'] = database;
        } else {
            Tips.showError('{parseStrErr}', 3);
        }
    }


    /**
     * 生成内部输入框组
     */
    function getInputDom(getdata, type) {
        var data = getdata[0] || {};

		if(data.NoticePageName == 'DefaultElectroReportPage'){
            data.NoticePageName = T('DefaultElectroReportPage');
        }else if(data.NoticePageName == 'DefaultPppoeNoticePage'){
            data.NoticePageName = T('DefaultPppoeNoticePage');
        }else if(data.NoticePageName == 'DefaultDomainFilterPage'){
            data.NoticePageName = T('DefaultDomainFilterPage');
        }
        var NoticePageName = '',
            NoticePageNote = "",
            NoticePageTitle = "",
            SkipUrl = "",
            SkipTime = "",
            NoticeBody = "";
        if (type == 'edit') {
            NoticePageName = data.NoticePageName;
            NoticePageNote = data.NoticePageNote;
            NoticePageTitle = data.NoticePageTitle;
            DATA.NoticePageType = data.NoticePageType;
            SkipUrl = data.SkipUrl;
            if (data.NoticeSkipUrlType == 1) {
                SkipTime = data.SkipTime;
            }
            NoticeBody = data.NoticeBody;
        }

        var inputlist = [{
                "necessary": true,
                "prevWord": '{pageName}',
                "disabled": (type == 'edit' ? true : false),
                "inputData": {
                    "type": 'text',
                    "name": 'NoticePageName',
                    "value": NoticePageName,
                    "checkDemoFunc": ['checkInput', 'name', '1', '31', '3']
                },
                "afterWord": ''
            }, {
                "prevWord": '{Note}',
                "inputData": {
                    "type": 'text',
                    "name": 'NoticePageNote',
                    "value": NoticePageNote || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '31', '3']
                },
                "afterWord": ''
            }, {
                "prevWord": '{NoticeTitle}',
                "inputData": {
                    "type": 'text',
                    "name": 'NoticePageTitle',
                    "value": NoticePageTitle || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '64', '[\s\S]*']
                },
                "afterWord": ''
            }, {
                "prevWord": '{jumpUrl}',
                "inputData": {
                    "type": 'text',
                    "name": 'SkipUrl',
                    "value": SkipUrl || '',
                    "checkDemoFunc": ['checkInput', 'ip', '0', '5']
                },
                "afterWord": ''
            }, {
                "prevWord": '{jumpTime}',
                "inputData": {
                    "type": 'text',
                    "name": 'SkipTime',
                    "value": SkipTime || '',
                    "checkDemoFunc": ['checkInput', 'num', '0', '999']
                },
                "afterWord": 's  {nullNotJump}'
            }, {
                "prevWord": '{jumpBody}',
                "inputData": {
                    "type": 'textarea',
                    "name": 'NoticeBody',
                    "value": NoticeBody || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '900', '[\s\S]*']
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

        var Translate = require('Translate');
        var tranDomArr = [$dom];
        var dicArr = ['common', 'doUserAuthentication'];
        Translate.translate(tranDomArr, dicArr);

        return $dom;
    }


    /**
     * 修改或新增时间计划
     */
    function addNotePage($modal, $select, type) {
        var Tips = require('Tips');
        var SRLZ = require('Serialize');
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            //          Tips.showError('{saveFail}',3);
            //tips.showError('不能添加静态路由！',3);
            return;
        }

        var strArr = SRLZ.getQueryArrs($modal),
            queryJson = SRLZ.queryArrsToJson(strArr);

        queryJson.Action = type;

        if(queryJson.NoticePageName == T('DefaultElectroReportPage')){
            queryJson.NoticePageName = 'DefaultElectroReportPage';
        }else if(queryJson.NoticePageName == T('DefaultPppoeNoticePage')){
            queryJson.NoticePageName = 'DefaultPppoeNoticePage';
        }else if(queryJson.NoticePageName == T('DefaultDomainFilterPage')){
            queryJson.NoticePageName = 'DefaultDomainFilterPage';
        }

        if (queryJson.SkipTime == "") {
            // queryJson.SkipTime = 65535;
        }
        var temp = queryJson.NoticeBody;
        temp = temp.replace(/%/g, "%25");
        temp = temp.replace(/\&/g, "%26");
        queryJson.NoticeBody = temp.replace(/\+/g, "%2B");

        temp = queryJson.NoticePageTitle;
        temp = temp.replace(/%/g, "%25");
        temp = temp.replace(/\&/g, "%26");
        queryJson.NoticePageTitle = temp.replace(/\+/g, "%2B");
        queryJson.NoticePageType = DATA.NoticePageType;

        /*检测url是否含有http*/
        var reg1 = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
        var reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
        if (!reg.test(queryJson.SkipUrl) && (queryJson.SkipUrl != "")) {
            queryJson.SkipUrl = "http://" + queryJson.SkipUrl;
        }

        var strArr = SRLZ.queryJsonToStr(queryJson);
		
        $.ajax({
            url: "/goform/saveNoticePageConfig",
            type: 'POST',
            data: strArr,
            dataType: 'json',
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
                        DATA['modalObj'].hide();
                        if (type == 'add') {
                            $select.append('<option value="' + queryJson.NoticePageName + '" selected="selected">' + queryJson.NoticePageName + '</option>');
                        } else {
                            //$select.val(queryJson.NoticePageName);
                        }
                    } else {
                        Tips.showWarning(data["saveFail"], 2);
                    }
                } else {
                    Tips.showWarning('{parseStrErr}', 2);
                }
            }
        });
    }



    module.exports = {
        addModal: addModal,
        editModal: editModal
    };
});
