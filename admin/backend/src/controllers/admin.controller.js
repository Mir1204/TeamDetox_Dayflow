// controllers/admin.controller.js
const employeeService = require('../services/employee.service');
const attendanceService = require('../services/attendance.service');
const leaveService = require('../services/leave.service');
const payrollService = require('../services/payroll.service');
const authService = require('../services/auth.service');
const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/Leave.model');
const Payroll = require('../models/Payroll.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const { getFileUrl } = require('../config/multer');
const crypto = require('crypto');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (HR, Admin)
exports.getAdminDashboard = asyncHandler(async (req, res) => {
  // Get total counts
  const [
    totalEmployees,
    activeEmployees,
    totalLeaveRequests,
    pendingLeaves,
    todayAttendance,
    totalPayroll
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ isActive: true }),
    Leave.countDocuments(),
    Leave.countDocuments({ status: 'Pending' }),
    Attendance.countDocuments({ 
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }),
    Payroll.countDocuments()
  ]);

  // Get attendance summary for today
  const todayAttendanceSummary = await Attendance.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get recent leave requests
  const recentLeaves = await Leave.find()
    .populate('employeeId', 'personalDetails')
    .populate('userId', 'employeeId email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get department-wise employee count
  const departmentStats = await Employee.aggregate([
    {
      $group: {
        _id: '$jobDetails.department',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get monthly attendance trends (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const attendanceTrends = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  const dashboardData = {
    overview: {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      totalLeaveRequests,
      pendingLeaves,
      todayAttendance,
      totalPayroll
    },
    todayAttendance: todayAttendanceSummary.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentLeaves,
    departmentStats,
    attendanceTrends
  };

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Dashboard statistics retrieved successfully',
    dashboardData
  );
});

// @desc    Get all employees list
// @route   GET /api/admin/employees
// @access  Private (HR, Admin)
exports.getAllEmployees = asyncHandler(async (req, res) => {
  const { department, designation, isActive } = req.query;

  const filters = {
    ...(department && { department }),
    ...(designation && { designation }),
    ...(isActive !== undefined && { isActive: isActive === 'true' })
  };

  const employees = await employeeService.getAllEmployees(filters);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employees retrieved successfully',
    {
      count: employees.length,
      employees
    }
  );
});

// @desc    Get specific employee details
// @route   GET /api/admin/employees/:employeeId
// @access  Private (HR, Admin)
exports.getEmployeeById = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await employeeService.getProfileByEmployeeId(employeeId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee details retrieved successfully',
    employee
  );
});

// @desc    Create new employee
// @route   POST /api/admin/employees
// @access  Private (HR, Admin)
exports.createEmployee = asyncHandler(async (req, res) => {
  const { 
    employeeId, 
    email, 
    password, 
    role, 
    personalDetails, 
    jobDetails 
  } = req.body;

  // Generate temporary password if not provided
  const tempPassword = password || crypto.randomBytes(8).toString('hex');

  // Create user account
  const userData = {
    employeeId,
    email,
    password: tempPassword,
    role: role || 'Employee',
    firstName: personalDetails.firstName,
    lastName: personalDetails.lastName
  };

  const result = await authService.signUp(userData);

  // Update employee profile with full details
  const employee = await Employee.findById(result.employee.id);
  
  if (personalDetails) {
    Object.assign(employee.personalDetails, personalDetails);
  }
  
  if (jobDetails) {
    Object.assign(employee.jobDetails, jobDetails);
  }

  await employee.save();

  // Send welcome email with temporary password
  // await sendWelcomeEmail(email, result.employee.fullName, employeeId, tempPassword);

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    SUCCESS_MESSAGES.EMPLOYEE_CREATED,
    {
      user: result.user,
      employee,
      temporaryPassword: tempPassword
    }
  );
});

// @desc    Update employee details (full access)
// @route   PUT /api/admin/employees/:employeeId
// @access  Private (HR, Admin)
exports.updateEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const updatedEmployee = await employeeService.updateEmployee(
    employeeId,
    req.body
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.EMPLOYEE_UPDATED,
    updatedEmployee
  );
});

// @desc    Delete/Deactivate employee
// @route   DELETE /api/admin/employees/:employeeId
// @access  Private (Admin only)
exports.deleteEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const result = await employeeService.deleteEmployee(employeeId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.EMPLOYEE_DELETED,
    result
  );
});

// @desc    Activate employee
// @route   PUT /api/admin/employees/:employeeId/activate
// @access  Private (Admin only)
exports.activateEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'Employee not found'
    );
  }

  employee.isActive = true;
  await employee.save();

  // Also activate user account
  await User.findByIdAndUpdate(employee.userId, { isActive: true });

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee activated successfully',
    employee
  );
});

// @desc    Deactivate employee
// @route   PUT /api/admin/employees/:employeeId/deactivate
// @access  Private (Admin only)
exports.deactivateEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'Employee not found'
    );
  }

  employee.isActive = false;
  await employee.save();

  // Also deactivate user account
  await User.findByIdAndUpdate(employee.userId, { isActive: false });

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee deactivated successfully',
    employee
  );
});

// @desc    Update employee role
// @route   PUT /api/admin/employees/:employeeId/role
// @access  Private (Admin only)
exports.updateEmployeeRole = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const { role } = req.body;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'Employee not found'
    );
  }

  // Update user role
  const user = await User.findByIdAndUpdate(
    employee.userId,
    { role },
    { new: true }
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Employee role updated successfully',
    user
  );
});

