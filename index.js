// const express = require("express");
// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // 🛒 Fake database (statik ma’lumotlar)
// let products = [
//   {
//     id: 1,
//     title: "Spicy seasoned seafood noodles",
//     price: "$ 2.29",
//     availability: "20 Bowls available",
//   },
//   {
//     id: 2,
//     title: "Spicy seasoned seafood noodles",
//     price: "$ 2.29",
//     availability: "20 Bowls available",
//   },
//   {
//     id: 3,
//     title: "Spicy seasoned seafood noodles",
//     price: "$ 2.29",
//     availability: "20 Bowls available",
//   },
// ];

// // ✅ GET - barcha mahsulotlar
// app.get("/products", (req, res) => {
//   res.json(products);
// });

// // ➕ POST - yangi mahsulot qo‘shish
// app.post("/products", (req, res) => {
//   const newProduct = req.body;
//   newProduct.id = products.length + 1;
//   products.push(newProduct);
//   res.status(201).json(newProduct);
//   res.send("Mahsulot qo'shildi");
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server ${PORT}-portda ishlayapti`);
// });
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// 🛒 Fake database (statik ma’lumotlar)
let categories = {
  hotdishes: [
    {
      id: 1,
      title: "Spicy seasoned seafood noodles",
      price: "$2.29",
      availability: "20 Bowls available",
    },
    {
      id: 2,
      title: "Spicy seasoned seafood noodles",
      price: "$2.29",
      availability: "20 Bowls available",
    },
  ],
  colddishes: [
    {
      id: 3,
      title: "Cold sushi rolls",
      price: "$3.49",
      availability: "15 Rolls available",
    },
  ],
};

// ✅ GET - barcha mahsulotlar
app.get("/products", (req, res) => {
  let allProducts = [];
  
  // Barcha kategoriyalardagi mahsulotlarni birlashtiramiz
  for (let category in categories) {
    allProducts = allProducts.concat(categories[category]);
  }

  res.json(allProducts);
});

// ✅ GET - kategoriya bo‘yicha mahsulotni id bilan olish
app.get("/products/:category/:id", (req, res) => {
    const { category, id } = req.params;
  
    if (!categories[category]) {
      return res.status(404).json({ message: "Category not found" });
    }
  
    const product = categories[category].find(p => p.id == id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  
    res.json(product);
  });
  

// ✅ GET - kategoriya bo‘yicha mahsulotlarni olish
app.get("/products/:category", (req, res) => {
  const { category } = req.params;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(categories[category]);
});

// ➕ POST - kategoriya bo‘yicha yangi mahsulot qo‘shish
app.post("/products/:category", (req, res) => {
  const { category } = req.params;
  const { title, price, availability } = req.body;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Validatsiya
  if (!title || !price || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newProduct = {
    id: categories[category].length + 1,
    title,
    price,
    availability,
  };

  categories[category].push(newProduct);
  res.status(201).json(newProduct);
});

// ✏️ PUT - kategoriya bo‘yicha mahsulotni tahrirlash
app.put("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const { title, price, availability } = req.body;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }

  const product = categories[category].find(p => p.id == id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Validatsiya
  if (!title || !price || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  product.title = title;
  product.price = price;
  product.availability = availability;

  res.json(product);
});

// ❌ DELETE - kategoriya bo‘yicha mahsulotni o'chirish
app.delete("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }

  const productIndex = categories[category].findIndex(p => p.id == id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  categories[category].splice(productIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
