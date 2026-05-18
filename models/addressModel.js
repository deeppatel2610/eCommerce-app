const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
      default: 1234567890,
      index: true,
    },
    addressLine1: {
      type: String,
      required: true,
      default: "new address",
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
      default: "surat",
      index: true,
    },
    state: {
      type: String,
      required: true,
      default: "gujarat",
      index: true,
    },
    pincode: {
      type: String,
      required: true,
      minlength: 6,
      default: "123456",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("addressModel", addressSchema, "address");
