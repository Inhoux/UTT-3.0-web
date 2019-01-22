define(function(require, exports, module){		
	exports.display = function(){
		var Translate = require('Translate'); 
		var dics = ['common','doNetworkManagementStrategy','lanConfig']; 
		Translate.preLoadDics(dics, function(){ 
		
			var Path = require('Path');
			require('jquery');
			var config = require('P_config/config');
			var DATA = {};
			var Translate  = require('Translate');
			var dicArr     = ['common','doNetworkManagementStrategy'];
			function T(_str){
				return Translate.getValue(_str, dicArr);
			}
			// 加载路径导航
			var pathList = 
			{
	  		"prevTitle" : T('sysConfig'),
	  		"links"     : [
	  			{"link" : '#/system_config/network_manage_strategy', "title" : T('NetManageStrate')}
	  		],
	  		"currentTitle" : ''
			};
				Path.displayPath(pathList);
				var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [];
			var tabsList1={"id" : "1", "title" : T("sysAdmin")};
			var tabsList2={"id" : "2", "title" : T("lanAccessCtrl")};
			var tabsList3={"id" : "3", "title" : T("remoteMan")};
			var tabsList4={"id" : "4", "title" : T("netAccessStr")};
			var tabsList5={"id" : "5", "title" : T("langOpt")};
			/*只内网访问控制标签加以控制,其他几个标签用到再加*/
			tabsList.push(tabsList1);

			if(config.accessCtrl==1){
				tabsList.push(tabsList2);
			}
			tabsList.push(tabsList3);
			tabsList.push(tabsList4);
			tabsList.push(tabsList5);
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);
			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayAdminor', function(obj){	
					obj.display($('#1'));
				});
			});
			if(config.accessCtrl==1){
				$('a[href="#2"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayIntranetAccessControl', function(obj){		
						obj.display($('#2'));
					});
				});
			}
			$('a[href="#3"]').attr('refreshTime','0').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayRemoteManagement', function(obj){		
					obj.display($('#3'));
				});
			});
			$('a[href="#4"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayRemoteAccessPolicy', function(obj){		
					obj.display($('#4'));
				});
			});		
			$('a[href="#5"]').click(function(event) {
				$('#5').empty();
				Path.changePath($(this).text());
				require.async('./displayLangChose', function(obj){		
					obj.display($('#5'));
				})
			});					
		    $('a[href="#1"]').trigger('click');

		    //setInterval(function(){},);
		});
	}
})
