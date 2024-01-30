"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseConfig;
var _extractor = _interopRequireDefault(require("../extractor/extractor.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function parseConfig(config) {
  return JSON.parse(config);
}