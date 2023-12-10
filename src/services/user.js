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
async function getById(id) {
    if(!id) {
        return userUtils.generateErrorMessage(400, "User ID is Required")
    }
    if(isNaN(id)) {
        return userUtils.generateErrorMessage(400, "User ID Must be of Type Integer")
    }
    const user = await User.getById(id);
    if(!user) {
        return userUtils.generateErrorMessage(404, "User Doesn't Exist")
    }
    return {
        value: user
    }
}
module.exports = {
    signUp,
    signIn,
    getById
}