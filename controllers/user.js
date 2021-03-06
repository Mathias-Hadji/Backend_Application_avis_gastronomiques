const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const passwordValidator = require('../models/Password-validator')


exports.signup = (req, res, next) => {
    const checkPassword = passwordValidator.validate(req.body.password)
    if(checkPassword == false){
        return res.status(401).json({error: 'Password must have minimum length 8, maximum length 100, uppercase letters, lowercase letters, 2 digits'})
    }
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: CryptoJS.SHA1(req.body.email).toString(),
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur enregistré !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};


exports.login = (req, res, next) => {
    User.findOne({email: CryptoJS.SHA1(req.body.email).toString()})
    .then(user => {
        if(!user){
            return res.status(401).json({error: 'Utilisateur non trouvé !'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({error: 'Mot de passe incorrect !'})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    process.env.USER_TOKEN,
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
