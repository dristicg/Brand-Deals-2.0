import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController';

const router = Router();

// Protect all routes under this router
router.use(protect);

router.route('/me').get(getProfile).put(updateProfile);
router.route('/me/addresses').post(addAddress);
router.route('/me/addresses/:addressId').put(updateAddress).delete(deleteAddress);

export default router;
