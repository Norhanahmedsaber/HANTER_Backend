const AbstractSyntaxTree = require("abstract-syntax-tree")
const { generateErrorMessage } = require("../utils/accountFields")
const {checkRuleSyntax} = require('../utils/CheckRule')
const { default: hanter } = require("../matchingLib/matchPlayground")
function run(source, rule) {
    if(!validSource(source)) {
        return generateErrorMessage(400, "Source is Not Valid")
    }
    if(!validRule(rule)) {
        return generateErrorMessage(400, "Rule Syntax is Not Valid")
    }
    return hanter(source, rule)

}
function validSource(source) {
    try {
        AbstractSyntaxTree.parse(source)
        return true
    }catch (e) {
        return false
    }
}
function validRule(rule) {
    if(!checkRuleSyntax(rule)) {
        return false
    }
    return true
}
module.exports = {
    run
}