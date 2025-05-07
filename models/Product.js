// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['hotdishes', 'colddishes']  // only these categories allowed
  },
  price: { type: Number, required: true, min: 0 },
  availability: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
