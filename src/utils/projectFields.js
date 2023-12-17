const Rule = require('../models/rule')
const { generateErrorMessage } = require('./accountFields')
async function isValidProject({name,url,user_id,config,rules}) {
    for (let rule in rules) {
        if(!(await Rule.isExistById(rules[rule]))) {
            return generateErrorMessage(400,"Provided Rules donot exist")
        }
    }
    return true
}
module.exports={
   isValidProject
}