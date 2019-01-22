define(function(require, exports, module){
	require('jquery');
	function ModalClass(list, closeAbled){
		this.dom = null;
		this.initDom(list, closeAbled);
		this.initEvent();
	}
	ModalClass.prototype.initDom = function(list, closeAbled){
		// 加载模态框模板模块
		var Modal = require('P_template/common/Modal');
		// 获得模态框的html
		var modalHTML = Modal.getHTML(list),
			$modal    = $(modalHTML);
		var btnList   = processDataToBtnGroup(list.btns);
		var BtnGroup  = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnList);
		$modal.find('.modal-footer').append($btnGroup);
		if(closeAbled === false){
			$modal.modal({
				keyboard : false,
				backdrop : 'static'
			});
			$modal.find('#modal-hide').remove();
			$modal.find('.modal-header button').remove();
		}
		this.dom = $modal;
	};
	ModalClass.prototype.initEvent = function(){
		var ModalObj = this;
		var $modal = this.dom;
		$modal.click(function(ev){
			var ev      = window.event || ev,
				target  = ev.target || ev.srcElement,
				$target = $(target); 
			var id    = $target.attr('id');
			if(id == 'modal-hide'){
				ModalObj.hide();
			}
		});
	};
	ModalClass.prototype.translate = function(dicArr){
		var Translate = require('Translate');
		var $dom      = this.getDom();
		Translate.translate([$dom], dicArr);
	};
	ModalClass.prototype.insert = function($dom){
		var $modal = this.getDom();
		$modal.find('.modal-body').append($dom);
	};
	ModalClass.prototype.show = function(){
		var $modal = this.getDom();
		$('body').append($modal);
		$modal.modal('show');
	};
	ModalClass.prototype.hide = function(){
		var $modal = this.getDom();
		$modal.modal('hide');
		this.removeDom();
	};
	ModalClass.prototype.getDom = function(){
		return this.dom;
	};
	ModalClass.prototype.removeDom = function(){
		var $modal = this.getDom();
		setTimeout(function(){
			$modal.remove();
		},450);
	};
	function processDataToBtnGroup(btnList){
		var btnGroupList = [];
		btnList.forEach(function(btnData){
			var btnObj = {};
			var type = btnData.type;
			if(type == 'save'){
				btnObj.id = 'save';
				btnObj.name = '{save}';
			}else if(type == 'reset'){
				btnObj.id = 'reset';
				btnObj.name = '{reset}';
			}else if(type == 'close'){
				btnObj.id = 'modal-hide';
				btnObj.name = '{close}';
			}else{
			     btnObj.id = btnData.id; 
			     btnObj.name = btnData.name;
		    	}
			if(btnData.clickFunc != undefined){
				btnObj.clickFunc = btnData.clickFunc;
			}
			if(btnObj.name != undefined){
				btnGroupList.push(btnObj);
			}
			
		});
		return btnGroupList;
	}
	function getModalObj(list, closeAbled){
		var modalObj = new ModalClass(list, closeAbled);
		return modalObj;
	}
	module.exports = {
		getModalObj : getModalObj,
	};
});
