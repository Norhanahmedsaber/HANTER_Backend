import { parseSource } from './parser';
import * as ESTree from './estree';
export function parseScript(source, options) {
    return parseSource(source, options, 0);
}
export function parseModule(source, options) {
    return parseSource(source, options, 1024 | 2048);
}
export function parse(source, options) {
    return parseSource(source, options, 0);
}
export { ESTree };
//# sourceMappingURL=meriyah.js.map