// @desc    Get attendance report
// @route   GET /api/admin/reports/attendance
// @access  Private (HR, Admin)
exports.getAttendanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, department, employeeId } = req.query;

  let query = {};

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (employeeId) {
    query.employeeId = employeeId;
  }

  let attendanceData = await Attendance.find(query)
    .populate({
      path: 'employeeId',
      populate: {
        path: 'userId',
        select: 'employeeId email'
      }
    })
    .sort({ date: -1 });

  // Filter by department if provided
  if (department) {
    attendanceData = attendanceData.filter(
      att => att.employeeId.jobDetails.department === department
    );
  }

  // Generate summary
  const summary = attendanceData.reduce((acc, att) => {
    acc[att.status] = (acc[att.status] || 0) + 1;
    return acc;
  }, {});

  const totalWorkingHours = attendanceData.reduce(
    (sum, att) => sum + (att.workingHours || 0),
    0
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Attendance report generated successfully',
    {
      totalRecords: attendanceData.length,
      summary,
      totalWorkingHours: Math.round(totalWorkingHours * 100) / 100,
      attendanceRecords: attendanceData
    }
  );
});

// @desc    Get leave report
// @route   GET /api/admin/reports/leave
// @access  Private (HR, Admin)
exports.getLeaveReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, department, status, leaveType } = req.query;

  let query = {};

  if (startDate && endDate) {
    query.startDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (status) {
    query.status = status;
  }

  if (leaveType) {
    query.leaveType = leaveType;
  }

  let leaveData = await Leave.find(query)
    .populate({
      path: 'employeeId',
      populate: {
        path: 'userId',
        select: 'employeeId email'
      }
    })
    .populate('reviewedBy', 'employeeId email')
    .sort({ createdAt: -1 });

  // Filter by department if provided
  if (department) {
    leaveData = leaveData.filter(
      leave => leave.employeeId.jobDetails.department === department
    );
  }

  // Generate summary
  const summary = {
    byStatus: {},
    byType: {},
    totalDays: 0
  };

  leaveData.forEach(leave => {
    summary.byStatus[leave.status] = (summary.byStatus[leave.status] || 0) + 1;
    summary.byType[leave.leaveType] = (summary.byType[leave.leaveType] || 0) + 1;
    if (leave.status === 'Approved') {
      summary.totalDays += leave.totalDays;
    }
  });

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Leave report generated successfully',
    {
      totalRecords: leaveData.length,
      summary,
      leaveRecords: leaveData
    }
  );
});

// @desc    Get payroll report
// @route   GET /api/admin/reports/payroll
// @access  Private (HR, Admin)
exports.getPayrollReport = asyncHandler(async (req, res) => {
  const { department } = req.query;

  let query = {};

  let payrollData = await Payroll.find(query)
    .populate({
      path: 'employeeId',
      populate: {
        path: 'userId',
        select: 'employeeId email'
      }
    })
    .sort({ netSalary: -1 });

  // Filter by department if provided
  if (department) {
    payrollData = payrollData.filter(
      payroll => payroll.employeeId.jobDetails.department === department
    );
  }

  // Generate summary
  const totalMonthlySalary = payrollData.reduce(
    (sum, p) => sum + p.netSalary,
    0
  );

  const averageSalary = payrollData.length > 0 
    ? totalMonthlySalary / payrollData.length 
    : 0;

  const departmentWise = payrollData.reduce((acc, p) => {
    const dept = p.employeeId.jobDetails.department;
    if (!acc[dept]) {
      acc[dept] = {
        count: 0,
        totalSalary: 0
      };
    }
    acc[dept].count += 1;
    acc[dept].totalSalary += p.netSalary;
    return acc;
  }, {});

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Payroll report generated successfully',
    {
      totalEmployees: payrollData.length,
      totalMonthlySalary: Math.round(totalMonthlySalary * 100) / 100,
      totalAnnualSalary: Math.round(totalMonthlySalary * 12 * 100) / 100,
      averageSalary: Math.round(averageSalary * 100) / 100,
      departmentWise,
      payrollRecords: payrollData
    }
  );
});

// @desc    Get overall analytics
// @route   GET /api/admin/analytics
// @access  Private (HR, Admin)
exports.getAnalytics = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const currentYear = year ? parseInt(year) : new Date().getFullYear();
  const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0);

  // Get various analytics
  const [
    employeeGrowth,
    attendanceAnalytics,
    leaveAnalytics,
    departmentDistribution
  ] = await Promise.all([
    // Employee growth over last 12 months
    Employee.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]),

    // Attendance analytics for the month
    Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$workingHours' }
        }
      }
    ]),

    // Leave analytics for the month
    Leave.aggregate([
      {
        $match: {
          startDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            type: '$leaveType'
          },
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]),

    // Department distribution
    Employee.aggregate([
      {
        $group: {
          _id: '$jobDetails.department',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Analytics retrieved successfully',
    {
      employeeGrowth,
      attendanceAnalytics,
      leaveAnalytics,
      departmentDistribution
    }
  );
});

// @desc    Bulk upload attendance
// @route   POST /api/admin/bulk/attendance
// @access  Private (HR, Admin)
exports.bulkUploadAttendance = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Please upload a CSV file'
    );
  }

  // TODO: Implement CSV parsing and bulk attendance upload
  // This would require parsing the CSV file and creating attendance records

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Bulk attendance upload feature coming soon'
  );
});

// @desc    Bulk create employees
// @route   POST /api/admin/bulk/employees
// @access  Private (Admin only)
exports.bulkCreateEmployees = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Please upload a CSV file'
    );
  }

  // TODO: Implement CSV parsing and bulk employee creation
  // This would require parsing the CSV file and creating user/employee records

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Bulk employee creation feature coming soon'
  );
});