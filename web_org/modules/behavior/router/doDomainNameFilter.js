define(function(require, exports, module) {
    require('jquery');

	var DATA = new Array();

    var Translate = require('Translate');
    var dicArr = ['common', 'doDomainNameFilter'];
    var Tips = require('Tips');

    function T(_str) {
        return Translate.getValue(_str, dicArr);
    }
    exports.display = function() {
        var dics = ['doDomainNameFilter', 'doUserAuthentication', 'doTimePlan'];
        Translate.preLoadDics(dics, function() {
            var Path = require('Path');
            //获得认证配置页面

            // 加载路径导航
            var pathList = {
                "prevTitle": T('com_netAction'),
                "links": [{
                    "link": '#/behavior_management/domain_filter',
                    "title": T('dns_dnsFilter')
                }],
                "currentTitle": ''
            };
            Path.displayPath(pathList);
            // 加载标签页
            var Tabs = require('Tabs');
            var tabsList = [{
                "id": "1",
                "title": T('dns_dnsFilter')
            }];
            // 生成标签页，并放入页面中
            Tabs.displayTabs(tabsList);
            $('a[href="#1"]').click(function(event) {
                //				Path.changePath($(this).text());
                displayEdit();
            });
            $('a[href="#1"]').trigger('click');

        });
    }

    /**
     * 编辑页面入口
     */
    function displayEdit() {
        var $con = $('#1');
        $con.empty();
        // 向后台发送请求，获得表格数据

        $.ajax({
            url: 'common.asp?optType=domain_filter|timePlan|webServerConfig',
            type: 'GET',
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['DnsFilterName', //规则名称
                        'DnsFilterNote', //备注
                        'DnsFilterEnable', //开启
                        'orgType', //适用用户
                        'orgIp', //
                        'orgData', //
                        'orgNames',
                        'effecttime', //生效时间
                        'timeRangeNames', //显示时间组
                        'enableType', //动作
                        'terminalEnable', //终端接入提醒
                        'terminalRemind', //接入提醒方式
                        'domainRedirection', //重定向域名
                        'NoticePageChooseName', //通告名
                        'NoticePageName', //通告数组

                        'DnsLists', //域名列表
                        'NoticePageType',
						'httpsEnable', // Https是否打开
                    ];
                // 获得js字符串执行后的结果
                var result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                // 判断代码字符串执行是否成功
                if (isSuccess) {
                    // 获得所有的变量
                    var data = result["data"];
                    if(data.NoticePageChooseName == undefined || data.NoticePageChooseName == ""){
                        data.NoticePageName.forEach(function(obj, i) {
                            if(data.NoticePageType[i].indexOf("DomainPage") == -1){
                                return;
                            }
                            DATA.NoticePageChooseName = obj;
                            data.NoticePageChooseName = T(obj)?T(obj):obj;
                        });
                    } else {
                        DATA.NoticePageChooseName = data.NoticePageChooseName;
                        data.NoticePageChooseName = T(data.NoticePageChooseName)?T(data.NoticePageChooseName):data.NoticePageChooseName;
                    }

					DATA.httpsEnable = data.httpsEnable;
                    //var data = {};
                    var $input = getInputDom(data);
                    $con.empty().append($input);
                }
            }
        });

    }

    function getInputDom(data) {
        //去掉undefind
        function CU(something) {
            return data[something] === 'undefined' ? eval(something) : data[something];
        }
        var DnsFilterName = CU('DnsFilterName'), //规则名称
            DnsFilterNote = CU('DnsFilterNote'), //备注
            DnsFilterEnable = CU('DnsFilterEnable'), //开启
            orgType = CU('orgType'), //适用用户
            orgIp = CU('orgIp') || '0.0.0.0-0.0.0.0', //
            orgData = CU('orgData') || '', //
            orgShow = T('typeAll');


        switch (orgType) {
            case 'all':
                orgShow = T('typeAll');
                break;
            case 'org':
                orgShow = CU('orgNames');
                break;
            case 'ip':
                orgShow = orgIp;
                break;
            default:
                break;
        }

        var effecttime = CU('effecttime'), //生效时间
            timeRangeNames = CU('timeRangeNames'), //显示时间组
            enableType = CU('enableType'), //动作
            terminalEnable = CU('terminalEnable'), //终端接入提醒
            terminalRemind = CU('terminalRemind'), //接入提醒方式
            domainRedirection = CU('domainRedirection'), //重定向域名
            NoticePageChooseName = CU('NoticePageChooseName'), //通告名
            NoticePageName = CU('NoticePageName'), //通告数组
            NoticePageType = CU('NoticePageType');
            DnsLists = CU('DnsLists'); //域名列表

        var effecttimeItems = [{
            name: '{allDay}',
            value: ''
        }];
        timeRangeNames.forEach(function(obj, i) {
            effecttimeItems.push({
                name: obj,
                value: obj
            });
        });
        var DnsListsText = [];
        DnsLists[0].forEach(function(obj, i) {
            DnsListsText.push({
                name: obj,
                value: obj
            });
        });

        var NoticePageNameArr = [];
        NoticePageName.forEach(function(obj, i) {
            if(NoticePageType[i].indexOf("DomainPage") == -1){
                return;
            }
            NoticePageNameArr.push({
                name: T(obj)?T(obj):obj,
                value:  obj
            })
        });

        var inputList = [{
            "prevWord": '{status}',
            "inputData": {
                "defaultValue": DnsFilterEnable || 'off', //默认值对应的value值
                "type": 'radio',
                "name": 'DnsFilterEnable',
                "items": [{
                    "value": 'on',
                    "name": '{open}',
                }, {
                    "value": 'off',
                    "name": '{close}'
                }, ]
            }
        }, {
            "necessary": true,
            "prevWord": '{ruleName}',
            "inputData": {
                "type": 'text',
                "name": 'DnsFilterName',
                "value": DnsFilterName,
                "checkDemoFunc": ['checkInput', 'name', '1', '31', '5']
            },
            "afterWord": ''
        }, {
            "prevWord": '{info}',
            "inputData": {
                "type": 'text',
                "name": 'DnsFilterNote',
                "value": DnsFilterNote,
                "checkDemoFunc": ['checkInput', 'name', '0', '31', '3']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{orgRefer}',
            "inputData": {
                "type": 'text',
                "name": 'orgShow',
                "value": orgShow,
            },
            "afterWord": ''
        }, {
            "prevWord": '{gro_time}',
            "inputData": {
                "defaultValue": effecttime, //默认值对应的value值
                "type": 'select',
                "name": 'effecttime',
                "items": effecttimeItems
            }
        }, {
            "prevWord": '{fir_action}',
            "inputData": {
                "defaultValue": enableType || '0', //默认值对应的value值
                "type": 'radio',
                "name": 'enableType',
                "items": [{
                    "value": '1',
                    "name": '{allow}',
                }, {
                    "value": '0',
                    "name": '{forbid}'
                }, ]
            },
            afterWord: '{onlyAllowOrForbidDomain}'
        }, {
            "necessary": true,
            "prevWord": '{domainFilter}',
            "inputData": {
                "type": 'text',
                "name": 'addHostFilter',
                "value": '',
                "checkDemoFunc": ['checkNoHttpUrl', 'ip', '0', '2', 'domain']
            },
        }, {
            "prevWord": '{dr_domain_list}',
            "inputData": {
                "type": 'select',
                "name": 'DnsLists',
                "defaultValue": '',
                "items": DnsListsText,
            },
        }, {
            "prevWord": '{accessTerminal}',
            "inputData": {
                "defaultValue": terminalEnable || 'off', //默认值对应的value值
                "type": 'radio',
                "name": 'terminalEnable',
                "items": [{
                    "value": 'on',
                    "name": '{open}',
                    "control": 'terminalOn'
                }, {
                    "value": 'off',
                    "name": '{close}'
                }, ]
            }
        }, {
            "sign": 'terminalOn',
            "prevWord": '{remindWay}',
            "inputData": {
                "defaultValue": terminalRemind, //默认值对应的value值
                "type": 'select',
                "name": 'terminalRemind',
                "items": [{
                    "value": '0',
                    "name": '{Announcement}',
                    "control": 'fbtg'
                }, {
                    "value": '1',
                    "name": '{redirect}',
                    "control": 'cdx'
                }, ]
            }
        }, {
            "sign": 'fbtg',
            "disabled":true,
            "prevWord": '{noticePage}',
            "inputData": {
                "type": 'text',
                "name": 'NoticePageChooseName',
                "value": NoticePageChooseName
            }
        }, {
            "sign": 'cdx',
            "necessary": true,
            "prevWord": '{redirect}IP',
            "inputData": {
                "type": 'text',
                "name": 'domainRedirection',
                "value": domainRedirection,
                "checkDemoFunc": ['checkInput', 'ip', '1', 'ip']
            },
        }, {
            "display": true,
            "inputData": {
                "type": 'text',
                "name": 'alwaysShow',
                "value": '',
            },
            "afterWord":""
        }, {
            "display": true,
            "inputData": {
                "type": 'text',
                "name": 'tipsHttps',
                "value": '',
            },
            "afterWord":""
        } ];


        var InputGroup = require('InputGroup');
        var $dom = InputGroup.getDom(inputList);
        // 样式调整
        $dom.find('[name="alwaysShow"]').hide().parent().prev()
    		.attr('colspan',3)
    		.css({fontWeight:'bold',maxWidth:'1px',wordBreak:'normal',whiteSpace:'normal',padding:'10px',backgroundColor:'#eeeeee'})
    		.append(T('domainNameNote'))
    		.next()
    		.next()
    		.remove();
        if(DATA.httpsEnable == 1){
        	$dom.find('[name="tipsHttps"]').hide().parent().prev()
        		.attr('colspan',3)
        		.css({fontWeight:'bold',maxWidth:'1px',wordBreak:'normal',whiteSpace:'normal',padding:'10px',backgroundColor:'#eeeeee'})
        		.append(T('needToOpenHttps'))
        		.next()
        		.next()
        		.remove();
	        $dom.find('[name="tipsHttps"]').parent().prev().children('label').remove();
	        $dom.find('[name="tipsHttps"]').parent().remove();
        }else{
        	$dom.find('[name="tipsHttps"]').parent().parent().remove();
        }

        // 部分交互
        // 组织架构
        $dom.find('[name="orgShow"]').after('<input type="text" class="u-hide" value="' + orgType + '" name="orgType" />');
        $dom.find('[name="orgShow"]').after('<input type="text" class="u-hide"  value="' + orgData + '" name="orgData" />');
        $dom.find('[name="orgShow"]').after('<input type="text" class="u-hide"  value="' + orgIp + '" name="orgIp" />');

        $dom.find('[name="orgShow"]').click(function() {
            var datass = {
                //保存回调
                saveClick: function(saveData) {
                    if (saveData.applyTypeStr == "ip") {
                        $dom.find('[name="orgShow"]').val(saveData.ipStr);
                        $dom.find('[name="orgType"]').val(saveData.applyTypeStr);
                        $dom.find('[name="orgData"]').val('');
                        $dom.find('[name="orgIp"]').val(saveData.ipStr);
                    } else if (saveData.applyTypeStr == "org") {
                        $dom.find('[name="orgShow"]').val(saveData.showName);
                        $dom.find('[name="orgType"]').val(saveData.applyTypeStr);
                        $dom.find('[name="orgData"]').val(saveData.checkIdStr);
                        $dom.find('[name="orgIp"]').val('');
                    } else {
                        $dom.find('[name="orgShow"]').val(T('typeAll'));
                        $dom.find('[name="orgType"]').val(saveData.applyTypeStr);
                        $dom.find('[name="orgData"]').val('');
                        $dom.find('[name="orgIp"]').val('');
                    }
                    saveData.close();
                },
                checkableStr: $dom.find('[name="orgData"]').val(), //被勾选的id字符串
                ipStr: $dom.find('[name="orgIp"]').val(), //开始结束的ip
                applyTypeStr: $dom.find('[name="orgType"]').val() //单选默认值

            };
            require('P_plugin/Organization').display(datass);
        });



        //时间计划调用
        //添加时间计划小按钮
        var btnList = [{
            id: 'addTimePlan',
            name: '{add}',
            clickFunc: function($btn) {
                require('P_plugin/TimePlan').addModal($dom.find('[name="effecttime"]'));
            }
        }, {
            id: 'editTimePlan',
            name: '{edit}',
            clickFunc: function($btn) {
                require('P_plugin/TimePlan').editModal($dom.find('[name="effecttime"]'));
            }
        }];
        InputGroup.insertLink($dom, 'effecttime', btnList);

        //通告页面
        var btnList1 = [{
            id: 'editNotePage',
            name: '{edit}',
            clickFunc: function($btn) {
                var $demo = $('<input type="hidden" value="DefaultDomainFilterPage" />');
                require('P_plugin/NotePage').editModal($demo);
            }
        }];
        InputGroup.insertLink($dom, 'NoticePageChooseName', btnList1);

        //过滤域名
        var btnList2 = [{
            id: 'addDns',
            name: '{add}',
            clickFunc: function($btn) {
                if (InputGroup.checkErr($dom.find('[name="addHostFilter"]').parent()) == 0) {
                    var thisdns = $dom.find('[name="addHostFilter"]').val();

                    $.ajax({
                        type: "post",
                        url: "goform/websHostFilter",
                        data: 'addHostFilter=' + thisdns,
                        success: function(result) {
                            eval(result);
                            if (status) {
                                $dom.find('[name="DnsLists"]').append('<option value="' + thisdns + '">' + thisdns + '</option>');
                                Tips.showSuccess(T('addSuccess'));
                                $dom.find('[name="addHostFilter"]').val('');
                            }else{
                            	Tips.showWarning(errorstr);
                            }
                        }
                    });

                }
            }
        }];
        InputGroup.insertBtn($dom, 'addHostFilter', btnList2);

        //域名列表
        var btnList3 = [{
                id: 'deleteDns',
                name: '{delete}',
                clickFunc: function($btn) {
                    var $selectdns = $dom.find('[name="DnsLists"]').find('option:selected');
                    if ($selectdns.length > 0) {
                        var deletstr = 'delstr=';

                        $selectdns.each(function() {
                            var $t = $(this);
                            deletstr += $t.val() + ",";
                        });
                        deletstr = deletstr.substr(0, deletstr.length - 1);

                        $.ajax({
                            type: "post",
                            url: "/goform/formConfigDnsFilterDel",
                            data: deletstr,
                            success: function(result) {
                                eval(result);
                                if (status) {
                                    $selectdns.remove();
                                    Tips.showSuccess('{delSuccess}');
                                }
                            }
                        });

                    }
                }
            }, {
                id: 'cleanDns',
                name: '{clear}',
                clickFunc: function($btn) {
                    Tips.showConfirm(T('sureClear'), function() {

                        $.ajax({
                            type: "post",
                            url: "/goform/formConfigDnsFilterDelAll",
                            data: '',
                            success: function(result) {
                                eval(result);
                                if (status) {
                                    $dom.find('[name="DnsLists"]').empty();
                                    Tips.showSuccess(T('clearSuccess'));
                                }
                            }
                        });

                    });
                }
            },

        ];
        InputGroup.insertBtn($dom, 'DnsLists', btnList3);


        //调整表单样式
        var $nds1 = $dom.find('[name="addHostFilter"]').parent().next().children();
        $dom.find('[name="addHostFilter"]').css('width', '250px').parent().append($nds1).attr('colspan', '2').next().remove();

        var $nds2 = $dom.find('[name="DnsLists"]').parent().next().children();
        $dom.find('[name="DnsLists"]').attr({
            size: '4',
            multiple: 'multiple'
        });
        $dom.find('[name="DnsLists"]').css({
            width: '250px',
            height: '60px',
            overflow: 'auto'
        }).parent().append($nds2).attr('colspan', '2').next().remove();
        $dom.find('[name="DnsLists"]').parent().find('button').css({
            position: 'relative',
            top: '-7px'
        });
        var $chl = $dom.find('[name="DnsLists"]').children();
        var $colcl = $chl.clone(true);
        $chl.remove();
        $colcl.each(function() {
            $(this).removeAttr('selected');
        });
        $dom.find('[name="DnsLists"]').append($colcl);

        $dom.find('[name="addHostFilter"],[name="DnsLists"]').css('margin-right', '7px')
        var btnGroupList = [{
            "id": 'save',
            "name": T('save'),
            "clickFunc": function($btn) {

                if (InputGroup.checkErr($dom) == 0) {
                    var Serialize = require('Serialize');
                    var savestr = Serialize.getQueryArrs($dom),
                        queryJson = Serialize.queryArrsToJson(savestr);
                    queryJson.applyTypeStr = queryJson.orgType;
                    if (queryJson.orgType == "org") {
                        queryJson.data = queryJson.orgData;
                    } else if (queryJson.orgType == "ip") {
                        queryJson.data = queryJson.orgIp;
                    }
                    if(queryJson.NoticePageChooseName == T(DATA.NoticePageChooseName)){
                        queryJson.NoticePageChooseName = DATA.NoticePageChooseName;
                    }
						savestr = Serialize.queryJsonToStr(queryJson);

						$.ajax({
							type: "post",
							url: "/goform/formConfigDnsFilterGlobal",
							data: savestr,
							success: function(result) {
								eval(result);
								if (status) {
									Tips.showSuccess(T('saveSuccess'));
									displayEdit();
								}
							}
						});
                }

            }
        }, {
            "id": 'reset',
            "name": T('reset')
        }];
        var BtnGroup = require('BtnGroup');
        var $btnGroup = BtnGroup.getDom(btnGroupList).addClass('u-btn-group');


        Translate.translate([$dom], dicArr);

        return [$dom, $btnGroup];
    }
})
