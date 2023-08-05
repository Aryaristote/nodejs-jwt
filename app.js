const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookiesParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const session = require('express-session');

//OTP Auth
require('./auth')
const passport = require('passport');

const app = express();
app.use(session({ secret: 'bolingo kindura', resave: false, saveUninitialized: true, }));
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookiesParser())

// view engine
app.set('view engine', 'ejs'); 

// database connection   
const dbURI = 'mongodb+srv://aristote:test1234@cluster0.mfxjfii.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

//Google auth routes _______________________________________
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
}

app.get('/auth/google', passport.authenticate('google', { scope:['profile', 'email']}));
app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/smoothies',
    failureRedirect: 'auth/failure',
  })
);
app.get('/auth/failure', (req, res) => {
  res.send("Something went wrong ...")
});
app.get('/protected', isLoggedIn, (req, res) => {
  res.render('smoothies')
});


// routes
app.get('*', checkUser) //Apply this middleware to all get routes

app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

//Logout
app.get('/logout', (req, res) => {
  // req.logout();
  // req.session.destroy();
  res.cookie('kinduraCK', '', { maxAge: 1 });
  res.redirect('/');
})

