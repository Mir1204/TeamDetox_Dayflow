// routes/payroll.routes.js
const express = require('express');
const router = express.Router();

// Controllers
const payrollController = require('../controllers/payroll.controller');

// Middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { isHROrAdmin, isAdmin, isEmployee } = require('../middlewares/role.middleware');
const { validateBody, validateQuery } = require('../middlewares/validate.middleware');

// Validators
const {
  validatePayrollCreate,       // IMPORTANT: Use the correct validator
  validatePayrollUpdate,
  validatePayrollPartialUpdate,
  validateSalarySlip,
  validatePayrollFilters
} = require('../validators/payroll.validator');

// ============================================
// EMPLOYEE ROUTES
// ============================================

// Get own salary details
router.get(
  '/my-salary',
  authenticate,
  isEmployee,
  payrollController.getOwnSalary
);

// Get own salary history
router.get(
  '/my-salary/history',
  authenticate,
  isEmployee,
  payrollController.getOwnSalaryHistory
);

// Generate own salary slip
router.get(
  '/my-salary/slip',
  authenticate,
  isEmployee,
  validateQuery(validateSalarySlip),
  payrollController.generateOwnSalarySlip
);

// ============================================
// ADMIN/HR ROUTES
// ============================================

// Get all employees' payroll
router.get(
  '/all',
  authenticate,
  isHROrAdmin,
  validateQuery(validatePayrollFilters),
  payrollController.getAllPayroll
);

// Get payroll summary/statistics
router.get(
  '/summary',
  authenticate,
  isHROrAdmin,
  payrollController.getPayrollSummary
);

// Get specific employee's payroll
router.get(
  '/employee/:employeeId',
  authenticate,
  isHROrAdmin,
  payrollController.getEmployeePayroll
);

// Get employee's salary history
router.get(
  '/employee/:employeeId/history',
  authenticate,
  isHROrAdmin,
  payrollController.getEmployeeSalaryHistory
);

// IMPORTANT: Create payroll - Use validatePayrollCreate
router.post(
  '/create',
  authenticate,
  isHROrAdmin,
  validateBody(validatePayrollCreate),  // ← FIXED: Use the right validator
  payrollController.createPayroll
);

// Update employee's payroll
router.put(
  '/employee/:employeeId',
  authenticate,
  isHROrAdmin,
  validateBody(validatePayrollUpdate),
  payrollController.updatePayroll
);

// Delete employee's payroll (Admin only)
router.delete(
  '/employee/:employeeId',
  authenticate,
  isAdmin,
  payrollController.deletePayroll
);

module.exports = router;