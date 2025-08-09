const mongoose = require('mongoose');

// MongoDB Connection Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techfix';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected: ', conn.connection.host);
  } catch (error) {
    console.log('Error: ', error.message);
    console.log('Failed to connect to MongoDB. Please ensure MongoDB is running.');
    // Don't exit the process, let the server run without DB connection
    // The API will handle individual errors gracefully
  }
};

module.exports = connectDB; 