define(function(require, exports, module) {
  // 存储本页面一些变量
  var DATA = {};
  function tl(str){
    return require('Translate').getValue(str,['common','lanConfig','doDydns','error']);
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
     }
    var modalList = {
      "id"   : config.id,
      "title": config.title,
      "btns" : [
        {
          "type"      : 'save',
          "clickFunc" : function($this){
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
    var utthost='';
    utthost = DATA['productIDs']+'.uttcare.com';
    
    var inputList = [
      { 
        "prevWord": '{provider}',
        "disabled":(config.id == 'edit-modal'? true: false),
        "inputData": {
          "type": 'select',
          "name": 'DDNSProvider',
          "defaultValue":data.provider || 'none',
          "items" : [
            {
              "value" : 'none',
              "name"  : '{none}',
            },
            {
              "value" : '3322.org',
              "name"  : '3322.org',
              "control" :'f3322'
            },
            {
              "value" : 'www.oray.net',
              "name"  : '{huashengke}',
              "control" :'fnut'
            },
            {
              "value" : 'dyndns.org',
              "name"  : 'dyndns.org',
              "control" :'fdyn'
            },
            {
              "value" : 'no-ip.com',
              "name"  : 'no-ip.com',
              "control" :'fnip'
            },
             /*{
              "value" : 'uttcare.com',
              "name"  : 'uttcare.com',
              "control" :'futt'
            },*/
          ]
        },
        "afterWord": ''
      }, 
      {
        "sign": 'f3322,fnut,fdyn,fnip,futt',
        //"necessary": true,  //是否添加红色星标：是
        "prevWord": '{domainNames}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'ddnsurl',
          "value":data.zcym || ''
 
        },
        "afterWord": ''
      },     
      
                       
/************************************************************************/
		 /*f3322*/
      {
        "sign": 'f3322',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{hostName}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'DDNS3322',
          "value": (data.provider == '3322.org'?data.host:''),
          "checkDemoFunc" : ['checkDDNS','DDNSProvider']
          // "checkDemoFunc": ['checkInput', 'name', '1', '31', '3'] 
        },
        "afterWord": ''
      },                       
      {
        "sign": 'f3322',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{username}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'Account3322',
          "value":(data.provider == '3322.org'?data.ac:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },
      {
        "sign": 'f3322',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{pwd}',
        "inputData": {
          "type"       : 'password',
          "name"       : 'Password3322',
          "value":(data.provider == '3322.org'?data.pd:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },
      /*----------------------------------------*/ 
      /*fnut*/
       
      {
        "sign": 'fnut',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{username}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'AccountNut',
          "value":(data.provider == 'www.oray.net'?data.ac:''),
          "checkDemoFunc" : ['checkName','1','31','fnut']
        },
        "afterWord": ''
      },
      {
        "sign": 'fnut',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{pwd}',
        "inputData": {
          "type"       : 'password',
          "name"       : 'PasswordNut',
          "value":(data.provider == 'www.oray.net'?data.pd:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },      
      /*----------------------------------------*/
      {
        "sign": 'fnip',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{hostName}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'DDNSNip',
          "value":(data.provider == 'no-ip.com'?data.host:''),
          "checkDemoFunc" : ['checkDDNS','DDNSProvider']
        },
        "afterWord": ''
      },                       
      {
        "sign": 'fnip',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{username}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'AccountNip',
          "value":(data.provider == 'no-ip.com'?data.ac:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },
      {
        "sign": 'fnip',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{pwd}',
        "inputData": {
          "type"       : 'password',
          "name"       : 'PasswordNip',
          "value":(data.provider == 'no-ip.com'?data.pd:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },   
      /*----------------------------------------*/         
      {
        "sign": 'fdyn',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{hostName}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'DDNSDyn',
          "value":(data.provider == 'dyndns.org'?data.host:''),
          "checkDemoFunc" : ['checkDDNS','DDNSProvider']
        },
        "afterWord": ''
      },                       
      {
        "sign": 'fdyn',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{username}',
        "inputData": {
          "type"       : 'text',
          "name"       : 'AccountDyn',
          "value":(data.provider == 'dyndns.org'?data.ac:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },
      {
        "sign": 'fdyn',
        "necessary": true,  //是否添加红色星标：是
        "prevWord": '{pwd}',
        "inputData": {
          "type"       : 'password',
          "name"       : 'PasswordDyn',
          "value":(data.provider == 'dyndns.org'?data.pd:''),
          "checkDemoFunc" : ['checkName','1','31']
        },
        "afterWord": ''
      },   
      /*----------------------------------------*/    
      // futt
     
     
             
      /*----------------------------------------*/ 
                         
      /*----------------------------------------*/              
/************************************************************************/

      { 
        "sign": 'fnut,f3322,fdyn,fnip,fcustom,fdef',
        "prevWord": '{interface}',
        "disabled":(config.id == 'edit-modal'? true: false),
        "inputData": {
          "count":DATA['wanIfCount'],
          "type": 'select',
          "name": 'Profile',
          "defaultValue":data.interface || 'WAN1',
          "items" : [
              {
                "value" : 'WAN1',
                "name"  : 'WAN1',
              },  
              {
                "value" : 'WAN2',
                "name"  : 'WAN2',
              }, 
              {
                "value" : 'WAN3',
                "name"  : 'WAN3',
              }, 
              {
                "value" : 'WAN4',
                "name"  : 'WAN4',
              },                                             
              {
                "value" : 'WAN5',
                "name"  : 'WAN5',
              },                                             
            ]
        },
        "afterWord": ''
      },        
    ];
    var IG = require('InputGroup');
    var $inputs = IG.getDom(inputList);

    $inputs.find('[name="ddnsurl"]').after('<a href="" target="_blank" class="u-inputLink" id="ddnsurl"></a>');
    $inputs.find('[name="ddnsurl"]').remove();
    
    /*调整样式*/
   $inputs.find('[name="DDNS3322"],[name="DDNSNip"],[name="DDNSDyn"],[name="DDNSUttC"],[name="PasswordUtt"],[name="DDNSUtt"]').css({
   		width:'230px'
   });

    makeTheUrlChange();
    $inputs.find('[name="DDNSProvider"]').change(function(){
        makeTheUrlChange();
    })
    function makeTheUrlChange(){
       var slctval = $inputs.find('[name="DDNSProvider"]').val();
       var urldom = $inputs.find('#ddnsurl');
       switch(slctval){
            case '3322.org':
              urldom.text('http://www.pubyun.com'); 
              urldom.attr('href','http://www.pubyun.com');
              break;
            case 'www.oray.net':
              urldom.text('http://www.oray.net'); 
              urldom.attr('href','http://www.oray.net/Passport/Passport_Register.asp');
              break;
            case 'uttcare.com':
              urldom.text('http://www.utt.com.cn/ddns'); 
              urldom.attr('href','http://www.utt.com.cn/ddns');
              break;
            case 'dyndns.org':
              urldom.text('http://dyn.com/dns/'); 
              urldom.attr('href','http://dyn.com/dns/');
              break;
            case 'no-ip.com':
              urldom.text('http://www.no-ip.com'); 
              urldom.attr('href','http://www.no-ip.com');
              break;

       }
    }  
    modalObj.insert($inputs);
    var $modalDom = modalObj.getDom();
    // $('body').append($modalDom);

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
//    tips.showError('{errNoSave}',3);
      return;
    }
    var Serialize = require('Serialize');
   var queryJson = Serialize.queryArrsToJson(queryArrs);
   var newJson =  {};

   var dval = $('[name="DDNSProvider"]').val();
   if(dval == 'none'){
       require('Tips').showWarning('{selectProvider}');
       return;
   }
   else if(dval == '3322.org'){
      newJson.DDNS = queryJson.DDNS3322;
      newJson.Account = queryJson.Account3322;
      newJson.Password = queryJson.Password3322;
   }else if(dval == 'www.oray.net'){
      newJson.Account = queryJson.AccountNut;
      newJson.Password = queryJson.PasswordNut;
    }
   else if(dval == 'no-ip.com'){
      newJson.Account = queryJson.AccountNut;
      newJson.Password = queryJson.PasswordNut;
   }else if(dval == 'dyndns.org'){
      newJson.DDNS = queryJson.DDNSDyn;
      newJson.Account = queryJson.AccountDyn;
      newJson.Password = queryJson.PasswordDyn;  
   }else if(dval == 'uttcare.com')
   {
                if($('[name="defultcheck"]:checked').val() == 'def')
                {
                          newJson.DDNS = queryJson.DDNSUtt;
                }else if($('[name="defultcheck"]:checked').val() == 'diy')
                {
                          newJson.DDNS = queryJson.DDNSUttC;
                          newJson.Password = queryJson.PasswordUtt; 
                }
   }
  var newStr = Serialize.queryJsonToStr(newJson);

    var queryStr = Serialize.queryJsonToStr(queryJson) + '&' +newStr;
    //queryStr = queryStr + '&' +'Action=' + type;
    queryStr = queryStr + '&' +'Action=' + type;
    $.ajax({
      url: '/goform/DDNS',
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
            var Dispatcher = require('Dispatcher');
            Dispatcher.reload(0.5);
          } else {
        //    var errMsg = result["errorstr"];
            tips.showWarning(tl('INTERFACE_REPEAT'));
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
    // 判断是否有被选中的选择框
    if (length > 0) {
      var lanArr = []; 
      var str = '';
      //$.each($elems, function(index, element) {
      primaryKeyArr.forEach(function(primaryKey) {  
        var data = database.getSelect({primaryKey : primaryKey});
        var name = data[0]["interface"];
        str += name + ',';
      });
      if(str != ''){
        str = str.substr(0, str.length - 1);
        str = 'delstr=' + str;
        require('Tips').showConfirm(tl('delconfirm'),function(){
          $.ajax({
            url: '/goform/ConfigDDNSListDel',
            type: 'POST',
            data: str,
            success: function(result) {
              var doEval = require('Eval');
              var codeStr = result,
                variableArr = ['status'],
                result = doEval.doEval(codeStr, variableArr),
                isSuccess = result["isSuccessful"];
              // 判断代码字符串执行是否成功
              if (isSuccess) {
                var data = result["data"],
                  status = data['status'];
                if (status) {
                  // 提示成功信息
                  Tips.showSuccess('{delSuccess}', 2);
                  var Dispatcher = require('Dispatcher');
                  Dispatcher.reload(2);
                  // display($('#1'));
                } else {
                  Tips.showError('{delFail}', 2);
                }
              } else {
                Tips.showError('{parseStrErr}}', 2);
              }
            }
          });            
        });
      }
    } else {
      Tips.showWarning('{unSelectDelTarget}', 2);
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
    var name = data["interface"];
    var queryStr = 'delstr=' + name ;
    //alert(queryStr);
    var Tips = require('Tips');
    require('Tips').showConfirm(tl('delconfirm'),function(){
      $.ajax({
        url: '/goform/ConfigDDNSListDel',
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
              Tips.showSuccess('{delSuccess}', 2);
              var Dispatcher = require('Dispatcher');
              Dispatcher.reload(2);
            } else {
              Tips.showError('{delFail}', 2);
            }
          } else {
            Tips.showError('{delFail}', 2);
          }
        }
      });
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
    var Database = require('Database');
    var database = '';
    database = Database.getDatabaseObj();// 数据库的引用
    // 存入全局变量DATA中，方便其他函数使用
    DATA["tableData"] = database;
    var fieldArr =  [
    'interface',
    'status',
    'provider',
    'host',
    'ip',
    'time'
    ];
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
  function storeDdnsData(data) {
    data.forEach(function(item, index){
      item.unshift(index + 1);
    });
    // 获取数据库模块，并建立一个数据库
    var Database = require('Database'),
      database = Database.getDatabaseObj(); // 数据库的引用
    // 存入全局变量DATA中，方便其他函数使用
    DATA["ddnsData"] = database;
    // 声明字段列表
    var fieldArr =  [
    'interface',
    'status',
    'provider',
    'host',
    'ip',
    'time',
    'ac',
    'pd'
    ];    
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
      // 定义需要获得的变
      variableArr = ['DDNSProviders', 
                    'Accounts', 
                    'DDNSs',
                    'Passwords',
                    'Profiles',
                    'DDNS_UTTCARE_NUM',
                    'wanIfCount',
                    'productIDs',
                    'Connstatus',
                    'ddns_times',
                    'ddns_ips',     
                    'errorstr'
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
      var DDNSProviders = data["DDNSProviders"],
        Accounts = data["Accounts"],
         DDNSs = data["DDNSs"],
        Passwords = data["Passwords"],
        Profiles = data["Profiles"],
        DDNS_UTTCARE_NUM = data["DDNS_UTTCARE_NUM"],
        productIDs = data["productIDs"],
        wanIfCount = data["wanIfCount"],
        Connstatus = data["Connstatus"],
        ddns_times = data["ddns_times"],
        ddns_ips = data["ddns_ips"],
        errorstr = data["errorstr"];
        DATA['wanIfCount']=wanIfCount;
        DATA['productIDs']=productIDs;
      // 把数据转换为数据表支持的数据结构
      var dataArr = []; // 将要插入数据表中的数据
      Profiles.forEach(function(item, index, arr) {
        var arr = [];
        //arr.push(nameArr[index]);
        arr.push(Profiles[index]);
        if(Connstatus[index]=='disconnected'){
          arr.push(tl('disconnected'));  
        }else{
          arr.push(tl('connected')); 
        }  
        arr.push(DDNSProviders[index]);            
        arr.push(DDNSs[index]);
        arr.push(ddns_ips[index]);
        arr.push(ddns_times[index]);
        arr.push(Accounts[index]);
        arr.push(Passwords[index]);
        dataArr.push(arr);
      });
      // 返回处理好的数据
      var tableData = {
        data: dataArr
      };
      var ddnsData = [
        [Profiles,Connstatus, DDNSProviders,DDNSs,ddns_ips,ddns_times,wanIfCount,Accounts,Passwords],
      ];
      return {
        table: tableData,
        ddnsData: ddnsData,
      };
    } else {
      Tips.showError('{parseStrErr}}',3);
    }
  }

  function editClick(data, $this){
    //根据编辑的primary-key取到对应数据库的值
    // var interface = data["interface"],
    //     status = data["status"],
    //     provider = data["provider"],
    //     host = data["host"],  
    //     ip = data["ip"],
    //     time = data["time"],
    //     zcym = 'http://'+data["provider"],
    //     pd=data["pd"],
    //     ac=data["ac"];
    // var data ={
    //     interface:interface,
    //     status:status,
    //     provider:provider,
    //     host:host,
    //     ip:ip,
    //     time:time,
    //     zcym:zcym,
    //     ac:ac,
    //     pd:pd
    // };
   
    var dataJson = { 
    };
    $.ajax({
      type: 'GET',
      url:'common.asp?optType=editddns',
      data:'editName='+data.interface,
      success:function(result){
          var doEval = require('Eval');
          var codeStr = result,
            returnStr = ['DDNSProviders','Accounts','DDNSs','Passwords','Profiles','DDNS_UTTCARE_NUM'],
            result = doEval.doEval(codeStr, returnStr),
            isSuccess = result["isSuccessful"];
          // 判断代码字符串执行是否成功
          if (isSuccess) {
            var data = result["data"];
            dataJson.provider = data.DDNSProviders;  //服务商
            dataJson.ac = data.Accounts;             //用户名
            dataJson.host = data.DDNSs;              //主机名
            dataJson.pd = data.Passwords;            //密码
            dataJson.interface = data.Profiles;      //接口
            dataJson.DDNS_UTTCARE_NUM = data.DDNS_UTTCARE_NUM;//服务商
              // dataJson.DDNSProviders = data['DDNSProviders'];
              // dataJson.Accounts = data['Accounts'];
              // dataJson.DDNSs = data['DDNSs'];
              // dataJson.Passwords = data['Passwords'];
              // dataJson.Profiles = data['Profiles'];
              // dataJson.DDNS_UTTCARE_NUM = data['DDNS_UTTCARE_NUM']; 
               var cfg = {
                  id : 'edit-modal',
                  title: '{edit}',
                  data:dataJson,
                  type:'modify'
                };

                makeModal(cfg);
          };
        // };
      }
    });
   
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
                //alert($btn.attr('id'));  // 显示 add
                  addBtnClick();
            }
    },
    {
      "id": "fresh",
      "name": "{fresh}",
       "clickFunc" : function($btn){
                //alert($btn.attr('id'));  // 显示 add
        
            //Path.changePath('计划任务');
            // 异步加载 LAN口配置标签页的处理模块，并调用display方法
            
//          require.async('./displayDDNS', function(obj){      
//              obj.display($('#1'));
//          });
            
      			ajaxforrefresh(DATA['tableCon'],true);
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
    var tableList = {
      "database": database,
      "isSelectAll":true,
      "dicArr":['common','lanConfig','doDydns'],
      "titles": {
        "{interface}"     : {
          "key": "interface",
          "type": "text",
        },
        "{status}"    : {
          "key": "status",
          "type": "text"
        },   
        "{provider}"    : {
          "key": "provider",
          "type": "text"
        }, 
        "{hostName}"    : {
          "key": "host",
          "type": "text"
        }, 
         "{ip}"    : {
          "key": "ip",
          "type": "text"
        }, 
        "{freshTime}"    : {
          "key": "time",
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
                // require('Tips').showConfirm('{deleteConfirm}',function(){
                    removeTask(data[0]);
                  // });                
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
     DATA['tableCon'] = $tableCon;
    // 将表格容器放入标签页容器里
    $container.append(DATA['tableCon']);
    //向后台发送请求，获得表格数据
    ajaxforrefresh(DATA['tableCon']);
    
  }
  
  function ajaxforrefresh($tableCon,isfresh){
  	$.ajax({
      url: 'common.asp?optType=ddns',
      //url: 'test.asp',
      type: 'GET',
      success: function(result) {

        // 将后台数据处理为数据表格式的数据
        var data = processData(result);
          tableData = data["table"],
          ddnsData  = data["ddnsData"];
        var tableArr  = tableData["data"];
        storeTableData(tableArr);
        storeDdnsData(ddnsData);
        
        
        
        if(isfresh){
        	//如果是刷新状态 调用刷新方法，传入最新的数据库
        	DATA["tableObj"].refresh(DATA["tableData"]);
        	
        }else{
        	// 获得表格Dom
	        var $table = getTableDom();
	        // 将表格放入页面
	        $tableCon.append($table);
        }
        
        
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
    // 清空标签页容器
    $container.empty();
    // 获取表格数据并生成表格
    displayTable($container);
  }
  // 提供对外接口
  module.exports = {
    display: display
  };
});
