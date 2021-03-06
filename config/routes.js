const passport = require('passport')
const router = require("express").Router();

const miscController = require("../controllers/misc.controller")
const usersController = require('../controllers/users.controller')
const serviceController = require("../controllers/service.controller")
const chatController = require("../controllers/chat.controller")
const secure = require("../middlewares/secure.middleware"); 
const sendMail = require('./mail');
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



router.get("/service/:serviceId/like", secure.isAuthenticated, usersController.like);

router.get("/test", function (req, res, next) {
    res.render("users/market");
});
router.get("/contact", function (req, res, next) {
    res.render("contact");
});


router.post('/email', (req, res) => {
    const {
        email,
        fname,
        message
    } = req.body;
    console.log('Data: ', req.body);

    sendMail(email, fname, message, function (err, data) {
        if (err) {
            console.log('ERROR: ', err);
            return res.status(500).json({
                message: 'Internal Error'
            });
        }
        console.log('Email sent!!!');
        return res.json({
            message: 'Email sent!'
        });
    });
});

// Email sent page
router.get('/email/sent', (req, res) => {
    res.render('emailMessage');
});

module.exports = router;