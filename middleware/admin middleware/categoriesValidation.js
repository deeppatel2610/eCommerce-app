exports.categoriesValidation = (req, res, next) => {
  const { categoriesName, description, status } = req.body;
  let fieldError = {};
  if (!categoriesName) {
    fieldError.categoriesName = "Categories Name is require!";
  } else if (!description) {
    fieldError.description = "description is require!";
  }
  if (Object.keys(fieldError).length > 0) {
    return res.render("addCategories", {
      error: "Please fix the errors below",
      fieldError,
      formData: req.body,
    });
  } else {
    next();
  }
};
