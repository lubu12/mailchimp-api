const { MongoDBOps } = require('mongodb-ops');
const serverConfig = require('./server-config');

// Add functions to String prototype
//
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.titleCase = function() {
  let splitStrArray = this.toLowerCase().split(" ");
  for (let i = 0; i < splitStrArray.length; ++i) {
    splitStrArray[i] = splitStrArray[i].charAt(0).toUpperCase() + splitStrArray[i].slice(1);
  }
  return splitStrArray.join(" ");
}

// initialize MC Audience Ids and Google Analytic ViewIds
serverConfig.SiteKey.forEach(key => serverConfig.MCAudienceIds[key] = process.env[serverConfig.MCAudienceIds[key]]);
serverConfig.SiteKey.forEach(key => serverConfig.GAViewIds[key] = process.env[serverConfig.GAViewIds[key]]);

// catching signals and clean up connections
// note: SIGKILL is not working at linux environment.
//
['SIGHUP', 'SIGINT', 'SIGILL', 'SIGABRT', 'SIGPIPE', 'SIGBREAK',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM', 'exit'
].forEach(signal => {
  process.on(signal, () => {
    MongoDBOps.closeDBConn()
    .then(() => {
      console.log(`Exit ${signal} - MongoDB disconnected on app termination`);
      process.exit(0);
    })
    .catch(err => {
      console.log(`Exit ${signal} - ${err.message}`);
      process.exit(1);
    });
  });
});