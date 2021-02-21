const mongoose = require("mongoose");
const passport = require('passport')
const User = require("../models/User.model");
const { sendActivationEmail } = require("../config/mailer.config");


module.exports.register = (req, res, next) => {
    res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render("users/register", {
            errors: errors,
            user: req.body,
        });
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: "This email is already registered",
                });
            } else {
                User.create(req.body)
                    .then((u) => {
                        sendActivationEmail(u.email, u.activationToken);
                        res.redirect("/");
                    })
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithErrors(e.errors);
                        } else {
                            next(e);
                        }
                    });
            }
        })
        .catch((e) => next(e));
};

module.exports.login = (req, res, next) => {
    res.render("users/login");
};

module.exports.doLogin = (req, res, next) => {
    passport.authenticate('local-auth', (error, user, validations) => {
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render('users/login', { user: req.body, error: validations.error });
        } else {
            req.login(user, loginErr => {
                if (loginErr) next(loginErr)
                else res.redirect('/')
            })
        }
    })(req, res, next);
};

module.exports.doLoginGoogle = (req, res, next) => {
    passport.authenticate('google-auth', (error, user, validations) => {
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render('users/login', { user: req.body, error: validations });
        } else {
            req.login(user, loginErr => {
                if (loginErr) next(loginErr)
                else res.redirect('/')
            })
        }
    })(req, res, next)
}

module.exports.doLoginFacebook = (req, res, next) => {
    passport.authenticate('facebook-auth', (error, user, validations) => {
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render('users/login', { user: req.body, error: validations });
        } else {
            req.login(user, loginErr => {
                if (loginErr) next(loginErr)
                else res.redirect('/')
            })
        }
    })(req, res, next)
}

module.exports.logout = (req, res, next) => {
    req.logout();
    res.redirect("/");
};



module.exports.profile = (req, res, next) => {

    res.render('users/profile')
};



module.exports.activate = (req, res, next) => {
    User.findOneAndUpdate({ activationToken: req.params.token, active: false }, { active: true, activationToken: "active" })
        .then((u) => {
            if (u) {
                res.render("users/login", {
                    user: req.body,
                    message: "Congratulations, your account is active!",
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((e) => next(e));
};