const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, promoteToAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

const loginValidation = [
  body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').notEmpty()
];

const profileValidation = [
  body('name', 'Name must be at least 2 characters').optional().isLength({ min: 2 }).trim(),
  body('email', 'Please provide a valid email').optional().isEmail().normalizeEmail()
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);
router.put('/make-admin/:id', protect, authorize('admin'), promoteToAdmin);

module.exports = router;
