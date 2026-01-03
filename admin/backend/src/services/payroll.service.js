// services/payroll.service.js
const Payroll = require('../models/Payroll.model');
const Employee = require('../models/Employee.model');
const User = require('../models/User.model');
const { AppError } = require('../middlewares/error.middleware');
const { HTTP_STATUS } = require('../utils/constants');
const mongoose = require('mongoose');

class PayrollService {
  // Get employee's own salary details
  async getOwnSalary(userId) {
    const employee = await Employee.findOne({ userId }).populate('userId', 'employeeId email');
    
    if (!employee) {
      throw new AppError('Employee profile not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .populate('employeeId', 'personalDetails jobDetails')
      .populate('userId', 'employeeId email');

    if (!payroll) {
      throw new AppError('Salary details not found', HTTP_STATUS.NOT_FOUND);
    }

    return payroll;
  }

  // Get employee's salary history
  async getOwnSalaryHistory(userId) {
    const employee = await Employee.findOne({ userId });
    
    if (!employee) {
      throw new AppError('Employee profile not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .select('salaryHistory')
      .populate('salaryHistory.updatedBy', 'employeeId email');

    if (!payroll) {
      throw new AppError('Salary details not found', HTTP_STATUS.NOT_FOUND);
    }

    return payroll.salaryHistory;
  }

  // Generate salary slip for a specific month and year
  async generateOwnSalarySlip(userId, month, year) {
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const employee = await Employee.findOne({ userId })
      .populate('userId', 'employeeId email');
    
    if (!employee) {
      throw new AppError('Employee profile not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id });

    if (!payroll) {
      throw new AppError('Salary details not found', HTTP_STATUS.NOT_FOUND);
    }

    // Generate salary slip
    const salarySlip = {
      employee: {
        name: employee.fullName,
        employeeId: employee.userId.employeeId,
        email: employee.userId.email,
        designation: employee.jobDetails.designation,
        department: employee.jobDetails.department
      },
      period: {
        month: currentMonth,
        year: currentYear
      },
      salary: {
        basicSalary: payroll.salaryStructure.basicSalary,
        allowances: payroll.salaryStructure.allowances,
        deductions: payroll.salaryStructure.deductions,
        grossSalary: payroll.grossSalary,
        totalDeductions: payroll.totalDeductions,
        netSalary: payroll.netSalary
      },
      generatedAt: new Date()
    };

    return salarySlip;
  }

  // Get all employees' payroll (Admin/HR)
  async getAllPayroll(filters = {}) {
    const query = {};

    let payrolls = await Payroll.find(query)
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'employeeId email'
        }
      })
      .sort({ netSalary: -1 });

    // Filter by department if provided
    if (filters.department) {
      payrolls = payrolls.filter(
        p => p.employeeId.jobDetails.department === filters.department
      );
    }

    return payrolls;
  }

  // Get specific employee's payroll (Admin/HR)
  async getEmployeePayroll(employeeId) {
    // Check if employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new AppError('Invalid employee ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'employeeId email'
        }
      })
      .populate('lastUpdatedBy', 'employeeId email');

    if (!payroll) {
      throw new AppError('Payroll not found for this employee', HTTP_STATUS.NOT_FOUND);
    }

    return payroll;
  }

  // Create payroll for new employee (Admin/HR)
  async createPayroll(employeeId, salaryData, updatedBy) {
    console.log('🔍 createPayroll called with:', { employeeId, updatedBy });
    
    // Check if employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      console.log('❌ Invalid ObjectId format:', employeeId);
      throw new AppError('Invalid employee ID format', HTTP_STATUS.BAD_REQUEST);
    }

    // Find employee by _id (MongoDB ObjectId)
    const employee = await Employee.findById(employeeId).populate('userId');
    console.log('📋 Employee found:', employee ? 'Yes' : 'No');
    
    if (!employee) {
      console.log('❌ Employee not found with ID:', employeeId);
      throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
    }
    
    console.log('✅ Employee details:', {
      _id: employee._id,
      userId: employee.userId?._id,
      name: employee.fullName
    });

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({ employeeId: employee._id });
    
    if (existingPayroll) {
      throw new AppError('Payroll already exists for this employee', HTTP_STATUS.CONFLICT);
    }

    // Create new payroll
    const payroll = new Payroll({
      employeeId: employee._id,
      userId: employee.userId._id,
      salaryStructure: salaryData.salaryStructure,
      bankDetails: salaryData.bankDetails || {},
      lastUpdatedBy: updatedBy
    });

