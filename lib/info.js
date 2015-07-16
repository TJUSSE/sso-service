var request = require('request');
var cheerio = require('cheerio');

var info = {
  getStudentInfo: function (iPlanetDirectoryPro, callback) {
    request.get({
      url: 'http://xg.tongji.edu.cn/epstar/app/template.jsp?mainobj=SWMS/XSJBXX/T_XSJBXX_XSJBB&tfile=XGMRMB/detail_BDTAG&current.model.id=4si1f4g-ratw0e-f2oedbzc-1-f2of1hgj-6',
      headers: {
        cookie: 'iPlanetDirectoryPro=' + encodeURIComponent(iPlanetDirectoryPro)
      }
    }, function (err, response, body) {
      if (err) {
        return callback(new Error('接口错误'));
      }
      var $ = cheerio.load(body);
      var info = {};
      info.name       = $('#table .tr_fld_v').eq(0).find('td').eq(3).text().trim();
      info.gender     = $('#table .tr_fld_v').eq(2).find('td').eq(1).text().trim();
      info.birth      = $('#table .tr_fld_v').eq(4).find('td').eq(3).text().trim();
      info.idcard     = $('#table .tr_fld_v').eq(5).find('td').eq(3).text().trim();
      info.department = $('#table .tr_fld_v').eq(11).find('td').eq(1).text().trim();
      info.major      = $('#table .tr_fld_v').eq(11).find('td').eq(5).text().trim().replace(/\(\d+年\)/, '');
      info.grade      = $('#table .tr_fld_v').eq(12).find('td').eq(3).text().trim();
      info.grade      = parseInt(info.grade, 10);
      info.type       = $('#table .tr_fld_v').eq(14).find('td').eq(3).text().trim(); // 本科？

      callback(null, info);
    });
  }
};

module.exports = info;