var yaml = require('js-yaml');
var fs = require('fs');

var loader = {
  loadYaml: function (name) {
    return yaml.safeLoad(fs.readFileSync('./config/' + name + '.yml', 'utf8'));
  }
};

module.exports = loader;
