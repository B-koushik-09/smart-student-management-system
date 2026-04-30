const ActivityLog = require('../models/ActivityLog');

/**
 * Log an activity action
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - Action type (create, update, delete, login, register, export)
 * @param {string} params.entity - Entity type (student, user, system)
 * @param {string} [params.entityId] - ID of the affected entity
 * @param {string} params.details - Human-readable description
 * @param {Object} [params.metadata] - Additional data
 * @param {string} [params.ipAddress] - Request IP address
 */
const logActivity = async ({ userId, action, entity, entityId, details, metadata = {}, ipAddress = '' }) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      entity,
      entityId,
      details,
      metadata,
      ipAddress
    });
  } catch (error) {
    // Log to console but don't fail the main operation
    console.error('Activity log error:', error.message);
  }
};

module.exports = { logActivity };
