/**
 * AI Controller
 * Handles AI-based food suggestions and chat
 */

const aiService = require('../services/ai.service');
const recommendationService = require('../services/recommendation.service');
const predictiveService = require('../services/predictive.service');
const User = require('../models/user.model');
const Order = require('../models/order.model');

/**
 * Get food suggestions based on mood
 */
exports.suggestByMood = async (req, res, next) => {
  try {
    const { mood, location } = req.body;
    const userId = req.user?.id;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your mood'
      });
    }

    // Get user preferences if authenticated
    let preferences = {};
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        preferences = user.dietaryPreferences || {};
      }
    }

    // Determine time of day
    const hour = new Date().getHours();
    let timeOfDay = 'breakfast';
    if (hour >= 11 && hour < 15) timeOfDay = 'lunch';
    else if (hour >= 15 && hour < 18) timeOfDay = 'snacks';
    else if (hour >= 18 && hour < 23) timeOfDay = 'dinner';
    else if (hour >= 23 || hour < 5) timeOfDay = 'late_night';

    // Get AI suggestions
    const suggestions = await aiService.suggestFoodByMood(
      mood,
      timeOfDay,
      preferences,
      location
    );

    res.json({
      success: true,
      data: {
        mood,
        timeOfDay,
        ...suggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Chat with AI assistant
 */
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    const response = await aiService.chat(message, history);

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get personalized recommendations
 */
exports.getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user preferences
    const user = await User.findById(userId);
    
    // Get recent order history
    const orders = await Order.find({ user: userId })
      .populate('items.menuItem', 'name category')
      .populate('restaurant', 'name cuisine')
      .sort({ createdAt: -1 })
      .limit(10);

    const recommendations = await aiService.getPersonalizedRecommendations(
      orders,
      user.dietaryPreferences
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending/mood-based suggestions (public endpoint)
 */
exports.getTrendingSuggestions = async (req, res, next) => {
  try {
    const { mood, veg = false } = req.query;

    const hour = new Date().getHours();
    let timeOfDay = 'evening';
    if (hour >= 5 && hour < 11) timeOfDay = 'morning';
    else if (hour >= 11 && hour < 15) timeOfDay = 'afternoon';
    else if (hour >= 15 && hour < 19) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const suggestions = await aiService.suggestFoodByMood(
      mood || 'hungry',
      timeOfDay,
      { isVeg: veg === 'true' }
    );

    res.json({
      success: true,
      data: {
        trending: suggestions.suggestions,
        mood: mood || 'general'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get menu combinations for a restaurant
 */
exports.getMenuCombinations = async (req, res, next) => {
  try {
    const MenuItem = require('../models/menu.model');
    
    const { restaurantId } = req.params;
    
    const menuItems = await MenuItem.find({ 
      restaurant: restaurantId,
      isAvailable: true 
    }).limit(30);

    if (menuItems.length === 0) {
      return res.json({
        success: true,
        data: { combinations: [] }
      });
    }

    const combinations = await aiService.getMenuCombinations(menuItems);

    res.json({
      success: true,
      data: combinations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get advanced personalized recommendations using ML algorithms
 */
exports.getSmartRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10, includeTrending = true } = req.query;

    const result = await recommendationService.getPersonalizedRecommendations(
      userId,
      { limit: parseInt(limit), includeTrending: includeTrending === 'true' }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get "Order Again" suggestions
 */
exports.getOrderAgain = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;

    const suggestions = await recommendationService.getOrderAgainSuggestions(
      userId,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get smart search suggestions
 */
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;
    const userId = req.user?.id;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await recommendationService.getSearchSuggestions(
      query,
      userId,
      5
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate smart delivery ETA
 */
exports.calculateETA = async (req, res, next) => {
  try {
    const { restaurantId, lat, lng, weather = 'clear' } = req.body;
    const userId = req.user?.id;

    if (!restaurantId || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide restaurantId and location (lat, lng)'
      });
    }

    const eta = await predictiveService.calculateETA({
      restaurantId,
      userLocation: { lat: parseFloat(lat), lng: parseFloat(lng) },
      currentTime: new Date(),
      weather
    });

    res.json(eta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get optimal ordering times
 */
exports.getOptimalTimes = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    const userId = req.user.id;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide restaurantId'
      });
    }

    const result = await predictiveService.getOptimalOrderingTimes(
      userId,
      restaurantId
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Predict demand for restaurant (admin/restaurant owner)
 */
exports.predictDemand = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { hours = 4 } = req.query;

    const result = await predictiveService.predictDemand(
      restaurantId,
      parseInt(hours)
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};
