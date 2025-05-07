const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://alibekjumaniyazov007:1267aa%23%23@food-pos.sgayx9i.mongodb.net/food_pos?retryWrites=true&w=majority&appName=FOOD-POS", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDBga muvaffaqiyatli ulandi");
  } catch (err) {
    console.error("MongoDBga ulanib bo‘lmadi:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
