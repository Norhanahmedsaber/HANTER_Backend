"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _CallExpression$Chain;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _default = exports["default"] = (_CallExpression$Chain = {
  CallExpression: "CallExpression",
  // HANT 
  ChainExpression: "ChainExpression",
  ImportExpression: "ImportExpression",
  // HANT
  ClassExpression: "ClassExpression",
  // PM
  ClassDeclaration: "ClassDeclaration",
  //PM
  FunctionExpression: "FunctionExpression",
  // HANT
  LiteralExpression: "LiteralExpression",
  // HANT (IN)
  MemberExpression: "MemberExpression",
  // HANT
  PrimaryExpression: "PrimaryExpression",
  TaggedTemplateExpression: "TaggedTemplateExpression",
  Literal: "LiteralExpression",
  TemplateLiteral: "LiteralExpression",
  MetaVariable: "PrimaryExpression",
  ArrayExpression: "PrimaryExpression",
  //HANT
  ArrayPattern: "PrimaryExpression"
}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_CallExpression$Chain, "ClassExpression", "PrimaryExpression"), "FunctionExpression", "PrimaryExpression"), "Identifier", "PrimaryExpression"), "Import", "PrimaryExpression"), "JSXElement", "PrimaryExpression"), "JSXFragment", "PrimaryExpression"), "JSXOpeningElement", "PrimaryExpression"), "Literal", "PrimaryExpression"), "MetaProperty", "PrimaryExpression"), "ObjectExpression", "PrimaryExpression"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_CallExpression$Chain, "ObjectPattern", "PrimaryExpression"), "Super", "PrimaryExpression"), "TemplateLiteral", "PrimaryExpression"), "ThisExpression", "PrimaryExpression"));