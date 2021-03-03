const passport = require('passport')
const router = require("express").Router();
const miscController = require("../controllers/misc.controller")
const usersController = require('../controllers/users.controller')
const secure = require("../middlewares/secure.middleware");

const upload = require('./storage.config')

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

router.get("/", miscController.home);



//Users
router.get("/register", secure.isNotAuthenticated, usersController.register);
router.post("/register", secure.isNotAuthenticated, usersController.doRegister);

router.get("/login", secure.isNotAuthenticated, usersController.login);
router.post("/login", secure.isNotAuthenticated, usersController.doLogin);

router.get("/activate/:token", secure.isNotAuthenticated, usersController.activate); // esto es la ruta para que me devuelva a mi servidor lo del mail de activación
//el token es para que sepa qué usuario es

router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/authenticate/google/cb', usersController.doLoginGoogle)

router.get("/authenticate/facebook", passport.authenticate("facebook-auth", { scope: "email" }));
router.get("/authenticate/facebook/cb", usersController.doLoginFacebook);

router.get("/authenticate/twitter", passport.authenticate("twitter-auth"));
router.get("/authenticate/twitter/cb", usersController.doLoginTwitter);

router.post("/logout", secure.isAuthenticated, usersController.logout);
router.get("/profile", secure.isAuthenticated, usersController.profile);
router.post("/profile", secure.isAuthenticated, upload.single("image"), usersController.updateProfile);


router.post("/product", secure.isAuthenticated);

router.get('/product', (req, res, next) => {
    res.render("users/menu")
});




module.exports = router;