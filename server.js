const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDb = require('./config/connectDb')


//configure dotenv file
dotenv.config()

//database call
connectDb()

//rest object
const app = express()

//middleware
app.use(express.json())

//routes
const rt = require('./routes/routes')
app.use('/',rt)


//port 
const PORT = 8080

//listening server
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

