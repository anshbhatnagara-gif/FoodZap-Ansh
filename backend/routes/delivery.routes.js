/**
 * Delivery Partner Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const Order = require('../models/order.model');
const User = require('../models/user.model');

// All delivery routes require delivery_partner role
router.use(authenticate);
router.use(authorize('delivery_partner', 'admin'));

// Get available orders for delivery
router.get('/available-orders', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    const query = {
      status: 'ready',
      deliveryPartner: null
    };

    if (lat && lng) {
      query['deliveryAddress.location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my deliveries
router.get('/my-deliveries', async (req, res) => {
  try {
    const { status } = req.query;

    const query = { deliveryPartner: req.user.id };
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['out_for_delivery', 'delivered'] };
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept order
router.post('/accept/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      status: 'ready',
      deliveryPartner: null
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order not available for pickup'
      });
    }

    order.deliveryPartner = req.user.id;
    order.status = 'out_for_delivery';
    order.outForDeliveryAt = new Date();
    order.statusHistory.push({
      status: 'out_for_delivery',
      timestamp: new Date()
    });

    await order.save();

    // Update delivery partner status
    await User.findByIdAndUpdate(req.user.id, {
      'deliveryInfo.isAvailable': false
    });

    // Emit to customer
    req.io.to(`order-${order._id}`).emit('delivery-assigned', {
      orderId: order.orderId,
      deliveryPartner: req.user
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update delivery location
router.post('/location/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { lat, lng } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      deliveryPartner: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Add to tracking
    order.deliveryTracking.push({
      location: { latitude: lat, longitude: lng },
      timestamp: new Date()
    });

    await order.save();

    // Update driver's current location
    await User.findByIdAndUpdate(req.user.id, {
      'deliveryInfo.currentLocation.coordinates': [lng, lat]
    });

    // Emit to customer
    req.io.to(`order-${order._id}`).emit('location-update', {
      latitude: lat,
      longitude: lng,
      timestamp: new Date()
    });

    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark order as delivered
router.post('/deliver/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryCode } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      deliveryPartner: req.user.id,
      status: 'out_for_delivery'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.statusHistory.push({
      status: 'delivered',
      timestamp: new Date()
    });

    await order.save();

    // Update delivery partner stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'deliveryInfo.completedDeliveries': 1,
        'deliveryInfo.earnings.total': Math.round(order.pricing.totalAmount * 0.1),
        'deliveryInfo.earnings.today': Math.round(order.pricing.totalAmount * 0.1)
      },
      'deliveryInfo.isAvailable': true
    });

    // Emit to customer
    req.io.to(`order-${order._id}`).emit('order-delivered', {
      orderId: order.orderId,
      deliveredAt: order.deliveredAt
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get earnings dashboard
router.get('/earnings', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('deliveryInfo.earnings deliveryInfo.completedDeliveries');

    // Get today's deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDeliveries = await Order.countDocuments({
      deliveryPartner: req.user.id,
      deliveredAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        earnings: user.deliveryInfo.earnings,
        completedDeliveries: user.deliveryInfo.completedDeliveries,
        todayDeliveries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
