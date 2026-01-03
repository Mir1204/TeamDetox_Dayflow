const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { validateLeaveRequest, validateLeaveAction } = require('../validators/leave.validator');
const { validate } = require('../middlewares/validate.middleware');
const { uploadAttachments } = require('../config/multer'); // FIXED: Import attachments upload

// All routes require authentication
router.use(authenticate);

// Employee Routes

// @route   POST /api/leave/apply
// @desc    Apply for leave
// @access  Private (Employee, HR, Admin)
router.post(
  '/apply',
  uploadAttachments, // FIXED: Use the exported function
  validate(validateLeaveRequest),
  leaveController.applyLeave
);

// @route   GET /api/leave/my-leaves
// @desc    Get own leave requests
// @access  Private (Employee, HR, Admin)
router.get('/my-leaves', leaveController.getOwnLeaves);

// @route   GET /api/leave/my-leaves/:leaveId
// @desc    Get specific leave request details
// @access  Private (Employee, HR, Admin)
router.get('/my-leaves/:leaveId', leaveController.getOwnLeaveById);

// @route   PUT /api/leave/my-leaves/:leaveId
// @desc    Update own leave request (only if pending)
// @access  Private (Employee, HR, Admin)
router.put(
  '/my-leaves/:leaveId',
  validate(validateLeaveRequest),
  leaveController.updateOwnLeave
);

// @route   DELETE /api/leave/my-leaves/:leaveId
// @desc    Cancel own leave request (only if pending)
// @access  Private (Employee, HR, Admin)
router.delete('/my-leaves/:leaveId', leaveController.cancelOwnLeave);

// @route   GET /api/leave/balance
// @desc    Get leave balance
// @access  Private (Employee, HR, Admin)
router.get('/balance', leaveController.getLeaveBalance);

// Admin/HR Routes

// @route   GET /api/leave/all
// @desc    Get all leave requests
// @access  Private (HR, Admin)
router.get(
  '/all',
  authorizeRoles('HR', 'Admin'),
  leaveController.getAllLeaves
);

// @route   GET /api/leave/pending
// @desc    Get all pending leave requests
// @access  Private (HR, Admin)
router.get(
  '/pending',
  authorizeRoles('HR', 'Admin'),
  leaveController.getPendingLeaves
);

// @route   GET /api/leave/employee/:employeeId
// @desc    Get specific employee's leave requests
// @access  Private (HR, Admin)
router.get(
  '/employee/:employeeId',
  authorizeRoles('HR', 'Admin'),
  leaveController.getEmployeeLeaves
);

// @route   PUT /api/leave/:leaveId/approve
// @desc    Approve leave request
// @access  Private (HR, Admin)
router.put(
  '/:leaveId/approve',
  authorizeRoles('HR', 'Admin'),
  validate(validateLeaveAction),
  leaveController.approveLeave
);

// @route   PUT /api/leave/:leaveId/reject
// @desc    Reject leave request
// @access  Private (HR, Admin)
router.put(
  '/:leaveId/reject',
  authorizeRoles('HR', 'Admin'),
  validate(validateLeaveAction),
  leaveController.rejectLeave
);

// @route   GET /api/leave/employee/:employeeId/balance
// @desc    Get employee's leave balance
// @access  Private (HR, Admin)
router.get(
  '/employee/:employeeId/balance',
  authorizeRoles('HR', 'Admin'),
  leaveController.getEmployeeLeaveBalance
);

module.exports = router;