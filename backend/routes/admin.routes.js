/**
 * Admin Routes
 * Admin panel APIs for managing the platform
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const Order = require('../models/order.model');
const MenuItem = require('../models/menu.model');

// All admin routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);

    const stats = await Promise.all([
      // User stats
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      
      // Restaurant stats
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ status: 'pending' }),
      
      // Order stats
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      // Revenue today
      Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: stats[0],
          newToday: stats[1]
        },
        restaurants: {
          total: stats[2],
          pending: stats[3]
        },
        orders: {
          total: stats[4],
          today: stats[5]
        },
        revenue: {
          thisMonth: stats[6][0]?.total || 0,
          today: stats[7][0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user status
router.put('/users/:id', async (req, res) => {
  try {
    const { isActive, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, role },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending restaurants
router.get('/restaurants/pending', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve/Reject restaurant
router.put('/restaurants/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // If approved, update owner role
    if (status === 'approved') {
      await User.findByIdAndUpdate(restaurant.owner, { role: 'restaurant_owner' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .populate('restaurant', 'name')
      .populate('deliveryPartner', 'name')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Promise.all([
      // Orders by status
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Revenue by day
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$pricing.totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Top restaurants
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$restaurant',
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'restaurants',
            localField: '_id',
            foreignField: '_id',
            as: 'restaurant'
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        ordersByStatus: analytics[0],
        revenueByDay: analytics[1],
        topRestaurants: analytics[2]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
