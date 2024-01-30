import { CharTypes } from './charClassifier';
import { report } from '../errors';
import { advanceChar, TokenLookup, scanSingleToken, scanNewLine, consumeLineFeed } from './';
import { decodeHTMLStrict } from './decodeHTML';
export function scanJSXAttributeValue(parser, context) {
    parser.startPos = parser.tokenPos = parser.index;
    parser.startColumn = parser.colPos = parser.column;
    parser.startLine = parser.linePos = parser.line;
    parser.token =
        CharTypes[parser.currentChar] & 8192
            ? scanJSXString(parser, context)
            : scanSingleToken(parser, context, 0);
    return parser.token;
}
export function scanJSXString(parser, context) {
    const quote = parser.currentChar;
    let char = advanceChar(parser);
    const start = parser.index;
    while (char !== quote) {
        if (parser.index >= parser.end)
            report(parser, 14);
        char = advanceChar(parser);
    }
    if (char !== quote)
        report(parser, 14);
    parser.tokenValue = parser.source.slice(start, parser.index);
    advanceChar(parser);
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    return 134283267;
}
export function scanJSXToken(parser, context) {
    parser.startPos = parser.tokenPos = parser.index;
    parser.startColumn = parser.colPos = parser.column;
    parser.startLine = parser.linePos = parser.line;
    if (parser.index >= parser.end)
        return (parser.token = 1048576);
    const token = TokenLookup[parser.source.charCodeAt(parser.index)];
    switch (token) {
        case 8456258: {
            advanceChar(parser);
            if (parser.currentChar === 47) {
                advanceChar(parser);
                parser.token = 25;
            }
            else {
                parser.token = 8456258;
            }
            break;
        }
        case 2162700: {
            advanceChar(parser);
            parser.token = 2162700;
            break;
        }
        default: {
            let state = 0;
            while (parser.index < parser.end) {
                const type = CharTypes[parser.source.charCodeAt(parser.index)];
                if (type & 1024) {
                    state |= 1 | 4;
                    scanNewLine(parser);
                }
                else if (type & 2048) {
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                }
                else {
                    advanceChar(parser);
                }
                if (CharTypes[parser.currentChar] & 16384)
                    break;
            }
            const raw = parser.source.slice(parser.tokenPos, parser.index);
            if (context & 512)
                parser.tokenRaw = raw;
            parser.tokenValue = decodeHTMLStrict(raw);
            parser.token = 138;
        }
    }
    return parser.token;
}
export function scanJSXIdentifier(parser) {
    if ((parser.token & 143360) === 143360) {
        const { index } = parser;
        let char = parser.currentChar;
        while (CharTypes[char] & (32768 | 2)) {
            char = advanceChar(parser);
        }
        parser.tokenValue += parser.source.slice(index, parser.index);
    }
    parser.token = 208897;
    return parser.token;
}
//# sourceMappingURL=jsx.js.map