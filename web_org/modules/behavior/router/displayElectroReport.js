define(function(require, exports, module) {
    // 存储本页面一些变量
    var Translate = require('Translate');
    var dicArr = ['common', 'doElectroReport'];

    function T(_str) {
        return Translate.getValue(_str, dicArr);
    }
    var DATA = {};
    DATA['ipStr'] = "";
    DATA['checkIdStr'] = "";
    DATA['applyTypeStr'] = "";
    DATA['ipStrOld'] = '';
    DATA['checkIdStrOld'] = "";
    DATA['applyTypeStrOld'] = "";
    // 本模块依赖于 jquery 模块
    require('jquery');
    //var applyuser;
    function addInputGroup($con, isOpen, rulename, remarks, effecttime, NoticePageName, ElectroReportPageName) {

        var applyuser = '';
		if(DATA['applyTypeStr'] == 'all')
		{
			applyuser = T('alluser');
		}
		else if(DATA['applyTypeStr'] == 'org')
		{
			applyuser = DATA['orgNames'];
		}
		else{
			applyuser = DATA['ipStr'];
		}
		var arrTime = DATA["timeRangeNames"] || [];
        var modeInputJsonTime = [{name:T('allday'),value:''}];
        arrTime.forEach(function(item, index) {
            var obj = {
                "value": item,
                "name": item
            };
            modeInputJsonTime.push(obj);
        });
        var modeInputJson = [];
        NoticePageName.forEach(function(item, index) {
            if(DATA.NoticePageType[index].indexOf("ElectroReport") == -1){
                return;
            }
            var obj = {
                "value": item,
                "name": T(item)?T(item):item,
                "isChecked": 'true'
            };
            modeInputJson.push(obj);
        });


        var inputList = [{
            "necessary": true,
            "prevWord": '{rulename}',
            "inputData": {
                "type": 'text',
                "name": 'rulename',
                "value": rulename || '',
		"checkDemoFunc":["checkInput","name","1","31",'2']

            },
            "afterWord": ''
        }, {
            "prevWord": '{status}',
            "inputData": {
                "type": 'radio',
                "name": 'status',
                "defaultValue": isOpen == 1 ? 'on' : 'off',
                "items": [{
                    "value": 'on',
                    "name": '{open}'
                }, {
                    "value": 'off',
                    "name": '{close}'
                }]
            },
            "afterWord": ''
        }, {
            "necessary": false,
            "prevWord": '{remark}',
            "inputData": {
                "type": 'text',
                "name": 'remarks',
                "value": remarks || '',
		"checkDemoFunc":["checkInput","name","0","31",'2']

            },
            "afterWord": ''
        }, {
            "disabled":true,
            "prevWord": '{ElectroReportPageName}',
            "inputData": {
                "defaultValue": ElectroReportPageName || '',
                "type": 'text',
                "name": 'ElectroReportPageName',
                "value": ElectroReportPageName,
            },
            "afterWord": ''
        }, {
            "necessary": true,
			"prevWord": '{ApplyUser}',
            "inputData": {
                "type": 'text',
                "name": 'applyUser',
                "value": applyuser || '',

            },
            "afterWord": ''
        }, {
            "prevWord": '{EffectTime}',
            "inputData": {
                //"defaultValue": data.authSuccessPage||'',
                "type": 'select',
                "name": 'effecttime',
                "defaultValue": effecttime,
                "items": modeInputJsonTime
            },
            "afterWord": ''
        }];
        // 获得输入框组的html
        var InputGroup = require('InputGroup'),
            $dom = InputGroup.getDom(inputList);

        var $timeSelect = $dom.find('[name="effecttime"]');
        var linkList = [{
            id: 'addTimePlan',
            name: '{add}',
            clickFunc: function($btn) {

                //给小链接绑定时间计划的新增功能
                require('P_plugin/TimePlan').addModal($timeSelect);
            }
        }, {
            id: 'editTimePlan',
            name: '{edit}',
            clickFunc: function($btn) {

                //给小链接绑定时间计划的修改功能
                require('P_plugin/TimePlan').editModal($timeSelect);
            }
        }];
        InputGroup.insertLink($dom, 'effecttime', linkList);



        var linkdatas = [{
            id: 'edipage',
            name: '{edit}',
            clickFunc: function($btn) {
                var $demo = $('<input type="hidden" value="DefaultElectroReportPage" />');
                require('P_plugin/NotePage').editModal($demo);
            }
        }];

        InputGroup.insertLink($dom, 'ElectroReportPageName', linkdatas);


        var btnList = [{
            "id": 'save',
            "name": '{save}',
            "clickFunc": function($this) {

                saveClick($con);
            }
        }, {
            "id": 'reset',
            "name": '{reset}',
            clickFunc:function(){
            	$('#u-dr-reset').trigger('click');
            }
        }];
        var BtnGroup = require('BtnGroup');
        var btnHTML = BtnGroup.getDom(btnList).addClass('u-btn-group');
        $con.empty().append($dom, btnHTML);

        //输入框绑定事件
		$con.append('<button type="button" class="u-hide" id="u-dr-reset"></button>');
		$('#u-dr-reset').click(function() {
			DATA['checkIdStr'] = DATA['checkIdStrOld'];
            DATA['ipStr'] = DATA['ipStrOld'];
            DATA['applyTypeStr'] = DATA['applyTypeStrOld'];
		});


        $('[name="applyUser"]').click(function() {
            var datass = {
                //保存回调
                saveClick: function(saveData) {
                    DATA['applyTypeStr'] = saveData.applyTypeStr;
					if (saveData.applyTypeStr == "ip"){
							$dom.find('[name="applyUser"]').val(saveData.ipStr);
                            DATA['ipStr'] = saveData.ipStr;
						}
						else if (saveData.applyTypeStr == "org"){
							$dom.find('[name="applyUser"]').val(saveData.showName);
                            DATA['checkIdStr'] = saveData.checkIdStr;
						}
						else{
							$dom.find('[name="applyUser"]').val(T('alluser'));
						}
                    saveData.close();
                },
                checkableStr: DATA['checkIdStr'], //被勾选的id字符串
                ipStr: DATA['ipStr'], //开始结束的ip
                applyTypeStr: DATA['applyTypeStr'] //单选默认值

            };
            require('P_plugin/Organization').display(datass);
        });
        Translate.translate([$dom, btnHTML], dicArr);


    }

    function saveClick($con) {

        var Serialize = require('Serialize');
        var queryArrs = Serialize.getQueryArrs($con);
        var Tips = require('Tips');
        //console.dir(queryArrs);
        /*
        			var isOpen = $con.find('input[name="DMZEnable"]:checked').attr('value');
        			var	GlobalDMZ = $con.find('input[name="GlobalDMZ"]').val();
        			var	WAN1DMZ = $con.find('input[name="WAN1DMZ"]').val();
        			var	WAN2DMZ = $con.find('input[name="WAN2DMZ"]').val();
        			var	WAN3DMZ = $con.find('input[name="WAN3DMZ"]').val();
        			var	WAN4DMZ = $con.find('input[name="WAN4DMZ"]').val();
        */
        var keys = [
            ['rulename', 'rulename'],
            ['status', 'enabled'],
            ['remarks', 'remarks']
        ];
        var newArrs = Serialize.changeKeyInQueryArrs(queryArrs, keys);
        //console.log(newArrs);

        var queryJson = Serialize.queryArrsToJson(newArrs);

        if(queryJson.ElectroReportPageName == T(DATA.ElectroReportPageName)){
            queryJson.ElectroReportPageName = DATA.ElectroReportPageName;
        }

        var queryStr1 = Serialize.queryJsonToStr(queryJson);

        var queryStr2 = Serialize.queryJsonToStr(DATA['demodata']);
        var queryStr = queryStr1 + queryStr2 + '&checkIdStr=' + DATA['checkIdStr'] + '&ipStr=' + DATA['ipStr'] + '&applyTypeStr=' + DATA['applyTypeStr'];
        if (DATA['applyTypeStr'] == 'ip') {
            var queryStr = queryStr1 + queryStr2 + '&data=' + DATA['ipStr'] + '&applyTypeStr=' + DATA['applyTypeStr'];
        } else {
            var queryStr = queryStr1 + queryStr2 + '&data=' + DATA['checkIdStr'] + '&applyTypeStr=' + DATA['applyTypeStr'];
        }
        //console.log(DATA['checkIdStr'] + DATA['ipStr'] + DATA['applyTypeStr']);
        //console.log(queryStr);

		var InputGroup = require('InputGroup');
		var len = InputGroup.checkErr($con);
		if (len > 0) {
			return;
		}


        $.ajax({
            url: '/goform/formConfigNoticeConfig',
            type: 'POST',
            data: queryStr,
            success: function(result) {
                //console.log(result);
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['status', 'isSuccessful', 'errMsg'],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];

                // 判断代码字符串执行是否成功

                if (isSuccess) {
                    var data = result["data"],
                        status = data["status"];
                    if (status == 1) {
                        Tips.showSuccess(T('saveSuccess'), 2);
			display($('#1'));
                    } else {
                        Tips.showWarning(data["errMsg"], 2);
                    }
                } else {
                    Tips.showWarning(T('parseStrErr'), 2);
                }
            }
        });


    }


    function displayNoticeSet($container) {
        $.ajax({
            url: 'common.asp?optType=Electro|timePlan',
            type: 'GET',
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['rulename', 'lively', 'remarks', 'effecttime', 'timeRangeNames', 'orgType', 'orgIp', 'orgData', 'orgNames',
                        /*通告*/
                        'NoticePageName', 'ElectroReportPageName', 'NoticePageType'
                    ],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                //判断代码字符串执行是否成功
                if (isSuccess) {
                    var data = result["data"],
                        rulename = data["rulename"],
                        remarks = data["remarks"],
                        effecttime = data["effecttime"],
                        isOpen = data["lively"],
                        ElectroReportPageName = data["ElectroReportPageName"],
                        NoticePageName = data["NoticePageName"];
                        console.log(ElectroReportPageName);
                    if(ElectroReportPageName == ''){
                        var modeInputJson = [];
                        NoticePageName.forEach(function(item, index) {
                            if(data['NoticePageType'][index].indexOf("ElectroReport") == -1){
                                return;
                            }
                            ElectroReportPageName = T(item)?T(item):item;
                            DATA.ElectroReportPageName = item;

                        });
                    } else {
                        DATA.ElectroReportPageName = ElectroReportPageName;
                        ElectroReportPageName = T(ElectroReportPageName)?T(ElectroReportPageName):ElectroReportPageName;
                    }
                    console.log(ElectroReportPageName);
                    //console.log(data);
                    DATA['timeRangeNames'] = data["timeRangeNames"];
                    DATA['applyTypeStr'] = data['orgType'];
                    DATA['applyTypeStrOld'] = data['orgType'];
                    DATA['NoticePageType'] = data['NoticePageType'];
                    //console.log(DATA);
                    if (data['orgType'] == 'org') {
                        DATA['checkIdStr'] = data['orgData'];
                        DATA['checkIdStrOld'] = data['orgData'];
                        DATA['orgNames'] = data['orgNames'];
                    } else if (data['orgType'] == 'ip') {
                        DATA['ipStr'] = data['orgIp'];
                        DATA['ipStrOld'] = data['orgIp'];
                    }
                    //console.log(data['orgType']);
                    addInputGroup($('#1'), isOpen, rulename, remarks, effecttime, NoticePageName, ElectroReportPageName);
                } else {
                    alert('失败');
                }
            }
        });
    }
    //通告页面修改
    function noticepageEdit() {
        //获取数据
        var data = DATA['demodata'];
        //console.log(data);
        var config = {
            id: 'noticepageEditModal',
            title: '{editnoticepage}',
            data: data
        };
        makeNoticepageModal(config);
    }
    //通告页面新增
    function noticepageAdd() {
        var config = {
            id: 'noticepageAddModal',
            title: '{addnoticepage}'
        };
        makeNoticepageModal(config);
    }
    //制作弹框
    function makeNoticepageModal(config) {
        var modallist = {
            id: config.id || '',
            title: config.title || '',
            btns: [{
                type: 'save',
                clickFunc: function($this) {
                    var $modal = $this.parents('.modal');
                    var Serialize = require('Serialize');
                    var queryArrs = Serialize.getQueryArrs($modal);
                    var newArrs = Serialize.queryArrsToJson(queryArrs);

                    DATA['demodata'] = newArrs;
                    //console.log(DATA);
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

        var inputlist = [{
            "prevWord": '{pagename}',
            "necessary": true,
            "inputData": {
                "type": 'text',
                "name": 'pageName',
                "value": data.pageName || ''
            },
            "afterWord": ''
        }, {
            "prevWord": '{remark}',
            "inputData": {
                "type": 'text',
                "name": 'note',
                "value": data.note || ''
            },
            "afterWord": ''
        }, {
            "prevWord": '{noticetitle}',
            "inputData": {
                "type": 'text',
                "name": 'noticeTitle',
                "value": data.noticeTitle || ''
            },
            "afterWord": ''
        }, {
            "prevWord": '{jumpURL}',
            "inputData": {
                "type": 'text',
                "name": 'jumpURL',
                "value": data.jumpURL || ''
            },
            "afterWord": ''
        }, {
            "prevWord": '{jumptime}',
            "inputData": {
                "type": 'text',
                "name": 'jumpTime',
                "value": data.jumpTime || ''
            },
            "afterWord": '{jumptips}'
        }, {
            "prevWord": '{noticecontent}',
            "inputData": {
                "type": 'text',
                "name": 'noticecontent',
                "value": data.noticecontent || ''
            },
            "afterWord": ''
        }];
        var IG = require('InputGroup');
        var $dom = IG.getDom(inputlist);

        //添加小链接


        modalObj.insert($dom);
        var $modal = modalObj.getDom();
        modalObj.show();
        Translate.translate([$modal], dicArr);
    }




    function display($container) {
        // 清空标签页容器
        $container.empty();
        displayNoticeSet($container);

    }
    // 提供对外接口
    module.exports = {
        display: display
    };
});
