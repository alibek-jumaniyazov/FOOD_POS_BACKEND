const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.error("❌ MongoDB xato:", err));

const productRoutes = require("./routes/products"); 
app.use("/", productRoutes);

const orderRoutes = require("./routes/orders");
app.use("/", orderRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`);
});
