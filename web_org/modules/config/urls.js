define({
	/*
		菜单列表
	 */
	"menus" : {
		"configWizard" : {
			"pos"   : "0",
			"title" : "配置向导",
			"link"  : "#/config_wizard"
		},
		"systemWatcher" : {
			"pos"   : "1",
			"title" : "系统监控",
			"link"  : "#/system_watcher"
		},
		"network"   : {
			"pos"   : "2",
			"title" : "网络配置",
			"link"  : "#/network_config"
		},
		"wifiConfig" : {
			"pos"   : "3",
			"title" : "无线扩展",
			"link"  : "#/wifi_config"
		},
		"userManage" : {
			"pos"   : "4",
			"title" : "用户管理",
			"link"  : "#/user_management"
		},
		"behaviorManage" : {
			"pos"   : "5",
			"title" : "行为管理",
			"link"  : "#/behavior_management"
		},
		"trafficManage" : {
			"pos"   : "6",
			"title" : "流量管理",
			"link"  : "#/traffic_management"
		},
		"firewall" : {
			"pos"   : "7",
			"title" : "防火墙",
			"link"  : "#/firewall"
		},
		"VPN" : {
			"pos"   : "8",
			"title" : "VPN配置",
			"link"  : "#/VPN"
		},
		"systemObj" : {
			"pos"   : "9",
			"title" : "系统对象",
			"link"  : "#/system_object"
		},
		"systemConfig" : {
			"pos"   : "10",
			"title" : "系统配置",
			"link"  : "#/system_config"
		},
		"demo" : {
			"pos"   : "10",
			"title" : "测试页面",
			"link"  : "#/demo"
		}
	},
	/*
		页面列表
	 */
	"urls" : {
		/*
			配置向导 菜单
		 */
		// 配置向导
		"configWizard" : {
			"menu"  : "configWizard",
			"title" : "配置向导",
			"link"  : "/config_wizard",
		        "func"  : doConfigWizard
		},

		/*
			系统监控 菜单
		 */
		// 系统状态
		"systemState" : {
			"menu"  : "systemWatcher",
			"title" : "系统状态",
			"link"  : "/system_state",
			"func"  : doSystemState
		},
		// 报警统计
		"warningStatistics" : {
			"menu"  : "systemWatcher",
			"title" : "报警统计",
			"link"  : "/warning_statistics",
			"func"  : doWarningStatistics
		},
		// 流量监控
		"trafficWatcher" : {
			"menu"  : "systemWatcher",
			"title" : "流量监控",
			"link"  : "/traffic_watcher",
			"func"  : doTrafficWatcher
		},
		// 站点日志
		"websiteLog" : {
			"menu"  : "systemWatcher",
			"title" : "站点日志",
			"link"  : "/website_log",
			"func"  : doWebsiteLog
		},
		// 审计日志
		"auditLog" : {
			"menu"  : "systemWatcher",
			"title" : "审计日志",
			"link"  : "/audit_log",
			"func"  : doAuditLog
		},

		/*
			网络配置 菜单
		 */
		// 系统模式
		"systemMode" : {
			"menu"  : "network",
			"title" : "系统模式",
			"link"  : "/system_mode",
			"func"  : doSystemMode
		},
		// 外网配置
		"WANConfig" : {
			"menu"  : "network",
			"title" : "外网配置",
			"link"  : "/WAN_config",
			"func"  : doWANConfig
		},
		// 内网配置
		"LanConfig" : {
			"menu"  : "network",
			"title" : "内网配置",
			"link"  : "/LAN_config",
			"func"  : doLANConfig
		},
		// DHCP服务
		"DHCPServer" : {
			"menu"  : "network",
			"title" : "DHCP服务",
			"link"  : "/DHCP_server",
			"func"  : doDHCPServer
		},
		// 端口映射
		"portMapping" : {
			"menu"  : "network",
			"title" : "端口映射",
			"link"  : "/port_mapping",
			"func"  : doPortMapping
		},
		// 路由配置
		"routerConfig" : {
			"menu"  : "network",
			"title" : "路由配置",
			"link"  : "/router_config",
			"func"  : doRouterConfig
		},
		// 动态域名
		"DDNS" : {
			"menu"  : "network",
			"title" : "动态域名",
			"link"  : "/DDNS",
			"func"  : doDDNS
		},
		// 交换配置
		"exchangeConfig" : {
			"menu"  : "network",
			"title" : "交换配置",
			"link"  : "/exchange_config",
			"func"  : doExchangeConfig
		},
		// 交换配置
		"exchangeConfig_telecom" : {
			"menu"  : "network",
			"title" : "端口vlan",
			"link"  : "/exchange_config_telecom",
			"func"  : doExchangeConfig_telecom
		},
		// 网络共享
		"NetShareManage" : {
			"menu"  : "network",
			"title" : "网络共享",
			"link"  : "/network_sharing",
			"func"  : doNetworkSharing
		},
		

		/*
			无线配置 菜单
		 */
		//网络名称
		"networkName" : {
			"menu"  : "wifiConfig",
			"title" : "网络名称",
			"link"  : "/network_name",
			"func"  : doNetworkName
		},
		//mac地址过滤
		"apMacFilter" : {
			"menu"  : "wifiConfig",
			"title" : "MAC地址过滤",
			"link"  : "/apmac_filter",
			"func"  : doApMacFilter
		},
		// 分布图
		"distribution" : {
			"menu"  : "wifiConfig",
			"title" : "分布图",
			"link"  : "/distribution",
			"func"  : doDistribution
		},
		// 设备管理
		"equipmentManage" : {
			"menu"  : "wifiConfig",
			"title" : "设备管理",
			"link"  : "/equipment_management",
			"func"  : doEqManagement
		},
		// 无线配置
		"wifiConfig" : {
			"menu"  : "wifiConfig",
			"title" : "无线配置",
			"link"  : "/wifi_config",
			"func"  : doWifiConfig
		},
		// 射频模板
		"RFTemplate" : {
			"menu"  : "wifiConfig",
			"title" : "射频模板",
			"link"  : "/RF_template",
			"func"  : doRFTemplate
		},
		// WDS模板
		"WDSTemplate" : {
			"menu"  : "wifiConfig",
			"title" : "WDS模板",
			"link"  : "/WDS_template",
			"func"  : doWDSTemplate
		},
		// MESH模板
		"MESFTemplate" : {
			"menu"  : "wifiConfig",
			"title" : "MESH模板",
			"link"  : "/MESH_template",
			"func"  : doMESHTemplate
		},
		// 负载均衡
		"loadBalance" : {
			"menu"  : "wifiConfig",
			"title" : "负载均衡",
			"link"  : "/load_balance",
			"func"  : doLoadBalancing
		},
		// 软件管理
		"softwareManage" : {
			"menu"  : "wifiConfig",
			"title" : "软件管理",
			"link"  : "/software_manage",
			"func"  : doSoftwareManagement
		},
		// 无线MAC过滤
		"MACFilter" : {
			"menu"  : "wifiConfig",
			"title" : "无线MAC过滤",
			"link"  : "/MAC_filter",
			"func"  : doWifiMACFilter
		},
		// ACElink
		"ACElink" : {
			"menu"  : "wifiConfig",
			"title" : "Elink管理",
			"link"  : "/ACElink",
			"func"  : doACElink
		},
        // AWIFI
		"AWIFI" : {
			"menu"  : "wifiConfig",
			"title" : "aWiFi管理",
			"link"  : "/aWiFi",
			"func"  : doAWIFI
		},
		/*
			用户管理 菜单
		 */
		// 组织成员
		"organizeMember" : {
			"menu"  : "userManage",
			"title" : "组织成员",
			"link"  : "/organize_member",
			"func"  : doPeopleOrganize
		},
		// 用户状态
		"userState" : {
			"menu"  : "userManage",
			"title" : "用户状态",
			"link"  : "/user_state",
			"func"  : doUserState
		},
		// 用户认证
		"userAuth" : {
			"menu"  : "userManage",
			"title" : "用户认证",
			"link"  : "/user_authentication",
			"func"  : doUserAuthentication
		},
		// 黑名单
		"blackList" : {
			"menu"  : "userManage",
			"title" : "黑名单",
			"link"  : "/black_list",
			"func"  : doBlackList
		},

		/*
			行为管理 菜单
		 */
		// 行为管理
		"behaviorManage" : {
			"menu"  : "behaviorManage",
			"title" : "行为管理",
			"link"  : "/behavior_management",
			"func"  : doBehaviorManagement
		},
		// 域名过滤
		"domainFilter" : {
			"menu"  : "behaviorManage",
			"title" : "域名过滤",
			"link"  : "/domain_filter",
			"func"  : doDomainNameFilter
		},
		// 白名单
		"whiteList" : {
			"menu"  : "behaviorManage",
			"title" : "白名单",
			"link"  : "/white_list",
			"func"  : doWhiteList
		},
		// 电子通告
		"electroReport" : {
			"menu"  : "behaviorManage",
			"title" : "电子通告",
			"link"  : "/electro_report",
			"func"  : doElectroReport
		},
		// 行为审计
		"behaviorAudit" : {
			"menu"  : "behaviorManage",
			"title" : "行为审计",
			"link"  : "/behavior_audit",
			"func"  : doBehaviorAudit
		},

		/*
			流量管理 菜单
		 */
		// 应用优先
		"appPriority" : {
			"menu"  : "trafficManage",
			"title" : "应用优先",
			"link"  : "/app_priority",
			"func"  : doAppPriority
		},
		// 流量管理
		"trafficManage" : {
			"menu"  : "trafficManage",
			"title" : "流量管理",
			"link"  : "/traffic_management",
			"func"  : doTrafficManagement
		},

		/*
			防火墙 菜单
		 */
		// 访问控制
		"visitControl" : {
			"menu"  : "firewall",
			"title" : "访问控制",
			"link"  : "/visit_control",
			"func"  : doVisitControl
		},
		// 连接控制
		"connectControl" : {
			"menu"  : "firewall",
			"title" : "连接控制",
			"link"  : "/connect_control",
			"func"  : doConnectControl
		},
		// 攻击防护
		"attackProection" : {
			"menu"  : "firewall",
			"title" : "攻击防护",
			"link"  : "/attack_proection",
			"func"  : doAttackProtection
		},

		/*
			VPN配置 菜单
		 */
		// IPSec
		"IPSec" : {
			"menu"  : "VPN",
			"title" : "IPSec",
			"link"  : "/IPSec",
			"func"  : doIPSec
		},
		// PPTPL2TP
		"PPTPL2TP" : {
			"menu"  : "VPN",
			"title" : "PPTP/L2TP",
			"link"  : "/PPTP/L2TP",
			"func"  : doPPTPL2TP
		},
		// OpenVPN
		"OpenVPN" : {
			"menu"  : "VPN",
			"title" : "OpenVPN",
			"link"  : "/OpenVPN",
			"func"  : doOpenVPN
		},

		/*
			系统对象 菜单
		 */
		// 时间计划
		"timePlan" : {
			"menu"  : "systemObj",
			"title" : "时间计划",
			"link"  : "/time_plan",
			"func"  : doTimeSked
		},
		// 地址组
		"addrGroup" : {
			"menu"  : "systemObj",
			"title" : "地址组",
			"link"  : "/addrGroup",
			"func"  : doAddressGroup
		},		
		// 网络服务
		"networkServer" : {
			"menu"  : "systemObj",
			"title" : "网络服务",
			"link"  : "/network_server",
			"func"  : doNetworkServer
		},
		// 定制页面
		"pageDIY" : {
			"menu"  : "systemObj",
			"title" : "定制页面",
			"link"  : "/page_DIY",
			"func"  : doDIYpage
		},
		// 域名库
		"domainBase" : {
			"menu"  : "systemObj",
			"title" : "域名库",
			"link"  : "/domain_base",
			"func"  : doDomainNameBase
		},

		/*
			系统配置 菜单
		 */
		// 网管策略
		"networkManageStrategy" : {
			"menu"  : "systemConfig",
			"title" : "网管策略",
			"link"  : "/network_manage_strategy",
			"func"  : doNetworkManagementStrategy
		},
		// 时钟管理
		"clockManage" : {
			"menu"  : "systemConfig",
			"title" : "时钟管理",
			"link"  : "/clock_management",
			"func"  : doClockManagement
		},
		// 系统维护
		"systemMaintenance" : {
			"menu"  : "systemConfig",
			"title" : "系统维护",
			"link"  : "/system_maintenance",
			"func"  : doSystemSafeguard
		},
		// 网络工具
		"networkTools" : {
			"menu"  : "systemConfig",
			"title" : "网络工具",
			"link"  : "/network_tools",
			"func"  : doNetworkTools
		},
		// 系统日志
		"systemLog" : {
			"menu"  : "systemConfig",
			"title" : "系统日志",
			"link"  : "/system_log",
			"func"  : doSystemLog
		},
		// 计划任务
		"taskPlan" : {
			"menu"  : "systemConfig",
			"title" : "计划任务",
			"link"  : "/task_plan",
			"func"  : doTaskPlan
		},
		
		//模式切换
		"modelchange" : {
			"menu"  : "systemConfig",
			"title" : "模式切换",
			"link"  : "/model_change",
			"func"  : doModelChange
		},
		"doWMCmanagement" : {
			"menu"  : "systemConfig",
			"title" : "集中管理",
			"link"  : "/WMCmanagement",
			"func"  : doWMCmanagement
		}
		
		
	},
	"defaultUrl" : 'configWizard'
});
