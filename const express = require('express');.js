const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookiesParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
//OTP Auth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {Strategy: FacebookStrategy} = require("passport-facebook");
const User = require('./models/User'); 
const expressSession = require('express-session');

const app = express();

// middleware __________________________________________________________________________________________
app.use(express.static('public'));
app.use(express.json());
app.use(cookiesParser())

// view engine _________________________________________________________________________________________
app.set('view engine', 'ejs'); 

// Auth keys ___________________________________________________________________________________________
const GOOGLE_CLIENT_ID = '930100866404-hhne9ted66u588sjlpkv1itilfke8qtt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const FACEBOOK_CLIENT_ID = '242277198685649';
const FACEBOOK_CLIENT_SECRET = '5ef0b8d7b4910cba1fb6b78ba9d83b72';

//Google strategy ______________________________________________________________________________________
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/google',
}, (accessToken, refreshToken, profile, callback) => {
  User.findOrCreate(profile.id)
  .then((user) => {
    return callback(null, user);
  })
  .catch((err) => {
    return callback(err, null);
  });
}))

//Facebook strategy ____________________________________________________________________________________
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: '/facebook',
  profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback) => {
  callback(null, profile)
}))

passport.serializeUser((user, callback) => {
  callback(null, user);
})

passport.deserializeUser((user, callback) => {
  callback(null, user);
})

app.use(expressSession({
  secret: 'bolingoKindura',
  resave: true,
  saveUninitialized: true
}))

// Initialize Passport and set it up for session management
app.use(passport.initialize());
app.use(passport.session());

// API Google & Facebook connection _____________________________________________________________________
app.get('/login/google', passport.authenticate('google', {scope:['profile email']}));
app.get('/login/facebook', passport.authenticate('facebook', {scope:['email']}));

app.get('/google', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
})
app.get('/facebook', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
})

// database connection __________________________________________________________________________________
const dbURI = 'mongodb+srv://aryaristote:test1234@cluster1.docqw0s.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));



// routes _______________________________________________________________________________________________
app.get('*', checkUser) //Apply this middleware to all get routes

app.get('/', (req, res) => {
  res.render('home')
  // res.send(req.user? req.user: "Not logged in, Log with faceboo / GMail")
});
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)