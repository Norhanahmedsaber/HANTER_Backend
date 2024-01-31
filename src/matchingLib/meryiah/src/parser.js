"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.parseArguments = parseArguments;
exports.parseArrayExpressionOrPattern = parseArrayExpressionOrPattern;
exports.parseArrowFunctionExpression = parseArrowFunctionExpression;
exports.parseAssignmentExpression = parseAssignmentExpression;
exports.parseAssignmentExpressionOrPattern = parseAssignmentExpressionOrPattern;
exports.parseAsyncArrowOrAsyncFunctionDeclaration = parseAsyncArrowOrAsyncFunctionDeclaration;
exports.parseAsyncArrowOrCallExpression = parseAsyncArrowOrCallExpression;
exports.parseAsyncExpression = parseAsyncExpression;
exports.parseAwaitExpression = parseAwaitExpression;
exports.parseBigIntLiteral = parseBigIntLiteral;
exports.parseBinaryExpression = parseBinaryExpression;
exports.parseBindingPattern = parseBindingPattern;
exports.parseBlock = parseBlock;
exports.parseBreakStatement = parseBreakStatement;
exports.parseCatchBlock = parseCatchBlock;
exports.parseClassBody = parseClassBody;
exports.parseClassDeclaration = parseClassDeclaration;
exports.parseClassExpression = parseClassExpression;
exports.parseComputedPropertyName = parseComputedPropertyName;
exports.parseConditionalExpression = parseConditionalExpression;
exports.parseConsequentOrAlternative = parseConsequentOrAlternative;
exports.parseContinueStatement = parseContinueStatement;
exports.parseDebuggerStatement = parseDebuggerStatement;
exports.parseDecoratorList = parseDecoratorList;
exports.parseDecorators = parseDecorators;
exports.parseDirective = parseDirective;
exports.parseDoWhileStatement = parseDoWhileStatement;
exports.parseEmptyStatement = parseEmptyStatement;
exports.parseExpression = parseExpression;
exports.parseExpressionOrLabelledStatement = parseExpressionOrLabelledStatement;
exports.parseExpressionStatement = parseExpressionStatement;
exports.parseExpressions = parseExpressions;
exports.parseForStatement = parseForStatement;
exports.parseFormalParametersOrFormalList = parseFormalParametersOrFormalList;
exports.parseFunctionBody = parseFunctionBody;
exports.parseFunctionDeclaration = parseFunctionDeclaration;
exports.parseFunctionExpression = parseFunctionExpression;
exports.parseIdentifier = parseIdentifier;
exports.parseIdentifierOrArrow = parseIdentifierOrArrow;
exports.parseIfStatement = parseIfStatement;
exports.parseImportExpression = parseImportExpression;
exports.parseImportMetaDeclaration = parseImportMetaDeclaration;
exports.parseImportMetaExpression = parseImportMetaExpression;
exports.parseIterationStatementBody = parseIterationStatementBody;
exports.parseJSXAttributes = parseJSXAttributes;
exports.parseJSXChildren = parseJSXChildren;
exports.parseJSXClosingFragment = parseJSXClosingFragment;
exports.parseJSXIdentifier = parseJSXIdentifier;
exports.parseJSXMemberExpression = parseJSXMemberExpression;
exports.parseJSXSpreadAttribute = parseJSXSpreadAttribute;
exports.parseJSXText = parseJSXText;
exports.parseLabelledStatement = parseLabelledStatement;
exports.parseLeftHandSideExpression = parseLeftHandSideExpression;
exports.parseLetIdentOrVarDeclarationStatement = parseLetIdentOrVarDeclarationStatement;
exports.parseLiteral = parseLiteral;
exports.parseMembeExpressionNoCall = parseMembeExpressionNoCall;
exports.parseMemberOrUpdateExpression = parseMemberOrUpdateExpression;
exports.parseMetaProperty = parseMetaProperty;
exports.parseMethodDefinition = parseMethodDefinition;
exports.parseMethodFormals = parseMethodFormals;
exports.parseModuleItem = parseModuleItem;
exports.parseModuleItemList = parseModuleItemList;
exports.parseNewExpression = parseNewExpression;
exports.parseNullOrTrueOrFalseLiteral = parseNullOrTrueOrFalseLiteral;
exports.parseObjectLiteralOrPattern = parseObjectLiteralOrPattern;
exports.parseOpeningFragment = parseOpeningFragment;
exports.parseOptionalChain = parseOptionalChain;
exports.parseParenthesizedExpression = parseParenthesizedExpression;
exports.parsePrimaryExpression = parsePrimaryExpression;
exports.parsePropertyDefinition = parsePropertyDefinition;
exports.parsePropertyOrPrivatePropertyName = parsePropertyOrPrivatePropertyName;
exports.parseRegExpLiteral = parseRegExpLiteral;
exports.parseRestrictedIdentifier = parseRestrictedIdentifier;
exports.parseReturnStatement = parseReturnStatement;
exports.parseSequenceExpression = parseSequenceExpression;
exports.parseSource = parseSource;
exports.parseStatement = parseStatement;
exports.parseStatementList = parseStatementList;
exports.parseStatementListItem = parseStatementListItem;
exports.parseStaticBlock = parseStaticBlock;
exports.parseSuperExpression = parseSuperExpression;
exports.parseSwitchStatement = parseSwitchStatement;
exports.parseTemplate = parseTemplate;
exports.parseTemplateElement = parseTemplateElement;
exports.parseTemplateLiteral = parseTemplateLiteral;
exports.parseThisExpression = parseThisExpression;
exports.parseThrowStatement = parseThrowStatement;
exports.parseTryStatement = parseTryStatement;
exports.parseUnaryExpression = parseUnaryExpression;
exports.parseUpdateExpressionPrefixed = parseUpdateExpressionPrefixed;
exports.parseVariableDeclarationList = parseVariableDeclarationList;
exports.parseVariableStatement = parseVariableStatement;
exports.parseWhileStatement = parseWhileStatement;
exports.parseWithStatement = parseWithStatement;
exports.parseYieldExpression = parseYieldExpression;
var _lexer = require("./lexer");
var _token6 = require("./token");
var _errors = require("./errors");
var _template = require("./lexer/template");
var _jsx = require("./lexer/jsx");
var _common = require("./common");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function create(source, sourceFile, onComment, onToken) {
  return {
    source: source,
    flags: 0,
    index: 0,
    line: 1,
    column: 0,
    startPos: 0,
    end: source.length,
    tokenPos: 0,
    startColumn: 0,
    colPos: 0,
    linePos: 1,
    startLine: 1,
    sourceFile: sourceFile,
    tokenValue: '',
    token: 1048576,
    tokenRaw: '',
    tokenRegExp: void 0,
    currentChar: source.charCodeAt(0),
    exportedNames: [],
    exportedBindings: [],
    assignable: 1,
    destructible: 0,
    onComment: onComment,
    onToken: onToken,
    leadingDecorators: []
  };
}
function parseSource(source, options, context) {
  var sourceFile = '';
  var onComment;
  var onToken;
  if (options != null) {
    if (options.module) context |= 2048 | 1024;
    if (options.next) context |= 1;
    if (options.loc) context |= 4;
    if (options.ranges) context |= 2;
    if (options.uniqueKeyInPattern) context |= -2147483648;
    if (options.lexical) context |= 64;
    if (options.webcompat) context |= 256;
    if (options.directives) context |= 8 | 512;
    if (options.globalReturn) context |= 32;
    if (options.raw) context |= 512;
    if (options.preserveParens) context |= 128;
    if (options.impliedStrict) context |= 1024;
    if (options.jsx) context |= 16;
    if (options.identifierPattern) context |= 268435456;
    if (options.specDeviation) context |= 536870912;
    if (options.source) sourceFile = options.source;
    if (options.onComment != null) {
      onComment = Array.isArray(options.onComment) ? (0, _common.pushComment)(context, options.onComment) : options.onComment;
    }
    if (options.onToken != null) {
      onToken = Array.isArray(options.onToken) ? (0, _common.pushToken)(context, options.onToken) : options.onToken;
    }
  }
  var parser = create(source, sourceFile, onComment, onToken);
  if (context & 1) (0, _lexer.skipHashBang)(parser);
  var scope = context & 64 ? (0, _common.createScope)() : void 0;
  var body = [];
  var sourceType = 'script';
  if (context & 2048) {
    sourceType = 'module';
    body = parseModuleItemList(parser, context | 8192, scope);
    if (scope) {
      for (var key in parser.exportedBindings) {
        if (key[0] === '#' && !scope[key]) (0, _errors.report)(parser, 143, key.slice(1));
      }
    }
  } else {
    body = parseStatementList(parser, context | 8192, scope);
  }
  var node = {
    type: 'Program',
    sourceType: sourceType,
    body: body
  };
  if (context & 2) {
    node.start = 0;
    node.end = source.length;
    node.range = [0, source.length];
  }
  if (context & 4) {
    node.loc = {
      start: {
        line: 1,
        column: 0
      },
      end: {
        line: parser.line,
        column: parser.column
      }
    };
    if (parser.sourceFile) node.loc.source = sourceFile;
  }
  return node;
}
function parseStatementList(parser, context, scope) {
  (0, _lexer.nextToken)(parser, context | 32768 | 1073741824);
  var statements = [];
  while (parser.token === 134283267) {
    var index = parser.index,
      tokenPos = parser.tokenPos,
      tokenValue = parser.tokenValue,
      linePos = parser.linePos,
      colPos = parser.colPos,
      token = parser.token;
    var expr = parseLiteral(parser, context);
    if ((0, _common.isValidStrictMode)(parser, index, tokenPos, tokenValue)) context |= 1024;
    statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
  }
  while (parser.token !== 1048576) {
    statements.push(parseStatementListItem(parser, context, scope, 4, {}));
  }
  return statements;
}
function parseModuleItemList(parser, context, scope) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var statements = [];
  if (context & 8) {
    while (parser.token === 134283267) {
      var tokenPos = parser.tokenPos,
        linePos = parser.linePos,
        colPos = parser.colPos,
        token = parser.token;
      statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
    }
  }
  while (parser.token !== 1048576) {
    statements.push(parseModuleItem(parser, context, scope));
  }
  return statements;
}
function parseModuleItem(parser, context, scope) {
  parser.leadingDecorators = parseDecorators(parser, context);
  var moduleItem;
  switch (parser.token) {
    case 20566:
      moduleItem = parseExportDeclaration(parser, context, scope);
      break;
    case 86108:
      moduleItem = parseImportDeclaration(parser, context, scope);
      break;
    default:
      moduleItem = parseStatementListItem(parser, context, scope, 4, {});
  }
  if (parser.leadingDecorators.length) {
    (0, _errors.report)(parser, 165);
  }
  return moduleItem;
}
function parseStatementListItem(parser, context, scope, origin, labels) {
  var start = parser.tokenPos;
  var line = parser.linePos;
  var column = parser.colPos;
  switch (parser.token) {
    case 86106:
      return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 0, start, line, column);
    case 133:
    case 86096:
      return parseClassDeclaration(parser, context, scope, 0, start, line, column);
    case 86092:
      return parseLexicalDeclaration(parser, context, scope, 16, 0, start, line, column);
    case 241739:
      return parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column);
    case 20566:
      (0, _errors.report)(parser, 101, 'export');
    case 86108:
      (0, _lexer.nextToken)(parser, context);
      switch (parser.token) {
        case 67174411:
          return parseImportCallDeclaration(parser, context, start, line, column);
        case 67108877:
          return parseImportMetaDeclaration(parser, context, start, line, column);
        default:
          (0, _errors.report)(parser, 101, 'import');
      }
    case 209007:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 1, start, line, column);
    default:
      return parseStatement(parser, context, scope, origin, labels, 1, start, line, column);
  }
}
function parseStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
  switch (parser.token) {
    case 86090:
      return parseVariableStatement(parser, context, scope, 0, start, line, column);
    case 20574:
      return parseReturnStatement(parser, context, start, line, column);
    case 20571:
      return parseIfStatement(parser, context, scope, labels, start, line, column);
    case 20569:
      return parseForStatement(parser, context, scope, labels, start, line, column);
    case 20564:
      return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
    case 20580:
      return parseWhileStatement(parser, context, scope, labels, start, line, column);
    case 86112:
      return parseSwitchStatement(parser, context, scope, labels, start, line, column);
    case 1074790417:
      return parseEmptyStatement(parser, context, start, line, column);
    case 2162700:
      return parseBlock(parser, context, scope ? (0, _common.addChildScope)(scope, 2) : scope, labels, start, line, column);
    case 86114:
      return parseThrowStatement(parser, context, start, line, column);
    case 20557:
      return parseBreakStatement(parser, context, labels, start, line, column);
    case 20561:
      return parseContinueStatement(parser, context, labels, start, line, column);
    case 20579:
      return parseTryStatement(parser, context, scope, labels, start, line, column);
    case 20581:
      return parseWithStatement(parser, context, scope, labels, start, line, column);
    case 20562:
      return parseDebuggerStatement(parser, context, start, line, column);
    case 209007:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 0, start, line, column);
    case 139:
      return parseGeneral(parser, context, start, line, column);
    case 20559:
      (0, _errors.report)(parser, 157);
    case 20568:
      (0, _errors.report)(parser, 158);
    case 86106:
      (0, _errors.report)(parser, context & 1024 ? 74 : (context & 256) === 0 ? 76 : 75);
    case 86096:
      (0, _errors.report)(parser, 77);
    default:
      return parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column);
  }
}
function parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
  var tokenValue = parser.tokenValue,
    token = parser.token;
  var expr;
  switch (token) {
    case 241739:
      expr = parseIdentifier(parser, context, 0);
      if (context & 1024) (0, _errors.report)(parser, 83);
      if (parser.token === 69271571) (0, _errors.report)(parser, 82);
      break;
    default:
      expr = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  }
  if (token & 143360 && parser.token === 21) {
    return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
  }
  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
  expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
  if (parser.token === 18) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }
  return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseBlock(parser, context, scope, labels, start, line, column) {
  var body = [];
  (0, _common.consume)(parser, context | 32768, 2162700);
  while (parser.token !== 1074790415) {
    body.push(parseStatementListItem(parser, context, scope, 2, {
      $: labels
    }));
  }
  (0, _common.consume)(parser, context | 32768, 1074790415);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'BlockStatement',
    body: body
  });
}
function parseReturnStatement(parser, context, start, line, column) {
  if ((context & 32) === 0 && context & 8192) (0, _errors.report)(parser, 90);
  (0, _lexer.nextToken)(parser, context | 32768);
  var argument = parser.flags & 1 || parser.token & 1048576 ? null : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ReturnStatement',
    argument: argument
  });
}
function parseExpressionStatement(parser, context, expression, start, line, column) {
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ExpressionStatement',
    expression: expression
  });
}
function parseLabelledStatement(parser, context, scope, origin, labels, value, expr, token, allowFuncDecl, start, line, column) {
  (0, _common.validateBindingIdentifier)(parser, context, 0, token, 1);
  (0, _common.validateAndDeclareLabel)(parser, labels, value);
  (0, _lexer.nextToken)(parser, context | 32768);
  var body = allowFuncDecl && (context & 1024) === 0 && context & 256 && parser.token === 86106 ? parseFunctionDeclaration(parser, context, (0, _common.addChildScope)(scope, 2), origin, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos) : parseStatement(parser, context, scope, origin, labels, allowFuncDecl, parser.tokenPos, parser.linePos, parser.colPos);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'LabeledStatement',
    label: expr,
    body: body
  });
}
function parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
  var token = parser.token,
    tokenValue = parser.tokenValue;
  var expr = parseIdentifier(parser, context, 0);
  if (parser.token === 21) {
    return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, 1, start, line, column);
  }
  var asyncNewLine = parser.flags & 1;
  if (!asyncNewLine) {
    if (parser.token === 86106) {
      if (!allowFuncDecl) (0, _errors.report)(parser, 120);
      return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 1, start, line, column);
    }
    if ((parser.token & 143360) === 143360) {
      expr = parseAsyncArrowAfterIdent(parser, context, 1, start, line, column);
      if (parser.token === 18) expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
      return parseExpressionStatement(parser, context, expr, start, line, column);
    }
  }
  if (parser.token === 67174411) {
    expr = parseAsyncArrowOrCallExpression(parser, context, expr, 1, 1, 0, asyncNewLine, start, line, column);
  } else {
    if (parser.token === 10) {
      (0, _common.classifyIdentifier)(parser, context, token, 1);
      expr = parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, 0, 1, 0, start, line, column);
    }
    parser.assignable = 1;
  }
  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
  if (parser.token === 18) expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
  parser.assignable = 1;
  return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseDirective(parser, context, expression, token, start, line, column) {
  if (token !== 1074790417) {
    parser.assignable = 2;
    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
    if (parser.token !== 1074790417) {
      expression = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expression);
      if (parser.token === 18) {
        expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
      }
    }
    (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  }
  return context & 8 && expression.type === 'Literal' && typeof expression.value === 'string' ? (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ExpressionStatement',
    expression: expression,
    directive: expression.raw.slice(1, -1)
  }) : (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ExpressionStatement',
    expression: expression
  });
}
function parseEmptyStatement(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'EmptyStatement'
  });
}
function parseThrowStatement(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  if (parser.flags & 1) (0, _errors.report)(parser, 88);
  var argument = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ThrowStatement',
    argument: argument
  });
}
function parseIfStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  (0, _common.consume)(parser, context | 32768, 67174411);
  parser.assignable = 1;
  var test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 16);
  var consequent = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
  var alternate = null;
  if (parser.token === 20565) {
    (0, _lexer.nextToken)(parser, context | 32768);
    alternate = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'IfStatement',
    test: test,
    consequent: consequent,
    alternate: alternate
  });
}
function parseConsequentOrAlternative(parser, context, scope, labels, start, line, column) {
  return context & 1024 || (context & 256) === 0 || parser.token !== 86106 ? parseStatement(parser, context, scope, 0, {
    $: labels
  }, 0, parser.tokenPos, parser.linePos, parser.colPos) : parseFunctionDeclaration(parser, context, (0, _common.addChildScope)(scope, 2), 0, 0, 0, 0, start, line, column);
}
function parseSwitchStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  (0, _common.consume)(parser, context | 32768, 67174411);
  var discriminant = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context, 16);
  (0, _common.consume)(parser, context, 2162700);
  var cases = [];
  var seenDefault = 0;
  if (scope) scope = (0, _common.addChildScope)(scope, 8);
  while (parser.token !== 1074790415) {
    var tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    var test = null;
    var consequent = [];
    if ((0, _common.consumeOpt)(parser, context | 32768, 20558)) {
      test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    } else {
      (0, _common.consume)(parser, context | 32768, 20563);
      if (seenDefault) (0, _errors.report)(parser, 87);
      seenDefault = 1;
    }
    (0, _common.consume)(parser, context | 32768, 21);
    while (parser.token !== 20558 && parser.token !== 1074790415 && parser.token !== 20563) {
      consequent.push(parseStatementListItem(parser, context | 4096, scope, 2, {
        $: labels
      }));
    }
    cases.push((0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
      type: 'SwitchCase',
      test: test,
      consequent: consequent
    }));
  }
  (0, _common.consume)(parser, context | 32768, 1074790415);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'SwitchStatement',
    discriminant: discriminant,
    cases: cases
  });
}
function parseWhileStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  (0, _common.consume)(parser, context | 32768, 67174411);
  var test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 16);
  var body = parseIterationStatementBody(parser, context, scope, labels);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'WhileStatement',
    test: test,
    body: body
  });
}
function parseIterationStatementBody(parser, context, scope, labels) {
  return parseStatement(parser, (context | 134217728) ^ 134217728 | 131072, scope, 0, {
    loop: 1,
    $: labels
  }, 0, parser.tokenPos, parser.linePos, parser.colPos);
}
function parseContinueStatement(parser, context, labels, start, line, column) {
  if ((context & 131072) === 0) (0, _errors.report)(parser, 66);
  (0, _lexer.nextToken)(parser, context);
  var label = null;
  if ((parser.flags & 1) === 0 && parser.token & 143360) {
    var tokenValue = parser.tokenValue;
    label = parseIdentifier(parser, context | 32768, 0);
    if (!(0, _common.isValidLabel)(parser, labels, tokenValue, 1)) (0, _errors.report)(parser, 135, tokenValue);
  }
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ContinueStatement',
    label: label
  });
}
function parseBreakStatement(parser, context, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var label = null;
  if ((parser.flags & 1) === 0 && parser.token & 143360) {
    var tokenValue = parser.tokenValue;
    label = parseIdentifier(parser, context | 32768, 0);
    if (!(0, _common.isValidLabel)(parser, labels, tokenValue, 0)) (0, _errors.report)(parser, 135, tokenValue);
  } else if ((context & (4096 | 131072)) === 0) {
    (0, _errors.report)(parser, 67);
  }
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'BreakStatement',
    label: label
  });
}
function parseWithStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  if (context & 1024) (0, _errors.report)(parser, 89);
  (0, _common.consume)(parser, context | 32768, 67174411);
  var object = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 16);
  var body = parseStatement(parser, context, scope, 2, labels, 0, parser.tokenPos, parser.linePos, parser.colPos);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'WithStatement',
    object: object,
    body: body
  });
}
function parseDebuggerStatement(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'DebuggerStatement'
  });
}
function parseTryStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var firstScope = scope ? (0, _common.addChildScope)(scope, 32) : void 0;
  var block = parseBlock(parser, context, firstScope, {
    $: labels
  }, parser.tokenPos, parser.linePos, parser.colPos);
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  var handler = (0, _common.consumeOpt)(parser, context | 32768, 20559) ? parseCatchBlock(parser, context, scope, labels, tokenPos, linePos, colPos) : null;
  var finalizer = null;
  if (parser.token === 20568) {
    (0, _lexer.nextToken)(parser, context | 32768);
    var finalizerScope = firstScope ? (0, _common.addChildScope)(scope, 4) : void 0;
    finalizer = parseBlock(parser, context, finalizerScope, {
      $: labels
    }, parser.tokenPos, parser.linePos, parser.colPos);
  }
  if (!handler && !finalizer) {
    (0, _errors.report)(parser, 86);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'TryStatement',
    block: block,
    handler: handler,
    finalizer: finalizer
  });
}
function parseCatchBlock(parser, context, scope, labels, start, line, column) {
  var param = null;
  var additionalScope = scope;
  if ((0, _common.consumeOpt)(parser, context, 67174411)) {
    if (scope) scope = (0, _common.addChildScope)(scope, 4);
    param = parseBindingPattern(parser, context, scope, (parser.token & 2097152) === 2097152 ? 256 : 512, 0, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.token === 18) {
      (0, _errors.report)(parser, 84);
    } else if (parser.token === 1077936157) {
      (0, _errors.report)(parser, 85);
    }
    (0, _common.consume)(parser, context | 32768, 16);
    if (scope) additionalScope = (0, _common.addChildScope)(scope, 64);
  }
  var body = parseBlock(parser, context, additionalScope, {
    $: labels
  }, parser.tokenPos, parser.linePos, parser.colPos);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'CatchClause',
    param: param,
    body: body
  });
}
function parseStaticBlock(parser, context, scope, start, line, column) {
  if (scope) scope = (0, _common.addChildScope)(scope, 2);
  var ctorContext = 16384 | 524288;
  context = (context | ctorContext) ^ ctorContext | 262144;
  var _parseBlock = parseBlock(parser, context, scope, {}, start, line, column),
    body = _parseBlock.body;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'StaticBlock',
    body: body
  });
}
function parseDoWhileStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var body = parseIterationStatementBody(parser, context, scope, labels);
  (0, _common.consume)(parser, context, 20580);
  (0, _common.consume)(parser, context | 32768, 67174411);
  var test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 16);
  (0, _common.consumeOpt)(parser, context | 32768, 1074790417);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'DoWhileStatement',
    body: body,
    test: test
  });
}
function parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column) {
  var token = parser.token,
    tokenValue = parser.tokenValue;
  var expr = parseIdentifier(parser, context, 0);
  if (parser.token & (143360 | 2097152)) {
    var declarations = parseVariableDeclarationList(parser, context, scope, 8, 0);
    (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'VariableDeclaration',
      kind: 'let',
      declarations: declarations
    });
  }
  parser.assignable = 1;
  if (context & 1024) (0, _errors.report)(parser, 83);
  if (parser.token === 21) {
    return parseLabelledStatement(parser, context, scope, origin, {}, tokenValue, expr, token, 0, start, line, column);
  }
  if (parser.token === 10) {
    var _scope = void 0;
    if (context & 64) _scope = (0, _common.createArrowHeadParsingScope)(parser, context, tokenValue);
    parser.flags = (parser.flags | 128) ^ 128;
    expr = parseArrowFunctionExpression(parser, context, _scope, [expr], 0, start, line, column);
  } else {
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
  }
  if (parser.token === 18) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }
  return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseLexicalDeclaration(parser, context, scope, kind, origin, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  var declarations = parseVariableDeclarationList(parser, context, scope, kind, origin);
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'VariableDeclaration',
    kind: kind & 8 ? 'let' : 'const',
    declarations: declarations
  });
}
function parseVariableStatement(parser, context, scope, origin, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  var declarations = parseVariableDeclarationList(parser, context, scope, 4, origin);
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'VariableDeclaration',
    kind: 'var',
    declarations: declarations
  });
}
function parseVariableDeclarationList(parser, context, scope, kind, origin) {
  var bindingCount = 1;
  var list = [parseVariableDeclaration(parser, context, scope, kind, origin)];
  while ((0, _common.consumeOpt)(parser, context, 18)) {
    bindingCount++;
    list.push(parseVariableDeclaration(parser, context, scope, kind, origin));
  }
  if (bindingCount > 1 && origin & 32 && parser.token & 262144) {
    (0, _errors.report)(parser, 59, _token6.KeywordDescTable[parser.token & 255]);
  }
  return list;
}
function parseVariableDeclaration(parser, context, scope, kind, origin) {
  var token = parser.token,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  var init = null;
  var id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);
  if (parser.token === 1077936157) {
    (0, _lexer.nextToken)(parser, context | 32768);
    init = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    if (origin & 32 || (token & 2097152) === 0) {
      if (parser.token === 274549 || parser.token === 8738868 && (token & 2097152 || (kind & 4) === 0 || context & 1024)) {
        (0, _errors.reportMessageAt)(tokenPos, parser.line, parser.index - 3, 58, parser.token === 274549 ? 'of' : 'in');
      }
    }
  } else if ((kind & 16 || (token & 2097152) > 0) && (parser.token & 262144) !== 262144) {
    (0, _errors.report)(parser, 57, kind & 16 ? 'const' : 'destructuring');
  }
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
    type: 'VariableDeclarator',
    id: id,
    init: init
  });
}
function parseForStatement(parser, context, scope, labels, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  var forAwait = ((context & 4194304) > 0 || (context & 2048) > 0 && (context & 8192) > 0) && (0, _common.consumeOpt)(parser, context, 209008);
  (0, _common.consume)(parser, context | 32768, 67174411);
  if (scope) scope = (0, _common.addChildScope)(scope, 1);
  var test = null;
  var update = null;
  var destructible = 0;
  var init = null;
  var isVarDecl = parser.token === 86090 || parser.token === 241739 || parser.token === 86092;
  var right;
  var token = parser.token,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  if (isVarDecl) {
    if (token === 241739) {
      init = parseIdentifier(parser, context, 0);
      if (parser.token & (143360 | 2097152 | 139)) {
        if (parser.token === 8738868) {
          if (context & 1024) (0, _errors.report)(parser, 65);
        } else {
          init = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 8, 32)
          });
        }
        parser.assignable = 1;
      } else if (context & 1024) {
        (0, _errors.report)(parser, 65);
      } else {
        isVarDecl = false;
        parser.assignable = 1;
        init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenPos, linePos, colPos);
        if (parser.token === 274549) (0, _errors.report)(parser, 112);
      }
    } else {
      (0, _lexer.nextToken)(parser, context);
      init = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, token === 86090 ? {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 4, 32)
      } : {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 16, 32)
      });
      parser.assignable = 1;
    }
  } else if (token === 139) {
    init = parseGeneral(parser, context, start, line, column);
    if (parser.token === 16) {
      (0, _common.consume)(parser, context | 32768, 16);
      var _body = parseIterationStatementBody(parser, context, scope, labels);
      return (0, _common.finishNode)(parser, context, start, line, column, {
        type: 'ForGeneralStatement',
        expression: init,
        body: _body
      });
    }
  } else if (token === 1074790417) {
    if (forAwait) (0, _errors.report)(parser, 80);
  } else if ((token & 2097152) === 2097152) {
    init = token === 2162700 ? parseObjectLiteralOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos) : parseArrayExpressionOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos);
    destructible = parser.destructible;
    if (context & 256 && destructible & 64) {
      (0, _errors.report)(parser, 61);
    }
    parser.assignable = destructible & 16 ? 2 : 1;
    init = parseMemberOrUpdateExpression(parser, context | 134217728, init, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  } else {
    init = parseLeftHandSideExpression(parser, context | 134217728, 1, 0, 1, tokenPos, linePos, colPos);
  }
  if ((parser.token & 262144) === 262144) {
    if (parser.token === 274549) {
      if (parser.assignable & 2) (0, _errors.report)(parser, 78, forAwait ? 'await' : 'of');
      (0, _common.reinterpretToPattern)(parser, init);
      (0, _lexer.nextToken)(parser, context | 32768);
      right = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      (0, _common.consume)(parser, context | 32768, 16);
      var _body2 = parseIterationStatementBody(parser, context, scope, labels);
      return (0, _common.finishNode)(parser, context, start, line, column, {
        type: 'ForOfStatement',
        left: init,
        right: right,
        body: _body2,
        "await": forAwait
      });
    }
    if (parser.assignable & 2) (0, _errors.report)(parser, 78, 'in');
    (0, _common.reinterpretToPattern)(parser, init);
    (0, _lexer.nextToken)(parser, context | 32768);
    if (forAwait) (0, _errors.report)(parser, 80);
    right = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    (0, _common.consume)(parser, context | 32768, 16);
    var _body3 = parseIterationStatementBody(parser, context, scope, labels);
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'ForInStatement',
      body: _body3,
      left: init,
      right: right
    });
  }
  if (forAwait) (0, _errors.report)(parser, 80);
  if (!isVarDecl) {
    if (destructible & 8 && parser.token !== 1077936157) {
      (0, _errors.report)(parser, 78, 'loop');
    }
    init = parseAssignmentExpression(parser, context | 134217728, 0, 0, tokenPos, linePos, colPos, init);
  }
  if (parser.token === 18) init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);
  (0, _common.consume)(parser, context | 32768, 1074790417);
  if (parser.token !== 1074790417) test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 1074790417);
  if (parser.token !== 16) update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 16);
  var body = parseIterationStatementBody(parser, context, scope, labels);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ForStatement',
    init: init,
    test: test,
    update: update,
    body: body
  });
}
function parseRestrictedIdentifier(parser, context, scope) {
  if (!(0, _common.isValidIdentifier)(context, parser.token)) (0, _errors.report)(parser, 115);
  if ((parser.token & 537079808) === 537079808) (0, _errors.report)(parser, 116);
  if (scope) (0, _common.addBlockName)(parser, context, scope, parser.tokenValue, 8, 0);
  return parseIdentifier(parser, context, 0);
}
function parseImportDeclaration(parser, context, scope) {
  var start = parser.tokenPos;
  var line = parser.linePos;
  var column = parser.colPos;
  (0, _lexer.nextToken)(parser, context);
  var source = null;
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  var specifiers = [];
  if (parser.token === 134283267) {
    source = parseLiteral(parser, context);
  } else {
    if (parser.token & 143360) {
      var local = parseRestrictedIdentifier(parser, context, scope);
      specifiers = [(0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
        type: 'ImportDefaultSpecifier',
        local: local
      })];
      if ((0, _common.consumeOpt)(parser, context, 18)) {
        switch (parser.token) {
          case 8457014:
            specifiers.push(parseImportNamespaceSpecifier(parser, context, scope));
            break;
          case 2162700:
            parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
            break;
          default:
            (0, _errors.report)(parser, 105);
        }
      }
    } else {
      switch (parser.token) {
        case 8457014:
          specifiers = [parseImportNamespaceSpecifier(parser, context, scope)];
          break;
        case 2162700:
          parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
          break;
        case 67174411:
          return parseImportCallDeclaration(parser, context, start, line, column);
        case 67108877:
          return parseImportMetaDeclaration(parser, context, start, line, column);
        default:
          (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
      }
    }
    source = parseModuleSpecifier(parser, context);
  }
  (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ImportDeclaration',
    specifiers: specifiers,
    source: source
  });
}
function parseImportNamespaceSpecifier(parser, context, scope) {
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _lexer.nextToken)(parser, context);
  (0, _common.consume)(parser, context, 77934);
  if ((parser.token & 134217728) === 134217728) {
    (0, _errors.reportMessageAt)(tokenPos, parser.line, parser.index, 28, _token6.KeywordDescTable[parser.token & 255]);
  }
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
    type: 'ImportNamespaceSpecifier',
    local: parseRestrictedIdentifier(parser, context, scope)
  });
}
function parseModuleSpecifier(parser, context) {
  (0, _common.consumeOpt)(parser, context, 12404);
  if (parser.token !== 134283267) (0, _errors.report)(parser, 103, 'Import');
  return parseLiteral(parser, context);
}
function parseImportSpecifierOrNamedImports(parser, context, scope, specifiers) {
  (0, _lexer.nextToken)(parser, context);
  while (parser.token & 143360) {
    var token = parser.token,
      tokenValue = parser.tokenValue,
      tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    var imported = parseIdentifier(parser, context, 0);
    var local = void 0;
    if ((0, _common.consumeOpt)(parser, context, 77934)) {
      if ((parser.token & 134217728) === 134217728 || parser.token === 18) {
        (0, _errors.report)(parser, 104);
      } else {
        (0, _common.validateBindingIdentifier)(parser, context, 16, parser.token, 0);
      }
      tokenValue = parser.tokenValue;
      local = parseIdentifier(parser, context, 0);
    } else {
      (0, _common.validateBindingIdentifier)(parser, context, 16, token, 0);
      local = imported;
    }
    if (scope) (0, _common.addBlockName)(parser, context, scope, tokenValue, 8, 0);
    specifiers.push((0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
      type: 'ImportSpecifier',
      local: local,
      imported: imported
    }));
    if (parser.token !== 1074790415) (0, _common.consume)(parser, context, 18);
  }
  (0, _common.consume)(parser, context, 1074790415);
  return specifiers;
}
function parseImportMetaDeclaration(parser, context, start, line, column) {
  var expr = parseImportMetaExpression(parser, context, (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'Identifier',
    name: 'import'
  }), start, line, column);
  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
  expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
  return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseImportCallDeclaration(parser, context, start, line, column) {
  var expr = parseImportExpression(parser, context, 0, start, line, column);
  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
  if (parser.token === 18) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }
  return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseExportDeclaration(parser, context, scope) {
  var start = parser.tokenPos;
  var line = parser.linePos;
  var column = parser.colPos;
  (0, _lexer.nextToken)(parser, context | 32768);
  var specifiers = [];
  var declaration = null;
  var source = null;
  var key;
  if ((0, _common.consumeOpt)(parser, context | 32768, 20563)) {
    switch (parser.token) {
      case 86106:
        {
          declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
          break;
        }
      case 133:
      case 86096:
        declaration = parseClassDeclaration(parser, context, scope, 1, parser.tokenPos, parser.linePos, parser.colPos);
        break;
      case 209007:
        var tokenPos = parser.tokenPos,
          linePos = parser.linePos,
          colPos = parser.colPos;
        declaration = parseIdentifier(parser, context, 0);
        var flags = parser.flags;
        if ((flags & 1) === 0) {
          if (parser.token === 86106) {
            declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 1, tokenPos, linePos, colPos);
          } else {
            if (parser.token === 67174411) {
              declaration = parseAsyncArrowOrCallExpression(parser, context, declaration, 1, 1, 0, flags, tokenPos, linePos, colPos);
              declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, tokenPos, linePos, colPos);
              declaration = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, declaration);
            } else if (parser.token & 143360) {
              if (scope) scope = (0, _common.createArrowHeadParsingScope)(parser, context, parser.tokenValue);
              declaration = parseIdentifier(parser, context, 0);
              declaration = parseArrowFunctionExpression(parser, context, scope, [declaration], 1, tokenPos, linePos, colPos);
            }
          }
        }
        break;
      default:
        declaration = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
    }
    if (scope) (0, _common.declareUnboundVariable)(parser, 'default');
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'ExportDefaultDeclaration',
      declaration: declaration
    });
  }
  switch (parser.token) {
    case 8457014:
      {
        (0, _lexer.nextToken)(parser, context);
        var exported = null;
        var isNamedDeclaration = (0, _common.consumeOpt)(parser, context, 77934);
        if (isNamedDeclaration) {
          if (scope) (0, _common.declareUnboundVariable)(parser, parser.tokenValue);
          exported = parseIdentifier(parser, context, 0);
        }
        (0, _common.consume)(parser, context, 12404);
        if (parser.token !== 134283267) (0, _errors.report)(parser, 103, 'Export');
        source = parseLiteral(parser, context);
        (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
        return (0, _common.finishNode)(parser, context, start, line, column, {
          type: 'ExportAllDeclaration',
          source: source,
          exported: exported
        });
      }
    case 2162700:
      {
        (0, _lexer.nextToken)(parser, context);
        var tmpExportedNames = [];
        var tmpExportedBindings = [];
        while (parser.token & 143360) {
          var _tokenPos = parser.tokenPos,
            tokenValue = parser.tokenValue,
            _linePos = parser.linePos,
            _colPos = parser.colPos;
          var local = parseIdentifier(parser, context, 0);
          var _exported = void 0;
          if (parser.token === 77934) {
            (0, _lexer.nextToken)(parser, context);
            if ((parser.token & 134217728) === 134217728) {
              (0, _errors.report)(parser, 104);
            }
            if (scope) {
              tmpExportedNames.push(parser.tokenValue);
              tmpExportedBindings.push(tokenValue);
            }
            _exported = parseIdentifier(parser, context, 0);
          } else {
            if (scope) {
              tmpExportedNames.push(parser.tokenValue);
              tmpExportedBindings.push(parser.tokenValue);
            }
            _exported = local;
          }
          specifiers.push((0, _common.finishNode)(parser, context, _tokenPos, _linePos, _colPos, {
            type: 'ExportSpecifier',
            local: local,
            exported: _exported
          }));
          if (parser.token !== 1074790415) (0, _common.consume)(parser, context, 18);
        }
        (0, _common.consume)(parser, context, 1074790415);
        if ((0, _common.consumeOpt)(parser, context, 12404)) {
          if (parser.token !== 134283267) (0, _errors.report)(parser, 103, 'Export');
          source = parseLiteral(parser, context);
        } else if (scope) {
          var i = 0;
          var iMax = tmpExportedNames.length;
          for (; i < iMax; i++) {
            (0, _common.declareUnboundVariable)(parser, tmpExportedNames[i]);
          }
          i = 0;
          iMax = tmpExportedBindings.length;
          for (; i < iMax; i++) {
            (0, _common.addBindingToExports)(parser, tmpExportedBindings[i]);
          }
        }
        (0, _common.matchOrInsertSemicolon)(parser, context | 32768);
        break;
      }
    case 86096:
      declaration = parseClassDeclaration(parser, context, scope, 2, parser.tokenPos, parser.linePos, parser.colPos);
      break;
    case 86106:
      declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 0, parser.tokenPos, parser.linePos, parser.colPos);
      break;
    case 241739:
      declaration = parseLexicalDeclaration(parser, context, scope, 8, 64, parser.tokenPos, parser.linePos, parser.colPos);
      break;
    case 86092:
      declaration = parseLexicalDeclaration(parser, context, scope, 16, 64, parser.tokenPos, parser.linePos, parser.colPos);
      break;
    case 86090:
      declaration = parseVariableStatement(parser, context, scope, 64, parser.tokenPos, parser.linePos, parser.colPos);
      break;
    case 209007:
      var _tokenPos2 = parser.tokenPos,
        _linePos2 = parser.linePos,
        _colPos2 = parser.colPos;
      (0, _lexer.nextToken)(parser, context);
      if ((parser.flags & 1) === 0 && parser.token === 86106) {
        declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 1, _tokenPos2, _linePos2, _colPos2);
        if (scope) {
          key = declaration.id ? declaration.id.name : '';
          (0, _common.declareUnboundVariable)(parser, key);
        }
        break;
      }
    default:
      (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ExportNamedDeclaration',
    declaration: declaration,
    specifiers: specifiers,
    source: source
  });
}
function parseExpression(parser, context, canAssign, isPattern, inGroup, start, line, column) {
  var expr = parsePrimaryExpression(parser, context, 2, 0, canAssign, isPattern, inGroup, 1, start, line, column);
  expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
  return parseAssignmentExpression(parser, context, inGroup, 0, start, line, column, expr);
}
function parseSequenceExpression(parser, context, inGroup, start, line, column, expr) {
  var expressions = [expr];
  while ((0, _common.consumeOpt)(parser, context | 32768, 18)) {
    expressions.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'SequenceExpression',
    expressions: expressions
  });
}
function parseExpressions(parser, context, inGroup, canAssign, start, line, column) {
  var expr = parseExpression(parser, context, canAssign, 0, inGroup, start, line, column);
  return parser.token === 18 ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr) : expr;
}
function parseAssignmentExpression(parser, context, inGroup, isPattern, start, line, column, left) {
  var token = parser.token;
  if ((token & 4194304) === 4194304) {
    if (parser.assignable & 2) (0, _errors.report)(parser, 24);
    if (!isPattern && token === 1077936157 && left.type === 'ArrayExpression' || left.type === 'ObjectExpression') {
      (0, _common.reinterpretToPattern)(parser, left);
    }
    (0, _lexer.nextToken)(parser, context | 32768);
    var right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 2;
    return (0, _common.finishNode)(parser, context, start, line, column, isPattern ? {
      type: 'AssignmentPattern',
      left: left,
      right: right
    } : {
      type: 'AssignmentExpression',
      left: left,
      operator: _token6.KeywordDescTable[token & 255],
      right: right
    });
  }
  if ((token & 8454144) === 8454144) {
    left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left);
  }
  if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
    left = parseConditionalExpression(parser, context, left, start, line, column);
  }
  return left;
}
function parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, start, line, column, left) {
  var token = parser.token;
  (0, _lexer.nextToken)(parser, context | 32768);
  var right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
  left = (0, _common.finishNode)(parser, context, start, line, column, isPattern ? {
    type: 'AssignmentPattern',
    left: left,
    right: right
  } : {
    type: 'AssignmentExpression',
    left: left,
    operator: _token6.KeywordDescTable[token & 255],
    right: right
  });
  parser.assignable = 2;
  return left;
}
function parseConditionalExpression(parser, context, test, start, line, column) {
  var consequent = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context | 32768, 21);
  parser.assignable = 1;
  var alternate = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ConditionalExpression',
    test: test,
    consequent: consequent,
    alternate: alternate
  });
}
function parseBinaryExpression(parser, context, inGroup, start, line, column, minPrec, operator, left) {
  var bit = -((context & 134217728) > 0) & 8738868;
  var t;
  var prec;
  parser.assignable = 2;
  while (parser.token & 8454144) {
    t = parser.token;
    prec = t & 3840;
    if (t & 524288 && operator & 268435456 || operator & 524288 && t & 268435456) {
      (0, _errors.report)(parser, 160);
    }
    if (prec + ((t === 8457273) << 8) - ((bit === t) << 12) <= minPrec) break;
    (0, _lexer.nextToken)(parser, context | 32768);
    left = (0, _common.finishNode)(parser, context, start, line, column, {
      type: t & 524288 || t & 268435456 ? 'LogicalExpression' : 'BinaryExpression',
      left: left,
      right: parseBinaryExpression(parser, context, inGroup, parser.tokenPos, parser.linePos, parser.colPos, prec, t, parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos)),
      operator: _token6.KeywordDescTable[t & 255]
    });
  }
  if (parser.token === 1077936157) (0, _errors.report)(parser, 24);
  return left;
}
function parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup) {
  if (!isLHS) (0, _errors.report)(parser, 0);
  var unaryOperator = parser.token;
  (0, _lexer.nextToken)(parser, context | 32768);
  var arg = parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
  if (parser.token === 8457273) (0, _errors.report)(parser, 31);
  if (context & 1024 && unaryOperator === 16863278) {
    if (arg.type === 'Identifier') {
      (0, _errors.report)(parser, 118);
    } else if ((0, _common.isPropertyWithPrivateFieldKey)(arg)) {
      (0, _errors.report)(parser, 124);
    }
  }
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'UnaryExpression',
    operator: _token6.KeywordDescTable[unaryOperator & 255],
    argument: arg,
    prefix: true
  });
}
function parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column) {
  var token = parser.token;
  var expr = parseIdentifier(parser, context, isPattern);
  var flags = parser.flags;
  if ((flags & 1) === 0) {
    if (parser.token === 86106) {
      return parseFunctionExpression(parser, context, 1, inGroup, start, line, column);
    }
    if ((parser.token & 143360) === 143360) {
      if (!isLHS) (0, _errors.report)(parser, 0);
      return parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column);
    }
  }
  if (!inNew && parser.token === 67174411) {
    return parseAsyncArrowOrCallExpression(parser, context, expr, canAssign, 1, 0, flags, start, line, column);
  }
  if (parser.token === 10) {
    (0, _common.classifyIdentifier)(parser, context, token, 1);
    if (inNew) (0, _errors.report)(parser, 49);
    return parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, inNew, canAssign, 0, start, line, column);
  }
  return expr;
}
function parseYieldExpression(parser, context, inGroup, canAssign, start, line, column) {
  if (inGroup) parser.destructible |= 256;
  if (context & 2097152) {
    (0, _lexer.nextToken)(parser, context | 32768);
    if (context & 8388608) (0, _errors.report)(parser, 30);
    if (!canAssign) (0, _errors.report)(parser, 24);
    if (parser.token === 22) (0, _errors.report)(parser, 121);
    var argument = null;
    var delegate = false;
    if ((parser.flags & 1) === 0) {
      delegate = (0, _common.consumeOpt)(parser, context | 32768, 8457014);
      if (parser.token & (12288 | 65536) || delegate) {
        argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      }
    }
    parser.assignable = 2;
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'YieldExpression',
      argument: argument,
      delegate: delegate
    });
  }
  if (context & 1024) (0, _errors.report)(parser, 95, 'yield');
  return parseIdentifierOrArrow(parser, context, start, line, column);
}
function parseAwaitExpression(parser, context, inNew, inGroup, start, line, column) {
  if (inGroup) parser.destructible |= 128;
  if (context & 4194304 || context & 2048 && context & 8192) {
    if (inNew) (0, _errors.report)(parser, 0);
    if (context & 8388608) {
      (0, _errors.reportMessageAt)(parser.index, parser.line, parser.index, 29);
    }
    (0, _lexer.nextToken)(parser, context | 32768);
    var argument = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.token === 8457273) (0, _errors.report)(parser, 31);
    parser.assignable = 2;
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'AwaitExpression',
      argument: argument
    });
  }
  if (context & 2048) (0, _errors.report)(parser, 96);
  return parseIdentifierOrArrow(parser, context, start, line, column);
}
function parseFunctionBody(parser, context, scope, origin, firstRestricted, scopeError) {
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _common.consume)(parser, context | 32768, 2162700);
  var body = [];
  var prevContext = context;
  if (parser.token !== 1074790415) {
    while (parser.token === 134283267) {
      var index = parser.index,
        _tokenPos3 = parser.tokenPos,
        tokenValue = parser.tokenValue,
        token = parser.token;
      var expr = parseLiteral(parser, context);
      if ((0, _common.isValidStrictMode)(parser, index, _tokenPos3, tokenValue)) {
        context |= 1024;
        if (parser.flags & 128) {
          (0, _errors.reportMessageAt)(parser.index, parser.line, parser.tokenPos, 64);
        }
        if (parser.flags & 64) {
          (0, _errors.reportMessageAt)(parser.index, parser.line, parser.tokenPos, 8);
        }
      }
      body.push(parseDirective(parser, context, expr, token, _tokenPos3, parser.linePos, parser.colPos));
    }
    if (context & 1024) {
      if (firstRestricted) {
        if ((firstRestricted & 537079808) === 537079808) {
          (0, _errors.report)(parser, 116);
        }
        if ((firstRestricted & 36864) === 36864) {
          (0, _errors.report)(parser, 38);
        }
      }
      if (parser.flags & 512) (0, _errors.report)(parser, 116);
      if (parser.flags & 256) (0, _errors.report)(parser, 115);
    }
    if (context & 64 && scope && scopeError !== void 0 && (prevContext & 1024) === 0 && (context & 8192) === 0) {
      (0, _errors.reportScopeError)(scopeError);
    }
  }
  parser.flags = (parser.flags | 512 | 256 | 64) ^ (512 | 256 | 64);
  parser.destructible = (parser.destructible | 256) ^ 256;
  while (parser.token !== 1074790415) {
    body.push(parseStatementListItem(parser, context, scope, 4, {}));
  }
  (0, _common.consume)(parser, origin & (16 | 8) ? context | 32768 : context, 1074790415);
  parser.flags &= ~(128 | 64);
  if (parser.token === 1077936157) (0, _errors.report)(parser, 24);
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
    type: 'BlockStatement',
    body: body
  });
}
function parseSuperExpression(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  switch (parser.token) {
    case 67108991:
      (0, _errors.report)(parser, 162);
    case 67174411:
      {
        if ((context & 524288) === 0) (0, _errors.report)(parser, 26);
        if (context & 16384) (0, _errors.report)(parser, 27);
        parser.assignable = 2;
        break;
      }
    case 69271571:
    case 67108877:
      {
        if ((context & 262144) === 0) (0, _errors.report)(parser, 27);
        if (context & 16384) (0, _errors.report)(parser, 27);
        parser.assignable = 1;
        break;
      }
    default:
      (0, _errors.report)(parser, 28, 'super');
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'Super'
  });
}
function parseLeftHandSideExpression(parser, context, canAssign, inGroup, isLHS, start, line, column) {
  var expression = parsePrimaryExpression(parser, context, 2, 0, canAssign, 0, inGroup, isLHS, start, line, column);
  return parseMemberOrUpdateExpression(parser, context, expression, inGroup, 0, start, line, column);
}
function parseUpdateExpression(parser, context, expr, start, line, column) {
  if (parser.assignable & 2) (0, _errors.report)(parser, 53);
  var token = parser.token;
  (0, _lexer.nextToken)(parser, context);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'UpdateExpression',
    argument: expr,
    operator: _token6.KeywordDescTable[token & 255],
    prefix: false
  });
}
function parseMemberOrUpdateExpression(parser, context, expr, inGroup, inChain, start, line, column) {
  if ((parser.token & 33619968) === 33619968 && (parser.flags & 1) === 0) {
    expr = parseUpdateExpression(parser, context, expr, start, line, column);
  } else if ((parser.token & 67108864) === 67108864) {
    context = (context | 134217728) ^ 134217728;
    switch (parser.token) {
      case 67108877:
        {
          (0, _lexer.nextToken)(parser, (context | 1073741824 | 8192) ^ 8192);
          parser.assignable = 1;
          var property = parsePropertyOrPrivatePropertyName(parser, context);
          expr = (0, _common.finishNode)(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: false,
            property: property
          });
          break;
        }
      case 69271571:
        {
          var restoreHasOptionalChaining = false;
          if ((parser.flags & 2048) === 2048) {
            restoreHasOptionalChaining = true;
            parser.flags = (parser.flags | 2048) ^ 2048;
          }
          (0, _lexer.nextToken)(parser, context | 32768);
          var tokenPos = parser.tokenPos,
            linePos = parser.linePos,
            colPos = parser.colPos;
          var _property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
          (0, _common.consume)(parser, context, 20);
          parser.assignable = 1;
          expr = (0, _common.finishNode)(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: true,
            property: _property
          });
          if (restoreHasOptionalChaining) {
            parser.flags |= 2048;
          }
          break;
        }
      case 67174411:
        {
          if ((parser.flags & 1024) === 1024) {
            parser.flags = (parser.flags | 1024) ^ 1024;
            return expr;
          }
          var _restoreHasOptionalChaining = false;
          if ((parser.flags & 2048) === 2048) {
            _restoreHasOptionalChaining = true;
            parser.flags = (parser.flags | 2048) ^ 2048;
          }
          var args = parseArguments(parser, context, inGroup);
          parser.assignable = 2;
          expr = (0, _common.finishNode)(parser, context, start, line, column, {
            type: 'CallExpression',
            callee: expr,
            arguments: args
          });
          if (_restoreHasOptionalChaining) {
            parser.flags |= 2048;
          }
          break;
        }
      case 67108991:
        {
          (0, _lexer.nextToken)(parser, (context | 1073741824 | 8192) ^ 8192);
          parser.flags |= 2048;
          parser.assignable = 2;
          expr = parseOptionalChain(parser, context, expr, start, line, column);
          break;
        }
      default:
        if ((parser.flags & 2048) === 2048) {
          (0, _errors.report)(parser, 161);
        }
        parser.assignable = 2;
        expr = (0, _common.finishNode)(parser, context, start, line, column, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi: parser.token === 67174408 ? parseTemplate(parser, context | 65536) : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
        });
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, start, line, column);
  }
  if (inChain === 0 && (parser.flags & 2048) === 2048) {
    parser.flags = (parser.flags | 2048) ^ 2048;
    expr = (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'ChainExpression',
      expression: expr
    });
  }
  return expr;
}
function parseOptionalChain(parser, context, expr, start, line, column) {
  var restoreHasOptionalChaining = false;
  var node;
  if (parser.token === 69271571 || parser.token === 67174411) {
    if ((parser.flags & 2048) === 2048) {
      restoreHasOptionalChaining = true;
      parser.flags = (parser.flags | 2048) ^ 2048;
    }
  }
  if (parser.token === 69271571) {
    (0, _lexer.nextToken)(parser, context | 32768);
    var tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    var property = parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos);
    (0, _common.consume)(parser, context, 20);
    parser.assignable = 2;
    node = (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'MemberExpression',
      object: expr,
      computed: true,
      optional: true,
      property: property
    });
  } else if (parser.token === 67174411) {
    var args = parseArguments(parser, context, 0);
    parser.assignable = 2;
    node = (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'CallExpression',
      callee: expr,
      arguments: args,
      optional: true
    });
  } else {
    if ((parser.token & (143360 | 4096)) === 0) (0, _errors.report)(parser, 155);
    var _property2 = parseIdentifier(parser, context, 0);
    parser.assignable = 2;
    node = (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'MemberExpression',
      object: expr,
      computed: false,
      optional: true,
      property: _property2
    });
  }
  if (restoreHasOptionalChaining) {
    parser.flags |= 2048;
  }
  return node;
}
function parsePropertyOrPrivatePropertyName(parser, context) {
  if ((parser.token & (143360 | 4096)) === 0 && parser.token !== 131) {
    (0, _errors.report)(parser, 155);
  }
  return context & 1 && parser.token === 131 ? parsePrivateIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos) : parseIdentifier(parser, context, 0);
}
function parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column) {
  if (inNew) (0, _errors.report)(parser, 54);
  if (!isLHS) (0, _errors.report)(parser, 0);
  var token = parser.token;
  (0, _lexer.nextToken)(parser, context | 32768);
  var arg = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  if (parser.assignable & 2) {
    (0, _errors.report)(parser, 53);
  }
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'UpdateExpression',
    argument: arg,
    operator: _token6.KeywordDescTable[token & 255],
    prefix: true
  });
}
function parsePrimaryExpression(parser, context, kind, inNew, canAssign, isPattern, inGroup, isLHS, start, line, column) {
  if ((parser.token & 143360) === 143360) {
    switch (parser.token) {
      case 209008:
        return parseAwaitExpression(parser, context, inNew, inGroup, start, line, column);
      case 241773:
        return parseYieldExpression(parser, context, inGroup, canAssign, start, line, column);
      case 209007:
        return parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column);
      default:
    }
    var token = parser.token,
      tokenValue = parser.tokenValue;
    var expr = parseIdentifier(parser, context | 65536, isPattern);
    if (parser.token === 10) {
      if (!isLHS) (0, _errors.report)(parser, 0);
      (0, _common.classifyIdentifier)(parser, context, token, 1);
      return parseArrowFromIdentifier(parser, context, tokenValue, expr, inNew, canAssign, 0, start, line, column);
    }
    if (context & 16384 && token === 537079928) (0, _errors.report)(parser, 127);
    if (token === 241739) {
      if (context & 1024) (0, _errors.report)(parser, 110);
      if (kind & (8 | 16)) (0, _errors.report)(parser, 98);
    }
    parser.assignable = context & 1024 && (token & 537079808) === 537079808 ? 2 : 1;
    return expr;
  }
  if ((parser.token & 134217728) === 134217728) {
    return parseLiteral(parser, context);
  }
  switch (parser.token) {
    case 33619995:
    case 33619996:
      return parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column);
    case 16863278:
    case 16842800:
    case 16842801:
    case 25233970:
    case 25233971:
    case 16863277:
    case 16863279:
      return parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup);
    case 86106:
      return parseFunctionExpression(parser, context, 0, inGroup, start, line, column);
    case 2162700:
      return parseObjectLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
    case 69271571:
      return parseArrayLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
    case 67174411:
      return parseParenthesizedExpression(parser, context, canAssign, 1, 0, start, line, column);
    case 86021:
    case 86022:
    case 86023:
      return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
    case 86113:
      return parseThisExpression(parser, context);
    case 65540:
      return parseRegExpLiteral(parser, context, start, line, column);
    case 133:
    case 86096:
      return parseClassExpression(parser, context, inGroup, start, line, column);
    case 86111:
      return parseSuperExpression(parser, context, start, line, column);
    case 67174409:
      return parseTemplateLiteral(parser, context, start, line, column);
    case 67174408:
      return parseTemplate(parser, context);
    case 86109:
      return parseNewExpression(parser, context, inGroup, start, line, column);
    case 134283389:
      return parseBigIntLiteral(parser, context, start, line, column);
    case 131:
      return parsePrivateIdentifier(parser, context, start, line, column);
    case 86108:
      return parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column);
    case 8456258:
      if (context & 16) return parseJSXRootElementOrFragment(parser, context, 1, start, line, column);
    case 139:
      return parseGeneral(parser, context, start, line, column);
    default:
      if ((0, _common.isValidIdentifier)(context, parser.token)) return parseIdentifierOrArrow(parser, context, start, line, column);
      (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
  }
}
function parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column) {
  var expr = parseIdentifier(parser, context, 0);
  if (parser.token === 67108877) {
    return parseImportMetaExpression(parser, context, expr, start, line, column);
  }
  if (inNew) (0, _errors.report)(parser, 138);
  expr = parseImportExpression(parser, context, inGroup, start, line, column);
  parser.assignable = 2;
  return parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
}
function parseImportMetaExpression(parser, context, meta, start, line, column) {
  if ((context & 2048) === 0) (0, _errors.report)(parser, 164);
  (0, _lexer.nextToken)(parser, context);
  if (parser.token !== 143495 && parser.tokenValue !== 'meta') (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'MetaProperty',
    meta: meta,
    property: parseIdentifier(parser, context, 0)
  });
}
function parseImportExpression(parser, context, inGroup, start, line, column) {
  (0, _common.consume)(parser, context | 32768, 67174411);
  if (parser.token === 14) (0, _errors.report)(parser, 139);
  var source = parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context, 16);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ImportExpression',
    source: source
  });
}
function parseBigIntLiteral(parser, context, start, line, column) {
  var tokenRaw = parser.tokenRaw,
    tokenValue = parser.tokenValue;
  (0, _lexer.nextToken)(parser, context);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, context & 512 ? {
    type: 'Literal',
    value: tokenValue,
    bigint: tokenRaw.slice(0, -1),
    raw: tokenRaw
  } : {
    type: 'Literal',
    value: tokenValue,
    bigint: tokenRaw.slice(0, -1)
  });
}
function parseTemplateLiteral(parser, context, start, line, column) {
  parser.assignable = 2;
  var tokenValue = parser.tokenValue,
    tokenRaw = parser.tokenRaw,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _common.consume)(parser, context, 67174409);
  var quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true)];
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'TemplateLiteral',
    expressions: [],
    quasis: quasis
  });
}
function parseTemplate(parser, context) {
  context = (context | 134217728) ^ 134217728;
  var tokenValue = parser.tokenValue,
    tokenRaw = parser.tokenRaw,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _common.consume)(parser, context | 32768, 67174408);
  var quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false)];
  var expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];
  if (parser.token !== 1074790415) (0, _errors.report)(parser, 81);
  while ((parser.token = (0, _template.scanTemplateTail)(parser, context)) !== 67174409) {
    var _tokenValue = parser.tokenValue,
      _tokenRaw = parser.tokenRaw,
      _tokenPos4 = parser.tokenPos,
      _linePos3 = parser.linePos,
      _colPos3 = parser.colPos;
    (0, _common.consume)(parser, context | 32768, 67174408);
    quasis.push(parseTemplateElement(parser, context, _tokenValue, _tokenRaw, _tokenPos4, _linePos3, _colPos3, false));
    expressions.push(parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
    if (parser.token !== 1074790415) (0, _errors.report)(parser, 81);
  }
  {
    var _tokenValue2 = parser.tokenValue,
      _tokenRaw2 = parser.tokenRaw,
      _tokenPos5 = parser.tokenPos,
      _linePos4 = parser.linePos,
      _colPos4 = parser.colPos;
    (0, _common.consume)(parser, context, 67174409);
    quasis.push(parseTemplateElement(parser, context, _tokenValue2, _tokenRaw2, _tokenPos5, _linePos4, _colPos4, true));
  }
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
    type: 'TemplateLiteral',
    expressions: expressions,
    quasis: quasis
  });
}
function parseTemplateElement(parser, context, cooked, raw, start, line, col, tail) {
  var node = (0, _common.finishNode)(parser, context, start, line, col, {
    type: 'TemplateElement',
    value: {
      cooked: cooked,
      raw: raw
    },
    tail: tail
  });
  var tailSize = tail ? 1 : 2;
  if (context & 2) {
    node.start += 1;
    node.range[0] += 1;
    node.end -= tailSize;
    node.range[1] -= tailSize;
  }
  if (context & 4) {
    node.loc.start.column += 1;
    node.loc.end.column -= tailSize;
  }
  return node;
}
function parseSpreadElement(parser, context, start, line, column) {
  context = (context | 134217728) ^ 134217728;
  (0, _common.consume)(parser, context | 32768, 14);
  var argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  parser.assignable = 1;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'SpreadElement',
    argument: argument
  });
}
function parseArguments(parser, context, inGroup) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var args = [];
  if (parser.token === 16) {
    (0, _lexer.nextToken)(parser, context);
    return args;
  }
  while (parser.token !== 16) {
    if (parser.token === 14) {
      args.push(parseSpreadElement(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    } else {
      args.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    if (parser.token !== 18) break;
    (0, _lexer.nextToken)(parser, context | 32768);
    if (parser.token === 16) break;
  }
  (0, _common.consume)(parser, context, 16);
  return args;
}
function parseIdentifier(parser, context, isPattern) {
  var tokenValue = parser.tokenValue,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _lexer.nextToken)(parser, context);
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, context & 268435456 ? {
    type: 'Identifier',
    name: tokenValue,
    pattern: isPattern === 1
  } : {
    type: 'Identifier',
    name: tokenValue
  });
}
function parseLiteral(parser, context) {
  var tokenValue = parser.tokenValue,
    tokenRaw = parser.tokenRaw,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  if (parser.token === 134283389) {
    return parseBigIntLiteral(parser, context, tokenPos, linePos, colPos);
  }
  (0, _lexer.nextToken)(parser, context);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, context & 512 ? {
    type: 'Literal',
    value: tokenValue,
    raw: tokenRaw
  } : {
    type: 'Literal',
    value: tokenValue
  });
}
function parseNullOrTrueOrFalseLiteral(parser, context, start, line, column) {
  var raw = _token6.KeywordDescTable[parser.token & 255];
  var value = parser.token === 86023 ? null : raw === 'true';
  (0, _lexer.nextToken)(parser, context);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, context & 512 ? {
    type: 'Literal',
    value: value,
    raw: raw
  } : {
    type: 'Literal',
    value: value
  });
}
function parseThisExpression(parser, context) {
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _lexer.nextToken)(parser, context);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
    type: 'ThisExpression'
  });
}
function parseFunctionDeclaration(parser, context, scope, origin, allowGen, flags, isAsync, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var isGenerator = allowGen ? (0, _common.optionalBit)(parser, context, 8457014) : 0;
  var id = null;
  var firstRestricted;
  var functionScope = scope ? (0, _common.createScope)() : void 0;
  if (parser.token === 67174411) {
    if ((flags & 1) === 0) (0, _errors.report)(parser, 37, 'Function');
  } else {
    var kind = origin & 4 && ((context & 8192) === 0 || (context & 2048) === 0) ? 4 : 64;
    (0, _common.validateFunctionName)(parser, context | (context & 3072) << 11, parser.token);
    if (scope) {
      if (kind & 4) {
        (0, _common.addVarName)(parser, context, scope, parser.tokenValue, kind);
      } else {
        (0, _common.addBlockName)(parser, context, scope, parser.tokenValue, kind, origin);
      }
      functionScope = (0, _common.addChildScope)(functionScope, 256);
      if (flags) {
        if (flags & 2) {
          (0, _common.declareUnboundVariable)(parser, parser.tokenValue);
        }
      }
    }
    firstRestricted = parser.token;
    if (parser.token & 143360) {
      id = parseIdentifier(parser, context, 0);
    } else if (parser.token === 139) {
      id = parseGeneral(parser, context, start, line, column);
    } else {
      (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
    }
  }
  context = (context | 32243712) ^ 32243712 | 67108864 | isAsync * 2 + isGenerator << 21 | (isGenerator ? 0 : 1073741824);
  if (scope) functionScope = (0, _common.addChildScope)(functionScope, 512);
  var params = parseFormalParametersOrFormalList(parser, context | 8388608, functionScope, 0, 1);
  var body = parseFunctionBody(parser, (context | 8192 | 4096 | 131072) ^ (8192 | 4096 | 131072), scope ? (0, _common.addChildScope)(functionScope, 128) : functionScope, 8, firstRestricted, scope ? functionScope.scopeError : void 0);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'FunctionDeclaration',
    id: id,
    params: params,
    body: body,
    async: isAsync === 1,
    generator: isGenerator === 1
  });
}
function parseFunctionExpression(parser, context, isAsync, inGroup, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var isGenerator = (0, _common.optionalBit)(parser, context, 8457014);
  var generatorAndAsyncFlags = isAsync * 2 + isGenerator << 21;
  var id = null;
  var firstRestricted;
  var scope = context & 64 ? (0, _common.createScope)() : void 0;
  if ((parser.token & (143360 | 4096 | 36864)) > 0) {
    (0, _common.validateFunctionName)(parser, (context | 0x1ec0000) ^ 0x1ec0000 | generatorAndAsyncFlags, parser.token);
    if (scope) scope = (0, _common.addChildScope)(scope, 256);
    firstRestricted = parser.token;
    id = parseIdentifier(parser, context, 0);
  }
  context = (context | 32243712) ^ 32243712 | 67108864 | generatorAndAsyncFlags | (isGenerator ? 0 : 1073741824);
  if (scope) scope = (0, _common.addChildScope)(scope, 512);
  var params = parseFormalParametersOrFormalList(parser, context | 8388608, scope, inGroup, 1);
  var body = parseFunctionBody(parser, context & ~(0x8001000 | 8192 | 4096 | 131072 | 16384), scope ? (0, _common.addChildScope)(scope, 128) : scope, 0, firstRestricted, void 0);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'FunctionExpression',
    id: id,
    params: params,
    body: body,
    async: isAsync === 1,
    generator: isGenerator === 1
  });
}
function parseArrayLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
  var expr = parseArrayExpressionOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
  if (context & 256 && parser.destructible & 64) {
    (0, _errors.report)(parser, 61);
  }
  if (parser.destructible & 8) {
    (0, _errors.report)(parser, 60);
  }
  return expr;
}
function parseArrayExpressionOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var elements = [];
  var destructible = 0;
  context = (context | 134217728) ^ 134217728;
  while (parser.token !== 20) {
    if ((0, _common.consumeOpt)(parser, context | 32768, 18)) {
      elements.push(null);
    } else {
      var left = void 0;
      var token = parser.token,
        tokenPos = parser.tokenPos,
        linePos = parser.linePos,
        colPos = parser.colPos,
        tokenValue = parser.tokenValue;
      if (token & 143360) {
        left = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
        if (parser.token === 1077936157) {
          if (parser.assignable & 2) (0, _errors.report)(parser, 24);
          (0, _lexer.nextToken)(parser, context | 32768);
          if (scope) (0, _common.addVarOrBlock)(parser, context, scope, tokenValue, kind, origin);
          var right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
          left = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, isPattern ? {
            type: 'AssignmentPattern',
            left: left,
            right: right
          } : {
            type: 'AssignmentExpression',
            operator: '=',
            left: left,
            right: right
          });
          destructible |= parser.destructible & 256 ? 256 : 0 | parser.destructible & 128 ? 128 : 0;
        } else if (parser.token === 18 || parser.token === 20) {
          if (parser.assignable & 2) {
            destructible |= 16;
          } else if (scope) {
            (0, _common.addVarOrBlock)(parser, context, scope, tokenValue, kind, origin);
          }
          destructible |= parser.destructible & 256 ? 256 : 0 | parser.destructible & 128 ? 128 : 0;
        } else {
          destructible |= kind & 1 ? 32 : (kind & 2) === 0 ? 16 : 0;
          left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
          if (parser.token !== 18 && parser.token !== 20) {
            if (parser.token !== 1077936157) destructible |= 16;
            left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
          } else if (parser.token !== 1077936157) {
            destructible |= parser.assignable & 2 ? 16 : 32;
          }
        }
      } else if (token & 2097152) {
        left = parser.token === 2162700 ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos) : parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
        destructible |= parser.destructible;
        parser.assignable = parser.destructible & 16 ? 2 : 1;
        if (parser.token === 18 || parser.token === 20) {
          if (parser.assignable & 2) {
            destructible |= 16;
          }
        } else if (parser.destructible & 8) {
          (0, _errors.report)(parser, 69);
        } else {
          left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
          destructible = parser.assignable & 2 ? 16 : 0;
          if (parser.token !== 18 && parser.token !== 20) {
            left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
          } else if (parser.token !== 1077936157) {
            destructible |= parser.assignable & 2 ? 16 : 32;
          }
        }
      } else if (token === 14) {
        left = parseSpreadOrRestElement(parser, context, scope, 20, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos);
        destructible |= parser.destructible;
        if (parser.token !== 18 && parser.token !== 20) (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
      } else {
        left = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
        if (parser.token !== 18 && parser.token !== 20) {
          left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
          if ((kind & (2 | 1)) === 0 && token === 67174411) destructible |= 16;
        } else if (parser.assignable & 2) {
          destructible |= 16;
        } else if (token === 67174411) {
          destructible |= parser.assignable & 1 && kind & (2 | 1) ? 32 : 16;
        }
      }
      elements.push(left);
      if ((0, _common.consumeOpt)(parser, context | 32768, 18)) {
        if (parser.token === 20) break;
      } else break;
    }
  }
  (0, _common.consume)(parser, context, 20);
  var node = (0, _common.finishNode)(parser, context, start, line, column, {
    type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
    elements: elements
  });
  if (!skipInitializer && parser.token & 4194304) {
    return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
  }
  parser.destructible = destructible;
  return node;
}
function parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node) {
  if (parser.token !== 1077936157) (0, _errors.report)(parser, 24);
  (0, _lexer.nextToken)(parser, context | 32768);
  if (destructible & 16) (0, _errors.report)(parser, 24);
  if (!isPattern) (0, _common.reinterpretToPattern)(parser, node);
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  var right = parseExpression(parser, context, 1, 1, inGroup, tokenPos, linePos, colPos);
  parser.destructible = (destructible | 64 | 8) ^ (8 | 64) | (parser.destructible & 128 ? 128 : 0) | (parser.destructible & 256 ? 256 : 0);
  return (0, _common.finishNode)(parser, context, start, line, column, isPattern ? {
    type: 'AssignmentPattern',
    left: node,
    right: right
  } : {
    type: 'AssignmentExpression',
    left: node,
    operator: '=',
    right: right
  });
}
function parseSpreadOrRestElement(parser, context, scope, closingToken, kind, origin, isAsync, inGroup, isPattern, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var argument = null;
  var destructible = 0;
  var token = parser.token,
    tokenValue = parser.tokenValue,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  if (token & (4096 | 143360)) {
    parser.assignable = 1;
    argument = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
    token = parser.token;
    argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
    if (parser.token !== 18 && parser.token !== closingToken) {
      if (parser.assignable & 2 && parser.token === 1077936157) (0, _errors.report)(parser, 69);
      destructible |= 16;
      argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
    }
    if (parser.assignable & 2) {
      destructible |= 16;
    } else if (token === closingToken || token === 18) {
      if (scope) (0, _common.addVarOrBlock)(parser, context, scope, tokenValue, kind, origin);
    } else {
      destructible |= 32;
    }
    destructible |= parser.destructible & 128 ? 128 : 0;
  } else if (token === closingToken) {
    (0, _errors.report)(parser, 39);
  } else if (token & 2097152) {
    argument = parser.token === 2162700 ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos) : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
    token = parser.token;
    if (token !== 1077936157 && token !== closingToken && token !== 18) {
      if (parser.destructible & 8) (0, _errors.report)(parser, 69);
      argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
      destructible |= parser.assignable & 2 ? 16 : 0;
      if ((parser.token & 4194304) === 4194304) {
        if (parser.token !== 1077936157) destructible |= 16;
        argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
      } else {
        if ((parser.token & 8454144) === 8454144) {
          argument = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, argument);
        }
        if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
          argument = parseConditionalExpression(parser, context, argument, tokenPos, linePos, colPos);
        }
        destructible |= parser.assignable & 2 ? 16 : 32;
      }
    } else {
      destructible |= closingToken === 1074790415 && token !== 1077936157 ? 16 : parser.destructible;
    }
  } else {
    destructible |= 32;
    argument = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
    var _token = parser.token,
      _tokenPos6 = parser.tokenPos,
      _linePos5 = parser.linePos,
      _colPos5 = parser.colPos;
    if (_token === 1077936157 && _token !== closingToken && _token !== 18) {
      if (parser.assignable & 2) (0, _errors.report)(parser, 24);
      argument = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos6, _linePos5, _colPos5, argument);
      destructible |= 16;
    } else {
      if (_token === 18) {
        destructible |= 16;
      } else if (_token !== closingToken) {
        argument = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos6, _linePos5, _colPos5, argument);
      }
      destructible |= parser.assignable & 1 ? 32 : 16;
    }
    parser.destructible = destructible;
    if (parser.token !== closingToken && parser.token !== 18) (0, _errors.report)(parser, 156);
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: isPattern ? 'RestElement' : 'SpreadElement',
      argument: argument
    });
  }
  if (parser.token !== closingToken) {
    if (kind & 1) destructible |= isAsync ? 16 : 32;
    if ((0, _common.consumeOpt)(parser, context | 32768, 1077936157)) {
      if (destructible & 16) (0, _errors.report)(parser, 24);
      (0, _common.reinterpretToPattern)(parser, argument);
      var right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      argument = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, isPattern ? {
        type: 'AssignmentPattern',
        left: argument,
        right: right
      } : {
        type: 'AssignmentExpression',
        left: argument,
        operator: '=',
        right: right
      });
      destructible = 16;
    } else {
      destructible |= 16;
    }
  }
  parser.destructible = destructible;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: isPattern ? 'RestElement' : 'SpreadElement',
    argument: argument
  });
}
function parseMethodDefinition(parser, context, kind, inGroup, start, line, column) {
  var modifierFlags = (kind & 64) === 0 ? 31981568 : 14680064;
  context = (context | modifierFlags) ^ modifierFlags | (kind & 88) << 18 | 100925440;
  var scope = context & 64 ? (0, _common.addChildScope)((0, _common.createScope)(), 512) : void 0;
  var params = parseMethodFormals(parser, context | 8388608, scope, kind, 1, inGroup);
  if (scope) scope = (0, _common.addChildScope)(scope, 128);
  var body = parseFunctionBody(parser, context & ~(0x8001000 | 8192), scope, 0, void 0, void 0);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'FunctionExpression',
    params: params,
    body: body,
    async: (kind & 16) > 0,
    generator: (kind & 8) > 0,
    id: null
  });
}
function parseObjectLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
  var expr = parseObjectLiteralOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
  if (context & 256 && parser.destructible & 64) {
    (0, _errors.report)(parser, 61);
  }
  if (parser.destructible & 8) {
    (0, _errors.report)(parser, 60);
  }
  return expr;
}
function parseObjectLiteralOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  var properties = [];
  var destructible = 0;
  var prototypeCount = 0;
  context = (context | 134217728) ^ 134217728;
  while (parser.token !== 1074790415) {
    var token = parser.token,
      tokenValue = parser.tokenValue,
      linePos = parser.linePos,
      colPos = parser.colPos,
      tokenPos = parser.tokenPos;
    if (token === 14) {
      properties.push(parseSpreadOrRestElement(parser, context, scope, 1074790415, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos));
    } else {
      var state = 0;
      var key = null;
      var value = void 0;
      var t = parser.token;
      if (parser.token & (143360 | 4096) || parser.token === 121) {
        key = parseIdentifier(parser, context, 0);
        if (parser.token === 18 || parser.token === 1074790415 || parser.token === 1077936157) {
          state |= 4;
          if (context & 1024 && (token & 537079808) === 537079808) {
            destructible |= 16;
          } else {
            (0, _common.validateBindingIdentifier)(parser, context, kind, token, 0);
          }
          if (scope) (0, _common.addVarOrBlock)(parser, context, scope, tokenValue, kind, origin);
          if ((0, _common.consumeOpt)(parser, context | 32768, 1077936157)) {
            destructible |= 8;
            var right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            destructible |= parser.destructible & 256 ? 256 : 0 | parser.destructible & 128 ? 128 : 0;
            value = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
              type: 'AssignmentPattern',
              left: context & -2147483648 ? Object.assign({}, key) : key,
              right: right
            });
          } else {
            destructible |= (token === 209008 ? 128 : 0) | (token === 121 ? 16 : 0);
            value = context & -2147483648 ? Object.assign({}, key) : key;
          }
        } else if ((0, _common.consumeOpt)(parser, context | 32768, 21)) {
          var _tokenPos7 = parser.tokenPos,
            _linePos6 = parser.linePos,
            _colPos6 = parser.colPos;
          if (tokenValue === '__proto__') prototypeCount++;
          if (parser.token & 143360) {
            var tokenAfterColon = parser.token;
            var valueAfterColon = parser.tokenValue;
            destructible |= t === 121 ? 16 : 0;
            value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, _tokenPos7, _linePos6, _colPos6);
            var _token2 = parser.token;
            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos7, _linePos6, _colPos6);
            if (parser.token === 18 || parser.token === 1074790415) {
              if (_token2 === 1077936157 || _token2 === 1074790415 || _token2 === 18) {
                destructible |= parser.destructible & 128 ? 128 : 0;
                if (parser.assignable & 2) {
                  destructible |= 16;
                } else if (scope && (tokenAfterColon & 143360) === 143360) {
                  (0, _common.addVarOrBlock)(parser, context, scope, valueAfterColon, kind, origin);
                }
              } else {
                destructible |= parser.assignable & 1 ? 32 : 16;
              }
            } else if ((parser.token & 4194304) === 4194304) {
              if (parser.assignable & 2) {
                destructible |= 16;
              } else if (_token2 !== 1077936157) {
                destructible |= 32;
              } else if (scope) {
                (0, _common.addVarOrBlock)(parser, context, scope, valueAfterColon, kind, origin);
              }
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos7, _linePos6, _colPos6, value);
            } else {
              destructible |= 16;
              if ((parser.token & 8454144) === 8454144) {
                value = parseBinaryExpression(parser, context, 1, _tokenPos7, _linePos6, _colPos6, 4, _token2, value);
              }
              if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
                value = parseConditionalExpression(parser, context, value, _tokenPos7, _linePos6, _colPos6);
              }
            }
          } else if ((parser.token & 2097152) === 2097152) {
            value = parser.token === 69271571 ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, _tokenPos7, _linePos6, _colPos6) : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, _tokenPos7, _linePos6, _colPos6);
            destructible = parser.destructible;
            parser.assignable = destructible & 16 ? 2 : 1;
            if (parser.token === 18 || parser.token === 1074790415) {
              if (parser.assignable & 2) destructible |= 16;
            } else if (parser.destructible & 8) {
              (0, _errors.report)(parser, 69);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos7, _linePos6, _colPos6);
              destructible = parser.assignable & 2 ? 16 : 0;
              if ((parser.token & 4194304) === 4194304) {
                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, _tokenPos7, _linePos6, _colPos6, value);
              } else {
                if ((parser.token & 8454144) === 8454144) {
                  value = parseBinaryExpression(parser, context, 1, _tokenPos7, _linePos6, _colPos6, 4, token, value);
                }
                if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
                  value = parseConditionalExpression(parser, context, value, _tokenPos7, _linePos6, _colPos6);
                }
                destructible |= parser.assignable & 2 ? 16 : 32;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, _tokenPos7, _linePos6, _colPos6);
            destructible |= parser.assignable & 1 ? 32 : 16;
            if (parser.token === 18 || parser.token === 1074790415) {
              if (parser.assignable & 2) destructible |= 16;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos7, _linePos6, _colPos6);
              destructible = parser.assignable & 2 ? 16 : 0;
              if (parser.token !== 18 && token !== 1074790415) {
                if (parser.token !== 1077936157) destructible |= 16;
                value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos7, _linePos6, _colPos6, value);
              }
            }
          }
        } else if (parser.token === 69271571) {
          destructible |= 16;
          if (token === 209007) state |= 16;
          state |= (token === 12402 ? 256 : token === 12403 ? 512 : 1) | 2;
          key = parseComputedPropertyName(parser, context, inGroup);
          destructible |= parser.assignable;
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        } else if (parser.token & (143360 | 4096)) {
          destructible |= 16;
          if (token === 121) (0, _errors.report)(parser, 93);
          if (token === 209007) {
            if (parser.flags & 1) (0, _errors.report)(parser, 129);
            state |= 16;
          }
          key = parseIdentifier(parser, context, 0);
          state |= token === 12402 ? 256 : token === 12403 ? 512 : 1;
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        } else if (parser.token === 67174411) {
          destructible |= 16;
          state |= 1;
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        } else if (parser.token === 8457014) {
          destructible |= 16;
          if (token === 12402) {
            (0, _errors.report)(parser, 40);
          } else if (token === 12403) {
            (0, _errors.report)(parser, 41);
          } else if (token === 143483) {
            (0, _errors.report)(parser, 93);
          }
          (0, _lexer.nextToken)(parser, context);
          state |= 8 | 1 | (token === 209007 ? 16 : 0);
          if (parser.token & 143360) {
            key = parseIdentifier(parser, context, 0);
          } else if ((parser.token & 134217728) === 134217728) {
            key = parseLiteral(parser, context);
          } else if (parser.token === 69271571) {
            state |= 2;
            key = parseComputedPropertyName(parser, context, inGroup);
            destructible |= parser.assignable;
          } else {
            (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
          }
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        } else if ((parser.token & 134217728) === 134217728) {
          if (token === 209007) state |= 16;
          state |= token === 12402 ? 256 : token === 12403 ? 512 : 1;
          destructible |= 16;
          key = parseLiteral(parser, context);
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        } else {
          (0, _errors.report)(parser, 130);
        }
      } else if ((parser.token & 134217728) === 134217728) {
        key = parseLiteral(parser, context);
        if (parser.token === 21) {
          (0, _common.consume)(parser, context | 32768, 21);
          var _tokenPos8 = parser.tokenPos,
            _linePos7 = parser.linePos,
            _colPos7 = parser.colPos;
          if (tokenValue === '__proto__') prototypeCount++;
          if (parser.token & 143360) {
            value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, _tokenPos8, _linePos7, _colPos7);
            var _token3 = parser.token,
              _valueAfterColon = parser.tokenValue;
            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos8, _linePos7, _colPos7);
            if (parser.token === 18 || parser.token === 1074790415) {
              if (_token3 === 1077936157 || _token3 === 1074790415 || _token3 === 18) {
                if (parser.assignable & 2) {
                  destructible |= 16;
                } else if (scope) {
                  (0, _common.addVarOrBlock)(parser, context, scope, _valueAfterColon, kind, origin);
                }
              } else {
                destructible |= parser.assignable & 1 ? 32 : 16;
              }
            } else if (parser.token === 1077936157) {
              if (parser.assignable & 2) destructible |= 16;
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos8, _linePos7, _colPos7, value);
            } else {
              destructible |= 16;
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos8, _linePos7, _colPos7, value);
            }
          } else if ((parser.token & 2097152) === 2097152) {
            value = parser.token === 69271571 ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, _tokenPos8, _linePos7, _colPos7) : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, _tokenPos8, _linePos7, _colPos7);
            destructible = parser.destructible;
            parser.assignable = destructible & 16 ? 2 : 1;
            if (parser.token === 18 || parser.token === 1074790415) {
              if (parser.assignable & 2) {
                destructible |= 16;
              }
            } else if ((parser.destructible & 8) !== 8) {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos8, _linePos7, _colPos7);
              destructible = parser.assignable & 2 ? 16 : 0;
              if ((parser.token & 4194304) === 4194304) {
                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, _tokenPos8, _linePos7, _colPos7, value);
              } else {
                if ((parser.token & 8454144) === 8454144) {
                  value = parseBinaryExpression(parser, context, 1, _tokenPos8, _linePos7, _colPos7, 4, token, value);
                }
                if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
                  value = parseConditionalExpression(parser, context, value, _tokenPos8, _linePos7, _colPos7);
                }
                destructible |= parser.assignable & 2 ? 16 : 32;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, 0, 1, _tokenPos8, _linePos7, _colPos7);
            destructible |= parser.assignable & 1 ? 32 : 16;
            if (parser.token === 18 || parser.token === 1074790415) {
              if (parser.assignable & 2) {
                destructible |= 16;
              }
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos8, _linePos7, _colPos7);
              destructible = parser.assignable & 1 ? 0 : 16;
              if (parser.token !== 18 && parser.token !== 1074790415) {
                if (parser.token !== 1077936157) destructible |= 16;
                value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos8, _linePos7, _colPos7, value);
              }
            }
          }
        } else if (parser.token === 67174411) {
          state |= 1;
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
          destructible = parser.assignable | 16;
        } else {
          (0, _errors.report)(parser, 131);
        }
      } else if (parser.token === 69271571) {
        key = parseComputedPropertyName(parser, context, inGroup);
        destructible |= parser.destructible & 256 ? 256 : 0;
        state |= 2;
        if (parser.token === 21) {
          (0, _lexer.nextToken)(parser, context | 32768);
          var _tokenPos9 = parser.tokenPos,
            _linePos8 = parser.linePos,
            _colPos8 = parser.colPos,
            _tokenValue3 = parser.tokenValue,
            _tokenAfterColon = parser.token;
          if (parser.token & 143360) {
            value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, _tokenPos9, _linePos8, _colPos8);
            var _token4 = parser.token;
            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos9, _linePos8, _colPos8);
            if ((parser.token & 4194304) === 4194304) {
              destructible |= parser.assignable & 2 ? 16 : _token4 === 1077936157 ? 0 : 32;
              value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, _tokenPos9, _linePos8, _colPos8, value);
            } else if (parser.token === 18 || parser.token === 1074790415) {
              if (_token4 === 1077936157 || _token4 === 1074790415 || _token4 === 18) {
                if (parser.assignable & 2) {
                  destructible |= 16;
                } else if (scope && (_tokenAfterColon & 143360) === 143360) {
                  (0, _common.addVarOrBlock)(parser, context, scope, _tokenValue3, kind, origin);
                }
              } else {
                destructible |= parser.assignable & 1 ? 32 : 16;
              }
            } else {
              destructible |= 16;
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos9, _linePos8, _colPos8, value);
            }
          } else if ((parser.token & 2097152) === 2097152) {
            value = parser.token === 69271571 ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, _tokenPos9, _linePos8, _colPos8) : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, _tokenPos9, _linePos8, _colPos8);
            destructible = parser.destructible;
            parser.assignable = destructible & 16 ? 2 : 1;
            if (parser.token === 18 || parser.token === 1074790415) {
              if (parser.assignable & 2) destructible |= 16;
            } else if (destructible & 8) {
              (0, _errors.report)(parser, 60);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos9, _linePos8, _colPos8);
              destructible = parser.assignable & 2 ? destructible | 16 : 0;
              if ((parser.token & 4194304) === 4194304) {
                if (parser.token !== 1077936157) destructible |= 16;
                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, _tokenPos9, _linePos8, _colPos8, value);
              } else {
                if ((parser.token & 8454144) === 8454144) {
                  value = parseBinaryExpression(parser, context, 1, _tokenPos9, _linePos8, _colPos8, 4, token, value);
                }
                if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
                  value = parseConditionalExpression(parser, context, value, _tokenPos9, _linePos8, _colPos8);
                }
                destructible |= parser.assignable & 2 ? 16 : 32;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, 0, 1, _tokenPos9, _linePos8, _colPos8);
            destructible |= parser.assignable & 1 ? 32 : 16;
            if (parser.token === 18 || parser.token === 1074790415) {
              if (parser.assignable & 2) destructible |= 16;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, _tokenPos9, _linePos8, _colPos8);
              destructible = parser.assignable & 1 ? 0 : 16;
              if (parser.token !== 18 && parser.token !== 1074790415) {
                if (parser.token !== 1077936157) destructible |= 16;
                value = parseAssignmentExpression(parser, context, inGroup, isPattern, _tokenPos9, _linePos8, _colPos8, value);
              }
            }
          }
        } else if (parser.token === 67174411) {
          state |= 1;
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);
          destructible = 16;
        } else {
          (0, _errors.report)(parser, 42);
        }
      } else if (token === 8457014) {
        (0, _common.consume)(parser, context | 32768, 8457014);
        state |= 8;
        if (parser.token & 143360) {
          var _token5 = parser.token,
            _line = parser.line,
            index = parser.index;
          key = parseIdentifier(parser, context, 0);
          state |= 1;
          if (parser.token === 67174411) {
            destructible |= 16;
            value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
          } else {
            (0, _errors.reportMessageAt)(index, _line, index, _token5 === 209007 ? 44 : _token5 === 12402 || parser.token === 12403 ? 43 : 45, _token6.KeywordDescTable[_token5 & 255]);
          }
        } else if ((parser.token & 134217728) === 134217728) {
          destructible |= 16;
          key = parseLiteral(parser, context);
          state |= 1;
          value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
        } else if (parser.token === 69271571) {
          destructible |= 16;
          state |= 2 | 1;
          key = parseComputedPropertyName(parser, context, inGroup);
          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        } else {
          (0, _errors.report)(parser, 123);
        }
      } else {
        (0, _errors.report)(parser, 28, _token6.KeywordDescTable[token & 255]);
      }
      destructible |= parser.destructible & 128 ? 128 : 0;
      parser.destructible = destructible;
      properties.push((0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
        type: 'Property',
        key: key,
        value: value,
        kind: !(state & 768) ? 'init' : state & 512 ? 'set' : 'get',
        computed: (state & 2) > 0,
        method: (state & 1) > 0,
        shorthand: (state & 4) > 0
      }));
    }
    destructible |= parser.destructible;
    if (parser.token !== 18) break;
    (0, _lexer.nextToken)(parser, context);
  }
  (0, _common.consume)(parser, context, 1074790415);
  if (prototypeCount > 1) destructible |= 64;
  var node = (0, _common.finishNode)(parser, context, start, line, column, {
    type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
    properties: properties
  });
  if (!skipInitializer && parser.token & 4194304) {
    return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
  }
  parser.destructible = destructible;
  return node;
}
function parseMethodFormals(parser, context, scope, kind, type, inGroup) {
  (0, _common.consume)(parser, context, 67174411);
  var params = [];
  parser.flags = (parser.flags | 128) ^ 128;
  if (parser.token === 16) {
    if (kind & 512) {
      (0, _errors.report)(parser, 35, 'Setter', 'one', '');
    }
    (0, _lexer.nextToken)(parser, context);
    return params;
  }
  if (kind & 256) {
    (0, _errors.report)(parser, 35, 'Getter', 'no', 's');
  }
  if (kind & 512 && parser.token === 14) {
    (0, _errors.report)(parser, 36);
  }
  context = (context | 134217728) ^ 134217728;
  var setterArgs = 0;
  var isSimpleParameterList = 0;
  while (parser.token !== 18) {
    var left = null;
    var tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    if (parser.token & 143360) {
      if ((context & 1024) === 0) {
        if ((parser.token & 36864) === 36864) {
          parser.flags |= 256;
        }
        if ((parser.token & 537079808) === 537079808) {
          parser.flags |= 512;
        }
      }
      left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
    } else {
      if (parser.token === 2162700) {
        left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
      } else if (parser.token === 69271571) {
        left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
      } else if (parser.token === 14) {
        left = parseSpreadOrRestElement(parser, context, scope, 16, type, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
      }
      isSimpleParameterList = 1;
      if (parser.destructible & (32 | 16)) (0, _errors.report)(parser, 48);
    }
    if (parser.token === 1077936157) {
      (0, _lexer.nextToken)(parser, context | 32768);
      isSimpleParameterList = 1;
      var right = parseExpression(parser, context, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
      left = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentPattern',
        left: left,
        right: right
      });
    }
    setterArgs++;
    params.push(left);
    if (!(0, _common.consumeOpt)(parser, context, 18)) break;
    if (parser.token === 16) {
      break;
    }
  }
  if (kind & 512 && setterArgs !== 1) {
    (0, _errors.report)(parser, 35, 'Setter', 'one', '');
  }
  if (scope && scope.scopeError !== void 0) (0, _errors.reportScopeError)(scope.scopeError);
  if (isSimpleParameterList) parser.flags |= 128;
  (0, _common.consume)(parser, context, 16);
  return params;
}
function parseComputedPropertyName(parser, context, inGroup) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var key = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context, 20);
  return key;
}
function parseParenthesizedExpression(parser, context, canAssign, kind, origin, start, line, column) {
  parser.flags = (parser.flags | 128) ^ 128;
  var piStart = parser.tokenPos,
    plStart = parser.linePos,
    pcStart = parser.colPos;
  (0, _lexer.nextToken)(parser, context | 32768 | 1073741824);
  var scope = context & 64 ? (0, _common.addChildScope)((0, _common.createScope)(), 1024) : void 0;
  context = (context | 134217728) ^ 134217728;
  if ((0, _common.consumeOpt)(parser, context, 16)) {
    return parseParenthesizedArrow(parser, context, scope, [], canAssign, 0, start, line, column);
  }
  var destructible = 0;
  parser.destructible &= ~(256 | 128);
  var expr;
  var expressions = [];
  var isSequence = 0;
  var isSimpleParameterList = 0;
  var iStart = parser.tokenPos,
    lStart = parser.linePos,
    cStart = parser.colPos;
  parser.assignable = 1;
  while (parser.token !== 16) {
    var token = parser.token,
      tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    if (token & (143360 | 4096 | 139)) {
      if (scope) (0, _common.addBlockName)(parser, context, scope, parser.tokenValue, 1, 0);
      expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
      if (parser.token === 16 || parser.token === 18) {
        if (parser.assignable & 2) {
          destructible |= 16;
          isSimpleParameterList = 1;
        } else if ((token & 537079808) === 537079808 || (token & 36864) === 36864) {
          isSimpleParameterList = 1;
        }
      } else {
        if (parser.token === 1077936157) {
          isSimpleParameterList = 1;
        } else {
          destructible |= 16;
        }
        expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
        if (parser.token !== 16 && parser.token !== 18) {
          expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
        }
      }
    } else if ((token & 2097152) === 2097152) {
      expr = token === 2162700 ? parseObjectLiteralOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos) : parseArrayExpressionOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
      destructible |= parser.destructible;
      isSimpleParameterList = 1;
      parser.assignable = 2;
      if (parser.token !== 16 && parser.token !== 18) {
        if (destructible & 8) (0, _errors.report)(parser, 119);
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
        destructible |= 16;
        if (parser.token !== 16 && parser.token !== 18) {
          expr = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, expr);
        }
      }
    } else if (token === 14) {
      expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 0, 1, 0, tokenPos, linePos, colPos);
      if (parser.destructible & 16) (0, _errors.report)(parser, 72);
      isSimpleParameterList = 1;
      if (isSequence && (parser.token === 16 || parser.token === 18)) {
        expressions.push(expr);
      }
      destructible |= 8;
      break;
    } else {
      destructible |= 16;
      expr = parseExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
      if (isSequence && (parser.token === 16 || parser.token === 18)) {
        expressions.push(expr);
      }
      if (parser.token === 18) {
        if (!isSequence) {
          isSequence = 1;
          expressions = [expr];
        }
      }
      if (isSequence) {
        while ((0, _common.consumeOpt)(parser, context | 32768, 18)) {
          expressions.push(parseExpression(parser, context, 1, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
        }
        parser.assignable = 2;
        expr = (0, _common.finishNode)(parser, context, iStart, lStart, cStart, {
          type: 'SequenceExpression',
          expressions: expressions
        });
      }
      (0, _common.consume)(parser, context, 16);
      parser.destructible = destructible;
      return expr;
    }
    if (isSequence && (parser.token === 16 || parser.token === 18)) {
      expressions.push(expr);
    }
    if (!(0, _common.consumeOpt)(parser, context | 32768, 18)) break;
    if (!isSequence) {
      isSequence = 1;
      expressions = [expr];
    }
    if (parser.token === 16) {
      destructible |= 8;
      break;
    }
  }
  if (isSequence) {
    parser.assignable = 2;
    expr = (0, _common.finishNode)(parser, context, iStart, lStart, cStart, {
      type: 'SequenceExpression',
      expressions: expressions
    });
  }
  (0, _common.consume)(parser, context, 16);
  if (destructible & 16 && destructible & 8) (0, _errors.report)(parser, 146);
  destructible |= parser.destructible & 256 ? 256 : 0 | parser.destructible & 128 ? 128 : 0;
  if (parser.token === 10) {
    if (destructible & (32 | 16)) (0, _errors.report)(parser, 47);
    if (context & (4194304 | 2048) && destructible & 128) (0, _errors.report)(parser, 29);
    if (context & (1024 | 2097152) && destructible & 256) {
      (0, _errors.report)(parser, 30);
    }
    if (isSimpleParameterList) parser.flags |= 128;
    return parseParenthesizedArrow(parser, context, scope, isSequence ? expressions : [expr], canAssign, 0, start, line, column);
  } else if (destructible & 8) {
    (0, _errors.report)(parser, 140);
  }
  parser.destructible = (parser.destructible | 256) ^ 256 | destructible;
  return context & 128 ? (0, _common.finishNode)(parser, context, piStart, plStart, pcStart, {
    type: 'ParenthesizedExpression',
    expression: expr
  }) : expr;
}
function parseIdentifierOrArrow(parser, context, start, line, column) {
  var tokenValue = parser.tokenValue;
  var expr = parseIdentifier(parser, context, 0);
  parser.assignable = 1;
  if (parser.token === 10) {
    var scope = void 0;
    if (context & 64) scope = (0, _common.createArrowHeadParsingScope)(parser, context, tokenValue);
    parser.flags = (parser.flags | 128) ^ 128;
    return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
  }
  return expr;
}
function parseArrowFromIdentifier(parser, context, value, expr, inNew, canAssign, isAsync, start, line, column) {
  if (!canAssign) (0, _errors.report)(parser, 55);
  if (inNew) (0, _errors.report)(parser, 49);
  parser.flags &= ~128;
  var scope = context & 64 ? (0, _common.createArrowHeadParsingScope)(parser, context, value) : void 0;
  return parseArrowFunctionExpression(parser, context, scope, [expr], isAsync, start, line, column);
}
function parseParenthesizedArrow(parser, context, scope, params, canAssign, isAsync, start, line, column) {
  if (!canAssign) (0, _errors.report)(parser, 55);
  for (var i = 0; i < params.length; ++i) (0, _common.reinterpretToPattern)(parser, params[i]);
  return parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column);
}
function parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column) {
  if (parser.flags & 1) (0, _errors.report)(parser, 46);
  (0, _common.consume)(parser, context | 32768, 10);
  context = (context | 15728640) ^ 15728640 | isAsync << 22;
  var expression = parser.token !== 2162700;
  var body;
  if (scope && scope.scopeError !== void 0) {
    (0, _errors.reportScopeError)(scope.scopeError);
  }
  if (expression) {
    body = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  } else {
    if (scope) scope = (0, _common.addChildScope)(scope, 128);
    body = parseFunctionBody(parser, (context | 134221824 | 8192 | 16384) ^ (134221824 | 8192 | 16384), scope, 16, void 0, void 0);
    switch (parser.token) {
      case 69271571:
        if ((parser.flags & 1) === 0) {
          (0, _errors.report)(parser, 113);
        }
        break;
      case 67108877:
      case 67174409:
      case 22:
        (0, _errors.report)(parser, 114);
      case 67174411:
        if ((parser.flags & 1) === 0) {
          (0, _errors.report)(parser, 113);
        }
        parser.flags |= 1024;
        break;
      default:
    }
    if ((parser.token & 8454144) === 8454144 && (parser.flags & 1) === 0) (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
    if ((parser.token & 33619968) === 33619968) (0, _errors.report)(parser, 122);
  }
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'ArrowFunctionExpression',
    params: params,
    body: body,
    async: isAsync === 1,
    expression: expression
  });
}
function parseFormalParametersOrFormalList(parser, context, scope, inGroup, kind) {
  (0, _common.consume)(parser, context, 67174411);
  parser.flags = (parser.flags | 128) ^ 128;
  var params = [];
  if ((0, _common.consumeOpt)(parser, context, 16)) return params;
  context = (context | 134217728) ^ 134217728;
  var isSimpleParameterList = 0;
  while (parser.token !== 18) {
    var left = void 0;
    var tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    if (parser.token & 143360) {
      if ((context & 1024) === 0) {
        if ((parser.token & 36864) === 36864) {
          parser.flags |= 256;
        }
        if ((parser.token & 537079808) === 537079808) {
          parser.flags |= 512;
        }
      }
      left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
    } else {
      if (parser.token === 2162700) {
        left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
      } else if (parser.token === 69271571) {
        left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
      } else if (parser.token === 14) {
        left = parseSpreadOrRestElement(parser, context, scope, 16, kind, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
      } else if (parser.token === 139) {
        left = parseGeneral(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
      } else {
        (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
      }
      isSimpleParameterList = 1;
      if (parser.destructible & (32 | 16)) {
        (0, _errors.report)(parser, 48);
      }
    }
    if (parser.token === 1077936157) {
      (0, _lexer.nextToken)(parser, context | 32768);
      isSimpleParameterList = 1;
      var right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      left = (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentPattern',
        left: left,
        right: right
      });
    }
    params.push(left);
    if (!(0, _common.consumeOpt)(parser, context, 18)) break;
    if (parser.token === 16) {
      break;
    }
  }
  if (isSimpleParameterList) parser.flags |= 128;
  if (scope && (isSimpleParameterList || context & 1024) && scope.scopeError !== void 0) {
    (0, _errors.reportScopeError)(scope.scopeError);
  }
  (0, _common.consume)(parser, context, 16);
  return params;
}
function parseMembeExpressionNoCall(parser, context, expr, inGroup, start, line, column) {
  var token = parser.token;
  if (token & 67108864) {
    if (token === 67108877) {
      (0, _lexer.nextToken)(parser, context | 1073741824);
      parser.assignable = 1;
      var property = parsePropertyOrPrivatePropertyName(parser, context);
      return parseMembeExpressionNoCall(parser, context, (0, _common.finishNode)(parser, context, start, line, column, {
        type: 'MemberExpression',
        object: expr,
        computed: false,
        property: property
      }), 0, start, line, column);
    } else if (token === 69271571) {
      (0, _lexer.nextToken)(parser, context | 32768);
      var tokenPos = parser.tokenPos,
        linePos = parser.linePos,
        colPos = parser.colPos;
      var _property3 = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
      (0, _common.consume)(parser, context, 20);
      parser.assignable = 1;
      return parseMembeExpressionNoCall(parser, context, (0, _common.finishNode)(parser, context, start, line, column, {
        type: 'MemberExpression',
        object: expr,
        computed: true,
        property: _property3
      }), 0, start, line, column);
    } else if (token === 67174408 || token === 67174409) {
      parser.assignable = 2;
      return parseMembeExpressionNoCall(parser, context, (0, _common.finishNode)(parser, context, start, line, column, {
        type: 'TaggedTemplateExpression',
        tag: expr,
        quasi: parser.token === 67174408 ? parseTemplate(parser, context | 65536) : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
      }), 0, start, line, column);
    }
  }
  return expr;
}
function parseNewExpression(parser, context, inGroup, start, line, column) {
  var id = parseIdentifier(parser, context | 32768, 0);
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  if ((0, _common.consumeOpt)(parser, context, 67108877)) {
    if (context & 67108864 && parser.token === 143494) {
      parser.assignable = 2;
      return parseMetaProperty(parser, context, id, start, line, column);
    }
    (0, _errors.report)(parser, 92);
  }
  parser.assignable = 2;
  if ((parser.token & 16842752) === 16842752) {
    (0, _errors.report)(parser, 63, _token6.KeywordDescTable[parser.token & 255]);
  }
  var expr = parsePrimaryExpression(parser, context, 2, 1, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
  context = (context | 134217728) ^ 134217728;
  if (parser.token === 67108991) (0, _errors.report)(parser, 163);
  var callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'NewExpression',
    callee: callee,
    arguments: parser.token === 67174411 ? parseArguments(parser, context, inGroup) : []
  });
}
function parseMetaProperty(parser, context, meta, start, line, column) {
  var property = parseIdentifier(parser, context, 0);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'MetaProperty',
    meta: meta,
    property: property
  });
}
function parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column) {
  if (parser.token === 209008) (0, _errors.report)(parser, 29);
  if (context & (1024 | 2097152) && parser.token === 241773) {
    (0, _errors.report)(parser, 30);
  }
  if ((parser.token & 537079808) === 537079808) {
    parser.flags |= 512;
  }
  return parseArrowFromIdentifier(parser, context, parser.tokenValue, parseIdentifier(parser, context, 0), 0, canAssign, 1, start, line, column);
}
function parseAsyncArrowOrCallExpression(parser, context, callee, canAssign, kind, origin, flags, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var scope = context & 64 ? (0, _common.addChildScope)((0, _common.createScope)(), 1024) : void 0;
  context = (context | 134217728) ^ 134217728;
  if ((0, _common.consumeOpt)(parser, context, 16)) {
    if (parser.token === 10) {
      if (flags & 1) (0, _errors.report)(parser, 46);
      return parseParenthesizedArrow(parser, context, scope, [], canAssign, 1, start, line, column);
    }
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'CallExpression',
      callee: callee,
      arguments: []
    });
  }
  var destructible = 0;
  var expr = null;
  var isSimpleParameterList = 0;
  parser.destructible = (parser.destructible | 256 | 128) ^ (256 | 128);
  var params = [];
  while (parser.token !== 16) {
    var token = parser.token,
      tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    if (token & (143360 | 4096)) {
      if (scope) (0, _common.addBlockName)(parser, context, scope, parser.tokenValue, kind, 0);
      expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
      if (parser.token === 16 || parser.token === 18) {
        if (parser.assignable & 2) {
          destructible |= 16;
          isSimpleParameterList = 1;
        } else if ((token & 537079808) === 537079808) {
          parser.flags |= 512;
        } else if ((token & 36864) === 36864) {
          parser.flags |= 256;
        }
      } else {
        if (parser.token === 1077936157) {
          isSimpleParameterList = 1;
        } else {
          destructible |= 16;
        }
        expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
        if (parser.token !== 16 && parser.token !== 18) {
          expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
        }
      }
    } else if (token & 2097152) {
      expr = token === 2162700 ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos) : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
      destructible |= parser.destructible;
      isSimpleParameterList = 1;
      if (parser.token !== 16 && parser.token !== 18) {
        if (destructible & 8) (0, _errors.report)(parser, 119);
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
        destructible |= 16;
        if ((parser.token & 8454144) === 8454144) {
          expr = parseBinaryExpression(parser, context, 1, start, line, column, 4, token, expr);
        }
        if ((0, _common.consumeOpt)(parser, context | 32768, 22)) {
          expr = parseConditionalExpression(parser, context, expr, start, line, column);
        }
      }
    } else if (token === 14) {
      expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 1, 1, 0, tokenPos, linePos, colPos);
      destructible |= (parser.token === 16 ? 0 : 16) | parser.destructible;
      isSimpleParameterList = 1;
    } else {
      expr = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
      destructible = parser.assignable;
      params.push(expr);
      while ((0, _common.consumeOpt)(parser, context | 32768, 18)) {
        params.push(parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos));
      }
      destructible |= parser.assignable;
      (0, _common.consume)(parser, context, 16);
      parser.destructible = destructible | 16;
      parser.assignable = 2;
      return (0, _common.finishNode)(parser, context, start, line, column, {
        type: 'CallExpression',
        callee: callee,
        arguments: params
      });
    }
    params.push(expr);
    if (!(0, _common.consumeOpt)(parser, context | 32768, 18)) break;
  }
  (0, _common.consume)(parser, context, 16);
  destructible |= parser.destructible & 256 ? 256 : 0 | parser.destructible & 128 ? 128 : 0;
  if (parser.token === 10) {
    if (destructible & (32 | 16)) (0, _errors.report)(parser, 25);
    if (parser.flags & 1 || flags & 1) (0, _errors.report)(parser, 46);
    if (destructible & 128) (0, _errors.report)(parser, 29);
    if (context & (1024 | 2097152) && destructible & 256) (0, _errors.report)(parser, 30);
    if (isSimpleParameterList) parser.flags |= 128;
    return parseParenthesizedArrow(parser, context, scope, params, canAssign, 1, start, line, column);
  } else if (destructible & 8) {
    (0, _errors.report)(parser, 60);
  }
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'CallExpression',
    callee: callee,
    arguments: params
  });
}
function parseRegExpLiteral(parser, context, start, line, column) {
  var tokenRaw = parser.tokenRaw,
    tokenRegExp = parser.tokenRegExp,
    tokenValue = parser.tokenValue;
  (0, _lexer.nextToken)(parser, context);
  parser.assignable = 2;
  return context & 512 ? (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'Literal',
    value: tokenValue,
    regex: tokenRegExp,
    raw: tokenRaw
  }) : (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'Literal',
    value: tokenValue,
    regex: tokenRegExp
  });
}
function parseClassDeclaration(parser, context, scope, flags, start, line, column) {
  context = (context | 16777216 | 1024) ^ 16777216;
  var decorators = parseDecorators(parser, context);
  if (decorators.length) {
    start = parser.tokenPos;
    line = parser.linePos;
    column = parser.colPos;
  }
  if (parser.leadingDecorators.length) {
    var _parser$leadingDecora;
    (_parser$leadingDecora = parser.leadingDecorators).push.apply(_parser$leadingDecora, _toConsumableArray(decorators));
    decorators = parser.leadingDecorators;
    parser.leadingDecorators = [];
  }
  (0, _lexer.nextToken)(parser, context);
  var id = null;
  var superClass = null;
  var tokenValue = parser.tokenValue;
  if (parser.token & 4096 && parser.token !== 20567) {
    if ((0, _common.isStrictReservedWord)(parser, context, parser.token)) {
      (0, _errors.report)(parser, 115);
    }
    if ((parser.token & 537079808) === 537079808) {
      (0, _errors.report)(parser, 116);
    }
    if (scope) {
      (0, _common.addBlockName)(parser, context, scope, tokenValue, 32, 0);
      if (flags) {
        if (flags & 2) {
          (0, _common.declareUnboundVariable)(parser, tokenValue);
        }
      }
    }
    id = parseIdentifier(parser, context, 0);
  } else {
    if ((flags & 1) === 0) (0, _errors.report)(parser, 37, 'Class');
  }
  var inheritedContext = context;
  if ((0, _common.consumeOpt)(parser, context | 32768, 20567)) {
    superClass = parseLeftHandSideExpression(parser, context, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    inheritedContext |= 524288;
  } else {
    inheritedContext = (inheritedContext | 524288) ^ 524288;
  }
  var body = parseClassBody(parser, inheritedContext, context, scope, 2, 8, 0);
  return (0, _common.finishNode)(parser, context, start, line, column, context & 1 ? {
    type: 'ClassDeclaration',
    id: id,
    superClass: superClass,
    decorators: decorators,
    body: body
  } : {
    type: 'ClassDeclaration',
    id: id,
    superClass: superClass,
    body: body
  });
}
function parseClassExpression(parser, context, inGroup, start, line, column) {
  var id = null;
  var superClass = null;
  context = (context | 1024 | 16777216) ^ 16777216;
  var decorators = parseDecorators(parser, context);
  if (decorators.length) {
    start = parser.tokenPos;
    line = parser.linePos;
    column = parser.colPos;
  }
  (0, _lexer.nextToken)(parser, context);
  if (parser.token & 4096 && parser.token !== 20567) {
    if ((0, _common.isStrictReservedWord)(parser, context, parser.token)) (0, _errors.report)(parser, 115);
    if ((parser.token & 537079808) === 537079808) {
      (0, _errors.report)(parser, 116);
    }
    id = parseIdentifier(parser, context, 0);
  }
  var inheritedContext = context;
  if ((0, _common.consumeOpt)(parser, context | 32768, 20567)) {
    superClass = parseLeftHandSideExpression(parser, context, 0, inGroup, 0, parser.tokenPos, parser.linePos, parser.colPos);
    inheritedContext |= 524288;
  } else {
    inheritedContext = (inheritedContext | 524288) ^ 524288;
  }
  var body = parseClassBody(parser, inheritedContext, context, void 0, 2, 0, inGroup);
  parser.assignable = 2;
  return (0, _common.finishNode)(parser, context, start, line, column, context & 1 ? {
    type: 'ClassExpression',
    id: id,
    superClass: superClass,
    decorators: decorators,
    body: body
  } : {
    type: 'ClassExpression',
    id: id,
    superClass: superClass,
    body: body
  });
}
function parseDecorators(parser, context) {
  var list = [];
  if (context & 1) {
    while (parser.token === 133) {
      list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
  }
  return list;
}
function parseDecoratorList(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var expression = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, start, line, column);
  expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'Decorator',
    expression: expression
  });
}
function parseClassBody(parser, context, inheritedContext, scope, kind, origin, inGroup) {
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  (0, _common.consume)(parser, context | 32768, 2162700);
  context = (context | 134217728) ^ 134217728;
  var hasConstr = parser.flags & 32;
  parser.flags = (parser.flags | 32) ^ 32;
  var body = [];
  var decorators;
  while (parser.token !== 1074790415) {
    var length = 0;
    decorators = parseDecorators(parser, context);
    length = decorators.length;
    if (length > 0 && parser.tokenValue === 'constructor') {
      (0, _errors.report)(parser, 107);
    }
    if (parser.token === 1074790415) (0, _errors.report)(parser, 106);
    if ((0, _common.consumeOpt)(parser, context, 1074790417)) {
      if (length > 0) (0, _errors.report)(parser, 117);
      continue;
    }
    body.push(parseClassElementList(parser, context, scope, inheritedContext, kind, decorators, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
  }
  (0, _common.consume)(parser, origin & 8 ? context | 32768 : context, 1074790415);
  parser.flags = parser.flags & ~32 | hasConstr;
  return (0, _common.finishNode)(parser, context, tokenPos, linePos, colPos, {
    type: 'ClassBody',
    body: body
  });
}
function parseClassElementList(parser, context, scope, inheritedContext, type, decorators, isStatic, inGroup, start, line, column) {
  var kind = isStatic ? 32 : 0;
  var key = null;
  var token = parser.token,
    tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  if (token & (143360 | 36864)) {
    key = parseIdentifier(parser, context, 0);
    switch (token) {
      case 36972:
        if (!isStatic && parser.token !== 67174411 && (parser.token & 1048576) !== 1048576 && parser.token !== 1077936157) {
          return parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 1, inGroup, start, line, column);
        }
        break;
      case 209007:
        if (parser.token !== 67174411 && (parser.flags & 1) === 0) {
          if (context & 1 && (parser.token & 1073741824) === 1073741824) {
            return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= 16 | ((0, _common.optionalBit)(parser, context, 8457014) ? 8 : 0);
        }
        break;
      case 12402:
        if (parser.token !== 67174411) {
          if (context & 1 && (parser.token & 1073741824) === 1073741824) {
            return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= 256;
        }
        break;
      case 12403:
        if (parser.token !== 67174411) {
          if (context & 1 && (parser.token & 1073741824) === 1073741824) {
            return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= 512;
        }
        break;
      default:
    }
  } else if (token === 69271571) {
    kind |= 2;
    key = parseComputedPropertyName(parser, inheritedContext, inGroup);
  } else if ((token & 134217728) === 134217728) {
    key = parseLiteral(parser, context);
  } else if (token === 8457014) {
    kind |= 8;
    (0, _lexer.nextToken)(parser, context);
  } else if (context & 1 && parser.token === 131) {
    kind |= 4096;
    key = parsePrivateIdentifier(parser, context | 16384, tokenPos, linePos, colPos);
  } else if (context & 1 && (parser.token & 1073741824) === 1073741824) {
    kind |= 128;
  } else if (isStatic && token === 2162700) {
    return parseStaticBlock(parser, context, scope, tokenPos, linePos, colPos);
  } else if (token === 122) {
    key = parseIdentifier(parser, context, 0);
    if (parser.token !== 67174411) (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
  } else {
    (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
  }
  if (kind & (8 | 16 | 768)) {
    if (parser.token & 143360) {
      key = parseIdentifier(parser, context, 0);
    } else if ((parser.token & 134217728) === 134217728) {
      key = parseLiteral(parser, context);
    } else if (parser.token === 69271571) {
      kind |= 2;
      key = parseComputedPropertyName(parser, context, 0);
    } else if (parser.token === 122) {
      key = parseIdentifier(parser, context, 0);
    } else if (context & 1 && parser.token === 131) {
      kind |= 4096;
      key = parsePrivateIdentifier(parser, context, tokenPos, linePos, colPos);
    } else (0, _errors.report)(parser, 132);
  }
  if ((kind & 2) === 0) {
    if (parser.tokenValue === 'constructor') {
      if ((parser.token & 1073741824) === 1073741824) {
        (0, _errors.report)(parser, 126);
      } else if ((kind & 32) === 0 && parser.token === 67174411) {
        if (kind & (768 | 16 | 128 | 8)) {
          (0, _errors.report)(parser, 51, 'accessor');
        } else if ((context & 524288) === 0) {
          if (parser.flags & 32) (0, _errors.report)(parser, 52);else parser.flags |= 32;
        }
      }
      kind |= 64;
    } else if ((kind & 4096) === 0 && kind & (32 | 768 | 8 | 16) && parser.tokenValue === 'prototype') {
      (0, _errors.report)(parser, 50);
    }
  }
  if (context & 1 && parser.token !== 67174411) {
    return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
  }
  var value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
  return (0, _common.finishNode)(parser, context, start, line, column, context & 1 ? {
    type: 'MethodDefinition',
    kind: (kind & 32) === 0 && kind & 64 ? 'constructor' : kind & 256 ? 'get' : kind & 512 ? 'set' : 'method',
    "static": (kind & 32) > 0,
    computed: (kind & 2) > 0,
    key: key,
    decorators: decorators,
    value: value
  } : {
    type: 'MethodDefinition',
    kind: (kind & 32) === 0 && kind & 64 ? 'constructor' : kind & 256 ? 'get' : kind & 512 ? 'set' : 'method',
    "static": (kind & 32) > 0,
    computed: (kind & 2) > 0,
    key: key,
    value: value
  });
}
function parsePrivateIdentifier(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  var tokenValue = parser.tokenValue;
  if (tokenValue === 'constructor') (0, _errors.report)(parser, 125);
  (0, _lexer.nextToken)(parser, context);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'PrivateIdentifier',
    name: tokenValue
  });
}
function parsePropertyDefinition(parser, context, key, state, decorators, start, line, column) {
  var value = null;
  if (state & 8) (0, _errors.report)(parser, 0);
  if (parser.token === 1077936157) {
    (0, _lexer.nextToken)(parser, context | 32768);
    var tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    if (parser.token === 537079928) (0, _errors.report)(parser, 116);
    value = parsePrimaryExpression(parser, context | 16384, 2, 0, 1, 0, 0, 1, tokenPos, linePos, colPos);
    if ((parser.token & 1073741824) !== 1073741824 || (parser.token & 4194304) === 4194304) {
      value = parseMemberOrUpdateExpression(parser, context | 16384, value, 0, 0, tokenPos, linePos, colPos);
      value = parseAssignmentExpression(parser, context | 16384, 0, 0, tokenPos, linePos, colPos, value);
      if (parser.token === 18) {
        value = parseSequenceExpression(parser, context, 0, start, line, column, value);
      }
    }
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'PropertyDefinition',
    key: key,
    value: value,
    "static": (state & 32) > 0,
    computed: (state & 2) > 0,
    decorators: decorators
  });
}
function parseBindingPattern(parser, context, scope, type, origin, start, line, column) {
  if (parser.token & 143360) return parseAndClassifyIdentifier(parser, context, scope, type, origin, start, line, column);
  if (parser.token === 139) {
    return parseGeneral(parser, context, start, line, column);
  }
  if ((parser.token & 2097152) !== 2097152) (0, _errors.report)(parser, 28, _token6.KeywordDescTable[parser.token & 255]);
  var left = parser.token === 69271571 ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column) : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column);
  if (parser.destructible & 16) (0, _errors.report)(parser, 48);
  if (parser.destructible & 32) (0, _errors.report)(parser, 48);
  return left;
}
function parseAndClassifyIdentifier(parser, context, scope, kind, origin, start, line, column) {
  var tokenValue = parser.tokenValue,
    token = parser.token;
  if (context & 1024) {
    if ((token & 537079808) === 537079808) {
      (0, _errors.report)(parser, 116);
    } else if ((token & 36864) === 36864) {
      (0, _errors.report)(parser, 115);
    }
  }
  if ((token & 20480) === 20480) {
    (0, _errors.report)(parser, 100);
  }
  if (context & (2048 | 2097152) && token === 241773) {
    (0, _errors.report)(parser, 30);
  }
  if (token === 241739) {
    if (kind & (8 | 16)) (0, _errors.report)(parser, 98);
  }
  if (context & (4194304 | 2048) && token === 209008) {
    (0, _errors.report)(parser, 96);
  }
  (0, _lexer.nextToken)(parser, context);
  if (scope) (0, _common.addVarOrBlock)(parser, context, scope, tokenValue, kind, origin);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'Identifier',
    name: tokenValue
  });
}
function parseJSXRootElementOrFragment(parser, context, inJSXChild, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  if (parser.token === 8456259) {
    return (0, _common.finishNode)(parser, context, start, line, column, {
      type: 'JSXFragment',
      openingFragment: parseOpeningFragment(parser, context, start, line, column),
      children: parseJSXChildren(parser, context),
      closingFragment: parseJSXClosingFragment(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos)
    });
  }
  var closingElement = null;
  var children = [];
  var openingElement = parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column);
  if (!openingElement.selfClosing) {
    children = parseJSXChildren(parser, context);
    closingElement = parseJSXClosingElement(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos);
    var close = (0, _common.isEqualTagName)(closingElement.name);
    if ((0, _common.isEqualTagName)(openingElement.name) !== close) (0, _errors.report)(parser, 150, close);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXElement',
    children: children,
    openingElement: openingElement,
    closingElement: closingElement
  });
}
function parseOpeningFragment(parser, context, start, line, column) {
  (0, _jsx.scanJSXToken)(parser, context);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXOpeningFragment'
  });
}
function parseJSXClosingElement(parser, context, inJSXChild, start, line, column) {
  (0, _common.consume)(parser, context, 25);
  var name = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  if (inJSXChild) {
    (0, _common.consume)(parser, context, 8456259);
  } else {
    parser.token = (0, _jsx.scanJSXToken)(parser, context);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXClosingElement',
    name: name
  });
}
function parseJSXClosingFragment(parser, context, inJSXChild, start, line, column) {
  (0, _common.consume)(parser, context, 25);
  if (inJSXChild) {
    (0, _common.consume)(parser, context, 8456259);
  } else {
    (0, _common.consume)(parser, context, 8456259);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXClosingFragment'
  });
}
function parseJSXChildren(parser, context) {
  var children = [];
  while (parser.token !== 25) {
    parser.index = parser.tokenPos = parser.startPos;
    parser.column = parser.colPos = parser.startColumn;
    parser.line = parser.linePos = parser.startLine;
    (0, _jsx.scanJSXToken)(parser, context);
    children.push(parseJSXChild(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
  }
  return children;
}
function parseJSXChild(parser, context, start, line, column) {
  if (parser.token === 138) return parseJSXText(parser, context, start, line, column);
  if (parser.token === 2162700) return parseJSXExpressionContainer(parser, context, 0, 0, start, line, column);
  if (parser.token === 8456258) return parseJSXRootElementOrFragment(parser, context, 0, start, line, column);
  (0, _errors.report)(parser, 0);
}
function parseJSXText(parser, context, start, line, column) {
  (0, _jsx.scanJSXToken)(parser, context);
  var node = {
    type: 'JSXText',
    value: parser.tokenValue
  };
  if (context & 512) {
    node.raw = parser.tokenRaw;
  }
  return (0, _common.finishNode)(parser, context, start, line, column, node);
}
function parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column) {
  if ((parser.token & 143360) !== 143360 && (parser.token & 4096) !== 4096) (0, _errors.report)(parser, 0);
  var tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  var attributes = parseJSXAttributes(parser, context);
  var selfClosing = parser.token === 8457016;
  if (parser.token === 8456259) {
    (0, _jsx.scanJSXToken)(parser, context);
  } else {
    (0, _common.consume)(parser, context, 8457016);
    if (inJSXChild) {
      (0, _common.consume)(parser, context, 8456259);
    } else {
      (0, _jsx.scanJSXToken)(parser, context);
    }
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXOpeningElement',
    name: tagName,
    attributes: attributes,
    selfClosing: selfClosing
  });
}
function parseJSXElementName(parser, context, start, line, column) {
  (0, _jsx.scanJSXIdentifier)(parser);
  var key = parseJSXIdentifier(parser, context, start, line, column);
  if (parser.token === 21) return parseJSXNamespacedName(parser, context, key, start, line, column);
  while ((0, _common.consumeOpt)(parser, context, 67108877)) {
    (0, _jsx.scanJSXIdentifier)(parser);
    key = parseJSXMemberExpression(parser, context, key, start, line, column);
  }
  return key;
}
function parseJSXMemberExpression(parser, context, object, start, line, column) {
  var property = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXMemberExpression',
    object: object,
    property: property
  });
}
function parseJSXAttributes(parser, context) {
  var attributes = [];
  while (parser.token !== 8457016 && parser.token !== 8456259 && parser.token !== 1048576) {
    attributes.push(parseJsxAttribute(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
  }
  return attributes;
}
function parseJSXSpreadAttribute(parser, context, start, line, column) {
  (0, _lexer.nextToken)(parser, context);
  (0, _common.consume)(parser, context, 14);
  var expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context, 1074790415);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXSpreadAttribute',
    argument: expression
  });
}
function parseJsxAttribute(parser, context, start, line, column) {
  if (parser.token === 2162700) return parseJSXSpreadAttribute(parser, context, start, line, column);
  (0, _jsx.scanJSXIdentifier)(parser);
  var value = null;
  var name = parseJSXIdentifier(parser, context, start, line, column);
  if (parser.token === 21) {
    name = parseJSXNamespacedName(parser, context, name, start, line, column);
  }
  if (parser.token === 1077936157) {
    var token = (0, _jsx.scanJSXAttributeValue)(parser, context);
    var tokenPos = parser.tokenPos,
      linePos = parser.linePos,
      colPos = parser.colPos;
    switch (token) {
      case 134283267:
        value = parseLiteral(parser, context);
        break;
      case 8456258:
        value = parseJSXRootElementOrFragment(parser, context, 1, tokenPos, linePos, colPos);
        break;
      case 2162700:
        value = parseJSXExpressionContainer(parser, context, 1, 1, tokenPos, linePos, colPos);
        break;
      default:
        (0, _errors.report)(parser, 149);
    }
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXAttribute',
    value: value,
    name: name
  });
}
function parseJSXNamespacedName(parser, context, namespace, start, line, column) {
  (0, _common.consume)(parser, context, 21);
  var name = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXNamespacedName',
    namespace: namespace,
    name: name
  });
}
function parseJSXExpressionContainer(parser, context, inJSXChild, isAttr, start, line, column) {
  (0, _lexer.nextToken)(parser, context | 32768);
  var tokenPos = parser.tokenPos,
    linePos = parser.linePos,
    colPos = parser.colPos;
  if (parser.token === 14) return parseJSXSpreadChild(parser, context, start, line, column);
  var expression = null;
  if (parser.token === 1074790415) {
    if (isAttr) (0, _errors.report)(parser, 152);
    expression = parseJSXEmptyExpression(parser, context, parser.startPos, parser.startLine, parser.startColumn);
  } else {
    expression = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
  }
  if (inJSXChild) {
    (0, _common.consume)(parser, context, 1074790415);
  } else {
    (0, _jsx.scanJSXToken)(parser, context);
  }
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXExpressionContainer',
    expression: expression
  });
}
function parseJSXSpreadChild(parser, context, start, line, column) {
  (0, _common.consume)(parser, context, 14);
  var expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  (0, _common.consume)(parser, context, 1074790415);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXSpreadChild',
    expression: expression
  });
}
function parseJSXEmptyExpression(parser, context, start, line, column) {
  parser.startPos = parser.tokenPos;
  parser.startLine = parser.linePos;
  parser.startColumn = parser.colPos;
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXEmptyExpression'
  });
}
function parseJSXIdentifier(parser, context, start, line, column) {
  var tokenValue = parser.tokenValue;
  (0, _lexer.nextToken)(parser, context);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: 'JSXIdentifier',
    name: tokenValue
  });
}
function parseGeneral(parser, context, start, line, column) {
  var tokenValue = parser.tokenValue;
  (0, _lexer.nextToken)(parser, context);
  return (0, _common.finishNode)(parser, context, start, line, column, {
    type: "General"
  });
}