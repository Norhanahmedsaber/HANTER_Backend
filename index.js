require('dotenv').config()
const express = require('express')
const app = express()
const userRouter = require('./src/routers/user')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const cors = require('cors')
const rulesRouter=require('./src/routers/rule')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const projectsRouter = require('./src/routers/projects')
const reportRouter = require('./src/routers/reports')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port= process.env.PORT
app.use(cors({
    origin: ['https://hanter-meer.onrender.com', '*']
}))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

// Routers
app.use(userRouter)
app.use(rulesRouter)
app.use(projectsRouter)
app.use(reportRouter)
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})