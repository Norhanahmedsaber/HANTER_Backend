"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getFiles;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _minimatch = require("minimatch");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getFiles(dirPath, _ref) {
  var extensions = _ref.extensions,
    ignoredDirs = _ref.ignoredDirs,
    ignoredPatterns = _ref.ignoredPatterns;
  // get the absolute path for the passed relative path 
  var dirAbsolutePath = getAbsolutePath(dirPath);
  // check if the directory does not exist 
  if (!_fs["default"].existsSync(dirAbsolutePath)) {
    return [];
  }

  // get files/dirs names 
  var files = _fs["default"].readdirSync(dirAbsolutePath);
  var filePaths = [];

  // Adding the full path to each file/dir name
  for (var file in files) {
    // Checks if the file/dir is a directory
    if (_fs["default"].statSync(_path["default"].join(dirAbsolutePath, files[file])).isDirectory()) {
      // Traverses the directoy in a recursive manner
      if (ignoredDirs.includes(_path["default"].basename(files[file]))) {
        continue;
      }
      filePaths = filePaths.concat(getFiles(_path["default"].join(dirPath, files[file]), {
        extensions: extensions,
        ignoredDirs: ignoredDirs
      }));
    } else {
      // Not a directory
      var isValidExtension = extensions.includes(getExtension(files[file]));
      var isIgnoredPattern = isIgnored(_path["default"].join(dirPath, files[file]), ignoredPatterns);
      if (isValidExtension && !isIgnoredPattern) {
        filePaths.push(_path["default"].join(dirPath, files[file]));
      }
    }
  }
  return filePaths;
}
var getAbsolutePath = function getAbsolutePath(dirPath) {
  return _path["default"].resolve(_path["default"].dirname('./'), dirPath);
};
var getExtension = function getExtension(file) {
  return file.split('.').pop();
};
var isIgnored = function isIgnored(file, ignoredPatterns) {
  for (var pattern in ignoredPatterns) {
    if (matchPattern(file, ignoredPatterns[pattern])) {
      return true;
    }
  }
  return false;
};
var matchPattern = function matchPattern(file, pattern) {
  return (0, _minimatch.minimatch)(file, pattern);
};