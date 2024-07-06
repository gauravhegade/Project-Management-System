require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

//importing routes
const groupRoute = require('./routes/groupRoute')
const subjectRoute = require('./routes/subjectRoute')
const fileRoute = require('./routes/fileRoute')

const app = express();

app.use(express.json());    // Middleware to parse JSON bodies
app.use(morgan("dev"));     // Middleware to log HTTP requests to the console
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/LOCALDB", {})     // connect("mongodb://localhost:27017/LOCALDB", {})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('Connected to MongoDB');
        console.log(`Listening to port ${process.env.PORT}`)
    })
})
.catch((error)=>{console.log(error)});

// mounting route middlewares 
app.use('/api/group/',groupRoute)
app.use('/api/subject/',subjectRoute)
app.use('/api/files/',fileRoute)

process.env

