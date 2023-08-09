const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors")
const passportSetup = require("./passport")
const passport = require("passport");
const authRoute = require("./routes/auth")
const app = express();
const session = require('express-session');

app.use(session({ 
    secret: 'Bolingo@defaultpass', 
    resave: false, 
    saveUninitialized: true, 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
)

app.get('/', (req, res) => {
    res.send("Love in Air");
})

app.use(authRoute);

app.listen("3000", ()=>{
    console.log("server is running!")
})