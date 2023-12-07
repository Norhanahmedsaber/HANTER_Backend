const jwt = require ('jsonwebtoken')
require('dotenv').config()
const User = require('../Models/User');

const auth = async (req , res , next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ' ,'')
        const decoded = jwt.verify(token , process.env.SECRET)
        
    }catch(error)
    {
        res.status(401).send({error:"user not authorized"})
    }
}