const jwt = require("jsonwebtoken")
require('dotenv').config()

function generateToken (user) {
    const token = jwt.sign({id:user.id , email:user.email} ,process.env.SECRET)
    user.token = token
    return user 
}

module.exports=generateToken