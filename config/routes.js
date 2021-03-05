const passport = require('passport')
const router = require("express").Router();
const miscController = require("../controllers/misc.controller")
const usersController = require('../controllers/users.controller')
const serviceController = require("../controllers/service.controller")
const chatController = require("../controllers/chat.controller")
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

router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/authenticate/google/cb', usersController.doLoginGoogle)

router.get("/authenticate/facebook", passport.authenticate("facebook-auth", { scope: "email" }));
router.get("/authenticate/facebook/cb", usersController.doLoginFacebook);

router.get("/authenticate/twitter", passport.authenticate("twitter-auth"));
router.get("/authenticate/twitter/cb", usersController.doLoginTwitter);

router.post("/logout", secure.isAuthenticated, usersController.logout);
router.get("/profile", secure.isAuthenticated, usersController.profile);
router.post("/profile", secure.isAuthenticated, upload.single("image"), usersController.updateProfile);

//Service
router.get("/service/create", secure.isAuthenticated, serviceController.create);
router.post("/service", secure.isAuthenticated, serviceController.doCreate);

router.post("/chat", chatController.createChat);
router.post("/chatMessage", chatController.sendMessage);
router.get("chatDetail/:chatRoomId", chatController.getChat);


router.get("/service/:serviceId/like", secure.isAuthenticated, usersController.like);

router.get("/test", function(req, res, next) {
    res.render("users/market");
});


module.exports = router;