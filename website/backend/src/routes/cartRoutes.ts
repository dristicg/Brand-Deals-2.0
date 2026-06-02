import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../controllers/cartController';

const router = Router();

// Protect all routes under this router
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addItemToCart)
  .delete(clearCart);

router.route('/items/:itemId')
  .put(updateItemQuantity)
  .delete(removeItemFromCart);

export default router;
