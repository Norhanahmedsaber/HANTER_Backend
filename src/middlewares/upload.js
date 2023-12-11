const multer =require ('multer')
const util =require('util')
const path =require('path')
const { generateErrorMessage } = require('../services/utils/user')
const storage = multer.diskStorage({
    destination:function(req,rule,cb)
    {
        cb(null,path.resolve("./rules"))
    },
    filename:function(req,file,cb)
    {
        if(file.originalname.split('.').pop()!=='yml' && file.originalname.split('.').pop()!=='yaml')
        {
            cb(new Error("Invalid extension"), req.body.name)
            return
        }
        cb(null,req.body.name+'-'+req.user.id+'.'+file.originalname.split('.').pop()) 
        
    },
})

    let uploadRule=multer({
        storage,
        
    }).single('rule')

module.exports=util.promisify(uploadRule)