const express = require("express");
const router = express.Router();
const productController = require("../../controllers/users controllers/productController");
const auth = require("../../middleware/user middleware/auth");

router.get("/getProduct", auth, productController.getAllProduct);
router.get(
  "/getProductDeteils/:productId",
  auth,
  productController.getProductDetail,
);
router.get("/getRandomProduct", auth, productController.getRandomProduct);

module.exports = router;
