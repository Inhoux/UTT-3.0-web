/**
 * 表格组件
 * 生成表格内容
 * 表格排序、新增、分页显示、删除、刷新
 * @author JeremyZhang
 * @date   2016-09-14                                                                     [description]
 */
define(function(require, exports, module){
	require('jquery');
	// checkbox的人性化点击
	function setCheckboxCoverClick($dom){
		$dom.on('click','th,td',function(event){
			var e = window.event || event,
				$e = $(e.target) || $(e.srcElement);
				$e.find('input[type="checkbox"]').click();
		});
	}
	// 列高亮hover事件
	function setTheadHover($dom){
		$('#content table.table td').removeClass('u-table-heightLight');
		$('#content table.table th').removeClass('u-table-th-heightLight');
		$dom.on('mouseenter','table.table th',function(event){
			var t = $(this);
			t.addClass('u-table-th-heightLight');
			var thcount = t.index()+1;
			t.parents('table.table').find('tr td:nth-of-type('+thcount+')').addClass('u-table-heightLight');
		});
		$dom.on('mouseleave','th',function(event){
			var t = $(this);
			t.removeClass('u-table-th-heightLight');
			var thcount = t.index()+1;
			t.parents('table.table').find('tr td:nth-of-type('+thcount+')').removeClass('u-table-heightLight');
		});
	}
	// 给表格绑定人性化交互事件
	Table.prototype.setTable = function(){
		var t = this.dom;
		setCheckboxCoverClick(t);
		setTheadHover(t);
	}
	/**
	 * 表格类构造函数
	 * @author JeremyZhang
	 * @date   2016-10-27
	 * @param  {[type]}   data [description]
	 */
	function Table(data){
		this.tableHeadData = {};     // 表格上方配置数据
		this.titleData     = {};     // 表头标题和数据库映射关系
		this.titleArr      = [];     // 表格头部标题列表   
		this.hideColArr    = [];     // 表格隐藏的列
		this.database      = null;   // 表格对应的数据库
		this.isSelectAll   = true;   // 第一列是否是勾选框
		this.hasPagination = true;   // 是否显示分页
		this.dataPerPage   = 10;     // 每页显示的数据数量
		this.dataAmount    = 0;      // 所有数据的条数
		this.currPage      = 1;      // 当前显示的页码
		this.max           = 0;      // 可以配置的最大条目数

		this.searchWord    = '';     // 搜索关键字
		this.isNeedSearch  = true;   // 表格是否需要查找

		this.allTrs        = [];     // tbody中所有tr组成的数组
		this.showTrs       = [];     // tbody中所有需要展示的tr组成的数组

		this.sortKey       = null;   // 排序列的关键字
		this.sortType      = '';     // 按类型排序
		this.sortAsc       = true;   // 正常升序排序
		
		this.filterData    = {};     // 筛选数据
		this.filterDataLength = 0;	 // 需要筛选的列个数
		
		this.lang          = '';
		this.dicArr        = ['common'];
		this.dom           = $();
		this.otherFuncAfterRefresh = data.table.otherFuncAfterRefresh || function(){}; // 刷新之后执行的其他自定义的回调方法
		
		this.G = 0;
		
		/* 初始化及其他方法 */		
		this.initConfig(data);       // 初始化配置数据
		this.initDom();              // 生成表格整个框架结构
		this.initAllTrs();           // 生成tbody所有的tr
		
		this.translate(this.dom);
		
		this.showTrsInTbody();       // 根据搜索、排序、页码将部分tr显示
		
		this.showPagination();       // 生成表格翻页
		this.initEvent(); // 为表格添加事件
		this.setTable();
		/*
		
		if(this.getData().length > this.dataPerPage){
			
			newAlls = this.getData().slice(this.dataPerPage);
			var num = Number(this.dataPerPage);
			var otherArr = [];
			for(var ii = 0; ii<newAlls.length ; ii++){
				if(num == 0){
					num = Number(this.dataPerPage);
					setTimeout(function(){
						tt.initOther(otherArr);
						tt.showTrsInTbody();       // 根据搜索、排序、页码将部分tr显示
						tt.showPagination();       // 生成表格翻页
					},1);
					otherArr = [];
				}
				otherArr.push(newAlls[ii]);
				num--;
			}
			if(otherArr.length>0){
				setTimeout(function(){
					tt.initOther(otherArr);
					tt.showTrsInTbody();       // 根据搜索、排序、页码将部分tr显示
					tt.showPagination();       // 生成表格翻页
				},1);
			}
		}
		*/
		
		
		
		/*
		var tt = this;
		setTimeout(function(){
			tt.initOther();
			tt.showTrsInTbody();       // 根据搜索、排序、页码将部分tr显示
			tt.showPagination();       // 生成表格翻页
		},1);
		*/
		
		
	}
	
	
	Table.prototype.refresh = function(nowbase){
		var tableobj = this;
		if(nowbase){
			tableobj.database = nowbase;
			if(tableobj.currPage>tableobj.getPageAmount){
				tableobj.currPage = 1;
			}
			tableobj.initAllTrs(); 
			tableobj.translate(tableobj.dom);
			var searchWordOld = tableobj.searchWord;
			tableobj.isNeedSearch = true;
			tableobj.searchWord = '';
			tableobj.showTrsInTbody();  
			if(searchWordOld !== ''){
				tableobj.isNeedSearch = true;
				tableobj.searchWord = searchWordOld;
				tableobj.showTrsInTbody(); 
			}
			tableobj.showPagination();       // 生成表格翻页
			
		}
	}
	
	
	Table.prototype.initConfig = function(data){
		/*
			获取表格上方操作区配置数据
			存入Table类
		 */
		var headData       = data.head;
		this.tableHeadData = headData;
		/*
			获取表格配置数据
			生成表格thead列表
		 */
		var	tableData     = data.table;
		var database      = tableData.database,
			titleData     = tableData.titles,
			isSelectAll   = tableData.isSelectAll
			hideColArr    = tableData.hideColumns || [],
			lang          = tableData.lang || '',
			hasPagination = tableData.hasPagination,
			dicArr        = tableData.dicArr || ['common'],
			max           = tableData.max || '0',
			otherFuncAfterRefresh = tableData.otherFuncAfterRefresh || function(){};
		dicArr.push('common');
		var titleArr = [];
		for(var key in titleData){
			titleArr.push(key)
		}
		this.hideColArr    = hideColArr;
		this.titleArr      = titleArr;
		this.database      = database;
		this.titleData     = titleData;
		this.isSelectAll   = isSelectAll;
		this.lang          = lang;
		this.dicArr        = dicArr;
		this.max           = max;
		this.otherFuncAfterRefresh = otherFuncAfterRefresh; // 刷新之后执行的其他自定义的回调方法
		if(hasPagination === false){
			this.hasPagination = hasPagination;
		}
	};
	
	
	
	/**
	 * 生成表格的框架结构
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.initDom = function(){
		var $div      = $('<div></div>');
		var $headDom  = this.getHeadDom(),
			$tableDom = this.getTableDom(),
			$paginCon = $('<div id="pagination"></div>');
		$div.append($headDom).append($tableDom).append($paginCon);
		this.dom = $div; 
	};
	/**
	 * 获得表格上方操作区域的dom
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   表格上方操作区域dom
	 */
	Table.prototype.getHeadDom = function(){
		var data      = this.tableHeadData;
		if(data){
			var TableHead = require('TableHeader'),
				$headDom  = TableHead.getDom(data);
			return $headDom;
		}else{
			return $();
		}
	};
	/**
	 * 获得table dom，但是tbody内还是空的
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   表格dom
	 */
	Table.prototype.getTableDom = function(){
		// 获得表格框架dom
		var $tableDom = this.getTableConDom(),
			$theadDom = this.getTheadDom();
		$tableDom.find('thead').append($theadDom);
		return $tableDom;
	}
	/**
	 * 获得表格框架dom，不包含thead、tbody
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   表格框架dom
	 */
	Table.prototype.getTableConDom = function(){
		var Table = require('P_template/common/Table'),
			html  = Table.getHTML({});
		return $(html);
	}
	/**
	 * 获得表格thead的tr
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   thead下tr的dom
	 */
	Table.prototype.getTheadDom = function(){
		var TableObj = this;
		var $tr         = getTrDom();
		var isSelectAll = this.isSelectAll;
		if(isSelectAll){
			var $dom = getSelectDom('th', false);
			$dom.attr('data-table-type', 'select');
			$dom.attr('style','width:50px;text-align:center !important')
			$tr.append($dom);
		}
		var titleArr     = this.titleArr;
		var titleData    = this.titleData;
		titleArr.forEach(function(title){
			var $th      = getThDom();
			$th.attr('data-column-title', title);
			var $span    = getSpanDom(title);
			$span.attr('data-type', 'table-title');
			$th.append($span);
			if(titleData[title].sort !== undefined){
				var $sortBtnDom = getSortBtnDom(titleData[title].sort);
				$th.children('span').css({cursor:'pointer','user-select':'none'});
				$th.append($sortBtnDom);
			}
			if(titleData[title].select !== undefined && titleData[title].select.length>0){
				TableObj.filterData[title] = '{all}';
				TableObj.filterDataLength++;
				var $selectBtnDom = getSelectBtnDom(titleData[title].select,title);
				$th.append($selectBtnDom);
			}
			$tr.append($th);
			if($th.attr('data-column-title') == 'ID' || $th.attr('data-column-title') == 'id'){
				$th.css('width','50px');
			}else if($th.attr('data-column-title') == '编辑' || $th.attr('data-column-title') == '{edit}'){
				$th.css('width','60px');
			}
		});
		//this.hideColumns(this.hideColArr, $tr);
		return $tr;
	}
	Table.prototype.translate = function($dom,other$DomArr){
//		console.log('开始翻译')
		var Translate = require('Translate');
		var tranarr = [];
		if($dom && $dom.length>0){
			tranarr.push($dom);
		}
		if(other$DomArr !== undefined && other$DomArr.length>0){
			tranarr = tranarr.concat(other$DomArr);
		}
		if(tranarr.length>0){
			Translate.translate(tranarr, this.dicArr, this.lang);
		}
//		console.log('翻译结束,用时：'+((new Date().getTime()-this.G)/1000))
		this.G = new Date().getTime();
		
	};
	
	
	Table.prototype.initOther = function(){
		
		var thistable = this;
		
		var allTrs      = [];
		var titleArr    = this.titleArr;
		var titleData   = this.titleData;
		var isSelectAll = this.isSelectAll;
		var allData     = this.getData();
		var nowAll = [];
		if(allData.length > this.dataPerPage){
			nowAll = allData.slice(this.dataPerPage);
		}
		this.G = new Date().getTime();
		nowAll.forEach(function(data, index){
			
			var primaryKey      = data["primaryKey"];
			var $tr = getTrDom();
//			var trstr = '<tr>';
			
			if(isSelectAll){
				var $dom = getSelectDom('td', false);
				$dom.find('input').attr('data-table-type', 'select');
				$dom.find('input').attr('data-primaryKey', primaryKey);
//				trstr += '<td><input type="checkbox"  data-table-type="select" data-primaryKey="'+primaryKey+'"/></td>';
				$tr.append($dom);
			}
			
			titleArr.forEach(function(title){
//				trstr += '<td data-column-title="'+title+'" >';
//				var $td             = getTdDom();
				var $td             = $('<td data-column-title="'+title+'"></td>');
//				$td.attr('data-column-title', title);
				var titleConfJson   = titleData[title];
//				console.log(titleConfJson);
				
				var key             = titleConfJson.key;
				var value           = data[key];
				titleConfJson.value = value;
				titleConfJson.primaryKey = primaryKey;
				var $dom            = getTdChildDom(titleConfJson);
				
//				trstr += $dom;
//				trstr += '</td>'
				
				$td.append($dom);
				
				$tr.append($td);
//				Translate.translate([$td], thistable.dicArr, thistable.lang);
			});
//			trstr += '</tr>';
			allTrs.push($tr);
			// 异步翻译
			setTimeTranslate($tr,thistable)
//			allTrs.push($(trstr));
			
		});
		
//		this.translate('',allTrs);
		
		console.log('otherTrs 完成,用时：'+((new Date().getTime()-this.G)/1000))
		this.G = new Date().getTime();
		this.allTrs  = this.allTrs.concat(allTrs);
		this.showTrs = this.allTrs;
		
		
		
	
	}
	/**
	 * 生成tbody中所有的tr
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.initAllTrs = function(){
		var thistable = this;
		
		var allTrs      = [];
		var titleArr    = this.titleArr;
		var titleData   = this.titleData;
		var isSelectAll = this.isSelectAll;
		this.G = new Date().getTime();
		var allData     = this.getData();
		/*
		console.log('数据库获取数据完成,用时：'+((new Date().getTime()-this.G)/1000))
		console.log("共"+allData.length+"条数据");
		this.G = new Date().getTime();
		*/
//		var nowAll = [];
//		if(allData.length > this.dataPerPage){
//			nowAll = allData.slice(0,this.dataPerPage);
//		}
//		allData = allData.slice(0,1000);
		var trstr = '';
		allData.forEach(function(data, index){
			
			var primaryKey      = data["primaryKey"];
//			var $tr = getTrDom();
			trstr += '<tr>';
			
			if(isSelectAll){
//				var $dom = getSelectDom('td', false);
//				$dom.find('input').attr('data-table-type', 'select');
//				$dom.find('input').attr('data-primaryKey', primaryKey);
				trstr += '<td><input type="checkbox"  data-table-type="select" data-primaryKey="'+primaryKey+'"/></td>';
//				$tr.append($dom);
			}
			titleArr.forEach(function(title){
				trstr += '<td data-column-title="'+title+'" >';
//				var $td             = getTdDom();
//				var $td             = $('<td data-column-title="'+title+'"></td>');
//				$td.attr('data-column-title', title);
				var titleConfJson   = titleData[title];
//				console.log(titleConfJson);
				
				var key             = titleConfJson.key;
				var value           = data[key];
				titleConfJson.value = value;
				titleConfJson.primaryKey = primaryKey;
				var $dom            = getTdChildDom(titleConfJson);
				
				trstr += $dom;
				trstr += '</td>';
				
//				$td.append($dom);
//				
//				$tr.append($td);
//				Translate.translate([$td], thistable.dicArr, thistable.lang);
			});
			trstr += '</tr>';
//			allTrs.push($tr);
			

			
		});
		var $trdom = $(trstr);
		
		$trdom.each(function(){
			var $dom = $(this);
			allTrs.push($dom);
			setTimeTranslate($dom,thistable)
			
		})
			// 异步翻译
			
		/*
		console.log('allTrs 完成,用时：'+((new Date().getTime()-this.G)/1000))
		this.G = new Date().getTime();
		*/
//		this.translate('',allTrs);
		
//		console.log('allTrs翻译完成,用时：'+((new Date().getTime()-this.G)/1000))
//		this.G = new Date().getTime();
		
		this.allTrs  = allTrs;
		this.showTrs = allTrs;
		/*
		console.log('allTrs赋值完成,用时：'+((new Date().getTime()-this.G)/1000))
		this.G = new Date().getTime();
		*/
		
	}
	var Translate = require('Translate');
	function setTimeTranslate($dom,thistable){
//		setTimeout(function(){
			Translate.translate([$dom], thistable.dicArr, thistable.lang);
//		},1);
		
	}
	
	/**
	 * 获得表格所有数据
	 * @author JeremyZhang
	 * @date   2016-10-31
	 * @return {[type]}   [description]
	 */
	Table.prototype.getData = function(){
		var tableName   = 'defaultTable';
		var database    = this.database;
		
		data            = database.table(tableName)
								  .select();
		return data;
	};
	/**
	 * 显示tbody中需要显示的tr
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.showTrsInTbody = function(){
//		console.log('展示开始');
		var $tbody = this.dom.find('tbody');
		$tbody.empty();
		var $trs   = this.getShowTrs();
		if($trs.length > 0){
			$tbody.append($trs);
			$tbody.find('tr').each(function(){
				if($(this).children('td:first').attr('data-column-title') === undefined){
					$(this).children('td:first').attr('style','width:50px;text-align:center !important');
				}
			});
			if($trs.length <this.dataPerPage){
				var emptyTrNum = this.dataPerPage - $trs.length;
				
				for(var indexs = 0;indexs<emptyTrNum;indexs++){
					$tbody.append('<tr><td class="u-table-empty-td"  colspan="'+(this.titleArr.length+1)+'">&nbsp;</td></tr>');
				}
			}
			
			
			this.hideColumns();
			this.translate($tbody);
			var searchWord = this.searchWord;
			if(searchWord != ''){
				require('P_libs/js/highlight');
				$tbody.searchWord(searchWord);
			}
			
			
		}
		else{
			var emptyTrNum = this.dataPerPage;
			var html = '<tr><td class="u-table-empty-td" colspan="'+(this.titleArr.length+1)+'">'
						+ '<div data-local="{withoutData}">{withoutData}</div>'
						+ '</td></tr>';
			var $text = $(html);
			$text.find('div').css({
				'text-align': 'center'
			});
			$tbody.append($text);
			for(var indexs = 0;indexs<emptyTrNum-1;indexs++){
				$tbody.append('<tr><td class="u-table-empty-td"  colspan="'+(this.titleArr.length+1)+'">&nbsp;</td></tr>');
			}
			this.translate($tbody);
//			this.showEmpty();
		}
//		console.log('展示 完成,用时：'+((new Date().getTime()-this.G)/1000))
		// 调用表格刷新时一切其他的方法回调
		if(this.otherFuncAfterRefresh){
			this.otherFuncAfterRefresh(this);
		}
		
	
		
	};
	Table.prototype.showEmpty = function(){
		var $tbody = this.dom.find('tbody');
		var html = '<tr><td colspan="20" >'
					+ '<div data-local="{withoutData}">{withoutData}</div>'
					+ '</td></tr>';
		var $text = $(html);
		$text.find('div').css({
			'text-align': 'center'
		});
		$tbody.append($text);
		this.translate($tbody);
	}
	/**
	 * 根据搜索、排序、页码获得当前需要显示的tr
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   tr组成的dom
	 */
	Table.prototype.getShowTrs = function(){
		
		// 初始化 满足搜索条件的tr
		this.initShowTrs();
		// 满足若干个筛选条件的tr
		this.filterTr();
		// 对 需要显示的tr排序
		this.sortTr();
		// 对所有的tr进行分页处理，返回当前页的tr
		var $trs = this.getTrsByPage();
		return $trs;
	};
	/**
	 * 根据搜索条件，初始化可以展示的tr
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.initShowTrs = function(){
		// 当前所有满足搜索条件的tr
		var showTrs      = this.showTrs;
		// 是否需要搜索
		var isNeedSearch =  this.isNeedSearch;
		
		if(isNeedSearch){
			showTrs      = this.selectTrByWord();
			this.showTrs = showTrs;
			this.isNeedSearch = false;
		}
		this.dataAmount = showTrs.length;
	};
	/**
	 * 根据关键字从所有的tr中进行搜索,并返回结果
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   满足查找条件的tr
	 */
	Table.prototype.selectTrByWord = function(){
		var allTrs     = this.allTrs; 
		var searchWord = this.searchWord;
		var showTrs    = [];
		if(searchWord !== ''){
			allTrs.forEach(function($tr){
				var isWordInTr = false;
				var $spans = $tr.find('td span');
				$spans.each(function(index, element){
					var text = $(element).text();
					var titletext = $(element).attr('title');
					if(text.toLowerCase().indexOf(searchWord.toLowerCase()) > -1){
						isWordInTr = true;
					}
					if(titletext !== undefined && titletext !== ''){
						if(titletext.toLowerCase().indexOf(searchWord.toLowerCase()) > -1){
							isWordInTr = true;
						}
					}
				});
				if(isWordInTr){
					showTrs.push($tr);
				}
			});
		}else{
			showTrs = allTrs;
		}
		return showTrs;
	};
	/**
	 * 根据排序条件对所有可以显示的tr进行排序
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.sortTr = function(){
		if(this.sortKey !== null){
			this.sortTrByKey();
			if(!this.sortAsc){
				var showTrs = this.showTrs.reverse();
				this.showTrs = showTrs;
			}
		}
	};
	/**
	 * 根据少选条件对tr进行筛选
	 * @author QC
	 * @date   2016-4-6
	 */
	Table.prototype.filterTr = function(){
		
		var showTrs =this.showTrs;
		var fdata = this.filterData;
		var flength = this.filterDataLength;
		if(flength > 0){
			var newShowTrs = [];
			showTrs.forEach(function(trobj){
				var colsTrHas = 0;
				for(var i in fdata){
					if(trobj.find('td[data-column-title="'+i+'"]>[data-local="'+fdata[i]+'"]').length == 1 || fdata[i] === '{all}'){
						colsTrHas++;
					}
				}
				if(colsTrHas === flength){
					newShowTrs.push(trobj);
				}
			});
			this.showTrs = newShowTrs;
		}
		
	};
	
	
	/**
	 * 根据某一列的列名进行排序，升序
	 * @author QC
	 * @date   2016-11-01
	 */
	Table.prototype.sortTrByKey = function(){
		var showTrs  = this.showTrs,
			sortKey  = this.sortKey,
			sortType = this.sortType;
		showTrs.sort(function(i, j){
//			var text1 = i.find('td[data-column-title="' + sortKey + '"] span').text();
//			var text2 = j.find('td[data-column-title="' + sortKey + '"] span').text();
			
			var text1 = i.find('td[data-column-title="' + sortKey + '"]').text();
			var text2 = j.find('td[data-column-title="' + sortKey + '"]').text();
			if(sortType == 'number'){
				/*按数字排序*/
				return compareNum(text1, text2);
			}else if(sortType == 'word'){
				/*按文字排序*/
				return compareChinese(text1, text2);
			}else if(sortType == 'size'){
				/*按数据大小（或速率）排序*/
				return compareDataSize(text1, text2);
			}else if(sortType == 'time'){
				/*按数时间排序*/
				return compareTime(text1, text2);
			}else if(sortType == 'ip'){
				/*按数ip排序*/
				return compareIp(text1, text2);
			}else if(sortType == 'mac'){
				/*按数mac排序*/
				return compareMac(text1, text2);
			}else if(sortType == 'demotime'){
				/*按数mac排序*/
				return compareDemotime(text1, text2);
			}else{
				/*默认按文字排序*/
				return compareChinese(text1, text2);
			}
			
		})
		this.showTrs = showTrs;
	};
	/**
	 * 排序比较条件
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @param  {[type]}   $tr1 [description]
	 * @param  {[type]}   $tr2 [description]
	 * @param  {[type]}   key  列名
	 */
	//	function compareNumberByKey(num1,num2){
	//		if(text1 > text2){
	//			return true;
	//		}
	//		return false;
	//	};
		
	
	// ip排序入口函数
	function compareIp(ip1,ip2){	
		var num1 = iptoNum(ip1);
		var num2 = iptoNum(ip2);
		return num1 - num2;
	};
	function iptoNum(ip){
	    var m =[];
		var num = 0;
		if(ip.indexOf('-')>0){
			ip = ip.split("-");
		}else if(ip.indexOf(':')>0){
			ip = ip.split(":");
		}else if(ip.indexOf('.')>0){
			ip = ip.split(".");
		}
	    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
	    num = num >>> 0;
	    return num;
	};
	
	// 数字排序入口函数
	function compareNum(num1, num2) {
		num1 = num1 || "";
		num2 = num2 || "";
		if(!trimstr(num1)) return -1;
		if(!trimstr(num2)) return 1;
		num1=parseNumber(num1);
		num2=parseNumber(num2);
		return num1 - num2;
	};
	
	function trimstr(str) {
	    str = str.toString();
	    if (str == "0") return "0";
	    if (str == "") return "";
	
	    while (str.length > 0 && str.indexOf(' ') == 0) {
	        str = str.substring(1, str.length);
	    }
	    while (str.length > 0 && str.lastIndexOf(' ') == str.length - 1) {
	        str = str.substring(0, str.length - 1);
	    }
	
	    return str;
	};
	
	function parseNumber(num){
		num = num || 0;
		try{ 
			num = parseFloat(eval(num));
		}
		catch(e){
			num = parseFloat(num);
		}
		return num;
	};
	
	
	// 数据大小,流量排序入口函数
	function compareDataSize(num1, num2) {
	    num1 = convertToByte(num1);
	    num2 = convertToByte(num2);
	    return num1 - num2;
	};
	
	function convertToByte(num) {
	    var ret;
	    num = num || 0;
	    num = num.toString();
	    num = num.toUpperCase();
	    try {
	        ret = parseFloat(eval(num));
	        
	    } catch(e) {
	        ret = parseFloat(num);
	    }
	    if (num.indexOf("K") >= 0) ret = ret * 1024; 
	    else if (num.indexOf("M") >= 0) ret = ret * 1024 * 1024; 
	    else if (num.indexOf("G") >= 0) ret = ret * 1024 * 1024 * 1024; 
	    else if (num.indexOf("T") >= 0) ret = ret * 1024 * 1024 * 1024 * 1024; 
	    else if (num.indexOf("P") >= 0) ret = ret * 1024 * 1024 * 1024 * 1024 * 1024; 
	    ret = parseInt(ret); 
	    return ret;
	
	};
	
	// 时间排序入口函数
	function compareTime(time1, time2) {
		if(isNaN(Date.parse(time1))) {return 1};
		if(time1.indexOf('-')>0||time2.indexOf('-')>0){
			return Date.parse(time1.replace(/-/g,'/')) - Date.parse(time2.replace(/-/g,'/'));
		}
		if(time1.indexOf('/')>0||time2.indexOf('/')>0){
			return Date.parse(time1.replace(/-/g,'/')) - Date.parse(time2.replace(/-/g,'/'));
		}
	   
	};
	
	// 汉字排序入口函数
	function compareChinese(param1, param2) {
	    // 如果两个参数均为字符串类型
	    if(typeof param1 == "string" && typeof param2 == "string"){
	        return param1.localeCompare(param2);
	    }
	    // 如果参数1为数字，参数2为字符串
	    if(typeof param1 == "number" && typeof param2 == "string"){
	        return -1;
	    }
	    // 如果参数1为字符串，参数2为数字
	    if(typeof param1 == "string" && typeof param2 == "number"){
	        return 1;
	    }
	    // 如果两个参数均为数字
	    if(typeof param1 == "number" && typeof param2 == "number"){
	       if(param1 > param2) return 1;
	       if(param1 == param2) return 0;
	       if(param1 < param2) return -1;
	    }
	   
	};
	
	// mac排序入口函数
	function compareMac(mac1,mac2){	
		var num1 = mactoNum(mac1);
		var num2 = mactoNum(mac2);
		return num1 - num2;
	};
	function mactoNum(mac){
		var m =[];
		var num = 0;
		if(mac.indexOf('-')>0){
			mac = mac.split("-");
		}else if(mac.indexOf(':')>0){
			mac = mac.split(":");
		}else if(mac.indexOf(' ')>0){
			mac = mac.split(" ");
		}else{
			for(var i=0;i<12;i+=2){
				m.push(mac.slice(i,i+2));
			}
			mac=m;
		}
	    num = parseInt(mac[0],16) * 256 * 256 * 16 + parseInt(mac[1],16) * 256 * 256 + parseInt(mac[2],16) * 256 * 16 + parseInt(mac[3],16) * 256 + parseInt(mac[4],16) * 16 + parseInt(mac[5],16);
	    num = num >>> 0;
	    return num;
	};
	
	/* 自定时长 n天 n时 n分排序 */
	
	function compareDemotime(t1,t2){
		/*中文下排序*/
		if(t1.indexOf('分')>=0 || t1.indexOf('时')>=0 || t1.indexOf('天')>=0){
			return getPartTime(t1)-getPartTime(t2);
		}else{
			return 0;
		}
	}
	
	function getPartTime(t){
		var s1 = 0;
		var s2 = 0;
		var s3 = 0;
		if(t.indexOf('分')>=0){
			if(t.indexOf('时')>=0){
				if(t.indexOf('天')>=0){
					// 123
					var at1 = t.split('分')[0];
					var r1 = at1.split('时');
					s1 = r1[1];
					var r2 = r1[0].split('天');
					s2 = r2[1];
					s3 = r2[0];
					
				}else{
					// 12
					var at1 = t.split('分')[0];
					var r1 = at1.split('时');
					s1 = r1[1];
					s2 = r1[0];
				}
			}else if(t.indexOf('天')>=0){
				// 13
				var at1 = t.split('分')[0];
				var r1 = at1.split('天');
				s1 = r1[1];
				s3 = r1[0];
			}else{
				// 1
				var at1 = t.split('分')[0];
				s1 = at1;
			}
		}else if(t.indexOf('时')>=0){
			if(t.indexOf('天')>=0){
				// 23
				var at1 = t.split('时')[0];
				var r1 = at1.split('天');
				s2 = r1[1];
				s3 = r1[0];
			}else{
				// 2
				var at1 = t.split('时')[0];
				s2 = at1;
			}
		}else if(t.indexOf('天')>=0){
			// 3
			var at1 = t.split('天')[0];
			s3 = at1;
		}
		var ends = (parseInt(s1))*60+(parseInt(s2)*60*60)+(parseInt(s3)*60*60*24);
		return ends;
	}
	
	
	/**
	 * 对所有满足搜索条件的tr进行分页处理
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {$dom}   当前页tr组成的dom
	 */
	Table.prototype.getTrsByPage = function(){
		var showTrs     = this.showTrs;
		var currPage    = this.currPage,      // 当前页码 
			dataPerPage = this.dataPerPage;   // 每一页数据条数
		var beginIndex  = (currPage - 1) * dataPerPage; 
		var trArr       = showTrs.slice(beginIndex, beginIndex + dataPerPage);
		var $div        = $('<div></div>');
		trArr.forEach(function($tr){
			$div.append($tr);
		});
		return $div.children();
	};
	/**
	 * 显示翻页按钮
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.showPagination = function(){
		if(this.hasPagination){
			var $pagination = this.getPaginationDom();
			this.dom.find('#pagination').empty().append($pagination);
		}
	};
	/**
	 * 获得翻页按钮组的dom
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.getPaginationDom = function(){
		/* 原翻页按钮
		var Pagination = require('P_template/common/pagination');
		var pageAmount = this.getPageAmount();
		var list       = [];
		for(var i = 0; i < pageAmount; i++){
			var conf = {
				link  : i + 1,
				title : i + 1
			};
			list.push(conf);
		}
		var html = Pagination.getHTML(list); 
		*/
		/* 判断有无最大条目数限制 */
		var maxStr = '';
		if(Number(this.max) && Number(this.max)>0){
			var maxnum = Math.round(Number(this.max));
			var nownum = this.dataAmount;
			maxStr = '<span title="'+'当前条数：'+nownum+',最大可配置条数：'+maxnum+'" style="color:#888888;position:absolute;top:8px;left:15px;">'+nownum+" / "+maxnum+'</span>';
			
		}
		
		/* 新翻页按钮 */
		var pghtml = '<div class="u-pagination">'+
							maxStr+
							'<img id="pagefirst" src="static/img/page-fast-backward.png" style="cursor:pointer;margin:-2px 2px 0;"></img>'+
							'<img id="previous" src="static/img/page-step-backward.png" style="cursor:pointer;margin:-2px 2px 0;"></img>'+
							'<input id="wannapage" class="u-pg-input" type="number"  min="1" max="'+this.getPageAmount()+'" value="'+this.currPage+'"/>'+
							'<span> / </span>'+
							'<span id="u-btm-maxpagenums">'+this.getPageAmount()+'</span>'+
//							'<span id="searchpage" class="glyphicon glyphicon-search"></span>'+
							'<img id="next" src="static/img/page-step-forward.png" style="cursor:pointer;margin:-2px 2px 0;"></img>'+
							'<img id="pageend"  src="static/img/page-fast-forward.png" style="cursor:pointer;margin:-2px 2px 0;"></img>'+
					'</div>';
		return $(pghtml);
	}
	/**
	 * 获得表格总页数
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {int}   表格页数
	 */
	Table.prototype.getPageAmount = function(){
		var pageAmount = this.dataAmount / this.dataPerPage;
		if(pageAmount % 1 !== 0){
			pageAmount = Math.floor(pageAmount) + 1;
		}
		if(pageAmount == 0){
			pageAmount = 1;
		}
		return pageAmount;
	};
	/**
	 * 样式调整
	 */
	Table.prototype.initStyle = function(){
		this.setTimeForStyle = function(){
			if(this.getDom().is(':visable')){
				
			}
		}
	}
	Table.prototype.initEvent = function(){
		// 添加表格全选事件
		this.selectAllEvent();
		// 每页显示数量修改事件
		this.changeAmountPerPage();
		// 翻页事件
		this.changePage();
		// 排序事件
		this.sortEvent();
		// 筛选事件
		this.filterEvent();
		// 搜索事件
		this.initSearchEvent();
		// 全局事件
		this.initGlobalEvent();
		// 表格样式调整监听事件
		this.initStyle();
	};
	function delclick(data,$tdom,i){
		var thisdata = data;
		$tdom.on('click','[event-type="delete"]',function(event){
			var e = event || window.event;
			var tg = e.target || e.srcElement;
			var $thisbtn = $(tg);
			if(thisdata.clickFunc){
				thisdata.clickFunc($thisbtn);
			}
			
		})
	}
	function edclick(data,$tdom,i){
		var thisdata = data;
		$tdom.on('click','[data-event="edit"]',function(event){
			var e = event || window.event;
			var tg = e.target || e.srcElement;
			var $thisbtn = $(tg);
			if(thisdata.clickFunc){
				thisdata.clickFunc($thisbtn);
			}
		})
	}
	function linkclick(data,$tdom,i){
		var thisdata = data;
		thisdata.links.forEach(function(btndata){
			$tdom.on('click','[data-column-title="'+i+'"]>a[data-local="'+btndata.name+'"]',function(event){
				var e = event || window.event;
				var tg = e.target || e.srcElement;
				var $thisbtn = $(tg);
				if(btndata.clickFunc){
					btndata.clickFunc($thisbtn);
				}
				
			})
		})
	}
	function checkclick(data,$tdom,i){
		var thisdata = data;
		$tdom.on('click','td[data-column-title="'+i+'"]>input',function(event){
			var e = event || window.event;
			var tg = e.target || e.srcElement;
			var $thisbtn = $(tg);
			if(thisdata.clickFunc){
				thisdata.clickFunc($thisbtn);
			}
			
		})
	}
	Table.prototype.initGlobalEvent = function(){
		var t = this;
		var $tdom = t.dom;
		var thisdata = t.titleData;
		
		for(var i in thisdata){
			var thisType = thisdata[i].type;
			switch(thisType){
				case 'btns':
					thisdata[i].btns.forEach(function(btndata){
						if(btndata.type == 'edit'){
							edclick(btndata,$tdom,i);
						}else if(btndata.type == 'delete'){
							delclick(btndata,$tdom,i);
						}
					});
					break;
				case 'links':
					linkclick(thisdata[i],$tdom,i)
					break;
				case 'checkbox':
					checkclick(thisdata[i],$tdom,i)
					break;
			}
		}
		
	}
	/**
	 * 表格thead第一列全选按钮事件
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.selectAllEvent = function(){
		var $table = this.dom;
		// 获得表格头部的选择框，并添加全选事件
		var $checkAll = $table.find('thead input');
		$checkAll.click(function(){
			changeChecked($table, $(this));
		});
	};
	/**
	 * 修改table tbody 第一列选择框的状态
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @param  {[type]}   $table    [description]
	 * @param  {[type]}   $checkAll [description]
	 * @return {[type]}             [description]
	 */
	function changeChecked($table, $checkAll){
		var isAllChecked = true;
		var $elems = $table.find('tbody input[data-table-type="select"]');
		$elems.each(function(index, element) {
			if(!$(element).is(':checked')){
				isAllChecked = false;
			}
		});
		if(isAllChecked){
			$elems.add($checkAll).prop('checked', false);
		}else{
			$elems.add($checkAll).prop('checked', true);
		}
	}
	/**
	 * 修改 表格每一页 显示的数量 事件
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.changeAmountPerPage = function(){
		
		var table  = this;
		var $dom   = this.dom;
		var $ul    = $dom.find('#page-count-control ul.dropdown-menu');
		$ul.click(function(ev){
			var ev      = ev || window.event,
				target  = ev.target || ev.srcElement,
				$target = $(target);
			if($target[0].tagName.toLowerCase() == 'a'){
				/*
					修改表格每页显示的数量
					将当前页码置为1
				 */
				var num = parseInt($target.text());
				if(num != table.dataPerPage){
					$ul.parent().find('button > span[data-type="number"]').text(num);
					table.dataPerPage = num;
					table.currPage    = 1;
					table.showTrsInTbody();      // 重新显示表格
					table.showPagination();      // 重新显示分页
//					return false;
				}
			}
		});
	};
	/**
	 * 表格翻页事件
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.changePage = function(){
		var table      = this; 
		var $paginCon  = this.dom.find('#pagination');
		$paginCon.click(function(ev){
			var ev      = ev || window.event,
				target  = ev.target || ev.srcElement,
				$target = $(target);
			if($target[0].tagName.toLowerCase() == 'img'){
				var id       = $target.attr('id');
				var currPage = table.currPage;
				if(id == 'previous'){
					/* 上一页 */
					if(currPage > 1){
						table.currPage -= 1;
					}else{
						return false;
					}
				}else if(id == 'next'){
					/* 下一页 */
					var pageAmount = table.getPageAmount();
					if(currPage < pageAmount){
						table.currPage += 1;
					}else{
						return false;
					}
				}else if(id == 'pagefirst'){
					/* 第一页 */
					table.currPage = 1;
				}else if(id == 'pageend'){
					/* 最后一页 */
					var pageAmount = table.getPageAmount();
					table.currPage = pageAmount || 1;
				}
				/*
				 * 
				 // 跳转到某页
				else if(id == 'searchpage'){
					
					var pageAmount = table.getPageAmount();
					var wannapagenum = $paginCon.find('#wannapage').val();
					if(wannapagenum.toString === ''|| wannapagenum <1 || wannapagenum >table.getPageAmount()){
						$paginCon.find('#wannapage').val(table.currPage);
						return false;
					}
					 table.currPage = wannapagenum;
				}
				*/
				else{
//					return false;
				}
				table.showTrsInTbody();
				$paginCon.find('#wannapage').val(table.currPage);
				return false;
			}
		});
		$paginCon.find('#wannapage').blur(function(){
			var $t = $(this);
			/* 跳转到某页 */
			var pageAmount = table.getPageAmount();
			var wannapagenum = Number($t.val());
			if(wannapagenum.toString === ''|| wannapagenum <1 || wannapagenum >table.getPageAmount()){
				$t.val(table.currPage);
				return false;
			}
			 table.currPage = wannapagenum;
			 table.showTrsInTbody();
			 return false;
		});
		$paginCon.find('#wannapage').keydown(function(){
			if(event.keyCode == 13){
				$paginCon.find('#wannapage').trigger('blur');
			}	
		});
		
	};
	/**
	 * 表格排序事件
	 * @author JeremyZhang
	 * @date   2016-11-01
	 */
	Table.prototype.sortEvent = function(){
		var Table     = this;
		var $thead    = this.dom.find('thead');
		$thead.click(function(ev){
			var ev        = ev || window.event,
				target    = ev.target || ev.srcElement,
				$target   = $(target);
			
			var dataEvent = $target.attr('data-event');
			var datatype = $target.attr('data-type'); 
			if(dataEvent == 'sort'){
				$target.parent().parent().parent().find('.u-sort-insort').removeClass('u-sort-insort');
				$target.addClass('u-sort-insort');
				var key = $target.parent().parent().children('span[data-type="table-title"]').attr('data-local');
				var sortType = $target.attr('data-sorttype');
//				if(key != Table.sortKey || sortType != Table.sortType){
					Table.currPage = 1;
					Table.sortAsc = ($target.hasClass('u-sort-down'));
					if(key != Table.sortKey){
						Table.sortKey  = key;
					}
					if(sortType != Table.sortType){
						Table.sortType = sortType;
					}
					Table.showTrsInTbody();
					Table.showPagination();       // 生成表格翻页
//				}
			}
			if(datatype == "table-title"){
				if($target.nextAll('.u-table-sort').length>0){
					if($target.nextAll('.u-table-sort').find('.u-sort-insort.u-sort-down').length>0){
						$target.nextAll('.u-table-sort').find('.u-sort-up').trigger('click');
					}else{
						$target.nextAll('.u-table-sort').find('.u-sort-down').trigger('click');
					}
				}
			}
			
			
		});
	};
	/**
	 * 表格搜索事件
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {[type]}   [description]
	 */
	Table.prototype.initSearchEvent = function(){
		var Table      = this;
		var $searchBox = this.dom.find('.u-searchbox');
		var $btn       = $searchBox.children('i.icon-search');
		$btn.click(function(){
			var searchWord = $searchBox.children('input').val();
			if(searchWord != Table.searchWord){
				Table.isNeedSearch = true;
				Table.searchWord   = searchWord;
				Table.currPage     = 1;
				Table.showTrsInTbody();
				Table.showPagination();
			}
		});
		$searchBox.keydown(function(event) {
			if(event.keyCode == 13){
				$searchBox.children('i.icon-search').trigger('click');
			}	
		});
		
		
	};
	/**
	 * 表格筛选事件
	 * @author QC
	 * @date   2016-4-6
	 */
	Table.prototype.filterEvent = function(){
		var tableobj     = this;
		var $thead    = this.dom.find('thead');
		$thead.click(function(ev){
			var ev        = ev || window.event,
				target    = ev.target || ev.srcElement,
				$target   = $(target);
			
			var dataEvent = $target.attr('data-event');
			if(dataEvent == 'filter'){
				tableobj.filterData[$target.attr('data-coltitle')] = $target.attr('data-local');
				console.log(tableobj.filterData);
				tableobj.currPage = 1;
				var searchWordOld = tableobj.searchWord;
				tableobj.isNeedSearch = true;
				tableobj.searchWord = '';
				tableobj.showTrsInTbody();  
				if(searchWordOld !== ''){
					tableobj.isNeedSearch = true;
					tableobj.searchWord = searchWordOld;
					tableobj.showTrsInTbody(); 
				}
				tableobj.showPagination();       // 生成表格翻页
			}
		});
	}
	
	Table.prototype.addHideColumn = function(colName){
		var hideColArr = this.hideColArr;
		if($.inArray(colName, hideColArr) == -1){
			this.hideColArr.push(colName);
		}
	};
	Table.prototype.removeHideColumn = function(colName){
		var index = this.hideColArr.indexOf(colName);
		if(index === 0){
			this.hideColArr.shift();
		}else if(index > 0){
			this.hideColArr.splice(index-1, 1);
		}
	};
	Table.prototype.showColumns = function(colNames){
		var Table = this;
		colNames.forEach(function(colName){
			Table.removeHideColumn(colName);
			Table.showColumn(colName);
		});
	};
	Table.prototype.showColumn = function(colName){
		var $dom = this.dom;
		$dom.find('[data-column-title="' + colName +'"]').removeClass('u-hide');
	};
	Table.prototype.hideColumn = function(colName){
		var $dom = this.dom;
		$dom.find('[data-column-title="' + colName +'"]').addClass('u-hide');
	};
	/**
	 * [hideColumns description]
	 * @author JeremyZhang
	 * @date   2016-11-01
	 * @return {[type]}   [description]
	 */
	Table.prototype.hideColumns = function(colNames){
		var Table      = this;
		var colNames   = colNames || [];
		if(colNames.length > 0){
			colNames.forEach(function(colName){
				Table.addHideColumn(colName);
			});
		}
		var hideColArr = this.hideColArr;
		hideColArr.forEach(function(colName){
			Table.hideColumn(colName);
		});
	};
	/**
	 * 获得排序按钮
	 * @author QC
	 * @date   2016-04-06
	 * @return {[type]}   [description]
	 */
	function getSortBtnDom(sortType){
		/*
		var SortBtns = require('P_template/common/sortBtns'),
			html     = SortBtns.getHTML();
		*/
		
		var sortTypeStr = sortType.toString();
		if(sortTypeStr!== 'number' ){
			sortTypeStr = 'number';	
		}
		var sortBtn = '<div class="u-table-sort"><img src="./static/img/sort_up_icon.png" class="u-sort-up" data-sorttype="'+sortType+'" data-event="sort"/><img src="./static/img/sort_down_icon.png" class="u-sort-down" data-sorttype="'+sortType+'"/  data-event="sort"></div>';
		return $(sortBtn);
	}
	/**
	 * 获得排序按钮
	 * @author QC
	 * @date   2016-04-06
	 * @return {[type]}   [description]
	 */
	function getSelectBtnDom(selectArr,thisTitle){
		var options = '<li><a href="#"  data-event="filter"  data-coltitle="'+thisTitle+'" data-local="{all}">{all}</a></li>';
		selectArr.forEach(function(sobj){
			options+= '<li><a href="#"  data-event="filter" data-coltitle="'+thisTitle+'"  data-local="'+sobj+'">'+sobj+'</a></li>';
		});
		
		if((selectArr instanceof Array) && selectArr.length>0){
			var selectBtn = '<div class="u-table-select-filter dropdown">'
								+'<img src="./static/img/filter_icon.png" data-toggle="dropdown" type="button" aria-hasgroup="true" aria-expanded="true" />'
								+'<ul class="selectThisTitle-cover dropdown-menu">'
									+options
								+'</ul>'
							+'</div>';
			var $selectBtn = $(selectBtn);
			
			return selectBtn;
		}else{
			return '';
		}
		
	}
	function getTdChildDom(titleConfJson){
		var $tdChild = $();
		var type = titleConfJson.type;
		
		switch(type){
			case 'text' :
				$tdChild = getTdSpanDom(titleConfJson);
				break;
			case 'checkbox' :
				$tdChild = getTdCheckboxDom(titleConfJson);
				break;
			case 'btns' :
				$tdChild = getTdBtnsDom(titleConfJson);
				break;
			case 'links' :
				$tdChild = getTdLinksDom(titleConfJson);
				break;
			default : 
//				$tdChild = $();
				$tdChild = '';
				break;
		}
		
//		$tdChild = getTdSpanDom(titleConfJson);
		return $tdChild;
	}
	function getTdSpanDom(titleConfJson){
		var value     = titleConfJson.value; // 数据表中的值
		var values    = titleConfJson.values; // 值转换映射关系
		var filter	  = titleConfJson.filter;//过滤方法
		var maxLength = titleConfJson.maxLength; // 最长显示字数
		var fontColor = titleConfJson.color;
		var text      = value;
		if(text === undefined || text === "undefined"){
			text = '';
		}
		if(values != undefined){
			if(values[value] !== undefined){
				text = values[value];
			}
		}
		if(filter != undefined){
			text = filter(value)!=undefined?filter(value):value;
		}
		if(maxLength != undefined){
			if(text.length > maxLength){
				text = text.substr(0,maxLength)+" …";
			}
			
		}
//		var $span = getSpanDom(text);
		var str = '<span data-local="'+ text +'" ';
		if(maxLength != undefined){
			str += 'title="'+value+'" ';
//			$span.attr('title',value);
		}
		if(fontColor != undefined){
			str += 'class="'+fontColor+'" ';
//			$span.addClass(fontColor);
		}
		str += '>'+text+'</span>';
//		return $span;
		return str;
	}
	function getTdCheckboxDom(titleConfJson){
		var primaryKey = titleConfJson.primaryKey;
		var value     = titleConfJson.value; // 数据表中的值
		var values    = titleConfJson.values; // 值转换映射关系
//		var clickFunc = titleConfJson.clickFunc; // 点击事件处理函数
		var isChecked = values[value];  // 是否选中
		var $checkbox = getCheckboxDom(isChecked);
		$checkbox = $checkbox.substr(0,6)+' data-primaryKey="'+ primaryKey +'" '+$checkbox.substr(6);
//		$checkbox.attr('data-primaryKey', primaryKey);
//		if(clickFunc != undefined){
//			$checkbox.click(function(){
//				clickFunc($(this))
//			});
//		}
		return $checkbox;
	}
	function getTdLinksDom(titleConfJson){
//		var $con       = $('<div></div>');
		var primaryKey = titleConfJson.primaryKey;
		var linkList    = titleConfJson.links;
		var linksstr = '';
		linkList.forEach(function(linkData){
			var $link = $();
			$link = getLinkDom(linkData);
			$link = $link.substr(0,2)+' data-primaryKey="'+ primaryKey +'" '+$link.substr(2);
//			$link.attr("data-primaryKey", primaryKey);
			linksstr += $link;
//			$con.append($link);
		});
		// 清除点击事件
//		$con.children().unbind('click');
		return linksstr;
	}
	function getTdBtnsDom(titleConfJson){
//		var $con       = $('<div></div>');
		var primaryKey = titleConfJson.primaryKey;
		var btnList    = titleConfJson.btns;
		var btnsstr = '';
		btnList.forEach(function(btnData){
			var $btn = $();
			var type = btnData.type;
			if(type != undefined){
				$btn = getSpanBtnDom(btnData);
				$btn = $btn.substr(0,5)+' data-primaryKey="'+primaryKey+'" '+ $btn.substr(5);
			}else{
				$btn = getBtnDom(btnData);
				$btn = $btn.substr(0,7)+' data-primaryKey="'+primaryKey+'" '+ $btn.substr(7);
			}
//			$btn.attr("data-primaryKey", primaryKey);
			
//			$con.append($btn);
			btnsstr += $btn
		});
		return btnsstr;
	}
	function getSpanBtnDom(btnData){
		var $spanBtn  = $();
		var type      = btnData.type;
//		var clickFunc = btnData.clickFunc;
		switch(type){
			case 'edit' :
				var Editbtn = require('P_template/common/iconBtns/editBtn');
//				$spanBtn    = $(Editbtn.getHTML());
				$spanBtn    = Editbtn.getHTML();
				break;
			case 'delete' :
				var Editbtn = require('P_template/common/iconBtns/deleteBtn');
//				$spanBtn    = $(Editbtn.getHTML());
				$spanBtn    = Editbtn.getHTML();
				break;
		}
//		if(clickFunc != undefined){
//			$spanBtn.click(function(){
//				clickFunc($(this));
//			})
//		}
		return $spanBtn;
	}
	function getLinkDom(linkData){
		var links  = require('P_plugin/Link');
		var $links = links.getDom(linkData);
		return $links;
	}
	function getBtnDom(btnData){
		var Btn  = require('P_plugin/Button');
		var $btn = Btn.getDom(btnData);
		return $btn;
	}
	function getSelectDom(type, isChecked){
		var $dom = $();
		switch(type){
			case 'th' :
				$dom  = getThDom();
				break;
			case 'td' :
				$dom = getTdDom();
				break;
			default :
				$som = getTdDom();
		}
		var $checkbox = getCheckboxDom(isChecked);
		$dom.append($checkbox);
		return $dom;
	}
	function getTrDom(){
		var Tr   = require('P_template/common/table/Tr'),
			html = Tr.getHTML(),
			$tr  = $(html);
		return $tr;
	}
	function getThDom(){
		var Th   = require('P_template/common/table/Th'),
			html = Th.getHTML(),
			$th  = $(html);
		return $th;
	}
	function getTdDom(){
		var Td   = require('P_template/common/table/Td'),
			html = Td.getHTML(),
			$td  = $(html);
		return $td;
	}
	function getCheckboxDom(isChecked){
		var Checkbox   = require('P_template/common/element/Checkbox'),
			html       = Checkbox.getHTML();
//		var	$checkbox  = $(html);
		if(isChecked){
			html = html.substr(0,6)+' checked="true" '+html.substr(6);
		}
		return html;
	}
	function getSpanDom(text){
		var Span   = require('P_template/common/element/Span'),
			html   = Span.getHTML(text),
			$span  = $(html);
		return $span;
	}
	Table.prototype.getDom = function(){
		return this.dom;
	};
	Table.prototype.getSelectInputKey = function(key){
	    var arr  = [];
	    var $dom = this.dom.find('tbody input[data-table-type="select"]');
	    $dom.each(function(index, el) {
		if($(el).is(':checked')){
		    arr.push($(el).attr(key));
		}
	    });
	    return arr;
	};
	function getTableObj(data){
		var oTable = new Table(data);
		return oTable;
	}
	module.exports = {
		getTableObj : getTableObj
	};
});
