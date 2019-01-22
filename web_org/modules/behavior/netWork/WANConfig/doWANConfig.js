define(function(require, exports, module) {
	require('jquery');
	var DATA = {};
	exports.display = function() {
			var Path = require('Path');
			// 加载路径导航
			var pathList = {
				"prevTitle": '网络配置',
				"links": [{
					"link": '#/network_config/WAN_config',
					"title": '外网配置'
				}],
				"currentTitle": ''
			};
			Path.displayPath(pathList);
			var Tabs = require('Tabs');
			// 加载标签页
			var tabsList = [{
				"id": "1",
				"title": "外网配置"
			}, {
				"id": "2",
				"title": "全局设置"
			}];
			// 生成标签页，并放入页面中
			Tabs.displayTabs(tabsList);

			$('a[href="#1"]').click(function(event) {
				Path.changePath($(this).text());
				display1($('#1'));
			});
			$('a[href="#2"]').click(function(event) {
				Path.changePath($(this).text());
				display2($('#2'));
			});
			$('a[href="#1"]').trigger('click');
		}
	/*
	 * 外网配置表格页面
	 */
	function display1($con) {

	}
	
	//编辑页面
	function displayEditPage($this,$con){
		require('Path').changePath('编辑');
		
		var inputList = [
			{
				"prevWord": '接口',
				"inputData": {
					"defaultValue": '1', 
					"type": 'select',
					"name": 'WAN',
					"items": [{
						"value": '1',
						"name": '1',
					},{
						"value": '2',
						"name": '2',
					},{
						"value": '3',
						"name": '3',
					},{
						"value": '4',
						"name": '4',
					} ]
				},
				"afterWord": ''
			},
			{
				"prevWord": '接入方式',
				"inputData": {
					"defaultValue": 'staticIP', 
					"type": 'select',
					"name": 'linkType',
					"items": [{
						"value": 'staticIP',
						"name": '静态IP地址',
					},{
						"value": 'dynamicIP',
						"name": '动态IP地址',
					},{
						"value": 'PPPoE',
						"name": 'PPPoE接入',
					}]
				},
				"afterWord": ''
			}
		];
		
		var InputList1 =[
			{
				"prevWord": '运营商',
				"inputData": {
					"defaultValue" : 'default', //默认值对应的value值
					"type": 'checkbox',
					"name": 'operator',
					"items" : [
						{"value" : 'default', "name" : '默认'},
						{"value" : 'DX', "name" : '电信'},
						{"value" : 'YD', "name" : '移动'},
						{"value" : 'LT', "name" : '联通'}
					]
				},
				"afterWord": ''
			}
		];
		
		
		var IG = require('InputGroup');
		var $dom = IG.getDom(inputList);
		
		
		
		
		
		
	}
	
	
	/*
	 * 全局设置
	 */
	function display2($con) {
		var inputList = [{
				"inputData": {
					"type": 'title',
					"name": 'WAN口数量'
				}
			}, {
				"prevWord": 'WAN口数量',
				"inputData": {
					"defaultValue": '1', 
					"type": 'select',
					"name": 'WANNumber',
					"items": [{
						"value": '1',
						"name": '1',
					},{
						"value": '2',
						"name": '2',
					},{
						"value": '3',
						"name": '3',
					},{
						"value": '4',
						"name": '4',
					} ]
				},
				"afterWord": ''
			}, {
				"inputData": {
					"type": 'title',
					"name": '均衡模式'
				}
			}, {
				"prevWord": '智能负载均衡',
				"inputData": {
					"defaultValue" : 'off', 
					"type": 'radio',
					"name": 'LoadBalancing',
					"items": [{
						"value": 'on',
						"name": '开启',
					}, {
						"value": 'off',
						"name": '关闭'
					}, ]
				},
				"afterWord": ''
			}, {
				"prevWord": '身份绑定',
				"inputData": {
					"defaultValue" : 'off', 
					"type": 'radio',
					"name": 'identityBinding',
					"items": [{
						"value": 'on',
						"name": '开启',
					}, {
						"value": 'off',
						"name": '关闭'
					}, ]
				},
				"afterWord": ''
			},  {
				"inputData": {
					"type": 'title',
					"name": '线路检测'
				}
			}
		];
		
		var wans ="<tr><td></td><td>检测间隔（秒）</td><td>检测次数（次）</td><td>检测目标</td></tr>";
		
		var count = 4;
		for(var i=1;i<=count;i++){
				wans += "<tr>"+
							"<td>"+
								"WAN"+i+
							"</td>"+
							"<td>"+
								"<input name='testInterval"+i+"' type='text'/>"+
							"</td>"+
							"<td>"+
								"<input name='testCount"+i+"' type='text'/>"+
							"</td>"+
							"<td>"+
								"<select class='choosenIPOrOther' name='testTarget"+i+"'>"+
									"<option value='other'>其他地址（IP或域名）</option>"+
									"<option value='up'>上层网关地址</option>"+
								"</select>"+
								"<input name='otherIP' type='text' style='margin-left:10px'/>"+
							"</td>"+
						"</tr>";
		}
		wans += "<tr><td></td><td colspan='3'>(范围：1-60，0表示不检测)(范围：3-1000)</td></tr>";
		
		var InputGroup = require('InputGroup');
		var $dom = InputGroup.getDom(inputList);
		$dom.find('tbody').append(wans);
		
		var btnGroupList = [
			{
				"id"        : 'save',
				"name"      : '保存',
				"clickFunc" : function($btn){
					// $btn 是模块自动传入的，一般不会用到
					alert($btn.attr('id'));  // 显示 add
				}
			},
			{
				"id"        : 'reset',
				"name"      : '重填'
			}
		];
		var BtnGroup = require('BtnGroup');
		var $btnGroup = BtnGroup.getDom(btnGroupList);
		$btnGroup.addClass('u-btn-group');
		
		$con.empty().append($dom,$btnGroup);
		
		//绑定交互
		makeTheTestTargetChange();
		$dom.find('.choosenIPOrOther').change(function(){
			makeTheTestTargetChange();
			
		});
		
		
		function makeTheTestTargetChange(){
			$dom.find('.choosenIPOrOther').each(function(){
				var $t = $(this);
				var vals = $t.val();
				var $n = $t.next();
				switch(vals){
					case 'other':
						$n.removeClass('u-hide');
						break;
					case 'up':
						$n.addClass('u-hide');
						break;
					default:
						break;
				}
			});
			
		}
		
	}

})