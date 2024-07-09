require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


//importing routes
const groupRoute = require('./routes/groupRoute');
const subjectRoute = require('./routes/subjectRoute');
const userRoutes = require('./routes/userRoutes');


const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(morgan('dev')); // Middleware to log HTTP requests to the console

mongoose
  // .connect(process.env.MONGO_URI, {}) // connect("mongodb://localhost:27017/LOCALDB", {})
  .connect('mongodb://localhost:27017/', {})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to MongoDB');
      console.log(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get('/', (req, res) => {
  res.send('<p>Server is working</p>');
});

// mounting route middlewares
app.use('/api/group/', groupRoute);
app.use('/api/subject/', subjectRoute);
app.use('/user', userRoutes);

process.env;