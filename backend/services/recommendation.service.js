/**
 * Recommendation Service
 * Advanced recommendation algorithms: Collaborative Filtering, Content-Based, Hybrid
 */

const Order = require('../models/order.model');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menu.model');

class RecommendationService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get personalized recommendations for a user
   * Hybrid approach: Collaborative + Content-based + Trending
   */
  async getPersonalizedRecommendations(userId, options = {}) {
    try {
      const { limit = 10, includeTrending = true } = options;
      
      // Get user profile and order history
      const user = await User.findById(userId);
      const orderHistory = await Order.find({ user: userId })
        .populate('restaurant', 'cuisine name')
        .populate('items.menuItem', 'name category cuisine tags')
        .sort({ createdAt: -1 })
        .limit(20);

      // Run all recommendation strategies in parallel
      const [
        collaborativeRecs,
        contentBasedRecs,
        trendingRecs,
        frequentlyBoughtTogether
      ] = await Promise.all([
        this.getCollaborativeRecommendations(userId, orderHistory, limit),
        this.getContentBasedRecommendations(user, orderHistory, limit),
        includeTrending ? this.getTrendingItems(limit) : [],
        this.getFrequentlyBoughtTogether(userId, limit)
      ]);

      // Merge and rank recommendations
      const merged = this.mergeRecommendations([
        { recs: collaborativeRecs, weight: 0.35 },
        { recs: contentBasedRecs, weight: 0.35 },
        { recs: trendingRecs, weight: 0.15 },
        { recs: frequentlyBoughtTogether, weight: 0.15 }
      ]);

      return {
        success: true,
        recommendations: merged.slice(0, limit),
        categories: this.categorizeRecommendations(merged),
        insights: this.generateInsights(orderHistory, user)
      };
    } catch (error) {
      console.error('Recommendation Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Collaborative Filtering: Users who ordered similar items
   */
  async getCollaborativeRecommendations(userId, orderHistory, limit = 10) {
    try {
      if (orderHistory.length === 0) return [];

      // Get items the user has ordered
      const userItems = new Set();
      orderHistory.forEach(order => {
        order.items.forEach(item => {
          if (item.menuItem) userItems.add(item.menuItem._id.toString());
        });
      });

      // Find similar users (who ordered same items)
      const similarUsers = await Order.aggregate([
        {
          $match: {
            user: { $ne: userId },
            'items.menuItem': { $in: Array.from(userItems).map(id => id) }
          }
        },
        { $group: { _id: '$user', commonItems: { $sum: 1 } } },
        { $match: { commonItems: { $gte: 2 } } },
        { $sort: { commonItems: -1 } },
        { $limit: 20 }
      ]);

      if (similarUsers.length === 0) return [];

      // Get items ordered by similar users but not by current user
      const similarUserIds = similarUsers.map(u => u._id);
      const recommendations = await Order.aggregate([
        {
          $match: {
            user: { $in: similarUserIds },
            'items.menuItem': { $nin: Array.from(userItems) }
          }
        },
        { $unwind: '$items' },
        { $match: { 'items.menuItem': { $nin: Array.from(userItems) } } },
        {
          $group: {
            _id: '$items.menuItem',
            score: { $sum: 1 },
            avgRating: { $avg: '$items.rating' }
          }
        },
        { $sort: { score: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'menuitems',
            localField: '_id',
            foreignField: '_id',
            as: 'item'
          }
        },
        { $unwind: '$item' },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'item.restaurant',
            foreignField: '_id',
            as: 'restaurant'
          }
        },
        { $unwind: { path: '$restaurant', preserveNullAndEmptyArrays: true } }
      ]);

      return recommendations.map(rec => ({
        type: 'collaborative',
        item: rec.item,
        restaurant: rec.restaurant,
        score: rec.score,
        reason: 'Ordered by customers like you',
        confidence: Math.min(rec.score / 5, 1)
      }));
    } catch (error) {
      console.error('Collaborative Filtering Error:', error);
      return [];
    }
  }

  /**
   * Content-Based Filtering: Similar to user's preferences
   */
  async getContentBasedRecommendations(user, orderHistory, limit = 10) {
    try {
      if (orderHistory.length === 0) {
        // Use user preferences if no orders
        return this.getPreferenceBasedRecommendations(user, limit);
      }

      // Analyze user's cuisine preferences
      const cuisineCounts = {};
      const categoryCounts = {};
      const restaurantCounts = {};
      const tagCounts = {};

      orderHistory.forEach(order => {
        if (order.restaurant?.cuisine) {
          order.restaurant.cuisine.forEach(c => {
            cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
          });
        }

        order.items.forEach(item => {
          if (item.menuItem) {
            const mi = item.menuItem;
            categoryCounts[mi.category] = (categoryCounts[mi.category] || 0) + 1;
            
            if (mi.cuisine) cuisineCounts[mi.cuisine] = (cuisineCounts[mi.cuisine] || 0) + 1;
            
            if (mi.tags) {
              mi.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            }
          }
        });

        if (order.restaurant?._id) {
          restaurantCounts[order.restaurant._id] = (restaurantCounts[order.restaurant._id] || 0) + 1;
        }
      });

      // Find similar items based on cuisine, category, tags
      const preferredCuisines = Object.entries(cuisineCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c]) => c);

      const preferredCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c]) => c);

      const frequentlyOrderedItemIds = orderHistory
        .flatMap(o => o.items.map(i => i.menuItem?._id?.toString()))
        .filter(Boolean);

      // Query similar items
      const similarItems = await MenuItem.find({
        _id: { $nin: frequentlyOrderedItemIds },
        $or: [
          { cuisine: { $in: preferredCuisines } },
          { category: { $in: preferredCategories } },
          { tags: { $in: Object.keys(tagCounts) } }
        ],
        isAvailable: true
      })
        .populate('restaurant', 'name rating deliveryTime images')
        .limit(limit * 2);

      // Calculate similarity score for each item
      return similarItems.map(item => {
        let score = 0;
        let reasons = [];

        if (preferredCuisines.includes(item.cuisine)) {
          score += 0.4;
          reasons.push(`You enjoy ${item.cuisine} food`);
        }

        if (preferredCategories.includes(item.category)) {
          score += 0.3;
          reasons.push(`Similar to items you ordered`);
        }

        const tagMatches = item.tags?.filter(t => tagCounts[t]) || [];
        if (tagMatches.length > 0) {
          score += 0.2 * tagMatches.length;
        }

        // Favorite restaurant bonus
        if (restaurantCounts[item.restaurant?._id]) {
          score += 0.2;
          reasons.push(`From ${item.restaurant.name} - one of your favorites`);
        }

        return {
          type: 'content-based',
          item,
          restaurant: item.restaurant,
          score: Math.min(score, 1),
          reason: reasons[0] || 'Based on your preferences',
          confidence: score
        };
      })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Content-Based Error:', error);
      return [];
    }
  }

  /**
   * Get recommendations based on user preferences only (for new users)
   */
  async getPreferenceBasedRecommendations(user, limit = 10) {
    try {
      const prefs = user.preferences || {};
      const isVeg = prefs.dietary?.isVegetarian;
      const cuisines = prefs.favoriteCuisines || [];

      const query = {
        isAvailable: true,
        ...(isVeg && { foodType: 'veg' }),
        ...(cuisines.length > 0 && { cuisine: { $in: cuisines } })
      };

      const items = await MenuItem.find(query)
        .populate('restaurant', 'name rating deliveryTime images')
        .sort({ 'ratings.average': -1 })
        .limit(limit);

      return items.map(item => ({
        type: 'preference-based',
        item,
        restaurant: item.restaurant,
        score: 0.6,
        reason: 'Matches your dietary preferences',
        confidence: 0.6
      }));
    } catch (error) {
      console.error('Preference-based Error:', error);
      return [];
    }
  }

  /**
   * Trending items across platform
   */
  async getTrendingItems(limit = 10, timeWindow = 7) {
    try {
      const since = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);

      const trending = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: since },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.menuItem',
            orderCount: { $sum: 1 },
            uniqueUsers: { $addToSet: '$user' }
          }
        },
        { $match: { orderCount: { $gte: 3 } } },
        {
          $addFields: {
            uniqueUserCount: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { orderCount: -1, uniqueUserCount: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'menuitems',
            localField: '_id',
            foreignField: '_id',
            as: 'item'
          }
        },
        { $unwind: '$item' },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'item.restaurant',
            foreignField: '_id',
            as: 'restaurant'
          }
        },
        { $unwind: { path: '$restaurant', preserveNullAndEmptyArrays: true } }
      ]);

      return trending.map(t => ({
        type: 'trending',
        item: t.item,
        restaurant: t.restaurant,
        score: t.orderCount,
        reason: `${t.orderCount} orders this week`,
        confidence: 0.7,
        trending: true
      }));
    } catch (error) {
      console.error('Trending Error:', error);
      return [];
    }
  }

  /**
   * Frequently Bought Together (Market Basket Analysis)
   */
  async getFrequentlyBoughtTogether(userId, limit = 10) {
    try {
      // Get user's frequently ordered items
      const userOrders = await Order.find({ user: userId })
        .populate('items.menuItem', 'name category tags')
        .sort({ createdAt: -1 })
        .limit(10);

      if (userOrders.length === 0) return [];

      // Get user's top items
      const itemFrequency = {};
      userOrders.forEach(order => {
        order.items.forEach(item => {
          if (item.menuItem) {
            const id = item.menuItem._id.toString();
            itemFrequency[id] = (itemFrequency[id] || 0) + 1;
          }
        });
      });

      const topItems = Object.entries(itemFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => id);

      if (topItems.length === 0) return [];

      // Find items frequently ordered together with these
      const frequentlyTogether = await Order.aggregate([
        {
          $match: {
            'items.menuItem': { $in: topItems.map(id => id) },
            user: { $ne: userId }
          }
        },
        { $unwind: '$items' },
        {
          $match: {
            'items.menuItem': { $nin: topItems.map(id => id) }
          }
        },
        {
          $group: {
            _id: '$items.menuItem',
            frequency: { $sum: 1 }
          }
        },
        { $match: { frequency: { $gte: 2 } } },
        { $sort: { frequency: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'menuitems',
            localField: '_id',
            foreignField: '_id',
            as: 'item'
          }
        },
        { $unwind: '$item' },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'item.restaurant',
            foreignField: '_id',
            as: 'restaurant'
          }
        },
        { $unwind: { path: '$restaurant', preserveNullAndEmptyArrays: true } }
      ]);

      return frequentlyTogether.map(ft => ({
        type: 'frequently-bought-together',
        item: ft.item,
        restaurant: ft.restaurant,
        score: ft.frequency,
        reason: 'Frequently ordered together',
        confidence: Math.min(ft.frequency / 5, 1)
      }));
    } catch (error) {
      console.error('Frequently Bought Together Error:', error);
      return [];
    }
  }

  /**
   * Get "Order Again" suggestions
   */
  async getOrderAgainSuggestions(userId, limit = 5) {
    try {
      const orders = await Order.find({ user: userId })
        .populate('items.menuItem', 'name price image ratings')
        .populate('restaurant', 'name images')
        .sort({ createdAt: -1 })
        .limit(5);

      // Get unique items from recent orders
      const seenItems = new Set();
      const suggestions = [];

      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.menuItem && !seenItems.has(item.menuItem._id.toString())) {
            seenItems.add(item.menuItem._id.toString());
            suggestions.push({
              type: 'order-again',
              item: item.menuItem,
              restaurant: order.restaurant,
              lastOrdered: order.createdAt,
              reason: 'Order again?',
              confidence: 0.8
            });
          }
        });
      });

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('Order Again Error:', error);
      return [];
    }
  }

  /**
   * Merge recommendations with weighted scoring
   */
  mergeRecommendations(sources) {
    const itemMap = new Map();

    sources.forEach(({ recs, weight }) => {
      recs.forEach(rec => {
        const itemId = rec.item?._id?.toString() || rec.item?.id;
        if (!itemId) return;

        if (itemMap.has(itemId)) {
          const existing = itemMap.get(itemId);
          existing.finalScore += rec.score * weight;
          existing.sources.push(rec.type);
          existing.reasons.push(rec.reason);
        } else {
          itemMap.set(itemId, {
            ...rec,
            finalScore: rec.score * weight,
            sources: [rec.type],
            reasons: [rec.reason]
          });
        }
      });
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.finalScore - a.finalScore)
      .map(item => ({
        ...item,
        reason: item.reasons[0],
        allReasons: item.reasons,
        confidence: item.finalScore
      }));
  }

  /**
   * Categorize recommendations for UI display
   */
  categorizeRecommendations(recommendations) {
    return {
      forYou: recommendations.filter(r => r.type === 'content-based').slice(0, 5),
      trending: recommendations.filter(r => r.type === 'trending').slice(0, 5),
      similarUsers: recommendations.filter(r => r.type === 'collaborative').slice(0, 5),
      completeMeal: recommendations.filter(r => r.type === 'frequently-bought-together').slice(0, 3)
    };
  }

  /**
   * Generate user insights
   */
  generateInsights(orderHistory, user) {
    if (!orderHistory || orderHistory.length === 0) {
      return {
        totalOrders: 0,
        favoriteCuisines: [],
        avgOrderValue: 0,
        orderingPattern: 'New user',
        topRestaurants: []
      };
    }

    const cuisineCounts = {};
    const restaurantCounts = {};
    let totalSpent = 0;

    orderHistory.forEach(order => {
      totalSpent += order.pricing?.totalAmount || 0;

      if (order.restaurant?.cuisine) {
        order.restaurant.cuisine.forEach(c => {
          cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
        });
      }

      if (order.restaurant?._id) {
        const rId = order.restaurant._id.toString();
        restaurantCounts[rId] = {
          count: (restaurantCounts[rId]?.count || 0) + 1,
          name: order.restaurant.name
        };
      }
    });

    const favoriteCuisines = Object.entries(cuisineCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    const topRestaurants = Object.entries(restaurantCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([_, data]) => data.name);

    const avgOrderValue = Math.round(totalSpent / orderHistory.length);
    const daysSinceFirstOrder = Math.floor(
      (Date.now() - new Date(orderHistory[orderHistory.length - 1].createdAt)) / (1000 * 60 * 60 * 24)
    );

    let orderingPattern = 'Occasional';
    if (orderHistory.length > 20) orderingPattern = 'Frequent';
    if (orderHistory.length > 50) orderingPattern = 'VIP Customer';
    if (daysSinceFirstOrder > 0) {
      const ordersPerWeek = (orderHistory.length / (daysSinceFirstOrder / 7)).toFixed(1);
      if (ordersPerWeek > 2) orderingPattern = 'Regular';
    }

    return {
      totalOrders: orderHistory.length,
      favoriteCuisines,
      avgOrderValue,
      orderingPattern,
      topRestaurants,
      totalSpent: Math.round(totalSpent)
    };
  }

  /**
   * Get smart search suggestions
   */
  async getSearchSuggestions(query, userId, limit = 5) {
    try {
      const suggestions = [];

      // Search in menu items
      const items = await MenuItem.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ],
        isAvailable: true
      })
        .populate('restaurant', 'name')
        .limit(limit);

      suggestions.push(...items.map(item => ({
        type: 'dish',
        text: item.name,
        subtitle: `${item.restaurant?.name} • ${item.cuisine}`,
        item
      })));

      // Search in restaurants
      const restaurants = await Restaurant.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { cuisine: { $in: [new RegExp(query, 'i')] } }
        ]
      }).limit(limit);

      suggestions.push(...restaurants.map(r => ({
        type: 'restaurant',
        text: r.name,
        subtitle: r.cuisine?.join(', '),
        restaurant: r
      })));

      // Add user-specific suggestions if query is short
      if (query.length <= 3 && userId) {
        const userOrders = await Order.find({ user: userId })
          .populate('items.menuItem', 'name')
          .sort({ createdAt: -1 })
          .limit(3);

        userOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.menuItem) {
              suggestions.push({
                type: 'recent',
                text: item.menuItem.name,
                subtitle: 'Recently ordered',
                recent: true
              });
            }
          });
        });
      }

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('Search Suggestions Error:', error);
      return [];
    }
  }
}

module.exports = new RecommendationService();
