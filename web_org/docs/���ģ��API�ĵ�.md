#组件模块API文档
组件模块是向页面推送提示信息、验证、图形化查询操作等功能的封装模块，复用性高，方便书写和调用。目录在modules/plugin下。

---
##tips 小型提示框组件
	
###1.小型页面提示信息模块

* 用于向页面展示一条短暂的提示信息。

* 接口方法 : 

	* showInfo(infoStr,time) **普通**提示信息
	* showSuccess(infoStr,time) **成功**提示信息
	* showWarning(infoStr,time) **警告**提示信息
	* showError(infoStr,time) **错误**提示信息
	
* 数据格式(infoStr,time) :

	* infoStr：字符串，传入一段需要提示的信息
	* time：数字，提示信息显示的时长，以秒为计数单位
	
  示例如下 :
  		
		 
		var tips = require(../../../plugin/tips);
		tips.showSuccess('修改成功！',3.5);
	

###2.信息确认模块

* 当需要用户确认一些操作是否真正执行时调用。

* 接口方法 : 

	* showConfirm(infoStr,okCallback,noCallback)
	
* 数据格式(infoStr,okCallback,noCallback) :

	* infoStr：字符串，传入一段需要提示的信息
	* okCallback：方法，确认后执行的回调函数
	* noCallback：方法，取消或关闭后执行的回调函数
	
  示例如下 :
  		
		 
		var tips = require(../../../plugin/tips);
		tips.showConfirm(
			"是否确认删除该条信息？",
			function(){
				alert("删除成功！~");
			},
			function(){
				alert("删除取消。");
		});
	
##Ztree 树形图组件

* 用于向页面插入一个可操作的树形图。
* 接口方法：
	* var treeObj = Ztree.getTreeObj(datas,nodes);  获取tree对象
	* treeObj.get$Dom();	获取整个树图包括其外框的JQ对象
	* treeObj.getCheckedNodes(checked);	获取被勾选（可不填参数，默认被勾选：true，不被勾选：false）的所有node节点对象数组
* 数据格式：
	* datas : json格式, 控制树的基本显示方式，作为参数传入tree对象，参数可不填或选填，不填时datas={}，默认参数如示例。
	* nodes : Array(json), 以数组套json的格式，为数组提供显示的内容，作为参数传入树对象。

示例：

		
		var datas = {
						treeName : '成员组织架构图',		//树显示的名称:String，默认："树状图"
						treeId : '', 			//树的id	:String，默认为空
						showCheckboxs : false,	//是否显示复选框？:Boolean，默认为:false
						showButtonGroup : true, //是否显示增删改按钮组？:Boolean，默认为:false
						treeClick : function(ev,tid,tnod){	//树的点击回调事件:Function(event,treeId,treeNode)，默认为空
							alert('当前点击的是：'+tnod.name);
						}			
			};
				
			//--nodes格式详解：--
			  	1、name：String格式，为节点增加其名称。
			  	2、children：Array(json)[{……}],为当前节点添加子节点。
			  	3、checked：Boolean格式，规定节点显示时是否为已选定状态。
			  	4、open：Boolean格式，规定节点显示时是否为展开状态。
			 	5、hideBtn、showBtn：规定隐藏或显示按钮，与showButtonGroup：true/false对应
				 	 ·当showButtonGroup为true时，可以给每个节点设置hideBtn(隐藏指定小按钮)，
				 	 · 同样当showButtonGroup为false时，可以给每个节点设置showBtn(显示指定小按钮)，
				 	 ·1：增加，2：编辑，3：删除,
				 	 · showBtn，hideBtn，不能同时出现。
				6、modalType：点击编辑后的弹框类型
				     ·addType：点击新增、直接子节点点击编辑后的弹框类型
				   	 ·若某节点有modalType：3，其父节点有addType：2，以modalType为最高优先级
			 
			---//
			
		var nodes = 
				[
				{name : '艾泰上海总部', modalType: 0, addType: 0,hideBtn:23, 
				children :
				[
					{name : '研发部', addType: 1,
					children :[
						{name : '王王王'},
						{name : '陈陈陈'},
						{name : '张张张'},
						{name : '赖赖赖'},
					]},
					{name : '市场部', modalType: 1,  addType: 2,
					children :[
						{name : '彭清'},
						{name : '胡月'}
					]}
				]}
				];
				
		var Ztree = require(../../../plugin/Ztree);
		var treeobj = Ztree.getTreeObj(datas,nodes);
		var $dom = treeobj.get$Dom();
		$('body').append($dom);
		


##属性管理器组件
* 向页面插入一个小按钮，点击后可显示当前对应表格的所有列名，可通过勾选列名前的checkbox来设置该列是否显示。
* 接口方法：
	* var amObj = Am.getAmObj(datas); 获取属性管理器对象。
	* amObj.get$Dom; 获取已初始化的JQ文档对象。
	* amObj.getChecked; 获取当前的所有已显示的列的勾选状况。
* 数据格式：
	* datas ：json格式，其中可选填top，left，id，col，checkchange，list，见示例。

