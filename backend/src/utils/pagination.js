const { PAGINATION } = require('./constants');

// Get pagination parameters from request
const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Calculate pagination metadata
const getPaginationMetadata = (totalRecords, page, limit) => {
  const totalPages = Math.ceil(totalRecords / limit);
  
  return {
    page,
    limit,
    totalPages,
    totalRecords,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Paginate MongoDB query
const paginate = async (model, query = {}, options = {}) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    sort = { createdAt: -1 },
    populate = null,
    select = null
  } = options;

  const skip = (page - 1) * limit;

  // Build query
  let queryBuilder = model.find(query);

  // Apply population
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => queryBuilder = queryBuilder.populate(pop));
    } else {
      queryBuilder = queryBuilder.populate(populate);
    }
  }

  // Apply selection
  if (select) {
    queryBuilder = queryBuilder.select(select);
  }

  // Execute query
  const [data, totalRecords] = await Promise.all([
    queryBuilder.sort(sort).skip(skip).limit(limit).lean(),
    model.countDocuments(query)
  ]);

  // Calculate metadata
  const metadata = getPaginationMetadata(totalRecords, page, limit);

  return {
    data,
    pagination: metadata
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMetadata,
  paginate
};