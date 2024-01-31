const Project = require('../models/projects')
const Rule = require('../models/rule')
const Report = require('../models/reports')
const { generateErrorMessage } = require('../utils/accountFields')
const { isValidProject } = require('../utils/projectFields')
const shell = require('shelljs')
const path = require('path')
const { default: hanter } = require('../matchingLib')
const fs = require('fs')
async function checkGitHubRepo(url) {
    // Extract the owner and repo name from the URL
    const pathMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!pathMatch) {
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
            return true;
        } else {
            // The repository might not exist or is private
            return false;
        }
    } catch (error) {
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
    scanProject(project.id, rules, config, url)
    return {
        value: project
    }
}
async function scanProject(id, rules, config, url) {
    try {
        await Project.updateStatus("PENDING", id)
        const parsedRules = await prepareProject(id, url, rules)
        const reports = hanter(id, parsedRules, config)
        await Report.insertReports(reports, id)
        await Project.updateVulsNum(id, reports.length)
        await deleteRepo(id)
        await Project.updateStatus("DONE", id)
        await Project.updateLastScan(id)
    }catch (err) {
        console.log(err)
        Project.updateStatus("FAILED", id)
    }
}
async function prepareProject(id, url, rules) {
    await clone(id, url)
    return await downloadRules(rules)
}
async function downloadRules(rulesIds) {
    const rulesAsObjects = await Rule.getByIds(rulesIds)
    const rules = []
    for(let rule of rulesAsObjects) {
        const response = await fetch(rule.url)
        const result = await response.text()
        rules.push(result)
    }
    return rules
}
async function clone(id, url) {
    const dirPath = path.resolve(path.dirname('./'), './repos')
    shell.cd(dirPath)
    shell.exec('git clone ' + url + ' ' + id) 
}
async function deleteRepo(id) {
    fs.rmdirSync(path.resolve(path.dirname('./'), './' + id), {
        recursive: true,
        force: true
    })
}
var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
          var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
      }
  };
async function getMyProjects(id) {
    const result = await Project.getMyProjects(id)
    if (!result) {
        return generateErrorMessage(404, "Projects not found")
    }
    //console.log(result)

    for (let project of result) {
        // Calculate the difference between the current date and the old last_scan value
        const oldDate = new Date(project.last_scan);
        const currentDate = new Date();
        const diffInSeconds = Math.floor((currentDate - oldDate) / 1000) - 7200;  // MINUS 2 HRS because of time zone hussien and anas
        const diffInMinutes = Math.floor(diffInSeconds / 60); 
        const diffInHours = Math.floor(diffInMinutes / 60); 
        const diffInDays = Math.floor(diffInHours / 24); 
        const diffInWeeks = Math.floor(diffInDays / 7); 
        const diffInMonths = Math.floor(diffInDays / 30); 
        const diffInYears = Math.floor(diffInDays / 365); 
        if (diffInYears >= 1) { 
            project.last_scan = `${diffInYears} years ago`;
        } else if (diffInMonths >= 1) { 
            project.last_scan = `${diffInMonths} months ago`;
        } else if (diffInWeeks >= 1) { 
            project.last_scan = `${diffInWeeks} weeks ago`;
        } else if (diffInDays >= 1) { 
            project.last_scan = `${diffInDays} days ago`;
        } else if (diffInHours >= 1) {
            project.last_scan = `${diffInHours} hours ago`;
        } else if (diffInMinutes >= 1) { 
            project.last_scan = `${diffInMinutes} minutes ago`;
        } else {
            project.last_scan = `${diffInSeconds} seconds ago`;
        }
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
    console.log(result)
    return {
        value: "deleted successfuly"
    }
}
function validateConfigString(inputString) {
    // This will replace all single quotes with double quotes in the string
    // It also handles escaped single quotes inside the strings
    const publicArray = ["js", "jsx"]; 
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
    deleteById,
    clone
}


