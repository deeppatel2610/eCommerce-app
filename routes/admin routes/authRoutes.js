const express = require("express");
const adminAuthController = require("../../controllers/admin controllers/adminAuthController");

const router = express.Router();

router.get("/login", adminAuthController.getLoginUi);
router.post("/login", adminAuthController.loginAdmin);
router.get("/logout", adminAuthController.logout);

module.exports = router;
