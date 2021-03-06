const mongoose = require("mongoose");
const Product = require("./Service.model");
const User = require("./User.model");

const likeSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
      service: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Service",
        required: true,
      },
    },
    {
      timestamps: true,
      toJSON: {
        virtuals: true,
      },
    }
  );
  
  const Like = mongoose.model("Like", likeSchema);
  
  module.exports = Like;