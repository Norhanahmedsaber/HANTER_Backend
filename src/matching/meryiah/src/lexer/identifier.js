import { descKeywordTable } from '../token';
import { advanceChar, consumeMultiUnitCodePoint, fromCodePoint, toHex } from './common';
import { CharTypes, isIdentifierPart, isIdentifierStart, isIdPart } from './charClassifier';
import { report, reportScannerError } from '../errors';
export function scanIdentifier(parser, context, isValidAsKeyword) {
    while (isIdPart[advanceChar(parser)]) { }
    parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
    return parser.currentChar !== 92 && parser.currentChar <= 0x7e
        ? descKeywordTable[parser.tokenValue] || 208897
        : scanIdentifierSlowCase(parser, context, 0, isValidAsKeyword);
}
export function scanUnicodeIdentifier(parser, context) {
    const cookedChar = scanIdentifierUnicodeEscape(parser);
    if (!isIdentifierPart(cookedChar))
        report(parser, 4);
    parser.tokenValue = fromCodePoint(cookedChar);
    return scanIdentifierSlowCase(parser, context, 1, CharTypes[cookedChar] & 4);
}
export function scanIdentifierSlowCase(parser, context, hasEscape, isValidAsKeyword) {
    let start = parser.index;
    while (parser.index < parser.end) {
        if (parser.currentChar === 92) {
            parser.tokenValue += parser.source.slice(start, parser.index);
            hasEscape = 1;
            const code = scanIdentifierUnicodeEscape(parser);
            if (!isIdentifierPart(code))
                report(parser, 4);
            isValidAsKeyword = isValidAsKeyword && CharTypes[code] & 4;
            parser.tokenValue += fromCodePoint(code);
            start = parser.index;
        }
        else if (isIdentifierPart(parser.currentChar) || consumeMultiUnitCodePoint(parser, parser.currentChar)) {
            advanceChar(parser);
        }
        else {
            break;
        }
    }
    if (parser.index <= parser.end) {
        parser.tokenValue += parser.source.slice(start, parser.index);
    }
    const length = parser.tokenValue.length;
    if (isValidAsKeyword && length >= 2 && length <= 11) {
        const token = descKeywordTable[parser.tokenValue];
        if (token === void 0)
            return 208897;
        if (!hasEscape)
            return token;
        if (token === 209008) {
            if ((context & (2048 | 4194304)) === 0) {
                return token;
            }
            return 121;
        }
        if (context & 1024) {
            if (token === 36972) {
                return 122;
            }
            if ((token & 36864) === 36864) {
                return 122;
            }
            if ((token & 20480) === 20480) {
                if (context & 1073741824 && (context & 8192) === 0) {
                    return token;
                }
                else {
                    return 121;
                }
            }
            return 143483;
        }
        if (context & 1073741824 &&
            (context & 8192) === 0 &&
            (token & 20480) === 20480)
            return token;
        if (token === 241773) {
            return context & 1073741824
                ? 143483
                : context & 2097152
                    ? 121
                    : token;
        }
        if (token === 209007) {
            return 143483;
        }
        if ((token & 36864) === 36864) {
            return token;
        }
        return 121;
    }
    return 208897;
}
export function scanPrivateIdentifier(parser) {
    if (!isIdentifierStart(advanceChar(parser)))
        report(parser, 94);
    return 131;
}
export function scanIdentifierUnicodeEscape(parser) {
    if (parser.source.charCodeAt(parser.index + 1) !== 117) {
        report(parser, 4);
    }
    parser.currentChar = parser.source.charCodeAt((parser.index += 2));
    return scanUnicodeEscape(parser);
}
export function scanUnicodeEscape(parser) {
    let codePoint = 0;
    const char = parser.currentChar;
    if (char === 123) {
        const begin = parser.index - 2;
        while (CharTypes[advanceChar(parser)] & 64) {
            codePoint = (codePoint << 4) | toHex(parser.currentChar);
            if (codePoint > 1114111)
                reportScannerError(begin, parser.line, parser.index + 1, 102);
        }
        if (parser.currentChar !== 125) {
            reportScannerError(begin, parser.line, parser.index - 1, 6);
        }
        advanceChar(parser);
        return codePoint;
    }
    if ((CharTypes[char] & 64) === 0)
        report(parser, 6);
    const char2 = parser.source.charCodeAt(parser.index + 1);
    if ((CharTypes[char2] & 64) === 0)
        report(parser, 6);
    const char3 = parser.source.charCodeAt(parser.index + 2);
    if ((CharTypes[char3] & 64) === 0)
        report(parser, 6);
    const char4 = parser.source.charCodeAt(parser.index + 3);
    if ((CharTypes[char4] & 64) === 0)
        report(parser, 6);
    codePoint = (toHex(char) << 12) | (toHex(char2) << 8) | (toHex(char3) << 4) | toHex(char4);
    parser.currentChar = parser.source.charCodeAt((parser.index += 4));
    return codePoint;
}
//# sourceMappingURL=identifier.js.map