const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { validateEmployeeUpdate } = require('../validators/employee.validator');
const { validate } = require('../middlewares/validate.middleware');
const { uploadProfilePicture, uploadDocument } = require('../config/multer'); // FIXED: Import specific upload functions

// All routes require authentication
router.use(authenticate);

// @route   GET /api/employee/profile
// @desc    Get own profile
// @access  Private (Employee, HR, Admin)
router.get('/profile', employeeController.getOwnProfile);

// @route   PUT /api/employee/profile
// @desc    Update own profile (limited fields)
// @access  Private (Employee, HR, Admin)
router.put(
  '/profile',
  validate(validateEmployeeUpdate),
  employeeController.updateOwnProfile
);

// @route   PUT /api/employee/profile-picture
// @desc    Upload/Update profile picture
// @access  Private (Employee, HR, Admin)
router.put(
  '/profile-picture',
  uploadProfilePicture, // FIXED: Use the exported function
  employeeController.updateProfilePicture
);

// @route   POST /api/employee/documents
// @desc    Upload documents
// @access  Private (Employee, HR, Admin)
router.post(
  '/documents',
  uploadDocument, // FIXED: Use the exported function
  employeeController.uploadDocument
);

// @route   DELETE /api/employee/documents/:documentId
// @desc    Delete a document
// @access  Private (Employee, HR, Admin)
router.delete('/documents/:documentId', employeeController.deleteDocument);

// @route   GET /api/employee/dashboard
// @desc    Get employee dashboard data
// @access  Private (Employee, HR, Admin)
router.get('/dashboard', employeeController.getDashboard);

module.exports = router;