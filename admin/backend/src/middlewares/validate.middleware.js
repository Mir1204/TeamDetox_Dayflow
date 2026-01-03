const { validationErrorResponse } = require('../utils/responseHandler');

// Validation middleware using Joi schemas
const validate = (schema) => {
  return (req, res, next) => {
    // Determine what to validate (body, query, or params)
    const dataToValidate = {
      ...req.body,
      ...req.query,
      ...req.params
    };

    // Validate the request data
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert types (e.g., string to number)
    });

    if (error) {
      // Format validation errors
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return validationErrorResponse(res, errors);
    }

    // Replace request data with validated and sanitized data
    if (Object.keys(req.body).length > 0) {
      req.body = value;
    }
    if (Object.keys(req.query).length > 0) {
      req.query = value;
    }
    if (Object.keys(req.params).length > 0) {
      req.params = value;
    }

    next();
  };
};

// Validate only request body
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return validationErrorResponse(res, errors);
    }

    // IMPORTANT: Only replace body, DO NOT touch params
    req.body = value;
    next();
  };
};

// Validate only query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return validationErrorResponse(res, errors);
    }

    // IMPORTANT: Only replace query, DO NOT touch params
    req.query = value;
    next();
  };
};

// Validate only route parameters
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return validationErrorResponse(res, errors);
    }

    req.params = value;
    next();
  };
};

// Custom validation for file uploads
const validateFileUpload = (options = {}) => {
  const {
    required = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    fieldName = 'file'
  } = options;

  return (req, res, next) => {
    const file = req.file || (req.files && req.files[fieldName]);

    // Check if file is required
    if (required && !file) {
      return validationErrorResponse(res, [{
        field: fieldName,
        message: 'File is required'
      }]);
    }

    // If no file and not required, continue
    if (!file) {
      return next();
    }

    // Check file size
    if (file.size > maxSize) {
      return validationErrorResponse(res, [{
        field: fieldName,
        message: `File size must be less than ${maxSize / (1024 * 1024)}MB`
      }]);
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return validationErrorResponse(res, [{
        field: fieldName,
        message: `File type must be one of: ${allowedTypes.join(', ')}`
      }]);
    }

    next();
  };
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateFileUpload
};