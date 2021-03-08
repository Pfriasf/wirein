const mongoose = require("mongoose");
const passport = require('passport')
const User = require("../models/User.model");
const Like = require("../models/Like.model")

const {
    sendActivationEmail
} = require("../config/mailer.config");


module.exports.register = (req, res, next) => {
    res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })
    }

    //que no se repitan los usuarios y mail
    User.findOne({
            //email: req.body.email
            username: req.body.username
        })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    username: 'Username already exists'
                })
            } else {
                User.findOne({
                        email: req.body.email
                            // username: req.body.username
                    })
                    .then((user) => {
                        if (user) {
                            renderWithErrors({
                                email: 'This email is already registered '
                            })

                        } else {
                            User.create(req.body)
                                .then((user) => { //la u es de user

                                    //AQUI SE PONE LA LOGICA PARA ENVIAR EL MAIL DE ACTIVACION

                                    sendActivationEmail(user.email, user.activationToken) //el mail y token salen del modelo

                                    res.render('users/mails')
                                })
                                .catch(e => {
                                    if (e instanceof mongoose.Error.ValidationError) {
                                        console.log(e.errors)
                                        renderWithErrors(e.errors)
                                    } else {
                                        next(e)
                                    }
                                })
                        }
                    })
            }
        })
        .catch(e => next(e))
}

module.exports.login = (req, res, next) => {
    res.render("users/login");
};

module.exports.doLogin = (req, res, next) => {
    passport.authenticate('local-auth', (error, user, validations) => {
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render('users/login', {
                user: req.body,
                error: validations.error
            });
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
            res.status(400).render('users/login', {
                user: req.body,
                error: validations
            });
        } else {
            req.login(user, loginErr => {
                if (loginErr) next(loginErr)
                else res.redirect('/')
            })
        }
    })(req, res, next)
}

module.exports.doLoginFacebook = (req, res, next) => {
    passport.authenticate("facebook-auth", (error, user, validations) => {
        console.log(validations)
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render("users/login", { error: validations.error });
        } else {
            req.login(user, (loginErr) => {
                if (loginErr) next(loginErr);
                else res.redirect("/");
            });
        }
    })(req, res, next);
}

module.exports.doLoginTwitter = (req, res, next) => {
    passport.authenticate("twitter-auth", (error, user, validations) => {
        console.log(validations)
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render("users/login", {
                error: validations.error
            });
        } else {
            req.login(user, (loginErr) => {
                if (loginErr) next(loginErr);
                else res.redirect("/");
            });
        }
    })(req, res, next);
}

module.exports.logout = (req, res, next) => {
    req.logout();
    res.redirect("/");
};



module.exports.profile = (req, res, next) => {
    debugger
    res.render('users/profile')
};



module.exports.activate = (req, res, next) => {
    User.findOneAndUpdate({
            activationToken: req.params.token,
            active: false
        }, {
            active: true,
            activationToken: "active"
        })
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

// Para guardar y editar el perfil
module.exports.updateProfile = (req, res, next) => {

    console.log("username", req.body.username)
    const upDates = {
        username: req.body.username,
        birthday: req.body.birthday
    }
    console.log(req.file)
    if (req.file) {

        upDates.image = req.file.path;
    }

    User.findOneAndUpdate({ email: req.currentUser.email }, upDates)
        .then((user) => {
            res.redirect('/')
        })

    .catch((e) => console.log("error", error))
}
//like

module.exports.like = (req, res, next) => {
  Like.findOne({ service: req.params.serviceId, user: req.currentUser._id })
    .then((like) => {
      if (!like) {
        return Like.create({
          service: req.params.serviceId,
          user: req.currentUser._id,
        }).then(() => {
          res.json({ add: 1 });
        });
      } else {
        return Like.findByIdAndDelete(like._id).then(() => {
          // dislike
          res.json({ add: -1 });
        });
      }
    })
    .catch((e) => next(e));
};



