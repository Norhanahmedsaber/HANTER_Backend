"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanIdentifier = scanIdentifier;
exports.scanIdentifierSlowCase = scanIdentifierSlowCase;
exports.scanIdentifierUnicodeEscape = scanIdentifierUnicodeEscape;
exports.scanPrivateIdentifier = scanPrivateIdentifier;
exports.scanUnicodeEscape = scanUnicodeEscape;
exports.scanUnicodeIdentifier = scanUnicodeIdentifier;
var _token = require("../token");
var _common = require("./common");
var _charClassifier = require("./charClassifier");
var _errors = require("../errors");
function scanIdentifier(parser, context, isValidAsKeyword) {
  while (_charClassifier.isIdPart[(0, _common.advanceChar)(parser)]) {}
  parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
  return parser.currentChar !== 92 && parser.currentChar <= 0x7e ? _token.descKeywordTable[parser.tokenValue] || 208897 : scanIdentifierSlowCase(parser, context, 0, isValidAsKeyword);
}
function scanUnicodeIdentifier(parser, context) {
  var cookedChar = scanIdentifierUnicodeEscape(parser);
  if (!(0, _charClassifier.isIdentifierPart)(cookedChar)) (0, _errors.report)(parser, 4);
  parser.tokenValue = (0, _common.fromCodePoint)(cookedChar);
  return scanIdentifierSlowCase(parser, context, 1, _charClassifier.CharTypes[cookedChar] & 4);
}
function scanIdentifierSlowCase(parser, context, hasEscape, isValidAsKeyword) {
  var start = parser.index;
  while (parser.index < parser.end) {
    if (parser.currentChar === 92) {
      parser.tokenValue += parser.source.slice(start, parser.index);
      hasEscape = 1;
      var code = scanIdentifierUnicodeEscape(parser);
      if (!(0, _charClassifier.isIdentifierPart)(code)) (0, _errors.report)(parser, 4);
      isValidAsKeyword = isValidAsKeyword && _charClassifier.CharTypes[code] & 4;
      parser.tokenValue += (0, _common.fromCodePoint)(code);
      start = parser.index;
    } else if ((0, _charClassifier.isIdentifierPart)(parser.currentChar) || (0, _common.consumeMultiUnitCodePoint)(parser, parser.currentChar)) {
      (0, _common.advanceChar)(parser);
    } else {
      break;
    }
  }
  if (parser.index <= parser.end) {
    parser.tokenValue += parser.source.slice(start, parser.index);
  }
  var length = parser.tokenValue.length;
  if (isValidAsKeyword && length >= 2 && length <= 11) {
    var token = _token.descKeywordTable[parser.tokenValue];
    if (token === void 0) return 208897;
    if (!hasEscape) return token;
    if (token === 209008) {
      if ((context & (2048 | 4194304)) === 0) {
        return token;
      }
      return 121;
    }
    if (context & 1024) {
      if (token === 36972) {
        return 122;
      }
      if ((token & 36864) === 36864) {
        return 122;
      }
      if ((token & 20480) === 20480) {
        if (context & 1073741824 && (context & 8192) === 0) {
          return token;
        } else {
          return 121;
        }
      }
      return 143483;
    }
    if (context & 1073741824 && (context & 8192) === 0 && (token & 20480) === 20480) return token;
    if (token === 241773) {
      return context & 1073741824 ? 143483 : context & 2097152 ? 121 : token;
    }
    if (token === 209007) {
      return 143483;
    }
    if ((token & 36864) === 36864) {
      return token;
    }
    return 121;
  }
  return 208897;
}
function scanPrivateIdentifier(parser) {
  if (!(0, _charClassifier.isIdentifierStart)((0, _common.advanceChar)(parser))) (0, _errors.report)(parser, 94);
  return 131;
}
function scanIdentifierUnicodeEscape(parser) {
  if (parser.source.charCodeAt(parser.index + 1) !== 117) {
    (0, _errors.report)(parser, 4);
  }
  parser.currentChar = parser.source.charCodeAt(parser.index += 2);
  return scanUnicodeEscape(parser);
}
function scanUnicodeEscape(parser) {
  var codePoint = 0;
  var _char = parser.currentChar;
  if (_char === 123) {
    var begin = parser.index - 2;
    while (_charClassifier.CharTypes[(0, _common.advanceChar)(parser)] & 64) {
      codePoint = codePoint << 4 | (0, _common.toHex)(parser.currentChar);
      if (codePoint > 1114111) (0, _errors.reportScannerError)(begin, parser.line, parser.index + 1, 102);
    }
    if (parser.currentChar !== 125) {
      (0, _errors.reportScannerError)(begin, parser.line, parser.index - 1, 6);
    }
    (0, _common.advanceChar)(parser);
    return codePoint;
  }
  if ((_charClassifier.CharTypes[_char] & 64) === 0) (0, _errors.report)(parser, 6);
  var char2 = parser.source.charCodeAt(parser.index + 1);
  if ((_charClassifier.CharTypes[char2] & 64) === 0) (0, _errors.report)(parser, 6);
  var char3 = parser.source.charCodeAt(parser.index + 2);
  if ((_charClassifier.CharTypes[char3] & 64) === 0) (0, _errors.report)(parser, 6);
  var char4 = parser.source.charCodeAt(parser.index + 3);
  if ((_charClassifier.CharTypes[char4] & 64) === 0) (0, _errors.report)(parser, 6);
  codePoint = (0, _common.toHex)(_char) << 12 | (0, _common.toHex)(char2) << 8 | (0, _common.toHex)(char3) << 4 | (0, _common.toHex)(char4);
  parser.currentChar = parser.source.charCodeAt(parser.index += 4);
  return codePoint;
}