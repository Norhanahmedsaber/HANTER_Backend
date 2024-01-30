import match from './matcher/matcher.js'
import parse from './parser/parser.js'
import getFiles from './file_traverser/file_traverser.js'
import extract from './extractor/extractor.js'
import parseConfig from './utils/parsingconfig.js'
import getRules from './rules_parser/get_rules.js'

import parseRule from './rules_parser/rules_parser.js'


export default function hanter(source, rule){
    let ruleAsObject = getRules(rule)
    ruleAsObject = parseRule(ruleAsObject)
    const reports = {reports: []}
    match({
        name: "playground",
        ast: parse(source)
    }, [ruleAsObject], reports)
    if(reports.reports.length > 0) {
        for(let report of reports.reports) {
            report.message = ruleAsObject.message
        }
    }
    return reports.reports
    //report(Errors.error1)
}