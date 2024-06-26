require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URI)     // connect("mongodb://localhost:27017/LOCALDB", {})
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log('Connected to MongoDB');
            console.log(`Listening to port ${process.env.PORT}`)
        })
    })
    .catch((error)=>{console.log(error)});

process.env

