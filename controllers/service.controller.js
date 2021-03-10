const mongoose = require("mongoose");

const Service = require("../models/Service.model");
const Like = require("../models/Like.model")



module.exports.showMenu = (req, res, next) => {
    res.render("service/menu")

}

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
            res.redirect("/service/my-services");
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


module.exports.readServices = (req, res, next) => {
    const serviceType = req.params.type
    Service.find({
            service: serviceType
        })
        .populate("seller")
        .then((services) => {
            //TODO: 
            res.render("service/market", {
                services
            })

        })
        .catch(() => res.render("service/service", {
            service
        }));

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
        .then((service) => res.render("/service/my-services", {
            service
        }))
        .catch(() => res.render("service/service", {
            service
        }));
}

module.exports.delete = (req, res, next) => {
    //TODO: VALIDAR USUARIO
    Service.findByIdAndDelete(({
            _id: req.params.id
        }))
        .then(() => {
            res.status(204).send("OK");
        })
        .catch((e) => next(e));
}

module.exports.contract = (req, res, next) => {

    Service.findOneAndUpdate(req.params.id, {
            shareWith: req.currentUser.id
        })
        .then(() => {
            res.render("service/checkout")
        })
        .catch((e) => next(e));
}

module.exports.cancel = (req, res, next) => {
    Service.findOneAndUpdate(req.params.id, {
            shareWith: null
        })
        .then(() => {
            res.render("service/checkout");
        })
        .catch((e) => next(e));
};

module.exports.showMyServices = (req, res, next) => {
    Service.find({
            seller: req.currentUser.id
        })
        .populate("seller")
        .then((services) => {
            console.log(services)
            res.render("service/myServices", {
                services
            })
        })
        .catch((e) => next(e));
}

module.exports.showMyContractedServices = (req, res, next) => {
    Service.find({
            shareWith: req.currentUser.id
        })
        .populate("seller")
        .then((services) => {
            console.log(services);
            res.render("service/myContractedServices", {
                services
            });
        })
        .catch((e) => next(e));
}

module.exports.showMyWishList = (req, res, next) => {
    Like.find({ user: req.currentUser._id })
      .populate("service")
      .then((likes) => {
        console.log(likes)
      });  
}

// para el market
module.exports.market = (req, res, next) => {
    Product.find()
        .populate("likes")
        .then((service) => {
            res.render("service/market", {
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