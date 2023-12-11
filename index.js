require('dotenv').config()
const express = require('express')
const app = express()
const userRouter = require('./src/routers/user')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const cors = require('cors')

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port= process.env.PORT

app.use(express.json())
// Routers
app.use(userRouter)

app.listen(port, ()=>{
    console.log("server is running on port " + port)
})