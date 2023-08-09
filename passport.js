const bcrypt = require('bcrypt');
const authG = require('jsonwebtoken');
const passport = require('passport'); 
const User = require("./models/User");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
  scope: ['profile', 'email'],
},
async function(request, identifier, accessToken, refreshToken, profile, done) {
  let user;

  try {
     // Check if the user already exists in the database
      user = await User.findOne({ googleId: profile.id });
      if (user) {
          console.log('User already exists:');
          return done(null, user);
      } else {
        console.log("Love in air: ", profile)
        // if (profile && profile.emails && profile.emails.length > 0) {
          // const newUser = new User({
          //     googleId: profile.id,
          //     name: profile.displayName,
          //     email: profile.emails[0].value,
          //     phoneNumber: profile.phone,
          // });
          // const saltRounds = 10;
          // const hashedPassword = await bcrypt.hash('Bolingo@defaultpass', saltRounds);
          // newUser.password = hashedPassword;
          // const savedUser = await newUser.save(); // Saving data

          // // Generate the JWT token with the expiresIn option set
          // const secretKey = 'Bolingo@defaultpass'; // Replace with your actual secret key
          // const token = authG.sign({ userId: savedUser._id }, secretKey, { expiresIn: '1d' });
          // request.res.cookie('authG', token, { httpOnly: true, maxAge: 31536000000 }); // Max age set to 1 day in milliseconds

          // return done(null, savedUser);
      //   } else {
      //     console.log("Profile or emails not properly defined.");
      //     // Handle the case where user data is incomplete (e.g., redirect to an error page)
      // }
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

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/facebook/callback",
      profileFields: ['id', 'displayName', 'emails'],
    },
    async function (accessToken, refreshToken, profile, done) {
      let user;

      try {
        // Check if the user already exists in the database
          user = await User.findOne({ facebookId: profile.id });
          if (user) {
              console.log('User already exists:');
              return done(null, user);
          } else {
            const newUser = new User({
              facebookId: profile.id,
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
            request.res.cookie('authG', token, { httpOnly: true, maxAge: 31536000000 }); // Max age set to 1 day in millisecond
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
              console.error('Error while saving user:', error);
              return done(error, false); 
          }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})