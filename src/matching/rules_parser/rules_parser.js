import { parseScript } from '../meryiah/src/meriyah.js';
export default function parseRule(rule) {
    if (rule.type === "taint") {
        rule["pattern-sources"] = parseSources(rule["pattern-sources"])
        rule["pattern-sinks"] = parseContainer(rule["pattern-sinks"])
        if(rule["pattern-saintizers"]) {
            rule["pattern-saintizers"] = parseContainer(rule["pattern-saintizers"])
        }
    } else if (!rule.type || rule.type === "normal") {
        rule.type = "normal"
        for (let key of Object.keys(rule)) {
            if (key == "pattern" || key == "pattern-not") {
                rule[key] = parsePattern(rule[key])
            }
            else if (key == "pattern-either" || key == "patterns") {
                rule[key] = parseContainer(rule[key])
            }
        }
    }
    return rule
}
function parseSources(container) {
    for (let i in container) {
        if (container[i].pattern) {
            container[i].pattern = parsePattern(container[i].pattern)
        } else if (container[i]['pattern-inside']) {
            container[i]['pattern-inside'] = parsePatternInside(container[i]['pattern-inside'])
        }
    }
    return container
}
function parsePatternInside(container) {
    container['wrappers']=parseContainer(container['wrappers'])
    container['wrapped']=parseContainer(container['wrapped'])
    return container
}
function parseContainer(container) {
    for (let i in container) {
        if (container[i].pattern) {
            container[i].pattern = parsePattern(container[i].pattern)
        } else if (container[i]['pattern-not']) {
            container[i]['pattern-not'] = parsePattern(container[i]['pattern-not'])
        } else if (container[i].patterns) {
            container[i].patterns = parseContainer(container[i].patterns)
        } else if (container[i]['pattern-either']) {
            container[i]['pattern-either'] = parseContainer(container[i]['pattern-either'])
        }
    }
    return container
}
function parsePattern(rule) {
    try {
        return parseScript(rule)
    }
    catch (err) {
        console.log(err)
    }
}