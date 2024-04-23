import AbstractSyntaxTree from 'abstract-syntax-tree'
import evaluate from "./evaluate.js"
import matchTypes from './matchingAlgorithms3.js'
import { createBlockStatement } from './helpers.js'
import matchNormalRule from './normal/normal.js'
import matchTaintRule from './taint/taint.js'
export default function match(file, rules, reports) {
    // console.log(file.ast.body[0].declarations[0])
    for(let rule of rules) {
        if(rule.type === "normal") {
            matchNormalRule(file, rule, reports)
        }else {
            matchTaintRule(file, rule, reports)
        }
    }
}
