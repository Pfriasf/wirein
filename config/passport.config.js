const passport = require('passport');
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User.model')
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser((id, next) => {
    User.findById(id)
        .then(user => next(null, user))
        .catch(next);
});

passport.use('local-auth', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, next) => {
    console.log('use passport')
    User.findOne({
            email: email
        })
        .then((user) => {
            if (!user) {
                next(null, false, {
                    error: "The email address or password is incorrect"
                })
            } else {
                return user.checkPassword(password)
                    .then(match => {
                        if (match) {
                            if (user.active) {
                                next(null, user)
                            } else {
                                next(null, false, {
                                    error: "Check Your email to activate your account"
                                })
                            }
                        } else {
                            next(null, false, {
                                error: "The email address or password is incorrects"
                            })
                        }
                    })
            }
        })
        .catch(next)
}))

/*passport.use('facebook-auth', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT_URI || "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, next) => {
    //const facebookID = profile.id
    //const email = profile.emails
    process.nextTick(function() {
        User.findOne({
            'facebook.id': profile.id
        }, function(err, user) {
            if (err)
                return next(err);
            if (user)
                return next(null, user);
            else {
                let newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = profile.name.givenName + '' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return next(null, newUser);
                })
            }
        })
    })

}))*/
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT_URI
}, function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done(null, profile);
}));


passport.use('google-auth', new GoogleStrategy({
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_REDIRECT_URI || '/authenticate/google/cb'
}, (accessToken, refreshToken, profile, next) => {
    const googleID = profile.id
    const email = profile.emails[0] ? profile.emails[0].value : undefined;

    if (googleID && email) {
        User.findOne({
                $or: [{
                        email: email
                    },
                    {
                        'social.google': googleID
                    }
                ]
            })
            .then(user => {
                if (!user) {
                    const newUserInstance = new User({
                        email,
                        password: 'Aa1' + mongoose.Types.ObjectId(),
                        social: {
                            google: googleID
                        },
                        active: true
                    })

                    return newUserInstance.save()
                        .then(newUser => next(null, newUser))
                } else {
                    next(null, user)
                }
            })
            .catch(next)
    } else {
        next(null, null, {
            error: 'Error connecting with Google OAuth'
        })
    }
}))