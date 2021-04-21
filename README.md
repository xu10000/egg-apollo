1. 以下配置不能放apollo配置中心

   ```
   config.cluster
   
   config.logger
   
   config.keys 
   
   config.apollo   
   ```

2. 引入

   ```
   npm install @xu10000/egg-apollo
   ```

3. 使用

   ````
   // 本地配置文件apollo设置
     config.apolloArr = [{
       // 加载远程配置，如果false则仅从本地加载
       open: true,
       // 打印本地和远程merge后的配置
       printKeyValue: true,
       // apollo参数
       url: 'http://x.x.x.x:8080/configfiles/json',
       appId: 'shopping',
       clusterName: 'local',
       namespaceName: 'TEST1.book',
     },{
       // 加载远程配置，如果false则仅从本地加载
       open: true,
       // 打印本地和远程merge后的配置
       printKeyValue: true,
       // apollo参数
       url: 'http://x.x.x.x:8080/configfiles/json',
       appId: 'shopping',
       clusterName: 'local',
       namespaceName: 'TEST1.book',
     }];
   ````
   ```
   // 在项目根目录打印本地配置，用于复制到配置中心
   // env 代表要打印文件的环境， 分为 local test pred prod
   node node_modules/@xu10000/egg-apollo/printConfig.js env
   ```
   ```
   // 在app.js文件的生命周期函数configWillLoad使用
   configWillLoad() {
       // 从远程加载配置
       apollo.getRemoteConfig(this.app);
   }
   ```
   
