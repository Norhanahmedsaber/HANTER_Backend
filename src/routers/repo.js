const express = require("express")
const router = express.Router()
const repoServices = require("../services/repo")
const auth = require('../middlewares/auth')

router.post("/repos" , auth, async(req , res)=>{
    const url = req.body.url
    const userId = req.user.id 
    const result = await repoServices.createRepo(url, userId)
    if(result.value){
        return res.send(result.value)
    }
    res.status(result.statusCode).send({
        message: result.message
    })

})

module.exports = router