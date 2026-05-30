import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Bootstrap and Start Express Server
 */
const startServer = async (): Promise<void> => {
  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] Running in ${NODE_ENV} mode on port ${PORT}`);
  });

  // Handle Unhandled Promise Rejections globally
  process.on('unhandledRejection', (err: any) => {
    console.error(`[Server] Unhandled Promise Rejection: ${err.message || err}`);
    // Graceful close
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle Uncaught Exceptions globally
  process.on('uncaughtException', (err: Error) => {
    console.error(`[Server] Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();
