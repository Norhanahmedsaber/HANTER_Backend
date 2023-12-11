const pool = require('../database/postgres')
const bcrypt = require('bcrypt')
async function signIn({ email, password }) {
    const client = await pool.connect();

    const { rows } = await client.query('SELECT * ' + 
                                        'FROM users WHERE email = $1', [email])
    client.release()

    if(rows.length) {
        if(bcrypt.compareSync(password, rows[0].password)){
            delete rows[0].password
            return rows[0]
        }
    }
    return null
}

async function signUp({ firstName, lastName, email, encryptedpassword, githubAccount }) {
    const client = await pool.connect();

    const { rows, rowCount } = await client.query('INSERT INTO users (first_name, last_name, email, password, github_account) ' + 
                                        'VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, github_account',
                                        [firstName, lastName, email, encryptedpassword, githubAccount])

    client.release()

    if(rowCount) {
        return rows[0]
    }
    return null
}

async function getById(id) {
    const client = await pool.connect();

    const { rows, rowCount } = await client.query('SELECT id, first_name, last_name, email, github_account ' +
                                                  'FROM users WHERE ID = $1', [id])

    client.release()

    if(rowCount) {
        return rows[0]
    }
    return null
}
// Returns wether an email exists in the database or not
async function isEmailExists(email) {
    
    const client = await pool.connect();
    const { rows } = await client.query('SELECT email FROM users WHERE email = $1', [email])
    client.release()
    return rows.length > 0? true : false
}

module.exports = {
    signIn,
    signUp,
    isEmailExists,
    getById
}