const express = require('express')
const userServices = require ('../services/user')
const router = new express.Router()

// Sign In
router.post("/signin", async (req,res)=> {
    const payload = {
        email: req.body.email,
        password: req.body.password
    }
    const user = await userServices.signIn(payload)

    if(user) {
        return res.send(user)
    }
    // User not Found
    return res.status(404).send({
        message: 'Authentication Failed: Email or Password not Correct'
    })
})

// Sign Up
router.post("/signup", async (req,res)=> {
    const payload = {
     user : req.body,
    }
    const user = await userServices.signUp(payload)
    
    if (user) { 
        return res.send(user)
    }
    // Invalid or missing Data
    return res.status(404).send({
        message: 'Invalid or missing data'
    })
})

module.exports = router