const cors = require("cors");
const express = require('express');
const { default: env } = require("./config/env.config");

const app = express();

app.use(express.json());
app.use(cors());

// Mount feature routers
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

const PORT = env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
