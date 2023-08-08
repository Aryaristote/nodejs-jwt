const bcrypt = require('bcrypt');
const authG = require('jsonwebtoken');
const passport = require('passport'); 
const User = require("./models/User");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const GOOGLE_CLIENT_ID = '930100866404-hhne9ted66u588sjlpkv1itilfke8qtt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

GITHUB_CLIENT_ID = " Iv1.e82a8bc427c242a5";
GITHUB_CLIENT_SECRET = "9c1629abbf3c4f0150f9bafc15092cbea4a9010f";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/google/callback",
  passReqToCallback: true, 
  cookieName: 'GoogleLog',
},
function (accessToken, refreshToken, profile, done) {
  done(null, profile);
}
)); 

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})