define(function(require, exports, module){
	function async(asyncFuncs, successFunc, errFunc){
		var funcs = initFuncs(asyncFuncs);
		$.when.apply(null, funcs)
	    .done(function(){ 
	      	successFunc.apply(null, arguments)
	    })
	    .fail(function(){
	      	errFunc();
	    });
	}
	function initFuncs(asyncFuncs){
		var funcs = [];
		if(asyncFuncs.length > 0){
			asyncFuncs.forEach(function(asyncFunc){
				var func = function(){
					var dfd = $.Deferred(); 
	          		dfd.resolve('NOTFUNC');  
	        		return dfd.promise(); 
				};
				if(isString(asyncFunc)){
					func = function(){
						var dfd = $.Deferred(); 
	      				$.ajax({
	        				url : asyncFunc,
	        				type  : 'GET',
	        				success : function(r){
	          					dfd.resolve(r); 
	        				},
	        				error  : function(){
	          					dfd.resolve(false);  
	        				}
	      				});
	      				return dfd.promise(); 
					};
				}else if(isFunc(asyncFunc)){
					func = asyncFunc;
				}
				funcs.push(func());
			});
		}
		return funcs;
	}
	function isString(string){
		if(typeof string == 'string'){
			return true;
		}else{
			return false;
		}
	}
	function isFunc(func){
		if(typeof func == 'function'){
			return true;
		}else{
			return false;
		}
	}
	module.exports = {
		async : async
	}
});