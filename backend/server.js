require('dotenv').config();
const cors = require('cors');



const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
//importing routes
const groupRoute = require('./routes/groupRoute');
const subjectRoute = require('./routes/subjectRoute');
const userRoutes = require('./routes/userRoutes');
const uploadRoute = require('./routes/uploadRoute');

const app = express();
console.log(process.env.JWT_SECRET);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(morgan('dev')); // Middleware to log HTTP requests to the console
app.use(express.urlencoded({ extended: true }));

mongoose
  // .connect(process.env.MONGO_URI, {}) // connect("mongodb://localhost:27017/LOCALDB", {})
  .connect('mongodb://127.0.0.1:27017/login_data', {})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to MongoDB');
      console.log(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


app.use(cors());

// mounting route middlewares
app.use('/api/group/', groupRoute);
app.use('/api/subject/', subjectRoute);
app.use('/api/files/', uploadRoute);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('<p>Server is working</p>');
});
