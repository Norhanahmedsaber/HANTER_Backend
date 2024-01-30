"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getRules;
var _jsYaml = _interopRequireDefault(require("js-yaml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getRules(rule) {
  return _jsYaml["default"].load(rule);
}