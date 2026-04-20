/**
 * File Upload Middleware
 * Uses Cloudinary if configured, otherwise local storage
 */

const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here' &&
         process.env.CLOUDINARY_API_KEY &&
         process.env.CLOUDINARY_API_SECRET;
};

// Local disk storage
const createLocalStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folder}/`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// Cloudinary storage
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `foodzap/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto' }]
    }
  });
};

// Get storage based on configuration
const getStorage = (folder) => {
  if (isCloudinaryConfigured()) {
    console.log(`Using Cloudinary storage for ${folder}`);
    return createCloudinaryStorage(folder);
  }
  console.log(`Using local storage for ${folder}`);
  return createLocalStorage(folder);
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.'), false);
  }
};

// Create multer instances for different upload types
const upload = {
  // Profile images
  profile: multer({
    storage: getStorage('profiles'),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('profileImage'),

  // Restaurant images
  restaurant: multer({
    storage: getStorage('restaurants'),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('restaurantImage'),

  // Food item images
  food: multer({
    storage: getStorage('food'),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('foodImage'),

  // Review images
  review: multer({
    storage: getStorage('reviews'),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).array('reviewImages', 5)
};

// Legacy single upload (for backward compatibility)
const uploadLegacy = multer({
  storage: getStorage('others'),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
};

module.exports = {
  upload,
  uploadLegacy,
  handleMulterError,
  isCloudinaryConfigured
};
