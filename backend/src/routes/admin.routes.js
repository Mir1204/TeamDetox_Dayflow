const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { validateEmployeeCreate, validateEmployeeFullUpdate } = require('../validators/employee.validator');
const { validate } = require('../middlewares/validate.middleware');
const { upload } = require('../config/multer'); // FIXED: Import base upload

// All routes require authentication and Admin/HR role
router.use(authenticate);
router.use(authorizeRoles('HR', 'Admin'));

// Employee Management

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (HR, Admin)
router.get('/dashboard', adminController.getAdminDashboard);

// @route   GET /api/admin/employees
// @desc    Get all employees list
// @access  Private (HR, Admin)
router.get('/employees', adminController.getAllEmployees);

// @route   GET /api/admin/employees/:employeeId
// @desc    Get specific employee details
// @access  Private (HR, Admin)
router.get('/employees/:employeeId', adminController.getEmployeeById);

// @route   POST /api/admin/employees
// @desc    Create new employee
// @access  Private (HR, Admin)
router.post(
  '/employees',
  validate(validateEmployeeCreate),
  adminController.createEmployee
);

// @route   PUT /api/admin/employees/:employeeId
// @desc    Update employee details (full access)
// @access  Private (HR, Admin)
router.put(
  '/employees/:employeeId',
  validate(validateEmployeeFullUpdate),
  adminController.updateEmployee
);

// @route   DELETE /api/admin/employees/:employeeId
// @desc    Delete/Deactivate employee
// @access  Private (Admin only)
router.delete(
  '/employees/:employeeId',
  authorizeRoles('Admin'),
  adminController.deleteEmployee
);

// @route   PUT /api/admin/employees/:employeeId/activate
// @desc    Activate employee
// @access  Private (Admin only)
router.put(
  '/employees/:employeeId/activate',
  authorizeRoles('Admin'),
  adminController.activateEmployee
);

// @route   PUT /api/admin/employees/:employeeId/deactivate
// @desc    Deactivate employee
// @access  Private (Admin only)
router.put(
  '/employees/:employeeId/deactivate',
  authorizeRoles('Admin'),
  adminController.deactivateEmployee
);

// @route   PUT /api/admin/employees/:employeeId/role
// @desc    Update employee role
// @access  Private (Admin only)
router.put(
  '/employees/:employeeId/role',
  authorizeRoles('Admin'),
  adminController.updateEmployeeRole
);

// Reports & Analytics

// @route   GET /api/admin/reports/attendance
// @desc    Get attendance report
// @access  Private (HR, Admin)
router.get('/reports/attendance', adminController.getAttendanceReport);

// @route   GET /api/admin/reports/leave
// @desc    Get leave report
// @access  Private (HR, Admin)
router.get('/reports/leave', adminController.getLeaveReport);

// @route   GET /api/admin/reports/payroll
// @desc    Get payroll report
// @access  Private (HR, Admin)
router.get('/reports/payroll', adminController.getPayrollReport);

// @route   GET /api/admin/analytics
// @desc    Get overall analytics
// @access  Private (HR, Admin)
router.get('/analytics', adminController.getAnalytics);

// Bulk Operations

// @route   POST /api/admin/bulk/attendance
// @desc    Bulk upload attendance
// @access  Private (HR, Admin)
router.post(
  '/bulk/attendance',
  upload.single('file'), // FIXED: Use upload.single()
  adminController.bulkUploadAttendance
);

// @route   POST /api/admin/bulk/employees
// @desc    Bulk create employees
// @access  Private (Admin only)
router.post(
  '/bulk/employees',
  authorizeRoles('Admin'),
  upload.single('file'), // FIXED: Use upload.single()
  adminController.bulkCreateEmployees
);

module.exports = router;