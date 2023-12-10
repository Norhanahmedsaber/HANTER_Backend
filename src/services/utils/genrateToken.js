const jwt = require("jsonwebtoken")
require('dotenv').config()

function generateToken(user) {
    const token = jwt.sign({
        id:user.id, 
        email:user.email
    }, process.env.SECRET , {
        expiresIn:'24h'
    })
    user.token = token
}

module.exports = generateToken