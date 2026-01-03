// Success response
const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

// Error response
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

// Validation error response
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

// Pagination response
const paginationResponse = (res, statusCode, message, data, pagination) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      totalRecords: pagination.totalRecords
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  paginationResponse
};