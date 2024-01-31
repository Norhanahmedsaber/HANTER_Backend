import { advanceChar, fromCodePoint } from './common';
import { parseEscape, handleStringError } from './string';
import { report } from '../errors';
export function scanTemplate(parser, context) {
    const { index: start } = parser;
    let token = 67174409;
    let ret = '';
    let char = advanceChar(parser);
    while (char !== 96) {
        if (char === 36 && parser.source.charCodeAt(parser.index + 1) === 123) {
            advanceChar(parser);
            token = 67174408;
            break;
        }
        else if ((char & 8) === 8 && char === 92) {
            char = advanceChar(parser);
            if (char > 0x7e) {
                ret += fromCodePoint(char);
            }
            else {
                const code = parseEscape(parser, context | 1024, char);
                if (code >= 0) {
                    ret += fromCodePoint(code);
                }
                else if (code !== -1 && context & 65536) {
                    ret = undefined;
                    char = scanBadTemplate(parser, char);
                    if (char < 0)
                        token = 67174408;
                    break;
                }
                else {
                    handleStringError(parser, code, 1);
                }
            }
        }
        else {
            if (parser.index < parser.end &&
                char === 13 &&
                parser.source.charCodeAt(parser.index) === 10) {
                ret += fromCodePoint(char);
                parser.currentChar = parser.source.charCodeAt(++parser.index);
            }
            if (((char & 83) < 3 && char === 10) || (char ^ 8232) <= 1) {
                parser.column = -1;
                parser.line++;
            }
            ret += fromCodePoint(char);
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        char = advanceChar(parser);
    }
    advanceChar(parser);
    parser.tokenValue = ret;
    parser.tokenRaw = parser.source.slice(start + 1, parser.index - (token === 67174409 ? 1 : 2));
    return token;
}
function scanBadTemplate(parser, ch) {
    while (ch !== 96) {
        switch (ch) {
            case 36: {
                const index = parser.index + 1;
                if (index < parser.end && parser.source.charCodeAt(index) === 123) {
                    parser.index = index;
                    parser.column++;
                    return -ch;
                }
                break;
            }
            case 10:
            case 8232:
            case 8233:
                parser.column = -1;
                parser.line++;
            default:
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        ch = advanceChar(parser);
    }
    return ch;
}
export function scanTemplateTail(parser, context) {
    if (parser.index >= parser.end)
        report(parser, 0);
    parser.index--;
    parser.column--;
    return scanTemplate(parser, context);
}
//# sourceMappingURL=template.js.map