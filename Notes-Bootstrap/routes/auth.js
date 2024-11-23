const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:3000/auth/google/callback`
},
  async function (accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    //console.log(profile);


    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      profileImage: profile.photos[0].value,
    };

    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        user = await User.create(newUser);
        done(null, user);
      }

    } catch (error) {
      console.log(error);
    }

  }
));


router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });



router.get('/login-failure', (req, res) => {
  res.send('Error while logging in')
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/')
    }
  });
})






module.exports = router;