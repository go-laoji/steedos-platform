
require('dotenv-flow').config({path: process.cwd()});


module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: process.env.STEEDOS_LOG_LEVEL || "warn",

	// Called after broker started.
	started(broker) {

		// 获取 Steedos 版本
		let edition = 'ce';

		if(process.env.STEEDOS_EDITION){
			edition = process.env.STEEDOS_EDITION
		}else{
			if(process.env.STEEDOS_TENANT_ENABLE_SAAS === 'true'){
				edition = 'cloud'
			}else if(process.env.STEEDOS_LICENSE){
				edition = 'ee'
			}
		}

		switch (edition) {
			case "ce":
				console.log("🎉 欢迎使用 Steedos 社区版！");
				break;
			case "ee":
				console.log("🎉 欢迎使用 Steedos 企业版！");
				break;
			case "cloud":
				console.log("🎉 欢迎使用 Steedos Cloud 版！");
				break;
			default:
				console.log("🤔 我们未能识别您启动的版本。");
		}

		if(edition == 'ee' || edition == 'cloud'){
			broker.createService(require("@steedos/service-license"));
		}

		broker.createService(require("@steedos/service-community"));
		
		if(edition == 'ee' || edition == 'cloud'){
			broker.createService(require("@steedos/service-enterprise"));
		}
	},

};