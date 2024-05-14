const express = require ('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Reports = require('../services/reports')
const reportModel = require('../models/reports')
const playGroundService = require('../services/playground')
router.get('/reports/:id' , auth ,  async (req,res)=>{
    try{
        const projectId = req.params.id
        const result = await Reports.getReports(projectId)
        if(result.message)
        {
            res.status(result.statusCode).send({
                message:result.message
            })
        }
        res.send(result.value)
    }catch(err)
    {
        console.log(err)
        res.status(400).send({
            message:"Internal Several Error"
        })
    }

})

router.post('/reports' , async(req,res)=>{
    try{
        const reports = req.body.reports
        const project_id = req.body.project_id
        const result = await reportModel.insertReports(reports , project_id)
        if(!result)
        {
            res.status(400).send({
                message: "no result"
            })
        }
        res.send("done")

    }catch(err){
        console.log(err)
        res.send("Internal Server error")
    }
})
router.post('/playground', async (req, res) => {
    const source = req.body.source
    const rule = req.body.rule
    const result = await playGroundService.run(source, rule)
    if(result.message) {
        return res.status(result.statusCode).send({
            message: result.message,
            loc: {
                line: result.line,
                col: result.col
            }
        })
    }else {
        return res.send(result)
    }
})

module.exports= router