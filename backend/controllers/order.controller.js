/**
 * Order Controller
 * Handles order creation, tracking, and management
 * MySQL Compatible Version
 */

const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menu.model');
const Wallet = require('../models/wallet.model');
const { db } = require('../config/database');
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
        orderId: order.orderNumber,
        id: order.id,
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

    // Build query with filters
    let sql = `SELECT o.*, 
      r.name as restaurantName, r.images as restaurantImages, r.address as restaurantAddress, r.phone as restaurantPhone,
      u.name as deliveryPartnerName, u.phone as deliveryPartnerPhone
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurantId = r.id
      LEFT JOIN users u ON o.deliveryPartnerId = u.id
      WHERE o.userId = ?`;
    const params = [userId];
    
    if (status) {
      sql += ` AND o.status = ?`;
      params.push(status);
    }
    
    // Get total count
    let countSql = `SELECT COUNT(*) as count FROM orders WHERE userId = ?`;
    const countParams = [userId];
    if (status) {
      countSql += ` AND status = ?`;
      countParams.push(status);
    }
    const countResult = await db.query(countSql, countParams);
    const total = countResult[0].count;
    
    // Add pagination
    sql += ` ORDER BY o.createdAt DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const orders = await db.query(sql, params);
    
    // Parse JSON fields
    const parsedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []),
      deliveryAddress: typeof order.deliveryAddress === 'string' ? JSON.parse(order.deliveryAddress) : (order.deliveryAddress || {}),
      restaurantImages: typeof order.restaurantImages === 'string' ? JSON.parse(order.restaurantImages) : (order.restaurantImages || {}),
      restaurantAddress: typeof order.restaurantAddress === 'string' ? JSON.parse(order.restaurantAddress) : (order.restaurantAddress || {})
    }));

    res.json({
      success: true,
      count: parsedOrders.length,
      total,
      data: parsedOrders
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

    // Get order with related data using SQL joins
    const sql = `SELECT o.*,
      r.name as restaurantName, r.images as restaurantImages, r.address as restaurantAddress, r.phone as restaurantPhone,
      dp.name as deliveryPartnerName, dp.phone as deliveryPartnerPhone, dp.avatar as deliveryPartnerAvatar,
      u.name as userName, u.phone as userPhone
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurantId = r.id
      LEFT JOIN users dp ON o.deliveryPartnerId = dp.id
      LEFT JOIN users u ON o.userId = u.id
      WHERE o.id = ? AND o.userId = ?`;
    
    const orders = await db.query(sql, [id, userId]);
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const order = orders[0];
    
    // Parse JSON fields
    order.items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    order.deliveryAddress = typeof order.deliveryAddress === 'string' ? JSON.parse(order.deliveryAddress) : (order.deliveryAddress || {});
    order.restaurantImages = typeof order.restaurantImages === 'string' ? JSON.parse(order.restaurantImages) : (order.restaurantImages || {});
    order.restaurantAddress = typeof order.restaurantAddress === 'string' ? JSON.parse(order.restaurantAddress) : (order.restaurantAddress || {});

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

    // Get order with related data using SQL joins
    const sql = `SELECT o.id, o.orderNumber, o.status, o.deliveryAddress, o.estimatedDeliveryTime,
      o.deliveryPartnerId, o.restaurantId,
      r.name as restaurantName, r.address as restaurantAddress,
      dp.name as deliveryPartnerName, dp.phone as deliveryPartnerPhone
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurantId = r.id
      LEFT JOIN users dp ON o.deliveryPartnerId = dp.id
      WHERE o.orderNumber = ?`;
    
    const orders = await db.query(sql, [id]);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const order = orders[0];
    order.deliveryAddress = typeof order.deliveryAddress === 'string' ? JSON.parse(order.deliveryAddress) : (order.deliveryAddress || {});
    order.restaurantAddress = typeof order.restaurantAddress === 'string' ? JSON.parse(order.restaurantAddress) : (order.restaurantAddress || {});
    
    // Get status history
    const statusHistory = await Order.getStatusHistory(order.id);

    res.json({
      success: true,
      data: {
        orderId: order.orderNumber,
        status: order.status,
        restaurant: {
          name: order.restaurantName,
          address: order.restaurantAddress
        },
        deliveryPartner: order.deliveryPartnerId ? {
          name: order.deliveryPartnerName,
          phone: order.deliveryPartnerPhone
        } : null,
        deliveryAddress: order.deliveryAddress,
        currentLocation: null, // Would need separate tracking table
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        statusHistory: statusHistory,
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

    // Get order
    const order = await Order.findById(id);

    if (!order || order.userId != userId) {
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

    // Update order status using MySQL model
    await Order.updateStatus(id, 'cancelled', `Cancelled by user: ${reason}`);
    
    // Update additional cancellation fields
    await db.query(
      `UPDATE orders SET cancelledAt = NOW(), cancellationReason = ?, cancelledBy = 'user', refundStatus = ? WHERE id = ?`,
      [reason, order.paymentStatus === 'completed' ? 'pending' : 'not_applicable', id]
    );

    // Emit cancellation event
    req.io.to(`order-${id}`).emit('order-cancelled', {
      orderId: order.orderNumber,
      reason
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { orderId: order.orderNumber, status: 'cancelled' }
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

    // Get order
    const order = await Order.findById(id);

    if (!order || order.userId != userId || order.status !== 'delivered') {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not delivered'
      });
    }

    // Check if already rated
    if (order.foodRating) {
      return res.status(400).json({
        success: false,
        message: 'Order already rated'
      });
    }

    // Update order with rating using SQL
    await db.query(
      `UPDATE orders SET foodRating = ?, deliveryRating = ?, ratingComment = ?, ratedAt = NOW() WHERE id = ?`,
      [foodRating, deliveryRating, comment, id]
    );

    // Update restaurant rating
    await updateRestaurantRating(order.restaurantId);

    // Update delivery partner rating if applicable
    if (order.deliveryPartnerId && deliveryRating) {
      await db.query(
        `UPDATE users SET ratingCount = ratingCount + 1, ratingSum = ratingSum + ? WHERE id = ?`,
        [deliveryRating, order.deliveryPartnerId]
      );
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

    // Get order
    const order = await Order.findById(id);

    if (!order || order.userId != userId) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Parse items
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    
    // Get or create cart
    let cart = await Cart.getOrCreate(userId);
    
    // Clear existing items if from different restaurant
    if (cart.restaurantId && cart.restaurantId != order.restaurantId) {
      await Cart.clear(userId);
      cart = await Cart.getOrCreate(userId);
    }

    let addedCount = 0;
    for (const item of items) {
      // Check if item is still available
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (menuItem && menuItem.isAvailable) {
        await Cart.addItem(userId, {
          menuItemId: item.menuItemId,
          restaurantId: order.restaurantId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          variant: item.variant,
          addons: item.addons,
          specialInstructions: item.specialInstructions
        });
        addedCount++;
      }
    }

    const updatedCart = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      message: 'Items added to cart',
      data: {
        itemCount: addedCount,
        cart: updatedCart
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (for restaurant/delivery partners)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Valid status transitions
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Get order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permission based on role
    if (userRole === 'restaurant' && order.restaurantId != userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update status
    await Order.updateStatus(id, status, notes || `Status updated to ${status}`);

    // Award loyalty points when order is delivered
    if (status === 'delivered') {
      const loyaltyController = require('./loyalty.controller');
      await loyaltyController.awardPointsForOrder(
        order.userId,
        order.id,
        order.finalAmount
      );
      
      // Emit delivery completion
      req.io.to(`order-${id}`).emit('order-delivered', {
        orderId: order.orderNumber,
        message: 'Your order has been delivered!'
      });
    }

    // Emit status update
    req.io.to(`order-${id}`).emit('status-change', {
      orderId: order.orderNumber,
      status,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Order status updated',
      data: { orderId: order.orderNumber, status }
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
  try {
    // Get review stats using SQL
    const stats = await db.query(
      `SELECT AVG(overallRating) as avgRating, COUNT(*) as totalReviews 
       FROM reviews WHERE restaurantId = ? AND isActive = true`,
      [restaurantId]
    );

    if (stats.length > 0 && stats[0].totalReviews > 0) {
      const avgRating = Math.round(stats[0].avgRating * 10) / 10;
      await db.query(
        `UPDATE restaurants SET rating = ?, ratingCount = ? WHERE id = ?`,
        [avgRating, stats[0].totalReviews, restaurantId]
      );
    }
  } catch (error) {
    console.error('Error updating restaurant rating:', error);
  }
}
