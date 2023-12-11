const url = require("url")
const dns = require("dns")
const { generateErrorMessage } = require("../utils/accountFields")
const { error } = require("console")

async function createRepo(url)
{
    const parsedUrl = url.parse(url)
    if(!parsedUrl.hostname){
        return generateErrorMessage(400 , "Invalid URl")
    }
    dns.lookup(parsedUrl.hostname , (error , address , family)=>{
        if(error){
            return generateErrorMessage(400 ,"Couldn't Find Domain")
        }
    })
}
