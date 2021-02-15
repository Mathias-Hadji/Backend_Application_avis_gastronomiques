const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
        const userId = decodedToken.user_id;
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable !';
        } else{
            next();
        }
    } catch{
        res.status(401).json({error: new Error('Invalid request !')});
    }
};