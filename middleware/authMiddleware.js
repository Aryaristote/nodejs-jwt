const fAuth = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.fAuth;
    const gToken = req.cookies.authG;

    //Checking if the web token exist & valide4554
    if(token){
        fAuth.verify(token, 'Bolingo@defaultpass', (err, decodedToken) => {
            if(err){
                console.log(err.message) 
                res.redirect('/login');
            }else{
                console.log(decodedToken)
                next();
            }
        });
    }else if(gToken){
        fAuth.verify(gToken, 'Bolingo@defaultpass', (err, decodedToken) => {
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
    const token = req.cookies.fAuth;

    //Checking if the web token exist & valide
    if(token){
        fAuth.verify(token, 'Bolingo@defaultpass', async (err, decodedToken) => {
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