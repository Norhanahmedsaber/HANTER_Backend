"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parse;
var _abstractSyntaxTree = _interopRequireDefault(require("abstract-syntax-tree"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function parse(source) {
  try {
    return _abstractSyntaxTree["default"].parse(source, {
      loc: true
    });
  } catch (err) {
    console.log(err);
  }
}