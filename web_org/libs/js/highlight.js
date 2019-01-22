(function($){
	$.fn.searchWord = function(word, settings){
		$(this).each(function(index, element){
			searchWord(element, word, settings);
		});
	};
	$.fn.removeMark = function(){
		$(this).each(function(index, element){
			removeMark(element);
		});
	};
	function searchWord(node, word, settings){
		var settings = initSettings(settings);
		removeMark(node);
		addMark(node, word, settings);
	}
	function initSettings(settings){
		var defaultSettings = {
			'markTag'   : 'span',
			'markClass' : '',
			'markColor' : 'blue'
		};
		for(var key in settings){
			if(settings[key] !== undefined){
				defaultSettings[key] = settings[key];
			}
		}
		return defaultSettings;
	}
	function addMark(node, word, settings){
		var nodeType = node.nodeType;
		if(nodeType == 3){
			var reg = new RegExp(word.toLowerCase()); // 搜索的字符
			var text = node.nodeValue; // 被搜多的字符串
			
			/* 字符串统一小写模糊处理 */
			var toword = word.toLowerCase();
			var totext = text.toLowerCase();
			
			if(reg.test(totext)){
				var oParent = node.parentNode;
				var textArr = totext.split(toword);
				
				var wl = word.length;
				
				var newTextArr = [];
				var beforel = 0;
				textArr.forEach(function(pt,pi){
					var ptl =  pt.length;
					var truep = text.substr(beforel,ptl);
					beforel += Number(pi+1)*wl+ptl;
					newTextArr.push(truep);
				});
				var truew = text.substr(totext.indexOf(toword),wl);
				
				for(var i = 0, len = newTextArr.length; i < len; i++){
					var textNode = document.createTextNode(newTextArr[i]);
					oParent.insertBefore(textNode, node);
					if(i != len-1){
						var markNode = createMarkNode(truew, settings);
						oParent.insertBefore(markNode, node);
					}
				}
				oParent.removeChild(node);
			}
			
		}else if(nodeType == 1){
			var childList = Array.prototype.slice.call(node.childNodes, 0);
			childList.forEach(function(childNode){
				addMark(childNode, word, settings);
			}); 
		}
	}
	function createMarkNode(text, settings){
		var markNode = document.createElement(settings.markTag);
		markNode.setAttribute('searchMark', true);
		if(settings.markClass !== ''){
			markNode.className = settings.markClass;
		}else{
			markNode.style.color = settings.markColor;
		}
		markNode.innerHTML = text;
		return markNode;
	}
	function removeMark(node){
		var nodeList = node.querySelectorAll('[searchMark]');
		nodeArr = Array.prototype.slice.call(nodeList, 0);
		nodeArr.forEach(function(spanNode){
			var oParent  = spanNode.parentNode;
			var text     = spanNode.innerHTML;
			var prevNode = spanNode.previousSibling,
				nextNode = spanNode.nextSibling;
			var prevText = '',
				nextText = '';
			if(prevNode !== null && prevNode.nodeType == 3){
				prevText = prevNode.nodeValue;
				oParent.removeChild(prevNode);
			}
			if(nextNode !== null && nextNode.nodeType == 3){
				nextText = nextNode.nodeValue;
				oParent.removeChild(nextNode);
			}
			var textNode = document.createTextNode(prevText + text + nextText);
			oParent.insertBefore(textNode, spanNode);
			oParent.removeChild(spanNode);
		});
	}
})(jQuery);
