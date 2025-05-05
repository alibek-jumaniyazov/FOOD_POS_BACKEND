const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
  customerName: String,
  customerEmail: String,
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
