const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const xssClean = require('xss-clean');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connexion DDB
mongoose.connect(`mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER_DB}.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Express app
const app = express();

// Headers CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Helmet
app.use(helmet());

// BodyParser
app.use(bodyParser.json());

// Request limiter 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(apiLimiter);

// Protection xss
app.use(xssClean());


// Folder images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;