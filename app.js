require('dotenv').config();

var createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const logger = require('morgan');
const routes = require("./config/routes")
const path = require("path");


require("./config/db.config");




//express config 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("public"));

app.use('/public', express.static(__dirname + '/public')); // este es el que me sirve a mi
app.use(logger('dev'));


app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, "../views/partials"));


app.use('/', routes);

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));