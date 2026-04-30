const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin access
router.use(protect, authorize('admin'));

router.get('/', getLogs);

module.exports = router;
