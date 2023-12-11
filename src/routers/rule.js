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
    try {
        const client = new ftp.Client()
        await client.access({
            host: "ftp.sirv.com",
            user: process.env.FTP_EMAIL,
            password: process.env.FTP_PASSWORD
        })
        await client.remove(`${ruleName}-${createdBy}`)
        res.send({
            message: "Deleted Succesfully"
        })
        
    }catch (e) {
        console.log(e)
        res.status(500).send({
            message: "Internal Server Error, Please Try Again Later"
        })
    }
})
// Get user rules
router.get('/rules',auth,async (req,res) => {
    const id=req.user.id
    console.log(id)
    const result=await ruleServices.getUserRules(id)
    if(result.message) {
        return res.status(result.statusCode).send({
            message: result.message
        })
    }
    res.send(result)

})
 module.exports = router