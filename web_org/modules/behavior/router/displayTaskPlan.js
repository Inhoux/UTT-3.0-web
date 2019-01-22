define(function(require, exports, module) {
  // 存储本页面一些变量
  var DATA = {};
  function tl(str){
    return require('Translate').getValue(str,['common','lanConfig']);
  }  
  // 本模块依赖于 jquery 模块
  function addBtnClick(){
    
    var cfg = {
      id : 'add-modal',
      title: '{add}',
      type:'add'
    };
    makeModal(cfg);
    
  }
  function makeModal(config){
    var data ={};
    if(config.data){
      data = config.data;
      if(data.selDateType != '01'){
        var timestr = data.selDay;
       data.selDay = '01';
       data.txtHour1 = timestr.substr(2,2);
       data.txtMin1 = timestr.substr(5,2);
       data.txtSec1 = timestr.substr(8,2);
      }else{
         var timestr = data.selDay;
       data.selDay = timestr.substr(0,2);
       data.txtHour1 = timestr.substr(3,2);
       data.txtMin1 = timestr.substr(6,2);
       data.txtSec1 = timestr.substr(9,2);
      }
    }
    var modalList = {
      "id"   : config.id,
      "title": config.title,
      "btns" : [
        {
          "type"      : 'save',
          "clickFunc" : function($this){
            // alert('你点了下保存吼');
            var $modal =$this.parents('.modal');
            addSubmitClick($modal, config.type,data);
          }
        },
        {
          "type"      : 'reset'
        },
        {
          "type"      : 'close'
        }
      ]
    };
    var modal = require('Modal');
    var modalObj = modal.getModalObj(modalList);
    DATA.modalobj=modalObj;  
    var inputList = [
      {
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{taskName}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'ID',
          "value"    : data.ID || '',
          "checkDemoFunc": ['checkInput', 'name', '1', '31', '3'] 
          // "checkDemoFunc" : ['checkName','1','10']
        },
        "afterWord": ''
      },
      { 
        "prevWord": '{effectObj}',
        "disabled":config.type=='modify'? true:false,
	"display":DATA.acApTaskSchdule==1 ? true:false,
        "inputData": {
          "type": 'select',
          "name": 'obj',
         "defaultValue":data.obj=='AP'?'02':'01',
          // "defaultValue":jiange || '01',
          "items" : [
            {
              "value" : '01',
              "name"  : '{localDev}',
            },
            {
              "value" : '02',
              "name"  : 'AP',
            }
          ]
        },
        "afterWord": ''
      },      
      { 
        "prevWord": '{taskItv}',
        "inputData": {
          "type": 'select',
          "name": 'selDateType',
         "defaultValue":data.selDateType || '01',
          // "defaultValue":jiange || '01',
          "items" : [
            {
              "value" : '01',
              "name"  : '{weekly}',
            },
            {
              "value" : '02',
              "name"  : '{everyDay}',
            },
            {
              "value" : '03',
              "name"  : '{everyHour}',
            },
            {
              "value" : '04',
              "name"  : '{perMinute}',
            }
          ]
        },
        "afterWord": ''
      },
      { 
        "prevWord": '{runTime}',
        "inputData": {
          "type": 'select',
          "name": 'selDay',
          "defaultValue":data.selDay || '01',
          "items" : [
            {
              "value" : '01',
              "name"  : '{monday}',
            },
            {
              "value" : '02',
              "name"  : '{tuesday}',
            },
            {
              "value" : '03',
              "name"  : '{wednesday}',
            },
            {
              "value" : '04',
              "name"  : '{thursday}',
            },
            {
              "value" : '05',
              "name"  : '{friday}',
            },
            {
              "value" : '06',
              "name"  : '{saturday}',
            },
            {
              "value" : '00',
              "name"  : '{sunday}',
            }
          ]
        },
        "afterWord": ''
      },
      { 
        "prevWord": '{conOfTask}',
        "inputData": {
          "type": 'select',
          "name": 'selContent',
          "defaultValue":data.selContent || 'rebootS',
          "items" : [
            {
              "value" : 'rebootS',
              "name"  : '{deviceReboot}',
            }
          ]
        },
        "afterWord": ''
      }
    ];
    var IG = require('InputGroup');
    var $inputs = IG.getDom(inputList);
    var afterStr = '<input class="worktime-box" name="txtHour1" value="'+(data.txtHour1||'')+'" type="text"/><span>:</span><input class="worktime-box" name="txtMin1"  value="'+(data.txtMin1||'')+'" type="text"/><span>:</span><input class="worktime-box" name="txtSec1" type="text" disabled="disabled" value="00"/>';
    $inputs.find('[name="selDay"]').css({marginRight:'10px'}).after(afterStr);
    $inputs.find('.worktime-box').css({width:'50px',marginLeft:'10px',marginRight:'10px'});
    $inputs.find('[name="txtHour1"]').css({marginLeft:'0px'});

    
    

    $inputs.find('[name="txtHour1"],[name="txtMin1"],[name="txtSec1"]').keyup(function(){
      if($(this).val().length>=2){
        $(this).blur();
        if($(this).next().next().hasClass('worktime-box')){
          $(this).next().next().focus();
        }
      }
    });
    $inputs.find('[name="txtHour1"]').keyup(function(){
      var vals = $(this).val();
      if(Number(vals)>23){
        $(this).val('23');
      }else if(Number(vals)<0){
        $(this).val('00');
      }
    });
    $inputs.find('[name="txtMin1"],[name="txtSec1"]').keyup(function(){
      var vals = $(this).val();
      if(Number(vals)>59){
        $(this).val('59');
      }else if(Number(vals)<0){
        $(this).val('00');
      }
    });
    $inputs.find('[name="txtHour1"],[name="txtMin1"],[name="txtSec1"]').blur(function(){

      var vals = $(this).val();
      if(Number(vals)>=0 && Number(vals)<10){
        $(this).val('0'+Math.round(Number(vals)));
      }
      if(isNaN(vals)){
        $(this).val('00');
      }
    });
    $inputs.click(function(event){
      var e = event || window.event;
      var targ = e.target || e.srcElement;
      var $t = $(targ);
      if($t.attr('name') == 'txtHour1'){
          $inputs.find('[[name="txtMin1"],[name="txtSec1"]').trigger('blur');
      }else if($t.attr('name') == 'txtMin1'){
          $inputs.find('[name="txtHour1"],[name="txtSec1"]').trigger('blur');
      }else if($t.attr('name') == 'txtSec1'){
          $inputs.find('[name="txtHour1"],[name="txtMin1"]').trigger('blur');
      }else{
         $inputs.find('[name="txtHour1"],[name="txtMin1"],[name="txtSec1"]').trigger('blur');
      }
     
    })
    $inputs.find('[name="txtHour1"]').checkdemofunc('checkNum','00','59');
    $inputs.find('[name="txtMin1"]').checkdemofunc('checkNum','00','59');
    makeTheAfterInputChange();
    $inputs.find('[name="selDateType"]').change(function(){
      makeTheAfterInputChange();
    });
    function makeTheAfterInputChange(){
      var a1 = $inputs.find('[name="selDay"]'),
        a2 = $inputs.find('[name="txtHour1"]'),
        a3 = $inputs.find('[name="txtMin1"]'),
        all = $inputs.find('[name="selDay"]').parent().parent();
      a1.addClass('u-hide');
      a2.addClass('u-hide').removeAttr('disabled');
      a3.addClass('u-hide');
      all.addClass('u-hide');
      
      var taskin = $inputs.find('[name="selDateType"]').val();

      switch(taskin){
        case '01':
          all.removeClass('u-hide');
          a1.removeClass('u-hide').val(data.selDay || '01');
          a2.removeClass('u-hide').val(data.txtHour1 || '00');
          a3.removeClass('u-hide').val(data.txtMin1 || '00');
          break;
        case '02':
          all.removeClass('u-hide');
          a2.removeClass('u-hide').val(data.txtHour1 || '00');
          a3.removeClass('u-hide').val(data.txtMin1 || '00');
          break;
        case '03':
          all.removeClass('u-hide');
          a2.removeClass('u-hide').val('').attr('disabled','true');
          a3.removeClass('u-hide').val(data.txtMin1 || '00');
          break;
        default:
          break;
      }
    }
    modalObj.insert($inputs);
    var $modalDom = modalObj.getDom();
    $('body').append($modalDom);

    var Translate  = require('Translate');
    var tranDomArr = [$modalDom];
    var dicArr     = ['common','lanConfig'];
    Translate.translate(tranDomArr, dicArr);

    modalObj.show();
  }  
  /**
   * 新增模态框中提交按钮点击事件
   * @author JeremyZhang
   * @date   2016-09-05
   * @param  {[type]}   $modal [description]
   */
  function addSubmitClick($modal, type,data) {
    // 加载序列化模块
    var Serialize = require('Serialize');
    // 获得用户输入的数据
    var queryArrs = Serialize.getQueryArrs($modal);
    addTask(queryArrs, $modal, type,data);
  }
  /**
   * 添加VLAN
   * @author JeremyZhang
   * @date   2016-09-05
   * @param  {[type]}   queryArrs [description]
   * @param  {[type]}   $modal    [description]
   */
  function addTask(queryArrs, $modal,type,data) {
    var InputGroup = require('InputGroup');
    var tips = require('Tips');
    var len = InputGroup.checkErr($modal);
    if(len > 0)
    {
//    tips.showError('{errNoSave}');
      return;
    }
    var Serialize = require('Serialize');
    var queryJson = Serialize.queryArrsToJson(queryArrs);
    //判断是否为改变格式
    if(queryJson.selDateType != '01'){
        queryJson.txtHour2 =queryJson.txtHour1 || '00';
        queryJson.txtMin2 =queryJson.txtMin1 || '00';
        queryJson.txtSec2 =queryJson.txtSec1 || '00'; 
        queryJson.txtHour1 ='00';
        queryJson.txtMin1 ='00';
        queryJson.txtSec1 ='00';

        if(queryJson.selDateType == '03'){
            queryJson.txtHour2 == '##';
        }else if(queryJson.selDateType == '04'){
                queryJson.txtHour2 ='##';
                queryJson.txtMin2 ='##';
                queryJson.txtSec2 ='##'; 
        }
    }else{
        queryJson.txtHour2 ='00';
        queryJson.txtMin2 ='00';
        queryJson.txtSec2 ='00';
    }
    queryJson.IDold  =data.ID || '';
    var queryStr = Serialize.queryJsonToStr(queryJson);
    //获得提示框组件调用方法
    var Tips = require('Tips');
    queryStr = queryStr + '&' +'Action=' + type;
    var urlStr='';
    if(queryJson.obj=='01'){
      urlStr='/goform/formTaskEdit';
    }else{
      urlStr='/goform/formTaskEdit_ap';
    }
    $.ajax({
      url: urlStr,
      type: 'POST',
      data: queryStr,
      success: function(result) {
        // 执行返回的JS代码
        var doEval = require('Eval');
        var codeStr = result,
          variableArr = ['status', 'errorstr'];
        var result = doEval.doEval(codeStr, variableArr);
        var isSuccess = result["isSuccessful"];
        // 判断代码字符串执行是否成功
        if (isSuccess) {
          var data = result["data"];
          var isSuccessful = data["status"];
          // 判断修改是否成功
          if (isSuccessful) {
            // 显示成功信息
            tips.showSuccess('{saveSuccess}');
            // 刷新页面
            DATA.modalobj.hide();
            display($('#1'));
          } else {
            var errorstr=data.errorstr;
            if(errorstr == ''||errorstr == undefined||errorstr == 'undefined'){
              tips.showWarning('{saveFail}');
            }else{
              tips.showWarning(errorstr);
            }
          }
        } else {
          tips.showError('{parseStrErr}', 3);
        }
      }
    });
  }
  /**
   * 删除按钮点击处理事件
   * @author JeremyZhang
   * @date   2016-09-05
   * @return {[type]}   [description]
   */
  function deleteBtnClick() {
    //获得提示框组件调用方法
    var Tips = require('Tips');
    var database = DATA["tableData"];
    var tableObj = DATA["tableObj"];

    var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
    var length  = primaryKeyArr.length;
    var ajaxFlag=0;
    // 判断是否有被选中的选择框
    if (length > 0) {
      require('Tips').showConfirm(tl('delconfirm'),function(){
        var lanArr = []; 
        var str = '';
        var ap_str='';
        //$.each($elems, function(index, element) {
        primaryKeyArr.forEach(function(primaryKey) { 
          var ap_name='';  
          var name = '';
          var data = database.getSelect({primaryKey : primaryKey});
          if(data[0].obj=="AP"){
            ap_name= data[0]["name"];
            ap_str += ap_name+ ',';
          }else{
            name = data[0]["name"];
            str += name + ',';
          }
        });
        ajaxFlag=1;
        if(str != ''){
          str = str.substr(0, str.length - 1);
          str = 'delstr=' + str;
          $.ajax({
            url: '/goform/formTaskDel',
            type: 'POST',
            data: str,
            async: false,
            success: function(result) {
              var doEval = require('Eval');
              var codeStr = result,
                variableArr = ['status', 'errorstr'],
                result = doEval.doEval(codeStr, variableArr),
                isSuccess = result["isSuccessful"];
              // 判断代码字符串执行是否成功
              if (isSuccess) {
                var data = result["data"],
                  status = data['status'],
                  errorstr=data['errorstr'];
                if (status) {
                  ajaFlag=1;
                  // Tips.showSuccess('{delSuccess}');
                  // display($('#1'));
                } else {
                  ajaxFlag=0;
                  DATA.errorstr=errorstr||'';
                  // Tips.showError('{delFail}');
                }
              } else {
                Tips.showError('{parseStrErr}');
              }
            }
          });
        }
        if(ap_str != ''){
          ap_str = ap_str.substr(0, ap_str.length - 1);
          ap_str = 'delstr=' + ap_str;
          $.ajax({
            url: '/goform/formTaskDel_ap',
            type: 'POST',
            data: ap_str,
            success: function(result) {
              var doEval = require('Eval');
              var codeStr = result,
                variableArr = ['status', 'errorstr'],
                result = doEval.doEval(codeStr, variableArr),
                isSuccess = result["isSuccessful"];
              // 判断代码字符串执行是否成功
              if (isSuccess) {
                var data = result["data"],
                  status = data['status'],
                  errorstr = data['errorstr'];
                if (status) {
                  // 提示成功信息
                    if(ajaxFlag==1){
                      Tips.showSuccess('{delSuccess}');
                      display($('#1'));                   
                    }else{
                        if(DATA.errorstr != ""){
                          Tips.showError(DATA.errorstr);
                        }else{
                          Tips.showError('{delFail}');
                        }
                    }
                } else {
                  Tips.showError('{delFail}');
                }
              } else {
                Tips.showError('{parseStrErr}');
              }
            }
          });
        }else{
        	if(ajaxFlag == 1){
        		Tips.showSuccess('{delSuccess}');
            display($('#1'));        
        	}else{
        		Tips.showWarning(DATA.errorstr);
        	}
        }
      });
    } else {
      Tips.showInfo('{unSelectDelTarget}');
    }
  }
  /**
   * 删除一条数据
   * @author JeremyZhang
   * @date   2016-09-06
   * @param  {[type]}   $target [description]
   * @return {[type]}           [description]
   */
  function removeTask(data) {
    var urlstr='';
    var IPName = data["name"];
    var obj=data["obj"];
    if(obj == 'AP'){
      urlstr='/goform/formTaskDel_ap';
    }else{
      urlstr='/goform/formTaskDel';
    }
    var queryStr = 'delstr=' + IPName ;
    var Tips = require('Tips');
    $.ajax({
      url: urlstr,
      type: 'POST',
      data: queryStr,
      success: function(result) {
        var doEval = require('Eval');
        var codeStr = result,
          returnStr = ['status'],
          result = doEval.doEval(codeStr, returnStr),
          isSuccess = result["isSuccessful"];
        // 判断代码字符串执行是否成功
        if (isSuccess) {
          var data = result["data"],
            status = data['status'];
          if (status) {
            Tips.showSuccess('{delSuccess}');
            display($('#1'));
          } else {
            Tips.showError('{delFail}');
          }
        } else {
          Tips.showError('{delFail}');
        }
      }
    });
  }
  /**
   * 存储表格数据
   * @author JeremyZhang
   * @date   2016-09-22
   * @param  {[type]}   data [description]
   * @return {[type]}        [description]
   */
  function storeTableData(data) {
    // 获取数据库模块，并建立一个数据库
    var Database = require('Database'),
      database = Database.getDatabaseObj(); // 数据库的引用
    // 存入全局变量DATA中，方便其他函数使用
    DATA["tableData"] = database;
    // 声明字段列表
    var fieldArr = ['name', 'obj','type','time', 'context'];
    // 将数据存入数据表中
    database.addTitle(fieldArr);
    database.addData(data);
  }
  /**
   * 存储lan口数据
   * @author JeremyZhang
   * @date   2016-09-27
   * @param  {[type]}   data [description]
   * @return {[type]}        [description]
   */
  function storeTaskData(data) {
    //console.dir(data);
    data.forEach(function(item, index){
      item.unshift(index + 1);
    });
    //console.dir(data);
    // 获取数据库模块，并建立一个数据库
    var Database = require('Database'),
      database = Database.getDatabaseObj(); // 数据库的引用
    // 存入全局变量DATA中，方便其他函数使用
    DATA["taskData"] = database;
    // 声明字段列表
    var fieldArr = ['name', 'obj', 'type','time', 'context'];
    // 将数据存入数据表中
    database.addTitle(fieldArr);
    database.addData(data);
  }
  /**
   * 处理后台发送的数据，转换为数据表格式的数据
   * @author JeremyZhang
   * @date   2016-09-22
   * @return {array}   lan和vlan的数据
   */
  function processData(jsStr) {
    // 加载Eval模块
    var doEval = require('Eval');
    var Tips = require('Tips');
    var codeStr = jsStr,
      // 定义需要获得的变量
      variableArr = ['names', 'types', 'times',
            'cmds','totalrecs','max_totalrecs',
            'errorstr',
	    'acApTaskSchdule',
            'apNames',
            'apTimes',
            'apTypes',
            'apCmds',
            'ap_max_totalrecs',
            'ap_totalrecs'
      ];

    // 获得js字符串执行后的结果
    var result = doEval.doEval(codeStr, variableArr),
      isSuccess = result["isSuccessful"];
    // 判断代码字符串执行是否成功
    if (isSuccess) {
      // 获得所有的变量
      var data = result["data"];
      // 将返回的JS代码执行所生成的变量进行复制
      //var titleArr = data["titles1"], // 表格头部的标题列表
      var names = data["names"],
        types = data["types"],
        times = data["times"],
        cmds = data["cmds"],
	acApTaskSchdule = data["acApTaskSchdule"],
        apNames = data["apNames"],
        apTimes = data["apTimes"],
        apTypes = data["apTypes"],
        apCmds = data["apCmds"],

        totalrecs = data["totalrecs"],
        max_totalrecs = data["max_totalrecs"],
        ap_max_totalrecs = data["ap_max_totalrecs"],
        ap_totalrecs = data["ap_totalrecs"],
        errorstr = data["errorstr"];
        DATA.totalrecs=totalrecs;
        DATA.max_totalrecs=max_totalrecs;
        DATA.ap_max_totalrecs=ap_max_totalrecs||0;
        DATA.ap_totalrecs=ap_totalrecs||0;
	DATA.acApTaskSchdule=acApTaskSchdule;
      // 把数据转换为数据表支持的数据结构

      var dataArr = []; // 将要插入数据表中的数据
      names.forEach(function(item, index, arr) {
        var arr = [];
        //arr.push(nameArr[index]);
        arr.push(names[index]);
        arr.push('{localDev}');
        arr.push(types[index]);  
        arr.push(times[index]);
        if(cmds[index]='rebootS') {
          arr.push(tl('rebootS'));
        }else{
          arr.push(cmds[index]);
        }        
        
        dataArr.push(arr);
      });
      if(acApTaskSchdule==1){
	  apNames.forEach(function(item, index, arr) {
		  var arr = [];
		  //arr.push(nameArr[index]);
		  arr.push(apNames[index]);
		  arr.push('AP');
		  arr.push(apTypes[index]);  
		  arr.push(apTimes[index]);
		  if(apCmds[index]='rebootS') {
		  arr.push(tl('rebootS'));
		  }else{
		  arr.push(cmds[index]);
		  }        
		  dataArr.push(arr);
		  });      
      
      }
      // 返回处理好的数据
      var tableData = {
        data: dataArr
      };
      var taskData = [
        [names, types, times,cmds],
      ];
      return {
        table: tableData,
        taskData: taskData,
      };
    } else {
      Tips.showError('{parseStrErr}');
    }
  }

  function editClick(data, $this){
    //根据编辑的primary-key取到对应数据库的值
   
    var name = data["name"],
        type = data["type"],
        time = data["time"],
        obj  = data["obj"],
        context = data["context"];   
    var data ={
        ID:name,
        obj:obj,
        selDateType:type,
        selDay:time,
        selContent:context
    };

    var cfg = {
      id : 'edit-modal',
      title: '{edit}',
      data:data,
      type:'modify'
    };
    makeModal(cfg);
  }  
  /**
   * 生成表格的Dom，并返回
   * @author JeremyZhang
   * @date   2016-09-22
   * @return {jquery对象}   表格的jQuery对象
   */
  function getTableDom() {
    // 表格上方按钮配置数据
    var btnList = [
    {
      "id": "add",
      "name": "{add}",
       "clickFunc" : function($btn){
               // alert($btn.attr('id'));  // 显示 add
               if(DATA.totalrecs+DATA.ap_totalrecs==DATA.max_totalrecs+DATA.ap_max_totalrecs){
                  var Tips = require('Tips');
       
                  Tips.showError('{reachMaxNum}');
                  return;
               }else{
                addBtnClick($btn);
               }
            }
    },
    {
      "id": "delete",
      "name": "{delete}",
       "clickFunc" : function($btn){
            //alert($btn.attr('id'));  // 显示 add
            deleteBtnClick();
          }

    }];
    var database = DATA["tableData"];
    var headData = {
      "btns" : btnList
    };
    // 表格配置数据
    //['name', 'type','time', 'context'];
    var tableList = {
      "database": database,
      "isSelectAll":true,
      "dicArr":['common','lanConfig'],
      "titles": {
        "{taskName}"     : {
          "key": "name",
          "type": "text",
        },
        "{effectObj}"     : {
          "key": "obj",
          "type": "text",
        },       
        "{startType}"     : {
          "key": "type",
          "type": "text",
          "filter" : function(str){
              var changes = {
                "01":'每星期',
                "02":'每天',
                "03":'每小时',
                "04":'每分钟',
              };  
              var newstr =  changes[str];
              return newstr;                      
          }
        },
        "{runTime}"    : {
          "key": "time",
          "type": "text",
          "filter" : function(str){
              var changes = {
                "00":'星期日',
                "01":'星期一',
                "02":'星期二',
                "03":'星期三',
                "04":'星期四',
                "05":'星期五',
                "06":'星期六',
                "* ":''
              };
              var newstr =  changes[str.slice(0,2)]+" "+str.substr(2);
              return newstr;
            }
        },   
        "{conOfTask}"    : {
          "key": "context",
          "type": "text"
        },                   
        "{edit}": {
          "type": "btns",
          "btns" : [
            {
              "type" : 'edit',
              "clickFunc" : function($this){
                var primaryKey = $this.attr('data-primaryKey');
                var database = DATA.tableData;
                var data = database.getSelect({
                  primaryKey: primaryKey
                });
                editClick(data[0],$this);
              }
            },
            {
              "type" : 'delete',
              "clickFunc" : function($this){
                var primaryKey = $this.attr('data-primaryKey')
                var tableObj = DATA["tableObj"];
                var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
                var data = database.getSelect({primaryKey : primaryKey});
                require('Tips').showConfirm(tl('delconfirm'),function(){
                  removeTask(data[0]);
                });
              }
            }
          ]
        }
        
      }
    };
    // 表格组件配置数据
    var list = {
      head: headData,
      table: tableList
    };
    var Table = require('Table'),
      tableObj = Table.getTableObj(list),
      $table = tableObj.getDom();
    // 将表格组件对象存入全局变量，方便其他函数调用
    DATA["tableObj"] = tableObj;
    return $table;
  }
  /**
   * 获取表格数据并生成表格
   * @author JeremyZhang
   * @date   2016-09-07
   * @param  {[type]}   $container [description]
   * @return {[type]}              [description]
   */
  function displayTable($container) {
    var TableContainer = require('P_template/common/TableContainer');
    var conhtml = TableContainer.getHTML({}),
      $tableCon = $(conhtml);
    // 将表格容器放入标签页容器里
    $container.append($tableCon);
    //向后台发送请求，获得表格数据
    $.ajax({
      url: 'common.asp?optType=schdtask',
      //url: 'test.asp',
      type: 'GET',
      success: function(result) {

        // 将后台数据处理为数据表格式的数据
        var data = processData(result);
          tableData = data["table"],
          taskData  = data["taskData"];
        var tableArr  = tableData["data"];
        storeTableData(tableArr);
        storeTaskData(taskData);
        // 获得表格Dom
        var $table = getTableDom();
        // 将表格放入页面
        $tableCon.append($table);
        
      }
    });
  }
  /**
   * LAN口配置标签页的处理函数
   * @author JeremyZhang
   * @date   2016-08-31
   * @param  {[type]}   $dom 包裹标签页的容器
   */
  function display($container) {
      var Translate = require('Translate'); 
      var dicNames = ['common', 'lanConfig']; 
      Translate.preLoadDics(dicNames, function(){   
      // 清空标签页容器
      $container.empty();
      // 获取表格数据并生成表格
      displayTable($container);
    var Translate  = require('Translate');
    var tranDomArr = [$container];
    var dicArr     = ['common','lanConfig'];
    Translate.translate(tranDomArr, dicArr);
    });
  }
  // 提供对外接口
  module.exports = {
    display: display
  };
});
