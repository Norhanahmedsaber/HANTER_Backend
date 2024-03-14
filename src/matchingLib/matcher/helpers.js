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
    if (_typeof(childs[key]) == 'object') {
      clearMeta(childs[key], metaVariables);
    } else if (typeof childs[key] == 'string') {
      delete metaVariables[key];
    }
    delete childs[key];
  }
}