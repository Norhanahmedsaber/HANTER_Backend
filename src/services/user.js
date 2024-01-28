const User = require ('../models/user')
const generateToken = require('../utils/genrateToken')
const userUtils = require('../utils/accountFields')
const {Octokit} = require("@octokit/rest")
const octokit = new Octokit() 


async function signIn ({email, password}) {

    // Checks if the email or password are missing
    if(!email || !password) {
        return userUtils.generateErrorMessage(400, "Missing Required Fields")
    }
    const user = await User.signIn({
        email:email.toLowerCase().trim(),
        password
    })
    if(!user) {
        return userUtils.generateErrorMessage(404, "Authentication Failed: Email or Password not Correct")
    }
    generateToken(user)
    return {
        value: user
    }
    
    
}
async function signUp ({ firstName, lastName, email, password, githubAccount }) {
    if(!firstName || !lastName || !email || !password) {
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
    if (await User.isEmailExists(email.toLowerCase())) {
        //Email already exists
        return userUtils.generateErrorMessage(400, "Email Already In Use")
    }
    const encryptedpassword = userUtils.ecncryptPassword(password)
    const user = await User.signUp({
        firstName:firstName.toLowerCase().trim(),
        lastName:lastName.toLowerCase().trim(),
        email:email.toLowerCase().trim(),
        encryptedpassword,
    })
    if(!user) {
        return userUtils.generateErrorMessage(500, "An Error Has Occured")
    }
    generateToken(user)
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
async function getProfile(id) {
    const user = await User.getById(id)
    if(!user) {
        return userUtils.generateErrorMessage(404, "User Doesn't exist")
    }
    return {
        value: user
    }
}

async function updateUser(githubUsername,id){
    if(! (await usernameValid(githubUsername))){
         return userUtils.generateErrorMessage(400,"Invalid Username")
    }
    const user = await User.update(githubUsername.username,id)
    if(user){
        return user
    }else {
        return  userUtils.generateErrorMessage(500,"Internal Server Error")
    }
}
async function usernameValid(github_account){
    try {
        const {data:repos}=await octokit.repos.listForUser(github_account)
        return true
    }
    catch(err)
    {
        return false
    }
}
module.exports = {
    signUp,
    signIn,
    getById,
    getProfile,
    updateUser
}