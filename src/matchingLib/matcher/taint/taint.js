"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _abstractSyntaxTree = _interopRequireWildcard(require("abstract-syntax-tree"));
var _evaluate = _interopRequireDefault(require("../evaluate.js"));
var _matchingAlgorithms = _interopRequireDefault(require("../matchingAlgorithms4.js"));
var _helpers = require("../helpers.js");
var _getScope = _interopRequireWildcard(require("./getScope.js"));
var _getDeclarationScope = _interopRequireDefault(require("./getDeclarationScope.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function matchTaintRule(_ref, rule, reports) {
  var fileName = _ref.name,
    ast = _ref.ast;
  var taints = getSources(ast, rule["pattern-sources"]);
  var sinks = getSinks(rule["pattern-sinks"]);
  // console.log(sinks);
  // console.log(taints)
  propagate(ast, taints);
  // console.log(taints)s
  matchTaint(ast, sinks, taints, reports);
  // console.log(reports);
  // const match = evaluate(logicBlock)
  // if (match){
  //     reports.reports.push( {filepath:fileName, line:match.line, col:match.column, rule_name:rule.id, message: rule.message} )
  // }
}
function matchTaint(ast, sinks, taints, reports) {
  var _iterator = _createForOfIteratorHelper(sinks),
    _step;
  try {
    var _loop = function _loop() {
      var sink = _step.value;
      _abstractSyntaxTree["default"].walk(ast, function (node) {
        if (node.type == "CallExpression") {
          if (node.callee.type == "Identifier" && sink.calleType == "Identifier" && sink.name === node.callee.name) {
            for (var _i = 0, _Object$keys = Object.keys(taints); _i < _Object$keys.length; _i++) {
              var taintName = _Object$keys[_i];
              var _iterator2 = _createForOfIteratorHelper(taints[taintName]),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var taint = _step2.value;
                  var _iterator3 = _createForOfIteratorHelper(node.arguments),
                    _step3;
                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      var arg = _step3.value;
                      if (arg.type === taint.type) {
                        if (arg.type === "Identifier" && arg.name === taintName) {
                          if (!taint.scope || (0, _getScope.checkIfInside)(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                            console.log(arg.loc);
                          }
                        } else if (arg.type === "CallExpression" && arg.callee.type === "Identifier" && arg.callee.name === taintName) {
                          if (!taint.scope || (0, _getScope.checkIfInside)(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                            console.log(arg.loc);
                          }
                        } else if (arg.type === "CallExpression" && arg.callee.type === "MemberExpression" && getMemberExpressionName(arg.callee) === taintName) {
                          if (!taint.scope || (0, _getScope.checkIfInside)(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                            console.log(arg.loc);
                          }
                        } else if (arg.type === "MemberExpression" && getMemberExpressionName(arg) === taintName) {
                          if (!taint.scope || (0, _getScope.checkIfInside)(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                            console.log(arg.loc);
                          }
                        }
                      } else if (arg.type === "ArrayExpression") {} else if (arg.type === "ObjectExpression") {}
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          } else if (node.callee.type == "MemberExpression" && sink.calleType == "MemberExpression" && sink.name === getMemberExpressionName(node.callee)) {}
        }
      });
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function propagate(ast, taints) {
  var _loop2 = function _loop2() {
    var taint = _Object$keys2[_i2];
    track(ast, taints[taint].map(function (t) {
      return _objectSpread({
        name: taint
      }, t);
    }), taints);
  };
  for (var _i2 = 0, _Object$keys2 = Object.keys(taints); _i2 < _Object$keys2.length; _i2++) {
    _loop2();
  }
}
function addTaint(taint, taints) {
  if (!taints[taint.name]) {
    taints[taint.name] = [];
  }
  taints[taint.name].push({
    type: taint.type,
    line: taint.line,
    col: taint.col,
    scope: taint.scope
  });
}
function track(ast, taint, taints) {
  taint.forEach(function (t) {
    var _t$scope, _t$scope2, _t$scope3;
    switch (t.type) {
      case "CallExpression":
        _abstractSyntaxTree["default"].walk((_t$scope = t.scope) !== null && _t$scope !== void 0 && _t$scope.scope ? t.scope.scope : ast, function (node) {
          if (node.type === "VariableDeclarator" && node.init && node.init.type === "CallExpression") {
            if (node.init.callee.type === "Identifier" && node.init.callee.name === t.name) {
              if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                addTaint({
                  name: node.id.name,
                  type: node.id.type,
                  line: node.loc.start.line,
                  col: node.loc.start.column,
                  scope: (0, _getScope["default"])(ast, node.loc.start.line, node.loc.start.column)
                }, taints);
                track(ast, taints[node.id.name].map(function (tt) {
                  return _objectSpread({
                    name: node.id.name
                  }, tt);
                }), taints);
              }
            } else if (node.init.callee.type === "MemberExpression" && getMemberExpressionName(node.init.callee) === t.name) {
              if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                addTaint({
                  name: node.id.name,
                  type: node.id.type,
                  line: node.loc.start.line,
                  col: node.loc.start.column,
                  scope: (0, _getScope["default"])(ast, node.loc.start.line, node.loc.start.column)
                }, taints);
                track(ast, taints[node.id.name].map(function (tt) {
                  return _objectSpread({
                    name: node.id.name
                  }, tt);
                }), taints);
              }
            }
          } else if ((node.type === "AssignmentExpression" || node.type === "AssignmentPattern") && node.right.type === "CallExpression") {
            if (node.right.callee.type === "Identifier" && node.right.callee.name === t.name) {
              if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                addTaint({
                  name: node.left.name,
                  type: node.left.type,
                  line: node.loc.start.line,
                  col: node.loc.start.column,
                  scope: (0, _getDeclarationScope["default"])(ast, node.loc.start.line, node.left.name)
                }, taints);
                track(ast, taints[node.left.name].map(function (tt) {
                  return _objectSpread({
                    name: node.left.name
                  }, tt);
                }), taints);
              }
            } else if (node.right.callee.type === "MemberExpression" && getMemberExpressionName(node.right.callee) === t.name) {
              if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                addTaint({
                  name: node.left.name,
                  type: node.left.type,
                  line: node.loc.start.line,
                  col: node.loc.start.column,
                  scope: (0, _getDeclarationScope["default"])(ast, node.loc.start.line, node.left.name)
                }, taints);
                track(ast, taints[node.left.name].map(function (tt) {
                  return _objectSpread({
                    name: node.left.name
                  }, tt);
                }), taints);
              }
            }
          }
        });
        break;
      case "MemberExpression":
        _abstractSyntaxTree["default"].walk((_t$scope2 = t.scope) !== null && _t$scope2 !== void 0 && _t$scope2.scope ? t.scope.scope : ast, function (node) {
          if (node.type === "VariableDeclarator" && node.init && node.init.type === "MemberExpression" && t.name === getMemberExpressionName(node.init)) {
            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
              addTaint({
                name: node.id.name,
                type: node.id.type,
                line: node.loc.start.line,
                col: node.loc.start.column,
                scope: (0, _getScope["default"])(ast, node.loc.start.line, node.loc.start.column)
              }, taints);
              track(ast, taints[node.id.name].map(function (tt) {
                return _objectSpread({
                  name: node.id.name
                }, tt);
              }), taints);
            }
          } else if ((node.type === "AssignmentExpression" || node.type === "AssignmentPattern") && node.right.type === "MemberExpression" && t.name === getMemberExpressionName(node.right)) {
            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
              addTaint({
                name: node.left.name,
                type: node.left.type,
                line: node.loc.start.line,
                col: node.loc.start.column,
                scope: (0, _getDeclarationScope["default"])(ast, node.loc.start.line, node.left.name)
              }, taints);
              track(ast, taints[node.left.name].map(function (tt) {
                return _objectSpread({
                  name: node.left.name
                }, tt);
              }), taints);
            }
          }
        });
        break;
      case "Identifier":
        _abstractSyntaxTree["default"].walk((_t$scope3 = t.scope) !== null && _t$scope3 !== void 0 && _t$scope3.scope ? t.scope.scope : ast, function (node) {
          if (node.type === "VariableDeclarator" && node.init && node.init.type === "Identifier" && node.init.name === t.name) {
            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
              addTaint({
                name: node.id.name,
                type: node.id.type,
                line: node.loc.start.line,
                col: node.loc.start.column,
                scope: (0, _getScope["default"])(ast, node.loc.start.line, node.loc.start.column)
              }, taints);
              track(ast, taints[node.id.name].map(function (tt) {
                return _objectSpread({
                  name: node.id.name
                }, tt);
              }), taints);
            }
          } else if ((node.type === "AssignmentExpression" || node.type === "AssignmentPattern") && node.right.type === "Identifier" && node.right.name === t.name) {
            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
              addTaint({
                name: node.left.name,
                type: node.left.type,
                line: node.loc.start.line,
                col: node.loc.start.column,
                scope: (0, _getDeclarationScope["default"])(ast, node.loc.start.line, node.left.name)
              }, taints);
              track(ast, taints[node.left.name].map(function (tt) {
                return _objectSpread({
                  name: node.left.name
                }, tt);
              }), taints);
            }
          }
        });
        break;
    }
  });
}
function getSources(fileAST, sources) {
  // console.log(sources);
  var taint = {};
  var _iterator4 = _createForOfIteratorHelper(sources),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var source = _step4.value;
      if (source.pattern) {
        // add all the rules source into taint
        matchPattern(fileAST, source.pattern, taint);
      } else if (source['pattern-inside']) {
        matchPatternInside(fileAST, source["pattern-inside"], taint);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return taint;
}
function getSinks(sinks) {
  var sinksList = [];
  if (sinks) {
    var _iterator5 = _createForOfIteratorHelper(sinks),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var sink = _step5.value;
        if (sink.pattern) {
          matchSinkPatttern(sink.pattern, sinksList);
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }
  return sinksList;
}
function matchSinkPatttern(patternAST, sinks) {
  if (!validPatternSink(patternAST)) {
    // Error Should be made
    return false;
  }
  var targetedNode = patternAST.body[0].expression;
  var name;
  if (targetedNode.callee.type === "Identifier") {
    name = targetedNode.callee.name;
  } else if (targetedNode.callee.type == "MemberExpression") {
    name = getMemberExpressionName(targetedNode.callee);
  }
  sinks.push({
    name: name,
    calleType: targetedNode.callee.type
  });
  return sinks;
}
function matchPatternInside(fileAST, source) {
  var metaVariables = [];
  source.wrappers.forEach(function (wrapper) {
    matchWrapper(fileAST, wrapper.pattern, metaVariables);
  });
}
function matchWrapper(fileAST, pattern, metaVariables) {
  var targetedNode;
  var AST;
  if (pattern.body.length == 1) {
    // Type 1 (Single Line)
    targetedNode = pattern.body[0];
    AST = fileAST;
  } else {
    // Type 2 (Multi Line)
    AST = (0, _helpers.createBlockStatement)(fileAST);
    targetedNode = (0, _helpers.createBlockStatement)(pattern);
  }
  var match = false;
  _abstractSyntaxTree["default"].walk(AST, function (node) {
    if (!match) {
      if (targetedNode.type === 'ExpressionStatement') {
        targetedNode = targetedNode.expression;
      }
      if (node.type === targetedNode.type) {
        var childs = {};
        if (_matchingAlgorithms["default"][targetedNode.type](targetedNode, node, metaVariables, childs)) {
          match = node.loc.start;
        }
      }
    }
  });
  console.log(match);
}
function validPatternSink(patternAST) {
  if (patternAST.body.length > 1) {
    return false;
  }
  if (patternAST.body[0].type !== "ExpressionStatement") {
    return false;
  }
  if (!["CallExpression"].includes(patternAST.body[0].expression.type)) {
    return false;
  }
  return true;
}
function validPatternSource(patternAST) {
  // console.log(patternAST.body.length);
  if (patternAST.body.length > 1) {
    return false;
  }
  if (patternAST.body[0].type !== "ExpressionStatement") {
    return false;
  }
  if (!["CallExpression", "MemberExpression", "Identifier"].includes(patternAST.body[0].expression.type)) {
    return false;
  }
  return true;
}
function getMemberExpressionName(memberExpression) {
  var name = '';
  if (memberExpression.object.type === "MemberExpression") {
    name += getMemberExpressionName(memberExpression.object);
    name += ".";
  } else if (memberExpression.object.type === "Identifier") {
    name += memberExpression.object.name;
    name += '.';
  }
  name += memberExpression.property.name;
  return name;
}
function matchPattern(fileAST, patternAST, taint) {
  if (!validPatternSource(patternAST)) {
    // Error Should be made
    return false;
  }
  var targetedNode = patternAST.body[0].expression;
  var name;
  switch (targetedNode.type) {
    case "CallExpression":
      if (targetedNode.callee.type === "Identifier") {
        name = targetedNode.callee.name;
      } else if (targetedNode.callee.type == "MemberExpression") {
        name = getMemberExpressionName(targetedNode.callee);
      }
      break;
    case "MemberExpression":
      name = getMemberExpressionName(targetedNode);
      break;
    case "Identifier":
      name = targetedNode.name;
      break;
  }
  if (!taint[name]) {
    taint[name] = [];
  }
  taint[name].push({
    type: targetedNode.type
  });
  return taint;
}
function report(fileName, info, reports) {
  if (reports.reports[fileName]) {
    reports.reports[fileName].push(info);
  } else {
    reports.reports[fileName] = [info];
  }
}
function checkIfAfter(nodeLine, nodeCol, taintLine, taintCol) {
  if (!taintLine) {
    return true;
  }
  if (nodeLine < taintLine) {
    return false;
  }
  if (nodeLine == taintLine) {
    if (nodeCol < taintCol) {
      return false;
    }
    return true;
  }
  return true;
}
var _default = exports["default"] = matchTaintRule;