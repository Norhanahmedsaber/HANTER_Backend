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

async function signUp({ firstName, lastName, email, encryptedpassword }) {
    const client = await pool.connect();
    const { rows, rowCount } = await client.query('INSERT INTO users (first_name, last_name, email, password) ' + 
                                        'VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
                                        [firstName, lastName, email, encryptedpassword])

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
    const { rows, rowCount } = await client.query('SELECT email FROM users WHERE email = $1', [email])
    client.release()
    if(rowCount) {
        return true
    }else return false
}

async function update(github_account,id){
    const client= await pool.connect();
    const {rows ,rowCount}=await client.query('UPDATE users SET github_account=$1 WHERE id=$2',[github_account,id])
    client.release()
    if(!rowCount){
        return false
    }
    return true
}

module.exports = {
    signIn,
    signUp,
    isEmailExists,
    getById,
    update
}