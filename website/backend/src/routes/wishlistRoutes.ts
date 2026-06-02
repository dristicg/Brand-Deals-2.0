import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlistController';

const router = Router();

// Protect all routes under this router
router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(toggleWishlistItem);

export default router;
