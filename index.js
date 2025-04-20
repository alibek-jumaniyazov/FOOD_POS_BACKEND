const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// 🛒 Fake database (statik ma’lumotlar)
let products = [
  {
    id: 1,
    name: "Spicy seasoned seafood noodles",
    price: 2.29,
    bowls: 20
  },
  {
    id: 2,
    name: "Salted pasta with mushroom sauce",
    price: 2.69,
    bowls: 30
  }
];

// ✅ GET - barcha mahsulotlar
app.get("/products", (req, res) => {
  res.json(products);
});

// ➕ POST - yangi mahsulot qo‘shish
app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length + 1;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
