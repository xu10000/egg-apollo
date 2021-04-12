'use strict';
const request = require('syncrequest');
const unexpectKeys = [ 'pkg', 'siteFile', 'watcher', 'i18n', 'security', 'bodyParser', 'httpclient', 'session', 'helper', 'jsonp', 'onerror', 'customLogger', 'schedule', 'dump', 'confusedConfigurations', 'notfound', 'appMiddlewares', 'multipartParseOptions', 'meta', 'workerStartTimeout', 'serverTimeout', 'onClientError', 'appMiddleware', 'HOME', 'baseDir', 'hostHeaders', 'ipHeaders', 'protocolHeaders', 'maxIpsCount', 'cookies', 'keys', 'view', 'cookies', 'validate', 'middleware', 'proxy', 'tracer', 'rundir', 'development', 'multipart', 'logrotator', 'maxProxyCount', 'static', 'clusterClient' ];
const unexpectLocalKeys = [ 'env', 'name', 'logger', 'coreMiddleware', 'cluster', 'apollo', 'coreMiddlewares', 'pkg', 'siteFile', 'watcher', 'i18n', 'security', 'bodyParser', 'httpclient', 'session', 'helper', 'jsonp', 'onerror', 'customLogger', 'schedule', 'dump', 'confusedConfigurations', 'notfound', 'appMiddlewares', 'multipartParseOptions', 'meta', 'workerStartTimeout', 'serverTimeout', 'onClientError', 'appMiddleware', 'HOME', 'baseDir', 'hostHeaders', 'ipHeaders', 'protocolHeaders', 'maxIpsCount', 'cookies', 'keys', 'view', 'cookies', 'validate', 'middleware', 'proxy', 'tracer', 'rundir', 'development', 'multipart', 'logrotator', 'maxProxyCount', 'static', 'clusterClient' ];

module.exports = {
  getReplaceData(app, data) {
    // change key-value to json

    for (const key in data) {
      try {
        // data[key] = data[key].replace(/\"\{/g, '{')
        //   .replace(/\}\"/g, '}')
        //   .replace(/\"\[/g, '[')
        //   .replace(/\]\"/g, ']');
        // console.log('\n----xxxxxxxxkey ', key);

        data[key] = JSON.parse(data[key]);
      } catch (err) {
        app.logger.error(`apollo远程配置解析key-value出错：key: ${key}, data[key] ${data[key]}`);
        throw err;
      }
    }

    return data;
  },
  // 将配置转换成apollo要的key-value格式并打印出来
  printKeyValue(app, config) {
    app.logger.info('   ==================  begin print merged apollo keyValue  ====================');
    for (const key in config) {
      if (unexpectKeys.includes(key)) {
        continue;
      }
      app.logger.info(`---------key: ${key}\n---------value: ${JSON.stringify(config[key])}`);
    }
    app.logger.info('   ==================  end print merged apollo  keyValue  ====================\n\n');
  },
  printLocalKeyValue(localConfig) {
    console.warn('\n\n           ==================  begin print local keyValue====================\n');
    for (const key in localConfig) {
      if (unexpectLocalKeys.includes(key)) {
        continue;
      }
      console.warn(`${key}=${JSON.stringify(localConfig[key])}`);
    }
    console.warn('\n           ==================  end print local  keyValue  ====================\n\n');
  },
  mergeConfig(app, printKeyValue, remoteConfig) {

    for (const attr in remoteConfig) {
      app.config[attr] = remoteConfig[attr];
    }
    // 日志输出合并后的config
    app.logger.debug('获取远程配置成功 '); // ${JSON.stringify(app.config.redis)}
    if (printKeyValue) {
      this.printKeyValue(app, app.config);
    }
    return app.config;
  },
  getRemoteConfig(app) {
    const { apolloArr } = app.config;
    for(let i = 0; i < apolloArr.length; i++) {
      try {
        const apollo = apolloArr[i]
        if (!apollo) {
          throw new Error('-----------配置文件没有app.config.apolloArr');
        }
        
        if (!apollo.open) {
          app.logger.info('\n-----------apollo.open not true, config only from local~~~~~');
          return;
        }
        // 同步请求
        // const result = request.sync('https://www.baidu.com/');
        const { url, namespaceName, clusterName, appId } = apollo;
        // const ip = app.config.cluster.listen.hostname;
        const result = request.sync(`${url}/${appId}/${clusterName}/${namespaceName}`, {
          timeout: 1500,
        });
        if (!result.response || result.response.statusCode !== 200 || !result.response.body) {
          throw new Error('----------请求远程配置失败 ', apollo);
        }
  
        if (result) {
          app.logger.info('\n-----------get remote config success~~~~~');
        }
  
        // console.log('\n----xxxxxxxxdatabody ', data);
  
        const remoteConfig = this.getReplaceData(app, JSON.parse(result.response.body));
        // !!! 合并本地和远程的配置
        return this.mergeConfig(app, apollo.printKeyValue, remoteConfig);
      } catch (err) {
        app.logger.error('----------in catch 请求远程配置失败,如果是数组则请求下一个 ', err);
        if(i === apolloArr.length-1) {
          process.exit();
        }
      }
    }

  },
};
