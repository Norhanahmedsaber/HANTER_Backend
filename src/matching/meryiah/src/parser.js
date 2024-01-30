import { nextToken, skipHashBang } from './lexer';
import { KeywordDescTable } from './token';
import { report, reportMessageAt, reportScopeError } from './errors';
import { scanTemplateTail } from './lexer/template';
import { scanJSXIdentifier, scanJSXToken, scanJSXAttributeValue } from './lexer/jsx';
import { consumeOpt, consume, pushComment, pushToken, reinterpretToPattern, validateBindingIdentifier, validateFunctionName, isStrictReservedWord, optionalBit, matchOrInsertSemicolon, isPropertyWithPrivateFieldKey, isValidLabel, validateAndDeclareLabel, finishNode, createScope, addChildScope, addVarName, addBlockName, addBindingToExports, declareUnboundVariable, isEqualTagName, isValidStrictMode, createArrowHeadParsingScope, addVarOrBlock, isValidIdentifier, classifyIdentifier } from './common';
export function create(source, sourceFile, onComment, onToken) {
    return {
        source,
        flags: 0,
        index: 0,
        line: 1,
        column: 0,
        startPos: 0,
        end: source.length,
        tokenPos: 0,
        startColumn: 0,
        colPos: 0,
        linePos: 1,
        startLine: 1,
        sourceFile,
        tokenValue: '',
        token: 1048576,
        tokenRaw: '',
        tokenRegExp: void 0,
        currentChar: source.charCodeAt(0),
        exportedNames: [],
        exportedBindings: [],
        assignable: 1,
        destructible: 0,
        onComment,
        onToken,
        leadingDecorators: []
    };
}
export function parseSource(source, options, context) {
    let sourceFile = '';
    let onComment;
    let onToken;
    if (options != null) {
        if (options.module)
            context |= 2048 | 1024;
        if (options.next)
            context |= 1;
        if (options.loc)
            context |= 4;
        if (options.ranges)
            context |= 2;
        if (options.uniqueKeyInPattern)
            context |= -2147483648;
        if (options.lexical)
            context |= 64;
        if (options.webcompat)
            context |= 256;
        if (options.directives)
            context |= 8 | 512;
        if (options.globalReturn)
            context |= 32;
        if (options.raw)
            context |= 512;
        if (options.preserveParens)
            context |= 128;
        if (options.impliedStrict)
            context |= 1024;
        if (options.jsx)
            context |= 16;
        if (options.identifierPattern)
            context |= 268435456;
        if (options.specDeviation)
            context |= 536870912;
        if (options.source)
            sourceFile = options.source;
        if (options.onComment != null) {
            onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
        }
        if (options.onToken != null) {
            onToken = Array.isArray(options.onToken) ? pushToken(context, options.onToken) : options.onToken;
        }
    }
    const parser = create(source, sourceFile, onComment, onToken);
    if (context & 1)
        skipHashBang(parser);
    const scope = context & 64 ? createScope() : void 0;
    let body = [];
    let sourceType = 'script';
    if (context & 2048) {
        sourceType = 'module';
        body = parseModuleItemList(parser, context | 8192, scope);
        if (scope) {
            for (const key in parser.exportedBindings) {
                if (key[0] === '#' && !scope[key])
                    report(parser, 143, key.slice(1));
            }
        }
    }
    else {
        body = parseStatementList(parser, context | 8192, scope);
    }
    const node = {
        type: 'Program',
        sourceType,
        body
    };
    if (context & 2) {
        node.start = 0;
        node.end = source.length;
        node.range = [0, source.length];
    }
    if (context & 4) {
        node.loc = {
            start: { line: 1, column: 0 },
            end: { line: parser.line, column: parser.column }
        };
        if (parser.sourceFile)
            node.loc.source = sourceFile;
    }
    return node;
}
export function parseStatementList(parser, context, scope) {
    nextToken(parser, context | 32768 | 1073741824);
    const statements = [];
    while (parser.token === 134283267) {
        const { index, tokenPos, tokenValue, linePos, colPos, token } = parser;
        const expr = parseLiteral(parser, context);
        if (isValidStrictMode(parser, index, tokenPos, tokenValue))
            context |= 1024;
        statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
    }
    while (parser.token !== 1048576) {
        statements.push(parseStatementListItem(parser, context, scope, 4, {}));
    }
    return statements;
}
export function parseModuleItemList(parser, context, scope) {
    nextToken(parser, context | 32768);
    const statements = [];
    if (context & 8) {
        while (parser.token === 134283267) {
            const { tokenPos, linePos, colPos, token } = parser;
            statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
        }
    }
    while (parser.token !== 1048576) {
        statements.push(parseModuleItem(parser, context, scope));
    }
    return statements;
}
export function parseModuleItem(parser, context, scope) {
    parser.leadingDecorators = parseDecorators(parser, context);
    let moduleItem;
    switch (parser.token) {
        case 20566:
            moduleItem = parseExportDeclaration(parser, context, scope);
            break;
        case 86108:
            moduleItem = parseImportDeclaration(parser, context, scope);
            break;
        default:
            moduleItem = parseStatementListItem(parser, context, scope, 4, {});
    }
    if (parser.leadingDecorators.length) {
        report(parser, 165);
    }
    return moduleItem;
}
export function parseStatementListItem(parser, context, scope, origin, labels) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    switch (parser.token) {
        case 86106:
            return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 0, start, line, column);
        case 133:
        case 86096:
            return parseClassDeclaration(parser, context, scope, 0, start, line, column);
        case 86092:
            return parseLexicalDeclaration(parser, context, scope, 16, 0, start, line, column);
        case 241739:
            return parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column);
        case 20566:
            report(parser, 101, 'export');
        case 86108:
            nextToken(parser, context);
            switch (parser.token) {
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                case 67108877:
                    return parseImportMetaDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 101, 'import');
            }
        case 209007:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 1, start, line, column);
        default:
            return parseStatement(parser, context, scope, origin, labels, 1, start, line, column);
    }
}
export function parseStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    switch (parser.token) {
        case 86090:
            return parseVariableStatement(parser, context, scope, 0, start, line, column);
        case 20574:
            return parseReturnStatement(parser, context, start, line, column);
        case 20571:
            return parseIfStatement(parser, context, scope, labels, start, line, column);
        case 20569:
            return parseForStatement(parser, context, scope, labels, start, line, column);
        case 20564:
            return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
        case 20580:
            return parseWhileStatement(parser, context, scope, labels, start, line, column);
        case 86112:
            return parseSwitchStatement(parser, context, scope, labels, start, line, column);
        case 1074790417:
            return parseEmptyStatement(parser, context, start, line, column);
        case 2162700:
            return parseBlock(parser, context, scope ? addChildScope(scope, 2) : scope, labels, start, line, column);
        case 86114:
            return parseThrowStatement(parser, context, start, line, column);
        case 20557:
            return parseBreakStatement(parser, context, labels, start, line, column);
        case 20561:
            return parseContinueStatement(parser, context, labels, start, line, column);
        case 20579:
            return parseTryStatement(parser, context, scope, labels, start, line, column);
        case 20581:
            return parseWithStatement(parser, context, scope, labels, start, line, column);
        case 20562:
            return parseDebuggerStatement(parser, context, start, line, column);
        case 209007:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 0, start, line, column);
        case 139:
            return parseGeneral(parser, context, start, line, column);
        case 20559:
            report(parser, 157);
        case 20568:
            report(parser, 158);
        case 86106:
            report(parser, context & 1024
                ? 74
                : (context & 256) === 0
                    ? 76
                    : 75);
        case 86096:
            report(parser, 77);
        default:
            return parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column);
    }
}
export function parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    const { tokenValue, token } = parser;
    let expr;
    switch (token) {
        case 241739:
            expr = parseIdentifier(parser, context, 0);
            if (context & 1024)
                report(parser, 83);
            if (parser.token === 69271571)
                report(parser, 82);
            break;
        default:
            expr = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    }
    if (token & 143360 && parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
export function parseBlock(parser, context, scope, labels, start, line, column) {
    const body = [];
    consume(parser, context | 32768, 2162700);
    while (parser.token !== 1074790415) {
        body.push(parseStatementListItem(parser, context, scope, 2, { $: labels }));
    }
    consume(parser, context | 32768, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'BlockStatement',
        body
    });
}
export function parseReturnStatement(parser, context, start, line, column) {
    if ((context & 32) === 0 && context & 8192)
        report(parser, 90);
    nextToken(parser, context | 32768);
    const argument = parser.flags & 1 || parser.token & 1048576
        ? null
        : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ReturnStatement',
        argument
    });
}
export function parseExpressionStatement(parser, context, expression, start, line, column) {
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression
    });
}
export function parseLabelledStatement(parser, context, scope, origin, labels, value, expr, token, allowFuncDecl, start, line, column) {
    validateBindingIdentifier(parser, context, 0, token, 1);
    validateAndDeclareLabel(parser, labels, value);
    nextToken(parser, context | 32768);
    const body = allowFuncDecl &&
        (context & 1024) === 0 &&
        context & 256 &&
        parser.token === 86106
        ? parseFunctionDeclaration(parser, context, addChildScope(scope, 2), origin, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos)
        : parseStatement(parser, context, scope, origin, labels, allowFuncDecl, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'LabeledStatement',
        label: expr,
        body
    });
}
export function parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context, 0);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, 1, start, line, column);
    }
    const asyncNewLine = parser.flags & 1;
    if (!asyncNewLine) {
        if (parser.token === 86106) {
            if (!allowFuncDecl)
                report(parser, 120);
            return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 1, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            expr = parseAsyncArrowAfterIdent(parser, context, 1, start, line, column);
            if (parser.token === 18)
                expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
            return parseExpressionStatement(parser, context, expr, start, line, column);
        }
    }
    if (parser.token === 67174411) {
        expr = parseAsyncArrowOrCallExpression(parser, context, expr, 1, 1, 0, asyncNewLine, start, line, column);
    }
    else {
        if (parser.token === 10) {
            classifyIdentifier(parser, context, token, 1);
            expr = parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, 0, 1, 0, start, line, column);
        }
        parser.assignable = 1;
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    if (parser.token === 18)
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    parser.assignable = 1;
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
export function parseDirective(parser, context, expression, token, start, line, column) {
    if (token !== 1074790417) {
        parser.assignable = 2;
        expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
        if (parser.token !== 1074790417) {
            expression = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expression);
            if (parser.token === 18) {
                expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
            }
        }
        matchOrInsertSemicolon(parser, context | 32768);
    }
    return context & 8 && expression.type === 'Literal' && typeof expression.value === 'string'
        ? finishNode(parser, context, start, line, column, {
            type: 'ExpressionStatement',
            expression,
            directive: expression.raw.slice(1, -1)
        })
        : finishNode(parser, context, start, line, column, {
            type: 'ExpressionStatement',
            expression
        });
}
export function parseEmptyStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'EmptyStatement'
    });
}
export function parseThrowStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    if (parser.flags & 1)
        report(parser, 88);
    const argument = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ThrowStatement',
        argument
    });
}
export function parseIfStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    parser.assignable = 1;
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.colPos);
    consume(parser, context | 32768, 16);
    const consequent = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
    let alternate = null;
    if (parser.token === 20565) {
        nextToken(parser, context | 32768);
        alternate = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    });
}
export function parseConsequentOrAlternative(parser, context, scope, labels, start, line, column) {
    return context & 1024 ||
        (context & 256) === 0 ||
        parser.token !== 86106
        ? parseStatement(parser, context, scope, 0, { $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos)
        : parseFunctionDeclaration(parser, context, addChildScope(scope, 2), 0, 0, 0, 0, start, line, column);
}
export function parseSwitchStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const discriminant = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 16);
    consume(parser, context, 2162700);
    const cases = [];
    let seenDefault = 0;
    if (scope)
        scope = addChildScope(scope, 8);
    while (parser.token !== 1074790415) {
        const { tokenPos, linePos, colPos } = parser;
        let test = null;
        const consequent = [];
        if (consumeOpt(parser, context | 32768, 20558)) {
            test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        }
        else {
            consume(parser, context | 32768, 20563);
            if (seenDefault)
                report(parser, 87);
            seenDefault = 1;
        }
        consume(parser, context | 32768, 21);
        while (parser.token !== 20558 &&
            parser.token !== 1074790415 &&
            parser.token !== 20563) {
            consequent.push(parseStatementListItem(parser, context | 4096, scope, 2, {
                $: labels
            }));
        }
        cases.push(finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'SwitchCase',
            test,
            consequent
        }));
    }
    consume(parser, context | 32768, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'SwitchStatement',
        discriminant,
        cases
    });
}
export function parseWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'WhileStatement',
        test,
        body
    });
}
export function parseIterationStatementBody(parser, context, scope, labels) {
    return parseStatement(parser, ((context | 134217728) ^ 134217728) | 131072, scope, 0, { loop: 1, $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos);
}
export function parseContinueStatement(parser, context, labels, start, line, column) {
    if ((context & 131072) === 0)
        report(parser, 66);
    nextToken(parser, context);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context | 32768, 0);
        if (!isValidLabel(parser, labels, tokenValue, 1))
            report(parser, 135, tokenValue);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ContinueStatement',
        label
    });
}
export function parseBreakStatement(parser, context, labels, start, line, column) {
    nextToken(parser, context | 32768);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context | 32768, 0);
        if (!isValidLabel(parser, labels, tokenValue, 0))
            report(parser, 135, tokenValue);
    }
    else if ((context & (4096 | 131072)) === 0) {
        report(parser, 67);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'BreakStatement',
        label
    });
}
export function parseWithStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    if (context & 1024)
        report(parser, 89);
    consume(parser, context | 32768, 67174411);
    const object = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseStatement(parser, context, scope, 2, labels, 0, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'WithStatement',
        object,
        body
    });
}
export function parseDebuggerStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'DebuggerStatement'
    });
}
export function parseTryStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const firstScope = scope ? addChildScope(scope, 32) : void 0;
    const block = parseBlock(parser, context, firstScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    const { tokenPos, linePos, colPos } = parser;
    const handler = consumeOpt(parser, context | 32768, 20559)
        ? parseCatchBlock(parser, context, scope, labels, tokenPos, linePos, colPos)
        : null;
    let finalizer = null;
    if (parser.token === 20568) {
        nextToken(parser, context | 32768);
        const finalizerScope = firstScope ? addChildScope(scope, 4) : void 0;
        finalizer = parseBlock(parser, context, finalizerScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    }
    if (!handler && !finalizer) {
        report(parser, 86);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    });
}
export function parseCatchBlock(parser, context, scope, labels, start, line, column) {
    let param = null;
    let additionalScope = scope;
    if (consumeOpt(parser, context, 67174411)) {
        if (scope)
            scope = addChildScope(scope, 4);
        param = parseBindingPattern(parser, context, scope, (parser.token & 2097152) === 2097152
            ? 256
            : 512, 0, parser.tokenPos, parser.linePos, parser.colPos);
        if (parser.token === 18) {
            report(parser, 84);
        }
        else if (parser.token === 1077936157) {
            report(parser, 85);
        }
        consume(parser, context | 32768, 16);
        if (scope)
            additionalScope = addChildScope(scope, 64);
    }
    const body = parseBlock(parser, context, additionalScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'CatchClause',
        param,
        body
    });
}
export function parseStaticBlock(parser, context, scope, start, line, column) {
    if (scope)
        scope = addChildScope(scope, 2);
    const ctorContext = 16384 | 524288;
    context = ((context | ctorContext) ^ ctorContext) | 262144;
    const { body } = parseBlock(parser, context, scope, {}, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'StaticBlock',
        body
    });
}
export function parseDoWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    consume(parser, context, 20580);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    consumeOpt(parser, context | 32768, 1074790417);
    return finishNode(parser, context, start, line, column, {
        type: 'DoWhileStatement',
        body,
        test
    });
}
export function parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context, 0);
    if (parser.token & (143360 | 2097152)) {
        const declarations = parseVariableDeclarationList(parser, context, scope, 8, 0);
        matchOrInsertSemicolon(parser, context | 32768);
        return finishNode(parser, context, start, line, column, {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations
        });
    }
    parser.assignable = 1;
    if (context & 1024)
        report(parser, 83);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, {}, tokenValue, expr, token, 0, start, line, column);
    }
    if (parser.token === 10) {
        let scope = void 0;
        if (context & 64)
            scope = createArrowHeadParsingScope(parser, context, tokenValue);
        parser.flags = (parser.flags | 128) ^ 128;
        expr = parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    else {
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
        expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    }
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseLexicalDeclaration(parser, context, scope, kind, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, kind, origin);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: kind & 8 ? 'let' : 'const',
        declarations
    });
}
export function parseVariableStatement(parser, context, scope, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, 4, origin);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations
    });
}
export function parseVariableDeclarationList(parser, context, scope, kind, origin) {
    let bindingCount = 1;
    const list = [parseVariableDeclaration(parser, context, scope, kind, origin)];
    while (consumeOpt(parser, context, 18)) {
        bindingCount++;
        list.push(parseVariableDeclaration(parser, context, scope, kind, origin));
    }
    if (bindingCount > 1 && origin & 32 && parser.token & 262144) {
        report(parser, 59, KeywordDescTable[parser.token & 255]);
    }
    return list;
}
function parseVariableDeclaration(parser, context, scope, kind, origin) {
    const { token, tokenPos, linePos, colPos } = parser;
    let init = null;
    const id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);
    if (parser.token === 1077936157) {
        nextToken(parser, context | 32768);
        init = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        if (origin & 32 || (token & 2097152) === 0) {
            if (parser.token === 274549 ||
                (parser.token === 8738868 &&
                    (token & 2097152 || (kind & 4) === 0 || context & 1024))) {
                reportMessageAt(tokenPos, parser.line, parser.index - 3, 58, parser.token === 274549 ? 'of' : 'in');
            }
        }
    }
    else if ((kind & 16 || (token & 2097152) > 0) &&
        (parser.token & 262144) !== 262144) {
        report(parser, 57, kind & 16 ? 'const' : 'destructuring');
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'VariableDeclarator',
        id,
        init
    });
}
export function parseForStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    const forAwait = ((context & 4194304) > 0 || ((context & 2048) > 0 && (context & 8192) > 0)) &&
        consumeOpt(parser, context, 209008);
    consume(parser, context | 32768, 67174411);
    if (scope)
        scope = addChildScope(scope, 1);
    let test = null;
    let update = null;
    let destructible = 0;
    let init = null;
    let isVarDecl = parser.token === 86090 || parser.token === 241739 || parser.token === 86092;
    let right;
    const { token, tokenPos, linePos, colPos } = parser;
    if (isVarDecl) {
        if (token === 241739) {
            init = parseIdentifier(parser, context, 0);
            if (parser.token & (143360 | 2097152 | 139)) {
                if (parser.token === 8738868) {
                    if (context & 1024)
                        report(parser, 65);
                }
                else {
                    init = finishNode(parser, context, tokenPos, linePos, colPos, {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 8, 32)
                    });
                }
                parser.assignable = 1;
            }
            else if (context & 1024) {
                report(parser, 65);
            }
            else {
                isVarDecl = false;
                parser.assignable = 1;
                init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenPos, linePos, colPos);
                if (parser.token === 274549)
                    report(parser, 112);
            }
        }
        else {
            nextToken(parser, context);
            init = finishNode(parser, context, tokenPos, linePos, colPos, token === 86090
                ? {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 4, 32)
                }
                : {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 16, 32)
                });
            parser.assignable = 1;
        }
    }
    else if (token === 139) {
        init = parseGeneral(parser, context, start, line, column);
        if (parser.token === 16) {
            consume(parser, context | 32768, 16);
            const body = parseIterationStatementBody(parser, context, scope, labels);
            return finishNode(parser, context, start, line, column, {
                type: 'ForGeneralStatement',
                expression: init,
                body
            });
        }
    }
    else if (token === 1074790417) {
        if (forAwait)
            report(parser, 80);
    }
    else if ((token & 2097152) === 2097152) {
        init =
            token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos);
        destructible = parser.destructible;
        if (context & 256 && destructible & 64) {
            report(parser, 61);
        }
        parser.assignable =
            destructible & 16 ? 2 : 1;
        init = parseMemberOrUpdateExpression(parser, context | 134217728, init, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    }
    else {
        init = parseLeftHandSideExpression(parser, context | 134217728, 1, 0, 1, tokenPos, linePos, colPos);
    }
    if ((parser.token & 262144) === 262144) {
        if (parser.token === 274549) {
            if (parser.assignable & 2)
                report(parser, 78, forAwait ? 'await' : 'of');
            reinterpretToPattern(parser, init);
            nextToken(parser, context | 32768);
            right = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
            consume(parser, context | 32768, 16);
            const body = parseIterationStatementBody(parser, context, scope, labels);
            return finishNode(parser, context, start, line, column, {
                type: 'ForOfStatement',
                left: init,
                right,
                body,
                await: forAwait
            });
        }
        if (parser.assignable & 2)
            report(parser, 78, 'in');
        reinterpretToPattern(parser, init);
        nextToken(parser, context | 32768);
        if (forAwait)
            report(parser, 80);
        right = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        consume(parser, context | 32768, 16);
        const body = parseIterationStatementBody(parser, context, scope, labels);
        return finishNode(parser, context, start, line, column, {
            type: 'ForInStatement',
            body,
            left: init,
            right
        });
    }
    if (forAwait)
        report(parser, 80);
    if (!isVarDecl) {
        if (destructible & 8 && parser.token !== 1077936157) {
            report(parser, 78, 'loop');
        }
        init = parseAssignmentExpression(parser, context | 134217728, 0, 0, tokenPos, linePos, colPos, init);
    }
    if (parser.token === 18)
        init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);
    consume(parser, context | 32768, 1074790417);
    if (parser.token !== 1074790417)
        test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1074790417);
    if (parser.token !== 16)
        update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'ForStatement',
        init,
        test,
        update,
        body
    });
}
export function parseRestrictedIdentifier(parser, context, scope) {
    if (!isValidIdentifier(context, parser.token))
        report(parser, 115);
    if ((parser.token & 537079808) === 537079808)
        report(parser, 116);
    if (scope)
        addBlockName(parser, context, scope, parser.tokenValue, 8, 0);
    return parseIdentifier(parser, context, 0);
}
function parseImportDeclaration(parser, context, scope) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    nextToken(parser, context);
    let source = null;
    const { tokenPos, linePos, colPos } = parser;
    let specifiers = [];
    if (parser.token === 134283267) {
        source = parseLiteral(parser, context);
    }
    else {
        if (parser.token & 143360) {
            const local = parseRestrictedIdentifier(parser, context, scope);
            specifiers = [
                finishNode(parser, context, tokenPos, linePos, colPos, {
                    type: 'ImportDefaultSpecifier',
                    local
                })
            ];
            if (consumeOpt(parser, context, 18)) {
                switch (parser.token) {
                    case 8457014:
                        specifiers.push(parseImportNamespaceSpecifier(parser, context, scope));
                        break;
                    case 2162700:
                        parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                        break;
                    default:
                        report(parser, 105);
                }
            }
        }
        else {
            switch (parser.token) {
                case 8457014:
                    specifiers = [parseImportNamespaceSpecifier(parser, context, scope)];
                    break;
                case 2162700:
                    parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                    break;
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                case 67108877:
                    return parseImportMetaDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
        }
        source = parseModuleSpecifier(parser, context);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportDeclaration',
        specifiers,
        source
    });
}
function parseImportNamespaceSpecifier(parser, context, scope) {
    const { tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    consume(parser, context, 77934);
    if ((parser.token & 134217728) === 134217728) {
        reportMessageAt(tokenPos, parser.line, parser.index, 28, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ImportNamespaceSpecifier',
        local: parseRestrictedIdentifier(parser, context, scope)
    });
}
function parseModuleSpecifier(parser, context) {
    consumeOpt(parser, context, 12404);
    if (parser.token !== 134283267)
        report(parser, 103, 'Import');
    return parseLiteral(parser, context);
}
function parseImportSpecifierOrNamedImports(parser, context, scope, specifiers) {
    nextToken(parser, context);
    while (parser.token & 143360) {
        let { token, tokenValue, tokenPos, linePos, colPos } = parser;
        const imported = parseIdentifier(parser, context, 0);
        let local;
        if (consumeOpt(parser, context, 77934)) {
            if ((parser.token & 134217728) === 134217728 || parser.token === 18) {
                report(parser, 104);
            }
            else {
                validateBindingIdentifier(parser, context, 16, parser.token, 0);
            }
            tokenValue = parser.tokenValue;
            local = parseIdentifier(parser, context, 0);
        }
        else {
            validateBindingIdentifier(parser, context, 16, token, 0);
            local = imported;
        }
        if (scope)
            addBlockName(parser, context, scope, tokenValue, 8, 0);
        specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'ImportSpecifier',
            local,
            imported
        }));
        if (parser.token !== 1074790415)
            consume(parser, context, 18);
    }
    consume(parser, context, 1074790415);
    return specifiers;
}
export function parseImportMetaDeclaration(parser, context, start, line, column) {
    let expr = parseImportMetaExpression(parser, context, finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: 'import'
    }), start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseImportCallDeclaration(parser, context, start, line, column) {
    let expr = parseImportExpression(parser, context, 0, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseExportDeclaration(parser, context, scope) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    nextToken(parser, context | 32768);
    const specifiers = [];
    let declaration = null;
    let source = null;
    let key;
    if (consumeOpt(parser, context | 32768, 20563)) {
        switch (parser.token) {
            case 86106: {
                declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
                break;
            }
            case 133:
            case 86096:
                declaration = parseClassDeclaration(parser, context, scope, 1, parser.tokenPos, parser.linePos, parser.colPos);
                break;
            case 209007:
                const { tokenPos, linePos, colPos } = parser;
                declaration = parseIdentifier(parser, context, 0);
                const { flags } = parser;
                if ((flags & 1) === 0) {
                    if (parser.token === 86106) {
                        declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 1, tokenPos, linePos, colPos);
                    }
                    else {
                        if (parser.token === 67174411) {
                            declaration = parseAsyncArrowOrCallExpression(parser, context, declaration, 1, 1, 0, flags, tokenPos, linePos, colPos);
                            declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, tokenPos, linePos, colPos);
                            declaration = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, declaration);
                        }
                        else if (parser.token & 143360) {
                            if (scope)
                                scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);
                            declaration = parseIdentifier(parser, context, 0);
                            declaration = parseArrowFunctionExpression(parser, context, scope, [declaration], 1, tokenPos, linePos, colPos);
                        }
                    }
                }
                break;
            default:
                declaration = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
                matchOrInsertSemicolon(parser, context | 32768);
        }
        if (scope)
            declareUnboundVariable(parser, 'default');
        return finishNode(parser, context, start, line, column, {
            type: 'ExportDefaultDeclaration',
            declaration
        });
    }
    switch (parser.token) {
        case 8457014: {
            nextToken(parser, context);
            let exported = null;
            const isNamedDeclaration = consumeOpt(parser, context, 77934);
            if (isNamedDeclaration) {
                if (scope)
                    declareUnboundVariable(parser, parser.tokenValue);
                exported = parseIdentifier(parser, context, 0);
            }
            consume(parser, context, 12404);
            if (parser.token !== 134283267)
                report(parser, 103, 'Export');
            source = parseLiteral(parser, context);
            matchOrInsertSemicolon(parser, context | 32768);
            return finishNode(parser, context, start, line, column, {
                type: 'ExportAllDeclaration',
                source,
                exported
            });
        }
        case 2162700: {
            nextToken(parser, context);
            const tmpExportedNames = [];
            const tmpExportedBindings = [];
            while (parser.token & 143360) {
                const { tokenPos, tokenValue, linePos, colPos } = parser;
                const local = parseIdentifier(parser, context, 0);
                let exported;
                if (parser.token === 77934) {
                    nextToken(parser, context);
                    if ((parser.token & 134217728) === 134217728) {
                        report(parser, 104);
                    }
                    if (scope) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(tokenValue);
                    }
                    exported = parseIdentifier(parser, context, 0);
                }
                else {
                    if (scope) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(parser.tokenValue);
                    }
                    exported = local;
                }
                specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                    type: 'ExportSpecifier',
                    local,
                    exported
                }));
                if (parser.token !== 1074790415)
                    consume(parser, context, 18);
            }
            consume(parser, context, 1074790415);
            if (consumeOpt(parser, context, 12404)) {
                if (parser.token !== 134283267)
                    report(parser, 103, 'Export');
                source = parseLiteral(parser, context);
            }
            else if (scope) {
                let i = 0;
                let iMax = tmpExportedNames.length;
                for (; i < iMax; i++) {
                    declareUnboundVariable(parser, tmpExportedNames[i]);
                }
                i = 0;
                iMax = tmpExportedBindings.length;
                for (; i < iMax; i++) {
                    addBindingToExports(parser, tmpExportedBindings[i]);
                }
            }
            matchOrInsertSemicolon(parser, context | 32768);
            break;
        }
        case 86096:
            declaration = parseClassDeclaration(parser, context, scope, 2, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86106:
            declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 0, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 241739:
            declaration = parseLexicalDeclaration(parser, context, scope, 8, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86092:
            declaration = parseLexicalDeclaration(parser, context, scope, 16, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86090:
            declaration = parseVariableStatement(parser, context, scope, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 209007:
            const { tokenPos, linePos, colPos } = parser;
            nextToken(parser, context);
            if ((parser.flags & 1) === 0 && parser.token === 86106) {
                declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 1, tokenPos, linePos, colPos);
                if (scope) {
                    key = declaration.id ? declaration.id.name : '';
                    declareUnboundVariable(parser, key);
                }
                break;
            }
        default:
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'ExportNamedDeclaration',
        declaration,
        specifiers,
        source
    });
}
export function parseExpression(parser, context, canAssign, isPattern, inGroup, start, line, column) {
    let expr = parsePrimaryExpression(parser, context, 2, 0, canAssign, isPattern, inGroup, 1, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
    return parseAssignmentExpression(parser, context, inGroup, 0, start, line, column, expr);
}
export function parseSequenceExpression(parser, context, inGroup, start, line, column, expr) {
    const expressions = [expr];
    while (consumeOpt(parser, context | 32768, 18)) {
        expressions.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return finishNode(parser, context, start, line, column, {
        type: 'SequenceExpression',
        expressions
    });
}
export function parseExpressions(parser, context, inGroup, canAssign, start, line, column) {
    const expr = parseExpression(parser, context, canAssign, 0, inGroup, start, line, column);
    return parser.token === 18
        ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr)
        : expr;
}
export function parseAssignmentExpression(parser, context, inGroup, isPattern, start, line, column, left) {
    const { token } = parser;
    if ((token & 4194304) === 4194304) {
        if (parser.assignable & 2)
            report(parser, 24);
        if ((!isPattern && token === 1077936157 && left.type === 'ArrayExpression') ||
            left.type === 'ObjectExpression') {
            reinterpretToPattern(parser, left);
        }
        nextToken(parser, context | 32768);
        const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, isPattern
            ? {
                type: 'AssignmentPattern',
                left,
                right
            }
            : {
                type: 'AssignmentExpression',
                left,
                operator: KeywordDescTable[token & 255],
                right
            });
    }
    if ((token & 8454144) === 8454144) {
        left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left);
    }
    if (consumeOpt(parser, context | 32768, 22)) {
        left = parseConditionalExpression(parser, context, left, start, line, column);
    }
    return left;
}
export function parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, start, line, column, left) {
    const { token } = parser;
    nextToken(parser, context | 32768);
    const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    left = finishNode(parser, context, start, line, column, isPattern
        ? {
            type: 'AssignmentPattern',
            left,
            right
        }
        : {
            type: 'AssignmentExpression',
            left,
            operator: KeywordDescTable[token & 255],
            right
        });
    parser.assignable = 2;
    return left;
}
export function parseConditionalExpression(parser, context, test, start, line, column) {
    const consequent = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 21);
    parser.assignable = 1;
    const alternate = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    });
}
export function parseBinaryExpression(parser, context, inGroup, start, line, column, minPrec, operator, left) {
    const bit = -((context & 134217728) > 0) & 8738868;
    let t;
    let prec;
    parser.assignable = 2;
    while (parser.token & 8454144) {
        t = parser.token;
        prec = t & 3840;
        if ((t & 524288 && operator & 268435456) || (operator & 524288 && t & 268435456)) {
            report(parser, 160);
        }
        if (prec + ((t === 8457273) << 8) - ((bit === t) << 12) <= minPrec)
            break;
        nextToken(parser, context | 32768);
        left = finishNode(parser, context, start, line, column, {
            type: t & 524288 || t & 268435456 ? 'LogicalExpression' : 'BinaryExpression',
            left,
            right: parseBinaryExpression(parser, context, inGroup, parser.tokenPos, parser.linePos, parser.colPos, prec, t, parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos)),
            operator: KeywordDescTable[t & 255]
        });
    }
    if (parser.token === 1077936157)
        report(parser, 24);
    return left;
}
export function parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup) {
    if (!isLHS)
        report(parser, 0);
    const unaryOperator = parser.token;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.token === 8457273)
        report(parser, 31);
    if (context & 1024 && unaryOperator === 16863278) {
        if (arg.type === 'Identifier') {
            report(parser, 118);
        }
        else if (isPropertyWithPrivateFieldKey(arg)) {
            report(parser, 124);
        }
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UnaryExpression',
        operator: KeywordDescTable[unaryOperator & 255],
        argument: arg,
        prefix: true
    });
}
export function parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column) {
    const { token } = parser;
    const expr = parseIdentifier(parser, context, isPattern);
    const { flags } = parser;
    if ((flags & 1) === 0) {
        if (parser.token === 86106) {
            return parseFunctionExpression(parser, context, 1, inGroup, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            if (!isLHS)
                report(parser, 0);
            return parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column);
        }
    }
    if (!inNew && parser.token === 67174411) {
        return parseAsyncArrowOrCallExpression(parser, context, expr, canAssign, 1, 0, flags, start, line, column);
    }
    if (parser.token === 10) {
        classifyIdentifier(parser, context, token, 1);
        if (inNew)
            report(parser, 49);
        return parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, inNew, canAssign, 0, start, line, column);
    }
    return expr;
}
export function parseYieldExpression(parser, context, inGroup, canAssign, start, line, column) {
    if (inGroup)
        parser.destructible |= 256;
    if (context & 2097152) {
        nextToken(parser, context | 32768);
        if (context & 8388608)
            report(parser, 30);
        if (!canAssign)
            report(parser, 24);
        if (parser.token === 22)
            report(parser, 121);
        let argument = null;
        let delegate = false;
        if ((parser.flags & 1) === 0) {
            delegate = consumeOpt(parser, context | 32768, 8457014);
            if (parser.token & (12288 | 65536) || delegate) {
                argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
            }
        }
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'YieldExpression',
            argument,
            delegate
        });
    }
    if (context & 1024)
        report(parser, 95, 'yield');
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
export function parseAwaitExpression(parser, context, inNew, inGroup, start, line, column) {
    if (inGroup)
        parser.destructible |= 128;
    if (context & 4194304 || (context & 2048 && context & 8192)) {
        if (inNew)
            report(parser, 0);
        if (context & 8388608) {
            reportMessageAt(parser.index, parser.line, parser.index, 29);
        }
        nextToken(parser, context | 32768);
        const argument = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        if (parser.token === 8457273)
            report(parser, 31);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'AwaitExpression',
            argument
        });
    }
    if (context & 2048)
        report(parser, 96);
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
export function parseFunctionBody(parser, context, scope, origin, firstRestricted, scopeError) {
    const { tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    const body = [];
    const prevContext = context;
    if (parser.token !== 1074790415) {
        while (parser.token === 134283267) {
            const { index, tokenPos, tokenValue, token } = parser;
            const expr = parseLiteral(parser, context);
            if (isValidStrictMode(parser, index, tokenPos, tokenValue)) {
                context |= 1024;
                if (parser.flags & 128) {
                    reportMessageAt(parser.index, parser.line, parser.tokenPos, 64);
                }
                if (parser.flags & 64) {
                    reportMessageAt(parser.index, parser.line, parser.tokenPos, 8);
                }
            }
            body.push(parseDirective(parser, context, expr, token, tokenPos, parser.linePos, parser.colPos));
        }
        if (context & 1024) {
            if (firstRestricted) {
                if ((firstRestricted & 537079808) === 537079808) {
                    report(parser, 116);
                }
                if ((firstRestricted & 36864) === 36864) {
                    report(parser, 38);
                }
            }
            if (parser.flags & 512)
                report(parser, 116);
            if (parser.flags & 256)
                report(parser, 115);
        }
        if (context & 64 &&
            scope &&
            scopeError !== void 0 &&
            (prevContext & 1024) === 0 &&
            (context & 8192) === 0) {
            reportScopeError(scopeError);
        }
    }
    parser.flags =
        (parser.flags | 512 | 256 | 64) ^
            (512 | 256 | 64);
    parser.destructible = (parser.destructible | 256) ^ 256;
    while (parser.token !== 1074790415) {
        body.push(parseStatementListItem(parser, context, scope, 4, {}));
    }
    consume(parser, origin & (16 | 8) ? context | 32768 : context, 1074790415);
    parser.flags &= ~(128 | 64);
    if (parser.token === 1077936157)
        report(parser, 24);
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'BlockStatement',
        body
    });
}
export function parseSuperExpression(parser, context, start, line, column) {
    nextToken(parser, context);
    switch (parser.token) {
        case 67108991:
            report(parser, 162);
        case 67174411: {
            if ((context & 524288) === 0)
                report(parser, 26);
            if (context & 16384)
                report(parser, 27);
            parser.assignable = 2;
            break;
        }
        case 69271571:
        case 67108877: {
            if ((context & 262144) === 0)
                report(parser, 27);
            if (context & 16384)
                report(parser, 27);
            parser.assignable = 1;
            break;
        }
        default:
            report(parser, 28, 'super');
    }
    return finishNode(parser, context, start, line, column, { type: 'Super' });
}
export function parseLeftHandSideExpression(parser, context, canAssign, inGroup, isLHS, start, line, column) {
    const expression = parsePrimaryExpression(parser, context, 2, 0, canAssign, 0, inGroup, isLHS, start, line, column);
    return parseMemberOrUpdateExpression(parser, context, expression, inGroup, 0, start, line, column);
}
function parseUpdateExpression(parser, context, expr, start, line, column) {
    if (parser.assignable & 2)
        report(parser, 53);
    const { token } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UpdateExpression',
        argument: expr,
        operator: KeywordDescTable[token & 255],
        prefix: false
    });
}
export function parseMemberOrUpdateExpression(parser, context, expr, inGroup, inChain, start, line, column) {
    if ((parser.token & 33619968) === 33619968 && (parser.flags & 1) === 0) {
        expr = parseUpdateExpression(parser, context, expr, start, line, column);
    }
    else if ((parser.token & 67108864) === 67108864) {
        context = (context | 134217728) ^ 134217728;
        switch (parser.token) {
            case 67108877: {
                nextToken(parser, (context | 1073741824 | 8192) ^ 8192);
                parser.assignable = 1;
                const property = parsePropertyOrPrivatePropertyName(parser, context);
                expr = finishNode(parser, context, start, line, column, {
                    type: 'MemberExpression',
                    object: expr,
                    computed: false,
                    property
                });
                break;
            }
            case 69271571: {
                let restoreHasOptionalChaining = false;
                if ((parser.flags & 2048) === 2048) {
                    restoreHasOptionalChaining = true;
                    parser.flags = (parser.flags | 2048) ^ 2048;
                }
                nextToken(parser, context | 32768);
                const { tokenPos, linePos, colPos } = parser;
                const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
                consume(parser, context, 20);
                parser.assignable = 1;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'MemberExpression',
                    object: expr,
                    computed: true,
                    property
                });
                if (restoreHasOptionalChaining) {
                    parser.flags |= 2048;
                }
                break;
            }
            case 67174411: {
                if ((parser.flags & 1024) === 1024) {
                    parser.flags = (parser.flags | 1024) ^ 1024;
                    return expr;
                }
                let restoreHasOptionalChaining = false;
                if ((parser.flags & 2048) === 2048) {
                    restoreHasOptionalChaining = true;
                    parser.flags = (parser.flags | 2048) ^ 2048;
                }
                const args = parseArguments(parser, context, inGroup);
                parser.assignable = 2;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'CallExpression',
                    callee: expr,
                    arguments: args
                });
                if (restoreHasOptionalChaining) {
                    parser.flags |= 2048;
                }
                break;
            }
            case 67108991: {
                nextToken(parser, (context | 1073741824 | 8192) ^ 8192);
                parser.flags |= 2048;
                parser.assignable = 2;
                expr = parseOptionalChain(parser, context, expr, start, line, column);
                break;
            }
            default:
                if ((parser.flags & 2048) === 2048) {
                    report(parser, 161);
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'TaggedTemplateExpression',
                    tag: expr,
                    quasi: parser.token === 67174408
                        ? parseTemplate(parser, context | 65536)
                        : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
                });
        }
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, start, line, column);
    }
    if (inChain === 0 && (parser.flags & 2048) === 2048) {
        parser.flags = (parser.flags | 2048) ^ 2048;
        expr = finishNode(parser, context, start, line, column, {
            type: 'ChainExpression',
            expression: expr
        });
    }
    return expr;
}
export function parseOptionalChain(parser, context, expr, start, line, column) {
    let restoreHasOptionalChaining = false;
    let node;
    if (parser.token === 69271571 || parser.token === 67174411) {
        if ((parser.flags & 2048) === 2048) {
            restoreHasOptionalChaining = true;
            parser.flags = (parser.flags | 2048) ^ 2048;
        }
    }
    if (parser.token === 69271571) {
        nextToken(parser, context | 32768);
        const { tokenPos, linePos, colPos } = parser;
        const property = parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos);
        consume(parser, context, 20);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: true,
            optional: true,
            property
        });
    }
    else if (parser.token === 67174411) {
        const args = parseArguments(parser, context, 0);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee: expr,
            arguments: args,
            optional: true
        });
    }
    else {
        if ((parser.token & (143360 | 4096)) === 0)
            report(parser, 155);
        const property = parseIdentifier(parser, context, 0);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: false,
            optional: true,
            property
        });
    }
    if (restoreHasOptionalChaining) {
        parser.flags |= 2048;
    }
    return node;
}
export function parsePropertyOrPrivatePropertyName(parser, context) {
    if ((parser.token & (143360 | 4096)) === 0 && parser.token !== 131) {
        report(parser, 155);
    }
    return context & 1 && parser.token === 131
        ? parsePrivateIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
        : parseIdentifier(parser, context, 0);
}
export function parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column) {
    if (inNew)
        report(parser, 54);
    if (!isLHS)
        report(parser, 0);
    const { token } = parser;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.assignable & 2) {
        report(parser, 53);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UpdateExpression',
        argument: arg,
        operator: KeywordDescTable[token & 255],
        prefix: true
    });
}
export function parsePrimaryExpression(parser, context, kind, inNew, canAssign, isPattern, inGroup, isLHS, start, line, column) {
    if ((parser.token & 143360) === 143360) {
        switch (parser.token) {
            case 209008:
                return parseAwaitExpression(parser, context, inNew, inGroup, start, line, column);
            case 241773:
                return parseYieldExpression(parser, context, inGroup, canAssign, start, line, column);
            case 209007:
                return parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column);
            default:
        }
        const { token, tokenValue } = parser;
        const expr = parseIdentifier(parser, context | 65536, isPattern);
        if (parser.token === 10) {
            if (!isLHS)
                report(parser, 0);
            classifyIdentifier(parser, context, token, 1);
            return parseArrowFromIdentifier(parser, context, tokenValue, expr, inNew, canAssign, 0, start, line, column);
        }
        if (context & 16384 && token === 537079928)
            report(parser, 127);
        if (token === 241739) {
            if (context & 1024)
                report(parser, 110);
            if (kind & (8 | 16))
                report(parser, 98);
        }
        parser.assignable =
            context & 1024 && (token & 537079808) === 537079808
                ? 2
                : 1;
        return expr;
    }
    if ((parser.token & 134217728) === 134217728) {
        return parseLiteral(parser, context);
    }
    switch (parser.token) {
        case 33619995:
        case 33619996:
            return parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column);
        case 16863278:
        case 16842800:
        case 16842801:
        case 25233970:
        case 25233971:
        case 16863277:
        case 16863279:
            return parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup);
        case 86106:
            return parseFunctionExpression(parser, context, 0, inGroup, start, line, column);
        case 2162700:
            return parseObjectLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
        case 69271571:
            return parseArrayLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
        case 67174411:
            return parseParenthesizedExpression(parser, context, canAssign, 1, 0, start, line, column);
        case 86021:
        case 86022:
        case 86023:
            return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
        case 86113:
            return parseThisExpression(parser, context);
        case 65540:
            return parseRegExpLiteral(parser, context, start, line, column);
        case 133:
        case 86096:
            return parseClassExpression(parser, context, inGroup, start, line, column);
        case 86111:
            return parseSuperExpression(parser, context, start, line, column);
        case 67174409:
            return parseTemplateLiteral(parser, context, start, line, column);
        case 67174408:
            return parseTemplate(parser, context);
        case 86109:
            return parseNewExpression(parser, context, inGroup, start, line, column);
        case 134283389:
            return parseBigIntLiteral(parser, context, start, line, column);
        case 131:
            return parsePrivateIdentifier(parser, context, start, line, column);
        case 86108:
            return parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column);
        case 8456258:
            if (context & 16)
                return parseJSXRootElementOrFragment(parser, context, 1, start, line, column);
        case 139:
            return parseGeneral(parser, context, start, line, column);
        default:
            if (isValidIdentifier(context, parser.token))
                return parseIdentifierOrArrow(parser, context, start, line, column);
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
}
function parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column) {
    let expr = parseIdentifier(parser, context, 0);
    if (parser.token === 67108877) {
        return parseImportMetaExpression(parser, context, expr, start, line, column);
    }
    if (inNew)
        report(parser, 138);
    expr = parseImportExpression(parser, context, inGroup, start, line, column);
    parser.assignable = 2;
    return parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
}
export function parseImportMetaExpression(parser, context, meta, start, line, column) {
    if ((context & 2048) === 0)
        report(parser, 164);
    nextToken(parser, context);
    if (parser.token !== 143495 && parser.tokenValue !== 'meta')
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property: parseIdentifier(parser, context, 0)
    });
}
export function parseImportExpression(parser, context, inGroup, start, line, column) {
    consume(parser, context | 32768, 67174411);
    if (parser.token === 14)
        report(parser, 139);
    const source = parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 16);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportExpression',
        source
    });
}
export function parseBigIntLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            bigint: tokenRaw.slice(0, -1),
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue,
            bigint: tokenRaw.slice(0, -1)
        });
}
export function parseTemplateLiteral(parser, context, start, line, column) {
    parser.assignable = 2;
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context, 67174409);
    const quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true)];
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateLiteral',
        expressions: [],
        quasis
    });
}
export function parseTemplate(parser, context) {
    context = (context | 134217728) ^ 134217728;
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 67174408);
    const quasis = [
        parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false)
    ];
    const expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];
    if (parser.token !== 1074790415)
        report(parser, 81);
    while ((parser.token = scanTemplateTail(parser, context)) !== 67174409) {
        const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
        consume(parser, context | 32768, 67174408);
        quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false));
        expressions.push(parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
        if (parser.token !== 1074790415)
            report(parser, 81);
    }
    {
        const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
        consume(parser, context, 67174409);
        quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true));
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'TemplateLiteral',
        expressions,
        quasis
    });
}
export function parseTemplateElement(parser, context, cooked, raw, start, line, col, tail) {
    const node = finishNode(parser, context, start, line, col, {
        type: 'TemplateElement',
        value: {
            cooked,
            raw
        },
        tail
    });
    const tailSize = tail ? 1 : 2;
    if (context & 2) {
        node.start += 1;
        node.range[0] += 1;
        node.end -= tailSize;
        node.range[1] -= tailSize;
    }
    if (context & 4) {
        node.loc.start.column += 1;
        node.loc.end.column -= tailSize;
    }
    return node;
}
function parseSpreadElement(parser, context, start, line, column) {
    context = (context | 134217728) ^ 134217728;
    consume(parser, context | 32768, 14);
    const argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 1;
    return finishNode(parser, context, start, line, column, {
        type: 'SpreadElement',
        argument
    });
}
export function parseArguments(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const args = [];
    if (parser.token === 16) {
        nextToken(parser, context);
        return args;
    }
    while (parser.token !== 16) {
        if (parser.token === 14) {
            args.push(parseSpreadElement(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
        }
        else {
            args.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
        }
        if (parser.token !== 18)
            break;
        nextToken(parser, context | 32768);
        if (parser.token === 16)
            break;
    }
    consume(parser, context, 16);
    return args;
}
export function parseIdentifier(parser, context, isPattern) {
    const { tokenValue, tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, tokenPos, linePos, colPos, context & 268435456
        ? {
            type: 'Identifier',
            name: tokenValue,
            pattern: isPattern === 1
        }
        : {
            type: 'Identifier',
            name: tokenValue
        });
}
export function parseLiteral(parser, context) {
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    if (parser.token === 134283389) {
        return parseBigIntLiteral(parser, context, tokenPos, linePos, colPos);
    }
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, tokenPos, linePos, colPos, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue
        });
}
export function parseNullOrTrueOrFalseLiteral(parser, context, start, line, column) {
    const raw = KeywordDescTable[parser.token & 255];
    const value = parser.token === 86023 ? null : raw === 'true';
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value,
            raw
        }
        : {
            type: 'Literal',
            value
        });
}
export function parseThisExpression(parser, context) {
    const { tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ThisExpression'
    });
}
export function parseFunctionDeclaration(parser, context, scope, origin, allowGen, flags, isAsync, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = allowGen ? optionalBit(parser, context, 8457014) : 0;
    let id = null;
    let firstRestricted;
    let functionScope = scope ? createScope() : void 0;
    if (parser.token === 67174411) {
        if ((flags & 1) === 0)
            report(parser, 37, 'Function');
    }
    else {
        const kind = origin & 4 && ((context & 8192) === 0 || (context & 2048) === 0)
            ? 4
            : 64;
        validateFunctionName(parser, context | ((context & 3072) << 11), parser.token);
        if (scope) {
            if (kind & 4) {
                addVarName(parser, context, scope, parser.tokenValue, kind);
            }
            else {
                addBlockName(parser, context, scope, parser.tokenValue, kind, origin);
            }
            functionScope = addChildScope(functionScope, 256);
            if (flags) {
                if (flags & 2) {
                    declareUnboundVariable(parser, parser.tokenValue);
                }
            }
        }
        firstRestricted = parser.token;
        if (parser.token & 143360) {
            id = parseIdentifier(parser, context, 0);
        }
        else if (parser.token === 139) {
            id = parseGeneral(parser, context, start, line, column);
        }
        else {
            report(parser, 28, KeywordDescTable[parser.token & 255]);
        }
    }
    context =
        ((context | 32243712) ^ 32243712) |
            67108864 |
            ((isAsync * 2 + isGenerator) << 21) |
            (isGenerator ? 0 : 1073741824);
    if (scope)
        functionScope = addChildScope(functionScope, 512);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, functionScope, 0, 1);
    const body = parseFunctionBody(parser, (context | 8192 | 4096 | 131072) ^
        (8192 | 4096 | 131072), scope ? addChildScope(functionScope, 128) : functionScope, 8, firstRestricted, scope ? functionScope.scopeError : void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionDeclaration',
        id,
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1
    });
}
export function parseFunctionExpression(parser, context, isAsync, inGroup, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = optionalBit(parser, context, 8457014);
    const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
    let id = null;
    let firstRestricted;
    let scope = context & 64 ? createScope() : void 0;
    if ((parser.token & (143360 | 4096 | 36864)) > 0) {
        validateFunctionName(parser, ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags, parser.token);
        if (scope)
            scope = addChildScope(scope, 256);
        firstRestricted = parser.token;
        id = parseIdentifier(parser, context, 0);
    }
    context =
        ((context | 32243712) ^ 32243712) |
            67108864 |
            generatorAndAsyncFlags |
            (isGenerator ? 0 : 1073741824);
    if (scope)
        scope = addChildScope(scope, 512);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, scope, inGroup, 1);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192 | 4096 | 131072 | 16384), scope ? addChildScope(scope, 128) : scope, 0, firstRestricted, void 0);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        id,
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1
    });
}
function parseArrayLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseArrayExpressionOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 61);
    }
    if (parser.destructible & 8) {
        report(parser, 60);
    }
    return expr;
}
export function parseArrayExpressionOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
    nextToken(parser, context | 32768);
    const elements = [];
    let destructible = 0;
    context = (context | 134217728) ^ 134217728;
    while (parser.token !== 20) {
        if (consumeOpt(parser, context | 32768, 18)) {
            elements.push(null);
        }
        else {
            let left;
            const { token, tokenPos, linePos, colPos, tokenValue } = parser;
            if (token & 143360) {
                left = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                if (parser.token === 1077936157) {
                    if (parser.assignable & 2)
                        report(parser, 24);
                    nextToken(parser, context | 32768);
                    if (scope)
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    left = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                        ? {
                            type: 'AssignmentPattern',
                            left,
                            right
                        }
                        : {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left,
                            right
                        });
                    destructible |=
                        parser.destructible & 256
                            ? 256
                            : 0 | (parser.destructible & 128)
                                ? 128
                                : 0;
                }
                else if (parser.token === 18 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                    else if (scope) {
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    }
                    destructible |=
                        parser.destructible & 256
                            ? 256
                            : 0 | (parser.destructible & 128)
                                ? 128
                                : 0;
                }
                else {
                    destructible |=
                        kind & 1
                            ? 32
                            : (kind & 2) === 0
                                ? 16
                                : 0;
                    left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                    if (parser.token !== 18 && parser.token !== 20) {
                        if (parser.token !== 1077936157)
                            destructible |= 16;
                        left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    }
                    else if (parser.token !== 1077936157) {
                        destructible |=
                            parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (token & 2097152) {
                left =
                    parser.token === 2162700
                        ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                        : parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                destructible |= parser.destructible;
                parser.assignable =
                    parser.destructible & 16
                        ? 2
                        : 1;
                if (parser.token === 18 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                }
                else if (parser.destructible & 8) {
                    report(parser, 69);
                }
                else {
                    left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                    destructible = parser.assignable & 2 ? 16 : 0;
                    if (parser.token !== 18 && parser.token !== 20) {
                        left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    }
                    else if (parser.token !== 1077936157) {
                        destructible |=
                            parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 20, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos);
                destructible |= parser.destructible;
                if (parser.token !== 18 && parser.token !== 20)
                    report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
            else {
                left = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                if (parser.token !== 18 && parser.token !== 20) {
                    left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    if ((kind & (2 | 1)) === 0 && token === 67174411)
                        destructible |= 16;
                }
                else if (parser.assignable & 2) {
                    destructible |= 16;
                }
                else if (token === 67174411) {
                    destructible |=
                        parser.assignable & 1 && kind & (2 | 1)
                            ? 32
                            : 16;
                }
            }
            elements.push(left);
            if (consumeOpt(parser, context | 32768, 18)) {
                if (parser.token === 20)
                    break;
            }
            else
                break;
        }
    }
    consume(parser, context, 20);
    const node = finishNode(parser, context, start, line, column, {
        type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
        elements
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
function parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node) {
    if (parser.token !== 1077936157)
        report(parser, 24);
    nextToken(parser, context | 32768);
    if (destructible & 16)
        report(parser, 24);
    if (!isPattern)
        reinterpretToPattern(parser, node);
    const { tokenPos, linePos, colPos } = parser;
    const right = parseExpression(parser, context, 1, 1, inGroup, tokenPos, linePos, colPos);
    parser.destructible =
        ((destructible | 64 | 8) ^
            (8 | 64)) |
            (parser.destructible & 128 ? 128 : 0) |
            (parser.destructible & 256 ? 256 : 0);
    return finishNode(parser, context, start, line, column, isPattern
        ? {
            type: 'AssignmentPattern',
            left: node,
            right
        }
        : {
            type: 'AssignmentExpression',
            left: node,
            operator: '=',
            right
        });
}
function parseSpreadOrRestElement(parser, context, scope, closingToken, kind, origin, isAsync, inGroup, isPattern, start, line, column) {
    nextToken(parser, context | 32768);
    let argument = null;
    let destructible = 0;
    let { token, tokenValue, tokenPos, linePos, colPos } = parser;
    if (token & (4096 | 143360)) {
        parser.assignable = 1;
        argument = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
        token = parser.token;
        argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
        if (parser.token !== 18 && parser.token !== closingToken) {
            if (parser.assignable & 2 && parser.token === 1077936157)
                report(parser, 69);
            destructible |= 16;
            argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
        }
        if (parser.assignable & 2) {
            destructible |= 16;
        }
        else if (token === closingToken || token === 18) {
            if (scope)
                addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
        }
        else {
            destructible |= 32;
        }
        destructible |= parser.destructible & 128 ? 128 : 0;
    }
    else if (token === closingToken) {
        report(parser, 39);
    }
    else if (token & 2097152) {
        argument =
            parser.token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
        token = parser.token;
        if (token !== 1077936157 && token !== closingToken && token !== 18) {
            if (parser.destructible & 8)
                report(parser, 69);
            argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
            destructible |= parser.assignable & 2 ? 16 : 0;
            if ((parser.token & 4194304) === 4194304) {
                if (parser.token !== 1077936157)
                    destructible |= 16;
                argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            }
            else {
                if ((parser.token & 8454144) === 8454144) {
                    argument = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, argument);
                }
                if (consumeOpt(parser, context | 32768, 22)) {
                    argument = parseConditionalExpression(parser, context, argument, tokenPos, linePos, colPos);
                }
                destructible |=
                    parser.assignable & 2
                        ? 16
                        : 32;
            }
        }
        else {
            destructible |=
                closingToken === 1074790415 && token !== 1077936157
                    ? 16
                    : parser.destructible;
        }
    }
    else {
        destructible |= 32;
        argument = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
        const { token, tokenPos, linePos, colPos } = parser;
        if (token === 1077936157 && token !== closingToken && token !== 18) {
            if (parser.assignable & 2)
                report(parser, 24);
            argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            destructible |= 16;
        }
        else {
            if (token === 18) {
                destructible |= 16;
            }
            else if (token !== closingToken) {
                argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            }
            destructible |=
                parser.assignable & 1 ? 32 : 16;
        }
        parser.destructible = destructible;
        if (parser.token !== closingToken && parser.token !== 18)
            report(parser, 156);
        return finishNode(parser, context, start, line, column, {
            type: isPattern ? 'RestElement' : 'SpreadElement',
            argument: argument
        });
    }
    if (parser.token !== closingToken) {
        if (kind & 1)
            destructible |= isAsync ? 16 : 32;
        if (consumeOpt(parser, context | 32768, 1077936157)) {
            if (destructible & 16)
                report(parser, 24);
            reinterpretToPattern(parser, argument);
            const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            argument = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                ? {
                    type: 'AssignmentPattern',
                    left: argument,
                    right
                }
                : {
                    type: 'AssignmentExpression',
                    left: argument,
                    operator: '=',
                    right
                });
            destructible = 16;
        }
        else {
            destructible |= 16;
        }
    }
    parser.destructible = destructible;
    return finishNode(parser, context, start, line, column, {
        type: isPattern ? 'RestElement' : 'SpreadElement',
        argument: argument
    });
}
export function parseMethodDefinition(parser, context, kind, inGroup, start, line, column) {
    const modifierFlags = (kind & 64) === 0 ? 31981568 : 14680064;
    context =
        ((context | modifierFlags) ^ modifierFlags) |
            ((kind & 88) << 18) |
            100925440;
    let scope = context & 64 ? addChildScope(createScope(), 512) : void 0;
    const params = parseMethodFormals(parser, context | 8388608, scope, kind, 1, inGroup);
    if (scope)
        scope = addChildScope(scope, 128);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192), scope, 0, void 0, void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        params,
        body,
        async: (kind & 16) > 0,
        generator: (kind & 8) > 0,
        id: null
    });
}
function parseObjectLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseObjectLiteralOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 61);
    }
    if (parser.destructible & 8) {
        report(parser, 60);
    }
    return expr;
}
export function parseObjectLiteralOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
    nextToken(parser, context);
    const properties = [];
    let destructible = 0;
    let prototypeCount = 0;
    context = (context | 134217728) ^ 134217728;
    while (parser.token !== 1074790415) {
        const { token, tokenValue, linePos, colPos, tokenPos } = parser;
        if (token === 14) {
            properties.push(parseSpreadOrRestElement(parser, context, scope, 1074790415, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos));
        }
        else {
            let state = 0;
            let key = null;
            let value;
            const t = parser.token;
            if (parser.token & (143360 | 4096) || parser.token === 121) {
                key = parseIdentifier(parser, context, 0);
                if (parser.token === 18 || parser.token === 1074790415 || parser.token === 1077936157) {
                    state |= 4;
                    if (context & 1024 && (token & 537079808) === 537079808) {
                        destructible |= 16;
                    }
                    else {
                        validateBindingIdentifier(parser, context, kind, token, 0);
                    }
                    if (scope)
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    if (consumeOpt(parser, context | 32768, 1077936157)) {
                        destructible |= 8;
                        const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                        destructible |=
                            parser.destructible & 256
                                ? 256
                                : 0 | (parser.destructible & 128)
                                    ? 128
                                    : 0;
                        value = finishNode(parser, context, tokenPos, linePos, colPos, {
                            type: 'AssignmentPattern',
                            left: context & -2147483648 ? Object.assign({}, key) : key,
                            right
                        });
                    }
                    else {
                        destructible |=
                            (token === 209008 ? 128 : 0) |
                                (token === 121 ? 16 : 0);
                        value = context & -2147483648 ? Object.assign({}, key) : key;
                    }
                }
                else if (consumeOpt(parser, context | 32768, 21)) {
                    const { tokenPos, linePos, colPos } = parser;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        const tokenAfterColon = parser.token;
                        const valueAfterColon = parser.tokenValue;
                        destructible |= t === 121 ? 16 : 0;
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                destructible |= parser.destructible & 128 ? 128 : 0;
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope && (tokenAfterColon & 143360) === 143360) {
                                    addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if ((parser.token & 4194304) === 4194304) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                            else if (token !== 1077936157) {
                                destructible |= 32;
                            }
                            else if (scope) {
                                addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                            }
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            if ((parser.token & 8454144) === 8454144) {
                                value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                            }
                            if (consumeOpt(parser, context | 32768, 22)) {
                                value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                            }
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (parser.destructible & 8) {
                            report(parser, 69);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if (parser.token !== 18 && token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    if (token === 209007)
                        state |= 16;
                    state |=
                        (token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1) | 2;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    destructible |= parser.assignable;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token & (143360 | 4096)) {
                    destructible |= 16;
                    if (token === 121)
                        report(parser, 93);
                    if (token === 209007) {
                        if (parser.flags & 1)
                            report(parser, 129);
                        state |= 16;
                    }
                    key = parseIdentifier(parser, context, 0);
                    state |=
                        token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token === 67174411) {
                    destructible |= 16;
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token === 8457014) {
                    destructible |= 16;
                    if (token === 12402) {
                        report(parser, 40);
                    }
                    else if (token === 12403) {
                        report(parser, 41);
                    }
                    else if (token === 143483) {
                        report(parser, 93);
                    }
                    nextToken(parser, context);
                    state |=
                        8 | 1 | (token === 209007 ? 16 : 0);
                    if (parser.token & 143360) {
                        key = parseIdentifier(parser, context, 0);
                    }
                    else if ((parser.token & 134217728) === 134217728) {
                        key = parseLiteral(parser, context);
                    }
                    else if (parser.token === 69271571) {
                        state |= 2;
                        key = parseComputedPropertyName(parser, context, inGroup);
                        destructible |= parser.assignable;
                    }
                    else {
                        report(parser, 28, KeywordDescTable[parser.token & 255]);
                    }
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if ((parser.token & 134217728) === 134217728) {
                    if (token === 209007)
                        state |= 16;
                    state |=
                        token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1;
                    destructible |= 16;
                    key = parseLiteral(parser, context);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 130);
                }
            }
            else if ((parser.token & 134217728) === 134217728) {
                key = parseLiteral(parser, context);
                if (parser.token === 21) {
                    consume(parser, context | 32768, 21);
                    const { tokenPos, linePos, colPos } = parser;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                        const { token, tokenValue: valueAfterColon } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope) {
                                    addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if (parser.token === 1077936157) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else if ((parser.destructible & 8) !== 8) {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            if (parser.token !== 18 && parser.token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    destructible = parser.assignable | 16;
                }
                else {
                    report(parser, 131);
                }
            }
            else if (parser.token === 69271571) {
                key = parseComputedPropertyName(parser, context, inGroup);
                destructible |= parser.destructible & 256 ? 256 : 0;
                state |= 2;
                if (parser.token === 21) {
                    nextToken(parser, context | 32768);
                    const { tokenPos, linePos, colPos, tokenValue, token: tokenAfterColon } = parser;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if ((parser.token & 4194304) === 4194304) {
                            destructible |=
                                parser.assignable & 2
                                    ? 16
                                    : token === 1077936157
                                        ? 0
                                        : 32;
                            value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope && (tokenAfterColon & 143360) === 143360) {
                                    addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (destructible & 8) {
                            report(parser, 60);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible =
                                parser.assignable & 2 ? destructible | 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            if (parser.token !== 18 && parser.token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);
                    destructible = 16;
                }
                else {
                    report(parser, 42);
                }
            }
            else if (token === 8457014) {
                consume(parser, context | 32768, 8457014);
                state |= 8;
                if (parser.token & 143360) {
                    const { token, line, index } = parser;
                    key = parseIdentifier(parser, context, 0);
                    state |= 1;
                    if (parser.token === 67174411) {
                        destructible |= 16;
                        value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    }
                    else {
                        reportMessageAt(index, line, index, token === 209007
                            ? 44
                            : token === 12402 || parser.token === 12403
                                ? 43
                                : 45, KeywordDescTable[token & 255]);
                    }
                }
                else if ((parser.token & 134217728) === 134217728) {
                    destructible |= 16;
                    key = parseLiteral(parser, context);
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    state |= 2 | 1;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 123);
                }
            }
            else {
                report(parser, 28, KeywordDescTable[token & 255]);
            }
            destructible |= parser.destructible & 128 ? 128 : 0;
            parser.destructible = destructible;
            properties.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'Property',
                key: key,
                value,
                kind: !(state & 768) ? 'init' : state & 512 ? 'set' : 'get',
                computed: (state & 2) > 0,
                method: (state & 1) > 0,
                shorthand: (state & 4) > 0
            }));
        }
        destructible |= parser.destructible;
        if (parser.token !== 18)
            break;
        nextToken(parser, context);
    }
    consume(parser, context, 1074790415);
    if (prototypeCount > 1)
        destructible |= 64;
    const node = finishNode(parser, context, start, line, column, {
        type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
        properties
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
export function parseMethodFormals(parser, context, scope, kind, type, inGroup) {
    consume(parser, context, 67174411);
    const params = [];
    parser.flags = (parser.flags | 128) ^ 128;
    if (parser.token === 16) {
        if (kind & 512) {
            report(parser, 35, 'Setter', 'one', '');
        }
        nextToken(parser, context);
        return params;
    }
    if (kind & 256) {
        report(parser, 35, 'Getter', 'no', 's');
    }
    if (kind & 512 && parser.token === 14) {
        report(parser, 36);
    }
    context = (context | 134217728) ^ 134217728;
    let setterArgs = 0;
    let isSimpleParameterList = 0;
    while (parser.token !== 18) {
        let left = null;
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0) {
                if ((parser.token & 36864) === 36864) {
                    parser.flags |= 256;
                }
                if ((parser.token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
            }
            left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 16, type, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
            }
            isSimpleParameterList = 1;
            if (parser.destructible & (32 | 16))
                report(parser, 48);
        }
        if (parser.token === 1077936157) {
            nextToken(parser, context | 32768);
            isSimpleParameterList = 1;
            const right = parseExpression(parser, context, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'AssignmentPattern',
                left: left,
                right
            });
        }
        setterArgs++;
        params.push(left);
        if (!consumeOpt(parser, context, 18))
            break;
        if (parser.token === 16) {
            break;
        }
    }
    if (kind & 512 && setterArgs !== 1) {
        report(parser, 35, 'Setter', 'one', '');
    }
    if (scope && scope.scopeError !== void 0)
        reportScopeError(scope.scopeError);
    if (isSimpleParameterList)
        parser.flags |= 128;
    consume(parser, context, 16);
    return params;
}
export function parseComputedPropertyName(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const key = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 20);
    return key;
}
export function parseParenthesizedExpression(parser, context, canAssign, kind, origin, start, line, column) {
    parser.flags = (parser.flags | 128) ^ 128;
    const { tokenPos: piStart, linePos: plStart, colPos: pcStart } = parser;
    nextToken(parser, context | 32768 | 1073741824);
    const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
    context = (context | 134217728) ^ 134217728;
    if (consumeOpt(parser, context, 16)) {
        return parseParenthesizedArrow(parser, context, scope, [], canAssign, 0, start, line, column);
    }
    let destructible = 0;
    parser.destructible &= ~(256 | 128);
    let expr;
    let expressions = [];
    let isSequence = 0;
    let isSimpleParameterList = 0;
    const { tokenPos: iStart, linePos: lStart, colPos: cStart } = parser;
    parser.assignable = 1;
    while (parser.token !== 16) {
        const { token, tokenPos, linePos, colPos } = parser;
        if (token & (143360 | 4096 | 139)) {
            if (scope)
                addBlockName(parser, context, scope, parser.tokenValue, 1, 0);
            expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
            if (parser.token === 16 || parser.token === 18) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isSimpleParameterList = 1;
                }
                else if ((token & 537079808) === 537079808 ||
                    (token & 36864) === 36864) {
                    isSimpleParameterList = 1;
                }
            }
            else {
                if (parser.token === 1077936157) {
                    isSimpleParameterList = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if ((token & 2097152) === 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
            destructible |= parser.destructible;
            isSimpleParameterList = 1;
            parser.assignable = 2;
            if (parser.token !== 16 && parser.token !== 18) {
                if (destructible & 8)
                    report(parser, 119);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                destructible |= 16;
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 0, 1, 0, tokenPos, linePos, colPos);
            if (parser.destructible & 16)
                report(parser, 72);
            isSimpleParameterList = 1;
            if (isSequence && (parser.token === 16 || parser.token === 18)) {
                expressions.push(expr);
            }
            destructible |= 8;
            break;
        }
        else {
            destructible |= 16;
            expr = parseExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
            if (isSequence && (parser.token === 16 || parser.token === 18)) {
                expressions.push(expr);
            }
            if (parser.token === 18) {
                if (!isSequence) {
                    isSequence = 1;
                    expressions = [expr];
                }
            }
            if (isSequence) {
                while (consumeOpt(parser, context | 32768, 18)) {
                    expressions.push(parseExpression(parser, context, 1, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, iStart, lStart, cStart, {
                    type: 'SequenceExpression',
                    expressions
                });
            }
            consume(parser, context, 16);
            parser.destructible = destructible;
            return expr;
        }
        if (isSequence && (parser.token === 16 || parser.token === 18)) {
            expressions.push(expr);
        }
        if (!consumeOpt(parser, context | 32768, 18))
            break;
        if (!isSequence) {
            isSequence = 1;
            expressions = [expr];
        }
        if (parser.token === 16) {
            destructible |= 8;
            break;
        }
    }
    if (isSequence) {
        parser.assignable = 2;
        expr = finishNode(parser, context, iStart, lStart, cStart, {
            type: 'SequenceExpression',
            expressions
        });
    }
    consume(parser, context, 16);
    if (destructible & 16 && destructible & 8)
        report(parser, 146);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (destructible & (32 | 16))
            report(parser, 47);
        if (context & (4194304 | 2048) && destructible & 128)
            report(parser, 29);
        if (context & (1024 | 2097152) && destructible & 256) {
            report(parser, 30);
        }
        if (isSimpleParameterList)
            parser.flags |= 128;
        return parseParenthesizedArrow(parser, context, scope, isSequence ? expressions : [expr], canAssign, 0, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 140);
    }
    parser.destructible = ((parser.destructible | 256) ^ 256) | destructible;
    return context & 128
        ? finishNode(parser, context, piStart, plStart, pcStart, {
            type: 'ParenthesizedExpression',
            expression: expr
        })
        : expr;
}
export function parseIdentifierOrArrow(parser, context, start, line, column) {
    const { tokenValue } = parser;
    const expr = parseIdentifier(parser, context, 0);
    parser.assignable = 1;
    if (parser.token === 10) {
        let scope = void 0;
        if (context & 64)
            scope = createArrowHeadParsingScope(parser, context, tokenValue);
        parser.flags = (parser.flags | 128) ^ 128;
        return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    return expr;
}
function parseArrowFromIdentifier(parser, context, value, expr, inNew, canAssign, isAsync, start, line, column) {
    if (!canAssign)
        report(parser, 55);
    if (inNew)
        report(parser, 49);
    parser.flags &= ~128;
    const scope = context & 64 ? createArrowHeadParsingScope(parser, context, value) : void 0;
    return parseArrowFunctionExpression(parser, context, scope, [expr], isAsync, start, line, column);
}
function parseParenthesizedArrow(parser, context, scope, params, canAssign, isAsync, start, line, column) {
    if (!canAssign)
        report(parser, 55);
    for (let i = 0; i < params.length; ++i)
        reinterpretToPattern(parser, params[i]);
    return parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column);
}
export function parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column) {
    console.log("anas");
    if (parser.flags & 1)
        report(parser, 46);
    consume(parser, context | 32768, 10);
    context = ((context | 15728640) ^ 15728640) | (isAsync << 22);
    const expression = parser.token !== 2162700;
    let body;
    if (scope && scope.scopeError !== void 0) {
        reportScopeError(scope.scopeError);
    }
    if (expression) {
        body = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    }
    else {
        if (scope)
            scope = addChildScope(scope, 128);
        body = parseFunctionBody(parser, (context | 134221824 | 8192 | 16384) ^
            (134221824 | 8192 | 16384), scope, 16, void 0, void 0);
        switch (parser.token) {
            case 69271571:
                if ((parser.flags & 1) === 0) {
                    report(parser, 113);
                }
                break;
            case 67108877:
            case 67174409:
            case 22:
                report(parser, 114);
            case 67174411:
                if ((parser.flags & 1) === 0) {
                    report(parser, 113);
                }
                parser.flags |= 1024;
                break;
            default:
        }
        if ((parser.token & 8454144) === 8454144 && (parser.flags & 1) === 0)
            report(parser, 28, KeywordDescTable[parser.token & 255]);
        if ((parser.token & 33619968) === 33619968)
            report(parser, 122);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ArrowFunctionExpression',
        params,
        body,
        async: isAsync === 1,
        expression
    });
}
export function parseFormalParametersOrFormalList(parser, context, scope, inGroup, kind) {
    consume(parser, context, 67174411);
    parser.flags = (parser.flags | 128) ^ 128;
    const params = [];
    if (consumeOpt(parser, context, 16))
        return params;
    context = (context | 134217728) ^ 134217728;
    let isSimpleParameterList = 0;
    while (parser.token !== 18) {
        let left;
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0) {
                if ((parser.token & 36864) === 36864) {
                    parser.flags |= 256;
                }
                if ((parser.token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
            }
            left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 16, kind, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
            }
            else if (parser.token === 139) {
                left = parseGeneral(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
            }
            else {
                report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
            isSimpleParameterList = 1;
            if (parser.destructible & (32 | 16)) {
                report(parser, 48);
            }
        }
        if (parser.token === 1077936157) {
            nextToken(parser, context | 32768);
            isSimpleParameterList = 1;
            const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'AssignmentPattern',
                left,
                right
            });
        }
        params.push(left);
        if (!consumeOpt(parser, context, 18))
            break;
        if (parser.token === 16) {
            break;
        }
    }
    if (isSimpleParameterList)
        parser.flags |= 128;
    if (scope && (isSimpleParameterList || context & 1024) && scope.scopeError !== void 0) {
        reportScopeError(scope.scopeError);
    }
    consume(parser, context, 16);
    return params;
}
export function parseMembeExpressionNoCall(parser, context, expr, inGroup, start, line, column) {
    const { token } = parser;
    if (token & 67108864) {
        if (token === 67108877) {
            nextToken(parser, context | 1073741824);
            parser.assignable = 1;
            const property = parsePropertyOrPrivatePropertyName(parser, context);
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: false,
                property
            }), 0, start, line, column);
        }
        else if (token === 69271571) {
            nextToken(parser, context | 32768);
            const { tokenPos, linePos, colPos } = parser;
            const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
            consume(parser, context, 20);
            parser.assignable = 1;
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: true,
                property
            }), 0, start, line, column);
        }
        else if (token === 67174408 || token === 67174409) {
            parser.assignable = 2;
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'TaggedTemplateExpression',
                tag: expr,
                quasi: parser.token === 67174408
                    ? parseTemplate(parser, context | 65536)
                    : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
            }), 0, start, line, column);
        }
    }
    return expr;
}
export function parseNewExpression(parser, context, inGroup, start, line, column) {
    const id = parseIdentifier(parser, context | 32768, 0);
    const { tokenPos, linePos, colPos } = parser;
    if (consumeOpt(parser, context, 67108877)) {
        if (context & 67108864 && parser.token === 143494) {
            parser.assignable = 2;
            return parseMetaProperty(parser, context, id, start, line, column);
        }
        report(parser, 92);
    }
    parser.assignable = 2;
    if ((parser.token & 16842752) === 16842752) {
        report(parser, 63, KeywordDescTable[parser.token & 255]);
    }
    const expr = parsePrimaryExpression(parser, context, 2, 1, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
    context = (context | 134217728) ^ 134217728;
    if (parser.token === 67108991)
        report(parser, 163);
    const callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'NewExpression',
        callee,
        arguments: parser.token === 67174411 ? parseArguments(parser, context, inGroup) : []
    });
}
export function parseMetaProperty(parser, context, meta, start, line, column) {
    const property = parseIdentifier(parser, context, 0);
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property
    });
}
function parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column) {
    if (parser.token === 209008)
        report(parser, 29);
    if (context & (1024 | 2097152) && parser.token === 241773) {
        report(parser, 30);
    }
    if ((parser.token & 537079808) === 537079808) {
        parser.flags |= 512;
    }
    return parseArrowFromIdentifier(parser, context, parser.tokenValue, parseIdentifier(parser, context, 0), 0, canAssign, 1, start, line, column);
}
export function parseAsyncArrowOrCallExpression(parser, context, callee, canAssign, kind, origin, flags, start, line, column) {
    nextToken(parser, context | 32768);
    const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
    context = (context | 134217728) ^ 134217728;
    if (consumeOpt(parser, context, 16)) {
        if (parser.token === 10) {
            if (flags & 1)
                report(parser, 46);
            return parseParenthesizedArrow(parser, context, scope, [], canAssign, 1, start, line, column);
        }
        return finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee,
            arguments: []
        });
    }
    let destructible = 0;
    let expr = null;
    let isSimpleParameterList = 0;
    parser.destructible =
        (parser.destructible | 256 | 128) ^
            (256 | 128);
    const params = [];
    while (parser.token !== 16) {
        const { token, tokenPos, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (scope)
                addBlockName(parser, context, scope, parser.tokenValue, kind, 0);
            expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
            if (parser.token === 16 || parser.token === 18) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isSimpleParameterList = 1;
                }
                else if ((token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
                else if ((token & 36864) === 36864) {
                    parser.flags |= 256;
                }
            }
            else {
                if (parser.token === 1077936157) {
                    isSimpleParameterList = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if (token & 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
            destructible |= parser.destructible;
            isSimpleParameterList = 1;
            if (parser.token !== 16 && parser.token !== 18) {
                if (destructible & 8)
                    report(parser, 119);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                destructible |= 16;
                if ((parser.token & 8454144) === 8454144) {
                    expr = parseBinaryExpression(parser, context, 1, start, line, column, 4, token, expr);
                }
                if (consumeOpt(parser, context | 32768, 22)) {
                    expr = parseConditionalExpression(parser, context, expr, start, line, column);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 1, 1, 0, tokenPos, linePos, colPos);
            destructible |= (parser.token === 16 ? 0 : 16) | parser.destructible;
            isSimpleParameterList = 1;
        }
        else {
            expr = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
            destructible = parser.assignable;
            params.push(expr);
            while (consumeOpt(parser, context | 32768, 18)) {
                params.push(parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos));
            }
            destructible |= parser.assignable;
            consume(parser, context, 16);
            parser.destructible = destructible | 16;
            parser.assignable = 2;
            return finishNode(parser, context, start, line, column, {
                type: 'CallExpression',
                callee,
                arguments: params
            });
        }
        params.push(expr);
        if (!consumeOpt(parser, context | 32768, 18))
            break;
    }
    consume(parser, context, 16);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (destructible & (32 | 16))
            report(parser, 25);
        if (parser.flags & 1 || flags & 1)
            report(parser, 46);
        if (destructible & 128)
            report(parser, 29);
        if (context & (1024 | 2097152) && destructible & 256)
            report(parser, 30);
        if (isSimpleParameterList)
            parser.flags |= 128;
        return parseParenthesizedArrow(parser, context, scope, params, canAssign, 1, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 60);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'CallExpression',
        callee,
        arguments: params
    });
}
export function parseRegExpLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenRegExp, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return context & 512
        ? finishNode(parser, context, start, line, column, {
            type: 'Literal',
            value: tokenValue,
            regex: tokenRegExp,
            raw: tokenRaw
        })
        : finishNode(parser, context, start, line, column, {
            type: 'Literal',
            value: tokenValue,
            regex: tokenRegExp
        });
}
export function parseClassDeclaration(parser, context, scope, flags, start, line, column) {
    context = (context | 16777216 | 1024) ^ 16777216;
    let decorators = parseDecorators(parser, context);
    if (decorators.length) {
        start = parser.tokenPos;
        line = parser.linePos;
        column = parser.colPos;
    }
    if (parser.leadingDecorators.length) {
        parser.leadingDecorators.push(...decorators);
        decorators = parser.leadingDecorators;
        parser.leadingDecorators = [];
    }
    nextToken(parser, context);
    let id = null;
    let superClass = null;
    const { tokenValue } = parser;
    if (parser.token & 4096 && parser.token !== 20567) {
        if (isStrictReservedWord(parser, context, parser.token)) {
            report(parser, 115);
        }
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 116);
        }
        if (scope) {
            addBlockName(parser, context, scope, tokenValue, 32, 0);
            if (flags) {
                if (flags & 2) {
                    declareUnboundVariable(parser, tokenValue);
                }
            }
        }
        id = parseIdentifier(parser, context, 0);
    }
    else {
        if ((flags & 1) === 0)
            report(parser, 37, 'Class');
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20567)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, scope, 2, 8, 0);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'ClassDeclaration',
            id,
            superClass,
            decorators,
            body
        }
        : {
            type: 'ClassDeclaration',
            id,
            superClass,
            body
        });
}
export function parseClassExpression(parser, context, inGroup, start, line, column) {
    let id = null;
    let superClass = null;
    context = (context | 1024 | 16777216) ^ 16777216;
    const decorators = parseDecorators(parser, context);
    if (decorators.length) {
        start = parser.tokenPos;
        line = parser.linePos;
        column = parser.colPos;
    }
    nextToken(parser, context);
    if (parser.token & 4096 && parser.token !== 20567) {
        if (isStrictReservedWord(parser, context, parser.token))
            report(parser, 115);
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 116);
        }
        id = parseIdentifier(parser, context, 0);
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20567)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, inGroup, 0, parser.tokenPos, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, void 0, 2, 0, inGroup);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'ClassExpression',
            id,
            superClass,
            decorators,
            body
        }
        : {
            type: 'ClassExpression',
            id,
            superClass,
            body
        });
}
export function parseDecorators(parser, context) {
    const list = [];
    if (context & 1) {
        while (parser.token === 133) {
            list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
        }
    }
    return list;
}
export function parseDecoratorList(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    let expression = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, start, line, column);
    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'Decorator',
        expression
    });
}
export function parseClassBody(parser, context, inheritedContext, scope, kind, origin, inGroup) {
    const { tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    context = (context | 134217728) ^ 134217728;
    let hasConstr = parser.flags & 32;
    parser.flags = (parser.flags | 32) ^ 32;
    const body = [];
    let decorators;
    while (parser.token !== 1074790415) {
        let length = 0;
        decorators = parseDecorators(parser, context);
        length = decorators.length;
        if (length > 0 && parser.tokenValue === 'constructor') {
            report(parser, 107);
        }
        if (parser.token === 1074790415)
            report(parser, 106);
        if (consumeOpt(parser, context, 1074790417)) {
            if (length > 0)
                report(parser, 117);
            continue;
        }
        body.push(parseClassElementList(parser, context, scope, inheritedContext, kind, decorators, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    consume(parser, origin & 8 ? context | 32768 : context, 1074790415);
    parser.flags = (parser.flags & ~32) | hasConstr;
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ClassBody',
        body
    });
}
function parseClassElementList(parser, context, scope, inheritedContext, type, decorators, isStatic, inGroup, start, line, column) {
    let kind = isStatic ? 32 : 0;
    let key = null;
    const { token, tokenPos, linePos, colPos } = parser;
    if (token & (143360 | 36864)) {
        key = parseIdentifier(parser, context, 0);
        switch (token) {
            case 36972:
                if (!isStatic &&
                    parser.token !== 67174411 &&
                    (parser.token & 1048576) !== 1048576 &&
                    parser.token !== 1077936157) {
                    return parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 1, inGroup, start, line, column);
                }
                break;
            case 209007:
                if (parser.token !== 67174411 && (parser.flags & 1) === 0) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 16 | (optionalBit(parser, context, 8457014) ? 8 : 0);
                }
                break;
            case 12402:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 256;
                }
                break;
            case 12403:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 512;
                }
                break;
            default:
        }
    }
    else if (token === 69271571) {
        kind |= 2;
        key = parseComputedPropertyName(parser, inheritedContext, inGroup);
    }
    else if ((token & 134217728) === 134217728) {
        key = parseLiteral(parser, context);
    }
    else if (token === 8457014) {
        kind |= 8;
        nextToken(parser, context);
    }
    else if (context & 1 && parser.token === 131) {
        kind |= 4096;
        key = parsePrivateIdentifier(parser, context | 16384, tokenPos, linePos, colPos);
    }
    else if (context & 1 && (parser.token & 1073741824) === 1073741824) {
        kind |= 128;
    }
    else if (isStatic && token === 2162700) {
        return parseStaticBlock(parser, context, scope, tokenPos, linePos, colPos);
    }
    else if (token === 122) {
        key = parseIdentifier(parser, context, 0);
        if (parser.token !== 67174411)
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    else {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    if (kind & (8 | 16 | 768)) {
        if (parser.token & 143360) {
            key = parseIdentifier(parser, context, 0);
        }
        else if ((parser.token & 134217728) === 134217728) {
            key = parseLiteral(parser, context);
        }
        else if (parser.token === 69271571) {
            kind |= 2;
            key = parseComputedPropertyName(parser, context, 0);
        }
        else if (parser.token === 122) {
            key = parseIdentifier(parser, context, 0);
        }
        else if (context & 1 && parser.token === 131) {
            kind |= 4096;
            key = parsePrivateIdentifier(parser, context, tokenPos, linePos, colPos);
        }
        else
            report(parser, 132);
    }
    if ((kind & 2) === 0) {
        if (parser.tokenValue === 'constructor') {
            if ((parser.token & 1073741824) === 1073741824) {
                report(parser, 126);
            }
            else if ((kind & 32) === 0 && parser.token === 67174411) {
                if (kind & (768 | 16 | 128 | 8)) {
                    report(parser, 51, 'accessor');
                }
                else if ((context & 524288) === 0) {
                    if (parser.flags & 32)
                        report(parser, 52);
                    else
                        parser.flags |= 32;
                }
            }
            kind |= 64;
        }
        else if ((kind & 4096) === 0 &&
            kind & (32 | 768 | 8 | 16) &&
            parser.tokenValue === 'prototype') {
            report(parser, 50);
        }
    }
    if (context & 1 && parser.token !== 67174411) {
        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
    }
    const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'MethodDefinition',
            kind: (kind & 32) === 0 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            decorators,
            value
        }
        : {
            type: 'MethodDefinition',
            kind: (kind & 32) === 0 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            value
        });
}
function parsePrivateIdentifier(parser, context, start, line, column) {
    nextToken(parser, context);
    const { tokenValue } = parser;
    if (tokenValue === 'constructor')
        report(parser, 125);
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'PrivateIdentifier',
        name: tokenValue
    });
}
export function parsePropertyDefinition(parser, context, key, state, decorators, start, line, column) {
    let value = null;
    if (state & 8)
        report(parser, 0);
    if (parser.token === 1077936157) {
        nextToken(parser, context | 32768);
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token === 537079928)
            report(parser, 116);
        value = parsePrimaryExpression(parser, context | 16384, 2, 0, 1, 0, 0, 1, tokenPos, linePos, colPos);
        if ((parser.token & 1073741824) !== 1073741824 ||
            (parser.token & 4194304) === 4194304) {
            value = parseMemberOrUpdateExpression(parser, context | 16384, value, 0, 0, tokenPos, linePos, colPos);
            value = parseAssignmentExpression(parser, context | 16384, 0, 0, tokenPos, linePos, colPos, value);
            if (parser.token === 18) {
                value = parseSequenceExpression(parser, context, 0, start, line, column, value);
            }
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'PropertyDefinition',
        key,
        value,
        static: (state & 32) > 0,
        computed: (state & 2) > 0,
        decorators
    });
}
export function parseBindingPattern(parser, context, scope, type, origin, start, line, column) {
    if (parser.token & 143360)
        return parseAndClassifyIdentifier(parser, context, scope, type, origin, start, line, column);
    if (parser.token === 139) {
        return parseGeneral(parser, context, start, line, column);
    }
    if ((parser.token & 2097152) !== 2097152)
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    const left = parser.token === 69271571
        ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column)
        : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column);
    if (parser.destructible & 16)
        report(parser, 48);
    if (parser.destructible & 32)
        report(parser, 48);
    return left;
}
function parseAndClassifyIdentifier(parser, context, scope, kind, origin, start, line, column) {
    const { tokenValue, token } = parser;
    if (context & 1024) {
        if ((token & 537079808) === 537079808) {
            report(parser, 116);
        }
        else if ((token & 36864) === 36864) {
            report(parser, 115);
        }
    }
    if ((token & 20480) === 20480) {
        report(parser, 100);
    }
    if (context & (2048 | 2097152) && token === 241773) {
        report(parser, 30);
    }
    if (token === 241739) {
        if (kind & (8 | 16))
            report(parser, 98);
    }
    if (context & (4194304 | 2048) && token === 209008) {
        report(parser, 96);
    }
    nextToken(parser, context);
    if (scope)
        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
    return finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: tokenValue
    });
}
function parseJSXRootElementOrFragment(parser, context, inJSXChild, start, line, column) {
    nextToken(parser, context);
    if (parser.token === 8456259) {
        return finishNode(parser, context, start, line, column, {
            type: 'JSXFragment',
            openingFragment: parseOpeningFragment(parser, context, start, line, column),
            children: parseJSXChildren(parser, context),
            closingFragment: parseJSXClosingFragment(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos)
        });
    }
    let closingElement = null;
    let children = [];
    const openingElement = parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column);
    if (!openingElement.selfClosing) {
        children = parseJSXChildren(parser, context);
        closingElement = parseJSXClosingElement(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos);
        const close = isEqualTagName(closingElement.name);
        if (isEqualTagName(openingElement.name) !== close)
            report(parser, 150, close);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXElement',
        children,
        openingElement,
        closingElement
    });
}
export function parseOpeningFragment(parser, context, start, line, column) {
    scanJSXToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXOpeningFragment'
    });
}
function parseJSXClosingElement(parser, context, inJSXChild, start, line, column) {
    consume(parser, context, 25);
    const name = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    if (inJSXChild) {
        consume(parser, context, 8456259);
    }
    else {
        parser.token = scanJSXToken(parser, context);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXClosingElement',
        name
    });
}
export function parseJSXClosingFragment(parser, context, inJSXChild, start, line, column) {
    consume(parser, context, 25);
    if (inJSXChild) {
        consume(parser, context, 8456259);
    }
    else {
        consume(parser, context, 8456259);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXClosingFragment'
    });
}
export function parseJSXChildren(parser, context) {
    const children = [];
    while (parser.token !== 25) {
        parser.index = parser.tokenPos = parser.startPos;
        parser.column = parser.colPos = parser.startColumn;
        parser.line = parser.linePos = parser.startLine;
        scanJSXToken(parser, context);
        children.push(parseJSXChild(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return children;
}
function parseJSXChild(parser, context, start, line, column) {
    if (parser.token === 138)
        return parseJSXText(parser, context, start, line, column);
    if (parser.token === 2162700)
        return parseJSXExpressionContainer(parser, context, 0, 0, start, line, column);
    if (parser.token === 8456258)
        return parseJSXRootElementOrFragment(parser, context, 0, start, line, column);
    report(parser, 0);
}
export function parseJSXText(parser, context, start, line, column) {
    scanJSXToken(parser, context);
    const node = {
        type: 'JSXText',
        value: parser.tokenValue
    };
    if (context & 512) {
        node.raw = parser.tokenRaw;
    }
    return finishNode(parser, context, start, line, column, node);
}
function parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column) {
    if ((parser.token & 143360) !== 143360 && (parser.token & 4096) !== 4096)
        report(parser, 0);
    const tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    const attributes = parseJSXAttributes(parser, context);
    const selfClosing = parser.token === 8457016;
    if (parser.token === 8456259) {
        scanJSXToken(parser, context);
    }
    else {
        consume(parser, context, 8457016);
        if (inJSXChild) {
            consume(parser, context, 8456259);
        }
        else {
            scanJSXToken(parser, context);
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXOpeningElement',
        name: tagName,
        attributes,
        selfClosing
    });
}
function parseJSXElementName(parser, context, start, line, column) {
    scanJSXIdentifier(parser);
    let key = parseJSXIdentifier(parser, context, start, line, column);
    if (parser.token === 21)
        return parseJSXNamespacedName(parser, context, key, start, line, column);
    while (consumeOpt(parser, context, 67108877)) {
        scanJSXIdentifier(parser);
        key = parseJSXMemberExpression(parser, context, key, start, line, column);
    }
    return key;
}
export function parseJSXMemberExpression(parser, context, object, start, line, column) {
    const property = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXMemberExpression',
        object,
        property
    });
}
export function parseJSXAttributes(parser, context) {
    const attributes = [];
    while (parser.token !== 8457016 && parser.token !== 8456259 && parser.token !== 1048576) {
        attributes.push(parseJsxAttribute(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return attributes;
}
export function parseJSXSpreadAttribute(parser, context, start, line, column) {
    nextToken(parser, context);
    consume(parser, context, 14);
    const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXSpreadAttribute',
        argument: expression
    });
}
function parseJsxAttribute(parser, context, start, line, column) {
    if (parser.token === 2162700)
        return parseJSXSpreadAttribute(parser, context, start, line, column);
    scanJSXIdentifier(parser);
    let value = null;
    let name = parseJSXIdentifier(parser, context, start, line, column);
    if (parser.token === 21) {
        name = parseJSXNamespacedName(parser, context, name, start, line, column);
    }
    if (parser.token === 1077936157) {
        const token = scanJSXAttributeValue(parser, context);
        const { tokenPos, linePos, colPos } = parser;
        switch (token) {
            case 134283267:
                value = parseLiteral(parser, context);
                break;
            case 8456258:
                value = parseJSXRootElementOrFragment(parser, context, 1, tokenPos, linePos, colPos);
                break;
            case 2162700:
                value = parseJSXExpressionContainer(parser, context, 1, 1, tokenPos, linePos, colPos);
                break;
            default:
                report(parser, 149);
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXAttribute',
        value,
        name
    });
}
function parseJSXNamespacedName(parser, context, namespace, start, line, column) {
    consume(parser, context, 21);
    const name = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXNamespacedName',
        namespace,
        name
    });
}
function parseJSXExpressionContainer(parser, context, inJSXChild, isAttr, start, line, column) {
    nextToken(parser, context | 32768);
    const { tokenPos, linePos, colPos } = parser;
    if (parser.token === 14)
        return parseJSXSpreadChild(parser, context, start, line, column);
    let expression = null;
    if (parser.token === 1074790415) {
        if (isAttr)
            report(parser, 152);
        expression = parseJSXEmptyExpression(parser, context, parser.startPos, parser.startLine, parser.startColumn);
    }
    else {
        expression = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
    }
    if (inJSXChild) {
        consume(parser, context, 1074790415);
    }
    else {
        scanJSXToken(parser, context);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXExpressionContainer',
        expression
    });
}
function parseJSXSpreadChild(parser, context, start, line, column) {
    consume(parser, context, 14);
    const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXSpreadChild',
        expression
    });
}
function parseJSXEmptyExpression(parser, context, start, line, column) {
    parser.startPos = parser.tokenPos;
    parser.startLine = parser.linePos;
    parser.startColumn = parser.colPos;
    return finishNode(parser, context, start, line, column, {
        type: 'JSXEmptyExpression'
    });
}
export function parseJSXIdentifier(parser, context, start, line, column) {
    const { tokenValue } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXIdentifier',
        name: tokenValue
    });
}
function parseGeneral(parser, context, start, line, column) {
    const { tokenValue } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: "General",
    });
}
//# sourceMappingURL=parser.js.map