import match from './matcher/matcher.js'
import parse from './parser/parser.js'
import getFiles from './file_traverser/file_traverser.js'
import extract from './extractor/extractor.js'
import parseConfig from './utils/parsingconfig.js'
import getRules from './rules_parser/get_rules.js'

import parseRule from './rules_parser/rules_parser.js'


export default function hanter(projectId, rules, config){
    const rulesAsObjects = getRules(rules)
    for(let rule of rulesAsObjects) {
        rule = parseRule(rule)
    }
    const sourceFiles = getFiles('./' + projectId, parseConfig(config))
    const reports = {reports: []}
    for(let file of sourceFiles) {
        match({
            name: file,
            ast: parse(extract(file))
        }, rulesAsObjects, reports)
    }
    return reports.reports
    //report(Errors.error1)
}