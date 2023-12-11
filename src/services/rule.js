const Rule = require('../models/rule')
const { generateErrorMessage } = require('../utils/accountFields')
const yaml = require('js-yaml')
const ftp = require('basic-ftp')
const {Readable} = require('stream')
async function addRule(rule, ruleName,createdBy) {
    const uploaded = await upload(rule, ruleName, createdBy)
    if(uploaded.message) {
        return generateErrorMessage(uploaded.statusCode, uploaded.message)
    }
    const result = Rule.createRule(ruleName, createdBy, uploaded)
    if(!result) {
        return generateErrorMessage(500, "Database Error")
    }
    return result
}
async function upload(rule, ruleName, createdBy) {
    if(!isValidExtenstion(rule.name)) {
        return generateErrorMessage(400, "Invalid Extension")
    }
    if(!isValidYaml(rule.data?.toString('utf-8'))) {
        return generateErrorMessage(400, "Invalid rule Syntax")
    }
    const client = new ftp.Client()
    await client.access({
        host: "ftp.sirv.com",
        user: process.env.FTP_EMAIL,
        password: process.env.FTP_PASSWORD
    })
    await client.upload(Readable.from(rule.data), `${ruleName}-${createdBy}`)
    return 'https://hanter.sirv.com/'+`${ruleName}-${createdBy}`
}
function isValidExtenstion(ruleName) {
    const extenstion = ruleName.split('.').pop()
    return extenstion === 'yaml' || extenstion === 'yml'
}
function isValidYaml(text) {
    // todo
    try {
        const loadedFile = yaml.load(text)
        if(typeof loadedFile !== 'object'){
            return false
        }
        return true
    }catch(e) {
        return false
    }
}
 async function getUserRules(id) {
    const rules = await Rule.getbyUserId(id)
    if(!rules) {
       return generateErrorMessage(404,"User has no rules")
    }
    return rules
}

async function deleteRule(name,id) {
    try {
        const client = new ftp.Client()
        await client.access({
            host: "ftp.sirv.com",
            user: process.env.FTP_EMAIL,
            password: process.env.FTP_PASSWORD
        })
        const ruleName=`${name}-${id}`
        await client.remove(ruleName)
        const result = await Rule.deleteRule(name,id)
        if(result) {
            return {
                value: result
            }
        }
        return generateErrorMessage (500,"Database error")
        
    }catch (e) {
        console.log(e)
        return generateErrorMessage(500,"Internal Server Error, Please Try Again Later")
    }
}
module.exports= {
    addRule,
    getUserRules,
    deleteRule
}