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
   // 在app.js文件的生命周期函数configWillLoad使用
   configWillLoad() {
       // 打印本地配置，控制台输出的内容可复制到配置中心，避免繁琐的配置
       const localConfig = require('./config/config.local')({
         name: 'disable_name',
         HOME: 'disable_HOME',
       });
       apollo.printLocalKeyValue(localConfig);
       // 从远程加载配置
       apollo.getRemoteConfig(this.app);
   }
   ```

4. 如果配置后不生效，请在配置的对象多加一个app: true, 例子如下：

```
 config.redis = {
    client: {
      port: 6379, // Redis port
      host: '18.162.188.202', // Redis host
      password: '',
      db: 16,
    },
    app: true  // 多增加该字段，添加到配置中心
  };
```

