const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://financial:financial@financial.hhvbr.mongodb.net/?retryWrites=true&w=majority&appName=financial");
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;