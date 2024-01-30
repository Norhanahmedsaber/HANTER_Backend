"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _expression = _interopRequireDefault(require("./definitions/expression"));
var _leftHandSideExpression = _interopRequireDefault(require("./definitions/leftHandSideExpression"));
var _primaryExpression = _interopRequireDefault(require("./definitions/primaryExpression"));
var _literalExpression = _interopRequireDefault(require("./definitions/literalExpression"));
var _statement = _interopRequireDefault(require("./definitions/statement"));
var _restElement = _interopRequireDefault(require("./definitions/restElement"));
var _spreadArgument = _interopRequireDefault(require("./definitions/spreadArgument"));
var _variableDeclaratorId = _interopRequireDefault(require("./definitions/variableDeclaratorId"));
var _property = _interopRequireDefault(require("./definitions/property"));
var _matchTypes;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function matchVariableDeclaration(targetedNode, node) {
  // Kind Checking
  if (node.kind !== targetedNode.kind) {
    return false;
  }

  // Declarations Checking
  if (targetedNode.declarations.length > node.declarations.length) {
    return false;
  }
  var _iterator = _createForOfIteratorHelper(targetedNode.declarations),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var targetedVariableDeclarator = _step.value;
      var variableDeclaratorFound = false;
      var _iterator2 = _createForOfIteratorHelper(node.declarations),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var nodeVariableDeclarator = _step2.value;
          variableDeclaratorFound = matchVariableDeclarator(targetedVariableDeclarator, nodeVariableDeclarator);
          break;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (!variableDeclaratorFound) {
        return false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return true;
}
function matchVariableDeclarator(targetedNode, node) {
  // id Type Checking
  if (targetedNode.id.type !== node.id.type) {
    return false;
  }
  // id Checking
  switch (_variableDeclaratorId["default"][targetedNode.id.type]) {
    case 'Identifier':
      if (!matchIdentifier(targetedNode.id, node.id)) {
        return false;
      }
      break;
    case 'Expression':
      if (!matchExpression(targetedNode.id, node.id)) {
        return false;
      }
      break;
    case 'BindingPattern':
      if (!matchBindingPattern(targetedNode.id, node.id)) {
        return false;
      }
      break;
    // TODO Binding Patterns
  }
  // init Type Checking
  if (targetedNode.init && !node.init) {
    return false;
  }
  if (targetedNode.init && node.init) {
    if (targetedNode.init.type !== node.init.type) {
      return false;
    }
    if (!matchExpression(targetedNode.init, node.init)) {
      return false;
    }
  }
  return true;
}
function matchIdentifier(targetedNode, node) {
  return targetedNode.name === node.name;
}
function matchArrowFunctionExpression(targetedNode, node) {
  if (targetedNode.expression !== node.expression) {
    return false;
  }
  if (targetedNode.async !== node.async) {
    return false;
  }
  if (targetedNode.params.length > node.params.length) {
    return false;
  }
  // Params
  for (var index in targetedNode.params) {
    if (!matchParameter(targetedNode.params[index], node.params[index])) {
      return false;
    }
  }
  // Body
  if (targetedNode.body.type !== node.body.type) {
    return false;
  }
  if (targetedNode.body.type === 'BlockStatement') {
    if (!matchBlockStatement(targetedNode.body, node.body)) {
      return false;
    }
  } else {
    if (!matchExpression(targetedNode.body, node.body)) {
      return false;
    }
  }
  return true;
}
function matchBlockStatement(targetedNode, node) {
  if (!matchBlockStatementBase(targetedNode, node)) {
    return false;
  }
  return true;
}
function matchBreakStatement(targetedNode, node) {
  if (targetedNode.label && node.label) {
    if (targetedNode.label.type !== node.label.type) {
      return false;
    }
    switch (targetedNode.label.type) {
      case 'Identifier':
        if (!matchIdentifier(targetedNode.label, node.label)) {
          return false;
        }
        break;
    }
  }
  return true;
}
function matchContinueStatement(targetedNode, node) {
  if (targetedNode.label && node.label) {
    if (targetedNode.label !== node.label) {
      return false;
    }
    switch (targetedNode.label) {
      case "Identifier":
        if (!matchIdentifier(targetedNode.label, node.label)) {
          return false;
        }
        break;
    }
  } else {
    if (targetedNode.label) {
      return false;
    }
  }
  return true;
}
function matchDebuggerStatement(targetedNode, node) {
  return true;
}
function matchEmptyStatement(targetedNode, node) {
  return true;
}
function matchExpressionStatement(targetedNode, node) {
  if (!matchExpression(targetedNode.expression, node.expression)) {
    return false;
  }
  return true;
}
function matchIfStatement(targetedNode, node) {
  // test
  if (!matchExpression(targetedNode.test, node.test)) {
    return false;
  }
  // consquent
  if (!matchStatement(targetedNode.consequent, node.consequent)) {
    return false;
  }
  // alternate
  if (targetedNode.alternate && !node.alternate) {
    return false;
  }
  if (targetedNode.alternate && node.alternate) {
    if (!matchStatement(targetedNode.alternate, node.alternate)) {
      return false;
    }
  }
  return true;
}
function matchImportDeclaration(targetedNode, node) {
  return true;
}
function matchLabeledStatement(targetedNode, node) {
  //label
  switch (targetedNode.label.type) {
    case "Identifier":
      if (!matchIdentifier(targetedNode.label, node.label)) {
        return false;
      }
      break;
  }
  //body
  if (!matchStatement(targetedNode.body, node.body)) {
    return false;
  }
  return true;
}
function matchReturnStatement(targetedNode, node) {
  if (targetedNode.argument && node.argument) {
    if (targetedNode.argument.type !== node.argument.type) {
      return false;
    }
    if (!matchExpression(targetedNode.argument, node.argument)) {
      return false;
    }
  } else {
    if (targetedNode.argument) {
      return false;
    }
  }
  return true;
}
function matchSwitchCase(targetedNode, node) {
  //test
  if (targetedNode.test && node.test) {
    if (!matchExpression(targetedNode.test, node.test)) {
      return false;
    }
  } else {
    if (targetedNode.test || node.test) {
      return false;
    }
  }
  //consequent
  if (!matchStatement(targetedNode.consequent, node.consequent)) {
    return false;
  }
  return true;
}
function matchSwitchStatement(targetedNode, node) {
  //discriminant
  if (!matchExpression(targetedNode.discriminant, node.discriminant)) {
    return false;
  }
  //cases
  var _iterator3 = _createForOfIteratorHelper(targetedNode.cases),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var targetedCase = _step3.value;
      var found = false;
      var _iterator4 = _createForOfIteratorHelper(node.cases),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var nodeCase = _step4.value;
          if (matchSwitchCase(targetedCase, nodeCase)) {
            found = true;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (!found) {
        return false;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return true;
}
function matchThrowStatement(targetedNode, node) {
  if (!matchExpression(targetedNode.argument, node.argument)) {
    return false;
  }
  return true;
}
function matchTryStatement(targetedNode, node) {
  // block
  if (!matchBlockStatement(targetedNode.block, node.block)) {
    return false;
  }
  //handler
  if (targetedNode.handler && node.handler) {
    if (!matchCatchClause(targetedNode.handler, node.handler)) {
      return false;
    }
  } else {
    if (targetedNode.handler) {
      return false;
    }
  }
  // finalizer
  if (targetedNode.finalizer && node.finalizer) {
    if (!matchBlockStatement(targetedNode.finalizer, node.finalizer)) {
      return false;
    }
  } else {
    if (targetedNode.finalizer) {
      return false;
    }
  }
  return true;
}
function matchCatchClause(targetedNode, node) {
  // param
  if (targetedNode.param && node.param) {
    if (targetedNode.param.type !== node.param.type) {
      return false;
    }
    switch (targetedNode.param) {
      case 'Identifier':
        if (!matchIdentifier(targetedNode.param, node.param)) {
          return false;
        }
        break;
      default:
        // Binding Pattern
        if (!matchBindingPattern(targetedNode.param, node.param)) {
          return false;
        }
        break;
    }
  } else {
    if (targetedNode.param) {
      return false;
    }
  }
  // body
  if (!matchBlockStatement(targetedNode.body, node.body)) {
    return false;
  }
  return true;
}
function matchWithStatement(targetedNode, node) {
  return true;
}
function matchExportDefaultDeclaration(targetedNode, node) {
  return true;
}
function matchExportAllDeclaration(targetedNode, node) {
  return true;
}
function matchExportNamedDeclaration(targetedNode, node) {
  return true;
}
function matchFunctionDeclaration(targetedNode, node) {
  if (!matchFunctionDeclarationBase(targetedNode, node)) {
    return false;
  }
  return true;
}
function matchDoWhileStatement(targetedNode, node) {
  //test
  if (!matchExpression(targetedNode.test, node.test)) {
    return false;
  }
  //body
  if (!matchStatement(targetedNode.body, node.body)) {
    return false;
  }
  return true;
}
function matchForInStatement(targetedNode, node) {
  // left 
  if (!matchForInitialiser(targetedNode.left, node.left)) {
    return false;
  }

  //right
  if (!matchExpression(targetedNode.right, node.right)) {
    return false;
  }

  //body
  if (!matchStatement(targetedNode.body, node.body)) {
    return false;
  }
  return true;
}
function matchForInitialiser(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (targetedNode.type) {
    case "VariableDeclaration":
      if (!matchVariableDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    default:
      // Expression
      if (!matchExpression(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchForOfStatement(targetedNode, node) {
  return true;
}
function matchForStatement(targetedNode, node) {
  // init
  if (targetedNode.init && node.init) {
    if (targetedNode.init.type !== node.init.type) {
      return false;
    }
    switch (targetedNode.init.type) {
      case 'VariableDeclaration':
        if (!matchVariableDeclaration(targetedNode.init, node.init)) {
          return false;
        }
        break;
      default:
        // Expression
        if (!matchExpression(targetedNode.init, node.init)) {
          return false;
        }
    }
  } else {
    if (targetedNode.init || node.init) {
      return false;
    }
  }
  // test
  if (targetedNode.test && node.test) {
    if (!matchExpression(targetedNode.test, node.test)) {
      return false;
    }
  } else {
    if (targetedNode.test || node.test) {
      return false;
    }
  }
  // update
  if (targetedNode.update && node.update) {
    if (!matchExpression(targetedNode.update, node.update)) {
      return false;
    }
  } else {
    if (targetedNode.update || node.update) {
      return false;
    }
  }
  // body
  if (!matchStatement(targetedNode.body, node.body)) {
    return false;
  }
  return true;
}
function matchWhileStatement(targetedNode, node) {
  // test
  if (!matchExpression(targetedNode.test, node.test)) {
    return false;
  }
  // body
  if (!matchStatement(targetedNode.body, node.body)) {
    return false;
  }
  return true;
}
function matchStatement(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (_statement["default"][targetedNode.type]) {
    case 'BlockStatement':
      if (!matchBlockStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'IfStatement':
      if (!matchIfStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'BreakStatement':
      if (!matchBreakStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ContinueStatement':
      if (!matchContinueStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'DebuggerStatement':
      if (!matchDebuggerStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'EmptyStatement':
      if (!matchEmptyStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ExpressionStatement':
      if (!matchExpressionStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ImportDeclaration':
      if (!matchImportDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'LabeledStatement':
      if (!matchLabeledStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ReturnStatement':
      if (!matchReturnStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'SwitchStatement':
      if (!matchSwitchStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ThrowStatement':
      if (!matchThrowStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'TryStatement':
      if (!matchTryStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'VariableDeclaration':
      if (!matchVariableDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'WithStatement':
      if (!matchWithStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ClassDeclaration':
      if (!matchClassDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'ClassExpression':
      if (!matchClassExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ExportDefaultDeclaration':
      if (!matchExportDefaultDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'ExportAllDeclaration':
      if (!matchExportAllDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'ExportNamedDeclaration':
      if (!matchExportNamedDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'FunctionDeclaration':
      if (!matchFunctionDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'IterationStatement':
      if (!matchIterationStatement(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchIterationStatement(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (targetedNode.type) {
    case 'DoWhileStatement':
      if (!matchDoWhileStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ForInStatement':
      if (!matchForInStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ForOfStatement':
      if (!matchForOfStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ForStatement':
      if (!matchForStatement(targetedNode, node)) {
        return false;
      }
      break;
    case 'WhileStatement':
      if (!matchWhileStatement(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchArguments(targetedNode, node) {
  if (targetedNode.length > node.length) {
    return false;
  }
  for (var index in targetedNode) {
    if (!matchExpression(targetedNode[index], node[index])) {
      return false;
    }
  }
  return true;
}
function matchParameter(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (targetedNode.type) {
    case 'Identifier':
      if (!matchIdentifier(targetedNode, node)) {
        return false;
      }
      break;
    case 'AssignmentPattern':
      if (!matchAssignmentPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'RestElement':
      if (!matchRestElement(targetedNode, node)) {
        return false;
      }
      break;
    case 'ArrayPattern':
      if (!matchObjectPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'ObjectPattern':
      if (!matchArrayPattern(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchAssignmentPattern(targetedNode, node) {
  if (targetedNode.right && !node.right) {
    return false;
  }
  if (targetedNode.right) {
    if (targetedNode.right.type !== node.right.type) {
      return false;
    }
    if (!matchExpression(targetedNode, node)) {
      return false;
    }
  }
  if (targetedNode.left.type !== node.left.type) {
    return false;
  }
  switch (targetedNode.left.type) {
    case 'Identifier':
      if (!matchIdentifier(targetedNode, node)) {
        return false;
      }
      break;
    case 'ArrayPattern':
      if (!matchArrayPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'ObjectPattern':
      if (!matchObjectPattern(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchAssignmentExpression(targetedNode, node) {
  // operator
  if (targetedNode.operator !== node.operator) {
    return false;
  }
  // left
  if (!matchExpression(targetedNode.left, node.left)) {
    return false;
  }
  // right
  if (!matchExpression(targetedNode.right, node.right)) {
    return false;
  }
  return true;
}
function matchBinaryExpression(targetedNode, node) {
  // operator
  if (targetedNode.operator !== node.operator) {
    return false;
  }
  // left
  if (!matchExpression(targetedNode.left, node.left)) {
    return false;
  }
  // right
  if (!matchExpression(targetedNode.right, node.right)) {
    return false;
  }
  return true;
}
function matchConditionalExpression(targetedNode, node) {
  // test
  if (!matchExpression(targetedNode.test, node.test)) {
    return false;
  }
  // consequent
  if (!matchExpression(targetedNode.consequent, node.consequent)) {
    return false;
  }
  // alternate
  if (!matchExpression(targetedNode.alternate, node.alternate)) {
    return false;
  }
  return true;
}
function matchLogicalExpression(targetedNode, node) {
  // operator
  if (targetedNode.operator !== node.operator) {
    return false;
  }
  // left
  if (!matchExpression(targetedNode.left, node.left)) {
    return false;
  }
  // right
  if (!matchExpression(targetedNode.right, node.right)) {
    return false;
  }
  return true;
}
function matchNewExpression(targtedNode, node) {
  // callee
  if (!matchLeftHandSideExpression(targtedNode.callee, node.callee)) {
    return false;
  }
  // arguments
  if (!matchArguments(targtedNode.arguments, node.arguments)) {
    return false;
  }
  return true;
}
function matchRestElement(targtedNode, node) {
  // argument
  if (targtedNode.argument.type !== node.argument.type) {
    return false;
  }
  switch (_restElement["default"][targtedNode]) {
    case 'Identifier':
      if (!matchIdentifier(targtedNode.argument, node.argument)) {
        return false;
      }
      break;
    case 'PropertyName':
      if (!matchPropertyName(targtedNode.argument, node.argument)) {
        return false;
      }
      break;
    case 'BindingPattern':
      if (!matchBindingPattern(targtedNode.argument, node.argument)) {
        return false;
      }
      break;
  }
  // value (OPTIONAL)
  // Value isn't applicable in JS we can't decalre params after a rest element

  return true;
}
function matchBindingPattern(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (targetedNode.type) {
    case 'Identifier':
      if (!matchIdentifier(targetedNode, node)) {
        return false;
      }
      break;
    case 'ArrayPattern':
      if (!matchArrayPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'ObjectPattern':
      if (!matchObjectPattern(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchPropertyName(targetedNode, node) {
  switch (targetedNode.type) {
    case 'Identifier':
      if (!matchIdentifier(targetedNode, node)) {
        return false;
      }
      break;
    case 'Literal':
      if (!matchLiteral(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchSequenceExpression(targetedNode, node) {
  return true;
}
function matchAwaitExpression(targetedNode, node) {
  // moseeba our meriyah doesnt read await as reserved word
  if (!matchExpression(targetedNode.argument, node.argument)) {
    return false;
  }
  return true;
}
function matchLeftHandSideExpression(targetedNode, node) {
  switch (_leftHandSideExpression["default"][targetedNode.type]) {
    case 'CallExpression':
      if (!matchCallExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ChainExpression':
      // skipped
      if (!matchChainExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ImportExpression':
      // skipped
      if (!matchImportExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ClassExpression':
      // skipped
      if (!matchClassExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ClassDeclaration':
      // skipped
      if (!matchClassDeclaration(targetedNode, node)) {
        return false;
      }
      break;
    case 'FunctionExpression':
      if (!matchFunctionExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'LiteralExpression':
      // NotNode
      if (!matchLiteralExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'MemberExpression':
      if (!matchMemberExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'PrimaryExpression':
      // NotNode
      if (!matchPrimaryExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'TaggedTemplateExpression':
      if (!matchTaggedTemplateExpression(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchCallExpression(targetedNode, node) {
  // callee
  if (targetedNode.callee.type !== node.callee.type) {
    return false;
  }
  if (targetedNode.type === 'Super') {
    if (!matchSuper(targetedNode, node)) {
      return false;
    }
  } else {
    if (!matchExpression(targetedNode.callee, node.callee)) {
      return false;
    }
  }

  // arguments
  if (targetedNode.arguments.length > node.arguments.length) {
    return false;
  }
  for (var index in targetedNode.arguments) {
    if (targetedNode.arguments[index].type !== node.arguments[index].type) {
      return false;
    }
    if (targetedNode.arguments[index].type == 'SpreadElement') {
      if (!matchSpreadElement(targetedNode.arguments[index], node.arguments[index])) {
        return false;
      }
    } else {
      if (!matchExpression(targetedNode.arguments[index], node.arguments[index])) {
        return false;
      }
    }
  }
  return true;
}
function matchSpreadElement(targetedNode, node) {
  if (!matchSpreadArgument(targetedNode.argument, node.argument)) {
    return false;
  }
  return true;
}
function matchSpreadArgument(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (_spreadArgument["default"][targetedNode.type]) {
    case 'Identifier':
      if (!matchIdentifier(targetedNode, node)) {
        return false;
      }
      break;
    case 'SpreadElement':
      if (!matchSpreadElement(targetedNode, node)) {
        return false;
      }
      break;
    case 'BindingPattern':
      if (!matchBindingPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'Expression':
      if (!matchExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'PropertyName':
      if (!matchPropertyName(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchChainExpression(targetedNode, node) {
  return true;
}
function matchImportExpression(targetedNode, node) {
  return true;
}
function matchClassExpression(targetedNode, node) {
  return true;
}
function matchClassDeclaration(targetedNode, node) {
  return true;
}
function matchFunctionExpression(targetedNode, node) {
  if (!matchFunctionDeclarationBase(targetedNode, node)) {
    return false;
  }
  return true;
}
function matchFunctionDeclarationBase(targetedNode, node) {
  if (targetedNode.generator !== node.generator) {
    return false;
  }
  if (targetedNode.async !== node.async) {
    return false;
  }
  if (targetedNode.params.length > node.params.length) {
    return false;
  }
  for (var index in targetedNode.params) {
    if (!matchParameter(targetedNode.params[index], node.params[index])) {
      return false;
    }
  }
  if (targetedNode.body) {
    if (!matchBlockStatement(targetedNode.body, node.body)) {
      return false;
    }
  }
  return true;
}
function matchLiteralExpression(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (_literalExpression["default"][targetedNode.type]) {
    case 'Literal':
      if (!matchLiteral(targetedNode, node)) {
        return false;
      }
      break;
    case 'TemplateLiteral':
      if (!matchTemplateLiteral(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchMemberExpression(targetedNode, node) {
  // object
  if (targetedNode.object.type !== node.object.type) {
    return false;
  }
  switch (targetedNode.object.type) {
    case 'Super':
      if (!matchSuper(targetedNode.object, node.object)) {
        return false;
      }
      break;
    default:
      if (!matchExpression(targetedNode.object, node.object)) {
        return false;
      }
  }

  // property 
  if (targetedNode.property.type !== node.property.type) {
    return false;
  }
  switch (targetedNode.property.type) {
    case 'PrivateIdentifier':
      if (!matchPrivateIdentifier(targetedNode.property, node.property)) {
        return false;
      }
      break;
    default:
      if (!matchExpression(targetedNode.property, node.property)) {
        return false;
      }
  }
  return true;
}
function matchPrivateIdentifier(targtedNode, node) {
  if (targtedNode.name !== node.name) {
    return false;
  }
  return true;
}
function matchPrimaryExpression(targetedNode, node) {
  switch (_primaryExpression["default"][targetedNode.type]) {
    case 'ArrayExpression':
      if (!matchArrayExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ArrayPattern':
      if (!matchArrayPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'ClassExpression':
      if (!matchClassExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'FunctionExpression':
      if (!matchFunctionExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'Identifier':
      if (!matchIdentifier(targetedNode, node)) {
        return false;
      }
      break;
    case 'Import':
      if (!matchImport(targetedNode, node)) {
        return false;
      }
    case 'JSXElement':
      if (!matchJSXElement(targetedNode, node)) {
        return false;
      }
      break;
    case 'JSXFragment':
      if (!matchJSXFragment(targetedNode, node)) {
        return false;
      }
      break;
    case 'JSXOpeningElement':
      if (!matchJSXOpeningElement(targetedNode, node)) {
        return false;
      }
      break;
    case 'Literal':
      if (!matchLiteral(targetedNode, node)) {
        return false;
      }
      break;
    case 'MetaProperty':
      if (!matchMetaProperty(targetedNode, node)) {
        return false;
      }
      break;
    case 'ObjectExpression':
      if (!matchObjectExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ObjectPattern':
      if (!matchObjectPattern(targetedNode, node)) {
        return false;
      }
      break;
    case 'Super':
      if (!matchSuper(targetedNode, node)) {
        return false;
      }
      break;
    case 'TemplateLiteral':
      if (!matchTemplateLiteral(targetedNode, node)) {
        return false;
      }
      break;
    case 'ThisExpression':
      if (!matchThisExpression(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchArrayExpression(targetedNode, node) {
  for (var index in targetedNode.elements) {
    if (targetedNode.elements[index] !== null && node.elements[index] !== null) {
      if (!node.elements[index]) {
        return false;
      }
      if (targetedNode.elements[index].type === node.elements[index].type) switch (targetedNode.elements[index].type) {
        case 'SpreadElement':
          if (!matchSpreadElement(targetedNode.elements[index], node.elements[index])) {
            return false;
          }
          break;
        default:
          if (!matchExpression(targetedNode.elements[index], node.elements[index])) {
            return false;
          }
          break;
      }
    }
  }
  return true;
}
function matchArrayPattern(targetedNode, node) {
  for (var index in targetedNode.elements) {
    if (node.elements[index] == null) {
      return false;
    }
    if (!matchExpression(targetedNode.elements[index], node.elements[index])) {
      return false;
    }
  }
  return true;
}
function matchImport(targetedNode, node) {
  return true;
}
function matchJSXElement(targetedNode, node) {
  return true;
}
function matchJSXFragment(targetedNode, node) {
  return true;
}
function matchJSXOpeningElement(targetedNode, node) {
  return true;
}
function matchLiteral(targetedNode, node) {
  if (targetedNode.value !== node.value) {
    return false;
  }
  return true;
}
function matchMetaProperty(targetedNode, node) {
  return true;
}
function matchObjectExpression(targetedNode, node) {
  var _iterator5 = _createForOfIteratorHelper(targetedNode.properties),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var targetedProperty = _step5.value;
      var found = false;
      var _iterator6 = _createForOfIteratorHelper(node.properties),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var nodeProperty = _step6.value;
          if (matchObjectLiteralElementLike(targetedProperty, nodeProperty)) {
            found = true;
            break;
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      if (!found) {
        return false;
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return true;
}
function matchMethodDefinition(targetedNode, node) {
  if (!matchMethodDefinitionBase(targetedNode, node)) {
    return false;
  }
  return true;
}
function matchMethodDefinitionBase(targetedNode, node) {
  //key 
  if (targetedNode.key.type && node.key.type) {
    if (targetedNode.key.type !== node.key.type) {
      return false;
    }
    switch (targetedNode.key.type) {
      case 'PrivateIdentifier':
        if (!matchPrivateIdentifier(targetedNode.key, node.key)) {
          return false;
        }
        break;
      default:
        if (!matchExpression(targetedNode.key.node.key)) {
          return false;
        }
    }
  }
  // value
  if (targetedNode.value.type !== node.value.type) {
    return false;
  }
  if (!matchFunctionExpression(targetedNode.value, node.value)) {
    return false;
  }
  // static
  if (targetedNode["static"] !== node["static"]) {
    return false;
  }
  // kind
  if (targetedNode.kind !== node.kind) {
    return false;
  }
  // Decorators
  for (var index in targetedNode.decorators) {
    if (!node.decorators[index]) {
      return false;
    }
    if (!matchDecorator(targetedNode.decorators[index], node.decorators[index])) {
      return false;
    }
  }
  return true;
}
function matchDecorator(targetedNode, node) {
  if (!matchLeftHandSideExpression(targetedNode.expression, node.expression)) {
    return false;
  }
  return true;
}
function matchProperty(targetedNode, node) {
  // computed method shorthand are skipped due to our ignorance
  // key
  if (!matchExpression(targetedNode.key, node.key)) {
    return false;
  }
  // value
  if (targetedNode.value.type !== node.value.type) {
    return false;
  }
  switch (_property["default"][targetedNode.value.type]) {
    case "Identifier":
      if (!matchIdentifier(targetedNode.value, node.value)) {
        return false;
      }
      break;
    case "AssignmentPattern":
      if (!matchAssignmentPattern(targetedNode.value, node.value)) {
        return false;
      }
      break;
    case "Expression":
      if (!matchExpression(targetedNode.value, node.value)) {
        return false;
      }
      break;
    case "BindinPattern":
      if (!matchBindingPattern(targetedNode.value, node.value)) {
        return false;
      }
      break;
  }
  // kind
  if (targetedNode.kind !== node.kind) {
    return false;
  }
  return true;
}
function matchObjectLiteralElementLike(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (targetedNode.type) {
    case 'MethodDefinition':
      if (!matchMethodDefinition(targetedNode, node)) {
        return false;
      }
      break;
    case 'Property':
      if (!matchProperty(targetedNode, node)) {
        return false;
      }
      break;
    case 'RestElement':
      if (!matchRestElement(targetedNode, node)) {
        return false;
      }
      break;
    case 'SpreadElement':
      if (!matchSpreadElement(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchObjectPattern(targetedNode, node) {
  var _iterator7 = _createForOfIteratorHelper(targetedNode.properties),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var targetedProperty = _step7.value;
      var found = false;
      var _iterator8 = _createForOfIteratorHelper(node.properties),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var nodeProperty = _step8.value;
          if (matchObjectLiteralElementLike(targetedProperty, nodeProperty)) {
            found = true;
            break;
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      if (!found) {
        return false;
      }
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  return true;
}
function matchSuper(targetedNode, node) {
  return true;
}
function matchTemplateElement(targetedNode, node) {
  if (targetedNode.tail !== node.tail) {
    return false;
  }
  if (targetedNode.value.raw !== node.value.raw) {
    return false;
  }
  if (targetedNode.value.cooked !== node.value.cooked) {
    return false;
  }
  return true;
}
function matchTemplateLiteral(targetedNode, node) {
  // quasis
  for (var index in targetedNode.quasis) {
    if (!matchTemplateElement(targetedNode.quasis[index], node.quasis[index])) {
      return false;
    }
  }
  // expressions
  for (var _index in targetedNode.expressions) {
    if (!matchExpression(targetedNode.expressions[_index], node.expressions[_index])) {
      return false;
    }
  }
  return true;
}
function matchThisExpression(targetedNode, node) {
  return true;
}
function matchTaggedTemplateExpression(targetedNode, node) {
  if (!matchExpression(targetedNode.tag, node.tag)) {
    return false;
  }
  if (!matchTemplateLiteral(targetedNode.quasi, node.quasi)) {
    return false;
  }
  return true;
}
function matchUnaryExpression(targetedNode, node) {
  if (targetedNode.operator !== node.operator) {
    return false;
  }
  if (targetedNode.prefix !== node.prefix) {
    return false;
  }
  if (!matchExpression(targetedNode.argument, node.argument)) {
    return false;
  }
  return true;
}
function matchUpdateExpression(targetedNode, node) {
  if (targetedNode.operator !== node.operator) {
    return false;
  }
  if (targetedNode.prefix !== node.prefix) {
    return false;
  }
  if (!matchExpression(targetedNode.argument, node.argument)) {
    return false;
  }
  return true;
}
function matchYieldExpression(targetedNode, node) {
  return true;
}
function matchExpression(targetedNode, node) {
  if (targetedNode.type !== node.type) {
    return false;
  }
  switch (_expression["default"][targetedNode.type]) {
    case 'ArrowFunctionExpression':
      if (!matchArrowFunctionExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'AssignmentExpression':
      if (!matchAssignmentExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'BinaryExpression':
      if (!matchBinaryExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'ConditionalExpression':
      if (!matchConditionalExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'LogicalExpression':
      if (!matchLogicalExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'NewExpression':
      if (!matchNewExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'RestElement':
      if (!matchRestElement(targetedNode, node)) {
        return false;
      }
      break;
    case 'SequenceExpression':
      // skipped
      if (!matchSequenceExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'AwaitExpression':
      if (!matchAwaitExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'LeftHandSideExpression':
      // NotNode
      if (!matchLeftHandSideExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'UnaryExpression':
      if (!matchUnaryExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'UpdateExpression':
      if (!matchUpdateExpression(targetedNode, node)) {
        return false;
      }
      break;
    case 'YieldExpression':
      if (!matchYieldExpression(targetedNode, node)) {
        return false;
      }
      break;
  }
  return true;
}
function matchBigIntLiteral(targetedNode, node) {
  if (targetedNode.bigint !== node.bigint) {
    return false;
  }
  if (!matchLiteral(targetedNode, node)) {
    return false;
  }
  return true;
}
function matchParenthesizedExpression(targetedNode, node) {
  if (!matchExpression(targetedNode.expression, node.expression)) {
    return false;
  }
  return true;
}
function matchRegExpLiteral(targetedNode, node) {
  if (targetedNode.regex.pattern !== node.regex.pattern) {
    return false;
  }
  if (targetedNode.regex.flags !== node.regex.flags) {
    return false;
  }
  return true;
}
function matchStaticBlock(targetedNode, node) {
  if (!matchBlockStatementBase(targetedNode, node)) {
    return false;
  }
  return true;
}
function matchBlockStatementBase(targetedNode, node) {
  if (targetedNode.body.length > node.body.length) {
    return false;
  }
  if (targetedNode.body.length !== 0) {
    var currentTargetedStatement = 0; // i
    var currentNodeStatement = 0; // c
    while (currentTargetedStatement < targetedNode.body.length && currentNodeStatement < node.body.length) {
      if (matchStatement(targetedNode.body[currentTargetedStatement], node.body[currentNodeStatement])) {
        currentTargetedStatement++;
      }
      currentNodeStatement++;
    }
    if (currentTargetedStatement < targetedNode.body.length) {
      return false;
    }
  } else {
    if (node.body.length > 0) {
      return false;
    }
  }
  return true;
}
var matchTypes = (_matchTypes = {
  VariableDeclaration: matchVariableDeclaration,
  VariableDeclarator: matchVariableDeclarator,
  Identifier: matchIdentifier,
  ArrowFunctionExpression: matchArrowFunctionExpression,
  ArrayExpression: matchArrayExpression,
  ArrayPattern: matchArrayPattern
}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "ArrowFunctionExpression", matchArrowFunctionExpression), "AssignmentExpression", matchAssignmentExpression), "AssignmentPattern", matchAssignmentPattern), "AwaitExpression", matchAwaitExpression), "BigIntLiteral", matchBigIntLiteral), "BinaryExpression", matchBinaryExpression), "BlockStatement", matchBlockStatement), "BreakStatement", matchBreakStatement), "CallExpression", matchCallExpression), "ChainExpression", matchChainExpression), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "ImportExpression", matchImportExpression), "CatchClause", matchCatchClause), "ClassDeclaration", matchClassDeclaration), "ClassExpression", matchClassExpression), "ConditionalExpression", matchConditionalExpression), "ContinueStatement", matchContinueStatement), "DebuggerStatement", matchDebuggerStatement), "Decorator", matchDecorator), "DoWhileStatement", matchDoWhileStatement), "EmptyStatement", matchEmptyStatement), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "ExportAllDeclaration", matchExportAllDeclaration), "ExportDefaultDeclaration", matchExportDefaultDeclaration), "ExportNamedDeclaration", matchExportNamedDeclaration), "ExpressionStatement", matchExpressionStatement), "ForInStatement", matchForInStatement), "ForOfStatement", matchForOfStatement), "ForStatement", matchForStatement), "FunctionDeclaration", matchFunctionDeclaration), "FunctionExpression", matchFunctionExpression), "Identifier", matchIdentifier), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "IfStatement", matchIfStatement), "Import", matchImport), "ImportDeclaration", matchImportDeclaration), "LabeledStatement", matchLabeledStatement), "Literal", matchLiteral), "LogicalExpression", matchLogicalExpression), "MemberExpression", matchMemberExpression), "MetaProperty", matchMetaProperty), "MethodDefinition", matchMethodDefinition), "NewExpression", matchNewExpression), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "ObjectExpression", matchObjectExpression), "ObjectPattern", matchObjectPattern), "ParenthesizedExpression", matchParenthesizedExpression), "PrivateIdentifier", matchPrivateIdentifier), "Property", matchProperty), "RegExpLiteral", matchRegExpLiteral), "RestElement", matchRestElement), "ReturnStatement", matchReturnStatement), "SequenceExpression", matchSequenceExpression), "SpreadElement", matchSpreadElement), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "StaticBlock", matchStaticBlock), "Super", matchSuper), "SwitchCase", matchSwitchCase), "SwitchStatement", matchSwitchStatement), "TaggedTemplateExpression", matchTaggedTemplateExpression), "TemplateElement", matchTemplateElement), "TemplateLiteral", matchTemplateLiteral), "ThisExpression", matchThisExpression), "ThrowStatement", matchThrowStatement), "TryStatement", matchTryStatement), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_matchTypes, "UpdateExpression", matchUpdateExpression), "UnaryExpression", matchUnaryExpression), "VariableDeclaration", matchVariableDeclaration), "VariableDeclarator", matchVariableDeclarator), "WhileStatement", matchWhileStatement), "WithStatement", matchWithStatement), "YieldExpression", matchYieldExpression));
var _default = exports["default"] = matchTypes;