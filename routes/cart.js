const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// GET - karzinka
router.get("/", async (req, res) => {
  const items = await CartItem.find().populate("productId");

  const formatted = items.map(item => ({
    id: item._id,
    productId: item.productId._id,
    title: item.productId.title,
    count: item.count,
    unitPrice: item.productId.price,
    totalPrice: +(item.productId.price * item.count).toFixed(2),
    note: item.note,
  }));

  const total = formatted.reduce((acc, i) => acc + i.totalPrice, 0);

  res.json({
    items: formatted,
    totalPrice: `$${total.toFixed(2)}`,
    discount: 0,
  });
});

// POST - karzinkaga qo‘shish
router.post("/", async (req, res) => {
  const { productId, count, note } = req.body;
  const existing = await CartItem.findOne({ productId });

  if (existing) {
    existing.count += count;
    if (note) existing.note = note;
    await existing.save();
    return res.status(200).json(existing);
  }

  const newItem = new CartItem({ productId, count, note });
  await newItem.save();
  res.status(201).json(newItem);
});

module.exports = router;
