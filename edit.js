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
      bowls: 20,
      availability: "20 Bowls available",
      category: "hotdishes",
    },
    {
      id: 2,
      title: "Spicy beef ramen",
      price: 3.49,
      bowls: 20,
      availability: "15 Bowls available",
      category: "hotdishes",
    },
    {
      id: 3,
      title: "Spicy beef ramen",
      price: 3.49,
      bowls: 20,
      availability: "15 Bowls available",
      category: "hotdishes",
    },
    {
      id: 4,
      title: "Spicy beef ramen",
      price: 3.49,
      bowls: 20,
      availability: "15 Bowls available",
      category: "hotdishes",
    },
  ],
  colddishes: [
    {
      id: 5,
      title: "Cold sushi rolls",
      price: 2.69,
      bowls: 20,
      availability: "10 Rolls available",
      category: "colddishes",
    },
    {
      id: 6,
      title: "Spicy beef ramen",
      price: 3.49,
      bowls: 20,
      availability: "15 Bowls available",
      category: "colddishes",
    },
  ],
};

// 🛍️ Cart (karzinka)
let cart = []; // [{ id, productId, count }]

// ✅ GET - barcha mahsulotlar
app.get("/products", (req, res) => {
  let allProducts = [];
  for (let category in categories) {
    const productsWithCategory = categories[category].map((product) => ({
      ...product,
      category,
    }));
    allProducts = allProducts.concat(productsWithCategory);
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
  const { title, price, availability, bowls } = req.body;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }
  if (!title || !price || !availability || !bowls) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newProduct = {
    id: categories[category].length + 1,
    title,
    price: parseFloat(price),
    bowls,
    availability,
  };

  categories[category].push(newProduct);
  res.status(201).json(newProduct);
});

// ✏️ PUT - mahsulotni yangilash
app.put("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const { title, price, availability, bowls } = req.body;

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
  product.bowls = bowls;

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
// 🔎 Mahsulotni umumiy ro‘yxatdan topish uchun helper
function findProductById(id) {
  for (let category in categories) {
    const product = categories[category].find((p) => p.id == id);
    if (product) return product;
  }
  return null;
}

// 🛒 Karzinkadagi mahsulotlar

// ✅ GET - karzinkadagi mahsulotlar va total narx
app.get("/cart", (req, res) => {
  const items = cart
    .map((item) => {
      const product = findProductById(item.productId);
      if (!product) return null;
      return {
        id: item.id,
        productId: item.productId,
        count: item.count,
        title: product.title,
        unitPrice: product.price,
        totalPrice: +(product.price * item.count).toFixed(2),
      };
    })
    .filter(Boolean);

  const total = items.reduce((acc, item) => acc + item.totalPrice, 0);

  res.json({
    items,
    totalPrice: `$${total.toFixed(2)}`,
    discount: 0,
  });
});

// ➕ POST - mahsulotni karzinkaga qo‘shish (bir xil productId bo‘lsa count += yangi count)
app.post("/cart", (req, res) => {
  const { productId, count, note } = req.body;

  if (!productId || typeof count !== "number" || count <= 0) {
    return res
      .status(400)
      .json({ message: "productId va count (musbat son) kerak" });
  }

  const exists = cart.find((item) => item.productId === productId);
  if (exists) {
    exists.count += count;
    if (note) exists.note = note; // optional note update
    return res
      .status(200)
      .json({ message: "Count yangilandi", updatedItem: exists });
  }

  const newItem = {
    id: Date.now(),
    productId,
    count,
    note: note || "",
  };

  cart.push(newItem);
  res
    .status(201)
    .json({
      message: "Yangi mahsulot karzinkaga qo‘shildi",
      addedItem: newItem,
    });
});

// ✏️ PUT - karzinkadagi mahsulot count'ini yangilash
app.put("/cart/:id", (req, res) => {
  const { id } = req.params;
  const { count } = req.body;

  const item = cart.find((i) => i.id == id);
  if (!item) return res.status(404).json({ message: "Cart item topilmadi" });

  if (typeof count !== "number") {
    return res
      .status(400)
      .json({ message: "Yangi count raqam bo'lishi kerak" });
  }

  item.count = count;

  const product = findProductById(item.productId);
  res.json({
    id: item.id,
    productId: item.productId,
    count: item.count,
    title: product?.title,
    unitPrice: product?.price,
    totalPrice: +(product?.price * item.count).toFixed(2),
  });
});
// ❌ DELETE - mahsulotni karzinkadan o‘chirish
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  const index = cart.findIndex((i) => i.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Cart item topilmadi" });
  }

  cart.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
