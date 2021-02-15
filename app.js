const express = require('express');
const userRoutes = require('./routes/user');


const app = express();


app.use('/api/auth', userRoutes);


module.exports = app;