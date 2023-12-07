const express = require('express')
const userServices = require ('../services/user')
const router = new express.Router()

//signin
router.post("/signin", async (req,res)=> {
    console.log(req.body)
    const username=req.body.username;
    const password=req.body.password;
    const user = await userServices.signIn(username,password)
    res.send(user)
})

//signUp
router.post("/signup", async (req,res)=> {
    const user = req.body;
    console.log(req.body)
    res.send(await userServices.signUp(user))
})

module.exports = router