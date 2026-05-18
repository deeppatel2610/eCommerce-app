const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users controllers/userController");
const auth = require("../../middleware/user middleware/auth");

router.get("/getUser", auth, userController.getUserById);

module.exports = router;
