import express from 'express';
import {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} from '../middleware/validate.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);
router.get('/me', protect, getMe);

export default router;
