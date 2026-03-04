import { Router } from 'express';
import { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/refresh-token', refreshToken);
router.post('/password-reset', authLimiter, forgotPassword);
router.post('/password-reset/confirm', authLimiter, resetPassword);

export default router;
