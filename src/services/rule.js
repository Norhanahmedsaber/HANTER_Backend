const Rule = require('../models/rule')
const { generateErrorMessage } = require('./utils/user')
const multer =require ('multer')
const path = require('path')
const fs= require('fs')
const yaml = require('js-yaml')
async function addRule(ruleName,createdBy) {
    const result = validate(ruleName+'-'+createdBy)
    if(result) {
        return generateErrorMessage(result.statusCode, result.message)
    }
    const rule = await Rule.createRule(ruleName, createdBy, `./rules/${ruleName}`)
    if(rule) {
        return rule
    }
    return generateErrorMessage(500, 'Database Error')
}
function validate(fileName) {
    let text
    try{
        text = fs.readFileSync(path.resolve(path.join('./rules',fileName+'.yml')),{ encoding: 'utf-8' })
        if(!text) {
            text = fs.readFileSync(path.resolve(path.join('./rules',fileName+'.yaml')),{ encoding: 'utf-8' })
        }
    }catch(e) {
        return generateErrorMessage(400,'File Might Be Empty')
    }
    try{
        yaml.load(text)
    }catch(e)
    {
        console.log(e)
        deleteFile(fileName)
        return generateErrorMessage(400,'Invalid yaml syntax')
    }
    // validation of rule structure

}
function deleteFile(fileName) {
    const filePath = path.resolve(path.join('./rules',fileName+'.yml'))
    fs.unlinkSync(filePath)
}
 async function getUserRules(id) {
    const rules = await Rule.getbyUserId(id)
    if(!rules) {
       return generateErrorMessage(404,"User has no rules")
    }
    return rules
}
module.exports= {
    addRule,
    getUserRules
}