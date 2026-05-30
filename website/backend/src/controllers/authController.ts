import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { RegisterSchema } from '../utils/authValidators';
import { AppError } from '../utils/AppError';

/**
 * Generate a JSON Web Token
 */
export const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_shoe_store_jwt_key_2026', {
    expiresIn: (process.env.JWT_EXPIRE || '30d') as any,
  });
};

/**
 * Utility to generate token, configure secure cookie and construct response JSON
 */
export const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
  const token = signToken(user._id.toString());

  // Define cookie preferences for secure session storage
  const cookieOptions = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 Days expiration window
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.cookie('token', token, cookieOptions);

  // Return non-sensitive attributes in payload
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedAddresses: user.savedAddresses,
        createdAt: user.createdAt,
      },
    },
  });
};

/**
 * @desc    Register a new customer account
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Parse and validate incoming body properties using Zod
    const validatedData = RegisterSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Reject registration if email already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('A user with that email already exists', 400));
    }

    // Insert user (password auto-hashes in Schema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    // Forward Zod validation and other operational errors to global handler
    next(error);
  }
};
