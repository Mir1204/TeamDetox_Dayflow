// controllers/payroll.controller.js
const payrollService = require('../services/payroll.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

// @desc    Get own salary details (read-only)
// @route   GET /api/payroll/my-salary
// @access  Private
exports.getOwnSalary = asyncHandler(async (req, res) => {
  const salary = await payrollService.getOwnSalary(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Salary details retrieved successfully',
    salary
  );
});

// @desc    Get own salary history
// @route   GET /api/payroll/my-salary/history
// @access  Private
exports.getOwnSalaryHistory = asyncHandler(async (req, res) => {
  const history = await payrollService.getOwnSalaryHistory(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Salary history retrieved successfully',
    history
  );
});

// @desc    Generate salary slip
// @route   GET /api/payroll/my-salary/slip
// @access  Private
exports.generateOwnSalarySlip = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const salarySlip = await payrollService.generateOwnSalarySlip(
    req.user.id,
    month ? parseInt(month) : undefined,
    year ? parseInt(year) : undefined
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Salary slip generated successfully',
    salarySlip
  );
});

// @desc    Get all employees' payroll (Admin/HR)
// @route   GET /api/payroll/all
// @access  Private (HR, Admin)
exports.getAllPayroll = asyncHandler(async (req, res) => {
  const { department } = req.query;

  const filters = {
    ...(department && { department })
  };

  const payrolls = await payrollService.getAllPayroll(filters);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'All payroll records retrieved successfully',
    payrolls
  );
});

// @desc    Get specific employee's payroll (Admin/HR)
// @route   GET /api/payroll/employee/:employeeId
// @access  Private (HR, Admin)
exports.getEmployeePayroll = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const payroll = await payrollService.getEmployeePayroll(employeeId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee payroll retrieved successfully',
    payroll
  );
});

// @desc    Create payroll for new employee (Admin/HR)
// @route   POST /api/payroll/create
// @access  Private (HR, Admin)
exports.createPayroll = asyncHandler(async (req, res) => {
  console.log('🔍 CREATE PAYROLL - Controller Debug:');
  console.log('─────────────────────────────────────────');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Employee ID from body:', req.body.employeeId);
  console.log('Employee ID type:', typeof req.body.employeeId);
  console.log('Employee ID length:', req.body.employeeId?.length);
  console.log('User making request:', req.user.id);
  console.log('─────────────────────────────────────────\n');

  const { employeeId, ...salaryData } = req.body;

  // Additional validation
  if (!employeeId) {
    console.log('❌ No employeeId provided in request body');
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Employee ID is required'
    );
  }

  // Check if it's a valid format (24 hex characters)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(employeeId)) {
    console.log('❌ Invalid ObjectId format:', employeeId);
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      `Invalid employee ID format. Expected 24 character hex string, got: "${employeeId}"`
    );
  }

  console.log('✅ Employee ID format is valid, proceeding to service...\n');

  const payroll = await payrollService.createPayroll(
    employeeId,
    salaryData,
    req.user.id
  );

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    SUCCESS_MESSAGES.PAYROLL_CREATED,
    payroll
  );
});

// @desc    Update employee's salary structure (Admin/HR)
// @route   PUT /api/payroll/employee/:employeeId
// @access  Private (HR, Admin)
exports.updatePayroll = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const updatedPayroll = await payrollService.updatePayroll(
    employeeId,
    req.body,
    req.user.id
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.PAYROLL_UPDATED,
    updatedPayroll
  );
});

// @desc    Get employee's salary history (Admin/HR)
// @route   GET /api/payroll/employee/:employeeId/history
// @access  Private (HR, Admin)
exports.getEmployeeSalaryHistory = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const history = await payrollService.getEmployeeSalaryHistory(employeeId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee salary history retrieved successfully',
    history
  );
});

// @desc    Delete employee's payroll (Admin only)
// @route   DELETE /api/payroll/employee/:employeeId
// @access  Private (Admin)
exports.deletePayroll = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const result = await payrollService.deletePayroll(employeeId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    result.message
  );
});

// @desc    Get payroll summary/statistics (Admin/HR)
// @route   GET /api/payroll/summary
// @access  Private (HR, Admin)
exports.getPayrollSummary = asyncHandler(async (req, res) => {
  const summary = await payrollService.getPayrollSummary();

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Payroll summary retrieved successfully',
    summary
  );
});