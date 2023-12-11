const pool = require('../database/postgres')

async function createRepo(url){
    const client = pool.connect()

    const {rows , rowCount} = await client.query('INSERT INTO repos (url) '+
    'VALUES ($1) RETURNING id , url , user_id' , [url])
    client.release()
    if(rowCount)
    {
        return rows[0]
    }
    return null
}