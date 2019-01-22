# V3.0模板模块API文档

by Jeremy Zhang

模板模块是指对TMOD模板的封装模块，目的在于方便业务代码中模板数据的书写。所有的模板模块存放在modules/template目录中，其目录组织和TMOD模板的目录结构相对应。

所有的模板模块命名与它所对应的模板一致，但是首字母要大写，建议在业务代码中引用模板模块的变量也使用首字母大写。
## 公共模板（common目录）

### BtnGroup模块
* BtnGroup模块对应common/btnGroup.html编译出来的模板，用于生成一组按钮。
* 模块接口方法,getHTML(data)
* data数据结构：数组，每一个元素是一个JSON，包含的键有：
  * id 按钮的id
  * name 按钮的名称
  
  示例如下：

		[
			{
				"id"   : "add",
				"name" : "新增"
			},
			{
				"id"   : "delete",
				"name" : "删除"
			}
		]

### Header模块
* Header模块对应common/header.html编译出来的模板,用于生成网页header区域，不需要传入数据。
* 模块接口方法，getHTML()

### TableHeader模块
* TableHeader模块对应common/tableHeader.html编译出来的模板，用于生成表格上方搜索、操作按钮，其中操作按钮使用的是btnGroup.html。
* 模块接口方法，getHTML(data)
* data数据结构，与BtnGroup模块一致。


### InputGroup模块
* InputGroup模块对应common/inputGroup.html编译出的模板，用于生成输入框组的外部包裹部分。
* 模块接口方法，getHTML()


### Modal模块
* Modal模块对应common/modal.html编译出来的模板，用于生成模态框。
* 模块接口方法，getHTML(data)
* data数据结构：json，包含的键有：
	* id 模态框的id，可以通过id在页面中找到模态框。
	* title 模态框标题

示例如下：

	{
		"id"    : "my-modal",
		"title" : "新增VLAN"
	}
### Pagination模块 
* Pagination模块对应common/pagination.html编译出来的模板，用于生成分页按钮组。
* 模块接口方法，getHTML(data)
* data数据结构：数组，每个元素是一个JSON，包含的键有：
	* link 按钮的链接
	* title 按钮名称

示例如下：

	[
		{
			"link" : "www.utt.com.cn",
			"title": "第五页" 
		},
		{
			"link" : "www.utt.com.cn",
			"title": "第六页" 
		}
	]
	
### Path模块
path模块对应common/path.html编译的模板，用于生成路径导航。

* 模块接口方法，displayPath(data), 生成路径导航
* data数据结构：JSON，包含的键有：
	* prevTitle,字符串,当前页面所属的类别名称。
	* links, 数组，其中元素为JSON，包含的键有：
		* link 链接
		* title 名称
	* currentTitle, 字符串，当前页面名称

示例如下：

	{
		"prevTitle"    : "网络配置",
		"links"        : [
			{"link" : "#netWork/LANConfig", "title" : "内网配置"}
		],
		"currentTitle" : "LAN口配置" 
	}


### Sidebar模块
Sidebar模块对应common/sidebar.html编译的模板，用于生成侧边栏导航。

* 模块接口方法， getHTML(data)
* data 数据结构：数组，每一个元素是JSON:包括的键有：
	* pos, 图标的位置
	* title, 每一个一级标题的标题名称
	* links, 每个一级标题所属的二级标题列表，数组，每个元素是一个JSON，对应一个二级标题的配置信息，包含的键有：
		* link， 二级标题的链接
		* title， 二级标题的名称


示例如下：

	[
		{
			"pos"   : "0",
			"title" : "网络配置" ,
			"links" : [
				{"link" : "#netWork/LANConfig", "title" : "内网配置"},
				{"link" : "#netWork/LANConfig", "title" : "内网配置"}
			] 
		},
		{
			"pos"   : "0",
			"title" : "网络配置" ,
			"links" : [
				{"link" : "#netWork/LANConfig", "title" : "内网配置"},
				{"link" : "#netWork/LANConfig", "title" : "内网配置"}
			] 
		},
	]


### Table模块
Table模块对应common/table.html编译的模板，用于生成表格。

* 模块接口方法，getHTML(data)
* data数据结构，JSON, 包含的键有：
	* thead, 数组， 表格头部的内容
	* tbody, 数组， 包含所有的表格内容; 每一个元素也是一个数组，包含每一行数据的内容，每一个元素就是要显示在表格的文字，如果要显示未被选择的选择框可以传入：‘<checkbox>';如果是被选择的选择框可以传入：'<checked>';如果要显示删除、编辑按钮,就要传入'<do>'。
	
