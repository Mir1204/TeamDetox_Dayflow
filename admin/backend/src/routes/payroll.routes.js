const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { validatePayrollUpdate } = require('../validators/payroll.validator');
const { validate } = require('../middlewares/validate.middleware');

// All routes require authentication
router.use(authenticate);

// Employee Routes

// @route   GET /api/payroll/my-salary
// @desc    Get own salary details (read-only)
// @access  Private (Employee, HR, Admin)
router.get('/my-salary', payrollController.getOwnSalary);

// @route   GET /api/payroll/my-salary/history
// @desc    Get own salary history
// @access  Private (Employee, HR, Admin)
router.get('/my-salary/history', payrollController.getOwnSalaryHistory);

// @route   GET /api/payroll/my-salary/slip
// @desc    Generate salary slip
// @access  Private (Employee, HR, Admin)
router.get('/my-salary/slip', payrollController.generateOwnSalarySlip);

// Admin/HR Routes

// @route   GET /api/payroll/all
// @desc    Get all employees' payroll
// @access  Private (HR, Admin)
router.get(
  '/all',
  authorizeRoles('HR', 'Admin'),
  payrollController.getAllPayroll
);

// @route   GET /api/payroll/employee/:employeeId
// @desc    Get specific employee's payroll
// @access  Private (HR, Admin)
router.get(
  '/employee/:employeeId',
  authorizeRoles('HR', 'Admin'),
  payrollController.getEmployeePayroll
);

// @route   POST /api/payroll/create
// @desc    Create payroll for new employee
// @access  Private (HR, Admin)
router.post(
  '/create',
  authorizeRoles('HR', 'Admin'),
  validate(validatePayrollUpdate),
  payrollController.createPayroll
);

// @route   PUT /api/payroll/employee/:employeeId
// @desc    Update employee's salary structure
// @access  Private (HR, Admin)
router.put(
  '/employee/:employeeId',
  authorizeRoles('HR', 'Admin'),
  validate(validatePayrollUpdate),
  payrollController.updatePayroll
);

// @route   GET /api/payroll/employee/:employeeId/history
// @desc    Get employee's salary history
// @access  Private (HR, Admin)
router.get(
  '/employee/:employeeId/history',
  authorizeRoles('HR', 'Admin'),
  payrollController.getEmployeeSalaryHistory
);

// @route   DELETE /api/payroll/employee/:employeeId
// @desc    Delete employee's payroll (use with caution)
// @access  Private (Admin only)
router.delete(
  '/employee/:employeeId',
  authorizeRoles('Admin'),
  payrollController.deletePayroll
);

// @route   GET /api/payroll/summary
// @desc    Get payroll summary/statistics
// @access  Private (HR, Admin)
router.get(
  '/summary',
  authorizeRoles('HR', 'Admin'),
  payrollController.getPayrollSummary
);

module.exports = router;