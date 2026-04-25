/**
 * Authentication Controller
 * Handles user registration, login, OTP, and Google OAuth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, password } = req.body;

    // Check if user exists
    let userExists = await User.findByEmail(email);
    if (!userExists) {
      userExists = await User.findByPhone(phone);
    }
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, phone, password } = req.body;

    // Check if user exists (by email or phone)
    let user = null;
    if (email) {
      user = await User.findByEmail(email);
    } else if (phone) {
      user = await User.findByPhone(phone);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    await User.updateById(user.id, { lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth Login/Register
exports.googleAuth = async (req, res, next) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication data required'
      });
    }

    // Check if user exists with this googleId (simplified for MySQL)
    let user = await User.findByEmail(email);

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      await User.updateById(user.id, { googleId });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// Send OTP
exports.sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Update or create user with OTP (simplified for MySQL)
    let user = await User.findByPhone(phone);
    if (user) {
      await User.updateById(user.id, { otpCode: otp, otpExpiresAt: expiresAt });
    } else {
      user = await User.create({ phone, otpCode: otp, otpExpiresAt: expiresAt });
    }

    // For development, return OTP in response
    return res.json({
      success: true,
      message: 'OTP sent successfully (SMS not configured - check console)',
      otp,
      expiresAt
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP are required'
      });
    }

    const user = await User.findByPhone(phone);

    if (!user || !user.otpCode) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found'
      });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    if (user.otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Clear OTP and mark verified
    await User.updateById(user.id, { otpCode: null, otpExpiresAt: null, isPhoneVerified: true });

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isNewUser: !user.email || !user.name || user.name === 'User'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, dateOfBirth, gender } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;

    const user = await User.updateById(req.user.id, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    const hashedPassword = await User.hashPassword(newPassword);
    await User.updateById(req.user.id, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Logout (optional - mainly for client-side token removal)
exports.logout = async (req, res, next) => {
  try {
    // In a more complex system, you might blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
