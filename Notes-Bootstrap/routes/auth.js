const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const userHelper = require('../controller/user-helper');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:3000/auth/google/callback`
},
  async function (accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });


    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      profileImage: profile.photos[0].value,
      email: profile.emails[0].value
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

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/')
    }
  });
});

router.post('/signup', (req, res) => {
  userHelper.doSignUp(req.body).then((response) => {
    //console.log(response);
    req.session.user = {
      id: response._id,
      email: response.email,
      name: response.displayName
    };
    res.redirect('/dashboard');

  })
});

router.post('/login', (req, res) => {
  try {
    const response = userHelper.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.user = {
          id: response.user._id,
          email: response.user.email,
          firstName: response.user.displayName
        };
        //console.log(req.session.user);
        res.redirect('/dashboard');
      } else {
        res.redirect('/login')
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/login');
  }

})

passport.serializeUser((user, done) => {
  done(null, user.id);
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








module.exports = router;