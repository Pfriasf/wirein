const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: process.env.API_KEY, 
        domain: process.env.DOMAIN 
}
};
const transporter = nodemailer.createTransport(mailGun(auth))

const sendMail = (email, fname, message, cb) => {
    const mailOptions = {
        from: email,
        to: 'chapinacode@gmail.com',
        subject: fname,
        text: message,
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}


const contactMail= (req, res) => {
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
};

// Email sent page
const sentMailSuccess = (req, res) => {
    res.render('users/emailMessage');
};

module.exports = { contactMail, sentMailSuccess };