const express = require('express')
const router=new express.Router()
const auth =require ('../middlewares/auth')
const uploadRule =require('../middlewares/upload')
const ruleServices = require('../services/rule')

//Upload
router.post("/upload", auth, async(req,res)=>{
    uploadRule(req,res,(err)=>{
        if(err)
        {
            return res.status(400).send({
                message: err.message
            })
        }
    })
    res.send({
        message: "Uploaded"
    })
})
//Add to database 
router.post('/rules', auth, async (req, res) => {
    const ruleName = req.body.name
    const createdBy = req.user.id
    const result = await ruleServices.addRule(ruleName,createdBy)
    if(result.message) {
        return res.status(result.statusCode).send({
            message: result.message
        })
    }
    res.send(result)
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