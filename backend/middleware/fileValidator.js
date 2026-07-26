// File magic number validation utility
// This validates files by their actual content (magic numbers) rather than just MIME type or extension

const magicNumbers = {
  // Images
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/jpg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  
  // Audio
  'audio/mpeg': [0xFF, 0xFB],
  'audio/mp3': [0xFF, 0xFB],
  
  // Video
  'video/mp4': [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70],
  
  // Documents
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/msword': [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04], // .docx (ZIP)
  'text/plain': [] // Text files don't have magic numbers, will be validated by extension
};

/**
 * Validate file by checking magic numbers (file signature)
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - Expected MIME type
 * @returns {boolean} - True if file signature matches expected type
 */
export const validateMagicNumber = (buffer, mimeType) => {
  if (!buffer || buffer.length === 0) {
    return false;
  }

  const signature = magicNumbers[mimeType];
  
  // Text files don't have magic numbers, skip validation
  if (mimeType === 'text/plain' || (signature && signature.length === 0)) {
    return true;
  }

  if (!signature) {
    return false;
  }

  // Check if buffer has enough bytes for the signature
  if (buffer.length < signature.length) {
    return false;
  }

  // Compare bytes (null in signature means skip that byte position)
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] !== null && buffer[i] !== signature[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Get actual file type from magic numbers
 * @param {Buffer} buffer - File buffer
 * @returns {string|null} - Detected MIME type or null
 */
export const getFileTypeFromMagicNumber = (buffer) => {
  if (!buffer || buffer.length === 0) {
    return null;
  }

  for (const [mimeType, signature] of Object.entries(magicNumbers)) {
    if (signature.length === 0) continue; // Skip text/plain
    
    if (buffer.length < signature.length) continue;
    
    let match = true;
    for (let i = 0; i < signature.length; i++) {
      if (signature[i] !== null && buffer[i] !== signature[i]) {
        match = false;
        break;
      }
    }
    
    if (match) {
      return mimeType;
    }
  }

  return null;
};

/**
 * Multer file filter with magic number validation
 * @param {Array<string>} allowedMimeTypes - Array of allowed MIME types
 * @returns {Function} - Multer fileFilter function
 */
export const createMagicNumberFilter = (allowedMimeTypes) => {
  return (req, file, cb) => {
    // First check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }

    // For text files, skip magic number validation
    if (file.mimetype === 'text/plain') {
      return cb(null, true);
    }

    // Validate magic numbers
    if (file.buffer) {
      const isValid = validateMagicNumber(file.buffer, file.mimetype);
      if (!isValid) {
        return cb(new Error('File content does not match the declared file type. This may indicate a spoofed file.'), false);
      }
    }

    cb(null, true);
  };
};
