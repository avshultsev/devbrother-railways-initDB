const http = require('http');

module.exports = (options, json) => {
  return new Promise(resolve => {
    const req = http.request(options, resolve);
    req.on('error', console.log);
    req.write(json);
    req.end();
  });
};