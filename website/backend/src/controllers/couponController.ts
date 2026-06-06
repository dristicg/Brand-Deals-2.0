import { Request, Response, NextFunction } from 'express';
import Coupon, { ICoupon } from '../models/Coupon';
import Cart from '../models/Cart';
import { AppError } from '../utils/AppError';
import { CreateCouponSchema, UpdateCouponSchema, ValidateCouponSchema } from '../utils/couponValidators';

// Helper function to validate coupon rules
export const checkCouponValidity = (coupon: ICoupon, userId: string, cartTotal: number): { isValid: boolean; error?: string } => {
  if (!coupon.active) {
    return { isValid: false, error: 'This coupon is inactive' };
  }

  const now = new Date();
  if (now < coupon.startDate) {
    return { isValid: false, error: 'This coupon is not active yet' };
  }
  if (now > coupon.expiryDate) {
    return { isValid: false, error: 'This coupon has expired' };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, error: 'This coupon has reached its usage limit' };
  }

  if (cartTotal < coupon.minCartAmount) {
    return { isValid: false, error: `Minimum cart amount of ₹${coupon.minCartAmount} required to apply this coupon` };
  }

  // Check user specific usage limit
  const userUsage = coupon.usersUsed.find((uu) => uu.user.toString() === userId.toString());
  if (userUsage && userUsage.count >= coupon.userUsageLimit) {
    return { isValid: false, error: 'You have reached your limit for using this coupon' };
  }

  return { isValid: true };
};

// Helper function to calculate discount
export const calculateCouponDiscount = (coupon: ICoupon, cartTotal: number): number => {
  let discount = 0;
  if (coupon.discountType === 'fixed') {
    discount = coupon.discountValue;
  } else if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
  }

  // Cap at max discount if percentage and maxDiscountAmount is set
  if (coupon.discountType === 'percentage' && coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  // Discount cannot exceed cart total
  return Math.min(discount, cartTotal);
};

/**
 * @desc    Create a Coupon
 * @route   POST /api/v1/coupons
 * @access  Private (Admin Only)
 */
export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = CreateCouponSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    const { code } = validation.data;
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return next(new AppError('Coupon code already exists', 400));
    }

    const newCoupon = await Coupon.create(validation.data);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: {
        coupon: newCoupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Coupons
 * @route   GET /api/v1/coupons
 * @access  Private (Admin Only)
 */
export const getAllCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        coupons,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Coupon by ID
 * @route   GET /api/v1/coupons/:id
 * @access  Private (Admin Only)
 */
export const getCouponById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return next(new AppError('Coupon not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a Coupon
 * @route   PUT /api/v1/coupons/:id
 * @access  Private (Admin Only)
 */
export const updateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = UpdateCouponSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return next(new AppError('Coupon not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: {
        coupon: updatedCoupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a Coupon
 * @route   DELETE /api/v1/coupons/:id
 * @access  Private (Admin Only)
 */
export const deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return next(new AppError('Coupon not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate a Coupon against User's Cart
 * @route   POST /api/v1/coupons/validate
 * @access  Private
 */
export const validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const validation = ValidateCouponSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    const { code } = validation.data;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return next(new AppError('Invalid coupon code', 404));
    }

    // Get the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'price isActive name',
    });

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Your cart is empty', 400));
    }

    // Calculate total amount of active products in cart
    let cartTotal = 0;
    for (const item of cart.items) {
      const product = item.product as any;
      if (product.isActive) {
        cartTotal += product.price * item.quantity;
      }
    }

    // Check validity
    const validity = checkCouponValidity(coupon, req.user._id.toString(), cartTotal);
    if (!validity.isValid) {
      return next(new AppError(validity.error || 'Coupon validation failed', 400));
    }

    const discountAmount = calculateCouponDiscount(coupon, cartTotal);
    const finalAmount = Math.max(0, cartTotal - discountAmount);

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        cartTotal,
        discountAmount,
        finalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};
