const ProductModel = require("../../models/productModel");
const CategoriesModel = require("../../models/categoriesModel");
const fs = require("fs");

exports.showProductByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  const category = await CategoriesModel.findById(categoryId);
  ProductModel.find({
    categoryId,
  })
    .then((products) => {
      res.render("product", { products, categoryId, category });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUiForAddProduct = (req, res) => {
  const { categoryId } = req.params;

  res.render("addProduct", {
    error: "",
    fieldError: {},
    formData: {},
    categoryId,
  });
};

exports.addProduct = async (req, res) => {
  const { categoryId } = req.params;
  const {
    productName,
    productQuantity,
    productQuality,
    productDetails,
    productPrice,
  } = req.body;
  const productImageUrl = req.file.path;

  // const category = categoryId;
  const pro = new ProductModel({
    productName,
    productQuantity,
    productQuality,
    productDetails,
    productPrice,
    categoryId,
    productImageUrl,
  });

  await pro.save();
  res.redirect("/admin/dashboard");
};

exports.getUiForEditProduct = (req, res) => {
  const { productId } = req.params;

  ProductModel.findById(productId)
    .then((product) => {
      res.render("editProduct", {
        product,
        error: "",
        fieldError: {},
        formData: {},
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editProduct = async (req, res) => {
  const { productId } = req.params;

  const {
    productName,
    productQuantity,
    productQuality,
    productDetails,
    productPrice,
  } = req.body;

  const updatedFiled =
    req.file !== undefined
      ? {
          productName,
          productQuantity,
          productQuality,
          productDetails,
          productPrice,
          productImageUrl: req.file.path,
        }
      : {
          productName,
          productQuantity,
          productQuality,
          productDetails,
          productPrice,
        };

  if (req.file !== undefined) {
    await ProductModel.findById(productId).then((product) => {
      fs.unlink(product.productImageUrl, (err) => {
        if (err) {
          console.log("Error while deleting file ", err);
        }
      });
    });
  }

  ProductModel.findByIdAndUpdate(productId, updatedFiled)
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  ProductModel.findByIdAndDelete(productId)
    .then(res.redirect("/admin/dashboard"))
    .catch((err) => {
      console.log(err);
    });
};

exports.showProductDetails = (req, res) => {
  const { productId } = req.params;

  ProductModel.findById(productId).then((product) => {
    res.render("viewProduct", { product });
  });
};
