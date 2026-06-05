import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController';

const router = Router();

// Public / Authenticated Customer routes
router.post('/validate', protect, validateCoupon);

// Admin-only CRUD routes
router.use(protect, admin);

router.route('/')
  .post(createCoupon)
  .get(getAllCoupons);

router.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

export default router;
