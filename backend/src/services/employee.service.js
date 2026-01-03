const Employee = require('../models/Employee.model');
const User = require('../models/User.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/Leave.model');
const Payroll = require('../models/Payroll.model');

class EmployeeService {
  // Get employee profile by user ID
  async getProfileByUserId(userId) {
    const employee = await Employee.findOne({ userId })
      .populate('userId', 'employeeId email role isEmailVerified')
      .populate('jobDetails.reportingManager');

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    return employee;
  }

  // Get employee profile by employee ID
  async getProfileByEmployeeId(employeeId) {
    const employee = await Employee.findById(employeeId)
      .populate('userId', 'employeeId email role isEmailVerified')
      .populate('jobDetails.reportingManager');

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }

  // Update employee profile (limited fields for employees)
  async updateOwnProfile(userId, updateData) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    // Only allow updating specific fields
    const allowedFields = {
      'personalDetails.phone': updateData.phone,
      'personalDetails.address': updateData.address,
      'personalDetails.emergencyContact': updateData.emergencyContact
    };

    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key];
      }
    });

    // Update employee
    Object.assign(employee, allowedFields);
    await employee.save();

    return employee;
  }

  // Update profile picture
  async updateProfilePicture(userId, filePath) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    employee.profilePicture = filePath;
    await employee.save();

    return employee;
  }

  // Upload document
  async uploadDocument(userId, documentData) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    employee.documents.push({
      name: documentData.name,
      type: documentData.type,
      url: documentData.url
    });

    await employee.save();

    return employee.documents[employee.documents.length - 1];
  }

  // Delete document
  async deleteDocument(userId, documentId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const documentIndex = employee.documents.findIndex(
      doc => doc._id.toString() === documentId
    );

    if (documentIndex === -1) {
      throw new Error('Document not found');
    }

    employee.documents.splice(documentIndex, 1);
    await employee.save();

    return { message: 'Document deleted successfully' };
  }

  // Get dashboard data for employee
  async getDashboard(userId) {
    const employee = await Employee.findOne({ userId })
      .populate('userId', 'employeeId email role');

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    // Get pending leave requests
    const pendingLeaves = await Leave.countDocuments({
      employeeId: employee._id,
      status: 'Pending'
    });

    // Get this month's attendance summary
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyAttendance = await Attendance.aggregate([
      {
        $match: {
          employeeId: employee._id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
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
    const recentLeaves = await Leave.find({
      employeeId: employee._id
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get salary info
    const payroll = await Payroll.findOne({ employeeId: employee._id });

    return {
      employee: {
        id: employee._id,
        fullName: employee.fullName,
        designation: employee.jobDetails.designation,
        department: employee.jobDetails.department,
        profilePicture: employee.profilePicture
      },
      todayAttendance: todayAttendance ? {
        status: todayAttendance.status,
        checkIn: todayAttendance.checkIn,
        checkOut: todayAttendance.checkOut,
        workingHours: todayAttendance.workingHours
      } : null,
      pendingLeaves,
      monthlyAttendance: monthlyAttendance.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentLeaves,
      salary: payroll ? {
        netSalary: payroll.netSalary,
        monthlyCTC: payroll.monthlyCTC
      } : null
    };
  }

  // Get all employees (Admin/HR)
  async getAllEmployees(filters = {}) {
    const query = {};

    if (filters.department) {
      query['jobDetails.department'] = filters.department;
    }

    if (filters.designation) {
      query['jobDetails.designation'] = filters.designation;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const employees = await Employee.find(query)
      .populate('userId', 'employeeId email role isActive')
      .sort({ createdAt: -1 });

    return employees;
  }

  // Update employee (full access for Admin/HR)
  async updateEmployee(employeeId, updateData) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Update all fields
    if (updateData.personalDetails) {
      Object.assign(employee.personalDetails, updateData.personalDetails);
    }

    if (updateData.jobDetails) {
      Object.assign(employee.jobDetails, updateData.jobDetails);
    }

    await employee.save();

    return employee;
  }

  // Delete/Deactivate employee
  async deleteEmployee(employeeId) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Deactivate instead of delete
    employee.isActive = false;
    await employee.save();

    // Also deactivate user account
    await User.findByIdAndUpdate(employee.userId, { isActive: false });

    return { message: 'Employee deactivated successfully' };
  }
}

module.exports = new EmployeeService();