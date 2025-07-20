import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://angryprash8505:EU14CcDeWpwseOim@vaishnoshop.i2sbpq0.mongodb.net/?retryWrites=true&w=majority&appName=VaishnoShop/shop"


if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    // 1 = connected, 2 = connecting
    return mongoose.connection;
  }
  try {
    const conn = await mongoose.connect(MONGODB_URI as string);
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB; 