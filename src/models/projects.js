const pool=require('../database/postgres')
async function createProject({name,url,user_id,config,rules}){
    const client = await pool.connect();
    const {rows,rowCount}=await client.query('INSERT INTO projects (name,url,user_id,config) VALUES($1,$2,$3,$4) RETURNING *', [name,url,user_id,config])
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
    const {rows,rowCount}=await client.query('DELETE FROM projects_rules where project_id=$1',[id])
    if(rowCount) {
       const {rows:projects,rowCount:projectCount} = await client.query('DELETE FROM projects WHERE id=$1 RETURNING id',[id])
       if(!projectCount){
        return null
       }
       client.release()
       return projects[0]
    }
}
module.exports ={
    createProject,
    getMyProjects,
    getById,
    deleteById
}