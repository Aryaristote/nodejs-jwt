const bcrypt = require('bcrypt');
const authG = require('jsonwebtoken');
const passport = require('passport'); 
const User = require("./models/User");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = '930100866404-hhne9ted66u588sjlpkv1itilfke8qtt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true, 
        cookieName: 'GoogleLog',
    },
    async function(request, accessToken, refreshToken, profile, done) {
        let user;

        try {
           // Check if the user already exists in the database
            user = await User.findOne({ googleId: profile.id });
            if (user) {
                console.log('User already exists:');
                return done(null, user);
            } else {
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash('Bolingo@defaultpass', saltRounds);
                newUser.password = hashedPassword;
                const savedUser = await newUser.save(); // Saving data
    
                // Generate the JWT token with the expiresIn option set
                const secretKey = 'Bolingo@defaultpass'; // Replace with your actual secret key
                const token = authG.sign({ userId: savedUser._id }, secretKey, { expiresIn: '1d' });
                request.res.cookie('authG', token, { httpOnly: true, maxAge: 31536000000 }); // Max age set to 1 day in milliseconds
    
                return done(null, savedUser);
            }
        } catch (error) {
            // Handle the error gracefully
            if (error.code === 11000) {
                console.log('User with this email already exists. Please log in.');
                // Generate the JWT token with the expiresIn option set
                const secretKey = 'Bolingo@defaultpass';
                const token = authG.sign({ userId: profile.id }, secretKey, { expiresIn: '1d' });
                request.res.cookie('authG', token, { httpOnly: true, maxAge: 31536000000 });
    
                return request.res.redirect('/smoothies');
            } else {
                // Other errors
                console.error('Error while saving user:', error);
                return done(error, false); // Return false to indicate authentication failure
            }
        }
    }
)); 

passport.serializeUser((user, done) => {
    done(null, user);
})
  
  passport.deserializeUser((user, done) => {
    done(null, user);
})