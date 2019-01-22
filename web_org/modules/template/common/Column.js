define(function(require, exports, module){
	function processData(data){
		var leftId = data.leftId,
			rightId = data.rightId,
			ratio = data.ratio,
			leftRatio,rightRatio;
			
			if(ratio.indexOf(':')>0){
				leftRatio = parseInt(ratio.split(':')[0]);
				rightRatio = parseInt(ratio.split(':')[1]);
			}else if(ratio.indexOf('：')>0){
				leftRatio = parseInt(ratio.split('：')[0]);
				rightRatio = parseInt(ratio.split('：')[1]);
			}else{
				console.warn('data中ratio数据格式错误！');
			}
			if((leftRatio+rightRatio)!= 12 && leftRatio != 0 && rightRatio != 0){
				leftRatio = Math.round(12*leftRatio/(leftRatio+rightRatio));
				rightRatio = 12 - leftRatio;
			}else{
				console.warn('data中ratio数据错误！');
			}
			
		var list = {
			leftId : leftId,
			rightId : rightId,
			leftRatio : leftRatio,
			rightRatio : rightRatio
		}
		return list;
	}
	function getHTML(data){
		var list = processData(data),
			render = require('P_build/common/column'),
			html = render(list);
		return html;
	}
	module.exports = {
		getHTML : getHTML
	};
});
