const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Get all orders
router.get("/orders", async (req, res) => {
  const orders = await Order.find().populate("products.productId");
  res.json(orders);
});

// Create new order
router.post("/orders", async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json(newOrder);
});

// Update order status
router.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  res.json(updated);
});

module.exports = router;
