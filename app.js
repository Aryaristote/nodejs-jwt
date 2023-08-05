const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookiesParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookiesParser())

// view engine
app.set('view engine', 'ejs'); 

// database connection    mongodb+srv://aryaristote:test1234@@cluster1.docqw0s.mongodb.net/?retryWrites=true&w=majority
const dbURI = 'mongodb+srv://aristote:test1234@cluster0.mfxjfii.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser) //Apply this middleware to all get routes

app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

