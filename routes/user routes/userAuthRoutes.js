const express = require("express");
const router = express.Router();
const userAuthController = require("../../controllers/users controllers/userAuthcontroller");
const requiredFieldForRegistration = require("../../middleware/user middleware/requiredFieldForRegistration");
const requiredFieldForLogin = require("../../middleware/user middleware/requiredFieldForLogin");
const requiredFieldForNewToken = require("../../middleware/user middleware/requiredFieldForNewToken");
const uniqueUserCheck = require("../../middleware/user middleware/uniqueUserCheck");

router.post(
  "/registration",
  requiredFieldForRegistration.requiredFieldForRegistration,
  uniqueUserCheck.checkUser,
  userAuthController.registration,
);
router.post(
  "/login",
  requiredFieldForLogin.requiredFieldForLogin,
  userAuthController.login,
);
router.post(
  "/newToken",
  requiredFieldForNewToken.requiredFieldForNewToken,
  userAuthController.newToken,
);

module.exports = router;
