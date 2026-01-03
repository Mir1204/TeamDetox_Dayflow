const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Salary Structure
  salaryStructure: {
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: 0
    },
    allowances: {
      hra: { type: Number, default: 0 }, // House Rent Allowance
      da: { type: Number, default: 0 },  // Dearness Allowance
      ta: { type: Number, default: 0 },  // Travel Allowance
      medical: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    deductions: {
      pf: { type: Number, default: 0 },  // Provident Fund
      tax: { type: Number, default: 0 }, // Tax Deduction
      insurance: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  // Calculated fields
  grossSalary: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    default: 0
  },
  // Payment Details
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branch: String
  },
  // Salary History (for tracking changes)
  salaryHistory: [{
    effectiveDate: {
      type: Date,
      required: true
    },
    basicSalary: Number,
    grossSalary: Number,
    netSalary: Number,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: String,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Last updated info
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate gross, deductions, and net salary before saving
payrollSchema.pre('save', function(next) {
  const { basicSalary, allowances, deductions } = this.salaryStructure;
  
  // Calculate gross salary
  const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + (val || 0), 0);
  this.grossSalary = basicSalary + totalAllowances;
  
  // Calculate total deductions
  this.totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
  
  // Calculate net salary
  this.netSalary = this.grossSalary - this.totalDeductions;
  
  next();
});

// Method to add salary history entry
payrollSchema.methods.addSalaryHistory = function(updatedBy, remarks = '') {
  this.salaryHistory.push({
    effectiveDate: new Date(),
    basicSalary: this.salaryStructure.basicSalary,
    grossSalary: this.grossSalary,
    netSalary: this.netSalary,
    updatedBy,
    remarks
  });
};

// Virtual for monthly CTC
payrollSchema.virtual('monthlyCTC').get(function() {
  return this.grossSalary;
});

// Virtual for annual CTC
payrollSchema.virtual('annualCTC').get(function() {
  return this.grossSalary * 12;
});

payrollSchema.set('toJSON', { virtuals: true });
payrollSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payroll', payrollSchema);