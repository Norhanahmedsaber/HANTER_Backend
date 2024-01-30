import { report } from '../errors';
import { toHex, advanceChar, fromCodePoint } from './common';
import { CharTypes } from './charClassifier';
export function scanString(parser, context, quote) {
    const { index: start } = parser;
    let ret = '';
    let char = advanceChar(parser);
    let marker = parser.index;
    while ((CharTypes[char] & 8) === 0) {
        if (char === quote) {
            ret += parser.source.slice(marker, parser.index);
            advanceChar(parser);
            if (context & 512)
                parser.tokenRaw = parser.source.slice(start, parser.index);
            parser.tokenValue = ret;
            return 134283267;
        }
        if ((char & 8) === 8 && char === 92) {
            ret += parser.source.slice(marker, parser.index);
            char = advanceChar(parser);
            if (char < 0x7f || char === 8232 || char === 8233) {
                const code = parseEscape(parser, context, char);
                if (code >= 0)
                    ret += fromCodePoint(code);
                else
                    handleStringError(parser, code, 0);
            }
            else {
                ret += fromCodePoint(char);
            }
            marker = parser.index + 1;
        }
        if (parser.index >= parser.end)
            report(parser, 14);
        char = advanceChar(parser);
    }
    report(parser, 14);
}
export function parseEscape(parser, context, first) {
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
        case 13: {
            if (parser.index < parser.end) {
                const nextChar = parser.source.charCodeAt(parser.index + 1);
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
        case 51: {
            let code = first - 48;
            let index = parser.index + 1;
            let column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if ((CharTypes[next] & 32) === 0) {
                    if ((code !== 0 || CharTypes[next] & 512) && context & 1024)
                        return -2;
                }
                else if (context & 1024) {
                    return -2;
                }
                else {
                    parser.currentChar = next;
                    code = (code << 3) | (next - 48);
                    index++;
                    column++;
                    if (index < parser.end) {
                        const next = parser.source.charCodeAt(index);
                        if (CharTypes[next] & 32) {
                            parser.currentChar = next;
                            code = (code << 3) | (next - 48);
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
        case 55: {
            if (context & 1024)
                return -2;
            let code = first - 48;
            const index = parser.index + 1;
            const column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if (CharTypes[next] & 32) {
                    code = (code << 3) | (next - 48);
                    parser.currentChar = next;
                    parser.index = index;
                    parser.column = column;
                }
            }
            parser.flags |= 64;
            return code;
        }
        case 120: {
            const ch1 = advanceChar(parser);
            if ((CharTypes[ch1] & 64) === 0)
                return -4;
            const hi = toHex(ch1);
            const ch2 = advanceChar(parser);
            if ((CharTypes[ch2] & 64) === 0)
                return -4;
            const lo = toHex(ch2);
            return (hi << 4) | lo;
        }
        case 117: {
            const ch = advanceChar(parser);
            if (parser.currentChar === 123) {
                let code = 0;
                while ((CharTypes[advanceChar(parser)] & 64) !== 0) {
                    code = (code << 4) | toHex(parser.currentChar);
                    if (code > 1114111)
                        return -5;
                }
                if (parser.currentChar < 1 || parser.currentChar !== 125) {
                    return -4;
                }
                return code;
            }
            else {
                if ((CharTypes[ch] & 64) === 0)
                    return -4;
                const ch2 = parser.source.charCodeAt(parser.index + 1);
                if ((CharTypes[ch2] & 64) === 0)
                    return -4;
                const ch3 = parser.source.charCodeAt(parser.index + 2);
                if ((CharTypes[ch3] & 64) === 0)
                    return -4;
                const ch4 = parser.source.charCodeAt(parser.index + 3);
                if ((CharTypes[ch4] & 64) === 0)
                    return -4;
                parser.index += 3;
                parser.column += 3;
                parser.currentChar = parser.source.charCodeAt(parser.index);
                return (toHex(ch) << 12) | (toHex(ch2) << 8) | (toHex(ch3) << 4) | toHex(ch4);
            }
        }
        case 56:
        case 57:
            if ((context & 256) === 0)
                return -3;
        default:
            return first;
    }
}
export function handleStringError(state, code, isTemplate) {
    switch (code) {
        case -1:
            return;
        case -2:
            report(state, isTemplate ? 2 : 1);
        case -3:
            report(state, 13);
        case -4:
            report(state, 6);
        case -5:
            report(state, 102);
        default:
    }
}
//# sourceMappingURL=string.js.map