"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = match;
var _abstractSyntaxTree = _interopRequireDefault(require("abstract-syntax-tree"));
var _evaluate = _interopRequireDefault(require("./evaluate.js"));
var _matchingAlgorithms = _interopRequireDefault(require("./matchingAlgorithms2.js"));
var _helpers = require("./helpers.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function match(file, rules, reports) {
  var _iterator = _createForOfIteratorHelper(rules),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var rule = _step.value;
      matchRule(file, rule, reports);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function matchRule(_ref, rule, reports) {
  var fileName = _ref.name,
    ast = _ref.ast;
  var logicBlock = createLogicContainer(rule, ast);
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
function matchPattern(fileAST, pattern) {
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
        if (_matchingAlgorithms["default"][targetedNode.type](targetedNode, node)) {
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
function createLogicContainer(rule, ast) {
  return processPattern(rule, ast);
}
function processPattern(rule, ast) {
  if (rule.patterns) {
    return {
      type: "AND",
      value: rule.patterns.map(function (p) {
        return processPattern(p, ast);
      })
    };
  } else if (rule['pattern-either']) {
    return {
      type: "OR",
      value: rule['pattern-either'].map(function (p) {
        return processPattern(p, ast);
      })
    };
  } else {
    return convertSinglePattern(rule, ast);
  }
}
function convertSinglePattern(pattern, ast) {
  if (pattern.pattern) {
    return {
      type: 'pattern',
      value: matchPattern(ast, pattern)
    }; // Placeholder for actual pattern match
  } else if (pattern['pattern-not']) {
    return {
      type: 'pattern',
      value: !matchPattern(ast, pattern)
    }; // Placeholder for pattern not match
  }
  // Add more conditions here for other pattern types like pattern-inside, pattern-regex, etc.
}