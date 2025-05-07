// const express = require("express");
// const app = express();
// const cors = require("cors");
// const connectDB = require("./config/db");
// require("dotenv").config();

// app.use(express.json());

// connectDB();

// app.use(cors());
// app.use("/products", require("./routes/productRoutes"));
// app.use("/cart", require("./routes/cartRoutes"));
// app.use("/orders", require("./routes/orderRoutes"));

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Server Error" });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// app.js
const cors = require("cors");
const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Mount feature routers
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

// Global error handler (fallback)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
