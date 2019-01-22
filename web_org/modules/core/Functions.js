define(function(require, exports, module){
	/**
	 * 去除字符串两边的花括号
	 * @author JeremyZhang
	 * @date   2016-10-28
	 * @param  {[type]}   str 以{开头，并以}结尾的字符串
	 * @return {[type]}       去除开头和结尾花括号后的字符串
	 */
	function trimBrackets(str){
		var reg = /^{(\S)+}$/;
		if(reg.test(str)){
			str = str.slice(1, str.length-1);
		}
		return str;
	}
	function getRandomStr(len){
		var len = len || 6;
		var strElems = 'qwertyuioplkjhgfdsazxcvbnm1234567890ZXCVBNMLKJHGFDSAQWERTYUIOP';
		var count = strElems.length;
		var str = '';
		for(var i = 0; i < len; i++){
			var index = Math.floor(Math.random() * count);
			str += strElems[index];
		}
		return str;
	}
	function getRandomNum(len){
		var len = len || 6;
		var strElems = '1234567890';
		var count = strElems.length;
		var str = '';
		for(var i = 0; i < len; i++){
			var index = Math.floor(Math.random() * count);
			str += strElems[index];
		}
		return str;
	}
	function getRandomIP(){
		var arr = [];
		for(var i = 0; i < 4; i++){
			var num = getRandomNum(3);
			arr.push(num);
		}
		var ip = arr.join('.');
		return ip;
	}
	function getRandomChineseCharacter(len){
		var len = len || 6;
		var strElems = '啊吧从的额发个好就考看去我在吗';
		var count = strElems.length;
		var str = '';
		for(var i = 0; i < len; i++){
			var index = Math.floor(Math.random() * count);
			str += strElems[index];
		}
		return str;
	}
	function getTestData(count){
		var data = [];
		for(var i = 0; i < count; i++){
			var arr = [];
			var ip = getRandomIP();
			var mask = getRandomStr();
			var str = getRandomNum(5);
			var chineseCharacter = getRandomChineseCharacter(3);
			arr = [ip, mask, str, chineseCharacter];
			data.push(arr);
		}
		return data;
	}
	/**
     * 将十六进制字符串转换为二进制字符串
     * @author JeremyZhang
     * @date   2016-11-25
     * @param  {[type]}   hexadecimalStr [description]
     * @return {[type]}                  [description]
     */
    function hexadecimalToBinary(hexadecimalStr){
        var hexadecimalArr = hexadecimalStr.split('');
        var binaryArr = [];
        hexadecimalArr.forEach(function(hexadecimalStr){
          var binaryStr      = parseInt(hexadecimalStr, 16).toString(2);
          while(binaryStr.length < 4){
            binaryStr = '0' + binaryStr;
          }
          binaryArr.push(binaryStr);
        })
        return binaryArr.join('');
    }
    /**
     * 将二进制字符串转化为十六进制字符串
     * @author JeremyZhang
     * @date   2016-11-25
     * @param  {[type]}   binary [description]
     * @return {[type]}          [description]
     */
    function binaryToHexadecimal(binaryStr){
      var binaryArr = binaryStr.split('');
      var hexadecimalArr = [];
      do{
        var binaryStr  = binaryArr.splice(0, 4).join('');
        while(binaryStr.length < 4){
          binaryStr += '0';
        }
        var decimalStr = parseInt(binaryStr, 2).toString(16);
        hexadecimalArr.push(decimalStr);
      }while(binaryArr.length > 0)
      return hexadecimalArr.join('');
    }

    /**
     * 将二进制字符串转化为十六进制字符串,ForVlan,不需要补位
     * @author JeremyZhang
     * @date   2016-11-25
     * @param  {[type]}   binary [description]
     * @return {[type]}          [description]
     */
    function binaryToHexadecimalForVlan(binaryStr){
      var binaryArr = binaryStr.split('');
      var hexadecimalArr = [];
      do{
        var binaryStr  = binaryArr.splice(0, 4).join('');
        /*while(binaryStr.length < 4){
          binaryStr += '0';
        }*/
        var decimalStr = parseInt(binaryStr, 2).toString(16);
        hexadecimalArr.push(decimalStr);
      }while(binaryArr.length > 0)
      return hexadecimalArr.join('');
    }
	function cloneArr(arr){
		return arr.map(function(obj){
			return $.extend(true, {}, obj)
		});
	}
	/**
	 * 快排算法
	 * @author JeremyZhang
	 * @date   2016-12-23
	 * @param  {[type]}   arr         要排序的数组
	 * @param  {[type]}   compareFunc 排序比较函数
	 * @return {[type]}               排好序的数组
	 */
	function quickSort(arr, compareFunc){
		var thisFunc = arguments.callee;
		var len = arr.length;
		if(len < 2){
			return arr;
		}
		var flag = len-1;
		var valueFlag = arr[flag];
		var left = [];
		var right = [];
		for(var i = 0; i < len-1; i++){
			var value = arr[i];
			if(compareFunc(value, valueFlag)){
				left.push(value);
			}else{
				right.push(value);
			}
		}
		return thisFunc(left, compareFunc).concat(valueFlag, thisFunc(right, compareFunc));
	}
	/**
	 * 
	 * @author JeremyZhang
	 * @date   2016-12-26
	 * @param  {[type]}   byte [description]
	 * @return {[type]}        [description]
	 */
	function computeByte(byte){
		var units = ['B', 'KB', 'MB', 'GB', 'TB'];
		var index = 0;
		while(byte >= 1024){
			byte /= 1024;
			index++;
		}
		byte = Math.round(byte * 1000)/1000;
		return byte + units[index];
	}
	/*
		自动输入掩码，网关
	*/
	function autoInputIPMaskGW(ipname,netmask,gateway,$dom){
			$dom.find('[name="'+ipname+'"]').keyup(function(){
				var thisval = $(this).val();
				var fsval = Number(thisval.substr(0,thisval.indexOf('.')));
				var edval = Number(thisval.substr(thisval.lastIndexOf('.')+1,thisval.length));
				var masks = '';
				var gates = '';
				if(fsval >= 1 && fsval <= 126){
					masks = '255.0.0.0';
				}else if(fsval >= 128 && fsval <= 191){
					masks = '255.255.0.0';
				}else if(fsval >= 192){
					masks = '255.255.255.0';
				}

				if(edval != 1){
					gates = thisval.substr(0,thisval.lastIndexOf('.')) +".1";
				}else{
					gates = thisval.substr(0,thisval.lastIndexOf('.')) +".2";
				}
				
				if(Number(thisval) === 0){
					masks = gates = '';
				}
				$dom.find('[name="'+netmask+'"]').val(masks);
				$dom.find('[name="'+gateway+'"]').val(gates);
			});
		}
	module.exports = {
		getTestData         : getTestData,
		trimBrackets        : trimBrackets,
		hexadecimalToBinary : hexadecimalToBinary,
		binaryToHexadecimal : binaryToHexadecimal,
		binaryToHexadecimalForVlan : binaryToHexadecimalForVlan,
		cloneArr            : cloneArr,
		quickSort           : quickSort,
		computeByte         : computeByte,
		autoInputIPMaskGW   :autoInputIPMaskGW
	};
});