示例如下：

	{
	  	thead: ['ID','名称', 'IP地址', '子网掩码','VALN ID','开启', '编辑'],
	  	tbody: [
	    	['1', '研发部1', '192.168.2.100', '192.168.2.100', '1', '<checkbox>', '<do>'],
	    	['2', '研发部5', '192.168.2.100', '192.168.2.100', '2', '<checked>', '<do>'],
	    	['3', '研发部3', '192.168.2.100', '192.168.2.100', '3', '<checked>', '<do>'],
	    	['4', '研发部4', '192.168.2.100', '192.168.2.100', '4', '<checkbox>', '<do>'],
	  	]
	}
	

### TableContainer模块
* TableContainer模块对应common/tableContainer.html编译出的模板，用于生成表格包裹部分。
* 模块接口方法，getHTML()

### TableHeader模块

* TableHeader模块对应common/tableHeader.html编译出来的模板，用于生成表格上方搜索、操作按钮，其中操作按钮使用的是btnGroup.html。
* 模块接口方法，getHTML(data)
* data数据结构，与BtnGroup模块一致。



### Tabs模块
Tabs模块对应common/tabs.html编译的模板，用于生成标签页。

* 模块接口方法，displayTabs(data),生成标签页
* data数据结构, 数组，每个元素是JSON,包含每个标签页的数据，包含的键有：
	* id, 标签页标签的链接和对应标签页的id
	* title, 标签页标签的名称
	
示例如下：

	[
		{"id" : "one", "title" : "DHCP服务"},
		{"id" : "two", "title" : "DHCP配置"},
	]


## 输入框组
输入框组是多个模板组合而成的模板，用于生成一组输入框。本模块存放在modules/plugin目录中。

* 模块接口方法，getDom(data)
* data数据结构， 数组， 每个元素是JSON，包含一个输入框的配置数据。包含以下键：
	* prevWord, 输入框之前的文字
	* inputData, 输入框的配置数据
	* afterWord, 输入框之后的文字
	
	* titleName, 当需要插入小标题时，只需要传入titlName一条属性就可以了
示例如下：


		[
			{
				"titleName" : '小标题'
			},
			{
				"prevWord" : 'ip',
				"inputData" : {
					"type" : 'text',
					"name" : 'user',
					"value": 'username',
					"placeholder": 'please input',
					"class": 'ip',
					"checkFunc": 'checkIP'
					"errorStr" : 'ip错误'
				},
				"afterWord": 'input ip'
			},
			{
				"prevWord" : 'info',
				"inputData" : {
					"type" : 'textarea',
					"name" : 'info',
					"value": 'info',
					"placeholder": 'please input info',
					"class": 'info',
					"checkFunc": 'checkInfo'
					"errorStr" : 'cuowu'
				},
				"afterWord": 'input info'
			},
			{
				"prevWord" : 'fd',
				"inputData": {
					"type" : 'select',
					"name" : 'book',
					"items": [
						{"value" : 'jskkk', "name" : 'js', "isSelected" : true},
						{"value" : 'javakkk', "name" : 'java', "isSelected" : false},
						{"value" : 'jsckkk', "name" : 'jsc', "isSelected" : false}
					]
				},
				"afterWord": 'input info'
			},
			{
				"prevWord" : 'fd',
				"inputData": {
					"type" : 'checkbox',
					"name" : 'color',
					"items": [
						{"value" : 'redff', "name" : 'red', "isChecked" : true},
						{"value" : 'javaff', "name" : 'java', "isChecked" : false},
						{"value" : 'jscff', "name" : 'jsc', "isChecked" : true}
					]
				},
				"afterWord": 'input info'
			},
			{
				"prevWord" : 'fd',
				"inputData": {
					"type" : 'radio',
					"name" : 'sex',
					"items": [
						{"value" : 'male', "name" : 'man', "isChecked" : true},
						{"value" : 'female', "name" : 'woman', "isChecked" : true},
					]
				},
				"afterWord": 'input info'
			}
		]
	
其中inputData是最主要的数据，包含每个输入框的配置数据，不同类型的输入框有着不同的配置数据，inputData中键type的值就是输入框的类型，有text、textarea、select、radio、checkbox五种，下面分别介绍他们的配置数据如何书写。

* type 为 text,对应普通的输入框,inputData的键有
	* type，输入框类型，text
	* name, 输入框的name
	* value,输入框的value
	* placeholder, 输入框的placeholder
	* class, 输入框的class
	* checkFuc, 输入框的检测函数
	* errorStr, 输入错误时的提示文字
	
			{
				"prevWord" : 'ip',
				"inputData" : {
					"type" : 'text',
					"name" : 'user',
					"value": 'username',
					"placeholder": 'please input',
					"class": 'ip',
					"checkFunc": 'checkIP'
					"errorStr" : 'ip错误'
				},
				"afterWord": 'input ip'
			},
			
