var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');

var SESSION_SERVICE_BODY = fs.readFileSync('./res/sessionservice.xml').toString();

var SSO_URL = null;

var sso = {
  getSessionIdentity: function (iPlanetDirectoryPro, callback) {
    // 1. send request
    request.post({
      url: SSO_URL + '/amserver/sessionservice',
      header: {
        'Content-Type': 'text/xml; charset=UTF-8'
      },
      body: SESSION_SERVICE_BODY.replace('{{session}}', iPlanetDirectoryPro)
    }, function (err, res, xml) {
      if (err) {
        callback(err);
        return;
      }

      // 2. parse response
      xml2js.parseString(xml, function (err, result) {
        if (err) {
          callback(err);
          return;
        }
        var data;
        try {
          data = result.ResponseSet.Response[0];
        } catch (e) {
          warn('Invalid SSO response [1]: %s', xml);
          callback(new Error('Invalid response data from SSO server.'));
          return;
        }

        // 3. parse responseSet
        xml2js.parseString(data, function (err, result) {
          if (err) {
            callback(err);
            return;
          }

          var response;
          try {
            response = result.SessionResponse.GetSession[0];
          } catch (e) {
            warn('Invalid SSO response [2]: %s', xml);
            callback(new Error('Invalid response data from SSO server.'));
            return;
          }

          if (response === null || response === undefined) {
            warn('Invalid SSO response [3]: %s', xml);
            callback(new Error('Invalid response data from SSO server.'));
            return;
          }

          // SSO 返回 Exception，是 SESSION_ID 格式有误，或者 SESSION_ID 不存在
          if (response.Exception) {
            callback(new Error('Invalid session'));
            return;
          }

          // SSO 没有返回 Exception，则有 Session 对象
          var sessionData = response.Session[0];
          if (sessionData === null || sessionData === undefined) {
            warn('Invalid SSO response [4]: %s', xml);
            callback(new Error('Invalid response data from SSO server.'));
            return;
          }

          // Session 对象 state 不是 valid（是什么情况呢？）
          if (sessionData.$.state !== 'valid') {
            callback(new Error('Invalid session'));
            return;
          }

          // 转换属性
          var propertySet = {};
          sessionData.Property.forEach(function (property) {
            propertySet[property.$.name] = property.$.value;
          });

          // 没有 UserId 字段
          if (!propertySet.hasOwnProperty('UserId')) {
            warn('Invalid SSO response [5]: %s', xml);
            callback(new Error('Invalid response data from SSO server.'));
            return;
          }

          // 返回所有属性
          callback(null, propertySet);
        });
      });
    });
  }
};

module.exports = function (ssoUrl) {
  SSO_URL = ssoUrl;
  return sso;
};