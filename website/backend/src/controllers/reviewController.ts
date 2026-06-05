import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import { AppError } from '../utils/AppError';
import { CreateReviewSchema } from '../utils/reviewValidators';

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/v1/reviews/:productId
 * @access  Public
 */
export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate({
        path: 'user',
        select: 'name', // Only send the user's name
      })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      data: {
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new review
 * @route   POST /api/v1/reviews/:productId
 * @access  Private (Verified Purchasers Only)
 */
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.user!._id;

    // 1. Validate request body
    const validation = CreateReviewSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    // 2. Check if the user already submitted a review for this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    // 3. VERIFIED PURCHASER LOGIC
    // Check if the user has an order with this product that has been delivered
    const hasPurchased = await Order.findOne({
      user: userId,
      orderStatus: 'delivered',
      'items.product': productId,
    });

    if (!hasPurchased) {
      return next(new AppError('You can only review products that have been delivered to you', 403));
    }

    // 4. Create the review
    const { rating, review } = validation.data;
    const newReview = await Review.create({
      user: userId,
      product: productId,
      rating,
      review,
    });

    // Populate user name before sending response
    await newReview.populate({ path: 'user', select: 'name' });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review: newReview,
      },
    });
  } catch (error) {
    next(error);
  }
};
