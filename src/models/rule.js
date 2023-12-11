const pool=require('../database/postgres')


async function createRule(name, created_by, url) {
    const  client = await pool.connect();
    const {rows, rowCount}=await client.query('INSERT INTO rules (name,url,created_by) ' + 
    'VALUES($1,$2,$3) RETURNING *',[name, url, created_by])
    client.release()
    if(rowCount) {
        return rows[0]
    }
    return null 
}
module.exports = {
    createRule
}