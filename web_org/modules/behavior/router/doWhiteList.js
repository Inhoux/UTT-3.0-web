define(function(require, exports, module){
// QQ保存
// /goform/ConfigExceptQQ
// ALI保存
// /goform/ConfigExceptAli
// 全局设置
// /goform/formExceptQQGlobalConfig
// /goform/formExceptAliGlobalConfig
// 删除QQ
// /goform/formExceptQQDel
// 删除阿里
// /goform/formExceptAliDel
	function tl(str){
		return require('Translate').getValue(str,['common','error','doWhiteList']);
	}
	require('jquery');
	var DATA = {};
	var Tips = require('Tips');
	module.exports = {
		display: display
	};
	function display($container) {
	// exports.display = function(){
		var Path = require('Path');
			// 加载路径导航
			var Translate = require('Translate'); 
		 	var dicNames = ['common', 'doWhiteList']; 
		 	Translate.preLoadDics(dicNames, function(){ 				
			var pathList = 
			{
	  		"prevTitle" : tl('behaviorMgment'),
	  		"links"     : [
	  			{"link" : '#/behavior_management/white_list', "title" : tl('whiteList')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
			// 加载标签页
			var Tabs = require('Tabs');
			var tabsList = [
				{"id" : "1", "title" : tl('whiteList')},
				{"id" : "2", "title" : '全局配置'}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayWhiteList', function(obj){	
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayWhiteListSetting', function(obj){	
					obj.display($('#2'));
				});
			});
		    $('a[href="#1"]').trigger('click');
		});
	}

})
