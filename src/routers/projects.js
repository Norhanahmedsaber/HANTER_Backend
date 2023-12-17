const express = require('express')
const router = new express.Router()
const auth= require('../middlewares/auth')
const projectServices = require ('../services/projects')


router.post('/project',auth,async(req,res) => {
    const payload={
         name:req.body.name,
         url:req.body.name,
         user_id:req.user.id,
         config:req.body.config,
         rules:req.body.rules
    }
    try{
        const result =await projectServices.addProject(payload)
        if(result.message) {
            return res.status(result.statusCode).send({
                message: result.message
            })
        }
        res.send(result.value)
    }
    catch(e){
        console.log(e)
        res.status(500).send({
            message: "Internal Server Error, Please Try Again Later"
        })
    }
})

router.get('/project',auth,async(req,res)=>{
    const id=req.user.id
    const result =await projectServices.getMyProjects(id)
    try{ 
        if(result.message) { 
            return res.status(result.statusCode).send({
            message: result.message
        })  
     }
     res.send(result.value)
    }
    catch(e){
        console.log(e)
        res.status(500).send({
            message: "Internal Server Error, Please Try Again Later"
        })
    }
})
router.get('/project/:id',auth,async(req,res)=>{
    const userId=req.user.id
    const id=req.params.id
    const result =await projectServices.getById(id,userId)
    try{ 
        if(result.message) { 
            return res.status(result.statusCode).send({
            message: result.message
        })  
     }
     res.send(result.value)
    }
    catch(e){
        console.log(e)
        res.status(500).send({
            message: "Internal Server Error, Please Try Again Later"
        })
    }
})

module.exports=router