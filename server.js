require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log('Connected to MongoDB');
            console.log(`Listening to port ${process.env.PORT}`)
        })
    })
    .catch((error)=>{console.log(error)});

process.env

