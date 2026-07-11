import { body, param, query, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Common validation rules
export const validateId = [
  param('id').isInt().withMessage('ID must be an integer'),
  validate
];

export const validateEmail = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  validate
];

export const validatePassword = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  validate
];

export const validateStory = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title too long'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validate
];

export const validateMagazine = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title too long'),
  validate
];

export const validatePodcast = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title too long'),
  validate
];

export const validateContributor = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name too long'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  validate
];

export const sanitizeInput = (req, res, next) => {
  // Sanitize all string inputs to prevent XSS using DOMPurify
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] });
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};
