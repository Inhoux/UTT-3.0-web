define(function(require, exports, module){
	require('jquery');
	/**
	 * 获取所有页面的名称
	 * @author JeremyZhang
	 * @date   2016-11-24
	 * @return {[type]}   [description]
	 */
	function getUrlNames(){
		var Urls = require('P_config/urls');
		var urls = Urls["urls"]; 
		var urlNames = [];
		for(var urlName in urls){
			urlNames.push(urlName);
		}
		return urlNames;
	}
	/**
	 * 从服务器获取所有的配置数据
	 * @author JeremyZhang
	 * @date   2016-11-24
	 * @return {[type]}   [description]
	 */
	function getSettings(callback){
		$.ajax({
			url     : 'common.asp?optType=allConfig|fastConfigPop',/*竖线前后请不要加空格*/
			type    : 'GET',
			success : function(jsStr){
				var Eval       = require('Eval');
				var variables  = [
					"PPTPClientList",
					"defwancount",
					"dst",
					"wireless",
					"wireless_5g",
					"custom_brand",
					"CusSrv",
					"custom_brand",
					"mac_limit_menu",
					"openvpn",
					"Packet",
					"WEBAUTH_ADVANCE",
					"WEBAUTH_ACCOUNT",
					"snmpConf",
					"apLog",
					"apLoadBalance",
					"SysLogInfo",
					"MacFilter",
					"IW_MMoney",
					"levelone_ctrl",
					"LEVELONE_LOGO",
					"galaxywind_ctrl",
					"uttSmartUi",
					"Game_Boost",
					"WlanBaseAdvance_new",
					"WlanBaseAdvance_5g",
					"WlanSecurity_new",
					"WlanSecurity",
					"WlsConf_5g",
					"WlanBase_5g",
					"WlanSecurity_5g_new",
					"WlanSecurity_5g",
					"WlanMacFilter_5g",
					"WlanAdvanced_5g",
					"WlanMultiSsid_5g",
					"WlanHostInfo_5g",
					"wlanSet_5g",
					"NetShareManage",
					"FtpServer",
					"ShareAccountList",
					"smartWlanRepeater",
					"smartCloudShare",
					"smartSecutityConf",
					"diagTest",
					"hotel",
					"ADfilter",
					"SOFT_UDTYPE",
					"ADFILTER_UDTYPE",
					"auto_update",
					"fitApMacFilter",
					"vlanConfig",
					"vpnProxy",
					"accessCtrl",
					"weChatManage",
					"ssidSeparateCtr",
					"DhcpServer",
					"DhcpServerForAc",
					"dnsmasq",
					"DnsRedirect",
					"dnsmasqPool",
					"uttKnowifi",
					"utt_5g_channel_149_to_165",
					"PPTPClientList",
					"L2TPList",
					"notPopUps",
					"serverMgmt",
					"deviceReboot",
					"configMgmt",
					"sysUpdate",
					"productLicense",
					"NetShareManage",
					"FtpServer",
					"ShareAccountList",
					"ACElink",
					"iptv",
					"RAISECOM",
//					"modelchange",
					];
				var urlNames   = getUrlNames();
				variables      = variables.concat(urlNames);
				var result     = Eval.doEval(jsStr, variables);
				var isSuccess  = result['isSuccessful'];
				if(isSuccess){
					result["data"].modelchange = '1';
					result["data"].doWMCmanagement = '1';
					result["data"].apMacFilter = '1';
					result["data"].ACElink = '1';
					result["data"].exchangeConfig_telecom = '0';
					result["data"].AWIFI = '1';
					
					callback(result["data"]);
				}else{
					callback({})
				}
			}
		});
	}
	/**
	 * 初始化配置文件
	 * @author JeremyZhang
	 * @date   2016-11-24
	 * @return {[type]}   [description]
	 */
	function initConfig(){
		getSettings(function(settings){
			if(Object.keys(settings).length !== 0){
				var Config = require('P_config/config');
				for(var key in settings){
					Config[key] = settings[key];
					
				}
			}
		});
	}
	module.exports = {
		initConfig : initConfig
	}
});
