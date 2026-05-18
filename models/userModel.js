const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    hashPassword: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      default: "token",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("userModel", userSchema, "users");
