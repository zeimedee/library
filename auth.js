const jwt = require('jsonwebtoken');

const key = require('./secret');


const auth =(req,res, next) =>{
    try {
        const token = req.header('Authorization');
        if(!token) return res.status(401).json({token: 'no token found'});

        const verify = jwt.verify(token , key);
        if(!verify) return res.status(401).json({verify: 'verification failed'});

        next()

        
    } catch (err) {
        res.status(500).json({err:err.message})
        
    }
}

module.exports = auth;