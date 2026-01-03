// controllers/leave.controller.js
const leaveService = require('../services/leave.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const { getFileUrl } = require('../config/multer');

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private
exports.applyLeave = asyncHandler(async (req, res) => {
  // Handle attachments if uploaded
  const attachments = req.files ? req.files.map(file => ({
    name: file.originalname,
    url: getFileUrl(file.path),
    uploadedAt: new Date()
  })) : [];

  const leave = await leaveService.applyLeave(
    req.user.id,
    req.body,
    attachments
  );

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    SUCCESS_MESSAGES.LEAVE_APPLIED,
    leave
  );
});

// @desc    Get own leave requests
// @route   GET /api/leave/my-leaves
// @access  Private
exports.getOwnLeaves = asyncHandler(async (req, res) => {
  const { status, leaveType } = req.query;

  const filters = {
    ...(status && { status }),
    ...(leaveType && { leaveType })
  };

  const leaves = await leaveService.getOwnLeaves(req.user.id, filters);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Leave requests retrieved successfully',
    leaves
  );
});

// @desc    Get specific leave request details
// @route   GET /api/leave/my-leaves/:leaveId
// @access  Private
exports.getOwnLeaveById = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;

  const leave = await leaveService.getOwnLeaveById(req.user.id, leaveId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Leave request retrieved successfully',
    leave
  );
});

// @desc    Update own leave request (only if pending)
// @route   PUT /api/leave/my-leaves/:leaveId
// @access  Private
exports.updateOwnLeave = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;

  const updatedLeave = await leaveService.updateOwnLeave(
    req.user.id,
    leaveId,
    req.body
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Leave request updated successfully',
    updatedLeave
  );
});

// @desc    Cancel own leave request (only if pending)
// @route   DELETE /api/leave/my-leaves/:leaveId
// @access  Private
exports.cancelOwnLeave = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;

  const result = await leaveService.cancelOwnLeave(req.user.id, leaveId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    result.message
  );
});

// @desc    Get leave balance
// @route   GET /api/leave/balance
// @access  Private
exports.getLeaveBalance = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const balance = await leaveService.getLeaveBalance(req.user.id, year);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Leave balance retrieved successfully',
    balance
  );
});

// @desc    Get all leave requests (Admin/HR)
// @route   GET /api/leave/all
// @access  Private (HR, Admin)
exports.getAllLeaves = asyncHandler(async (req, res) => {
  const { status, leaveType, startDate, endDate } = req.query;

  const filters = {
    ...(status && { status }),
    ...(leaveType && { leaveType }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate })
  };

  const leaves = await leaveService.getAllLeaves(filters);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'All leave requests retrieved successfully',
    leaves
  );
});

// @desc    Get all pending leave requests (Admin/HR)
// @route   GET /api/leave/pending
// @access  Private (HR, Admin)
exports.getPendingLeaves = asyncHandler(async (req, res) => {
  const leaves = await leaveService.getPendingLeaves();

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Pending leave requests retrieved successfully',
    leaves
  );
});

// @desc    Get specific employee's leave requests (Admin/HR)
// @route   GET /api/leave/employee/:employeeId
// @access  Private (HR, Admin)
exports.getEmployeeLeaves = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.query;

  const filters = {
    ...(status && { status })
  };

  const leaves = await leaveService.getEmployeeLeaves(employeeId, filters);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee leave requests retrieved successfully',
    leaves
  );
});

// @desc    Approve leave request (Admin/HR)
// @route   PUT /api/leave/:leaveId/approve
// @access  Private (HR, Admin)
exports.approveLeave = asyncHandler(async (req, res) => {
  // IMPORTANT: Extract leaveId from params
  const { leaveId } = req.params;
  const { adminComments } = req.body;

  // Debug logging (remove after fixing)
  console.log('✅ Controller - approveLeave:');
  console.log('  leaveId from params:', leaveId);
  console.log('  req.params:', req.params);
  console.log('  adminComments:', adminComments);
  console.log('  user:', req.user);

  // Validation: Check if leaveId exists
  if (!leaveId) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Leave ID is required'
    );
  }

  const approvedLeave = await leaveService.approveLeave(
    leaveId,
    req.user.id,
    adminComments
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.LEAVE_APPROVED,
    approvedLeave
  );
});

// @desc    Reject leave request (Admin/HR)
// @route   PUT /api/leave/:leaveId/reject
// @access  Private (HR, Admin)
exports.rejectLeave = asyncHandler(async (req, res) => {
  // IMPORTANT: Extract leaveId from params
  const { leaveId } = req.params;
  const { adminComments } = req.body;

  // Debug logging (remove after fixing)
  console.log('❌ Controller - rejectLeave:');
  console.log('  leaveId from params:', leaveId);
  console.log('  req.params:', req.params);
  console.log('  adminComments:', adminComments);
  console.log('  user:', req.user);

  // Validation: Check if leaveId exists
  if (!leaveId) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Leave ID is required'
    );
  }

  const rejectedLeave = await leaveService.rejectLeave(
    leaveId,
    req.user.id,
    adminComments
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.LEAVE_REJECTED,
    rejectedLeave
  );
});

// @desc    Get employee's leave balance (Admin/HR)
// @route   GET /api/leave/employee/:employeeId/balance
// @access  Private (HR, Admin)
exports.getEmployeeLeaveBalance = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const balance = await leaveService.getEmployeeLeaveBalance(employeeId, year);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee leave balance retrieved successfully',
    balance
  );
});