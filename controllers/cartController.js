// controllers/cartController.js
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// GET /cart - list all cart items and total price
exports.getCart = async (req, res) => {
  try {
    // Populate product details
    const items = await CartItem.find().populate("productId");
    // Compute item totals and grand total
    let totalPrice = 0;
    const cartItems = items.map((item) => {
      const unitPrice = item.productId.price;
      const itemTotal = unitPrice * item.count;
      totalPrice += itemTotal;
      return {
        id: item._id,
        product: {
          id: item.productId._id,
          title: item.productId.title,
          price: unitPrice,
        },
        count: item.count,
        note: item.note,
        itemTotal,
      };
    });
    res.json({ items: cartItems, totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /cart - add a new item to cart
exports.addItem = async (req, res) => {
  try {
    const { productId, count, note } = req.body;
    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Check availability
    if (count > product.availability) {
      return res.status(400).json({ message: "Insufficient availability" });
    }
    // Create cart item
    const cartItem = new CartItem({ productId, count, note });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// PUT /cart/:id - update count or note for a cart item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { count, note } = req.body;
    const item = await CartItem.findById(id).populate("productId");
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (count !== undefined) {
      if (count <= 0) {
        await item.remove();
        return res.status(200).json({ message: "Item removed from cart" });
      }
      if (count > item.productId.availability) {
        return res.status(400).json({ message: "Insufficient availability" });
      }
      item.count = count;
    }

    if (note !== undefined) item.note = note;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE /cart/:id - remove an item from the cart
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CartItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    await item.remove();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
