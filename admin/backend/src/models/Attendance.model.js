const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-day', 'Leave'],
    required: true
  },
  checkIn: {
    type: Date,
    default: null
  },
  checkOut: {
    type: Date,
    default: null
  },
  workingHours: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    trim: true
  },
  // For tracking who marked the attendance
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isManualEntry: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Calculate working hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    this.workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
  }
  next();
});

// Static method to get attendance summary for an employee
attendanceSchema.statics.getAttendanceSummary = async function(employeeId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        employeeId: mongoose.Types.ObjectId(employeeId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Attendance', attendanceSchema);