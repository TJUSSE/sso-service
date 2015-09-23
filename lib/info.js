var request = require('request');
var parseString = require('xml2js').parseString;
var yaml = require('js-yaml');
var fs = require('fs');

var fieldStudent = yaml.safeLoad(fs.readFileSync('./res/studentfields.yaml'));
var fieldTeacher = yaml.safeLoad(fs.readFileSync('./res/teacherfields.yaml'));

var info = {

  getTeacherInfo: function (iPlanetDirectoryPro, callback) {
    request.get({
      url: 'http://rs.tongji.edu.cn/epstar/app/getxml.jsp?mainobj=HRMS/JZGJBXXZXT/JZGST/BZLJZGST/V_JZG_JBXX_BZL',
      headers: {
        cookie: 'iPlanetDirectoryPro=' + encodeURIComponent(iPlanetDirectoryPro)
      },
      timeout: 8000
    }, function (err, response, body) {
      if (err) {
        return callback(new Error('接口错误 (err:t.1)'));
      }
      parseString(body, function (err, data) {
        if (err) {
          // 可能是 iPlanetDirectoryPro 无效
          return callback(new Error('接口错误 (err:t.2)'));
        }
        try {
          var info = {};
          var field, value;
          for (field in data.document.record[0]) {
            value = data.document.record[0][field][0];
            if (fieldTeacher[field] !== undefined) {
              info[fieldTeacher[field]] = value;
            }
          }
          if (info.id === undefined) {
            return callback(new Error('接口错误 (err:t.3)'));
          }
          // post process
          info.type = 'faculty';
          // 性别去除「性」
          if (info.gender) { info.gender = info.gender.replace(/性/, ''); }
          callback(null, info);
        } catch (err) {
          return callback(new Error('接口错误 (err:t.4)'));
        }
      });
    });
  },

  getStudentInfo: function (iPlanetDirectoryPro, callback) {
    request.get({
      url: 'http://xg.tongji.edu.cn/epstar/app/getxml.jsp?mainobj=SWMS/XSJBXX/T_XSJBXX_XSJBB',
      headers: {
        cookie: 'iPlanetDirectoryPro=' + encodeURIComponent(iPlanetDirectoryPro)
      },
      timeout: 8000
    }, function (err, response, body) {
      if (err) {
        return callback(new Error('接口错误 (err:s.1)'));
      }
      parseString(body, function (err, data) {
        if (err) {
          // 可能是 iPlanetDirectoryPro 无效
          return callback(new Error('接口错误 (err:s.2)'));
        }
        try {
          var info = {};
          var field, value;
          for (field in data.document.record[0]) {
            value = data.document.record[0][field][0];
            if (fieldStudent[field] !== undefined) {
              info[fieldStudent[field]] = value;
            }
          }
          if (info.id === undefined) {
            return callback(new Error('接口错误 (err:s.3)'));
          }
          // post process
          info.type = 'student';
          // 专业信息去除 (xxxx年)
          if (info.major) { info.major = info.major.replace(/\(\d+年\)/, ''); }
          // 年级信息转换为数字
          if (info.grade) { info.grade = parseInt(info.grade, 10); }
          // 生日信息去除时间
          if (info.birth) { info.birth = info.birth.match(/^\d{4}-\d{2}-\d{2}/)[0]; }
          callback(null, info);
        } catch (err) {
          return callback(new Error('接口错误 (err:s.4)'));
        }
      });
    });
  }
};

module.exports = info;
