const User = require ('../models/user')
const userUtils=require('./utils/user')


async function signIn ({email, password}) {

    // Checks if the email or password are missing
    if(!email || !password) {
        // User not Found
        return {
            status: 404,
            message:'Authentication Failed: Email or Password not Correct'
        }
    }
    const user = await User.signIn({
        email,
        password
    })
    return {
        value: user
    }
}
async function signUp ({ firstName, lastName, email, password, githubAccount }) {
    if(!firstName || !lastName || !email || !password || !githubAccount) {
        // Invalid or missing Data
        return {
            status: 404,
             message: 'Missing data'
        }
    }
    if (!userUtils.isEmail(email)) {
        // Invalid Email
        return {
            status: 404,
            message:'Invalid mail' 
        }
    }
    if (!userUtils.isPassword(password)) {
        // Password must contain
        return {
            status: 404,
            message:'Password must contain : at least 8 characters contain unique chaaracter contain uppercase letter'
        }
    }
    if (User.isEmailExists(email)) {
        //Email already exists
        return {
            status: 404,
            message:'Email already exists'
        }
    }
    const user= await User.signUp({ firstName, lastName, email, password, githubAccount })
    return  {
        value: user
    }
}

module.exports = {
    signUp,
    signIn
}