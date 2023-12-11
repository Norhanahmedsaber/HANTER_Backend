const Rule = require('../models/rule')
const { generateErrorMessage } = require('./utils/user')
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
        yaml.load(text)
        return true
    }catch(e) {
        return false
    }
}
module.exports= {
    addRule
}