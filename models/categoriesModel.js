const mongoose = require("mongoose");

const categorieSchema = mongoose.Schema({
  categoriesName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("CategorieModel", categorieSchema, "categorie");
