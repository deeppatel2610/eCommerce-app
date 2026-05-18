const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
      required: true,
      index: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
      index: true,
    },

    payment: {
      paymentMethod: {
        type: String,
        enum: ["COD", "UPI", "CARD", "PAYPAL", "NET_BANKING", "WALLET"],
        required: true,
      },

      paymentStatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
        default: "PENDING",
      },

      transactionId: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OrderModel", OrderSchema, "Orders");
