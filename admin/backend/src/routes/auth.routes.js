const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSignUp, validateSignIn } = require('../validators/auth.validator');
const { validate } = require('../middlewares/validate.middleware');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validate(validateSignUp), authController.signUp);

// @route   POST /api/auth/signin
// @desc    Login user
// @access  Public
router.post('/signin', validate(validateSignIn), authController.signIn);

// @route   GET /api/auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.get('/verify-email/:token', authController.verifyEmail);

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post('/resend-verification', authController.resendVerification);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', authController.resetPassword);

// @route   POST /api/auth/logout
// @desc    Logout user (optional - mainly client-side)
// @access  Private
router.post('/logout', authController.logout);

module.exports = router;