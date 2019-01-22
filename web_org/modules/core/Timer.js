define(function(require, exports, module){
	/**
	 * 定时器类
	 * @type {Object}
	 */
	var Timer = {
		/**
		 * 定时器类构造函数
		 * @author JeremyZhang
		 * @date   2016-11-02
		 * @param {function} func 定时执行的函数
		 * @param {int} inertval 执行时间的间隔 单位ms
		 * @param {int | true} count 执行次数，如果为true一直执行
		 * @return {obj}            定时器类实例
		 */
	    create : function(func, interval, count){
	        var timer      = {};
	      	timer.interval = interval;
	      	timer.count    = count;
	      	timer.func     = func;
	      	timer.timer    = null;
	      	/**
	      	 * 定时器开启函数
	      	 * @author JeremyZhang
	      	 * @date   2016-11-02
	      	 */
	      	timer.start    = function(){
	        	var num     = 0;
	         	timer.timer = setTimeout(function(){
		          	timer.func();
		          	if(timer.count === true){
		            	timer.timer = setTimeout(arguments.callee, timer.interval);
		          	}else{
		            	num++;
		            	if(num < timer.count){
		              		timer.timer = setTimeout(arguments.callee, timer.interval);
		            	}
		          	}
		        }, timer.interval);
	      	};
	      	/**
	      	 * 定时器关闭方法
	      	 * @author JeremyZhang
	      	 * @date   2016-11-02
	      	 */
	      	timer.stop     = function(){
	        	clearTimeout(timer.timer)
	      	};
	      	return timer;        
	    }
  	};
  	function getTimer(func, interval, count){
  		var timer = Timer.create(func, interval, count);
  		return timer;
  	}
	module.exports = {
		getTimer : getTimer 
	};
});