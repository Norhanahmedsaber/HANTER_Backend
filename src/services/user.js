const User = require ('../models/user')
async function signIn (email, password) {
    return await User.signIn({
        email,
        password
    })
}
async function signUp ({ firstName, lastName, email, password, githubAccount }) {
    return await User.signUp({ firstName, lastName, email, password, githubAccount })
}

module.exports = {
    signUp,
    signIn
}