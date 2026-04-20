/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const User = require('../models/user.model');
const Order = require('../models/order.model');

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites.restaurants', 'name images rating')
      .populate('favorites.items', 'name images price');
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'avatar'];
    
    const updateData = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update dietary preferences
router.put('/preferences', async (req, res) => {
  try {
    const { dietaryPreferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { dietaryPreferences },
      { new: true }
    );

    res.json({ success: true, data: user.dietaryPreferences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get order history
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add to favorites
router.post('/favorites', async (req, res) => {
  try {
    const { type, id } = req.body; // type: 'restaurant' | 'item'
    
    const updateField = type === 'restaurant' 
      ? { $addToSet: { 'favorites.restaurants': id } }
      : { $addToSet: { 'favorites.items': id } };

    await User.findByIdAndUpdate(req.user.id, updateField);

    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove from favorites
router.delete('/favorites', async (req, res) => {
  try {
    const { type, id } = req.body;
    
    const updateField = type === 'restaurant'
      ? { $pull: { 'favorites.restaurants': id } }
      : { $pull: { 'favorites.items': id } };

    await User.findByIdAndUpdate(req.user.id, updateField);

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload avatar (Cloudinary)
router.post('/upload-avatar', upload.profile, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Get Cloudinary URL or local path
    const avatarUrl = req.file.path || req.file.secure_url || `/uploads/profiles/${req.file.filename}`;

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Avatar uploaded successfully',
      avatarUrl: user.avatar
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
