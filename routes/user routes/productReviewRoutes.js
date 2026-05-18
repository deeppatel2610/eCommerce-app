const express = require("express");
const router = express.Router();
const productReviewController = require("../../controllers/users controllers/productReviewController");
const productReviewMiddleware = require("../../middleware/user middleware/requiedFieldForProductRivew");
const auth = require("../../middleware/user middleware/auth");

router.post(
  "/addProductReview/:productId",
  auth,
  productReviewMiddleware.requiredFieldForProductRivew,
  productReviewController.addProductReview,
);

router.get(
  "/getProductReviewByProductId/:productId",
  auth,
  productReviewController.getProductReviewByProductId,
);

router.get(
  "/getOneProductReviewByUserId",
  auth,
  productReviewController.getProductReviewByProductIdAndUserId,
);

router.get(
  "/getProductReviewByUserId/:userId",
  auth,
  productReviewController.getProductReviewByUserId,
);

module.exports = router;
