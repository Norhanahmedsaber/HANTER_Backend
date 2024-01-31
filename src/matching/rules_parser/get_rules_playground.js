import yaml from 'js-yaml'
export default function getRules(rule)
{   
    return yaml.load(rule)
}
