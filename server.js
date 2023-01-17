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
app.use(express.json()  )

//routes
app.get('/',(req,res) =>{
    res.send("<h1>hello world</h1>")
})

//port 
const PORT = 8080

//listening server
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

//mongodb+srv://smit:SKsk3009@cluster0.giykttw.mongodb.net/task

//mongodb+srv://smit:SKsk3009@cluster0.giykttw.mongodb.net/expensesApp

//mongodb+srv://smit:SKsk3009@cluster0.giykttw.mongodb.net/

//mongodb+srv://smit:SKsk3009@cluster0.giykttw.mongodb.net/expensesApp