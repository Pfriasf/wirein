const passport = require("passport");
const mongoose = require("mongoose");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const User = require("../models/User.model");

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user) => next(null, user))
    .catch(next);
});

//local 

passport.use(
  "local-auth",
  new LocalStrategy({
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, next) => {
      User.findOne({
          email: email,
        })
        .then((user) => {
          if (!user) {
            next(null, false, {
              error: "The email address or password is incorrect",
            });
          } else {
            return user.checkPassword(password).then((match) => {
              if (match) {
                if (user.active) {
                  next(null, user);
                } else {
                  next(null, false, {
                    error: "Check Your email to activate your account",
                  });
                }
              } else {
                next(null, false, {
                  error: "The email address or password is incorrects",
                });
              }
            });
          }
        })
        .catch(next);
    }
  )
);

//facebook

passport.use(
  "facebook-auth",
  new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI || "/authenticate/facebook/cb",
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, next) => {
      const facebookID = profile.id;
      const email = profile.emails[0].value;
      const username = profile.username ? profile.username : email.split("@")[0] + Math.floor(10 + Math.random() * 90)

      if (facebookID && email) {
        User.findOne({
            $or: [{
              email: email
            }, {
              "social.facebook": facebookID
            }]
          })
          .then((user) => {
            if (!user) {
              User.create({
                username,
                email: email,
                password: "Aa1" + mongoose.Types.ObjectId(),
                social: {
                  facebook: facebookID,
                },
                active: true,
                activationToken: "active",
              }).then((newUser) => {
                next(null, newUser);
              });
            } else {
              next(null, user);
            }
          })
          .catch(next);
      } else {
        next(null, null, {
          error: "Error connecting with Facebook"
        });
      }
    }
  )
);

//google

passport.use(
  "google-auth",
  new GoogleStrategy({
      clientID: process.env.G_CLIENT_ID,
      clientSecret: process.env.G_CLIENT_SECRET,
      callbackURL: process.env.G_REDIRECT_URI || "/authenticate/google/cb",
    },
    (accessToken, refreshToken, profile, next) => {
      const googleID = profile.id;
      const email = profile.emails[0] ? profile.emails[0].value : undefined;
      const username = profile.name.givenName + profile.name.familyName + Math.floor(10 + Math.random() * 90)

      if (googleID && email) {
        User.findOne({
            $or: [{
              email: email
            }, {
              "social.google": googleID
            }]
          })
          .then((user) => {
            if (!user) {
              const newUserInstance = new User({
                username,
                email,
                password: "Aa1" + mongoose.Types.ObjectId(),
                social: {
                  google: googleID,
                },
                active: true,
                activationToken: "active",
              });

              return newUserInstance
                .save()
                .then((newUser) => next(null, newUser));
            } else {
              next(null, user);
            }
          })
          .catch(next);
      } else {
        next(null, null, {
          error: "Error connecting with Google OAuth"
        });
      }
    }
  )
);

//twitter 

passport.use(
  "twitter-auth",
  new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_REDIRECT_URI || "/authenticate/twitter/cb",
      includeEmail: true,
    },
    (accessToken, refreshToken, profile, next) => {
      const twitterID = profile.id;
      const email = profile.emails[0].value;
      const username = profile.username;

      if (twitterID && email) {
        User.findOne({
            $or: [{
              email: email
            }, {
              "social.twitter": twitterID
            }],
          })
          .then((user) => {
            if (!user) {
              const newUserInstance = new User({
                username,
                email,
                password: "Aa1" + mongoose.Types.ObjectId(),
                social: {
                  twitter: twitterID,
                },
                active: true,
                activationToken: "active",
              });

              return newUserInstance
                .save()
                .then((newUser) => next(null, newUser));
            } else {
              next(null, user);
            }
          })
          .catch(next);
      } else {
        next(null, null, {
          error: "Error connecting with Twitter OAuth"
        });
      }
    }
  )
);