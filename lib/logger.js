var winston = require('winston');
var logging;

var logger = {
  expose: function (obj) {
    ['log', 'warn', 'error', 'info', 'debug'].forEach(function (t) {
      obj[t] = logging[t];
    });
  }
};

var init = function (stdLogLevel) {
  logging = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        name: 'error-file',
        filename: 'log-error.log',
        level: 'error',
        timestamp: true
      }),
      new (winston.transports.File)({
        name: 'log-file',
        filename: 'log-all.log',
        level: 'debug',
        timestamp: true
      }),
      new (winston.transports.Console)({
        colorize: true,
        timestamp: true,
        level: stdLogLevel
      }),
    ],
    exitOnError: false
  });

  return logger;
};

module.exports = init;
