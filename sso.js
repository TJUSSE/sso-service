// load configurations
var configLoader = require('./lib/configLoader.js');
var config = configLoader.loadYaml('config');

// logger
var logger = require('./lib/logger.js')(config.stdLogLevel);
logger.expose(GLOBAL);

// sso API
var sso = require('./lib/sso.js')(config.sso);

// REST server
var express = require('express');
var app = express();

// GET /session/attributes：验证一个 Session 是否有效并获取属性
app.get('/session/attributes', function (req, res) {
  if (!req.query.sessionId) {
    res.json({err: 'Empty session id'});
    return;
  }
  sso.getSessionIdentity(req.query.sessionId, function (err, properties) {
    if (err) {
      res.json({err: err.message});
      return;
    }
    res.json(properties);
  });
});

app.listen(config.listen.port, config.listen.host, function () {
  debug('SSO Service is listening at %s:%s', config.listen.host, config.listen.port);
});