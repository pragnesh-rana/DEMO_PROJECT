import { Router } from 'express';
import { login, register, getCurrentUser } from './auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected route (requires authentication)
router.get('/me', authMiddleware, getCurrentUser);

export default router;
