const Joi = require('joi');
const { ATTENDANCE_STATUS } = require('../utils/constants');

// Mark attendance validation (Admin/HR)
const validateAttendance = Joi.object({
  employeeId: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Employee ID is required',
      'string.pattern.base': 'Invalid employee ID format'
    }),
  
  date: Joi.date()
    .required()
    .max('now')
    .messages({
      'date.base': 'Date is required',
      'date.max': 'Date cannot be in the future'
    }),
  
  status: Joi.string()
    .valid(...Object.values(ATTENDANCE_STATUS))
    .required()
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Invalid attendance status'
    }),
  
  checkIn: Joi.date()
    .when('status', {
      is: ATTENDANCE_STATUS.PRESENT,
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'date.base': 'Check-in must be a valid date'
    }),
  
  checkOut: Joi.date()
    .greater(Joi.ref('checkIn'))
    .when('status', {
      is: ATTENDANCE_STATUS.PRESENT,
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'date.base': 'Check-out must be a valid date',
      'date.greater': 'Check-out must be after check-in'
    }),
  
  remarks: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Remarks cannot exceed 500 characters'
    })
});

// Date range validation
const validateDateRange = Joi.object({
  startDate: Joi.date()
    .messages({
      'date.base': 'Start date must be a valid date'
    }),
  
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after or equal to start date'
    }),
  
  status: Joi.string()
    .valid(...Object.values(ATTENDANCE_STATUS))
    .messages({
      'any.only': 'Invalid attendance status'
    }),
  
  employeeId: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid employee ID format'
    })
});

// Update attendance validation
const validateAttendanceUpdate = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ATTENDANCE_STATUS))
    .messages({
      'any.only': 'Invalid attendance status'
    }),
  
  checkIn: Joi.date()
    .messages({
      'date.base': 'Check-in must be a valid date'
    }),
  
  checkOut: Joi.date()
    .greater(Joi.ref('checkIn'))
    .messages({
      'date.base': 'Check-out must be a valid date',
      'date.greater': 'Check-out must be after check-in'
    }),
  
  remarks: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Remarks cannot exceed 500 characters'
    })
});

// Attendance summary validation
const validateAttendanceSummary = Joi.object({
  year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear())
    .default(new Date().getFullYear())
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be 2000 or later',
      'number.max': 'Year cannot be in the future'
    }),
  
  month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .default(new Date().getMonth() + 1)
    .messages({
      'number.base': 'Month must be a number',
      'number.min': 'Month must be between 1 and 12',
      'number.max': 'Month must be between 1 and 12'
    })
});

module.exports = {
  validateAttendance,
  validateDateRange,
  validateAttendanceUpdate,
  validateAttendanceSummary
};