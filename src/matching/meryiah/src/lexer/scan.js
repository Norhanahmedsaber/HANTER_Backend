import { report } from '../errors';
import { unicodeLookup } from '../unicode';
import { advanceChar, isExoticECMAScriptWhitespace, fromCodePoint, consumeLineFeed, scanNewLine, convertTokenType } from './common';
import { skipSingleLineComment, skipMultiLineComment, skipSingleHTMLComment } from './comments';
import { scanRegularExpression } from './regexp';
import { scanTemplate } from './template';
import { scanNumber } from './numeric';
import { scanString } from './string';
import { scanIdentifier, scanUnicodeIdentifier, scanIdentifierSlowCase, scanPrivateIdentifier } from './identifier';
export const TokenLookup = [
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    128,
    136,
    128,
    128,
    130,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    128,
    16842800,
    134283267,
    131,
    208897,
    8457015,
    8455751,
    134283267,
    67174411,
    16,
    8457014,
    25233970,
    18,
    25233971,
    67108877,
    8457016,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    21,
    1074790417,
    8456258,
    1077936157,
    8456259,
    22,
    133,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    69271571,
    137,
    20,
    8455497,
    208897,
    132,
    4096,
    4096,
    4096,
    4096,
    4096,
    4096,
    4096,
    208897,
    4096,
    208897,
    208897,
    4096,
    208897,
    4096,
    208897,
    4096,
    208897,
    4096,
    4096,
    4096,
    208897,
    4096,
    4096,
    208897,
    4096,
    4096,
    2162700,
    8455240,
    1074790415,
    16842801,
    129
];
export function nextToken(parser, context) {
    parser.flags = (parser.flags | 1) ^ 1;
    parser.startPos = parser.index;
    parser.startColumn = parser.column;
    parser.startLine = parser.line;
    parser.token = scanSingleToken(parser, context, 0);
    if (parser.onToken && parser.token !== 1048576) {
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
        parser.onToken(convertTokenType(parser.token), parser.tokenPos, parser.index, loc);
    }
}
export function scanSingleToken(parser, context, state) {
    const isStartOfLine = parser.index === 0;
    const source = parser.source;
    let startPos = parser.index;
    let startLine = parser.line;
    let startColumn = parser.column;
    while (parser.index < parser.end) {
        parser.tokenPos = parser.index;
        parser.colPos = parser.column;
        parser.linePos = parser.line;
        let char = parser.currentChar;
        if (char <= 0x7e) {
            const token = TokenLookup[char];
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
                    advanceChar(parser);
                    return token;
                case 208897:
                    return scanIdentifier(parser, context, 0);
                case 4096:
                    return scanIdentifier(parser, context, 1);
                case 134283266:
                    return scanNumber(parser, context, 16 | 128);
                case 134283267:
                    return scanString(parser, context, char);
                case 132:
                    return scanTemplate(parser, context);
                case 137:
                    return scanUnicodeIdentifier(parser, context);
                case 131:
                    return scanPrivateIdentifier(parser);
                case 128:
                    advanceChar(parser);
                    break;
                case 130:
                    state |= 1 | 4;
                    scanNewLine(parser);
                    break;
                case 136:
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                    break;
                case 8456258:
                    let ch = advanceChar(parser);
                    if (parser.index < parser.end) {
                        if (ch === 60) {
                            if (parser.index < parser.end && advanceChar(parser) === 61) {
                                advanceChar(parser);
                                return 4194334;
                            }
                            return 8456516;
                        }
                        else if (ch === 61) {
                            advanceChar(parser);
                            return 8456256;
                        }
                        if (ch === 33) {
                            const index = parser.index + 1;
                            if (index + 1 < parser.end &&
                                source.charCodeAt(index) === 45 &&
                                source.charCodeAt(index + 1) == 45) {
                                parser.column += 3;
                                parser.currentChar = source.charCodeAt((parser.index += 3));
                                state = skipSingleHTMLComment(parser, source, state, context, 2, parser.tokenPos, parser.linePos, parser.colPos);
                                startPos = parser.tokenPos;
                                startLine = parser.linePos;
                                startColumn = parser.colPos;
                                continue;
                            }
                            return 8456258;
                        }
                        if (ch === 47) {
                            if ((context & 16) === 0)
                                return 8456258;
                            const index = parser.index + 1;
                            if (index < parser.end) {
                                ch = source.charCodeAt(index);
                                if (ch === 42 || ch === 47)
                                    break;
                            }
                            advanceChar(parser);
                            return 25;
                        }
                    }
                    return 8456258;
                case 1077936157: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        if (advanceChar(parser) === 61) {
                            advanceChar(parser);
                            return 8455996;
                        }
                        return 8455998;
                    }
                    if (ch === 62) {
                        advanceChar(parser);
                        return 10;
                    }
                    return 1077936157;
                }
                case 16842800:
                    if (advanceChar(parser) !== 61) {
                        return 16842800;
                    }
                    if (advanceChar(parser) !== 61) {
                        return 8455999;
                    }
                    advanceChar(parser);
                    return 8455997;
                case 8457015:
                    if (advanceChar(parser) !== 61)
                        return 8457015;
                    advanceChar(parser);
                    return 4194342;
                case 8457014: {
                    advanceChar(parser);
                    if (parser.index >= parser.end)
                        return 8457014;
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194340;
                    }
                    if (ch !== 42)
                        return 8457014;
                    if (advanceChar(parser) !== 61)
                        return 8457273;
                    advanceChar(parser);
                    return 4194337;
                }
                case 8455497:
                    if (advanceChar(parser) !== 61)
                        return 8455497;
                    advanceChar(parser);
                    return 4194343;
                case 25233970: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 43) {
                        advanceChar(parser);
                        return 33619995;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194338;
                    }
                    return 25233970;
                }
                case 25233971: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 45) {
                        advanceChar(parser);
                        if ((state & 1 || isStartOfLine) && parser.currentChar === 62) {
                            if ((context & 256) === 0)
                                report(parser, 109);
                            advanceChar(parser);
                            state = skipSingleHTMLComment(parser, source, state, context, 3, startPos, startLine, startColumn);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        return 33619996;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194339;
                    }
                    return 25233971;
                }
                case 8457016: {
                    advanceChar(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.currentChar;
                        if (ch === 47) {
                            advanceChar(parser);
                            state = skipSingleLineComment(parser, source, state, 0, parser.tokenPos, parser.linePos, parser.colPos);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        if (ch === 42) {
                            advanceChar(parser);
                            state = skipMultiLineComment(parser, source, state);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        if (context & 32768) {
                            return scanRegularExpression(parser, context);
                        }
                        if (ch === 61) {
                            advanceChar(parser);
                            return 4259877;
                        }
                    }
                    return 8457016;
                }
                case 67108877:
                    const next = advanceChar(parser);
                    if (next >= 48 && next <= 57)
                        return scanNumber(parser, context, 64 | 16);
                    if (next === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end && source.charCodeAt(index) === 46 &&
                            (index + 1) < parser.end && source.charCodeAt(index + 1) === 46 &&
                            (index + 2) < parser.end && source.charCodeAt(index + 2) === 46) {
                            parser.column += 4;
                            parser.currentChar = source.charCodeAt((parser.index += 4));
                            return 139;
                        }
                    }
                    if (next === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end && source.charCodeAt(index) === 46) {
                            parser.column += 2;
                            parser.currentChar = source.charCodeAt((parser.index += 2));
                            return 14;
                        }
                    }
                    return 67108877;
                case 8455240: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 124) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194346;
                        }
                        return 8979003;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194344;
                    }
                    return 8455240;
                }
                case 8456259: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        advanceChar(parser);
                        return 8456257;
                    }
                    if (ch !== 62)
                        return 8456259;
                    advanceChar(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.currentChar;
                        if (ch === 62) {
                            if (advanceChar(parser) === 61) {
                                advanceChar(parser);
                                return 4194336;
                            }
                            return 8456518;
                        }
                        if (ch === 61) {
                            advanceChar(parser);
                            return 4194335;
                        }
                    }
                    return 8456517;
                }
                case 8455751: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 38) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194347;
                        }
                        return 8979258;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194345;
                    }
                    return 8455751;
                }
                case 22: {
                    let ch = advanceChar(parser);
                    if (ch === 63) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194348;
                        }
                        return 276889982;
                    }
                    if (ch === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end) {
                            ch = source.charCodeAt(index);
                            if (!(ch >= 48 && ch <= 57)) {
                                advanceChar(parser);
                                return 67108991;
                            }
                        }
                    }
                    return 22;
                }
                default:
            }
        }
        else {
            if ((char ^ 8232) <= 1) {
                state = (state & ~4) | 1;
                scanNewLine(parser);
                continue;
            }
            if ((char & 0xfc00) === 0xd800 || ((unicodeLookup[(char >>> 5) + 34816] >>> char) & 31 & 1) !== 0) {
                if ((char & 0xfc00) === 0xdc00) {
                    char = ((char & 0x3ff) << 10) | (char & 0x3ff) | 0x10000;
                    if (((unicodeLookup[(char >>> 5) + 0] >>> char) & 31 & 1) === 0) {
                        report(parser, 18, fromCodePoint(char));
                    }
                    parser.index++;
                    parser.currentChar = char;
                }
                parser.column++;
                parser.tokenValue = '';
                return scanIdentifierSlowCase(parser, context, 0, 0);
            }
            if (isExoticECMAScriptWhitespace(char)) {
                advanceChar(parser);
                continue;
            }
            report(parser, 18, fromCodePoint(char));
        }
    }
    return 1048576;
}
//# sourceMappingURL=scan.js.map