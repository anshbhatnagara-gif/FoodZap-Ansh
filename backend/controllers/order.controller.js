/**
 * Order Controller
 * Handles order creation, tracking, and management
 */

const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menu.model');
const Wallet = require('../models/wallet.model');
const notificationService = require('../services/notification.service');

/**
 * Create a new order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const {
      paymentMethod,
      deliveryAddress,
      specialInstructions,
      restaurantId,
      items: directItems
    } = req.body;
    const userId = req.user.id;

    let orderItems = [];
    let restaurant = null;
    let cartTotal = 0;

    // Get items either from cart or direct order
    if (directItems && directItems.length > 0) {
      // Direct order (buy now)
      restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        });
      }

      for (const item of directItems) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({
            success: false,
            message: `Item ${menuItem?.name || 'Unknown'} is unavailable`
          });
        }

        let itemPrice = menuItem.price;
        if (item.variant?.price) itemPrice = item.variant.price;

        let addonsTotal = 0;
        if (item.addons) {
          addonsTotal = item.addons.reduce((sum, a) => sum + (a.price || 0), 0);
        }

        const totalPrice = (itemPrice + addonsTotal) * item.quantity;
        cartTotal += totalPrice;

        orderItems.push({
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity: item.quantity,
          price: itemPrice,
          variant: item.variant,
          addons: item.addons,
          specialInstructions: item.specialInstructions,
          totalPrice
        });
      }
    } else {
      // Order from cart
      const cart = await Cart.getOrCreate(userId);
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      restaurant = await Restaurant.findById(cart.restaurantId);
      
      for (const item of cart.items) {
        let itemPrice = item.price;
        if (item.variant?.price) itemPrice = item.variant.price;

        let addonsTotal = 0;
        if (item.addons) {
          addonsTotal = item.addons.reduce((sum, a) => sum + (a.price || 0), 0);
        }

        const totalPrice = (itemPrice + addonsTotal) * item.quantity;
        cartTotal += totalPrice;

        orderItems.push({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: itemPrice,
          variant: item.variant,
          addons: item.addons,
          specialInstructions: item.specialInstructions,
          totalPrice
        });
      }

      // Get coupon discount if applied
      if (cart.coupon) {
        cartTotal -= cart.coupon.discount;
      }
    }

    // Calculate pricing
    const itemsTotal = cartTotal;
    const deliveryFee = itemsTotal > 500 ? 0 : 40; // Simplified delivery fee logic
    const platformFee = 5;
    const gst = Math.round(itemsTotal * 0.05);
    const totalAmount = itemsTotal + deliveryFee + platformFee + gst;

      // Handle wallet payment
    let walletTransaction = null;
    if (paymentMethod === 'wallet') {
      const balance = await Wallet.getBalance(userId);
      
      if (parseFloat(balance) < totalAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance',
          data: {
            required: totalAmount,
            available: balance
          }
        });
      }

      // Deduct from wallet
      walletTransaction = await Wallet.deductMoney(
        userId,
        totalAmount,
        `Order payment - ${restaurant.name}`,
        'order',
        null
      );
    }

    // Create order
    const order = await Order.create({
      userId,
      restaurantId,
      items: orderItems,
      totalAmount: itemsTotal,
      discountAmount: 0,
      deliveryCharge: deliveryFee,
      taxAmount: gst,
      finalAmount: totalAmount,
      paymentMethod,
      paymentId: walletTransaction ? walletTransaction.id : null,
      deliveryAddress: {
        label: deliveryAddress.label || 'Home',
        address: deliveryAddress.address,
        landmark: deliveryAddress.landmark,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pincode,
        contactName: deliveryAddress.contactName || req.user.name,
        contactPhone: deliveryAddress.contactPhone || req.user.phone
      },
      specialInstructions
    });

    // Clear cart if ordered from cart
    if (!directItems) {
      await Cart.clear(userId);
    }

    // Note: User and Restaurant stats update - simplified for MySQL version
    // These would require separate tracking tables or columns

    // Emit socket event for real-time updates
    req.io.to(`restaurant-${restaurantId}`).emit('new-order', {
      orderId: order.orderNumber,
      restaurant: restaurant.name,
      totalAmount,
      itemCount: orderItems.length
    });

    // Send push notification
    notificationService.sendOrderStatusNotification(userId, order.id, 'confirmed', {
      orderId: order.orderNumber,
      restaurantName: restaurant.name,
      totalAmount
    }).catch(console.error);

    // Send WebSocket notification for real-time updates
    notificationService.sendWebSocketNotification(req.io, userId, 'ORDER_CONFIRMED', {
      orderId: order.orderNumber,
      restaurant: restaurant.name,
      estimatedTime: order.estimatedDeliveryTime
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        id: order._id,
        status: order.status,
        totalAmount,
        estimatedDeliveryTime: order.estimatedDeliveryTime
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's orders
 */
