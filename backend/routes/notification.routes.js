/**
 * Notification Routes
 * Routes for push notification management
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All notification routes require authentication
router.use(authenticate);

// FCM Token management
router.post('/fcm-token', notificationController.saveFCMToken);

// Get notifications
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

// Mark as read
router.put('/mark-read', notificationController.markAsRead);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Topic subscriptions
router.post('/subscribe-topic', notificationController.subscribeToTopic);
router.post('/unsubscribe-topic', notificationController.unsubscribeFromTopic);

// Test notification (development only)
router.post('/test', notificationController.testNotification);

module.exports = router;
