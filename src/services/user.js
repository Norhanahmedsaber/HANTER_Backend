const User = require ('../models/user')
const userUtils=require('./utils/user')


async function signIn ({email, password}) {

    // Checks if the email or password are missing
    if(!email || !password) {
        return {
            status: 0
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
        return {
            status: 0
        }
    }
    if (!userUtils.isEmail(email)) {
        return {
            status: 1 
        }
    }
    if (!userUtils.isPassword(password)) {
        return {
            status: 2
        }
    }
    if (User.isEmailExists(email)) {
        return {
            status: 3
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