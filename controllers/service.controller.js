const mongoose = require("mongoose");
const Service = require("../models/Service.model")

module.exports.create = (req, res, next) => {
    res.render("users/service")
};

module.exports.doCreate = (req, res, next) => {

    function renderWithErrors(errors) {
        res.status(400).render("users/service", {
            errors: errors,
            product: req.body,
        });
    }

    req.body.seller = req.currentUser.id

    Service.create(req.body)
        .then((service) => {
            res.redirect("/profile")
        })
        .catch((e) => {
            console.log("error", e)
            if (e instanceof mongoose.Error.ValidationError) {
                renderWithErrors(e.errors);
            } else {
                next(e);
            }
        });
};