const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/logs
// @access  Private (Admin)
exports.getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by action type
    if (req.query.action) {
      query.action = req.query.action;
    }

    // Filter by entity
    if (req.query.entity) {
      query.entity = req.query.entity;
    }

    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email role');

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      logs
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs'
    });
  }
};
