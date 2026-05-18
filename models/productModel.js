const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  productDetails: {
    type: String,
    required: true,
    trim: true,
  },
  productQuantity: {
    type: Number,
    required: true,
    default: 0,
    max: 500,
    index: true,
  },
  productQuality: {
    type: Number,
    required: true,
    default: 0.0,
    max: 5,
    index: true,
  },
  productImageUrl: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
    default: 0,
    index: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categorie",
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("ProductModel", productSchema, "product");
