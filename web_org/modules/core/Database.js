define(function(require, exports, module){
	/**
	 * 数据缓存的构造函数
	 * @author JeremyZhang
	 * @date   2016-09-18
	 */
	function Database(){
		this.defaultQuery = {
			tableName  : '',
			where      : {},
			startIndex : 0,
			count      : 'len',
			field      : [],
			sort       : []
		};
		this.query = {};
		this.database = {};
	}
	/**
	 * 创建数据表，链式方法
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {str}   tableName 数据表名
	 */
	Database.prototype.createTable = function(tableName){
		// 初始化数据表
		this.database[tableName] = {
			field : [],
			data  : [],
			keyCount : 0
		};
		// 指定当前操作的数据表
		this.table(tableName);
		return this;
	};
	/**
	 * 移除一个数据表
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {str}   tableName 数据表名
	 */
	Database.prototype.removeTable = function(tableName){
		if(tableName in this.database){
			delete this.database[tableName];
			return true;
		}
		return false;
	};
	/**
	 * 设置一个数据表的字段，链式方法
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {array}   fieldArr 字段数组
	 */
	Database.prototype.setField = function(fieldArr){
		var query = this.getQuery(),
			tableName = query.tableName,
			table = this.getTable(tableName);
		if(table !== undefined){
			table.field = fieldArr;
		}
		return this;
	}
	/**
	 * 选择操作的表，链式方法
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {[type]}   tableName 表名
	 * @return {[type]}             [description]
	 */
	Database.prototype.table = function(tableName){
		this.query = {};
		this.query.tableName = tableName;
		return this;
	};
	/**
	 * 生成查找条件，链式方法
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {json}   whereJson 查找条件
	 * @return {}             [description]
	 */
	Database.prototype.where = function(whereJson){
		this.query.where = whereJson;
		return this;
	};
	/**
	 * 生成排序条件，链式方法
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {json}   sortJson 排序条件
	 * @return {[type]}   [description]
	 */
	Database.prototype.order = function(sortArr){
		this.query.sort = sortArr;
		return this;
	};
	/**
	 * 生成返回数据的起始位置和最大条数，链式方法	
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @return {[type]}         [description]
	 */
	Database.prototype.limit = function(){
		var len = arguments.length;
		if(len == 0){
			this.query.startIndex = 0;
			this.query.count = this.count;
		}else if(len == 1){
			this.query.startIndex = 0;
			this.query.count = arguments[0];
		}else{
			this.query.startIndex = arguments[0];
			this.query.count      = arguments[1];
		}
		return this;
	};
	/**
	 * 设置要查询的字段，链式方法
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {array}   fieldArr 字段数组
	 * @return {[type]}            [description]
	 */
	Database.prototype.field = function(fieldArr){
		fieldArr.push('primaryKey');
		this.query.field = fieldArr;
		return this;
	};
	/**
	 * 对数据表进行排序
	 * @author JeremyZhang
	 * @date   2016-09-21
	 * @param  {array}   sortArr 排序条件数组
	 */
	Database.prototype.sort = function(sortArr){
		this.query.sort = sortArr;
		var query = this.getQuery(),
			sortArr = query.sort, 
			tableName = query.tableName,
			table = this.getTable(tableName);
		if(table !== undefined){
			var tableData = table.data;
			tableData = sortData(tableData, sortArr);
			table.data = tableData;
		}
	}
	/**
	 * 像数据表插入数据
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {[type]}   data [description]
	 */
	Database.prototype.add = function(data){
		var query = this.getQuery(),
			tableName = query.tableName,
			table = this.getTable(tableName);
		if(table !== undefined){
			var	keyCount = table.keyCount,
				tableData = table.data,
				tableField = table.field;
			data = arrToJson(tableField, data);
			addPrimaryKey(data, keyCount);
			var dataLen = data.length;
			table.keyCount += dataLen;
			this.database[tableName].data = tableData.concat(data);
			return dataLen;
		}
		return false;
	}
	function addPrimaryKey(data, count){
		data.forEach(function(item, index){
			item.primaryKey = count + index; 
		});
	}
	/**
	 * 返回满足条件的第一条数据
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @return {[type]}   [description]
	 */
	Database.prototype.find = function(){
		this.query.count = 1;
		return this.select()[0];
	};
	/**
	 * 查找满足条件的数据
	 * @author JeremyZhang
	 * @date   2016-09-21
	 * @return {[type]}   [description]
	 */
	Database.prototype.select = function(){
		// 获得query
		var query      = this.getQuery(),
			tableName  = query.tableName,
			where      = query.where,
			startIndex = query.startIndex,
			count      = query.count,
			sortArr    = query.sort,
			field      = query.field;
		// 获得要操作的数据表
		var table = this.getTable(tableName);
		if(table !== undefined){
			var tableField = table.field,
				tableData  = table.data;
			// 判断要数据的数量是否为默认值
			if(count == this.defaultQuery.count){
				count = tableData.length;
			}
			// 获得查找的数据
			var data = selectData(tableData, where, startIndex, count);
			//console.time('sort');
			// 对数据进行排序
			data = sortData(data, sortArr);
			//console.timeEnd('sort')
			//field = (field.length != 0) ? field : tableField;
			if((field[0] == 'primaryKey') && field.length == 1){
				tableField.push('primaryKey');
				field = tableField;
			}
			// 根据要获取的字段进行数据筛选
			data = selectDataByKey(data, field);
			return data;
		}else{
			console.log('error');
			return false;
		}
	}
	/**
	 * 获得操作的query数据
	 * @author JeremyZhang
	 * @date   2016-09-20
	 * @return {[type]}   [description]
	 */
	Database.prototype.getQuery = function(){
		var defaultQuery = this.defaultQuery,
			query        = this.query,
			tableName    = query.tableName,
			where        = query.where,
			field        = query.field,
			startIndex   = query.startIndex,
			count        = query.count,
			sort         = query.sort;
		if(tableName === undefined){
			query.tableName  = defaultQuery.tableName;
		}
		if(where === undefined){
			query.where = defaultQuery.where;
		}
		if(field === undefined){
			var defaultField =  defaultQuery.field;
			defaultField.push('primaryKey')
			query.field = ['primaryKey'];
		}
		if(startIndex === undefined){
			query.startIndex = defaultQuery.startIndex;
		}
		if(count === undefined){
			query.count = defaultQuery.count;
		}
		if(sort === undefined){
			query.sort = defaultQuery.sort;
		}
		return query; 
	};
	/**
	 * 获得当前操作的数据表
	 * @author JeremyZhang
	 * @date   2016-09-20
	 * @param  {str}   tableName 数据表名称
	 * @return {json}            数据表
	 */
	Database.prototype.getTable = function(tableName){
		var table = undefined,
			database = this.database;
		if(tableName in database){
			table = database[tableName];
		}else{
			console.log('table is not defined');
		}
		return table;
	};
	/**
	 * 修改满足条件的所有数据，并返回受影响的条数
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @param  {json}   alterJson 修改的内容
	 * @return {int}             受影响的数据条数
	 */
	Database.prototype.alter = function(alterJson){
		var query     = this.getQuery(),
			tableName = query.tableName,
			table     = this.getTable(tableName),
			where     = query.where,
			count     = 0;
		if(table !== undefined){
			table.data.forEach(function(item){
				if(contains(where, item)){
					changeValue(item, alterJson);
					count++;
				}
			});
			return count;
		}else{
			return false;
		}
	};
	/**
	 * 删除满足条件的所有数据，并返回受影响的条数	
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @return {int}   受影响的数据条数
	 */
	Database.prototype.delete = function(){
		var query     = this.getQuery(),
			tableName = query.tableName,
			table     = this.getTable(tableName),
			where     = query.where,
			count     = 0;
		if(table !== undefined){
			var tableData = table.data;
			if(where == this.defaultQuery.where){
				count = tableData.length;
				tableData.length = 0;
			}else{
				tableData.forEach(function(item, index){
					if(contains(where, item)){
						tableData.splice(index, 1);
						count++;
					}
				});
			}
			return count;
		}else{
			return false;
		}
	};
	/**
	 * 为了方便他们理解增加的方法，添加一个默认的表，并设置字段
	 * @author JeremyZhang
	 * @date   2016-09-27
	 * @param  {array}   fieldArr 字段列表
	 */
	Database.prototype.addTitle = function(fieldArr){
		// 默认表的名称
		var tableName = 'defaultTable';
		/*
			获得默认表,并判断默认表是否已经存在
		 */
		var table = this.getTable(tableName);
		if(table === undefined){
			this.createTable(tableName).setField(fieldArr);
			return true;
		}else{
			return false;
		}
	};
	/**
	 * 为了方便他们理解增加的方法,向默认数据表插入数据		
	 * @author JeremyZhang
	 * @date   2016-09-27
	 * @param  {array}   data  插入数据表的二维数组
	 */
	Database.prototype.addData = function(data){
		// 默认表的名称
		var tableName = 'defaultTable';
		return this.table(tableName).add(data);
	};
	/**
	 * 为了方便他们理解增加的方法,从默认数据表中查询数据	
	 * @author JeremyZhang
	 * @date   2016-09-27
	 * @param  {json}   whereJson 查询条件
	 * @return {[type]}             [description]
	 */
	Database.prototype.getSelect = function(whereJson){
		// 默认表的名称
		var tableName = 'defaultTable';
		return this.table(tableName).where(whereJson).select();
	};
	function sortData(data, sortArr){
		if(sortArr.length > 0){
			var key  = sortArr[0],
				type = sortArr[1] || 'asc';
			data = quickSort(data, key, check);
			if(type != 'asc'){
				data.reverse();
			}
		}
		return data;
	}
	function quickSort(arr, key, func){  
	    if(arr.length<=1){  
	        return arr;  
	    }  
	    var left= [];  
	    var right = [];  
	    var pivot = arr.length-1;  
	    for(var i=0; i<arr.length-1;i++){  
	        //if(arr[i][key]<arr[pivot][key]){  
	        if(func(arr[i][key], arr[pivot][key])){  
	            left.push(arr[i]);  
	        }else{  
	            right.push(arr[i]);  
	        }  
	    }  
	    return quickSort(left, key, func).concat(arr[pivot],quickSort(right, key, func));  
	}  
	function check(value1, value2){
		if(value1 < value2){
			return true;
		}else{
			return false;
		}
	}
	// function sortData(data, sortArr){
	// 	if(sortArr.length > 0){
	// 		var key  = sortArr[0],
	// 			type = sortArr[1] || 'asc';
	// 		var sortFunc = getSortFunc(key, type);
	// 		data.sort(sortFunc);
	// 	}
	// 	return data;
	// }
	function getSortFunc(key, type){
		var tag1, tag2;
		if(type == 'asc'){
			tag1 = false;
			tag2 = true;
		}else{
			tag1 = true;
			tag2 = false;
		}
		return function(value1, value2){
			if(value1[key] < value2[key]){
				return tag1;
			}else{
				return tag2;
			}
		};
	}
	function selectDataByKey(data, keyArr){
		var newData = [];
		data.forEach(function(item){
			var arr = {};
			for(var key in item){
				if(keyArr.indexOf(key) > -1){
					arr[key] = item[key];
				}
			}
			newData.push(arr);
		});
		return newData;
	}
	/**
	 * 返回满足条件的数据
	 * @author JeremyZhang
	 * @date   2016-09-18
	 * @return {[type]}   [description]
	 */
	function selectData(data, where, startIndex, count){
		var arr = [],
			arrLen = 0,
			len = data.length;
		count = (count == undefined) ? len : count;
		if(startIndex < len){
			for(var i = startIndex; i < len; i++){
				if(arrLen < count){
					var item = data[i];
					if(contains(where, item)){
						arr.push(item);
						arrLen++;
					}
				}else{
					return arr;
				}
			}
		}
		return arr;
	};
	/**
	 * 将二维数组转化为json数组
	 * @author JeremyZhang
	 * @date   2016-09-19
	 * @param  {array}   keyArr   json键的数组	
	 * @param  {array}   valueArr 需要转化的二维数组
	 * @return {array}           转化好的二维数组
	 */
	function arrToJson(keyArr, valueArr){
		var jsonArr = [];
		var keyLen = keyArr.length;
		valueArr.forEach(function(item){
			var json = {};
			//var valueLen = item.length;
			item.forEach(function(value, index){
				if(keyLen > index){
					json[keyArr[index]] = value;
				}
			});
			jsonArr.push(json);
		});
		return jsonArr;
	}
	/**
	 * 检测一个json是否是另一个的子集
	 * @author JeremyZhang
	 * @date   2016-09-19
	 * @param  {json}   obj1 检测的json
	 * @param  {json}   obj2 被检测的json
	 * @return {boolean}      是否包含
	 */
	function contains(obj1, obj2){
		var isContained = true;
		for(var key in obj1){
			if(obj1[key] != obj2[key]){
				isContained = false;
			}
		}
		return isContained;
	}
	/**
	 * 用一个json覆盖另一个json
	 * @author JeremyZhang
	 * @date   2016-09-19
	 * @param  {json}   obj1 被覆盖的json
	 * @param  {json}   obj2 覆盖的json
	 * @return {json}        被覆盖后的json
	 */
	function changeValue(obj1, obj2){
		for(var key in obj2){
			obj1[key] = obj2[key];
		}
	}
	function getDatabaseObj(){
		var database = new Database();
		return database;
	}
	module.exports = {
		getDatabaseObj : getDatabaseObj
	}
});