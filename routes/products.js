const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET - barcha mahsulotlar
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST - mahsulot qo‘shish
router.post("/", async (req, res) => {
  const { title, price, availability, category, image } = req.body;
  const product = new Product({ title, price, availability, category, image });
  await product.save();
  res.status(201).json(product);
});

module.exports = router;
