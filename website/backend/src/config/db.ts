import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shoe_store';
    
    // Configure mongoose settings
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection failure: ${(error as Error).message}`);
    // Exit process with failure code
    process.exit(1);
  }
};
