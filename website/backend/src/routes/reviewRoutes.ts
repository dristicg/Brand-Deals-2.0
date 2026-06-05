import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProductReviews, createReview } from '../controllers/reviewController';

const router = Router();

// Public route to get reviews
router.get('/:productId', getProductReviews);

// Protected route to submit a review
router.post('/:productId', protect, createReview);

export default router;
