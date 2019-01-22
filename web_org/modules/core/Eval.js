define(function(require, exports, module){
	function doEval(codeStr, variableArr){
        var prevCodeStr = '',
            jsonCodeStr  = '',
            returnCodeStr = 'var data = {<{jsonStr}>}; return data';
        variableArr.forEach(function(item){
            var prevStr = 'var <{variable}> = undefined; ';
            prevCodeStr += prevStr.replace(/<{variable}>/, item);
            var jsonStr = '"<{variable}>" : <{variable}>, ';
            jsonCodeStr += jsonStr.replace(/<{variable}>/g, item);
        });
        returnCodeStr = returnCodeStr.replace(/<{jsonStr}>/, jsonCodeStr);
        codeStr = prevCodeStr + codeStr + returnCodeStr;
        var evalStr = '(function(){<{codeStr}>})();';
        evalStr = evalStr.replace(/<{codeStr}>/, codeStr);
        var result = null;
        try{
            var returnStr = eval(evalStr);
            result = {
                "isSuccessful" : true,
                "data"         : returnStr
            };
        }catch(err){
            console.log('JS字符串执行错误');
            console.log(err);
            result = {
                "isSuccessful" : false,
                "msg"          : 'faild'
            };
        }finally{
           return result;
        }
    }
    /**
     * 处理js字符串
     * @author JeremyZhang
     * @date   2016-11-24
     * @param  {[type]}   jsStr [description]
     * @return {[type]}         [description]
     */
    function processJsStr(jsStr,variables, titles){
        var result    = doEval(jsStr, variables),
            isSuccess = result["isSuccessful"];
        var retArr    = [];
        if(isSuccess){
            var data  = result["data"];
            var len   = data[variables[0]].length;
            for(var i = 0; i < len; i++){
                var innerArr = [];
                variables.forEach(function(variable){
                    innerArr.push(data[variable][i]);
                });
                if(titles !== undefined){
                    innerArr = innerArr.concat(titles)
                }
                retArr.push(innerArr);
            }
        }
        return retArr;
    }
    module.exports = {
    	doEval       : doEval,
        processJsStr : processJsStr
    }
});