/**
 * 	cookie 工具类
 * @type {Object}
 */
var CookieUtil = {
    get: function (name){
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;
        if (cookieStart > -1){
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        } 
        return cookieValue;
    },
    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    unset: function (name, path, domain, secure){
        this.set(name, "", new Date(0), path, domain, secure);
    }
};
/**
 * 翻译功能
 * @type {Object}
 */
var Translate = {
	dics : {},
	getLangPath: function(dicName){
		var language = CookieUtil.get('language') || 'zhcn';
		return '/lang/' + language + '/' + dicName + '.js';
	},
	loadDics: function(dicNames){
		var self = this;
		dicNames.forEach(function(dicName){
			self.loadDic(dicName);
		});
	},
	loadDic: function(dicName){
		var self = this;
		$.ajax({
			url      : self.getLangPath(dicName),
			async    :false,
        	dataType : "script",
		});
	},
	getValue: function(key){
		var self = this;
		return self.dics[key] || key;
	},
    storeDic: function(dic){
        var self = this;
        self.dics = $.extend(self.dics, dic);
    },
    translate: function($dom){
        var self = this;
        var $elems = $dom.find('[data-local]').add($dom);
        $elems.each(function(){
            var $elem       = $(this),
                dataLocal   = $elem.attr('data-local');
            if(dataLocal !== undefined){
                var result = self.getReplaceString(dataLocal);
                if(result.isReplaced){
                    $elem.text(result.repStr);
                }
            }
        });
    },
    getReplaceString: function(str){
        var self   = this;
        var dics   = self.dics;
        var result = {
            isReplaced : false,
            repStr     : str
        };
        var keyStrArr = self.fetchStrs(str);
        if(keyStrArr !== null){
            var isHasKey = false;
            keyStrArr.forEach(function(keyString){
                var key   = self.trim(keyString),
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
    },
    fetchStrs: function(s){
        var reg = /{([A-z0-9_])+}/g;
        var result = s.match(reg);
        return result;
    },
    trim: function(str){
        var regLeft = /^{/,
            regRight = /}$/;
        str = str.replace(regLeft, '');
        str = str.replace(regRight, ''); 
        return str;
    }
};
function define(obj){
	Translate.storeDic(obj);
}
function T(str){
    return Translate.getValue(str)
}