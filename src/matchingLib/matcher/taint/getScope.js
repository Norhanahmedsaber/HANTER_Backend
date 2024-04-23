"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIfInside = checkIfInside;
exports["default"] = getScope;
var _abstractSyntaxTree = _interopRequireDefault(require("abstract-syntax-tree"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getScope(AST, row, col) {
  var start = 0;
  var end = 0;
  var scope = AST;
  var startCondition = false;
  var stopCondition = false;
  _abstractSyntaxTree["default"].walk(AST, function (node) {
    if (startCondition) {
      if (!stopCondition) {
        if (node.type === "BlockStatement") {
          if (checkIfInside(row, col, node.loc.start.line, node.loc.end.line, node.loc.start.column, node.loc.end.column)) {
            start = node.loc.start.line;
            end = node.loc.end.line;
            scope = node;
            var newLoc = getScope(node, row, col);
            if (newLoc.start !== 0) {
              start = newLoc.start;
              end = newLoc.end;
              scope = newLoc.scope;
            }
          } else if (node.loc.start.line > row) {
            stopCondition = true;
          }
        }
      }
    } else {
      startCondition = true;
    }
  });
  return {
    start: start,
    end: end,
    scope: scope
  };
}
function checkIfInside(row, col, scopeRowStart, scopeRowEnd, scopeColStart, scopeColEnd) {
  if (row >= scopeRowStart && row <= scopeRowEnd) {
    if (row == scopeRowStart) {
      if (col < scopeColStart) {
        return false;
      }
    }
    if (row == scopeRowEnd) {
      if (col > scopeColEnd) {
        return false;
      }
    }
    return true;
  }
  return false;
}