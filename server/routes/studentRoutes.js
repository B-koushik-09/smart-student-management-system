const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
  exportStudentsCSV
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules for student
const studentValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('rollNumber', 'Roll number is required').notEmpty().trim(),
  body('department', 'Department is required').notEmpty(),
  body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  body('phone', 'Please provide a valid 10-digit phone number').matches(/^[0-9]{10}$/)
];

const studentUpdateValidation = [
  body('name', 'Name is required').optional().notEmpty().trim(),
  body('email', 'Please provide a valid email').optional().isEmail().normalizeEmail(),
  body('phone', 'Please provide a valid 10-digit phone number').optional().matches(/^[0-9]{10}$/)
];

// All routes are protected
router.use(protect);

// Dashboard stats - must be before /:id to avoid route conflict
router.get('/stats/dashboard', getDashboardStats);

// Export CSV - admin only
router.get('/export/csv', authorize('admin'), exportStudentsCSV);

// CRUD routes
router.route('/')
  .get(getStudents)
  .post(authorize('admin'), studentValidation, createStudent);

router.route('/:id')
  .get(getStudent)
  .put(authorize('admin'), studentUpdateValidation, updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
