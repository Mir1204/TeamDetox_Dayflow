const Joi = require('joi');
const { LEAVE_TYPES, LEAVE_STATUS } = require('../utils/constants');

// Leave request validation
const validateLeaveRequest = Joi.object({
  leaveType: Joi.string()
    .valid(...Object.values(LEAVE_TYPES))
    .required()
    .messages({
      'string.empty': 'Leave type is required',
      'any.only': 'Invalid leave type'
    }),
  
  startDate: Joi.date()
    .required()
    .min('now')
    .messages({
      'date.base': 'Start date is required',
      'date.min': 'Start date cannot be in the past'
    }),
  
  endDate: Joi.date()
    .required()
    .min(Joi.ref('startDate'))
    .messages({
      'date.base': 'End date is required',
      'date.min': 'End date must be after or equal to start date'
    }),
  
  reason: Joi.string()
    .trim()
    .required()
    .min(10)
    .max(500)
    .messages({
      'string.empty': 'Reason is required',
      'string.min': 'Reason must be at least 10 characters',
      'string.max': 'Reason cannot exceed 500 characters'
    }),
  
  attachments: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
        uploadedAt: Joi.date()
      })
    )
    .max(3)
    .messages({
      'array.max': 'Maximum 3 attachments allowed'
    })
});

// Leave update validation (for employees updating their own pending leaves)
const validateLeaveUpdate = Joi.object({
  leaveType: Joi.string()
    .valid(...Object.values(LEAVE_TYPES))
    .messages({
      'any.only': 'Invalid leave type'
    }),
  
  startDate: Joi.date()
    .min('now')
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.min': 'Start date cannot be in the past'
    }),
  
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after or equal to start date'
    }),
  
  reason: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .messages({
      'string.min': 'Reason must be at least 10 characters',
      'string.max': 'Reason cannot exceed 500 characters'
    })
});

// Leave action validation (approve/reject)
const validateLeaveAction = Joi.object({
  adminComments: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Comments cannot exceed 500 characters'
    })
});

// Leave filters validation
const validateLeaveFilters = Joi.object({
  status: Joi.string()
    .valid(...Object.values(LEAVE_STATUS))
    .messages({
      'any.only': 'Invalid leave status'
    }),
  
  leaveType: Joi.string()
    .valid(...Object.values(LEAVE_TYPES))
    .messages({
      'any.only': 'Invalid leave type'
    }),
  
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
  
  employeeId: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid employee ID format'
    })
});

// Leave balance validation
const validateLeaveBalance = Joi.object({
  year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 1)
    .default(new Date().getFullYear())
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be 2000 or later',
      'number.max': 'Year is too far in the future'
    })
});

module.exports = {
  validateLeaveRequest,
  validateLeaveUpdate,
  validateLeaveAction,
  validateLeaveFilters,
  validateLeaveBalance
};