示例：

		//---list数据详解：---
		  	组：
			title：组名称，不填则不显示。
			children：组内的列对象数组。
			hide：（默认true隐藏），是否隐藏当前组。
			
			列：
			name：名称。
			check：（默认false不勾选）是否初始化时勾选该列。
			hide：（默认true隐藏），是否隐藏当前列。
			disabled：（默认false不被屏蔽操作），是否屏蔽当前列的勾选操作。
			
		---//
		var list = [
				{title:'基本属性', children:[
					{name : 'ID', check: true, disabled: true},
					{name : '用户姓名',  check: false,disabled: true},
					{name : '用户IP', check: false, disabled: true}
				]},
				{title:'自定义属性:', children:[
					{name : '个性化设置'},
					{name : '登录方式'},
					{name : '隐藏属性',hide:true},
					{name : '设备名称' ,check: true,},
					{name : '限速设置', check: true,}
				]},
				{title:'', children:[
					{name : '上传速率'},
					{name : '下载速率'},
					{name : '宽带占用量'},
					{name : '最后接入时间'},
				]},
				{title:'隐藏属性组:', hide:true , children:[
					{name : '隐藏一'},
					{name : '隐藏二'},
					{name : '隐藏三'}
				]}
			];
			
		//--datas数据详解--
			top/left： 组件的css：top、left。
			id： 组件最外层.u-am节点的id。
			col： 单列显示/双列显示（默认为0），0：当总列数大于12个时，双列显示，不足则单列，1：规定单列显示，2：规定双列显示。
			list： 数据内容（见上）。
			checkChange(event,changeJson,allArr) ： 当有列的勾选被改变时会触发该方法，传回3个参数（event,changeJson,allArr）
					event:checkbox改变的事件对象
					changeJson:json格式，勾选改变的当前列对象，changeJson.name:当前列名；changeJson.check:当前列的勾选状况（true/false）;
					allArr:Array(json),所有列的勾选状况，格式为：[{name:'列一',check:true},{name:'列二',check:false},……];
			
			
		--//
			var demodatas = {
				top:0,
				left :0,
				id : '',
				col : 0,
				list : list,
				checkChange : function(event,nowNode,allNode){
					GridObj.modify(allNode);//可将allNode数据作为参数直接传入栅格系统对象中，调用modify修改（请注意名称的相同）；
				}
			}

##栅格显示系统

* 向页面插入一个个性化显示组，可对每个部分进行展开收起、刷新、关闭操作，系统分：多标签框和单标签组两种，根据数据的传入方式自动区分并显示。

* 接口方法：
	* var GridObj = Grid.getGridObj(list); 获取属性管理器对象。
	* GridObj.get$Dom(); 获取已初始化的JQ文档对象。
	* GridObj.refresh(); 获取当前的所有已显示的列的勾选状况。 
	* GridObj.modify(checkJson);匹配Attm属性管理器的返回数据批量修改数据。
* 数据格式：
	* datas ：见详解

示例：

		//--GridList--数据详解
			1.数据格式以数组为分组元素：[[],[],[],[],……]
				每个小数组代表一个整体。
				如果小数组内有多个json数据对象，则代表一个多标签组，
				如果只有一个json数据对象，则代表一个单页标签。
			2.title：标签页名称，必填
			3.id：放置内容的div节点id，必填且唯一
			4.hide：该是否为隐藏状态，不填默认为false
			5.linkurl:标签对应的 [更多] 链接的地址，不填为空则不显示
		--//
			var glist = 
		[
			[
				{
					title : '宽带',
					id : 'kd',
					hide : false
				},
				{
					title : '用户',
					id : 'yh',
					hide : false,
					linkurl : ''
				},
				{
					title : '无线用户',
					id : 'wxyh',
					hide : false,
					linkurl : 'dadasdddd'
				},
				{
					title : '隐藏',
					id : 'yc',
					hide : true,
					linkurl : 'adasfawfweda'
				}
			],
			[
				{
					title : 'WAN',
					id : 'wan',
					hide : false,
					linkurl : ''
				},
				{
					title : 'LAN',
					id : 'lan',
					hide : false,
					linkurl : 'asaasdasd'
				},
				{
					title : '无爱的',
					id : 'wad',
					hide : false,
					linkurl : 'dadasdddd'
				},
				{
					title : '444隐藏隐藏',
					id : 'ycyc',
					hide : true,
					linkurl : 'adasfawfweda'
				}
			],
			[
				{
					title : '1111',
					id : 'nowmostpp',
					hide : false,
					linkurl : ''
				}
			],
			[
				{
					title : '2222',
					id : 'nowmosttl',
					hide : false,
					linkurl : 'asdasdasdasd'
				}
			],
			[
				{
					title : '333',
					id : 'warning',
					hide : false,
					linkurl : 'asdasdasdasd'
				}
			],
			[
				{
					title : '444',
					id : 'work',
					hide : false,
					linkurl : 'asdasdasdasd'
				}
			],
			[
				{
					title : '5555',
					id : 'asdasdasd',
					hide : true,
					linkurl : 'asdasdasdasd'
				}
			]
			
		];
		//--GridData数据详解--
			1.list，如上
			2.close：点击关闭后的回调函数，参数为（event,closeArr,allArr）(event点击对象，关闭的对应标签json对象的数组，所有的json对象的数组)
			3.refresh：点击刷新后的回调函数，参数为（event,refreshJson）(event点击对象，被刷新的标签json对象)
		--//
		var gdata ={
			list : glist,
			close : function(event,closeArr,allArr){
						//输出隐藏的标签名称
						for(var i in closeArr){
							console.log(closeArr[i].title+'已隐藏');
						}
						//也可将数据作为参数直接传入属性管理器对象，调用modify方法进行修改
						AttmObj.modify(allArr);
					},
			refresh : function(event,refreshJson){alert(refreshJson.title+"刷新中……")}
		}
		
		var Grid = require('../../../plugin/Grid');
		var gobj = Grid.getGridObj(gdata);
		var $g = gobj.get$Dom();
		$('#content').append($g);