const express = require('express')
const router=new express.Router()
const auth =require ('../middlewares/auth')
const uploadRule =require('../middlewares/upload')
const ruleServices = require('../services/rule')
const ftp = require('basic-ftp')
const {Readable} = require('stream')

// create rule (uploaded file)
router.post('/rules', auth, async(req, res) => {
    const ruleName = req.body.name
    const createdBy = req.user.id
    if(!req.files) {
        return res.status(400).send({
            message: "No File Uploaded"
        })
    }
    if(!req.files.rule) {
        return res.status(400).send({
            message: "No File Uploaded"
        })
    }
    const rule = req.files.rule
    try {
        const result = await ruleServices.addRule(rule, ruleName, createdBy)
        if(result.message) {
            return res.status(result.statusCode).send({
                message: result.message
            })
        }
        res.send(result)
    }catch (e) {
        console.log(e)
        res.status(500).send({
            message: "Internal Server Error, Please Try Again Later"
        })
    }
})
//create rule with string
router.post('/rule' ,auth , async(req ,res)=>{
    const ruleName = req.body.name
    const createdBy = req.user.id
    const content = req.body.content
    try{
        const result = await ruleServices.addRuleString(ruleName , createdBy , content)
        if(result.message){
            return res.status(result.statusCode).send({
                message: result.message
            })
        }
        res.send(result)
    }catch(e){
        console.log(e)
        res.status(500).send({
            message: "Internal Server Error, Please Try Again Later"
        })
    }

})

router.delete('/rules/:uuid', auth, async (req, res) => {
    const uuid = req.params.uuid
    const userId = req.user.id
    const result=await ruleServices.deleteRule(uuid, userId)
    if(result.message) {
        return res.status(result.statusCode).send({
            message: result.message
        })
    }
    res.send({
        message: "Deleted Successfully"
    })
})
// Get user rules
router.get('/rules',auth,async (req,res) => {
    const id = req.user.id
    const result = await ruleServices.getUserRules(id)
    if(result.message) {
        return res.status(result.statusCode).send({
            message: result.message
        })
    }
    res.send(result)
})

router.get('/rules/:id' ,auth, async(req ,res)=>{
    const id = req.params.id
    const userId=req.user.id
    const result = await ruleServices.getCustomRule(id,userId)
    if(result.message){
        return res.status(result.statusCode).send({
            message:result.message
        })
    }
    res.send(result)

})
router.get('/system', async (req, res) => {

    try {
        const rules = await ruleServices.getSystemRules()
        res.send(rules)
    }catch(e) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
})

module.exports = router
