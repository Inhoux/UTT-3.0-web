/**
 * 生效时间弹框组件
 * by QC
 *
 */
define(function(require, exports, module){
	require('jquery');
	var DATA = {};

	/**
	 * 新增时间计划 (时间计划下拉框)
	 */
	function addModal($select){
		makeModal('add',$select);
	}

	/**
	 * 编辑时间计划 (时间计划下拉框，规定的时间计划名称)
	 */
	function editModal($select,timePlanName){
		if($select.val() !== '' && timePlanName !== ''){
			makeModal('edit',$select,timePlanName);
		}

	}

	/**
	 * 弹框制作入口
	 */
	function makeModal(type,$select,name){
		var thisName = '';
		if(name === undefined){
			thisName = $select.val();
		}else{
			thisName = name;
		}
		DATA['select'] = $select;
		var modalObj = showModal($select,type);
		  $.ajax({
		      url: 'common.asp?optType=timePlan',
		      type: 'GET',
		      success: function(result) {
		        // 将后台数据处理为数据表格式的数据
		        processData(result);
		        //匹配数据 生成输入组
		        var $input = '';
		        if(type == 'edit'){
		        	var thisdata = DATA['database'].getSelect({timeRangeNames:thisName});
		        	$input = getInputDom(thisdata,type);
		        }else{
		        	$input = getInputDom({},type);
		        }
		        /* 修改title样式  */
				$input.find('.u-inputs-title').css({
					paddingTop:'10px',
					paddingBottom:'10px'
				}).children('div').css({
					top:'49%'
				});
		        modalObj.insert($input);
		        var Translate  = require('Translate');

 			    var tranDomArr = [modalObj.getDom()];
 			    var dicArr     = ['common','doTimePlan'];
 			    Translate.translate(tranDomArr, dicArr);
		        modalObj.show();

		      }
		    });

	}

	/**
	 * 生成弹框
	 */
	function showModal($select,type){
		var modalList = {
	        "id"   : (type == 'add'?'timePlanAdd_Modal':'timePlanEdit_Modal'),
	        "title": (type == 'add'?'新增时间计划':'编辑时间计划'),
	        "size" : "large1", //normal、large :普通宽度、加大宽度
	        "btns" : [
	            {
	                "type"      : 'save',
	                "clickFunc" : function($this){
	                    // $this 代表这个按钮的jQuery对象，一般不会用到
	                    var $modal = $this.parents('.modal');
	                    addTask($modal,$select,type);
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

	    // 初始化模态框，并获得模态框类实例
	    var Modal = require('Modal');
	    var modalObj = Modal.getModalObj(modalList);
	    DATA['modalObj'] = modalObj;
	    return modalObj;

	}

	/**
	 * 数据处理
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


	/**
	 * 生成内部输入框组
	 */
	function getInputDom(getdata,type){
	    var data = getdata[0] || {timeJson:{timeStart:[],enable:[],day:[],timeStart:[],timeStop:[]}};
	    console.log(data);


	    var effectyear = 'Daterange';
	    var group_dateStart = DATA['dataStr'];
	    var group_dateStop = DATA['dataStr'];
		

	    if(data.timeJson.group_dateStart != undefined){
	      effectyear = data.timeJson.group_dateStart == 'Forever'?"Forever":"Daterange";
	      if(data.timeJson.group_dateStart != 'Forever'){
	        group_dateStart = data.timeJson.group_dateStart;
	        group_dateStop = data.timeJson.group_dateStop;
	      }
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
	      if(getstrss == undefined){

	        var everyday = 'everyday'+ends;
	        return [everyday];
	      }
	      for(i=0;i<getstrss.length;i++){
	       if(getstrss.charAt(Number(i)) == 1){

	          //console.log(getstrss+"的"+i+"位是"+getstrss.charAt(Number(i)-1))
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

	    var td2 = $inputDom.find('[name="effecttime"]').parent();
	    td2.append(getselettime(1,'s','h',fromhour)+':'+getselettime(1,'s','m',fromminute)+require('Translate').getValue('to', ['doTimePlan'])+getselettime(1,'e','h',endhour)+':'+getselettime(1,'e','m',endminute));

	    var td3 = $inputDom.find('[name="effecttime2"]').parent();
	    td3.append(getselettime(2,'s','h',fromhour2)+':'+getselettime(2,'s','m',fromminute2)+require('Translate').getValue('to', ['doTimePlan'])+getselettime(2,'e','h',endhour2)+':'+getselettime(2,'e','m',endminute2));

	    var td4 = $inputDom.find('[name="effecttime3"]').parent();
	    td4.append(getselettime(3,'s','h',fromhour3)+':'+getselettime(3,'s','m',fromminute3)+require('Translate').getValue('to', ['doTimePlan'])+getselettime(3,'e','h',endhour3)+':'+getselettime(3,'e','m',endminute3));

	    $inputDom.find('[name="year2"]').checkdemofunc('checkLastDate', $inputDom.find('[name="year1"]'));
	    $inputDom.find('[name="year1"]').checkdemofunc('checkFirstDate', $inputDom.find('[name="year2"]'));
	    $inputDom.find('[name="year1"],[name="year2"]').click(function(){
	    	laydate();
	    })

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

	    return $inputDom;
  }


	/**
	 * 修改或新增时间计划
	 */
	  function addTask($modal,$select,type) {
	    var InputGroup = require('InputGroup');
	    var tips = require('Tips');
	    var Serialize = require('Serialize');
	    var len = InputGroup.checkErr($modal);
	    if(len > 0)
	    {
	      tips.showError('{errNoSave}',3);
	      return;
	    }
	    var queryArrs = Serialize.getQueryArrs($modal);
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
	            DATA['modalObj'].hide();
	            if(type == 'add'){
	            	$select.append('<option value="'+queryJson.TimeRangeName+'" selected="selected">'+queryJson.TimeRangeName+'</option>');
	            }
	          } else {
	            var errMsg = data["errorstr"];
	            if(errMsg==undefined){
					tips.showError('{saveFail}');
	            }else{
	            	tips.showWarning(errMsg);
	            }
	          }
	        } else {
	          tips.showError('{parseStrErr}');
	        }
	      }
	    });
	  }

   function getselettime(num,starend,type,deval){
    var nums = String(num == 1?'':num);
    var types = (type == 'h')?'hour':'minute';
    var starends = (starend == 's')?'from':'end';

    var selecthtml = '<select style="margin:auto 8px;width:54px"  name="'+starends+types+nums+'">';

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


	module.exports = {
		addModal:addModal,
		editModal:editModal
	};
});
