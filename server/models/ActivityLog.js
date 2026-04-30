const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'login', 'register', 'export'],
    required: true
  },
  entity: {
    type: String,
    enum: ['student', 'user', 'system'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Auto-expire logs after 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Index for efficient querying
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
