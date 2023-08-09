const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes')
const authRoute = require("./routes/auth")
const passportSetup = require("./passport")
const cookiesParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

//Usage
const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

app.use(session({ secret: 'Bolingo@defaultpass', resave: false, saveUninitialized: true, }));
app.use(passport.initialize());
app.use(passport.session());

//Frontend access port
app.use(cors({
  origin: "http://localhost:5000",
  methods: "GET,POST,PATCH,PUT,DELETE",
  credentials: true,
}))

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookiesParser())

// view engine
app.set('view engine', 'ejs'); 

// database connection 
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

// routes
app.get('*', checkUser) //Apply this middleware to all get routes

app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes) //Login with Forms
app.use(authRoute); //Login with Auth

//Logout
app.get('/logout', (req, res) => {
  res.cookie('fAuth', '', { maxAge: 1 });
  res.redirect('/');
})

