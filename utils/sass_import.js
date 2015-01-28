var fs = require('fs');

/*
  If file contains @import
    Loop files contents
      collect imports
      find file
      recurse
  Else return files path
  
*/

var SassImport = function (target) {
  this.paths = [];
  this.target = target;
  this.pwd = this._get_pwd(target);
  
  this._collect_from(this.target, this.pwd);
  return this.paths;
};

SassImport.prototype._collect_from = function (path, pwd) {
  var data = fs.readFileSync(path, 'utf8');
  this._read_data(data, pwd);
};

SassImport.prototype._read_data = function (data, pwd) {
  data = data.split("\n");
  for (i in data) {
    var line = data[i];
    if (this._is_import(line)) {
      path = this._get_path(line);
      path = pwd + path;
      
      if (this._has_imports(path)) {
        current_pwd = this._get_pwd(path);
        this._collect_from(path, current_pwd);
      } else {
        this.paths.push(path);
      }
    }
  }
};

SassImport.prototype._is_import = function (str) {
  return /^@import/.test(str);
};

SassImport.prototype._has_imports = function (path) {
  var data = fs.readFileSync(path, 'utf8');
  return /@import/.test(data);
};

SassImport.prototype._get_path = function (str) {
  return /'(.+)'/.exec(str)[1];
};

SassImport.prototype._get_pwd = function (str) {
  return /(.+\/)/.exec(str)[1];
};

module.exports = SassImport;