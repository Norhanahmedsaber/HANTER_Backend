const url = require("url")
const dns = require("dns")
const { generateErrorMessage } = require("../utils/accountFields")
const { error } = require("console")
const Repo = require("../models/repo")

async function createRepo(repoURL, userId)
{
    const parsedUrl = url.parse(repoURL)
    if(!parsedUrl.hostname){
        return generateErrorMessage(400 , "Invalid URL")
    }
    // todo Verify url
    const result = await Repo.createRepo(repoURL, userId)
    if(result) {
        return {
            value: result
        }
    }
    return generateErrorMessage(500, "Internal Server Error")
}

module.exports = {
    createRepo
}
