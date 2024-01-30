import { advanceChar, toHex } from './common';
import { CharTypes, isIdentifierStart } from './charClassifier';
import { report, reportScannerError } from '../errors';
export function scanNumber(parser, context, kind) {
    let char = parser.currentChar;
    let value = 0;
    let digit = 9;
    let atStart = kind & 64 ? 0 : 1;
    let digits = 0;
    let allowSeparator = 0;
    if (kind & 64) {
        value = '.' + scanDecimalDigitsOrSeparator(parser, char);
        char = parser.currentChar;
        if (char === 110)
            report(parser, 11);
    }
    else {
        if (char === 48) {
            char = advanceChar(parser);
            if ((char | 32) === 120) {
                kind = 8 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (64 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator)
                            report(parser, 147);
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 0x10 + toHex(char);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 19 : 148);
                }
            }
            else if ((char | 32) === 111) {
                kind = 4 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (32 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator) {
                            report(parser, 147);
                        }
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 8 + (char - 48);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 0 : 148);
                }
            }
            else if ((char | 32) === 98) {
                kind = 2 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (128 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator) {
                            report(parser, 147);
                        }
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 2 + (char - 48);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 0 : 148);
                }
            }
            else if (CharTypes[char] & 32) {
                if (context & 1024)
                    report(parser, 1);
                kind = 1;
                while (CharTypes[char] & 16) {
                    if (CharTypes[char] & 512) {
                        kind = 32;
                        atStart = 0;
                        break;
                    }
                    value = value * 8 + (char - 48);
                    char = advanceChar(parser);
                }
            }
            else if (CharTypes[char] & 512) {
                if (context & 1024)
                    report(parser, 1);
                parser.flags |= 64;
                kind = 32;
            }
            else if (char === 95) {
                report(parser, 0);
            }
        }
        if (kind & 48) {
            if (atStart) {
                while (digit >= 0 && CharTypes[char] & (16 | 4096)) {
                    if (char === 95) {
                        char = advanceChar(parser);
                        if (char === 95 || kind & 32) {
                            reportScannerError(parser.index, parser.line, parser.index + 1, 147);
                        }
                        allowSeparator = 1;
                        continue;
                    }
                    allowSeparator = 0;
                    value = 10 * value + (char - 48);
                    char = advanceChar(parser);
                    --digit;
                }
                if (allowSeparator) {
                    reportScannerError(parser.index, parser.line, parser.index + 1, 148);
                }
                if (digit >= 0 && !isIdentifierStart(char) && char !== 46) {
                    parser.tokenValue = value;
                    if (context & 512)
                        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
                    return 134283266;
                }
            }
            value += scanDecimalDigitsOrSeparator(parser, char);
            char = parser.currentChar;
            if (char === 46) {
                if (advanceChar(parser) === 95)
                    report(parser, 0);
                kind = 64;
                value += '.' + scanDecimalDigitsOrSeparator(parser, parser.currentChar);
                char = parser.currentChar;
            }
        }
    }
    const end = parser.index;
    let isBigInt = 0;
    if (char === 110 && kind & 128) {
        isBigInt = 1;
        char = advanceChar(parser);
    }
    else {
        if ((char | 32) === 101) {
            char = advanceChar(parser);
            if (CharTypes[char] & 256)
                char = advanceChar(parser);
            const { index } = parser;
            if ((CharTypes[char] & 16) === 0)
                report(parser, 10);
            value += parser.source.substring(end, index) + scanDecimalDigitsOrSeparator(parser, char);
            char = parser.currentChar;
        }
    }
    if ((parser.index < parser.end && CharTypes[char] & 16) || isIdentifierStart(char)) {
        report(parser, 12);
    }
    if (isBigInt) {
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
        parser.tokenValue = BigInt(value);
        return 134283389;
    }
    parser.tokenValue =
        kind & (1 | 2 | 8 | 4)
            ? value
            : kind & 32
                ? parseFloat(parser.source.substring(parser.tokenPos, parser.index))
                : +value;
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    return 134283266;
}
export function scanDecimalDigitsOrSeparator(parser, char) {
    let allowSeparator = 0;
    let start = parser.index;
    let ret = '';
    while (CharTypes[char] & (16 | 4096)) {
        if (char === 95) {
            const { index } = parser;
            char = advanceChar(parser);
            if (char === 95) {
                reportScannerError(parser.index, parser.line, parser.index + 1, 147);
            }
            allowSeparator = 1;
            ret += parser.source.substring(start, index);
            start = parser.index;
            continue;
        }
        allowSeparator = 0;
        char = advanceChar(parser);
    }
    if (allowSeparator) {
        reportScannerError(parser.index, parser.line, parser.index + 1, 148);
    }
    return ret + parser.source.substring(start, parser.index);
}
//# sourceMappingURL=numeric.js.map