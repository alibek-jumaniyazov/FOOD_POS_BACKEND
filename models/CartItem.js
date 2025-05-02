const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  count: { type: Number, required: true },
  note: { type: String },
});

module.exports = mongoose.model("CartItem", CartItemSchema);
