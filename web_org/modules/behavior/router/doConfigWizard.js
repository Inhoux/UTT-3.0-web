define(function(require, exports, module){
	require('jquery');
	exports.display = function(){
		var dics = ['common','doRFT']; 
		var Translate = require('Translate'); 
		Translate.preLoadDics(dics, function(){ 
			var dicArr     = ['common'];
			function T(_str){
				return Translate.getValue(_str, dicArr);
			}
			var Path = require('Path');
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : T('configWizard'),
	  		"links"     : [
	  			{"link" : '#/config_wizard/config_wizard', "title" : T('configWizard')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : T('configWizard')}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
//				Path.changePath($(this).text());
				require.async('./displayConfigWizard.js', function(obj){		
					obj.display($('#1'));
					/*去除多级导航*/
					$('#path>ol>li').eq(1).hide();
					$('#path>ol>li').eq(2).hide();
					
				});
			});
			
		    $('a[href="#1"]').trigger('click');
	});
	}

})
