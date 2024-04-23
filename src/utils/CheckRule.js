const yaml = require('js-yaml')

//checkpattern1=>type="normal"

function getPattern(ruleJson) {
    delete (ruleJson.id)
    delete (ruleJson.severity)
    delete (ruleJson.message)
    delete (ruleJson.type)
    delete (ruleJson.language)
    return ruleJson
}

function checkpattern1(filteredRule) {
    if (filteredRule.pattern) {
        if (typeof filteredRule.pattern !== "string") {
            return false
        }
        return true
    }
    if (filteredRule['pattern-not']) {
        if (!(typeof filteredRule['pattern-not'] === "string")) {
            return false
        }
        return true
    }
    if (filteredRule.patterns) {
        if (typeof filteredRule.patterns !== "object") {
            return false
        }
        for (let index in filteredRule.patterns) {
            if (!checkpattern1(filteredRule.patterns[index])) {
                return false
            }
        }
        return true
    }
    if (filteredRule['pattern-either']) {
        if (!(typeof filteredRule['pattern-either'] === "object")) {
            return false
        }
        for (let index in filteredRule['pattern-either']) {
            if (!checkpattern1(filteredRule['pattern-either'][index])) {
                return false
            }
        }
        return true
    }
    return false
}
function checkpattern2(filteredRule) {
    // TODO
    return true
}

function checkRuleSyntax(content) {
    try {
        const ruleJson = yaml.load(content)
        if (!ruleJson.id || !ruleJson.message) {
            return false
        }
        if (!ruleJson.type) {
            ruleJson.type = "normal"
        }
        if (!ruleJson.severity) {
            ruleJson.severity = "Error"
        }
        if (ruleJson.type == "normal") {
            const filteredRule = getPattern(ruleJson)
            if (Object.keys(filteredRule).length !== 1) {
                return false
            }
            if (!checkpattern1(filteredRule)) {
                return false
            }
        } else if (ruleJson.type == "taint") {
            const filteredRule = getPattern(ruleJson)
            if (!checkpattern2(filteredRule)) {
                return false
            }
        }


        return true
    } catch (err) {
        return false
    }
}
module.exports = {
    checkRuleSyntax
}