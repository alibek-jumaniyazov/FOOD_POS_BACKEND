const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/restaurant");
    console.log("✅ MongoDB ulandi");
  } catch (error) {
    console.error("❌ MongoDB ulanishda xatolik:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
