const Reports = require('../models/reports')
const { generateErrorMessage } = require('../utils/accountFields')
const reportUtil = require('../utils/displayRports')

async function getReports(projectId)
{
    let reports = await Reports.getReports(projectId)
    reports = reportUtil.sortReports(reports)
    if(!reports)
    {
        generateErrorMessage(400 , "Reports not exists")
    }
    return {value:reports}
}
module.exports={
    getReports
}