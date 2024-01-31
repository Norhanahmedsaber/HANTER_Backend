"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenLookup = void 0;
exports.nextToken = nextToken;
exports.scanSingleToken = scanSingleToken;
var _errors = require("../errors");
var _unicode = require("../unicode");
var _common = require("./common");
var _comments = require("./comments");
var _regexp = require("./regexp");
var _template = require("./template");
var _numeric = require("./numeric");
var _string = require("./string");
var _identifier = require("./identifier");
var TokenLookup = exports.TokenLookup = [129, 129, 129, 129, 129, 129, 129, 129, 129, 128, 136, 128, 128, 130, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 129, 128, 16842800, 134283267, 131, 208897, 8457015, 8455751, 134283267, 67174411, 16, 8457014, 25233970, 18, 25233971, 67108877, 8457016, 134283266, 134283266, 134283266, 134283266, 134283266, 134283266, 134283266, 134283266, 134283266, 134283266, 21, 1074790417, 8456258, 1077936157, 8456259, 22, 133, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 208897, 69271571, 137, 20, 8455497, 208897, 132, 4096, 4096, 4096, 4096, 4096, 4096, 4096, 208897, 4096, 208897, 208897, 4096, 208897, 4096, 208897, 4096, 208897, 4096, 4096, 4096, 208897, 4096, 4096, 208897, 4096, 4096, 2162700, 8455240, 1074790415, 16842801, 129];
function nextToken(parser, context) {
  parser.flags = (parser.flags | 1) ^ 1;
  parser.startPos = parser.index;
  parser.startColumn = parser.column;
  parser.startLine = parser.line;
  parser.token = scanSingleToken(parser, context, 0);
  if (parser.onToken && parser.token !== 1048576) {
    var loc = {
      start: {
        line: parser.linePos,
        column: parser.colPos
      },
      end: {
        line: parser.line,
        column: parser.column
      }
    };
    parser.onToken((0, _common.convertTokenType)(parser.token), parser.tokenPos, parser.index, loc);
  }
}
function scanSingleToken(parser, context, state) {
  var isStartOfLine = parser.index === 0;
  var source = parser.source;
  var startPos = parser.index;
  var startLine = parser.line;
  var startColumn = parser.column;
  while (parser.index < parser.end) {
    parser.tokenPos = parser.index;
    parser.colPos = parser.column;
    parser.linePos = parser.line;
    var _char = parser.currentChar;
    if (_char <= 0x7e) {
      var token = TokenLookup[_char];
      switch (token) {
        case 67174411:
        case 16:
        case 2162700:
        case 1074790415:
        case 69271571:
        case 20:
        case 21:
        case 1074790417:
        case 18:
        case 16842801:
        case 133:
        case 129:
          (0, _common.advanceChar)(parser);
          return token;
        case 208897:
          return (0, _identifier.scanIdentifier)(parser, context, 0);
        case 4096:
          return (0, _identifier.scanIdentifier)(parser, context, 1);
        case 134283266:
          return (0, _numeric.scanNumber)(parser, context, 16 | 128);
        case 134283267:
          return (0, _string.scanString)(parser, context, _char);
        case 132:
          return (0, _template.scanTemplate)(parser, context);
        case 137:
          return (0, _identifier.scanUnicodeIdentifier)(parser, context);
        case 131:
          return (0, _identifier.scanPrivateIdentifier)(parser);
        case 128:
          (0, _common.advanceChar)(parser);
          break;
        case 130:
          state |= 1 | 4;
          (0, _common.scanNewLine)(parser);
          break;
        case 136:
          (0, _common.consumeLineFeed)(parser, state);
          state = state & ~4 | 1;
          break;
        case 8456258:
          var ch = (0, _common.advanceChar)(parser);
          if (parser.index < parser.end) {
            if (ch === 60) {
              if (parser.index < parser.end && (0, _common.advanceChar)(parser) === 61) {
                (0, _common.advanceChar)(parser);
                return 4194334;
              }
              return 8456516;
            } else if (ch === 61) {
              (0, _common.advanceChar)(parser);
              return 8456256;
            }
            if (ch === 33) {
              var index = parser.index + 1;
              if (index + 1 < parser.end && source.charCodeAt(index) === 45 && source.charCodeAt(index + 1) == 45) {
                parser.column += 3;
                parser.currentChar = source.charCodeAt(parser.index += 3);
                state = (0, _comments.skipSingleHTMLComment)(parser, source, state, context, 2, parser.tokenPos, parser.linePos, parser.colPos);
                startPos = parser.tokenPos;
                startLine = parser.linePos;
                startColumn = parser.colPos;
                continue;
              }
              return 8456258;
            }
            if (ch === 47) {
              if ((context & 16) === 0) return 8456258;
              var _index = parser.index + 1;
              if (_index < parser.end) {
                ch = source.charCodeAt(_index);
                if (ch === 42 || ch === 47) break;
              }
              (0, _common.advanceChar)(parser);
              return 25;
            }
          }
          return 8456258;
        case 1077936157:
          {
            (0, _common.advanceChar)(parser);
            var _ch = parser.currentChar;
            if (_ch === 61) {
              if ((0, _common.advanceChar)(parser) === 61) {
                (0, _common.advanceChar)(parser);
                return 8455996;
              }
              return 8455998;
            }
            if (_ch === 62) {
              (0, _common.advanceChar)(parser);
              return 10;
            }
            return 1077936157;
          }
        case 16842800:
          if ((0, _common.advanceChar)(parser) !== 61) {
            return 16842800;
          }
          if ((0, _common.advanceChar)(parser) !== 61) {
            return 8455999;
          }
          (0, _common.advanceChar)(parser);
          return 8455997;
        case 8457015:
          if ((0, _common.advanceChar)(parser) !== 61) return 8457015;
          (0, _common.advanceChar)(parser);
          return 4194342;
        case 8457014:
          {
            (0, _common.advanceChar)(parser);
            if (parser.index >= parser.end) return 8457014;
            var _ch2 = parser.currentChar;
            if (_ch2 === 61) {
              (0, _common.advanceChar)(parser);
              return 4194340;
            }
            if (_ch2 !== 42) return 8457014;
            if ((0, _common.advanceChar)(parser) !== 61) return 8457273;
            (0, _common.advanceChar)(parser);
            return 4194337;
          }
        case 8455497:
          if ((0, _common.advanceChar)(parser) !== 61) return 8455497;
          (0, _common.advanceChar)(parser);
          return 4194343;
        case 25233970:
          {
            (0, _common.advanceChar)(parser);
            var _ch3 = parser.currentChar;
            if (_ch3 === 43) {
              (0, _common.advanceChar)(parser);
              return 33619995;
            }
            if (_ch3 === 61) {
              (0, _common.advanceChar)(parser);
              return 4194338;
            }
            return 25233970;
          }
        case 25233971:
          {
            (0, _common.advanceChar)(parser);
            var _ch4 = parser.currentChar;
            if (_ch4 === 45) {
              (0, _common.advanceChar)(parser);
              if ((state & 1 || isStartOfLine) && parser.currentChar === 62) {
                if ((context & 256) === 0) (0, _errors.report)(parser, 109);
                (0, _common.advanceChar)(parser);
                state = (0, _comments.skipSingleHTMLComment)(parser, source, state, context, 3, startPos, startLine, startColumn);
                startPos = parser.tokenPos;
                startLine = parser.linePos;
                startColumn = parser.colPos;
                continue;
              }
              return 33619996;
            }
            if (_ch4 === 61) {
              (0, _common.advanceChar)(parser);
              return 4194339;
            }
            return 25233971;
          }
        case 8457016:
          {
            (0, _common.advanceChar)(parser);
            if (parser.index < parser.end) {
              var _ch5 = parser.currentChar;
              if (_ch5 === 47) {
                (0, _common.advanceChar)(parser);
                state = (0, _comments.skipSingleLineComment)(parser, source, state, 0, parser.tokenPos, parser.linePos, parser.colPos);
                startPos = parser.tokenPos;
                startLine = parser.linePos;
                startColumn = parser.colPos;
                continue;
              }
              if (_ch5 === 42) {
                (0, _common.advanceChar)(parser);
                state = (0, _comments.skipMultiLineComment)(parser, source, state);
                startPos = parser.tokenPos;
                startLine = parser.linePos;
                startColumn = parser.colPos;
                continue;
              }
              if (context & 32768) {
                return (0, _regexp.scanRegularExpression)(parser, context);
              }
              if (_ch5 === 61) {
                (0, _common.advanceChar)(parser);
                return 4259877;
              }
            }
            return 8457016;
          }
        case 67108877:
          var next = (0, _common.advanceChar)(parser);
          if (next >= 48 && next <= 57) return (0, _numeric.scanNumber)(parser, context, 64 | 16);
          if (next === 46) {
            var _index2 = parser.index + 1;
            if (_index2 < parser.end && source.charCodeAt(_index2) === 46 && _index2 + 1 < parser.end && source.charCodeAt(_index2 + 1) === 46 && _index2 + 2 < parser.end && source.charCodeAt(_index2 + 2) === 46) {
              parser.column += 4;
              parser.currentChar = source.charCodeAt(parser.index += 4);
              return 139;
            }
          }
          if (next === 46) {
            var _index3 = parser.index + 1;
            if (_index3 < parser.end && source.charCodeAt(_index3) === 46) {
              parser.column += 2;
              parser.currentChar = source.charCodeAt(parser.index += 2);
              return 14;
            }
          }
          return 67108877;
        case 8455240:
          {
            (0, _common.advanceChar)(parser);
            var _ch6 = parser.currentChar;
            if (_ch6 === 124) {
              (0, _common.advanceChar)(parser);
              if (parser.currentChar === 61) {
                (0, _common.advanceChar)(parser);
                return 4194346;
              }
              return 8979003;
            }
            if (_ch6 === 61) {
              (0, _common.advanceChar)(parser);
              return 4194344;
            }
            return 8455240;
          }
        case 8456259:
          {
            (0, _common.advanceChar)(parser);
            var _ch7 = parser.currentChar;
            if (_ch7 === 61) {
              (0, _common.advanceChar)(parser);
              return 8456257;
            }
            if (_ch7 !== 62) return 8456259;
            (0, _common.advanceChar)(parser);
            if (parser.index < parser.end) {
              var _ch8 = parser.currentChar;
              if (_ch8 === 62) {
                if ((0, _common.advanceChar)(parser) === 61) {
                  (0, _common.advanceChar)(parser);
                  return 4194336;
                }
                return 8456518;
              }
              if (_ch8 === 61) {
                (0, _common.advanceChar)(parser);
                return 4194335;
              }
            }
            return 8456517;
          }
        case 8455751:
          {
            (0, _common.advanceChar)(parser);
            var _ch9 = parser.currentChar;
            if (_ch9 === 38) {
              (0, _common.advanceChar)(parser);
              if (parser.currentChar === 61) {
                (0, _common.advanceChar)(parser);
                return 4194347;
              }
              return 8979258;
            }
            if (_ch9 === 61) {
              (0, _common.advanceChar)(parser);
              return 4194345;
            }
            return 8455751;
          }
        case 22:
          {
            var _ch10 = (0, _common.advanceChar)(parser);
            if (_ch10 === 63) {
              (0, _common.advanceChar)(parser);
              if (parser.currentChar === 61) {
                (0, _common.advanceChar)(parser);
                return 4194348;
              }
              return 276889982;
            }
            if (_ch10 === 46) {
              var _index4 = parser.index + 1;
              if (_index4 < parser.end) {
                _ch10 = source.charCodeAt(_index4);
                if (!(_ch10 >= 48 && _ch10 <= 57)) {
                  (0, _common.advanceChar)(parser);
                  return 67108991;
                }
              }
            }
            return 22;
          }
        default:
      }
    } else {
      if ((_char ^ 8232) <= 1) {
        state = state & ~4 | 1;
        (0, _common.scanNewLine)(parser);
        continue;
      }
      if ((_char & 0xfc00) === 0xd800 || (_unicode.unicodeLookup[(_char >>> 5) + 34816] >>> _char & 31 & 1) !== 0) {
        if ((_char & 0xfc00) === 0xdc00) {
          _char = (_char & 0x3ff) << 10 | _char & 0x3ff | 0x10000;
          if ((_unicode.unicodeLookup[(_char >>> 5) + 0] >>> _char & 31 & 1) === 0) {
            (0, _errors.report)(parser, 18, (0, _common.fromCodePoint)(_char));
          }
          parser.index++;
          parser.currentChar = _char;
        }
        parser.column++;
        parser.tokenValue = '';
        return (0, _identifier.scanIdentifierSlowCase)(parser, context, 0, 0);
      }
      if ((0, _common.isExoticECMAScriptWhitespace)(_char)) {
        (0, _common.advanceChar)(parser);
        continue;
      }
      (0, _errors.report)(parser, 18, (0, _common.fromCodePoint)(_char));
    }
  }
  return 1048576;
}