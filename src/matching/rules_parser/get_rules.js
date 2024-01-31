import yaml from 'js-yaml'
export default function getRules(rules)
{   
    const parsedRules = []
    rules.forEach(element => {
        parsedRules.push(yaml.load(element))
    });
    return parsedRules
}
