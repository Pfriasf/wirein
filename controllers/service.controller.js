const mongoose = require("mongoose");
const Cryptr = require("cryptr")
const flash = require("connect-flash");


const Service = require("../models/Service.model");
const Like = require("../models/Like.model");
let stripe = require("stripe")(process.env.STRIPE_SECRET);

const cryptr = new Cryptr(process.env.CP_KEY)

module.exports.showMenu = (req, res, next) => {
    res.render("service/menu");
};

module.exports.create = (req, res, next) => {
    res.render("service/service");
};

module.exports.doCreate = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render("service/service", {
            errors: errors,
            product: req.body,
        });
    }

    req.body.seller = req.currentUser.id;

    Service.create(req.body)
        .then(() => {
            req.flash("flashMessage", "Service created 🥳");
            res.redirect("/service/my-services");
        })
        .catch((e) => {
            console.log("error", e);
            if (e instanceof mongoose.Error.ValidationError) {
                renderWithErrors(e.errors);
            } else {
                next(e);
            }
        });
};

module.exports.accessToService = (req, res, next) => {

    const serviceID = req.params.id
    Service.findOne({
            _id: serviceID
        })
        .then((service) => {
            let {
                userCredential,
                passwordCredential
            } = service;
            passwordCredential = cryptr.decrypt(passwordCredential);

            res.render("service/access", {
                userCredential,
                passwordCredential
            });
        })
        .catch((e) => next(e));
}

module.exports.readServices = (req, res, next) => {
    const serviceType = req.params.type;
    Service.find({
            service: serviceType,
            seller: {
                $ne: req.currentUser.id
            },
            available: true
        })
        .populate("seller")
        .populate("likes")
        .then((services) => {
            services = services.map((service, i) => {
                service = service.toJSON();
                service.likedByUser = req.currentUser ?
                    service.likes.some(
                        (l) => l.user.toString() == req.currentUser._id.toString()
                    ) :
                    false;
                return service;
            });
            res.render("service/market", {
                services,
            });
        })
        .catch((e) => next(e));

};

module.exports.edit = (req, res, next) => {
    Service.findById(req.params.id)
        .then((service) => {
            console.log(service)
            if (
                !service ||
                service.seller.toString() !== req.currentUser.id.toString()
            ) {
                res.redirect("/");
            } else {
                service.passwordCredential = cryptr.decrypt(service.passwordCredential);
                res.render("service/service", {
                    service,
                });
            }
        });
};

module.exports.doEdit = (req, res, next) => {
    const service = req.body;
    const id = req.params.id;
    service.passwordCredential = cryptr.encrypt(service.passwordCredential);
    Service.findByIdAndUpdate(id, service, {
            new: true,
        })
        .then(() => {
            req.flash("flashMessage", "Service updated ✅");
            res.redirect("/service/my-services")
        })
        .catch(() =>
            res.render("service/service", {
                service,
            })
        );
};

module.exports.delete = (req, res, next) => {
    Like.findOneAndDelete({
            service: req.params.id,
        })
        .then(() => {
            Service.findOneAndDelete({
                _id: req.params.id,
                seller: req.currentUser.id,
            }).then(() => {
                res.status(204).send("OK");
            });
        })
        .catch((e) => next(e));
};

module.exports.contract = (req, res, next) => {
    const serviceID = req.params.id

    Like.deleteMany({
            service: serviceID
        })
        .then(() => {
            Service.findByIdAndUpdate(serviceID, {
                    shareWith: req.currentUser.id,
                    available: false
                })
                .then(() => {
                    req.flash("flashMessage", "Service contracted 🤑");
                    res.redirect("/service/my-contracted-services");
                })
        })
        .catch((e) => next(e));
};

module.exports.cancel = (req, res, next) => {
    Service.findByIdAndUpdate(req.params.id, {
            shareWith: null,
            available: true
        })
        .then(() => {
            req.flash("flashMessage", "Service canceled ❌");
            res.status(204).send("OK");
        })
        .catch((e) => next(e));
};

module.exports.showMyServices = (req, res, next) => {
    Service.find({
            seller: req.currentUser.id,
        })
        .populate("seller")
        .then((services) => {
            res.render("service/myServices", {
                services,
            });
        })
        .catch((e) => next(e));
};

module.exports.showMyContractedServices = (req, res, next) => {
    Service.find({
            shareWith: req.currentUser.id,
        })
        .populate("seller")
        .then((services) => {
            res.render("service/myContractedServices", {
                services,
            });
        })
        .catch((e) => next(e));
};

module.exports.showMyWishList = (req, res, next) => {
    Like.find({
            user: req.currentUser._id,
        })
        .populate({
            path: "service",
            populate: {
                path: "seller",
            },
        })
        .then((services) => {
            res.render("service/myWishList", {
                services,
            });
        });
};

module.exports.buy = (req, res, next) => {
    const serviceID = req.params.id
    Service.findById(serviceID)
        .then((service) => {
            if (!service) {
                next(createError(404));
            } else {
                return stripe.checkout.sessions
                    .create({
                        payment_method_types: ["card"],
                        mode: "payment",
                        line_items: [{
                            amount: service.price * 100,
                            currency: "USD",
                            name: service.service,
                            quantity: 1,
                        }, ],
                        customer_email: req.currentUser.email,
                        success_url: `${process.env.HOST}/service/${serviceID}/add` || `http://localhost:3003/service/${serviceID}/add`,
                        cancel_url: `${process.env.HOST}/service/menu` || `http://localhost:3003/service/menu`,
                        metadata: {
                            service: `${serviceID}`,
                        },
                    })
                    .then((session) => {
                        console.log(session);
                        res.json({
                            sessionId: session.id,
                        });
                    });
            }
        })
        .catch(next);
};

module.exports.showTerms = (req, res, next) => {
    res.render("terms");
}