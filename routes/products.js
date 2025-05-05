const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add new product
router.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

module.exports = router;
