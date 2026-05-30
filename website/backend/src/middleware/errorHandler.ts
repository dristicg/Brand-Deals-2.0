import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log error for diagnostics
  console.error(`[Error] ${req.method} ${req.originalUrl} -`, err);

  // Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 400;
  }

  // Mongoose duplicate key (MongoServerError code 11000)
  if (err.code === 11000) {
    const fieldName = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate field value entered for: ${fieldName || 'unique field'}`;
    statusCode = 400;
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // JSON Web Token signature failure
  if (err.name === 'JsonWebTokenError') {
    message = 'Not authorized, token validation failed';
    statusCode = 401;
  }

  // JSON Web Token expiration
  if (err.name === 'TokenExpiredError') {
    message = 'Not authorized, token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
