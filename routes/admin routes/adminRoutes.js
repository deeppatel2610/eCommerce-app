const express = require("express");
const adminAuthController = require("../../controllers/admin controllers/adminAuthController");
const adminDashboardController = require("../../controllers/admin controllers/adminDashboardController");
const categoriesValidation = require("../../middleware/admin middleware/categoriesValidation");
const categoriesDuplicateCheck = require("../../middleware/admin middleware/categoriesDuplicateCheck");
const adminProductController = require("../../controllers/admin controllers/adminProductController");
const productValidation = require("../../middleware/admin middleware/productValidation");

const router = express.Router();

router.get("/dashboard", adminDashboardController.dashboard);
router.get("/add-category", adminDashboardController.getUiForAddCategories);
router.post(
  "/add-category",
  categoriesValidation.categoriesValidation,
  categoriesDuplicateCheck.categoriesDuplicateCheck,
  adminDashboardController.addCategories,
);
router.get(
  "/edit-category/:categoryId",
  adminDashboardController.getUiForEditCategories,
);
router.post(
  "/edit-category/:categoryId",
  categoriesValidation.categoriesValidation,
  categoriesDuplicateCheck.categoriesDuplicateCheck,
  adminDashboardController.editCategories,
);
router.get(
  "/delete-category/:categoryId",
  adminDashboardController.deleteCategories,
);
router.get(
  "/view-category/:categoryId",
  adminProductController.showProductByCategoryId,
);

router.get(
  "/view-product/:productId",
  adminProductController.showProductDetails,
);

router.get(
  "/add-product/:categoryId",
  adminProductController.getUiForAddProduct,
);
router.post(
  "/add-product/:categoryId",
  productValidation.productValidation,
  adminProductController.addProduct,
);
router.get(
  "/edit-product/:productId",
  adminProductController.getUiForEditProduct,
);
router.post(
  "/edit-product/:productId",
  productValidation.productValidation,
  adminProductController.editProduct,
);
router.get("/delete-product/:productId", adminProductController.deleteProduct);

module.exports = router;
