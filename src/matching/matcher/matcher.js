import AbstractSyntaxTree from 'abstract-syntax-tree'
import evaluate from "./evaluate.js"
import matchTypes from './matchingAlgorithms2.js'
import { createBlockStatement } from './helpers.js'
export default function match(file, rules, reports) {
    for(let rule of rules) {
        matchRule(file, rule, reports)
    }
}

function matchRule({name:fileName, ast}, rule, reports) {
    const logicBlock = createLogicContainer(rule, ast)
    const match = evaluate(logicBlock)
    if (match){
        reports.reports.push( {filepath:fileName, line:match.line, col:match.column, rule_name:rule.id} )
    }
}

function matchPattern(fileAST, pattern) {
    let targetedNode
    let AST
    if(pattern.pattern) {
        if(pattern.pattern.body.length == 1) { // Type 1 (Single Line)
            targetedNode = pattern.pattern.body[0]
            AST = fileAST
        }else { // Type 2 (Multi Line)
            AST = createBlockStatement(fileAST)
            targetedNode = createBlockStatement(pattern.pattern)
        }
    }else {
        if(pattern['pattern-not'].body.length == 1) { // Type 1 (Single Line)
            AST = fileAST
            targetedNode = pattern['pattern-not'].body[0]
        }else { // Type 2 (Multi Line)
            AST = createBlockStatement(fileAST)
            targetedNode = createBlockStatement(pattern['pattern-not'])
        }
    }
    let match = false
    AbstractSyntaxTree.walk(AST, (node) => {
        if(!match) {
            if(targetedNode.type === 'ExpressionStatement') {
                targetedNode = targetedNode.expression
            }
            if(node.type === targetedNode.type) {
                if(matchTypes[targetedNode.type](targetedNode, node)) {
                    match = node.loc.start
                }
            }
        }
    })
    
    return match
}
function report(fileName, info, reports) {
    if(reports.reports[fileName]) {
        reports.reports[fileName].push(info)
    }else {
        reports.reports[fileName] = [info]
    }
}

function createLogicContainer(rule, ast) {
    return processPattern(rule, ast);
}

function processPattern(rule, ast) {
    if(rule.patterns) {
        return {
            type: "AND",
            value: rule.patterns.map(p => processPattern(p, ast))
        }
    }else if(rule['pattern-either']) {
        return {
            type: "OR",
            value: rule['pattern-either'].map(p => processPattern(p, ast))
        }
    }else {
        return convertSinglePattern(rule, ast)
    }
}
function convertSinglePattern(pattern, ast) {
    if (pattern.pattern) {
        return { type: 'pattern', value: matchPattern(ast, pattern) }; // Placeholder for actual pattern match
    } else if (pattern['pattern-not']) {
        return { type: 'pattern', value: !matchPattern(ast, pattern) }; // Placeholder for pattern not match
    }
    // Add more conditions here for other pattern types like pattern-inside, pattern-regex, etc.
}
