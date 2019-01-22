define(function(require, exports, module) {
	require('jquery');
	var config = require('P_config/config');
	var DATA = {};
	var Translate  = require('Translate');
	var dicArr     = ['common','doWANConfig'];
	function T(_str){
		return Translate.getValue(_str, dicArr);
	}
	exports.display = function() {
		var dics = ['doWANConfig']; 
		Translate.preLoadDics(dics, function(){
		function doWan(){
			var Path = require('Path');
			// 加载路径导航
			var pathList = {
				"prevTitle": T('netConfig'),
				"links": [{
					"link": '#/network_config/WAN_config',
					"title": T('WANConfig')
				}],
				"currentTitle": ''
			};
			Path.displayPath(pathList);
			var Tabs = require('Tabs');
			// 加载标签页
			
			var tabsList = [{
				"id": "1",
				"title": T("WANConfig")
			}];
			var gsetting={
				"id": "2",
				"title": T('gsetting')
			}
			if(DATA["maxwanIfCount"]>'1'){
			    if(0){
				tabsList.push(gsetting);
			    }
			}
			
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);

			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				require.async('./displayWANConfig', function(obj){		
					obj.display($('#1'));
				});
			});
			if(DATA["maxwanIfCount"]>'1'){
				$('a[href="#2"]').click(function(event) {
					Path.changePath($(this).text());
					require.async('./displayWANSetting', function(obj){		
						obj.display($('#2'));
					});
				});
			}
			$('a[href="#1"]').trigger('click');
		}
		$.ajax({
			url: 'common.asp?optType=WanIfCount',
			type: 'GET',
			success: function(result) {
				var doEval = require('Eval');
				var codeStr=result,variableArr = ['maxwanIfCount'];;
				result=doEval.doEval(codeStr,variableArr);
				DATA["maxwanIfCount"] = result['data']["maxwanIfCount"];
				doWan();
			}
		});
	});
	}

})
