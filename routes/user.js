const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const { body, validationResult } = require('express-validator');
const middlewareValidation = require('../middleware/validator');

// USER ROUTES
router.post('/signup',
body('email').isEmail(), body('password').isLength({ min: 5 }), 
middlewareValidation.inputValidator, userCtrl.signup);

router.post('/login', 
body('email').isEmail(), body('password').isLength({ min: 5 }), 
middlewareValidation.inputValidator, userCtrl.login);


module.exports = router;

