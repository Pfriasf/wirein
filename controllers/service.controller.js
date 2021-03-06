const mongoose = require("mongoose");

const Service = require("../models/Service.model");
const Like = require("../models/Like.model")

module.exports.create = (req, res, next) => {
    res.render("service/service")
};

module.exports.doCreate = (req, res, next) => {

    function renderWithErrors(errors) {
        res.status(400).render("service/service", {
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

module.exports.edit = (req, res, next) => {
    Service.findById(req.params.id)
        .then(service => {
            console.log(service)
            if (!service || service.seller.toString() !== req.currentUser.id.toString()) {
                res.redirect("/")
            } else {
                res.render("service/service", {
                    service
                })
            }
        })
}

module.exports.doEdit = (req, res, next) => {
    const service = req.body
    const id = req.params.id

    Service.findByIdAndUpdate(id, service, {
            new: true
        })
        .then((service) => res.render("service/service", {
            service
        }))
        .catch(() => res.render("service/service", {
            service
        }));
}

// para el market
module.exports.market = (req, res, next) => {
    Product.find()
        .populate("likes")
        .then((service) => {
            res.render("test", {
                service: service.map((p, i) => {
                    p = p.toJSON();
                    p.likeCount = p.likes.length;
                    p.disabled = req.currentUser ?
                        p.seller.toString() === req.currentUser._id.toString() :
                        true;
                    p.likedByUser = req.currentUser ?
                        p.likes.some(
                            (l) => l.user.toString() == req.currentUser._id.toString()
                        ) :
                        false;
                    return p;
                }),
            });
        })
        .catch((e) => next(e));
};