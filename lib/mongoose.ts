import mongoose from "mongoose";
import { MONGODB_CONFIG } from "./config";

declare global {
  var mongoose: any;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null, isConnected: false };
}

const MONGODB_URI = 'mongodb://localhost:27017/defaultdb';

if (!MONGODB_URI) {
  throw new Error('MongoDB connection string is missing!');
}

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }
  try {
    // Import all models to ensure schemas are registered
    await import('@/models/user');
    await import('@/models/movie');
    await import('@/models/Booking');
    await import('@/models/Payment');

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      ssl: process.env.NODE_ENV === 'production',
      tls: process.env.NODE_ENV === 'production',
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
