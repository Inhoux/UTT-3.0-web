define(function(require, exports, module) {
  // 存储本页面一些变量
  var DATA = {}; 
  function tl(str){
    return require('Translate').getValue(str,['common','doTimePlan']);
  }
  /*
   * 生成输入框组
   */
  function getInputDom(getdata,type){
    var data = getdata[0] || {timeJson:{timeStart:[],enable:[],day:[],timeStart:[],timeStop:[]}};
    console.log(data);
    
    
    var effectyear = 'Daterange';
    var group_dateStart = '';
    var group_dateStop = '';
    if(data.timeJson.group_dateStart != undefined){
      effectyear = data.timeJson.group_dateStart == 'Forever'?"Forever":"Daterange";
      if(data.timeJson.group_dateStart != 'Forever'){
        group_dateStart = data.timeJson.group_dateStart;
        group_dateStop = data.timeJson.group_dateStop;
      }
    }else{
      group_dateStart = DATA['dataStr'];
      group_dateStop = DATA['dataStr']
      // group_dateStart = '1990-01-01';
      // group_dateStop = '2020-01-01';
    }
    var timeStartNow1 = 'effecttime';
    var fromhour = '';
    var fromminute = '';
    var endhour = '';
    var endminute = '';
    if(data.timeJson.timeStart && data.timeJson.timeStart[0] != undefined){
      timeStartNow1 = data.timeJson.timeStart[0] == 'ALL'?'effecttime':'timerange';
      if(data.timeJson.timeStart[0] != 'ALL' ){
        var from1 = data.timeJson.timeStart[0].split(':');
        var end1 = data.timeJson.timeStop[0].split(':');
        fromhour = from1[0];
        fromminute = from1[1];
        endhour = end1[0];
        endminute = end1[1];
      }
    }
    
    var timeStartNow2 = 'effecttime';
    var fromhour2 = '';
    var fromminute2 = '';
    var endhour2 = '';
    var endminute2 = '';
    if(data.timeJson.timeStart && data.timeJson.timeStart[1] != undefined){
      timeStartNow2 = data.timeJson.timeStart[1] == 'ALL'?'effecttime':'timerange';
      if(data.timeJson.timeStart[1] != 'ALL'){
          var from2 = data.timeJson.timeStart[1].split(':');
          var end2 = data.timeJson.timeStop[1].split(':');
          fromhour2 = from2[0];
          fromminute2 = from2[1];
          endhour2 = end2[0];
          endminute2 = end2[1];
        }
    }

    var timeStartNow3 = 'effecttime';
    var fromhour3 = '';
    var fromminute3 = '';
    var endhour3 = '';
    var endminute3 = '';
    if(data.timeJson.timeStart && data.timeJson.timeStart[2] != undefined){
      timeStartNow3 = data.timeJson.timeStart[2] == 'ALL'?'effecttime':'timerange';
      if(data.timeJson.timeStart[2] != 'ALL'){
          var from3 = data.timeJson.timeStart[2].split(':');
          var end3 = data.timeJson.timeStop[2].split(':');
          fromhour3 = from3[0];
          fromminute3 = from3[1];
          endhour3 = end3[0];
          endminute3 = end3[1];
        }
    }

    if(data.timeJson.day == undefined){
      data.timeJson.day = [];
    }
    function getWeeksOfStr(strss,ends){

      var getstrss = strss;
      var weekarr = [];
      if(getstrss === undefined){

        var everyday = 'everyday'+ends;
        return [everyday];
      }

      for(var i=0;i<getstrss.length;i++){
       // console.log(getstrss+"的"+(i+1)+"位是"+getstrss.charAt(Number(i)))
       if(getstrss.charAt(Number(i)) == 1){
          weekarr.push(i+1);
        }
      }

      return weekarr;
    }



    var inputlist = [
      {   
            "necessary": true, 
            "prevWord": '{name}',
             "disabled":(type == 'edit'?true:false),
            "inputData": {
                "value" : data.timeRangeNames || '', 
                "type": 'text',
                "name": 'TimeRangeName',
                "checkDemoFunc": ['checkInput', 'name', '1', '31', '3'] 
            },
            "afterWord": ''
       },
       {   
            "display":false,
            "inputData": {
                "value" : data.timeRangeNames || '', 
                "type": 'text',
                "name": 'TimeRangeNameOld'
            },
       },
       {   
            "prevWord": '{tim_date}',
            "inputData": {
              "type": 'radio',
                "defaultValue" : effectyear, 
                "name": 'effectyear',
                "items":[
                  {value:'Forever',name:'{forever}'},
                  {value:'Daterange',name:'{date}'},
                ]
                
            },
            "afterWord": ''
       },
       {   
            "inputData": {
              "type": 'title',
                "name": '{tim_rangeOne}',
            },
        },
        {   
            "prevWord": '{status}',
            "inputData": {
              "type": 'radio',
                "defaultValue" : (data.timeJson.enable && data.timeJson.enable[0]) || 'on', 
                "name": 'timeRange1',
                "items":[
                  {value:'on',name:'{open}'},
                  {value:'off',name:'{close}'},
                ]
                
            },
            "afterWord": ''
       },
       {   
            "prevWord": '{date}',
            "inputData": {
              "type": 'checkbox',
                "defaultValue" : (data.timeJson.day[0] == '1111111'?['everyday']:getWeeksOfStr(data.timeJson.day[0],'')), 
                "name": 'date',
                "items":[
                  {value:'everyday',name:'{everyday}'},
                  {value:'1',name:'{monday}'},
                  {value:'2',name:'{tuesday}'},
                  {value:'3',name:'{wednesday}'},
                  {value:'4',name:'{thursday}'},
                  {value:'5',name:'{friday}'},
                  {value:'6',name:'{saturday}'},
                  {value:'7',name:'{sunday}'},
                ]
                
            },
            "afterWord": ''
       },
        {   
            "prevWord": '{time}',
            "inputData": {
              "type": 'radio',
                "defaultValue" : timeStartNow1,
                "name": 'effecttime',
                "items":[
                  {value:'effecttime',name:'{allDay}'},
                  {value:'timerange',name:'{from}'},
                ]
                
            },
            "afterWord": ''
       },
        {   
            "inputData": {
              "type": 'title',
                "name": '{tim_rangeTwo}',
            },
        },
        {   
            "prevWord": '{status}',
            "inputData": {
              "type": 'radio',
                "defaultValue" : (data.timeJson.enable && data.timeJson.enable[1]) || 'off', 
                "name": 'timeRange2',
                "items":[
                  {value:'on',name:'{open}'},
                  {value:'off',name:'{close}'},
                ]
                
            },
            "afterWord": ''
       },
       {   
            "prevWord": '{date}',
            "inputData": {
              "type": 'checkbox',
                "defaultValue" : (data.timeJson.day[1] == '1111111'?['everyday2']:(getWeeksOfStr(data.timeJson.day[1],'2'))), 
                "name": 'date2',
                "items":[
                  {value:'everyday2',name:'{everyday}'},
                  {value:'1',name:'{monday}'},
                  {value:'2',name:'{tuesday}'},
                  {value:'3',name:'{wednesday}'},
                  {value:'4',name:'{thursday}'},
                  {value:'5',name:'{friday}'},
                  {value:'6',name:'{saturday}'},
                  {value:'7',name:'{sunday}'},
                ]
                
            },
            "afterWord": ''
       },
        {   
            "prevWord": '{time}',
            "inputData": {
              "type": 'radio',
                "defaultValue" : timeStartNow2 , 
                "name": 'effecttime2',
                "items":[
                  {value:'effecttime',name:'{allDay}'},
                  {value:'timerange',name:'{from}'},
                ]
                
            },
            "afterWord": ''
       },
        {   
            "inputData": {
              "type": 'title',
                "name": '{tim_rangeThree}',
            },
        },
        {   
            "prevWord": '{status}',
            "inputData": {
              "type": 'radio',
                "defaultValue" :(data.timeJson.enable && data.timeJson.enable[2]) || 'off', 
                "name": 'timeRange3',
                "items":[
                  {value:'on',name:'{open}'},
                  {value:'off',name:'{close}'},
                ]
                
            },
            "afterWord": ''
       },
       {   
            "prevWord": '{date}',
            "inputData": {
              "type": 'checkbox',
                "defaultValue" : (data.timeJson.day[2] == '1111111'?['everyday3']:(getWeeksOfStr(data.timeJson.day[2],'3'))), 
                "name": 'date3',
                "items":[
                  {value:'everyday3',name:'{everyday}'},
                  {value:'1',name:'{monday}'},
                  {value:'2',name:'{tuesday}'},
                  {value:'3',name:'{wednesday}'},
                  {value:'4',name:'{thursday}'},
                  {value:'5',name:'{friday}'},
                  {value:'6',name:'{saturday}'},
                  {value:'7',name:'{sunday}'},
                ]
                
            },
            "afterWord": ''
       },
        {   
            "prevWord": '{time}',
            "inputData": {
              "type": 'radio',
                "defaultValue" : timeStartNow3, 
                "name": 'effecttime3',
                "items":[
                  {value:'effecttime',name:'{allDay}'},
                  {value:'timerange',name:'{from}'},
                ]
                
            },
            "afterWord": ''
       }
    ];
    var IG = require('InputGroup');
    var $inputDom = IG.getDom(inputlist);
    
    //添加其他输入框
    var td1 = $inputDom.find('[name="effectyear"]').parent();
    td1.append('<input type="text" name="year1" value="'+group_dateStart+'" style="margin:auto 5px"/> '+require('Translate').getValue('to', ['doTimePlan'])+' <input type="text" name="year2" value="'+group_dateStop+'" style="margin:auto 5px"/>');
    var $year1dom = td1.find('[name="year1"]');
    var $year2dom = td1.find('[name="year2"]');
    td1.find('[name="year2"]').checkdemofunc('checkLastDate', $year1dom);
    td1.find('[name="year1"]').checkdemofunc('checkFirstDate', $year2dom);
    td1.find('[name="year1"],[name="year2"]').click(function(){
         laydate();
    })


    var td2 = $inputDom.find('[name="effecttime"]').parent();
    td2.append(getselettime(1,'s','h',fromhour)+':'+getselettime(1,'s','m',fromminute)+require('Translate').getValue('to', ['doTimePlan'])+getselettime(1,'e','h',endhour)+':'+getselettime(1,'e','m',endminute));
    
    var td3 = $inputDom.find('[name="effecttime2"]').parent();
    td3.append(getselettime(2,'s','h',fromhour2)+':'+getselettime(2,'s','m',fromminute2)+require('Translate').getValue('to', ['doTimePlan'])+getselettime(2,'e','h',endhour2)+':'+getselettime(2,'e','m',endminute2));
    
    var td4 = $inputDom.find('[name="effecttime3"]').parent();
    td4.append(getselettime(3,'s','h',fromhour3)+':'+getselettime(3,'s','m',fromminute3)+require('Translate').getValue('to', ['doTimePlan'])+getselettime(3,'e','h',endhour3)+':'+getselettime(3,'e','m',endminute3));
    
    //修改每天复选框name
    $inputDom.find('[value="everyday"]').attr('name','everyday');
    $inputDom.find('[value="everyday2"]').attr('name','everyday2');
    $inputDom.find('[value="everyday3"]').attr('name','everyday3');

		//绑定及初始化交互
		var alls = gn('effectyear').parent().parent().nextAll().find('input,select');
		var afteryear = gn('year1,year2');
		clickyear();
		/**绑定永久、日期的点击事件**/
		gn('effectyear').click(function(){
				clickyear();
		});
		gn('everyday,everyday2,everyday3').click(function(){
				clickother1();
		});
		gn('effecttime,effecttime2,effecttime3').click(function(){
				clickother2();
		});
    /*编辑时初始化值*/
    if(effectyear == 'Forever'){
        // gn('year1').val('1990-01-01');
        // gn('year2').val('2020-01-01');
        gn('year1').val(DATA["dataStr"]);
        gn('year2').val(DATA["dataStr"]);        
    }
		function clickyear(){
			if($inputDom.find('[name="effectyear"]:checked').val() == 'Forever'){
					alls.attr('disabled','disabled');
					afteryear.attr('disabled','disabled');
					afteryear.trigger('blur');
				}else{
					alls.removeAttr('disabled');
					afteryear.removeAttr('disabled');
					clickother1();
					clickother2();
				}
		}
		function clickother1(){
			gn('everyday,everyday2,everyday3').each(function(){
					var $t = $(this);
					if($t.is(':checked')){$t.nextAll('input').attr('disabled','disabled');}
					else{$t.nextAll('input').removeAttr('disabled');}
				});
		}
		function clickother2(){
			gn('effecttime,effecttime2,effecttime3').each(function(){
				var $t = $(this);
					if($inputDom.find('[name="'+$t.attr('name')+'"]:checked').val() == 'effecttime')
					{$t.nextAll('select').attr('disabled','disabled');}
					else{$t.nextAll('select').removeAttr('disabled');}
			});
		}
		
		//封装一个小方法：根据name1,name2,name3返回一个jq对象集合
		function gn(str){
			var strs = '';
			var arrs = str.split(',');
			arrs.forEach(function(obj){
				strs += '[name="'+obj+'"],';
			});
			var newstrs = strs.substr(0,(strs.length-1));
			if(strs.length>0){
				return $inputDom.find(newstrs);
			}
			return false;
		}
			
		/* 修改title样式  */
		$inputDom.find('.u-inputs-title').css({
			paddingTop:'10px',
			paddingBottom:'10px'
		}).children('div').css({
			top:'49%'
		});
		
    return $inputDom;
  }
  function getselettime(num,starend,type,deval){
    var nums = String(num == 1?'':num);
    var types = (type == 'h')?'hour':'minute';
    var starends = (starend == 's')?'from':'end';

    var selecthtml = '<select style="margin:auto 8px;width:60px"  name="'+starends+types+nums+'">';

    var maxtime = (type == 'h')?23:59;
    for(var i = 0; i<=maxtime ;i++){
      var hstr = (String(i).length == 1?("0"+String(i)):i);
      if(hstr == deval){
        selecthtml += '<option value="'+hstr+'" selected="selected">'+hstr+'</option>';
      }else{
         selecthtml += '<option value="'+hstr+'">'+hstr+'</option>';
      }
     
    }

    selecthtml += '</select>';
    return selecthtml;
  } 
  /**
   * 制作按钮
   */
  function getBtnDom(type){
    var btnlist = [{
      id :'save',
      name :'{save}',
      clickFunc:function($this){

        addSubmitClick($('#1'),type);
      }
    },
    {
      id :'reset',
      name :'{reset}',
      clickFunc:function(){
      }
    },
    {
      id :'back',
      name :'{back}',
      clickFunc:function(){
        display($('#1'));
      }
    }
    ];
    var BG = require('BtnGroup');
    var $btns = BG.getDom(btnlist);
    return $btns;
  }

  function displayEditTab($container,type,getdata) {
    var getdatas = getdata || {};
    $('a[href="#1"]').attr('data-local',(type == 'add'?'{addTimePlan}':'{editTimePlan}')).text((type == 'add'?'{addTimePlan}':'{editTimePlan}'));

    //制作表单页
    var $input = getInputDom(getdatas,type);
    var $btns  = getBtnDom(type).addClass('u-btn-group');
    $container.empty().append($input,$btns);
    var Translate  = require('Translate');
    var tranDomArr = [$('body')];
    var dicArr     = ['common','doTimePlan'];
    Translate.translate(tranDomArr, dicArr);

  }  
  // 本模块依赖于 jquery 模块
  function addBtnClick(){
    displayEditTab($("#1"), 'add'); 
  }
  /**
   * 新增模态框中提交按钮点击事件
   * @author JeremyZhang
   * @date   2016-09-05
   * @param  {[type]}   $modal [description]
   */
  function addSubmitClick($modal, type) {
    // 加载序列化模块
    var Serialize = require('Serialize');
    // 获得用户输入的数据
    var queryArrs = Serialize.getQueryArrs($modal);
    addTask(queryArrs, $modal, type);
  }
  /**
   * 添加VLAN
   * @author JeremyZhang
   * @date   2016-09-05
   * @param  {[type]}   queryArrs [description]
   * @param  {[type]}   $modal    [description]
   */
  function addTask(queryArrs, $modal,type) {
    var InputGroup = require('InputGroup');
    var tips = require('Tips');
    var Serialize = require('Serialize');
    var len = InputGroup.checkErr($modal);
    if(len > 0)
    {
  //    tips.showError('{NoSave}');
      return;
    }
    var queryArrs = Serialize.getQueryArrs($('#1'));
    var queryStr = Serialize.queryArrsToStr(queryArrs);
    var queryJson= Serialize.queryArrsToJson(queryArrs);
    

    //数据处理
    if($modal.find('[name="everyday"]').is(':checked')){
      queryJson["day"] = '1111111';
    }else{
      var daystr = "";
      $modal.find('[name="date"]').each(function(){
          var $t = $(this);
          daystr += ($t.is(':checked')?'1':'0');
      });
      daystr = (daystr === '0000000'?'1111111':daystr);
       queryJson["day"] = daystr;
    }

    if($modal.find('[name="everyday2"]').is(':checked')){
      queryJson["day2"] = '1111111';
    }else{
      var daystr = "";
      $modal.find('[name="date2"]').each(function(){
          var $t = $(this);
          daystr += ($t.is(':checked')?'1':'0');
      });
      daystr = (daystr === '0000000'?'1111111':daystr);
       queryJson["day2"] = daystr;
    }

    if($modal.find('[name="everyday3"]').is(':checked')){
      queryJson["day3"] = '1111111';
    }else{
      var daystr = "";
      $modal.find('[name="date3"]').each(function(){
          var $t = $(this);
          daystr += ($t.is(':checked')?'1':'0');
      });
      daystr = (daystr === '0000000'?'1111111':daystr);
       queryJson["day3"] = daystr;
    }

    if($modal.find('[name="effecttime"]:checked').val() == 'effecttime'){
      queryJson["timestart"] = 'ALL';
      queryJson["timestop"] = 0;
    }else{
      queryJson["timestart"] = queryJson.fromhour+':'+queryJson.fromminute;
      queryJson["timestop"] = queryJson.endhour+':'+queryJson.endminute;
    }

    if($modal.find('[name="effecttime2"]:checked').val() == 'effecttime'){
      queryJson["timestart2"] = 'ALL';
      queryJson["timestop2"] = 0;
    }else{
      queryJson["timestart2"] = queryJson.fromhour2+':'+queryJson.fromminute2;
      queryJson["timestop2"] = queryJson.endhour2+':'+queryJson.endminute2;
    }

    if($modal.find('[name="effecttime3"]:checked').val() == 'effecttime'){
      queryJson["timestart3"] = 'ALL';
      queryJson["timestop3"] = 0;
    }else{
      queryJson["timestart3"] = queryJson.fromhour3+':'+queryJson.fromminute3;
      queryJson["timestop3"] = queryJson.endhour3+':'+queryJson.endminute3;
    }
    //---
    queryStr= Serialize.queryJsonToStr(queryJson);
    queryStr = queryStr + '&' +'Action=' + type;
    $.ajax({
      url: '/goform/formTimeGroupConfig',
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
            // 刷
            display($('#1'));
            //Dispatcher.reload(0.5);
          } else {
            var errMsg = result["errorstr"];
            tips.showWarning('{saveFailUserNameRepeat}');
          }
        } else {
          tips.showError('{parseStrErr}');
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
    var database = DATA["database"];
    var tableObj = DATA["tableObj"];

    var primaryKeyArr = tableObj.getSelectInputKey('data-primaryKey');
    var length  = primaryKeyArr.length;
    // 判断是否有被选中的选择框
    if (length > 0) {
      require('Tips').showConfirm(tl('delconfirm'),function(){
        var lanArr = []; 
        var str = '';
        //$.each($elems, function(index, element) {
        primaryKeyArr.forEach(function(primaryKey) {  
          var data = database.getSelect({primaryKey : primaryKey});
          var name = data[0]["timeRangeNames"];
          str += name + ',';
        });
        if(str != ''){
          str = str.substr(0, str.length - 1);
          str = 'delstr=' + str;
          $.ajax({
            url: '/goform/formTimeGroupListDel',
            type: 'POST',
            data: str,
            success: function(result) {
              var doEval = require('Eval');
              var codeStr = result,
                variableArr = ['status', 'errorstr'],
                result = doEval.doEval(codeStr, variableArr),
                isSuccess = result["isSuccessful"];
              // 判断代码字符串执行是否成功
              if (isSuccess) {
                var data = result["data"],
                  status = data['status'];
                  errorstr= data['errorstr'];
                if (status) {
                  // 提示成功信息
                  Tips.showSuccess('{delSuccess}');
                  display($('#1'));
                  //Dispatcher.reload(2);
                } else {
                  $('[href="#1"]').trigger('click');
                  Tips.showWarning(errorstr);
                }
              } else {
                Tips.showError('{parseStrErr}');
              }
            }
          });
        }
      });
    } else {
      Tips.showWarning('{unSelectDelTarget}');
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
    var timeRangeName = data[0]["timeRangeNames"];
    var queryStr = 'delstr=' + timeRangeName ;
    var Tips = require('Tips');
    $.ajax({
          url: '/goform/formTimeGroupListDel',
          type: 'POST',
          data: queryStr,
          success: function(result) {
            var doEval = require('Eval');
            var codeStr = result,
              variableArr = ['status', 'errorstr'],
              result = doEval.doEval(codeStr, variableArr),
              isSuccess = result["isSuccessful"];
            // 判断代码字符串执行是否成功
            if (isSuccess) {
              var data = result["data"],
                status = data['status'];
                errorstr= data['errorstr'];
              if (status) {
                // 提示成功信息
                Tips.showSuccess('{delSuccess}');
                display($('#1'));
              } else {
                Tips.showWarning(errorstr);
              }
            } else {
              Tips.showError('{parseStrErr}');
            }
          }
        });
  }
  /**
   * 处理后台发送的数据，转换为数据表格式的数据
   * @author JeremyZhang
   * @date   2016-09-22
   * @return {array}   lan和vlan的数据
   */
  function processData(restr) {
    // 加载Eval模块
    var doEval = require('Eval');
    var Tips = require('Tips');
    var codeStr = restr,

      // 定义需要获得的变量
      variableArr = [
                    'timeRangeNames', 
                    'group_dateStart', 
                    'group_dateStop',
                    'dateStart',
                    'dateStop',
                    'errorstr',
                    'totalrecs',
                    'max_totalrecs',
                    'sysDateTimes'                   
      ];
      for(var i = 0;i<=9;i++){
        
        variableArr.push("timeStart"+String(i));
        variableArr.push("timeStop"+String(i));
        variableArr.push("day"+String(i));
        variableArr.push("enable"+String(i));
      }

    // 获得js字符串执行后的结果
    var result = doEval.doEval(codeStr, variableArr),
      isSuccess = result["isSuccessful"];
    // 判断代码字符串执行是否成功
    if (isSuccess) {
      // 获得所有的变量
      var data = result["data"];
      DATA['totalrecs'] = data.totalrecs;
      DATA['max_totalrecs'] = data.max_totalrecs;
      function UTCtoLocal(time, timezone) {
          date = new Date();
          return time + timezone + date.getTimezoneOffset()* 60;
      }
      var sysDate=new Date(UTCtoLocal(eval(data.sysDateTimes),0) * 1000);  
      Year= sysDate.getFullYear();
      if(Year < 2011)Year = 2011;
      Month= sysDate.getMonth();
      Day= sysDate.getDate();
      Month=Month+1;
      DATA['dataStr']=Year+"-"+(Month.toString()[1]?Month.toString():'0'+Month.toString())+"-"+(Day.toString()[1]?Day.toString():'0'+Day.toString());
      var xxx = [];
      for(var i = 0 ; i <= 9 ;i++){
        var innerJson = {   
          timeRangeNames : data["timeRangeNames"][i],
          dateStart : data["dateStart"][i],
          dateStop : data["dateStop"][i],
          enable    : data["enable"+String(i)],
          day       : data["day"+String(i)],
          timeStart : data["timeStart"+String(i)],
          timeStop  : data["timeStop"+String(i)],
          group_dateStart : data["group_dateStart"][i] || '',
          group_dateStop : data["group_dateStop"][i] || ''
        };
        if(data["timeRangeNames"][i] != undefined && data["timeRangeNames"][i] != ""){
          xxx.push(innerJson);
        }
        
      }
      
      // 存入数据库
      var dataArr = []; // 将要插入数据表中的数据
      xxx.forEach(function(obj,i){
        var innerArr = [];

        innerArr.push(Number(i)+1); //id

        innerArr.push(obj.timeRangeNames); //名称
        var timeJson = {
            dateStart : obj.dateStart,
            dateStop : obj.dateStop,
            enable : obj.enable,
            day : obj.day,
            timeStart : obj.timeStart,
            timeStop : obj.timeStop,
            group_dateStart : obj.group_dateStart,
            group_dateStop : obj.group_dateStop
        };
        innerArr.push(timeJson); //时间数据json

        dataArr.push(innerArr);
      });
      //生成数据库
       var DB = require('Database');
       var database = DB.getDatabaseObj();
       database.addTitle(['id','timeRangeNames','timeJson']);
       database.addData(dataArr);
       DATA['database'] = database;

       //

      
    } else {
      Tips.showError('{parseStrErr}',3);
    }
  }

  function editClick(data, $this){
    //根据编辑的primary-key取到对应数据库的值
   
    var name = data["name"],
        type = data["type"],
        time = data["time"],
        context = data["context"];   
    var data ={
        ID:name,
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

  /**
    *判断星期几
    *
    */
    function getWeeks(number){
      var num = String(number);
      var week = '';
      switch(num){
        case '1':
          week += require('Translate').getValue('monday', ['doTimePlan']);
          break;
        case '2':
          week += require('Translate').getValue('tuesday', ['doTimePlan']);
          break;
        case '3':
          week += require('Translate').getValue('wednesday', ['doTimePlan']);
          break;
        case '4':
          week += require('Translate').getValue('thursday', ['doTimePlan']);
          break;
        case '5':
          week += require('Translate').getValue('friday', ['doTimePlan']);
          break;
        case '6':
          week += require('Translate').getValue('saturday', ['doTimePlan']);
          break;
        case '7':
          week += require('Translate').getValue('sunday', ['doTimePlan']);
          break;
        default:
          break;
      };
         return '';
    }
  function getTableDom() {
    // 表格上方按钮配置数据
    var btnList = [
    {
      "id": "add",
      "name": "{add}",
       "clickFunc" : function($btn){
                  if(DATA['totalrecs'] ==  DATA['max_totalrecs']){
                    require('Tips').showWarning(tl('allowMostInst'));
                  }else{
                    addBtnClick();
                  }
                  $btn.blur();//按钮失焦
            }
    },
    {
      "id": "delete",
      "name": "{delete}",
       "clickFunc" : function($btn){
            deleteBtnClick();
          }

    }];
    var database = DATA['database'];
    var headData = {
      "btns" : btnList
    };
    // 表格配置数据
 // var fieldArr = ['timeRangeNames', 'group_dateStart','group_dateStop'];   
    var tableList = {
      "database": database,
      "isSelectAll":true,
      "dicArr":['common','doTimePlan'],
      "titles": {
        "ID"     : {
          "key": "id",
          "type": "text",
        },
        "{tim_name}"     : {
          "key": "timeRangeNames",
          "type": "text",
        },
        "{tim_plan}"     : {
          "key": "timeJson",
          "type": "text",
          "filter":function(jsons){
              var endstr = "";
              if(jsons.group_dateStart == 'Forever'){
                  endstr = tl('tim_forever');
              }else{
                  endstr += jsons.group_dateStart+"&nbsp;"+tl("to")+"&nbsp;"+jsons.group_dateStop;
                  var sing = 0;//已第几个为准
                  var counts = 0;//计数
                  if(jsons.enable){
                
                    for(var i =0;i<jsons.enable.length;i++){
                      if(jsons.enable[i] == 'on'){
                        sing = i;
                        break;
                      }else{
                        counts++;
                      }
                    }

                    if(counts != jsons.enable.length){
                    	
                    	
                      	endstr += ('&nbsp;&nbsp;'+ getWeekStr(jsons.day[sing]));
                        
                        if(jsons.timeStart[sing] == 'ALL'){
                          endstr += '&nbsp;&nbsp;{allDay}';
                        }else{
                          endstr += '&nbsp;&nbsp;'+jsons.timeStart[sing]+"~"+jsons.timeStop[sing];
                        }
                      
                      function getWeekStr(str){
												var newstr = '';
		                    if(str == '1111111'){
		                    	newstr += '全天';
		                    }else if(str == '1111100'){
		                    	newstr += '工作日';
		                    }else if(str == '0000011'){
		                    	newstr += '双休日';
		                    }else{
		                    	newstr +="星期";
		                    	var hzarr = ['一','二','三','四','五','六','日'];
		                    	for(var j=0;j<str.length;j++){
		                    		if(str[j] == '1'){
		                    			newstr += hzarr[j]+"、";
		                    		}
		                    	}
		                    	newstr = newstr.substr(0,newstr.length-1);
		                    }
		                    return newstr;
											}
                      
                      
                      
                    }
                  }
              }

              return endstr;
          }
        },                  
        "{edit}": {
          "type": "btns",
          "btns" : [
            {
              "type" : 'edit',
              "clickFunc" : function($this){
                var primaryKey = $this.attr('data-primaryKey');
                var tableObj = DATA["tableObj"];
                var data = database.getSelect({
                  primaryKey: primaryKey
                });
                displayEditTab($('#1'),'edit',data);
              }
            },
            {
              "type" : 'delete',
              "clickFunc" : function($this){
                var primaryKey = $this.attr('data-primaryKey')
                var tableObj = DATA["tableObj"];
                var data = database.getSelect({
                  primaryKey : primaryKey});
                  require('Tips').showConfirm(tl('delconfirm'),function(){
                    removeTask(data);
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
    $('a[href="#1"]').text(tl('timePlan'));
    var TableContainer = require('P_template/common/TableContainer');
    var conhtml = TableContainer.getHTML({}),
      $tableCon = $(conhtml);
    // 将表格容器放入标签页容器里
    $container.empty().append($tableCon);
    //向后台发送请求，获得表格数据
    $.ajax({
      url: 'common.asp?optType=timePlan',
      type: 'GET',
      success: function(result) {
        // 将后台数据处理为数据表格式的数据
        processData(result);
        // // 获得表格Dom
        var $table = getTableDom();
        // // 将表格放入页面
        $tableCon.empty().append($table);
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
    // // 清空标签页容器
    // $container.empty();
    // 获取表格数据并生成表格
    var Translate = require('Translate'); 
    var dicNames = ['common', 'doTimePlan']; 
    Translate.preLoadDics(dicNames, function(){ 
      displayTable($container);
    });  
  }
  // 提供对外接口
  module.exports = {
    display: display
  };
});
