// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      match: [/\S+@\S+\.\S+/, 'Invalid email']  // simple email regex
    }
  },
  products: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    count: { type: Number, required: true, min: 1 },
    note: { type: String, default: '' },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 }
  }],
  totalPrice: { type: Number, required: true, min: 0 },
  tableNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Completed'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, required: true },
  diningOption: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
