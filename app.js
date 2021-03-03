require('dotenv').config();

var createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const logger = require('morgan');
const router = require("./config/routes")
const path = require("path");
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require("./config/session.config");
const upload = require('./config/storage.config')







require("./config/db.config");
require('./config/passport.config')
const sessionMiddleware = require('./middlewares/session.middleware') //requiero el middleware de la sessión

const User = require('./models/User.model')




//express config 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("public"));
app.use('/public', express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, "./views/partials"));

app.use((req, res, next) => {
    req.currentUser = req.user;
    res.locals.currentUser = req.user;

    next()
})


app.use('/', router);
app.use(sessionMiddleware.findUser)

//error handler 

app.use(function(req, res, next) {
    next(createError(404));
});


app.use((error, req, res, next) => {
    console.log(error);
    if (!error.status) {
        error = createError(500);
    }
    res.status(error.status);
    res.render("error", error);
});


// Initialization on port
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));