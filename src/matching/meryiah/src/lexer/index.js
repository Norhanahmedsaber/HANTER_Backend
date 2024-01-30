export { scanSingleToken, nextToken, TokenLookup } from './scan';
export { skipMultiLineComment, skipSingleLineComment, skipHashBang, skipSingleHTMLComment } from './comments';
export { advanceChar, consumeMultiUnitCodePoint, isExoticECMAScriptWhitespace, fromCodePoint, toHex, consumeLineFeed, scanNewLine, convertTokenType } from './common';
export { CharTypes, isIdentifierStart, isIdentifierPart } from './charClassifier';
export { scanIdentifier, scanIdentifierSlowCase, scanUnicodeIdentifier, scanPrivateIdentifier, scanUnicodeEscape } from './identifier';
export { scanString } from './string';
export { scanNumber } from './numeric';
export { scanTemplate, scanTemplateTail } from './template';
export { scanRegularExpression } from './regexp';
//# sourceMappingURL=index.js.map