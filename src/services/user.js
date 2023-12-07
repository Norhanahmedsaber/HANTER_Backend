const User = require ('../models/user')
async function signIn ({email, password}) {
    if(!email || !password) {
        return null
    }
    const user = await User.signIn({
        email,
        password
    })
    return user
}
async function signUp ({ firstName, lastName, email, password, githubAccount }) {
    return await User.signUp({ firstName, lastName, email, password, githubAccount })
}

module.exports = {
    signUp,
    signIn
}