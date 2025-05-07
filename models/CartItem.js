// models/CartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  count: { type: Number, required: true, min: 1 },
  note: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
