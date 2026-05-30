import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AppError } from '../utils/AppError';

// Declare custom property on Express Request type safely in TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Protect middleware - guards routes to ensure request is authenticated via JWT
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Retrieve token from Authorization header or from cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if ((req as any).cookies?.token) {
    token = (req as any).cookies.token;
  }

  // Ensure token exists
  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_shoe_store_jwt_key_2026'
    ) as DecodedToken;

    // Fetch user from DB and attach to Request payload (exclude password)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // Grant access
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token validation failed', 401));
  }
};

/**
 * Admin middleware - restricts access exclusively to administrative accounts
 */
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new AppError('Access denied: Admin privileges required', 403));
  }
};
