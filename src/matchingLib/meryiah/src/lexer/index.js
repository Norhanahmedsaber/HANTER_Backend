"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CharTypes", {
  enumerable: true,
  get: function get() {
    return _charClassifier.CharTypes;
  }
});
Object.defineProperty(exports, "TokenLookup", {
  enumerable: true,
  get: function get() {
    return _scan.TokenLookup;
  }
});
Object.defineProperty(exports, "advanceChar", {
  enumerable: true,
  get: function get() {
    return _common.advanceChar;
  }
});
Object.defineProperty(exports, "consumeLineFeed", {
  enumerable: true,
  get: function get() {
    return _common.consumeLineFeed;
  }
});
Object.defineProperty(exports, "consumeMultiUnitCodePoint", {
  enumerable: true,
  get: function get() {
    return _common.consumeMultiUnitCodePoint;
  }
});
Object.defineProperty(exports, "convertTokenType", {
  enumerable: true,
  get: function get() {
    return _common.convertTokenType;
  }
});
Object.defineProperty(exports, "fromCodePoint", {
  enumerable: true,
  get: function get() {
    return _common.fromCodePoint;
  }
});
Object.defineProperty(exports, "isExoticECMAScriptWhitespace", {
  enumerable: true,
  get: function get() {
    return _common.isExoticECMAScriptWhitespace;
  }
});
Object.defineProperty(exports, "isIdentifierPart", {
  enumerable: true,
  get: function get() {
    return _charClassifier.isIdentifierPart;
  }
});
Object.defineProperty(exports, "isIdentifierStart", {
  enumerable: true,
  get: function get() {
    return _charClassifier.isIdentifierStart;
  }
});
Object.defineProperty(exports, "nextToken", {
  enumerable: true,
  get: function get() {
    return _scan.nextToken;
  }
});
Object.defineProperty(exports, "scanIdentifier", {
  enumerable: true,
  get: function get() {
    return _identifier.scanIdentifier;
  }
});
Object.defineProperty(exports, "scanIdentifierSlowCase", {
  enumerable: true,
  get: function get() {
    return _identifier.scanIdentifierSlowCase;
  }
});
Object.defineProperty(exports, "scanNewLine", {
  enumerable: true,
  get: function get() {
    return _common.scanNewLine;
  }
});
Object.defineProperty(exports, "scanNumber", {
  enumerable: true,
  get: function get() {
    return _numeric.scanNumber;
  }
});
Object.defineProperty(exports, "scanPrivateIdentifier", {
  enumerable: true,
  get: function get() {
    return _identifier.scanPrivateIdentifier;
  }
});
Object.defineProperty(exports, "scanRegularExpression", {
  enumerable: true,
  get: function get() {
    return _regexp.scanRegularExpression;
  }
});
Object.defineProperty(exports, "scanSingleToken", {
  enumerable: true,
  get: function get() {
    return _scan.scanSingleToken;
  }
});
Object.defineProperty(exports, "scanString", {
  enumerable: true,
  get: function get() {
    return _string.scanString;
  }
});
Object.defineProperty(exports, "scanTemplate", {
  enumerable: true,
  get: function get() {
    return _template.scanTemplate;
  }
});
Object.defineProperty(exports, "scanTemplateTail", {
  enumerable: true,
  get: function get() {
    return _template.scanTemplateTail;
  }
});
Object.defineProperty(exports, "scanUnicodeEscape", {
  enumerable: true,
  get: function get() {
    return _identifier.scanUnicodeEscape;
  }
});
Object.defineProperty(exports, "scanUnicodeIdentifier", {
  enumerable: true,
  get: function get() {
    return _identifier.scanUnicodeIdentifier;
  }
});
Object.defineProperty(exports, "skipHashBang", {
  enumerable: true,
  get: function get() {
    return _comments.skipHashBang;
  }
});
Object.defineProperty(exports, "skipMultiLineComment", {
  enumerable: true,
  get: function get() {
    return _comments.skipMultiLineComment;
  }
});
Object.defineProperty(exports, "skipSingleHTMLComment", {
  enumerable: true,
  get: function get() {
    return _comments.skipSingleHTMLComment;
  }
});
Object.defineProperty(exports, "skipSingleLineComment", {
  enumerable: true,
  get: function get() {
    return _comments.skipSingleLineComment;
  }
});
Object.defineProperty(exports, "toHex", {
  enumerable: true,
  get: function get() {
    return _common.toHex;
  }
});
var _scan = require("./scan");
var _comments = require("./comments");
var _common = require("./common");
var _charClassifier = require("./charClassifier");
var _identifier = require("./identifier");
var _string = require("./string");
var _numeric = require("./numeric");
var _template = require("./template");
var _regexp = require("./regexp");