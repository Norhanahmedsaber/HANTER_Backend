const Rule = require('../models/rule')
const { generateErrorMessage } = require('../utils/accountFields')
const yaml = require('js-yaml')
const ftp = require('basic-ftp')
const { Readable } = require('stream')
const fs = require ('fs')
const path = require('path')
const {v4: uuidv4} = require('uuid')
async function addRule(rule, ruleName,createdBy) {
    if(await ruleExist(ruleName,createdBy)){
        return generateErrorMessage(400,"Rule already exists")
    }
    const id = uuidv4()
    const uploaded = await upload(rule, id)
    if(uploaded.message) {
        return generateErrorMessage(uploaded.statusCode, uploaded.message)
    }
    const result = Rule.createRule(ruleName, createdBy, uploaded, id)
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
    const uuid = uuidv4()
    await client.uploadFrom(path.resolve('/tmp'+ruleName+'-'+createdBy+'.yml') , uuid)
    const url = 'https://hanter.sirv.com/' + uuid
    const result = Rule.createRule(ruleName , createdBy , url, uuid)
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
    await client.upload(Readable.from(rule.data), id)
    return 'https://hanter.sirv.com/' + id
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

async function getCustomRule (uuid,userId){
    const result = await Rule.getById(uuid)
    if(!result) {
        return generateErrorMessage(400, "Not Found")
    }
    if(userId!==result.created_by) {
        return generateErrorMessage(401,"Not Authorized")
    }   
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
    await client.downloadTo(path.resolve(`./tmp/${result.uuid}.yml`) , result.uuid)
    const rule = fs.readFileSync(path.resolve('./tmp/' + result.uuid + '.yml'),{encoding:'utf-8'})
    fs.unlinkSync(path.resolve('./tmp/' + result.uuid + '.yml'))
    return{
        ...result,
        value: rule
    }
}

async function deleteRule(uuid) {
    if(!await ruleExist(uuid)){
        return generateErrorMessage(404,"rule not found")
    }
    try {
        const client = new ftp.Client()
        await client.access({
            host: "ftp.sirv.com",
            user: process.env.FTP_EMAIL,
            password: process.env.FTP_PASSWORD
        })
        await client.remove(uuid)
        const result = await Rule.deleteRule(uuid)
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

async function ruleExist(uuid){   
    console.log(await checkSystemExistence(uuid))
    console.log(await checkDbExistence(uuid))
    if (!await checkSystemExistence(uuid) && !await checkDbExistence(uuid)) {
        return false
    }
    return true
 }
 async function checkDbExistence(uuid){
    const result = await Rule.isExisted(uuid)
    if(!result){
        return false
    }
    return true
 }
 function generateName(name,createdBy){
    return `${name}-${createdBy}`
 }
 async function checkSystemExistence(uuid){
    const client = new ftp.Client()
    await client.access({
        host: "ftp.sirv.com",
        user: process.env.FTP_EMAIL,
        password: process.env.FTP_PASSWORD
    })
    const files = await client.list('./')
    let exists=false
    files.forEach((file)=>{
        console.log(uuid, file.name)
        if(uuid===file.name){
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