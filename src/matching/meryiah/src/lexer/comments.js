import { advanceChar, scanNewLine, consumeLineFeed } from './common';
import { CharTypes } from './charClassifier';
import { report } from '../errors';
export const CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];
export function skipHashBang(parser) {
    const source = parser.source;
    if (parser.currentChar === 35 && source.charCodeAt(parser.index + 1) === 33) {
        advanceChar(parser);
        advanceChar(parser);
        skipSingleLineComment(parser, source, 0, 4, parser.tokenPos, parser.linePos, parser.colPos);
    }
}
export function skipSingleHTMLComment(parser, source, state, context, type, start, line, column) {
    if (context & 2048)
        report(parser, 0);
    return skipSingleLineComment(parser, source, state, type, start, line, column);
}
export function skipSingleLineComment(parser, source, state, type, start, line, column) {
    const { index } = parser;
    parser.tokenPos = parser.index;
    parser.linePos = parser.line;
    parser.colPos = parser.column;
    while (parser.index < parser.end) {
        if (CharTypes[parser.currentChar] & 8) {
            const isCR = parser.currentChar === 13;
            scanNewLine(parser);
            if (isCR && parser.index < parser.end && parser.currentChar === 10)
                parser.currentChar = source.charCodeAt(++parser.index);
            break;
        }
        else if ((parser.currentChar ^ 8232) <= 1) {
            scanNewLine(parser);
            break;
        }
        advanceChar(parser);
        parser.tokenPos = parser.index;
        parser.linePos = parser.line;
        parser.colPos = parser.column;
    }
    if (parser.onComment) {
        const loc = {
            start: {
                line,
                column
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
export function skipMultiLineComment(parser, source, state) {
    const { index } = parser;
    while (parser.index < parser.end) {
        if (parser.currentChar < 0x2b) {
            let skippedOneAsterisk = false;
            while (parser.currentChar === 42) {
                if (!skippedOneAsterisk) {
                    state &= ~4;
                    skippedOneAsterisk = true;
                }
                if (advanceChar(parser) === 47) {
                    advanceChar(parser);
                    if (parser.onComment) {
                        const loc = {
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
            if (CharTypes[parser.currentChar] & 8) {
                if (parser.currentChar === 13) {
                    state |= 1 | 4;
                    scanNewLine(parser);
                }
                else {
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                }
            }
            else {
                advanceChar(parser);
            }
        }
        else if ((parser.currentChar ^ 8232) <= 1) {
            state = (state & ~4) | 1;
            scanNewLine(parser);
        }
        else {
            state &= ~4;
            advanceChar(parser);
        }
    }
    report(parser, 16);
}
//# sourceMappingURL=comments.js.map