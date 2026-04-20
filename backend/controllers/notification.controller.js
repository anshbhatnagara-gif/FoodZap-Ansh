/**
 * Notification Controller
 * Handles push notification subscriptions and management
 */

const notificationService = require('../services/notification.service');

/**
 * Save FCM token for push notifications
 */
exports.saveFCMToken = async (req, res, next) => {
  try {
    const { token, device } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required'
      });
    }

    const result = await notificationService.saveFCMToken(userId, token, {
      device: device || 'web',
      platform: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'web'
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's notification history
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    const notifications = await notificationService.getNotificationHistory(
      userId,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notification count
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);

    res.json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notifications as read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationIds } = req.body;

    const result = await notificationService.markAsRead(userId, notificationIds);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const User = require('../models/user.model');
    await User.findByIdAndUpdate(userId, {
      $pull: { notifications: { _id: notificationId } }
    });

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subscribe to topic
 */
exports.subscribeToTopic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required'
      });
    }

    const result = await notificationService.subscribeToTopic(userId, topic);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Unsubscribe from topic
 */
exports.unsubscribeFromTopic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required'
      });
    }

    const result = await notificationService.unsubscribeFromTopic(userId, topic);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Test push notification (for development)
 */
exports.testNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type = 'ORDER_CONFIRMED', data = {} } = req.body;

    const result = await notificationService.sendPushNotification(
      userId,
      type,
      {
        title: data.title || 'Test Notification',
        body: data.body || 'This is a test notification from FoodZap!',
        orderId: data.orderId || 'TEST123',
        ...data
      }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};
