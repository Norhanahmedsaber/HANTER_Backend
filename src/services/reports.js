const Reports = require('../models/reports')
const { generateErrorMessage } = require('../utils/accountFields')

async function getReports(projectId)
{
    const reports = await Reports.getReports(projectId)
    if(!reports)
    {
        generateErrorMessage(400 , "Reports not exists")
    }
    return {value:reports}
}
module.exports={
    getReports
}