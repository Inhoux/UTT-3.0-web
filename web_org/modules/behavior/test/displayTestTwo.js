define(function(require, exports, module) {
	
	function display($container) {
		$('#delete').attr('yy', 'hhhh')
		// 清空标签页容器
		$container.empty();
		var BtnGroup = require('BtnGroup');
		var btnList  = [
			{
				'id'        : 'add',
				'name'      : 'tianjia',
				'clickFunc' : function(){
					alert(3333)
				}
			},
			{
				'id'        : 'delet',
				'name'      : 'shanchu',
				'clickFunc' : function(){
					alert('two delete clickFunc')
				}
			},
		];
		var $btn = BtnGroup.getDom(btnList);
		$container.append($btn)
		$('#delet').click(function(){
			alert('two delete')
		})

	}
	// 提供对外接口
	module.exports = {
		display: display
	};
});