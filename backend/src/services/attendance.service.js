const Attendance = require('../models/Attendance.model');
const Employee = require('../models/Employee.model');

class AttendanceService {
  // Check In
  async checkIn(userId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    if (existingAttendance) {
      if (existingAttendance.checkIn) {
        throw new Error('Already checked in today');
      }
    }

    // Create or update attendance
    const attendance = existingAttendance || new Attendance({
      employeeId: employee._id,
      userId: userId,
      date: today,
      status: 'Present',
      markedBy: userId
    });

    attendance.checkIn = new Date();
    await attendance.save();

    return attendance;
  }

  // Check Out
  async checkOut(userId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    if (!attendance) {
      throw new Error('No check-in found for today');
    }

    if (!attendance.checkIn) {
      throw new Error('Please check in first');
    }

    if (attendance.checkOut) {
      throw new Error('Already checked out today');
    }

    attendance.checkOut = new Date();
    await attendance.save();

    return attendance;
  }

  // Get own attendance
  async getOwnAttendance(userId, startDate, endDate) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const query = {
      employeeId: employee._id
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(100);

    return attendance;
  }

  // Get own attendance summary
  async getOwnAttendanceSummary(userId, year, month) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const summary = await Attendance.getAttendanceSummary(
      employee._id,
      startDate,
      endDate
    );

    // Calculate total working hours
    const totalHours = await Attendance.aggregate([
      {
        $match: {
          employeeId: employee._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$workingHours' }
        }
      }
    ]);

    return {
      summary: summary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      totalWorkingHours: totalHours.length > 0 ? totalHours[0].totalHours : 0
    };
  }

  // Get today's attendance
  async getTodayAttendance(userId) {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    return attendance;
  }

  // Get all attendance (Admin/HR)
  async getAllAttendance(startDate, endDate, filters = {}) {
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.employeeId) {
      query.employeeId = filters.employeeId;
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId')
      .populate('userId', 'employeeId email')
      .sort({ date: -1 });

    return attendance;
  }

  // Get employee attendance (Admin/HR)
  async getEmployeeAttendance(employeeId, startDate, endDate) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const query = {
      employeeId: employee._id
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 });

    return attendance;
  }

  // Mark attendance manually (Admin/HR)
  async markAttendance(attendanceData, markedByUserId) {
    const { employeeId, date, status, checkIn, checkOut, remarks } = attendanceData;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: attendanceDate
    });

    if (existingAttendance) {
      throw new Error('Attendance already marked for this date');
    }

    const attendance = await Attendance.create({
      employeeId: employee._id,
      userId: employee.userId,
      date: attendanceDate,
      status,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      remarks,
      markedBy: markedByUserId,
      isManualEntry: true
    });

    return attendance;
  }

  // Update attendance (Admin/HR)
  async updateAttendance(attendanceId, updateData) {
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    Object.assign(attendance, updateData);
    await attendance.save();

    return attendance;
  }

  // Delete attendance (Admin)
  async deleteAttendance(attendanceId) {
    const attendance = await Attendance.findByIdAndDelete(attendanceId);

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return { message: 'Attendance record deleted successfully' };
  }
}

module.exports = new AttendanceService();