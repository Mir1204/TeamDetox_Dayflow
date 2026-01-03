// routes/leave.routes.js
const express = require('express');
const router = express.Router();

// Controllers
const leaveController = require('../controllers/leave.controller');

// Middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { isHROrAdmin, isEmployee } = require('../middlewares/role.middleware');
const { validateBody, validateQuery, validateParams } = require('../middlewares/validate.middleware');

// Validators
const {
  validateLeaveRequest,
  validateLeaveUpdate,
  validateLeaveAction,
  validateLeaveFilters,
  validateLeaveBalance
} = require('../validators/leave.validator');

// Multer for attachments
const { uploadAttachments, handleMulterError } = require('../config/multer');

// ============================================
// EMPLOYEE ROUTES
// ============================================

// Apply for leave
router.post(
  '/apply',
  authenticate,
  isEmployee,
  uploadAttachments,
  handleMulterError,
  validateBody(validateLeaveRequest),
  leaveController.applyLeave
);

// Get own leave requests
router.get(
  '/my-leaves',
  authenticate,
  isEmployee,
  validateQuery(validateLeaveFilters),
  leaveController.getOwnLeaves
);

// Get specific own leave request
router.get(
  '/my-leaves/:leaveId',
  authenticate,
  isEmployee,
  leaveController.getOwnLeaveById
);

// Update own leave request (only pending)
router.put(
  '/my-leaves/:leaveId',
  authenticate,
  isEmployee,
  validateBody(validateLeaveUpdate),
  leaveController.updateOwnLeave
);

// Cancel own leave request
router.delete(
  '/my-leaves/:leaveId',
  authenticate,
  isEmployee,
  leaveController.cancelOwnLeave
);

// Get leave balance
router.get(
  '/balance',
  authenticate,
  isEmployee,
  validateQuery(validateLeaveBalance),
  leaveController.getLeaveBalance
);

// ============================================
// ADMIN/HR ROUTES
// ============================================

// Get all leave requests
router.get(
  '/all',
  authenticate,
  isHROrAdmin,
  validateQuery(validateLeaveFilters),
  leaveController.getAllLeaves
);

// Get pending leave requests
router.get(
  '/pending',
  authenticate,
  isHROrAdmin,
  leaveController.getPendingLeaves
);

// Get specific employee's leaves
router.get(
  '/employee/:employeeId',
  authenticate,
  isHROrAdmin,
  validateQuery(validateLeaveFilters),
  leaveController.getEmployeeLeaves
);

// Get employee's leave balance
router.get(
  '/employee/:employeeId/balance',
  authenticate,
  isHROrAdmin,
  validateQuery(validateLeaveBalance),
  leaveController.getEmployeeLeaveBalance
);

// IMPORTANT: Approve leave - Fixed route
router.put(
  '/:leaveId/approve',
  authenticate,
  isHROrAdmin,
  validateBody(validateLeaveAction),
  leaveController.approveLeave
);

// IMPORTANT: Reject leave - Fixed route
router.put(
  '/:leaveId/reject',
  authenticate,
  isHROrAdmin,
  validateBody(validateLeaveAction),
  leaveController.rejectLeave
);

module.exports = router;