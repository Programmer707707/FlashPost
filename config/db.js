const mongoose = require('mongoose');

// Connect DB
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');
      } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
      }

    console.log("👨🏻‍💻MongoDB connected successfully");
}

module.exports = connectDB;