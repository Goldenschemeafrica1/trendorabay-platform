import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
           process.env.CLOUDINARY_API_KEY && 
           process.env.CLOUDINARY_API_SECRET);
};

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'pitches') => {
  try {
    if (!isCloudinaryConfigured()) {
      console.warn('Cloudinary not configured. File upload will fail.');
      throw new Error('Cloudinary not configured');
    }

    // Check if file is a base64 data URI (from memory storage)
    if (file.path && file.path.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        original_filename: result.original_filename
      };
    }

    // Use cloudinary.uploader.upload with file path
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      original_filename: result.original_filename
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!isCloudinaryConfigured()) {
      console.warn('Cloudinary not configured. Cannot delete file.');
      return false;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export default cloudinary;
