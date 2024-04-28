import expression from "./definitions/expression"
import leftHandSideExpression from "./definitions/leftHandSideExpression"
import primaryExpression from './definitions/primaryExpression'
import literalExpression from './definitions/literalExpression'
import statement from './definitions/statement'
import restElement from './definitions/restElement'
import spreadArgument from "./definitions/spreadArgument"
import variableDeclaratorId from "./definitions/variableDeclaratorId"
import property from "./definitions/property"
import { argumentsIncludesGeneral, clearMeta, noOfnotGeneralArgs, statementsIncludesGeneral } from "./helpers"
function matchVariableDeclaration(targetedNode, node, metaVariables, childs) {

    // type
    if (targetedNode.type !== node.type) {
        return false
    }
    // Kind Checking
    if (node.kind !== targetedNode.kind) {
        return false
    }

    // Declarations Checking
    if (targetedNode.declarations.length > node.declarations.length) { // yoyo
        return false
    }
    childs.declarations = []
    for (let targetedVariableDeclarator of targetedNode.declarations) {
        let variableDeclaratorFound = false
        for (let nodeVariableDeclarator of node.declarations) {
            variableDeclaratorFound = matchVariableDeclarator(targetedVariableDeclarator, nodeVariableDeclarator, metaVariables, childs)
            break;
        }
        if (!variableDeclaratorFound) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    return true
}
function matchVariableDeclarator(targetedNode, node, metaVariables, childs) {
    // id Type Checking
    if (targetedNode.id.type === "General") {
        return true
    }
    if (targetedNode.id.type !== node.id.type) {
        return false
    }
    // id Checking
    childs.id = {}
    switch (variableDeclaratorId[targetedNode.id.type]) {
        case 'Identifier':
            if (!matchIdentifier(targetedNode.id, node.id, metaVariables, childs.id)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'Expression':
            if (!matchExpression(targetedNode.id, node.id, metaVariables, childs.id)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'BindingPattern':
            if (!matchBindingPattern(targetedNode.id, node.id, metaVariables, childs.id)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        // TODO Binding Patterns
    }
    // init Type Checking
    if (targetedNode.init && !node.init) {
        return false
    }
    if (targetedNode.init && node.init) {
        if (!matchExpression(targetedNode.init, node.init, metaVariables, childs)) {
            return false
        }
    }
    return true
}
function matchIdentifier(targetedNode, node, metaVariables, childs) {
    if (targetedNode.name.startsWith('$')) {
        if (metaVariables[targetedNode.name]) {
            if (metaVariables[targetedNode.name] === node.name) {
                return true
            }
            return false
        } else {
            let found = false
            for (let key in metaVariables) {
                if (metaVariables[key] === node.name) {
                    found = true
                }
            }
            if (!found) {
                metaVariables[targetedNode.name] = node.name
                childs[targetedNode.name] = node.name
                return true
            } else {
                return false
            }
        }
    }
    return targetedNode.name === node.name
}
function matchArrowFunctionExpression(targetedNode, node, metaVariables, childs) {
    if (targetedNode.expression !== node.expression) {
        return false
    }
    if (targetedNode.async !== node.async) {
        return false
    }
    // Params
    childs.parameters = []
    if (!matchParameters(targetedNode.params, node.params, metaVariables, childs.parameters)) {
        return false
    }
    // Body
    childs.body = {}
    if (targetedNode.body.type == "General" && node.body.type !== "BlockStatement") {
        return true
    }
    if (targetedNode.body.type !== node.body.type) {
        return false
    }

    if (targetedNode.body.type === 'BlockStatement') {
        if (!matchBlockStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
            clearMeta(childs, metaVariables)
            return false
        }
    } else {
        if (!matchExpression(targetedNode.body, node.body, metaVariables, childs.body)) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    return true
}
function matchParameters(targetedParams, nodeParams, metaVariables, childs) {
    // this child is array
    if (argumentsIncludesGeneral(targetedParams)) { // GENERAL CASE
        if (noOfnotGeneralArgs(targetedParams) > nodeParams.length) {
            return false
        }
        let targetedParamIndex = 0, nodeParamIndex = 0
        let found = 0
        while (nodeParamIndex < nodeParams.length) {
            const targetedParam = targetedParams[targetedParamIndex]
            const nodeParam = nodeParams[nodeParamIndex]
            if (targetedParam?.type === "General") { // 1G, 1NG
                const nextTargetedParam = targetedParams[targetedParamIndex + 1]
                if (!nextTargetedParam) {
                    break;
                }
                if (nextTargetedParam.type === "General") {
                    targetedParamIndex++;
                    continue
                }
                // matching
                const child = {}
                childs.push(child)
                if (!matchParameter(nextTargetedParam, nodeParam, metaVariables, child)) {
                    nodeParamIndex++;
                    continue
                }
                found++;
                nodeParamIndex++;
                targetedParamIndex += 2;
            } else { // 2NG
                if (!targetedParam) {
                    return false
                }
                const child = {}
                childs.push(child)
                if (!matchParameter(targetedParam, nodeParam, metaVariables, child)) {
                    clearMeta(childs, metaVariables)
                    return false
                }
                found++;
                nodeParamIndex++;
                targetedParamIndex++;
            }
        }
        return found === noOfnotGeneralArgs(targetedParams)
    } else { // NORMAL CASE (NO GENERAL)
        if (targetedParams.length > nodeParams.length) {
            return false
        }
        for (let index in targetedParams) {
            const child = {}
            childs.push(child)
            if (!matchParameter(targetedParams[index], nodeParams[index], metaVariables, child)) {
                clearMeta(childs, metaVariables)
                return false
            }
        }
    }
    return true
}
function matchBlockStatement(targetedNode, node, metaVariables, childs) {
    if (!matchBlockStatementBase(targetedNode, node, metaVariables, childs)) {
        return false
    }
    return true;
}

function matchBreakStatement(targetedNode, node, metaVariables, childs) {
    if (targetedNode.label && node.label) {
        if (targetedNode.label.type !== node.label.type) {
            return false
        }
        switch (targetedNode.label.type) {
            case 'Identifier':
                if (!matchIdentifier(targetedNode.label, node.label, metaVariables, childs)) {
                    return false
                }
                break;
        }
    }
    return true
}
function matchContinueStatement(targetedNode, node, metaVariables, childs) {
    if (targetedNode.label && node.label) {
        if (targetedNode.label !== node.label) {
            return false
        }
        childs.label = {}
        switch (targetedNode.label) {
            case "Identifier":
                if (!matchIdentifier(targetedNode.label, node.label, metaVariables, childs.label)) {
                    return false
                }
                break;
        }
    } else {
        if (targetedNode.label) {
            return false
        }
    }
    return true
}

function matchDebuggerStatement(targetedNode, node, metaVariables, childs) {
    return true
}

function matchEmptyStatement(targetedNode, node, metaVariables, childs) {
    return true
}

function matchExpressionStatement(targetedNode, node, metaVariables, childs) {
    childs.expression = {}
    if (!matchExpression(targetedNode.expression, node.expression, metaVariables, childs.expression)) {
        return false
    }
    return true
}

function matchIfStatement(targetedNode, node, metaVariables, childs) {
    // test
    if (!matchExpression(targetedNode.test, node.test, metaVariables, childs)) {
        return false
    }
    // consquent
    if (!matchStatement(targetedNode.consequent, node.consequent, metaVariables, childs)) {
        return false
    }
    // alternate
    if (targetedNode.alternate && !node.alternate) {
        return false
    }
    if (targetedNode.alternate && node.alternate) {
        if (!matchStatement(targetedNode.alternate, node.alternate, metaVariables, childs)) {
            return false
        }
    }
    return true
}

function matchImportDeclaration(targetedNode, node, metaVariables, childs) {
    return true
}

function matchLabeledStatement(targetedNode, node, metaVariables, childs) {
    //label
    childs.label = {}
    switch (targetedNode.label.type) {
        case "Identifier":
            if (!matchIdentifier(targetedNode.label, node.label, metaVariables, childs.label)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
    }
    childs.body = {}
    //body
    if (!matchStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}

function matchReturnStatement(targetedNode, node, metaVariables, childs) {
    childs.argument = {}
    if (targetedNode.argument && node.argument) {
        if (!matchExpression(targetedNode.argument, node.argument, metaVariables, childs.argument)) {
            clearMeta(childs, metaVariables)
            return false
        }
    } else {
        if (targetedNode.argument) {
            clearMeta(childs, metaVariables)
            return false
        }
    }

    return true
}
function matchSwitchCase(targetedNode, node, metaVariables, childs) {
    //test
    childs.test = {}
    if (targetedNode.test && node.test) {
        if (!matchExpression(targetedNode.test, node.test, metaVariables, childs.test)) {
            clearMeta(childs, metaVariables)
            return false
        }
    } else {
        if (targetedNode.test || node.test) {
            return false
        }
    }
    //consequent
    childs.consequent = {}
    if (!matchStatement(targetedNode.consequent, node.consequent, metaVariables, childs.consequent)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}
function matchSwitchStatement(targetedNode, node, metaVariables, childs) {
    //discriminant
    childs.discriminant = {}
    if (!matchExpression(targetedNode.discriminant, node.discriminant, metaVariables, childs.discriminant)) {
        clearMeta(childs, metaVariables)
        return false
    }
    //cases
    childs.cases = []
    for (let targetedCase of targetedNode.cases) {
        let found = false
        for (let nodeCase of node.cases) {
            const child = {}
            childs.cases.push(child)
            if (matchSwitchCase(targetedCase, nodeCase, metaVariables, child)) {
                found = true
            } else {
                clearMeta(child, metaVariables)
            }
        }
        if (!found) {
            return false
        }
    }
    return true
}
function matchThrowStatement(targetedNode, node, metaVariables, childs) {
    //argument
    childs.argument = {}
    if (!matchExpression(targetedNode.argument, node.argument, metaVariables, childs.argument)) {
        clearMeta(childs, metaVariables)
        return false

    }
    return true
}

function matchTryStatement(targetedNode, node, metaVariables, childs) {
    // block
    childs.block = {}
    if (!matchBlockStatement(targetedNode.block, node.block, metaVariables, childs)) {
        clearMeta(childs, metaVariables)
        return false
    }
    //handler
    childs.handler = {}
    if (targetedNode.handler && node.handler) {
        if (!matchCatchClause(targetedNode.handler, node.handler, metaVariables, childs)) {
            clearMeta(childs, metaVariables)
            return false
        }
    } else {
        if (targetedNode.handler) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    // finalizer
    childs.finalizer = {}
    if (targetedNode.finalizer && node.finalizer) {
        if (!matchBlockStatement(targetedNode.finalizer, node.finalizer, metaVariables, childs.finalizer)) {
            clearMeta(childs, metaVariables)
            return false
        }
    } else {
        if (targetedNode.finalizer) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    return true
}

function matchCatchClause(targetedNode, node, metaVariables, childs) {

    // body
    childs.body = {}
    if (!matchBlockStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
        return false
    }

    // param
    if (targetedNode.param && node.param) {
        if (targetedNode.param.type === "General") {
            return true
        }
        if (targetedNode.param.type !== node.param.type) {
            return false
        }
        childs.param = {}
        switch (targetedNode.param) {
            case 'Identifier':
                if (!matchIdentifier(targetedNode.param, node.param, metaVariables, childs.param)) {
                    clearMeta(childs, metaVariables)
                    return false
                }
                break;
            default: // Binding Pattern
                if (!matchBindingPattern(targetedNode.param, node.param, metaVariables, childs.param)) {
                    clearMeta(childs, metaVariables)
                    return false
                }
                break
        }
    } else {
        if (targetedNode.param) {
            return false
        }
    }
    return true
}

function matchWithStatement(targetedNode, node, metaVariables, childs) {
    return true
}

function matchExportDefaultDeclaration(targetedNode, node, metaVariables, childs) {
    return true
}

function matchExportAllDeclaration(targetedNode, node, metaVariables, childs) {
    return true
}

function matchExportNamedDeclaration(targetedNode, node, metaVariables, childs) {
    return true
}

function matchFunctionDeclaration(targetedNode, node, metaVariables, childs) {
    if (!matchFunctionDeclarationBase(targetedNode, node, metaVariables, childs)) {
        return false
    }
    return true
}

function matchDoWhileStatement(targetedNode, node, metaVariables, childs) {
    //test
    if (!matchExpression(targetedNode.test, node.test, metaVariables, childs)) {
        return false
    }
    //body
    childs.body = {}
    if (!matchStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}

function matchForInStatement(targetedNode, node, metaVariables, childs) {
    // left
    childs.left = {}
    if (!matchForInitialiser(targetedNode.left, node.left, metaVariables, childs.left)) {
        clearMeta(childs, metaVariables)
        return false
    }

    //right
    childs.right = {}
    if (!matchExpression(targetedNode.right, node.right, metaVariables, childs.right)) {
        clearMeta(childs, metaVariables)
        return false
    }

    //body
    childs.body = {}
    if (!matchStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}
function matchForInitialiser(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type === "General") {
        return true
    }
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (targetedNode.type) {
        case "VariableDeclaration":
            if (!matchVariableDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        default: // Expression
            if (!matchExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
    }
    return true
}
function matchForOfStatement(targetedNode, node, metaVariables, childs) {
    childs.left = {}
    // left 
    if (!matchForInitialiser(targetedNode.left, node.left, metaVariables, childs.left)) {
        clearMeta(childs, metaVariables)
        return false
    }

    //right
    childs.right = {}
    if (!matchExpression(targetedNode.right, node.right, metaVariables, childs.right)) {
        clearMeta(childs, metaVariables)
        return false
    }

    //body
    childs.body = {}
    if (!matchStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
        clearMeta(childs, metaVariables)
        return false
    }

    // await
    if (targetedNode.await !== node.await) {
        return false
    }
    return true
}

function matchForStatement(targetedNode, node, metaVariables, childs) {
    // init
    if (targetedNode.init && node.init) {
        switch (targetedNode.init.type) {
            case 'VariableDeclaration':
                if (!matchVariableDeclaration(targetedNode.init, node.init, metaVariables, childs)) {
                    return false
                }
                break;
            default: // Expression
                if (!matchExpression(targetedNode.init, node.init, metaVariables, childs)) {
                    return false
                }
        }
    } else {
        if (targetedNode.init || node.init) {
            return false
        }
    }
    // test
    if (targetedNode.test && node.test) {
        if (!matchExpression(targetedNode.test, node.test, metaVariables, childs)) {
            return false
        }
    } else {
        if (targetedNode.test || node.test) {
            return false
        }
    }
    // update
    if (targetedNode.update && node.update) {
        if (!matchExpression(targetedNode.update, node.update, metaVariables, childs)) {
            return false
        }
    } else {
        if (targetedNode.update || node.update) {
            return false
        }
    }
    // body
    if (!matchStatement(targetedNode.body, node.body, metaVariables, childs)) {
        return false
    }
    return true
}

function matchWhileStatement(targetedNode, node, metaVariables, childs) {
    // test
    childs.test = {}
    if (!matchExpression(targetedNode.test, node.test, metaVariables, childs.test)) {
        clearMeta(childs, metaVariables)
        return false
    }
    // body
    childs.body = {}
    if (!matchStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}



function matchStatement(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (statement[targetedNode.type]) {
        case 'BlockStatement':
            if (!matchBlockStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'IfStatement':
            if (!matchIfStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'BreakStatement':
            if (!matchBreakStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ContinueStatement':
            if (!matchContinueStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'DebuggerStatement':
            if (!matchDebuggerStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'EmptyStatement':
            if (!matchEmptyStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ExpressionStatement':
            if (!matchExpressionStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ImportDeclaration':
            if (!matchImportDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'LabeledStatement':
            if (!matchLabeledStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ReturnStatement':
            if (!matchReturnStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'SwitchStatement':
            if (!matchSwitchStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ThrowStatement':
            if (!matchThrowStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'TryStatement':
            if (!matchTryStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'VariableDeclaration':
            if (!matchVariableDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'WithStatement':
            if (!matchWithStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ClassDeclaration':
            if (!matchClassDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ClassExpression':
            if (!matchClassExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ExportDefaultDeclaration':
            if (!matchExportDefaultDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ExportAllDeclaration':
            if (!matchExportAllDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ExportNamedDeclaration':
            if (!matchExportNamedDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'FunctionDeclaration':
            if (!matchFunctionDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'IterationStatement':
            if (!matchIterationStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break
    }
    return true
}
function matchIterationStatement(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type === "ForGeneralStatement" && (node.type === "ForInStatement" || node.type === "ForOfStatement" || node.type === "ForStatement")) {
        return true
    }
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (targetedNode.type) {
        case 'DoWhileStatement':
            if (!matchDoWhileStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ForInStatement':
            if (!matchForInStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ForOfStatement':
            if (!matchForOfStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ForStatement':
            if (!matchForStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'WhileStatement':
            if (!matchWhileStatement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
    }
    return true
}
function matchArguments(targetedNode, node, metaVariables, childs) {
    // childs are array
    if (targetedNode.length > node.length) {
        return false
    }
    for (let index in targetedNode) {
        const child = {}
        childs.push(child)
        if (!matchExpression(targetedNode[index], node[index], metaVariables, child)) {
            clearMeta(child, metaVariables)
            return false
        }
    }
    return true
}
function matchParameter(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (targetedNode.type) {
        case 'Identifier':
            if (!matchIdentifier(targetedNode, node, metaVariables, childs)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'AssignmentPattern':
            if (!matchAssignmentPattern(targetedNode, node, metaVariables, childs)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'RestElement':
            if (!matchRestElement(targetedNode, node, metaVariables, childs)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'ArrayPattern':
            if (!matchObjectPattern(targetedNode, node, metaVariables, childs)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'ObjectPattern':
            if (!matchArrayPattern(targetedNode, node, metaVariables, childs)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
    }
    return true
}
function matchAssignmentPattern(targetedNode, node, metaVariables, childs) {
    if (targetedNode.right && !node.right) {
        return false
    }
    childs.right = {}
    if (targetedNode.right) {
        if (!matchExpression(targetedNode.right, node.right, metaVariables, childs.right)) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    if (targetedNode.left.type === "General") {
        return true
    }
    if (targetedNode.left.type !== node.left.type) {
        return false
    }
    childs.left = {}
    switch (targetedNode.left.type) {
        case 'Identifier':
            if (!matchIdentifier(targetedNode.left, node.left, metaVariables, childs.left)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'ArrayPattern':
            if (!matchArrayPattern(targetedNode.left, node.left, metaVariables, childs.left)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'ObjectPattern':
            if (!matchObjectPattern(targetedNode.left, node.left, metaVariables, childs.left)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
    }
    return true
}
function matchAssignmentExpression(targetedNode, node, metaVariables, childs) {
    if (targetedNode.operator !== node.operator) {
        clearMeta(childs, metaVariables)
        return false
    }
    childs.left = {}
    // left
    if (!matchExpression(targetedNode.left, node.left, metaVariables, childs.left)) {
        clearMeta(childs, metaVariables)
        return false
    }
    childs.right = {}
    // right
    if (!matchExpression(targetedNode.right, node.right, metaVariables, childs.right)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}
function matchBinaryExpression(targetedNode, node, metaVariables, childs) {
    // operator
    if (targetedNode.operator !== node.operator) {
        return false
    }
    childs.left = {}
    // left
    if (!matchExpression(targetedNode.left, node.left, metaVariables, childs.left)) {
        return false
    }
    childs.right = {}
    // right
    if (!matchExpression(targetedNode.right, node.right, metaVariables, childs.right)) {
        return false
    }
    return true

}
function matchConditionalExpression(targetedNode, node, metaVariables, childs) {
    // test
    if (!matchExpression(targetedNode.test, node.test, metaVariables, childs)) {
        return false
    }
    // consequent
    if (!matchExpression(targetedNode.consequent, node.consequent, metaVariables, childs)) {
        return false
    }
    // alternate
    if (!matchExpression(targetedNode.alternate, node.alternate, metaVariables, childs)) {
        return false
    }
    return true

}
function matchLogicalExpression(targetedNode, node, metaVariables, childs) {
    // operator
    if (targetedNode.operator !== node.operator) {
        return false
    }
    // left
    childs.left = {}
    if (!matchExpression(targetedNode.left, node.left, metaVariables, childs.left)) {
        clearMeta(childs, metaVariables)
        return false
    }
    // right
    childs.right = {}
    if (!matchExpression(targetedNode.right, node.right, metaVariables, childs.right)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true

}
function matchNewExpression(targtedNode, node, metaVariables, childs) {
    // callee
    childs.callee = {}
    if (!matchLeftHandSideExpression(targtedNode.callee, node.callee, metaVariables, childs.callee)) {
        clearMeta(childs, metaVariables)
        return false
    }
    // arguments
    childs.arguments = []
    if (!matchArguments(targtedNode.arguments, node.arguments, metaVariables, childs.arguments)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true

}
function matchRestElement(targtedNode, node, metaVariables, childs) {
    // argument
    if (targtedNode.argument.type !== node.argument.type) {
        return false
    }
    childs.argument = {}
    switch (restElement[targtedNode]) {
        case 'Identifier':
            if (!matchIdentifier(targtedNode.argument, node.argument, metaVariables, childs.argument)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'PropertyName':
            if (!matchPropertyName(targtedNode.argument, node.argument, metaVariables, childs.argument)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
        case 'BindingPattern':
            if (!matchBindingPattern(targtedNode.argument, node.argument, metaVariables, childs.argument)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break;
    }
    // value (OPTIONAL)
    // Value isn't applicable in JS we can't decalre params after a rest element

    return true

}

function matchBindingPattern(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type === "General") {
        return true
    }
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (targetedNode.type) {
        case 'Identifier':
            if (!matchIdentifier(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ArrayPattern':
            if (!matchArrayPattern(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ObjectPattern':
            if (!matchObjectPattern(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
    }
    return true

}

function matchPropertyName(targetedNode, node, metaVariables, childs) {
    switch (targetedNode.type) {
        case 'Identifier':
            if (!matchIdentifier(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'Literal':
            if (!matchLiteral(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;

    }
    return true

}

function matchSequenceExpression(targetedNode, node, metaVariables, childs) {
    return true

}
function matchAwaitExpression(targetedNode, node, metaVariables, childs) {
    // moseeba our meriyah doesnt read await as reserved word
    //argument
    childs.argument = {}
    if (!matchExpression(targetedNode.argument, node.argument, metaVariables, childs.argument)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}

function matchLeftHandSideExpression(targetedNode, node, metaVariables, childs) {
    // if(targetedNode.type == "General") {
    //     return true
    // }
    switch (leftHandSideExpression[targetedNode.type]) {
        case 'CallExpression':
            if (!matchCallExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ChainExpression': // skipped
            if (!matchChainExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ImportExpression': // skipped
            if (!matchImportExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ClassExpression': // skipped
            if (!matchClassExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ClassDeclaration': // skipped
            if (!matchClassDeclaration(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'FunctionExpression':
            if (!matchFunctionExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'LiteralExpression': // NotNode
            if (!matchLiteralExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'MemberExpression':
            if (!matchMemberExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'PrimaryExpression': // NotNode
            if (!matchPrimaryExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'TaggedTemplateExpression':
            if (!matchTaggedTemplateExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
    }
    return true
}
function matchCallExpression(targetedNode, node, metaVariables, childs) {
    // callee
    if (targetedNode.callee.type === "General" && node.callee.type !== "Super") {
        return true
    }
    if (targetedNode.callee.type !== node.callee.type) {
        return false

    }
    if (targetedNode.type === 'Super') {
        if (!matchSuper(targetedNode, node, metaVariables, childs)) {
            return false
        }
    }
    else {
        childs.callee = {}
        if (!matchExpression(targetedNode.callee, node.callee, metaVariables, childs.callee)) {
            clearMeta(childs, metaVariables)
            return false
        }
    }

    // arguments
    childs.arguments = []
    if (argumentsIncludesGeneral(targetedNode.arguments)) {
        // General Found
        if (noOfnotGeneralArgs(targetedNode.arguments) > node.arguments.length) {
            return false
        }
        let targetedArgumentIndex = 0, nodeArgumentIndex = 0
        let found = 0
        while (nodeArgumentIndex < node.arguments.length) {
            const targetedArgument = targetedNode.arguments[targetedArgumentIndex]
            const nodeArgument = node.arguments[nodeArgumentIndex]
            if (targetedArgument?.type === "General") { // 1G 1NG
                const nextTargetedArgument = targetedNode.arguments[targetedArgumentIndex + 1]
                if (!nextTargetedArgument) {
                    break;
                }
                if (nextTargetedArgument.type === "General") {
                    targetedArgumentIndex++;
                    continue;
                }

                if (nextTargetedArgument.type !== nodeArgument.type) {
                    nodeArgumentIndex++;
                    continue;

                }
                if (nextTargetedArgument.type == 'SpreadElement') {
                    const child = {}
                    childs.arguments.push(child)
                    if (!matchSpreadElement(nextTargetedArgument, nodeArgument, metaVariables, child)) {
                        nodeArgumentIndex++;
                        clearMeta(child, metaVariables)
                        continue;

                    }
                } else {
                    const child = {}
                    childs.arguments.push(child)
                    if (!matchExpression(nextTargetedArgument, nodeArgument, metaVariables, child)) {
                        nodeArgumentIndex++;
                        clearMeta(child, metaVariables)
                        continue;

                    }
                }
                found++;
                nodeArgumentIndex++;
                targetedArgumentIndex += 2;
            } else { // 2NG
                if (!targetedArgument) {
                    return false

                }
                if (targetedArgument.type !== nodeArgument.type) {
                    return false

                }
                if (targetedArgument.type == 'SpreadElement') {
                    const child = {}
                    childs.arguments.push(child)
                    if (!matchSpreadElement(targetedArgument, nodeArgument, metaVariables, child)) {
                        clearMeta(child, metaVariables)
                        return false

                    }
                } else {
                    const child = {}
                    childs.arguments.push(child)
                    if (!matchExpression(targetedArgument, nodeArgument, metaVariables, child)) {
                        clearMeta(child, metaVariables)
                        return false

                    }
                }
                found++;
                nodeArgumentIndex++;
                targetedArgumentIndex++;
            }
        }
        return found === noOfnotGeneralArgs(targetedNode.arguments)
    } else { // No General
        if (targetedNode.arguments.length > node.arguments.length) {
            return false
        }

        for (let index in targetedNode.arguments) {
            if (targetedNode.arguments[index].type !== node.arguments[index].type) {
                return false

            }
            if (targetedNode.arguments[index].type == 'SpreadElement') {
                const child = {}
                childs.arguments.push(child)
                if (!matchSpreadElement(targetedNode.arguments[index], node.arguments[index], metaVariables, child)) {
                    clearMeta(child, metaVariables)
                    return false

                }
            } else {
                const child = {}
                childs.arguments.push(child)
                if (!matchExpression(targetedNode.arguments[index], node.arguments[index], metaVariables, child)) {
                    clearMeta(child)
                    return false

                }
            }
        }
    }

    return true

}
function matchSpreadElement(targetedNode, node, metaVariables, childs) {
    if (!matchSpreadArgument(targetedNode.argument, node.argument, metaVariables, childs)) {
        return false

    }
    return true;
}
function matchSpreadArgument(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (spreadArgument[targetedNode.type]) {
        case 'Identifier':
            if (!matchIdentifier(targetedNode, node, metaVariables, childs)) {
                return false

            }
            break;
        case 'SpreadElement':
            if (!matchSpreadElement(targetedNode, node, metaVariables, childs)) {
                return false

            }
            break;
        case 'BindingPattern':
            if (!matchBindingPattern(targetedNode, node, metaVariables, childs)) {
                return false

            }
            break;
        case 'Expression':
            if (!matchExpression(targetedNode, node, metaVariables, childs)) {
                return false

            }
            break;
        case 'PropertyName':
            if (!matchPropertyName(targetedNode, node, metaVariables, childs)) {
                return false

            }
            break;

    }
    return true
}
function matchChainExpression(targetedNode, node, metaVariables, childs) {
    return true

}
function matchImportExpression(targetedNode, node, metaVariables, childs) {
    return true

}
function matchClassExpression(targetedNode, node, metaVariables, childs) {
    return true

}
function matchClassDeclaration(targetedNode, node, metaVariables, childs) {
    return true

}
function matchFunctionExpression(targetedNode, node, metaVariables, childs) {
    if (!matchFunctionDeclarationBase(targetedNode, node, metaVariables, childs)) {
        return false
    }
    return true

}
function matchFunctionDeclarationBase(targetedNode, node, metaVariables, childs) {

    if (targetedNode.generator !== node.generator) {
        return false
    }
    if (targetedNode.async !== node.async) {
        return false
    }
    // params
    childs.parameters = []
    if (!matchParameters(targetedNode.params, node.params, metaVariables, childs.parameters)) {
        return false
    }
    //body
    childs.body = {}
    if (targetedNode.body) {
        if (!matchBlockStatement(targetedNode.body, node.body, metaVariables, childs.body)) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    if (targetedNode.id && node.id) {
        if (targetedNode.id.type === "General") {
            return true
        }
        if (!matchIdentifier(targetedNode.id, node.id, metaVariables, childs)) {
            return false
        }
    }
    return true
}
function matchLiteralExpression(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (literalExpression[targetedNode.type]) {
        case 'Literal':
            if (!matchLiteral(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'TemplateLiteral':
            if (!matchTemplateLiteral(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
    }
    return true
}
function matchMemberExpression(targetedNode, node, metaVariables, childs) {
    // object
    if (targetedNode.object.type === "General" && node.object.type !== "Super") {
        return true
    }
    if (targetedNode.object.type !== node.object.type) {
        return false
    }
    childs.object = {}
    switch (targetedNode.object.type) {
        case 'Super':
            if (!matchSuper(targetedNode.object, node.object, metaVariables, childs.object)) {
                return false
            }
            break;
        default:
            if (!matchExpression(targetedNode.object, node.object, metaVariables, childs.object)) {
                return false
            }
    }

    // property 
    if (targetedNode.object.type === "General" && node.object.type !== "PrivateIdentifier") {
        return true
    }
    if (targetedNode.property.type !== node.property.type) {
        return false
    }
    childs.property = {}
    switch (targetedNode.property.type) {
        case 'PrivateIdentifier':
            if (!matchPrivateIdentifier(targetedNode.property, node.property, metaVariables, childs.property)) {
                return false
            }
            break;
        default:
            if (!matchExpression(targetedNode.property, node.property, metaVariables, childs.property)) {
                return false
            }
    }
    return true

}
function matchPrivateIdentifier(targtedNode, node, metaVariables, childs) {

    if (targtedNode.name !== node.name) {
        return false
    }

    return true
}
function matchPrimaryExpression(targetedNode, node, metaVariables, childs) {
    switch (primaryExpression[targetedNode.type]) {
        case 'ArrayExpression':
            if (!matchArrayExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ArrayPattern':
            if (!matchArrayPattern(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ClassExpression':
            if (!matchClassExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'FunctionExpression':
            if (!matchFunctionExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'Identifier':
            if (!matchIdentifier(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'Import':
            if (!matchImport(targetedNode, node, metaVariables, childs)) {
                return false
            }
        case 'JSXElement':
            if (!matchJSXElement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'JSXFragment':
            if (!matchJSXFragment(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'JSXOpeningElement':
            if (!matchJSXOpeningElement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'Literal':
            if (!matchLiteral(targetedNode, node, metaVariables, childs)) {

                return false
            }
            break;
        case 'MetaProperty':
            if (!matchMetaProperty(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ObjectExpression':
            if (!matchObjectExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ObjectPattern':
            if (!matchObjectPattern(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'Super':
            if (!matchSuper(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'TemplateLiteral':
            if (!matchTemplateLiteral(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'ThisExpression':
            if (!matchThisExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
    }
    return true
}
function matchArrayExpression(targetedNode, node, metaVariables, childs) {
    childs.elements = []
    for (let index in targetedNode.elements) {
        if (targetedNode.elements[index] !== null && node.elements[index] !== null) {
            if (!node.elements[index]) {
                return false
            }
            if (targetedNode.elements[index].type === node.elements[index].type){
                const child = {}
                childs.elements.push(child)
                switch (targetedNode.elements[index].type) {
                    case 'SpreadElement':
                        if (!matchSpreadElement(targetedNode.elements[index], node.elements[index], metaVariables, child)) {
                            clearMeta(child, metaVariables)
                            return false
                        }
                        break;
                    default:
                        if (!matchExpression(targetedNode.elements[index], node.elements[index], metaVariables, child)) {
                            clearMeta(child, metaVariables)
                            return false
                        }
                        break;
                }
            }
        }

    }
    return true

}
function matchArrayPattern(targetedNode, node, metaVariables, childs) { //yoyy
    for (let index in targetedNode.elements) {
        if (node.elements[index] == null) {
            return false
        }
        if (!matchExpression(targetedNode.elements[index], node.elements[index], metaVariables, childs)) {
            return false
        }
    }
    return true

}
function matchImport(targetedNode, node, metaVariables, childs) {
    return true

}
function matchJSXElement(targetedNode, node, metaVariables, childs) {
    return true

}
function matchJSXFragment(targetedNode, node, metaVariables, childs) {
    return true

}
function matchJSXOpeningElement(targetedNode, node, metaVariables, childs) {
    return true

}
function matchLiteral(targetedNode, node, metaVariables, childs) {
    if (targetedNode.value === ".....") { // Temp
        return true
    }
    if (targetedNode.value !== node.value) {
        return false
    }
    return true

}
function matchMetaProperty(targetedNode, node, metaVariables, childs) {
    return true

}

function matchObjectExpression(targetedNode, node, metaVariables, childs) {
    childs.properties = []
    for (let targetedProperty of targetedNode.properties) {
        let found = false
        for (let nodeProperty of node.properties) {
            const child = {}
            childs.properties.push(child)
            if (matchObjectLiteralElementLike(targetedProperty, nodeProperty, metaVariables, child)) {
                found = true
                break;
            }else {
                clearMeta(child, metaVariables)
            }
        }
        if (!found) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    return true

}
function matchMethodDefinition(targetedNode, node, metaVariables, childs) {
    if (!matchMethodDefinitionBase(targetedNode, node, metaVariables, childs)) {
        return false
    }
    return true

}
function matchMethodDefinitionBase(targetedNode, node, metaVariables, childs) {
    //key 
    if (targetedNode.key.type && node.key.type) {
        if (targetedNode.key.type !== node.key.type) {
            return false
        }
        childs.key = {}
        switch (targetedNode.key.type) {
            case 'PrivateIdentifier':
                if (!matchPrivateIdentifier(targetedNode.key, node.key, metaVariables, childs.key)) {
                    clearMeta(childs, metaVariables)
                    return false
                }
                break;
            default:
                if (!matchExpression(targetedNode.key.node.key, metaVariables, childs.key)) {
                    clearMeta(childs, metaVariables)
                    return false
                }
        }
    }
    // value
    if (targetedNode.value.type !== node.value.type) {
        return false
    }
    childs.value = {}
    if (!matchFunctionExpression(targetedNode.value, node.value, metaVariables, childs.value)) {
        return false
    }
    // static
    if (targetedNode.static !== node.static) {
        return false

    }
    // kind
    if (targetedNode.kind !== node.kind) {
        return false

    }
    // Decorators
    for (let index in targetedNode.decorators) {
        if (!node.decorators[index]) {
            return false
        }
        if (!matchDecorator(targetedNode.decorators[index], node.decorators[index], metaVariables, childs)) {
            return false
        }
    }
    return true
}
function matchDecorator(targetedNode, node, metaVariables, childs) {
    if (!matchLeftHandSideExpression(targetedNode.expression, node.expression, metaVariables, childs)) {
        return false

    }
    return true
}
function matchProperty(targetedNode, node, metaVariables, childs) {
    // computed method shorthand are skipped due to our ignorance
    // key
    childs.key = {}
    if (!matchExpression(targetedNode.key, node.key, metaVariables, childs.key)) {
        clearMeta(childs, metaVariables)
        return false
    }
    // kind
    if (targetedNode.kind !== node.kind) {
        return false
    }
    // value
    if (targetedNode.value.type === "General") {
        return true
    }
    if (targetedNode.value.type !== node.value.type) {
        return false
    }
    childs.value = {}
    switch (property[targetedNode.value.type]) {
        case "Identifier":
            if (!matchIdentifier(targetedNode.value, node.value, metaVariables, childs.value)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break
        case "AssignmentPattern":
            if (!matchAssignmentPattern(targetedNode.value, node.value, metaVariables, childs.value)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break
        case "Expression":
            if (!matchExpression(targetedNode.value, node.value, metaVariables, childs.value)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break
        case "BindingPattern":
            if (!matchBindingPattern(targetedNode.value, node.value, metaVariables, childs.value)) {
                clearMeta(childs, metaVariables)
                return false
            }
            break
    }

    return true
}
function matchObjectLiteralElementLike(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type !== node.type) {
        return false
    }
    switch (targetedNode.type) {
        case 'MethodDefinition':
            if (!matchMethodDefinition(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'Property':
            if (!matchProperty(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'RestElement':
            if (!matchRestElement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'SpreadElement':
            if (!matchSpreadElement(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;

    }
    return true
}
function matchObjectPattern(targetedNode, node, metaVariables, childs) {
    childs.properties = []
    for (let targetedProperty of targetedNode.properties) {
        let found = false
        for (let nodeProperty of node.properties) {
            const child = {}
            childs.properties.push(child)
            if (matchObjectLiteralElementLike(targetedProperty, nodeProperty, metaVariables, child)) {
                found = true
                break;
            }else {
                clearMeta(child, metaVariables)
            }
        }
        if (!found) {
            clearMeta(childs, metaVariables)
            return false
        }
    }
    return true

}
function matchSuper(targetedNode, node, metaVariables, childs) {
    return true

}
function matchTemplateElement(targetedNode, node, metaVariables, childs) {
    if (targetedNode.tail !== node.tail) {
        return false
    }
    if (targetedNode.value.raw !== node.value.raw) {
        return false
    }
    if (targetedNode.value.cooked !== node.value.cooked) {
        return false
    }
    return true
}
function matchTemplateLiteral(targetedNode, node, metaVariables, childs) {
    if (targetedNode.quasis.length == 1) {
        if (targetedNode.quasis[0].value.cooked === ".....") {
            return true
        }
    }
    // quasis
    childs.quasis = []
    for (let index in targetedNode.quasis) {
        const child = {}
        childs.quasis.push(child)
        if (!matchTemplateElement(targetedNode.quasis[index], node.quasis[index], metaVariables, child)) {
            clearMeta(child, metaVariables)
            return false
        }
    }
    childs.expressions = []
    // expressions
    for (let index in targetedNode.expressions) {
        const child = {}
        childs.expressions.push(child)
        if (!matchExpression(targetedNode.expressions[index], node.expressions[index], metaVariables, child)) {
            clearMeta(child, metaVariables)
            return false
        }
    }
    return true

}
function matchThisExpression(targetedNode, node, metaVariables, childs) {
    return true

}
function matchTaggedTemplateExpression(targetedNode, node, metaVariables, childs) {
    // tag
    childs.tag = {}
    if (!matchExpression(targetedNode.tag, node.tag, metaVariables, childs.tag)) {
        clearMeta(childs, metaVariables)
        return false
    }
    // quasi
    childs.quasi = {}
    if (!matchTemplateLiteral(targetedNode.quasi, node.quasi, metaVariables, childs.quasi)) {
        clearMeta(childs, metaVariables)
        return false

    }
    return true

}

function matchUnaryExpression(targetedNode, node, metaVariables, childs) {
    // operator
    if (targetedNode.operator !== node.operator) {
        return false
    }
    // prefix
    if (targetedNode.prefix !== node.prefix) {
        return false
    }
    // argument
    childs.argument = {}
    if (!matchExpression(targetedNode.argument, node.argument, metaVariables, childs.argument)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true

}

function matchUpdateExpression(targetedNode, node, metaVariables, childs) {
    // operator
    if (targetedNode.operator !== node.operator) {
        return false
    }
    // prefix
    if (targetedNode.prefix !== node.prefix) {
        return false
    }
    // argument
    childs.argument = {}
    if (!matchExpression(targetedNode.argument, node.argument, metaVariables, childs.argument)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}
function matchYieldExpression(targetedNode, node, metaVariables, childs) {

    return true

}

function matchExpression(targetedNode, node, metaVariables, childs) {
    if (targetedNode.type == "General") {
        return true
    }
    if (targetedNode.type !== node.type) {
        return false
    }
    childs.expression = {}
    switch (expression[targetedNode.type]) {
        case 'ArrowFunctionExpression':
            if (!matchArrowFunctionExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'AssignmentExpression':
            if (!matchAssignmentExpression(targetedNode, node, metaVariables, childs)) {
                return false
            }
            break;
        case 'BinaryExpression':
            if (!matchBinaryExpression(targetedNode, node, metaVariables, childs.expression)) {
                return false
            }
            break;
        case 'ConditionalExpression':
            if (!matchConditionalExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'LogicalExpression':
            if (!matchLogicalExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'NewExpression':
            if (!matchNewExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'RestElement':
            if (!matchRestElement(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'SequenceExpression': // skipped
            if (!matchSequenceExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'AwaitExpression':
            if (!matchAwaitExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'LeftHandSideExpression': // NotNode
            if (!matchLeftHandSideExpression(targetedNode, node, metaVariables, childs.expression)) {
                return false;
            }
            break;
        case 'UnaryExpression':
            if (!matchUnaryExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'UpdateExpression':
            if (!matchUpdateExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
        case 'YieldExpression':
            if (!matchYieldExpression(targetedNode, node, metaVariables, childs)) {
                return false;
            }
            break;
    }
    return true
}
function matchBigIntLiteral(targetedNode, node, metaVariables, childs) {
    if (targetedNode.bigint !== node.bigint) {
        clearMeta(childs, metaVariables)
        return false
    }
    if (!matchLiteral(targetedNode, node, metaVariables, childs)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}
function matchParenthesizedExpression(targetedNode, node, metaVariables, childs) {
    // expression
    childs.expression = {}
    if (!matchExpression(targetedNode.expression, node.expression, metaVariables, childs.expression)) {
        clearMeta(childs, metaVariables)
        return false
    }
    return true
}
function matchRegExpLiteral(targetedNode, node, metaVariables, childs) {
    if (targetedNode.regex.pattern !== node.regex.pattern) {
        return false
    }
    if (targetedNode.regex.flags !== node.regex.flags) {
        return false
    }
    return true
}
function matchStaticBlock(targetedNode, node, metaVariables, childs) {
    if (!matchBlockStatementBase(targetedNode, node, metaVariables, childs)) {
        return false
    }
    return true
}
function matchBlockStatementBase(targetedNode, node, metaVariables, childs) {

    if (targetedNode.body.length !== 0) {
        if (statementsIncludesGeneral(targetedNode.body)) { // General Case
            if (noOfnotGeneralArgs(targetedNode.body) > node.body.length) {
                return false
            }
            let targetedStatementIndex = 0, nodeStatementIndex = 0
            let found = 0
            while (nodeStatementIndex < node.body.length) {
                const targetedStatement = targetedNode.body[targetedStatementIndex]
                const nodeStatement = node.body[nodeStatementIndex]
                if (targetedStatement?.type === "General") { // 1G 1NG
                    const nextTargetedStatement = targetedNode.body[targetedStatementIndex + 1]
                    if (!nextTargetedStatement) {
                        break;
                    }
                    if (nextTargetedStatement.type === "General") {
                        targetedStatementIndex++;
                        continue;
                    }

                    if (!matchStatement(nextTargetedStatement, nodeStatement, metaVariables, childs)) {
                        nodeStatementIndex++
                        continue;
                    }
                    found++;
                    nodeStatementIndex++;
                    targetedStatementIndex += 2;
                } else { // 2NG
                    if (!targetedStatement) {
                        return false

                    }
                    if (!matchStatement(targetedStatement, nodeStatement, metaVariables, childs)) {
                        nodeStatementIndex++
                        continue;
                    }
                    found++;
                    nodeStatementIndex++;
                    targetedStatementIndex += 2;
                }
            }
            return found === noOfnotGeneralArgs(targetedNode.body)

        } else { // No General Case (Default)
            if (targetedNode.body.length > node.body.length) {
                return false
            }
            console.log("noor")
            let targetStatementIndex = 0
            let nodeStatementIndex = 0
            while (!matchStatement(targetedNode.body[targetStatementIndex], node.body[nodeStatementIndex], metaVariables, childs) && nodeStatementIndex < node.body.length) {
                nodeStatementIndex++;
            }
            if (!(nodeStatementIndex < node.body.length)) {
                return false
            }

            while (targetStatementIndex < targetedNode.body.length && nodeStatementIndex < node.body.length) {
                if (!matchStatement(targetedNode.body[targetStatementIndex], node.body[nodeStatementIndex], metaVariables, childs)) {
                    return false
                }
                nodeStatementIndex++;
                targetStatementIndex++;
            }
            if (targetStatementIndex < targetedNode.body.length) {
                return false
            }
        }
    } else {
        if (node.body.length > 0) {
            return false
        }
    }
    return true
}
const matchTypes = {
    VariableDeclaration: matchVariableDeclaration,
    VariableDeclarator: matchVariableDeclarator,
    Identifier: matchIdentifier,
    ArrayExpression: matchArrayExpression,
    ArrayPattern: matchArrayPattern,
    ArrowFunctionExpression: matchArrowFunctionExpression,
    AssignmentExpression: matchAssignmentExpression,
    AssignmentPattern: matchAssignmentPattern,
    AwaitExpression: matchAwaitExpression,
    BigIntLiteral: matchBigIntLiteral,
    BinaryExpression: matchBinaryExpression,
    BlockStatement: matchBlockStatement,
    BreakStatement: matchBreakStatement,
    CallExpression: matchCallExpression,
    ChainExpression: matchChainExpression,
    ImportExpression: matchImportExpression,
    CatchClause: matchCatchClause,
    // ClassBody: matchClassBody,
    ClassDeclaration: matchClassDeclaration,
    ClassExpression: matchClassExpression,
    ConditionalExpression: matchConditionalExpression,
    ContinueStatement: matchContinueStatement,
    DebuggerStatement: matchDebuggerStatement,
    Decorator: matchDecorator,
    DoWhileStatement: matchDoWhileStatement,
    EmptyStatement: matchEmptyStatement,
    ExportAllDeclaration: matchExportAllDeclaration,
    ExportDefaultDeclaration: matchExportDefaultDeclaration,
    ExportNamedDeclaration: matchExportNamedDeclaration,
    // ExportSpecifier: matchExportSpecifier,
    ExpressionStatement: matchExpressionStatement,
    // PropertyDefinition: matchPropertyDefinition,
    ForInStatement: matchForInStatement,
    ForOfStatement: matchForOfStatement,
    ForStatement: matchForStatement,
    FunctionDeclaration: matchFunctionDeclaration,
    FunctionExpression: matchFunctionExpression,
    Identifier: matchIdentifier,
    IfStatement: matchIfStatement,
    Import: matchImport,
    ImportDeclaration: matchImportDeclaration,
    // ImportDefaultSpecifier: matchImportDefaultSpecifier,
    // ImportNamespaceSpecifier: matchImportNamespaceSpecifier,
    // ImportSpecifier: matchImportSpecifier,
    // JSXNamespacedName: matchJSXNamespacedName,
    // JSXAttribute: matchJSXAttribute,
    // JSXClosingElement: matchJSXClosingElement,
    // JSXClosingFragment: matchJSXClosingFragment,
    // JSXElement: matchJSXElement,
    // JSXEmptyExpression: matchJSXEmptyExpression,
    // JSXExpressionContainer: matchJSXExpressionContainer,
    // JSXFragment: matchJSXFragment,
    // JSXIdentifier: matchJSXIdentifier,
    // JSXOpeningElement: matchJSXOpeningElement,
    // JSXOpeningFragment: matchJSXOpeningFragment,
    // JSXSpreadAttribute: matchJSXSpreadAttribute,
    // JSXSpreadChild: matchJSXSpreadChild,
    // JSXMemberExpression: matchJSXMemberExpression,
    // JSXText: matchJSXText,
    LabeledStatement: matchLabeledStatement,
    Literal: matchLiteral,
    LogicalExpression: matchLogicalExpression,
    MemberExpression: matchMemberExpression,
    MetaProperty: matchMetaProperty,
    MethodDefinition: matchMethodDefinition,
    NewExpression: matchNewExpression,
    ObjectExpression: matchObjectExpression,
    ObjectPattern: matchObjectPattern,
    ParenthesizedExpression: matchParenthesizedExpression,
    PrivateIdentifier: matchPrivateIdentifier,
    // Program: matchProgram,
    Property: matchProperty,
    RegExpLiteral: matchRegExpLiteral,
    RestElement: matchRestElement,
    ReturnStatement: matchReturnStatement,
    SequenceExpression: matchSequenceExpression,
    SpreadElement: matchSpreadElement,
    StaticBlock: matchStaticBlock,
    Super: matchSuper,
    SwitchCase: matchSwitchCase,
    SwitchStatement: matchSwitchStatement,
    TaggedTemplateExpression: matchTaggedTemplateExpression,
    TemplateElement: matchTemplateElement,
    TemplateLiteral: matchTemplateLiteral,
    ThisExpression: matchThisExpression,
    ThrowStatement: matchThrowStatement,
    TryStatement: matchTryStatement,
    UpdateExpression: matchUpdateExpression,
    UnaryExpression: matchUnaryExpression,
    WhileStatement: matchWhileStatement,
    WithStatement: matchWithStatement,
    YieldExpression: matchYieldExpression,
}
export default matchTypes