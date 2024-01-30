"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Identifier$MetaVaria;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _default = exports["default"] = (_Identifier$MetaVaria = {
  Identifier: "Identifier",
  MetaVariable: "MetaVariable",
  // Expression
  ArrowFunctionExpression: "Expression",
  AssignmentExpression: "Expression",
  // HANT
  BinaryExpression: "Expression",
  // HANT
  ConditionalExpression: "Expression",
  // HANT
  MetaProperty: "Expression",
  ChainExpression: "Expression",
  JSXClosingElement: "Expression",
  JSXClosingFragment: "Expression",
  JSXExpressionContainer: "Expression",
  JSXOpeningElement: "Expression",
  JSXOpeningFragment: "Expression",
  JSXSpreadChild: "Expression",
  LogicalExpression: "Expression",
  // HANT
  NewExpression: "Expression",
  // HANT
  RestElement: "Expression",
  // NA
  SequenceExpression: "Expression",
  // HANT
  SpreadElement: "Expression",
  // NA
  AwaitExpression: "Expression",
  // HANT  
  UnaryExpression: "Expression",
  UpdateExpression: "Expression",
  YieldExpression: "Expression",
  General: "Expression",
  CallExpression: "Expression"
}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_Identifier$MetaVaria, "ChainExpression", "Expression"), "ImportExpression", "Expression"), "ClassExpression", "Expression"), "ClassDeclaration", "Expression"), "FunctionExpression", "Expression"), "LiteralExpression", "Expression"), "MemberExpression", "Expression"), "PrimaryExpression", "Expression"), "TaggedTemplateExpression", "Expression"), "MetaVariable", "Expression"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_Identifier$MetaVaria, "ArrayExpression", "Expression"), "ArrayPattern", "Expression"), "ClassExpression", "Expression"), "FunctionExpression", "Expression"), "Import", "Expression"), "JSXElement", "Expression"), "JSXFragment", "Expression"), "Literal", "Expression"), "MetaProperty", "Expression"), "ObjectExpression", "Expression"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_Identifier$MetaVaria, "ObjectPattern", "Expression"), "Super", "Expression"), "TemplateLiteral", "Expression"), "ThisExpression", "Expression"), "ArrayPattern", "BindingPattern"), "ObjectPattern", "BindingPattern"));