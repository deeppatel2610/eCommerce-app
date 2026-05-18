const CategoriesModel = require("../../models/categoriesModel");

exports.categoriesDuplicateCheck = async (req, res, next) => {
  const { categoriesName, description, status } = req.body;
  let fieldError = {};

  const existing = await CategoriesModel.findOne({
    categoriesName: categoriesName.trim(),
  });

  if (existing) {
    return res.render("addCategories", {
      error: "Category already exists",
      fieldError: { categoriesName: "This category already exists" },
      formData: req.body,
    });
  } else {
    next();
  }
};
