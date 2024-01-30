import fs from 'fs'
export default function extract(filePath)
{
    try{
        let data = fs.readFileSync(filePath , 'utf-8')
        return data
    }catch(err){
        // our error
        console.log(err)
    }
}