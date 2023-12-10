const express = require('express')
const userServices = require ('../services/user')
const auth = require('../middlewares/auth')
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
})
// Get By ID
router.get('/users/:id', async (req, res) => {
    const id = req.params.id
    const result = await userServices.getById(id)
    if(result.value) {
        return res.send(result.value)
    }
    res.status(result.statusCode).send({
        message: result.message
    })
})
module.exports = router