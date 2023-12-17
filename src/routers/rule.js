const express = require('express')
const router=new express.Router()
const auth =require ('../middlewares/auth')
const uploadRule =require('../middlewares/upload')
const ruleServices = require('../services/rule')
const ftp = require('basic-ftp')
const {Readable} = require('stream')


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
router.delete('/rules', auth, async (req, res) => {
    const ruleName = req.body.name
    const createdBy = req.user.id
    const result=await ruleServices.deleteRule(ruleName,createdBy)
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

router.get('/rules/:id' , async(req ,res)=>{
    const id = req.params.id
    const result = await ruleServices.getCustomRule(id)
    if(result.message){
        return res.status(result.statusCode).send({
            message:result.message
        })
    }
    res.send(result)

})
router.get('/rules/system', async (req, res) => {

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
