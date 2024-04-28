import AbstractSyntaxTree, { Identifier } from 'abstract-syntax-tree'
import evaluate from "../evaluate.js"
import matchTypes from '../matchingAlgorithms4.js'
import { createBlockStatement } from '../helpers.js'
import getScope, { checkIfInside } from './getScope.js'
import getDeclarationScope from './getDeclarationScope.js'
function matchTaintRule({ name: fileName, ast }, rule, reports) {
    let taints = getSources(ast, rule["pattern-sources"])
    let sinks = getSinks(rule["pattern-sinks"])
    // console.log(sinks);
    // console.log(taints)
    propagate(ast, taints)
    // console.log(taints)s
    matchTaint(ast, sinks, taints, reports)
    // console.log(reports);
    // const match = evaluate(logicBlock)
    // if (match){
    //     reports.reports.push( {filepath:fileName, line:match.line, col:match.column, rule_name:rule.id, message: rule.message} )
    // }
}
function matchTaint(ast, sinks, taints, reports) {
    for (let sink of sinks) {
        AbstractSyntaxTree.walk(ast, (node) => {
            if (node.type == "CallExpression") {
                if (node.callee.type == "Identifier" && sink.calleType == "Identifier" && sink.name === node.callee.name) {
                    for (let taintName of Object.keys(taints)) {
                        for (let taint of taints[taintName]) {
                            for (let arg of node.arguments) {
                                if (arg.type === taint.type) {
                                    if (arg.type === "Identifier" && arg.name === taintName) {
                                        if (!taint.scope || checkIfInside(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                                            console.log(arg.loc)
                                        }

                                    } else if (arg.type === "CallExpression" && arg.callee.type === "Identifier" && arg.callee.name === taintName) {
                                        if (!taint.scope || checkIfInside(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                                            console.log(arg.loc)
                                        }
                                    } else if (arg.type === "CallExpression" && arg.callee.type === "MemberExpression" && getMemberExpressionName(arg.callee) === taintName) {
                                        if (!taint.scope || checkIfInside(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                                            console.log(arg.loc)
                                        }
                                    } else if (arg.type === "MemberExpression" && getMemberExpressionName(arg) === taintName) {
                                        if (!taint.scope || checkIfInside(arg.loc.start.line, arg.loc.start.col, taint.scope.scope.loc.start.line, taint.scope.scope.loc.end.line, taint.scope.scope.loc.start.col, taint.scope.scope.loc.end.col)) {
                                            console.log(arg.loc)
                                        }
                                    }
                                } else if (arg.type === "ArrayExpression") {

                                } else if (arg.type === "ObjectExpression") {

                                }
                            }
                        }
                    }
                } else if (node.callee.type == "MemberExpression" && sink.calleType == "MemberExpression" && sink.name === getMemberExpressionName(node.callee)) {

                }

            }
        })
    }
}
function propagate(ast, taints) {
    for (let taint of Object.keys(taints)) {
        track(ast, taints[taint].map((t) => {
            return {
                name: taint,
                ...t
            }
        }), taints)
    }
}
function addTaint(taint, taints) {
    if (!taints[taint.name]) {
        taints[taint.name] = []
    }
    taints[taint.name].push({
        type: taint.type,
        line: taint.line,
        col: taint.col,
        scope: taint.scope
    })
}
function track(ast, taint, taints) {
    taint.forEach(t => {
        switch (t.type) {
            case "CallExpression":
                AbstractSyntaxTree.walk(t.scope?.scope ? t.scope.scope : ast, (node) => {

                    if (node.type === "VariableDeclarator" && node.init
                        && node.init.type === "CallExpression") {
                        if (node.init.callee.type === "Identifier" && node.init.callee.name === t.name) {
                            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                                addTaint({
                                    name: node.id.name,
                                    type: node.id.type,
                                    line: node.loc.start.line,
                                    col: node.loc.start.column,
                                    scope: getScope(ast, node.loc.start.line, node.loc.start.column)
                                }, taints)
                                track(ast, taints[node.id.name].map((tt) => {
                                    return {
                                        name: node.id.name,
                                        ...tt
                                    }
                                }), taints)
                            }


                        } else if (node.init.callee.type === "MemberExpression"
                            && getMemberExpressionName(node.init.callee) === t.name) {
                            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                                addTaint({
                                    name: node.id.name,
                                    type: node.id.type,
                                    line: node.loc.start.line,
                                    col: node.loc.start.column,
                                    scope: getScope(ast, node.loc.start.line, node.loc.start.column)
                                }, taints)
                                track(ast, taints[node.id.name].map((tt) => {
                                    return {
                                        name: node.id.name,
                                        ...tt
                                    }
                                }), taints)
                            }
                        }
                    } else if ((node.type === "AssignmentExpression" || node.type === "AssignmentPattern")
                        && node.right.type === "CallExpression") {
                        if (node.right.callee.type === "Identifier" && node.right.callee.name === t.name) {
                            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                                addTaint({
                                    name: node.left.name,
                                    type: node.left.type,
                                    line: node.loc.start.line,
                                    col: node.loc.start.column,
                                    scope: getDeclarationScope(ast, node.loc.start.line, node.left.name)
                                }, taints)
                                track(ast, taints[node.left.name].map((tt) => {
                                    return {
                                        name: node.left.name,
                                        ...tt
                                    }
                                }), taints)
                            }
                        } else if (node.right.callee.type === "MemberExpression" && getMemberExpressionName(node.right.callee) === t.name) {
                            if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                                addTaint({
                                    name: node.left.name,
                                    type: node.left.type,
                                    line: node.loc.start.line,
                                    col: node.loc.start.column,
                                    scope: getDeclarationScope(ast, node.loc.start.line, node.left.name)
                                }, taints)
                                track(ast, taints[node.left.name].map((tt) => {
                                    return {
                                        name: node.left.name,
                                        ...tt
                                    }
                                }), taints)
                            }
                        }
                    }
                })
                break;
            case "MemberExpression":
                AbstractSyntaxTree.walk(t.scope?.scope ? t.scope.scope : ast, (node) => {
                    if (node.type === "VariableDeclarator" && node.init && node.init.type === "MemberExpression" && t.name === getMemberExpressionName(node.init)) {
                        if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                            addTaint({
                                name: node.id.name,
                                type: node.id.type,
                                line: node.loc.start.line,
                                col: node.loc.start.column,
                                scope: getScope(ast, node.loc.start.line, node.loc.start.column)
                            }, taints)
                            track(ast, taints[node.id.name].map((tt) => {
                                return {
                                    name: node.id.name,
                                    ...tt
                                }
                            }), taints)
                        }
                    } else if ((node.type === "AssignmentExpression" || node.type === "AssignmentPattern") && node.right.type === "MemberExpression" && t.name === getMemberExpressionName(node.right)) {
                        if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                            addTaint({
                                name: node.left.name,
                                type: node.left.type,
                                line: node.loc.start.line,
                                col: node.loc.start.column,
                                scope: getDeclarationScope(ast, node.loc.start.line, node.left.name)
                            }, taints)
                            track(ast, taints[node.left.name].map((tt) => {
                                return {
                                    name: node.left.name,
                                    ...tt
                                }
                            }), taints)
                        }
                    }
                })
                break;
            case "Identifier":
                AbstractSyntaxTree.walk(t.scope?.scope ? t.scope.scope : ast, (node) => {
                    if (node.type === "VariableDeclarator" && node.init && node.init.type === "Identifier" && node.init.name === t.name) {
                        if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                            addTaint({
                                name: node.id.name,
                                type: node.id.type,
                                line: node.loc.start.line,
                                col: node.loc.start.column,
                                scope: getScope(ast, node.loc.start.line, node.loc.start.column)
                            }, taints)
                            track(ast, taints[node.id.name].map((tt) => {
                                return {
                                    name: node.id.name,
                                    ...tt
                                }
                            }), taints)
                        }
                    } else if ((node.type === "AssignmentExpression" || node.type === "AssignmentPattern") && node.right.type === "Identifier" && node.right.name === t.name) {
                        if (checkIfAfter(node.loc.start.line, node.loc.start.column, t.line, t.col)) {
                            addTaint({
                                name: node.left.name,
                                type: node.left.type,
                                line: node.loc.start.line,
                                col: node.loc.start.column,
                                scope: getDeclarationScope(ast, node.loc.start.line, node.left.name)
                            }, taints)
                            track(ast, taints[node.left.name].map((tt) => {
                                return {
                                    name: node.left.name,
                                    ...tt
                                }
                            }), taints)
                        }
                    }
                })
                break;
        }
    });
}
function getSources(fileAST, sources) {
    // console.log(sources);
    let taint = {}
    for (let source of sources) {
        if (source.pattern) {
            // add all the rules source into taint
            matchPattern(fileAST, source.pattern, taint)
        } else if (source['pattern-inside']) {
            matchPatternInside(fileAST, source["pattern-inside"], taint)
        }
    }
    return taint
}
function getSinks(sinks) {
    let sinksList = []
    if (sinks) {
        for (let sink of sinks) {
            if (sink.pattern) {
                matchSinkPatttern(sink.pattern, sinksList)
            }
        }
    }
    return sinksList
}
function matchSinkPatttern(patternAST, sinks) {
    if (!validPatternSink(patternAST)) {
        // Error Should be made
        return false
    }
    let targetedNode = patternAST.body[0].expression
    let name
    if (targetedNode.callee.type === "Identifier") {
        name = targetedNode.callee.name
    }
    else if (targetedNode.callee.type == "MemberExpression") {
        name = getMemberExpressionName(targetedNode.callee)
    }
    sinks.push({
        name,
        calleType: targetedNode.callee.type
    })
    return sinks

}
function matchPatternInside(fileAST, source) {
    const metaVariables = []
    source.wrappers.forEach((wrapper) => {
        matchWrapper(fileAST, wrapper.pattern, metaVariables)
    })
}
function matchWrapper(fileAST, pattern, metaVariables) {
    let targetedNode
    let AST
    if (pattern.body.length == 1) { // Type 1 (Single Line)
        targetedNode = pattern.body[0]
        AST = fileAST
    } else { // Type 2 (Multi Line)
        AST = createBlockStatement(fileAST)
        targetedNode = createBlockStatement(pattern)
    }
    let match = false
    AbstractSyntaxTree.walk(AST, (node) => {
        if (!match) {
            if (targetedNode.type === 'ExpressionStatement') {
                targetedNode = targetedNode.expression
            }
            if (node.type === targetedNode.type) {
                const childs = {}
                if (matchTypes[targetedNode.type](targetedNode, node, metaVariables, childs)) {
                    match = node.loc.start
                }
            }
        }
    })

    console.log(match)
}
function validPatternSink(patternAST) {
    if (patternAST.body.length > 1) {
        return false
    }
    if (patternAST.body[0].type !== "ExpressionStatement") {
        return false
    }
    if (![
        "CallExpression"
    ].includes(patternAST.body[0].expression.type)) {
        return false
    }
    return true
}

