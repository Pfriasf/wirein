const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 11
const {
    v4: uuidv4
} = require('uuid'); //es el paquete de npm para generar token

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'The username field is required',
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: 'The email field is required',
        unique: true,
        lowercase: true,
        match: [EMAIL_PATTERN, 'The email is not valid'],
        trim: true
    },
    password: {
        type: String,
        required: 'The password field is required',
        unique: true,
        match: [PASSWORD_PATTERN, "The password you entered doesn't meet minimum security requirements"]

    },
    active: {
        type: Boolean,
        default: false,
    },
    social: {
        google: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,

    },
    activationToken: {
        type: String,
        default: () => {
            return (
                uuidv4() // asi se llama al token
            );
        },
    },
})

userSchema.methods.checkPassword = function(passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
};

userSchema.pre('save', function(next) {
    //user es igual a this

    if (this.isModified('password')) {
        bcrypt.hash(this.password, SALT_ROUNDS)
            .then(hash => {
                this.password = hash
                next()
            })
    } else {
        next()
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User;
model('User', userSchema)
module.exports = User;