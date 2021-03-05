const mongoose = require("mongoose");
const Service = require("../models/Service.model");
const Like = require("../models/Like.model")

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

// para el market
module.exports.market = (req, res, next) => {
    Product.find()
      .populate("likes")
      .then((service) => {
        res.render("test", {
          service: service.map((p, i) => {
            p = p.toJSON();
            p.likeCount = p.likes.length;
            p.disabled = req.currentUser
              ? p.seller.toString() === req.currentUser._id.toString()
              : true;
            p.likedByUser = req.currentUser
              ? p.likes.some(
                  (l) => l.user.toString() == req.currentUser._id.toString()
                )
              : false;
            return p;
          }),
        });
      })
      .catch((e) => next(e));
  };