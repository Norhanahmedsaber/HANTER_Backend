"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleStringError = handleStringError;
exports.parseEscape = parseEscape;
exports.scanString = scanString;
var _errors = require("../errors");
var _common = require("./common");
var _charClassifier = require("./charClassifier");
function scanString(parser, context, quote) {
  var start = parser.index;
  var ret = '';
  var _char = (0, _common.advanceChar)(parser);
  var marker = parser.index;
  while ((_charClassifier.CharTypes[_char] & 8) === 0) {
    if (_char === quote) {
      ret += parser.source.slice(marker, parser.index);
      (0, _common.advanceChar)(parser);
      if (context & 512) parser.tokenRaw = parser.source.slice(start, parser.index);
      parser.tokenValue = ret;
      return 134283267;
    }
    if ((_char & 8) === 8 && _char === 92) {
      ret += parser.source.slice(marker, parser.index);
      _char = (0, _common.advanceChar)(parser);
      if (_char < 0x7f || _char === 8232 || _char === 8233) {
        var code = parseEscape(parser, context, _char);
        if (code >= 0) ret += (0, _common.fromCodePoint)(code);else handleStringError(parser, code, 0);
      } else {
        ret += (0, _common.fromCodePoint)(_char);
      }
      marker = parser.index + 1;
    }
    if (parser.index >= parser.end) (0, _errors.report)(parser, 14);
    _char = (0, _common.advanceChar)(parser);
  }
  (0, _errors.report)(parser, 14);
}
function parseEscape(parser, context, first) {
  switch (first) {
    case 98:
      return 8;
    case 102:
      return 12;
    case 114:
      return 13;
    case 110:
      return 10;
    case 116:
      return 9;
    case 118:
      return 11;
    case 13:
      {
        if (parser.index < parser.end) {
          var nextChar = parser.source.charCodeAt(parser.index + 1);
          if (nextChar === 10) {
            parser.index = parser.index + 1;
            parser.currentChar = nextChar;
          }
        }
      }
    case 10:
    case 8232:
    case 8233:
      parser.column = -1;
      parser.line++;
      return -1;
    case 48:
    case 49:
    case 50:
    case 51:
      {
        var code = first - 48;
        var index = parser.index + 1;
        var column = parser.column + 1;
        if (index < parser.end) {
          var next = parser.source.charCodeAt(index);
          if ((_charClassifier.CharTypes[next] & 32) === 0) {
            if ((code !== 0 || _charClassifier.CharTypes[next] & 512) && context & 1024) return -2;
          } else if (context & 1024) {
            return -2;
          } else {
            parser.currentChar = next;
            code = code << 3 | next - 48;
            index++;
            column++;
            if (index < parser.end) {
              var _next = parser.source.charCodeAt(index);
              if (_charClassifier.CharTypes[_next] & 32) {
                parser.currentChar = _next;
                code = code << 3 | _next - 48;
                index++;
                column++;
              }
            }
            parser.flags |= 64;
            parser.index = index - 1;
            parser.column = column - 1;
          }
        }
        return code;
      }
    case 52:
    case 53:
    case 54:
    case 55:
      {
        if (context & 1024) return -2;
        var _code = first - 48;
        var _index = parser.index + 1;
        var _column = parser.column + 1;
        if (_index < parser.end) {
          var _next2 = parser.source.charCodeAt(_index);
          if (_charClassifier.CharTypes[_next2] & 32) {
            _code = _code << 3 | _next2 - 48;
            parser.currentChar = _next2;
            parser.index = _index;
            parser.column = _column;
          }
        }
        parser.flags |= 64;
        return _code;
      }
    case 120:
      {
        var ch1 = (0, _common.advanceChar)(parser);
        if ((_charClassifier.CharTypes[ch1] & 64) === 0) return -4;
        var hi = (0, _common.toHex)(ch1);
        var ch2 = (0, _common.advanceChar)(parser);
        if ((_charClassifier.CharTypes[ch2] & 64) === 0) return -4;
        var lo = (0, _common.toHex)(ch2);
        return hi << 4 | lo;
      }
    case 117:
      {
        var ch = (0, _common.advanceChar)(parser);
        if (parser.currentChar === 123) {
          var _code2 = 0;
          while ((_charClassifier.CharTypes[(0, _common.advanceChar)(parser)] & 64) !== 0) {
            _code2 = _code2 << 4 | (0, _common.toHex)(parser.currentChar);
            if (_code2 > 1114111) return -5;
          }
          if (parser.currentChar < 1 || parser.currentChar !== 125) {
            return -4;
          }
          return _code2;
        } else {
          if ((_charClassifier.CharTypes[ch] & 64) === 0) return -4;
          var _ch = parser.source.charCodeAt(parser.index + 1);
          if ((_charClassifier.CharTypes[_ch] & 64) === 0) return -4;
          var ch3 = parser.source.charCodeAt(parser.index + 2);
          if ((_charClassifier.CharTypes[ch3] & 64) === 0) return -4;
          var ch4 = parser.source.charCodeAt(parser.index + 3);
          if ((_charClassifier.CharTypes[ch4] & 64) === 0) return -4;
          parser.index += 3;
          parser.column += 3;
          parser.currentChar = parser.source.charCodeAt(parser.index);
          return (0, _common.toHex)(ch) << 12 | (0, _common.toHex)(_ch) << 8 | (0, _common.toHex)(ch3) << 4 | (0, _common.toHex)(ch4);
        }
      }
    case 56:
    case 57:
      if ((context & 256) === 0) return -3;
    default:
      return first;
  }
}
function handleStringError(state, code, isTemplate) {
  switch (code) {
    case -1:
      return;
    case -2:
      (0, _errors.report)(state, isTemplate ? 2 : 1);
    case -3:
      (0, _errors.report)(state, 13);
    case -4:
      (0, _errors.report)(state, 6);
    case -5:
      (0, _errors.report)(state, 102);
    default:
  }
}