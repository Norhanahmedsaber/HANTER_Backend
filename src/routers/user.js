const express = require('express')
const user = require ('../services/user')
const router = new express.Router()

//signin
router.post("/signin", async (req,res)=> {
    const username=req.body.username;
    const password=req.body.password;
    const user = await user.signin(username,password)
})

//signUp
router.post("/signUp", async (req,res)=> {
    const user = req.body;
    await user.signup(user)
})
