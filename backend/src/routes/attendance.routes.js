const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { validateAttendance, validateDateRange } = require('../validators/attendance.validator');
const { validate } = require('../middlewares/validate.middleware');

// All routes require authentication
router.use(authenticate);

// Employee Routes

// @route   POST /api/attendance/check-in
// @desc    Check in for the day
// @access  Private (Employee, HR, Admin)
router.post('/check-in', attendanceController.checkIn);

// @route   POST /api/attendance/check-out
// @desc    Check out for the day
// @access  Private (Employee, HR, Admin)
router.post('/check-out', attendanceController.checkOut);

// @route   GET /api/attendance/my-attendance
// @desc    Get own attendance records
// @access  Private (Employee, HR, Admin)
router.get(
  '/my-attendance',
  validate(validateDateRange),
  attendanceController.getOwnAttendance
);

// @route   GET /api/attendance/my-attendance/summary
// @desc    Get own attendance summary
// @access  Private (Employee, HR, Admin)
router.get('/my-attendance/summary', attendanceController.getOwnAttendanceSummary);

// @route   GET /api/attendance/today
// @desc    Get today's attendance status
// @access  Private (Employee, HR, Admin)
router.get('/today', attendanceController.getTodayAttendance);

// Admin/HR Routes

// @route   GET /api/attendance/all
// @desc    Get all employees' attendance
// @access  Private (HR, Admin)
router.get(
  '/all',
  authorizeRoles('HR', 'Admin'),
  validate(validateDateRange),
  attendanceController.getAllAttendance
);

// @route   GET /api/attendance/employee/:employeeId
// @desc    Get specific employee's attendance
// @access  Private (HR, Admin)
router.get(
  '/employee/:employeeId',
  authorizeRoles('HR', 'Admin'),
  validate(validateDateRange),
  attendanceController.getEmployeeAttendance
);

// @route   POST /api/attendance/mark
// @desc    Manually mark attendance (Admin/HR)
// @access  Private (HR, Admin)
router.post(
  '/mark',
  authorizeRoles('HR', 'Admin'),
  validate(validateAttendance),
  attendanceController.markAttendance
);

// @route   PUT /api/attendance/:attendanceId
// @desc    Update attendance record
// @access  Private (HR, Admin)
router.put(
  '/:attendanceId',
  authorizeRoles('HR', 'Admin'),
  validate(validateAttendance),
  attendanceController.updateAttendance
);

// @route   DELETE /api/attendance/:attendanceId
// @desc    Delete attendance record
// @access  Private (Admin)
router.delete(
  '/:attendanceId',
  authorizeRoles('Admin'),
  attendanceController.deleteAttendance
);

module.exports = router;