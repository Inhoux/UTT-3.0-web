nvram = {
	web_svg: '1',
	rstats_colors: '',
	http_id: 'TID65929cbc61a4d7d7'
};
var lang          = "zhcn";isMacChange = 0;
var cprefix       = 'bw_r';
var updateInt     = 2;
var updateDiv     = updateInt;
var updateMaxL    = 300;
var updateReTotal = 1;
var prev          = [];
var debugTime     = 0;
var avgMode       = 0;
var wdog          = null;
var wdogWarn      = null;
_tabCreate=function (tabs){
  /**
   * 调用新方法，生成切换按钮组
   */
  createTabs.apply(null, arguments);
  var buf = [];
  var tdCl = '';
  buf.push('<table id="tabs" cellpadding="0" cellspacing="0" align="left"><tr><td><table cellpadding="0" cellspacing="0"><tr>');
  for (var i = 0; i < arguments.length; ++i)
  {
    if(arguments[i][0].toUpperCase().indexOf('LAN')>=0 && arguments.length>18)
    {
      buf.push('</tr></table>'
           +'</td></tr>'
           +'<tr><td><table cellpadding="0" cellspacing="0" class=newLine><tr>');//¿ªÆôÐÂµÄÒ»ÐÐ
    }
    if(arguments[i][0]){
      tdCl=' class=portTd';
    }
    else {
        tdCl='';
    }
    /*
      不生成原先的头部标签
     */
    //buf.push('<td '+tdCl+'><a class="tab-toggle" href="javascript:tabSelect(\'' + arguments[i][0] + '\')" id="' + arguments[i][0] + '">' + arguments[i][1] + '</a></td>');
  }
  buf.push('</tr></table></td></tr></table><div id="tabs-bottom"></div>');
  return buf.join('');
}
var ref = new TomatoRefresh(_url, _postData, _interval);
ref.stop = function() {
  this.timer.start(1000);
}
var aaas = 0;
ref.refresh = function(text) {
  var c, i, h, n, j, k;
  watchdogReset();
 
  ++updating;
  try {
    netdev = null;
    /*
      处理数据
     */
    eval(text);
    /*
      这里可以处理其他数据
     */
    processData(text);
    n = (new Date()).getTime();
    if (this.timeExpect) {
      if (debugTime) E('dtime').innerHTML = (this.timeExpect - n) + ' ' + ((this.timeExpect + 2000) - n);
      this.timeExpect += 2000;
      this.refreshTime = MAX(this.timeExpect - n, 500);
    }
    else {
      this.timeExpect = n + 2000;
    }
 	
// 	console.log(speed_history['WAN1'])
 	/* 将数据传入svg
 	 * by QC
 	 */
    for (i in netdev) {
      c = netdev[i];
      if ((p = prev[i]) != null) {
	        h = speed_history[i];
	        h.rx.splice(0, 1);
	        h.tx.splice(0, 1);
	        if(i.indexOf('WAN')>=0){
//	        	console.log(SpeedDowns[Number(i.substr(3))-1].toString());
//				console.log(Number(SpeedDowns[Number(i.substr(3))-1]));
//	        	h.rx.push((c.rx < p.rx) ? 0 : (c.rx - p.rx));
	        	h.rx.push(Number(SpeedDowns[Number(i.substr(3))-1])/3.8);
	        	h.tx.push(Number(SpeedUps[Number(i.substr(3))-1])/3.8);
	        }else{
	        	h.rx.push((c.rx < p.rx) ? 0 : (c.rx - p.rx));
	        	h.tx.push((c.tx < p.tx) ? 0 : (c.tx - p.tx));
//	        	console.log((c.rx - p.rx).toString());
	        }
	        
           
            h.tx.splice(0, 1);
            
            h.tx.push((c.tx < p.tx) ? 0 : (c.tx - p.tx));
        }
        else if (!speed_history[i]) {
          speed_history[i] = {};
          h = speed_history[i];
          h.rx = [];
          h.tx = [];
          for (j = 300; j > 0; --j) {
            h.rx.push(0);
            h.tx.push(0);
          }
          h.count = 0;
        }
        prev[i] = c;
      }
      loadData();
    }
    catch (ex) {
    }
    --updating;
}
function watchdog()
{
    watchdogReset();
    ref.stop();
    wdogWarn.style.display = '';
}
function watchdogReset()
{
    if (wdog) clearTimeout(wdog)

    wdog = setTimeout(watchdog, 10000);
    wdogWarn.style.display = 'none';
}
/*
  入口函数
 */
function init()
{
    speed_history = [];

    initCommon(2, 1, 1);

    wdogWarn = E('warnwd');
    watchdogReset();
    ref.start();
}
var oldTabSelect= tabSelect;
tabSelect = function()
{ 
    oldTabSelect.apply(null,arguments);/*ÔËÐÐÖ®Ç°µÄ tabSelectº¯Êý*/
    /*
      这部分代码用于记录当前显示的标签页
      不需要了，注释掉
      @zhangbing
     */
    // arrayThreeMenu[3][1]='switch/stat_detailed.asp?port='+	(cookie.get(cprefix + 'tab')||1);/*¸ü¸ÄÒ³Ãæ¶¥²¿µÄtabÑ¡Ïî¿¨Á´½Ó*/
    
}