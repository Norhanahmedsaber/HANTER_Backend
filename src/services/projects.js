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
async function getMyProjects(id) {
    const result=await Project.getMyProjects(id)
    if(!result) {
        return generateErrorMessage(404,"Projects not found")
    }
    return {
        value:result
    }
}
async function getById(id,userId) {
    const result=await Project.getById(id)
    if(!result) {
        return generateErrorMessage(404,"Project not found")
    }
    if(userId!==result.user_id)
    {
        return generateErrorMessage(401,"Not Authorized")
    }
    return {
        value:result
    }
}


module.exports={
    addProject,
    getMyProjects,
    getById
}