define(function(require, exports, module) {
    require('jquery');
    var DATA = {};
    //获得认证配置页面
    var Translate = require('Translate');
    var dicArr = ['common', 'doUserAuthentication'];

    function T(_str) {
        return Translate.getValue(_str, dicArr);
    }

    function setModalDom(data) {
        var ml = {
            id: 'webConfig',
            title: T('webAuth'),
            "btns": [{
                "type": 'save',
                "clickFunc": function($this) {
                    var $modal = $this.parents('.modal');
                    saveBtnWebAuth($modal);
                }
            }, {
                "type": 'reset'
            }, {
                "type": 'close'
            }]
        };
        var Modal = require('Modal');
        var modalObj = Modal.getModalObj(ml);
        var il = [{
			"disabled": true,
            "prevWord": '{web_page}',
            "inputData": {
                "defaultValue": DATA.data.authPage || '',
                "type": 'text',
                "name": 'authPage',
				"value": T(DATA.data.authPage) ? T(DATA.data.authPage) : DATA.data.authPage,
                /*"items": [{
                    "value": DATA.data.authPage,
                    "name": T(DATA.data.authPage) ? T(DATA.data.authPage) : DATA.data.authPage,
                }]*/
            },
            "afterWord": ''
        }, {
            "prevWord": '{web_Noflow}',
            "necessary": true,
            "display": DATA.data.staleTimeEn == 1 ? true : false,
            "inputData": {
                "type": 'text',
                "name": 'staleTime',
                "value": data.staleTime || '',
                "checkDemoFunc": ['checkInput', 'num', '5', '1440']
            },
            "afterWord": '{min}'
        }, {
            "prevWord": '{web_pwdMod}',
            "inputData": {
                "type": 'checkbox',
                "name": 'selfenabled',
                "defaultValue": data.selfenabled || "on",
                "items": [{
                    "value": 'on',
                    'checkOn': 'on',
                    'checkOff': 'off'
                }]
            },
            "afterWord": ''
        }];
        var IG = require('InputGroup');
        var $idom = IG.getDom(il);
        var ll1 = [{
                id: 'modaifyAuthPage',
                name: '{edit}',
                clickFunc: function($thisDom) {
                    webEditClick();
                }
            }
            //		, {
            //			id: 'addAuthPage',
            //			name: '新增',
            //			clickFunc: function($thisDom) {
            //				webAddClick();
            //			}
            //		}
        ];
        IG.insertLink($idom, 'authPage', ll1);

        Translate.translate([$idom, modalObj.getDom()], dicArr);


        modalObj.insert($idom);
        modalObj.show();

    }
    /*
     * - 认证页面 -- 二级弹框
     */
    //认证修改
    function webEditClick() {
        //获取数据
        var newdata = {};

        //编辑的配置
        var config = {
            title: '{web_editAuthPage}',
            id: 'webAuthEditModal',
            data: DATA.data
        };

        //执行制作认证页小弹框方法
        makeWebAuthModal(config);

    }
    //认证新增
    function webAddClick() {
        //新增的配置
        var config = {
            title: '{web_addAuthPage}',
            id: 'webAuthAddModal'
        };

        //执行制作认证页小弹框方法
        makeWebAuthModal(config);
    }

    /**
     * 认证弹框
     */
    function makeWebAuthModal(config) {
        var modallist = {
            id: config.id || '',
            title: config.title || '',
            btns: [{
                    type: 'save',
                    clickFunc: function($this) {
                        var $modal = $this.parents('.modal');
                        saveBtnWebAuthPageEdit($modal);
                    }
                },
                {
                    'id': 'preview',
                    'name': '{preview}',
                    'clickFunc': function($btn) {
						require('Tips').showConfirm(T('previewSave'),function(){
							var jumpUrl = "/noAuth/user_auth.html";
							window.open(jumpUrl);
						});
                    }
                },
                {
                    "type": 'reset'
                }, {
                    "type": 'close'
                }
            ]

        };
        var Modal = require('Modal');
        var modalObj = Modal.getModalObj(modallist);
        DATA.modalObj_webath = modalObj;

        var data = config.data || {};
        var inputlist = [{
                "necessary": true,
                "display": false,
                "prevWord": '{pageName}',
                "inputData": {
                    "type": 'text',
                    "name": 'webAuthSuccessName',
                    "value": data.webAuthSuccessName || '',
                    "checkDemoFunc": ['checkInput', 'name', '1', '31', '3'],
                },
                "afterWord": ''
            },
            {
                "prevWord": '{Note}',
                "inputData": {
                    "type": 'text',
                    "name": 'webAuthSuccessNote',
                    "value": data.webAuthSuccessNote || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '31', '3'],
                },
                "afterWord": ''
            },
            {
                "prevWord": '{web_PageUse}',
                "inputData": {
                    "type": 'select',
                    "name": 'en_picture',
                    "defaultValue": data.en_picture || '2',
                    items: [{
                            name: '{web_definePage}',
                            value: '2',
                            control: 'demo'
                        },
                        {
                            name: '{web_uploadPage}',
                            value: '1',
                            control: 'upload'
                        },
                    ]
                },
                "afterWord": ''
            },
            {
                "sign": 'upload',
                "prevWord": '',
                "inputData": {
                    "type": 'text',
                    "name": 'uploadAuthPagePath',
                    "value": data.webFileNames || '',
                },
                "afterWord": ''
            },
            {
                "sign": 'demo',
                "prevWord": '{web_bgPic}',
                "inputData": {
                    "type": 'radio',
                    "name": 'activePic',
                    "defaultValue": data.activePic || 1,
                    items: [{
                            name: '{open}',
                            value: 1,
                            control: 'chooseimg'
                        },
                        {
                            name: '{close}',
                            value: 0
                        }
                    ]
                },
                "afterWord": ''
            },
            {
                "sign": 'chooseimg',
                "prevWord": '{web_chooseImage}',
                "inputData": {
                    "type": 'radio',
                    "name": 'chooseimg',
                    "defaultValue": data.chooseimg || 'importpictureurl',
                    items: [{
                            name: '{web_netUrl}',
                            value: 'importpictureurl',
                            control: 'netimg'
                        },
                        {
                            name: '{web_uploadBgImage}',
                            value: 'uploadImg',
                            control: 'upimg'
                        }
                    ]
                },
                "afterWord": ''
            },
            {
                "sign": 'netimg',
                "prevWord": '{web_ImageUrl}',
                "inputData": {
                    "type": 'text',
                    "name": 'importpictureurl',
                    "value": data.pictureUrl || '',
                    "checkDemoFunc": ['checkInput', 'name', '1', '221', '[a-zA-z]+://[^\s]*'],
                },
                "afterWord": ''
            },
            {
                "sign": 'upimg',
                "prevWord": '',
                "inputData": {
                    "type": 'text',
                    "name": 'imgUploadChooseFile',
                    "value": data.imgUploadChooseFile || '',
                },
                "afterWord": ''
            },
            {
                "sign": 'upimg',
                "prevWord": '',
                "inputData": {
                    "type": 'text',
                    "name": 'imgUploadChooseFileText',
                    "value": '{web_allowUpload}',
                },
                "afterWord": ''
            },
            {
                'sign': 'demo',
                "prevWord": '{web_tipstitle}',
                "inputData": {
                    "type": 'text',
                    "name": 'tipstitle',
                    "value": data.tipstitle || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '31', '3'],
                },
                "afterWord": ''
            },
            {
                'sign': 'demo',
                "prevWord": '{web_tipsinfo}',
                "inputData": {
                    "type": 'text',
                    "name": 'tipsinfo',
                    "value": data.tipsinfo || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '31', '3'],
                },
                "afterWord": ''
            },
            {
                'sign': 'demo',
                "prevWord": '{web_contact}',
                "inputData": {
                    "type": 'textarea',
                    "name": 'hidcontact',
                    "value": data.hidcontact || '',
                    "checkDemoFunc": ['checkInput', 'name', '0', '300', '[\s\S]*'],
                },
                "afterWord": ''
            },

        ];
        var IG = require('InputGroup');
        var $dom = IG.getDom(inputlist);

        $dom.find('[name="imgUploadChooseFile"]').prop('defaultValue',DATA.data.picturedir);
        //增加上传小控件 调整布局
        $dom.find('[name="imgUploadChooseFile"]').attr('disabled', 'disabled');
        $dom.find('[name="imgUploadChooseFile"]').before('<button class="btn-sm btn-primary" id="choosefile" style="margin-right:10px">选择文件</button>');
        //$dom.find('[name="imgUploadChooseFile"]').after('<button class="btn-sm btn-primary" id="uploadfile" style="margin-left:10px">提交</button>');
        $dom.find('[name="imgUploadChooseFile"]').parent().attr('colspan', '3').next().remove();
        $dom.find('[name="imgUploadChooseFile"]').after('<input type="file" id="uploadFileHide"  name="filename" style="display:none"/>');


        $dom.find('[name="imgUploadChooseFileText"]').after('<span>注意:只能导入小于10M的图片，且文件名中不包含中文字符。</span>');
        $dom.find('[name="imgUploadChooseFileText"]').parent().attr('colspan', '3').next().remove();
        $dom.find('[name="imgUploadChooseFileText"]').remove();

        $dom.find('[name="uploadAuthPagePath"]').attr('disabled', 'disabled');
        $dom.find('[name="uploadAuthPagePath"]').before('<button class="btn-sm btn-primary" id="choosefile1" style="margin-right:10px">选择文件</button>');
        $dom.find('[name="uploadAuthPagePath"]').after('<a class="u-inputLink" id="downloadModel1">下载模版</a>');
        //$dom.find('[name="uploadAuthPagePath"]').after('<button class="btn-sm btn-primary" id="uploadfile1" style="margin-left:10px;margin-right:10px">提交</button>');
        $dom.find('[name="uploadAuthPagePath"]').parent().attr('colspan', '3').next().remove();
        $dom.find('[name="uploadAuthPagePath"]').after('<input type="file" id="uploadFileHide1" name="filename1" style="display:none"/>');

		// 控制自定义背景图 和上传图片的选项功能
		if(DATA.data.WebAuth_Advance !== undefined){
			if(DATA.data.WebAuth_Advance == 'off'){
				$dom.find('[name="chooseimg"][value="uploadImg"]').hide();
				$dom.find('[name="chooseimg"][value="uploadImg"]').next('span').hide();
				$dom.find('[name="en_picture"]>[value="1"]').hide();
			}
		}

        $dom.find('#uploadFileHide').wrap('<form id="authBGIMG" name="authBGIMG" style="display:none" enctype="multipart/form-data"></form>');
        $dom.find('#uploadFileHide').after('<input type="text" name="filenames1" />');
        $dom.find('#uploadFileHide1').wrap('<form id="authPAGE" name="authBGIMG" style="display:none" enctype="multipart/form-data"></form>');
        $dom.find('#uploadFileHide1').after('<input type="text" name="filenames2" />');
        //给上传浏览文件按钮绑定事件
        $dom.find('#uploadFileHide1').change(function() {
            $dom.find('[name="uploadAuthPagePath"],[name="filenames2"]').val($dom.find('#uploadFileHide1').val().substr($dom.find('#uploadFileHide1').val().lastIndexOf('\\') + 1));
        });

        $dom.find('#uploadFileHide').change(function() {
            $dom.find('[name="imgUploadChooseFile"],[name="filenames1"]').val($dom.find('#uploadFileHide').val().substr($dom.find('#uploadFileHide').val().lastIndexOf('\\') + 1));
        });

        $dom.find('#choosefile').click(function() {
            $(this).blur();
            $dom.find('#uploadFileHide').click();
        });

        $dom.find('#uploadfile').click(function() {
            $(this).blur();
            //上传文件ajax……
        });

        $dom.find('#choosefile1').click(function() {
            $(this).blur();
            $dom.find('#uploadFileHide1').click();
        });

        $dom.find("#downloadModel1").click(function() {
            var $btn = $(this);
            if ($btn.next().attr('name') == 'Device_Config') {
                $btn.next().remove();
            }
            var $afterdom = $('<form style="display:none" action="/goform/" method="post" name="Device_Config" enctype="multipart/form-data"><input name="importpage" type="file"></form>');
            $btn.after($afterdom);
            $afterdom[0].action = "/goform/formDownloadPage";
            $afterdom[0].submit();
        })

        // $dom.find('#uploadfile1').click(function(){
        // 	$(this).blur();
        // 	//上传文件ajax……
        // });

        var Translate = require('Translate');
        var tranDomArr = [$dom, modalObj.getDom()];
        var dicArr = ['common', 'doUserAuthentication'];
        Translate.translate(tranDomArr, dicArr);

        modalObj.insert($dom);
		// 给重填绑定清除已选文件的方法
		modalObj.getDom().find('#reset').click(function(){

			modalObj.getDom().find('#uploadFileHide').val('');

		});


        modalObj.show();


    }
    /*
     * - 认证成功页面 -- 二级弹框
     */

    //认证成功修改
    function webSuccessEdit() {
        //获取数据
        var data = {};

        var config = {
            id: 'webSuccessEditModal',
            title: '编辑认证成功页面',
            data: data
        };
        makeWebAuthSuccessModal(config);
    }
    //认证成功新增
    function webSuccessAdd() {
        var config = {
            id: 'webSuccessAddModal',
            title: '新增认证成功页面'
        };
        makeWebAuthSuccessModal(config);
    }
    //制作认证成功弹框
    function makeWebAuthSuccessModal(config) {
        var modallist = {
            id: config.id || '',
            title: config.title || '',
            btns: [{
                    type: 'save',
                    clickFunc: function($this) {
                        alert('保存在这');
                    }
                },
                {
                    'id': 'preview',
                    'name': '预览',
                    'clickFunc': function($btn) {
                        alert('预览');
                    }
                },
                {
                    "type": 'reset'
                }, {
                    "type": 'close'
                }
            ]

        };
        var Modal = require('Modal');
        var modalObj = Modal.getModalObj(modallist);

        var data = config.data || {};

        var inputlist = [{
                "prevWord": '页面名称',
                "necessary": true,
                "inputData": {
                    "type": 'text',
                    "name": 'pageName',
                    "value": data.pageName || ''
                },
                "afterWord": ''
            },
            {
                "prevWord": '备注',
                "inputData": {
                    "type": 'text',
                    "name": 'note',
                    "value": data.note || ''
                },
                "afterWord": ''
            },
            {
                "prevWord": '背景图片',
                "inputData": {
                    "type": 'select',
                    "name": 'bgimg',
                    "defaultValue": data.bgimg || 'defaultPage',
                    "items": [{
                            name: '使用第三方页面',
                            value: 'userThirdPage',
                            control: '1'
                        },
                        {
                            name: '使用默认页面',
                            value: 'defaultPage',
                            control: '2'
                        },
                        {
                            name: '上传自定义页面',
                            value: 'uploadNewPage',
                            control: '3'
                        },
                    ]
                },
                "afterWord": ''
            },
            {
                "sign": '1',
                "prevWord": '链接地址',
                "inputData": {
                    "type": 'text',
                    "name": 'ScslinkAdress',
                    "value": data.ScslinkAdress || ''
                },
                "afterWord": ''
            },
            {
                "sign": '3',
                "prevWord": '',
                "inputData": {
                    "type": 'text',
                    "name": 'ScsfilePath',
                    "value": data.ScsfilePath || ''
                },
                "afterWord": ''
            },
        ];
        var IG = require('InputGroup');
        var $dom = IG.getDom(inputlist);

        //增加上传小控件 调整布局
        $dom.find('[name="ScsfilePath"]').before('<button class="btn-sm btn-primary" id="choosefile" style="margin-right:10px">选择文件</button>');
        $dom.find('[name="ScsfilePath"]').after('<a class="u-inputLink" id="downloadModel">下载模版</a>');
        // $dom.find('[name="ScsfilePath"]').after('<button class="btn-sm btn-primary" id="uploadfile" style="margin-left:10px;margin-right:10px">提交</button>');
        $dom.find('[name="ScsfilePath"]').parent().attr('colspan', '3').next().remove();
        $dom.find('[name="ScsfilePath"]').after('<input type="file" id="uploadFileHide" style="display:none"/>');
        //给上传浏览文件按钮绑定事件
        $dom.find('#uploadFileHide').change(function() {
            $dom.find('[name="ScsfilePath"]').val($dom.find('#uploadFileHide').val().substr($dom.find('#uploadFileHide').val().lastIndexOf('\\') + 1));
        });

        $dom.find('#choosefile').click(function() {
            $(this).blur();
            $dom.find('#uploadFileHide').click();
        });

        // $dom.find('#uploadfile').click(function(){
        // 	$(this).blur();
        // 	//上传文件ajax……
        //
        //
        // });
        $dom.find('#downloadModel').click(function() {
            //下载模板……


        });


        modalObj.insert($dom);
        modalObj.show();
    }

    function saveBtnWebAuthPageEdit($modal) {
        var Tips = require('Tips');
        var SRLZ = require('Serialize');
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            Tips.showError('{saveFail}');
            //tips.showError('不能添加静态路由！',3);
            return;
        }

        var strArr = SRLZ.getQueryArrs($modal),
            queryJson = SRLZ.queryArrsToJson(strArr);

        DATA.data.activePic = queryJson.activePic;
        DATA.data.chooseimg = queryJson.chooseimg;
        DATA.data.en_picture = queryJson.en_picture;
        DATA.data.imgUploadChooseFile = queryJson.imgUploadChooseFile;
        DATA.data.importpictureurl = queryJson.importpictureurl;
        DATA.data.pictureUrl = queryJson.importpictureurl;
        DATA.data.tipsinfo = queryJson.tipsinfo;
        DATA.data.tipstitle = queryJson.tipstitle;
        DATA.data.uploadAuthPagePath = queryJson.uploadAuthPagePath;
        DATA.data.webAuthSuccessName = queryJson.webAuthSuccessName;
        DATA.data.webAuthSuccessNote = queryJson.webAuthSuccessNote;

        DATA.data.enabled = (DATA.data.lively == 1 ? 'on' : 'off');
        DATA.data.authType = DATA.data.authtype;
        DATA.data.ajaxType = 'authEn';

        var temp = queryJson.hidcontact;
        temp = temp.replace(/%/g, "%25");
        temp = temp.replace(/\&/g, "%26");
        DATA.data.hidcontact = temp.replace(/\+/g, "%2B");

        DATA.data.noAuthEn = DATA.oldData.noAuthEn;
        DATA.data.noAuthType = DATA.oldData.noAuthType;
        if (DATA.oldData.noAuthType == 'ip') {
            DATA.data.noAuthData = DATA.oldData.noAuthIp;
        } else if (DATA.oldData.noAuthType == 'org') {
            DATA.data.noAuthData = DATA.oldData.orgData;
        } else {
            DATA.data.noAuthData = '';
        }
        var strArr = SRLZ.queryJsonToStr(DATA.data);

        //根据选择不同觉得图片传送方式


        if (queryJson.en_picture == 2) {
            var formData = new FormData($("#authBGIMG")[0]);

            if (queryJson.chooseimg == "uploadImg" && queryJson.activePic == 1) {
                if ($("#uploadFileHide").val() == "") {
                    if(DATA.data.picturedir != ""){
                        $.ajax({
                            url: "goform/formWebAuthGlobalConfig",
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
                                        DATA.modalObj_webath.hide();
                                        $('[href="#1"]').trigger('click');
                                    } else {
                                        Tips.showWarning(data["saveFail"], 2);
                                    }
                                } else {
                                    Tips.showWarning('{parseStrErr}', 2);
                                }

                            }
                        });
                    }else{
                        Tips.showWarning('{FileIsNull}');
                    }

                    return -1;
                }
				var pictureFilename = $("#uploadFileHide").val();
				/*
				if(/.*[\u4e00-\u9fa5]+.*$/.test(pictureFilename))
				{
					require('Tips').showWarning('{fileNameCanBeChinese}');
					return false;
				}
				*/
				var point = pictureFilename.lastIndexOf(".");
				var type = pictureFilename.substr(point);
				if(type!=".jpg"&&type!=".JPG"){
					require('Tips').showWarning("{uploadPicture}");
					return false;
				}
                $.ajax({
                    url: 'goform/formPictureLoad',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    async: false,
                    success: function(returndata) {
                        var codeStr = returndata;
						var variableArr = ['status', 'errorstr','picturedir'];
                        var result = require('Eval').doEval(codeStr, variableArr);
						DATA.data.picturedir = result.data.picturedir;
                        $.ajax({
                            url: "goform/formWebAuthGlobalConfig",
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
                                        DATA.modalObj_webath.hide();
                                        $('[href="#1"]').trigger('click');
                                    } else {
                                        Tips.showWarning(data["saveFail"], 2);
                                    }
                                } else {
                                    Tips.showWarning('{parseStrErr}', 2);
                                }

                            }
                        });

                    },
                    error: function(returndata) {

                        Tips.showWarning(data["saveFail"]);
                    }
                });
            } else {
                /*图片链接提交*/
                $.ajax({
                    url: "goform/formPictureUrl",
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
                                $.ajax({
                                    url: "goform/formWebAuthGlobalConfig",
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
                                                DATA.modalObj_webath.hide();
                                                $('[href="#1"]').trigger('click');
                                            } else {
                                                Tips.showWarning(data["saveFail"], 2);
                                            }
                                        } else {
                                            Tips.showWarning('{parseStrErr}', 2);
                                        }

                                    }
                                });
                            } else {
                                Tips.showWarning(data["saveFail"], 2);
                            }
                        } else {
                            Tips.showWarning('{parseStrErr}', 2);
                        }
                    }
                });
            }
        } else if (queryJson.en_picture == 1) {
            var formData = new FormData($("#authPAGE")[0]);
            if ($("#uploadFileHide1").val() == "") {
                Tips.showWarning('{FileIsNull}');
                return -1;
            }
			var pageFilename = $("#uploadFileHide1").val();
//			if(/.*[\u4e00-\u9fa5]+.*$/.test(pageFilename))
//			{
//				require('Tips').showWarning('{fileNameCanBeChinese}');
//				return false;
//			}
			var point = pageFilename.lastIndexOf(".");

			var type = pageFilename.substr(point);
			if(type!=".html"){
				require('Tips').showWarning('{uploadOnlyHtml}');
				return false;
			}
            $.ajax({
                url: 'goform/formImportPage',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                async: false,
                success: function(returndata) {
                    $.ajax({
                        url: "goform/formWebAuthGlobalConfig",
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
                                    DATA.modalObj_webath.hide();
                                    $('[href="#1"]').trigger('click');
                                } else {
                                    Tips.showWarning(data["saveFail"], 2);
                                }
                            } else {
                                Tips.showWarning('{parseStrErr}', 2);
                            }

                        }
                    });
                },
                error: function(returndata) {

                    Tips.showWarning(data["saveFail"]);
                }
            });
        } else if (queryJson.en_picture == 0) {
            console.log("默认页面");
        } else {
            alert("获取数据错误");
        }

    }


    function saveBtnWebAuth($modal) {
        var SRLZ = require('Serialize');
        var Tips = require('Tips');
        var InputGroup = require('InputGroup');
        var len = InputGroup.checkErr($modal);
        if (len > 0) {
            Tips.showError('{saveFail}');
            return;
        }

        var strArr = SRLZ.getQueryArrs($modal),
            queryJson = SRLZ.queryArrsToJson(strArr);
        if (queryJson.staleTime == "") {
            queryJson.staleTime = 0;
        }
        DATA.data.staleTime = queryJson.staleTime;
        DATA.data.selfenabled = queryJson.selfenabled;

        //if(DATA.data.chooseimg == 1){
        //	DATA.data.chooseimg = "uploadImg";
        //}else{
        //	DATA.dara.chooseimg = "importpictureurl";
        //}

        DATA.data.enabled = (DATA.data.lively == 1 ? 'on' : 'off');
        DATA.data.authType = DATA.data.authtype;
        DATA.data.ajaxType = 'authEn';
        DATA.data.noAuthEn = DATA.oldData.noAuthEn;
        DATA.data.noAuthType = DATA.oldData.noAuthType;

        var temp = DATA.data.hidcontact;
        temp = temp.replace(/%/g, "%25");
        temp = temp.replace(/\&/g, "%26");
        DATA.data.hidcontact = temp.replace(/\+/g, "%2B");

        if (DATA.oldData.noAuthType == 'ip') {
            DATA.data.noAuthData = DATA.oldData.noAuthIp;
        } else if (DATA.oldData.noAuthType == 'org') {
            DATA.data.noAuthData = DATA.oldData.orgData;
        } else {
            DATA.data.noAuthData = '';
        }

        var strArr = SRLZ.queryJsonToStr(DATA.data);
        $.ajax({
            url: "goform/formWebAuthGlobalConfig",
            type: 'POST',
            data: strArr,
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
                        Tips.showSuccess('{saveSuccess}');
                        $modal.modal('hide');
                        setTimeout(function() {
                            $modal.remove();
                        }, 450);
                        $('[href="#1"]').trigger('click');
                    } else {
                        var errorStr = data['errorstr'];
                        Tips.showWarning('{saveFail}' + errorStr);
                    }
                } else {
                    Tips.showWarning('{parseStrErr}');
                }
            }
        });
    }



    function display(oldData) {
        //ajax获取数据，获取成功执行生产弹框方法
        var data = {};
        //获取配置信息
        $.ajax({
            url: 'common.asp?optType=webAuthPage',
            type: 'GET',
            success: function(result) {
                var doEval = require('Eval');
                var codeStr = result,
                    variableArr = ['lively', 'authtype', 'tipstitle',
                        'tipsinfo', 'hidcontact', 'pictureUrl', 'picturedir',
                        'activePic', 'webAuthSuccessName', 'webAuthSuccessNote',
                        'en_picture', 'chooseimg', 'staleTime', 'selfenabled', 'staleTimeEn','WebAuth_Advance','webFileNames'
                    ];
                result = doEval.doEval(codeStr, variableArr),
                    isSuccess = result["isSuccessful"];
                if (isSuccess) {
                    //var DATA['a'] = result;
                    data = result["data"];
                    if (data.chooseimg == 0) {
                        data.chooseimg = 'importpictureurl';
                    } else {
                        data.chooseimg = 'uploadImg';
                    }
                    data.authPage = data.webAuthSuccessName;
                    // if(data.en_picture == 2)
                    // {
                    // 	data.chooseimg = 'importpictureurl';
                    // }else if(data.en_picture == 3){
                    // 	data.en_picture = 2
                    // 	data.chooseimg = 'uploadImg';
                    // }
                    DATA.data = data;
                    DATA.oldData = oldData;
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
