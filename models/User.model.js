const mongoose = require("mongoose");
mongoose.set("useFindAndModify", true);

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: "The email field is required",
      unique: true,
      lowercase: true,
      match: [EMAIL_PATTERN, "The email is not valid"],
      trim: true,
    },

    password: {
      type: String,
      required: "Password is required",
      match: [
        PASSWORD_PATTERN,
        "Your password must contain at least 1 number, 1 uppercase, 1 lowercase and 8 characters.",
      ],
    },

    active: {
      type: Boolean,
      default: false,
    },
    
    social: {
      google: String,
      facebook: String,
      twitter: String,
    },
    
    image: {
        type: String
    },

    birthday: {
        type: Date
    },
    
    activationToken: {
      type: String,
      default: () => {
        return uuidv4();
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
