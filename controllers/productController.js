// controllers/productController.js
const Product = require('../models/Product');

// GET /products - retrieve all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /products/:category - products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    // Validate category
    if (!['hotdishes','colddishes'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /products/:category/:id - specific product
exports.getProductById = async (req, res) => {
  try {
    const { category, id } = req.params;
    const product = await Product.findById(id);
    if (!product || product.category !== category) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /products/:category - create a new product
exports.createProduct = async (req, res) => {
  try {
    const { category } = req.params;
    if (!['hotdishes','colddishes'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    // Override category from URL to ensure consistency
    const { title, price, availability } = req.body;
    const newProduct = new Product({ title, category, price, availability });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    // Mongoose validation error
    res.status(400).json({ message: err.message });
  }
};

// PUT /products/:category/:id - update a product
exports.updateProduct = async (req, res) => {
  try {
    const { category, id } = req.params;
    const { title, price, availability } = req.body;
    const product = await Product.findById(id);
    if (!product || product.category !== category) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Update fields
    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (availability !== undefined) product.availability = availability;
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE /products/:category/:id - delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { category, id } = req.params;
    const product = await Product.findById(id);
    if (!product || product.category !== category) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
