define(function(require, exports, module){
    function tl(str){
        return require('Translate').getValue(str, ['common','lanConfig','doDydns','doPortMapping']);
    }
    // 本模块提供的接口，用于生成页面
    exports.display = function(){
        // 加载路径导航模板模块
        var Path = require('Path');
        var Translate = require('Translate'); 
        var dicNames = ['common', 'lanConfig', 'doDydns']; 
        Translate.preLoadDics(dicNames, function(){
             var dydns=tl('dydns');       
             var netConfig=tl('netConfig');
             // 路径导航配置数据
            var pathList = {
                "prevTitle" : netConfig,
                "links"     : [
                    {"link" : '#/network_config/DDNS', "title" : dydns}
                ],
                "currentTitle" : ''
            };
            Path.displayPath(pathList);
            // 加载标签页模板模块
            var Tabs = require('Tabs');
            // 标签页配置数据
            var tabsList = [
                {"id" : "1", "title" :dydns}
            ];
            // 生成标签页，并放入页面中
            Tabs.displayTabs(tabsList);
            // 为第一个标签页添加点击事件
            $('a[href="#1"]').click(function(event) {
                require.async('./displayDDNS', function(obj){      
                    obj.display($('#1'));
                });
            });
            // 手动触发第一个标签页的点击事件
            $('a[href="#1"]').trigger('click');
        });
    }
});
