const mongoose = require("mongoose")
const User = require("./User.model")


const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
        required: true
    },

    image: {
        type: String,
        required: true
    },
},
{
    timestamps: true,
    toJSON: {
        virtuals: true
    }
}
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service