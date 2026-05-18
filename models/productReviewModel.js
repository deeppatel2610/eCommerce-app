const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      max: 5,
    },
    comment: String,
  },
  { timestamps: true },
);

productReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model(
  "productReviewModel",
  productReviewSchema,
  "product_review",
);
