const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

// 🛒 Fake database (kategoriya bo‘yicha mahsulotlar)
let categories = {
  hotdishes: [
    {
      id: 1,
      title: "Spicy seasoned seafood noodles",
      price: 2.29,
      availability: "20 Bowls available",
    },
    {
      id: 2,
      title: "Spicy beef ramen",
      price: 3.49,
      availability: "15 Bowls available",
    },
  ],
  colddishes: [
    {
      id: 3,
      title: "Cold sushi rolls",
      price: 2.69,
      availability: "10 Rolls available",
    },
  ],
};

// 🛍️ Cart (karzinka)
let cart = [];

// ✅ GET - barcha mahsulotlar
// ✅ GET - barcha mahsulotlar (har birida 'type' bo‘ladi)
app.get("/products", (req, res) => {
  let allProducts = [];

  for (let category in categories) {
    const withType = categories[category].map((product) => ({
      ...product,
      type: category,
    }));
    allProducts = allProducts.concat(withType);
  }

  res.json(allProducts);
});

// ✅ GET - kategoriya bo‘yicha mahsulotlar
app.get("/products/:category", (req, res) => {
  const { category } = req.params;
  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(categories[category]);
});

// ✅ GET - kategoriya va id bo‘yicha mahsulot
app.get("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;
  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }
  const product = categories[category].find((p) => p.id == id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// ➕ POST - kategoriya bo‘yicha mahsulot qo‘shish
app.post("/products/:category", (req, res) => {
  const { category } = req.params;
  const { title, price, availability } = req.body;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }
  if (!title || !price || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newProduct = {
    id: categories[category].length + 1,
    title,
    price: parseFloat(price),
    availability,
  };

  categories[category].push(newProduct);
  res.status(201).json(newProduct);
});

// ✏️ PUT - mahsulotni yangilash
app.put("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const { title, price, availability } = req.body;

  if (!categories[category])
    return res.status(404).json({ message: "Category not found" });

  const product = categories[category].find((p) => p.id == id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (!title || !price || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  product.title = title;
  product.price = parseFloat(price);
  product.availability = availability;

  res.json(product);
});

// ❌ DELETE - mahsulotni o‘chirish
app.delete("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;

  if (!categories[category])
    return res.status(404).json({ message: "Category not found" });

  const index = categories[category].findIndex((p) => p.id == id);
  if (index === -1)
    return res.status(404).json({ message: "Product not found" });

  categories[category].splice(index, 1);
  res.status(204).send();
});

// 🛒 CART ENDPOINTS

// ✅ GET - karzinkadagi mahsulotlar va total narx
app.get("/cart", (req, res) => {
  const items = cart.map((item) => {
    let foundProduct = null;

    for (const category in categories) {
      foundProduct = categories[category].find((p) => p.id === item.productId);
      if (foundProduct) {
        foundProduct = { ...foundProduct, type: category };
        break;
      }
    }

    return {
      product: foundProduct,
      count: item.count,
    };
  });

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.count,
    0
  );

  res.json({
    items,
    totalPrice: `$${total.toFixed(2)}`,
    discount: 0,
  });
});

// ➕ POST - mahsulotni karzinkaga qo‘shish
app.post("/cart", (req, res) => {
  const { productId, count } = req.body;

  if (!productId || !count) {
    return res.status(400).json({ message: "productId va count kerak" });
  }

  const exists = cart.find((item) => item.productId === productId);
  if (exists) {
    exists.count += count;
    return res.json(exists);
  }

  cart.push({
    id: Date.now(),
    productId,
    count,
  });

  res.status(201).json({ message: "Mahsulot karzinkaga qo‘shildi" });
});

// ✏️ PUT - mahsulotni yangilash (count yoki note)
app.put("/cart/:id", (req, res) => {
  const { id } = req.params;
  const { count } = req.body;
  const item = cart.find((i) => i.id == id);

  if (!item) return res.status(404).json({ message: "Item not found" });

  if (count !== undefined) item.count = count;

  res.json(item);
});

// ❌ DELETE - mahsulotni karzinkadan o‘chirish
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  const index = cart.findIndex((i) => i.id == id);
  if (index === -1) return res.status(404).json({ message: "Item not found" });

  cart.splice(index, 1);
  res.status(204).send();
});
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
