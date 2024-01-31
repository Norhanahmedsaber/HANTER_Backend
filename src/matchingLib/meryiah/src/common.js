"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addBindingToExports = addBindingToExports;
exports.addBlockName = addBlockName;
exports.addChildScope = addChildScope;
exports.addVarName = addVarName;
exports.addVarOrBlock = addVarOrBlock;
exports.classifyIdentifier = classifyIdentifier;
exports.consume = consume;
exports.consumeOpt = consumeOpt;
exports.createArrowHeadParsingScope = createArrowHeadParsingScope;
exports.createScope = createScope;
exports.declareUnboundVariable = declareUnboundVariable;
exports.finishNode = finishNode;
exports.isEqualTagName = isEqualTagName;
exports.isPropertyWithPrivateFieldKey = isPropertyWithPrivateFieldKey;
exports.isStrictReservedWord = isStrictReservedWord;
exports.isValidIdentifier = isValidIdentifier;
exports.isValidLabel = isValidLabel;
exports.isValidStrictMode = isValidStrictMode;
exports.matchOrInsertSemicolon = matchOrInsertSemicolon;
exports.optionalBit = optionalBit;
exports.pushComment = pushComment;
exports.pushToken = pushToken;
exports.recordScopeError = recordScopeError;
exports.reinterpretToPattern = reinterpretToPattern;
exports.validateAndDeclareLabel = validateAndDeclareLabel;
exports.validateBindingIdentifier = validateBindingIdentifier;
exports.validateFunctionName = validateFunctionName;
var _token = require("./token");
var _errors = require("./errors");
var _scan = require("./lexer/scan");
function matchOrInsertSemicolon(parser, context, specDeviation) {
  if ((parser.flags & 1) === 0 && (parser.token & 1048576) !== 1048576 && !specDeviation) {
    (0, _errors.report)(parser, 28, _token.KeywordDescTable[parser.token & 255]);
  }
  consumeOpt(parser, context, 1074790417);
}
function isValidStrictMode(parser, index, tokenPos, tokenValue) {
  if (index - tokenPos < 13 && tokenValue === 'use strict') {
    if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
      return 1;
    }
  }
  return 0;
}
function optionalBit(parser, context, t) {
  if (parser.token !== t) return 0;
  (0, _scan.nextToken)(parser, context);
  return 1;
}
function consumeOpt(parser, context, t) {
  if (parser.token !== t) return false;
  (0, _scan.nextToken)(parser, context);
  return true;
}
function consume(parser, context, t) {
  if (parser.token !== t) (0, _errors.report)(parser, 23, _token.KeywordDescTable[t & 255]);
  (0, _scan.nextToken)(parser, context);
}
function reinterpretToPattern(state, node) {
  switch (node.type) {
    case 'ArrayExpression':
      node.type = 'ArrayPattern';
      var elements = node.elements;
      for (var i = 0, n = elements.length; i < n; ++i) {
        var element = elements[i];
        if (element) reinterpretToPattern(state, element);
      }
      return;
    case 'ObjectExpression':
      node.type = 'ObjectPattern';
      var properties = node.properties;
      for (var _i = 0, _n = properties.length; _i < _n; ++_i) {
        reinterpretToPattern(state, properties[_i]);
      }
      return;
    case 'AssignmentExpression':
      node.type = 'AssignmentPattern';
      if (node.operator !== '=') (0, _errors.report)(state, 69);
      delete node.operator;
      reinterpretToPattern(state, node.left);
      return;
    case 'Property':
      reinterpretToPattern(state, node.value);
      return;
    case 'SpreadElement':
      node.type = 'RestElement';
      reinterpretToPattern(state, node.argument);
    default:
  }
}
function validateBindingIdentifier(parser, context, kind, t, skipEvalArgCheck) {
  if (context & 1024) {
    if ((t & 36864) === 36864) {
      (0, _errors.report)(parser, 115);
    }
    if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
      (0, _errors.report)(parser, 116);
    }
  }
  if ((t & 20480) === 20480) {
    (0, _errors.report)(parser, 100);
  }
  if (kind & (8 | 16) && t === 241739) {
    (0, _errors.report)(parser, 98);
  }
  if (context & (4194304 | 2048) && t === 209008) {
    (0, _errors.report)(parser, 96);
  }
  if (context & (2097152 | 1024) && t === 241773) {
    (0, _errors.report)(parser, 95, 'yield');
  }
}
function validateFunctionName(parser, context, t) {
  if (context & 1024) {
    if ((t & 36864) === 36864) {
      (0, _errors.report)(parser, 115);
    }
    if ((t & 537079808) === 537079808) {
      (0, _errors.report)(parser, 116);
    }
    if (t === 122) {
      (0, _errors.report)(parser, 93);
    }
    if (t === 121) {
      (0, _errors.report)(parser, 93);
    }
  }
  if ((t & 20480) === 20480) {
    (0, _errors.report)(parser, 100);
  }
  if (context & (4194304 | 2048) && t === 209008) {
    (0, _errors.report)(parser, 96);
  }
  if (context & (2097152 | 1024) && t === 241773) {
    (0, _errors.report)(parser, 95, 'yield');
  }
}
function isStrictReservedWord(parser, context, t) {
  if (t === 209008) {
    if (context & (4194304 | 2048)) (0, _errors.report)(parser, 96);
    parser.destructible |= 128;
  }
  if (t === 241773 && context & 2097152) (0, _errors.report)(parser, 95, 'yield');
  return (t & 20480) === 20480 || (t & 36864) === 36864 || t == 122;
}
function isPropertyWithPrivateFieldKey(expr) {
  return !expr.property ? false : expr.property.type === 'PrivateIdentifier';
}
function isValidLabel(parser, labels, name, isIterationStatement) {
  while (labels) {
    if (labels['$' + name]) {
      if (isIterationStatement) (0, _errors.report)(parser, 134);
      return 1;
    }
    if (isIterationStatement && labels.loop) isIterationStatement = 0;
    labels = labels['$'];
  }
  return 0;
}
function validateAndDeclareLabel(parser, labels, name) {
  var set = labels;
  while (set) {
    if (set['$' + name]) (0, _errors.report)(parser, 133, name);
    set = set['$'];
  }
  labels['$' + name] = 1;
}
function finishNode(parser, context, start, line, column, node) {
  if (context & 2) {
    node.start = start;
    node.end = parser.startPos;
    node.range = [start, parser.startPos];
  }
  if (context & 4) {
    node.loc = {
      start: {
        line: line,
        column: column
      },
      end: {
        line: parser.startLine,
        column: parser.startColumn
      }
    };
    if (parser.sourceFile) {
      node.loc.source = parser.sourceFile;
    }
  }
  return node;
}
function isEqualTagName(elementName) {
  switch (elementName.type) {
    case 'JSXIdentifier':
      return elementName.name;
    case 'JSXNamespacedName':
      return elementName.namespace + ':' + elementName.name;
    case 'JSXMemberExpression':
      return isEqualTagName(elementName.object) + '.' + isEqualTagName(elementName.property);
    default:
  }
}
function createArrowHeadParsingScope(parser, context, value) {
  var scope = addChildScope(createScope(), 1024);
  addBlockName(parser, context, scope, value, 1, 0);
  return scope;
}
function recordScopeError(parser, type) {
  var index = parser.index,
    line = parser.line,
    column = parser.column;
  for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }
  return {
    type: type,
    params: params,
    index: index,
    line: line,
    column: column
  };
}
function createScope() {
  return {
    parent: void 0,
    type: 2
  };
}
function addChildScope(parent, type) {
  return {
    parent: parent,
    type: type,
    scopeError: void 0
  };
}
function addVarOrBlock(parser, context, scope, name, kind, origin) {
  if (kind & 4) {
    addVarName(parser, context, scope, name, kind);
  } else {
    addBlockName(parser, context, scope, name, kind, origin);
  }
  if (origin & 64) {
    declareUnboundVariable(parser, name);
  }
}
function addBlockName(parser, context, scope, name, kind, origin) {
  var value = scope['#' + name];
  if (value && (value & 2) === 0) {
    if (kind & 1) {
      scope.scopeError = recordScopeError(parser, 141, name);
    } else if (context & 256 && value & 64 && origin & 2) {} else {
      (0, _errors.report)(parser, 141, name);
    }
  }
  if (scope.type & 128 && scope.parent['#' + name] && (scope.parent['#' + name] & 2) === 0) {
    (0, _errors.report)(parser, 141, name);
  }
  if (scope.type & 1024 && value && (value & 2) === 0) {
    if (kind & 1) {
      scope.scopeError = recordScopeError(parser, 141, name);
    }
  }
  if (scope.type & 64) {
    if (scope.parent['#' + name] & 768) (0, _errors.report)(parser, 154, name);
  }
  scope['#' + name] = kind;
}
function addVarName(parser, context, scope, name, kind) {
  var currentScope = scope;
  while (currentScope && (currentScope.type & 256) === 0) {
    var value = currentScope['#' + name];
    if (value & 248) {
      if (context & 256 && (context & 1024) === 0 && (kind & 128 && value & 68 || value & 128 && kind & 68)) {} else {
        (0, _errors.report)(parser, 141, name);
      }
    }
    if (currentScope === scope) {
      if (value & 1 && kind & 1) {
        currentScope.scopeError = recordScopeError(parser, 141, name);
      }
    }
    if (value & (512 | 256)) {
      if ((value & 512) === 0 || (context & 256) === 0 || context & 1024) {
        (0, _errors.report)(parser, 141, name);
      }
    }
    currentScope['#' + name] = kind;
    currentScope = currentScope.parent;
  }
}
function declareUnboundVariable(parser, name) {
  if (parser.exportedNames !== void 0 && name !== '') {
    if (parser.exportedNames['#' + name]) {
      (0, _errors.report)(parser, 142, name);
    }
    parser.exportedNames['#' + name] = 1;
  }
}
function addBindingToExports(parser, name) {
  if (parser.exportedBindings !== void 0 && name !== '') {
    parser.exportedBindings['#' + name] = 1;
  }
}
function pushComment(context, array) {
  return function (type, value, start, end, loc) {
    var comment = {
      type: type,
      value: value
    };
    if (context & 2) {
      comment.start = start;
      comment.end = end;
      comment.range = [start, end];
    }
    if (context & 4) {
      comment.loc = loc;
    }
    array.push(comment);
  };
}
function pushToken(context, array) {
  return function (token, start, end, loc) {
    var tokens = {
      token: token
    };
    if (context & 2) {
      tokens.start = start;
      tokens.end = end;
      tokens.range = [start, end];
    }
    if (context & 4) {
      tokens.loc = loc;
    }
    array.push(tokens);
  };
}
function isValidIdentifier(context, t) {
  if (context & (1024 | 2097152)) {
    if (context & 2048 && t === 209008) return false;
    if (context & 2097152 && t === 241773) return false;
    return (t & 143360) === 143360 || (t & 12288) === 12288;
  }
  return (t & 143360) === 143360 || (t & 12288) === 12288 || (t & 36864) === 36864;
}
function classifyIdentifier(parser, context, t, isArrow) {
  if ((t & 537079808) === 537079808) {
    if (context & 1024) (0, _errors.report)(parser, 116);
    if (isArrow) parser.flags |= 512;
  }
  if (!isValidIdentifier(context, t)) (0, _errors.report)(parser, 0);
}