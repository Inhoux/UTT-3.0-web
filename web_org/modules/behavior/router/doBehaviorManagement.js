define(function(require, exports, module){
    require('jquery');
    var dics = ['common','doBehaviorManagement','doTimePlan']; 
    module.exports = {
    	display : display
    };
    function display(){
    	var Translate = require('Translate');
    	Translate.preLoadDics(dics, function(){
    		displayPage();
    	});
    }
    function displayPage(){
	    var Path = require('Path');
	    /*
	       生成路径导航
	       */
	    var pathList = {
			"prevTitle" : '{com_netAction}',
			"links"     : [
				{"link" : '#/behavior_management/behavior_management', "title" : '{com_netAction}'}
			],
			"currentTitle" : ''
	    };
	    Path.displayPath(pathList, dics);
	    /*
	       生成标签页
	    */
	    var Tabs = require('Tabs');
	    var tabsList = [
	    	{"id" : "1", "title" : "{com_netAction}"}
	    ];
	    // 生成标签页，并放入页面中
	    Tabs.displayTabs(tabsList, null, dics);
	    $('a[href="#1"]').click(function(event) {
			require.async('./displayBehaviorManagement', function(obj){		
		    	obj.display($('#1'));
			});
	    });
	    $('a[href="#1"]').trigger('click');
    }
})
