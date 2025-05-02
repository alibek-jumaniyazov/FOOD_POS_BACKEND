const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: String },
  image: { type: String }, // uploads/image.jpg kabi saqlanadi
});

module.exports = mongoose.model("Product", ProductSchema);
