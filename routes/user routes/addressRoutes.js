const express = require("express");
const router = express.Router();
const auth = require("../../middleware/user middleware/auth");
const addressController = require("../../controllers/users controllers/addressController");
const {
  requiredFieldForAddNewAddress,
} = require("../../middleware/user middleware/requiredFieldForAddNewAddress");

router.get("/getAddresses", auth, addressController.getAddresses);

router.post(
  "/addNewAddress",
  auth,
  requiredFieldForAddNewAddress,
  addressController.addNewAddress,
);

router.delete("/removeAllAddress", auth, addressController.removeAllAddress);

router.delete(
  "/removeOneAddress/:addressId",
  auth,
  addressController.removeOneAddress,
);

module.exports = router;
