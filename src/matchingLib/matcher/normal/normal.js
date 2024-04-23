"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _abstractSyntaxTree = _interopRequireDefault(require("abstract-syntax-tree"));
var _evaluate = _interopRequireDefault(require("../evaluate.js"));
var _matchingAlgorithms = _interopRequireDefault(require("../matchingAlgorithms3.js"));
var _helpers = require("../helpers.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function matchNormalRule(_ref, rule, reports) {
  var fileName = _ref.name,
    ast = _ref.ast;
  var metaVariables = [];
  var logicBlock = createLogicContainer(rule, ast, metaVariables);
  var match = (0, _evaluate["default"])(logicBlock);
  if (match) {
    reports.reports.push({
      filepath: fileName,
      line: match.line,
      col: match.column,
      rule_name: rule.id,
      message: rule.message
    });
  }
}
function matchPattern(fileAST, pattern, metaVariables) {
  var targetedNode;
  var AST;
  if (pattern.pattern) {
    if (pattern.pattern.body.length == 1) {
      // Type 1 (Single Line)
      targetedNode = pattern.pattern.body[0];
      AST = fileAST;
    } else {
      // Type 2 (Multi Line)
      AST = (0, _helpers.createBlockStatement)(fileAST);
      targetedNode = (0, _helpers.createBlockStatement)(pattern.pattern);
    }
  } else {
    if (pattern['pattern-not'].body.length == 1) {
      // Type 1 (Single Line)
      AST = fileAST;
      targetedNode = pattern['pattern-not'].body[0];
    } else {
      // Type 2 (Multi Line)
      AST = (0, _helpers.createBlockStatement)(fileAST);
      targetedNode = (0, _helpers.createBlockStatement)(pattern['pattern-not']);
    }
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
  return match;
}
function report(fileName, info, reports) {
  if (reports.reports[fileName]) {
    reports.reports[fileName].push(info);
  } else {
    reports.reports[fileName] = [info];
  }
}
function createLogicContainer(rule, ast, metaVariables) {
  return processPattern(rule, ast, metaVariables);
}
function processPattern(rule, ast, metaVariables) {
  if (rule.patterns) {
    return {
      type: "AND",
      value: rule.patterns.map(function (p) {
        return processPattern(p, ast, metaVariables);
      })
    };
  } else if (rule['pattern-either']) {
    return {
      type: "OR",
      value: rule['pattern-either'].map(function (p) {
        return processPattern(p, ast, metaVariables);
      })
    };
  } else {
    return convertSinglePattern(rule, ast, metaVariables);
  }
}
function convertSinglePattern(pattern, ast, metaVariables) {
  if (pattern.pattern) {
    return {
      type: 'pattern',
      value: matchPattern(ast, pattern, metaVariables)
    }; // Placeholder for actual pattern match
  } else if (pattern['pattern-not']) {
    return {
      type: 'pattern',
      value: !matchPattern(ast, pattern, metaVariables)
    }; // Placeholder for pattern not match
  }
  // Add more conditions here for other pattern types like pattern-inside, pattern-regex, etc.
}
var _default = exports["default"] = matchNormalRule;