// routes/productRoutes.js
const express = require("express");
const {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:category", getProductsByCategory);
router.get("/:category/:id", getProductById);
router.post("/:category", createProduct);
router.put("/:category/:id", updateProduct);
router.delete("/:category/:id", deleteProduct);

module.exports = router;
