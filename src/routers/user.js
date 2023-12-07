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
        firstName : req.body.firstName ,
        lastName : req.body.lastName ,
        password : req.body.password ,
        githubAccount : req.body.githubAccount,
        email : req.body.email
    }
    const result = await userServices.signUp(payload)
    if (result.value) { 
        return res.send(result.value)
    }
    switch (result.status) {
        case 0:
            // Invalid or missing Data
            return res.status(404).send({
                message: 'Missing data'
            })
        case 1:
            // Invalid Email
            return res.status(404).send({
                message: 'Invalid Email'
            })
        case 2: 
            // Password must contain
            return res.status(404).send({
                message: 'Password must contain :'
            })
        case 3: 
            // Password must contain
            return res.status(404).send({
                message: 'Email is already exist'
            })
    }
})

module.exports = router