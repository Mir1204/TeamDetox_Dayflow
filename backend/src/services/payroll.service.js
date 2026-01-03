const Payroll = require('../models/Payroll.model');
const Employee = require('../models/Employee.model');

class PayrollService {
  // Get own salary details
  async getOwnSalary(userId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .populate('employeeId')
      .populate('lastUpdatedBy', 'employeeId email');

    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    // Return read-only salary info (hide sensitive details if needed)
    return {
      basicSalary: payroll.salaryStructure.basicSalary,
      allowances: payroll.salaryStructure.allowances,
      deductions: payroll.salaryStructure.deductions,
      grossSalary: payroll.grossSalary,
      totalDeductions: payroll.totalDeductions,
      netSalary: payroll.netSalary,
      monthlyCTC: payroll.monthlyCTC,
      annualCTC: payroll.annualCTC,
      bankDetails: payroll.bankDetails
    };
  }

  // Get own salary history
  async getOwnSalaryHistory(userId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .populate('salaryHistory.updatedBy', 'employeeId email');

    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    return payroll.salaryHistory;
  }

  // Generate salary slip
  async generateOwnSalarySlip(userId, month, year) {
    const employee = await Employee.findOne({ userId })
      .populate('userId', 'employeeId email');

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id });

    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    // Generate salary slip
    return {
      employee: {
        employeeId: employee.userId.employeeId,
        name: employee.fullName,
        designation: employee.jobDetails.designation,
        department: employee.jobDetails.department,
        email: employee.userId.email
      },
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      salary: {
        basicSalary: payroll.salaryStructure.basicSalary,
        allowances: payroll.salaryStructure.allowances,
        totalAllowances: Object.values(payroll.salaryStructure.allowances).reduce((sum, val) => sum + val, 0),
        grossSalary: payroll.grossSalary,
        deductions: payroll.salaryStructure.deductions,
        totalDeductions: payroll.totalDeductions,
        netSalary: payroll.netSalary
      },
      bankDetails: payroll.bankDetails,
      generatedAt: new Date()
    };
  }

  // Get all payroll (Admin/HR)
  async getAllPayroll(filters = {}) {
    const query = {};

    if (filters.department) {
      // Need to join with Employee model
      const employees = await Employee.find({
        'jobDetails.department': filters.department
      }).select('_id');
      
      query.employeeId = { $in: employees.map(emp => emp._id) };
    }

    const payrolls = await Payroll.find(query)
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'employeeId email role'
        }
      })
      .populate('lastUpdatedBy', 'employeeId email')
      .sort({ createdAt: -1 });

    return payrolls;
  }

  // Get employee payroll (Admin/HR)
  async getEmployeePayroll(employeeId) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .populate('employeeId')
      .populate('lastUpdatedBy', 'employeeId email');

    if (!payroll) {
      throw new Error('Payroll information not found for this employee');
    }

    return payroll;
  }

  // Create payroll (Admin/HR)
  async createPayroll(employeeId, salaryData, createdByUserId) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({ employeeId: employee._id });

    if (existingPayroll) {
      throw new Error('Payroll already exists for this employee');
    }

    // Create payroll
    const payroll = await Payroll.create({
      employeeId: employee._id,
      userId: employee.userId,
      salaryStructure: salaryData.salaryStructure,
      bankDetails: salaryData.bankDetails,
      lastUpdatedBy: createdByUserId
    });

    // Add initial salary history
    payroll.addSalaryHistory(createdByUserId, 'Initial salary setup');
    await payroll.save();

    return payroll;
  }

  // Update payroll (Admin/HR)
  async updatePayroll(employeeId, updateData, updatedByUserId) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id });

    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    // Update salary structure
    if (updateData.salaryStructure) {
      Object.assign(payroll.salaryStructure, updateData.salaryStructure);
    }

    // Update bank details
    if (updateData.bankDetails) {
      Object.assign(payroll.bankDetails, updateData.bankDetails);
    }

    // Add to salary history
    payroll.addSalaryHistory(updatedByUserId, updateData.remarks || 'Salary updated');
    payroll.lastUpdatedBy = updatedByUserId;

    await payroll.save();

    return payroll;
  }

  // Get employee salary history (Admin/HR)
  async getEmployeeSalaryHistory(employeeId) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const payroll = await Payroll.findOne({ employeeId: employee._id })
      .populate('salaryHistory.updatedBy', 'employeeId email');

    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    return payroll.salaryHistory;
  }

  // Delete payroll (Admin)
  async deletePayroll(employeeId) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const payroll = await Payroll.findOneAndDelete({ employeeId: employee._id });

    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    return { message: 'Payroll deleted successfully' };
  }

  // Get payroll summary (Admin/HR)
  async getPayrollSummary() {
    const summary = await Payroll.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalMonthlySalary: { $sum: '$netSalary' },
          averageSalary: { $avg: '$netSalary' },
          highestSalary: { $max: '$netSalary' },
          lowestSalary: { $min: '$netSalary' }
        }
      }
    ]);

    // Get department-wise salary
    const departmentSummary = await Payroll.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $group: {
          _id: '$employee.jobDetails.department',
          employeeCount: { $sum: 1 },
          totalSalary: { $sum: '$netSalary' },
          averageSalary: { $avg: '$netSalary' }
        }
      }
    ]);

    return {
      overall: summary.length > 0 ? summary[0] : {},
      byDepartment: departmentSummary
    };
  }
}

module.exports = new PayrollService();