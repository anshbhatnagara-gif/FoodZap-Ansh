/**
 * Restaurant Controller - MySQL Version
 * Handles restaurant listing, search, and details
 */

const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menu.model');
const Review = require('../models/review.model');
const locationService = require('../services/location.service');

/**
 * Get all restaurants with filters
 */
exports.getRestaurants = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'rating',
      cuisine,
      veg,
      search,
      isOpen
    } = req.query;

    const filters = { page: parseInt(page), limit: parseInt(limit), sort };

    if (cuisine) {
      filters.cuisine = cuisine.split(',');
    }

    if (veg === 'true') {
      filters.isPureVeg = true;
    }

    if (isOpen === 'true') {
      filters.isOpen = true;
    }

    let restaurants;
    if (search) {
      restaurants = await Restaurant.search(search, parseInt(limit));
    } else {
      restaurants = await Restaurant.findAll(filters);
    }

    const total = await Restaurant.count(filters);

    res.json({
      success: true,
      count: restaurants.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      },
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single restaurant details
 */
exports.getRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get reviews summary
    const reviewsSummary = await Review.getAverageRating(id);

    const result = {
      ...restaurant,
      reviews: { avgRating: reviewsSummary.average, totalReviews: reviewsSummary.count }
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get restaurant menu
 */
exports.getMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, veg, search } = req.query;

    const filters = {};
    if (veg === 'true') filters.isVeg = true;
    if (category) filters.categoryId = category;

    let menuItems;
    if (search) {
      menuItems = await MenuItem.search(search);
    } else {
      menuItems = await MenuItem.findByRestaurant(id, filters);
    }

    // Group by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      const cat = item.categoryId || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      count: menuItems.length,
      data: groupedMenu
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get menu item details
 */
exports.getMenuItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await MenuItem.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Get related items from same restaurant
    const relatedItems = await MenuItem.findByRestaurant(item.restaurantId, { limit: 4 });

    res.json({
      success: true,
      data: {
        item,
        relatedItems: relatedItems.filter(i => i.id !== item.id).slice(0, 4)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get restaurant reviews
 */
exports.getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.findByRestaurant(id, parseInt(page), parseInt(limit));
    const ratingStats = await Review.getAverageRating(id);

    res.json({
      success: true,
      count: reviews.length,
      total: ratingStats.count,
      ratingDistribution: [],
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a review
 */
exports.addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, photos } = req.body;
    const userId = req.user.id;

    const review = await Review.create({
      userId,
      restaurantId: id,
      rating,
      comment,
      images: photos
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular restaurants
 */
exports.getPopularRestaurants = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const restaurants = await Restaurant.findAll({ limit: parseInt(limit), sort: 'rating' });

    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending/featured restaurants
 */
exports.getFeaturedRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll({ limit: 6, sort: 'rating' });

    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};
