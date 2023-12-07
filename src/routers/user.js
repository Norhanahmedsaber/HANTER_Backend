const express = require('express')
const user = require ('../services/user')
const router = new express.Router()

//signin
router.post("/signin", async (req,res)=> {
    const username=req.body.username;
    const password=req.body.password;
    const user = await user.signIn(username,password)
})

//signUp
router.post("/signup", async (req,res)=> {
    const user = req.body;
    await user.signup(user)
})
