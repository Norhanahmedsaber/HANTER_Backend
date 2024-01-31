"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = hanter;
var _matcher = _interopRequireDefault(require("./matcher/matcher.js"));
var _parser = _interopRequireDefault(require("./parser/parser.js"));
var _file_traverser = _interopRequireDefault(require("./file_traverser/file_traverser.js"));
var _extractor = _interopRequireDefault(require("./extractor/extractor.js"));
var _parsingconfig = _interopRequireDefault(require("./utils/parsingconfig.js"));
var _get_rules_playground = _interopRequireDefault(require("./rules_parser/get_rules_playground.js"));
var _rules_parser = _interopRequireDefault(require("./rules_parser/rules_parser.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function hanter(source, rule) {
  var ruleAsObject = (0, _get_rules_playground["default"])(rule);
  ruleAsObject = (0, _rules_parser["default"])(ruleAsObject);
  var reports = {
    reports: []
  };
  (0, _matcher["default"])({
    name: "playground",
    ast: (0, _parser["default"])(source)
  }, [ruleAsObject], reports);
  if (reports.reports.length > 0) {
    var _iterator = _createForOfIteratorHelper(reports.reports),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var report = _step.value;
        report.message = ruleAsObject.message;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return reports.reports;
  //report(Errors.error1)
}