"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extract;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function extract(filePath) {
  try {
    var data = _fs["default"].readFileSync(filePath, 'utf-8');
    return data;
  } catch (err) {
    // our error
    console.log(err);
  }
}