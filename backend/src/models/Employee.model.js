const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Personal Details
  personalDetails: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },
  // Job Details
  jobDetails: {
    designation: {
      type: String,
      required: [true, 'Designation is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    dateOfJoining: {
      type: Date,
      required: [true, 'Date of joining is required']
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
      default: 'Full-time'
    },
    workLocation: String,
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  },
  // Profile Picture & Documents
  profilePicture: {
    type: String,
    default: null
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.personalDetails.firstName} ${this.personalDetails.lastName}`;
});

// Ensure virtuals are included in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);