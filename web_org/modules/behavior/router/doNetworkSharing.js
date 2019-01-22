define(function(require, exports, module){	
	function tl(str){
		return require('Translate').getValue(str,['common']);
	}	
	exports.display = function(){	
	    var dics = ['common','doNetworkManagementStrategy']; 
	    var Translate = require('Translate'); 
	    Translate.preLoadDics(dics, function(){
		var dp=require('P_config/config');
		var Path = require('Path');
		var Translate = require('Translate'); 
	 	var dicNames = ['common']; 
	 	Translate.preLoadDics(dicNames, function(){ 
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : tl('sysConfig'),
	  		"links"     : [
	  			{"link" : '#/system_config/network_sharing', "title" : '{netWorkShare}'}
	  		],
	  		"currentTitle" : ''
			};
			Path.displayPath(pathList);
			var Tabs = require('Tabs');
			// 加载标签页
			var selectId=[];
			var tabsList = [];			
			if(dp.NetShareManage==1){
				tabsList.push({"id" : "1", "title" :'{netWorkShare}'});
				selectId.push('1');
			}
			if(dp.FtpServer==1){
				tabsList.push({"id" : "2", "title" :'{ftpShare}'});
				selectId.push('2');
			}
			if(dp.ShareAccountList==1){
				tabsList.push({"id" : "3", "title" :'{accountSet}'});
				selectId.push('3');
			}

			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			require('Translate').translate([$('.main-right')],['common','doNetworkManagementStrategy']);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayNetworkSharing', function(obj){	
					obj.display($('#1'));
				});
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayFTPSharing', function(obj){		
					obj.display($('#2'));
				});
			});
			$('a[href="#3"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayAccountSet', function(obj){		
					obj.display($('#3'));
				});
			});

		    $('a[href="#'+selectId[0]+'"]').trigger('click');
		    	});
	    });

		   // setInterval(function(){},);
	}
})
