define(function(require, exports, module) {
    require('jquery-2.1.1.min.js');
    var Translate = require('Translate');
    exports.display = function() {
        var dics = ['doUserAuthentication', 'doPeopleOrganize'];
        Translate.preLoadDics(dics, function() {
            var Path = require('Path');
            //鑾峰緱璁よ瘉閰嶇疆椤甸潰
            var dicArr = ['common', 'doUserAuthentication'];

            function T(_str) {
                return Translate.getValue(_str, dicArr);
            }
            // 加载路径导航
            var pathList = {
                "prevTitle": T('UserManagement'),
                "links": [{
                    "link": '#/user_management/user_authentication',
                    "title": T('UserAuth')
                }],
                "currentTitle": ''
            };
            Path.displayPath(pathList);
            // 加载标签页
            var Tabs = require('Tabs');
            var tabsList = [{
                    "id": "1",
                    "title": T('UserAuthManagement')
                },
                {
                    "id": "2",
                    "title": T('UserAuthAccount')
                }
            ];
            // 生成标签页，并放入页面中
            Tabs.displayTabs(tabsList);
            $('a[href="#1"]').click(function(event) {
                Path.changePath($(this).text());
                require.async('./displayAuthConfig', function(obj) {
                    obj.display($('#1'));
                });
            });
            $('a[href="#2"]').click(function(event) {
                Path.changePath($(this).text());
                require.async('./displayAuthAccount', function(obj) {
                    obj.display($('#2'));
                });
            });
            $('a[href="#1"]').trigger('click');
        });
    }
})
