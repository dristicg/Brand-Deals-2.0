import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createOrder, verifyPayment } from '../controllers/paymentController';

const router = Router();

// Protect all payment routes
router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
