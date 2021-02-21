const express = require('express');
const passport = require('passport')
const router = require("express").Router();
const miscController = require("../controllers/misc.controller")
const usersController = require('../controllers/users.controller')
const secure = require("../middlewares/secure.middleware");


const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

router.get("/", miscController.home);



//Users
router.get("/register", secure.isNotAuthenticated, usersController.register);
router.post("/register", secure.isNotAuthenticated, usersController.doRegister);
router.get("/login", secure.isNotAuthenticated, usersController.login);
router.post("/login", secure.isNotAuthenticated, usersController.doLogin);
router.get(
    "/activate/:token",
    secure.isNotAuthenticated,
    usersController.activate
); // esto es la ruta para que me devuelva a mi servidor lo del mail de activación
//el token es para que sepa qué usuario es

router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/auth/facebook', passport.authenticate('facebook-auth', { scope: ['email'] }))
router.get('/authenticate/google/cb', usersController.doLoginGoogle)
router.get('/auth/facebook/callback', usersController.doLoginFacebook)
router.post("/logout", secure.isAuthenticated, usersController.logout);
router.get("/profile", secure.isAuthenticated, usersController.profile);


module.exports = router;