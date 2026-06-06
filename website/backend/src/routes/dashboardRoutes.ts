import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = Router();

// Retrieve dashboard stats - protected for logged-in admin accounts only
router.get('/stats', protect, admin, getDashboardStats);

export default router;
