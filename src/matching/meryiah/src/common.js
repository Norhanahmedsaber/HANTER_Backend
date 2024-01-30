import { KeywordDescTable } from './token';
import { report } from './errors';
import { nextToken } from './lexer/scan';
export function matchOrInsertSemicolon(parser, context, specDeviation) {
    if ((parser.flags & 1) === 0 &&
        (parser.token & 1048576) !== 1048576 &&
        !specDeviation) {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    consumeOpt(parser, context, 1074790417);
}
export function isValidStrictMode(parser, index, tokenPos, tokenValue) {
    if (index - tokenPos < 13 && tokenValue === 'use strict') {
        if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
            return 1;
        }
    }
    return 0;
}
export function optionalBit(parser, context, t) {
    if (parser.token !== t)
        return 0;
    nextToken(parser, context);
    return 1;
}
export function consumeOpt(parser, context, t) {
    if (parser.token !== t)
        return false;
    nextToken(parser, context);
    return true;
}
export function consume(parser, context, t) {
    if (parser.token !== t)
        report(parser, 23, KeywordDescTable[t & 255]);
    nextToken(parser, context);
}
export function reinterpretToPattern(state, node) {
    switch (node.type) {
        case 'ArrayExpression':
            node.type = 'ArrayPattern';
            const elements = node.elements;
            for (let i = 0, n = elements.length; i < n; ++i) {
                const element = elements[i];
                if (element)
                    reinterpretToPattern(state, element);
            }
            return;
        case 'ObjectExpression':
            node.type = 'ObjectPattern';
            const properties = node.properties;
            for (let i = 0, n = properties.length; i < n; ++i) {
                reinterpretToPattern(state, properties[i]);
            }
            return;
        case 'AssignmentExpression':
            node.type = 'AssignmentPattern';
            if (node.operator !== '=')
                report(state, 69);
            delete node.operator;
            reinterpretToPattern(state, node.left);
            return;
        case 'Property':
            reinterpretToPattern(state, node.value);
            return;
        case 'SpreadElement':
            node.type = 'RestElement';
            reinterpretToPattern(state, node.argument);
        default:
    }
}
export function validateBindingIdentifier(parser, context, kind, t, skipEvalArgCheck) {
    if (context & 1024) {
        if ((t & 36864) === 36864) {
            report(parser, 115);
        }
        if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
            report(parser, 116);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 100);
    }
    if (kind & (8 | 16) && t === 241739) {
        report(parser, 98);
    }
    if (context & (4194304 | 2048) && t === 209008) {
        report(parser, 96);
    }
    if (context & (2097152 | 1024) && t === 241773) {
        report(parser, 95, 'yield');
    }
}
export function validateFunctionName(parser, context, t) {
    if (context & 1024) {
        if ((t & 36864) === 36864) {
            report(parser, 115);
        }
        if ((t & 537079808) === 537079808) {
            report(parser, 116);
        }
        if (t === 122) {
            report(parser, 93);
        }
        if (t === 121) {
            report(parser, 93);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 100);
    }
    if (context & (4194304 | 2048) && t === 209008) {
        report(parser, 96);
    }
    if (context & (2097152 | 1024) && t === 241773) {
        report(parser, 95, 'yield');
    }
}
export function isStrictReservedWord(parser, context, t) {
    if (t === 209008) {
        if (context & (4194304 | 2048))
            report(parser, 96);
        parser.destructible |= 128;
    }
    if (t === 241773 && context & 2097152)
        report(parser, 95, 'yield');
    return ((t & 20480) === 20480 ||
        (t & 36864) === 36864 ||
        t == 122);
}
export function isPropertyWithPrivateFieldKey(expr) {
    return !expr.property ? false : expr.property.type === 'PrivateIdentifier';
}
export function isValidLabel(parser, labels, name, isIterationStatement) {
    while (labels) {
        if (labels['$' + name]) {
            if (isIterationStatement)
                report(parser, 134);
            return 1;
        }
        if (isIterationStatement && labels.loop)
            isIterationStatement = 0;
        labels = labels['$'];
    }
    return 0;
}
export function validateAndDeclareLabel(parser, labels, name) {
    let set = labels;
    while (set) {
        if (set['$' + name])
            report(parser, 133, name);
        set = set['$'];
    }
    labels['$' + name] = 1;
}
export function finishNode(parser, context, start, line, column, node) {
    if (context & 2) {
        node.start = start;
        node.end = parser.startPos;
        node.range = [start, parser.startPos];
    }
    if (context & 4) {
        node.loc = {
            start: {
                line,
                column
            },
            end: {
                line: parser.startLine,
                column: parser.startColumn
            }
        };
        if (parser.sourceFile) {
            node.loc.source = parser.sourceFile;
        }
    }
    return node;
}
export function isEqualTagName(elementName) {
    switch (elementName.type) {
        case 'JSXIdentifier':
            return elementName.name;
        case 'JSXNamespacedName':
            return elementName.namespace + ':' + elementName.name;
        case 'JSXMemberExpression':
            return isEqualTagName(elementName.object) + '.' + isEqualTagName(elementName.property);
        default:
    }
}
export function createArrowHeadParsingScope(parser, context, value) {
    const scope = addChildScope(createScope(), 1024);
    addBlockName(parser, context, scope, value, 1, 0);
    return scope;
}
export function recordScopeError(parser, type, ...params) {
    const { index, line, column } = parser;
    return {
        type,
        params,
        index,
        line,
        column
    };
}
export function createScope() {
    return {
        parent: void 0,
        type: 2
    };
}
export function addChildScope(parent, type) {
    return {
        parent,
        type,
        scopeError: void 0
    };
}
export function addVarOrBlock(parser, context, scope, name, kind, origin) {
    if (kind & 4) {
        addVarName(parser, context, scope, name, kind);
    }
    else {
        addBlockName(parser, context, scope, name, kind, origin);
    }
    if (origin & 64) {
        declareUnboundVariable(parser, name);
    }
}
export function addBlockName(parser, context, scope, name, kind, origin) {
    const value = scope['#' + name];
    if (value && (value & 2) === 0) {
        if (kind & 1) {
            scope.scopeError = recordScopeError(parser, 141, name);
        }
        else if (context & 256 &&
            value & 64 &&
            origin & 2) {
        }
        else {
            report(parser, 141, name);
        }
    }
    if (scope.type & 128 &&
        (scope.parent['#' + name] && (scope.parent['#' + name] & 2) === 0)) {
        report(parser, 141, name);
    }
    if (scope.type & 1024 && value && (value & 2) === 0) {
        if (kind & 1) {
            scope.scopeError = recordScopeError(parser, 141, name);
        }
    }
    if (scope.type & 64) {
        if (scope.parent['#' + name] & 768)
            report(parser, 154, name);
    }
    scope['#' + name] = kind;
}
export function addVarName(parser, context, scope, name, kind) {
    let currentScope = scope;
    while (currentScope && (currentScope.type & 256) === 0) {
        const value = currentScope['#' + name];
        if (value & 248) {
            if (context & 256 &&
                (context & 1024) === 0 &&
                ((kind & 128 && value & 68) ||
                    (value & 128 && kind & 68))) {
            }
            else {
                report(parser, 141, name);
            }
        }
        if (currentScope === scope) {
            if (value & 1 && kind & 1) {
                currentScope.scopeError = recordScopeError(parser, 141, name);
            }
        }
        if (value & (512 | 256)) {
            if ((value & 512) === 0 ||
                (context & 256) === 0 ||
                context & 1024) {
                report(parser, 141, name);
            }
        }
        currentScope['#' + name] = kind;
        currentScope = currentScope.parent;
    }
}
export function declareUnboundVariable(parser, name) {
    if (parser.exportedNames !== void 0 && name !== '') {
        if (parser.exportedNames['#' + name]) {
            report(parser, 142, name);
        }
        parser.exportedNames['#' + name] = 1;
    }
}
export function addBindingToExports(parser, name) {
    if (parser.exportedBindings !== void 0 && name !== '') {
        parser.exportedBindings['#' + name] = 1;
    }
}
export function pushComment(context, array) {
    return function (type, value, start, end, loc) {
        const comment = {
            type,
            value
        };
        if (context & 2) {
            comment.start = start;
            comment.end = end;
            comment.range = [start, end];
        }
        if (context & 4) {
            comment.loc = loc;
        }
        array.push(comment);
    };
}
export function pushToken(context, array) {
    return function (token, start, end, loc) {
        const tokens = {
            token
        };
        if (context & 2) {
            tokens.start = start;
            tokens.end = end;
            tokens.range = [start, end];
        }
        if (context & 4) {
            tokens.loc = loc;
        }
        array.push(tokens);
    };
}
export function isValidIdentifier(context, t) {
    if (context & (1024 | 2097152)) {
        if (context & 2048 && t === 209008)
            return false;
        if (context & 2097152 && t === 241773)
            return false;
        return (t & 143360) === 143360 || (t & 12288) === 12288;
    }
    return ((t & 143360) === 143360 ||
        (t & 12288) === 12288 ||
        (t & 36864) === 36864);
}
export function classifyIdentifier(parser, context, t, isArrow) {
    if ((t & 537079808) === 537079808) {
        if (context & 1024)
            report(parser, 116);
        if (isArrow)
            parser.flags |= 512;
    }
    if (!isValidIdentifier(context, t))
        report(parser, 0);
}
//# sourceMappingURL=common.js.map