"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanRegularExpression = scanRegularExpression;
var _common = require("./common");
var _charClassifier = require("./charClassifier");
var _errors = require("../errors");
function scanRegularExpression(parser, context) {
  var bodyStart = parser.index;
  var preparseState = 0;
  loop: while (true) {
    var ch = parser.currentChar;
    (0, _common.advanceChar)(parser);
    if (preparseState & 1) {
      preparseState &= ~1;
    } else {
      switch (ch) {
        case 47:
          if (!preparseState) break loop;else break;
        case 92:
          preparseState |= 1;
          break;
        case 91:
          preparseState |= 2;
          break;
        case 93:
          preparseState &= 1;
          break;
        case 13:
        case 10:
        case 8232:
        case 8233:
          (0, _errors.report)(parser, 32);
        default:
      }
    }
    if (parser.index >= parser.source.length) {
      return (0, _errors.report)(parser, 32);
    }
  }
  var bodyEnd = parser.index - 1;
  var mask = 0;
  var _char = parser.currentChar;
  var flagStart = parser.index;
  while ((0, _charClassifier.isIdentifierPart)(_char)) {
    switch (_char) {
      case 103:
        if (mask & 2) (0, _errors.report)(parser, 34, 'g');
        mask |= 2;
        break;
      case 105:
        if (mask & 1) (0, _errors.report)(parser, 34, 'i');
        mask |= 1;
        break;
      case 109:
        if (mask & 4) (0, _errors.report)(parser, 34, 'm');
        mask |= 4;
        break;
      case 117:
        if (mask & 16) (0, _errors.report)(parser, 34, 'u');
        mask |= 16;
        break;
      case 121:
        if (mask & 8) (0, _errors.report)(parser, 34, 'y');
        mask |= 8;
        break;
      case 115:
        if (mask & 32) (0, _errors.report)(parser, 34, 's');
        mask |= 32;
        break;
      case 100:
        if (mask & 64) (0, _errors.report)(parser, 34, 'd');
        mask |= 64;
        break;
      default:
        (0, _errors.report)(parser, 33);
    }
    _char = (0, _common.advanceChar)(parser);
  }
  var flags = parser.source.slice(flagStart, parser.index);
  var pattern = parser.source.slice(bodyStart, bodyEnd);
  parser.tokenRegExp = {
    pattern: pattern,
    flags: flags
  };
  if (context & 512) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
  parser.tokenValue = validate(parser, pattern, flags);
  return 65540;
}
function validate(parser, pattern, flags) {
  try {
    return new RegExp(pattern, flags);
  } catch (e) {
    try {
      new RegExp(pattern, flags.replace('d', ''));
      return null;
    } catch (e) {
      (0, _errors.report)(parser, 32);
    }
  }
}