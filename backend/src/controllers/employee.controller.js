// controllers/employee.controller.js
const employeeService = require('../services/employee.service');
const { successResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const { getFileUrl, deleteFile } = require('../config/multer');

// @desc    Get own profile
// @route   GET /api/employee/profile
// @access  Private
exports.getOwnProfile = asyncHandler(async (req, res) => {
  const profile = await employeeService.getProfileByUserId(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Profile retrieved successfully',
    profile
  );
});

// @desc    Update own profile (limited fields)
// @route   PUT /api/employee/profile
// @access  Private
exports.updateOwnProfile = asyncHandler(async (req, res) => {
  const updatedProfile = await employeeService.updateOwnProfile(
    req.user.id,
    req.body
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.PROFILE_UPDATED,
    updatedProfile
  );
});

// @desc    Upload/Update profile picture
// @route   PUT /api/employee/profile-picture
// @access  Private
exports.updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Please upload a profile picture'
    );
  }

  // Get the file URL
  const fileUrl = getFileUrl(req.file.path);

  const updatedProfile = await employeeService.updateProfilePicture(
    req.user.id,
    fileUrl
  );

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Profile picture updated successfully',
    {
      profilePicture: updatedProfile.profilePicture
    }
  );
});

// @desc    Upload documents
// @route   POST /api/employee/documents
// @access  Private
exports.uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Please upload a document'
    );
  }

  const documentData = {
    name: req.body.name || req.file.originalname,
    type: req.file.mimetype,
    url: getFileUrl(req.file.path)
  };

  const document = await employeeService.uploadDocument(
    req.user.id,
    documentData
  );

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    'Document uploaded successfully',
    document
  );
});

// @desc    Delete a document
// @route   DELETE /api/employee/documents/:documentId
// @access  Private
exports.deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  const result = await employeeService.deleteDocument(req.user.id, documentId);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    result.message
  );
});

// @desc    Get employee dashboard data
// @route   GET /api/employee/dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await employeeService.getDashboard(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    'Dashboard data retrieved successfully',
    dashboardData
  );
});