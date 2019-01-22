define(function(require, exports, module) {
    // 存储本页面一些变量
    var DATA = {};

    function T(str) {
        return require('Translate').getValue(str, ['common', 'error', 'doRouterConfig']);
    }
    /**
     * 新增按钮的点击事件处理函数
     * @author JeremyZhang
     * @date   2016-09-02
     */
    function addBtnClick() {
        // 加载模态框模板模块

        var Modal = require('Modal');
        var BtnGroup = require('BtnGroup');

        // 模态框配置数据
        var modalList = {
            "id": "modal-add",
            "title": "{add}",
            "btns": [{
                    "type": 'save',
                    "clickFunc": function($this) {
                        var $modal = $('#modal-add');
                        addSubmitClick($modal);
                    }
                },
                {
                    "type": 'reset'
                },
                {
                    "type": 'close'
                }
            ]
        };

        var database = DATA.tableData;
        var data = database.getSelect({
            primaryKey: 0
        });
        //var wanIfCount = data[0]["wanIfCount"];
        var arr = [
            ['LAN0', 'LAN']
        ];
        for (var i = 1; i <= DATA["wanCount"]; i++) {
            /*  		if (is3GPort(i,wanIfCount)) {
                            arr.push(["WAN"+i,"3G"]);
                        }else if (is4GPort(i,wanIfCount)) {
                            arr.push(["WAN"+i,"4G"]);
                        } else if (isAPCliPort(i, wanIfCount)) {
                            arr.push(["WAN"+i,"APClient"]);
                        } else {
                            //document.write('<option value="WAN'+i+'" '+ (i==1? 'selected="selected"':'') +'>WAN'+i+'</option>');
                            arr.push(["WAN"+i,"WAN"+i]);
                        }*/
            arr.push(["WAN" + i, "WAN" + i]);
        }

        /*
                if(PPTPClientList == 1)
                {
                */
        for (var i = 0; i < DATA["PptpServerNames"].length; i++) {
            arr.push([DATA["PptpServerNames"][i], DATA["PptpServerNames"][i]]);
        }
        for (var i = 0; i < DATA["PptpClientNames"].length; i++) {
            arr.push([DATA["PptpClientNames"][i], DATA["PptpClientNames"][i]]);
        }
        /*
            }
            if(L2TPList == 1)
            {
            */
        for (var i = 0; i < DATA["L2tpServerNames"].length; i++) {
            arr.push([DATA["L2tpServerNames"][i], DATA["L2tpServerNames"][i]]);
        }
        for (var i = 0; i < DATA["L2tpClientNames"].length; i++) {
            arr.push([DATA["L2tpClientNames"][i], DATA["L2tpClientNames"][i]]);
        }
        /*
        }
  */
        var modeInputJson = [];

        arr.forEach(function(item, index) {
            if ((Number(index)) > Number(DATA["wanCount"]) + Number(DATA["PptpServerNames"]) + Number(DATA["PptpClientNames"]) + Number(DATA["L2tpServerNames"]) + Number(DATA["L2tpClientNames"])) return false;
            var obj = {
                "value": item[0],
                "name": item[1],
                "isChecked": 'true'
            };
            modeInputJson.push(obj);
        });

        // 获得模态框的html
        var modalobj = Modal.getModalObj(modalList),
            $modal = modalobj.getDom(); // 模态框的jquery对象
        $('body').append($modal);
        // 模态框中输入框组的配置数据
        var inputList = [{
            "prevWord": '{status}',
            "inputData": {
                "type": 'radio',
                "name": 'RouteEnables',
                "defaultValue": '1',
                "items": [{
                    "value": '1',
                    "name": '{open}'
                }, {
                    "value": '0',
                    "name": '{close}'
                }, ]
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{routeName}',
            "inputData": {
                "type": 'text',
                "name": 'RouteNames',
                "checkDemoFunc": ['checkInput', 'name', '1', '31', '5']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{rou_destNet}',
            "inputData": {
                "type": 'text',
                "name": 'DesIPs',
                "checkDemoFunc": ['checkInput', 'ip', '11', '1']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{netmask}',
            "inputData": {
                "type": 'text',
                "name": 'DesMasks',
                "checkDemoFunc": ['checkInput', 'mask', '1'],
                "value": ''
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{GwAddr}',
            "inputData": {
                "type": 'text',
                "name": 'GateWays',
                "checkDemoFunc": ['checkInput', 'ip', '11', '1']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{com_priority}',
            "inputData": {
                "type": 'text',
                "name": 'Metrics',
                "checkDemoFunc": ['checkNum', '0', '7'],
                "value": '1',
            },
            "afterWord": '{com_priTip}'
        }, {
            "prevWord": '{bind_if}',
            "inputData": {
                "type": 'select',
                "name": 'Profiles',
                "defaultValue": 'WAN1',
                "items": modeInputJson
            },
            "afterWord": ''
        }];


        // 获得输入框组的html
        var InputGroup = require('InputGroup'),
            $dom = InputGroup.getDom(inputList);
            
            //根据目的网络自动填写子网掩码
            $dom.find("input[name='DesIPs']").on('input',function(){
            	var ip = $(this).val();
            	var index = ip.substr(0,3);
            	var ipn = ip.indexOf('.');
            	var mask = $dom.find("input[name='DesMasks']");
            	console.log(ipn)
            	if(ipn > 0){
            		if(index >= 1 && index<=127){
            			mask.val("255.0.0.0");
            		}else if(index >= 128 && index<=191){
            			mask.val("255.255.0.0");
            		}else if(index >= 192 ){
            			mask.val("255.255.255.0");
            		}
            	}else{
            		mask.val("");
            	}
            })
        // 将输入框组放入模态框中
        $modal.find('.modal-body').empty().append($dom);
        // 显示模态框
        $('body').append($modal);

        var Translate = require('Translate');
        var tranDomArr = [$modal];
        var dicArr = ['common', 'doRouterConfig'];
        Translate.translate(tranDomArr, dicArr);

        $modal.modal('show');
    }
    /**
     * 新增模态框中提交按钮点击事件
     * @author JeremyZhang
     * @date   2016-09-05
     * @param  {[type]}   $modal [description]
     */
    function addSubmitClick($modal) {
        // 加载序列化模块
        var tips = require('Tips');
        var Serialize = require('Serialize');
        // 获得用户输入的数据
        var queryArrs = Serialize.getQueryArrs($modal);
        var queryStr = Serialize.queryArrsToStr(queryArrs);
        // 添加静态路由
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            return;
        }
        var routeName = Serialize.getValue(queryArrs, 'RouteNames')[0];
        var routeEnable = Serialize.getValue(queryArrs, 'RouteEnables')[0];
        var desIP = Serialize.getValue(queryArrs, 'DesIPs')[0];
        var desMask = Serialize.getValue(queryArrs, 'DesMasks')[0];
        var gateWay = Serialize.getValue(queryArrs, 'GateWays')[0];
        var metric = Serialize.getValue(queryArrs, 'Metrics')[0];
        var profile = Serialize.getValue(queryArrs, 'Profiles')[0];

        var Tips = require('Tips');
        var queryArrs = [
            ['RouteNames', routeName],
            ['RouteEnables', routeEnable],
            ['DesIPs', desIP],
            ['DesMasks', desMask],
            ['GateWays', gateWay],
            ['Metrics', metric],
            ['Profiles', profile]
        ];

        $.ajax({
            url: '/goform/formStaticRoute',
            type: 'POST',
            data: queryStr,
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['status', 'errorstr'],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                // 判断代码字符串执行是否成功
                if (isSuccess) {
                    var data = result["data"],
                        status = data["status"];
                    if (status) {
                        // 显示成功信息
                        Tips.showSuccess('{saveSuccess}');
                        var Dispatcher = require('Dispatcher');
                        Dispatcher.reload(2);
                    } else {
                        var errorStr = data["errorstr"];
                        Tips.showWarning(errorStr);
                    }

                } else {
                    Tips.showWarning('{saveFail}');
                }
            }
        });
    }
    /**
     * 添加静态路由
     * @author JeremyZhang
     * @date   2016-09-05
     * @param  {[type]}   queryArrs [description]
     * @param  {[type]}   $modal    [description]
     */
    function addStaticRoute(queryArrs, $modal) {

        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            tips.showError('{addStaticRouteFail}', 3);
            return;
        }
        // 从用户输入中读取数据
        var Serialize = require('Serialize');
        var routeNames = Serialize.getValue(queryArrs, 'RouteNames')[0];
        var routeEnables = Serialize.getValue(queryArrs, 'RouteEnables')[0];
        var desIPs = Serialize.getValue(queryArrs, 'DesIPs')[0];
        var desMasks = Serialize.getValue(queryArrs, 'DesMasks')[0];
        var gateWays = Serialize.getValue(queryArrs, 'GateWays')[0];
        var metrics = Serialize.getValue(queryArrs, 'Metrics')[0];
        var profiles = Serialize.getValue(queryArrs, 'Profiles')[0];

        //获得提示框组件调用方法
        var Tips = require('Tips');
        // 可以添加静态路由

        var queryArrs = [
            ['RouteNames', routeNames],
            ['RouteEnables', routeEnables],
            ['DesIPs', desIPs],
            ['DesMasks', desMasks],
            ['GateWays', gateWays],
            ['Metrics', metrics],
            ['Profiles', profiles]
        ];
        var queryStr = Serialize.queryArrsToStr(queryArrs);
        $.ajax({
            url: '/goform/formStaticRoute',
            type: 'POST',
            data: queryStr,
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['status'],
                    result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                // 判断代码字符串执行是否成功
                if (isSuccess) {
                    var data = result["data"],
                        status = data["status"];
                    if (status) {
                        // 显示成功信息
                        Tips.showSuccess('{saveSuccess}');
                        var Dispatcher = require('Dispatcher');
                        Dispatcher.reload(2);
                    } else {
                        Tips.showWarning('{saveFail}');
                    }

                } else {
                    Tips.showWarning('{saveFail}');
                }
            }
        });

    }
    /**
     * 删除按钮点击处理事件
     * @author JeremyZhang
     * @date   2016-09-05
     * @return {[type]}   [description]
     */
    function deleteBtnClick() {
        //获得提示框组件调用方法
        var Tips = require('Tips');
        var database = DATA["tableData"];
        var tableObj = DATA["tableObj"];
        // 获得表格中所有被选中的选择框，并获取其数量
        var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
        length = primaryKeyArr.length;
        // 判断是否有被选中的选择框
        if (length > 0) {
            require('Tips').showConfirm(T('delconfirm'), function() {
                var str = '';
                primaryKeyArr.forEach(function(primaryKey) {
                    var data = database.getSelect({
                        primaryKey: primaryKey
                    });
                    var name = data[0]["RouteNames"];
                    str += name + ',';
                });
                str = str.substr(0, str.length - 1);
                str = 'delstr=' + str;
                $.ajax({
                    url: '/goform/formStaticRouteDel',
                    type: 'POST',
                    data: str,
                    success: function(result) {
                        var doEval = require('Eval');
                        var codeStr = result,
                            variableArr = ['status'],
                            result = doEval.doEval(codeStr, variableArr),
                            isSuccess = result["isSuccessful"];
                        // 判断代码字符串执行是否成功
                        if (isSuccess) {
                            var data = result["data"],
                                status = data['status'];
                            if (status) {
                                // 提示成功信息
                                Tips.showSuccess('{delSuccess}');
                                var Dispatcher = require('Dispatcher');
                                Dispatcher.reload(2);
                            } else {
                                Tips.showError('{delFail}');
                            }
                        } else {
                            Tips.showError('{parseStrErr}');
                        }
                    }
                });
            });
        } else {
            Tips.showWarning('{DELETE_CASE_NOT_EXITS}');
        }
    }
    /**
     * 开启或者关闭一个静态路由的状态
     * @author JeremyZhang
     * @date   2016-09-05
     * @param  {[type]}   $target [description]
     * @return {[type]}           [description]
     */
    function changeStatus(data, $target) {
        var routeEnable = (data["RouteEnables"] == '1') ? '0' : '1';
        //获得提示框组件调用方法
        var Tips = require('Tips');
        // 加载查询字符串序列化模块
        var Serialize = require('Serialize');
        // 查询字符串二维数组
        var queryArr = [
            ['RouteNames', data["RouteNames"]],
            ['RouteEnables', routeEnable],
            ['DesIPs', data["DesIPs"]],
            ['DesMasks', data["DesMasks"]],
            ['GateWays', data["GateWays"]],
            ['Metrics', data["Metrics"]],
            ['Profiles', data["Profiles"]]
        ];
        // 调用序列化模块的转换函数，将数组转换为查询字符串
        var queryStr = Serialize.queryArrsToStr(queryArr);

        var str = 'Actions=modify';
        // 合并url字符串
        queryStr = Serialize.mergeQueryStr([queryStr, str]);

        // 向后台发送请求
        $.ajax({
            url: '/goform/formStaticRoute',
            type: 'POST',
            data: queryStr,
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
                    // 后台修改成功
                    if (status) {
                        // 显示成功信息
                        var successMsg = (routeEnable == '0') ? '{closeSuccess}' : '{openSuccess}';
                        Tips.showSuccess(successMsg);
                        var Dispatcher = require('Dispatcher');
                        Dispatcher.reload(2);
                    } else {
                        // 显示失败信息
                        var errorStr = data["errorstr"];
                        Tips.showWarning(errorStr);
                    }

                } else {
                    Tips.showError('{oprtFail}');
                }
            }
        });
    }
    /**
     * 编辑按钮点击事件
     * @author JeremyZhang
     * @date   2016-09-05
     * @param  {[type]}   $target [description]
     * @return {[type]}           [description]
     */
    function editBtnClick(data, $target) {
        // 加载模态框模板模块
        var Modal = require('Modal');
        //var wanIfCount = data[0]["wanIfCount"];
        var arr = [
            ['LAN0', 'LAN']
        ];
        for (var i = 1; i <= DATA["wanCount"]; i++) {
            /*  		if (is3GPort(i,wanIfCount)) {
                            arr.push(["WAN"+i,"3G"]);
                        }else if (is4GPort(i,wanIfCount)) {
                            arr.push(["WAN"+i,"4G"]);
                        } else if (isAPCliPort(i, wanIfCount)) {
                            arr.push(["WAN"+i,"APClient"]);
                        } else {
                            //document.write('<option value="WAN'+i+'" '+ (i==1? 'selected="selected"':'') +'>WAN'+i+'</option>');
                            arr.push(["WAN"+i,"WAN"+i]);
                        }*/
            arr.push(["WAN" + i, "WAN" + i]);
        }
        /*
                if(PPTPClientList == 1)
                {
                */
        for (var i = 0; i < DATA["PptpServerNames"].length; i++) {
            arr.push([DATA["PptpServerNames"][i], DATA["PptpServerNames"][i]]);
        }
        for (var i = 0; i < DATA["PptpClientNames"].length; i++) {
            arr.push([DATA["PptpClientNames"][i], DATA["PptpClientNames"][i]]);
        }
        /*
            }
            if(L2TPList == 1)
            {
            */
        for (var i = 0; i < DATA["L2tpServerNames"].length; i++) {
            arr.push([DATA["L2tpServerNames"][i], DATA["L2tpServerNames"][i]]);
        }
        for (var i = 0; i < DATA["L2tpClientNames"].length; i++) {
            arr.push([DATA["L2tpClientNames"][i], DATA["L2tpClientNames"][i]]);
        }
        /*
			        }
			  */
        var modeInputJson = [];
        arr.forEach(function(item, index) {
            if ((Number(index)) > Number(DATA["wanCount"]) + Number(DATA["PptpServerNames"]) + Number(DATA["PptpClientNames"]) + Number(DATA["L2tpServerNames"]) + Number(DATA["L2tpClientNames"])) return false;
            var obj = {
                "value": item[0],
                "name": item[1],
                "isChecked": 'true'
            };
            modeInputJson.push(obj);
        });

        var modalList = {
            "id": "modal-edit",
            "title": "{edit}",
            "btns": [{
                    "type": 'save',
                    "clickFunc": function($this) {

                        var $modal = $('#modal-edit');
                        editSubmitClick($modal, data, $target);
                    }
                },
                {
                    "type": 'reset'
                },
                {
                    "type": 'close'
                }
            ]
        };
        // 获得模态框的html
        var modalobj = Modal.getModalObj(modalList),
            $modal = modalobj.getDom(); // 模态框的jquery对象
        $('body').append($modal);

        var RouteNames = data["RouteNames"],
            RouteEnables = data["RouteEnables"],
            DesIPs = data["DesIPs"],
            DesMasks = data["DesMasks"];
        GateWays = data["GateWays"];
        Metrics = data["Metrics"];
        Profiles = data["Profiles"];
        /*var isClosed = (RouteEnable == '1') ? true : false;*/
        var inputList = [{
            "prevWord": '{status}',
            "inputData": {
                "type": 'radio',
                "name": 'RouteEnables',
                "defaultValue": RouteEnables,
                "items": [{
                    "value": '1',
                    "name": '{open}',
                }, {
                    "value": '0',
                    "name": '{close}',
                }, ]
            },
            "afterWord": ''
        }, {
            "disabled": true,
            "necessary": true,
            "prevWord": '{routeName}',
            "inputData": {
                "type": 'text',
                "name": 'RouteNames',
                "value": RouteNames,
                "checkDemoFunc": ['checkInput', 'name', '1', '31', '5']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{rou_destNet}',
            "inputData": {
                "type": 'text',
                "name": 'DesIPs',
                "value": DesIPs,
                "checkDemoFunc": ['checkInput', 'ip', '1', '1']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{netmask}',
            "inputData": {
                "type": 'text',
                "name": 'DesMasks',
                "value": DesMasks,
                "checkDemoFunc": ['checkInput', 'mask', '1']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{GwAddr}',
            "inputData": {
                "type": 'text',
                "name": 'GateWays',
                "value": GateWays,
                "checkDemoFunc": ['checkInput', 'ip', '1', '1']
            },
            "afterWord": ''
        }, {
            "necessary": true,
            "prevWord": '{com_priority}',
            "inputData": {
                "type": 'text',
                "name": 'Metrics',
                "value": Metrics,
                "checkDemoFunc": ['checkNum', '0', '7'],
            },
            "afterWord": '{com_priTip}'
        }, {
            "prevWord": '{bind_if}',
            "inputData": {
                "type": 'select',
                "name": 'Profiles',
                "defaultValue": Profiles,
                "items": modeInputJson
            },
            "afterWord": ''
        }, ]

        var InputGroup = require('InputGroup'),
            $dom = InputGroup.getDom(inputList);
        $modal.find('.modal-body').empty().append($dom);
        $modal.find('button#submit').click(function(event) {
            editSubmitClick($modal, data, $target);
        });
        var Translate = require('Translate');
        var tranDomArr = [$modal];
        var dicArr = ['common', 'doRouterConfig'];
        Translate.translate(tranDomArr, dicArr);
        $modal.modal('show');
    }

    /**
     * 编辑时 点击提交按钮
     * @author JeremyZhang
     * @date   2016-09-06
     * @param  {[type]}   modalObj [description]
     * @param  {[type]}   oldName  [description]
     * @return {[type]}            [description]
     */
    function editSubmitClick($modal, data, $target) {
        // 引入serialize模块
        var Serialize = require('Serialize');
        var queryArr = Serialize.getQueryArrs($modal),
            queryJson = Serialize.queryArrsToJson(queryArr),
            queryStr = Serialize.queryArrsToStr(queryArr);
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            tips.showError('{addStaticRouteFail}', 3);
            return;
        }
        // 将模态框中的输入转化为url字符串
        var str = 'Actions=modify';
        // 合并url字符串
        queryStr = Serialize.mergeQueryStr([queryStr, str]);
        //获得提示框组件调用方法
        var Tips = require('Tips');
        $.ajax({
            url: '/goform/formStaticRoute',
            type: 'POST',
            data: queryStr,
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
                        // 显示成功信息
                        Tips.showSuccess('{saveSuccess}');
                        var Dispatcher = require('Dispatcher');
                        Dispatcher.reload(2);
                    } else {
                        var errorStr = data["errorstr"];
                        Tips.showWarning(errorStr);
                    }
                } else {
                    Tips.showWarning('{parseStrErr}');
                }
            }
        });
    }
    /**
     * 删除一条数据
     * @author JeremyZhang
     * @date   2016-09-06
     * @param  {[type]}   $target [description]
     * @return {[type]}           [description]
     */
    function removeStaticRoute(data, $target) {
        var routeNames = data["RouteNames"];
        var queryStr = 'delstr=' + routeNames;
        var Tips = require('Tips');
        require('Tips').showConfirm(T('delconfirm'), function() {
            $.ajax({
                url: '/goform/formStaticRouteDel',
                type: 'POST',
                data: queryStr,
                success: function(result) {
                    var doEval = require('Eval');
                    var codeStr = result,
                        returnStr = ['status'],
                        result = doEval.doEval(codeStr, returnStr),
                        isSuccess = result["isSuccessful"];
                    // 判断代码字符串执行是否成功
                    if (isSuccess) {
                        var data = result["data"],
                            status = data['status'];
                        if (status) {
                            Tips.showSuccess('{delSuccess}');
                            var Dispatcher = require('Dispatcher');
                            Dispatcher.reload(2);
                        } else {
                            Tips.showError('{delFail}');
                        }

                    } else {
                        Tips.showError('{delFail}');
                    }
                }
            });
        });
    }
    /**
     * 为表格中的开启、删除、编辑按钮添加点击事件
     * @author JeremyZhang
     * @date   2016-09-08
     * @param  {[type]}   $container [description]
     * @return {[type]}              [description]
     */
    function initTableEvent($container) {
        /*
        	为整个表格组件添加点击事件，
        	通过判断触发点击事件的元素的属性来判断那个按钮被点击
         */
        $container.click(function(ev) {
            // 获取触发点击事件的元素
            var ev = ev || window.event,
                target = ev.target || ev.srcElement,
                $target = $(target); // 触发点击事件的元素的jquery对象
            if ($target.attr('data-type') == 'is-open') {
                // 开启按钮点击事件
                // 获得需要修改的数据对应数据表中的主键
                var primaryKey = $target.attr('data-primaryKey');
                var database = DATA.tableData;
                var data = database.getSelect({
                    primaryKey: primaryKey
                });
                // 修改这条数据的开启状态
                changeStatus(data[0], $target);
            } else if ($target.attr('data-event') == 'edit') {
                // 编辑按钮点击事件
                var primaryKey = $target.attr('data-primaryKey');
                var database = DATA.tableData;
                var data = database.getSelect({
                    primaryKey: primaryKey
                });
                editBtnClick(data[0], $target);
            } else if ($target.attr('data-event') == 'removeStaticRoute') {
                // 一行数据中的删除按钮点击事件
                var primaryKey = $target.attr('data-primaryKey');
                var database = DATA.tableData;
                var data = database.getSelect({
                    primaryKey: primaryKey
                });
                // 删除这条数据
                removeStaticRoute(data[0], $target);
            }

        });
    }
    /**
     * 为表格上方按钮添加交互事件
     * @author JeremyZhang
     * @date   2016-08-31
     */
    /*
    	function initHeadEvent() {
    		// 新增按钮的点击事件
    		$('#add').click(function() {
    			addBtnClick();
    		});
    		// 删除按钮的点击事件
    		$('#delete').click(function() {
    			deleteBtnClick();
    		})
    	}
    	*/
    /**
     * 存储表格数据
     * @author JeremyZhang
     * @date   2016-09-22
     * @param  {[type]}   data [description]
     * @return {[type]}        [description]
     */
    function storeTableData(data) {
        // 获取数据库模块，并建立一个数据库
        var Database = require('Database'),
            database = Database.getDatabaseObj(); // 数据库的引用
        // 存入全局变量DATA中，方便其他函数使用
        DATA["tableData"] = database;
        // 声明字段列表
        var fieldArr = ['RouteNames', 'RouteEnables', 'DesIPs', 'DesMasks', 'GateWays', 'Metrics', 'Profiles', 'wanIfCounts'];
        // 将数据存入数据表中
        database.addTitle(fieldArr);
        database.addData(data);
    }
    /**
     * 处理后台发送的数据，转换为数据表格式的数据
     * @author JeremyZhang
     * @date   2016-09-22
     * @return {array}   lan和vlan的数据
     */
    function processData(jsStr) {
        // 加载Eval模块
        var doEval = require('Eval');
        var codeStr = jsStr,
            // 定义需要获得的变量
            variableArr = [
                /*表格数据*/
                'RouteNames',
                'RouteEnables',
                'DesIPs',
                'DesMasks',
                'GateWays',
                'Metrics',
                'Profiles',
                'wanIfCount',
                'PptpServerNames',
                'PptpClientNames',
                'L2tpServerNames',
                'L2tpClientNames',
            ];
        // 获得js字符串执行后的结果
        var result = doEval.doEval(codeStr, variableArr),
            isSuccess = result["isSuccessful"];
        // 判断代码字符串执行是否成功
        if (isSuccess) {
            // 获得所有的变量
            var data = result["data"];
            // 将返回的JS代码执行所生成的变量进行复制
            var titleArr = ['RouteNames',
                    'RouteEnables',
                    'DesIPs',
                    'DesMasks',
                    'GateWays',
                    'Metrics',
                    'Profiles',
                ], // 表格头部的标题列表
                RouteNameArr = data["RouteNames"],
                RouteEnableArr = data["RouteEnables"],
                DesIPArr = data["DesIPs"],
                DesMaskArr = data["DesMasks"],
                GateWayArr = data["GateWays"],
                MetricArr = data["Metrics"],
                ProfileArr = data["Profiles"];
            DATA["wanCount"] = data["wanIfCount"];
            DATA["PptpServerNames"] = data["PptpServerNames"];
            DATA["PptpClientNames"] = data["PptpClientNames"];
            DATA["L2tpServerNames"] = data["L2tpServerNames"];
            DATA["L2tpClientNames"] = data["L2tpClientNames"];
            // 把数据转换为数据表支持的数据结构
            var dataArr = []; // 将要插入数据表中的数据
            //arr = [];
            //dataArr.push(arr);
            // 通过数组循环，转换数据的结构
            RouteNameArr.forEach(function(item, index, arr) {
                var arr = [];

                arr.push(RouteNameArr[index]);
                arr.push(RouteEnableArr[index]);
                arr.push(DesIPArr[index]);
                arr.push(DesMaskArr[index]);
                arr.push(GateWayArr[index]);
                arr.push(MetricArr[index]);
                arr.push(ProfileArr[index]);
                dataArr.push(arr);
            });
            // 返回处理好的数据
            var tableData = {
                title: titleArr,
                data: dataArr
            };
            return {
                table: tableData
            };
        } else {}
    }
    /**
     * 生成表格的Dom，并返回
     * @author JeremyZhang
     * @date   2016-09-22
     * @return {jquery对象}   表格的jQuery对象
     */
    function getTableDom() {

        // 表格上方按钮配置数据
        var btnList = [{
            "id": "add",
            "name": "{add}",
            "clickFunc": function($btn) {
                addBtnClick();
            }
        }, {
            "id": "delete",
            "name": "{delete}",
            "clickFunc": function($btn) {
                deleteBtnClick();
            }

        }];

        var database = DATA["tableData"];

        var headData = {
            "btns": btnList
        };
        // 表格配置数据
        var tableList = {
            "database": database,
            "isSelectAll": true,
            "titles": {
                "{routeName}": {
                    "key": "RouteNames",
                    "type": "text"
                },
                "{open}": {
                    "key": "RouteEnables",
                    "type": "checkbox",
                    "values": {
                        "1": true,
                        "0": false
                    },
                    "clickFunc": function($this) {
                        var primaryKey = $this.attr('data-primaryKey');
                        var database = DATA.tableData;
                        var data = database.getSelect({
                            primaryKey: primaryKey
                        });
                        changeStatus(data[0], $this);
                    }
                },
                "{rou_destNet}": {
                    "key": "DesIPs",
                    "type": "text"
                },
                "{netmask}": {
                    "key": "DesMasks",
                    "type": "text"
                },
                "{GwAddr}": {
                    "key": "GateWays",
                    "type": "text"
                },
                "{com_priority}": {
                    "key": "Metrics",
                    "type": "text"
                },
                "{bind_if}": {
                    "key": "Profiles",
                    "type": "text",
                    "values": {
                        "LAN0": "LAN"
                    },
                },
                "{edit}": {
                    "type": "btns",
                    "btns": [{
                            "type": 'edit',
                            "clickFunc": function($this) {
                                var primaryKey = $this.attr('data-primaryKey');
                                var database = DATA.tableData;

                                var data = database.getSelect({
                                    primaryKey: primaryKey
                                });

                                editBtnClick(data[0], $this);
                            }
                        },
                        {
                            "type": 'delete',
                            "clickFunc": function($this) {
                                var primaryKey = $this.attr('data-primaryKey');
                                var database = DATA.tableData;
                                var data = database.getSelect({
                                    primaryKey: primaryKey
                                });
                                // 删除这条数据
                                removeStaticRoute(data[0], $this);
                            }
                        }
                    ]
                }
            },
            "lang": 'zhcn',
            "dicArr": ['common', 'doRouterConfig']
        };
        // 表格组件配置数据
        var list = {
            head: headData,
            table: tableList
        };

        // 加载表格组件，获得表格组件对象，获得表格jquery对象
        var Table = require('Table');
        var tableObj = Table.getTableObj(list);
        var $table = tableObj.getDom();

        // 将表格组件对象存入全局变量，方便其他函数调用
        DATA["tableObj"] = tableObj;
        return $table;
    }
    /**
     * 获取表格数据并生成表格
     * @author JeremyZhang
     * @date   2016-09-07
     * @param  {[type]}   $container [description]
     * @return {[type]}              [description]
     */
    function displayTable($container) {
        $('#checkOpen,.u-onoff-span1').hide();
        var TableContainer = require('P_template/common/TableContainer');
        var conhtml = TableContainer.getHTML({}),
            $tableCon = $(conhtml);
        // 将表格容器放入标签页容器里
        $container.append($tableCon);

        // 向后台发送请求，获得表格数据
        $.ajax({
            url: 'common.asp?optType=StaticRoute',
            type: 'GET',
            success: function(result) {
                // 将后台数据处理为数据表格式的数据
                var data = processData(result),
                    tableData = data["table"];
                var titleArr = tableData["title"],
                    tableArr = tableData["data"];

                // 将数据存入数据表
                storeTableData(tableArr);

                // 获得表格Dom
                var $table = getTableDom();

                // 将表格放入页面
                $tableCon.append($table);
                // 为按钮添加事件
                //initHeadEvent();
                // 添加表格内的按钮事件
                //initTableEvent($container);
            }

        });

    }
    /**
     * LAN口配置标签页的处理函数
     * @author JeremyZhang
     * @date   2016-08-31
     * @param  {[type]}   $dom 包裹标签页的容器
     */
    function display($container) {
        // 清空标签页容器
        $container.empty();
        //删除OnOff按钮
        $('#checkOn').remove();
        // 获取表格数据并生成表格
        displayTable($container);

    }
    // 提供对外接口
    module.exports = {
        display: display
    };
});