exports.getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name images address phone')
      .populate('deliveryPartner', 'name phone')
      .populate('items.menuItem', 'name images')
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
    next(error);
  }
};

/**
 * Get single order details
 */
exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('restaurant', 'name images address phone')
      .populate('deliveryPartner', 'name phone avatar rating')
      .populate('items.menuItem', 'name images')
      .populate('user', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track order
 */
exports.trackOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderId: id })
      .populate('restaurant', 'name address location')
      .populate('deliveryPartner', 'name phone currentLocation')
      .select('orderId status deliveryPartner deliveryAddress deliveryTracking estimatedDeliveryTime statusHistory');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get latest tracking info
    const latestTracking = order.deliveryTracking[order.deliveryTracking.length - 1];

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        status: order.status,
        restaurant: order.restaurant,
        deliveryPartner: order.deliveryPartner,
        deliveryAddress: order.deliveryAddress,
        currentLocation: latestTracking || null,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        statusHistory: order.statusHistory,
        progress: getOrderProgress(order.status)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel order
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellation = {
      reason,
      cancelledBy: 'user',
      refundStatus: order.payment.status === 'completed' ? 'pending' : 'not_applicable'
    };

    await order.save();

    // Emit cancellation event
    req.io.to(`order-${order._id}`).emit('order-cancelled', {
      orderId: order.orderId,
      reason
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { orderId: order.orderId, status: order.status }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rate order
 */
exports.rateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { foodRating, deliveryRating, comment } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId, status: 'delivered' });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not delivered'
      });
    }

    if (order.rating && order.rating.food) {
      return res.status(400).json({
        success: false,
        message: 'Order already rated'
      });
    }

    order.rating = {
      food: foodRating,
      delivery: deliveryRating,
      comment,
      ratedAt: new Date()
    };

    await order.save();

    // Update restaurant rating
    await updateRestaurantRating(order.restaurant);

    // Update delivery partner rating if applicable
    if (order.deliveryPartner && deliveryRating) {
      await User.findByIdAndUpdate(order.deliveryPartner, {
        $inc: {
          'deliveryPartner.rating.count': 1,
          'deliveryPartner.rating.average': deliveryRating
        }
      });
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder previous order
 */
exports.reorder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Add items to cart
    const cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });
    
    // Clear existing items if from different restaurant
    if (cart.activeRestaurant && cart.activeRestaurant.toString() !== order.restaurant.toString()) {
      cart.items = [];
    }

    cart.activeRestaurant = order.restaurant;

    for (const item of order.items) {
      // Check if item is still available
      const menuItem = await MenuItem.findById(item.menuItem._id);
      if (menuItem && menuItem.isAvailable) {
        cart.items.push({
          menuItem: item.menuItem._id,
          restaurant: order.restaurant,
          quantity: item.quantity,
          variant: item.variant,
          addons: item.addons,
          specialInstructions: item.specialInstructions
        });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Items added to cart',
      data: {
        itemCount: cart.items.length,
        cartId: cart._id
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function getOrderProgress(status) {
  const stages = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  const currentIndex = stages.indexOf(status);
  
  if (currentIndex === -1) return null;
  
  return {
    currentStage: status,
    totalStages: stages.length,
    completedStages: currentIndex,
    percentage: Math.round((currentIndex / (stages.length - 1)) * 100)
  };
}

async function updateRestaurantRating(restaurantId) {
  const Review = require('../models/review.model');
  const stats = await Review.aggregate([
    { $match: { restaurant: restaurantId, isActive: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating.overall' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      'rating.average': Math.round(stats[0].avgRating * 10) / 10,
      'rating.count': stats[0].totalReviews
    });
  }
}
