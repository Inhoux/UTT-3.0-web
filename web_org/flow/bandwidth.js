Translate.loadDics(['common','doSystemState']);
var _cookieName = 'tab';
/*
  数据接口
 */
var _url = '/common.asp?optType=systemInfo_1';
/*
  post数据
 */
var _postData = '';
/*
  刷新时间间隔
 */
var _interval = 2;
/*
  存储页面数据
 */
var Data = {};
function changeTab(chartName){
  /*
    切换图表
    使用的是原作者的方法
   */
  tabSelect(chartName);
}
/*
  生成标签页头部，用于切换图
 */
function createTabs(){
    var args = Array.prototype.slice.call(arguments, 0);
    var html = '';
    var btnHtml = '<option  class="tab-toggle" {checked} value="{chartName}">{btnName}</option>';
    args.forEach(function(arg){
      var innerHtml = btnHtml.replace('{chartName}', arg[0]).replace('{btnName}', arg[1]);
      if(cookie.get('bw_r' + _cookieName) == arg[1]){
        innerHtml = innerHtml.replace('{checked}', 'selected');
      }else{
        innerHtml = innerHtml.replace('{checked}', '');
      }
      html += innerHtml;
    });
    $('#ports').empty().append(html);
}
function processData(jsStr){
	
	/* 饼图数据
 	 * by QC
 	 */
//	console.log(jsStr);
// asd
  eval(jsStr);
  txBands.shift();
  rxBands.shift();
//console.log(SpeedDowns[0]);
  Data["statuss"]      = getConnType(ConnStatuss);
  Data["speedUps"]     = SpeedUps;
  Data["speedDowns"]   = SpeedDowns;
  Data["upBands"]      = txBands;
  Data["downBands"]    = rxBands;
  Data["connTypes"]    = ConnTypes;
  Data["wanIps"]       = IPs;
  Data["wanMasks"]     = Masks;
  Data["wanMacs"]      = mac;
  Data["wanConnTimes"] = computeTimes(ConnTimes);
  Data["wanMainDnss"]  = MainDns;
  Data["wanSecDnss"]   = SecDns;
  Data["lanIp"]        = lanIp;
  Data["lanMac"]       = lanMac;
  Data["lanMask"]      = lanNetmask;
  Data["lanMode"]      = mode(lanMode);
  show();
  /* 修改部分交互 */
 //当该wan口未连接时，将其置为disabled不可选择
  ConnStatuss.forEach(function(thisnum,index){
//	console.log(thisnum);

  	if(thisnum != 1){
  		setTimeout(function(){
  			$('#ports').children().eq(index).attr('disabled','disabled');
  		},100)
  	}else{
  		setTimeout(function(){
  			$('#ports').children().eq(index).removeAttr('disabled');
  		},100)
  	}
  });
}
function getConnType(numbers){
  var arr = [];
  numbers.forEach(function(number){
    var type = '';
    if(number == 1){
      type = T('connected');
    }else if(number == 0){
      type = T('nconnecte');
    }else{
      type = T('nconfigured');
    }
    arr.push(type);
  })
  return arr;
}
function computeTimes(times){
  var timeArr = [];
  times.forEach(function(second){
    timeArr.push(computeTime(parseInt(second)));
  });
  return timeArr;
}
function computeTime(seconds){
  var second = seconds % 60;
  var minutes = Math.floor(seconds / 60);
  var minute = minutes % 60;
  var hours = Math.floor(minutes / 60);
  var hour = hours % 24;
  var day = Math.floor(hours / 24);
  return (day + T('day') + hour + T('hour') + minute + T('minute') + second + T('second'));
}
function mode(modeNumber){
  var mode = '';
  switch(modeNumber){
    case 0:
      mode = '10M'+'全双工';
      break;
    case 1:
    	mode = '100M'+'全双工';
      break;
    case 2:
    	mode = '1000M'+'全双工';
      break;
    case 3:
    	mode = '自动';
      break;  
    case 4:
    	mode = '10M'+'半双工';
      break;  
    case 5:
    	mode = '100M'+'半双工';
      break;    
    default:
    	mode = '自动';
      break;  
  }
  return mode;
}
function show(){
  showPies();
  showMsg();
}
function showPies(){
  var $doms = [
          $('#pies #wan-one'),
          $('#pies #wan-two'),
          $('#pies #wan-three'),
          $('#pies #wan-four'),
          $('#pies #wan-five')
  ];
  var titles = ['WAN1', 'WAN2', 'WAN3', 'WAN4' ,'WAN5'];
  /*修改当前显示的WAN口数量*/
  var wannum = Data["statuss"].length;
  titles = titles.slice(0,wannum);
  
  var upBands = Data["upBands"];
  titles.forEach(function(item, index){
    var data = {
      upSpeed   : Data['speedUps'][index] || 0,
      downSpeed : Data["speedDowns"][index] || 0,
      upBand    : Data['upBands'][index] || 0,
      downBand  : Data["downBands"][index] || 0
    };
    showPie($doms[index], data, titles[index]);
  });
  /* 将 WAN口数量赋给#charts */
// 		var $newsvg = $('#svg-chart').clone(true).attr('src',"./lib/bwm-graph.svg?wannum="+titles.length);
 		
		
		/* 防止火狐重加载*/
		if($('#svg-chart').attr('src') != "./lib/bwm-graph.svg?wannum="+titles.length){
			$('#svg-chart').attr('src',"./lib/bwm-graph.svg?wannum="+titles.length);
		}
		if(titles.length>4){
//			$newsvg.css('width','1100px');
			$('#svg-chart').css('width','1100px');
//			$('#msg').css({'margin-left':'0px'});
			$(parent.document.getElementById('bandWidth')).children('iframe').width('1400');
		}else{
//			$newsvg.css('width','800px');
			$('#svg-chart').css('width','890px');
		}
		/*
		$newsvg[0].onload = function(){
 			$('#svg-chart').after($newsvg);
 			$('#svg-chart').remove();
 		}
 		*/
}
function showPie($dom, data, title){
  var upSpeed   = parseInt(data.upSpeed),
      upBand    = parseInt(data.upBand)*1024,
      downSpeed = parseInt(data.downSpeed),
      downBand  = parseInt(data.downBand)*1024;
  $dom.empty();
  /*
    未使用上传带宽
   */
  var upEnused = upBand - upSpeed;
  /*
    未使用下载带宽
   */
  var downEnused = downBand - downSpeed;
  if(upSpeed <= 0){
    upSpeed = 0;
    upEnused = upBand = 1;
  }else{
    if(upEnused < 0){
      upEnused = 0;
    }
  }
  if(downSpeed <= 0){
    downSpeed = 0;
    downEnused = downBand = 1;
  }else{
    if(downEnused < 0){
      downEnused = 0;
    }
  }
  var seriesData = [
      [
          {name:T('upload'), value: upSpeed, color:"#e66f0f"},
          {name:'', value: upEnused, color:"#e6d6c2", legend : false},
      ],
      [
         {name:T('download'), value: downSpeed, color:"#0e53c4"},
         {name:'', value: downEnused, color:"#bcd0e4", legend : false},
      ]
  ];
  
  var config = {
          width : 210, 
          height: 80,
          isDonut: true,
          series: seriesData,
          title: title,
          legend : {
              enable : true
          },
          border : {
              //enable : true
          }
  };
  new Chart().renderPie($dom[0], config);
}
function showMsg(){
  var cookieName = cookie.get('bw_r' + _cookieName);
  if(cookieName == null){
    Data["cookieName"] = 'nocookie';
    cookieName = 'WAN1'
  }
  if(!Data["cookieName"]){
    Data["cookieName"] = 'nocookie';
  }
  var $msg = $('#msg');
  if(cookieName.slice(0, 1) == 'L'){
    $msg.find('[type="wan"]').hide();
    $msg.find('[type="lan"]').show();
    $msg.find('[for="mode"]').next().text(Data["lanMode"]);
    $msg.find('[for="ip"]').next().text(Data["lanIp"]);
    $msg.find('[for="mask"]').next().text(Data["lanMask"]);
    $msg.find('[for="mac"]').next().text(Data["lanMac"]);
  }else{
    var notDef = T('notDefined');
    var count = parseInt(cookieName.slice(-1));
    $msg.find('[type="wan"]').show();
    $msg.find('[type="lan"]').hide();
    $msg.find('[for="status"]').next().text(Data["statuss"][count-1]);
    $msg.find('[for="time"]').next().text(Data["wanConnTimes"][count-1]);
    $msg.find('[for="type"]').next().text(function(){
    	switch(Data["connTypes"][count-1]){
    		case 'STATIC':
    			return '固定接入';
    			break;
    		case 'DHCP':
    			return '动态接入';
    			break;
    		default:
    			return Data["connTypes"][count-1];
    			break;
    	}
    });
    $msg.find('[for="priDNS"]').next().text(Data["wanMainDnss"][count-1] || notDef);
    $msg.find('[for="secDNS"]').next().text(Data["wanSecDnss"][count-1] || notDef);
    $msg.find('[for="ip"]').next().text(Data["wanIps"][count-1] || notDef);
    $msg.find('[for="mask"]').next().text(Data["wanMasks"][count-1] || notDef);
    $msg.find('[for="mac"]').next().text(Data["wanMacs"][count-1]);
  }
  
  
}

