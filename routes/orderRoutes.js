// routes/orderRoutes.js
const express = require("express");
const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getMostOrdered,
  getStatistics,
} = require("../controllers/ordersController");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/most", getMostOrdered);
router.get("/statistics", getStatistics);
router.post("/", createOrder);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
