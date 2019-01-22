define(function(require, exports, module){
	var _rootPath    = '';
	var _langPath    = '';
	var _defaultLang = '';
	var _langArr     = [];
	function init(){
		var Config   = require('P_config/config');
		_rootPath    = Config.rootPath;
		_langPath    = Config.langPath;
		_defaultLang = Config.defaultLang;
		_langArr     = Config.langArr;
		_langPath    = _rootPath + _langPath;
	}
	/**
	 * 对页面进行翻译函数
	 * @author JeremyZhang
	 * @date   2016-10-13
	 * @param  {array}   $domArr  jQuery对象组成的数组
	 * @param  {string}   lang    想要翻译的语言名称,缺省值为默认的语言
	 * @param  {array}    dicNameArr  需要使用的字典列表
	 */
	function translate($domArr, dicNameArr, lang){
		init();
		// 将要翻译的dom合并
		var $dom = mergeDom($domArr);
		/*
			获得要翻译的语言
		 */
		var lang = lang || '';
		lang = getLang(lang);
		// 进行翻译
		translateDom($dom, dicNameArr, lang);
	}
	/**
	 * 根据 默认语言、支持翻译的语言、传入的语言名称，确定当前翻译为什么语言
	 * @author JeremyZhang
	 * @date   2016-10-13
	 * @param  {[type]}   lang [description]
	 * @return {[type]}        [description]
	 */
	function getLang(lang){
		var index = _langArr.indexOf(lang);
		if(index > -1){
			return lang;
		}
		return _defaultLang;
	}
	/**
	 * 合并dom
	 * @author JeremyZhang
	 * @date   2016-10-26
	 * @param  {[type]}   $domArr [description]
	 * @return {[type]}           [description]
	 */
	function mergeDom($domArr){
		var $dom = $domArr[0],
			len  = $domArr.length;
		if(len > 1){
			for(var i = 1; i < len; i++){
				$dom = $dom.add($domArr[i]);
			}
		}
		return $dom;
	}
	/**
	 * 根据语言获取字典文件存放的路径
	 * @author JeremyZhang
	 * @date   2016-10-26
	 * @param  {[type]}   lang [description]
	 * @return {[type]}        [description]
	 */
	function getDicPath(lang){
		// 字典存放的路径
		var dicPath = _langPath;
		switch(lang){
			case 'zhcn' :
				dicPath += '/zhcn/';
				break;
			case 'zhtw' :
				dicPath += '/zhtw/';
				break;
			case 'en' :
				dicPath += '/en/';
				break;
			default :
				dicPath += '/zhcn/';  // 应该根据默认语言来设置默认路径
		}
		return dicPath;
	}
	/**
	 * 根据字典路径和字典数组获取所有字典组成的字典
	 * @author JeremyZhang
	 * @date   2016-10-26
	 * @param  {[type]}   dicPath    [description]
	 * @param  {[type]}   dicNameArr [description]
	 * @return {[type]}              [description]
	 */
	function getDics(dicPath, dicNameArr){
		var dics = {};
		dicNameArr.forEach(function(dicName){
			var dic = getDic(dicPath, dicName);
			dics = $.extend(dics, dic);
		});
		return dics;
	}
	/**
	 * 根据字典路径和字典获得对应的字典
	 * @author JeremyZhang
	 * @date   2016-10-26
	 * @param  {[type]}   dicPath [description]
	 * @param  {[type]}   dicName [description]
	 * @return {[type]}           [description]
	 */
	function getDic(dicPath, dicName){
		var dic = {};
		var path = dicPath + dicName + '.js';
		if(isDicExist(path)){
			dic = getDicFromStore(path);
		}else{
			$.ajax({
				url     : path,
				type    : 'GET',
				async   : false,
				success : function(jsonStr){
					dic = getDicJson(jsonStr);
					storeDic(path, dic);
				}
			});
		}
		return dic;
	}
	function isDicExist(dicPath){
		var Config = require('P_config/config');
		var dics   = Config["dics"];
		if(dics[dicPathToVar(dicPath)] !== undefined){
			return true;
		}else{
			return false;
		}
	}
	function getDicFromStore(dicPath){
		var Config = require('P_config/config');
		var dics   = Config["dics"];
		return dics[dicPathToVar(dicPath)];
	}
	function dicPathToVar(dicPath){
		var arr = dicPath.split('/');
		return arr.join('_');
	}
	function storeDic(path, dicJson){
		var Config = require('P_config/config');
		Config["dics"][dicPathToVar(path)] = dicJson;
	}
	/**
	 * 将字典 字符串处理为 json
	 * @author JeremyZhang
	 * @date   2016-10-26
	 * @param  {[type]}   jsonStr [description]
	 * @return {[type]}           [description]
	 */
	function getDicJson(jsonStr){
		jsonStr = jsonStr.replace(/^define\(/, '').replace(/\)$/, '');
		var codeStr = '(function(){ var data = {jsonStr}; return data; })();';
		codeStr     = codeStr.replace(/{jsonStr}/, jsonStr);
		var dicJson = {};
		try{
			dicJson = eval(codeStr);
		}catch(err){
			
		}
		return dicJson;
	}
	function translateDom($dom, dicNameArr, lang){
		var dicPath = getDicPath(lang);
		var dics = getDics(dicPath, dicNameArr);
		var $elems = $dom.find('[data-local]').add($dom);
		$elems.each(function(){
        	var $elem       = $(this),
        		dataLocal   = $elem.attr('data-local');
        	if(dataLocal !== undefined){
        		var result = getReplaceString(dataLocal, dics);
        		if(result.isReplaced){
        			$elem.text(result.repStr);
        		}
        	}
      	});
	}
	/**
	 * 根据字典获取替换之后的字符串
	 * @author JeremyZhang
	 * @date   2017-01-16
	 * @param  {[type]}   str  [description]
	 * @param  {[type]}   dics [description]
	 * @return {[type]}        [description]
	 */
	function getReplaceString(str, dics){
		var result = {
			isReplaced : false,
			repStr     : str
		};
		var keyStrArr = fetchStrs(str);
    	if(keyStrArr !== null){
    		var isHasKey = false;
    		keyStrArr.forEach(function(keyString){
    			var key   = trim(keyString),
    				value = dics[key];
    			if(value !== undefined){
    				isHasKey = true;
    				str = str.replace(keyString, value);
    			}
    		});
    		if(isHasKey){
    			result.isReplaced = true;
    			result.repStr     = str;
    		}
    	}
    	return result;
	}
	/**
	 * 从字符串中提取被{}包裹的字符
	 * 里面的字符只能是 A-z 0-9 _ . - 的组合，不可为空
	 * 如果匹配成功，返回{字符串}组成的数组，否则返回null
	 * @date   2016-11-18
	 * @param  {[type]}   s [description]
	 * @return {[type]}     [description]
	 */
	function fetchStrs(s){
		var reg = /{([A-z0-9_])+}/g;
		var result = s.match(reg);
		return result;
	}
	/**
	 * 清除字典两边的花括号
	 * @author JeremyZhang
	 * @date   2016-10-26
	 * @param  {[type]}   str [description]
	 * @return {[type]}       [description]
	 */
	function trim(str){
    	var regLeft = /^{/,
       		regRight = /}$/;
    	str = str.replace(regLeft, '');
    	str = str.replace(regRight, ''); 
      	return str;
	}
	function getValue(key, dicArr, lang ){
		init();
		var lang    = lang || '';
		lang        = getLang(lang);
		var dicPath = getDicPath(lang);
		var dics    = getDics(dicPath, dicArr);
		if(fetchStrs(key) === null){
			return dics[key];
		}else{
			return getReplaceString(key, dics).repStr;
		}
	}
	function preLoadDics(dicNameArr, callback){
		init();
		var lang    = getLang('');
		var dicPath = getDicPath(lang);
		var dics    = [];
		dicNameArr.forEach(function(dicName, index, arr){
			dics.push(dicPath + dicName);
		});
		require.async(dics, function(){
			var dicObjs = Array.prototype.slice.call(arguments);
			dics.forEach(function(dicName, index){
				var dicObj = dicObjs[index];
				if(dicObj){
					dicName += '.js';
					storeDic(dicName, dicObj);
				}
			});
			callback();
		});
	}
	module.exports = {
		translate     : translate,
		getValue      : getValue,
		preLoadDics   : preLoadDics
	};
});
