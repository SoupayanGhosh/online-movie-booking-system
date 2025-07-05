// This file is deprecated. Use lib/mongoose.ts for all database connections.

const mongoose = require('mongoose');
require('dotenv').config();

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectDB = async (retryCount = 0) => {
  try {
    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect('mongodb://localhost:27017/defaultdb', options);
    console.log('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => connectDB(), RETRY_INTERVAL);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);

    // Handle specific MongoDB error types
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check if the server is running.');
    } else if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Please check your MONGODB_URI.');
    }

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.error('Max retry attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;