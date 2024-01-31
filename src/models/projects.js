const pool=require('../database/postgres')
async function createProject({name,url,user_id,config,rules}){
    const client = await pool.connect();
    let timeStamps = new Date().toISOString().slice(0,19).replace('T', ' ')
    const {rows,rowCount}=await client.query('INSERT INTO projects (name,url,user_id,config,last_scan,vuls) VALUES($1,$2,$3,$4,$5,$6) RETURNING *', [name,url,user_id,config,timeStamps,0])
    if(!rowCount) {
        return null
    }
    for(let rule in rules) {
        
        const {rows:rulesrows,rowCount:rulesCounts}=await client.query('SELECT id from rules where id=$1',[rules[rule]])
        if(!rulesCounts) {
            return null
        }
        const {rows:projectrules, rowCount:projectrulesCount}=await client.query('INSERT INTO projects_rules (project_id,rule_id) VALUES ($1,$2) RETURNING project_id',[rows[0].id,rulesrows[0].id])
        if(!projectrulesCount){

            return null
        }
    }
    client.release()
    return rows[0]
}
async function getMyProjects(id) {
    const client=await pool.connect();
    const {rows,rowCount}= await client.query('SELECT * FROM projects WHERE user_id=$1',[id])
    client.release()
    if(rowCount){
        return rows
    }
    return null
}
async function updateVulsNum(id, vulsNum) {
    const client = await pool.connect()
    const {rows, rowCount} = await client.query('UPDATE projects SET vuls = $1 WHERE id = $2', [vulsNum, id])
    client.release()
}
async function updateStatus(status, id) {
    const client = await pool.connect();
    await client.query('UPDATE projects SET status = $1 WHERE id = $2', [status, id])
    client.release()
}
async function updateLastScan(id) {
    const client = await pool.connect();
    let timeStamps = new Date().toISOString().slice(0,19).replace('T', ' ')
    await client.query('UPDATE projects SET last_scan = $1 WHERE id = $2', [timeStamps, id])
    client.release()
}
async function getById(id){
    const client=await pool.connect();
    const {rows,rowCount}= await client.query('SELECT * FROM projects WHERE id=$1',[id])
    client.release()
    if(rowCount){
        return rows[0]
    }
    return null
} 
async function deleteById(id) {
    const client=await pool.connect();
    await client.query('DELETE FROM projects_rules where project_id=$1',[id])
    await client.query('DELETE FROM reports where project_id=$1',[id])
    const {rows:projects,rowCount:projectCount} = await client.query('DELETE FROM projects WHERE id=$1 RETURNING id',[id])
    if(!projectCount){
    return null
    }
    client.release()
    return projects[0]
}
module.exports ={
    createProject,
    getMyProjects,
    getById,
    deleteById,
    updateStatus,
    updateLastScan,
    updateVulsNum
}