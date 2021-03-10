const passport = require('passport')
const router = require("express").Router();
const express = require('express');

const miscController = require("../controllers/misc.controller")
const usersController = require('../controllers/users.controller')
const serviceController = require("../controllers/service.controller")
const chatController = require("../controllers/chat.controller")
const secure = require("../middlewares/secure.middleware");
const mailController = require('../controllers/mail.controller');
const upload = require('./storage.config')

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

router.get("/", miscController.home);

//Users
router.get("/register", secure.isNotAuthenticated, usersController.register);
router.post("/register", secure.isNotAuthenticated, usersController.doRegister);

router.get("/login", secure.isNotAuthenticated, usersController.login);
router.post("/login", secure.isNotAuthenticated, usersController.doLogin);

router.get("/activate/:token", secure.isNotAuthenticated, usersController.activate); // esto es la ruta para que me devuelva a mi servidor lo del mail de activación

router.get('/authenticate/google', passport.authenticate('google-auth', {
    scope: GOOGLE_SCOPES
}))
router.get('/authenticate/google/cb', usersController.doLoginGoogle)

router.get("/authenticate/facebook", passport.authenticate("facebook-auth", {
    scope: "email"
}));
router.get("/authenticate/facebook/cb", usersController.doLoginFacebook);

router.get("/authenticate/twitter", passport.authenticate("twitter-auth"));
router.get("/authenticate/twitter/cb", usersController.doLoginTwitter);

router.post("/logout", secure.isAuthenticated, usersController.logout);

router.get("/profile", secure.isAuthenticated, usersController.profile);
router.post("/profile", secure.isAuthenticated, upload.single("image"), usersController.updateProfile);

//Service
router.get("/service/menu", secure.isAuthenticated, serviceController.showMenu);

router.get("/service/create", secure.isAuthenticated, serviceController.create);
router.post("/service/create", secure.isAuthenticated, serviceController.doCreate);

router.get("/service/list/:type", secure.isAuthenticated, serviceController.readServices);

router.get("/service/:id/edit", secure.isAuthenticated, serviceController.edit)
router.post("/service/:id/edit", secure.isAuthenticated, serviceController.doEdit);

router.get("/service/:id/delete", secure.isAuthenticated, serviceController.delete);

router.get("/service/:id/add", secure.isAuthenticated, serviceController.contract)
router.get("/service/:id/cancel", secure.isAuthenticated, serviceController.cancel)


router.get("/service/my-services", secure.isAuthenticated, serviceController.showMyServices);
router.get("/service/my-contracted-services", secure.isAuthenticated, serviceController.showMyContractedServices);
router.get("/service/my-wish-list", secure.isAuthenticated, serviceController.showMyWishList);

router.post("/service/:id/buy", secure.isAuthenticated, serviceController.buy)
/*router.post("/service/webhook", express.raw({type: 'application/json'}), productsController.webhook)*/


router.get("/service/:serviceId/like", secure.isAuthenticated, usersController.like);

router.get("/test", function (req, res, next) {
    res.render("service/checkout");
});
router.get("/contact", function (req, res, next) {
    res.render("contact");
});




router.post('/email', mailController.contactMail);
router.get('/email/sent', mailController.sentMailSuccess);

module.exports = router;