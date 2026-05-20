const express = require("express");
const router = express.Router();
const auth = require("../../middleware/user middleware/auth");
const orderController = require("../../controllers/users controllers/orderController");
const checkMaxQuantity = require("../../middleware/user middleware/checkMaxQuantity");
const {
  requiredFieldForAddToCart,
} = require("../../middleware/user middleware/requiedFieldForAddToCart");
const {
  requiredFieldForEditCartProductQuantity,
} = require("../../middleware/user middleware/requiredFieldForEditCartProductQuantity");
const {
  requiredFieldForAddOrder,
} = require("../../middleware/user middleware/requiedFieldForAddOder");

router.get("/getCartList", auth, orderController.getCartList);

router.post(
  "/addToCart",
  auth,
  requiredFieldForAddToCart,
  checkMaxQuantity,
  orderController.addToCart,
);

router.delete(
  "/removeOneProduct/:productId",
  auth,
  orderController.removeOneProduct,
);

router.delete("/removeAllProduct", auth, orderController.removeAllProduct);

router.put(
  "/updateQuantity",
  auth,
  requiredFieldForEditCartProductQuantity,
  checkMaxQuantity,
  orderController.updateQuantity,
);

router.post(
  "/addOrder",
  auth,
  requiredFieldForAddOrder,
  orderController.addOrder,
);

router.get("/getOrderHistories", auth, orderController.getOrderHistory);

router.get("/getOrderBill/:OrderId", auth, orderController.getOrderBill);

module.exports = router;
