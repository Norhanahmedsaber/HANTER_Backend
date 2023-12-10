const User = require ('../models/user')
const userUtils = require('./utils/user')


async function signIn ({email, password}) {

    // Checks if the email or password are missing
    if(!email || !password) {
        return userUtils.generateErrorMessage(400, "Missing Required Fields")
    }
    const user = await User.signIn({
        email,
        password
    })
    if(!user) {
        return userUtils.generateErrorMessage(404, "Authentication Failed: Email or Password not Correct")
    }
    return {
        value: user
    }
}
async function signUp ({ firstName, lastName, email, password, githubAccount }) {

    if(!firstName || !lastName || !email || !password || !githubAccount) {
        // Invalid or missing Data
        return userUtils.generateErrorMessage(400, "Missing Required Data")
    }
    if (!userUtils.isEmail(email)) {
        // Invalid Email
        return userUtils.generateErrorMessage(400, "Invalid Email Format")
    }
    if (!userUtils.isPassword(password)) {
        // Password must contain
        return userUtils.generateErrorMessage(400, "Password must contain : at least 8 characters contain unique chaaracter contain uppercase letter")
    }
    if (await User.isEmailExists(email)) {
        //Email already exists
        return userUtils.generateErrorMessage(400, "Email Already In Use")
    }
    const user= await User.signUp({ firstName, lastName, email, password, githubAccount })
    if(!user) {
        return userUtils.generateErrorMessage(500, "An Error Has Occured")
    }
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