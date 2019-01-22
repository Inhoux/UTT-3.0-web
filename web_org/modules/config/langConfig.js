define(function(require, exports, module){
	require('jquery')
	function getLangConfig(){
		var langConfig = {};
		$.ajax({
			url     : 'common.asp?optType=lang',
			type    : 'GET',
			async   : false,
			success : function(jsStr){
					eval(jsStr);
					langConfig.defaultLang = lang;
					langConfig.langArr     = langArr;
			},
			error   : function(){
				return false;
			}
		});
		return langConfig;
	}
	/**
	 * 语言初始化
	 * @author JeremyZhang
	 * @date   2016-11-02
	 */
	function setLang(){
		var Config  = require('P_config/config');
		var langConfig     = getLangConfig();
		if(Object.keys(langConfig).length != 0){
			Config.defaultLang = langConfig.defaultLang;
			Config.langArr     = langConfig.langArr;
		}
	}
	/**
	 * 重置默认语言
	 * @author JeremyZhang
	 * @date   2016-11-02
	 * @param  {[type]}   lang     语言名称
	 * @param  {Function} callback 重置成功后的回调函数
	 * @return {[type]}            [description]
	 */
	function changeLang(lang, callback){
		var postData = 'langSelection=' + lang;
		$.ajax({
			url     : '/goform/setSysLang',
			type    : 'POST',
			data    : postData,
			success : function(jsStr){
				eval(jsStr);
				if(status){
					var Config         = require('P_config/config');
					Config.defaultLang = lang;
					callback();
				}

			}
		});
	}
	module.exports = {
		setLang    : setLang,
		changeLang : changeLang
	};
});
