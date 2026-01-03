// User Roles
const USER_ROLES = {
  EMPLOYEE: 'Employee',
  HR: 'HR',
  ADMIN: 'Admin'
};

// Attendance Status
const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half-day',
  LEAVE: 'Leave'
};

// Leave Types
const LEAVE_TYPES = {
  PAID: 'Paid',
  SICK: 'Sick',
  UNPAID: 'Unpaid',
  CASUAL: 'Casual',
  MATERNITY: 'Maternity',
  PATERNITY: 'Paternity'
};

// Leave Status
const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

// Employment Types
const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERN: 'Intern'
};

// Gender Options
const GENDER_OPTIONS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
  PREFER_NOT_TO_SAY: 'Prefer not to say'
};

// Leave Quotas (Annual)
const LEAVE_QUOTAS = {
  [LEAVE_TYPES.PAID]: 15,
  [LEAVE_TYPES.SICK]: 10,
  [LEAVE_TYPES.CASUAL]: 7,
  [LEAVE_TYPES.MATERNITY]: 90,
  [LEAVE_TYPES.PATERNITY]: 7,
  [LEAVE_TYPES.UNPAID]: 999 // Unlimited
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  EMPLOYEE_ID_EXISTS: 'Employee ID already exists',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  ACCOUNT_DEACTIVATED: 'Account is deactivated. Please contact HR.'
};

// Success Messages
const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'User registered successfully. Please verify your email.',
  SIGNIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET: 'Password reset successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ATTENDANCE_MARKED: 'Attendance marked successfully',
  LEAVE_APPLIED: 'Leave request submitted successfully',
  LEAVE_APPROVED: 'Leave request approved successfully',
  LEAVE_REJECTED: 'Leave request rejected successfully',
  PAYROLL_CREATED: 'Payroll created successfully',
  PAYROLL_UPDATED: 'Payroll updated successfully',
  EMPLOYEE_CREATED: 'Employee created successfully',
  EMPLOYEE_UPDATED: 'Employee updated successfully',
  EMPLOYEE_DELETED: 'Employee deleted successfully'
};

// File Upload Limits
const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Token Expiry
const TOKEN_EXPIRY = {
  JWT: '7d',
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PASSWORD_RESET: 60 * 60 * 1000 // 1 hour in milliseconds
};

// Working Hours
const WORKING_HOURS = {
  FULL_DAY: 8,
  HALF_DAY: 4,
  STANDARD_START: '09:00',
  STANDARD_END: '18:00'
};

module.exports = {
  USER_ROLES,
  ATTENDANCE_STATUS,
  LEAVE_TYPES,
  LEAVE_STATUS,
  EMPLOYMENT_TYPES,
  GENDER_OPTIONS,
  LEAVE_QUOTAS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FILE_UPLOAD,
  PAGINATION,
  TOKEN_EXPIRY,
  WORKING_HOURS
};