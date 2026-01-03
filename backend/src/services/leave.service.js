const Leave = require('../models/Leave.model');
const Employee = require('../models/Employee.model');
const Attendance = require('../models/Attendance.model');

class LeaveService {
  // Apply for leave
  async applyLeave(userId, leaveData, attachments = []) {
  const { leaveType, startDate, endDate, reason } = leaveData;

  const employee = await Employee.findOne({ userId });
  if (!employee) {
    throw new Error('Employee profile not found');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    throw new Error('End date cannot be before start date');
  }

  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const overlappingLeave = await Leave.findOne({
    employeeId: employee._id,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      {
        startDate: { $lte: end },
        endDate: { $gte: start }
      }
    ]
  });

  if (overlappingLeave) {
    throw new Error('You have already applied for leave during this period');
  }

  const leave = await Leave.create({
    employeeId: employee._id,
    userId,
    leaveType,
    startDate: start,
    endDate: end,
    reason,
    attachments,
    totalDays
  });

  return leave;
}


  // Get own leave requests
  async getOwnLeaves(userId, filters = {}) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const query = {
      employeeId: employee._id
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.leaveType) {
      query.leaveType = filters.leaveType;
    }

    const leaves = await Leave.find(query)
      .populate('reviewedBy', 'employeeId email')
      .sort({ createdAt: -1 });

    return leaves;
  }

  // Get specific leave by ID
  async getOwnLeaveById(userId, leaveId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const leave = await Leave.findOne({
      _id: leaveId,
      employeeId: employee._id
    }).populate('reviewedBy', 'employeeId email');

    if (!leave) {
      throw new Error('Leave request not found');
    }

    return leave;
  }

  // Update own leave (only if pending)
  async updateOwnLeave(userId, leaveId, updateData) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const leave = await Leave.findOne({
      _id: leaveId,
      employeeId: employee._id
    });

    if (!leave) {
      throw new Error('Leave request not found');
    }

    if (leave.status !== 'Pending') {
      throw new Error('Cannot update leave request that has been processed');
    }

    // Update leave
    Object.assign(leave, updateData);
    await leave.save();

    return leave;
  }

  // Cancel own leave (only if pending)
  async cancelOwnLeave(userId, leaveId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const leave = await Leave.findOne({
      _id: leaveId,
      employeeId: employee._id
    });

    if (!leave) {
      throw new Error('Leave request not found');
    }

    if (leave.status !== 'Pending') {
      throw new Error('Cannot cancel leave request that has been processed');
    }

    await Leave.findByIdAndDelete(leaveId);

    return { message: 'Leave request cancelled successfully' };
  }

  // Get leave balance
  async getLeaveBalance(userId, year = new Date().getFullYear()) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const leaveBalance = await Leave.getLeaveBalance(employee._id, year);

    // Define leave quotas (this can be moved to a config or database)
    const leaveQuotas = {
      Paid: 15,
      Sick: 10,
      Casual: 7,
      Maternity: 90,
      Paternity: 7,
      Unpaid: 999 // Unlimited
    };

    // Calculate remaining leaves
    const result = {};
    Object.keys(leaveQuotas).forEach(type => {
      const used = leaveBalance.find(item => item._id === type)?.totalDays || 0;
      result[type] = {
        total: leaveQuotas[type],
        used: used,
        remaining: leaveQuotas[type] === 999 ? 'Unlimited' : leaveQuotas[type] - used
      };
    });

    return result;
  }

  // Get all leave requests (Admin/HR)
  async getAllLeaves(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.leaveType) {
      query.leaveType = filters.leaveType;
    }

    if (filters.startDate && filters.endDate) {
      query.startDate = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const leaves = await Leave.find(query)
      .populate('employeeId')
      .populate('userId', 'employeeId email')
      .populate('reviewedBy', 'employeeId email')
      .sort({ createdAt: -1 });

    return leaves;
  }

  // Get pending leave requests (Admin/HR)
  async getPendingLeaves() {
    const leaves = await Leave.find({ status: 'Pending' })
      .populate('employeeId')
      .populate('userId', 'employeeId email')
      .sort({ createdAt: 1 }); // Oldest first

    return leaves;
  }

  // Get employee leaves (Admin/HR)
  async getEmployeeLeaves(employeeId, filters = {}) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const query = {
      employeeId: employee._id
    };

    if (filters.status) {
      query.status = filters.status;
    }

    const leaves = await Leave.find(query)
      .populate('reviewedBy', 'employeeId email')
      .sort({ createdAt: -1 });

    return leaves;
  }

  // Approve leave (Admin/HR)
  async approveLeave(leaveId, reviewerId, comments = '') {
    const leave = await Leave.findById(leaveId);

    if (!leave) {
        console.log('approveLeave leaveId:', leaveId);
      throw new Error('Leave request not found');
    }

    if (leave.status !== 'Pending') {
      throw new Error('Leave request has already been processed');
    }

    leave.status = 'Approved';
    leave.reviewedBy = reviewerId;
    leave.reviewedAt = new Date();
    leave.adminComments = comments;
    await leave.save();

    // Mark attendance as 'Leave' for the approved dates
    await this.markLeaveAttendance(leave);

    return leave;
  }

  // Reject leave (Admin/HR)
  async rejectLeave(leaveId, reviewerId, comments = '') {
    const leave = await Leave.findById(leaveId);

    if (!leave) {
      throw new Error('Leave request not found');
    }

    if (leave.status !== 'Pending') {
      throw new Error('Leave request has already been processed');
    }

    leave.status = 'Rejected';
    leave.reviewedBy = reviewerId;
    leave.reviewedAt = new Date();
    leave.adminComments = comments;
    await leave.save();

    return leave;
  }

  // Mark attendance as leave for approved dates
  async markLeaveAttendance(leave) {
    const dates = [];
    const currentDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create attendance records for each date
    for (const date of dates) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);

      // Check if attendance already exists
      const existingAttendance = await Attendance.findOne({
        employeeId: leave.employeeId,
        date: attendanceDate
      });

      if (!existingAttendance) {
        await Attendance.create({
          employeeId: leave.employeeId,
          userId: leave.userId,
          date: attendanceDate,
          status: 'Leave',
          remarks: `${leave.leaveType} Leave`,
          markedBy: leave.reviewedBy,
          isManualEntry: true
        });
      }
    }
  }

  // Get employee leave balance (Admin/HR)
  async getEmployeeLeaveBalance(employeeId, year = new Date().getFullYear()) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const leaveBalance = await Leave.getLeaveBalance(employee._id, year);

    const leaveQuotas = {
      Paid: 15,
      Sick: 10,
      Casual: 7,
      Maternity: 90,
      Paternity: 7,
      Unpaid: 999
    };

    const result = {};
    Object.keys(leaveQuotas).forEach(type => {
      const used = leaveBalance.find(item => item._id === type)?.totalDays || 0;
      result[type] = {
        total: leaveQuotas[type],
        used: used,
        remaining: leaveQuotas[type] === 999 ? 'Unlimited' : leaveQuotas[type] - used
      };
    });

    return result;
  }
}

module.exports = new LeaveService();