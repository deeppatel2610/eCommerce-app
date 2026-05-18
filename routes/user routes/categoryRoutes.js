const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/users controllers/categoryController");
const auth = require("../../middleware/user middleware/auth");

router.get("/getAllCategory", auth, categoryController.getAllcategory);
router.get(
  "/getCategoryById/:categoryId",
  auth,
  categoryController.getCategoryById,
);

module.exports = router;
