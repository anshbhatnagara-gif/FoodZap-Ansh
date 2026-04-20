/**
 * Upload Service
 * Handles file uploads to Cloudinary
 */

const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary Storage for Multer
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `foodzap/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto' }],
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return `${file.fieldname}-${uniqueSuffix}`;
      }
    }
  });
};

// Create upload middleware for different types
const uploadToCloudinary = {
  // Profile images
  profile: multer({
    storage: createCloudinaryStorage('profiles'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }).single('profileImage'),

  // Restaurant images
  restaurant: multer({
    storage: createCloudinaryStorage('restaurants'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }).single('restaurantImage'),

  // Food item images
  food: multer({
    storage: createCloudinaryStorage('food'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }).single('foodImage'),

  // Review images (multiple)
  review: multer({
    storage: createCloudinaryStorage('reviews'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }).array('reviewImages', 5) // Max 5 images
};

// Upload buffer directly to Cloudinary (for base64 or other sources)
const uploadBuffer = async (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `foodzap/${folder}`,
        public_id: filename,
        quality: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Get optimized image URL
const getOptimizedUrl = (url, options = {}) => {
  const { width, height, crop = 'fill', quality = 'auto' } = options;
  
  if (!url) return null;
  
  // If already a Cloudinary URL, modify it
  if (url.includes('cloudinary.com')) {
    return cloudinary.url(url, {
      width,
      height,
      crop,
      quality,
      fetch_format: 'auto'
    });
  }
  
  return url;
};

module.exports = {
  uploadToCloudinary,
  uploadBuffer,
  deleteImage,
  getOptimizedUrl,
  cloudinary
};
