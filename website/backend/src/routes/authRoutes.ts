import { Router } from 'express';
import { registerUser } from '../controllers/authController';

const router = Router();

// Route mapping for User Authentication operations
router.post('/register', registerUser);

export default router;
