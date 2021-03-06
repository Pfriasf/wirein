const mongoose = require("mongoose")
const Cryptr = require("cryptr")
const cryptr = new Cryptr(process.env.CP_KEY)

const User = require("./User.model")


const serviceSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: "Description field is required",
    },

    price: {
      type: Number,
      required: "Price field is required",
    },

    seller: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    //TODO: AGRUPATE CREDENTIALS
    userCredential: {
      type: String,
      required: "User account field is required",
    },

    passwordCredential: {
      type: String,
      required: "Password field is required",
    },

    image: {
      type: String,
      required: false,
    },

    visibility: {
      type: Boolean,
      required: true,
      default: true,
    },

    shareWith: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    
    available:{
      type: Boolean, 
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);


serviceSchema.pre("save", function (next) {
  if (this.isModified("passwordCredential")) {
    const encryptedPassword = cryptr.encrypt(this.passwordCredential)
    this.passwordCredential = encryptedPassword;
    next()
  } else {
    next();
  }
});


serviceSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "service",
});


const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;

