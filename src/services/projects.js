const Project=require('../models/projects')
const { generateErrorMessage } = require('../utils/accountFields')
const { isValidProject } = require('../utils/projectFields')


async function addProject({name,url,user_id,config,rules}) {
    const projectValidation = await isValidProject({name,url,user_id,config,rules})
    if(projectValidation.message) {
        return generateErrorMessage(projectValidation.statusCode,projectValidation.message) 
    }
    const project=await Project.createProject({name,url,user_id,config,rules})
    if(!project) {
        return generateErrorMessage(500,'Database error')
    }
    return {
        value:project
    }
}
module.exports={
    addProject
}