    // Add initial salary history
    payroll.addSalaryHistory(updatedBy, 'Initial salary setup');

    await payroll.save();

    // Populate and return
    return await Payroll.findById(payroll._id)
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'employeeId email'
        }
      })
      .populate('lastUpdatedBy', 'employeeId email');
  }

  // Update employee's payroll (Admin/HR)
  async updatePayroll(employeeId, updateData, updatedBy) {
    // Check if employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new AppError('Invalid employee ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id });
    
    if (!payroll) {
      throw new AppError('Payroll not found for this employee', HTTP_STATUS.NOT_FOUND);
    }

    // Update salary structure if provided
    if (updateData.salaryStructure) {
      payroll.salaryStructure = {
        ...payroll.salaryStructure,
        ...updateData.salaryStructure,
        allowances: {
          ...payroll.salaryStructure.allowances,
          ...(updateData.salaryStructure.allowances || {})
        },
        deductions: {
          ...payroll.salaryStructure.deductions,
          ...(updateData.salaryStructure.deductions || {})
        }
      };
    }

    // Update bank details if provided
    if (updateData.bankDetails) {
      payroll.bankDetails = {
        ...payroll.bankDetails,
        ...updateData.bankDetails
      };
    }

    // Add to salary history
    payroll.addSalaryHistory(updatedBy, updateData.remarks || 'Salary updated');
    payroll.lastUpdatedBy = updatedBy;

    await payroll.save();

    // Populate and return
    return await Payroll.findById(payroll._id)
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'employeeId email'
        }
      })
      .populate('lastUpdatedBy', 'employeeId email');
  }

  // Get employee's salary history (Admin/HR)
  async getEmployeeSalaryHistory(employeeId) {
    // Check if employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new AppError('Invalid employee ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .select('salaryHistory')
      .populate('salaryHistory.updatedBy', 'employeeId email');

    if (!payroll) {
      throw new AppError('Payroll not found for this employee', HTTP_STATUS.NOT_FOUND);
    }

    return payroll.salaryHistory;
  }

  // Delete employee's payroll (Admin only)
  async deletePayroll(employeeId) {
    // Check if employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new AppError('Invalid employee ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
    }

    const payroll = await Payroll.findOneAndDelete({ employeeId: employee._id });

    if (!payroll) {
      throw new AppError('Payroll not found for this employee', HTTP_STATUS.NOT_FOUND);
    }

    return {
      message: 'Payroll deleted successfully',
      deletedPayroll: payroll
    };
  }

  // Get payroll summary/statistics (Admin/HR)
  async getPayrollSummary() {
    const payrolls = await Payroll.find()
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'employeeId email'
        }
      });

    const totalEmployees = payrolls.length;
    const totalMonthlySalary = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const totalAnnualSalary = totalMonthlySalary * 12;
    const averageSalary = totalEmployees > 0 ? totalMonthlySalary / totalEmployees : 0;

    // Department-wise breakdown
    const departmentWise = payrolls.reduce((acc, p) => {
      const dept = p.employeeId.jobDetails.department;
      if (!acc[dept]) {
        acc[dept] = {
          count: 0,
          totalSalary: 0,
          avgSalary: 0
        };
      }
      acc[dept].count += 1;
      acc[dept].totalSalary += p.netSalary;
      acc[dept].avgSalary = acc[dept].totalSalary / acc[dept].count;
      return acc;
    }, {});

    // Salary ranges
    const salaryRanges = {
      under25k: payrolls.filter(p => p.netSalary < 25000).length,
      '25k-50k': payrolls.filter(p => p.netSalary >= 25000 && p.netSalary < 50000).length,
      '50k-75k': payrolls.filter(p => p.netSalary >= 50000 && p.netSalary < 75000).length,
      '75k-100k': payrolls.filter(p => p.netSalary >= 75000 && p.netSalary < 100000).length,
      above100k: payrolls.filter(p => p.netSalary >= 100000).length
    };

    return {
      totalEmployees,
      totalMonthlySalary: Math.round(totalMonthlySalary * 100) / 100,
      totalAnnualSalary: Math.round(totalAnnualSalary * 100) / 100,
      averageSalary: Math.round(averageSalary * 100) / 100,
      departmentWise,
      salaryRanges,
      highestPaid: payrolls.sort((a, b) => b.netSalary - a.netSalary).slice(0, 5),
      lowestPaid: payrolls.sort((a, b) => a.netSalary - b.netSalary).slice(0, 5)
    };
  }
}

module.exports = new PayrollService();