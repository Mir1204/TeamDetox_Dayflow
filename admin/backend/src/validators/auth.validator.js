const Joi = require('joi');
const { USER_ROLES } = require('../utils/constants');

// Sign Up validation
const validateSignUp = Joi.object({
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
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required'
    }),
  
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .default(USER_ROLES.EMPLOYEE)
    .messages({
      'any.only': 'Invalid role'
    }),
  
  firstName: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters'
    })
});

// Sign In validation
const validateSignIn = Joi.object({
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
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Resend verification validation
const validateResendVerification = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    })
});

// Forgot password validation
const validateForgotPassword = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    })
});

// Reset password validation
const validateResetPassword = Joi.object({
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required'
    })
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateResendVerification,
  validateForgotPassword,
  validateResetPassword
};