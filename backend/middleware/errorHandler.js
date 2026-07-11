export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Invalid input data'
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      details: 'Invalid or missing token'
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate Entry',
      details: 'A record with this information already exists'
    });
  }

  // Generic error handler - don't leak sensitive information in production
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    details: process.env.NODE_ENV === 'development' ? `Route ${req.originalUrl} not found` : 'Resource not found'
  });
};