function validPatternSource(patternAST) {
    // console.log(patternAST.body.length);
    if (patternAST.body.length > 1) {
        return false
    }
    if (patternAST.body[0].type !== "ExpressionStatement") {
        return false
    }
    if (![
        "CallExpression",
        "MemberExpression",
        "Identifier"
    ].includes(patternAST.body[0].expression.type)) {
        return false
    }
    return true
}

function getMemberExpressionName(memberExpression) {
    let name = ''
    if (memberExpression.object.type === "MemberExpression") {
        name += getMemberExpressionName(memberExpression.object)
        name += "."
    }
    else if (memberExpression.object.type === "Identifier") {
        name += memberExpression.object.name
        name += '.'
    }
    name += memberExpression.property.name
    return name
}
function matchPattern(fileAST, patternAST, taint) {
    if (!validPatternSource(patternAST)) {
        // Error Should be made
        return false
    }
    let targetedNode = patternAST.body[0].expression
    let name
    switch (targetedNode.type) {
        case "CallExpression":
            if (targetedNode.callee.type === "Identifier") {
                name = targetedNode.callee.name
            }
            else if (targetedNode.callee.type == "MemberExpression") {
                name = getMemberExpressionName(targetedNode.callee)
            }
            break
        case "MemberExpression":
            name = getMemberExpressionName(targetedNode)
            break
        case "Identifier":
            name = targetedNode.name
            break

    }
    if (!taint[name]) {
        taint[name] = []
    }
    taint[name].push({
        type: targetedNode.type
    })
    return taint

}
function report(fileName, info, reports) {
    if (reports.reports[fileName]) {
        reports.reports[fileName].push(info)
    } else {
        reports.reports[fileName] = [info]
    }
}
function checkIfAfter(nodeLine, nodeCol, taintLine, taintCol) {
    if (!taintLine) {
        return true
    }
    if (nodeLine < taintLine) {
        return false
    }
    if (nodeLine == taintLine) {
        if (nodeCol < taintCol) {
            return false
        }
        return true
    }
    return true
}
export default matchTaintRule