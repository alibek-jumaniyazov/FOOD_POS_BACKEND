const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

let categories = {
  hotdishes: [
    {
      id: 1,
      title: "Spicy seasoned seafood noodles",
      price: 2.29,
      availability: 20,
      category: "hotdishes",
    },
    {
      id: 2,
      title: "Spicy beef ramen",
      price: 3.49,
      availability: 15,
      category: "hotdishes",
    },
    {
      id: 3,
      title: "Spicy beef ramen",
      price: 3.49,
      availability: 15,
      category: "hotdishes",
    },
    {
      id: 4,
      title: "Spicy beef ramen",
      price: 3.49,
      availability: 15,
      category: "hotdishes",
    },
  ],
  colddishes: [
    {
      id: 5,
      title: "Cold sushi rolls",
      price: 2.69,
      availability: 10,
      category: "colddishes",
    },
    {
      id: 6,
      title: "Spicy beef ramen",
      price: 3.49,
      availability: 15,
      category: "colddishes",
    },
  ],
};

let cart = []; 

let orders = []; 

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
  const { title, price, availability } = req.body;

  if (!categories[category]) {
    return res.status(404).json({ message: "Category not found" });
  }
  if (!title || !price || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const allProducts = Object.values(categories).flat();

  const newProduct = {
    id: allProducts.length + 1,
    title,
    price: parseFloat(price),
    availability,
    category,
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
        note: item.note,
        unitPrice: product.price,
        totalPrice: +(product.price * item.count).toFixed(2),
      };
    })
    .filter(Boolean);

  const total = items.reduce((acc, item) => acc + item.totalPrice, 0);

  res.json({
    items,
    totalPrice: total.toFixed(2),
    discount: 0,
  });
});

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
    if (note !== undefined) {
      exists.note = note; // faqat note yuborilgan bo‘lsa, yangilanadi
    }
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
  res.status(201).json({
    message: "Yangi mahsulot karzinkaga qo‘shildi",
    addedItem: newItem,
  });
});

// ✏️ PUT - karzinkadagi mahsulot count yoki note'ini yangilash
app.put("/cart/:id", (req, res) => {
  const { id } = req.params;
  const { count, note } = req.body;

  const item = cart.find((i) => i.id == id);
  if (!item) {
    return res.status(404).json({ message: "Cart item topilmadi" });
  }

  // Agar count yuborilgan bo‘lsa, tekshiruv va yangilash
  if (count !== undefined) {
    if (typeof count !== "number" || count <= 0) {
      return res
        .status(400)
        .json({ message: "Yangi count musbat raqam bo'lishi kerak" });
    }
    item.count = count;
  }

  // Agar note yuborilgan bo‘lsa, yangilash
  if (note !== undefined) {
    item.note = note;
  }

  const product = findProductById(item.productId);
  res.json({
    id: item.id,
    productId: item.productId,
    count: item.count,
    note: item.note,
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

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const {
    customer,
    paymentMethod,
    diningOption,
    tableNumber,
    products,
    totalPrice,
  } = req.body;

  if (
    !customer.name ||
    !customer.email ||
    !paymentMethod ||
    !diningOption ||
    cart.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Barcha maydonlar to‘ldirilishi kerak" });
  }

  const orderItems = products.map((item) => {
    const product = findProductById(item.productId);

    if (!product || product.availability < item.count) {
      return null;
    }

    // 🔻 availability ni kamaytirish
    product.availability -= item.count;

    return {
      productId: item.productId,
      title: product.title,
      price: product.price,
      count: item.count,
      note: item.note,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    };
  });

  if (orderItems.includes(null)) {
    return res
      .status(400)
      .json({ message: "Mahsulot yetarli emas yoki mavjud emas" });
  }

  const newOrder = {
    id: Date.now(),
    customer: {
      name: customer.name,
      email: customer.email,
    },
    products: orderItems,
    paymentMethod,
    diningOption,
    totalPrice,
    tableNumber,
    status: "Pending",
  };

  orders.push(newOrder);
  cart = []; // 🧹 Savatni tozalash
  res.status(201).json({ message: "Buyurtma yaratildi", order: newOrder });
});

app.put("/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id == id);

  if (!order) {
    return res.status(404).json({ message: "Buyurtma topilmadi" });
  }

  if (order.status === "Pending") order.status = "Preparing";
  else if (order.status === "Preparing") order.status = "Completed";
  else
    return res.status(400).json({ message: "Buyurtma allaqachon yakunlangan" });

  res.json({ message: "Status yangilandi", order });
});

app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  const index = cart.findIndex((i) => i.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Orders topilmadi" });
  }

  cart.splice(index, 1);
  res.status(204).send();
});

// ✅ GET - eng ko‘p sotilgan mahsulotlar (most ordered products)
app.get("/orders/most", (req, res) => {
  const productSales = {};

  for (const order of orders) {
    for (const item of order.products) {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productId: item.productId,
          title: item.title,
          totalSold: 0,
        };
      }
      productSales[item.productId].totalSold += item.count;
    }
  }

  const sorted = Object.values(productSales).sort(
    (a, b) => b.totalSold - a.totalSold
  );

  res.json(sorted);
});

// 📊 GET - buyurtmalar statistikasi
app.get("/orders/statistics", (req, res) => {
  const stats = {
    totalOrders: orders.length,
    totalRevenue: 0,
    statusCount: {
      Pending: 0,
      Preparing: 0,
      Completed: 0,
    },
  };

  for (const order of orders) {
    stats.totalRevenue += parseFloat(order.totalPrice);
    if (stats.statusCount[order.status] !== undefined) {
      stats.statusCount[order.status]++;
    }
  }

  res.json({
    ...stats,
    totalRevenue: `$${stats.totalRevenue.toFixed(2)}`,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
