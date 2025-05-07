// controllers/ordersController.js
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// GET /orders - list all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /orders - create a new order from cart
exports.createOrder = async (req, res) => {
  try {
    const { name, email, tableNumber, paymentMethod, diningOption } = req.body;
    // Fetch current cart items
    const items = await CartItem.find().populate('productId');
    if (items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    // Build order products array and check availability
    const orderProducts = [];
    let totalPrice = 0;
    for (const item of items) {
      const product = item.productId;
      if (item.count > product.availability) {
        return res.status(400).json({ 
          message: `Insufficient availability for product ${product.title}` 
        });
      }
      const unitPrice = product.price;
      const itemTotal = unitPrice * item.count;
      totalPrice += itemTotal;
      orderProducts.push({
        productId: product._id,
        count: item.count,
        note: item.note,
        unitPrice,
        totalPrice: itemTotal
      });
    }
    // Create order document
    const order = new Order({
      customer: { name, email },
      products: orderProducts,
      totalPrice,
      tableNumber,
      status: 'Pending',
      paymentMethod,
      diningOption
    });
    await order.save();
    // Update product availability and clear cart
    for (const item of items) {
      const product = await Product.findById(item.productId._id);
      product.availability -= item.count;
      await product.save();
    }
    await CartItem.deleteMany();  // clear cart
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// PUT /orders/:id - update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending','Preparing','Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE /orders/:id - delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.remove();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /orders/most - most ordered products
exports.getMostOrdered = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$products" },
      { $group: {
          _id: "$products.productId",
          totalOrdered: { $sum: "$products.count" }
      }},
      { $sort: { totalOrdered: -1 } },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
      }},
      { $unwind: "$product" },
      { $project: {
          _id: 0,
          productId: "$product._id",
          title: "$product.title",
          category: "$product.category",
          totalOrdered: 1
      }}
    ]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /orders/statistics - stats on status counts and revenue
exports.getStatistics = async (req, res) => {
  try {
    // Count orders by status
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const stats = {};
    statusAgg.forEach(s => { stats[s._id] = s.count; });
    // Compute total revenue
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].totalRevenue : 0;
    res.json({ statusCount: stats, totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
