const passport = require('passport'); 
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
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    // });
  }
)); 

passport.serializeUser((user, done) => {
    done(null, user);
})
  
  passport.deserializeUser((user, done) => {
    done(null, user);
})