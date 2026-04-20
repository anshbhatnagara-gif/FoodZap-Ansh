/**
 * Grocery Routes
 * Routes for Instamart-style grocery shopping
 */

const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menu.model');
const { optionalAuth } = require('../middleware/auth.middleware');

// Get grocery categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'fruits', name: 'Fruits & Vegetables', icon: '🍎' },
      { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
      { id: 'bakery', name: 'Bakery', icon: '🥐' },
      { id: 'beverages', name: 'Beverages', icon: '🥤' },
      { id: 'snacks', name: 'Snacks', icon: '🍿' },
      { id: 'pantry', name: 'Pantry', icon: '🥫' },
      { id: 'household', name: 'Household', icon: '🧹' },
      { id: 'personal', name: 'Personal Care', icon: '🧴' },
      { id: 'baby', name: 'Baby Care', icon: '🍼' },
      { id: 'pet', name: 'Pet Supplies', icon: '🐾' }
    ];

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get grocery products
router.get('/products', optionalAuth, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const query = { 
      itemType: 'grocery',
      isAvailable: true,
      'stock.isInStock': true 
    };

    if (category) {
      query.category = new RegExp(category, 'i');
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await MenuItem.find(query)
      .sort({ isBestseller: -1, orderCount: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await MenuItem.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get trending grocery items
router.get('/trending', async (req, res) => {
  try {
    const products = await MenuItem.find({ 
      itemType: 'grocery',
      isAvailable: true,
      'stock.isInStock': true 
    })
    .sort({ orderCount: -1 })
    .limit(10);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get offers
router.get('/offers', async (req, res) => {
  try {
    const offers = [
      {
        id: 1,
        title: 'Buy 1 Get 1 Free',
        description: 'On selected snacks',
        image: 'bogo.png',
        color: '#ff6b6b'
      },
      {
        id: 2,
        title: '30% OFF',
        description: 'On first grocery order',
        code: 'GROCERY30',
        color: '#4ecdc4'
      },
      {
        id: 3,
        title: 'Free Delivery',
        description: 'On orders above ₹499',
        color: '#45b7d1'
      }
    ];

    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
