import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';

const router = Router();

// Protect all order routes
router.use(protect);

router.get('/', getMyOrders);
router.get('/admin', admin, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', admin, updateOrderStatus);

export default router;
