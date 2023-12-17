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
module.exports ={
    createProject
}