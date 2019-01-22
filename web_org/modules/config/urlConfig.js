define(function(require, exports, module){
	require('P_static/js/action');
	var urlsConf = require('P_config/urls');
	//	菜单列表
	var _menus = urlsConf.menus;
	//	页面列表
	var _urls = urlsConf.urls;
	//  默认显示的页面
	var _defaultUrl = urlsConf.defaultUrl;
	/*
		所有需要显示的页面
	 */
	var _showUrls   = {};
	/**
	 * 获取所有需要显示的页面,即 _showUrls变量
	 * 如果是 debug模式，返回_urls变量，即全部显示
	 * 如果为空，从服务器请求数据，并设置 _showUrls 变量
	 * @author JeremyZhang
	 * @date   2016-11-22
	 * @return {[type]}   [description]
	 */
	function getShowUrls(){
		var Config  = require('P_config/config'),
			isDebug = Config.debug;
		if(isDebug){
			return _urls;
		}
		if(Object.keys(_showUrls).length === 0){
			setShowUrls();
		}
		return _showUrls;
	}
	/**
	 * 设置 _showUrls 变量
	 * @author JeremyZhang
	 * @date   2016-10-20
	 * @return {[type]}   [description]
	 */
	function setShowUrls(){
		
		var Config = require('P_config/config');
//		console.log(Config);
		for(var key in _urls){
			if(Config[key] == 1){
				_showUrls[key] = _urls[key];
			}
		}
	}  
	/**
	 * 获得侧边栏配置数据
	 * @author JeremyZhang
	 * @date   2016-10-20
	 * @return {[type]}   [description]
	 */
	function getSidebarConfig(){
//		console.log(_showUrls);
		/*
			获得所有需要显示的url
		 */
		var urls = getShowUrls();
		if(Object.keys(_showUrls).length === 0){
			return false;
		}
		/*
			侧边栏配置数据
		 */
		var sidebarMenus = [];
		/*
			定义好的菜单
		 */
		var defMenus = _menus;
		for(var menuName in defMenus){
			/*
				当前操作的菜单
			 */
			var defMenu = defMenus[menuName];
			/*
				当前菜单中可以显示的所有连接
			 */
			var links   = selectUrls(urls, menuName);
			if(links.length > 0){
				links.forEach(function(link){
					link["link"] = defMenu["link"] + link["link"];
				});
				/*
					要放入侧边栏配置数据中的菜单
				 */
				var menu = {
					pos   : defMenu["pos"],
					title : defMenu["title"],
					links : links
				};
				sidebarMenus.push(menu);
			} 
		}
		return sidebarMenus;
	}
	function selectUrls(urls, menuName){
		var links = [];
		for(var urlName in urls){
			var url = urls[urlName];
			if(url["menu"] == menuName){
				links.push({
					title : url["title"],
					link  : url["link"]
				});
			}
		}
		return links;
	}
	/**
	 * 获得路由配置数据
	 * @author JeremyZhang
	 * @date   2016-10-20
	 * @return {[type]}   [description]
	 */
	function getRouterConfig(){
		var routes  = getRoutes();
		var defFunc = getDefaultFunc();
		return {
			routes      : routes,
			defaultFunc : defFunc 
		};
	}
	function getRoutes(){
		var routes   = {};
		var defMenus = _menus;
		var showUrls = getShowUrls();
		for(var urlName in showUrls){
			var url  = showUrls[urlName];
			var menu = defMenus[url["menu"]];
			var link = (menu["link"] + url["link"]).substr(1);
			routes[link] = url["func"];
		}
		return routes;
	}
	function getDefaultFunc(){
		var Config  = require('P_config/config');
		if(Config["notPopUps"] === '1'){
			/*
				配置向导
			 */
			_defaultUrl = 'systemState';
		}
		var defFunc = _urls[_defaultUrl]["func"];
		return defFunc;
	}
	module.exports = {
		getSidebarConfig : getSidebarConfig,
		getRouterConfig  : getRouterConfig
	};
});
