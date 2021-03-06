const nodemailer = require("nodemailer");
const { generateTemplate } = require("./mailtemplate"); //despues para llamar al template

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PWD
    }
});

module.exports.sendActivationEmail = (email, token) => {
    transporter.sendMail({
        from: `"WiredIn" <${process.env.NM_USER}>`,
        to: email,
        subject: "You've got Wired",
        html: generateTemplate(token),

    })
};