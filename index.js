require('dotenv').config()
const express = require('express')
const app = express()
const user = require ('./routers/user')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const port= process.env.PORT

//userRouter
app.use(user)

app.listen(port, ()=>{
    console.log("server is running on port " + port)
})