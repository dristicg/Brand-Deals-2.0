import { Request, Response, NextFunction } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';

/**
 * Get or create the authenticated user's wishlist
 * GET /api/v1/wishlist
 */
export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Find or create wishlist for user
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug brand category gender price comparePrice images ratingsAverage ratingsCount isActive',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: {
        wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle a product inside the user's wishlist (adds if absent, removes if present)
 * POST /api/v1/wishlist
 */
export const toggleWishlistItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const { productId } = req.body;

    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }

    // 1. Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // 2. Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // 3. Toggle product presence in products array
    const existingIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    let isAdded = false;
    if (existingIndex > -1) {
      // Remove from wishlist
      wishlist.products.splice(existingIndex, 1);
    } else {
      // Add to wishlist
      wishlist.products.push(productId);
      isAdded = true;
    }

    await wishlist.save();

    // Populate product details for response
    const populatedWishlist = await wishlist.populate({
      path: 'products',
      select: 'name slug brand category gender price comparePrice images ratingsAverage ratingsCount isActive',
    });

    res.status(200).json({
      success: true,
      message: isAdded ? 'Product added to wishlist' : 'Product removed from wishlist',
      data: {
        isAdded,
        wishlist: populatedWishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};
