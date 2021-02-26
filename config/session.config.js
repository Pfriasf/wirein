const expressSession = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default;

const session = expressSession({
    secret: process.env.SESS_SECRET || 'super session secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: process.env.SESS_SECURE || false,
        httpOnly: true,
        maxAge: process.env.SESS_MAX_AGE || 3600000
    },
    store:  MongoStore.create({
        mongoUrl:"mongodb://localhost/wirein",
        mongooseConnection: mongoose.connection,
        ttl: process.env.SESS_MAX_AGE || 3600000,
    })
})

module.exports = session