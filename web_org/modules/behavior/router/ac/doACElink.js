define(function(require, exports, module){	
	function tl(str){
		return require('Translate').getValue(str,['doSysMaintenance','common','doNetworkTools']);
	}	
	exports.display = function(){	
		var dp=require('P_config/config');
		console.log(dp);
		var Path = require('Path');
		var Translate = require('Translate'); 
	 	var dicNames = ['common', 'doSysMaintenance','doNetworkTools']; 
	 	Translate.preLoadDics(dicNames, function(){ 
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : 'Elink管理',
	  		"links"     : [
	  			{"link" : '', "title" : 'Elink管理'}
	  		],
	  		"currentTitle" : ''
			};
			Path.displayPath(pathList);
			var Tabs = require('Tabs');
			// 加载标签页
			var selectId=[];
			var tabsList = [];			
			tabsList.push({"id" : "1", "title" :'Elink管理'});
			selectId.push('1');

				// {"id" : "1", "title" :tl('serverMgmt')},
				// {"id" : "2", "title" :tl('sysUpdate')},
				// {"id" : "3", "title" :tl('configMgmt')},
				// {"id" : "4", "title" :tl('productLicense')},
				// {"id" : "5", "title" :tl('deviceReboot')},

			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
//				Path.changePath($(this).text());
				require.async('./displayElink', function(obj){	
					obj.display($('#1'));
				});
			});
			

		    $('a[href="#'+selectId[0]+'"]').trigger('click');
		    	});

		   // setInterval(function(){},);
	}
})
