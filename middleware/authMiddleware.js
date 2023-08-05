const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.kinduraCK;

    //Checking if the web token exist & valide
    if(token){
        jwt.verify(token, 'bolingo kindura', (err, decodedToken) => {
            if(err){
                console.log(err.message) 
                res.redirect('/login');
            }else{
                console.log(decodedToken)
                next();
            }
        });
    }else{
        res.redirect('/login')
    }
}

//Check current user
const checkUser = (req, res, next) => {  
    const token = req.cookies.kinduraCK;

    //Checking if the web token exist & valide
    if(token){
        jwt.verify(token, 'bolingo kindura', async (err, decodedToken) => {
            if(err){
                console.log(err)
                res.locals.user = null;
                next()
            }else{
                // id passed as payload when store cookie 
                let userData = await User.findById(decodedToken.id)
                //Inject data into in view (in the var user)
                res.locals.user = userData;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };