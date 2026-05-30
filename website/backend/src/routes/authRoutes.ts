import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Route mapping for User Authentication operations
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
