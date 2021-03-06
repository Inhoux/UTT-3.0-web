define(function(require, exports, module){
    function tl(str){
        return require('Translate').getValue(str,['doTimePlan','doAddressGroup']);
    }
    // 本模块提供的接口，用于生成页面
    exports.display = function(){
        // 加载路径导航模板模块
        var Path = require('Path');
        var Translate = require('Translate'); 
        var dicNames = ['doTimePlan','doAddressGroup']; 
        Translate.preLoadDics(dicNames, function(){         
        // 路径导航配置数据
        var pathList = {
            "prevTitle" : tl('sysObj'),
            "links"     : [
                {"link" : '#/system_object/time_plan', "title" : tl('timePlan')}
            ],
            "currentTitle" : ''
        };
        Path.displayPath(pathList);
        // 加载标签页模板模块
        var Tabs = require('Tabs');
        // 标签页配置数据
        var tabsList = [
            {"id" : "1", "title" : tl("timePlan")}
        ];
        // 生成标签页，并放入页面中
        Tabs.displayTabs(tabsList);
        // 为第一个标签页添加点击事件
        $('a[href="#1"]').click(function(event) {
            //Path.changePath('计划任务');
            // 异步加载 LAN口配置标签页的处理模块，并调用display方法
            require.async('./displayTimePlan', function(obj){      
                obj.display($('#1'));
            });
        });
        // 手动触发第一个标签页的点击事件
        $('a[href="#1"]').trigger('click');
        });
    }
});
