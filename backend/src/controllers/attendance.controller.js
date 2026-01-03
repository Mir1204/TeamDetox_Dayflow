// controllers/attendance.controller.js
const attendanceService = require('../services/attendance.service');
const { successResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

// @desc    Check in for the day
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkIn(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    'Checked in successfully',
    attendance
  );
});

// @desc    Check out for the day
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkOut(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Checked out successfully',
    attendance
  );
});

// @desc    Get own attendance records
// @route   GET /api/attendance/my-attendance
// @access  Private
exports.getOwnAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const attendance = await attendanceService.getOwnAttendance(
    req.user.id,
    startDate,
    endDate
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Attendance records retrieved successfully',
    attendance
  );
});

// @desc    Get own attendance summary
// @route   GET /api/attendance/my-attendance/summary
// @access  Private
exports.getOwnAttendanceSummary = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;

  const summary = await attendanceService.getOwnAttendanceSummary(
    req.user.id,
    year,
    month
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Attendance summary retrieved successfully',
    summary
  );
});

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getTodayAttendance(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    "Today's attendance retrieved successfully",
    attendance
  );
});

// @desc    Get all employees' attendance (Admin/HR)
// @route   GET /api/attendance/all
// @access  Private (HR, Admin)
exports.getAllAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, employeeId } = req.query;

  const filters = {
    ...(status && { status }),
    ...(employeeId && { employeeId })
  };

  const attendance = await attendanceService.getAllAttendance(
    startDate,
    endDate,
    filters
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'All attendance records retrieved successfully',
    attendance
  );
});

// @desc    Get specific employee's attendance (Admin/HR)
// @route   GET /api/attendance/employee/:employeeId
// @access  Private (HR, Admin)
exports.getEmployeeAttendance = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query;

  const attendance = await attendanceService.getEmployeeAttendance(
    employeeId,
    startDate,
    endDate
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee attendance retrieved successfully',
    attendance
  );
});

// @desc    Manually mark attendance (Admin/HR)
// @route   POST /api/attendance/mark
// @access  Private (HR, Admin)
exports.markAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.markAttendance(
    req.body,
    req.user.id
  );

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    SUCCESS_MESSAGES.ATTENDANCE_MARKED,
    attendance
  );
});

// @desc    Update attendance record (Admin/HR)
// @route   PUT /api/attendance/:attendanceId
// @access  Private (HR, Admin)
exports.updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;

  const updatedAttendance = await attendanceService.updateAttendance(
    attendanceId,
    req.body
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Attendance record updated successfully',
    updatedAttendance
  );
});

// @desc    Delete attendance record (Admin)
// @route   DELETE /api/attendance/:attendanceId
// @access  Private (Admin)
exports.deleteAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;

  const result = await attendanceService.deleteAttendance(attendanceId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    result.message
  );
});