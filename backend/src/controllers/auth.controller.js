// controllers/auth.controller.js
const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

// @desc    Sign up a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signUp = asyncHandler(async (req, res) => {
  const result = await authService.signUp(req.body);

  return successResponse(
    res,
    HTTP_STATUS.CREATED,
    SUCCESS_MESSAGES.SIGNUP_SUCCESS,
    result
  );
});

// @desc    Sign in user
// @route   POST /api/auth/signin
// @access  Public
exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.signIn(email, password);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.SIGNIN_SUCCESS,
    result
  );
});

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const result = await authService.verifyEmail(token);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.EMAIL_VERIFIED,
    result
  );
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.resendVerification(email);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    result.message
  );
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    result.message
  );
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const result = await authService.resetPassword(token, password);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.PASSWORD_RESET,
    result
  );
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.id);

  return successResponse(
    res,
    HTTP_STATUS.OK,
    SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    result
  );
});