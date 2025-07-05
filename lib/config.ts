import { config } from 'dotenv';

// Load environment variables
config();

// MongoDB Configuration
export const MONGODB_CONFIG = {
  uri: 'mongodb://localhost:27017/defaultdb',
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    ssl: process.env.NODE_ENV === 'production',
    tls: process.env.NODE_ENV === 'production',
  }
};

// Redis Configuration (if needed)
export const REDIS_CONFIG = {
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
};

// JWT Configuration (if needed)
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h',
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  maxRequests: 50,
  windowMs: 10 * 1000, // 10 seconds
};