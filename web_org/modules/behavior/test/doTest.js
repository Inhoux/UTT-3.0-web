define(function(require, exports, module){
	function display(){
		require.async(['Tabs', 'Path'], function(Tabs, Path){
			var pathData = {
	  			"prevTitle" : '网络配置',
	  			"links"     : [
	  				{"link" : '#/test', "title" : '测试页面'}
	  			],
	  			"currentTitle" : ''
			};
			Path.displayPath(pathData);
			var tabsList = [
				{"id" : "one", "title" : "第一个标签页"},
				{"id" : "two", "title" : "第二个标签页"}
			];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#one"]').click(function(event) {
				Path.changePath('第一个标签页');
				require.async('./displayTestOne', function(obj){		
					obj.display($('#one'));
				});
			});
			$('a[href="#two"]').click(function(event) {
				Path.changePath('第二个标签页');
				require.async('./displayTestTwo', function(obj){		
					obj.display($('#two'));
				});
			});
		    $('a[href="#one"]').trigger('click');
		});
	}
	module.exports = {
		display : display
	};
});