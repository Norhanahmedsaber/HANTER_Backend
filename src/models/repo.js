const pool = require('../database/postgres')

async function createRepo(url, userId){
    const client = await pool.connect()

    const {rows , rowCount} = await client.query('INSERT INTO repos (url, user_id) '+
    'VALUES ($1, $2) RETURNING *' , [url, userId])
    client.release()
    if(rowCount)
    {
        return rows[0]
    }
    return null
}

module.exports = {
    createRepo
}