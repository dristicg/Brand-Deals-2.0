import { Router } from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController';

const router = Router();

// Route mapping for User Authentication operations
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

export default router;
