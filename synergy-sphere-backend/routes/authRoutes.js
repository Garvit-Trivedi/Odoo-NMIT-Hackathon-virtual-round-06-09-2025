import express from 'express';
import { validateRegister, validateLogin } from '../middleware/validators.js';
import { registerUser, updateMe, loginUser, refreshToken, logout, forgotPassword, resetPassword, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

export default router;
