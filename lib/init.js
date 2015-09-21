var fs      = require('fs');
var path    = require('path');
var through = require('through2');
var vfs     = require('vinyl-fs');

module.exports = function() {
  var _this = this;
  var options = this.options;

  // Compile the template to be used
  var handlebars = options.handlebars || require('handlebars');
  var fileData = fs.readFileSync(options.template);
  this.template = handlebars.compile(fileData.toString(), { noEscape: true });

  // Create destination folder if needed
  if (options.dest && !fs.existsSync(options.dest)) {
    fs.mkdirSync(options.dest);
  }

  // If options.src is set, it's used as the source for a stream of files
  if (options.src) {
    var stream = vfs.src(options.src, {base: options.base}).pipe(transform());
    return stream;
  }
  // Otherwise, assume we're already in a stream of files
  else {
    return transform();
  }

  function transform() {
    return through.obj(function(file, enc, cb) {
      _this.parse(file, function(err, data) {
        // Change the extension of the incoming file to .html, and replace the Markdown contents with rendered HTML
        var ext = path.extname(file.path);
        file.path = file.path.replace(new RegExp(ext+'$'), '.html');
        file.contents = new Buffer(_this.build(data));

        // Write new file to disk if necessary
        if (options.dest) {
          var filePath = path.join(options.dest, path.basename(file.path));
          fs.writeFileSync(filePath, file.contents.toString());
        }

        cb(null, file);
      });
    });
  }
}
