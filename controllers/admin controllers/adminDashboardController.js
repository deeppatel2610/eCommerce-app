const CategoriesModel = require("../../models/categoriesModel");
const ProductModel = require("../../models/productModel");

exports.dashboard = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/auth/login");
  }

  CategoriesModel.find()
    .then((categories) => {
      res.render("adminDashboard", {
        categories: categories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUiForAddCategories = (req, res) => {
  res.render("addCategories", {
    error: "",
    fieldError: {},
    formData: {},
  });
};

exports.addCategories = async (req, res) => {
  const { categoriesName, description, status } = req.body;
  const name = categoriesName.toLowerCase();

  const cat = new CategoriesModel({
    categoriesName,
    description,
    status: status === "active" ? true : false,
  });
  await cat.save();
  res.redirect("/admin/dashboard");
};

exports.getUiForEditCategories = (req, res) => {
  const { categoryId } = req.params;

  CategoriesModel.findById(categoryId)
    .then((category) => {
      res.render("editCategories", {
        category,
        error: "",
        fieldError: {},
        formData: {},
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editCategories = async (req, res) => {
  const { categoryId } = req.params;
  const { categoriesName, description, status } = req.body;
  const name = categoriesName.toLowerCase();

  CategoriesModel.findByIdAndUpdate(categoryId, {
    categoriesName,
    description,
    status: status === "active" ? true : false,
  })
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteCategories = async (req, res) => {
  const { categoryId } = req.params;

  await ProductModel.deleteMany({ categoryId });

  CategoriesModel.findByIdAndDelete(categoryId)
    .then(res.redirect("/admin/dashboard"))
    .catch((err) => {
      console.log(err);
    });
};
