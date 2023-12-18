const Rule = require('../models/rule')
const { generateErrorMessage } = require('../utils/accountFields')
const yaml = require('js-yaml')
const ftp = require('basic-ftp')
const { Readable } = require('stream')
const fs = require ('fs')
const path = require('path')
async function addRule(rule, ruleName,createdBy) {
    if(await ruleExist(ruleName,createdBy)){
        return generateErrorMessage(400,"Rule already exists")
    }
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
async function addRuleString(ruleName , createdBy , rule){
    if(await ruleExist(ruleName,createdBy)){
        return generateErrorMessage(400,"Rule already exists")
    }
    fs.writeFileSync(path.resolve('/tmp'+ruleName+'-'+createdBy+'.yml'),rule)
    const client = new ftp.Client()
    await client.access({
        host: "ftp.sirv.com",
        user: process.env.FTP_EMAIL,
        password: process.env.FTP_PASSWORD
    })
    await client.uploadFrom(path.resolve('/tmp'+ruleName+'-'+createdBy+'.yml') , generateName(ruleName , createdBy))
    const url = 'https://hanter.sirv.com/' + generateName(ruleName,createdBy)
    const result = Rule.createRule(ruleName , createdBy , url)
    if(!result){
        return generateErrorMessage(500 , 'DataBase Error')
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
    await client.upload(Readable.from(rule.data), generateName(ruleName,createdBy))
    return 'https://hanter.sirv.com/'+generateName(ruleName,createdBy)
}
function isValidExtenstion(ruleName) {
    const extenstion = ruleName.split('.').pop()
    return extenstion === 'yaml' || extenstion === 'yml'
}
function isValidYaml(text) {
    // todo
   return true
}
 async function getUserRules(id) {
    const rules = await Rule.getbyUserId(id)
    if(!rules) {
       return generateErrorMessage(404,"User has no rules")
    }
    return rules
}

async function getCustomRule (id){
    const result = await Rule.getById(id)
    if(!result)
    {
       return generateErrorMessage(404 , "Rule doesn't exist")
    }
    if(!result.created_by){
        const rule = fs.readFileSync(path.resolve('./rules/'+result.name+'.yml'),{encoding:'utf-8'})
        return {
            value:rule
        }
    }
    const client = new ftp.Client()
    await client.access({
        host: "ftp.sirv.com",
        user: process.env.FTP_EMAIL,
        password: process.env.FTP_PASSWORD
    })
    await client.downloadTo(path.resolve(`./tmp/${result.name + "-" + result.created_by}.yml`) , result.name + "-" + result.created_by)
    const rule = fs.readFileSync(path.resolve('./tmp/'+result.name+'-'+result.created_by+'.yml'),{encoding:'utf-8'})
    fs.unlinkSync(path.resolve('./tmp/'+result.name+'-'+result.created_by+'.yml'))
    return{
        value:rule
    }
}

async function deleteRule(name,id) {
    if(!await ruleExist(name,id)){
        return generateErrorMessage(404,"rule not found")
    }
    try {
        const client = new ftp.Client()
        await client.access({
            host: "ftp.sirv.com",
            user: process.env.FTP_EMAIL,
            password: process.env.FTP_PASSWORD
        })
        const ruleName=generateName(name,id)
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

async function ruleExist(name,createdBy){    
    if (!await checkSystemExistence(name,createdBy) && !await checkDbExistence(name,createdBy)) {
        return false
    }
    return true
 }
 async function checkDbExistence(name,createdBy){
    const result = await Rule.isExisted(name,createdBy)
    if(!result){
        return false
    }
    return true
 }
 function generateName(name,createdBy){
    return `${name}-${createdBy}`
 }
 async function checkSystemExistence(name,createdBy){
    generateName(name,createdBy)
    const client = new ftp.Client()
    await client.access({
        host: "ftp.sirv.com",
        user: process.env.FTP_EMAIL,
        password: process.env.FTP_PASSWORD
    })
    const files = await client.list('./')
    let exists=false
    files.forEach((file)=>{
        if(generateName(name,createdBy)===file.name){
            exists=true
        }
    })

    return exists
 }

async function getSystemRules() {
    const rules = await Rule.getSystemRules()
    return rules
}

module.exports= {
    addRule,
    getUserRules,
    deleteRule,
    getCustomRule,
    getSystemRules,
    addRuleString
}