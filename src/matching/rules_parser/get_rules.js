import yaml from 'js-yaml'
export default function getRules(rules)
{   
    let rulesJson = []
    rules.forEach(rule => {
        const object = yaml.load(rule)
        rulesJson.push(object)
    });
    return rulesJson
}
