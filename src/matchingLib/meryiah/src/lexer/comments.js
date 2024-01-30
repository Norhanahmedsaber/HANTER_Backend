"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentTypes = void 0;
exports.skipHashBang = skipHashBang;
exports.skipMultiLineComment = skipMultiLineComment;
exports.skipSingleHTMLComment = skipSingleHTMLComment;
exports.skipSingleLineComment = skipSingleLineComment;
var _common = require("./common");
var _charClassifier = require("./charClassifier");
var _errors = require("../errors");
var CommentTypes = exports.CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];
function skipHashBang(parser) {
  var source = parser.source;
  if (parser.currentChar === 35 && source.charCodeAt(parser.index + 1) === 33) {
    (0, _common.advanceChar)(parser);
    (0, _common.advanceChar)(parser);
    skipSingleLineComment(parser, source, 0, 4, parser.tokenPos, parser.linePos, parser.colPos);
  }
}
function skipSingleHTMLComment(parser, source, state, context, type, start, line, column) {
  if (context & 2048) (0, _errors.report)(parser, 0);
  return skipSingleLineComment(parser, source, state, type, start, line, column);
}
function skipSingleLineComment(parser, source, state, type, start, line, column) {
  var index = parser.index;
  parser.tokenPos = parser.index;
  parser.linePos = parser.line;
  parser.colPos = parser.column;
  while (parser.index < parser.end) {
    if (_charClassifier.CharTypes[parser.currentChar] & 8) {
      var isCR = parser.currentChar === 13;
      (0, _common.scanNewLine)(parser);
      if (isCR && parser.index < parser.end && parser.currentChar === 10) parser.currentChar = source.charCodeAt(++parser.index);
      break;
    } else if ((parser.currentChar ^ 8232) <= 1) {
      (0, _common.scanNewLine)(parser);
      break;
    }
    (0, _common.advanceChar)(parser);
    parser.tokenPos = parser.index;
    parser.linePos = parser.line;
    parser.colPos = parser.column;
  }
  if (parser.onComment) {
    var loc = {
      start: {
        line: line,
        column: column
      },
      end: {
        line: parser.linePos,
        column: parser.colPos
      }
    };
    parser.onComment(CommentTypes[type & 0xff], source.slice(index, parser.tokenPos), start, parser.tokenPos, loc);
  }
  return state | 1;
}
function skipMultiLineComment(parser, source, state) {
  var index = parser.index;
  while (parser.index < parser.end) {
    if (parser.currentChar < 0x2b) {
      var skippedOneAsterisk = false;
      while (parser.currentChar === 42) {
        if (!skippedOneAsterisk) {
          state &= ~4;
          skippedOneAsterisk = true;
        }
        if ((0, _common.advanceChar)(parser) === 47) {
          (0, _common.advanceChar)(parser);
          if (parser.onComment) {
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
            parser.onComment(CommentTypes[1 & 0xff], source.slice(index, parser.index - 2), index - 2, parser.index, loc);
          }
          parser.tokenPos = parser.index;
          parser.linePos = parser.line;
          parser.colPos = parser.column;
          return state;
        }
      }
      if (skippedOneAsterisk) {
        continue;
      }
      if (_charClassifier.CharTypes[parser.currentChar] & 8) {
        if (parser.currentChar === 13) {
          state |= 1 | 4;
          (0, _common.scanNewLine)(parser);
        } else {
          (0, _common.consumeLineFeed)(parser, state);
          state = state & ~4 | 1;
        }
      } else {
        (0, _common.advanceChar)(parser);
      }
    } else if ((parser.currentChar ^ 8232) <= 1) {
      state = state & ~4 | 1;
      (0, _common.scanNewLine)(parser);
    } else {
      state &= ~4;
      (0, _common.advanceChar)(parser);
    }
  }
  (0, _errors.report)(parser, 16);
}