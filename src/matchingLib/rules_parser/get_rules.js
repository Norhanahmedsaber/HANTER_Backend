"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getRules;
var _jsYaml = _interopRequireDefault(require("js-yaml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getRules(rules) {
  var parsedRules = [];
  rules.forEach(function (element) {
    parsedRules.push(_jsYaml["default"].load(element));
  });
  return parsedRules;
}