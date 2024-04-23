"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getDeclarationScope;
var _abstractSyntaxTree = _interopRequireDefault(require("abstract-syntax-tree"));
var _getScope = _interopRequireDefault(require("./getScope"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getDeclarationScope(ast, location, name) {
  var targetScope = {
    start: 0,
    end: 0,
    scope: undefined
  };
  _abstractSyntaxTree["default"].walk(ast, function (node) {
    if (node.type === "VariableDeclarator" && node.id.type === "Identifier" && node.id.name === name) {
      var scope = (0, _getScope["default"])(ast, node.loc.start.line, node.loc.start.column);
      if (location >= scope.start && location <= scope.end) {
        if (targetScope.start === 0 || scope.end - scope.start < targetScope.end - targetScope.start) {
          targetScope.start = scope.start;
          targetScope.end = scope.end;
          targetScope.scope = scope.scope;
        }
      }
    }
  });
  return targetScope;
}