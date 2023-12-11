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
async function getbyUserId(id) {
    const client =await pool.connect();
    const {rows,rowCount}=await client.query("SELECT * FROM rules where created_by =$1",[id])
    client.release()
    if(rowCount) {
        return rows
    }
}
async function deleteRule(name,id) {

    const client =await pool.connect();
    const {rows,rowCount}=await client.query('DELETE FROM "rules" WHERE name=$1 AND created_by =$2 ',[name,id])
    client.release()
    if(rowCount) {
        return rowCount
    }
}
async function isExisted(name,createdBy){
    const client=await pool.connect();
    const {rowCount} = await client.query("SELECT id FROM rules where name=$1 AND created_by=$2",[name,createdBy])
    client.release()
    if(rowCount) {
        return rowCount
    }
}
module.exports = {
    createRule,
    getbyUserId,
    deleteRule,
    isExisted
}