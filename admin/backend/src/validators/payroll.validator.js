const Joi = require('joi');

// Payroll create validation (FOR CREATE ENDPOINT)
const validatePayrollCreate = Joi.object({
  employeeId: Joi.string()
    .trim()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required',
      'string.pattern.base': 'Invalid employee ID format. Must be a valid MongoDB ObjectId (24 hex characters)'
    }),
    
  salaryStructure: Joi.object({
    basicSalary: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.base': 'Basic salary must be a number',
        'number.min': 'Basic salary cannot be negative',
        'any.required': 'Basic salary is required'
      }),
    
    allowances: Joi.object({
      hra: Joi.number().min(0).default(0).messages({
        'number.base': 'HRA must be a number',
        'number.min': 'HRA cannot be negative'
      }),
      da: Joi.number().min(0).default(0).messages({
        'number.base': 'DA must be a number',
        'number.min': 'DA cannot be negative'
      }),
      ta: Joi.number().min(0).default(0).messages({
        'number.base': 'TA must be a number',
        'number.min': 'TA cannot be negative'
      }),
      medical: Joi.number().min(0).default(0).messages({
        'number.base': 'Medical allowance must be a number',
        'number.min': 'Medical allowance cannot be negative'
      }),
      other: Joi.number().min(0).default(0).messages({
        'number.base': 'Other allowance must be a number',
        'number.min': 'Other allowance cannot be negative'
      })
    }).default({}),
    
    deductions: Joi.object({
      pf: Joi.number().min(0).default(0).messages({
        'number.base': 'PF must be a number',
        'number.min': 'PF cannot be negative'
      }),
      tax: Joi.number().min(0).default(0).messages({
        'number.base': 'Tax must be a number',
        'number.min': 'Tax cannot be negative'
      }),
      insurance: Joi.number().min(0).default(0).messages({
        'number.base': 'Insurance must be a number',
        'number.min': 'Insurance cannot be negative'
      }),
      other: Joi.number().min(0).default(0).messages({
        'number.base': 'Other deduction must be a number',
        'number.min': 'Other deduction cannot be negative'
      })
    }).default({})
  }).required(),
  
  bankDetails: Joi.object({
    accountHolderName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Account holder name must be at least 2 characters',
        'string.max': 'Account holder name cannot exceed 100 characters'
      }),
    
    accountNumber: Joi.string()
      .trim()
      .pattern(/^[0-9]{9,18}$/)
      .messages({
        'string.pattern.base': 'Account number must be between 9 and 18 digits'
      }),
    
    bankName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Bank name must be at least 2 characters',
        'string.max': 'Bank name cannot exceed 100 characters'
      }),
    
    ifscCode: Joi.string()
      .trim()
      .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .messages({
        'string.pattern.base': 'Invalid IFSC code format'
      }),
    
    branch: Joi.string()
      .trim()
      .max(100)
      .messages({
        'string.max': 'Branch name cannot exceed 100 characters'
      })
  }),
  
  remarks: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Remarks cannot exceed 500 characters'
    })
});

// Payroll update validation (FOR UPDATE ENDPOINT)
const validatePayrollUpdate = Joi.object({
  salaryStructure: Joi.object({
    basicSalary: Joi.number()
      .min(0)
      .messages({
        'number.base': 'Basic salary must be a number',
        'number.min': 'Basic salary cannot be negative'
      }),
    
    allowances: Joi.object({
      hra: Joi.number().min(0).default(0).messages({
        'number.base': 'HRA must be a number',
        'number.min': 'HRA cannot be negative'
      }),
      da: Joi.number().min(0).default(0).messages({
        'number.base': 'DA must be a number',
        'number.min': 'DA cannot be negative'
      }),
      ta: Joi.number().min(0).default(0).messages({
        'number.base': 'TA must be a number',
        'number.min': 'TA cannot be negative'
      }),
      medical: Joi.number().min(0).default(0).messages({
        'number.base': 'Medical allowance must be a number',
        'number.min': 'Medical allowance cannot be negative'
      }),
      other: Joi.number().min(0).default(0).messages({
        'number.base': 'Other allowance must be a number',
        'number.min': 'Other allowance cannot be negative'
      })
    }).default({}),
    
    deductions: Joi.object({
      pf: Joi.number().min(0).default(0).messages({
        'number.base': 'PF must be a number',
        'number.min': 'PF cannot be negative'
      }),
      tax: Joi.number().min(0).default(0).messages({
        'number.base': 'Tax must be a number',
        'number.min': 'Tax cannot be negative'
      }),
      insurance: Joi.number().min(0).default(0).messages({
        'number.base': 'Insurance must be a number',
        'number.min': 'Insurance cannot be negative'
      }),
      other: Joi.number().min(0).default(0).messages({
        'number.base': 'Other deduction must be a number',
        'number.min': 'Other deduction cannot be negative'
      })
    }).default({})
  }),
  
  bankDetails: Joi.object({
    accountHolderName: Joi.string().trim().min(2).max(100),
    accountNumber: Joi.string().trim().pattern(/^[0-9]{9,18}$/),
    bankName: Joi.string().trim().min(2).max(100),
    ifscCode: Joi.string().trim().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    branch: Joi.string().trim().max(100)
  }),
  
  remarks: Joi.string().trim().max(500).allow('')
});

// Payroll partial update validation
const validatePayrollPartialUpdate = Joi.object({
  salaryStructure: Joi.object({
    basicSalary: Joi.number().min(0),
    
    allowances: Joi.object({
      hra: Joi.number().min(0),
      da: Joi.number().min(0),
      ta: Joi.number().min(0),
      medical: Joi.number().min(0),
      other: Joi.number().min(0)
    }),
    
    deductions: Joi.object({
      pf: Joi.number().min(0),
      tax: Joi.number().min(0),
      insurance: Joi.number().min(0),
      other: Joi.number().min(0)
    })
  }),
  
  bankDetails: Joi.object({
    accountHolderName: Joi.string().trim().min(2).max(100),
    accountNumber: Joi.string().trim().pattern(/^[0-9]{9,18}$/),
    bankName: Joi.string().trim().min(2).max(100),
    ifscCode: Joi.string().trim().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    branch: Joi.string().trim().max(100)
  }),
  
  remarks: Joi.string().trim().max(500).allow('')
});

// Salary slip generation validation
const validateSalarySlip = Joi.object({
  month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .default(new Date().getMonth() + 1)
    .messages({
      'number.base': 'Month must be a number',
      'number.min': 'Month must be between 1 and 12',
      'number.max': 'Month must be between 1 and 12'
    }),
  
  year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear())
    .default(new Date().getFullYear())
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be 2000 or later',
      'number.max': 'Year cannot be in the future'
    })
});

// Payroll filters validation
const validatePayrollFilters = Joi.object({
  department: Joi.string()
    .trim()
    .messages({
      'string.base': 'Department must be a string'
    }),
  
  minSalary: Joi.number()
    .min(0)
    .messages({
      'number.base': 'Minimum salary must be a number',
      'number.min': 'Minimum salary cannot be negative'
    }),
  
  maxSalary: Joi.number()
    .min(Joi.ref('minSalary'))
    .messages({
      'number.base': 'Maximum salary must be a number',
      'number.min': 'Maximum salary must be greater than minimum salary'
    }),
  
  employeeId: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid employee ID format'
    })
});

module.exports = {
  validatePayrollCreate,      // NEW - Use this for CREATE endpoint
  validatePayrollUpdate,       // Use this for UPDATE endpoint
  validatePayrollPartialUpdate,
  validateSalarySlip,
  validatePayrollFilters
};