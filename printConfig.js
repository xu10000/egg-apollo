const lib = require('./lib');
const  env =  process.argv.splice(2)[0];
const config = require(`../../../config/config.${env}.js`)({
    name: 'disable_name',
    HOME: 'disable_HOME'
});

lib.printLocalKeyValue(config);
