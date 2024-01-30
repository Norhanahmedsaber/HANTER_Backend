"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getRules;
var _jsYaml = _interopRequireDefault(require("js-yaml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getRules(rules) {
  var rulesJson = [];
  rules.forEach(function (rule) {
    var object = _jsYaml["default"].load(rule);
    rulesJson.push(object);
  });
  return rulesJson;
}