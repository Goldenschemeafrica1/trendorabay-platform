export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const maxLimit = 100; // Maximum items per page

  if (page < 1) {
    return res.status(400).json({
      success: false,
      error: 'Page must be greater than 0'
    });
  }

  if (limit < 1) {
    return res.status(400).json({
      success: false,
      error: 'Limit must be greater than 0'
    });
  }

  if (limit > maxLimit) {
    return res.status(400).json({
      success: false,
      error: `Limit cannot exceed ${maxLimit}`
    });
  }

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };

  next();
};

export const paginateResponse = (data, total, pagination) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};
