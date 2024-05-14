"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argumentsIncludesGeneral = argumentsIncludesGeneral;
exports.clearMeta = clearMeta;
exports.createBlockStatement = createBlockStatement;
exports.noOfnotGeneralArgs = noOfnotGeneralArgs;
exports.statementsIncludesGeneral = statementsIncludesGeneral;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function argumentsIncludesGeneral(args) {
  var found = false;
  args.forEach(function (arg) {
    if (arg.type === "General") {
      found = true;
    }
  });
  return found;
}
function noOfnotGeneralArgs(args) {
  return args.filter(function (x) {
    return x.type !== "General";
  }).length;
}
function createBlockStatement(tree) {
  return {
    type: "BlockStatement",
    body: tree.body,
    start: tree.start,
    end: tree.end,
    range: tree.range,
    loc: tree.loc
  };
}
function statementsIncludesGeneral(statements) {
  var found = false;
  statements.forEach(function (statement) {
    if (statement.type === "General") {
      found = true;
    }
  });
  return found;
}
function clearMeta(childs, metaVariables) {
  for (var _i = 0, _Object$keys = Object.keys(childs); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    if (Array.isArray(childs[key])) {
      var _iterator = _createForOfIteratorHelper(childs[key]),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          clearMeta(child, metaVariables);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    if (_typeof(childs[key]) == 'object') {
      clearMeta(childs[key], metaVariables);
    } else if (typeof childs[key] == 'string') {
      delete metaVariables[key];
    }
    delete childs[key];
  }
}