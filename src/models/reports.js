const pool = require ("../database/postgres")
const { generateErrorMessage } = require("../utils/accountFields")

async function getReports(projectId)
{
    const client = await pool.connect()
    const {rows , rowCount} = await client.query('SELECT * FROM reports WHERE project_id=$1', [projectId])
    client.release()
    if(!rowCount)
    {
        return null
    }
    
    return rows
}

async function insertReports (reports , project_id)
{
    const client = await pool.connect()
    const result = []
    for(const report of reports)
    {
        const {rows , rowCount} = await client.query('INSERT INTO reports (filepath , line , col , rule_name, message, project_id ) VALUES ($1 , $2 ,$3 ,$4, $5, $6)' , [report.filepath , report.line , report.col , report.rule_name ,report.message, project_id])
        result.push(rows )
    }
    client.release()
    return result

}


module.exports = {
    getReports,
    insertReports
}