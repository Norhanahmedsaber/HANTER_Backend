"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanDecimalDigitsOrSeparator = scanDecimalDigitsOrSeparator;
exports.scanNumber = scanNumber;
var _common = require("./common");
var _charClassifier = require("./charClassifier");
var _errors = require("../errors");
function scanNumber(parser, context, kind) {
  var _char = parser.currentChar;
  var value = 0;
  var digit = 9;
  var atStart = kind & 64 ? 0 : 1;
  var digits = 0;
  var allowSeparator = 0;
  if (kind & 64) {
    value = '.' + scanDecimalDigitsOrSeparator(parser, _char);
    _char = parser.currentChar;
    if (_char === 110) (0, _errors.report)(parser, 11);
  } else {
    if (_char === 48) {
      _char = (0, _common.advanceChar)(parser);
      if ((_char | 32) === 120) {
        kind = 8 | 128;
        _char = (0, _common.advanceChar)(parser);
        while (_charClassifier.CharTypes[_char] & (64 | 4096)) {
          if (_char === 95) {
            if (!allowSeparator) (0, _errors.report)(parser, 147);
            allowSeparator = 0;
            _char = (0, _common.advanceChar)(parser);
            continue;
          }
          allowSeparator = 1;
          value = value * 0x10 + (0, _common.toHex)(_char);
          digits++;
          _char = (0, _common.advanceChar)(parser);
        }
        if (digits === 0 || !allowSeparator) {
          (0, _errors.report)(parser, digits === 0 ? 19 : 148);
        }
      } else if ((_char | 32) === 111) {
        kind = 4 | 128;
        _char = (0, _common.advanceChar)(parser);
        while (_charClassifier.CharTypes[_char] & (32 | 4096)) {
          if (_char === 95) {
            if (!allowSeparator) {
              (0, _errors.report)(parser, 147);
            }
            allowSeparator = 0;
            _char = (0, _common.advanceChar)(parser);
            continue;
          }
          allowSeparator = 1;
          value = value * 8 + (_char - 48);
          digits++;
          _char = (0, _common.advanceChar)(parser);
        }
        if (digits === 0 || !allowSeparator) {
          (0, _errors.report)(parser, digits === 0 ? 0 : 148);
        }
      } else if ((_char | 32) === 98) {
        kind = 2 | 128;
        _char = (0, _common.advanceChar)(parser);
        while (_charClassifier.CharTypes[_char] & (128 | 4096)) {
          if (_char === 95) {
            if (!allowSeparator) {
              (0, _errors.report)(parser, 147);
            }
            allowSeparator = 0;
            _char = (0, _common.advanceChar)(parser);
            continue;
          }
          allowSeparator = 1;
          value = value * 2 + (_char - 48);
          digits++;
          _char = (0, _common.advanceChar)(parser);
        }
        if (digits === 0 || !allowSeparator) {
          (0, _errors.report)(parser, digits === 0 ? 0 : 148);
        }
      } else if (_charClassifier.CharTypes[_char] & 32) {
        if (context & 1024) (0, _errors.report)(parser, 1);
        kind = 1;
        while (_charClassifier.CharTypes[_char] & 16) {
          if (_charClassifier.CharTypes[_char] & 512) {
            kind = 32;
            atStart = 0;
            break;
          }
          value = value * 8 + (_char - 48);
          _char = (0, _common.advanceChar)(parser);
        }
      } else if (_charClassifier.CharTypes[_char] & 512) {
        if (context & 1024) (0, _errors.report)(parser, 1);
        parser.flags |= 64;
        kind = 32;
      } else if (_char === 95) {
        (0, _errors.report)(parser, 0);
      }
    }
    if (kind & 48) {
      if (atStart) {
        while (digit >= 0 && _charClassifier.CharTypes[_char] & (16 | 4096)) {
          if (_char === 95) {
            _char = (0, _common.advanceChar)(parser);
            if (_char === 95 || kind & 32) {
              (0, _errors.reportScannerError)(parser.index, parser.line, parser.index + 1, 147);
            }
            allowSeparator = 1;
            continue;
          }
          allowSeparator = 0;
          value = 10 * value + (_char - 48);
          _char = (0, _common.advanceChar)(parser);
          --digit;
        }
        if (allowSeparator) {
          (0, _errors.reportScannerError)(parser.index, parser.line, parser.index + 1, 148);
        }
        if (digit >= 0 && !(0, _charClassifier.isIdentifierStart)(_char) && _char !== 46) {
          parser.tokenValue = value;
          if (context & 512) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
          return 134283266;
        }
      }
      value += scanDecimalDigitsOrSeparator(parser, _char);
      _char = parser.currentChar;
      if (_char === 46) {
        if ((0, _common.advanceChar)(parser) === 95) (0, _errors.report)(parser, 0);
        kind = 64;
        value += '.' + scanDecimalDigitsOrSeparator(parser, parser.currentChar);
        _char = parser.currentChar;
      }
    }
  }
  var end = parser.index;
  var isBigInt = 0;
  if (_char === 110 && kind & 128) {
    isBigInt = 1;
    _char = (0, _common.advanceChar)(parser);
  } else {
    if ((_char | 32) === 101) {
      _char = (0, _common.advanceChar)(parser);
      if (_charClassifier.CharTypes[_char] & 256) _char = (0, _common.advanceChar)(parser);
      var index = parser.index;
      if ((_charClassifier.CharTypes[_char] & 16) === 0) (0, _errors.report)(parser, 10);
      value += parser.source.substring(end, index) + scanDecimalDigitsOrSeparator(parser, _char);
      _char = parser.currentChar;
    }
  }
  if (parser.index < parser.end && _charClassifier.CharTypes[_char] & 16 || (0, _charClassifier.isIdentifierStart)(_char)) {
    (0, _errors.report)(parser, 12);
  }
  if (isBigInt) {
    parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    parser.tokenValue = BigInt(value);
    return 134283389;
  }
  parser.tokenValue = kind & (1 | 2 | 8 | 4) ? value : kind & 32 ? parseFloat(parser.source.substring(parser.tokenPos, parser.index)) : +value;
  if (context & 512) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
  return 134283266;
}
function scanDecimalDigitsOrSeparator(parser, _char2) {
  var allowSeparator = 0;
  var start = parser.index;
  var ret = '';
  while (_charClassifier.CharTypes[_char2] & (16 | 4096)) {
    if (_char2 === 95) {
      var index = parser.index;
      _char2 = (0, _common.advanceChar)(parser);
      if (_char2 === 95) {
        (0, _errors.reportScannerError)(parser.index, parser.line, parser.index + 1, 147);
      }
      allowSeparator = 1;
      ret += parser.source.substring(start, index);
      start = parser.index;
      continue;
    }
    allowSeparator = 0;
    _char2 = (0, _common.advanceChar)(parser);
  }
  if (allowSeparator) {
    (0, _errors.reportScannerError)(parser.index, parser.line, parser.index + 1, 148);
  }
  return ret + parser.source.substring(start, parser.index);
}