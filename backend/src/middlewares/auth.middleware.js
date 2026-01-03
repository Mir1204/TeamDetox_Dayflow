const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User.model');
const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

// Authenticate user using JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        error.message === 'jwt expired' ? ERROR_MESSAGES.TOKEN_EXPIRED : ERROR_MESSAGES.INVALID_TOKEN
      );
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'User no longer exists'
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      return errorResponse(
        res,
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.ACCOUNT_DEACTIVATED
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return errorResponse(
        res,
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED
      );
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Authentication failed'
    );
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuthenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);
        
        if (user && user.isActive && user.isEmailVerified) {
          req.user = {
            id: user._id,
            employeeId: user.employeeId,
            email: user.email,
            role: user.role
          };
        }
      } catch (error) {
        // Token invalid, but don't fail - just continue without user
        console.log('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate
};