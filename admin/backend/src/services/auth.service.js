const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const { generateToken, generateVerificationToken } = require('../utils/tokenUtils');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

class AuthService {
  // Sign Up
  async signUp(userData) {
    const { employeeId, email, password, role, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already registered');
      }
      if (existingUser.employeeId === employeeId) {
        throw new Error('Employee ID already exists');
      }
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      employeeId,
      email,
      password,
      role: role || 'Employee',
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    // Create employee profile
    const employee = await Employee.create({
      userId: user._id,
      personalDetails: {
        firstName,
        lastName
      },
      jobDetails: {
        designation: 'Not Assigned',
        department: 'Not Assigned',
        dateOfJoining: new Date()
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return {
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      employee: {
        id: employee._id,
        fullName: employee.fullName
      }
    };
  }

  // Sign In
  async signIn(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact HR.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check email verification
    if (!user.isEmailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Get employee details
    const employee = await Employee.findOne({ userId: user._id });

    return {
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin
      },
      employee: employee ? {
        id: employee._id,
        fullName: employee.fullName,
        profilePicture: employee.profilePicture
      } : null
    };
  }

  // Verify Email
  async verifyEmail(token) {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return {
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    };
  }

  // Resend Verification Email
  async resendVerification(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return { message: 'Verification email sent successfully' };
  }

  // Forgot Password
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  // Logout (mainly for token blacklisting if implemented)
  async logout(userId) {
    // Update last activity or add token to blacklist if implementing token blacklisting
    // For now, just return success (client will remove token)
    return { message: 'Logged out successfully' };
  }
}

module.exports = new AuthService();