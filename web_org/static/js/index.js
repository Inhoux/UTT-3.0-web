window.onload = function(){
	seajs.use('./modules/config/seajsConfig', function(seajsConfig){
		seajsConfig.initSeajsConfig();
		var modules = ['jquery', 'P_static/js/action', 'P_plugin/DemoFunction.js'];
		seajs.use(modules, function(){
			var modules = ['bootstrap_js', 'P_config/initConfig'];
			seajs.use(modules, function(b, InitConfig){
				InitConfig.initConfig();
				seajs.use('P_modules/entry/entry', function(Entry){
					Entry.show();
				});
			});
		});
	});
};



