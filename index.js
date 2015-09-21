var path = require('path');

function Super(options) {
  this.options = options;
  this.adapters = {};
  this.tree = [];
}

Super.prototype = {
  init: require('./lib/init'),
  parse: require('./lib/parse'),
  build: require('./lib/build'),
  adapter: require('./lib/adapter')
}

module.exports = function(options) {
  var s = new Super(options);
  s.adapter('sass', require(path.join(__dirname, 'adapters', 'sass')));
  s.adapter('js', require(path.join(__dirname, 'adapters', 'js')));
  s.init();
  return s.init();
}
