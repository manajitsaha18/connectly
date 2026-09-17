const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authUser(req, res, next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized-no token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: 'Unauthorized-invalid token' });
        }

        const user = await userModel.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({ message: 'Unauthorized-user not found' });
        }

        req.user = user;
        next();

    }catch(err){
        console.log(err);
        return res.status(401).json({ message: 'internal server error' });
    }
}

module.exports = {authUser};