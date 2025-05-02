const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Rasm fayllar uchun

// 🔌 MongoDB
connectDB();

// 📦 Routerlar
app.use("/products", require("./routes/products"));
app.use("/cart", require("./routes/cart"));

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
