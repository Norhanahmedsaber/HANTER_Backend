const Project = require('../models/projects')
const { generateErrorMessage } = require('../utils/accountFields')
const { isValidProject } = require('../utils/projectFields')

async function checkGitHubRepo(url) {
    // Extract the owner and repo name from the URL
    const pathMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!pathMatch) {
        console.log('Invalid GitHub URL');
        return false;
    }

    const owner = pathMatch[1];
    const repo = pathMatch[2];

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            // The repository is public and the URL is valid
            console.log('Valid and public GitHub repository');
            return true;
        } else {
            // The repository might not exist or is private
            console.log('Repository not found or is private');
            return false;
        }
    } catch (error) {
        console.error('Error checking repository:', error);
        return false;
    }
}

async function addProject({ name, url, user_id, config, rules }) {
    const projectValidation = await isValidProject({ name, url, user_id, config, rules })

    const isValidUrl = await checkGitHubRepo(url)
    if (!isValidUrl) {
        return generateErrorMessage(400 ,'The repository is not public. Proceed with the next steps.');
    }
    if(!validateConfigString(config)){
        return generateErrorMessage(400 ,'Config is in wrong form');
    }



    if (projectValidation.message) {
        return generateErrorMessage(projectValidation.statusCode, projectValidation.message)
    }
    const project = await Project.createProject({ name, url, user_id, config, rules })
    if (!project) {
        return generateErrorMessage(500, 'Database error')
    }
    return {
        value: project
    }
}
async function getMyProjects(id) {
    const result = await Project.getMyProjects(id)
    if (!result) {
        return generateErrorMessage(404, "Projects not found")
    }
    return {
        value: result
    }
}
async function getById(id, userId) {
    const result = await Project.getById(id)
    if (!result) {
        return generateErrorMessage(404, "Project not found")
    }
    if (userId !== result.user_id) {
        return generateErrorMessage(401, "Not Authorized")
    }
    return {
        value: result
    }
}
async function deleteById(id, userId) {
    let result = await Project.getById(id)
    if (!result) {
        return generateErrorMessage(404, "Project not found")
    }
    if (userId !== result.user_id) {
        return generateErrorMessage(401, "Not Authorized")
    }
    result = await Project.deleteById(id)
    return {
        value: "deleted successfuly"
    }
}



function validateConfigString(inputString) {
    // This will replace all single quotes with double quotes in the string
    // It also handles escaped single quotes inside the strings
    const publicArray = ["js"]; 
    let jsonString = inputString.replace(/'/g, '"');

    let config;

    try {
        config = JSON.parse(jsonString);
    } catch (error) {
        return false;
    }

    const stringArrayProperties = [
        "exculdeRules",
        "exculdeRulesDirs",
        "ignoredDirs",
        "extensions",
        "ignoredPatterns"
    ];


    const isArrayOfStrings = (array) => 
        Array.isArray(array) && array.every(item => typeof item === "string");

    

    for (const prop of stringArrayProperties) {
        if (config.hasOwnProperty(prop)) {
            if (!isArrayOfStrings(config[prop])) {
                return false;
            }
        }
    }


    if (config.hasOwnProperty('extensions')) {
        for (let extension of config.extensions) {
            if (!publicArray.includes(extension)) {
                return false; 
            }
        }
    }
    
    


    // If all validations pass
    return true;
}


module.exports = {
    addProject,
    getMyProjects,
    getById,
    deleteById
}


