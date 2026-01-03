const Joi = require('joi');
const { GENDER_OPTIONS, EMPLOYMENT_TYPES } = require('../utils/constants');

// Employee update validation (limited fields for employees)
const validateEmployeeUpdate = Joi.object({
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      'string.pattern.base': 'Phone number must be between 10 and 15 digits'
    }),
  
  address: Joi.object({
    street: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
    state: Joi.string().trim().allow(''),
    country: Joi.string().trim().allow(''),
    zipCode: Joi.string().trim().allow('')
  }),
  
  emergencyContact: Joi.object({
    name: Joi.string().trim().allow(''),
    relationship: Joi.string().trim().allow(''),
    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,15}$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Emergency contact phone must be between 10 and 15 digits'
      })
  })
});

// Employee create validation (Admin/HR)
const validateEmployeeCreate = Joi.object({
  employeeId: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(20)
    .messages({
      'string.empty': 'Employee ID is required',
      'string.min': 'Employee ID must be at least 3 characters',
      'string.max': 'Employee ID cannot exceed 20 characters'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .required()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters'
    }),
  
  role: Joi.string()
    .valid('Employee', 'HR', 'Admin')
    .default('Employee'),
  
  personalDetails: Joi.object({
    firstName: Joi.string()
      .trim()
      .required()
      .min(2)
      .max(50)
      .messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters'
      }),
    
    lastName: Joi.string()
      .trim()
      .required()
      .min(2)
      .max(50)
      .messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters'
      }),
    
    dateOfBirth: Joi.date()
      .max('now')
      .messages({
        'date.max': 'Date of birth cannot be in the future'
      }),
    
    gender: Joi.string()
      .valid(...Object.values(GENDER_OPTIONS)),
    
    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,15}$/),
    
    address: Joi.object({
      street: Joi.string().trim().allow(''),
      city: Joi.string().trim().allow(''),
      state: Joi.string().trim().allow(''),
      country: Joi.string().trim().allow(''),
      zipCode: Joi.string().trim().allow('')
    }),
    
    emergencyContact: Joi.object({
      name: Joi.string().trim().allow(''),
      relationship: Joi.string().trim().allow(''),
      phone: Joi.string().trim().allow('')
    })
  }).required(),
  
  jobDetails: Joi.object({
    designation: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Designation is required'
      }),
    
    department: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Department is required'
      }),
    
    dateOfJoining: Joi.date()
      .required()
      .messages({
        'date.base': 'Date of joining is required'
      }),
    
    employmentType: Joi.string()
      .valid(...Object.values(EMPLOYMENT_TYPES))
      .default('Full-time'),
    
    workLocation: Joi.string().trim().allow(''),
    
    reportingManager: Joi.string()
      .trim()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Invalid reporting manager ID'
      })
  }).required()
});

// Full employee update validation (Admin/HR)
const validateEmployeeFullUpdate = Joi.object({
  personalDetails: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    dateOfBirth: Joi.date().max('now'),
    gender: Joi.string().valid(...Object.values(GENDER_OPTIONS)),
    phone: Joi.string().trim().pattern(/^[0-9]{10,15}$/),
    address: Joi.object({
      street: Joi.string().trim().allow(''),
      city: Joi.string().trim().allow(''),
      state: Joi.string().trim().allow(''),
      country: Joi.string().trim().allow(''),
      zipCode: Joi.string().trim().allow('')
    }),
    emergencyContact: Joi.object({
      name: Joi.string().trim().allow(''),
      relationship: Joi.string().trim().allow(''),
      phone: Joi.string().trim().allow('')
    })
  }),
  
  jobDetails: Joi.object({
    designation: Joi.string().trim(),
    department: Joi.string().trim(),
    dateOfJoining: Joi.date(),
    employmentType: Joi.string().valid(...Object.values(EMPLOYMENT_TYPES)),
    workLocation: Joi.string().trim().allow(''),
    reportingManager: Joi.string()
      .trim()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
  })
});

// Update role validation
const validateRoleUpdate = Joi.object({
  role: Joi.string()
    .valid('Employee', 'HR', 'Admin')
    .required()
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Invalid role'
    })
});

module.exports = {
  validateEmployeeUpdate,
  validateEmployeeCreate,
  validateEmployeeFullUpdate,
  validateRoleUpdate
};