* type 为 textarea,对应普通的文本输入框,inputData的键有
	* type，输入框类型，textarea
	* name, 输入框的name
	* value,输入框的value
	* placeholder, 输入框的placeholder
	* class, 输入框的class
	* checkFuc, 输入框的检测函数
	* errorStr, 输入错误时的提示文字

	
			{
				"prevWord" : 'info',
				"inputData" : {
					"type" : 'textarea',
					"name" : 'info',
					"value": 'info',
					"placeholder": 'please input info',
					"class": 'info',
					"checkFunc": 'checkInfo'
					"errorStr" : 'cuowu'
				},
				"afterWord": 'input info'
			},
			
* type 为 select, 对应下拉选择框, inputData的键有
	* type, 输入框类类型, select
	* name, 输入框的name
	* items, 数组,下拉框的所有options的数据；每个元素是JSON，对应一个options的数据，包含的键有：
		* value, options的value
		* name, 每个options后面的文字
		* isSelected, true || false， 是否被选中


			
* type 为 checkbox, 对应复选框, inputData的键有
	* type, 输入框类类型, checkbox
	* name, 输入框的name
	* items, 数组,所有复选框的数据；每个元素是JSON，对应一个checkbox的数据，包含的键有：
		* value, checkbox的value
		* name, 每个checkbox后面的文字
		* isChecked, true || false， 是否被选中
		
			
* type 为 radio, 对应单选, inputData的键有
	* type, 输入框类类型, radio
	* name, 输入框的name
	* items, 数组,所有单选框的数据；每个元素是JSON，对应一个radio的数据，包含的键有：
		* value, radio的value
		* name, 每个radio后面的文字
		* isChecked, true || false， 是否被选中
	
* titleName 小标题为特殊的表单元素
	* titleName, 小标题名称



### Column模块
 	分栏模板，向页面插入指定宽度比的并列两栏文档域

* 模块接口方法，getHTML(data)
* 数据格式：
	* leftId, 左侧文档域id
	* rightId, 右侧文档域id
	* ratio, 宽度比率，如："1:1","3:7";

示例如下：

		var data = {
				"leftId" : 'leftPart1',
				"leftId" : 'rightPart1',
				"ratio" : '3:4'
			}
		var Column = requrie('../../../template/common/Column');
		var html = Column.getHTML(data);
		

### Panel模块
 	折叠面板模板（手风琴模板），向页面插入由多个可折叠的文档域组成的模板

* 模块接口方法，getHTML(data)
* 数据格式：
	* parentId, 父框的id，用于保证在一个范围内的子面板可以互相影响
	*	children, 子面板数组[['name1','id1'],['name2','id2'],[……],……}]
* 子面板对象数据格式：
	* children[0] : 子面板的标题
	* children[1] : 子面板的id，可直接向$('#id')其中插入其他内容

示例如下：

		var data = {
				"parentId" : 'panel1',
				"children" : [
					['基础信息','p_jichu'],
					['系统设置','p_xitong'],
					['高级配置','p_gaoji'],
				]
			}
		var Panel = requrie('../../../template/common/Panel');
		var html = Panel.getHTML(data);
		


### MoveTo模块
 MoveTo模块，一般在表格后插入，用来将指定的规则移动至另一个规则前面，（原型示例见“访问控制”页面）

* 模块接口方法，getHTML(……)
* ……
	* ……
	* ……
	
示例如下：

		……

### Ztreeplus模块
 树形图扩展模块，当树形图需要和其他组件模块组合使用并展示时，可以用此模块展示。该模块提供树形图的关闭和展开功能，方便用户浏览。

* 模块接口方法，get$dom(rightPartId,tree$dom,right$dom)
	* rightPartId, 右侧文档域的id，方便后续向其中添加元素
	* tree$dom, 树形图组件的jq对象
	* right$dom, 右侧即将插入的表格或其他jq对象
	
示例如下：

		var nodes = [……];
		var datas = {……};
		var tree = require('../../../plugin/Ztree');
		var treeobj = tree.getTreeObj(datas,nodes);
		//获得树形图jq对象
		var $treedom = treeobj.get$Dom();
		
		var tabsList = [……];
		var Tabs = require('../../../plugin/Tabs');
		//获得标签组对象
		var $tabdom = Tabs.get$dom(tabsList);
		
		//将两个对象作为参数传入树形扩展模块
		var treeplus = require('../../../template/common/Ztreeplus');
		var $plusdom = treeplus.get$dom('rightID',$treedom,$tabdom);




































