import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { UpdateProfileSchema, AddressSchema } from '../utils/userValidators';

/**
 * Get current user profile details
 * GET /api/v1/users/me
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile details (name, email)
 * PUT /api/v1/users/me
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Parse and validate request body
    const validation = UpdateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    const { name, email } = validation.data;

    // Check email uniqueness if email is being updated
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('Email address is already in use', 400));
      }
      req.user.email = email;
    }

    if (name) {
      req.user.name = name;
    }

    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new AppError('Email address is already in use', 400));
    }
    next(error);
  }
};

/**
 * Add a new saved address to user profile
 * POST /api/v1/users/me/addresses
 */
export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const validation = AddressSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    req.user.savedAddresses.push(validation.data);
    const updatedUser = await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        addresses: updatedUser.savedAddresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a specific saved address
 * PUT /api/v1/users/me/addresses/:addressId
 */
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const validation = AddressSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    // Find address by sub-document ID
    const address = (req.user.savedAddresses as any).id(req.params.addressId);
    if (!address) {
      return next(new AppError('Address not found', 404));
    }

    // Assign updated values
    Object.assign(address, validation.data);
    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: {
        addresses: updatedUser.savedAddresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific saved address
 * DELETE /api/v1/users/me/addresses/:addressId
 */
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const address = (req.user.savedAddresses as any).id(req.params.addressId);
    if (!address) {
      return next(new AppError('Address not found', 404));
    }

    // Remove address using mongoose subdocument helper
    address.deleteOne();
    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: {
        addresses: updatedUser.savedAddresses,
      },
    });
  } catch (error) {
    next(error);
  }
};
