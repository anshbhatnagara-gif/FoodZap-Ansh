/**
 * Predictive Service
 * Smart ETA calculation, demand forecasting, and predictive analytics
 */

const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');

class PredictiveService {
  constructor() {
    this.weights = {
      distance: 0.25,
      traffic: 0.25,
      timeOfDay: 0.15,
      weather: 0.1,
      restaurantLoad: 0.15,
      historical: 0.1
    };
  }

  /**
   * Calculate smart delivery ETA
   * Considers: distance, traffic, time of day, weather, restaurant load
   */
  async calculateETA(params) {
    try {
      const {
        restaurantId,
        userLocation,
        currentTime = new Date(),
        weather = 'clear',
        orderSize = 1
      } = params;

      // Get restaurant details
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // Calculate base distance time (assuming 20 km/h avg speed)
      const distance = this.calculateDistance(
        restaurant.address?.location?.coordinates,
        userLocation
      );
      const baseTime = (distance / 20) * 60; // minutes

      // Get all prediction factors
      const [
        trafficMultiplier,
        timeOfDayMultiplier,
        weatherMultiplier,
        restaurantLoadTime,
        historicalAdjustment
      ] = await Promise.all([
        this.getTrafficMultiplier(userLocation, currentTime),
        this.getTimeOfDayMultiplier(currentTime),
        this.getWeatherMultiplier(weather),
        this.getRestaurantLoadTime(restaurantId, currentTime),
        this.getHistoricalAdjustment(restaurantId, userLocation, currentTime)
      ]);

      // Restaurant preparation time
      const prepTime = restaurant.averagePrepTime || 15;

      // Calculate weighted ETA
      let estimatedMinutes = prepTime + baseTime;
      estimatedMinutes *= trafficMultiplier;
      estimatedMinutes *= timeOfDayMultiplier;
      estimatedMinutes *= weatherMultiplier;
      estimatedMinutes += restaurantLoadTime;
      estimatedMinutes += historicalAdjustment;

      // Add order size buffer
      if (orderSize > 5) estimatedMinutes += 5;
      if (orderSize > 10) estimatedMinutes += 10;

      // Round and create range
      const minMinutes = Math.round(estimatedMinutes * 0.9);
      const maxMinutes = Math.round(estimatedMinutes * 1.1);

      return {
        success: true,
        estimatedMinutes: {
          min: minMinutes,
          max: maxMinutes,
          avg: Math.round(estimatedMinutes)
        },
        arrivalTime: this.calculateArrivalTime(estimatedMinutes),
        factors: {
          distance: { km: Math.round(distance * 10) / 10, time: Math.round(baseTime) },
          traffic: { multiplier: trafficMultiplier, condition: this.getTrafficCondition(trafficMultiplier) },
          timeOfDay: { multiplier: timeOfDayMultiplier, period: this.getTimePeriod(currentTime) },
          weather: { multiplier: weatherMultiplier, condition: weather },
          restaurantLoad: { additionalMinutes: restaurantLoadTime },
          historical: { adjustment: historicalAdjustment }
        },
        breakdown: {
          preparation: prepTime,
          travel: Math.round(baseTime * trafficMultiplier * timeOfDayMultiplier * weatherMultiplier),
          buffer: Math.round(restaurantLoadTime + historicalAdjustment)
        }
      };
    } catch (error) {
      console.error('ETA Calculation Error:', error);
      return {
        success: false,
        estimatedMinutes: { min: 30, max: 45, avg: 37 },
        error: error.message
      };
    }
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(coords1, coords2) {
    if (!coords1 || !coords2) return 5; // Default 5km

    // Handle different coordinate formats
    let lat1, lon1, lat2, lon2;
    
    if (Array.isArray(coords1)) {
      [lon1, lat1] = coords1;
    } else {
      lat1 = coords1.lat;
      lon1 = coords1.lng;
    }

    if (Array.isArray(coords2)) {
      [lon2, lat2] = coords2;
    } else {
      lat2 = coords2.lat;
      lon2 = coords2.lng;
    }

    if (!lat1 || !lon1 || !lat2 || !lon2) return 5;

    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }

  /**
   * Get traffic multiplier based on time and location
   */
  async getTrafficMultiplier(location, time) {
    const hour = time.getHours();
    const day = time.getDay();

    // Peak hours: 8-10 AM, 12-2 PM, 6-9 PM
    const isPeakHour = (hour >= 8 && hour <= 10) ||
      (hour >= 12 && hour <= 14) ||
      (hour >= 18 && hour <= 21);

    // Weekend has less traffic
    const isWeekend = day === 0 || day === 6;

    if (isPeakHour && !isWeekend) return 1.5;
    if (isPeakHour && isWeekend) return 1.2;
    if (hour >= 22 || hour <= 6) return 0.9; // Night - less traffic

    return 1.1; // Normal
  }

  getTrafficCondition(multiplier) {
    if (multiplier >= 1.5) return 'Heavy';
    if (multiplier >= 1.2) return 'Moderate';
    if (multiplier <= 0.9) return 'Light';
    return 'Normal';
  }

  /**
   * Get time of day multiplier
   */
  getTimeOfDayMultiplier(time) {
    const hour = time.getHours();

    // Late night orders might take longer (fewer delivery partners)
    if (hour >= 23 || hour <= 5) return 1.3;

    // Lunch rush
    if (hour >= 12 && hour <= 14) return 1.2;

    // Dinner rush
    if (hour >= 19 && hour <= 21) return 1.25;

    return 1.0;
  }

  getTimePeriod(time) {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  }

  /**
   * Get weather multiplier
   */
  getWeatherMultiplier(weather) {
    const multipliers = {
      'clear': 1.0,
      'sunny': 1.0,
      'cloudy': 1.05,
      'rain': 1.3,
      'heavy-rain': 1.5,
      'thunderstorm': 1.6,
      'fog': 1.2,
      'snow': 1.8
    };
    return multipliers[weather.toLowerCase()] || 1.0;
  }

  /**
   * Get restaurant load time (how busy the restaurant is)
   */
  async getRestaurantLoadTime(restaurantId, currentTime) {
    try {
      // Count active orders in last 30 minutes
      const thirtyMinutesAgo = new Date(currentTime - 30 * 60 * 1000);

      const activeOrders = await Order.countDocuments({
        restaurant: restaurantId,
        status: { $in: ['confirmed', 'preparing'] },
        createdAt: { $gte: thirtyMinutesAgo }
      });

      // If more than 5 active orders, add delay
      if (activeOrders > 10) return 15;
      if (activeOrders > 5) return 8;
      if (activeOrders > 2) return 3;

      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get historical adjustment based on past deliveries
   */
  async getHistoricalAdjustment(restaurantId, userLocation, time) {
    try {
      // Get recent deliveries from this restaurant to similar location
      const recentDeliveries = await Order.find({
        restaurant: restaurantId,
        status: 'delivered',
        'deliveryAddress.coordinates': { $exists: true },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).limit(20);

      if (recentDeliveries.length === 0) return 0;

      // Calculate average actual delivery time
      let totalDiff = 0;
      let count = 0;

      recentDeliveries.forEach(order => {
        if (order.actualDeliveryTime && order.estimatedDeliveryTime) {
          const estimated = new Date(order.estimatedDeliveryTime).getTime();
          const actual = new Date(order.actualDeliveryTime).getTime();
          const diff = (actual - estimated) / (1000 * 60); // minutes
          totalDiff += diff;
          count++;
        }
      });

      if (count === 0) return 0;

      // Return average adjustment (positive = usually late, negative = usually early)
      return Math.round(totalDiff / count);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate arrival time
   */
  calculateArrivalTime(minutesFromNow) {
    const arrival = new Date(Date.now() + minutesFromNow * 60 * 1000);
    return {
      time: arrival.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: arrival.toISOString()
    };
  }

  /**
   * Predict demand for a restaurant (for restaurant dashboard)
   */
  async predictDemand(restaurantId, hoursAhead = 4) {
    try {
      const predictions = [];
      const now = new Date();

      // Get historical order patterns
      const historicalData = await Order.aggregate([
        {
          $match: {
            restaurant: restaurantId,
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            avgOrders: { $avg: 1 },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Generate predictions for next hours
      for (let i = 0; i < hoursAhead; i++) {
        const targetTime = new Date(now.getTime() + i * 60 * 60 * 1000);
        const hour = targetTime.getHours();
        const dayOfWeek = targetTime.getDay();

        // Find historical average for this hour
        const historical = historicalData.find(h => h._id === hour);
        const baseDemand = historical ? historical.avgOrders : 2;

        // Adjust for day of week (weekends have higher demand)
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;

        // Adjust for meal times
        const mealMultiplier = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21) ? 1.5 : 1.0;

        const predictedOrders = Math.round(baseDemand * weekendMultiplier * mealMultiplier);

        predictions.push({
          hour,
          time: targetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          predictedOrders,
          confidence: historical ? 'high' : 'medium',
          factors: {
            isWeekend: weekendMultiplier > 1,
            isMealTime: mealMultiplier > 1
          }
        });
      }

      return {
        success: true,
        predictions,
        summary: {
          peakHour: predictions.reduce((max, p) => p.predictedOrders > max.predictedOrders ? p : max, predictions[0]),
          totalPredicted: predictions.reduce((sum, p) => sum + p.predictedOrders, 0)
        }
      };
    } catch (error) {
      console.error('Demand Prediction Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get optimal ordering time suggestions
   */
  async getOptimalOrderingTimes(userId, restaurantId) {
    try {
      const now = new Date();
      const suggestions = [];

      // Get current ETA
      const user = await User.findById(userId);
      const currentETA = await this.calculateETA({
        restaurantId,
        userLocation: user?.address?.location?.coordinates,
        currentTime: now
      });

      // Try different times to find optimal slots
      const timeSlots = [0, 30, 60, 90, 120]; // Now, +30min, +60min, +90min, +2hr

      for (const minutes of timeSlots) {
        const targetTime = new Date(now.getTime() + minutes * 60 * 1000);
        const eta = await this.calculateETA({
          restaurantId,
          userLocation: user?.address?.location?.coordinates,
          currentTime: targetTime
        });

        if (eta.success) {
          const totalTime = minutes + eta.estimatedMinutes.avg;
          suggestions.push({
            orderAt: targetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            waitTime: minutes,
            deliveryTime: eta.estimatedMinutes.avg,
            totalTime,
            arrivesBy: new Date(now.getTime() + totalTime * 60 * 1000)
              .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isOptimal: false
          });
        }
      }

      // Mark the fastest option as optimal
      const fastest = suggestions.reduce((min, s) => s.totalTime < min.totalTime ? s : min, suggestions[0]);
      if (fastest) fastest.isOptimal = true;

      return {
        success: true,
        currentETA: currentETA.estimatedMinutes,
        suggestions: suggestions.sort((a, b) => a.totalTime - b.totalTime),
        recommendation: fastest || suggestions[0]
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get delivery partner availability prediction
   */
  async getPartnerAvailabilityPrediction(area, time = new Date()) {
    try {
      const hour = time.getHours();

      // Historical data for partner availability
      const availabilityByHour = {
        0: 0.3, 1: 0.2, 2: 0.1, 3: 0.1, 4: 0.2, 5: 0.3,
        6: 0.5, 7: 0.6, 8: 0.7, 9: 0.7, 10: 0.8, 11: 0.8,
        12: 0.7, 13: 0.6, 14: 0.7, 15: 0.8, 16: 0.8, 17: 0.9,
        18: 0.9, 19: 0.8, 20: 0.7, 21: 0.6, 22: 0.5, 23: 0.4
      };

      const availability = availabilityByHour[hour] || 0.5;

      let status = 'Good';
      if (availability < 0.3) status = 'Low';
      else if (availability < 0.6) status = 'Moderate';
      else if (availability > 0.8) status = 'Excellent';

      return {
        success: true,
        hour,
        availability,
        status,
        estimatedWaitForPartner: availability < 0.5 ? '10-15 min' : '5-10 min'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PredictiveService();
