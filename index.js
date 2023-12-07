const express = require('express')
require('dotenv').config()
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port= process.env.PORT

app.post('/users/{id}', (req,res)=> {
    const payload = {
        name: req.body.name
    }
    res.send('HANTER')
})
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})