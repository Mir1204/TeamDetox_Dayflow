const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } = require('../utils/constants');

// Authorize user based on roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.FORBIDDEN
      );
    }

    next();
  };
};

// Check if user is Admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED
    );
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return errorResponse(
      res,
      HTTP_STATUS.FORBIDDEN,
      'Admin access required'
    );
  }

  next();
};

// Check if user is HR or Admin
const isHROrAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED
    );
  }

  if (req.user.role !== USER_ROLES.HR && req.user.role !== USER_ROLES.ADMIN) {
    return errorResponse(
      res,
      HTTP_STATUS.FORBIDDEN,
      'HR or Admin access required'
    );
  }

  next();
};

// Check if user is Employee (any authenticated user)
const isEmployee = (req, res, next) => {
  if (!req.user) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED
    );
  }

  next();
};

// Check if user owns the resource or is HR/Admin
const isOwnerOrHROrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    // Admin and HR can access any resource
    if (req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.HR) {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (!resourceUserId || resourceUserId !== req.user.id.toString()) {
      return errorResponse(
        res,
        HTTP_STATUS.FORBIDDEN,
        'You can only access your own resources'
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
  isAdmin,
  isHROrAdmin,
  isEmployee,
  isOwnerOrHROrAdmin
};